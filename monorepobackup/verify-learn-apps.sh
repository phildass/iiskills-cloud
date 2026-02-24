#!/bin/bash
# verify-learn-apps.sh
# Verification script for learn apps configuration

cd "$(dirname "$0")"

APPS=(learn-ai learn-apt learn-chemistry learn-developer learn-geography learn-management learn-math learn-physics learn-pr)
PORTS=(3024 3002 3005 3007 3011 3016 3017 3020 3021)

echo "╔════════════════════════════════════════════════════════════╗"
echo "║        Learn Apps Configuration Verification Script        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

ALL_OK=true

# Check configuration files
echo "📋 Checking Configuration Files..."
echo ""

for i in "${!APPS[@]}"; do
    app="${APPS[$i]}"
    port="${PORTS[$i]}"
    
    echo "=== $app (port $port) ==="
    
    # Check files exist
    if [ -f "apps/$app/jsconfig.json" ]; then
        echo "  ✅ jsconfig.json"
    else
        echo "  ❌ jsconfig.json MISSING"
        ALL_OK=false
    fi
    
    if [ -f "apps/$app/next.config.js" ]; then
        echo "  ✅ next.config.js"
    else
        echo "  ❌ next.config.js MISSING"
        ALL_OK=false
    fi
    
    if [ -f "apps/$app/.env.local" ]; then
        echo "  ✅ .env.local"
        
        # Verify APP_ID is correct
        if grep -q "NEXT_PUBLIC_APP_ID=$app" "apps/$app/.env.local"; then
            echo "  ✅ APP_ID correct ($app)"
        else
            echo "  ⚠️  APP_ID may be incorrect"
        fi
        
        # Verify PORT is correct
        if grep -q "NEXT_PUBLIC_SITE_URL=http://localhost:$port" "apps/$app/.env.local"; then
            echo "  ✅ PORT correct ($port)"
        else
            echo "  ⚠️  PORT may be incorrect"
        fi
    else
        echo "  ❌ .env.local MISSING"
        ALL_OK=false
    fi
    
    if [ -d "apps/$app/.next" ]; then
        echo "  ✅ .next build directory"
    else
        echo "  ❌ .next build MISSING - Run: cd apps/$app && yarn build"
        ALL_OK=false
    fi
    
    echo ""
done

# Summary
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    Verification Summary                    ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

if [ "$ALL_OK" = true ]; then
    echo "✅ All apps are properly configured!"
    echo ""
    echo "Next steps:"
    echo "  1. Update .env.local files with production Supabase credentials"
    echo "  2. Rebuild apps if environment variables changed"
    echo "  3. Start apps with PM2: pm2 start ecosystem.config.js"
    echo "  4. Verify each app serves unique content"
    exit 0
else
    echo "❌ Some apps have configuration issues!"
    echo ""
    echo "To fix:"
    echo "  1. Create missing jsconfig.json files (copy from apps/learn-ai)"
    echo "  2. Update next.config.js with path aliases (copy from apps/learn-ai)"
    echo "  3. Create .env.local files with correct APP_ID and PORT"
    echo "  4. Build apps: cd apps/[app-name] && yarn build"
    exit 1
fi
