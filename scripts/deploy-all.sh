#!/bin/bash
set -euo pipefail

# deploy-all.sh - Complete deployment script with logging for iiskills.cloud monorepo
# This script performs a full deployment including pre-checks, builds, and health checks.
# It can be run in a detached tmux session for long-running deployments.

# Create timestamped log file
TIMESTAMP=$(date -u +"%Y%m%d-%H%M%S")
LOGFILE="/tmp/deploy-all-${TIMESTAMP}.log"

# Function to log messages to both console and log file
log() {
  echo "$@" | tee -a "$LOGFILE"
}

# Function to log without echoing to console
log_quiet() {
  echo "$@" >> "$LOGFILE"
}

# Trap errors and log them
trap 'log "❌ ERROR: Deployment failed at line $LINENO. Check log: $LOGFILE"' ERR

# Start deployment
log "==============================================="
log "🚀 DEPLOY-ALL: Complete Monorepo Deployment"
log "==============================================="
log "Started at: $(date)"
log "Log file: $LOGFILE"
log ""

# Step 1: Pull latest code
log "📥 Step 1: Pulling latest code from origin/main..."
git pull origin main 2>&1 | tee -a "$LOGFILE"
log ""

# Step 2: Install dependencies
log "📦 Step 2: Installing dependencies with yarn..."
yarn install 2>&1 | tee -a "$LOGFILE"
log ""

# Step 3: Run pre-deployment checks
log "🧪 Step 3: Running pre-deployment checks..."
log "   This will build all apps to ensure they compile correctly..."
./scripts/pre-deploy-check.sh 2>&1 | tee -a "$LOGFILE"
log ""

# Step 4: Restart PM2
log "🔄 Step 4: Restarting all PM2 processes..."
pm2 restart all 2>&1 | tee -a "$LOGFILE"
pm2 save 2>&1 | tee -a "$LOGFILE"
log ""

# Step 5: Health checks
log "🏥 Step 5: Running health checks on all applications..."
log "   Waiting 15 seconds for applications to fully start..."

#
# deploy-all.sh - Detached tmux monorepo deployment script
#
# This script provides a reproducible, detached-tmux workflow for deploying
# the entire iiskills-cloud monorepo. It runs a full deployment flow in a
# tmux session that you can attach to monitor progress.
#
# Requirements:
#   - Bash 4.0+ (for associative arrays)
#   - tmux
#   - PM2 (for process management)
#
# Usage:
#   ./scripts/deploy-all.sh
#
# The script will:
#   1. Kill any existing tmux session named "deploy_all"
#   2. Create a new detached tmux session
#   3. Run the full deploy flow (pull, install, build, PM2 restart, health checks)
#   4. Log all output to /tmp/deploy-all-<timestamp>.log
#
# To monitor the deployment:
#   tmux attach-session -t deploy_all
#
# To detach from the session (while it continues running):
#   Press: Ctrl+b, then d
#

set -e

# Check Bash version (require 4.0+ for associative arrays)
if [ "${BASH_VERSINFO[0]}" -lt 4 ]; then
    echo "❌ ERROR: This script requires Bash 4.0 or higher"
    echo "   Current version: ${BASH_VERSION}"
    echo "   Please upgrade Bash or use a system with Bash 4+"
    exit 1
fi

# Configuration
SESSION_NAME="deploy_all"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/tmp/deploy-all-${TIMESTAMP}.log"
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "  iiskills-cloud Deployment (Detached)"
echo ""
echo "Session name: ${SESSION_NAME}"
echo "Log file:     ${LOG_FILE}"
echo "Project root: ${PROJECT_ROOT}"
echo ""

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo "❌ ERROR: tmux is not installed"
    echo "   Please install tmux first:"
    echo "   - Ubuntu/Debian: sudo apt-get install tmux"
    echo "   - macOS:         brew install tmux"
    echo "   - RHEL/CentOS:   sudo yum install tmux"
    exit 1
fi

# Kill existing session if it exists
if tmux has-session -t "${SESSION_NAME}" 2>/dev/null; then
    echo "🔄 Killing existing tmux session: ${SESSION_NAME}"
    tmux kill-session -t "${SESSION_NAME}"
    sleep 1
fi

echo "🚀 Starting detached deployment in tmux session..."
echo ""

# Create and start the tmux session with inline deployment script
# Variables are expanded at creation time, and pipe-pane captures all output
tmux new-session -d -s "${SESSION_NAME}" bash <<EOF
set -e

# Redirect all output to log file
exec > >(tee -a "${LOG_FILE}") 2>&1

# Header
echo "  IISKILLS-CLOUD DEPLOYMENT"
echo "  Started: \$(date)"
echo ""

# Navigate to project root
cd "${PROJECT_ROOT}"
echo "📂 Working directory: \$(pwd)"
echo ""

# Step 1: Pull latest code
echo "📥 STEP 1: Pulling latest code..."
git pull origin main || {
    echo "⚠️  Warning: git pull failed, continuing with local code"
}
echo ""

# Step 2: Install dependencies
echo "📦 STEP 2: Installing dependencies..."
yarn install
echo ""

# Step 2.5: Load learn-cricket secret
echo "🔑 STEP 2.5: Loading learn-cricket secret..."
if ./scripts/load-cricket-secret.sh 2>&1 | tee -a "${LOG_FILE}"; then
    echo "Loaded learn-cricket secret" | tee -a "${LOG_FILE}"
else
    echo "Warning: learn-cricket secret not found; continuing without it" | tee -a "${LOG_FILE}"
fi
echo ""

# Step 3: Run pre-deployment check (build all apps)
echo "🧪 STEP 3: Running pre-deployment checks..."
if [ -f "./scripts/pre-deploy-check.sh" ]; then
    ./scripts/pre-deploy-check.sh
