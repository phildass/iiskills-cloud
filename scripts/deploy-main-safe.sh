#!/usr/bin/env bash
# =============================================================================
# scripts/deploy-main-safe.sh
#
# Safe pull + build + deploy for iiskills-main (apps/main).
#
# Guarantees:
#   - Never restarts PM2 unless the Next.js build succeeds.
#   - Uses a file lock so concurrent runs are prevented.
#   - Preserves the last known good .next build (.next.prev) as a fast fallback.
#   - Stores the previous git HEAD so git rollback is possible.
#   - Logs every step with timestamps to logs/deploy-main/<timestamp>.log.
#
# Requirements on the server:
#   - git, yarn (>=4), node (>=18), pm2, curl, flock  (all standard on Ubuntu/Debian)
#   - apps/main/.env.local must already exist with the correct env vars
#
# Usage:
#   bash scripts/deploy-main-safe.sh [--skip-preflight] [--port PORT]
#
# Options:
#   --skip-preflight   Skip scripts/preflight-main.sh (useful in CI)
#   --port PORT        Override the health-check port (default: 3000)
#
# Exit codes:
#   0 — deploy succeeded
#   1 — deploy failed (PM2 was NOT restarted; site remains up)
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
APP_DIR="${REPO_ROOT}/apps/main"
PM2_APP_NAME="iiskills-main"
PORT=3000
HEALTH_PATH="/api/health"
HEALTH_TIMEOUT=60   # seconds to wait for health check after restart
LOCK_FILE="/tmp/iiskills-main-deploy.lock"
LOG_BASE_DIR="${REPO_ROOT}/logs/deploy-main"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
LOG_FILE="${LOG_BASE_DIR}/${TIMESTAMP}.log"
SKIP_PREFLIGHT=false

# ---------------------------------------------------------------------------
# Parse arguments
# ---------------------------------------------------------------------------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --skip-preflight) SKIP_PREFLIGHT=true ;;
    --port)           PORT="$2"; shift ;;
    --help)
      echo "Usage: bash scripts/deploy-main-safe.sh [--skip-preflight] [--port PORT]"
      exit 0
      ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
  shift
done

# ---------------------------------------------------------------------------
# Colours (used in terminal output; stripped from log file via tee)
# ---------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# ---------------------------------------------------------------------------
# Logging helpers
# ---------------------------------------------------------------------------
mkdir -p "${LOG_BASE_DIR}"

# All output goes to both the terminal and the log file.
# We redirect fd 3 to the original stdout for colour output.
exec 3>&1
exec > >(tee -a "${LOG_FILE}") 2>&1

