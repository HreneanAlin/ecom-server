import { config } from 'dotenv';

config({ path: '.env.local' });

export const WEB_URL = process.env.WEB_URL || '';
export const MONGODB_URL = process.env.MONGODB_URL || '';
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
