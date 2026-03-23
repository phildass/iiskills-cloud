#!/usr/bin/env bash
set -euo pipefail

# ---------------------------------------------------------------------------
# IISkills deploy-all.sh (Full PUSH + Build + PM2 Restart)
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
git push origin "$BRANCH" || echo "No local changes to push or remote ahead – continuing."

FORCE_CLEAN=false
for _arg in "$@"; do
  case "$_arg" in
    --force-clean) FORCE_CLEAN=true ;;
    *) echo "WARNING: Unknown argument '$_arg' — ignoring." ;;
*

