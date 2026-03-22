#!/usr/bin/env bash
# deep-clean.sh — VPS manual deep-clean procedure
#
# Performs a full clean rebuild of the IISkills monorepo on the VPS:
#   1. Pull latest code from origin/main
#   2. Restart nginx to activate the proxy-buffer fix
#   3. Kill all PM2 processes and purge build artefacts
#   4. Reinstall dependencies and rebuild all apps (no-cache)
#   5. Start all apps via ecosystem.config.js
#   6. Poll localhost:3020 until it returns HTTP 200
#
# Usage (run as root or with sudo on the VPS):
#   sudo bash deep-clean.sh
#
# Optionally, override the validation port:
#   VALIDATE_PORT=3000 sudo bash deep-clean.sh

set -euo pipefail

VALIDATE_PORT="${VALIDATE_PORT:-3020}"
REPO_DIR="${REPO_DIR:-/root/iiskills-cloud-apps}"

# Load credentials if available
if [ -f /etc/iiskills.env ]; then
  echo "==> Loading credentials from /etc/iiskills.env"
  set -a; source /etc/iiskills.env; set +a
fi

# ---------------------------------------------------------------------------
# 1. Infrastructure — pull latest code and restart nginx (activates buffer fix)
# ---------------------------------------------------------------------------
echo ""
echo "================================================================"
echo "  STEP 1: Infrastructure update (git pull + nginx restart)"
echo "================================================================"

if [ -d "${REPO_DIR}/.git" ]; then
  cd "${REPO_DIR}"
  echo "==> Pulling latest code from origin/main..."
  git pull origin main
else
  echo "WARNING: ${REPO_DIR} is not a git repository. Skipping git pull."
fi

echo "==> Restarting nginx to activate proxy buffer settings..."
if systemctl restart nginx 2>/dev/null; then
  echo "  ✓ nginx restarted successfully."
else
  echo "  WARNING: systemctl restart nginx failed — trying nginx reload..."
  nginx -s reload 2>/dev/null || echo "  WARNING: nginx reload also failed; check nginx status manually."
fi

# ---------------------------------------------------------------------------
# 2. Purge — kill PM2 and remove all build artefacts
# ---------------------------------------------------------------------------
echo ""
echo "================================================================"
echo "  STEP 2: Purge (pm2 kill + remove node_modules/.turbo/.next)"
echo "================================================================"

cd "${REPO_DIR}"

echo "==> Killing all PM2 processes..."
pm2 kill >/dev/null 2>&1 || true
echo "  ✓ PM2 processes terminated."

echo "==> Removing node_modules..."
rm -rf node_modules
echo "  ✓ node_modules removed."

echo "==> Removing .turbo caches..."
rm -rf .turbo
echo "  ✓ .turbo removed."

echo "==> Removing .next build directories..."
find apps -maxdepth 2 -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true
echo "  ✓ apps/**/.next removed."

# ---------------------------------------------------------------------------
# 3. Build — reinstall dependencies and build all apps
# ---------------------------------------------------------------------------
echo ""
echo "================================================================"
echo "  STEP 3: Build (yarn install + turbo build --no-cache)"
echo "================================================================"

cd "${REPO_DIR}"

export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=2048}"
# 2 GB heap limit is required on a constrained VPS to prevent OOM during
# the Turbo build phase, which compiles all apps sequentially.

echo "==> Installing dependencies (yarn install)..."
yarn install
echo "  ✓ Dependencies installed."

echo "==> Building all packages and apps (--no-cache, --concurrency=1)..."
npx turbo run build --no-cache --concurrency=1
echo "  ✓ Build complete."

# ---------------------------------------------------------------------------
# 4. Launch — start all apps via PM2
# ---------------------------------------------------------------------------
echo ""
echo "================================================================"
echo "  STEP 4: Launch (pm2 start ecosystem.config.js --update-env)"
echo "================================================================"

cd "${REPO_DIR}"

echo "==> Starting all apps via PM2..."
pm2 start ecosystem.config.js --update-env
pm2 save
echo "  ✓ PM2 processes started."

# ---------------------------------------------------------------------------
# 5. Validation — poll localhost:VALIDATE_PORT until HTTP 200
# ---------------------------------------------------------------------------
echo ""
echo "================================================================"
echo "  STEP 5: Validation (curl -I localhost:${VALIDATE_PORT})"
echo "================================================================"

MAX_ATTEMPTS=30
SLEEP_SECS=10
attempt=0

echo "==> Polling http://localhost:${VALIDATE_PORT}/ for HTTP 200..."
echo "    (max ${MAX_ATTEMPTS} attempts, ${SLEEP_SECS}s apart = up to $(( MAX_ATTEMPTS * SLEEP_SECS ))s)"

while true; do
  attempt=$(( attempt + 1 ))
  http_code="$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://localhost:${VALIDATE_PORT}/" 2>/dev/null || echo "000")"

  if [ "$http_code" = "200" ]; then
    echo ""
    echo "  ✓ localhost:${VALIDATE_PORT} returned HTTP ${http_code} — app is UP!"
    break
  fi

  echo "  [attempt ${attempt}/${MAX_ATTEMPTS}] HTTP ${http_code} — waiting ${SLEEP_SECS}s..."

  if [ "$attempt" -ge "$MAX_ATTEMPTS" ]; then
    echo ""
    echo "  ✗ VALIDATION FAILED: localhost:${VALIDATE_PORT} did not return HTTP 200"
    echo "    after $(( MAX_ATTEMPTS * SLEEP_SECS )) seconds."
    echo "    Run 'pm2 logs' or 'pm2 status' to diagnose the issue."
    exit 1
  fi

  sleep "$SLEEP_SECS"
done

echo ""
echo "================================================================"
echo "  Deep-clean complete. All steps passed successfully."
echo "================================================================"
