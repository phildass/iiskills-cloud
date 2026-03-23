#!/usr/bin/env bash
# deploy-all.sh — Full production deployment for iiskills.cloud
#
# Usage:
#   ./deploy-all.sh [--force-clean]
#
# Options:
#   --force-clean   Hard-reset the working tree to origin/main before building
#                   (git stash clear + git reset --hard origin/main).
#
# What this script does:
#   1.  (Optional) Hard-reset to origin/main.
#   2.  Pull latest code (auto-stash any local changes).
#   3.  Install dependencies with Yarn 4 (immutable lockfile).
#   4.  Symlink /etc/iiskills.env → apps/*/.env.production (env hygiene).
#   5.  Deep-clean: delete all .next/ build caches for every app.
#   6.  Build each app SERIALLY (one at a time — prevents OOM + race conditions).
#   7.  Restart all PM2 processes.
#   8.  Run post-deploy entitlement checks for every paid app.
#       If any check fails → alert, restore previous build snapshot, restart PM2.
#
# Prerequisites:
#   • /etc/iiskills.env  — canonical env file with all shared variables
#   • pm2                — process manager
#   • curl               — used for post-deploy health checks
#   • node / yarn        — via nvm / corepack

set -euo pipefail

# ── Configuration ─────────────────────────────────────────────────────────────

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CANONICAL_ENV="/etc/iiskills.env"
SNAPSHOT_DIR="/tmp/iiskills-build-snapshots"

# Ordered list: main portal first, then learn apps.
# Add new apps here AND in ecosystem.config.js.
APPS=(
  "main"
  "learn-apt"
  "learn-chemistry"
  "learn-developer"
  "learn-geography"
  "learn-management"
  "learn-math"
  "learn-physics"
  "learn-pr"
  "learn-ai"
)

# Paid apps to probe after deployment (app-id → URL)
declare -A PAID_APP_ENTITLEMENT_URLS=(
  ["learn-ai"]="https://iiskills.cloud/api/entitlement?appId=learn-ai"
  ["learn-developer"]="https://iiskills.cloud/api/entitlement?appId=learn-developer"
  ["learn-management"]="https://iiskills.cloud/api/entitlement?appId=learn-management"
  ["learn-pr"]="https://iiskills.cloud/api/entitlement?appId=learn-pr"
)

# PM2 process names matching ecosystem.config.js
PM2_PROCESSES=(
  iiskills-main
  iiskills-learn-ai
  iiskills-learn-apt
  iiskills-learn-chemistry
  iiskills-learn-developer
  iiskills-learn-geography
  iiskills-learn-management
  iiskills-learn-math
  iiskills-learn-physics
  iiskills-learn-pr
)

FORCE_CLEAN=false
for arg in "$@"; do
  [[ "$arg" == "--force-clean" ]] && FORCE_CLEAN=true
done

# ── Helpers ───────────────────────────────────────────────────────────────────

step() { echo; echo "==> $*"; }
die()  { echo "❌  FATAL: $*" >&2; exit 1; }

# ── Step 0: Optional hard reset ───────────────────────────────────────────────

cd "$REPO_DIR"

if $FORCE_CLEAN; then
  step "[0/8] Force-clean: resetting to origin/main"
  git stash clear
  git fetch origin main
  git reset --hard origin/main
  echo "    ✓ Hard reset complete."
fi

# ── Step 1: Pull latest code ──────────────────────────────────────────────────

step "[1/8] Pulling latest code"
git fetch origin
git -c core.hooksPath=/dev/null pull --autostash --rebase origin main \
  || die "git pull failed. Resolve conflicts and re-run."
echo "    ✓ Repository is up to date."

# ── Step 2: Install dependencies ──────────────────────────────────────────────

step "[2/8] Installing dependencies"
corepack enable
yarn install --immutable
echo "    ✓ Dependencies installed."

# ── Step 3: Env hygiene — symlink /etc/iiskills.env ──────────────────────────

step "[3/8] Syncing environment variables from ${CANONICAL_ENV}"

if [[ ! -f "$CANONICAL_ENV" ]]; then
  echo "    ⚠  WARNING: ${CANONICAL_ENV} not found. Skipping env symlink."
  echo "       Apps will use their existing .env.production files (if any)."
else
  for APP in "${APPS[@]}"; do
    APP_ENV="${REPO_DIR}/apps/${APP}/.env.production"
    # Remove any existing regular file or symlink.
    [[ -e "$APP_ENV" || -L "$APP_ENV" ]] && rm -f "$APP_ENV"
    ln -s "$CANONICAL_ENV" "$APP_ENV"
    echo "    ✓ apps/${APP}/.env.production → ${CANONICAL_ENV}"
  done
fi

# ── Step 4: Deep-clean .next build caches ─────────────────────────────────────

step "[4/8] Deep-clean: removing all .next/ build caches"

mkdir -p "$SNAPSHOT_DIR"

for APP in "${APPS[@]}"; do
  NEXT_DIR="${REPO_DIR}/apps/${APP}/.next"
  if [[ -d "$NEXT_DIR" ]]; then
    SNAPSHOT="${SNAPSHOT_DIR}/${APP}-prev"
    # Keep the previous build as a rollback snapshot.
    rm -rf "$SNAPSHOT"
    cp -a "$NEXT_DIR" "$SNAPSHOT"
    rm -rf "$NEXT_DIR"
    echo "    ✓ apps/${APP}/.next removed (snapshot saved)"
  else
    echo "    – apps/${APP}/.next not found, skipping"
  fi
done

