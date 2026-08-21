import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Privacy-preserving credential verification endpoint
 * Returns ONLY eligibility status - no personal information
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { verificationToken } = req.body;

    if (!verificationToken) {
      return res.status(400).json({ error: "Verification token required" });
    }

    // Look up credential by verification token
    const { data: credential, error } = await supabase
      .from("canna_id_credentials")
      .select("id, credential_number, eligibility_status, status, expires_at, jurisdiction, verification_count")
      .eq("verification_token", verificationToken)
      .single();

    if (error || !credential) {
      return res.status(404).json({ 
        eligible: false,
        reason: "Invalid credential"
      });
    }

    // Check if expired
    const isExpired = new Date(credential.expires_at) < new Date();
    if (isExpired) {
      return res.status(200).json({
        eligible: false,
        reason: "Credential expired"
      });
    }

    // Check if active
    if (credential.status !== "active") {
      return res.status(200).json({
        eligible: false,
        reason: `Credential ${credential.status}`
      });
    }

    // Check eligibility status
    if (!credential.eligibility_status) {
      return res.status(200).json({
        eligible: false,
        reason: "Not eligible"
      });
    }

    // Log verification attempt (audit trail)
    const verifierUserId = req.headers["x-user-id"] as string | undefined;
    const verificationLocation = req.headers["x-location"] as string | undefined;

    if (verifierUserId) {
      await supabase.from("credential_verifications").insert({
        credential_id: credential.id,
        verified_by: verifierUserId,
        verification_location: verificationLocation || "Unknown",
        verification_result: true,
        verification_method: "api",
        ip_address: req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        user_agent: req.headers["user-agent"]
      });

      // Update last verified timestamp and count
      await supabase
        .from("canna_id_credentials")
        .update({
          last_verified_at: new Date().toISOString(),
          verification_count: credential.verification_count + 1
        })
        .eq("id", credential.id);
    }

    // Return ONLY eligibility - no personal info
    return res.status(200).json({
      eligible: true,
      jurisdiction: credential.jurisdiction,
      credentialNumber: credential.credential_number,
      message: "User is eligible for cannabis purchase"
    });

  } catch (error) {
    console.error("Credential verification error:", error);
    return res.status(500).json({ 
      eligible: false,
      reason: "Verification system error"
    });
  }
}