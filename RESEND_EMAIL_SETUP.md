# 📧 Resend Email Setup Guide

## Overview
Automated email notifications for demo requests using Resend - a modern email API for developers.

---

## 1. Create Resend Account

1. **Sign up:** https://resend.com/signup
2. **Verify your email** address
3. **Complete onboarding** (choose plan - Free tier includes 100 emails/day)

---

## 2. Domain Verification (Required for Production)

### Option A: Use Resend's Domain (Quick Start - Testing Only)
- You can send from `@resend.dev` domains immediately
- Limited to 100 emails/day
- Emails may land in spam
- **Not recommended for production**

### Option B: Verify Your Domain (Recommended for Production)

1. **Add your domain in Resend:**
   - Resend Dashboard → Domains → Add Domain
   - Enter: `cannablaze360.com`

2. **Add DNS records to your domain registrar:**
   - Resend will provide specific DNS records (TXT, MX, CNAME)
   - Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
   - Add all provided DNS records

3. **Wait for verification:**
   - DNS propagation takes 10 minutes to 48 hours
   - Resend will show "Verified" when complete

4. **Update email sender:**
   - Change `from` addresses in `/api/request-demo.ts`:
   ```typescript
   from: "Canna Blaze 360 <demos@cannablaze360.com>"
   ```

**DNS Records You'll Need to Add:**

| Type | Name | Value | Priority |
|------|------|-------|----------|
| TXT | @ | v=spf1 include:_spf.resend.com ~all | - |
| MX | @ | feedback-smtp.us-east-1.amazonses.com | 10 |
| CNAME | resend._domainkey | resend._domainkey.resend.com | - |

---

## 3. Get API Key

1. **Resend Dashboard** → API Keys → Create API Key
2. **Name:** "Canna Blaze 360 Production"
3. **Permission:** Full Access
4. **Copy the key** (starts with `re_`)

---

## 4. Add to Vercel Environment Variables

1. **Vercel Dashboard** → Your Project → Settings → Environment Variables
2. **Add new variable:**
   - **Name:** `RESEND_API_KEY`
   - **Value:** `re_xxxxxxxxxxxxxxxxxxxxxxxx` (your API key)
   - **Environment:** Production, Preview, Development (select all)
3. **Save**
4. **Redeploy** your application

---

## 5. Local Development Setup

Create or update `.env.local`:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_your_resend_api_key_here

# Other environment variables...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Test locally:**
```bash
npm run dev
# Visit http://localhost:3000 and submit a demo request
```

---

## 6. Install Resend Package

```bash
npm install resend
```

This package is already configured in your API route at `/api/request-demo.ts`.

---

## 7. Configure Email Recipients

Update the sales team email in `/api/request-demo.ts`:

```typescript
// Line 28-31
const salesEmail = await resend.emails.send({
  from: "Canna Blaze 360 <demos@cannablaze360.com>",
  to: ["sales@cannablaze360.com"], // ← Update this email
  replyTo: email,
  // ...
});
```

**Multiple recipients:**
```typescript
to: ["sales@cannablaze360.com", "demos@cannablaze360.com", "founder@cannablaze360.com"]
```

---

## 8. Email Templates Included

### 📩 Sales Team Email
**When:** Demo request submitted  
**To:** `sales@cannablaze360.com`  
**Subject:** "New Demo Request from {Company}"  
**Includes:**
- Contact information (name, email, phone, company)
- Business details (role, type, locations)
- Current software
- Scheduling preferences
- Challenges/needs
- Next steps checklist

### ✅ Confirmation Email
**When:** Demo request submitted  
**To:** Requester's email  
**Subject:** "Demo Request Received - Canna Blaze 360"  
**Includes:**
- Confirmation message
- What happens next (4-step checklist)
- Request details summary
- Link to platform tutorial
- Contact information

---

## 9. Testing

### Test with Resend Dashboard
1. Resend Dashboard → Emails → View sent emails
2. Check delivery status, open rates, click rates
3. View full email HTML

### Test Cards for Demo Requests
Use these test scenarios:

