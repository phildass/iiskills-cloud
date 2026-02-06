#!/bin/bash

# Setup CI Environment Files
# This script creates .env.local files with dummy values for CI/CD builds
# These values are sufficient for builds to pass but should not be used in production

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
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
    sed -i.bak \
      -e "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=${DUMMY_SUPABASE_URL}|" \
      -e "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=${DUMMY_SUPABASE_KEY}|" \
      "$file"
    rm -f "${file}.bak"
    echo "✓ Updated: $file"
  fi
}

# Update all .env.local files
for env_file in .env.local apps/*/.env.local; do
  if [ -f "$env_file" ]; then
    update_env_file "$env_file"
  fi
done

echo ""
echo "✅ CI environment files updated successfully!"
