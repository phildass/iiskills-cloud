# Multi-Domain Authentication Testing Guide

## Overview

This guide provides step-by-step instructions for testing the multi-domain authentication fix across all 18 iiskills.cloud apps.

## Prerequisites

1. ✅ Code changes deployed to testing/staging environment
2. ✅ Supabase redirect URLs configured (see MULTI_DOMAIN_AUTH_FIX.md)
3. ✅ All apps running on their respective domains
4. ✅ Browser with developer tools available

## Test Suite

### Test 1: Email/Password Authentication - Stay on Same Domain

**Objective**: Verify users stay on the subdomain they started on when using email/password auth.

**Steps:**
1. Navigate to `https://app1.learn-management.iiskills.cloud/login`
2. Enter valid credentials
3. Click "Sign in"
4. Verify success message appears
5. **VERIFY**: You remain on `app1.learn-management.iiskills.cloud` (NOT redirected to main domain)
6. Check browser URL bar confirms domain

**Expected Result**: ✅ User stays on `app1.learn-management.iiskills.cloud`

**Repeat for:**
- [ ] app1.learn-jee.iiskills.cloud
- [ ] app1.learn-neet.iiskills.cloud
- [ ] app1.learn-apt.iiskills.cloud
- [ ] At least 3 other subdomains

---

### Test 2: Magic Link Authentication - Return to Exact Page

**Objective**: Verify magic link emails return users to the exact page they were on.

**Steps:**
1. Navigate to `https://app1.learn-physics.iiskills.cloud/courses/module-1`
2. If protected, click through to login page (note the redirect parameter)
3. Choose "Send magic link" option
4. Enter email address
5. Click "Send magic link"
6. Check email inbox
7. **VERIFY**: Email contains link to `app1.learn-physics.iiskills.cloud/courses/module-1`
8. Click the magic link
9. **VERIFY**: You land on `app1.learn-physics.iiskills.cloud/courses/module-1` (exact page)

**Expected Result**: ✅ User returns to the exact page where they requested the magic link

**Repeat for:**
- [ ] Different page paths (/dashboard, /profile, /courses)
- [ ] Different subdomains
- [ ] From login page directly

---

### Test 3: Google OAuth - Preserve Domain Context

**Objective**: Verify OAuth flow maintains the originating subdomain.

**Steps:**
1. Navigate to `https://app1.learn-chemistry.iiskills.cloud/register`
2. Click "Sign up with Google"
3. Complete Google OAuth flow
4. **VERIFY**: After OAuth completes, you're on `app1.learn-chemistry.iiskills.cloud` (not main domain)
5. Check browser URL
6. Log out

**Repeat OAuth Login:**
1. Navigate to `https://app1.learn-ias.iiskills.cloud/login`
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. **VERIFY**: You land on `app1.learn-ias.iiskills.cloud` (stays on IAS subdomain)

**Expected Result**: ✅ OAuth redirects back to the originating subdomain

**Repeat for:**
- [ ] app1.learn-govt-jobs.iiskills.cloud
- [ ] app1.learn-data-science.iiskills.cloud
- [ ] Main domain (iiskills.cloud or app.iiskills.cloud)

---

### Test 4: Protected Content Redirect Preservation

**Objective**: Verify redirect parameters are preserved through auth flow.

**Steps:**
1. Log out completely
2. Try to access `https://app1.learn-math.iiskills.cloud/dashboard` (protected page)
3. **VERIFY**: Redirected to `/login?redirect=/dashboard`
4. Sign in with any method (email, magic link, or OAuth)
5. **VERIFY**: After successful auth, you land on `/dashboard` (not homepage)
6. **VERIFY**: Still on `app1.learn-math.iiskills.cloud` subdomain

**Expected Result**: ✅ User returns to the protected page they originally tried to access

**Repeat for:**
- [ ] Different protected pages
- [ ] Nested routes (e.g., /courses/module-1/lesson-2)
- [ ] Pages with query parameters