**Valid Test:**
- First Name: Test
- Last Name: User
- Email: test@example.com (or your personal email)
- Company: Test Cannabis Clinic
- Fill other fields as desired
- Submit

**Expected Result:**
- ✓ Two emails sent (sales team + confirmation)
- ✓ Success message in UI
- ✓ Toast notification
- ✓ Form resets after 5 seconds

---

## 10. Production Checklist

Before going live with real demo requests:

- [ ] Domain verified in Resend (not using @resend.dev)
- [ ] DNS records added and verified
- [ ] API key added to Vercel environment variables
- [ ] Sales team email updated to real address
- [ ] Test email sent and received successfully
- [ ] Email templates reviewed and approved
- [ ] Spam folder checked (emails should land in inbox)
- [ ] Mobile email preview tested
- [ ] Reply-to functionality tested

---

## 11. Monitoring & Analytics

**Resend Dashboard provides:**
- Email delivery status
- Open rates
- Click rates
- Bounce rates
- Spam complaints
- Failed deliveries

**Check regularly:**
- Failed deliveries (fix any issues immediately)
- Spam reports (adjust email content if needed)
- Bounce rates (validate email addresses)

---

## 12. Email Limits & Pricing

### Free Plan
- **100 emails/day**
- **1 domain**
- **7-day email retention**
- Perfect for testing and small-scale demos

### Pro Plan ($20/month)
- **50,000 emails/month**
- **Unlimited domains**
- **90-day email retention**
- Priority support
- **Recommended for production**

### Scale Plan (Custom)
- **Custom volume**
- Dedicated IPs
- Advanced features
- Enterprise support

---

## 13. Troubleshooting

### Emails not sending
1. **Check API key** is correct in Vercel environment variables
2. **Verify** Resend package is installed: `npm list resend`
3. **Check logs** in Vercel → Deployments → Runtime Logs
4. **Test API endpoint** directly: `/api/request-demo`

### Emails landing in spam
1. **Verify domain** (not using @resend.dev)
2. **Add DKIM, SPF, DMARC** DNS records
3. **Warm up domain** (send gradually increasing volume)
4. **Avoid spam triggers** (all caps, excessive exclamation marks)

### Emails not received
1. **Check spam folder**
2. **Verify email address** is valid
3. **Check Resend Dashboard** for delivery status
4. **Check domain verification** status

### Domain verification stuck
1. **Wait 24-48 hours** for DNS propagation
2. **Check DNS records** are added correctly
3. **Use DNS checker**: https://mxtoolbox.com
4. **Contact Resend support** if still stuck after 48 hours

---

## 14. API Endpoint Details

**Endpoint:** `/api/request-demo`  
**Method:** `POST`  
**Content-Type:** `application/json`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1-555-123-4567",
  "company": "Test Cannabis Clinic",
  "role": "Owner",
  "businessType": "Medical Dispensary",
  "locations": "3",
  "currentSoftware": "BioTrack",
  "preferredDate": "2026-07-25",
  "preferredTime": "Morning (9AM - 12PM)",
  "challenges": "Need better compliance tracking and inventory management"
}
```

**Success Response:**
```json
{
  "success": true,
  "message": "Demo request submitted successfully",
  "emailId": "re_abc123xyz"
}
```

**Error Response:**
```json
{
  "error": "Failed to process demo request",
  "details": "Missing required fields"
}
```

---

## 15. Next Steps

1. **Set up Resend account** (10 minutes)
2. **Add API key to Vercel** (2 minutes)
3. **Install resend package:** `npm install resend` (1 minute)
4. **Test with your email** (5 minutes)
5. **Verify domain** for production (1-48 hours)
6. **Update sales email address** (1 minute)
7. **Go live!** ✅

---

## Support

- **Resend Documentation:** https://resend.com/docs
- **Resend Status:** https://resend.statuspage.io
- **Resend Support:** support@resend.com
- **Your API Status:** `/api/request-demo` (test endpoint)

---

**✨ That's it! Your demo request system is now fully automated with professional email notifications.**