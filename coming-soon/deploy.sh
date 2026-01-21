#!/bin/bash

# Deploy Coming Soon Apps Landing Page
# This script builds and deploys the coming-soon app independently

set -e

echo "🚀 Deploying Coming Soon Apps Landing Page..."

# Navigate to coming-soon directory
cd "$(dirname "$0")"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🔨 Building production version..."
npm run build

# Start with PM2
echo "⚡ Starting with PM2..."
pm2 start ../ecosystem.config.js --only iiskills-coming-soon

# Save PM2 configuration
pm2 save

echo "✅ Coming Soon app deployed successfully!"
echo "🌐 Running on port 3019"
echo ""
echo "To check status: pm2 status iiskills-coming-soon"
echo "To view logs: pm2 logs iiskills-coming-soon"
echo "To stop: pm2 stop iiskills-coming-soon"
echo ""
echo "Next steps:"
echo "1. Configure Nginx reverse proxy for coming-soon.iiskills.cloud"
echo "2. Setup SSL with: sudo certbot --nginx -d coming-soon.iiskills.cloud"
