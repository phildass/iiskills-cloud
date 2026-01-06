# Admin Access Control Test Plan

## Overview
This document provides a comprehensive test plan to verify that the admin access control security fixes are working correctly.

## Prerequisites
- Supabase project configured with environment variables
- At least two test user accounts:
  1. One regular user (non-admin)
  2. One admin user with `user_metadata.is_admin = true`

## Setup Test Users

### Create Non-Admin User
1. Sign up a new user through the application or Supabase dashboard
2. Verify the user does NOT have `is_admin` in their user_metadata

### Create Admin User
1. Sign up a new user through the application or Supabase dashboard
2. Update user metadata in Supabase SQL Editor:
   ```sql
   UPDATE auth.users 
   SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
   WHERE email = 'your-admin@email.com';
   ```
3. Verify the change:
   ```sql
   SELECT email, raw_user_meta_data 
   FROM auth.users 
   WHERE email = 'your-admin@email.com';
   ```

## Test Cases

### Test 1: Unauthenticated User Access
**Objective:** Verify that unauthenticated users cannot access admin pages

**Steps:**
1. Open browser in incognito/private mode
2. Navigate to `http://localhost:3000/admin`
3. **Expected:** Login page is displayed
4. Try to navigate to `http://localhost:3000/admin/some-subroute`
5. **Expected:** Redirect to `/admin` login page

**Result:** ✅ Pass / ❌ Fail

---

### Test 2: Non-Admin User Login Attempt
**Objective:** Verify that authenticated non-admin users are denied access

**Steps:**
1. Navigate to `http://localhost:3000/admin`
2. Login with non-admin user credentials
3. **Expected:** "Access Denied" message is displayed
4. **Expected:** Message states "You do not have administrator privileges"
5. **Expected:** User email is displayed
6. **Expected:** Options to "Sign Out" or "Return to Home" are available

**Result:** ✅ Pass / ❌ Fail

---

### Test 3: Non-Admin User Direct Route Access
**Objective:** Verify middleware blocks non-admin users at server level

**Steps:**
1. Login as non-admin user (from Test 2)
2. Attempt to navigate directly to any admin route in URL bar
3. Try routes like:
   - `http://localhost:3000/admin`
   - `http://localhost:3000/admin/assessments`
4. **Expected:** Immediately redirected to home page
5. **Expected:** Error banner appears: "You do not have administrator privileges"

**Result:** ✅ Pass / ❌ Fail

---

### Test 4: Admin User Successful Access
**Objective:** Verify that admin users can access all admin features

**Steps:**
1. Navigate to `http://localhost:3000/admin`
2. Login with admin user credentials (user with `is_admin: true`)
3. **Expected:** Admin dashboard is displayed
4. **Expected:** Can see header with "Learnapt Admin" branding
5. **Expected:** User email is displayed in header
6. **Expected:** Dashboard shows stats cards
7. **Expected:** Can navigate between tabs:
   - Dashboard
   - Assessments
   - Site Navigation
8. Navigate to each tab and verify content loads
9. Try clicking "Site Navigation" tab links

**Result:** ✅ Pass / ❌ Fail

---

### Test 5: Admin Session Persistence
**Objective:** Verify admin session works across page refreshes

**Steps:**
1. Login as admin user (from Test 4)
2. Refresh the page (F5 or Cmd+R)
3. **Expected:** Still logged in and see admin dashboard
4. Navigate to home page `/`
5. Navigate back to `/admin`
6. **Expected:** Still logged in and see admin dashboard

**Result:** ✅ Pass / ❌ Fail

---

### Test 6: Admin Logout Clears Session
**Objective:** Verify logout completely clears admin session

**Steps:**
1. Login as admin user
2. Verify you can see the admin dashboard
3. Click "Logout" button in header
4. **Expected:** Redirected to login page
5. **Expected:** No admin content visible
6. Try navigating to `/admin` directly
7. **Expected:** Login page is shown
8. Try using browser back button
9. **Expected:** Cannot access admin pages without logging in again
10. Check browser localStorage/sessionStorage
11. **Expected:** No admin auth tokens present

**Result:** ✅ Pass / ❌ Fail

---

### Test 7: Mixed Session Test
**Objective:** Verify switching between admin and non-admin accounts works correctly

**Steps:**
1. Login as admin user
2. Verify admin dashboard access
3. Logout
4. Login as non-admin user
5. **Expected:** "Access Denied" message
6. Logout
7. Login as admin user again
8. **Expected:** Admin dashboard access restored

**Result:** ✅ Pass / ❌ Fail

---

### Test 8: Server-Side Protection (Middleware)
**Objective:** Verify middleware blocks access at server level

**Steps:**
1. Login as non-admin user
2. Open browser DevTools (F12)
3. Go to Network tab
4. Navigate to `/admin`
5. **Expected:** See 307 redirect response from server
6. **Expected:** Redirected to home page with `?error=unauthorized`
7. Check that redirect happens before page content loads

**Result:** ✅ Pass / ❌ Fail

---

### Test 9: Client-Side Protection (Layout/Page)
**Objective:** Verify client-side components also check admin status

**Steps:**
1. Login as non-admin user
2. Use browser DevTools to inspect React components
3. **Expected:** Admin layout checks `isAdmin` flag
4. **Expected:** Admin page shows "Access Denied" UI
5. **Expected:** No admin content is rendered in DOM

**Result:** ✅ Pass / ❌ Fail

---

### Test 10: Error Message Display
**Objective:** Verify unauthorized users see helpful error messages

**Steps:**
1. Login as non-admin user
2. Try to access `/admin`
3. **Expected:** Redirected to home page
4. **Expected:** Red error banner at top of page
5. **Expected:** Banner shows "Access Denied" title
6. **Expected:** Banner explains admin privileges required
7. Click X button to dismiss banner
8. **Expected:** Banner disappears

**Result:** ✅ Pass / ❌ Fail

---

## Security Verification Checklist

- [ ] No console errors when accessing admin pages
- [ ] No admin data visible in network responses for non-admin users
- [ ] No admin routes accessible via direct URL for non-admin users
- [ ] No client-side bypasses possible (e.g., modifying localStorage)
- [ ] Middleware enforces checks before any admin page loads
- [ ] Admin session clears completely on logout
- [ ] No persistent admin access after logout
- [ ] Clear error messages for unauthorized access attempts

## Code-Level Verification

- [ ] Middleware checks `user.user_metadata.is_admin === true`
- [ ] AuthContext.isAdmin uses `user.user_metadata?.is_admin === true`
- [ ] Admin layout checks both `isAuthenticated` AND `isAdmin`
- [ ] Admin page shows access denied for non-admin authenticated users
- [ ] Logout clears: user state, isAuthenticated, cookies, sessionStorage
- [ ] All admin routes in middleware matcher: `/admin`, `/admin/:path*`

## Test Results Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| Test 1: Unauthenticated Access | ⬜ | |
| Test 2: Non-Admin Login | ⬜ | |
| Test 3: Non-Admin Direct Route | ⬜ | |
| Test 4: Admin Successful Access | ⬜ | |
| Test 5: Admin Session Persistence | ⬜ | |
| Test 6: Admin Logout | ⬜ | |
| Test 7: Mixed Sessions | ⬜ | |
| Test 8: Server-Side Protection | ⬜ | |
| Test 9: Client-Side Protection | ⬜ | |
| Test 10: Error Messages | ⬜ | |

## Sign-off

**Tester Name:** _____________________

**Date:** _____________________

**Overall Result:** ✅ All Tests Passed / ⚠️ Some Issues Found / ❌ Critical Failures

**Additional Notes:**
