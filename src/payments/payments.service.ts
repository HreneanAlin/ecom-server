import { Injectable } from '@nestjs/common';
import { WEB_URL } from 'src/common/helpers/constants';
import { MoviesService } from 'src/movies/movies.service';
import { stripe } from 'src/common/stripe';
import { CheckoutSessionService } from './checkout-session.service';
import { CreatePaymentInput } from './inputs/create-payment.input';
import { CheckoutSession } from './entities/checkoutSession.entity';
import { UserDocument } from 'src/auth/entities/user.entity';
import { MovieInput } from './inputs/movieInput.input';
import { MovieToBuy } from './interfaces/movie-to-buy.interface';
import Stripe from 'stripe';
import { PaymentIntentDTO } from './dto/payment-intent.dto';
import { PaymentIntentRecordsService } from './payment-intent-records.service';

@Injectable()
export class PaymentsService {
  constructor(
    private moviesService: MoviesService,
    private checkoutSessionService: CheckoutSessionService,
    private paymentIntentRecordsService: PaymentIntentRecordsService,
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
      const stripeCustomer = await this.createStripeCustomer(currentUser);
      currentUser.stripeCustomerId = stripeCustomer.id;
      currentUser.save();
      stripeCustomerId = stripeCustomer.id;
    }
    const session = await this.createSession(line_items, stripeCustomerId);
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

  private async createSession(
    moviesToBuy: MovieToBuy[],
    stripeCustomerId: string,
  ) {
    return stripe.checkout.sessions.create({
      line_items: moviesToBuy.map((item) => ({
        quantity: item.quantity,
        price: item.price,
      })),
      customer: stripeCustomerId,
      mode: 'payment',
      metadata: {
        action: 'hostedCheckout',
      },
      success_url: `${WEB_URL}/success-pay/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${WEB_URL}?canceled=true`,
    });
  }

  private async createIntent(
    moviesToBuy: MovieToBuy[],
    stripeCustomerId: string,
  ) {
    return stripe.paymentIntents.create({
      amount:
        moviesToBuy.reduce((acc, movie) => {
          return acc + movie.movie.price * movie.quantity;
        }, 0) * 100,
      currency: 'USD',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        action: 'customCheckout',
        ...this.formatPaymentIntentMetada(moviesToBuy),
      },

      customer: stripeCustomerId,
    });
  }

  private async createStripeCustomer(user: UserDocument) {
    return stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    });
  }

  private async getStripeCustomer(stripeId: string) {
    const customer = await stripe.customers.retrieve(stripeId);
    return customer as Stripe.Response<Stripe.Customer>;
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
      const stripeCustomer = await this.createStripeCustomer(user);
      user.stripeCustomerId = stripeCustomer.id;
      user.save();
      stripeCustomerId = stripeCustomer.id;
    }
    const paymentIntent = await this.createIntent(
      moviesToBuy,
      stripeCustomerId,
    );

    await this.paymentIntentRecordsService.create({
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

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  private formatPaymentIntentMetada(moviesToBuy: MovieToBuy[]) {
    return moviesToBuy.reduce((acc, movie, index) => {
      acc[`${index}. quantity: ${movie.quantity}  ${movie.movie.title}`] =
        movie.movie.stripeProductId;
      return acc;
    }, {});
  }
}
