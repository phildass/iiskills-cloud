#!/bin/bash

# Open Access Mode Activation Script
# This script enables complete open access across all apps for testing and demo purposes

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔓 OPEN ACCESS MODE ACTIVATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  WARNING: This will enable public access to all content!"
echo "⚠️  Only use for testing, preview, and demo purposes."
echo ""
echo "This script will:"
echo "  1. Create/update .env.local files for all apps"
echo "  2. Set OPEN_ACCESS=true (enables full open access)"
echo "  3. Set NEXT_PUBLIC_PAYWALL_ENABLED=false (disables paywalls)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Activation cancelled."
    exit 1
fi

echo ""
echo "📝 Creating/updating environment files..."
echo ""

# Root .env.local
echo "Setting up root .env.local..."
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
fi

# Update or add OPEN_ACCESS
if grep -q "OPEN_ACCESS=" .env.local; then
    sed -i.bak 's/OPEN_ACCESS=.*/OPEN_ACCESS=true/' .env.local
else
    echo "" >> .env.local
    echo "# Open access mode for testing and demos" >> .env.local
    echo "OPEN_ACCESS=true" >> .env.local
fi

# Update or add NEXT_PUBLIC_PAYWALL_ENABLED
if grep -q "NEXT_PUBLIC_PAYWALL_ENABLED" .env.local; then
    sed -i.bak 's/NEXT_PUBLIC_PAYWALL_ENABLED=.*/NEXT_PUBLIC_PAYWALL_ENABLED=false/' .env.local
else
    echo "NEXT_PUBLIC_PAYWALL_ENABLED=false" >> .env.local
fi

echo "✅ Root .env.local updated"

# Update all app .env.local files
APPS=(
    "apps/main"
    "apps/learn-developer"
    "apps/learn-ai"
    # MOVED TO apps-backup as per cleanup requirements
    # "apps/learn-govt-jobs"
    "apps/learn-management"
    "apps/learn-pr"
    "apps/learn-physics"
    "apps/learn-chemistry"
    "apps/learn-math"
    "apps/learn-geography"
    "apps/learn-apt"
)

for app in "${APPS[@]}"; do
    if [ -d "$app" ]; then
        echo "Setting up $app/.env.local..."
        
        # Create .env.local if it doesn't exist
        if [ ! -f "$app/.env.local" ]; then
            if [ -f "$app/.env.local.example" ]; then
                cp "$app/.env.local.example" "$app/.env.local"
            else
                touch "$app/.env.local"
            fi
        fi
        
        # Update or add OPEN_ACCESS
        if grep -q "OPEN_ACCESS=" "$app/.env.local"; then
            sed -i.bak 's/OPEN_ACCESS=.*/OPEN_ACCESS=true/' "$app/.env.local"
        else
            echo "" >> "$app/.env.local"
            echo "# Open access mode for testing and demos" >> "$app/.env.local"
            echo "OPEN_ACCESS=true" >> "$app/.env.local"
        fi
        
        # Update or add NEXT_PUBLIC_PAYWALL_ENABLED
        if grep -q "NEXT_PUBLIC_PAYWALL_ENABLED" "$app/.env.local"; then
            sed -i.bak 's/NEXT_PUBLIC_PAYWALL_ENABLED=.*/NEXT_PUBLIC_PAYWALL_ENABLED=false/' "$app/.env.local"
        else
            echo "NEXT_PUBLIC_PAYWALL_ENABLED=false" >> "$app/.env.local"
        fi
        
        echo "✅ $app/.env.local updated"
    fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ OPEN ACCESS MODE ENABLED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Rebuild apps to apply changes:"
echo "   ./deploy-all.sh"
echo ""
echo "2. Verify open access mode is enabled:"
echo "   - Navigate to any protected route"
echo "   - Check console for '⚠️ OPEN ACCESS MODE' message"
echo "   - Content should load without login prompt"
echo ""
echo "3. Test across all apps:"
echo "   - All 11 learning apps should be fully accessible"
echo "   - No authentication, login, signup, or payment prompts"
echo "   - All features available to unauthenticated guests"
echo ""
echo "⚠️  IMPORTANT: Remember to restore authentication after testing!"
echo "   Run: ./scripts/restore-authentication.sh"
echo ""
echo "📖 Documentation: TEMPORARY_OPEN_ACCESS.md"
echo ""
