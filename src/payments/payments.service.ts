import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { WEB_URL } from 'src/helpers/constants';
import { MoviesService } from 'src/movies/movies.service';
import { stripe } from 'src/stripe';

import { CreateCheckoutSession } from './dto/create-checkout-session.input';
import {
  CheckoutSession,
  CheckoutSessionDocument,
} from './entities/checkoutSession.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(CheckoutSession.name)
    private checkoutSessionModel: Model<CheckoutSessionDocument>,
    private moviesService: MoviesService,
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
      success_url: `${WEB_URL}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${WEB_URL}?canceled=true`,
    });
    const createdCheckoutSession = await this.checkoutSessionModel.create({
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

    const checkoutSession = await createdCheckoutSession.save();
    for (const { movieId } of products) {
      await this.moviesService.addCheckoutToMovie(movieId, checkoutSession);
    }
    return checkoutSession;
  }
}
