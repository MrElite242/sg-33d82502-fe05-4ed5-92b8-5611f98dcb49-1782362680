#!/bin/bash
# Emergency deployment fix for persistent Vercel CSS token error
# Run this locally, then deploy via Vercel CLI

echo "🚨 EMERGENCY DEPLOYMENT FIX"
echo "=========================="
echo ""

# Step 1: Backup environment variables
echo "📋 Step 1: Backup your .env.local file (if exists)"
if [ -f .env.local ]; then
    cp .env.local .env.local.backup
    echo "✅ Backed up to .env.local.backup"
else
    echo "⚠️  No .env.local found"
fi
echo ""

# Step 2: Nuclear clean
echo "💥 Step 2: Nuclear clean (removing all build artifacts)"
rm -rf .next
rm -rf node_modules
rm -rf .vercel
rm -rf package-lock.json
echo "✅ Cleaned: .next, node_modules, .vercel, package-lock.json"
echo ""

# Step 3: Fresh install
echo "📦 Step 3: Fresh npm install"
npm install
echo "✅ Dependencies reinstalled"
echo ""

# Step 4: Test build
echo "🔨 Step 4: Testing local build"
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Local build successful!"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Deploy via Vercel CLI: npx vercel --prod --force"
    echo "2. Or push to GitHub and let Vercel auto-deploy"
    echo "3. Monitor deployment logs carefully"
else
    echo "❌ Local build failed - check errors above"
    exit 1
fi
