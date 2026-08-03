import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Platform email addresses
export const PLATFORM_EMAILS = {
  AI_ADVISOR: "ai-advisor@cannablaze360.com",
  SYSTEM: "system@cannablaze360.com",
  SUPPORT: "support@cannablaze360.com",
  DEMOS: "demos@cannablaze360.com",
  SALES: "sales@cannablaze360.com",
  GOVERNMENT: "government@cannablaze360.com",
  OWNER: "owner@cannablaze360.com"
};

interface EmailOptions {
  to: string | string[];
  from: string;
  subject: string;
  html: string;
  replyTo?: string;
}

/**
 * Send email via Resend
 */
export async function sendEmail(options: EmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      throw new Error("Email service not configured");
    }

    const { data, error } = await resend.emails.send({
      from: options.from,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log("Email sent successfully:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}

/**
 * Send demo request notification to sales team
 */
export async function sendDemoRequestNotification(demoData: {
  name: string;
  email: string;
  company: string;
  phone: string;
  businessType: string;
  message: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #059669; }
          .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #10b981; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🌿 New Demo Request</h1>
            <p style="margin: 5px 0 0 0;">Canna Blaze 360 Platform</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">Contact Name</div>
              <div class="value">${demoData.name}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value"><a href="mailto:${demoData.email}">${demoData.email}</a></div>
            </div>
            <div class="field">
              <div class="label">Phone</div>
              <div class="value">${demoData.phone}</div>
            </div>
            <div class="field">
              <div class="label">Company</div>
              <div class="value">${demoData.company}</div>
            </div>
            <div class="field">
              <div class="label">Business Type</div>
              <div class="value">${demoData.businessType}</div>
            </div>
            <div class="field">
              <div class="label">Message</div>
              <div class="value">${demoData.message || "No message provided"}</div>
            </div>
            <div style="margin-top: 30px; padding: 15px; background: #ecfdf5; border-left: 3px solid #10b981; border-radius: 4px;">
              <strong>Next Steps:</strong> Follow up within 24 hours to schedule demo
            </div>
          </div>
          <div class="footer">
            <p>Canna Blaze 360 - National Cannabis Management Platform</p>
            <p>This notification was sent to ${PLATFORM_EMAILS.DEMOS}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: PLATFORM_EMAILS.DEMOS,
    from: PLATFORM_EMAILS.SYSTEM,
    subject: `New Demo Request from ${demoData.company}`,
    html,
    replyTo: demoData.email
  });
}

/**
 * Send government consultation request notification
 */
export async function sendGovernmentConsultationNotification(consultationData: {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  position: string;
  organization: string;
  programType: string;
  expectedLicensees: string;
  timeline: string;
  budget: string;
  message: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .section { margin-bottom: 25px; }
          .section-title { font-weight: bold; color: #2563eb; font-size: 16px; margin-bottom: 10px; border-bottom: 2px solid #2563eb; padding-bottom: 5px; }
          .field { margin-bottom: 12px; }
          .label { font-weight: bold; color: #6b7280; font-size: 13px; }
          .value { margin-top: 3px; padding: 8px; background: white; border-left: 3px solid #2563eb; }
          .priority-high { background: #fee2e2; border-left-color: #dc2626; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🏛️ Government Consultation Request</h1>
            <p style="margin: 5px 0 0 0;">National Cannabis Program Infrastructure</p>
          </div>
          <div class="content">
            <div class="section">
              <div class="section-title">Contact Information</div>
              <div class="field">
                <div class="label">Official</div>
                <div class="value">${consultationData.fullName} - ${consultationData.position}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${consultationData.email}">${consultationData.email}</a></div>
              </div>
              <div class="field">
                <div class="label">Phone</div>
                <div class="value">${consultationData.phone}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Organization & Location</div>
              <div class="field">
                <div class="label">Government Agency</div>
                <div class="value">${consultationData.organization}</div>
              </div>
              <div class="field">
                <div class="label">Country/Region</div>
                <div class="value">${consultationData.country}</div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Program Details</div>
              <div class="field">
                <div class="label">Program Type</div>
                <div class="value">${consultationData.programType}</div>
              </div>
              <div class="field">
                <div class="label">Expected Licensees</div>
                <div class="value">${consultationData.expectedLicensees}</div>
              </div>
              <div class="field">
                <div class="label">Implementation Timeline</div>
                <div class="value ${consultationData.timeline.includes('0-3') ? 'priority-high' : ''}">${consultationData.timeline}</div>
              </div>
              <div class="field">
                <div class="label">Annual Budget</div>
                <div class="value">${consultationData.budget}</div>
              </div>
            </div>

            ${consultationData.message ? `
            <div class="section">
              <div class="section-title">Additional Information</div>
              <div class="value">${consultationData.message}</div>
            </div>
            ` : ''}

            <div style="margin-top: 30px; padding: 15px; background: #eff6ff; border-left: 3px solid #2563eb; border-radius: 4px;">
              <strong>⚠️ CONFIDENTIAL:</strong> Government inquiry - Handle with strict confidentiality. Follow up within 24 hours.
            </div>
          </div>
          <div class="footer">
            <p>Canna Blaze 360 - Government Solutions Division</p>
            <p>This notification was sent to ${PLATFORM_EMAILS.GOVERNMENT}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: PLATFORM_EMAILS.GOVERNMENT,
    from: PLATFORM_EMAILS.SYSTEM,
    subject: `🏛️ Government Consultation: ${consultationData.country} - ${consultationData.organization}`,
    html,
    replyTo: consultationData.email
  });
}

/**
 * Send AI advisor notification
 */
export async function sendAIAdvisorNotification(notificationData: {
  userId: string;
  userName: string;
  userEmail: string;
  issue: string;
  severity: "low" | "medium" | "high" | "critical";
  recommendedAction: string;
  affectedArea: string;
}) {
  const severityColors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#f97316",
    critical: "#dc2626"
  };

  const severityLabels = {
    low: "ℹ️ Low Priority",
    medium: "⚠️ Medium Priority",
    high: "🚨 High Priority",
    critical: "🔴 CRITICAL"
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #7c3aed, #a855f7); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .severity { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; color: white; margin-bottom: 15px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #7c3aed; }
          .value { margin-top: 5px; padding: 10px; background: white; border-left: 3px solid #7c3aed; }
          .action { background: #fef3c7; border-left: 3px solid #f59e0b; padding: 15px; margin-top: 20px; border-radius: 4px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">🤖 AI Advisor Alert</h1>
            <p style="margin: 5px 0 0 0;">Automated Issue Detection</p>
          </div>
          <div class="content">
            <div class="severity" style="background-color: ${severityColors[notificationData.severity]};">
              ${severityLabels[notificationData.severity]}
            </div>
            
            <div class="field">
              <div class="label">User</div>
              <div class="value">${notificationData.userName} (${notificationData.userEmail})</div>
            </div>
            
            <div class="field">
              <div class="label">Affected Area</div>
              <div class="value">${notificationData.affectedArea}</div>
            </div>
            
            <div class="field">
              <div class="label">Detected Issue</div>
              <div class="value">${notificationData.issue}</div>
            </div>
            
            <div class="action">
              <strong>📋 Recommended Action:</strong><br/>
              ${notificationData.recommendedAction}
            </div>
          </div>
          <div class="footer">
            <p>Canna Blaze 360 - AI Monitoring System</p>
            <p>This notification was sent to ${PLATFORM_EMAILS.AI_ADVISOR}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: PLATFORM_EMAILS.AI_ADVISOR,
    from: PLATFORM_EMAILS.SYSTEM,
    subject: `${severityLabels[notificationData.severity]} - ${notificationData.affectedArea}`,
    html,
    replyTo: notificationData.userEmail
  });
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(userData: {
  name: string;
  email: string;
  businessType: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">🌿 Welcome to Canna Blaze 360!</h1>
          </div>
          <div class="content">
            <p>Hello ${userData.name},</p>
            <p>Welcome to Canna Blaze 360 - your complete cannabis management platform!</p>
            <p>Your account has been successfully created for <strong>${userData.businessType}</strong> operations.</p>
            
            <div style="background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0;">
              <h3 style="margin-top: 0;">🚀 Get Started:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Explore your dashboard and available modules</li>
                <li>Set up your first inventory items</li>
                <li>Configure compliance settings</li>
                <li>Invite team members</li>
              </ul>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://cannablaze360.com'}/dashboard" class="button">
                Go to Dashboard
              </a>
            </div>

            <p>Need help? Our support team is here for you at <a href="mailto:${PLATFORM_EMAILS.SUPPORT}">${PLATFORM_EMAILS.SUPPORT}</a></p>
            
            <p>Best regards,<br/>The Canna Blaze 360 Team</p>
          </div>
          <div class="footer">
            <p>Canna Blaze 360 - National Cannabis Management Platform</p>
            <p>You received this email because you created an account on our platform.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userData.email,
    from: PLATFORM_EMAILS.SYSTEM,
    subject: "🌿 Welcome to Canna Blaze 360!",
    html
  });
}