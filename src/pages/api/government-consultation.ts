import type { NextApiRequest, NextApiResponse } from "next";
import { sendGovernmentConsultationNotification } from "@/lib/email";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      fullName,
      email,
      phone,
      country,
      position,
      organization,
      programType,
      expectedLicensees,
      timeline,
      budget,
      message
    } = req.body;

    // Validate required fields
    if (!fullName || !email || !phone || !country || !position || !organization) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Send email notification to government solutions team
    const emailResult = await sendGovernmentConsultationNotification({
      fullName,
      email,
      phone,
      country,
      position,
      organization,
      programType,
      expectedLicensees,
      timeline,
      budget,
      message
    });

    if (!emailResult.success) {
      console.error("Failed to send government consultation email:", emailResult.error);
      return res.status(500).json({ 
        error: "Failed to send consultation request",
        details: emailResult.error
      });
    }

    // In production, also save to database
    // await supabase.from("government_consultations").insert({...})

    return res.status(200).json({ 
      success: true,
      message: "Consultation request submitted successfully" 
    });
  } catch (error) {
    console.error("Government consultation API error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}