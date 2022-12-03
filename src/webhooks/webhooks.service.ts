import { Injectable } from '@nestjs/common';
import { STRIPE_WEBHOOK_SECRET } from 'src/common/helpers/constants';
import { CheckoutSessionService } from 'src/payments/checkout-session.service';
import { stripe } from 'src/common/stripe';
import { Stripe } from 'stripe';
import { UsersService } from 'src/auth/users.service';
import { MoviesService } from 'src/movies/movies.service';
@Injectable()
export class WebhooksService {
  constructor(
    private readonly checkoutSessionService: CheckoutSessionService,
    private readonly usersService: UsersService,
    private readonly moviesService: MoviesService,
  ) {}
  async fulfillMoviesPayment(stripeSignature: string, payload: Buffer) {
    const event = stripe.webhooks.constructEvent(
      payload,
      stripeSignature,
      STRIPE_WEBHOOK_SECRET,
    );
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const checkoutSession =
        await this.checkoutSessionService.updateByStripeId(session.id, {
          status: session.status,
        });
      const user = await this.usersService.findOneByEmail(
        session.customer_details.email,
      );
      for (const movieDto of checkoutSession.movies) {
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
}
