import Stripe from 'stripe';

export interface StripeOptions {
    apiKey  : string;
    options : Stripe.StripeConfig;
}