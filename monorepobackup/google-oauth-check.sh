#!/bin/bash
# Google OAuth Configuration Verification Script
# This script checks if Google OAuth is properly configured across the iiskills-cloud monorepo

set -e

echo "=============================================="
echo "  Google OAuth Configuration Verification"
echo "=============================================="
echo ""

ERRORS=0
WARNINGS=0

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
error() {
    echo -e "${RED}❌ $1${NC}"
    ((ERRORS++))
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    ((WARNINGS++))
}

info() {
    echo "ℹ️  $1"
}

echo "=== 1. Checking Root Directory Configuration ==="
echo ""

# Check root .env.local
if [ -f .env.local ]; then
    success ".env.local file exists in root"
    
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
        success "NEXT_PUBLIC_SUPABASE_URL found"
        SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
        info "Supabase URL: $SUPABASE_URL"
    else
        error "NEXT_PUBLIC_SUPABASE_URL missing in .env.local"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
        success "NEXT_PUBLIC_SUPABASE_ANON_KEY found"
        KEY=$(grep "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local | cut -d'=' -f2 | head -c 20)
        info "Anon key starts with: ${KEY}..."
    else
        error "NEXT_PUBLIC_SUPABASE_ANON_KEY missing in .env.local"
    fi
    
    if grep -q "NEXT_PUBLIC_COOKIE_DOMAIN" .env.local; then
        COOKIE_DOMAIN=$(grep "NEXT_PUBLIC_COOKIE_DOMAIN" .env.local | cut -d'=' -f2 | tr -d '"' | tr -d "'")
        if [ -z "$COOKIE_DOMAIN" ]; then
            success "NEXT_PUBLIC_COOKIE_DOMAIN is empty (correct for localhost)"
        else
            success "NEXT_PUBLIC_COOKIE_DOMAIN set to: $COOKIE_DOMAIN"
        fi
    else
        warning "NEXT_PUBLIC_COOKIE_DOMAIN not set (should be .iiskills.cloud for production)"
    fi
else
    error ".env.local file not found in root directory"
    info "Create it by copying: cp .env.local.example .env.local"
fi

echo ""
echo "=== 2. Checking Supabase Client Configuration ==="
echo ""

if [ -f lib/supabaseClient.js ]; then
    success "lib/supabaseClient.js exists"
    
    if grep -q "signInWithGoogle" lib/supabaseClient.js; then
        success "signInWithGoogle function found"
    else
        error "signInWithGoogle function missing in lib/supabaseClient.js"
    fi
    
    if grep -q "signInWithOAuth" lib/supabaseClient.js; then
        success "signInWithOAuth method found"
    else
        error "signInWithOAuth method missing in lib/supabaseClient.js"
    fi
    
    if grep -q "cookieOptions" lib/supabaseClient.js; then
        success "cookieOptions configuration found"
    else
        warning "cookieOptions configuration missing - cross-subdomain auth may not work"
    fi
    
    if grep -q "getCookieDomain" lib/supabaseClient.js; then
        success "getCookieDomain function usage found"
    else
        warning "getCookieDomain function not found - check cookie domain setup"
    fi
else
    error "lib/supabaseClient.js not found"
fi

echo ""
echo "=== 3. Checking Universal Login Component ==="
echo ""

if [ -f components/shared/UniversalLogin.js ]; then
    success "UniversalLogin component exists"
    
    if grep -q "signInWithGoogle" components/shared/UniversalLogin.js; then
        success "signInWithGoogle imported in UniversalLogin"
    else
        error "signInWithGoogle not found in UniversalLogin component"
    fi
    
    if grep -q "handleGoogleSignIn" components/shared/UniversalLogin.js; then
        success "handleGoogleSignIn handler found"
    else
        error "handleGoogleSignIn handler missing"
    fi
    
    if grep -q "Continue with Google" components/shared/UniversalLogin.js; then
        success "Google sign-in button text found"
    else
        warning "Google sign-in button text not found"
    fi
    
    if grep -q "showGoogleAuth" components/shared/UniversalLogin.js; then
        success "showGoogleAuth prop found (allows toggling Google auth)"
    else
        warning "showGoogleAuth prop not found"
    fi
else
    error "components/shared/UniversalLogin.js not found"
fi

echo ""
echo "=== 4. Checking URL Helper Utilities ==="
echo ""

if [ -f utils/urlHelper.js ]; then
    success "utils/urlHelper.js exists"
    
    if grep -q "getCookieDomain" utils/urlHelper.js; then
        success "getCookieDomain function found"
    else
        error "getCookieDomain function missing"
    fi
    
    if grep -q "\.iiskills\.cloud" utils/urlHelper.js; then
        success "Cookie domain configuration includes .iiskills.cloud"
    else
        warning "Cookie domain may not be configured for .iiskills.cloud"
    fi
else
    error "utils/urlHelper.js not found"
fi

echo ""
echo "=== 5. Checking Subdomain Configurations ==="
echo ""

SUBDOMAINS=("learn-neet" "learn-jee" "learn-apt" "learn-govt-jobs" "learn-ias" "learn-winning")
CHECKED_SUBDOMAINS=0

for subdomain in "${SUBDOMAINS[@]}"; do
    if [ -d "$subdomain" ]; then
        ((CHECKED_SUBDOMAINS++))
        echo "Checking $subdomain..."
        
        if [ -f "$subdomain/.env.local" ]; then
            success "$subdomain/.env.local exists"
            
            # Check if it uses the same Supabase URL
            if [ -n "$SUPABASE_URL" ]; then
                SUBDOMAIN_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" "$subdomain/.env.local" 2>/dev/null | cut -d'=' -f2 | tr -d '"' | tr -d "'")
                if [ "$SUBDOMAIN_URL" = "$SUPABASE_URL" ]; then
                    success "$subdomain uses same Supabase project"
                elif [ -n "$SUBDOMAIN_URL" ]; then
                    error "$subdomain uses DIFFERENT Supabase project: $SUBDOMAIN_URL"
                fi
            fi
        else
            warning "$subdomain/.env.local not found"
        fi
        
        if [ -f "$subdomain/lib/supabaseClient.js" ]; then
            if grep -q "signInWithGoogle" "$subdomain/lib/supabaseClient.js" 2>/dev/null; then
                success "$subdomain has signInWithGoogle function"
            else
                warning "$subdomain missing signInWithGoogle function"
            fi
        fi
        
        echo ""
    fi
done

if [ $CHECKED_SUBDOMAINS -eq 0 ]; then
    warning "No subdomain directories found to check"
fi

echo "=== 6. Checking Documentation ==="
echo ""

if [ -f GOOGLE_OAUTH_TROUBLESHOOTING.md ]; then
    success "GOOGLE_OAUTH_TROUBLESHOOTING.md exists"
else
    warning "GOOGLE_OAUTH_TROUBLESHOOTING.md not found"
fi

if [ -f SUPABASE_AUTH_SETUP.md ]; then
    success "SUPABASE_AUTH_SETUP.md exists"
    
    if grep -q "Google OAuth" SUPABASE_AUTH_SETUP.md; then
        success "Google OAuth documentation found in SUPABASE_AUTH_SETUP.md"
    else
        warning "Google OAuth documentation not found in SUPABASE_AUTH_SETUP.md"
    fi
else
    warning "SUPABASE_AUTH_SETUP.md not found"
fi

echo ""
echo "=============================================="
echo "              Verification Summary"
echo "=============================================="
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    success "All checks passed! Google OAuth should be configured correctly."
    echo ""
    echo "Next steps:"
    echo "1. Verify Google provider is enabled in Supabase Dashboard"
    echo "2. Ensure Google Client ID and Secret are configured in Supabase"
    echo "3. Add all callback URLs to Supabase (see GOOGLE_OAUTH_TROUBLESHOOTING.md)"
    echo "4. Add authorized redirect URIs to Google Cloud Console"
    echo "5. Test Google sign-in on http://localhost:3000/login"
elif [ $ERRORS -eq 0 ]; then
    warning "Verification completed with $WARNINGS warnings"
    echo ""
    echo "Review warnings above and consult GOOGLE_OAUTH_TROUBLESHOOTING.md"
else
    error "Verification found $ERRORS errors and $WARNINGS warnings"
    echo ""
    echo "Please fix the errors above before testing Google OAuth."
    echo "See GOOGLE_OAUTH_TROUBLESHOOTING.md for detailed instructions."
fi

echo ""
echo "=== Manual Verification Required ==="
echo ""
echo "The following must be verified manually in Supabase Dashboard:"
echo "1. ☐ Google provider is enabled (Authentication → Providers → Google)"
echo "2. ☐ Client ID and Secret are configured"
echo "3. ☐ Callback URL is added to Google Cloud Console"
echo "4. ☐ All redirect URLs are added (Authentication → URL Configuration)"
echo ""
echo "The following must be verified manually in Google Cloud Console:"
echo "1. ☐ OAuth 2.0 Client ID is created"
echo "2. ☐ Authorized JavaScript origins include all domains"
echo "3. ☐ Authorized redirect URIs include Supabase callback URL"
echo "4. ☐ OAuth consent screen is configured"
echo ""

exit $ERRORS
