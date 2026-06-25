# Domain Setup Guide for Canna Blaze 360

This guide will walk you through purchasing a custom domain and connecting it to your Vercel deployment.

## Step 1: Purchase a Domain

### Recommended Domain Registrars

**Popular Options:**
- [Namecheap](https://www.namecheap.com) - Affordable, good customer service
- [Google Domains](https://domains.google) - Simple interface, integrates with Google services
- [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/) - At-cost pricing, built-in security
- [GoDaddy](https://www.godaddy.com) - Well-known, extensive support
- [Porkbun](https://porkbun.com) - Competitive pricing, includes free WHOIS privacy

### Choosing Your Domain

1. **Search for availability** - Try variations if your first choice is taken
2. **Choose TLD wisely** - `.com` is most recognized, but `.io`, `.app`, `.health`, or `.care` could work well for cannabis/medical apps
3. **Keep it short and memorable** - Easier for users to remember and type
4. **Check trademark issues** - Ensure your domain doesn't infringe on existing trademarks
5. **Consider privacy protection** - Most registrars offer WHOIS privacy to protect your personal information

### Typical Costs
- Domain registration: $10-$15/year for `.com`
- Privacy protection: Often free or $5-$10/year
- Auto-renewal: Recommended to prevent losing your domain

## Step 2: Configure DNS Settings

Once you've purchased your domain, you need to point it to Vercel.

### Option A: Use Vercel Nameservers (Recommended)

This is the simplest approach and gives Vercel full control over DNS.

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Click "Domains"
   - Click "Add Domain"
   - Enter your domain (e.g., `cannablaze360.com`)
   - Vercel will provide nameserver addresses

2. **In Your Domain Registrar:**
   - Find "DNS Settings" or "Nameservers"
   - Replace existing nameservers with Vercel's:
     ```
     ns1.vercel-dns.com
     ns2.vercel-dns.com
     ```
   - Save changes (propagation takes 24-48 hours, usually faster)

### Option B: Use A Records (Keep Your DNS Provider)

If you want to keep your current DNS provider:

1. **In Vercel Dashboard:**
   - Add your domain
   - Vercel will show you IP addresses to use

2. **In Your DNS Provider:**
   - Add an **A record**:
     - Name: `@` (root domain)
     - Value: `76.76.21.21` (Vercel's IP)
   - Add a **CNAME record** for www:
     - Name: `www`
     - Value: `cname.vercel-dns.com`

## Step 3: Add Domain in Vercel

1. **Log into Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Navigate to your "Canna Blaze 360" project

2. **Add Domain:**
   - Click "Settings" → "Domains"
   - Click "Add Domain"
   - Enter your domain name
   - Click "Add"

3. **Configure Domain:**
   - **Root domain** (e.g., `cannablaze360.com`)
   - **www subdomain** (e.g., `www.cannablaze360.com`)
   - Choose which one is primary (Vercel will redirect the other)

4. **Verify Configuration:**
   - Vercel will automatically check DNS settings
   - You'll see status: "Valid Configuration" when ready
   - SSL certificate is automatically provisioned (free via Let's Encrypt)

## Step 4: SSL/HTTPS Setup

Vercel automatically handles SSL certificates:

- ✅ **Free SSL certificate** via Let's Encrypt
- ✅ **Automatic renewal** every 90 days
- ✅ **HTTP to HTTPS redirect** enabled by default
- ✅ **HSTS header** configured for security

No additional configuration needed!

## Step 5: Update Application Settings

After your domain is connected, update your application:

1. **Update SEO Component** (`src/components/SEO.tsx`):
   ```typescript
   const baseUrl = "https://yourdomain.com"; // Replace with your domain
   ```

2. **Update Environment Variables** (if needed):
   - Add `NEXT_PUBLIC_SITE_URL=https://yourdomain.com` to `.env.local`
   - Redeploy to apply changes

3. **Update Supabase Redirect URLs:**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Add your domain to "Site URL"
   - Add callback URL: `https://yourdomain.com/auth/callback`

## Verification Checklist

After setup, verify everything works:

- [ ] Domain resolves to your site (visit `yourdomain.com`)
- [ ] HTTPS works (green padlock in browser)
- [ ] www redirect works (if configured)
- [ ] No mixed content warnings
- [ ] Authentication works (if using Supabase Auth)
- [ ] All images and assets load correctly
- [ ] Social sharing previews work (check on Facebook/Twitter)

## Troubleshooting

### Domain Not Resolving

**Problem:** Site doesn't load after 48 hours

**Solutions:**
1. Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net)
2. Verify nameservers are correct in your registrar
3. Clear your browser cache and DNS cache:
   - Windows: `ipconfig /flushdns`
   - Mac: `sudo dscacheutil -flushcache`
   - Linux: `sudo systemd-resolve --flush-caches`

### SSL Certificate Issues

**Problem:** "Not Secure" warning in browser

**Solutions:**
1. Wait for certificate provisioning (can take 20-30 minutes)
2. Force HTTPS in Vercel project settings
3. Check for mixed content (HTTP resources on HTTPS page)

### Redirect Loop

**Problem:** Site continuously redirects

**Solutions:**
1. Check Vercel domain settings (only one should be primary)
2. Disable any conflicting redirects in `next.config.mjs`
3. Clear browser cookies and cache

### WWW vs Non-WWW

**Problem:** Want www to be primary (or vice versa)

**Solutions:**
1. In Vercel, set your preferred version as "Primary"
2. Vercel will automatically redirect the other version
3. Update SEO canonical URLs to match

## Advanced: Multiple Domains

You can point multiple domains to your Vercel project:

1. Add each domain in Vercel Dashboard
2. All domains will serve the same content
3. Set one as primary for SEO
4. Vercel redirects other domains to primary (301 redirect)

**Example:**
- Primary: `cannablaze360.com`
- Aliases: `cannablaze.com`, `blaze360.com`
- All aliases → redirect to primary

## Cost Summary

### Initial Costs
- Domain registration: $10-$15/year
- Privacy protection: Usually included free
- **Total Year 1:** ~$10-$15

### Ongoing Costs
- Domain renewal: $10-$15/year (enable auto-renewal)
- Vercel hosting: Free tier available (Pro: $20/month if needed)
- SSL certificate: **FREE** (included with Vercel)

### Cost Comparison
- **With Vercel:** Domain only (~$15/year)
- **Traditional Hosting:** Domain + hosting + SSL ($100-200/year)
- **Savings:** ~$85-185/year with Vercel

## Support Resources

- **Vercel Domain Docs:** [vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)
- **DNS Propagation Checker:** [whatsmydns.net](https://www.whatsmydns.net)
- **SSL Checker:** [ssllabs.com/ssltest](https://www.ssllabs.com/ssltest)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)

## Quick Reference

### DNS Records (Option B)
```
Type    Name    Value
A       @       76.76.21.21
CNAME   www     cname.vercel-dns.com
```

### Vercel Nameservers (Option A)
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Timeline
- Domain purchase: Instant
- DNS propagation: 24-48 hours (often 1-4 hours)
- SSL certificate: 20-30 minutes after DNS resolves
- **Total:** Usually ready within 2-6 hours

---

**Need Help?** Contact Vercel support or your domain registrar's support team if you encounter issues not covered in this guide.