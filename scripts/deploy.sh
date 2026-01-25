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
sleep 10

HEALTH_FAILED=0

declare -A ports=(
  ["main"]="3000"
  ["coming-soon"]="3019"
  ["learn-ai"]="3002"
  ["learn-apt"]="3001"
  ["learn-jee"]="3008"
  ["learn-chemistry"]="3003"
  ["learn-cricket"]="3016"
  ["learn-geography"]="3005"
  ["learn-govt-jobs"]="3006"
  ["learn-ias"]="3007"
  ["learn-leadership"]="3009"
  ["learn-management"]="3010"
  ["learn-math"]="3011"
  ["learn-neet"]="3012"
  ["learn-physics"]="3013"
  ["learn-pr"]="3014"
  ["learn-winning"]="3015"
  ["learn-data-science"]="3004"
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
fi
