#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    iiskills-cloud Pre-Launch Security Audit${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

ISSUES_FOUND=0
WARNINGS_FOUND=0

# Function to report issue
report_issue() {
    echo -e "${RED}✗ CRITICAL: $1${NC}"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
}

# Function to report warning
report_warning() {
    echo -e "${YELLOW}⚠ WARNING: $1${NC}"
    WARNINGS_FOUND=$((WARNINGS_FOUND + 1))
}

# Function to report success
report_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

echo -e "${BLUE}1. Secrets & Credentials Scanning${NC}"
echo "────────────────────────────────────────"

# Check for .env files that shouldn't be committed
if find . -name ".env.local" -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./apps-backup/*" | grep -q .; then
    report_issue ".env.local files found in repository (should be in .gitignore)"
    find . -name ".env.local" -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./apps-backup/*"
else
    report_success "No .env.local files in repository"
fi

# Check for common secret patterns
echo ""
echo "Scanning for potential secrets in committed files..."
SECRET_PATTERNS=(
    "SUPABASE_SERVICE_ROLE_KEY=.*[a-zA-Z0-9]{20,}"
    "RAZORPAY_KEY_SECRET=.*[a-zA-Z0-9]{20,}"
    "SENDGRID_API_KEY=.*SG\.[a-zA-Z0-9_-]{20,}"
    "OPENAI_API_KEY=.*sk-[a-zA-Z0-9]{20,}"
    "ADMIN_JWT_SECRET=.*[a-zA-Z0-9]{20,}"
    "password.*=.*['\"][^'\"]{5,}['\"]"
)

for pattern in "${SECRET_PATTERNS[@]}"; do
    if git grep -iE "$pattern" -- '*.js' '*.jsx' '*.ts' '*.tsx' '*.json' ':!*.example' ':!apps-backup/' ':!node_modules/' 2>/dev/null | grep -v "your-.*-here"; then
        report_issue "Potential secrets found matching pattern: $pattern"
    fi
done

report_success "Secret pattern scan completed"

echo ""
echo -e "${BLUE}2. Debug & Test Mode Configuration${NC}"
echo "────────────────────────────────────────"

# Check .env.local.example files for dangerous defaults
if grep -r "DEBUG_ADMIN=true" .env.local.example 2>/dev/null; then
    report_warning "DEBUG_ADMIN=true found in .env.local.example - should be false for production"
fi

if grep -r "NEXT_PUBLIC_DISABLE_AUTH=true" .env.local.example 2>/dev/null; then
    report_warning "NEXT_PUBLIC_DISABLE_AUTH=true in .env.local.example - should be false for production"
fi

if grep -r "NEXT_PUBLIC_PAYWALL_ENABLED=false" .env.local.example 2>/dev/null; then
    report_warning "NEXT_PUBLIC_PAYWALL_ENABLED=false in .env.local.example - should be true for production"
fi

if grep -r "OPEN_ACCESS=true" .env.local.example 2>/dev/null; then
    report_warning "OPEN_ACCESS=true in .env.local.example - should be false for production"
fi

report_success "Debug mode configuration checked"

echo ""
echo -e "${BLUE}3. Next.js Production Configuration${NC}"
echo "────────────────────────────────────────"

# Check for productionBrowserSourceMaps in next.config.js files
if find . -name "next.config.js" -not -path "./node_modules/*" -not -path "./apps-backup/*" -exec grep -l "productionBrowserSourceMaps.*true" {} \; | grep -q .; then
    report_issue "productionBrowserSourceMaps enabled - source maps will be exposed in production"
else
    report_success "Production source maps not explicitly enabled"
fi

# Check for reactStrictMode
config_count=$(find . -name "next.config.js" -not -path "./node_modules/*" -not -path "./apps-backup/*" | wc -l)
strict_mode_count=$(find . -name "next.config.js" -not -path "./node_modules/*" -not -path "./apps-backup/*" -exec grep -l "reactStrictMode.*true" {} \; | wc -l)

if [ "$strict_mode_count" -eq "$config_count" ]; then
    report_success "React Strict Mode enabled in all configs"
else
    report_warning "React Strict Mode not enabled in all Next.js configs"
fi

echo ""
echo -e "${BLUE}4. Dependency Vulnerabilities${NC}"
echo "────────────────────────────────────────"

# Run npm audit for production dependencies
echo "Running npm audit (production only)..."
if npm audit --production --audit-level=moderate > /dev/null 2>&1; then
    report_success "No moderate or higher vulnerabilities in production dependencies"
else
    report_warning "Vulnerabilities found in production dependencies - run 'npm audit' for details"
fi

echo ""
echo -e "${BLUE}5. Security Headers & CSP${NC}"
echo "────────────────────────────────────────"

# Check for security headers in Next.js configs
if find . -name "next.config.js" -not -path "./node_modules/*" -not -path "./apps-backup/*" -exec grep -l "headers()" {} \; | grep -q .; then
    report_success "Custom headers configured in Next.js"
else
    report_warning "No custom security headers found in Next.js configs"
fi

echo ""
echo -e "${BLUE}6. CORS Configuration${NC}"
echo "────────────────────────────────────────"

# Check for overly permissive CORS
if git grep -iE "Access-Control-Allow-Origin.*\*" -- '*.js' '*.jsx' '*.ts' '*.tsx' ':!apps-backup/' ':!node_modules/' 2>/dev/null | grep -q .; then
    report_warning "Wildcard CORS (Access-Control-Allow-Origin: *) found - review for production security"
fi

report_success "CORS configuration checked"

echo ""
echo -e "${BLUE}7. Hardcoded Credentials Check${NC}"
echo "────────────────────────────────────────"

# Check for common hardcoded patterns
HARDCODED_PATTERNS=(
    "password.*=.*['\"][a-zA-Z0-9]{5,}['\"]"
    "apiKey.*=.*['\"][a-zA-Z0-9]{10,}['\"]"
    "secret.*=.*['\"][a-zA-Z0-9]{10,}['\"]"
)

found_hardcoded=false
for pattern in "${HARDCODED_PATTERNS[@]}"; do
    if git grep -iE "$pattern" -- '*.js' '*.jsx' '*.ts' '*.tsx' ':!*.example' ':!*.test.*' ':!apps-backup/' ':!node_modules/' 2>/dev/null | grep -v "your-.*-here" | grep -v "process.env" | grep -q .; then
        found_hardcoded=true
    fi
done

if [ "$found_hardcoded" = true ]; then
    report_warning "Potential hardcoded credentials found - manual review recommended"
else
    report_success "No obvious hardcoded credentials found"
fi

echo ""
echo -e "${BLUE}8. Git Configuration${NC}"
echo "────────────────────────────────────────"

# Check .gitignore
if grep -q "\.env\.local" .gitignore; then
    report_success ".env.local in .gitignore"
else
    report_issue ".env.local not in .gitignore"
fi

if grep -q "\.env$" .gitignore; then
    report_success ".env in .gitignore"
else
    report_warning ".env not in .gitignore"
fi

echo ""
echo -e "${BLUE}9. Admin Authentication${NC}"
echo "────────────────────────────────────────"

# Check for admin auth bypasses
if git grep -E "DEBUG_ADMIN.*process\.env" -- '*.js' '*.jsx' '*.ts' '*.tsx' ':!apps-backup/' ':!node_modules/' 2>/dev/null | grep -q .; then
    report_success "Admin debug mode uses environment variable"
fi

echo ""
echo -e "${BLUE}10. API Security${NC}"
echo "────────────────────────────────────────"

# Check for rate limiting
if git grep -rE "rateLimit|rate-limit" pages/api apps/*/pages/api 2>/dev/null | grep -q .; then
    report_success "Rate limiting code found"
else
    report_warning "No rate limiting implementation found in API routes"
fi

# Check for webhook signature verification
if git grep -rE "createHmac|verify.*signature" pages/api apps/*/pages/api 2>/dev/null | grep -q .; then
    report_success "Webhook signature verification found"
else
    report_warning "No webhook signature verification found"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                    Audit Summary${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

if [ $ISSUES_FOUND -eq 0 ] && [ $WARNINGS_FOUND -eq 0 ]; then
    echo -e "${GREEN}✓ Security audit passed with no issues!${NC}"
    exit 0
elif [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${YELLOW}⚠ Security audit completed with $WARNINGS_FOUND warnings${NC}"
    echo -e "${YELLOW}  Review warnings before production deployment${NC}"
    exit 0
else
    echo -e "${RED}✗ Security audit found $ISSUES_FOUND critical issues and $WARNINGS_FOUND warnings${NC}"
    echo -e "${RED}  Fix critical issues before production deployment!${NC}"
    exit 1
fi
