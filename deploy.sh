#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo -e "${BOLD}${CYAN}========================================${NC}"
echo -e "${BOLD}${CYAN}iiskills-cloud Deployment${NC}"
echo -e "${BOLD}${CYAN}========================================${NC}"
echo ""

# Step 1: Pre-deployment validation
echo -e "${CYAN}Step 1/7: Pre-deployment validation${NC}"
if [ -f "scripts/validate-env.js" ]; then
  node scripts/validate-env.js
  if [ $? -ne 0 ]; then
    echo -e "${RED}Pre-deployment validation failed!${NC}"
    echo -e "${RED}Fix the errors above before deploying.${NC}"
    exit 1
  fi
else
  echo -e "${YELLOW}⚠️  Warning: scripts/validate-env.js not found, skipping env validation${NC}"
fi
echo ""

# Step 2: Pull latest code
echo -e "${CYAN}Step 2/7: Pulling latest code from Git${NC}"
git pull
echo ""

# Step 3: Install dependencies
echo -e "${CYAN}Step 3/7: Installing dependencies${NC}"
yarn install
echo ""

# Step 4: Clean build directories
echo -e "${CYAN}Step 4/7: Cleaning build directories${NC}"
# Clean .next directories for main app
if [ -d "apps/main/.next" ]; then
  echo "Removing apps/main/.next..."
  rm -rf apps/main/.next
fi
echo "Build directories cleaned"
echo ""

# Step 5: Build all apps
echo -e "${CYAN}Step 5/7: Building all apps${NC}"
yarn workspaces foreach -A run build

# Verify build output
echo -e "${CYAN}Verifying build output...${NC}"
BUILD_FAILURES=0

# Only verify main app as it contains the universal admin dashboard
if [ ! -d "apps/main/.next" ]; then
  echo -e "${RED}✗ Build failed for apps/main - no .next directory${NC}"
  BUILD_FAILURES=$((BUILD_FAILURES + 1))
else
  echo -e "${GREEN}✓ Build succeeded for apps/main${NC}"
fi

if [ $BUILD_FAILURES -gt 0 ]; then
  echo -e "${RED}Build verification failed!${NC}"
  exit 1
fi
echo ""

# Step 6: Start/restart PM2 processes
echo -e "${CYAN}Step 6/7: Starting/restarting all apps via PM2${NC}"
pm2 start ecosystem.config.js --update-env

echo -e "${CYAN}Saving PM2 process list for restart on reboot${NC}"
pm2 save
echo ""

# Step 7: Post-deployment health check
echo -e "${CYAN}Step 7/7: Post-deployment health check${NC}"
if [ -f "scripts/post-deploy-check.sh" ]; then
  ./scripts/post-deploy-check.sh --wait
  if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️  Post-deployment checks reported issues${NC}"
    echo -e "${YELLOW}Review the output above and check application logs${NC}"
    echo ""
  fi
else
  echo -e "${YELLOW}⚠️  Warning: scripts/post-deploy-check.sh not found${NC}"
fi

echo ""
echo -e "${BOLD}${GREEN}========================================${NC}"
echo -e "${BOLD}${GREEN}✅ Deployment Complete!${NC}"
echo -e "${BOLD}${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo "  - Check application health: ./monitor-apps.sh"
echo "  - View logs: pm2 logs"
echo "  - View specific app: pm2 logs <app-name>"
echo ""
