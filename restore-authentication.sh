#!/bin/bash

# Script to restore authentication after temporary open access testing
# This removes the .env.local files that disable auth

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Restoring Authentication to ALL apps"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# List of all apps that had open access enabled
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

# Remove .env.local files (restore from backup if exists)
for APP_PATH in "${APPS[@]}"; do
  ENV_FILE="$APP_PATH/.env.local"
  BACKUP_FILE="$ENV_FILE.backup"
  
  if [ -f "$BACKUP_FILE" ]; then
    echo "♻️  Restoring from backup: $ENV_FILE"
    mv "$BACKUP_FILE" "$ENV_FILE"
  elif [ -f "$ENV_FILE" ]; then
    echo "🗑️  Removing temporary file: $ENV_FILE"
    rm "$ENV_FILE"
  else
    echo "ℹ️  No file to remove: $ENV_FILE"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Authentication restored"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next steps:"
echo "   1. Configure proper Supabase credentials in .env.local files"
echo "   2. Rebuild apps: yarn build or ./deploy-all.sh"
echo "   3. Test authentication flow"
echo "   4. Verify protected routes require login"
echo ""
echo "📖 See .env.local.example for configuration template"
echo ""
