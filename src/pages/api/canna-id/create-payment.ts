import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

// Pricing configuration
const PERMIT_PRICING = {
  local: {
    amount: 500, // $5.00 in cents
    duration_days: 30,
    description: "Local Resident Permit - 30 Days"
  },
  tourist: {
    amount: 1000, // $10.00 in cents
    duration_days: 30,
    description: "Tourist/Foreigner Permit - 30 Days"
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      credentialData,
      permitType = "local"
    } = req.body;

    // Validate permit type
    if (!["local", "tourist"].includes(permitType)) {
      return res.status(400).json({ error: "Invalid permit type" });
    }

    // Validate required credential data
    const requiredFields = ["fullName", "dateOfBirth", "gender", "nationalId", "jurisdiction"];
    for (const field of requiredFields) {
      if (!credentialData[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Get pricing
    const pricing = PERMIT_PRICING[permitType as keyof typeof PERMIT_PRICING];

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: pricing.amount,
      currency: "usd",
      description: pricing.description,
      metadata: {
        permit_type: permitType,
        jurisdiction: credentialData.jurisdiction,
        user_name: credentialData.fullName,
        duration_days: pricing.duration_days.toString()
      },
    });

    // Store preliminary credential data with payment pending
    const { data: credential, error: credentialError } = await supabase
      .from("canna_id_credentials")
      .insert({
        full_name: credentialData.fullName,
        date_of_birth: credentialData.dateOfBirth,
        gender: credentialData.gender,
        national_id: credentialData.nationalId,
        jurisdiction: credentialData.jurisdiction,
        region: credentialData.region || null,
        permit_type: permitType,
        payment_status: "pending",
        payment_amount: pricing.amount / 100,
        payment_currency: "USD",
        stripe_payment_intent_id: paymentIntent.id,
        permit_duration_days: pricing.duration_days,
        status: "pending", // Not active until paid
        eligibility_status: "pending"
      })
      .select()
      .single();

    if (credentialError) {
      console.error("Failed to create credential record:", credentialError);
      return res.status(500).json({ 
        error: "Failed to create credential record",
        details: credentialError.message
      });
    }

    // Create payment record
    await supabase
      .from("canna_id_payments")
      .insert({
        credential_id: credential.id,
        credential_number: credential.credential_number,
        permit_type: permitType,
        amount: pricing.amount / 100,
        currency: "USD",
        stripe_payment_intent_id: paymentIntent.id,
        payment_status: "pending",
        user_email: credentialData.email || null,
        user_name: credentialData.fullName,
        jurisdiction: credentialData.jurisdiction,
        metadata: {
          duration_days: pricing.duration_days,
          region: credentialData.region
        }
      });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      credentialId: credential.id,
      credentialNumber: credential.credential_number,
      amount: pricing.amount / 100,
      permitType: permitType
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}