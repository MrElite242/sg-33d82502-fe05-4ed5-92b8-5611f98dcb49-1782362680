# Vercel + Supabase Environment Variables Setup Guide

## ⚠️ CRITICAL: Authentication Will Fail Without These Variables

If you see errors like:
- "Failed to fetch"
- "Invalid Supabase URL" 
- Network errors on login/signup
- "placeholder.supabase.co" in error messages

**You MUST configure these environment variables immediately.**

---

## Quick Fix for Deployment Error

If you're seeing: **"Error: Missing Supabase environment variables"** during Vercel deployment, follow these steps:

---

## Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **Settings** (gear icon) in the left sidebar
4. Navigate to **API** section
5. Copy these two values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **Anon/Public Key** (long string starting with `eyJ...`)

⚠️ **Important:** Use the **anon** key, NOT the **service_role** key. The service_role key should never be exposed in client-side code.

---

## Step 2: Add Variables to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (Canna Blaze 360)
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar
5. Add the following variables:

   **Variable 1:**
   - **Key:** `NEXT_PUBLIC_SUPABASE_URL`
   - **Value:** Your Project URL from Step 1
   - **Environments:** Check all three: Production, Preview, Development
   - Click **Save**

   **Variable 2:**
   - **Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value:** Your Anon/Public Key from Step 1
   - **Environments:** Check all three: Production, Preview, Development
   - Click **Save**

6. **Redeploy** your project:
   - Go to **Deployments** tab
   - Click the **⋮** menu on the latest deployment
   - Select **Redeploy**

### Option B: Via Vercel CLI

If you prefer using the command line:

```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Link your project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Paste your Anon Key when prompted

# Pull the environment variables locally
vercel env pull

# Redeploy
vercel --prod
```

---

## Step 3: Verify the Setup

After redeployment:

1. Visit your deployed site
2. Open browser DevTools (F12)
3. Go to Console tab
4. Type: `console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)`
5. You should see your Supabase URL (not `undefined`)

---

## Environment Variable Best Practices

### ✅ DO:
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Set variables in all three environments (Production, Preview, Development)
- Use the **anon** key for public client access
- Keep the **service_role** key secret (never in client code)
- Document your environment variables in this file

### ❌ DON'T:
- Commit `.env.local` to Git (it's in `.gitignore`)
- Use the service_role key in client-side code
- Hardcode credentials in your code
- Share your keys publicly

---

## Understanding Environment Types

Vercel has three environment types:

| Environment | When It's Used | Purpose |
|------------|----------------|---------|
| **Production** | Main branch deployments (e.g., `main`, `master`) | Live site for users |
| **Preview** | Pull request and branch deployments | Testing before merging |
| **Development** | `vercel dev` command locally | Local development |

💡 **Tip:** Set variables for all three environments to avoid issues.

---

## Troubleshooting

### Error: "Missing Supabase environment variables"
**Cause:** Environment variables not set in Vercel  
**Fix:** Follow Step 2 above and redeploy

### Error: "Invalid Supabase URL"
**Cause:** Incorrect URL format or wrong value  
**Fix:** Double-check the Project URL in Supabase Dashboard → Settings → API

### Error: "Unauthorized" or "Invalid API key"
**Cause:** Wrong key or using service_role instead of anon  
**Fix:** Verify you copied the **anon** key, not service_role

### Variables Not Updating After Deployment
**Cause:** Environment variables are cached  
**Fix:** 
1. Update the variables in Vercel Settings
2. Go to Deployments → Latest Deployment → ⋮ → Redeploy
3. **Important:** A simple Git push won't update the environment variables

### Working Locally But Not on Vercel
**Cause:** `.env.local` file exists locally but not synced to Vercel  
**Fix:** Environment variables must be added separately in Vercel (they don't sync from your local `.env.local`)

---

## Local Development Setup

For local development, create a `.env.local` file in your project root:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Never commit this file to Git!** It's already in `.gitignore`.

---

## Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Environment Variables Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

## Quick Reference

### Required Variables for This Project

| Variable Name | Where to Find | Used For |
|--------------|---------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL | Database connection |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → Anon/Public Key | Client authentication |

### Optional Variables (Add as Needed)

| Variable Name | Purpose | When to Add |
|--------------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Your production URL | For OAuth redirects |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side operations | Only for API routes (NEVER client-side) |

---

## Need Help?

If you're still experiencing issues:

1. Check that both variables are set in Vercel Settings → Environment Variables
2. Verify you're using the **anon** key (starts with `eyJ...`)
3. Ensure you've redeployed after adding the variables
4. Check the Vercel deployment logs for specific error messages

**Still stuck?** Contact Vercel support or check the [Vercel Status Page](https://www.vercel-status.com/).

---

## Common Deployment Errors

### Error: Missing Supabase Environment Variables
See the steps above to configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### Error: Invalid CSS Token
If you encounter CSS-related deployment errors (like "invalid --token value"), refer to **VERCEL_DEPLOYMENT_TROUBLESHOOTING.md** for detailed solutions.

### Error: Build Failed
1. Check build logs in Vercel dashboard
2. Verify all dependencies are installed: `npm install`
3. Test local build: `npm run build`
4. Clear Vercel build cache and redeploy