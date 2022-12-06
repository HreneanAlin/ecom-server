import { Injectable } from '@nestjs/common';
import { MovieToBuy } from '../interfaces/movie-to-buy.interface';
import { stripe } from 'src/common/stripe';
import { WEB_URL } from 'src/common/helpers/constants';
import { UserDocument } from 'src/auth/entities/user.entity';

@Injectable()
export class StripeService {
  async createCheckoutSession(
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

  createCustomer(user: UserDocument) {
    return stripe.customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
    });
  }

  createPaymentIntent(moviesToBuy: MovieToBuy[], stripeCustomerId: string) {
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
  private formatPaymentIntentMetada(moviesToBuy: MovieToBuy[]) {
    return moviesToBuy.reduce((acc, movie, index) => {
      acc[`${index}. quantity: ${movie.quantity}  ${movie.movie.title}`] =
        movie.movie.stripeProductId;
      return acc;
    }, {});
  }
}
