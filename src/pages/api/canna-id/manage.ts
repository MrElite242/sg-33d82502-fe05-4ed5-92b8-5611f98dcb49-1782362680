import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/integrations/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { action, credentialId, reason, officialEmail } = req.body;

    // Validate required fields
    if (!action || !credentialId || !officialEmail) {
      return res.status(400).json({ error: "Missing required fields: action, credentialId, officialEmail" });
    }

    // Validate action type
    if (!["suspend", "revoke", "reactivate"].includes(action)) {
      return res.status(400).json({ error: "Invalid action. Must be: suspend, revoke, or reactivate" });
    }

    // Get current credential
    const { data: credential, error: fetchError } = await supabase
      .from("canna_id_credentials")
      .select("*")
      .eq("id", credentialId)
      .single();

    if (fetchError || !credential) {
      return res.status(404).json({ error: "Credential not found" });
    }

    // Determine new status based on action
    let newStatus: string;
    switch (action) {
      case "suspend":
        newStatus = "suspended";
        break;
      case "revoke":
        newStatus = "revoked";
        break;
      case "reactivate":
        newStatus = "active";
        break;
      default:
        return res.status(400).json({ error: "Invalid action" });
    }

    // Update credential status
    const { data: updatedCredential, error: updateError } = await supabase
      .from("canna_id_credentials")
      .update({
        status: newStatus,
        eligibility_status: newStatus === "active", // Only active credentials are eligible
        notes: reason || `${action} by ${officialEmail}`,
        updated_at: new Date().toISOString()
      })
      .eq("id", credentialId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating credential:", updateError);
      return res.status(500).json({ error: "Failed to update credential status" });
    }

    // Log the action in audit trail
    const { error: auditError } = await supabase
      .from("canna_id_audit_logs")
      .insert({
        credential_id: credentialId,
        credential_number: credential.credential_number,
        action_type: action === "reactivate" ? "reactivated" : action === "suspend" ? "suspended" : "revoked",
        previous_status: credential.status,
        new_status: newStatus,
        action_by: officialEmail,
        action_reason: reason || `${action} by official`,
        metadata: {
          jurisdiction: credential.jurisdiction,
          region: credential.region
        }
      });

    if (auditError) {
      console.error("Error creating audit log:", auditError);
      // Don't fail the request if audit log fails - credential was already updated
    }

    return res.status(200).json({
      success: true,
      credential: updatedCredential,
      message: `Credential ${action}d successfully`
    });
  } catch (error) {
    console.error("Credential management error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}