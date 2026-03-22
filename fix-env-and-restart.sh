#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# fix-env-and-restart.sh
# ---------------------------------------------------------------------------
# One-shot VPS maintenance script to fix silent crashes caused by stale or
# missing environment variables in all learn apps.
#
# What this script does:
#   1. Credential Sync  — copies /etc/iiskills.env to apps/*/.env so that
#                         Next.js picks up the credentials at runtime.
#   2. Process Cleanup  — deletes all current PM2 processes so nothing carries
#                         forward stale cached env vars.
#   3. Environment Refresh — starts apps fresh from ecosystem.config.js with
#                            the updated .env files on disk.
#   4. Port Verification — waits for each app to start and checks that the
#                          expected port is actually bound.
#
# IMPORTANT: Run this script directly on the VPS.
#            Do NOT commit .env files or secrets to GitHub.
#
# Usage:
#   cd /root/iiskills-cloud-apps
#   bash fix-env-and-restart.sh
# ---------------------------------------------------------------------------

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Expected port assignments (must match ecosystem.config.js and Nginx upstream)
declare -A EXPECTED_PORTS=(
  ["iiskills-main"]=3000
  ["iiskills-main-copy"]=3030
  ["iiskills-learn-ai"]=3024
  ["iiskills-learn-apt"]=3002
  ["iiskills-learn-chemistry"]=3005
  ["iiskills-learn-developer"]=3007
  ["iiskills-learn-geography"]=3011
  ["iiskills-learn-management"]=3016
  ["iiskills-learn-math"]=3017
  ["iiskills-learn-physics"]=3020
  ["iiskills-learn-pr"]=3021
)

# ---------------------------------------------------------------------------
# Step 0: Pre-flight checks
# ---------------------------------------------------------------------------
echo "==> [0/4] Pre-flight checks"

ENV_SOURCE="/etc/iiskills.env"
if [ ! -f "$ENV_SOURCE" ]; then
  echo "ERROR: $ENV_SOURCE not found. Cannot sync credentials."
  exit 1
fi

for cmd in pm2 node; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "ERROR: '$cmd' not found in PATH."; exit 1; }
done

echo "  ✓ $ENV_SOURCE found"
echo "  ✓ Required commands available"

# ---------------------------------------------------------------------------
# Step 1: Credential Sync — copy /etc/iiskills.env to apps/*/.env
# ---------------------------------------------------------------------------
echo ""
echo "==> [1/4] Credential Sync: copying $ENV_SOURCE → apps/*/.env"

SYNCED=0
for app_dir in "$REPO_DIR"/apps/*/; do
  if [ ! -d "$app_dir" ]; then
    continue
  fi
  target="${app_dir}.env"
  cp "$ENV_SOURCE" "$target"
  app_name="$(basename "$app_dir")"
  echo "  ✓ $app_name/.env"
  SYNCED=$((SYNCED + 1))
done

echo "  Synced $SYNCED app directories."

# ---------------------------------------------------------------------------
# Step 2: Process Cleanup — stop and delete all PM2 processes
# ---------------------------------------------------------------------------
echo ""
echo "==> [2/4] Process Cleanup: stopping all PM2 processes"
pm2 delete all >/dev/null 2>&1 || true
echo "  ✓ All PM2 processes deleted."

# ---------------------------------------------------------------------------
# Step 3: Environment Refresh — start apps from ecosystem.config.js
# ---------------------------------------------------------------------------
echo ""
echo "==> [3/4] Environment Refresh: starting apps via ecosystem.config.js"

ECOSYSTEM="$REPO_DIR/ecosystem.config.js"
if [ ! -f "$ECOSYSTEM" ]; then
  echo "ERROR: ecosystem.config.js not found at $ECOSYSTEM"
  exit 1
fi

pm2 start "$ECOSYSTEM"
pm2 save
echo "  ✓ All apps started with fresh environment."

# ---------------------------------------------------------------------------
# Step 4: Port Verification — wait for startup then check bound ports
# ---------------------------------------------------------------------------
echo ""
echo "==> [4/4] Port Verification: checking that apps bound to expected ports"
STARTUP_WAIT_SECONDS="${STARTUP_WAIT_SECONDS:-15}"
echo "  Waiting ${STARTUP_WAIT_SECONDS} seconds for apps to initialize..."
sleep "$STARTUP_WAIT_SECONDS"

PASS=0
FAIL=0

LISTENING_PORTS="$(ss -tlnp 2>/dev/null || true)"
for pm2_name in "${!EXPECTED_PORTS[@]}"; do
  port="${EXPECTED_PORTS[$pm2_name]}"
  # Check if any process is listening on the expected port
  if echo "$LISTENING_PORTS" | grep -qE ":${port}( |$)"; then
    echo "  ✓ $pm2_name  →  port $port  [LISTENING]"
    PASS=$((PASS + 1))
  else
    echo "  ✗ $pm2_name  →  port $port  [NOT FOUND — check: pm2 logs $pm2_name]"
    FAIL=$((FAIL + 1))
  fi
done

echo ""
echo "================================================================"
echo "  Port check results: $PASS OK / $FAIL FAILED"
echo "================================================================"
echo ""
echo "  Run 'pm2 status' for a process summary."
echo "  Run 'pm2 logs <name>' to inspect individual app logs."
echo "================================================================"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "WARNING: $FAIL app(s) did not bind to the expected port."
  echo "  This may be normal if the app is still starting up."
  echo "  Wait a few more seconds and re-run the port check manually:"
  echo "    ss -tlnp | grep -E '300[0-9]|30[12][0-9]'"
  exit 1
fi

exit 0
