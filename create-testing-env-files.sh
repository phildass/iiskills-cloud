#!/bin/bash

# TEMPORARY - RESTORE AFTER JAN 28, 2026
# This script creates .env.local files with testing mode enabled for all apps

set -e  # Exit on error

echo "🔧 Creating .env.local files with TEMPORARY testing mode..."
echo "⚠️  CRITICAL: RESTORE AFTER JAN 28, 2026"
echo ""

# Function to create env file with backup
create_env_file() {
  local file_path="$1"
  local app_name="$2"
  
  # Backup existing file if it exists
  if [ -f "$file_path" ]; then
    local backup_path="${file_path}.backup-$(date +%Y%m%d-%H%M%S)"
    echo "⚠️  Backing up existing $file_path to $backup_path"
    cp "$file_path" "$backup_path"
  fi
  
  # Create new file
  cat > "$file_path" << 'EOF'
# TEMPORARY - RESTORE AFTER JAN 28, 2026
# Testing mode: Bypass all authentication and paywalls

NEXT_PUBLIC_TESTING_MODE=true
NEXT_PUBLIC_DISABLE_AUTH=true
NEXT_PUBLIC_DISABLE_PAYWALL=true

# This also sets the legacy paywall flag to false
NEXT_PUBLIC_PAYWALL_ENABLED=false

# Supabase Configuration (optional - bypassed in testing mode)
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=
EOF
  
  if [ "$app_name" != "root" ]; then
    echo "✅ $app_name/.env.local created"
  else
    echo "✅ Root .env.local created"
  fi
}

# Root .env.local
echo "Creating root .env.local..."
create_env_file ".env.local" "root"

# List of all learning apps
APPS=(
  "learn-ai"
  "learn-apt"
  "learn-chemistry"
  "learn-cricket"
  "learn-data-science"
  "learn-geography"
  "learn-govt-jobs"
  "learn-ias"
  "learn-jee"
  "learn-leadership"
  "learn-management"
  "learn-math"
  "learn-neet"
  "learn-physics"
  "learn-pr"
  "learn-winning"
)

# Create .env.local for each app
for app in "${APPS[@]}"; do
  if [ -d "$app" ]; then
    echo "Creating $app/.env.local..."
    create_env_file "$app/.env.local" "$app"
  else
    echo "⚠️  $app directory not found, skipping..."
  fi
done

echo ""
echo "✅ All .env.local files created with testing mode enabled"
echo ""
echo "📝 Next steps:"
echo "   1. Review the changes in this commit"
echo "   2. Modify code to respect NEXT_PUBLIC_DISABLE_AUTH flag"
echo "   3. Build and deploy"
echo ""
echo "⚠️  REMEMBER: Restore after January 28, 2026"
echo "   See TEMPORARY_TESTING_MODE.md for restoration instructions"
