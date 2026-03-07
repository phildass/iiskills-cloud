#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# IISkills deploy-all.sh
# ---------------------------------------------------------------------------
# Usage: ./deploy-all.sh
#
# All output is tee'd to /var/log/iiskills/deploy-<timestamp>.log so that
# post-failure forensics (OOM kills, resource exhaustion) are preserved.
# ---------------------------------------------------------------------------

DEPLOY_TS="$(date +%Y-%m-%d-%H%M)"
LOG_DIR="/var/log/iiskills"
LOGFILE="${LOG_DIR}/deploy-${DEPLOY_TS}.log"

# Redirect all stdout + stderr through tee into the log file.
# If we cannot write to the log dir (e.g. CI sandbox), fall back to /tmp.
mkdir -p "$LOG_DIR" 2>/dev/null || true
if [ -w "$LOG_DIR" ]; then
  exec > >(tee -a "$LOGFILE") 2>&1
  echo "==> Deploy log: $LOGFILE"
else
  LOGFILE="/tmp/iiskills-deploy-${DEPLOY_TS}.log"
  exec > >(tee -a "$LOGFILE") 2>&1
  echo "WARNING: Cannot write to $LOG_DIR — logging to $LOGFILE instead"
fi

# ---------------------------------------------------------------------------
# Failure trap: capture system diagnostics to help identify OOM kills
# ---------------------------------------------------------------------------
_on_error() {
  local exit_code=$?
  local failing_line=${BASH_LINENO[0]}
  echo ""
  echo "================================================================"
  echo "DEPLOY FAILED — exit code ${exit_code} at line ${failing_line}"
  echo "Collecting system diagnostics for root-cause analysis..."
  echo "================================================================"
  echo ""
  echo "--- node version ---"
  node -v 2>/dev/null || echo "(node not found)"
  echo "--- yarn version ---"
  yarn --version 2>/dev/null || echo "(yarn not found)"
  echo ""
  echo "--- free -h (memory) ---"
  free -h 2>/dev/null || echo "(free not available)"
  echo ""
  echo "--- /proc/meminfo (first 40 lines) ---"
  head -n 40 /proc/meminfo 2>/dev/null || echo "(/proc/meminfo not available)"
  echo ""
  echo "--- df -h (disk) ---"
  df -h 2>/dev/null || echo "(df not available)"
  echo ""
  echo "--- ulimit -a ---"
  ulimit -a 2>/dev/null || echo "(ulimit not available)"
  echo ""
  echo "--- dmesg -T (last 200 lines — OOM evidence) ---"
  dmesg -T 2>/dev/null | tail -n 200 || echo "(dmesg not available or not permitted)"
  echo ""
  echo "================================================================"
  echo "End of diagnostics. Log saved to: ${LOGFILE}"
  echo "================================================================"
  exit "${exit_code}"
}
trap '_on_error' ERR

# ---------------------------------------------------------------------------
# Load credentials from /etc/iiskills.env if present
# ---------------------------------------------------------------------------
if [ -f /etc/iiskills.env ]; then
  echo "==> Loading credentials from /etc/iiskills.env"
  set -a; source /etc/iiskills.env; set +a
else
  echo "WARNING: /etc/iiskills.env not found — Supabase/env vars may be missing."
fi

REPO_DIR="/root/iiskills-cloud-apps"
REPO_URL="https://github.com/phildass/iiskills-cloud.git"
BRANCH="main"

# ---------------------------------------------------------------------------
# Verify required tools are available
# ---------------------------------------------------------------------------
for cmd in node yarn pm2 git; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "ERROR: '$cmd' not found in PATH. Aborting."; exit 1; }
done

echo "==> Runtime versions"
node -v
yarn --version

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

echo "==> Install dependencies (monorepo)"
corepack enable || true
yarn install

# ---------------------------------------------------------------------------
# OTP policy guard — fail fast if any OTP remnants are present
# ---------------------------------------------------------------------------
echo "==> OTP policy guard"
./node_modules/.bin/jest tests/noOtpRemnants.test.js --forceExit 2>&1 \
  && echo "  OTP guard: PASSED" \
  || { echo "ERROR: OTP guard FAILED — deploy aborted. Remove OTP remnants first."; exit 1; }

# ---------------------------------------------------------------------------
# Build — with memory headroom + capped concurrency to prevent OOM kills
#
# NODE_OPTIONS=--max-old-space-size=4096 raises Node's V8 heap limit so that
# Next.js build workers don't get killed by the kernel OOM reaper (exit 129).
#
# --concurrency=2 prevents Turborepo from running too many Next.js build
# workers in parallel on memory-constrained hosts.
# ---------------------------------------------------------------------------
echo "==> Build (monorepo) — NODE_OPTIONS=--max-old-space-size=4096, turbo concurrency=2"
export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--max-old-space-size=4096"
yarn turbo run build --concurrency=2

# ---------------------------------------------------------------------------
# Start MAIN on :3000
# ---------------------------------------------------------------------------
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
  port="${PORTS[$app]}"
  app_dir="$REPO_DIR/apps/$app"
  if [ ! -d "$app_dir" ]; then
    echo "WARNING: $app_dir not found — skipping $app"
    continue
  fi
  if [ ! -f "$app_dir/.next/BUILD_ID" ]; then
    echo "WARNING: $app_dir/.next/BUILD_ID not found — build may have failed, skipping $app"
    continue
  fi
  cd "$app_dir"
  pm2 delete "iiskills-$app" 2>/dev/null || true
  PORT=$port pm2 start "npx next start -p $port" --name "iiskills-$app"
  echo "  Started iiskills-$app on :$port"
done

echo "==> Save PM2 process list"
pm2 save

echo "================================================================"
echo "==> Deployment complete. Run 'pm2 status' to verify."
echo "==> Log file: ${LOGFILE}"
echo "================================================================"
