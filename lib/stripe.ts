import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_build", {
    apiVersion: '2025-12-15.clover',
    appInfo: {
        name: 'Cash App Clone',
        version: '0.1.0',
    },
    typescript: true,
});
