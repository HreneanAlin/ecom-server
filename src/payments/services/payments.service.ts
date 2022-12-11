import { Injectable } from '@nestjs/common';
import { MoviesService } from 'src/movies/movies.service';
import { CheckoutSessionService } from './checkout-session.service';
import { CreatePaymentInput } from '../inputs/create-payment.input';
import { CheckoutSession } from '../entities/checkoutSession.entity';
import { UserDocument } from 'src/auth/entities/user.entity';
import { MovieInput } from '../inputs/movieInput.input';
import { MovieToBuy } from '../interfaces/movie-to-buy.interface';
import { PaymentIntentDTO } from '../dto/payment-intent.dto';
import { PaymentIntentRecordsService } from './payment-intent-records.service';
import { StripeService } from './stripe.service';

@Injectable()
export class PaymentsService {
  constructor(
    private moviesService: MoviesService,
    private checkoutSessionService: CheckoutSessionService,
    private paymentIntentRecordsService: PaymentIntentRecordsService,
    private stripeService: StripeService,
  ) {}

  async createCheckoutSession(
    { products }: CreatePaymentInput,
    currentUser: UserDocument,
  ): Promise<CheckoutSession> {
    const line_items = await this.getMoviesToBuy(products);
    let stripeCustomerId: string;
    if (currentUser.stripeCustomerId) {
      stripeCustomerId = currentUser.stripeCustomerId;
    } else {
      const stripeCustomer = await this.stripeService.createCustomer(
        currentUser,
      );
      currentUser.stripeCustomerId = stripeCustomer.id;
      currentUser.save();
      stripeCustomerId = stripeCustomer.id;
    }
    const session = await this.stripeService.createCheckoutSession(
      line_items,
      stripeCustomerId,
    );
    const checkoutSession = await this.checkoutSessionService.create({
      url: session.url,
      movies: line_items.map((item) => ({
        description: item.movie.description,
        onSale: item.movie.onSale,
        price: item.movie.price,
        title: item.movie.title,
        _id: item.movie._id,
        quantity: item.quantity,
      })),
      status: session.status,
      stripeSessionId: session.id,
    });
    currentUser.payments.push(checkoutSession);
    await currentUser.save();
    for (const { movieId } of products) {
      await this.moviesService.addCheckoutToMovie(movieId, checkoutSession);
    }
    return checkoutSession;
  }

  async createPaymentIntent(
    { products }: CreatePaymentInput,
    user: UserDocument,
  ): Promise<PaymentIntentDTO> {
    const moviesToBuy = await this.getMoviesToBuy(products);
    let stripeCustomerId: string;
    if (user.stripeCustomerId) {
      stripeCustomerId = user.stripeCustomerId;
    } else {
      const stripeCustomer = await this.stripeService.createCustomer(user);
      user.stripeCustomerId = stripeCustomer.id;
      user.save();
      stripeCustomerId = stripeCustomer.id;
    }
    const paymentIntent = await this.stripeService.createPaymentIntent(
      moviesToBuy,
      stripeCustomerId,
    );

    const paymentIntentRecord = await this.paymentIntentRecordsService.create({
      movies: moviesToBuy.map((item) => ({
        description: item.movie.description,
        onSale: item.movie.onSale,
        price: item.movie.price,
        title: item.movie.title,
        _id: item.movie._id,
        quantity: item.quantity,
      })),
      status: paymentIntent.status,
      stripeId: paymentIntent.id,
    });
    paymentIntentRecord.user = user;
    await paymentIntentRecord.save();

    user.paymentsIntent.push(paymentIntentRecord);
    await user.save();
    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  private async getMoviesToBuy(products: MovieInput[]): Promise<MovieToBuy[]> {
    return Promise.all(
      products.map(async ({ movieId, quantity }) => {
        const movie = await this.moviesService.findOne(movieId);
        return {
          price: movie.stripePriceId,
          quantity,
          movie,
        };
      }),
    );
  }
}
