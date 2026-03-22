#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# IISkills deploy-all.sh (Fast PUSH + Build + Restart, No Clone)
# ---------------------------------------------------------------------------
DEPLOY_TS="$(date +%Y-%m-%d-%H%M)"
LOG_DIR="/var/log/iiskills"
LOGFILE="${LOG_DIR}/deploy-${DEPLOY_TS}.log"

mkdir -p "$LOG_DIR" 2>/dev/null || true
exec > >(tee -a "$LOGFILE") 2>&1

_on_exit() {
  local code=$?
  [ "$code" -eq 0 ] && return 0
  echo "==> DEPLOY FAILED — exit code $code. Check $LOGFILE for diagnostics."
}
trap '_on_exit' EXIT

REPO_DIR="/root/iiskills-cloud-apps"
BRANCH="main"

cd "$REPO_DIR"
echo "==> [1/8] Pushing any local changes to origin/$BRANCH"
git push origin "$BRANCH"

FORCE_CLEAN=false
for _arg in "$@"; do
  case "$_arg" in
    --force-clean) FORCE_CLEAN=true ;;
    *) echo "WARNING: Unknown argument '$_arg' — ignoring." ;;
  esac
done

if [ "$FORCE_CLEAN" = "true" ]; then
  echo "==> [CLEAN] Nuclear wipe: cleaning git, all modules, all .next"
  git clean -fdx
  find . -name "node_modules" -type d -prune -exec rm -rf {} +
  find . -name ".next" -type d -prune -exec rm -rf {} +
else
  echo "==> [2/8] Cleaning all .next build caches (ensure fresh UI)"
  find . -name ".next" -type d -prune -exec rm -rf {} +
fi

echo "==> [3/8] Installing dependencies (no network mutations)"
yarn install --immutable

# Sync env to apps
if [ -f /etc/iiskills.env ]; then
  echo "==> [4/8] Copying env to all /apps/*/.env"
  for _app_dir in "$REPO_DIR"/apps/*/; do
    [ -d "$_app_dir" ] && cp /etc/iiskills](#)

