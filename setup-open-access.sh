#!/bin/bash

# Script to enable temporary open access across all apps
# This sets NEXT_PUBLIC_DISABLE_AUTH=true for testing/demo purposes

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔓 Setting up TEMPORARY OPEN ACCESS for all apps"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  WARNING: This disables ALL authentication requirements"
echo "⚠️  WARNING: This is for TESTING/DEMO purposes only"
echo ""

# Create minimal .env.local content for open access
ENV_CONTENT="# ============================================
# TEMPORARY OPEN ACCESS CONFIGURATION
# ============================================
# Generated: $(date)
# Purpose: Testing/Demo - Full public access without authentication
#
# ⚠️ IMPORTANT: This is TEMPORARY for testing period only!
# ⚠️ To restore auth: delete this file and run ./restore-authentication.sh
# ============================================

# Disable authentication - grant full public access
NEXT_PUBLIC_DISABLE_AUTH=true

# Disable paywalls - all content free
NEXT_PUBLIC_PAYWALL_ENABLED=false

# Suspend Supabase for testing without database
NEXT_PUBLIC_SUPABASE_SUSPENDED=true

# Dummy Supabase credentials (not used when suspended)
NEXT_PUBLIC_SUPABASE_URL=https://dummy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy-key

# Site URL for local development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
"

# List of all apps to configure
APPS=(
  "."
  "apps/main"
  "apps/learn-physics"
  "apps/learn-math"
  "apps/learn-chemistry"
  "apps/learn-geography"
  "apps/learn-ai"
  "apps/learn-apt"
  "apps/learn-developer"
  "apps/learn-govt-jobs"
  "apps/learn-management"
  "apps/learn-pr"
)

# Create .env.local for each app
for APP_PATH in "${APPS[@]}"; do
  ENV_FILE="$APP_PATH/.env.local"
  
  if [ -f "$ENV_FILE" ]; then
    echo "⚠️  $ENV_FILE already exists - backing up to .env.local.backup"
    cp "$ENV_FILE" "$ENV_FILE.backup"
  fi
  
  echo "$ENV_CONTENT" > "$ENV_FILE"
  echo "✅ Created: $ENV_FILE"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Open access enabled for all apps"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next steps:"
echo "   1. Rebuild apps: yarn build or ./deploy-all.sh"
echo "   2. Test in browser (incognito mode recommended)"
echo "   3. Verify no login/registration prompts appear"
echo ""
echo "🔄 To restore authentication later:"
echo "   - Run: ./restore-authentication.sh"
echo "   - Or delete all .env.local files and rebuild"
echo ""
