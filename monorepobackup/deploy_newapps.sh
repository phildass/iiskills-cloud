#!/usr/bin/env bash
set -euo pipefail

# Deploy sandbox apps from ./newapps using PM2 ecosystem.newapps.config.js
# Run from repo root: /root/iiskills-cloud
# Usage:
#   bash ./deploy-newapps.sh
#   # or: chmod +x deploy-newapps.sh && ./deploy-newapps.sh

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

echo "==> Deploying NEWAPPS from: $REPO_DIR"
echo "==> Git status:"
git status --porcelain || true

echo "==> Pulling latest..."
git pull

# Install dependencies (choose one)
if [ -f pnpm-lock.yaml ]; then
  echo "==> Installing deps with pnpm..."
  corepack enable || true
  pnpm install --frozen-lockfile
  echo "==> Building..."
  pnpm build
elif [ -f yarn.lock ]; then
  echo "==> Installing deps with yarn..."
  yarn install --frozen-lockfile
  echo "==> Building..."
  yarn build
else
  echo "==> Installing deps with npm..."
  npm ci
  echo "==> Building..."
  npm run build
fi

if [ ! -f ecosystem.newapps.config.js ]; then
  echo "ERROR: ecosystem.newapps.config.js not found in $REPO_DIR"
  exit 1
fi

echo "==> Switching PM2 processes to newapps ecosystem..."
# This ensures old processes (likely using ./apps) are removed so ports can be re-bound.
pm2 delete all || true

echo "==> Starting PM2 with ecosystem.newapps.config.js..."
pm2 start ecosystem.newapps.config.js --update-env

echo "==> Saving PM2 process list..."
pm2 save

echo "==> PM2 list:"
pm2 list

echo "==> Verifying iiskills-main is running from newapps..."
if pm2 show iiskills-main >/dev/null 2>&1; then
  pm2 show iiskills-main | egrep "exec cwd|script path|script args" || true
else
  echo "WARN: PM2 process named 'iiskills-main' not found. Check pm2 list above."
fi

echo "==> Done."
echo "If exec cwd still shows /apps/, then ecosystem.newapps.config.js still points to apps/ and must be fixed."
