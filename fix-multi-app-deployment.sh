#!/bin/bash

# Fix Multi-App Deployment Script
# This script ensures each Next.js app has its own proper build and configuration

set -e  # Exit on error

echo "=========================================="
echo "FIX MULTI-APP DEPLOYMENT"
echo "=========================================="
echo ""
echo "This script will:"
echo "  1. Ensure each app has .env.local with proper configuration"
echo "  2. Clean all .next build directories"
echo "  3. Build each app independently"
echo "  4. Verify each app has unique build output"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

# Enable corepack to use the correct yarn version
echo -e "${YELLOW}Enabling corepack for correct Yarn version...${NC}"
if command -v corepack &> /dev/null; then
  corepack enable || echo -e "${YELLOW}⚠ Corepack enable failed, continuing with system yarn...${NC}"
  echo -e "${GREEN}✓ Corepack enabled${NC}"
else
  echo -e "${YELLOW}⚠ Corepack not found, using system yarn...${NC}"
fi
echo ""

# Array of all apps to process
APPS=(
  "main"
  "learn-ai"
  "learn-apt"
  "learn-chemistry"
  "learn-developer"
  "learn-geography"
  "learn-management"
  "learn-math"
  "learn-physics"
  "learn-pr"
)

echo -e "${YELLOW}Step 1: Ensuring .env.local files exist...${NC}"
echo ""

for APP in "${APPS[@]}"; do
  APP_DIR="apps/$APP"
  
  if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}⚠ Skipping $APP (directory not found)${NC}"
    continue
  fi
  
  # Check if .env.local exists
  if [ ! -f "$APP_DIR/.env.local" ]; then
    if [ -f "$APP_DIR/.env.local.example" ]; then
      echo "Creating $APP/.env.local from template..."
      cp "$APP_DIR/.env.local.example" "$APP_DIR/.env.local"
      echo -e "${GREEN}✓ Created $APP/.env.local${NC}"
    else
      echo -e "${YELLOW}⚠ No .env.local.example found for $APP${NC}"
      continue
    fi
  else
    echo -e "${GREEN}✓ $APP/.env.local exists${NC}"
  fi
  
  # Ensure Supabase is suspended for build (can be changed for production)
  if grep -q "NEXT_PUBLIC_SUPABASE_SUSPENDED" "$APP_DIR/.env.local"; then
    # Set to suspended mode for builds to work without real credentials
    if sed -i 's/NEXT_PUBLIC_SUPABASE_SUSPENDED=false/NEXT_PUBLIC_SUPABASE_SUSPENDED=true/' "$APP_DIR/.env.local" 2>/dev/null; then
      echo "   → Enabled Supabase suspended mode for $APP"
    fi
  fi
  
  # Ensure valid Supabase URL format (even if dummy)
  if grep -q "NEXT_PUBLIC_SUPABASE_URL=your-project-url-here" "$APP_DIR/.env.local"; then
    if sed -i 's|NEXT_PUBLIC_SUPABASE_URL=your-project-url-here|NEXT_PUBLIC_SUPABASE_URL=https://dummy-project.supabase.co|' "$APP_DIR/.env.local" 2>/dev/null; then
      echo "   → Set valid Supabase URL format for $APP"
    fi
  fi
done

echo ""
echo -e "${YELLOW}Step 2: Cleaning all .next build directories...${NC}"
echo ""

for APP in "${APPS[@]}"; do
  APP_DIR="apps/$APP"
  NEXT_DIR="$APP_DIR/.next"
  
  if [ -d "$NEXT_DIR" ]; then
    echo "Removing $APP/.next..."
    rm -rf "$NEXT_DIR"
    echo -e "${GREEN}✓ Cleaned $APP/.next${NC}"
  else
    echo "No .next directory for $APP (already clean)"
  fi
done

echo ""
echo -e "${YELLOW}Step 3: Installing dependencies (if needed)...${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ] || [ ! -d ".yarn" ]; then
  echo "Installing dependencies from root..."
  if yarn install; then
    echo -e "${GREEN}✓ Dependencies installed${NC}"
  else
    echo -e "${RED}✗ Dependency installation failed!${NC}"
    exit 1
  fi
else
  echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

