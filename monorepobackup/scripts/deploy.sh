#!/bin/bash
set -e

echo "🚀 AUTOMATED DEPLOYMENT"
echo "======================="
echo ""

# Step 1: Pull latest code
echo "📥 Step 1: Pulling latest code..."
git pull origin main
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
yarn install
echo ""

# Step 3: Run pre-deployment check
echo "🧪 Step 3: Running pre-deployment checks..."
./scripts/pre-deploy-check.sh
echo ""

# Step 4: Restart PM2
echo "🔄 Step 4: Restarting PM2..."
pm2 restart all
pm2 save
echo ""

# Step 5: Health check
echo "🏥 Step 5: Running health checks..."
echo "   Waiting 15 seconds for apps to fully start..."
sleep 15

HEALTH_FAILED=0

declare -A ports=(
  ["main"]="3000"
  ["learn-ai"]="3001"
  ["learn-apt"]="3002"
  ["learn-chemistry"]="3005"
  ["learn-cricket"]="3009"
  ["learn-geography"]="3011"
  # MOVED TO apps-backup as per cleanup requirements
  # ["learn-govt-jobs"]="3013"
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
    status=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 --max-time 10 http://localhost:$port 2>/dev/null || echo "000")
    
    if [ "$status" -eq 200 ] || [ "$status" -eq 304 ]; then
      echo "  ✅ $app (port $port): $status"
      success=1
      break
    else
      if [ $i -lt 3 ]; then
        sleep 2
      fi
    fi
  done
  
  if [ $success -eq 0 ]; then
    echo "  ❌ $app (port $port): $status - UNHEALTHY!"
    HEALTH_FAILED=1
  fi
done

echo ""

if [ $HEALTH_FAILED -eq 1 ]; then
  echo "⚠️  Some apps are unhealthy - check logs:"
  echo "   pm2 logs --lines 50"
  exit 1
else
  echo "✅ DEPLOYMENT SUCCESSFUL!"
  echo ""
  echo "📊 PM2 Status:"
  pm2 list

  # Step 6: Automated Logging (logs only after success)
  LOGFILE="./devlog"
  NOW=$(date --utc +"%Y-%m-%d %H:%M UTC")
  USER=$(whoami)
  COMMIT=$(git rev-parse HEAD | cut -c 1-8)
  APPS_DEPLOYED=$(printf '%s ' "${!ports[@]}" | xargs)
  HEALTH_SUMMARY="All healthy"
  {
    echo "## [${NOW}] — Automated Script Deploy by ${USER}"
    echo "- Deployed commit: ${COMMIT}"
    echo "- Apps checked: ${APPS_DEPLOYED}"
    echo "- Health check result: ${HEALTH_SUMMARY}"
    echo "- PM2 status:"
    pm2 list
    echo "- Outstanding issues / TODOs:"
    echo "    [ ] Ensure content aggregation from all learn-* apps and Supabase is robust and visible in dashboard."
    echo "    [ ] Confirm admin and public APIs/UIs show merged superset."
    echo ""
  } >> "$LOGFILE"
fi
