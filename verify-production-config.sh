#!/bin/bash
# VERIFICATION SCRIPT
# Checks that testing mode has been properly disabled in production

set -e

echo "=========================================="
echo "PRODUCTION CONFIGURATION VERIFICATION"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

echo "1. Checking ecosystem.config.js..."
if [ ! -f "ecosystem.config.js" ]; then
  echo -e "${RED}✗ ecosystem.config.js not found${NC}"
  ERRORS=$((ERRORS + 1))
else
  # Check for testing mode flags
  if grep -q "NEXT_PUBLIC_TESTING_MODE.*true" ecosystem.config.js; then
    echo -e "${RED}✗ Found NEXT_PUBLIC_TESTING_MODE=true in ecosystem.config.js${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}✓ No NEXT_PUBLIC_TESTING_MODE=true found${NC}"
  fi
  
  if grep -q "NEXT_PUBLIC_DISABLE_AUTH.*true" ecosystem.config.js; then
    echo -e "${RED}✗ Found NEXT_PUBLIC_DISABLE_AUTH=true in ecosystem.config.js${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}✓ No NEXT_PUBLIC_DISABLE_AUTH=true found${NC}"
  fi
  
  if grep -q "NEXT_PUBLIC_DISABLE_PAYWALL.*true" ecosystem.config.js; then
    echo -e "${RED}✗ Found NEXT_PUBLIC_DISABLE_PAYWALL=true in ecosystem.config.js${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}✓ No NEXT_PUBLIC_DISABLE_PAYWALL=true found${NC}"
  fi
  
  if grep -q 'NEXT_PUBLIC_PAYWALL_ENABLED.*"false"' ecosystem.config.js; then
    echo -e "${RED}✗ Found NEXT_PUBLIC_PAYWALL_ENABLED=false in ecosystem.config.js${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}✓ No NEXT_PUBLIC_PAYWALL_ENABLED=false found${NC}"
  fi
  
  if grep -q "NEXT_PUBLIC_USE_LOCAL_CONTENT.*true" ecosystem.config.js; then
    echo -e "${RED}✗ Found NEXT_PUBLIC_USE_LOCAL_CONTENT=true in ecosystem.config.js${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${GREEN}✓ No NEXT_PUBLIC_USE_LOCAL_CONTENT=true found${NC}"
  fi
fi

echo ""
echo "2. Checking for .env files with local content mode..."
LOCAL_CONTENT_FILES=$(find . -name ".env" -o -name ".env.local" -o -name ".env.production" -type f 2>/dev/null | while read file; do
  if grep -q "NEXT_PUBLIC_USE_LOCAL_CONTENT.*true" "$file" 2>/dev/null; then
    echo "$file"
  fi
done)

if [ -n "$LOCAL_CONTENT_FILES" ]; then
  echo -e "${RED}✗ Found .env files with NEXT_PUBLIC_USE_LOCAL_CONTENT=true:${NC}"
  echo "$LOCAL_CONTENT_FILES"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✓ No .env files with NEXT_PUBLIC_USE_LOCAL_CONTENT=true${NC}"
fi

echo ""
echo "3. Checking .env.local.example default value..."
if [ -f ".env.local.example" ]; then
  if grep -q "NEXT_PUBLIC_USE_LOCAL_CONTENT=false" .env.local.example; then
    echo -e "${GREEN}✓ .env.local.example has correct default (false)${NC}"
  elif grep -q "NEXT_PUBLIC_USE_LOCAL_CONTENT=true" .env.local.example; then
    echo -e "${RED}✗ .env.local.example has NEXT_PUBLIC_USE_LOCAL_CONTENT=true${NC}"
    ERRORS=$((ERRORS + 1))
  else
    echo -e "${YELLOW}⚠ .env.local.example doesn't have NEXT_PUBLIC_USE_LOCAL_CONTENT set${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${YELLOW}⚠ .env.local.example not found${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "4. Validating ecosystem.config.js syntax..."
if node -c ecosystem.config.js 2>/dev/null; then
  echo -e "${GREEN}✓ ecosystem.config.js syntax is valid${NC}"
else
  echo -e "${RED}✗ ecosystem.config.js has syntax errors${NC}"
  ERRORS=$((ERRORS + 1))
fi

echo ""
echo "5. Checking PM2 processes (if PM2 is available)..."
if command -v pm2 &> /dev/null; then
  if pm2 status &> /dev/null; then
    echo -e "${GREEN}✓ PM2 is running${NC}"
    
    # Check a few sample apps for testing flags
    for app in iiskills-main iiskills-learn-jee iiskills-learn-ai; do
      if pm2 show "$app" &> /dev/null; then
        ENV_CHECK=$(pm2 show "$app" 2>/dev/null | grep -E "(TESTING_MODE|DISABLE_AUTH|DISABLE_PAYWALL|USE_LOCAL_CONTENT)" || true)
        if [ -n "$ENV_CHECK" ]; then
          echo -e "${RED}✗ $app has testing mode flags in environment${NC}"
          echo "$ENV_CHECK"
          ERRORS=$((ERRORS + 1))
        else
          echo -e "${GREEN}✓ $app has no testing mode flags${NC}"
        fi
      fi
    done
  else
    echo -e "${YELLOW}⚠ PM2 not running or no processes${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
else
  echo -e "${YELLOW}⚠ PM2 not installed or not in PATH${NC}"
  WARNINGS=$((WARNINGS + 1))
fi

echo ""
echo "=========================================="
echo "VERIFICATION RESULTS"
echo "=========================================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "${GREEN}✓ All checks passed!${NC}"
  echo ""
  echo "Production configuration is correct."
  echo "Testing mode has been properly disabled."
  exit 0
elif [ $ERRORS -eq 0 ]; then
  echo -e "${YELLOW}⚠ Checks passed with $WARNINGS warning(s)${NC}"
  echo ""
  echo "Production configuration appears correct."
  echo "Please review warnings above."
  exit 0
else
  echo -e "${RED}✗ Found $ERRORS error(s) and $WARNINGS warning(s)${NC}"
  echo ""
  echo "Please fix the errors above before deploying to production."
  echo "See PRODUCTION_DEPLOYMENT.md for more information."
  exit 1
fi
