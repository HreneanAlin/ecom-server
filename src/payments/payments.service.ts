import { Injectable } from '@nestjs/common';
import { WEB_URL } from 'src/common/helpers/constants';
import { MoviesService } from 'src/movies/movies.service';
import { stripe } from 'src/common/stripe';
import { CheckoutSessionService } from './checkout-session.service';
import { CreateCheckoutSession } from './inputs/create-checkout-session.input';
import { CheckoutSession } from './entities/checkoutSession.entity';

@Injectable()
export class PaymentsService {
  constructor(
    private moviesService: MoviesService,
    private checkoutSessionService: CheckoutSessionService,
  ) {}

  async createCheckoutSession({
    products,
  }: CreateCheckoutSession): Promise<CheckoutSession> {
    const line_items = await Promise.all(
      products.map(async ({ movieId, quantity }) => {
        const movie = await this.moviesService.findOne(movieId);
        return {
          price: movie.stripePriceId,
          quantity,
          movie,
        };
      }),
    );

    const session = await stripe.checkout.sessions.create({
      line_items: line_items.map((item) => ({
        quantity: item.quantity,
        price: item.price,
      })),
      mode: 'payment',
      success_url: `${WEB_URL}/success-pay/{CHECKOUT_SESSION_ID}`,
      cancel_url: `${WEB_URL}?canceled=true`,
    });
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
    for (const { movieId } of products) {
      await this.moviesService.addCheckoutToMovie(movieId, checkoutSession);
    }
    return checkoutSession;
  }
}
