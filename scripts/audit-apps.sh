#!/usr/bin/env bash
set -euo pipefail

# Script to audit apps for missing files/directories
# Creates apps_audit.txt with a list of missing files per app

OUTPUT="apps_audit.txt"
APPS_DIR="apps"

# Array of expected directories for each app
EXPECTED_DIRS=("app" "public")
EXPECTED_FILES=("README.md")

echo "Auditing apps for missing files..." > "$OUTPUT"

# Check each app
for app_path in "$APPS_DIR"/*; do
  if [ -d "$app_path" ]; then
    app_name=$(basename "$app_path")
    echo "" >> "$OUTPUT"
    echo "App: $app_name" >> "$OUTPUT"
    
    # Check for missing directories
    for dir in "${EXPECTED_DIRS[@]}"; do
      if [ ! -d "$app_path/$dir" ]; then
        echo "  MISSING: $dir" >> "$OUTPUT"
      fi
    done
    
    # Check for missing files (only for main app)
    if [ "$app_name" = "main" ]; then
      for file in "${EXPECTED_FILES[@]}"; do
        if [ ! -f "$app_path/$file" ]; then
          echo "  MISSING: $file" >> "$OUTPUT"
        fi
      done
    fi
  fi
done

echo ""
echo "Audit complete. Results saved to $OUTPUT"
cat "$OUTPUT"
