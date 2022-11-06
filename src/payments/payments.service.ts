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
        };
      }),
    );

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${WEB_URL}?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${WEB_URL}?canceled=true`,
    });
    const createdCheckoutSession = await this.checkoutSessionModel.create({
      url: session.url,
    });

    const checkoutSession = await createdCheckoutSession.save();
    for (const { movieId } of products) {
      await this.moviesService.addCheckoutToMovie(movieId, checkoutSession);
    }
    return checkoutSession;
  }
}
