#!/bin/bash
# generate-or-download-images.sh
# Downloads license-free images or generates them via Gemini Image API
# Usage: 
#   ./scripts/generate-or-download-images.sh                  (download + generate)
#   ./scripts/generate-or-download-images.sh --download-only  (download only, skip generation)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEMPLATE_FILE="$PROJECT_ROOT/components/shared/imageManifest.template.json"
OUTPUT_DIR="$PROJECT_ROOT/public/generated-images"
OUTPUT_MANIFEST="$PROJECT_ROOT/components/shared/imageManifest.js"

DOWNLOAD_ONLY=false
if [[ "$1" == "--download-only" ]]; then
  DOWNLOAD_ONLY=true
fi

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Image Manifest Generator ===${NC}"
echo "Template: $TEMPLATE_FILE"
echo "Output Directory: $OUTPUT_DIR"
echo "Output Manifest: $OUTPUT_MANIFEST"
echo ""

# Check if template exists
if [[ ! -f "$TEMPLATE_FILE" ]]; then
  echo -e "${RED}Error: Template file not found at $TEMPLATE_FILE${NC}"
  exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Initialize manifest content
cat > "$OUTPUT_MANIFEST" << 'EOF'
// Auto-generated image manifest
// DO NOT EDIT MANUALLY - run scripts/generate-or-download-images.sh instead
// Generated at: 
EOF
echo "// $(date -u +"%Y-%m-%dT%H:%M:%SZ")" >> "$OUTPUT_MANIFEST"
echo "" >> "$OUTPUT_MANIFEST"
echo "const imageManifest = {" >> "$OUTPUT_MANIFEST"

# Track what we did
DOWNLOADED=()
GENERATED=()
SKIPPED=()

