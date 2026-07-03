import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { getPlanById } from "@/config/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { planId, billingCycle, userEmail, userId } = req.body;

    if (!planId || !billingCycle || !userEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Get plan details from config
    const plan = getPlanById(planId, "general");
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }

    // Calculate price based on billing cycle
    const isAnnual = billingCycle === "annual";
    const price = isAnnual 
      ? plan.price * 12 * 0.8 // 20% annual discount
      : plan.price;

    // Convert to cents for Stripe
    const priceInCents = Math.round(price * 100);

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.name} Plan`,
              description: plan.description,
            },
            unit_amount: priceInCents,
            recurring: {
              interval: isAnnual ? "year" : "month",
            },
          },
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      client_reference_id: userId,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          planId,
          userId,
          billingCycle,
        },
      },
      metadata: {
        planId,
        userId,
        billingCycle,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://cannablaze360.com"}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://cannablaze360.com"}/payment?canceled=true`,
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to create checkout session" 
    });
  }
}