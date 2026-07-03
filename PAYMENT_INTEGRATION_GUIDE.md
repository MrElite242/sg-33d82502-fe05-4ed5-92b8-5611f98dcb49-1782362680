# 💳 Payment Integration Guide - Stripe for Canna Blaze 360

## Overview
Complete guide to accepting subscription payments through Stripe with Canna Blaze 360.

---

## Step 1: Create Stripe Account

1. **Sign up for Stripe:** https://dashboard.stripe.com/register
2. **Complete account verification** (required for live payments)
3. **Get your API keys:**
   - Dashboard → Developers → API Keys
   - Copy **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - Copy **Secret Key** (starts with `sk_test_` or `sk_live_`)

---

## Step 2: Add Environment Variables

### Vercel Dashboard
Settings → Environment Variables → Add these:

```bash
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Your existing Supabase vars
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Local Development (.env.local)
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

---

## Step 3: Install Stripe SDK

```bash
npm install stripe @stripe/stripe-js
```

---

## Step 4: Create Stripe Products & Prices

### Option A: Stripe Dashboard (Manual)
1. Dashboard → Products → Add Product
2. Create products for each plan:
   - **Starter Plan** - $99/month
   - **Professional Plan** - $249/month  
   - **Enterprise Plan** - $549/month
3. Add annual pricing (20% discount):
   - Starter: $950.40/year
   - Professional: $2,390.40/year
   - Enterprise: $5,270.40/year
4. Copy the **Price ID** for each (starts with `price_...`)

### Option B: Auto-Sync via API (Recommended)
Use the `src/pages/api/stripe/sync-products.ts` endpoint (created below) to automatically sync your pricing config to Stripe.

---

## Step 5: Configure Webhooks

### Development (Local Testing)
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
4. Copy the webhook secret (starts with `whsec_`)
5. Add to `.env.local`

### Production (Vercel)
1. Stripe Dashboard → Developers → Webhooks → Add Endpoint
2. Endpoint URL: `https://cannablaze360.com/api/stripe/webhook`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy **Signing Secret**
5. Add to Vercel environment variables as `STRIPE_WEBHOOK_SECRET`

---

## Step 6: Update Database Schema

The subscription tables are already created. Verify they exist:

```sql
-- Check subscription_plans table
SELECT * FROM subscription_plans;

-- Check user_subscriptions table
SELECT * FROM user_subscriptions;
```

Add Stripe-specific columns if needed:

```sql
-- Add Stripe IDs to user_subscriptions
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;

-- Add Stripe IDs to subscription_plans
ALTER TABLE subscription_plans
ADD COLUMN IF NOT EXISTS stripe_price_id_monthly TEXT,
ADD COLUMN IF NOT EXISTS stripe_price_id_annual TEXT;
```

---

## Step 7: Payment Flow

### Customer Journey:
1. **User selects plan** → `/plans` page
2. **Click "Start Free Trial"** → Redirects to `/payment`
3. **Choose billing cycle** (monthly/annual)
4. **Click "Pay Now"** → Creates Stripe Checkout Session
5. **Complete payment** on Stripe-hosted page
6. **Stripe webhook** fires → Updates database
7. **User redirected** to `/dashboard` with active subscription

### Behind the Scenes:
```
User clicks Pay
    ↓
POST /api/stripe/create-checkout-session
    ↓
Stripe creates Checkout Session
    ↓
User redirected to Stripe payment page
    ↓
User completes payment
    ↓
Stripe sends webhook to /api/stripe/webhook
    ↓
Webhook handler updates Supabase
    ↓
User redirected to success page
```

---

## Step 8: Test the Integration

### Test Card Numbers:
- **Success:** `4242 4242 4242 4242`
- **Decline:** `4000 0000 0000 0002`
- **3D Secure:** `4000 0025 0000 3155`
- **Expiry:** Any future date (e.g., 12/34)
- **CVC:** Any 3 digits (e.g., 123)
- **ZIP:** Any 5 digits (e.g., 12345)

### Test Flow:
1. Select a plan on `/plans`
2. Go to checkout
3. Use test card `4242 4242 4242 4242`
4. Complete payment
5. Verify subscription created in Supabase
6. Check Stripe Dashboard for the payment

---

## Step 9: Go Live

### Before Launching:
- [ ] Complete Stripe account verification
- [ ] Switch to live API keys (pk_live_, sk_live_)
- [ ] Update webhook endpoint to production URL
- [ ] Test full payment flow with real card
- [ ] Set up email notifications for failed payments
- [ ] Configure subscription renewal emails
- [ ] Add tax collection if required by your jurisdiction

### Tax Handling:
Stripe Tax can automatically calculate and collect taxes. Enable it in:
- Stripe Dashboard → Settings → Tax

---

## Pricing Comparison: Stripe vs Alternatives

| Feature | Stripe | PayPal | Square |
|---------|--------|--------|--------|
| Transaction Fee | 2.9% + 30¢ | 3.49% + 49¢ | 2.9% + 30¢ |
| Recurring Billing | ✅ Native | ✅ Available | ✅ Available |
| Developer API | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Cannabis Friendly | ⚠️ Restricted* | ❌ No | ⚠️ Restricted* |

*Cannabis businesses need to apply for high-risk processing with special terms.

### Recommended for Cannabis:
1. **PaymentCloud** - Cannabis-specific processor
2. **Paybotic** - Cannabis industry specialist  
3. **ViaPay** - High-risk merchant accounts
4. **Stripe** - Apply as "Health & Wellness" or "Compliance Software"

**Important:** Cannabis payment processing requires special merchant accounts. Contact Stripe support to discuss your specific use case.

---

## Troubleshooting

### Webhook Not Firing
- Verify webhook URL is correct
- Check Stripe Dashboard → Developers → Webhooks → Event Logs
- Ensure endpoint is publicly accessible (not localhost in production)
- Verify `STRIPE_WEBHOOK_SECRET` matches

### Payment Fails
- Check Stripe Dashboard → Payments → Failed payments
- Verify API keys are correct (test vs live)
- Check webhook signature validation
- Review server logs for errors

### Subscription Not Created in Database
- Check webhook handler logs
- Verify Supabase connection
- Ensure user_subscriptions table exists
- Check RLS policies allow inserts

---

## Security Checklist

- [ ] Never expose `STRIPE_SECRET_KEY` in client code
- [ ] Always verify webhook signatures
- [ ] Use HTTPS only (enforced by Stripe)
- [ ] Validate all payment amounts server-side
- [ ] Log all payment events for auditing
- [ ] Implement rate limiting on payment endpoints
- [ ] Store minimal customer data (let Stripe handle PCI)

---

## Support Resources

- **Stripe Docs:** https://stripe.com/docs
- **Stripe Support:** https://support.stripe.com
- **Cannabis Payments:** Contact payment processor specialists
- **Test Mode:** Always test in test mode before going live

---

**Next Steps:**
1. Create Stripe account
2. Add API keys to environment variables  
3. Install Stripe package: `npm install stripe @stripe/stripe-js`
4. Deploy updated code to Vercel
5. Test payment flow with test cards
6. Configure webhooks
7. Go live when ready!