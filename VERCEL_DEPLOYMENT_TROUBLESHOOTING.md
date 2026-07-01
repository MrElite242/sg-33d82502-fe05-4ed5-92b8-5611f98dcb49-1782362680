# Vercel Deployment Error: Invalid --token CSS Variable

## Error Message
```
Error: You defined "--token", but its contents are invalid. Must not contain: "@"
Learn More: https://err.sh/vercel/invalid-token-value
```

## Root Cause Analysis
This error occurs when Vercel's CSS parser encounters a CSS custom property (variable) named `--token` that contains an "@" symbol, which is not allowed in CSS variable values.

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

## Prevention

### Best Practices
1. **Never use "@" in CSS variable values** - It's not supported by CSS spec
2. **Use HSL format without @ symbols**: `--color: 220 90% 56%` (✓) not `--color: #fff @ 0.5` (✗)
3. **Avoid email addresses or handles in CSS** - These often contain @
4. **Test builds locally before deploying** - Catch issues early with `npm run build`

### Monitoring
Add this to your CI/CD:
```bash
# Fail if any CSS contains problematic tokens
if grep -r "\-\-token.*@" src/; then
  echo "Error: CSS variable contains invalid @ symbol"
  exit 1
fi
```

## Still Stuck?

### Check Vercel Status
- Visit [Vercel Status Page](https://www.vercel-status.com/)
- Check if there's a platform-wide issue

### Contact Support
If you've tried all steps and still get this error:
1. Collect build logs from Vercel dashboard
2. Note your project ID and deployment ID
3. Contact [Vercel Support](https://vercel.com/support)
4. Reference this error code: `invalid-token-value`

### Quick Debug Checklist
- [ ] Cleared Vercel build cache
- [ ] Local build succeeds (`npm run build`)
- [ ] No `--token` variables in src/styles/globals.css
- [ ] No `--token` variables in tailwind.config.ts
- [ ] No `--token` variables in component files
- [ ] Tried force deployment with empty commit
- [ ] Checked for dependency CSS issues
- [ ] Verified environment variables are correct

## Reference
- [Vercel CSS Error Documentation](https://err.sh/vercel/invalid-token-value)
- [CSS Custom Properties Spec](https://www.w3.org/TR/css-variables-1/)