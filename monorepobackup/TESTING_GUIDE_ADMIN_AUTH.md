# Test Mode Admin Authentication - Testing Guide

## Overview

This guide provides instructions for testing the password-first admin authentication and test mode features implemented for the iiskills-cloud platform.

## Prerequisites

Before testing, ensure you have:

1. ✅ Node.js and npm installed
2. ✅ Access to a Supabase project
3. ✅ Environment variables configured
4. ✅ Admin settings table created in Supabase

## Quick Start

### 1. Environment Setup

Create `.env.local` in `apps/main/` directory:

```bash
# Required for test mode
NEXT_PUBLIC_TEST_MODE=true
TEST_MODE=true

# Admin authentication
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase

# Standard Supabase config
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Get your credentials:**
- Go to [Supabase Dashboard](https://supabase.com/dashboard)
- Select your project → Settings → API
- Copy the Project URL and anon/public key
- Copy the service_role key (⚠️ keep this secret!)

### 2. Database Setup

Run the SQL migration in Supabase SQL Editor:

```sql
-- Create admin_settings table
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only service role can access admin_settings" 
  ON public.admin_settings
  USING (false);
```

Or use the migration file:
```bash
# File location: supabase/migrations/admin_settings_table.sql
# Apply it in Supabase SQL Editor
```

### 3. Install Dependencies

```bash
cd apps/main
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

The server should start on `http://localhost:3000`

## Test Scenarios

### Scenario 1: First-Time Admin Password Setup

**Test Steps:**

1. Open browser and navigate to: `http://localhost:3000/admin/universal`

2. You should see the "Setup Admin Access" screen with:
   - Test mode warning banner (yellow)
   - Password input field
   - Confirm password field
   - "Set Password & Continue" button

3. Enter a password (minimum 8 characters):
   - Example: `TestAdmin123!`
   - Confirm the same password

4. Click "Set Password & Continue"

5. **Expected Result:**
   - Password is accepted
   - You are redirected to the admin dashboard
   - Test mode banner appears at the top
   - Logout button is visible

**Verification:**
```bash
# Check Supabase admin_settings table
SELECT key, created_at FROM admin_settings;
# Should show: admin_password_hash | [timestamp]
```

### Scenario 2: Admin Login (After Setup)

**Test Steps:**

1. From the admin dashboard, click "Logout"

2. Navigate back to: `http://localhost:3000/admin/universal`

3. You should see the "Admin Login" screen (not setup)

4. Enter the password you set previously

5. Click "Login"

6. **Expected Result:**
   - Login successful
   - Redirected to admin dashboard
   - Session persists across page reloads

**Verification:**
```bash
# Check browser cookies
# Should have: admin_token (HttpOnly, secure flags)
```

### Scenario 3: Wrong Password Rejection

**Test Steps:**

1. Logout from admin dashboard

2. Navigate to: `http://localhost:3000/admin/universal`

3. Enter an incorrect password

4. Click "Login"

5. **Expected Result:**
   - Error message: "Invalid password"
   - Not logged in
   - Can try again

### Scenario 4: Token Verification

**Test Steps:**

1. Login to admin dashboard

2. Open browser Developer Tools → Application → Cookies

3. Find the `admin_token` cookie

4. Verify the following flags:
   - ✅ HttpOnly: true
   - ✅ Secure: true (in production)
   - ✅ SameSite: Lax
   - ✅ Path: /

5. Copy the token value

6. Open a new incognito window

7. Try to manually add the cookie and access `/admin/universal`

8. **Expected Result:**
   - With valid token: Access granted
   - With modified/invalid token: Access denied

### Scenario 5: Test Mode Paywall Bypass

**Test Steps:**

1. Ensure `NEXT_PUBLIC_TEST_MODE=true` in `.env.local`

2. Navigate to a page using `PaidUserProtectedRoute`

3. **Expected Result:**
   - Content is visible without payment
   - No "Access Restricted" message
   - Test mode indicators visible

4. Set `NEXT_PUBLIC_TEST_MODE=false` and restart server

5. Navigate to the same page

6. **Expected Result:**
   - "Access Restricted" message shown
   - Payment/login options displayed

### Scenario 6: Admin Token Expiry

**Test Steps:**

1. Login to admin dashboard

2. Wait 24 hours (or modify TOKEN_EXPIRY in code to 1 minute for testing)

3. Try to access admin pages

4. **Expected Result:**
   - Token expired
   - Redirected to login
   - Must login again

### Scenario 7: Logout Functionality

