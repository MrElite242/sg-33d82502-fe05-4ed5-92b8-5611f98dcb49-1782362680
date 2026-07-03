import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { GENERAL_PLANS, DOCTOR_PLANS, calculateAnnualPrice } from "@/config/pricing";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const results = {
      products: [] as any[],
      prices: [] as any[],
      errors: [] as any[],
    };

    // Sync General Plans
    for (const plan of GENERAL_PLANS) {
      try {
        // Create or update product
        const products = await stripe.products.search({
          query: `metadata['plan_id']:'${plan.id}'`,
        });

        let product: Stripe.Product;
        
        if (products.data.length > 0) {
          product = products.data[0];
        } else {
          product = await stripe.products.create({
            name: `${plan.name} Plan`,
            description: plan.description,
            metadata: {
              plan_id: plan.id,
              plan_type: "general",
            },
          });
        }

        results.products.push(product);

        // Create monthly price
        const monthlyPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(plan.price * 100),
          currency: "usd",
          recurring: {
            interval: "month",
          },
          metadata: {
            plan_id: plan.id,
            billing_cycle: "monthly",
          },
        });

        results.prices.push(monthlyPrice);

        // Create annual price (20% discount)
        const annualPriceAmount = calculateAnnualPrice(plan.price);
        const annualPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(annualPriceAmount * 100),
          currency: "usd",
          recurring: {
            interval: "year",
          },
          metadata: {
            plan_id: plan.id,
            billing_cycle: "annual",
          },
        });

        results.prices.push(annualPrice);
      } catch (error) {
        results.errors.push({
          plan: plan.name,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Sync Doctor Plans
    for (const plan of DOCTOR_PLANS) {
      try {
        const products = await stripe.products.search({
          query: `metadata['plan_id']:'doctor-${plan.id}'`,
        });

        let product: Stripe.Product;
        
        if (products.data.length > 0) {
          product = products.data[0];
        } else {
          product = await stripe.products.create({
            name: `Doctor ${plan.name} Plan`,
            description: plan.description,
            metadata: {
              plan_id: `doctor-${plan.id}`,
              plan_type: "doctor",
            },
          });
        }

        results.products.push(product);

        // Create monthly price
        const monthlyPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(plan.price * 100),
          currency: "usd",
          recurring: {
            interval: "month",
          },
          metadata: {
            plan_id: `doctor-${plan.id}`,
            billing_cycle: "monthly",
          },
        });

        results.prices.push(monthlyPrice);

        // Create annual price
        const annualPriceAmount = calculateAnnualPrice(plan.price);
        const annualPrice = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(annualPriceAmount * 100),
          currency: "usd",
          recurring: {
            interval: "year",
          },
          metadata: {
            plan_id: `doctor-${plan.id}`,
            billing_cycle: "annual",
          },
        });

        results.prices.push(annualPrice);
      } catch (error) {
        results.errors.push({
          plan: plan.name,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Synced ${results.products.length} products and ${results.prices.length} prices to Stripe`,
      results,
    });
  } catch (error) {
    console.error("Error syncing products to Stripe:", error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Failed to sync products" 
    });
  }
}