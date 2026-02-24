#!/bin/bash
# Recovery Build Validation Script
# Tests building all 10 recovered learn-* apps and generates build reports

# Get absolute path to script directory
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

REPORT_DIR="$SCRIPT_DIR/build-validation-reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create report directory
mkdir -p "$REPORT_DIR"

# Initialize summary report
SUMMARY_FILE="$REPORT_DIR/build-summary-$TIMESTAMP.md"
echo "# Build Validation Summary - $(date '+%Y-%m-%d %H:%M:%S')" > "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"
echo "## Apps Built and Validated" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"
echo "| App Name | Port | Build Status | Build Time | Routes |" >> "$SUMMARY_FILE"
echo "|----------|------|--------------|------------|--------|" >> "$SUMMARY_FILE"

SUCCESS_COUNT=0
FAIL_COUNT=0

for app_info in "${APPS[@]}"; do
    IFS=':' read -r APP_NAME PORT <<< "$app_info"
    
    echo ""
    echo "=========================================="
    echo "Building: $APP_NAME (Port: $PORT)"
    echo "=========================================="
    
    APP_DIR="apps/$APP_NAME"
    BUILD_LOG="$REPORT_DIR/${APP_NAME}-build-$TIMESTAMP.log"
    
    if [ ! -d "$APP_DIR" ]; then
        echo "❌ ERROR: Directory $APP_DIR not found"
        echo "| $APP_NAME | $PORT | ❌ Missing | - | - |" >> "$SUMMARY_FILE"
        ((FAIL_COUNT++))
        continue
    fi
    
    # Build the app
    START_TIME=$(date +%s)
    if (cd "$SCRIPT_DIR/$APP_DIR" && yarn build > "$BUILD_LOG" 2>&1); then
        END_TIME=$(date +%s)
        BUILD_TIME=$((END_TIME - START_TIME))
        
        # Extract route count from build log
        ROUTE_COUNT=$(grep -c "Route (pages)" "$BUILD_LOG" 2>/dev/null || echo "0")
        ROUTES=$(grep -A 50 "Route (pages)" "$BUILD_LOG" 2>/dev/null | grep -E "^[├└]" | wc -l || echo "N/A")
        
        echo "✅ Build successful in ${BUILD_TIME}s"
        echo "| $APP_NAME | $PORT | ✅ Success | ${BUILD_TIME}s | $ROUTES |" >> "$SUMMARY_FILE"
        ((SUCCESS_COUNT++))
        
        # Extract last 80 lines for detailed report
        echo "=== Build Output (last 80 lines) ===" >> "$REPORT_DIR/${APP_NAME}-summary.txt"
        tail -80 "$BUILD_LOG" >> "$REPORT_DIR/${APP_NAME}-summary.txt"
        
    else
        END_TIME=$(date +%s)
        BUILD_TIME=$((END_TIME - START_TIME))
        
        echo "❌ Build failed after ${BUILD_TIME}s"
        echo "| $APP_NAME | $PORT | ❌ Failed | ${BUILD_TIME}s | - |" >> "$SUMMARY_FILE"
        ((FAIL_COUNT++))
        
        # Show error
        echo "Error log:"
        tail -20 "$BUILD_LOG"
    fi
done

# Summary statistics
echo "" >> "$SUMMARY_FILE"
echo "## Summary Statistics" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"
echo "- **Total Apps**: ${#APPS[@]}" >> "$SUMMARY_FILE"
echo "- **Successful Builds**: $SUCCESS_COUNT" >> "$SUMMARY_FILE"
echo "- **Failed Builds**: $FAIL_COUNT" >> "$SUMMARY_FILE"
echo "- **Success Rate**: $(( SUCCESS_COUNT * 100 / ${#APPS[@]} ))%" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"
echo "## Build Artifacts" >> "$SUMMARY_FILE"
echo "" >> "$SUMMARY_FILE"
echo "Detailed build logs available in:" >> "$SUMMARY_FILE"
echo '```' >> "$SUMMARY_FILE"
echo "$REPORT_DIR/" >> "$SUMMARY_FILE"
echo '```' >> "$SUMMARY_FILE"

# Display summary
echo ""
echo "=========================================="
echo "Build Validation Complete"
echo "=========================================="
echo "Total Apps: ${#APPS[@]}"
echo "Successful: $SUCCESS_COUNT"
echo "Failed: $FAIL_COUNT"
echo ""
echo "Summary report: $SUMMARY_FILE"
echo ""

# Exit with error if any builds failed
if [ $FAIL_COUNT -gt 0 ]; then
    exit 1
fi
