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

echo "==> Stop existing IISkills PM2 processes only (do NOT delete all PM2 processes on the host)"
# Only manage our own processes. Never run `pm2 delete all`.
IISKILLS_PROCS=(
  "iiskills-main"
  "iiskills-learn-apt"
  "iiskills-learn-chemistry"
  "iiskills-learn-developer"
  "iiskills-learn-geography"
  "iiskills-learn-management"
  "iiskills-learn-math"
  "iiskills-learn-physics"
  "iiskills-learn-pr"
  "iiskills-learn-ai"
)

for p in "${IISKILLS_PROCS[@]}"; do
  pm2 stop "$p" >/dev/null 2>&1 || true
  pm2 delete "$p" >/dev/null 2>&1 || true
done

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