log()  { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"; }
info() { log "INFO  $*"; }
ok()   { log "OK    $*"; }
err()  { log "ERROR $*"; }
warn() { log "WARN  $*"; }

info "Deploy log: ${LOG_FILE}"
echo ""
echo -e "${BOLD}${CYAN}========================================${NC}" >&3
echo -e "${BOLD}${CYAN} iiskills-main Safe Deploy — ${TIMESTAMP}${NC}" >&3
echo -e "${BOLD}${CYAN}========================================${NC}" >&3
echo ""

# ---------------------------------------------------------------------------
# Acquire file lock to prevent concurrent deploys
# ---------------------------------------------------------------------------
exec 9>"${LOCK_FILE}"
if ! flock -n 9; then
  err "Another deploy is already running (lock: ${LOCK_FILE}). Aborting."
  exit 1
fi
info "Lock acquired: ${LOCK_FILE}"

# ---------------------------------------------------------------------------
# Ensure we always release the lock on exit
# ---------------------------------------------------------------------------
cleanup() {
  flock -u 9 2>/dev/null || true
  exec 9>&- 2>/dev/null || true
}
trap cleanup EXIT

# ---------------------------------------------------------------------------
# Step 0: Pre-flight checks
# ---------------------------------------------------------------------------
if [ "${SKIP_PREFLIGHT}" = false ]; then
  info "Step 0: Running pre-flight checks..."
  if ! bash "${SCRIPT_DIR}/preflight-main.sh"; then
    err "Pre-flight checks failed — aborting deploy."
    exit 1
  fi
  ok "Pre-flight checks passed."
else
  warn "Skipping pre-flight checks (--skip-preflight)."
fi
echo ""

# ---------------------------------------------------------------------------
# Step 1: Verify working tree is clean
# ---------------------------------------------------------------------------
info "Step 1: Checking working tree..."
cd "${REPO_ROOT}"

if ! git diff --quiet || ! git diff --cached --quiet; then
  err "Working tree has uncommitted changes — refusing to deploy."
  err "Run 'git status' to see what changed. Stash or commit before deploying."
  exit 1
fi
ok "Working tree is clean."
echo ""

# ---------------------------------------------------------------------------
# Step 2: Record previous HEAD for potential rollback
# ---------------------------------------------------------------------------
PREV_SHA="$(git rev-parse HEAD)"
info "Step 2: Previous HEAD: ${PREV_SHA}"
echo ""

# ---------------------------------------------------------------------------
# Step 3: Fetch and reset to origin/main
# ---------------------------------------------------------------------------
info "Step 3: Fetching origin/main..."
git fetch origin
git checkout main
git reset --hard origin/main
NEW_SHA="$(git rev-parse HEAD)"
ok "Now at: ${NEW_SHA}"
if [ "${PREV_SHA}" = "${NEW_SHA}" ]; then
  warn "No new commits — HEAD is unchanged. Continuing anyway."
fi
echo ""

# ---------------------------------------------------------------------------
# Step 4: Install dependencies (deterministic)
# ---------------------------------------------------------------------------
info "Step 4: Installing dependencies..."
# Yarn 4 uses --immutable by default when CI=true; pass it explicitly otherwise.
if ! yarn install --immutable 2>/dev/null; then
  warn "'yarn install --immutable' failed (lockfile may be out of date). Retrying without --immutable..."
  yarn install
fi
ok "Dependencies installed."
echo ""

# ---------------------------------------------------------------------------
# Step 5: Preserve previous build as fallback (.next.prev)
# ---------------------------------------------------------------------------
info "Step 5: Backing up current build (if any)..."
if [ -d "${APP_DIR}/.next" ]; then
  rm -rf "${APP_DIR}/.next.prev"
  cp -al "${APP_DIR}/.next" "${APP_DIR}/.next.prev" 2>/dev/null || cp -r "${APP_DIR}/.next" "${APP_DIR}/.next.prev"
  ok "Previous build saved to apps/main/.next.prev"
else
  warn "No existing .next build to back up."
fi
echo ""

# ---------------------------------------------------------------------------
# Step 6: Build apps/main — FAIL HARD on error; do NOT restart PM2
# ---------------------------------------------------------------------------
info "Step 6: Building apps/main..."
BUILD_SUCCESS=false

cd "${APP_DIR}"
if yarn build; then
  BUILD_SUCCESS=true
  ok "Build succeeded."
else
  err "Build FAILED — PM2 will NOT be restarted."
fi
cd "${REPO_ROOT}"

if [ "${BUILD_SUCCESS}" = false ]; then
  # Restore the previous build artefact so the running site keeps working
  if [ -d "${APP_DIR}/.next.prev" ]; then
    warn "Restoring previous .next build from backup..."
    rm -rf "${APP_DIR}/.next"
    mv "${APP_DIR}/.next.prev" "${APP_DIR}/.next"
    warn "Previous build restored — running site should remain unaffected."
  fi

  err "Deploy ABORTED. Check the log for details: ${LOG_FILE}"
  exit 1
fi
echo ""

# ---------------------------------------------------------------------------
# Step 7: Validate Next.js production build output
# ---------------------------------------------------------------------------
info "Step 7: Validating build output..."
BUILD_ID_FILE="${APP_DIR}/.next/BUILD_ID"
if [ ! -f "${BUILD_ID_FILE}" ]; then
  err "Build output not found: ${BUILD_ID_FILE}. The build may have silently failed."
  exit 1
fi
BUILD_ID="$(cat "${BUILD_ID_FILE}")"
ok "Build ID: ${BUILD_ID}"
echo ""

# ---------------------------------------------------------------------------
# Step 8: Restart iiskills-main via PM2
# ---------------------------------------------------------------------------
info "Step 8: Restarting PM2 process '${PM2_APP_NAME}'..."

if ! command -v pm2 &>/dev/null; then
  err "pm2 is not installed or not in PATH."
  exit 1
fi

# Reload env vars from ecosystem.config.js if it exists; otherwise plain restart
if [ -f "${REPO_ROOT}/ecosystem.config.js" ]; then
  pm2 restart "${PM2_APP_NAME}" --update-env
else
  pm2 restart "${PM2_APP_NAME}"
fi
ok "PM2 restart issued."
echo ""

# ---------------------------------------------------------------------------
# Step 9: Health check — wait for /api/health to respond
# ---------------------------------------------------------------------------
info "Step 9: Waiting for health check (up to ${HEALTH_TIMEOUT}s)..."
HEALTH_URL="http://127.0.0.1:${PORT}${HEALTH_PATH}"
WAITED=0
HEALTH_OK=false

while [ "${WAITED}" -lt "${HEALTH_TIMEOUT}" ]; do
  HTTP_STATUS="$(curl -s -o /dev/null -w '%{http_code}' --connect-timeout 2 "${HEALTH_URL}" 2>/dev/null || echo "000")"
  if [ "${HTTP_STATUS}" = "200" ]; then
    HEALTH_OK=true
    break
  fi
  sleep 2
  WAITED=$((WAITED + 2))
done

if [ "${HEALTH_OK}" = true ]; then
  ok "Health check passed (${HEALTH_URL} → 200 OK)"
else
  err "Health check FAILED after ${HEALTH_TIMEOUT}s — ${HEALTH_URL} did not return 200."

  # Attempt automatic rollback: restart PM2 with the previous build
  warn "Attempting rollback to previous build..."
  if [ -d "${APP_DIR}/.next.prev" ]; then
    rm -rf "${APP_DIR}/.next"
    mv "${APP_DIR}/.next.prev" "${APP_DIR}/.next"
    if pm2 restart "${PM2_APP_NAME}" --update-env 2>/dev/null || pm2 restart "${PM2_APP_NAME}" 2>/dev/null; then
      warn "Rollback complete — previous .next build restored and PM2 restarted."
      warn "Consider also rolling back git: git reset --hard ${PREV_SHA}"
    else
      err "Rollback PM2 restart FAILED — manual intervention required: pm2 restart ${PM2_APP_NAME}"
    fi
  else
    warn "No .next.prev backup available; cannot auto-restore build."
    warn "Manual rollback: git reset --hard ${PREV_SHA} && cd apps/main && yarn build && pm2 restart ${PM2_APP_NAME}"
  fi

  err "Deploy FAILED. Log: ${LOG_FILE}"
  exit 1
fi
echo ""

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
ok "Previous SHA : ${PREV_SHA}"
ok "Deployed SHA : ${NEW_SHA}"
ok "Build ID     : ${BUILD_ID}"
ok "Log          : ${LOG_FILE}"
echo ""
echo -e "${GREEN}${BOLD}✅ Deploy succeeded!${NC}" >&3
echo ""
