#!/bin/bash

# Configuration Consistency Validation Script
# Ensures all config files are in sync and no deprecated apps are referenced

set -e

echo "======================================"
echo "Configuration Consistency Validator"
echo "======================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Active apps (from ecosystem.config.js)
ACTIVE_APPS=(
  "main:3000"
  "learn-ai:3024"
  "learn-apt:3002"
  "learn-chemistry:3005"
  "learn-developer:3007"
  "learn-geography:3011"
  "learn-management:3016"
  "learn-math:3017"
  "learn-physics:3020"
  "learn-pr:3021"
)

# Deprecated apps that should NOT appear in active code
DEPRECATED_APPS=(
  "learn-govt-jobs"
  "learn-finesse"
  "learn-biology"
  "mpa"
  "learn-cricket"
  "learn-companion"
  "learn-jee"
  "learn-neet"
  "learn-ias"
  "learn-leadership"
  "learn-winning"
)

echo "1. Validating PORT consistency..."
echo "-----------------------------------"
for app_config in "${ACTIVE_APPS[@]}"; do
  IFS=':' read -r app expected_port <<< "$app_config"
  
  if [ "$app" = "main" ]; then
    env_file="apps/main/.env.local.example"
  else
    env_file="apps/$app/.env.local.example"
  fi
  
  if [ -f "$env_file" ]; then
    # Extract port from NEXT_PUBLIC_SITE_URL
    actual_port=$(grep "NEXT_PUBLIC_SITE_URL" "$env_file" | grep -oP ':\K\d+' || echo "NOT_FOUND")
    
    if [ "$actual_port" = "$expected_port" ]; then
      echo -e "${GREEN}✓${NC} $app: PORT $expected_port matches in .env.local.example"
    else
      echo -e "${RED}✗${NC} $app: PORT mismatch! ecosystem.config.js=$expected_port but .env.local.example=$actual_port"
      ((ERRORS++))
    fi
  else
    echo -e "${YELLOW}⚠${NC} $app: .env.local.example not found"
    ((WARNINGS++))
  fi
done
echo ""

echo "2. Checking for deprecated app references..."
echo "-----------------------------------"
# Files to check
CHECK_FILES=(
  "apps/main/pages/courses.js"
  "apps/main/lib/admin/contentRegistry.js"
  "lib/appRegistry.js"
  "ecosystem.config.js"
)

for file in "${CHECK_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Checking $file..."
    found_deprecated=false
    
    for deprecated in "${DEPRECATED_APPS[@]}"; do
      # Look for non-commented references (whole word match only)
      if grep -v "^\s*//" "$file" | grep -wq "$deprecated"; then
        # Check if it's actually in an active line (not in a comment)
        if grep -E "^\s*[^/].*\b$deprecated\b" "$file" | grep -v "MOVED TO apps-backup" | grep -q "$deprecated"; then
          echo -e "${RED}  ✗${NC} Found active reference to '$deprecated'"
          ((ERRORS++))
          found_deprecated=true
        fi
      fi
    done
    
    if [ "$found_deprecated" = false ]; then
      echo -e "${GREEN}  ✓${NC} No active deprecated app references"
    fi
  else
    echo -e "${YELLOW}  ⚠${NC} File not found: $file"
    ((WARNINGS++))
  fi
done
echo ""

echo "3. Verifying app directory structure..."
echo "-----------------------------------"
for app_config in "${ACTIVE_APPS[@]}"; do
  IFS=':' read -r app port <<< "$app_config"
  
  if [ "$app" = "main" ]; then
    app_dir="apps/main"
  else
    app_dir="apps/$app"
  fi
  
  if [ -d "$app_dir" ]; then
    echo -e "${GREEN}✓${NC} $app directory exists"
    
    # Check for essential files
    if [ ! -f "$app_dir/package.json" ]; then
      echo -e "${YELLOW}  ⚠${NC} Missing package.json"
      ((WARNINGS++))
    fi
    
    if [ ! -f "$app_dir/.env.local.example" ]; then
      echo -e "${YELLOW}  ⚠${NC} Missing .env.local.example"
      ((WARNINGS++))
    fi
  else
    echo -e "${RED}✗${NC} $app directory missing!"
    ((ERRORS++))
  fi
