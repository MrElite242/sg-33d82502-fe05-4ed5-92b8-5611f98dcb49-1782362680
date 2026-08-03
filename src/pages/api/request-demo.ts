import type { NextApiRequest, NextApiResponse } from "next";
import { sendDemoRequestNotification } from "@/lib/email";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, company, phone, businessType, message } = req.body;

    // Validate required fields
    if (!name || !email || !company || !phone || !businessType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Send email notification to demos team
    const emailResult = await sendDemoRequestNotification({
      name,
      email,
      company,
      phone,
      businessType,
      message
    });

    if (!emailResult.success) {
      console.error("Failed to send demo request email:", emailResult.error);
      return res.status(500).json({ 
        error: "Failed to send demo request",
        details: emailResult.error
      });
    }

    // In production, also save to database
    // await supabase.from("demo_requests").insert({...})

    return res.status(200).json({ 
      success: true,
      message: "Demo request submitted successfully" 
    });
  } catch (error) {
    console.error("Demo request API error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}