import { Injectable } from '@nestjs/common';
import { CheckoutSessionService } from 'src/payments/services/checkout-session.service';
import { Stripe } from 'stripe';
import { UsersService } from 'src/auth/users.service';
import { MoviesService } from 'src/movies/movies.service';
import { PaymentIntentRecordsService } from 'src/payments/services/payment-intent-records.service';
import { MovieDto } from 'src/payments/dto/movie.dto';
import { UserDocument } from 'src/auth/entities/user.entity';
import { redisPubSub } from 'src/common/helpers/redis-pubsub';
import { StripeService } from 'src/stripe/stripe.service';
@Injectable()
export class WebhooksService {
  constructor(
    private readonly checkoutSessionService: CheckoutSessionService,
    private readonly usersService: UsersService,
    private readonly moviesService: MoviesService,
    private readonly paymentIntentRecordsService: PaymentIntentRecordsService,
    private readonly stripeService: StripeService,
  ) {}
  async fulfillMoviesPayment(stripeSignature: string, payload: Buffer) {
    const event = this.stripeService.constructEvent(payload, stripeSignature);

    if (event.type === 'payment_intent.succeeded') {
      const session = event.data.object as Stripe.PaymentIntent;
      const action = session.metadata.action as string;

      switch (action) {
        case 'customCheckout':
          const paymentIntent = event.data.object as Stripe.PaymentIntent;
          await this.handleSuccessfulPaymentIntent(paymentIntent);
          break;
        default:
          break;
      }
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.handleCompletedCheckoutSession(session);
    }
  }

  private async handleSuccessfulPaymentIntent(
    paymentIntent: Stripe.PaymentIntent,
  ) {
    const paymentIntentRecord =
      await this.paymentIntentRecordsService.updateStatusByStripeId(
        paymentIntent.id,
        { status: paymentIntent.status },
      );
    redisPubSub.publish('paymentDone', { paymentDone: paymentIntentRecord });

    const user = await this.usersService.findOneByCustomerId(
      paymentIntent.customer as string,
    );
    await this.addMoviesToUser(paymentIntentRecord.movies, user);
  }

  private async handleCompletedCheckoutSession(
    session: Stripe.Checkout.Session,
  ) {
    const checkoutSession = await this.checkoutSessionService.updateByStripeId(
      session.id,
      {
        status: session.status,
      },
    );
    const user = await this.usersService.findOneByEmail(
      session.customer_details.email,
    );

    await this.addMoviesToUser(checkoutSession.movies, user);
  }

  private async addMoviesToUser(moviesDto: MovieDto[], user: UserDocument) {
    for (const movieDto of moviesDto) {
      const existingMovie = user.movies.find((movie) =>
        movieDto._id.equals(movie.movie._id),
      );
      if (existingMovie) {
        existingMovie.quantity = existingMovie.quantity + movieDto.quantity;
      } else {
        const movie = await this.moviesService.findOne(String(movieDto._id));
        user.movies.push({ quantity: movieDto.quantity, movie });
      }
    }
    await user.save();
  }
}
