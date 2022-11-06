import { Injectable } from '@nestjs/common';
import { STRIPE_WEBHOOK_SECRET } from 'src/helpers/constants';
import { stripe } from 'src/stripe';
import { Stripe } from 'stripe';
@Injectable()
export class WebhooksService {
  async checkPaymentStatus(stripeSignature: string, payload: Buffer) {
    const event = stripe.webhooks.constructEvent(
      payload,
      stripeSignature,
      STRIPE_WEBHOOK_SECRET,
    );
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(
        '🚀 ~ file: webhooks.service.ts ~ line 15 ~ WebhooksService ~ fulfillOrder ~ session',
        session,
      );
    }
  }
}
