#!/usr/bin/env bash
set +euo pipefail

REPO_DIR="/root/iiskills-cloud-apps"
REPO_URL="https://github.com/phildass/iiskills-cloud.git"
BRANCH="main"

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
    echo "==> Starting $app on :$port"
    cd "$app_dir"
    PORT="$port" pm2 start "npx next start -p $port" --name "iiskills-$app"
  else
    echo "==> Skipping $app (missing: $app_dir)"
  fi
done

pm2 save
pm2 ls

echo "==> Quick curl checks"
curl -fsS "http://localhost:3000" >/dev/null && echo "OK main :3000"
echo "DONE. Test in browser:"
echo " - https://app.iiskills.cloud/"
echo " - https://app.iiskills.cloud/admin"
