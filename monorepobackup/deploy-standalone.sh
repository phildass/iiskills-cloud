#!/bin/bash
#
# Standalone Build & Deploy Script
# This script builds all Next.js apps and sets up PM2 deployment
#

set -e  # Exit on error

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Standalone Build & Deploy Script ===${NC}"
echo ""

# Step 1: Install dependencies
echo -e "${YELLOW}Step 1: Installing dependencies...${NC}"
if ! command -v corepack &> /dev/null; then
    echo "Enabling Corepack..."
    corepack enable
fi
yarn install
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 2: Build all apps
echo -e "${YELLOW}Step 2: Building all apps...${NC}"
echo "This may take a few minutes..."
yarn build
echo -e "${GREEN}✓ All apps built${NC}"
echo ""

# Step 3: Setup standalone deployments
echo -e "${YELLOW}Step 3: Setting up standalone deployments...${NC}"

for app_dir in "$REPO_ROOT/apps"/*; do
  if [ -d "$app_dir" ]; then
    app_name=$(basename "$app_dir")
    standalone_dir="$app_dir/.next/standalone/apps/$app_name"
    
    if [ -d "$standalone_dir" ]; then
      echo "  Setting up $app_name..."
      
      # Copy .env.local
      if [ -f "$app_dir/.env.local" ]; then
        cp "$app_dir/.env.local" "$standalone_dir/.env.local"
      fi
      
      # Copy public folder
      if [ -d "$app_dir/public" ]; then
        cp -r "$app_dir/public" "$standalone_dir/public"
      fi
      
      # Copy .next/static
      if [ -d "$app_dir/.next/static" ]; then
        mkdir -p "$standalone_dir/.next"
        cp -r "$app_dir/.next/static" "$standalone_dir/.next/static"
      fi
    fi
  fi
done

echo -e "${GREEN}✓ Standalone deployments configured${NC}"
echo ""

# Step 4: Create logs directory
echo -e "${YELLOW}Step 4: Creating logs directory...${NC}"
mkdir -p "$REPO_ROOT/logs"
echo -e "${GREEN}✓ Logs directory created${NC}"
echo ""

# Step 5: Check if PM2 is installed
echo -e "${YELLOW}Step 5: Checking PM2 installation...${NC}"
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 not found. Installing PM2 globally...${NC}"
    npm install -g pm2
    echo -e "${GREEN}✓ PM2 installed${NC}"
else
    echo -e "${GREEN}✓ PM2 already installed${NC}"
fi
echo ""

# Step 6: Start apps with PM2
echo -e "${YELLOW}Step 6: Starting apps with PM2...${NC}"
pm2 start ecosystem.config.js
echo -e "${GREEN}✓ All apps started${NC}"
echo ""

# Step 7: Save PM2 process list
echo -e "${YELLOW}Step 7: Saving PM2 process list...${NC}"
pm2 save
echo -e "${GREEN}✓ PM2 process list saved${NC}"
echo ""

# Step 8: Display status
echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo ""
echo "All apps are now running. Use the following commands to manage them:"
echo ""
echo "  View status:    pm2 status"
echo "  View logs:      pm2 logs"
echo "  Monitor:        pm2 monit"
echo "  Stop all:       pm2 stop all"
echo "  Restart all:    pm2 restart all"
echo ""
echo "Active App URLs:"
echo "  Main:            http://localhost:3000"
echo "  Learn AI:        http://localhost:3024"
echo "  Learn Apt:       http://localhost:3002"
echo "  Learn Chemistry: http://localhost:3005"
echo "  Learn Developer: http://localhost:3007"
echo "  Learn Geography: http://localhost:3011"
echo "  Learn Management:http://localhost:3016"
echo "  Learn Math:      http://localhost:3017"
echo "  Learn Physics:   http://localhost:3020"
echo "  Learn PR:        http://localhost:3021"
echo ""
echo "# Archived apps (in apps-backup/):"
echo "#   Learn Companion, Learn Cricket, Learn Govt Jobs, Learn Leadership, Learn Winning"
echo ""
echo -e "${GREEN}✓ Deployment successful!${NC}"
