#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# IISkills deploy-all.sh
# ---------------------------------------------------------------------------
# Usage: ./deploy-all.sh [--force-clean]
#
#   --force-clean   "Nuclear" clean deploy — wipes ALL local state before
#                   rebuilding.  Use this when the VPS is serving stale/old
#                   compiled code and a normal redeploy does not fix it.
#                   Specifically runs (in order):
#                     git stash clear              ← removes poisoned stash entries
#                     git reset --hard origin/main ← forces local tree to match remote
#                     rm -rf <all .next dirs>      ← purges every compiled build cache
#                     rm -rf <all node_modules>    ← forces a 100% fresh install
#                   WARNING: this discards ALL uncommitted local changes and
#                   ALL cached builds.  Subsequent yarn install + build will
#                   take significantly longer than a normal deploy.
#
# Cache-only wipe (without full redeploy) — run on the VPS to force the new
# routing table to be loaded after pushing URL/routing changes:
#   find /var/www/iiskills-cloud -name ".next" -type d -prune -exec rm -rf {} +
#
# All output is tee'd to /var/log/iiskills/deploy-<timestamp>.log so that
# post-failure forensics (OOM kills, resource exhaustion) are preserved.
#
# Tuneable environment variables (set before running or in /etc/iiskills.env):
#   IISKILLS_MAX_OLD_SPACE_SIZE_MB  — override Node heap limit (default: auto-derived
#                                     from /proc/meminfo, clamped to 1024–4096 MB)
#   IISKILLS_TURBO_CONCURRENCY      — override turbo --concurrency (default: 2)
# ---------------------------------------------------------------------------

