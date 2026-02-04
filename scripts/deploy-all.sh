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
sleep 15

HEALTH_FAILED=0

declare -A ports=(
  ["main"]="3000"
  ["learn-ai"]="3001"
  ["learn-apt"]="3002"
  ["learn-chemistry"]="3005"
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
        sleep 2
      fi
    fi
  done
  
  if [ $success -eq 0 ]; then
    log "  ❌ $app (port $port): $status - UNHEALTHY!"
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
  log "==============================================="
  log "🎉 All applications deployed and healthy!"
  log "==============================================="
fi
