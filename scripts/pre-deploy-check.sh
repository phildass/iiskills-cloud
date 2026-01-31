#!/bin/bash
set -e

echo "🔍 PRE-DEPLOYMENT CHECK"
echo "======================"
echo ""

FAILED_APPS=()
PASSED_APPS=()

# Store the project root directory
PROJECT_ROOT=$(pwd)

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_ROOT/logs"

apps=(
  "apps/main"
  "learn-ai"
  "learn-apt"
  "learn-chemistry"
  "learn-cricket"
  "learn-geography"
  "learn-govt-jobs"
  "learn-leadership"
  "learn-management"
  "learn-math"
  "learn-physics"
  "learn-pr"
  "learn-winning"
)

echo "📦 Testing builds for ${#apps[@]} apps..."
echo ""

for app in "${apps[@]}"; do
  echo -n "Building $app... "
  
  cd "$app"
  
  if yarn build > "$PROJECT_ROOT/logs/build-${app//\//-}.log" 2>&1; then
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
  
  cd "$PROJECT_ROOT"
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
    echo "     Log: logs/build-${app//\//-}.log"
  done
  echo ""
  echo "❌ DEPLOYMENT ABORTED - Fix errors above first!"
  exit 1
else
  echo "✅ ALL APPS PASSED - SAFE TO DEPLOY!"
  exit 0
fi
