import { Injectable } from '@nestjs/common';
import { STRIPE_WEBHOOK_SECRET } from 'src/common/helpers/constants';
import { CheckoutSessionService } from 'src/payments/checkout-session.service';
import { stripe } from 'src/common/stripe';
import { Stripe } from 'stripe';
import { UsersService } from 'src/auth/users.service';
import { MoviesService } from 'src/movies/movies.service';
import { PaymentIntentRecordsService } from 'src/payments/payment-intent-records.service';
import { MovieDto } from 'src/payments/dto/movie.dto';
import { UserDocument } from 'src/auth/entities/user.entity';
@Injectable()
export class WebhooksService {
  constructor(
    private readonly checkoutSessionService: CheckoutSessionService,
    private readonly usersService: UsersService,
    private readonly moviesService: MoviesService,
    private readonly paymentIntentRecordsService: PaymentIntentRecordsService,
  ) {}
  async fulfillMoviesPayment(stripeSignature: string, payload: Buffer) {
    const event = stripe.webhooks.constructEvent(
      payload,
      stripeSignature,
      STRIPE_WEBHOOK_SECRET,
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        this.handleCompletedCheckoutSession(session);
        break;
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        this.handleSuccessfulPaymentIntent(paymentIntent);
        break;
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
