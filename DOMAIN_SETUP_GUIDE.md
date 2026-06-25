# Domain Setup Guide - Canna Blaze 360

This guide walks you through purchasing a custom domain and connecting it to your Canna Blaze 360 deployment on Vercel.

## Step 1: Purchase a Domain

### Recommended Domain Registrars

1. **Namecheap** (https://www.namecheap.com)
   - Affordable pricing ($8-15/year for .com)
   - Free WHOIS privacy protection
   - Easy DNS management

2. **Google Domains** (https://domains.google)
   - Clean interface
   - Integrated with Google services
   - Transparent pricing

3. **Cloudflare Registrar** (https://www.cloudflare.com/products/registrar/)
   - At-cost pricing (no markup)
   - Free WHOIS privacy
   - Integrated CDN and security

4. **GoDaddy** (https://www.godaddy.com)
   - Large selection of TLDs
   - 24/7 support
   - Watch for promotional pricing

### Domain Name Suggestions

For Canna Blaze 360, consider domains like:
- `cannablaze360.com`
- `canablaze.io`
- `blaze360.app`
- `cannablaze.health`
- `mycannablaze.com`

**Tips:**
- Keep it short and memorable
- Avoid hyphens and numbers if possible
- Choose .com if available, or .io/.app for tech startups
- Check trademark availability

## Step 2: Connect Domain to Vercel

### Option A: Domain Purchased Through Vercel

1. Go to your project on Vercel dashboard
2. Navigate to **Settings** → **Domains**
3. Click **Add** or **Buy Domain**
4. Search for your desired domain
5. Complete the purchase
6. Vercel will automatically configure DNS

### Option B: External Domain (Most Common)

#### 2.1 Add Domain to Vercel

1. Open your Vercel dashboard
2. Select your Canna Blaze 360 project
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter your domain name (e.g., `cannablaze360.com`)
6. Click **Add**

#### 2.2 Configure DNS Records

Vercel will show you the DNS records to add. You'll typically need:

**For root domain (example.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain (www.example.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### 2.3 Update DNS at Your Registrar

##### Namecheap Instructions:

1. Log into Namecheap
2. Go to **Domain List** → Select your domain
3. Click **Manage** → **Advanced DNS**
4. Delete existing A and CNAME records for @ and www
5. Add the new records provided by Vercel
6. Set TTL to **Automatic** or **300** (5 minutes)
7. Click **Save All Changes**

##### Cloudflare Instructions:

1. Log into Cloudflare
2. Select your domain
3. Go to **DNS** → **Records**
4. Delete existing A and CNAME records for @ and www
5. Add new records from Vercel
6. **Important:** Click the orange cloud icon to turn it gray (DNS only mode)
7. Save changes

##### Google Domains Instructions:

1. Log into Google Domains
2. Select your domain → **DNS**
3. Scroll to **Custom resource records**
4. Add the A record for @ (root domain)
5. Add the CNAME record for www
6. Save changes

#### 2.4 Verify Domain

1. Return to Vercel dashboard
2. You'll see "DNS Configuration in Progress"
3. Click **Refresh** to check status
4. Once verified, you'll see "Valid Configuration" with a green checkmark

**Note:** DNS propagation can take 24-48 hours, though it's usually faster (15 minutes to a few hours).

## Step 3: Configure SSL Certificate

Vercel automatically provisions SSL certificates for all domains. Once your DNS is verified:

1. Vercel will automatically request an SSL certificate from Let's Encrypt
2. This usually takes 1-5 minutes
3. Your site will be accessible via HTTPS (https://yourdomain.com)

## Step 4: Update Application URLs

After your domain is connected, update these in your application:

### 4.1 Update Supabase Redirect URLs

1. Go to Supabase dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Add your new domain to **Redirect URLs**:
   ```
   https://yourdomain.com/auth/callback
   https://www.yourdomain.com/auth/callback
   ```

### 4.2 Update Environment Variables

Update `.env.local` if you have any hardcoded URLs:
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Then redeploy on Vercel for changes to take effect.

### 4.3 Update SEO Component

Update the default URL in `src/components/SEO.tsx`:
```tsx
url = "https://yourdomain.com"
```

### 4.4 Update Sitemap

Update the domain in `public/sitemap.xml`:
```xml
<loc>https://yourdomain.com/</loc>
```

## Step 5: Set Primary Domain (Optional)

If you added both the root domain and www subdomain:

1. Go to Vercel → **Settings** → **Domains**
2. Click the three dots next to your preferred domain
3. Select **Make Primary**
4. Vercel will automatically redirect from the other to the primary

**Recommendation:** Use www as primary for better CDN performance, or use root domain for cleaner branding.

## Step 6: Verify Everything Works

### Checklist:
- [ ] Domain resolves to your site (visit in browser)
- [ ] HTTPS is working (green padlock in browser)
- [ ] www redirects to root (or vice versa) if you set a primary
- [ ] Supabase authentication works
- [ ] All pages load correctly
- [ ] No mixed content warnings (HTTP resources on HTTPS site)

### Testing Commands:

**Check DNS resolution:**
```bash
dig yourdomain.com
dig www.yourdomain.com
```

**Check SSL certificate:**
```bash
curl -I https://yourdomain.com
```

## Troubleshooting

### Domain Not Resolving

**Issue:** Domain doesn't load or shows "This site can't be reached"

**Solutions:**
- Wait 24-48 hours for DNS propagation
- Verify DNS records are correct at your registrar
- Clear your browser cache and DNS cache:
  ```bash
  # Mac/Linux
  sudo dscacheutil -flushcache
  
  # Windows
  ipconfig /flushdns
  ```
- Try incognito/private browsing mode
- Check DNS propagation globally: https://www.whatsmydns.net

### SSL Certificate Error

**Issue:** "Your connection is not private" warning

**Solutions:**
- Wait a few minutes for SSL provisioning
- In Vercel, go to Domains → click domain → **Renew Certificate**
- Check that your DNS records point directly to Vercel (not through a proxy)
- If using Cloudflare, ensure orange cloud is turned OFF (gray cloud)

### Vercel Says "Invalid Configuration"

**Issue:** Vercel can't verify domain ownership

**Solutions:**
- Double-check DNS records match exactly what Vercel shows
- Remove any conflicting records (multiple A records, etc.)
- Ensure there's no trailing dot in record names
- Wait and click Refresh in Vercel

### Mixed Content Warnings

**Issue:** Some resources load over HTTP instead of HTTPS

**Solutions:**
- Update hardcoded HTTP URLs to HTTPS in your code
- Use protocol-relative URLs: `//example.com/image.jpg`
- Ensure environment variables use HTTPS

## Cost Estimates

### Domain Registration Costs

| Registrar | .com | .io | .app | Annual Renewal |
|-----------|------|-----|------|----------------|
| Namecheap | $8.88 first year | $32.88 | $19.98 | Same |
| Google Domains | $12/year | $60/year | $12/year | Same |
| Cloudflare | $9.77 | $34.67 | $14.88 | Same (at-cost) |

### Additional Costs

- **WHOIS Privacy:** $0-2.88/year (Free on Namecheap, Cloudflare)
- **Email Hosting:** $0-6/month (Google Workspace, Zoho Mail)
- **Vercel Hosting:** $0/month (Hobby plan, already included)

## Email Setup (Optional)

To get email addresses like `contact@yourdomain.com`:

### Option 1: Google Workspace
- Cost: $6/user/month
- Professional email with Gmail interface
- Setup: Add MX records from Google to your DNS

### Option 2: Zoho Mail
- Cost: Free for 1 domain, 5 users (5GB/user)
- Good free alternative
- Setup: Add MX records from Zoho to your DNS

### Option 3: Email Forwarding
- Cost: Free
- Forward `contact@yourdomain.com` to your existing email
- Setup: Add forwarder at your registrar (Namecheap, Cloudflare)

## Best Practices

1. **Enable auto-renewal** on your domain to avoid expiration
2. **Set up domain privacy/WHOIS protection** to hide personal info
3. **Use a strong password** for your domain registrar account
4. **Enable 2FA** on your registrar account
5. **Keep domain and DNS separate** (consider using Cloudflare for DNS even if you register elsewhere)
6. **Monitor expiration dates** - set calendar reminders
7. **Back up DNS records** - take screenshots or export configs

## Next Steps

Once your domain is connected:

1. Update social media profiles with new domain
2. Submit sitemap to Google Search Console
3. Set up Google Analytics with new domain
4. Update any marketing materials or business cards
5. Set up email addresses for your domain
6. Consider adding additional security (Cloudflare, security headers)

## Need Help?

- **Vercel Support:** https://vercel.com/support
- **Vercel Docs:** https://vercel.com/docs/concepts/projects/domains
- **DNS Checker:** https://www.whatsmydns.net
- **SSL Checker:** https://www.sslshopper.com/ssl-checker.html

---

**Estimated Time to Complete:** 30-60 minutes  
**Technical Difficulty:** Beginner to Intermediate  
**Cost:** $9-35/year for domain registration