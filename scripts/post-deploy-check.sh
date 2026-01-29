#!/bin/bash

#
# Post-Deployment Health Check Script
#
# This script validates that the deployment was successful by:
# 1. Checking that all PM2 processes are running
# 2. Validating HTTP endpoints are responding
# 3. Checking the admin health API
# 4. Verifying no testing mode flags in production
#
# Usage: ./scripts/post-deploy-check.sh [--wait] [--rollback-on-fail]
#
# Exit codes:
#   0 = All health checks passed
#   1 = Health check failures detected
#

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'
RESET='\033[0m'

# Configuration
MAX_WAIT_TIME=60  # seconds
CHECK_INTERVAL=5  # seconds
ADMIN_PORT=3023
MAIN_PORT=3000

# Parse arguments
WAIT_FOR_STARTUP=false
ROLLBACK_ON_FAIL=false

for arg in "$@"; do
  case $arg in
    --wait) WAIT_FOR_STARTUP=true ;;
    --rollback-on-fail) ROLLBACK_ON_FAIL=true ;;
    --help)
      echo "Usage: ./scripts/post-deploy-check.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --wait              Wait up to 60s for apps to start"
      echo "  --rollback-on-fail  Rollback deployment if checks fail"
      echo "  --help              Show this help message"
      exit 0
      ;;
  esac
done

echo ""
echo -e "${BOLD}${CYAN}========================================${RESET}"
echo -e "${BOLD}${CYAN}Post-Deployment Health Check${RESET}"
echo -e "${BOLD}${CYAN}========================================${RESET}"
echo ""

ERRORS=0
WARNINGS=0

#
# Check PM2 processes
#
echo -e "${CYAN}1. Checking PM2 processes...${NC}"

if ! command -v pm2 &> /dev/null; then
  echo -e "${RED}✗ PM2 is not installed${NC}"
  ERRORS=$((ERRORS + 1))
else
  # Get list of apps that should be running
  EXPECTED_APPS=(
    "iiskills-main"
    "iiskills-learn-ai"
    "iiskills-learn-apt"
    "iiskills-learn-chemistry"
    "iiskills-learn-cricket"
    "iiskills-learn-geography"
    "iiskills-learn-govt-jobs"
    "iiskills-learn-leadership"
    "iiskills-learn-management"
    "iiskills-learn-math"
    "iiskills-learn-physics"
    "iiskills-learn-pr"
    "iiskills-learn-winning"
  )
  
  PM2_FAILURES=0
  
  for app in "${EXPECTED_APPS[@]}"; do
    if pm2 describe "$app" &> /dev/null; then
      STATUS=$(pm2 describe "$app" 2>/dev/null | grep 'status' | grep -o 'online\|stopped\|errored' | head -n1)
      
      if [ "$STATUS" = "online" ]; then
        echo -e "  ${GREEN}✓ $app is running${NC}"
      else
        echo -e "  ${RED}✗ $app status: $STATUS${NC}"
        PM2_FAILURES=$((PM2_FAILURES + 1))
      fi
    else
      echo -e "  ${RED}✗ $app not found in PM2${NC}"
      PM2_FAILURES=$((PM2_FAILURES + 1))
    fi
  done
  
  if [ $PM2_FAILURES -gt 0 ]; then
    echo -e "  ${RED}$PM2_FAILURES app(s) not running properly${NC}"
    ERRORS=$((ERRORS + PM2_FAILURES))
  fi
fi
echo ""

#
# Check HTTP endpoints
#
echo -e "${CYAN}2. Checking HTTP endpoints...${NC}"

check_http_endpoint() {
  local port=$1
  local name=$2
  local waited=0
  
  while [ $waited -lt $MAX_WAIT_TIME ]; do
    if curl -f -s -o /dev/null --connect-timeout 2 http://localhost:$port 2>/dev/null; then
      echo -e "  ${GREEN}✓ $name (port $port) is responding${NC}"
      return 0
    fi
    
    if [ "$WAIT_FOR_STARTUP" = false ]; then
      break
    fi
    
    sleep $CHECK_INTERVAL
    waited=$((waited + CHECK_INTERVAL))
  done
  
  echo -e "  ${RED}✗ $name (port $port) not responding${NC}"
  return 1
}

HTTP_FAILURES=0

if ! check_http_endpoint $MAIN_PORT "Main app"; then
  HTTP_FAILURES=$((HTTP_FAILURES + 1))
fi

if [ $HTTP_FAILURES -gt 0 ]; then
  ERRORS=$((ERRORS + HTTP_FAILURES))
fi
echo ""

#
# Check main app admin health API
#
echo -e "${CYAN}3. Checking main app admin health API...${NC}"

