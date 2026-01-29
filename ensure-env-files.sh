#!/bin/bash

# Ensure Environment Files Script for iiskills-cloud Monorepo
# This script ensures that .env.local files exist in all subprojects
# with the required Supabase environment variables.
#
# It can be run:
# - Manually before starting development
# - As part of the build process
# - In CI/CD pipelines to validate configuration

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_ROOT"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 Checking Environment Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Function to check if a file has required environment variables
check_env_vars() {
  local file="$1"
  local location="$2"
  
  if [ ! -f "$file" ]; then
    echo "❌ MISSING: $location"
    return 1
  fi
  
  # Check if required variables exist and are not empty placeholders
  # NOTE: These patterns should align with validation in lib/supabaseClient.js
  # See PLACEHOLDER_URL_PATTERNS and MIN_ANON_KEY_LENGTH constants in JS files
  local url_value=$(grep -E "^NEXT_PUBLIC_SUPABASE_URL=" "$file" | cut -d'=' -f2- || true)
  local key_value=$(grep -E "^NEXT_PUBLIC_SUPABASE_ANON_KEY=" "$file" | cut -d'=' -f2- || true)
  
  # Check for known placeholder patterns
  local has_placeholder=0
  
  if [ -z "$url_value" ] || \
     [ "$url_value" = "your-project-url-here" ] || \
     [ "$url_value" = "https://your-project.supabase.co" ] || \
     echo "$url_value" | grep -qiE "(your-project|xyz|xyzcompany|abc123).*\.supabase\.co"; then
    has_placeholder=1
  fi
  
  # Check key length (min 20 chars) and placeholder patterns
  if [ -z "$key_value" ] || \
     [ "$key_value" = "your-anon-key-here" ] || \
     echo "$key_value" | grep -qE "^eyJhbGciOi\.\.\." || \
     [ "${#key_value}" -lt 20 ]; then
    has_placeholder=1
  fi
  
  if [ $has_placeholder -eq 1 ]; then
    echo "⚠️  INCOMPLETE: $location (has placeholder values)"
    return 2
  fi
  
  echo "✅ OK: $location"
  return 0
}

# Function to create .env.local from template
create_env_file() {
  local target_dir="$1"
  local source_template="$2"
  
  if [ -f "$source_template" ]; then
    cp "$source_template" "$target_dir/.env.local"
    echo "   Created $target_dir/.env.local from template $source_template"
  else
    echo "   ⚠️  No template found at $source_template for $target_dir"
    return 1
  fi
}

# Track issues
MISSING_COUNT=0
INCOMPLETE_COUNT=0
CHECKED_COUNT=0

# Check root .env.local
echo "Checking root directory..."
if ! check_env_vars ".env.local" "root/.env.local"; then
  if [ ! -f ".env.local" ]; then
    echo "   Creating root/.env.local from template..."
    create_env_file "." ".env.local.example"
    MISSING_COUNT=$((MISSING_COUNT + 1))
  else
    INCOMPLETE_COUNT=$((INCOMPLETE_COUNT + 1))
  fi
fi
CHECKED_COUNT=$((CHECKED_COUNT + 1))
echo ""

# Check all learning modules
echo "Checking learning modules..."
for dir in learn-*/; do
  if [ -d "$dir" ]; then
    MODULE_NAME=$(basename "$dir")
    
    if ! check_env_vars "$dir/.env.local" "$MODULE_NAME/.env.local"; then
      if [ ! -f "$dir/.env.local" ]; then
        echo "   Creating $MODULE_NAME/.env.local from template..."
        # Try module-specific template first, then root template
        if [ -f "$dir/.env.local.example" ]; then
          create_env_file "$dir" "$dir/.env.local.example"
        else
          create_env_file "$dir" ".env.local.example"
        fi
        MISSING_COUNT=$((MISSING_COUNT + 1))
      else
        INCOMPLETE_COUNT=$((INCOMPLETE_COUNT + 1))
      fi
    fi
    CHECKED_COUNT=$((CHECKED_COUNT + 1))
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Total locations checked: $CHECKED_COUNT"
echo "Missing .env.local files created: $MISSING_COUNT"
echo "Files with placeholder values: $INCOMPLETE_COUNT"
echo ""

if [ $INCOMPLETE_COUNT -gt 0 ] || [ $MISSING_COUNT -gt 0 ]; then
  echo "⚠️  ACTION REQUIRED"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "Some .env.local files have placeholder values and need to be updated"
  echo "with your actual Supabase credentials."
  echo ""
  echo "Quick fix: Run the automated setup script:"
  echo "  ./setup-env.sh"
  echo ""
  echo "Or manually update each .env.local file with:"
  echo "  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
  echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key"
  echo ""
  echo "Get credentials from: https://supabase.com"
  echo "  → Your Project → Settings → API"
  echo ""
  echo "See ENV_SETUP_GUIDE.md for detailed instructions."
  echo ""
  exit 1
else
  echo "✅ All environment files are properly configured!"
  echo ""
  exit 0
fi
