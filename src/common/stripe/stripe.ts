import { STRIPE_SECRET_KEY } from 'src/common/helpers/constants';
import { Stripe } from 'stripe';
export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
});