# ---------------------------------------------------------------------------
# Argument parsing
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
# Failure diagnostics trap — runs on EXIT when the script exits non-zero.
# Covers both ERR paths (set -e) and explicit `exit 1` calls.
# ---------------------------------------------------------------------------
_on_exit() {
  local exit_code=$?
  # Only print diagnostics on failure
  [ "${exit_code}" -eq 0 ] && return 0
  echo ""
  echo "================================================================"
  echo "DEPLOY FAILED — exit code ${exit_code}"
  echo ""
  echo "NOTE: exit 137 = SIGKILL (kernel OOM reaper killed the process)."
  echo "      exit 143 = SIGTERM. Other non-zero codes indicate script errors."
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
  echo "--- dmesg -T (last 200 lines — look for 'Killed process' for OOM evidence) ---"
  dmesg -T 2>/dev/null | tail -n 200 || echo "(dmesg not available or not permitted)"
  echo ""
  echo "================================================================"
  echo "End of diagnostics. Log saved to: ${LOGFILE}"
  echo "================================================================"
}
trap '_on_exit' EXIT

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
# List of IISkills PM2 process names (only these are ever stopped/deleted)
# ---------------------------------------------------------------------------
IISKILLS_PROCS=(
  "iiskills-main"
  "iiskills-main-copy"
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

# ---------------------------------------------------------------------------
# Enable corepack early so Yarn 4 is available for both the version check
# and the subsequent yarn install.
# ---------------------------------------------------------------------------
echo "==> Enabling corepack (Yarn 4 version manager)"
if corepack enable; then
  echo "  corepack enabled successfully"
else
  echo "WARNING: corepack enable failed — Yarn 4 may not be available via corepack"
fi

# ---------------------------------------------------------------------------
# Verify required tools are available
# ---------------------------------------------------------------------------
for cmd in node yarn pm2 git; do
  command -v "$cmd" >/dev/null 2>&1 || { echo "ERROR: '$cmd' not found in PATH. Aborting."; exit 1; }
done

echo "==> Runtime versions"
node -v
yarn --version

# ---------------------------------------------------------------------------
# Update or initialise the working directory.
#
# If REPO_DIR already contains a git checkout, update it in place with
# `git pull --rebase` so that:
#   - any server-side commits on the branch are rebased on top of upstream
#     changes, keeping history linear and avoiding merge commits;
#   - uncommitted changes are auto-stashed before the rebase and restored
#     after, so local fixes are never silently discarded.
#
# On a fresh server where REPO_DIR does not yet exist, a one-time clone is
# performed instead.
# ---------------------------------------------------------------------------
if [ -d "$REPO_DIR/.git" ]; then
  echo "==> Updating existing checkout via git pull --rebase: $REPO_DIR"
  cd "$REPO_DIR"

  # --force-clean: wipe all stashes and hard-reset to remove any poisoned
  # state left by a previous failed deploy before attempting the rebase.
  if [ "$FORCE_CLEAN" = "true" ]; then
    echo "  --force-clean: clearing all stash entries..."
    git stash clear
    echo "  --force-clean: fetching origin and hard-resetting to origin/${BRANCH}..."
    git fetch origin
    git checkout "$BRANCH"
    git reset --hard "origin/${BRANCH}"
    echo "  --force-clean: working tree is now clean and in sync with origin/${BRANCH}"

    # Purge all node_modules directories to guarantee a 100% fresh install.
    # This resolves 404s caused by stale or partially-upgraded package builds.
    echo "  --force-clean: purging all node_modules directories..."
    find "$REPO_DIR" -name "node_modules" -type d -prune -exec rm -rf {} +
    echo "  --force-clean: all node_modules purged."

    # Purge all compiled build caches so Next.js always rebuilds from source.
    # This eliminates stale .next directories that can serve old middleware.js
    # or useUserAccess.js logic even after a correct git reset.
    # (node_modules has already been removed above, so no exclusion is needed.)
    echo "  --force-clean: purging all .next build caches..."
    find "$REPO_DIR" -name ".next" -type d -prune -exec rm -rf {} +
    echo "  --force-clean: all .next caches purged."
  else
    # Stash any uncommitted changes so the rebase cannot fail on dirty-tree conflicts.
    _stashed=0
    if ! git diff --quiet || ! git diff --cached --quiet; then
      echo "  Uncommitted changes detected — stashing before pull --rebase"
      git stash push -m "deploy-all.sh auto-stash $(date +%Y%m%d-%H%M%S)"
      _stashed=1
    fi
    git fetch origin
    git checkout "$BRANCH"
    git pull --rebase origin "$BRANCH"
    if [ "$_stashed" -eq 1 ]; then
      echo "  Restoring stashed changes..."
      git stash pop || echo "WARNING: git stash pop failed — resolve conflicts manually in $REPO_DIR"
    fi
  fi

  # Archive a pull-completion marker to the production-deploys audit trail
  _PDEPLOYS_DIR="/var/log/iiskills/production-deploys"
  mkdir -p "$_PDEPLOYS_DIR" 2>/dev/null || true
  if [ -w "$_PDEPLOYS_DIR" ]; then
    echo "$(date -u '+%Y-%m-%dT%H:%M:%SZ') git pull --rebase completed successfully on branch=${BRANCH} dir=${REPO_DIR}" \
      >> "$_PDEPLOYS_DIR/pull-history.log"
  fi
else
  echo "==> First-time clone to: $REPO_DIR"
  git clone "$REPO_URL" "$REPO_DIR"
  cd "$REPO_DIR"
  git checkout "$BRANCH"
fi

echo "==> Install dependencies (monorepo)"
yarn install

# ---------------------------------------------------------------------------
# Link /etc/iiskills.env → .env.production in every app directory.
#
# Next.js reads .env.production at build time for NEXT_PUBLIC_* variables.
# On the VPS, credentials live in /etc/iiskills.env; symlinking avoids
# duplicating secrets and ensures every app picks up the same values.
# The link is created as a symlink so that future edits to /etc/iiskills.env
# are automatically reflected without re-running this step.
# ---------------------------------------------------------------------------
if [ -f /etc/iiskills.env ]; then
  echo "==> Linking /etc/iiskills.env → .env.production in all app directories"
  for _app_dir in "$REPO_DIR"/apps/*/; do
    _env_target="${_app_dir}.env.production"
    if [ -e "$_env_target" ] && [ ! -L "$_env_target" ]; then
      # Regular file (not a symlink) — back it up before replacing.
      echo "  WARNING: ${_env_target} is a plain file, not a symlink — backing up to ${_env_target}.bak"
      mv "$_env_target" "${_env_target}.bak"
    else
      # Safe to remove: either a stale symlink or nothing.
      rm -f "$_env_target"
    fi
    ln -sf /etc/iiskills.env "$_env_target"
    echo "  linked: ${_env_target}"
  done
else
  echo "WARNING: /etc/iiskills.env not found — skipping .env.production symlinks."
  echo "         Build may fail or use stale/missing env vars."
fi

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
# NODE heap limit is derived from /proc/meminfo (half of total RAM, clamped to
# [1024, 4096] MB). Override with IISKILLS_MAX_OLD_SPACE_SIZE_MB env var.
#
# Turbo concurrency defaults to 2 to limit parallel Next.js build workers on
# memory-constrained hosts. Override with IISKILLS_TURBO_CONCURRENCY env var.
#
# Why exit 137 matters: SIGKILL (128+9) from the kernel OOM reaper produces
# exit code 137. If you see 137 in dmesg/logs, the root cause is memory, not
# a build error. Reduce concurrency or increase RAM.
# ---------------------------------------------------------------------------

# Derive max-old-space-size from available RAM when not explicitly overridden.
if [ -n "${IISKILLS_MAX_OLD_SPACE_SIZE_MB:-}" ]; then
  _heap_mb="${IISKILLS_MAX_OLD_SPACE_SIZE_MB}"
  echo "==> NODE heap limit: ${_heap_mb} MB (from IISKILLS_MAX_OLD_SPACE_SIZE_MB)"
elif [ -r /proc/meminfo ]; then
  _mem_kb=$(awk '/^MemTotal:/ { print $2 }' /proc/meminfo)
  # Use half of total RAM, clamped to [1024, 4096] MB
  _half_mb=$(( _mem_kb / 2 / 1024 ))
  _heap_mb=$(( _half_mb < 1024 ? 1024 : ( _half_mb > 4096 ? 4096 : _half_mb ) ))
  echo "==> NODE heap limit: ${_heap_mb} MB (auto-derived from /proc/meminfo: MemTotal=${_mem_kb} kB)"
else
  _heap_mb=1024
  echo "==> NODE heap limit: ${_heap_mb} MB (fallback — /proc/meminfo not available)"
fi

_turbo_concurrency="${IISKILLS_TURBO_CONCURRENCY:-2}"
echo "==> Build (monorepo) — --max-old-space-size=${_heap_mb}, turbo concurrency=${_turbo_concurrency}"
export NODE_OPTIONS="${NODE_OPTIONS:+$NODE_OPTIONS }--max-old-space-size=${_heap_mb}"
yarn turbo run build --concurrency="${_turbo_concurrency}"

# ---------------------------------------------------------------------------
# Post-build validations — run BEFORE touching any running PM2 process.
# If any check fails, the script aborts here and existing processes stay up.
# ---------------------------------------------------------------------------
echo "==> Post-build validation: apps/main BUILD_ID"
if [ ! -f "$REPO_DIR/apps/main/.next/BUILD_ID" ]; then
  echo "ERROR: apps/main/.next/BUILD_ID not found — build failed or was skipped."
  echo "  Fix: inspect the build log above, then re-run deploy-all.sh."
  exit 1
fi
echo "  BUILD_ID: $(cat "$REPO_DIR/apps/main/.next/BUILD_ID")"

echo "==> Post-build validation: no placeholder Supabase strings in apps/main bundle"
if node "$REPO_DIR/scripts/verify-build-env.js" --app="$REPO_DIR/apps/main"; then
  echo "  Placeholder check: PASSED"
else
  echo "ERROR: Placeholder credential strings found in apps/main compiled bundle."
  echo "  This means NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY was NOT"
  echo "  set with real values at build time."
  echo "  Fix:"
  echo "    1. Set real credentials in /etc/iiskills.env (or apps/main/.env.production)"
  echo "    2. Re-run: ./deploy-all.sh"
  exit 1
fi

echo "==> Post-build validation: apps/main-copy BUILD_ID"
if [ ! -f "$REPO_DIR/apps/main-copy/.next/BUILD_ID" ]; then
  echo "ERROR: apps/main-copy/.next/BUILD_ID not found — build failed or was skipped."
  echo "  Fix: inspect the build log above, then re-run deploy-all.sh."
  exit 1
fi
echo "  main-copy BUILD_ID: $(cat "$REPO_DIR/apps/main-copy/.next/BUILD_ID")"

echo "==> Post-build validation: apps/learn-developer BUILD_ID"
if [ ! -f "$REPO_DIR/apps/learn-developer/.next/BUILD_ID" ]; then
  echo "ERROR: apps/learn-developer/.next/BUILD_ID not found — build failed or was skipped."
  echo "  Fix: inspect the build log above, then re-run deploy-all.sh."
  exit 1
fi
echo "  learn-developer BUILD_ID: $(cat "$REPO_DIR/apps/learn-developer/.next/BUILD_ID")"

# ---------------------------------------------------------------------------
# All validations passed — safe to stop PM2 and restart from REPO_DIR.
# ---------------------------------------------------------------------------
echo "==> Build validated. Stopping existing IISkills PM2 processes."
# Only manage our own processes. Never run `pm2 delete all`.
for p in "${IISKILLS_PROCS[@]}"; do
  pm2 stop "$p" >/dev/null 2>&1 || true
  pm2 delete "$p" >/dev/null 2>&1 || true
done

cd "$REPO_DIR"

# ---------------------------------------------------------------------------
# Start MAIN on :3000
# ---------------------------------------------------------------------------
echo "==> Start MAIN on :3000 from apps/main"
cd "$REPO_DIR/apps/main"
PORT=3000 pm2 start "npx next start -p 3000" --name iiskills-main

# ---------------------------------------------------------------------------
# Start MAIN-COPY (sample.iiskills.cloud) on :3030
# NEXT_PUBLIC_IS_TEST_SITE and IS_TEST_SITE are baked into the client bundle
# at build time via apps/main-copy/.env.production. We start via the
# ecosystem.config.js entry so that the env vars (PORT, IS_TEST_SITE,
# NEXT_PUBLIC_IS_TEST_SITE) are persisted in the PM2 process list and
# survive server reboots / pm2 resurrect.
# ---------------------------------------------------------------------------
echo "==> Start MAIN-COPY (sample.iiskills.cloud) on :3030 from apps/main-copy"
cd "$REPO_DIR"
pm2 start ecosystem.config.js --only iiskills-main-copy
echo "  Started iiskills-main-copy on :3030 (sample.iiskills.cloud)"

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

# Archive the full build log to the production-deploys audit directory.
# This creates a permanent, timestamped record for every successful deployment.
# If a certified paid user reports an issue, ops can correlate the build log
# to the exact deploy that changed their entitlement.
_PDEPLOYS_DIR="/var/log/iiskills/production-deploys"
mkdir -p "$_PDEPLOYS_DIR" 2>/dev/null || true
if [ -w "$_PDEPLOYS_DIR" ] && [ -f "$LOGFILE" ]; then
  cp "$LOGFILE" "$_PDEPLOYS_DIR/deploy-${DEPLOY_TS}.log" 2>/dev/null || true
  echo "==> Build log archived to: $_PDEPLOYS_DIR/deploy-${DEPLOY_TS}.log"
  # Keep only the 30 most recent deploy logs to avoid unbounded disk growth
  ls -t "$_PDEPLOYS_DIR"/deploy-*.log 2>/dev/null | tail -n +31 | xargs rm -f 2>/dev/null || true
fi

echo "==> Prune old backups/build dirs (retention enforcement)"
/usr/local/bin/prune-iiskills-backups.sh || true

echo "==> Syncing content stats to Supabase (8×3×10×10 = 2,400 lessons)"
# Runs sync-content-stats.js which upserts the canonical architecture totals
# (24 courses, 240 modules, 2,400 lessons) into the content_stats table so
# the admin dashboard always reflects the correct 8-site totals.
# Non-fatal: if credentials are absent (CI sandbox) this logs a warning and
# continues so the rest of the deployment is not blocked.
if node "$REPO_DIR/scripts/sync-content-stats.js"; then
  echo "  Content stats synced successfully."
else
  echo "WARNING: sync-content-stats.js exited non-zero — dashboard stats may be stale."
  echo "  Re-run manually: node scripts/sync-content-stats.js"
fi

echo "================================================================"
echo "==> Deployment complete. Run 'pm2 status' to verify."
echo "==> Log file: ${LOGFILE}"
echo "================================================================"
