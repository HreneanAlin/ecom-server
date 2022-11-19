import { config } from 'dotenv';

config({ path: '.env.local' });

export const WEB_URL = process.env.WEB_URL || '';
export const MONGODB_URL = process.env.MONGODB_URL || '';
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || '';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';

export const TOKEN_EXPIRATION_SECONDS = 15 * 60; // 15 minutes
export const REFRESH_TOKEN_EXPIRATION_SECONDS = 60 * 60 * 24 * 7; // 7 days
