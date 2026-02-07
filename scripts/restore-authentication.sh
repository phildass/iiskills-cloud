#!/bin/bash

# Restore Authentication Script
# This script disables open access mode and restores normal authentication

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 RESTORE AUTHENTICATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This script will:"
echo "  1. Update .env.local files for all apps"
echo "  2. Set OPEN_ACCESS=false (disables open access mode)"
echo "  3. Restore normal authentication requirements"
echo ""
echo "Note: 'Continue as Guest' buttons will still work for session-based access"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Restoration cancelled."
    exit 1
fi

echo ""
echo "📝 Updating environment files..."
echo ""

# Root .env.local
if [ -f .env.local ]; then
    echo "Restoring root .env.local..."
    if grep -q "OPEN_ACCESS=" .env.local; then
        sed -i.bak 's/OPEN_ACCESS=.*/OPEN_ACCESS=false/' .env.local
        echo "✅ Root .env.local updated"
    fi
fi

# Update all app .env.local files
APPS=(
    "apps/main"
    "apps/learn-developer"
    "apps/learn-ai"
    "apps/learn-govt-jobs"
    "apps/learn-management"
    "apps/learn-pr"
    "apps/learn-physics"
    "apps/learn-chemistry"
    "apps/learn-math"
    "apps/learn-geography"
    "apps/learn-apt"
)

for app in "${APPS[@]}"; do
    if [ -f "$app/.env.local" ]; then
        echo "Restoring $app/.env.local..."
        if grep -q "OPEN_ACCESS=" "$app/.env.local"; then
            sed -i.bak 's/OPEN_ACCESS=.*/OPEN_ACCESS=false/' "$app/.env.local"
            echo "✅ $app/.env.local updated"
        fi
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ AUTHENTICATION RESTORED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Rebuild apps to apply changes:"
echo "   ./deploy-all.sh"
echo ""
echo "2. Verify authentication is active:"
echo "   - Navigate to any protected route"
echo "   - Should see login/register screen or 'Continue as Guest' button"
echo "   - Console should NOT show '⚠️ OPEN ACCESS MODE' message"
echo ""
echo "3. Guest mode still available:"
echo "   - Users can still click 'Continue as Guest' for session access"
echo "   - This provides read-only browsing without sign-up"
echo ""
echo "✅ Normal authentication requirements have been restored!"
echo ""
