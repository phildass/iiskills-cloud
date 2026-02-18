#!/bin/bash
#
# App Isolation Diagnostic Script
# Tests build isolation, environment configuration, and deployment readiness
# for learn-ai and learn-developer apps
#
# Usage: ./diagnose-app-isolation.sh
# If permission denied, run: chmod +x diagnose-app-isolation.sh
#

# Don't exit on errors - we want to run all checks and report all issues

echo "=================================="
echo "App Isolation Diagnostic Tool"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    local status=$1
    local message=$2
    if [ "$status" = "ok" ]; then
        echo -e "${GREEN}✓${NC} $message"
    elif [ "$status" = "error" ]; then
        echo -e "${RED}✗${NC} $message"
    elif [ "$status" = "warning" ]; then
        echo -e "${YELLOW}⚠${NC} $message"
    else
        echo "  $message"
    fi
}

# Apps to check
APPS=("learn-ai" "learn-developer" "main")

echo "Step 1: Checking Directory Structure"
echo "--------------------------------------"
for app in "${APPS[@]}"; do
    if [ -d "apps/$app" ]; then
        print_status "ok" "apps/$app exists"
    else
        print_status "error" "apps/$app NOT FOUND"
    fi
done
echo ""

echo "Step 2: Checking .env.local Files"
echo "--------------------------------------"
for app in "${APPS[@]}"; do
    if [ -f "apps/$app/.env.local" ]; then
        print_status "ok" "apps/$app/.env.local exists"
        
        # Check APP_ID
        if grep -q "NEXT_PUBLIC_APP_ID=$app" "apps/$app/.env.local"; then
            print_status "ok" "  APP_ID correctly set to '$app'"
        else
            print_status "warning" "  APP_ID may not match app name"
            grep "NEXT_PUBLIC_APP_ID" "apps/$app/.env.local" || print_status "error" "  APP_ID not found"
        fi
        
        # Check PORT
        if [ "$app" = "learn-ai" ]; then
            expected_port="3024"
        elif [ "$app" = "learn-developer" ]; then
            expected_port="3007"
        elif [ "$app" = "main" ]; then
            expected_port="3000"
        fi
        
        if grep -q "SITE_URL=.*:$expected_port" "apps/$app/.env.local"; then
            print_status "ok" "  PORT correctly set to $expected_port"
        else
            print_status "warning" "  PORT may not be correctly configured (expected $expected_port)"
            grep "SITE_URL" "apps/$app/.env.local" || print_status "error" "  SITE_URL not found"
        fi
    else
        print_status "error" "apps/$app/.env.local MISSING"
        if [ -f "apps/$app/.env.local.example" ]; then
            print_status "info" "  .env.local.example exists - needs to be copied"
        fi
    fi
done
echo ""

echo "Step 3: Checking .next Build Directories"
echo "--------------------------------------"
for app in "${APPS[@]}"; do
    if [ -d "apps/$app/.next" ]; then
        print_status "ok" "apps/$app/.next exists"
        
        # Check BUILD_ID
        if [ -f "apps/$app/.next/BUILD_ID" ]; then
            build_id=$(cat "apps/$app/.next/BUILD_ID")
            print_status "info" "  BUILD_ID: $build_id"
        else
            print_status "warning" "  BUILD_ID file not found"
        fi
    else
        print_status "error" "apps/$app/.next MISSING - app needs to be built"
    fi
done
echo ""

echo "Step 4: Checking for Build ID Uniqueness"
echo "--------------------------------------"
declare -A build_ids
for app in "${APPS[@]}"; do
    if [ -f "apps/$app/.next/BUILD_ID" ]; then
        build_id=$(cat "apps/$app/.next/BUILD_ID")
        build_ids["$app"]=$build_id
    fi
done

# Check for duplicates
declare -A seen_ids
has_duplicates=false
for app in "${!build_ids[@]}"; do
    build_id="${build_ids[$app]}"
    if [ -n "${seen_ids[$build_id]}" ]; then
        print_status "error" "DUPLICATE BUILD_ID detected!"
        print_status "error" "  $app and ${seen_ids[$build_id]} both have: $build_id"
        has_duplicates=true
    else
        seen_ids["$build_id"]=$app
    fi
done

