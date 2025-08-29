# Environment Variables Setup for Vercel

## Required Environment Variables

Add these environment variables in your Vercel Dashboard:

### Frontend Environment Variables

```
VITE_SUPABASE_URL
https://hfpppxddtztxzeyagwhr.supabase.co

VITE_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmcHBweGRkdHp0eHpleWFnd2hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjUwOTEsImV4cCI6MjA2NDY0MTA5MX0.OPseN5LxJ3E1-8ZTAX1ahJYJl7JMnYA-wY2UtpxVyP4

VITE_STRIPE_PUBLISHABLE_KEY
pk_live_51QZuXxGEMM6gCM8dOOzVYQOt7DVxIJAZP5gLQj7yIFP0VoAzc4YJrG7OJJnMWgklRAaD8BxfxjP5JNaLEjIVOOJ200BmrC8Hbo
```

### Backend Environment Variables

```
STRIPE_SECRET_KEY
[Add your Stripe secret key here - starts with sk_live_...]

NODE_ENV
production
```

## Setup Instructions

1. **Go to Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add each variable** with the Name and Value shown above
3. **For STRIPE_SECRET_KEY**: Get your secret key from Stripe Dashboard → API Keys
4. **Select all environments** (Production, Preview, Development)
5. **Deploy your project**

## Security Notes

- Never commit secret keys to Git repositories
- The STRIPE_SECRET_KEY should be added directly in Vercel Dashboard
- All VITE_ prefixed variables are safe for frontend use
- Keep your Stripe secret key private and secure

## How to Find Your Stripe Secret Key

1. Go to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API Keys**
3. Copy the **Secret key** (starts with `sk_live_` for live mode)
4. Add it to Vercel environment variables as `STRIPE_SECRET_KEY`

Your DataCSV platform will be fully functional once these are set!
