#!/bin/bash
# PRODUCTION DEPLOYMENT SCRIPT
# This script removes testing mode and deploys the fix to production

set -e  # Exit on any error

echo "=========================================="
echo "PRODUCTION DEPLOYMENT - TESTING MODE FIX"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check we're in the right directory
if [ ! -f "ecosystem.config.js" ]; then
  echo -e "${RED}Error: ecosystem.config.js not found. Please run this script from /root/iiskills-cloud${NC}"
  exit 1
fi

echo -e "${YELLOW}Step 1: Checking for .env files with local content mode...${NC}"
LOCAL_CONTENT_FILES=$(find . -name ".env*" -type f ! -name "*.example" -exec grep -l "NEXT_PUBLIC_USE_LOCAL_CONTENT.*true" {} \; 2>/dev/null || true)
if [ -n "$LOCAL_CONTENT_FILES" ]; then
  echo -e "${RED}Warning: Found .env files with NEXT_PUBLIC_USE_LOCAL_CONTENT=true:${NC}"
  echo "$LOCAL_CONTENT_FILES"
  echo -e "${YELLOW}Please review these files before continuing.${NC}"
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
else
  echo -e "${GREEN}✓ No .env files with local content mode found${NC}"
fi

echo ""
echo -e "${YELLOW}Step 2: Pulling latest changes...${NC}"
if git pull origin main 2>/dev/null || git pull origin master 2>/dev/null; then
  echo -e "${GREEN}✓ Git pull successful${NC}"
else
  echo -e "${YELLOW}⚠ Git pull failed - using current local version${NC}"
  read -p "Continue with current code? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 1
  fi
fi

echo ""
echo -e "${YELLOW}Step 3: Cleaning .next build caches...${NC}"

# Clean main app
if [ -d "apps/main/.next" ]; then
  echo "Cleaning apps/main/.next"
  rm -rf apps/main/.next
fi

# Clean coming-soon app
if [ -d "coming-soon/.next" ]; then
  echo "Cleaning coming-soon/.next"
  rm -rf coming-soon/.next
fi

# Clean all learning apps
for app in learn-ai learn-apt learn-chemistry learn-cricket learn-data-science \
           learn-geography learn-govt-jobs learn-ias learn-jee learn-leadership \
           learn-management learn-math learn-neet learn-physics learn-pr learn-winning; do
  if [ -d "$app/.next" ]; then
    echo "Cleaning $app/.next"
    rm -rf "$app/.next"
  fi
done

echo -e "${GREEN}✓ All .next directories cleaned${NC}"

echo ""
echo -e "${YELLOW}Step 4: Installing dependencies...${NC}"
yarn install

echo ""
echo -e "${YELLOW}Step 5: Building all apps...${NC}"
yarn build || {
  echo -e "${RED}Build failed. Please check the error messages above.${NC}"
  exit 1
}

echo -e "${GREEN}✓ Build completed${NC}"

echo ""
echo -e "${YELLOW}Step 6: Updating PM2 processes...${NC}"

# Ask user which method to use
echo "Choose PM2 update method:"
echo "1) Restart all apps (recommended - faster)"
echo "2) Stop, delete, and restart all apps (clean slate)"
read -p "Enter choice [1 or 2]: " -r PM2_CHOICE

if [[ "$PM2_CHOICE" == "2" ]]; then
  echo "Stopping all PM2 processes..."
  pm2 stop all
  
  echo "Deleting all PM2 processes..."
  pm2 delete all
  
  echo "Starting apps with new configuration..."
  pm2 start ecosystem.config.js
elif [[ "$PM2_CHOICE" == "1" ]]; then
  echo "Restarting all PM2 processes..."
  pm2 restart all
else
  echo -e "${YELLOW}Invalid choice. Defaulting to restart (option 1)...${NC}"
  pm2 restart all
fi

echo "Saving PM2 configuration..."
pm2 save

echo ""
echo -e "${GREEN}✓ PM2 processes updated${NC}"

echo ""
echo -e "${YELLOW}Step 7: Verifying deployment...${NC}"

# Show PM2 status
pm2 status

echo ""
echo -e "${YELLOW}Checking environment variables for sample apps...${NC}"

for app in iiskills-main iiskills-learn-jee iiskills-learn-ai; do
  echo ""
  echo "=== $app ==="
  pm2 show "$app" 2>/dev/null | grep -A 20 "│ env" | head -25 || echo "App not found or env not available"
done

echo ""
echo "=========================================="
echo -e "${GREEN}DEPLOYMENT COMPLETE!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Check PM2 logs for errors: pm2 logs --err"
echo "2. Test authentication on apps (should require login)"
echo "3. Verify paywalls are active"
echo "4. Monitor logs: pm2 logs"
echo ""
echo "If you encounter issues, see PRODUCTION_DEPLOYMENT.md for troubleshooting"
echo ""
