#!/bin/bash

# Setup CI Environment Files
# This script creates .env.local files with dummy values for CI/CD builds
# These values are sufficient for builds to pass but should not be used in production

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Dummy Supabase credentials that look valid but are for CI only
DUMMY_SUPABASE_URL="https://example.supabase.co"
DUMMY_SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwOTQ1OTIwMCwiZXhwIjoxOTI1MDM1MjAwfQ.example"

echo "🔧 Setting up CI environment files..."

# Function to update .env.local with dummy values
update_env_file() {
  local file="$1"
  
  if [ -f "$file" ]; then
    # Replace placeholder values with dummy but valid-looking values
    # Use a temporary file for portability across Linux and macOS
    sed \
      -e "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=${DUMMY_SUPABASE_URL}|" \
      -e "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=${DUMMY_SUPABASE_KEY}|" \
      "$file" > "$file.tmp"
    mv "$file.tmp" "$file"
    echo "✓ Updated: $file"
  fi
}

# Update all .env.local files
for env_file in .env.local apps/*/.env.local; do
  if [ -f "$env_file" ]; then
    update_env_file "$env_file"
  fi
done

# Fix broken .env.production symlinks
#
# On production servers deploy-all.sh creates:
#   apps/*/.env.production -> /etc/iiskills.env
# That target file does not exist in CI, so Next.js throws ENOENT on stat().
# Replace any broken symlink (or missing file) with a dummy plain file so
# the build succeeds.  Real credentials come from .env.local above.
echo ""
echo "🔧 Checking .env.production files..."
for app_dir in apps/*/; do
  env_prod="${app_dir}.env.production"
  # -L: is a symlink   ! -e: target doesn't exist (broken symlink)
  if [ -L "$env_prod" ] && [ ! -e "$env_prod" ]; then
    rm -f "$env_prod"
    printf 'NEXT_PUBLIC_SUPABASE_URL=%s\nNEXT_PUBLIC_SUPABASE_ANON_KEY=%s\nNEXT_PUBLIC_DISABLE_AUTH=true\n' \
      "$DUMMY_SUPABASE_URL" "$DUMMY_SUPABASE_KEY" > "$env_prod"
    echo "✓ Replaced broken symlink with CI stub: $env_prod"
  elif [ ! -f "$env_prod" ] && [ ! -L "$env_prod" ]; then
    printf 'NEXT_PUBLIC_SUPABASE_URL=%s\nNEXT_PUBLIC_SUPABASE_ANON_KEY=%s\nNEXT_PUBLIC_DISABLE_AUTH=true\n' \
      "$DUMMY_SUPABASE_URL" "$DUMMY_SUPABASE_KEY" > "$env_prod"
    echo "✓ Created CI stub: $env_prod"
  fi
done

echo ""
echo "✅ CI environment files updated successfully!"