else
    echo "⚠️  Warning: pre-deploy-check.sh not found, skipping"
fi
echo ""

# Step 4: Restart PM2
echo "🔄 STEP 4: Restarting PM2 applications..."
if command -v pm2 &> /dev/null; then
    pm2 restart all
    pm2 save
else
    echo "⚠️  Warning: PM2 not installed, skipping restart"
fi
echo ""

# Step 5: Health checks
echo "🏥 STEP 5: Running health checks..."
echo "   Waiting 15 seconds for apps to fully start..."
sleep 15

HEALTH_FAILED=0

declare -A ports=(
  ["main"]="3000"
  ["learn-ai"]="3001"
  ["learn-apt"]="3002"
  ["learn-chemistry"]="3005"
# Define all application ports
declare -A ports=(
  ["main"]="3000"
  ["learn-ai"]="3024"
  ["learn-apt"]="3002"
  ["learn-chemistry"]="3005"
  ["learn-companion"]="3023"
  ["learn-cricket"]="3009"
  ["learn-geography"]="3011"
  ["learn-govt-jobs"]="3013"
  ["learn-leadership"]="3015"
  ["learn-management"]="3016"
  ["learn-math"]="3017"
  ["learn-physics"]="3020"
  ["learn-pr"]="3021"
  ["learn-winning"]="3022"
)

for app in "${!ports[@]}"; do
  port="${ports[$app]}"
for app in "\${!ports[@]}"; do
  port="\${ports[\$app]}"
  
  # Retry health check up to 3 times with timeout
  success=0
  for i in {1..3}; do
    status=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 http://localhost:"$port" 2>/dev/null || echo "000")
    
    if [ "$status" -eq 200 ] || [ "$status" -eq 304 ]; then
      log "  ✅ $app (port $port): $status"
      success=1
      break
    else
      if [ "$i" -lt 3 ]; then
    status=\$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 http://localhost:\$port 2>/dev/null || echo "000")
    
    if [ "\$status" -eq 200 ] || [ "\$status" -eq 304 ]; then
      echo "  ✅ \$app (port \$port): \$status"
      success=1
      break
    else
      if [ \$i -lt 3 ]; then
        sleep 2
      fi
    fi
  done
  
  if [ $success -eq 0 ]; then
    log "  ❌ $app (port $port): $status - UNHEALTHY!"
  if [ \$success -eq 0 ]; then
    echo "  ❌ \$app (port \$port): \$status - UNHEALTHY!"
    HEALTH_FAILED=1
  fi
done

log ""

# Final status and logging
if [ $HEALTH_FAILED -eq 1 ]; then
  log "⚠️  Some applications are unhealthy - check logs:"
  log "   pm2 logs --lines 50"
  log ""
  log "❌ DEPLOYMENT COMPLETED WITH ERRORS"
  log "Finished at: $(date)"
  log "Full log available at: $LOGFILE"
  exit 1
else
  log "✅ DEPLOYMENT SUCCESSFUL!"
  log ""
  log "📊 PM2 Status:"
  pm2 list 2>&1 | tee -a "$LOGFILE"
  log ""
  
  # Record deployment in devlog
  DEVLOG="./devlog"
  NOW=$(date -u +"%Y-%m-%d %H:%M UTC")
  USER=$(whoami)
  COMMIT=$(git rev-parse HEAD | cut -c 1-8)
  APPS_DEPLOYED=$(printf '%s ' "${!ports[@]}" | xargs)
  HEALTH_SUMMARY="All healthy"
  
  {
    echo "## [${NOW}] — Automated Deploy-All Script by ${USER}"
    echo "- Deployed commit: ${COMMIT}"
    echo "- Apps checked: ${APPS_DEPLOYED}"
    echo "- Health check result: ${HEALTH_SUMMARY}"
    echo "- Log file: ${LOGFILE}"
    echo "- PM2 status:"
    pm2 list 2>&1
    echo ""
  } >> "$DEVLOG"
  
  log "📝 Deployment logged to: $DEVLOG"
  log "Finished at: $(date)"
  log "Full log available at: $LOGFILE"
  log ""
  log "🎉 All applications deployed and healthy!"
echo ""

# Final status
if [ \$HEALTH_FAILED -eq 1 ]; then
  echo "⚠️  DEPLOYMENT COMPLETED WITH WARNINGS"
  echo "   Some apps are unhealthy - check logs:"
  echo "   pm2 logs --lines 50"
  EXIT_CODE=1
else
  echo "✅ DEPLOYMENT SUCCESSFUL!"
  echo ""
  echo "📊 PM2 Status:"
  pm2 list
  EXIT_CODE=0
fi
echo ""
echo "Completed: \$(date)"
echo "Log saved to: ${LOG_FILE}"
echo ""
echo "Press Enter to close this tmux session..."
read

exit \$EXIT_CODE
EOF

# Give tmux a moment to start
sleep 1

# Verify session was created
if tmux has-session -t "${SESSION_NAME}" 2>/dev/null; then
    echo "✅ Deployment started successfully in detached tmux session"
    echo ""
    echo "📋 Next steps:"
    echo "   • Monitor deployment:  tmux attach-session -t ${SESSION_NAME}"
    echo "   • Detach from session: Press Ctrl+b, then d"
    echo "   • View logs:           tail -f ${LOG_FILE}"
    echo "   • List sessions:       tmux list-sessions"
    echo ""
    echo "The deployment will continue running in the background."
    echo "Check the log file for output: ${LOG_FILE}"
else
    echo "❌ ERROR: Failed to create tmux session"
    exit 1
fi
