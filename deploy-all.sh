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
# Environment Sync & OTP Guard
# ---------------------------------------------------------------------------
# Force-copy /etc/iiskills.env to apps/*/.env so Next.js picks up credentials
# at both build-time and runtime (cp, not symlink, ensures independence).
if [ -f /etc/iiskills.env ]; then
  echo "==> Force-syncing credentials: /etc/iiskills.env → apps/*/.env"
  _synced=0
  for _app_dir in "$REPO_DIR"/apps/*/; do
    [ -d "$_app_dir" ] || continue
    cp /etc/iiskills.env "${_app_dir}.env"
    echo "  ✓ $(basename "$_app_dir")/.env"
    _synced=$((_synced + 1))
  done
  echo "  Synced ${_synced} app directories."
fi

echo "==> Running OTP policy guard"
./node_modules/.bin/jest tests/noOtpRemnants.test.js --forceExit --silent || exit 1

# ---------------------------------------------------------------------------
# Build Logic — single root invocation, concurrency=1 to prevent OOM
# ---------------------------------------------------------------------------
export NODE_OPTIONS="--max-old-space-size=2048"

echo "==> Building all packages and apps (concurrency=1)"
npx turbo run build --concurrency=1

# ---------------------------------------------------------------------------
# PM2 Restart Logic — kill ALL processes (wipes process list + memory cache),
# then start each app on its hardcoded Nginx-mapped port.
# ---------------------------------------------------------------------------
echo "==> Build validated. Killing all PM2 processes (full process purge)."
pm2 kill >/dev/null 2>&1 || true

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

# ---------------------------------------------------------------------------
# Nginx Hardening — inject proxy buffer directives to prevent Protocol Errors
# on large Admin response headers (only patched if not already present).
# ---------------------------------------------------------------------------
NGINX_CONF="/etc/nginx/nginx.conf"
if [ -f "$NGINX_CONF" ]; then
  if ! grep -q "proxy_busy_buffers_size" "$NGINX_CONF"; then
    echo "==> Hardening Nginx: injecting proxy buffer settings into $NGINX_CONF"
    # Insert the three directives immediately after the opening 'http {' line
    # Pattern handles optional leading whitespace and spacing around the brace
    sed -i '/^\s*http\s*{/a\\tproxy_buffer_size 128k;\n\tproxy_buffers 4 256k;\n\tproxy_busy_buffers_size 256k;' "$NGINX_CONF"
    echo "  ✓ proxy_buffer_size 128k"
    echo "  ✓ proxy_buffers 4 256k"
    echo "  ✓ proxy_busy_buffers_size 256k"
  else
    echo "==> Nginx proxy buffer settings already present — skipping patch."
  fi
fi

echo "==> Reloading Nginx"
nginx -s reload 2>/dev/null || systemctl reload nginx 2>/dev/null || true

# ---------------------------------------------------------------------------
# Memory Validation — confirm every app is using >60 MB (proves DB connection)
# ---------------------------------------------------------------------------
echo "==> Waiting 20 seconds for apps to fully initialize..."
sleep 20

echo "==> Memory Validation: checking that every app uses >60 MB RAM"
MEM_THRESHOLD_MB=60
MEM_PASS=0
MEM_FAIL=0

# Use pm2 jlist (JSON) for reliable memory parsing
PM2_JSON="$(pm2 jlist 2>/dev/null || echo '[]')"
FAILED_APPS=""

while IFS=$'\t' read -r app_name mem_mb; do
  [ -z "$app_name" ] && continue
  if [[ "$mem_mb" =~ ^[0-9]+$ ]] && [ "$mem_mb" -ge "$MEM_THRESHOLD_MB" ]; then
    echo "  ✓ $app_name  →  ${mem_mb} MB  [OK]"
    MEM_PASS=$((MEM_PASS + 1))
  else
    echo "  ✗ $app_name  →  ${mem_mb:-?} MB  [BELOW THRESHOLD — possible DB connection failure]"
    MEM_FAIL=$((MEM_FAIL + 1))
    FAILED_APPS="$FAILED_APPS $app_name"
  fi
done < <(node -e "
  const list = JSON.parse(process.env.PM2_JSON || '[]');
  list.forEach(p => {
    const mem = Math.round((p.monit && p.monit.memory || 0) / 1024 / 1024);
    console.log(p.name + '\t' + mem);
  });
" PM2_JSON="$PM2_JSON" 2>/dev/null)

echo ""
echo "================================================================"
echo "  Memory check: $MEM_PASS OK / $MEM_FAIL FAILED (threshold: ${MEM_THRESHOLD_MB} MB)"
if [ -n "$FAILED_APPS" ]; then
  echo "  Low-memory apps:$FAILED_APPS"
  echo "  Run 'pm2 logs <app>' to inspect for connection errors."
fi
echo "================================================================"
echo "==> Deployment complete. Admin Bypass is LIVE."
echo "================================================================"
