#!/bin/bash

# Testing Phase - Enable Public Access
# This script creates .env.local files with authentication bypass enabled for all apps

set -e  # Exit on error

echo "🔧 Creating .env.local files with public access mode for testing..."
echo "⚠️  This disables all authentication and paywalls for testing phase"
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
# Testing Phase - Public Access Mode
# Authentication and paywalls disabled for testing

# Enable public access (bypasses authentication and paywalls)
NEXT_PUBLIC_DISABLE_AUTH=true

# Supabase Configuration (optional - bypassed when NEXT_PUBLIC_DISABLE_AUTH=true)
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

# Main app
echo "Creating apps/main/.env.local..."
create_env_file "apps/main/.env.local" "main"

# List of all active learning apps
APPS=(
  "learn-ai"
  "learn-apt"
  "learn-chemistry"
  "learn-developer"
  "learn-geography"
  "learn-govt-jobs"
  "learn-leadership"
  "learn-management"
  "learn-math"
  "learn-physics"
  "learn-pr"
  "learn-winning"
)

# Create .env.local for each app
for app in "${APPS[@]}"; do
  if [ -d "apps/$app" ]; then
    echo "Creating apps/$app/.env.local..."
    create_env_file "apps/$app/.env.local" "$app"
  else
    echo "⚠️  apps/$app directory not found, skipping..."
  fi
done

echo ""
echo "✅ All .env.local files created with public access mode enabled"
echo ""
echo "📝 Testing configuration:"
echo "   - All authentication bypassed"
echo "   - All paywalls removed"
echo "   - All content publicly accessible"
echo ""
echo "⚠️  REMEMBER: Disable for production by setting NEXT_PUBLIC_DISABLE_AUTH=false"
