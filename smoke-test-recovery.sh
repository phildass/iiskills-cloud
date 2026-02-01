#!/bin/bash
# Smoke Test Script for Recovered Apps
# Tests each app on a temporary port to verify basic functionality

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

APPS=(
    "learn-management:3016"
    "learn-leadership:3015"
    "learn-pr:3021"
    "learn-cricket:3009"
    "learn-math:3017"
    "learn-physics:3020"
    "learn-chemistry:3005"
    "learn-geography:3011"
    "learn-winning:3022"
    "learn-govt-jobs:3013"
)

SMOKE_TEST_PORT=35000
REPORT_FILE="smoke-test-report-$(date +%Y%m%d_%H%M%S).md"

echo "# Smoke Test Report - $(date '+%Y-%m-%d %H:%M:%S')" > "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "## Test Results" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "| App Name | Port | Test Port | HTTP Status | Result |" >> "$REPORT_FILE"
echo "|----------|------|-----------|-------------|--------|" >> "$REPORT_FILE"

SUCCESS_COUNT=0
FAIL_COUNT=0

for app_info in "${APPS[@]}"; do
    IFS=':' read -r APP_NAME PORT <<< "$app_info"
    
    echo ""
    echo "=========================================="
    echo "Smoke Testing: $APP_NAME"
    echo "=========================================="
    
    APP_DIR="apps/$APP_NAME"
    
    if [ ! -d "$APP_DIR" ]; then
        echo "❌ ERROR: Directory $APP_DIR not found"
        echo "| $APP_NAME | $PORT | - | - | ❌ Missing |" >> "$REPORT_FILE"
        ((FAIL_COUNT++))
        continue
    fi
    
    # Check if build exists
    if [ ! -d "$APP_DIR/.next" ]; then
        echo "❌ ERROR: Build directory not found. Run 'yarn build' first."
        echo "| $APP_NAME | $PORT | - | - | ❌ Not Built |" >> "$REPORT_FILE"
        ((FAIL_COUNT++))
        continue
    fi
    
    # Start app on test port
    echo "Starting $APP_NAME on port $SMOKE_TEST_PORT..."
    (cd "$APP_DIR" && NODE_ENV=production PORT=$SMOKE_TEST_PORT npx next start -p $SMOKE_TEST_PORT > /dev/null 2>&1) &
    APP_PID=$!
    
    # Wait for app to start
    sleep 5
    
    # Test HTTP endpoint
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$SMOKE_TEST_PORT" || echo "000")
    
    if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
        echo "✅ Smoke test passed - HTTP $HTTP_STATUS"
        echo "| $APP_NAME | $PORT | $SMOKE_TEST_PORT | $HTTP_STATUS | ✅ Passed |" >> "$REPORT_FILE"
        ((SUCCESS_COUNT++))
    else
        echo "❌ Smoke test failed - HTTP $HTTP_STATUS"
        echo "| $APP_NAME | $PORT | $SMOKE_TEST_PORT | $HTTP_STATUS | ❌ Failed |" >> "$REPORT_FILE"
        ((FAIL_COUNT++))
    fi
    
    # Stop the app
    kill $APP_PID 2>/dev/null || true
    wait $APP_PID 2>/dev/null || true
    
    # Cleanup any lingering processes
    pkill -f "next start -p $SMOKE_TEST_PORT" 2>/dev/null || true
    sleep 2
done

# Summary
echo "" >> "$REPORT_FILE"
echo "## Summary" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "- **Total Apps Tested**: ${#APPS[@]}" >> "$REPORT_FILE"
echo "- **Passed**: $SUCCESS_COUNT" >> "$REPORT_FILE"
echo "- **Failed**: $FAIL_COUNT" >> "$REPORT_FILE"
echo "- **Success Rate**: $(( SUCCESS_COUNT * 100 / ${#APPS[@]} ))%" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "## Notes" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "- All apps were tested on port $SMOKE_TEST_PORT" >> "$REPORT_FILE"
echo "- Tests checked for HTTP 200/301/302 responses" >> "$REPORT_FILE"
echo "- Apps were run in production mode (NODE_ENV=production)" >> "$REPORT_FILE"

echo ""
echo "=========================================="
echo "Smoke Test Complete"
echo "=========================================="
echo "Total Apps: ${#APPS[@]}"
echo "Passed: $SUCCESS_COUNT"
echo "Failed: $FAIL_COUNT"
echo ""
echo "Report saved to: $REPORT_FILE"

# Exit with error if any tests failed
if [ $FAIL_COUNT -gt 0 ]; then
    exit 1
fi
