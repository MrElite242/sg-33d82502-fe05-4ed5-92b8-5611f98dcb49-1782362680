<![CDATA[# Connecting cannablaze360.com to Vercel

## Complete Domain Setup Guide

This guide walks you through connecting your custom domain **cannablaze360.com** to your Vercel-hosted Canna Blaze 360 application.

---

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] Access to your domain registrar account (where you purchased cannablaze360.com)
- [ ] Access to your Vercel account with this project deployed
- [ ] Project successfully deployed on Vercel (check for a `.vercel.app` URL)

---

## 🚀 Step-by-Step Setup

### Step 1: Add Domain in Vercel Dashboard

1. **Navigate to your project:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Select your "Canna Blaze 360" project

2. **Open Domain Settings:**
   - Click on the "Settings" tab
   - Select "Domains" from the left sidebar

3. **Add your domain:**
   - In the "Add Domain" field, enter: `cannablaze360.com`
   - Click "Add"

4. **Add www subdomain (recommended):**
   - Also add: `www.cannablaze360.com`
   - Click "Add"
   - Vercel will automatically set up redirects from www to the apex domain

### Step 2: Configure DNS Records

Vercel will show you the DNS records you need to add. There are two methods:

#### **Method A: Nameservers (Recommended - Easier)**

If Vercel offers nameserver configuration:

1. **Get Vercel nameservers:**
   - Vercel will display 2 nameserver addresses
   - Example: `ns1.vercel-dns.com` and `ns2.vercel-dns.com`

2. **Update at your registrar:**
   - Log into your domain registrar (GoDaddy, Namecheap, Google Domains, etc.)
   - Find "Nameservers" or "DNS Settings"
   - Replace existing nameservers with Vercel's nameservers
   - Save changes

3. **Wait for propagation:**
   - DNS changes can take 24-48 hours (usually much faster)
   - Vercel will automatically handle all DNS configuration

#### **Method B: A Record and CNAME (Manual)**

If you prefer to keep your existing nameservers:

1. **For apex domain (cannablaze360.com):**
   - Add an `A` record:
     - **Type:** A
     - **Name:** @ (or leave blank, or "cannablaze360.com")
     - **Value:** `76.76.21.21` (Vercel's IP address)
     - **TTL:** Automatic or 3600

2. **For www subdomain (www.cannablaze360.com):**
   - Add a `CNAME` record:
     - **Type:** CNAME
     - **Name:** www
     - **Value:** `cname.vercel-dns.com`
     - **TTL:** Automatic or 3600

3. **Save DNS records** at your registrar

### Step 3: Verify Domain

1. **Back in Vercel Dashboard:**
   - Wait a few minutes after updating DNS
   - Click "Refresh" next to your domain
   - Vercel will verify the DNS configuration

2. **Check for confirmation:**
   - Status should change to "Valid Configuration" with a green checkmark
   - SSL certificate will be automatically issued (may take a few minutes)

### Step 4: Set Primary Domain (Optional)

1. **In Vercel Domain Settings:**
   - Find your domains list
   - Click the three dots (•••) next to `cannablaze360.com`
   - Select "Set as Primary"
   - This ensures all `.vercel.app` URLs redirect to your custom domain

---

## 🔍 Verification Steps

After setup is complete, verify everything works:

### Test Domain Access
```bash
# Test apex domain
curl -I https://cannablaze360.com

# Test www subdomain
curl -I https://www.cannablaze360.com

# Check SSL certificate
openssl s_client -connect cannablaze360.com:443 -servername cannablaze360.com
```

### Browser Checks
- [ ] Visit `https://cannablaze360.com` - should load your application
- [ ] Visit `https://www.cannablaze360.com` - should redirect to apex domain
- [ ] Check SSL certificate (green padlock icon in browser)
- [ ] Test on mobile devices
- [ ] Check in incognito/private mode

### SEO Verification
- [ ] Check robots.txt: `https://cannablaze360.com/robots.txt`
- [ ] Check sitemap: `https://cannablaze360.com/sitemap.xml`
- [ ] Verify Open Graph preview with [OpenGraph.xyz](https://www.opengraph.xyz/)
- [ ] Test Twitter Card with [Twitter Card Validator](https://cards-dev.twitter.com/validator)

---

## 🛠️ Registrar-Specific Guides

### GoDaddy
1. Log into GoDaddy
2. Go to "My Products" → "Domains"
3. Click "DNS" next to your domain
4. Add A record: `@` → `76.76.21.21`
5. Add CNAME: `www` → `cname.vercel-dns.com`

### Namecheap
1. Log into Namecheap
2. Dashboard → "Domain List" → "Manage"
3. Advanced DNS → Add New Record
4. Add A record: `@` → `76.76.21.21`
5. Add CNAME: `www` → `cname.vercel-dns.com`

### Google Domains
1. Log into Google Domains
2. Select your domain
3. DNS → Custom Records
4. Add A record: blank → `76.76.21.21`
5. Add CNAME: `www` → `cname.vercel-dns.com`

### Cloudflare
1. Log into Cloudflare
2. Select your domain
3. DNS → Add Record
4. Add A record: `@` → `76.76.21.21`, **Proxy off (grey cloud)**
5. Add CNAME: `www` → `cname.vercel-dns.com`, **Proxy off**
6. ⚠️ Important: Disable Cloudflare proxy for Vercel domains

---

## ⚠️ Common Issues & Solutions

### Domain Not Verifying
**Symptom:** "Invalid Configuration" in Vercel

**Solutions:**
1. Wait 5-10 minutes after DNS changes (propagation time)
2. Check DNS with: `nslookup cannablaze360.com`
3. Verify A record points to `76.76.21.21`
4. Verify CNAME points to `cname.vercel-dns.com`
5. Clear DNS cache on your computer:
   - **Windows:** `ipconfig /flushdns`
   - **Mac:** `sudo dscacheutil -flushcache`
   - **Linux:** `sudo systemd-resolve --flush-caches`

### SSL Certificate Error
**Symptom:** "Your connection is not private" or SSL warning

**Solutions:**
1. Wait 10-15 minutes for SSL certificate generation
2. Clear browser cache
3. Try incognito/private mode
4. If persists after 1 hour, remove and re-add domain in Vercel

### DNS Propagation Taking Too Long
**Symptom:** Domain still not working after 24 hours

**Solutions:**
1. Check DNS propagation globally: [whatsmydns.net](https://www.whatsmydns.net/)
2. Verify DNS records are correct at registrar
3. Lower TTL value to 300 seconds before making changes
4. Contact your domain registrar support

### Cloudflare Conflicts
**Symptom:** Domain verified but site not loading properly

**Solutions:**
1. Turn off Cloudflare proxy (orange cloud → grey cloud)
2. Disable Cloudflare's "Always Use HTTPS" temporarily
3. Check SSL/TLS settings in Cloudflare (should be "Full" not "Flexible")

### Redirect Loop
**Symptom:** Browser shows "too many redirects" error

**Solutions:**
1. Clear browser cache and cookies
2. Check if you have multiple A records for the same domain
3. Remove duplicate CNAME records
4. Disable any CDN/proxy in front of Vercel

---

## 🔐 Security Best Practices

After domain is connected:

1. **Force HTTPS:**
   - Vercel automatically redirects HTTP → HTTPS
   - No additional configuration needed

2. **Security Headers:**
   - Vercel provides security headers by default
   - Check with [securityheaders.com](https://securityheaders.com)

3. **Regular SSL Certificate Renewal:**
   - Vercel automatically renews Let's Encrypt certificates
   - No action required on your part

4. **Monitor Domain:**
   - Set up Google Search Console for `cannablaze360.com`
   - Enable uptime monitoring (UptimeRobot, Pingdom)

---

## 📊 Post-Setup SEO Tasks

Once your domain is live:

### 1. Submit to Search Engines
- **Google Search Console:**
  1. Add property for `https://cannablaze360.com`
  2. Verify ownership via DNS TXT record
  3. Submit sitemap: `https://cannablaze360.com/sitemap.xml`
  
- **Bing Webmaster Tools:**
  1. Add and verify your site
  2. Submit sitemap
  3. Enable URL inspection

### 2. Social Media Configuration
- Update social media profile links to use new domain
- Test Open Graph previews with Facebook Sharing Debugger
- Test Twitter Card previews

### 3. Update Third-Party Services
- Update domain in Supabase Auth settings
- Update redirect URIs for any OAuth providers
- Update webhooks or API callbacks
- Update analytics tracking (Google Analytics, Mixpanel, etc.)

---

## 📞 Need Help?

### Vercel Support
- **Docs:** [vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)
- **Support:** [vercel.com/support](https://vercel.com/support)

### DNS Troubleshooting Tools
- **DNS Checker:** [dnschecker.org](https://dnschecker.org/)
- **What's My DNS:** [whatsmydns.net](https://www.whatsmydns.net/)
- **DNS Lookup:** `nslookup cannablaze360.com`
- **Dig Command:** `dig cannablaze360.com`

### Common Commands
```bash
# Check DNS A record
dig cannablaze360.com A

# Check DNS CNAME record
dig www.cannablaze360.com CNAME

# Test HTTPS connection
curl -I https://cannablaze360.com

# Check SSL certificate details
echo | openssl s_client -connect cannablaze360.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## ✅ Setup Completion Checklist

Once everything is configured:

- [ ] Domain added in Vercel dashboard
- [ ] DNS records configured at registrar
- [ ] Domain verified in Vercel (green checkmark)
- [ ] SSL certificate issued (https works)
- [ ] Both apex and www domains work
- [ ] robots.txt accessible
- [ ] sitemap.xml accessible
- [ ] Google Search Console setup
- [ ] Social media previews working
- [ ] All environment variables configured
- [ ] Supabase auth redirect URLs updated

**Congratulations! Your domain is now live at https://cannablaze360.com** 🎉

---

**Last Updated:** 2026-07-01
**Domain:** cannablaze360.com
**Hosting:** Vercel
**SSL:** Automatic (Let's Encrypt)
</file_contents>
