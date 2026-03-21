#!/bin/bash
set -e

echo "🚀 EasyEnglish Deploy Script"
echo "============================"

# 1. Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# 2. Install dependencies
echo "📦 Installing dependencies..."
npm install --production=false

# 3. Build
echo "🔨 Building apps..."
npm run build

# 4. Push database schema
echo "🗄️ Pushing database schema..."
NODE_ENV=production npx drizzle-kit push

# 5. Restart PM2
echo "🔄 Restarting PM2 apps..."
pm2 delete ecosystem.config.js 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save

echo "✅ Deploy completed!"
echo ""
pm2 status
