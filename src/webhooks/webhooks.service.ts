import { Injectable } from '@nestjs/common';
import { STRIPE_WEBHOOK_SECRET } from 'src/helpers/constants';
import { CheckoutSessionService } from 'src/payments/checkout-session.service';
import { stripe } from 'src/stripe';
import { Stripe } from 'stripe';
@Injectable()
export class WebhooksService {
  constructor(
    private readonly checkoutSessionService: CheckoutSessionService,
  ) {}
  async checkPaymentStatus(stripeSignature: string, payload: Buffer) {
    const event = stripe.webhooks.constructEvent(
      payload,
      stripeSignature,
      STRIPE_WEBHOOK_SECRET,
    );
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.checkoutSessionService.updateByStripeId(session.id, {
        status: session.status,
      });
    }
  }
}