HEALTH_RESPONSE=$(curl -s http://localhost:$MAIN_PORT/api/healthz 2>/dev/null || echo "")

if [ -z "$HEALTH_RESPONSE" ]; then
  echo -e "  ${RED}✗ Main app health API not responding${NC}"
  ERRORS=$((ERRORS + 1))
else
  # Parse JSON response (simple check)
  if echo "$HEALTH_RESPONSE" | grep -q '"status":"OK"'; then
    echo -e "  ${GREEN}✓ Main app health status: OK${NC}"
  elif echo "$HEALTH_RESPONSE" | grep -q '"status":"WARNING"'; then
    echo -e "  ${YELLOW}⚠️  Main app health status: WARNING${NC}"
    WARNINGS=$((WARNINGS + 1))
    
    # Show warning details
    if echo "$HEALTH_RESPONSE" | grep -q '"message"'; then
      MESSAGE=$(echo "$HEALTH_RESPONSE" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
      echo -e "  ${YELLOW}   $MESSAGE${NC}"
    fi
  else
    echo -e "  ${RED}✗ Main app health status: ERROR${NC}"
    ERRORS=$((ERRORS + 1))
    
    # Show error details
    if echo "$HEALTH_RESPONSE" | grep -q '"message"'; then
      MESSAGE=$(echo "$HEALTH_RESPONSE" | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
      echo -e "  ${RED}   $MESSAGE${NC}"
    fi
  fi
fi
echo ""

#
# Check for testing mode in production
#
echo -e "${CYAN}4. Checking for testing mode flags...${NC}"

if [ -f "ecosystem.config.js" ]; then
  # Check for testing flags (should not be present in production)
  TESTING_FLAGS_FOUND=0
  
  if grep -q 'NEXT_PUBLIC_DISABLE_AUTH.*:.*"true"' ecosystem.config.js; then
    echo -e "  ${RED}✗ Found NEXT_PUBLIC_DISABLE_AUTH=true${NC}"
    TESTING_FLAGS_FOUND=$((TESTING_FLAGS_FOUND + 1))
  fi
  
  if grep -q 'NEXT_PUBLIC_USE_LOCAL_CONTENT.*:.*"true"' ecosystem.config.js; then
    echo -e "  ${RED}✗ Found NEXT_PUBLIC_USE_LOCAL_CONTENT=true${NC}"
    TESTING_FLAGS_FOUND=$((TESTING_FLAGS_FOUND + 1))
  fi
  
  if [ $TESTING_FLAGS_FOUND -gt 0 ]; then
    echo -e "  ${RED}✗ Testing mode detected in production apps${NC}"
    ERRORS=$((ERRORS + TESTING_FLAGS_FOUND))
  else
    echo -e "  ${GREEN}✓ No testing mode flags found${NC}"
  fi
else
  echo -e "  ${YELLOW}⚠️  ecosystem.config.js not found${NC}"
  WARNINGS=$((WARNINGS + 1))
fi
echo ""

#
# Check for .next build directories
#
echo -e "${CYAN}5. Checking build directories...${NC}"

MISSING_BUILDS=0

if [ -d "apps/main/.next" ]; then
  echo -e "  ${GREEN}✓ apps/main/.next exists${NC}"
else
  echo -e "  ${RED}✗ apps/main/.next missing${NC}"
  MISSING_BUILDS=$((MISSING_BUILDS + 1))
fi

if [ $MISSING_BUILDS -gt 0 ]; then
  ERRORS=$((ERRORS + MISSING_BUILDS))
fi
echo ""

#
# Summary and verdict
#
echo -e "${BOLD}${CYAN}========================================${RESET}"
echo -e "${BOLD}Health Check Summary${RESET}"
echo -e "${BOLD}${CYAN}========================================${RESET}"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}${BOLD}✅ All health checks passed!${NC}"
  echo -e "${GREEN}Deployment successful and healthy${NC}"
  echo ""
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}${BOLD}⚠️  ${WARNINGS} warning(s)${NC}"
  echo -e "${YELLOW}Deployment successful with warnings${NC}"
  echo ""
  exit 0
else
  echo -e "${RED}${BOLD}❌ ${ERRORS} error(s), ${WARNINGS} warning(s)${NC}"
  echo -e "${RED}${BOLD}Health check FAILED${NC}"
  echo ""
  
  if [ "$ROLLBACK_ON_FAIL" = true ]; then
    echo -e "${YELLOW}Attempting rollback...${NC}"
    
    if command -v git &> /dev/null; then
      PREVIOUS_COMMIT=$(git rev-parse HEAD~1)
      echo "Rolling back to commit: $PREVIOUS_COMMIT"
      git reset --hard $PREVIOUS_COMMIT
      
      echo "Reinstalling dependencies..."
      yarn install
      
      echo "Rebuilding apps..."
      yarn build
      
      echo "Restarting PM2..."
      pm2 restart all
      
      echo -e "${GREEN}Rollback complete${NC}"
    else
      echo -e "${RED}Git not available, manual rollback required${NC}"
    fi
  else
    echo "To attempt automatic rollback, run with --rollback-on-fail"
  fi
  
  echo ""
  echo "Troubleshooting:"
  echo "  1. Check PM2 logs: pm2 logs"
  echo "  2. Check individual app logs: pm2 logs <app-name>"
  echo "  3. Verify environment variables: pm2 show <app-name>"
  echo "  4. Review build logs in logs/ directory"
  echo "  5. Manually restart failed apps: pm2 restart <app-name>"
  echo ""
  
  exit 1
fi
