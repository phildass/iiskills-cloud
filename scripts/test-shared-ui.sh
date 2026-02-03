#!/usr/bin/env bash
#
# Smoke test script for shared header/footer presence
# Verifies that all apps have the shared header and footer components
#
# Usage: ./scripts/test-shared-ui.sh [port]
#   - If port is provided, tests a single app at that port
#   - If no port, tests all apps sequentially (requires PM2 to be running)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# App configurations: name and default port
declare -A APPS=(
  ["main"]=3000
  ["learn-ai"]=3001
  ["learn-chemistry"]=3002
  ["learn-apt"]=3003
  ["learn-physics"]=3004
  ["learn-math"]=3005
  ["learn-geography"]=3006
  ["learn-leadership"]=3007
  ["learn-management"]=3008
  ["learn-winning"]=3009
  ["learn-companion"]=3023
  ["learn-cricket"]=3024
  ["learn-govt-jobs"]=3025
  ["learn-pr"]=3026
)

# Test if header elements are present in the HTML
test_app() {
  local app_name=$1
  local port=$2
  local url="http://localhost:${port}"
  
  echo -e "${YELLOW}Testing ${app_name} at ${url}...${NC}"
  
  # Fetch the page
  local html=$(curl -s -f "$url" 2>&1)
  local curl_exit=$?
  
  if [ $curl_exit -ne 0 ]; then
    echo -e "${RED}✗ FAIL: ${app_name} - Cannot connect to ${url}${NC}"
    echo "  Error: $html"
    return 1
  fi
  
  # Check for header elements
  local has_header=0
  local has_footer=0
  local has_logo=0
  
  # Check for navigation/header
  if echo "$html" | grep -q -i "iiskills\.cloud"; then
    has_header=1
  fi
  
  # Check for footer
  if echo "$html" | grep -E -q -i "AI Cloud Enterprises|Indian Institute of Professional Skills"; then
    has_footer=1
  fi
  
  # Check for logo references
  if echo "$html" | grep -q -E "(ai-cloud-logo|iiskills-logo)"; then
    has_logo=1
  fi
  
  # Report results
  local all_passed=1
  if [ $has_header -eq 1 ]; then
    echo -e "${GREEN}  ✓ Header present${NC}"
  else
    echo -e "${RED}  ✗ Header missing${NC}"
    all_passed=0
  fi
  
  if [ $has_footer -eq 1 ]; then
    echo -e "${GREEN}  ✓ Footer present${NC}"
  else
    echo -e "${RED}  ✗ Footer missing${NC}"
    all_passed=0
  fi
  
  if [ $has_logo -eq 1 ]; then
    echo -e "${GREEN}  ✓ Logo references found${NC}"
  else
    echo -e "${RED}  ✗ Logo references missing${NC}"
    all_passed=0
  fi
  
  if [ $all_passed -eq 1 ]; then
    echo -e "${GREEN}✓ PASS: ${app_name}${NC}\n"
    return 0
  else
    echo -e "${RED}✗ FAIL: ${app_name}${NC}\n"
    return 1
  fi
}

# Main execution
if [ -n "$1" ]; then
  # Test single app at specified port
  echo "Testing single app at port $1..."
  test_app "custom" "$1"
  exit $?
else
  # Test all apps
  echo "Testing all apps..."
  echo "================================"
  
  failed_apps=()
  passed_apps=()
  
  for app in "${!APPS[@]}"; do
    port="${APPS[$app]}"
    if test_app "$app" "$port"; then
      passed_apps+=("$app")
    else
      failed_apps+=("$app")
    fi
  done
  
  echo "================================"
  echo -e "${GREEN}Summary:${NC}"
  echo "Passed: ${#passed_apps[@]}/${#APPS[@]}"
  echo "Failed: ${#failed_apps[@]}/${#APPS[@]}"
  
  if [ ${#failed_apps[@]} -gt 0 ]; then
    echo -e "\n${RED}Failed apps:${NC}"
    for app in "${failed_apps[@]}"; do
      echo "  - $app"
    done
    exit 1
  else
    echo -e "\n${GREEN}All apps passed!${NC}"
    exit 0
  fi
fi