# Parse JSON and process each app
# Using jq if available, otherwise basic parsing
if command -v jq &> /dev/null; then
  APPS=$(jq -r 'keys[]' "$TEMPLATE_FILE")
  
  FIRST=true
  for APP in $APPS; do
    echo -e "\n${YELLOW}Processing: $APP${NC}"
    
    REMOTE_URL=$(jq -r ".\"$APP\".preferredRemoteUrl // empty" "$TEMPLATE_FILE")
    GEN_PROMPT=$(jq -r ".\"$APP\".generationPrompt // empty" "$TEMPLATE_FILE")
    CREDIT_NAME=$(jq -r ".\"$APP\".credit.sourceName // empty" "$TEMPLATE_FILE")
    CREDIT_URL=$(jq -r ".\"$APP\".credit.sourceUrl // empty" "$TEMPLATE_FILE")
    
    # Add comma for all but first entry
    if [[ "$FIRST" == true ]]; then
      FIRST=false
    else
      echo "," >> "$OUTPUT_MANIFEST"
    fi
    
    echo -n "  \"$APP\": {" >> "$OUTPUT_MANIFEST"
    
    # Case 1: Has remote URL - download it
    if [[ -n "$REMOTE_URL" && "$REMOTE_URL" != "null" ]]; then
      IMAGE_FILE="$OUTPUT_DIR/${APP}-hero.jpg"
      
      if [[ -f "$IMAGE_FILE" ]]; then
        echo "  ✓ Already exists: $IMAGE_FILE"
      else
        echo "  Downloading from $REMOTE_URL..."
        if curl -sL "$REMOTE_URL" -o "$IMAGE_FILE"; then
          echo -e "  ${GREEN}✓ Downloaded${NC}"
          DOWNLOADED+=("$APP")
        else
          echo -e "  ${RED}✗ Download failed${NC}"
          SKIPPED+=("$APP (download failed)")
        fi
      fi
      
      echo -n " \"remoteUrl\": \"$REMOTE_URL\", \"localPath\": \"/generated-images/${APP}-hero.jpg\"" >> "$OUTPUT_MANIFEST"
      if [[ -n "$CREDIT_NAME" && "$CREDIT_NAME" != "null" ]]; then
        echo -n ", \"credit\": { \"sourceName\": \"$CREDIT_NAME\", \"sourceUrl\": \"$CREDIT_URL\" }" >> "$OUTPUT_MANIFEST"
      fi
      echo -n " }" >> "$OUTPUT_MANIFEST"
      
    # Case 2: Has generation prompt - generate via Gemini
    elif [[ -n "$GEN_PROMPT" && "$GEN_PROMPT" != "null" ]]; then
      IMAGE_FILE="$OUTPUT_DIR/${APP}-hero.jpg"
      
      if [[ "$DOWNLOAD_ONLY" == true ]]; then
        echo -e "  ${YELLOW}⊘ Skipped (download-only mode, requires generation)${NC}"
        echo -n " \"generationPrompt\": \"$GEN_PROMPT\", \"localPath\": null" >> "$OUTPUT_MANIFEST"
        echo -n " }" >> "$OUTPUT_MANIFEST"
        SKIPPED+=("$APP (requires generation)")
        continue
      fi
      
      if [[ -f "$IMAGE_FILE" ]]; then
        echo "  ✓ Already exists: $IMAGE_FILE"
        echo -n " \"localPath\": \"/generated-images/${APP}-hero.jpg\", \"generatedViaGemini\": true" >> "$OUTPUT_MANIFEST"
        echo -n " }" >> "$OUTPUT_MANIFEST"
        continue
      fi
      
      # Check for Gemini API key
      if [[ -z "$GEMINI_API_KEY" ]]; then
        echo -e "  ${YELLOW}⊘ Skipped: GEMINI_API_KEY not set (export GEMINI_API_KEY=... to generate)${NC}"
        echo -n " \"generationPrompt\": \"$GEN_PROMPT\", \"localPath\": null" >> "$OUTPUT_MANIFEST"
        echo -n " }" >> "$OUTPUT_MANIFEST"
        SKIPPED+=("$APP (no API key)")
        continue
      fi
      
      echo "  Generating image via Gemini API..."
      echo "  Prompt: $GEN_PROMPT"
      
      # Call Gemini API for image generation
      # Note: This is a placeholder - actual Gemini Image API integration needed
      # For MVP, we skip creation and leave localPath as null in manifest
      echo -e "  ${YELLOW}⚠ Note: Gemini Image API integration needed - skipping generation${NC}"
      echo -e "  ${YELLOW}⚠ Set localPath to null in manifest (will use remoteUrl if available)${NC}"
      
      GENERATED+=("$APP (skipped - API not integrated)")
      
      echo -n " \"generationPrompt\": \"$GEN_PROMPT\", \"localPath\": null" >> "$OUTPUT_MANIFEST"
      echo -n " }" >> "$OUTPUT_MANIFEST"
      
    # Case 3: No image (e.g., learn-companion)
    else
      echo "  ⊘ No image configured"
      echo -n " \"localPath\": null" >> "$OUTPUT_MANIFEST"
      echo -n " }" >> "$OUTPUT_MANIFEST"
      SKIPPED+=("$APP (no image)")
    fi
  done
  
else
  echo -e "${RED}Error: jq not found. Please install jq to run this script.${NC}"
  echo "Install: sudo apt-get install jq  (Ubuntu/Debian)"
  echo "         brew install jq          (macOS)"
  exit 1
fi

# Close the manifest object
echo "" >> "$OUTPUT_MANIFEST"
echo "};" >> "$OUTPUT_MANIFEST"
echo "" >> "$OUTPUT_MANIFEST"
echo "module.exports = imageManifest;" >> "$OUTPUT_MANIFEST"

# Summary
echo -e "\n${GREEN}=== Summary ===${NC}"
echo "Downloaded: ${#DOWNLOADED[@]}"
for item in "${DOWNLOADED[@]}"; do
  echo "  - $item"
done

echo "Generated: ${#GENERATED[@]}"
for item in "${GENERATED[@]}"; do
  echo "  - $item"
done

echo "Skipped: ${#SKIPPED[@]}"
for item in "${SKIPPED[@]}"; do
  echo "  - $item"
done

echo -e "\n${GREEN}✓ Manifest written to: $OUTPUT_MANIFEST${NC}"
echo -e "${YELLOW}⚠ IMPORTANT: DO NOT commit generated images to git!${NC}"
echo "   Generated images are in .gitignore and should only exist locally."
echo ""
echo "To use in your app:"
echo "  const imageManifest = require('@/components/shared/imageManifest');"
echo "  const heroImage = imageManifest['learn-cricket'];"
