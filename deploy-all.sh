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

IISKILLS_PROCS=(
  "iiskills-main" "iiskills-main-copy" "iiskills-learn-apt"
  "iiskills-learn-chemistry" "iiskills-learn-developer"
  "iiskills-learn-geography" "iiskills-learn-management"
  "iiskills-learn-math" "iiskills-learn-physics"
  "iiskills-learn-pr" "iiskills-learn-ai"
)

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
# Build Logic (Memory & Concurrency Clamped)
# ---------------------------------------------------------------------------
_turbo_concurrency="${IISKILLS_TURBO_CONCURRENCY:-2}"
export NODE_OPTIONS="--max-old-space-size=2048" # Clamped to prevent OOM
echo "==> Starting build with concurrency=$_turbo_concurrency"
yarn turbo run build --concurrency="${_turbo_concurrency}"

# ---------------------------------------------------------------------------
# PM2 Restart Logic
# ---------------------------------------------------------------------------
echo "==> Build validated. Restarting PM2 processes."
for p in "${IISKILLS_PROCS[@]}"; do
  pm2 delete "$p" >/dev/null 2>&1 || true
done

# Start Apps
declare -A PORTS=(
  ["main"]=3000 ["main-copy"]=3030 ["learn-apt"]=3002 ["learn-chemistry"]=3005 
  ["learn-developer"]=3007 ["learn-geography"]=3011 ["learn-management"]=3016 
  ["learn-math"]=3017 ["learn-physics"]=3020 ["learn-pr"]=3021 ["learn-ai"]=3024
)

for app in "${!PORTS[@]}"; do
  port="${PORTS[$app]}"
  dir="$REPO_DIR/apps/$app"
  [ -d "$dir" ] || continue
  cd "$dir"
  PORT=$port pm2 start "npx next start -p $port" --name "iiskills-$app"
done

pm2 save
echo "================================================================"
echo "==> Deployment complete. Admin Bypass is now LIVE."
echo "================================================================"
