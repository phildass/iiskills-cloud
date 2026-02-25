#!/bin/bash
# deploy-newapps.sh — Deploy the sandbox (newapps/) environment
#
# This script builds and starts the sandbox apps from newapps/ using PM2.
# The sandbox runs on the same ports as production; stop production first.
#
# Usage:
#   ./deploy-newapps.sh            # Build all sandbox apps and restart PM2
#   ./deploy-newapps.sh --no-build # Skip build, just restart PM2

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

SKIP_BUILD=false
for arg in "$@"; do
  [ "$arg" = "--no-build" ] && SKIP_BUILD=true
done

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

echo ""
echo -e "${BOLD}${CYAN}========================================${NC}"
echo -e "${BOLD}${CYAN}iiskills-cloud Sandbox Deployment${NC}"
echo -e "${BOLD}${CYAN}========================================${NC}"
echo ""

# Step 1: Pull latest code
echo -e "${CYAN}Step 1: Pulling latest code from Git${NC}"
git pull
echo ""

# Step 2: Install dependencies
echo -e "${CYAN}Step 2: Installing dependencies${NC}"
yarn install
echo ""

# Step 3: Build sandbox apps
if [ "$SKIP_BUILD" = true ]; then
  echo -e "${YELLOW}Step 3: Skipping build (--no-build flag set)${NC}"
else
  echo -e "${CYAN}Step 3: Building sandbox apps${NC}"
  SANDBOX_APPS=(
    newapps/main
    newapps/learn-ai
    newapps/learn-apt
    newapps/learn-chemistry
    newapps/learn-developer
    newapps/learn-geography
    newapps/learn-management
    newapps/learn-math
    newapps/learn-physics
    newapps/learn-pr
  )
  BUILD_FAILURES=0
  for app_path in "${SANDBOX_APPS[@]}"; do
    APP_NAME=$(basename "$app_path")
    echo ""
    echo -e "${CYAN}Building sandbox-${APP_NAME}...${NC}"
    if (cd "$app_path" && npx next build); then
      echo -e "${GREEN}✓ Build succeeded for sandbox-${APP_NAME}${NC}"
    else
      echo -e "${RED}✗ Build failed for sandbox-${APP_NAME}${NC}"
      BUILD_FAILURES=$((BUILD_FAILURES + 1))
    fi
  done
  echo ""
  if [ "$BUILD_FAILURES" -gt 0 ]; then
    echo -e "${RED}Build failed for $BUILD_FAILURES app(s). Aborting.${NC}"
    exit 1
  fi
  echo -e "${GREEN}All sandbox apps built successfully!${NC}"
fi
echo ""

# Step 4: Delete existing PM2 processes (same ports — cannot run simultaneously)
echo -e "${CYAN}Step 4: Deleting existing PM2 processes${NC}"
if pm2 list 2>/dev/null | grep -qE "iiskills-main|iiskills-learn"; then
  pm2 delete ecosystem.newapps.config.js || true
  echo -e "${GREEN}Existing processes deleted.${NC}"
else
  echo -e "${YELLOW}No PM2 processes found (already gone).${NC}"
fi
echo ""

# Step 5: Start sandbox via PM2
echo -e "${CYAN}Step 5: Starting sandbox apps via PM2${NC}"
pm2 startOrRestart ecosystem.newapps.config.js --update-env
pm2 save
echo ""

echo -e "${BOLD}${GREEN}========================================${NC}"
echo -e "${BOLD}${GREEN}✅ Sandbox Deployment Complete!${NC}"
echo -e "${BOLD}${GREEN}========================================${NC}"
echo ""
echo "Sandbox is running on the same ports as production:"
echo "  sandbox-main          → :3000  (app.iiskills.cloud)"
echo "  sandbox-learn-apt     → :3002  (app1.iiskills.cloud)"
echo "  sandbox-learn-chemistry → :3005"
echo "  sandbox-learn-developer → :3007"
echo "  sandbox-learn-geography → :3011"
echo "  sandbox-learn-management → :3016"
echo "  sandbox-learn-math    → :3017"
echo "  sandbox-learn-physics → :3020"
echo "  sandbox-learn-pr      → :3021"
echo "  sandbox-learn-ai      → :3024"
echo ""
echo "Next steps:"
echo "  - Monitor:    pm2 monit"
echo "  - Logs:       pm2 logs"
echo "  - Switch back to production:"
echo "      pm2 stop ecosystem.newapps.config.js"
echo "      pm2 start ecosystem.config.js"
echo ""
