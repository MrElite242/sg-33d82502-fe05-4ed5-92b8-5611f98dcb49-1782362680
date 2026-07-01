# Vercel Deployment Error: Invalid --token CSS Variable

## Error Message
```
Error: You defined "--token", but its contents are invalid. Must not contain: "@"
Learn More: https://err.sh/vercel/invalid-token-value
```

## ⚠️ EMERGENCY FIX - Persistent Token Error

If this error persists after clearing cache (source files are verified clean), use this nuclear approach:

### Option 1: Force Clean Deployment via Vercel CLI

```bash
# 1. Clear local build artifacts
rm -rf .next
rm -rf node_modules
rm -rf .vercel

# 2. Reinstall dependencies
npm install

# 3. Test local build
npm run build

# 4. If local build succeeds, deploy with force flag
npx vercel --prod --force
```

### Option 2: Create Fresh Vercel Project

If cache clearing fails, create a new Vercel project:

1. **Disconnect current project:**
   - Vercel Dashboard → Settings → General → Delete Project (or disconnect)

2. **Create new project:**
   - Push latest code to GitHub
   - Vercel Dashboard → Add New → Project
   - Import your repository (fresh connection)
   - Add environment variables (Supabase)
   - Deploy

### Option 3: Vercel Dashboard Nuclear Reset

1. **Settings → General:**
   - Clear Build Cache (green button)
   - Scroll to "Danger Zone"
   - Click "Clear Cache and Redeploy"

2. **Settings → Build & Development:**
   - Override build command temporarily: `rm -rf .next && npm run build`
   - Trigger new deployment
   - Revert build command after successful deploy

## Root Cause Analysis

This error appears when:
- **Vercel's build cache contains corrupted CSS** from a previous broken build
- **PostCSS/Tailwind processing generates invalid tokens** (rare, but possible)
- **A dependency injects invalid CSS** during build (check node_modules updates)

## Verified Clean Files

✅ `src/styles/globals.css` - No `--token` variable, no invalid "@" symbols
✅ `tailwind.config.ts` - Clean configuration
✅ All component files - No inline styles with invalid tokens

The source code is clean - this is a **build pipeline issue**, not a code issue.

## Prevention

After successful deployment:

1. **Lock your dependencies:** Run `npm ci` instead of `npm install` in production
2. **Cache CSS separately:** Consider using a CDN for static assets
3. **Monitor builds:** Set up Vercel deployment notifications to catch issues early

## Still Stuck?

If all options fail:
1. Export your Supabase schema/data
2. Clone repository to new directory
3. Fresh `npm install`
4. Create new Vercel project from scratch
5. Import Supabase data

This is the nuclear option but guarantees a clean slate.

## Solution Steps

### 1. Clear Vercel Build Cache (Recommended First Step)
**Via Vercel Dashboard:**
1. Go to your Vercel project dashboard
2. Click on **Settings** → **General**
3. Scroll down to **Build & Development Settings**
4. Click **Clear Build Cache**
5. Trigger a new deployment

**Via Vercel CLI:**
```bash
vercel --force
```

### 2. Check for Problematic CSS in Dependencies
Some UI libraries inject CSS at build time. Check these:
```bash
# Search node_modules for --token usage
grep -r "\-\-token" node_modules/ 2>/dev/null | grep -v ".map"

# Check if shadcn/ui components have this
grep -r "\-\-token" src/components/ui/ 2>/dev/null
```

### 3. Verify Local Build Works
Test locally to isolate if this is Vercel-specific:
```bash
npm run build
```

If local build succeeds but Vercel fails, it's likely a caching issue.

### 4. Force Clean Deployment
**Option A: Delete and Recreate Deployment**
1. In Vercel dashboard, go to **Deployments**
2. Delete the failed deployment
3. Push a new commit to trigger fresh build:
```bash
git commit --allow-empty -m "Force rebuild"
git push
```

**Option B: Use Different Branch**
1. Create a clean branch:
```bash
git checkout -b vercel-fix
git push -u origin vercel-fix
```
2. In Vercel, switch production branch to `vercel-fix`
3. Trigger deployment

### 5. Check Environment-Specific CSS
If you have any environment-specific styles, verify they don't contain `--token`:
```bash
# Check for inline styles or dynamic CSS
grep -r "token.*@" src/ 2>/dev/null
grep -r "style.*--token" src/ 2>/dev/null
```

### 6. Nuclear Option: Fresh Vercel Project
If nothing works, recreate the Vercel project:
1. Disconnect current project from GitHub/Git
2. Delete the Vercel project
3. Create a new Vercel project and reconnect to your repository
4. Configure environment variables from scratch
5. Deploy

## Monitoring
Add this to your CI/CD:
```bash
# Fail if any CSS contains problematic tokens
if grep -r "\-\-token.*@" src/; then
  echo "Error: CSS variable contains invalid @ symbol"
  exit 1
fi
```

## Reference
- [Vercel CSS Error Documentation](https://err.sh/vercel/invalid-token-value)
- [CSS Custom Properties Spec](https://www.w3.org/TR/css-variables-1/)