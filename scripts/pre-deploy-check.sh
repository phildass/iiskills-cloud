#!/bin/bash
set -e

echo "🔍 PRE-DEPLOYMENT CHECK"
echo "======================"
echo ""

FAILED_APPS=()
PASSED_APPS=()

apps=(
  "apps/main"
  "coming-soon"
  "learn-ai"
  "learn-apt"
  "learn-jee"
  "learn-chemistry"
  "learn-cricket"
  "learn-geography"
  "learn-govt-jobs"
  "learn-ias"
  "learn-leadership"
  "learn-management"
  "learn-math"
  "learn-neet"
  "learn-physics"
  "learn-pr"
  "learn-winning"
  "learn-data-science"
)

echo "📦 Testing builds for ${#apps[@]} apps..."
echo ""

for app in "${apps[@]}"; do
  echo -n "Building $app... "
  
  cd "$app"
  
  if yarn build > /tmp/build-${app//\//-}.log 2>&1; then
    if [ -d ".next" ]; then
      echo "✅"
      PASSED_APPS+=("$app")
    else
      echo "❌ (no .next folder)"
      FAILED_APPS+=("$app")
    fi
  else
    echo "❌"
    FAILED_APPS+=("$app")
  fi
  
  cd - > /dev/null
done

echo ""
echo "========================================"
echo "📊 RESULTS"
echo "========================================"
echo "✅ Passed: ${#PASSED_APPS[@]}/${#apps[@]}"
echo "❌ Failed: ${#FAILED_APPS[@]}/${#apps[@]}"
echo ""

if [ ${#FAILED_APPS[@]} -gt 0 ]; then
  echo "🔴 FAILED APPS:"
  for app in "${FAILED_APPS[@]}"; do
    echo "   - $app"
    echo "     Log: /tmp/build-${app//\//-}.log"
  done
  echo ""
  echo "❌ DEPLOYMENT ABORTED - Fix errors above first!"
  exit 1
else
  echo "✅ ALL APPS PASSED - SAFE TO DEPLOY!"
  exit 0
fi
