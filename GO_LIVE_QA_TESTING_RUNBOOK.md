# GO-LIVE QA & Testing Runbook

**Date**: February 19, 2026  
**Document Version**: 1.0  
**Audience**: QA Team, Testers, Product Team  
**Status**: ✅ **PRODUCTION READY**

---

## Executive Summary

This runbook provides comprehensive testing procedures for validating the iiskills-cloud platform before and after production GO-LIVE. It defines what "PASS" means for each test category and provides step-by-step test scenarios.

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Pre-Production Testing](#2-pre-production-testing)
3. [Production Smoke Tests](#3-production-smoke-tests)
4. [Regression Testing](#4-regression-testing)
5. [Performance Testing](#5-performance-testing)
6. [Security Testing](#6-security-testing)
7. [User Acceptance Criteria](#7-user-acceptance-criteria)
8. [Test Data Management](#8-test-data-management)
9. [Bug Reporting](#9-bug-reporting)
10. [Sign-Off Criteria](#10-sign-off-criteria)

---

## 1. Testing Philosophy

### 1.1 What "PASS" Means for GO-LIVE

**Production GO-LIVE requires**:

✅ **Critical Tests**: 100% pass rate required
- Authentication flows
- Payment processing
- Bundle logic
- Database access
- Core navigation

✅ **High Priority Tests**: 95%+ pass rate required
- All app functionality
- Admin features
- Cross-browser basics
- Performance benchmarks

✅ **Medium Priority**: 90%+ pass rate acceptable
- Edge cases
- Advanced features
- Minor UI issues

✅ **Low Priority**: Can be deferred post-launch
- Cosmetic issues
- Nice-to-have features
- Performance optimizations

### 1.2 Test Environment Requirements

**Testing Environments**:

1. **Staging** (Pre-GO-LIVE):
   - Mirror of production
   - Test payment mode
   - Separate database
   - All tests must pass here first

2. **Production** (Post-GO-LIVE):
   - Live environment
   - Real payments (careful!)
   - Smoke tests only
   - Limited test data

**Test Accounts**:
- Staging: test1@example.com through test10@example.com
- Production: Use real test accounts, carefully

---

## 2. Pre-Production Testing

### 2.1 Pre-GO-LIVE Test Suite

**Execution Time**: 2-3 hours  
**When to Run**: 24-48 hours before GO-LIVE  
**Pass Criteria**: 100% of critical tests, 95% overall

### 2.2 Authentication Test Suite (Critical)

**Test 1: User Registration**

```
SCENARIO: New user signs up
STEPS:
1. Navigate to iiskills.cloud
2. Click "Sign Up"
3. Enter email: test_new_user@example.com
4. Enter password: Test@123456
5. Click "Create Account"

EXPECTED RESULT:
✅ User account created
✅ Welcome email sent (check inbox)
✅ User automatically logged in
✅ Redirected to dashboard
✅ Profile created in database

PASS CRITERIA:
- Account creation successful
- Email received within 2 minutes
- User can access dashboard
```

**Test 2: User Login**

```
SCENARIO: Existing user logs in
STEPS:
1. Navigate to iiskills.cloud
2. Click "Sign In"
3. Enter email: test1@example.com
4. Enter password: Test@1234
5. Click "Sign In"

EXPECTED RESULT:
✅ Login successful
✅ Session created
✅ Redirected to dashboard
✅ User data loaded

PASS CRITERIA:
- Login completes within 3 seconds
- No errors in console
- Dashboard shows user's data
```

**Test 3: Cross-Subdomain SSO**

```
SCENARIO: User authenticated across all apps
STEPS:
1. Log in at iiskills.cloud
2. Navigate to learn-math.iiskills.cloud
3. Navigate to learn-ai.iiskills.cloud
4. Navigate to 3 more apps

EXPECTED RESULT:
✅ Auto-authenticated on all apps
✅ No re-login required
✅ Session persists
✅ User data available on all apps

PASS CRITERIA:
- No login prompts on any app
- User sees personalized content
- Session cookie shared properly
```

### 2.3 Payment Processing Test Suite (Critical)

**Test 4: Free App Access**

```
SCENARIO: User accesses free app without payment
STEPS:
1. Log in as any user
2. Navigate to learn-math.iiskills.cloud
3. Click on a lesson
4. View content

EXPECTED RESULT:
✅ No paywall shown
✅ Content accessible immediately
✅ Full functionality available
✅ No payment prompt

PASS CRITERIA:
- Content loads within 2 seconds
- All features work
- No payment-related UI
```

**Test 5: Paid App Without Access**

```
SCENARIO: User tries to access paid app without purchase
STEPS:
1. Log in with account that hasn't purchased
2. Navigate to learn-ai.iiskills.cloud
3. Attempt to access content

EXPECTED RESULT:
✅ Paywall displayed
✅ Clear pricing shown (₹999)
✅ "Purchase" button visible
✅ Content blocked

PASS CRITERIA:
- Paywall clear and professional
- Pricing accurate
- Cannot bypass paywall
```

**Test 6: Individual App Purchase**

```
SCENARIO: User purchases single paid app
STEPS:
1. Log in as test user
2. Navigate to learn-management.iiskills.cloud
3. Click "Purchase" (₹999)
4. Complete Razorpay TEST payment
5. Verify access granted

EXPECTED RESULT:
✅ Razorpay checkout opens
✅ Test payment succeeds
✅ Webhook processes payment
✅ Access granted immediately
✅ Payment record created
✅ Can access content

PASS CRITERIA:
- Payment completes in <30 seconds
- Access granted within 5 seconds of payment
- No errors in logs
- Database records correct
```

**Test 7: Bundle Purchase (AI-Developer)**

```
SCENARIO: Purchase learn-ai, get learn-developer free
STEPS:
1. Log in with fresh test account
2. Navigate to learn-ai.iiskills.cloud
3. Purchase learn-ai (₹999)
4. Complete test payment
5. Navigate to learn-developer.iiskills.cloud

EXPECTED RESULT:
✅ Payment for learn-ai successful
✅ Access to learn-ai granted
✅ Access to learn-developer automatically granted
✅ Both apps show "Access Granted"
✅ Payment record shows bundle info
✅ Can access content in both apps

PASS CRITERIA:
- Both apps unlocked with one payment
- Database shows correct granted_via values
- Bundle logic works both directions
  (also test: buy learn-developer, get learn-ai)
```

### 2.4 Admin Panel Test Suite (Critical)

**Test 8: Admin Login**

```
SCENARIO: Admin accesses admin panel
STEPS:
1. Navigate to admin login
2. Enter admin credentials
3. Access admin dashboard

EXPECTED RESULT:
✅ Admin login successful
✅ Admin dashboard accessible
✅ Regular users cannot access
✅ Admin features visible

PASS CRITERIA:
- Admin authentication works
- Authorization checked correctly
- Non-admins redirected
```

**Test 9: Grant Access**

```
SCENARIO: Admin grants app access to user
STEPS:
1. Log in as admin
2. Navigate to access management
3. Select user (test2@example.com)
4. Select app (learn-pr)
5. Grant access
6. Log in as test2@example.com
7. Navigate to learn-pr

EXPECTED RESULT:
✅ Admin successfully grants access
✅ Database record created
✅ User can immediately access app
✅ No payment required

PASS CRITERIA:
- Access granted within 5 seconds
- User sees full content
- Database audit trail created
```

**Test 10: Revoke Access**

```
SCENARIO: Admin revokes app access
STEPS:
1. Log in as admin
2. Find user with access
3. Revoke access to specific app
4. Log in as that user
5. Try to access app

EXPECTED RESULT:
✅ Admin successfully revokes access
✅ Database record deleted
✅ User blocked from content
✅ Paywall shown again

PASS CRITERIA:
- Access revoked immediately
- User cannot access content
- Handled gracefully
```

### 2.5 PWA Install Test Suite (High Priority)

**Test 11: Chrome/Android Install**

```
SCENARIO: User installs PWA on Android
STEPS:
1. Open site in Chrome on Android
2. Wait for install prompt
3. Click "Install"
4. Accept browser prompt

EXPECTED RESULT:
✅ Install prompt appears
✅ App installs to home screen
✅ App opens standalone
✅ Full functionality works

PASS CRITERIA:
- Install prompt shown within 10 seconds
- Installation successful
- App works offline (if configured)
```

**Test 12: iOS/Safari Install**

```
SCENARIO: User installs PWA on iOS
STEPS:
1. Open site in Safari on iOS
2. Check for install instructions
3. Tap Share button
4. Tap "Add to Home Screen"

EXPECTED RESULT:
✅ Instructions clear for iOS
✅ Manual install works
✅ App icon on home screen
✅ Opens in standalone mode

PASS CRITERIA:
- iOS instructions visible
- Icon displays correctly
- Standalone mode works
```

---

## 3. Production Smoke Tests

### 3.1 Post-Deployment Smoke Tests

**Execution Time**: 15 minutes  
**When to Run**: Immediately after production deployment  
**Pass Criteria**: 100% pass required

**Smoke Test 1: Main Portal Health**

```bash
# Quick command-line check
curl -I https://iiskills.cloud
# Expected: HTTP/2 200

# Manual verification:
1. Open https://iiskills.cloud
2. Verify page loads < 3 seconds
3. Verify no console errors
4. Verify SSL certificate valid
```

**Smoke Test 2: All Apps Accessible**

```bash
# Test each app
curl -I https://learn-apt.iiskills.cloud  # Should be 200
curl -I https://learn-math.iiskills.cloud  # Should be 200
curl -I https://learn-ai.iiskills.cloud  # Should be 200
# ... test all 10 apps
```

**Smoke Test 3: Authentication Works**

```
1. Sign in with test account
2. Verify login successful
3. Navigate to learn-math
4. Verify auto-authenticated
5. Log out
6. Verify logged out on all apps
```

**Smoke Test 4: Database Connection**

```
1. Any authenticated action (loads user data)
2. Check that data loads correctly
3. No "cannot connect" errors
4. Dashboard shows user information
```

**Smoke Test 5: Payment System Up**

```
⚠️ CAREFUL: Production has real payments!

1. Navigate to paid app without access
2. Verify paywall shows
3. Verify "Purchase" button appears
4. DO NOT complete actual payment (unless using test account)
5. If you must test: use test card in test mode if available
```

**Smoke Test 6: Admin Access**

```
1. Log in with admin credentials
2. Verify admin dashboard accessible
3. Check basic admin functions load
4. Log out
```

### 3.2 Smoke Test Pass Criteria

**PASS means**:
- ✅ All 6 smoke tests complete without errors
- ✅ All apps load within 3 seconds
- ✅ No server errors (5xx)
- ✅ No JavaScript console errors
- ✅ SSL certificates valid
- ✅ Authentication works
- ✅ Database connectivity confirmed

**If ANY smoke test fails**:
- 🚨 Incident! See GO_LIVE_INCIDENT_RESPONSE_PLAYBOOK.md
- Consider rollback if critical failure

---

## 4. Regression Testing

### 4.1 Full Regression Test Suite

**When to Run**: Before major releases, after significant changes  
**Execution Time**: 4-6 hours  
**Pass Criteria**: 95%+ pass rate

**Core Functionality Tests** (30 tests):
- Authentication (5 tests)
- Authorization (5 tests)
- Payment processing (8 tests)
- Bundle logic (3 tests)
- Admin functions (5 tests)
- Content access (4 tests)

**Navigation Tests** (10 tests):
- Cross-app navigation
- Deep linking
- Back button behavior
- Browser history

**Edge Case Tests** (15 tests):
- Network errors
- Expired sessions
- Concurrent actions
- Maximum data scenarios

**Cross-Browser Tests** (12 tests):
- Chrome, Firefox, Safari, Edge (desktop)
- Chrome, Safari (mobile)
- Multiple screen sizes

**Performance Tests** (8 tests):
- Page load times
- API response times
- Resource usage
- Concurrent users

### 4.2 Regression Test Execution

**Recommended Tools**:
- Playwright for E2E automation
- Manual testing for complex flows
- Performance monitoring tools

**Documentation**:
See [COMPREHENSIVE_E2E_TESTING_STRATEGY.md](COMPREHENSIVE_E2E_TESTING_STRATEGY.md) for complete test scenarios.

---

## 5. Performance Testing

### 5.1 Performance Benchmarks

**Page Load Times** (REQUIRED PASS):

| Page Type | Target | Maximum | Test |
|-----------|--------|---------|------|
| Landing page | <1.5s | <2.5s | Load iiskills.cloud |
| App dashboard | <1.0s | <2.0s | Load learn-math homepage |
| Lesson page | <1.5s | <2.5s | Load specific lesson |
| Admin panel | <1.5s | <3.0s | Load admin dashboard |

**API Response Times** (REQUIRED PASS):

| API Call | Target | Maximum | Test |
|----------|--------|---------|------|
| Authentication | <200ms | <500ms | Login API call |
| Access check | <150ms | <300ms | Check user access |
| Payment create | <300ms | <800ms | Create payment order |
| Payment confirm | <250ms | <600ms | Process webhook |

**Load Testing** (RECOMMENDED):

| Metric | Target | Test |
|--------|--------|------|
| Concurrent users | 100 | No degradation |
| Concurrent users | 500 | <20% degradation |
| Response time under load | <3s | p95 latency |

### 5.2 Performance Test Execution

**Tools**:
- Chrome DevTools (Network tab)
- Lighthouse for audits
- Apache Bench or Artillery for load testing

**Example Commands**:

```bash
# Test page load time
curl -w "@curl-format.txt" -o /dev/null -s https://iiskills.cloud

# Simple load test
ab -n 1000 -c 100 https://iiskills.cloud/

# Lighthouse audit
lighthouse https://iiskills.cloud --view
```

---

## 6. Security Testing

### 6.1 Security Test Checklist

**Authentication Security** (CRITICAL):

- [ ] Cannot access protected content without login
- [ ] Cannot access paid content without payment
- [ ] Cannot access admin without admin role
- [ ] Sessions expire correctly
- [ ] Logout works on all apps
- [ ] Cannot bypass authentication with direct URLs

**Authorization Security** (CRITICAL):

- [ ] Free apps accessible to all
- [ ] Paid apps blocked without payment
- [ ] Bundle logic cannot be exploited
- [ ] Admin features only for admins
- [ ] API endpoints protected

**Payment Security** (CRITICAL):

- [ ] No card data stored locally
- [ ] Payment amount cannot be tampered
- [ ] Webhook signature verified
- [ ] No duplicate payments
- [ ] Refunds properly handled

**Data Security** (HIGH PRIORITY):

- [ ] User data not visible to other users
- [ ] Database queries parameterized
- [ ] No SQL injection possible
- [ ] XSS protection working
- [ ] CSRF protection working

### 6.2 Security Test Execution

**Manual Security Tests**:

1. **Attempt to bypass paywall**:
   - Try to access paid content directly
   - Manipulate URLs
   - Check browser console
   - Expected: All attempts blocked

2. **Attempt to access admin without authorization**:
   - Try admin URLs as regular user
   - Expected: Redirected or blocked

3. **Check for exposed secrets**:
   - View page source
   - Check JavaScript files
   - Expected: No API keys or secrets visible

4. **Session security**:
   - Check cookie flags (Secure, HttpOnly)
   - Test session expiration
   - Expected: Cookies properly secured

---

## 7. User Acceptance Criteria

### 7.1 User Journey Validation

**Journey 1: New User Onboarding**

```
SCENARIO: Brand new user discovers platform
STEPS:
1. User lands on iiskills.cloud
2. Understands value proposition within 10 seconds
3. Clicks "Sign Up"
4. Completes registration in <60 seconds
5. Sees clear next steps

PASS CRITERIA:
✅ Landing page clear and compelling
✅ Registration simple and fast
✅ User knows what to do next
✅ Can explore free content immediately
```

**Journey 2: Free Content User**

```
SCENARIO: User wants free learning content
STEPS:
1. User logs in
2. Navigates to learn-math or similar
3. Browses lessons
4. Accesses content
5. Learns successfully

PASS CRITERIA:
✅ No payment required
✅ Full content access
✅ Clear navigation
✅ Good learning experience
```

**Journey 3: Paid Content Purchase**

```
SCENARIO: User decides to purchase paid app
STEPS:
1. User discovers paid app (learn-ai)
2. Sees value proposition
3. Clicks purchase
4. Completes payment (₹999)
5. Immediately accesses content

PASS CRITERIA:
✅ Clear pricing and value
✅ Payment smooth and secure
✅ Instant access after payment
✅ No confusion or errors
```

**Journey 4: Bundle Discovery**

```
SCENARIO: User discovers bundle benefit
STEPS:
1. User purchases learn-ai
2. Discovers they also have learn-developer
3. Understands bundle benefit
4. Accesses both apps

PASS CRITERIA:
✅ Bundle clearly communicated
✅ User delighted by extra value
✅ Both apps work perfectly
```

### 7.2 User Experience Standards

**PASS means users can**:
- ✅ Accomplish goals without frustration
- ✅ Understand interface without training
- ✅ Complete actions in reasonable time
- ✅ Recover from errors easily
- ✅ Feel confident about security

---

## 8. Test Data Management

### 8.1 Test Accounts

**Staging Test Accounts**:

| Email | Password | Purpose |
|-------|----------|---------|
| test1@example.com | Test@1234 | General testing |
| test2@example.com | Test@1234 | Access control testing |
| test_paid@example.com | Test@1234 | User with all paid apps |
| test_free@example.com | Test@1234 | User with no paid apps |
| test_bundle@example.com | Test@1234 | User with bundle access |
| admin@example.com | Admin@1234 | Admin testing |

**Production Test Accounts**:
- Use real email addresses you control
- Label clearly as "TEST"
- Use only for smoke tests
- DO NOT use for extensive testing

### 8.2 Test Payment Cards (Razorpay TEST mode)

**Success Scenarios**:
- Card: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits

**Failure Scenarios**:
- Card: 4000 0000 0000 0002
- Result: Payment fails

**⚠️ NEVER use real payment cards in testing!**

---

## 9. Bug Reporting

### 9.1 Bug Severity Classification

| Severity | Definition | Response | Examples |
|----------|------------|----------|----------|
| **P0 - Blocker** | Prevents GO-LIVE | Immediate | Site down, security issue, data loss |
| **P1 - Critical** | Major feature broken | Same day | Payment broken, auth broken |
| **P2 - High** | Important feature affected | 2-3 days | UI bug, performance issue |
| **P3 - Medium** | Minor issue | 1 week | Cosmetic issue, edge case |
| **P4 - Low** | Enhancement | Backlog | Nice-to-have features |

### 9.2 Bug Report Template

```markdown
**Bug ID**: BUG-[YYYYMMDD-###]
**Severity**: [P0/P1/P2/P3/P4]
**Status**: Open

**Summary**: [One-line description]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happens]

**Environment**:
- Browser: [Chrome 120, Firefox 121, etc.]
- OS: [Windows 11, macOS 14, etc.]
- Environment: [Staging, Production]

**Screenshots/Videos**:
[Attach if relevant]

**Console Errors**:
```
[Paste any console errors]
```

**Additional Context**:
[Any other relevant information]
```

### 9.3 Bug Triage Process

**Daily Bug Review** (during testing phase):
1. Review all new bugs
2. Verify and reproduce
3. Assign severity
4. Assign to engineer
5. Track until resolved

**GO-LIVE Blockers**:
- Any P0 bug blocks GO-LIVE
- P1 bugs evaluated case-by-case
- P2+ bugs can be deferred

---

## 10. Sign-Off Criteria

### 10.1 GO-LIVE Approval Checklist

**QA Sign-Off requires**:

**Critical Tests (Must be 100%)**:
- [ ] All authentication tests pass
- [ ] All payment tests pass
- [ ] Bundle logic tests pass
- [ ] Admin function tests pass
- [ ] Security tests pass
- [ ] Smoke tests pass

**High Priority Tests (Must be 95%+)**:
- [ ] All app functionality tests
- [ ] Cross-browser tests (major browsers)
- [ ] Performance benchmarks met
- [ ] Navigation tests pass

**Medium Priority Tests (Must be 90%+)**:
- [ ] Edge case tests
- [ ] Advanced features
- [ ] Cross-browser (minor browsers)

**Documentation**:
- [ ] All test results documented
- [ ] Bug list reviewed
- [ ] Known issues documented
- [ ] Test summary report created

**No Blockers**:
- [ ] Zero P0 bugs
- [ ] All P1 bugs resolved or approved for deferral
- [ ] P2+ bugs documented for post-launch

### 10.2 Sign-Off Document

```
QA SIGN-OFF FOR PRODUCTION GO-LIVE
===================================

Project: iiskills-cloud
Version: [Version number]
Date: [Date]
QA Lead: [Name]

TEST RESULTS:
- Critical Tests: [X/X] (100%)
- High Priority Tests: [X/X] (95%+)
- Medium Priority Tests: [X/X] (90%+)
- Overall Pass Rate: [X%]

BUGS:
- P0 Blocker: 0
- P1 Critical: [X] (all resolved or approved)
- P2 High: [X] (documented)
- P3+ Medium/Low: [X] (documented)

PERFORMANCE:
- Page Load Times: ✅ Within targets
- API Response Times: ✅ Within targets
- Load Testing: ✅ Passed

SECURITY:
- Authentication: ✅ Secure
- Authorization: ✅ Proper
- Payment Security: ✅ Verified
- Data Protection: ✅ Implemented

RECOMMENDATION:
[ ] ✅ APPROVED FOR GO-LIVE
[ ] ❌ NOT APPROVED - Blockers exist

Comments:
[Any additional notes]

QA Lead Signature: _______________ Date: ________
Technical Lead Signature: _________ Date: ________
Product Lead Signature: ___________ Date: ________
```

---

## Appendices

### Appendix A: Quick Test Commands

```bash
# Quick smoke test script
./smoke-test.sh

# Run full E2E tests
npm run test:e2e

# Run unit tests
npm run test

# Performance test
lighthouse https://iiskills.cloud --view

# Security scan
npm audit --production
```

### Appendix B: Test Environment URLs

**Staging**:
- Main: https://staging.iiskills.cloud
- Apps: https://staging-learn-[app].iiskills.cloud

**Production**:
- Main: https://iiskills.cloud
- Apps: https://learn-[app].iiskills.cloud

### Appendix C: Related Documentation

- [COMPREHENSIVE_E2E_TESTING_STRATEGY.md](COMPREHENSIVE_E2E_TESTING_STRATEGY.md)
- [GO_LIVE_STAGING_TEST_SUMMARY.md](GO_LIVE_STAGING_TEST_SUMMARY.md)
- [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

**Document Status**: ✅ FINAL - PRODUCTION READY  
**Distribution**: QA, Product, Engineering  
**Next Review**: After GO-LIVE or major releases

---

**END OF QA & TESTING RUNBOOK**
