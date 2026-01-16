#!/bin/bash
# Update all learn-* apps with newsletter system components
# This script copies the necessary files from root to all learning apps

set -e  # Exit on error

echo "🚀 Updating Newsletter System in All Learn Apps"
echo "================================================"

# Root directory
ROOT_DIR="/home/runner/work/iiskills-cloud/iiskills-cloud"

# List of learn apps
APPS=(
  "apps/main"
  "learn-ai"
  "learn-apt"
  "learn-chemistry"
  "learn-data-science"
  "learn-geography"
  "learn-govt-jobs"
  "learn-ias"
  "learn-jee"
  "learn-leadership"
  "learn-management"
  "learn-math"
  "learn-neet"
  "learn-physics"
  "learn-pr"
  "learn-winning"
)

# Files to copy
declare -A FILES_TO_COPY=(
  # Components
  ["components/shared/NewsletterSignup.js"]="components/shared/NewsletterSignup.js"
  ["components/shared/UniversalRegister.js"]="components/shared/UniversalRegister.js"
  
  # Pages
  ["pages/newsletter.js"]="pages/newsletter.js"
  ["pages/unsubscribe.js"]="pages/unsubscribe.js"
  ["pages/register.js"]="pages/register.js"
  
  # API endpoints
  ["pages/api/newsletter/subscribe.js"]="pages/api/newsletter/subscribe.js"
  ["pages/api/newsletter/unsubscribe.js"]="pages/api/newsletter/unsubscribe.js"
  ["pages/api/newsletter/generate-token.js"]="pages/api/newsletter/generate-token.js"
  
  # Newsletter archive (create dir structure)
  ["pages/newsletter/archive.js"]="pages/newsletter/archive.js"
  ["pages/newsletter/view/[id].js"]="pages/newsletter/view/[id].js"
  
  # Lib files  
  ["lib/email-sender.js"]="lib/email-sender.js"
  ["lib/ai-newsletter-generator.js"]="lib/ai-newsletter-generator.js"
  ["lib/supabaseClient.js"]="lib/supabaseClient.js"
)

# Counter
UPDATED_COUNT=0
ERROR_COUNT=0

# Update each app
for APP in "${APPS[@]}"; do
  echo ""
  echo "📦 Updating: $APP"
  echo "-------------------"
  
  APP_PATH="$ROOT_DIR/$APP"
  
  # Check if app exists
  if [ ! -d "$APP_PATH" ]; then
    echo "⚠️  Skipping $APP - directory not found"
    ((ERROR_COUNT++))
    continue
  fi
  
  # Copy each file
  for SOURCE in "${!FILES_TO_COPY[@]}"; do
    DEST="${FILES_TO_COPY[$SOURCE]}"
    
    SOURCE_PATH="$ROOT_DIR/$SOURCE"
    DEST_PATH="$APP_PATH/$DEST"
    
    # Check if source exists
    if [ ! -f "$SOURCE_PATH" ]; then
      echo "⚠️  Source not found: $SOURCE"
      continue
    fi
    
    # Create destination directory if it doesn't exist
    DEST_DIR=$(dirname "$DEST_PATH")
    mkdir -p "$DEST_DIR"
    
    # Copy file
    cp "$SOURCE_PATH" "$DEST_PATH"
    echo "✅ Copied: $SOURCE"
  done
  
  ((UPDATED_COUNT++))
done

echo ""
echo "================================================"
echo "✨ Update Complete!"
echo "Updated apps: $UPDATED_COUNT"
echo "Errors: $ERROR_COUNT"
echo ""
echo "📝 Next Steps:"
echo "1. Verify files copied correctly"
echo "2. Test newsletter signup in each app"
echo "3. Ensure .env.local is configured in each app"
echo "4. Commit changes"
echo ""
