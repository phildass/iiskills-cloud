#!/usr/bin/env bash
# scripts/create-sandbox-app.sh
# Creates a new sandbox entry in newapps/ for a given app in apps/.
#
# Usage:
#   ./scripts/create-sandbox-app.sh <app-name> <port>
#
# Example:
#   ./scripts/create-sandbox-app.sh learn-biology 3026

set -euo pipefail

APP_NAME="${1:?Usage: $0 <app-name> <port>}"
PORT="${2:?Usage: $0 <app-name> <port>}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
APP_SRC="$REPO_ROOT/apps/$APP_NAME"
SANDBOX_DIR="$REPO_ROOT/newapps/$APP_NAME"

# Validate source app exists
if [ ! -d "$APP_SRC" ]; then
  echo "Error: apps/$APP_NAME does not exist."
  exit 1
fi

# Validate sandbox doesn't already exist
if [ -d "$SANDBOX_DIR" ]; then
  echo "Error: newapps/$APP_NAME already exists."
  exit 1
fi

echo "Creating sandbox for $APP_NAME (port $PORT)..."
mkdir -p "$SANDBOX_DIR"

# Symlink source directories
for dir in pages components lib styles public data scripts contexts utils; do
  if [ -d "$APP_SRC/$dir" ]; then
    ln -sf "../../apps/$APP_NAME/$dir" "$SANDBOX_DIR/$dir"
    echo "  symlinked $dir/"
  fi
done

# Symlink source config files
for file in next.config.js jsconfig.json tailwind.config.js postcss.config.js .eslintrc.json .gitignore; do
  if [ -f "$APP_SRC/$file" ]; then
    ln -sf "../../apps/$APP_NAME/$file" "$SANDBOX_DIR/$file"
    echo "  symlinked $file"
  fi
done

# Determine existing deps from apps/<app>/package.json
APP_PKGJSON="$APP_SRC/package.json"
HAS_CONTENT_LOADER=$(python3 -c "import json; d=json.load(open('$APP_PKGJSON')); print('yes' if '@iiskills/content-loader' in d.get('dependencies', {}) else 'no')" 2>/dev/null || echo "no")
HAS_UI=$(python3 -c "import json; d=json.load(open('$APP_PKGJSON')); print('yes' if '@iiskills/ui' in d.get('dependencies', {}) else 'no')" 2>/dev/null || echo "no")

# Build deps block
DEPS='"@supabase/supabase-js": "^2.89.0",
    "next": "^16.1.1",
    "react": "^19.2.3",
    "react-dom": "^19.2.3"'
if [ "$HAS_UI" = "yes" ]; then
  DEPS='"@iiskills/ui": "workspace:*",
    '"$DEPS"
fi
if [ "$HAS_CONTENT_LOADER" = "yes" ]; then
  DEPS='"@iiskills/content-loader": "*",
    '"$DEPS"
fi

# Create package.json
cat > "$SANDBOX_DIR/package.json" << PKGJSON
{
  "name": "sandbox-$APP_NAME",
  "version": "1.0.0",
  "private": true,
  "description": "Sandbox clone of $APP_NAME — auth and paywall disabled",
  "scripts": {
    "dev": "next dev -p $PORT",
    "build": "next build",
    "start": "next start -p $PORT",
    "lint": "eslint ."
  },
  "dependencies": {
    $DEPS
  },
  "devDependencies": {
    "autoprefixer": "^10.4.14",
    "eslint": "^9.39.2",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.4.18"
  }
}
PKGJSON

# Create .env.local
cat > "$SANDBOX_DIR/.env.local" << ENVLOCAL
# ===========================================
# SANDBOX ENVIRONMENT - auth/paywall disabled
# ===========================================
# This file is committed intentionally.
# It contains only placeholder values — no real credentials.

# Supabase (suspended — uses mock client)
NEXT_PUBLIC_SUPABASE_SUSPENDED=true
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sandbox-placeholder-anon-key-longer-than-20-chars
SUPABASE_SERVICE_ROLE_KEY=sandbox-placeholder-service-role-key

# Disable all authentication and paywalls
NEXT_PUBLIC_DISABLE_AUTH=true
NEXT_PUBLIC_TESTING_MODE=true

# Open access mode (bypasses paywall UI)
NEXT_PUBLIC_OPEN_ACCESS=true

# Site URL
NEXT_PUBLIC_SITE_URL=http://app1.iiskills.cloud
ENVLOCAL

echo ""
echo "✅ Sandbox created at newapps/$APP_NAME/"
echo ""
echo "Next steps:"
echo "  1. Add an entry to newapps/ecosystem.config.js for 'sandbox-$APP_NAME'"
echo "  2. Add 'newapps/$APP_NAME' to the sandbox:build script in package.json"
echo "  3. Run: cd newapps/$APP_NAME && npx next build"