---

### Test 5: Cross-Domain Session Sharing (Should Still Work)

**Objective**: Verify sessions are still shared across all subdomains.

**Steps:**
1. Sign in on `https://app1.learn-jee.iiskills.cloud/login`
2. Open new tab and navigate to `https://app1.learn-neet.iiskills.cloud`
3. **VERIFY**: Already authenticated (no login required)
4. Open another tab to `https://app.iiskills.cloud` (main domain)
5. **VERIFY**: Already authenticated on main domain too
6. Log out from `app1.learn-neet.iiskills.cloud`
7. Refresh `app1.learn-jee.iiskills.cloud` tab
8. **VERIFY**: Logged out there too (session cleared everywhere)

**Expected Result**: ✅ Sessions shared across all *.iiskills.cloud domains

---

### Test 6: New Subdomain Without Configuration

**Objective**: Verify auth works on any subdomain without per-app configuration.

**Steps:**
1. Deploy any app to a new test subdomain (e.g., `test.iiskills.cloud`)
2. Ensure the app uses the standard supabaseClient.js
3. Navigate to the login page on the new subdomain
4. Sign in with any method
5. **VERIFY**: Auth works without needing to update NEXT_PUBLIC_SITE_URL
6. **VERIFY**: Redirect returns to the new subdomain (not main domain)

**Expected Result**: ✅ Auth automatically works on any new subdomain

---

### Test 7: Server-Side Fallback (No Window)

**Objective**: Verify fallback works during SSR when window is undefined.

**Steps:**
1. In browser DevTools, view Network tab
2. Clear cache and hard reload `https://app1.learn-leadership.iiskills.cloud/login`
3. Initiate OAuth or magic link flow
4. **VERIFY**: Auth still works (falls back to env var on server)
5. **VERIFY**: User still stays on leadership subdomain after auth

**Expected Result**: ✅ Server-side fallback works correctly

---

### Test 8: Development Environment (localhost)

**Objective**: Verify auth works in local development.

**Steps:**
1. Run app locally on `http://localhost:3000`
2. Try all auth methods (email, magic link, OAuth)
3. **VERIFY**: All methods work correctly
4. **VERIFY**: Redirects work (even though no subdomain)
5. Check browser console for any errors

**Expected Result**: ✅ Auth works in development environment

---

### Test 9: Mobile Device Testing

**Objective**: Verify auth works on mobile browsers.

**Steps:**
1. Open `https://app1.learn-cricket.iiskills.cloud/login` on mobile device
2. Sign in with Google OAuth
3. **VERIFY**: OAuth flow works on mobile
4. **VERIFY**: Returns to Cricket subdomain
5. Test magic link on mobile
6. **VERIFY**: Magic link email opens app on correct subdomain

**Expected Result**: ✅ Auth works consistently on mobile

---

### Test 10: Edge Cases

**Objective**: Test unusual scenarios and edge cases.

**Test 10a: No redirect parameter**
1. Go directly to `/login` (no redirect query param)
2. Sign in
3. **VERIFY**: Redirects to default page (/ or /dashboard)
4. **VERIFY**: Stays on current subdomain

**Test 10b: Invalid redirect parameter**
1. Navigate to `/login?redirect=https://external-site.com/malicious`
2. Sign in
3. **VERIFY**: Does NOT redirect to external site (security check)
4. **VERIFY**: Redirects to safe default page

**Test 10c: Deep-linked registration**
1. Use registration link: `/register?redirect=/premium-course`
2. Complete registration
3. Confirm email
4. Sign in
5. **VERIFY**: Eventually lands on `/premium-course`

**Expected Result**: ✅ Edge cases handled gracefully

---

## Test Results Template

Use this template to record test results:

```markdown
## Test Results - [Date]

### Environment
- Testing URL: _______
- Browser: _______
- Device: _______
- Tester: _______

### Test Results

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Email/Password - Same Domain | ☐ Pass ☐ Fail | |
| 2 | Magic Link - Exact Page | ☐ Pass ☐ Fail | |
| 3 | Google OAuth - Preserve Domain | ☐ Pass ☐ Fail | |
| 4 | Protected Content Redirect | ☐ Pass ☐ Fail | |
| 5 | Cross-Domain Session Sharing | ☐ Pass ☐ Fail | |
| 6 | New Subdomain No Config | ☐ Pass ☐ Fail | |
| 7 | Server-Side Fallback | ☐ Pass ☐ Fail | |
| 8 | Development localhost | ☐ Pass ☐ Fail | |
| 9 | Mobile Device | ☐ Pass ☐ Fail | |
| 10 | Edge Cases | ☐ Pass ☐ Fail | |

### Issues Found
1. _______
2. _______

### Overall Result
☐ All tests passed - Ready for production
☐ Some tests failed - Requires fixes
☐ Blocked - Cannot complete testing
```

---

## Troubleshooting

### Issue: OAuth redirects to wrong domain

**Possible Causes:**
- Supabase redirect URLs not configured
- Browser cache issues

**Solution:**
1. Verify redirect URLs in Supabase dashboard include wildcard `https://*.iiskills.cloud/*`
2. Clear browser cache and cookies
3. Test in incognito mode

---

### Issue: Magic link returns to homepage instead of specific page

**Possible Causes:**
- Redirect parameter not preserved
- Email template caching

**Solution:**
1. Check browser console for redirect URL being generated
2. Verify email link contains correct path
3. Clear email client cache

---

### Issue: Session not shared across domains

**Possible Causes:**
- Cookie domain not set correctly
- Browser blocking third-party cookies
- HTTPS not enabled in production

**Solution:**
1. Verify cookie domain is `.iiskills.cloud` (with leading dot)
2. Check browser settings allow cookies
3. Ensure production uses HTTPS

---

### Issue: Works on some subdomains but not others

**Possible Causes:**
- Inconsistent code deployment
- Different supabaseClient.js versions

**Solution:**
1. Verify all apps use updated supabaseClient.js
2. Check deployment logs for errors
3. Compare working vs non-working app configurations

---

## Automated Testing (Optional)

For automated E2E testing, consider using:

### Playwright Test Example

```javascript
// tests/multi-domain-auth.spec.js
import { test, expect } from '@playwright/test';

test('should stay on subdomain after login', async ({ page }) => {
  // Navigate to subdomain login
  await page.goto('https://app1.learn-management.iiskills.cloud/login');
  
  // Fill in credentials
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  
  // Click login
  await page.click('button[type="submit"]');
  
  // Wait for navigation
  await page.waitForNavigation();
  
  // Verify still on same subdomain
  expect(page.url()).toContain('app1.learn-management.iiskills.cloud');
  
  // Verify NOT on main domain
  expect(page.url()).not.toContain('iiskills.cloud/');
});
```

---

## Sign-off Checklist

Before considering testing complete:

- [ ] All 10 core tests passed
- [ ] Tested on at least 5 different subdomains
- [ ] Tested all 3 auth methods (email, magic link, OAuth)
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari)
- [ ] Tested on mobile device
- [ ] No console errors observed
- [ ] No security warnings
- [ ] Cross-domain session sharing still works
- [ ] Documentation reviewed and accurate
- [ ] Stakeholders notified of test results

---

## Next Steps After Testing

1. **If all tests pass:**
   - Deploy to production
   - Monitor error logs for 24 hours
   - Gather user feedback

2. **If tests fail:**
   - Document failures in GitHub issue
   - Review code changes
   - Apply fixes
   - Re-run failed tests

3. **Post-deployment:**
   - Monitor authentication metrics
   - Track redirect success rates
   - User experience feedback collection

---

**Last Updated:** January 2026  
**Prepared by:** Development Team  
**Version:** 1.0
