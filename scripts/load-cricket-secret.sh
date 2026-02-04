#!/bin/bash
# load-cricket-secret.sh - Load Learn Cricket API secret before build
#
# This script copies the Learn Cricket secret file from the system secrets
# directory to the app's .env.local file, ensuring it's available during
# Next.js/Turbopack build time.
#
# Usage: ./scripts/load-cricket-secret.sh
#
# Environment Variables:
#   SECRETS_DIR - Directory containing app secrets (default: $HOME/.secrets/iiskills)
#
# Exit Codes:
#   0 - Secret successfully loaded
#   1 - Secret file not found (non-fatal, deploy can continue)

set -u  # Exit on undefined variables (but not on errors, since we want custom error handling)

# Configuration
SECRETS_DIR="${SECRETS_DIR:-$HOME/.secrets/iiskills}"
SECRET_FILE="${SECRETS_DIR}/learn-cricket.env"
TARGET_DIR="apps/learn-cricket"
TARGET_FILE="${TARGET_DIR}/.env.local"

echo "🔐 Loading Learn Cricket API secret..."
echo "   Source: ${SECRET_FILE}"
echo "   Target: ${TARGET_FILE}"

# Check if secret file exists
if [ ! -f "$SECRET_FILE" ]; then
  echo "⚠️  WARNING: Secret file not found: ${SECRET_FILE}"
  echo "   The Learn Cricket app may not have API credentials during build."
  echo "   If this is intentional, you can ignore this warning."
  exit 1
fi

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
  echo "❌ ERROR: Target directory not found: ${TARGET_DIR}"
  echo "   Is this script running from the repository root?"
  exit 1
fi

# Copy secret file to target location
echo "   Copying secret file..."
cp "$SECRET_FILE" "$TARGET_FILE"

# Set secure permissions (owner read/write only)
chmod 600 "$TARGET_FILE"

echo "✅ Secret loaded successfully"
echo "   Permissions: $(stat -c '%a' "$TARGET_FILE" 2>/dev/null || stat -f '%A' "$TARGET_FILE" 2>/dev/null)"
echo ""

exit 0
