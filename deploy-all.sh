#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# IISkills deploy-all.sh (Optimized Version)
# ---------------------------------------------------------------------------
# IMPROVEMENTS:
# 1. Shallow Clone: Uses --depth 1 to avoid downloading 300MB+ of history.
# 2. Fast Update: Uses reset --hard instead of rebase to avoid "Request Storms".
# 3. Cache Purge: Automatically clears .next folders to fix "Sticky" UI.
# ---------------------------------------------------------------------------

FORCE_CLEAN=false
for _arg in "$@"; do
  case "$_arg" in
    --force-clean) FORCE_CLEAN=true ;;
    *) echo "WARNING: Unknown argument '$_arg' — ignoring." ;;
  esac
done

DEPLOY_TS="$(date +%Y-%m-%d-%H%M)"
LOG_DIR="/var/log/iiskills"
LOGFILE="${LOG_DIR}/deploy-${DEPLOY_TS}.log"

mkdir -p "$LOG_DIR" 2>/dev/null || true
exec > >(tee -a "$LOGFILE") 2>&1

_on_exit() {
  local exit_code=$?
  [ "${exit_code}" -eq 0 ] && return 0
  echo "==> DEPLOY FAILED — exit code ${exit_code}. Check $LOGFILE for diagnostics."
}
trap '_on_exit' EXIT

if [ -f /etc/iiskills.env ]; then
  echo "==> Loading credentials from /etc/iiskills.env"
  set -a; source /etc/iiskills.env; set +a
fi

REPO_DIR="/root/iiskills-cloud-apps"
REPO_URL="https://github.com/phildass/iiskills-cloud.git"
BRANCH="main"

echo "==> Enabling corepack and verifying tools"
corepack enable || true
for cmd in node yarn pm2 git; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "ERROR: '$cmd' not found."; exit 1; }
done

# ---------------------------------------------------------------------------
# OPTIMIZED: Update or Initialize (Shallow strategy)
# ---------------------------------------------------------------------------
if [ -d "$REPO_DIR/.git" ]; then
  echo "==> Updating existing checkout via FAST FETCH: $REPO_DIR"
  cd "$REPO_DIR"
  
  if [ "$FORCE_CLEAN" = "true" ]; then
    echo "  --force-clean: Nuclear wipe enabled"
    git clean -fdx
    find . -name "node_modules" -type d -prune -exec rm -rf {} +
  fi

  git fetch --depth 1 origin "$BRANCH"
  git reset --hard "origin/${BRANCH}"
  # CRITICAL: Always purge .next to ensure the Admin Bypass is fresh
  echo "  Purging .next build caches to prevent stale Admin UI..."
  find . -name ".next" -type d -prune -exec rm -rf {} +
else
  echo "==> First-time SHALLOW clone (fast mode)"
  git clone --depth 1 --branch "$BRANCH" "$REPO_URL" "$REPO_DIR"
  cd "$REPO_DIR"
fi

echo "==> Install dependencies"
yarn install --immutable

# ---------------------------------------------------------------------------
# Environment Linking & OTP Guard
# ---------------------------------------------------------------------------
if [ -f /etc/iiskills.env ]; then
  for _app_dir in "$REPO_DIR"/apps/*/; do
    ln -sf /etc/iiskills.env "${_app_dir}.env.production"
  done
fi

echo "==> Running OTP policy guard"
./node_modules/.bin/jest tests/noOtpRemnants.test.js --forceExit --silent || exit 1

# ---------------------------------------------------------------------------
# Build Logic — strict order, concurrency=1 to prevent OOM on 8 GB hosts
# ---------------------------------------------------------------------------
export NODE_OPTIONS="--max-old-space-size=2048"

echo "==> Step 1/3: Building shared packages (concurrency=1)"
npx turbo run build --filter=./packages/* --concurrency=1

echo "==> Step 2/3: Building @iiskills/main (concurrency=1)"
npx turbo run build --filter=@iiskills/main --concurrency=1

echo "==> Step 3/3: Building learn apps (concurrency=1)"
npx turbo run build \
  --filter=learn-apt \
  --filter=learn-chemistry \
  --filter=learn-developer \
  --filter=learn-geography \
  --filter=learn-management \
  --filter=learn-math \
  --filter=learn-physics \
  --filter=learn-pr \
  --filter=learn-ai \
  --concurrency=1

# ---------------------------------------------------------------------------
# PM2 Restart Logic — delete ALL existing processes to avoid duplicates,
# then start each app on its hardcoded Nginx-mapped port.
# ---------------------------------------------------------------------------
echo "==> Build validated. Stopping all existing PM2 processes."
pm2 delete all >/dev/null 2>&1 || true

# Hardcoded port assignments (must match Nginx upstream config)
declare -A PORTS=(
  ["main"]=3000
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
  port="${PORTS[$app]}"
  dir="$REPO_DIR/apps/$app"
  [ -d "$dir" ] || continue
  cd "$dir"
  PORT=$port pm2 start "npx next start -p $port" --name "iiskills-$app"
done

pm2 save

echo "==> Reloading Nginx"
nginx -s reload 2>/dev/null || systemctl reload nginx 2>/dev/null || true

echo "================================================================"
echo "==> Deployment complete. Admin Bypass is LIVE."
echo "================================================================"
