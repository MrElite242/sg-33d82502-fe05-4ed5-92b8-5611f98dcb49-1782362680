import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface AIAdvisorNotificationRequest {
  userEmail: string;
  userName: string;
  companyName: string;
  action: "applied" | "learn_more" | "view_equipment" | "schedule_demo" | "create_training_plan";
  recommendationType: string;
  recommendationDetails: {
    title: string;
    impact: string;
    monthlySavings: string;
    pointsImprovement: string;
  };
  currentScore: number;
  categoryAffected: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      userEmail,
      userName,
      companyName,
      action,
      recommendationType,
      recommendationDetails,
      currentScore,
      categoryAffected
    } = req.body as AIAdvisorNotificationRequest;

    // Validate required fields
    if (!userEmail || !userName || !action || !recommendationType) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Action-specific email content
    const actionLabels = {
      applied: "Applied",
      learn_more: "Requested More Information",
      view_equipment: "Viewing Equipment Options",
      schedule_demo: "Scheduled Demo",
      create_training_plan: "Creating Training Plan"
    };

    const actionLabel = actionLabels[action] || action;

    // Send notification to user
    await resend.emails.send({
      from: "Canna Blaze 360 AI Advisor <ai-advisor@cannablaze360.com>",
      to: userEmail,
      subject: `AI Growth Advisor: ${actionLabel} - ${recommendationDetails.title}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
                color: white;
                padding: 30px;
                border-radius: 12px 12px 0 0;
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .header .sparkle {
                font-size: 32px;
                margin-bottom: 10px;
              }
              .content {
                background: #ffffff;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .greeting {
                font-size: 18px;
                margin-bottom: 20px;
                color: #374151;
              }
              .recommendation-card {
                background: linear-gradient(135deg, #f0fdf4 0%, #dbeafe 100%);
                border: 2px solid #10b981;
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
              }
              .recommendation-title {
                font-size: 20px;
                font-weight: 600;
                color: #065f46;
                margin-bottom: 10px;
              }
              .impact-badge {
                display: inline-block;
                background: #fbbf24;
                color: #78350f;
                padding: 4px 12px;
                border-radius: 12px;
                font-size: 12px;
                font-weight: 600;
                margin-right: 8px;
              }
              .metrics {
                display: flex;
                gap: 15px;
                margin: 15px 0;
                flex-wrap: wrap;
              }
              .metric {
                background: white;
                padding: 12px;
                border-radius: 8px;
                border: 1px solid #d1fae5;
                flex: 1;
                min-width: 140px;
              }
              .metric-label {
                font-size: 12px;
                color: #6b7280;
                margin-bottom: 4px;
              }
              .metric-value {
                font-size: 20px;
                font-weight: 700;
                color: #059669;
              }
              .action-section {
                background: #f9fafb;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .action-label {
                font-weight: 600;
                color: #6b21a8;
                font-size: 14px;
                margin-bottom: 8px;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #9333EA 0%, #3B82F6 100%);
                color: white;
                padding: 14px 28px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                margin: 15px 0;
              }
              .footer {
                background: #f9fafb;
                padding: 20px;
                border-radius: 0 0 12px 12px;
                text-align: center;
                font-size: 12px;
                color: #6b7280;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .ai-learning {
                background: #faf5ff;
                border: 1px solid #e9d5ff;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .learning-bar {
                background: #e5e7eb;
                height: 8px;
                border-radius: 4px;
                margin: 10px 0;
                overflow: hidden;
              }
              .learning-progress {
                background: linear-gradient(90deg, #9333EA 0%, #3B82F6 100%);
                height: 100%;
                width: 68%;
                border-radius: 4px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="sparkle">✨</div>
              <h1>AI Growth Advisor Action Confirmation</h1>
            </div>
            
            <div class="content">
              <div class="greeting">
                Hi ${userName},
              </div>
              
              <p>Your action has been recorded for <strong>${companyName}</strong>:</p>
              
              <div class="recommendation-card">
                <div class="recommendation-title">
                  ${recommendationDetails.title}
                </div>
                <span class="impact-badge">${recommendationDetails.impact}</span>
                
                <div class="metrics">
                  <div class="metric">
                    <div class="metric-label">Monthly Savings</div>
                    <div class="metric-value">${recommendationDetails.monthlySavings}</div>
                  </div>
                  <div class="metric">
                    <div class="metric-label">Score Improvement</div>
                    <div class="metric-value">+${recommendationDetails.pointsImprovement} pts</div>
                  </div>
                </div>
              </div>
              
              <div class="action-section">
                <div class="action-label">ACTION TAKEN:</div>
                <p style="margin: 8px 0; font-size: 16px; color: #374151;">
                  <strong>${actionLabel}</strong> for ${categoryAffected}
                </p>
                <p style="margin: 8px 0; font-size: 14px; color: #6b7280;">
                  Current ${categoryAffected} Score: <strong>${currentScore}/100</strong>
                </p>
              </div>
              
              ${action === "applied" ? `
                <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
                  <p style="margin: 0; color: #065f46; font-weight: 600;">
                    ✓ Recommendation Applied Successfully
                  </p>
                  <p style="margin: 8px 0 0 0; font-size: 14px; color: #047857;">
                    Our team will follow up within 24 hours to help you implement this change. 
                    You should see score improvements within 7-14 days.
                  </p>
                </div>
              ` : ""}
              
              <div class="ai-learning">
                <p style="margin: 0 0 10px 0; font-weight: 600; color: #6b21a8; font-size: 14px;">
                  🤖 AI Learning Progress
                </p>
                <p style="margin: 0 0 10px 0; font-size: 13px; color: #6b7280;">
                  The AI is continuously learning from your interactions to provide better recommendations.
                </p>
                <div class="learning-bar">
                  <div class="learning-progress"></div>
                </div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #9333EA; font-weight: 600;">
                  68% Personalization Complete
                </p>
              </div>
              
              <a href="https://cannablaze360.com/analytics" class="cta-button">
                View Full Health Index Dashboard →
              </a>
              
              <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                Have questions? Reply to this email or contact your account manager.
              </p>
            </div>
            
            <div class="footer">
              <p style="margin: 0 0 10px 0;">
                <strong>Canna Blaze 360 AI Growth Advisor™</strong>
              </p>
              <p style="margin: 5px 0;">
                Complete Seed to Sale Cannabis Tracking Ecosystem
              </p>
              <p style="margin: 10px 0;">
                <a href="https://cannablaze360.com" style="color: #9333EA; text-decoration: none;">cannablaze360.com</a>
              </p>
            </div>
          </body>
        </html>
      `
    });

    // Send internal notification to admin team
    await resend.emails.send({
      from: "Canna Blaze 360 System <system@cannablaze360.com>",
      to: "support@cannablaze360.com",
      subject: `AI Advisor Action: ${companyName} - ${actionLabel}`,
      html: `
        <h2>AI Growth Advisor Action Alert</h2>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>User:</strong> ${userName} (${userEmail})</p>
        <p><strong>Action:</strong> ${actionLabel}</p>
        <p><strong>Recommendation:</strong> ${recommendationDetails.title}</p>
        <p><strong>Category:</strong> ${categoryAffected}</p>
        <p><strong>Current Score:</strong> ${currentScore}/100</p>
        <p><strong>Potential Impact:</strong> ${recommendationDetails.impact} - ${recommendationDetails.monthlySavings}/month savings</p>
        ${action === "applied" ? "<p><strong>⚠️ FOLLOW-UP REQUIRED within 24 hours</strong></p>" : ""}
      `
    });

    return res.status(200).json({
      success: true,
      message: "Notification sent successfully"
    });

  } catch (error) {
    console.error("AI Advisor notification error:", error);
    return res.status(500).json({
      error: "Failed to send notification",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}