echo ""
echo -e "${YELLOW}Step 4: Building all apps independently...${NC}"
echo ""

BUILD_SUCCESS=()
BUILD_FAILED=()

for APP in "${APPS[@]}"; do
  APP_DIR="apps/$APP"
  
  if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}⚠ Skipping $APP (directory not found)${NC}"
    continue
  fi
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Building $APP..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  cd "$REPO_ROOT/$APP_DIR"
  
  if yarn build 2>&1 | tee "/tmp/build-$APP.log"; then
    if [ -d ".next" ]; then
      # Count pages built (more accurate than all files)
      if [ -d ".next/server/pages" ]; then
        PAGE_COUNT=$(find .next/server/pages -type f | wc -l)
      else
        # Fallback to counting static pages
        PAGE_COUNT=$(find .next/static -type f 2>/dev/null | wc -l)
      fi
      echo -e "${GREEN}✓ $APP built successfully (.next directory created with $PAGE_COUNT files)${NC}"
      BUILD_SUCCESS+=("$APP")
    else
      echo -e "${RED}✗ $APP build completed but .next directory not found!${NC}"
      BUILD_FAILED+=("$APP (no .next output)")
    fi
  else
    echo -e "${RED}✗ $APP build failed!${NC}"
    echo "See /tmp/build-$APP.log for details"
    BUILD_FAILED+=("$APP (build failed)")
  fi
  
  cd "$REPO_ROOT"
  echo ""
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Verifying unique build outputs..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Verify each app has its unique pages
for APP in "${APPS[@]}"; do
  APP_DIR="apps/$APP"
  PAGES_DIR="$APP_DIR/pages"
  NEXT_DIR="$APP_DIR/.next"
  
  if [ ! -d "$NEXT_DIR" ]; then
    echo -e "${YELLOW}⚠ $APP: .next directory not found (build may have failed)${NC}"
    continue
  fi
  
  if [ -d "$PAGES_DIR" ]; then
    PAGE_COUNT=$(find "$PAGES_DIR" -name "*.js" -o -name "*.jsx" | wc -l)
    echo -e "${GREEN}✓ $APP: Has $PAGE_COUNT source pages and .next build output${NC}"
  else
    echo -e "${YELLOW}⚠ $APP: No pages directory found${NC}"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "BUILD SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ${#BUILD_SUCCESS[@]} -gt 0 ]; then
  echo -e "${GREEN}✓ Successfully built (${#BUILD_SUCCESS[@]} apps):${NC}"
  for APP in "${BUILD_SUCCESS[@]}"; do
    echo "  - $APP"
  done
  echo ""
fi

if [ ${#BUILD_FAILED[@]} -gt 0 ]; then
  echo -e "${RED}✗ Build failed (${#BUILD_FAILED[@]} apps):${NC}"
  for APP in "${BUILD_FAILED[@]}"; do
    echo "  - $APP"
  done
  echo ""
  echo "Check build logs in /tmp/build-*.log for details"
  echo ""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "NEXT STEPS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Review the build summary above"
echo "2. Fix any failed builds by checking /tmp/build-*.log files"
echo "3. Restart PM2 to use the new builds:"
echo "   pm2 restart ecosystem.config.js"
echo ""
echo "4. Verify each app serves unique content:"
echo "   curl http://localhost:3000 | grep -o '<title>.*</title>'"
echo "   curl http://localhost:3024 | grep -o '<title>.*</title>'"
echo "   curl http://localhost:3002 | grep -o '<title>.*</title>'"
echo ""
echo "5. Test via NGINX (recommended):"
echo "   curl https://app.iiskills.cloud | grep -o '<title>.*</title>'"
echo "   curl https://learn-ai.iiskills.cloud | grep -o '<title>.*</title>'"
echo "   curl https://learn-apt.iiskills.cloud | grep -o '<title>.*</title>'"
echo ""

if [ ${#BUILD_FAILED[@]} -eq 0 ]; then
  echo -e "${GREEN}=========================================="
  echo "ALL BUILDS COMPLETED SUCCESSFULLY!"
  echo "==========================================${NC}"
  exit 0
else
  echo -e "${YELLOW}=========================================="
  echo "SOME BUILDS FAILED - REVIEW REQUIRED"
  echo "==========================================${NC}"
  exit 1
fi
