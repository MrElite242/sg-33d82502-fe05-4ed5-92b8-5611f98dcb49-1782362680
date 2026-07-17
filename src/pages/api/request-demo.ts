import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      company,
      role,
      businessType,
      locations,
      currentSoftware,
      preferredDate,
      preferredTime,
      challenges,
    } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !company) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const fullName = `${firstName} ${lastName}`;

    // Send email to sales team
    const salesEmail = await resend.emails.send({
      from: "Canna Blaze 360 <demos@cannablaze360.com>",
      to: ["sales@cannablaze360.com"],
      replyTo: email,
      subject: `New Demo Request from ${company}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #059669; }
              .value { margin-top: 5px; }
              .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
              .badge { display: inline-block; background: #059669; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🎯 New Demo Request</h1>
                <p style="margin: 10px 0 0 0;">Someone wants to see Canna Blaze 360 in action!</p>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Contact Information</div>
                  <div class="value">
                    <strong>${fullName}</strong><br>
                    Email: <a href="mailto:${email}">${email}</a><br>
                    ${phone ? `Phone: ${phone}<br>` : ""}
                    Company: ${company}
                  </div>
                </div>

                <div class="field">
                  <div class="label">Business Details</div>
                  <div class="value">
                    Role: ${role || "Not specified"}<br>
                    Business Type: ${businessType || "Not specified"}<br>
                    Number of Locations: ${locations || "Not specified"}
                  </div>
                </div>

                ${currentSoftware ? `
                <div class="field">
                  <div class="label">Current Software</div>
                  <div class="value">${currentSoftware}</div>
                </div>
                ` : ""}

                ${preferredDate || preferredTime ? `
                <div class="field">
                  <div class="label">Scheduling Preferences</div>
                  <div class="value">
                    ${preferredDate ? `Preferred Date: ${preferredDate}<br>` : ""}
                    ${preferredTime ? `Preferred Time: ${preferredTime}` : ""}
                  </div>
                </div>
                ` : ""}

                ${challenges ? `
                <div class="field">
                  <div class="label">Challenges & Needs</div>
                  <div class="value">${challenges.replace(/\n/g, '<br>')}</div>
                </div>
                ` : ""}

                <div style="margin-top: 30px; padding: 15px; background: white; border-left: 4px solid #059669; border-radius: 4px;">
                  <strong>Next Steps:</strong><br>
                  1. Review the prospect details above<br>
                  2. Schedule a demo within 24 hours<br>
                  3. Prepare a customized presentation based on their business type
                </div>
              </div>
              <div class="footer">
                <p>Canna Blaze 360 Demo Request System<br>
                <a href="https://cannablaze360.com">cannablaze360.com</a></p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Send confirmation email to requester
    const confirmationEmail = await resend.emails.send({
      from: "Canna Blaze 360 <demos@cannablaze360.com>",
      to: [email],
      subject: "Demo Request Received - Canna Blaze 360",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 40px 30px; border: 1px solid #e5e7eb; border-top: none; }
              .footer { background: #f9fafb; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .checklist { background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 20px 0; border-radius: 4px; }
              .checklist li { margin: 10px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 28px;">✅ Demo Request Confirmed!</h1>
                <p style="margin: 15px 0 0 0; opacity: 0.95;">We'll be in touch within 24 hours</p>
              </div>
              <div class="content">
                <p>Hi ${firstName},</p>
                
                <p>Thank you for your interest in Canna Blaze 360! We've received your demo request and our team is excited to show you how our platform can transform your cannabis operations.</p>

                <div class="checklist">
                  <strong>What happens next:</strong>
                  <ul style="margin: 15px 0 0 0; padding-left: 20px;">
                    <li>✓ A cannabis industry specialist will contact you within 24 hours</li>
                    <li>✓ We'll schedule a personalized 30-45 minute demo at your preferred time</li>
                    <li>✓ You'll see exactly how Canna Blaze 360 solves your specific challenges</li>
                    <li>✓ Get answers to all your questions in real-time</li>
                  </ul>
                </div>

                <p><strong>Your Request Details:</strong></p>
                <ul style="background: #f9fafb; padding: 20px 20px 20px 40px; border-radius: 6px;">
                  <li>Company: ${company}</li>
                  <li>Business Type: ${businessType || "Not specified"}</li>
                  ${preferredDate ? `<li>Preferred Date: ${preferredDate}</li>` : ""}
                  ${preferredTime ? `<li>Preferred Time: ${preferredTime}</li>` : ""}
                </ul>

                <p>In the meantime, feel free to explore our platform tutorial:</p>
                
                <div style="text-align: center;">
                  <a href="https://cannablaze360.com/tutorial" class="button">View Platform Tutorial</a>
                </div>

                <p style="margin-top: 30px;">Questions before your demo? Reply to this email or call us at <strong>+1 (555) BLAZE-360</strong>.</p>

                <p>Best regards,<br>
                <strong>The Canna Blaze 360 Team</strong></p>
              </div>
              <div class="footer">
                <p style="margin: 0 0 15px 0; color: #6b7280;">
                  <strong>Canna Blaze 360</strong><br>
                  Complete Seed-to-Sale Cannabis Management
                </p>
                <p style="margin: 0; font-size: 14px; color: #9ca3af;">
                  <a href="https://cannablaze360.com" style="color: #059669; text-decoration: none;">Website</a> • 
                  <a href="https://cannablaze360.com/tutorial" style="color: #059669; text-decoration: none;">Tutorial</a> • 
                  <a href="mailto:support@cannablaze360.com" style="color: #059669; text-decoration: none;">Support</a>
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Demo request emails sent:", {
      salesEmailId: salesEmail.data?.id,
      confirmationEmailId: confirmationEmail.data?.id,
    });

    res.status(200).json({ 
      success: true, 
      message: "Demo request submitted successfully",
      emailId: confirmationEmail.data?.id,
    });

  } catch (error) {
    console.error("Error processing demo request:", error);
    res.status(500).json({ 
      error: "Failed to process demo request",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}