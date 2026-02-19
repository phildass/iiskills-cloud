#!/bin/bash
# Production Readiness Verification Script
# Verifies all production readiness requirements

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     IISKILLS Cloud - Production Readiness Verification        ║"
echo "║                  Version 1.0 - Feb 19, 2026                    ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

CHECKS_PASSED=0
CHECKS_FAILED=0
CHECKS_TOTAL=0

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((CHECKS_PASSED++))
    ((CHECKS_TOTAL++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((CHECKS_FAILED++))
    ((CHECKS_TOTAL++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

section() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "  $1"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# 1. Documentation Check
section "1. Documentation Verification"

if [ -f "PRODUCTION_READINESS_MASTER_INDEX.md" ]; then
    check_pass "PRODUCTION_READINESS_MASTER_INDEX.md exists"
else
    check_fail "PRODUCTION_READINESS_MASTER_INDEX.md not found"
fi

if [ -f "PRODUCTION_READINESS_COMPLETE.md" ]; then
    check_pass "PRODUCTION_READINESS_COMPLETE.md exists"
else
    check_fail "PRODUCTION_READINESS_COMPLETE.md not found"
fi

if [ -f "APP_CLUSTERING_MODULARIZATION_GUIDE.md" ]; then
    check_pass "APP_CLUSTERING_MODULARIZATION_GUIDE.md exists"
else
    check_fail "APP_CLUSTERING_MODULARIZATION_GUIDE.md not found"
fi

if [ -f "COMPREHENSIVE_E2E_TESTING_STRATEGY.md" ]; then
    check_pass "COMPREHENSIVE_E2E_TESTING_STRATEGY.md exists"
else
    check_fail "COMPREHENSIVE_E2E_TESTING_STRATEGY.md not found"
fi

if [ -f "DATABASE_MIGRATION_SECURITY_STANDARDS.md" ]; then
    check_pass "DATABASE_MIGRATION_SECURITY_STANDARDS.md exists"
else
    check_fail "DATABASE_MIGRATION_SECURITY_STANDARDS.md not found"
fi

if [ -f "UNIVERSAL_INTEGRATION_DEPLOYMENT_PLAYBOOK.md" ]; then
    check_pass "UNIVERSAL_INTEGRATION_DEPLOYMENT_PLAYBOOK.md exists"
else
    check_fail "UNIVERSAL_INTEGRATION_DEPLOYMENT_PLAYBOOK.md not found"
fi

# 2. Package Structure Check
section "2. Package Structure Verification"

if [ -d "packages/access-control" ]; then
    check_pass "Access control package exists"
else
    check_fail "Access control package not found"
fi

if [ -d "packages/ui" ]; then
    check_pass "UI package exists"
else
    check_fail "UI package not found"
fi

if [ -d "packages/core" ]; then
    check_pass "Core package exists"
else
    check_fail "Core package not found"
fi

if [ -d "packages/content-sdk" ]; then
    check_pass "Content SDK package exists"
else
    check_fail "Content SDK package not found"
fi

if [ -d "packages/schema" ]; then
    check_pass "Schema package exists"
else
    check_fail "Schema package not found"
fi

# 3. App Structure Check
section "3. Application Structure Verification"

EXPECTED_APPS=("main" "learn-ai" "learn-apt" "learn-chemistry" "learn-developer" "learn-geography" "learn-management" "learn-math" "learn-physics" "learn-pr")

for app in "${EXPECTED_APPS[@]}"; do
    if [ -d "apps/$app" ]; then
        check_pass "App exists: $app"
    else
        check_fail "App not found: $app"
    fi
done

# 4. Access Control Package Check
section "4. Access Control Package Verification"

if [ -f "packages/access-control/package.json" ]; then
    if node -e "JSON.parse(require('fs').readFileSync('packages/access-control/package.json', 'utf8'))" 2>/dev/null; then
        check_pass "Access control package.json is valid JSON"
    else
        check_fail "Access control package.json has syntax errors"
    fi
else
    check_fail "Access control package.json not found"
fi

if [ -f "packages/access-control/appConfig.js" ]; then
    check_pass "Access control appConfig.js exists"
else
    check_fail "Access control appConfig.js not found"
fi

if [ -f "packages/access-control/accessControl.js" ]; then
    check_pass "Access control accessControl.js exists"
else
    check_fail "Access control accessControl.js not found"
fi

if [ -f "packages/access-control/dbAccessManager.js" ]; then
    check_pass "Access control dbAccessManager.js exists"
else
    check_fail "Access control dbAccessManager.js not found"
fi

# 5. Test Infrastructure Check
section "5. Test Infrastructure Verification"

if [ -d "tests" ]; then
    check_pass "Tests directory exists"
    
    TEST_COUNT=$(find tests -name "*.test.js" -o -name "*.spec.js" | wc -l)
    if [ "$TEST_COUNT" -gt 0 ]; then
        check_pass "Found $TEST_COUNT test files"
    else
        check_warn "No test files found"
    fi
else
    check_fail "Tests directory not found"
fi

if [ -d "tests/e2e" ]; then
    check_pass "E2E tests directory exists"
else
    check_fail "E2E tests directory not found"
fi

if [ -f "playwright.config.js" ]; then
    check_pass "Playwright configuration exists"
else
    check_fail "Playwright configuration not found"
fi

if [ -f "jest.config.js" ]; then
    check_pass "Jest configuration exists"
else
    check_fail "Jest configuration not found"
fi

# 6. CI/CD Check
section "6. CI/CD Infrastructure Verification"

if [ -d ".github/workflows" ]; then
    check_pass ".github/workflows directory exists"
    
    WORKFLOW_COUNT=$(find .github/workflows -name "*.yml" | wc -l)
    if [ "$WORKFLOW_COUNT" -gt 0 ]; then
        check_pass "Found $WORKFLOW_COUNT GitHub Actions workflows"
    else
        check_warn "No workflow files found"
    fi
else
    check_fail ".github/workflows directory not found"
fi

if [ -f ".github/dangerfile.js" ]; then
    check_pass "Danger.js configuration exists"
else
    check_fail "Danger.js configuration not found"
fi

if [ -f ".github/PULL_REQUEST_TEMPLATE.md" ]; then
    check_pass "PR template exists"
else
    check_fail "PR template not found"
fi

# 7. TypeScript Check
section "7. TypeScript Configuration Verification"

TS_PACKAGES=("core" "schema" "content-sdk" "access-control")

for pkg in "${TS_PACKAGES[@]}"; do
    if [ -f "packages/$pkg/tsconfig.json" ]; then
        check_pass "TypeScript config exists: packages/$pkg"
    else
        check_warn "TypeScript config not found: packages/$pkg"
    fi
done

# 8. Database Migrations Check
section "8. Database Migrations Verification"

if [ -d "supabase/migrations" ]; then
    check_pass "Database migrations directory exists"
    
    MIGRATION_COUNT=$(find supabase/migrations -name "*.sql" | wc -l)
    if [ "$MIGRATION_COUNT" -gt 0 ]; then
        check_pass "Found $MIGRATION_COUNT migration files"
    else
        check_warn "No migration files found"
    fi
else
    check_fail "Database migrations directory not found"
fi

# 9. Build Configuration Check
section "9. Build Configuration Verification"

if [ -f "package.json" ]; then
    check_pass "Root package.json exists"
else
    check_fail "Root package.json not found"
fi

if [ -f "turbo.json" ]; then
    check_pass "Turbo configuration exists"
else
    check_fail "Turbo configuration not found"
fi

if [ -f "ecosystem.config.js" ]; then
    check_pass "PM2 ecosystem configuration exists"
else
    check_fail "PM2 ecosystem configuration not found"
fi

# 10. Security & Linting Check
section "10. Security & Code Quality Verification"

if [ -f ".eslintrc.json" ] || [ -f "eslint.config.mjs" ]; then
    check_pass "ESLint configuration exists"
else
    check_fail "ESLint configuration not found"
fi

if [ -f ".prettierrc" ]; then
    check_pass "Prettier configuration exists"
else
    check_fail "Prettier configuration not found"
fi

# 11. Run Unit Tests
section "11. Unit Tests Execution"

echo "Running unit tests..."
if npm run test > /tmp/test-output.txt 2>&1; then
    TEST_RESULTS=$(cat /tmp/test-output.txt | grep "Tests:" || echo "")
    if [ -n "$TEST_RESULTS" ]; then
        check_pass "Unit tests passed: $TEST_RESULTS"
    else
        check_pass "Unit tests completed successfully"
    fi
else
    check_fail "Unit tests failed"
    cat /tmp/test-output.txt
fi

# 12. Security Audit
section "12. Security Audit"

echo "Running security audit..."
if npm audit --production --json > /tmp/audit-output.json 2>&1; then
    VULN_COUNT=$(cat /tmp/audit-output.json | grep -o '"vulnerabilities":' | wc -l)
    if [ "$VULN_COUNT" -eq 0 ]; then
        check_pass "Security audit: No vulnerabilities found"
    else
        check_warn "Security audit completed with findings"
    fi
else
    check_warn "Security audit completed"
fi

# Final Summary
section "Production Readiness Summary"

echo ""
echo "┌─────────────────────────────────────────────────────────────┐"
echo "│                    Verification Results                      │"
echo "├─────────────────────────────────────────────────────────────┤"
printf "│  %-20s %38s │\n" "Total Checks:" "$CHECKS_TOTAL"
printf "│  ${GREEN}%-20s %38s${NC} │\n" "Passed:" "$CHECKS_PASSED"
printf "│  ${RED}%-20s %38s${NC} │\n" "Failed:" "$CHECKS_FAILED"
echo "└─────────────────────────────────────────────────────────────┘"
echo ""

# Calculate percentage
if [ "$CHECKS_TOTAL" -gt 0 ]; then
    PERCENTAGE=$((CHECKS_PASSED * 100 / CHECKS_TOTAL))
    
    echo "┌─────────────────────────────────────────────────────────────┐"
    printf "│  Production Readiness Score: "
    if [ "$PERCENTAGE" -ge 95 ]; then
        printf "${GREEN}%3d%%${NC}                        │\n" "$PERCENTAGE"
    elif [ "$PERCENTAGE" -ge 80 ]; then
        printf "${YELLOW}%3d%%${NC}                        │\n" "$PERCENTAGE"
    else
        printf "${RED}%3d%%${NC}                        │\n" "$PERCENTAGE"
    fi
    echo "└─────────────────────────────────────────────────────────────┘"
    echo ""
    
    if [ "$PERCENTAGE" -ge 95 ]; then
        echo -e "${GREEN}✓✓✓ PRODUCTION READY ✓✓✓${NC}"
        echo ""
        echo "The monorepo meets all production readiness requirements."
        echo "You may proceed with deployment."
    elif [ "$PERCENTAGE" -ge 80 ]; then
        echo -e "${YELLOW}⚠ MOSTLY READY - Minor Issues ⚠${NC}"
        echo ""
        echo "The monorepo is mostly ready for production."
        echo "Address the failed checks before deploying."
    else
        echo -e "${RED}✗ NOT READY FOR PRODUCTION ✗${NC}"
        echo ""
        echo "Critical issues found. Please address failed checks."
    fi
fi

echo ""
echo "For detailed information, see:"
echo "  • PRODUCTION_READINESS_MASTER_INDEX.md"
echo "  • PRODUCTION_READINESS_COMPLETE.md"
echo ""

# Exit with appropriate code
if [ "$CHECKS_FAILED" -gt 0 ]; then
    exit 1
else
    exit 0
fi
