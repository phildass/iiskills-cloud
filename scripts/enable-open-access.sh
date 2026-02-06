#!/bin/bash

# Temporary Open Access Activation Script
# This script enables temporary open access across all apps for testing and demo purposes

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔓 TEMPORARY OPEN ACCESS ACTIVATION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  WARNING: This will enable public access to all content!"
echo "⚠️  Only use for testing, preview, and demo purposes."
echo ""
echo "This script will:"
echo "  1. Create/update .env.local files for all apps"
echo "  2. Set NEXT_PUBLIC_DISABLE_AUTH=true"
echo "  3. Set NEXT_PUBLIC_PAYWALL_ENABLED=false"
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

# Update or add NEXT_PUBLIC_DISABLE_AUTH
if grep -q "NEXT_PUBLIC_DISABLE_AUTH" .env.local; then
    sed -i.bak 's/NEXT_PUBLIC_DISABLE_AUTH=.*/NEXT_PUBLIC_DISABLE_AUTH=true/' .env.local
else
    echo "" >> .env.local
    echo "# Temporary open access for testing" >> .env.local
    echo "NEXT_PUBLIC_DISABLE_AUTH=true" >> .env.local
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
        
        # Update or add NEXT_PUBLIC_DISABLE_AUTH
        if grep -q "NEXT_PUBLIC_DISABLE_AUTH" "$app/.env.local"; then
            sed -i.bak 's/NEXT_PUBLIC_DISABLE_AUTH=.*/NEXT_PUBLIC_DISABLE_AUTH=true/' "$app/.env.local"
        else
            echo "" >> "$app/.env.local"
            echo "# Temporary open access for testing" >> "$app/.env.local"
            echo "NEXT_PUBLIC_DISABLE_AUTH=true" >> "$app/.env.local"
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
echo "✅ TEMPORARY OPEN ACCESS ENABLED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Rebuild apps to apply changes:"
echo "   ./deploy-all.sh"
echo ""
echo "2. Verify authentication is bypassed:"
echo "   - Navigate to any protected route"
echo "   - Check console for '⚠️ AUTH DISABLED' message"
echo "   - Content should load without login prompt"
echo ""
echo "3. Test 'Continue as Guest' button:"
echo "   - Set NEXT_PUBLIC_DISABLE_AUTH=false to test guest mode"
echo "   - Click the button on protected pages"
echo "   - Verify URL includes ?guest=true"
echo ""
echo "⚠️  IMPORTANT: Remember to restore authentication after testing!"
echo "   Run: ./scripts/restore-authentication.sh"
echo ""
echo "📖 Documentation: TEMPORARY_OPEN_ACCESS.md"
echo ""
