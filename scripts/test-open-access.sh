#!/bin/bash

# Test script for temporary open access functionality
# Verifies that guest mode and auth bypass work correctly

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 TESTING TEMPORARY OPEN ACCESS FUNCTIONALITY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

passed=0
failed=0
warnings=0

# Test 1: Check if activation script exists and is executable
echo "Test 1: Checking activation script..."
if [ -x "scripts/enable-open-access.sh" ]; then
    echo -e "${GREEN}✓${NC} Activation script exists and is executable"
    ((passed++))
else
    echo -e "${RED}✗${NC} Activation script not found or not executable"
    ((failed++))
fi

# Test 2: Check if restoration script exists and is executable
echo "Test 2: Checking restoration script..."
if [ -x "scripts/restore-authentication.sh" ]; then
    echo -e "${GREEN}✓${NC} Restoration script exists and is executable"
    ((passed++))
else
    echo -e "${RED}✗${NC} Restoration script not found or not executable"
    ((failed++))
fi

# Test 3: Check if documentation exists
echo "Test 3: Checking documentation..."
if [ -f "TEMPORARY_OPEN_ACCESS.md" ]; then
    echo -e "${GREEN}✓${NC} Documentation file exists"
    ((passed++))
else
    echo -e "${RED}✗${NC} Documentation file not found"
    ((failed++))
fi

# Test 4: Verify PaidUserProtectedRoute has Continue as Guest button
echo "Test 4: Checking for 'Continue as Guest' button in root component..."
if grep -q "Continue as Guest" components/PaidUserProtectedRoute.js; then
    echo -e "${GREEN}✓${NC} 'Continue as Guest' button found in root component"
    ((passed++))
else
    echo -e "${RED}✗${NC} 'Continue as Guest' button not found in root component"
    ((failed++))
fi

# Test 5: Verify apps/main PaidUserProtectedRoute has Explore Without Signup button
echo "Test 5: Checking for 'Explore Without Signup' button in main app..."
if grep -q "Explore Without Signup" apps/main/components/PaidUserProtectedRoute.js; then
    echo -e "${GREEN}✓${NC} 'Explore Without Signup' button found in main app"
    ((passed++))
else
    echo -e "${RED}✗${NC} 'Explore Without Signup' button not found in main app"
    ((failed++))
fi

# Test 6: Verify guest mode parameter check exists
echo "Test 6: Checking for guest mode URL parameter handling..."
if grep -q "guest.*===.*true" components/PaidUserProtectedRoute.js; then
    echo -e "${GREEN}✓${NC} Guest mode URL parameter handling found"
    ((passed++))
else
    echo -e "${RED}✗${NC} Guest mode URL parameter handling not found"
    ((failed++))
fi

# Test 7: Verify UserProtectedRoute has guest mode support
echo "Test 7: Checking for guest mode in UserProtectedRoute..."
if grep -q "guest.*===.*true" components/UserProtectedRoute.js; then
    echo -e "${GREEN}✓${NC} Guest mode support found in UserProtectedRoute"
    ((passed++))
else
    echo -e "${RED}✗${NC} Guest mode support not found in UserProtectedRoute"
    ((failed++))
fi

# Test 8: Verify ProtectedRoute has guest mode support
echo "Test 8: Checking for guest mode in ProtectedRoute..."
if grep -q "guest.*===.*true" components/ProtectedRoute.js; then
    echo -e "${GREEN}✓${NC} Guest mode support found in ProtectedRoute"
    ((passed++))
else
    echo -e "${RED}✗${NC} Guest mode support not found in ProtectedRoute"
    ((failed++))
fi

# Test 9: Check Newsletter page for current content
echo "Test 9: Checking Newsletter page updates..."
if grep -q "February 6, 2026" apps/main/pages/newsletter.js; then
    echo -e "${GREEN}✓${NC} Newsletter has current date stamp"
    ((passed++))
else
    echo -e "${YELLOW}⚠${NC} Newsletter date stamp not current"
    ((warnings++))
fi

# Test 10: Verify Newsletter mentions 11 apps
echo "Test 10: Checking Newsletter mentions 11 apps..."
if grep -q "11.*app" apps/main/pages/newsletter.js; then
    echo -e "${GREEN}✓${NC} Newsletter mentions 11 apps"
    ((passed++))
else
    echo -e "${YELLOW}⚠${NC} Newsletter doesn't mention 11 apps"
    ((warnings++))
fi

# Test 11: Check .env.local.example has open access instructions
echo "Test 11: Checking environment variable documentation..."
if grep -q "enable-open-access.sh" .env.local.example; then
    echo -e "${GREEN}✓${NC} .env.local.example has activation script reference"
    ((passed++))
else
    echo -e "${YELLOW}⚠${NC} .env.local.example missing activation script reference"
    ((warnings++))
fi

# Test 12: Verify disableAuth.js feature flag exists
echo "Test 12: Checking feature flag module..."
if [ -f "lib/feature-flags/disableAuth.js" ]; then
    echo -e "${GREEN}✓${NC} Feature flag module exists"
    ((passed++))
else
    echo -e "${RED}✗${NC} Feature flag module not found"
    ((failed++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 TEST RESULTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}✓ Passed:${NC}   $passed tests"
echo -e "${RED}✗ Failed:${NC}   $failed tests"
echo -e "${YELLOW}⚠ Warnings:${NC} $warnings tests"
echo ""

if [ $failed -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ ALL CORE TESTS PASSED${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Test activation: ./scripts/enable-open-access.sh"
    echo "2. Manual testing: Navigate to protected routes"
    echo "3. Verify guest mode: Click 'Continue as Guest' buttons"
    echo "4. Restore auth: ./scripts/restore-authentication.sh"
    echo ""
    if [ $warnings -gt 0 ]; then
        echo -e "${YELLOW}⚠ Note: $warnings warning(s) detected. Review above for details.${NC}"
    fi
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ TESTS FAILED${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Please review the failed tests above and fix the issues."
    echo ""
    exit 1
fi
