import type { NextApiRequest, NextApiResponse } from "next";
import { sendAIAdvisorNotification } from "@/lib/email";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      userId,
      userName,
      userEmail,
      issue,
      severity,
      recommendedAction,
      affectedArea
    } = req.body;

    // Validate required fields
    if (!userId || !userName || !userEmail || !issue || !severity || !recommendedAction || !affectedArea) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate severity level
    if (!["low", "medium", "high", "critical"].includes(severity)) {
      return res.status(400).json({ error: "Invalid severity level" });
    }

    // Send email notification to AI advisor team
    const emailResult = await sendAIAdvisorNotification({
      userId,
      userName,
      userEmail,
      issue,
      severity,
      recommendedAction,
      affectedArea
    });

    if (!emailResult.success) {
      console.error("Failed to send AI advisor email:", emailResult.error);
      return res.status(500).json({ 
        error: "Failed to send AI notification",
        details: emailResult.error
      });
    }

    // In production, also save to database
    // await supabase.from("ai_advisor_notifications").insert({...})

    return res.status(200).json({ 
      success: true,
      message: "AI advisor notification sent successfully" 
    });
  } catch (error) {
    console.error("AI advisor notification API error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}