**Test Steps:**

1. Login to admin dashboard

2. Click the "Logout" button (top right or in test mode banner)

3. **Expected Result:**
   - admin_token cookie is cleared
   - Redirected to login screen
   - Cannot access admin pages without re-logging in

## Unit Tests

Run the automated unit tests:

```bash
cd apps/main
node pages/api/admin/__tests__/auth.manual.test.js
```

**Expected Output:**
```
=== Admin Authentication API Tests ===

Test 1: Password Hashing with bcrypt
✓ Password hashed successfully
✓ PASS

Test 2: JWT Token Generation and Verification
✓ JWT token generated
✓ PASS

... (all tests should pass)

=== Tests Complete ===
```

## Integration Testing

### Using curl

**Check if password is set:**
```bash
curl -X GET http://localhost:3000/api/admin/auth?action=check
# Expected: {"hasPassword":false} or {"hasPassword":true}
```

**Setup password:**
```bash
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"setup","password":"TestPassword123!"}'
# Expected: {"success":true,"message":"Admin password set successfully","token":"..."}
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"action":"login","password":"TestPassword123!"}'
# Expected: {"success":true,"message":"Login successful","token":"..."}
```

**Verify token:**
```bash
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_token=YOUR_TOKEN_HERE" \
  -d '{"action":"verify"}'
# Expected: {"ok":true}
```

**Logout:**
```bash
curl -X POST http://localhost:3000/api/admin/auth \
  -H "Content-Type: application/json" \
  -H "Cookie: admin_token=YOUR_TOKEN_HERE" \
  -d '{"action":"logout"}'
# Expected: {"success":true,"message":"Logged out successfully"}
```

## Troubleshooting

### Issue: "Missing Supabase configuration"

**Solution:**
- Check `.env.local` file exists in `apps/main/`
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Ensure no placeholder values (like `your-project-url-here`)
- Restart the dev server

### Issue: "Failed to check password status"

**Solution:**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`
- Check admin_settings table exists in Supabase
- Run the SQL migration if not already done
- Check server logs for detailed error

### Issue: "Invalid password" even with correct password

**Solution:**
- Ensure you're using the same password used during setup
- Check if admin_settings table has the password hash
- Try setting up the password again
- Clear browser cookies and try again

### Issue: Test mode not activating

**Solution:**
- Verify `NEXT_PUBLIC_TEST_MODE=true` (exact string, case-sensitive)
- Restart the development server
- Clear browser cache
- Check console for test mode messages

### Issue: Admin token not persisting

**Solution:**
- Check browser cookies are enabled
- Verify cookie domain settings
- For localhost, ensure `NEXT_PUBLIC_COOKIE_DOMAIN` is empty or undefined
- Check HttpOnly flag is set correctly

## Security Checklist

After testing, verify:

- [ ] Passwords are hashed (never stored plain text)
- [ ] JWT tokens have expiry set
- [ ] HttpOnly cookies are used
- [ ] Service role key is server-side only
- [ ] Test mode warnings are visible
- [ ] All environment variables are in `.env.local` (not committed to git)
- [ ] `.env.local` is in `.gitignore`

## Performance Testing

Test password hashing performance:

```bash
# Time how long password hashing takes
time node -e "
const bcrypt = require('bcrypt');
(async () => {
  const hash = await bcrypt.hash('TestPassword', 12);
  console.log('Hash generated');
})();
"
```

**Expected:** 100-300ms (acceptable for login operations)

## Cleanup After Testing

When testing is complete, follow `TEST_MODE_ROLLBACK.md` to:

1. Disable test mode flags
2. Remove/rotate admin JWT secret
3. Rotate Supabase service role key
4. Drop admin_settings table
5. Configure proper Supabase admin users

## Support

If you encounter issues:

1. Check server logs: `npm run dev` output
2. Check browser console for errors
3. Review Supabase logs in dashboard
4. Refer to `TEST_MODE_ROLLBACK.md` for rollback
5. Refer to `AUTHENTICATION_ARCHITECTURE.md` for architecture details

## Summary

✅ Test password setup flow
✅ Test login/logout
✅ Test token verification
✅ Test paywall bypass
✅ Run unit tests
✅ Verify security features
✅ Document findings
✅ Follow rollback guide when complete

---

**Testing Completed:** _____________________ (Date)

**Tested By:** _____________________ (Name)

**Issues Found:** _____________________

**Status:** [ ] PASS [ ] FAIL [ ] NEEDS REVIEW
