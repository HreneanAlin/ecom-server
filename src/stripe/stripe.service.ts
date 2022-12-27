import { Injectable } from '@nestjs/common';
import { MovieToBuy } from 'src/payments/interfaces/movie-to-buy.interface';
import { STRIPE_WEBHOOK_SECRET, WEB_URL } from 'src/common/helpers/constants';
import { UserDocument } from 'src/auth/entities/user.entity';
import { STRIPE_SECRET_KEY } from 'src/common/helpers/constants';
import { Stripe } from 'stripe';
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
});

@Injectable()
export class StripeService {
  async createPaymentCheckoutSession(
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

  createProductForSubscription(name: string, description: string) {
    return stripe.products.create({ name, description });
  }
  createProductForMovie(name: string, description: string) {
    return stripe.products.create({ name, description });
  }

  createPrice(productId: string, unit_amount: number) {
    return stripe.prices.create({
      product: productId,
      unit_amount: unit_amount * 100,
      currency: 'usd',
    });
  }

  findProduct(id: string) {
    return stripe.products.retrieve(id);
  }

  updateProduct(id: string, params: Stripe.ProductUpdateParams) {
    return stripe.products.update(id, params);
  }

  updatePrice(id: string, params: Stripe.PriceUpdateParams) {
    return stripe.prices.update(id, params);
  }

  constructEvent(payload: Buffer, stripeSignature: string) {
    return stripe.webhooks.constructEvent(
      payload,
      stripeSignature,
      STRIPE_WEBHOOK_SECRET,
    );
  }

  private formatPaymentIntentMetada(moviesToBuy: MovieToBuy[]) {
    return moviesToBuy.reduce((acc, movie, index) => {
      acc[`${index}. quantity: ${movie.quantity}  ${movie.movie.title}`] =
        movie.movie.stripeProductId;
      return acc;
    }, {});
  }
}