done
echo ""

echo "4. Checking NGINX configurations..."
echo "-----------------------------------"
if [ -d "nginx-configs" ]; then
  for app_config in "${ACTIVE_APPS[@]}"; do
    IFS=':' read -r app port <<< "$app_config"
    
    if [ "$app" = "main" ]; then
      nginx_file="nginx-configs/app.iiskills.cloud"
    else
      nginx_file="nginx-configs/${app}.iiskills.cloud"
    fi
    
    if [ -f "$nginx_file" ]; then
      # Check if it proxies to the correct port
      if grep -q "proxy_pass.*:$port" "$nginx_file"; then
        echo -e "${GREEN}✓${NC} $app NGINX config proxies to correct port $port"
      else
        echo -e "${RED}✗${NC} $app NGINX config doesn't proxy to port $port"
        ((ERRORS++))
      fi
    else
      echo -e "${YELLOW}⚠${NC} NGINX config missing for $app"
      ((WARNINGS++))
    fi
  done
else
  echo -e "${YELLOW}⚠${NC} nginx-configs directory not found"
  ((WARNINGS++))
fi
echo ""

echo "5. Validating ecosystem.config.js..."
echo "-----------------------------------"
if [ -f "ecosystem.config.js" ]; then
  for app_config in "${ACTIVE_APPS[@]}"; do
    IFS=':' read -r app port <<< "$app_config"
    
    # Check if app exists in ecosystem.config.js
    if grep -q "\"iiskills-${app}\"" ecosystem.config.js || grep -q "\"iiskills-main\"" ecosystem.config.js; then
      echo -e "${GREEN}✓${NC} $app found in ecosystem.config.js"
    else
      echo -e "${RED}✗${NC} $app missing from ecosystem.config.js"
      ((ERRORS++))
    fi
  done
  
  # Check for deprecated apps (should be commented)
  for deprecated in "${DEPRECATED_APPS[@]}"; do
    # Look for non-commented references
    if grep -v "^\s*//" ecosystem.config.js | grep -q "iiskills-${deprecated}"; then
      echo -e "${RED}✗${NC} Deprecated app '$deprecated' is active in ecosystem.config.js"
      ((ERRORS++))
    fi
  done
else
  echo -e "${RED}✗${NC} ecosystem.config.js not found!"
  ((ERRORS++))
fi
echo ""

echo "6. Checking .env.local.example headers..."
echo "-----------------------------------"
for app_config in "${ACTIVE_APPS[@]}"; do
  IFS=':' read -r app port <<< "$app_config"
  
  if [ "$app" = "main" ]; then
    env_file="apps/main/.env.local.example"
    expected_header="Main"
  else
    # Convert learn-ai to "Learn AI", etc.
    app_name=$(echo "$app" | sed 's/learn-/Learn /; s/-/ /g; s/\b\(.\)/\u\1/g')
    env_file="apps/$app/.env.local.example"
    expected_header="$app_name"
  fi
  
  if [ -f "$env_file" ]; then
    # Check first line
    first_line=$(head -n 1 "$env_file")
    if echo "$first_line" | grep -qi "$expected_header"; then
      echo -e "${GREEN}✓${NC} $app: Header is correct"
    else
      echo -e "${YELLOW}⚠${NC} $app: Header might be incorrect (expected '$expected_header')"
      echo "    Found: $first_line"
      ((WARNINGS++))
    fi
  fi
done
echo ""

echo "======================================"
echo "Validation Summary"
echo "======================================"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✓ All critical validations passed!${NC}"
else
  echo -e "${RED}✗ Found $ERRORS critical error(s)${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
  echo -e "${YELLOW}⚠ Found $WARNINGS warning(s)${NC}"
fi

echo ""
echo "Active Apps: ${#ACTIVE_APPS[@]}"
echo "Deprecated Apps: ${#DEPRECATED_APPS[@]}"
echo ""

if [ $ERRORS -gt 0 ]; then
  exit 1
else
  exit 0
fi