if [ "$has_duplicates" = false ] && [ ${#build_ids[@]} -gt 0 ]; then
    print_status "ok" "All BUILD_IDs are unique"
fi
echo ""

echo "Step 5: Checking Source Code Identity"
echo "--------------------------------------"
# Check _app.js for hardcoded appId
for app in "learn-ai" "learn-developer"; do
    if [ -f "apps/$app/pages/_app.js" ]; then
        if grep -q "appId=\"$app\"" "apps/$app/pages/_app.js"; then
            print_status "ok" "apps/$app/_app.js has correct appId=\"$app\""
        else
            print_status "warning" "apps/$app/_app.js may have incorrect appId"
            grep "appId=" "apps/$app/pages/_app.js" || print_status "info" "  No appId found in _app.js"
        fi
    fi
done

# Check index.js for correct appId prop
for app in "learn-ai" "learn-developer"; do
    if [ -f "apps/$app/pages/index.js" ]; then
        if grep -q "appId=\"$app\"" "apps/$app/pages/index.js"; then
            print_status "ok" "apps/$app/index.js has correct appId=\"$app\""
        else
            print_status "warning" "apps/$app/index.js may have incorrect appId"
        fi
    fi
done
echo ""

echo "Step 6: Checking PM2 Configuration"
echo "--------------------------------------"
if [ -f "ecosystem.config.js" ]; then
    print_status "ok" "ecosystem.config.js exists"
    
    # Check learn-ai config
    if grep -A 10 "iiskills-learn-ai" ecosystem.config.js | grep -q "apps/learn-ai"; then
        print_status "ok" "learn-ai PM2 config points to correct directory"
    else
        print_status "error" "learn-ai PM2 config may be incorrect"
    fi
    
    if grep -A 10 "iiskills-learn-ai" ecosystem.config.js | grep -q "PORT.*3024"; then
        print_status "ok" "learn-ai PM2 config has correct PORT (3024)"
    else
        print_status "error" "learn-ai PM2 config may have wrong PORT"
    fi
    
    # Check learn-developer config
    if grep -A 10 "iiskills-learn-developer" ecosystem.config.js | grep -q "apps/learn-developer"; then
        print_status "ok" "learn-developer PM2 config points to correct directory"
    else
        print_status "error" "learn-developer PM2 config may be incorrect"
    fi
    
    if grep -A 10 "iiskills-learn-developer" ecosystem.config.js | grep -q "PORT.*3007"; then
        print_status "ok" "learn-developer PM2 config has correct PORT (3007)"
    else
        print_status "error" "learn-developer PM2 config may have wrong PORT"
    fi
else
    print_status "error" "ecosystem.config.js NOT FOUND"
fi
echo ""

echo "Step 7: Checking NGINX Configuration"
echo "--------------------------------------"
for subdomain in "learn-ai" "learn-developer"; do
    config_file="nginx-configs/${subdomain}.iiskills.cloud"
    if [ -f "$config_file" ]; then
        print_status "ok" "$config_file exists"
        
        # Check port mapping
        if [ "$subdomain" = "learn-ai" ]; then
            expected_port="3024"
        else
            expected_port="3007"
        fi
        
        if grep -q "proxy_pass.*localhost:$expected_port" "$config_file"; then
            print_status "ok" "  NGINX proxies to localhost:$expected_port"
        else
            print_status "error" "  NGINX may not proxy to correct port (expected $expected_port)"
        fi
    else
        print_status "error" "$config_file NOT FOUND"
    fi
done
echo ""

echo "Step 8: Checking AppRegistry Configuration"
echo "--------------------------------------"
if [ -f "lib/appRegistry.js" ]; then
    print_status "ok" "lib/appRegistry.js exists"
    
    # Check learn-ai
    if grep -A 10 "'learn-ai'" lib/appRegistry.js | grep -q "localPort: 3024"; then
        print_status "ok" "learn-ai registered with port 3024"
    else
        print_status "error" "learn-ai may have wrong port in appRegistry"
    fi
    
    if grep -A 10 "'learn-ai'" lib/appRegistry.js | grep -q "primaryDomain: 'learn-ai.iiskills.cloud'"; then
        print_status "ok" "learn-ai registered with correct domain"
    else
        print_status "error" "learn-ai may have wrong domain in appRegistry"
    fi
    
    # Check learn-developer
    if grep -A 10 "'learn-developer'" lib/appRegistry.js | grep -q "localPort: 3007"; then
        print_status "ok" "learn-developer registered with port 3007"
    else
        print_status "error" "learn-developer may have wrong port in appRegistry"
    fi
    
    if grep -A 10 "'learn-developer'" lib/appRegistry.js | grep -q "primaryDomain: 'learn-developer.iiskills.cloud'"; then
        print_status "ok" "learn-developer registered with correct domain"
    else
        print_status "error" "learn-developer may have wrong domain in appRegistry"
    fi
else
    print_status "error" "lib/appRegistry.js NOT FOUND"
fi
echo ""

echo "Step 9: Checking for Symlinks or Shared Resources"
echo "--------------------------------------"
for app in "learn-ai" "learn-developer"; do
    # Check if pages directory is a symlink
    if [ -L "apps/$app/pages" ]; then
        print_status "error" "apps/$app/pages is a SYMLINK - may cause issues"
    else
        print_status "ok" "apps/$app/pages is a real directory"
    fi
    
    # Check if .next is a symlink
    if [ -L "apps/$app/.next" ]; then
        print_status "error" "apps/$app/.next is a SYMLINK - CRITICAL ISSUE"
    elif [ -d "apps/$app/.next" ]; then
        print_status "ok" "apps/$app/.next is a real directory"
    fi
done
echo ""

echo "=================================="
echo "Diagnostic Complete"
echo "=================================="
echo ""
echo "Summary:"
echo "--------"
echo "If you see any errors above, they need to be fixed before deployment."
echo ""
echo "Common fixes:"
echo "1. Missing .env.local: Copy from .env.local.example and configure"
echo "2. Missing .next: Run 'yarn build' in the app directory"
echo "3. Wrong PORT/APP_ID: Edit .env.local to match expected values"
echo "4. Duplicate BUILD_IDs: Delete .next directories and rebuild each app"
echo ""