# ── Step 5: Serial builds ─────────────────────────────────────────────────────

step "[5/8] Building apps SERIALLY (one at a time)"

BUILD_FAILED=()

for APP in "${APPS[@]}"; do
  echo
  echo "  ------ BUILD: apps/${APP} ------"
  if (cd "${REPO_DIR}/apps/${APP}" && yarn build); then
    echo "  ------ DONE:  apps/${APP} ------"
  else
    echo "  ❌ Build FAILED for apps/${APP}" >&2
    BUILD_FAILED+=("$APP")
  fi
done

if [[ ${#BUILD_FAILED[@]} -gt 0 ]]; then
  die "Build failed for: ${BUILD_FAILED[*]}. Fix errors and re-run."
fi

echo "    ✓ All apps built successfully."

# ── Step 6: Restart PM2 ───────────────────────────────────────────────────────

step "[6/8] Restarting PM2 processes"

# Stop each process individually (ignore errors for processes that don't exist yet).
for PROC in "${PM2_PROCESSES[@]}"; do
  pm2 stop "$PROC" 2>/dev/null || true
done

pm2 delete iiskills-main-copy 2>/dev/null || true

pm2 start "${REPO_DIR}/ecosystem.config.js"
pm2 save

echo "    ✓ PM2 processes restarted."

# ── Step 7: Post-deploy entitlement checks ────────────────────────────────────

step "[7/8] Post-deploy entitlement health checks"

# Wait for apps to be ready before probing them.
echo "    Waiting 15 s for apps to warm up…"
sleep 15

# Optionally provide an admin session cookie for authenticated checks.
# Export IISKILLS_ADMIN_COOKIE=<value> before running this script.
ADMIN_COOKIE="${IISKILLS_ADMIN_COOKIE:-}"
ENTITLEMENT_FAILURES=()

for APP_ID in "${!PAID_APP_ENTITLEMENT_URLS[@]}"; do
  URL="${PAID_APP_ENTITLEMENT_URLS[$APP_ID]}"
  echo "  Checking ${APP_ID}: ${URL}"

  CURL_ARGS=(-s -o /tmp/ent-response.json -w "%{http_code}" --max-time 10)
  if [[ -n "$ADMIN_COOKIE" ]]; then
    CURL_ARGS+=(-H "Cookie: ${ADMIN_COOKIE}")
  fi

  HTTP_STATUS=$(curl "${CURL_ARGS[@]}" "$URL" || echo "000")

  if [[ "$HTTP_STATUS" != "200" ]]; then
    echo "    ❌ ${APP_ID}: HTTP ${HTTP_STATUS} (expected 200)"
    ENTITLEMENT_FAILURES+=("${APP_ID}:http_${HTTP_STATUS}")
    continue
  fi

  ENTITLED=$(node -e "
    const fs = require('fs');
    try {
      const raw = fs.readFileSync('/tmp/ent-response.json', 'utf8');
      const r = JSON.parse(raw);
      process.stdout.write(String(!!(r.entitled || r.adminAccess || r.freeAccess)));
    } catch (e) { process.stdout.write('parse_error'); }
  " 2>/dev/null)

  if [[ "$ENTITLED" == "true" ]]; then
    echo "    ✓ ${APP_ID}: entitled=true"
  else
    RESPONSE=$(cat /tmp/ent-response.json 2>/dev/null || echo "(no response)")
    echo "    ❌ ${APP_ID}: entitled=${ENTITLED} — response: ${RESPONSE}"
    ENTITLEMENT_FAILURES+=("${APP_ID}:not_entitled")
  fi
done

if [[ ${#ENTITLEMENT_FAILURES[@]} -gt 0 ]]; then
  echo
  echo "❌  ENTITLEMENT CHECK FAILED for: ${ENTITLEMENT_FAILURES[*]}"
  echo "    Initiating rollback to previous build snapshot…"

  for APP in "${APPS[@]}"; do
    SNAPSHOT="${SNAPSHOT_DIR}/${APP}-prev"
    if [[ -d "$SNAPSHOT" ]]; then
      rm -rf "${REPO_DIR}/apps/${APP}/.next"
      cp -a "$SNAPSHOT" "${REPO_DIR}/apps/${APP}/.next"
      echo "    ✓ Rolled back apps/${APP}/.next"
    fi
  done

  # Restart PM2 with the rolled-back builds.
  for PROC in "${PM2_PROCESSES[@]}"; do
    pm2 stop "$PROC" 2>/dev/null || true
  done
  pm2 start "${REPO_DIR}/ecosystem.config.js"
  pm2 save

  echo
  echo "⚠️   PM2 restarted with previous build."
  echo "    INVESTIGATE before the next deployment:"
  echo "      • Check /etc/iiskills.env for OPEN_ACCESS / ADMIN_AUTH_DISABLED values"
  echo "      • Verify the admin user's is_admin flag in the Supabase profiles table"
  echo "      • Check the entitlement cache (Redis or in-process Map)"
  echo "      • Review recent changes to packages/access-control/ or apps/main/api/entitlement.js"
  die "Deployment aborted. Entitlement check failed for: ${ENTITLEMENT_FAILURES[*]}"
fi

# ── Step 8: Summary ───────────────────────────────────────────────────────────

step "[8/8] Deployment complete ✅"
echo
echo "  Deployment summary"
echo "  ──────────────────"
for APP in "${APPS[@]}"; do
  echo "  ✓ apps/${APP}"
done
echo
echo "  PM2 status:"
pm2 list
echo
echo "  All entitlement checks passed."
echo "  Deployment finished successfully."

