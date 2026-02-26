#!/usr/bin/env bash
set -euo pipefail

# Load credentials from /etc/iiskills.env if present (makes env vars available
# for both build-time Turbo/Next and runtime pm2 start).
if [ -f /etc/iiskills.env ]; then
  echo "==> Loading credentials from /etc/iiskills.env"
  set -a; source /etc/iiskills.env; set +a
else
  echo "WARNING: /etc/iiskills.env not found — Supabase/env vars may be missing."
fi

REPO_DIR="/root/iiskills-cloud-apps"
REPO_URL="https://github.com/phildass/iiskills-cloud.git"
BRANCH="main"

# Verify required tools are available
for cmd in node yarn pm2 git; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "ERROR: '$cmd' not found in PATH. Aborting."; exit 1; }
done

echo "==> Stop existing PM2 processes (keep nginx as-is)"
pm2 stop all || true
pm2 delete all || true

echo "==> Backup previous checkout (if exists)"
if [ -d "$REPO_DIR" ]; then
  ts="$(date +%Y%m%d-%H%M%S)"
  mv "$REPO_DIR" "${REPO_DIR}.BAK.${ts}"
fi

echo "==> Fresh clone"
git clone "$REPO_URL" "$REPO_DIR"
cd "$REPO_DIR"
git checkout "$BRANCH"
git pull

echo "==> Install + build (monorepo)"
corepack enable || true
yarn install
yarn turbo run build

echo "==> Start MAIN on :3000 from apps/main"
if [ ! -d "$REPO_DIR/apps/main" ]; then
  echo "ERROR: apps/main directory not found. Aborting."; exit 1
fi
if [ ! -f "$REPO_DIR/apps/main/.next/BUILD_ID" ]; then
  echo "ERROR: apps/main/.next/BUILD_ID not found — build may have failed. Aborting."; exit 1
fi
cd "$REPO_DIR/apps/main"
PORT=3000 pm2 start "npx next start -p 3000" --name iiskills-main

echo "==> Start learn apps if present (ports hardcoded to match your current nginx/pm2 layout)"
declare -A PORTS=(
  ["learn-apt"]=3002
  ["learn-chemistry"]=3005
  ["learn-developer"]=3007
  ["learn-geography"]=3011
  ["learn-management"]=3016
  ["learn-math"]=3017
  ["learn-physics"]=3020
  ["learn-pr"]=3021
  ["learn-ai"]=3024
)

for app in "${!PORTS[@]}"; do
  app_dir="$REPO_DIR/apps/$app"
  port="${PORTS[$app]}"
  if [ -d "$app_dir" ]; then
    if [ ! -f "$app_dir/.next/BUILD_ID" ]; then
      echo "==> Skipping $app (no .next/BUILD_ID — build may have failed)"
    else
      echo "==> Starting $app on :$port"
      cd "$app_dir"
      PORT="$port" pm2 start "npx next start -p $port" --name "iiskills-$app"
    fi
  else
    echo "==> Skipping $app (missing: $app_dir)"
  fi
done

pm2 save
pm2 ls

echo "==> Verify iiskills-main is responding on :3000"
sleep 4
if ! curl -fsS "http://localhost:3000" >/dev/null 2>&1; then
  echo "ERROR: http://localhost:3000 not responding. PM2 logs:"
  pm2 logs iiskills-main --lines 200 --nostream
  exit 1
fi
echo "OK: main :3000"

echo "DONE. Test in browser:"
echo " - https://app.iiskills.cloud/ (staging)"
echo " - https://iiskills.cloud/ (production target — DNS/Nginx flip when ready)"
echo " - https://learn-apt.iiskills.cloud/ (learn-apt subdomain)"
