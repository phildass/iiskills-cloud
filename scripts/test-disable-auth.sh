#!/usr/bin/env bash

# Test script to verify the DISABLE_AUTH feature works correctly
# Run this after setting DISABLE_AUTH=true and NEXT_PUBLIC_DISABLE_AUTH=true

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Testing DISABLE_AUTH Feature"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if environment variables are set
echo "1. Checking environment variables..."
if [ "$DISABLE_AUTH" = "true" ]; then
  echo "  ✅ DISABLE_AUTH is set to 'true'"
else
  echo "  ❌ DISABLE_AUTH is NOT set to 'true' (current: ${DISABLE_AUTH:-not set})"
  echo "     Run: export DISABLE_AUTH=true"
fi

if [ "$NEXT_PUBLIC_DISABLE_AUTH" = "true" ]; then
  echo "  ✅ NEXT_PUBLIC_DISABLE_AUTH is set to 'true'"
else
  echo "  ❌ NEXT_PUBLIC_DISABLE_AUTH is NOT set to 'true' (current: ${NEXT_PUBLIC_DISABLE_AUTH:-not set})"
  echo "     Run: export NEXT_PUBLIC_DISABLE_AUTH=true"
fi
echo ""

# Check if files exist
echo "2. Checking required files..."
FILES=(
  "lib/feature-flags/disableAuth.js"
  "docs/DISABLE_AUTH_README.md"
  "scripts/set-disable-auth.sh"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file exists"
  else
    echo "  ❌ $file is missing"
  fi
done
echo ""

# Check if backup files exist
echo "3. Checking backup files..."
BACKUP_COUNT=$(find . -name "*.bak.20260202_072142" 2>/dev/null | wc -l)
echo "  Found $BACKUP_COUNT backup files"
if [ "$BACKUP_COUNT" -gt 0 ]; then
  echo "  ✅ Backup files are present for rollback"
else
  echo "  ⚠️  No backup files found - may not be able to easily revert"
fi
echo ""

# Syntax check on key files
echo "4. Syntax checking modified files..."
if command -v node &> /dev/null; then
  if node -c lib/feature-flags/disableAuth.js 2>/dev/null; then
    echo "  ✅ lib/feature-flags/disableAuth.js syntax OK"
  else
    echo "  ❌ lib/feature-flags/disableAuth.js has syntax errors"
  fi
  
  if node -c lib/supabaseClient.js 2>/dev/null; then
    echo "  ✅ lib/supabaseClient.js syntax OK"
  else
    echo "  ❌ lib/supabaseClient.js has syntax errors"
  fi
else
  echo "  ⚠️  Node.js not found, skipping syntax checks"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Test Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
if [ "$DISABLE_AUTH" = "true" ] && [ "$NEXT_PUBLIC_DISABLE_AUTH" = "true" ]; then
  echo "✅ Environment is configured to disable authentication"
  echo ""
  echo "Next steps:"
  echo "1. Rebuild your application: npm run build"
  echo "2. Start the application: npm run dev or npm run start"
  echo "3. Test that protected pages are accessible without login"
  echo "4. Look for console messages: '⚠️ AUTH DISABLED'"
else
  echo "❌ Environment is NOT fully configured"
  echo ""
  echo "To enable auth bypass:"
  echo "  export DISABLE_AUTH=true"
  echo "  export NEXT_PUBLIC_DISABLE_AUTH=true"
  echo "  npm run build"
  echo "  npm run dev"
fi
echo ""
echo "For more information, see: docs/DISABLE_AUTH_README.md"
echo ""
