import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";
import Stripe from "stripe";
import { generateCredentialNumber, generateVerificationToken, generateQRCode } from "@/lib/cannaId";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ error: "Missing payment intent ID" });
    }

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({ 
        error: "Payment not completed",
        status: paymentIntent.status
      });
    }

    // Update credential record
    const { data: credential, error: credentialError } = await supabase
      .from("canna_id_credentials")
      .select("*")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .single();

    if (credentialError || !credential) {
      return res.status(404).json({ error: "Credential not found" });
    }

    // Generate verification token and QR code
    const verificationToken = generateVerificationToken();
    const qrCodeUrl = await generateQRCode(verificationToken);

    // Calculate expiry date (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (credential.permit_duration_days || 30));

    // Update credential to active status
    const { error: updateError } = await supabase
      .from("canna_id_credentials")
      .update({
        payment_status: "paid",
        paid_at: new Date().toISOString(),
        status: "active",
        eligibility_status: "verified",
        verification_token: verificationToken,
        qr_code_data: qrCodeUrl,
        issued_at: new Date().toISOString(),
        expires_at: expiresAt.toISOString()
      })
      .eq("id", credential.id);

    if (updateError) {
      console.error("Failed to update credential:", updateError);
      return res.status(500).json({ error: "Failed to activate credential" });
    }

    // Update payment record
    await supabase
      .from("canna_id_payments")
      .update({
        payment_status: "paid",
        stripe_charge_id: paymentIntent.latest_charge as string,
        payment_method: paymentIntent.payment_method_types[0],
        updated_at: new Date().toISOString()
      })
      .eq("stripe_payment_intent_id", paymentIntentId);

    return res.status(200).json({
      success: true,
      credential: {
        id: credential.id,
        credentialNumber: credential.credential_number,
        status: "active",
        expiresAt: expiresAt.toISOString()
      }
    });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}