# Test Mode Rollback Instructions

## ⚠️ CRITICAL: READ BEFORE DISABLING TEST MODE

This document provides step-by-step instructions to safely rollback the test mode features and restore production-ready authentication.

## Overview

Test mode includes two major temporary features that **MUST NOT remain in production**:

1. **Password-First Admin Authentication** - Bypasses Supabase user authentication for admin access
2. **Universal Test Mode Bypass** - Disables all paywalls and authentication checks

## Pre-Rollback Checklist

Before beginning the rollback, ensure:

- [ ] All testing is complete and documented
- [ ] Test data has been backed up if needed
- [ ] Production admin users are properly configured in Supabase with `is_admin=true`
- [ ] You have database access to Supabase
- [ ] You have access to update environment variables
- [ ] You have communicated the maintenance window to stakeholders

## Rollback Steps

### Step 1: Disable Test Mode Flags

**Priority: HIGH - Do this first**

Update environment variables in all apps (main and subdomains):

```bash
# In .env.local for each app:
NEXT_PUBLIC_TEST_MODE=false
TEST_MODE=false
```

**Verify:**
- Restart all Next.js applications
- Visit any paid content page - should show paywall
- Test admin access - should redirect to login

### Step 2: Remove/Rotate Admin JWT Secret

**Priority: HIGH - Security Critical**

```bash
# In .env.local for each app:
# Either remove the line entirely or set to empty
ADMIN_JWT_SECRET=

# Or generate a new one and keep it unused:
# ADMIN_JWT_SECRET=$(openssl rand -base64 32)
```

**Why:** The JWT secret was used to sign admin tokens. Rotating it invalidates all existing admin_token cookies.

### Step 3: Rotate Supabase Service Role Key

**Priority: HIGH - Security Critical**

1. Go to Supabase Dashboard → Project Settings → API
2. Click "Reset Service Role Key"
3. Copy the new service role key
4. Update all environment files:

```bash
# In .env.local for each app:
SUPABASE_SERVICE_ROLE_KEY=your-new-service-role-key-here
```

5. Restart all applications

**Why:** The service role key was used in client-accessible code for test mode. It should be rotated as a security best practice.

### Step 4: Drop Admin Settings Table

**Priority: MEDIUM - Clean up**

Run this SQL in Supabase SQL Editor:

```sql
-- Drop the admin_settings table and related functions
DROP TABLE IF EXISTS public.admin_settings CASCADE;
DROP FUNCTION IF EXISTS public.handle_admin_settings_updated_at() CASCADE;
```

**Verify:**
```sql
-- This should return no results
SELECT * FROM information_schema.tables 
WHERE table_name = 'admin_settings';
```

**Why:** The admin_settings table stored the hashed admin password. It's no longer needed.

### Step 5: Restore Supabase-Based Admin Authentication

**Priority: HIGH - Restore proper auth**

1. Ensure admin users are configured in Supabase:

```sql
-- Verify admin users
SELECT u.email, p.is_admin, p.created_at
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE p.is_admin = true;
```

2. If needed, add admin users:

```sql
-- Make a user admin
UPDATE public.profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

3. Test admin login flow:
   - Go to `/admin`
   - Should redirect to `/admin/login` or `/login`
   - Login with Supabase credentials (email/password or Google OAuth)
   - Should be granted admin access if user has `is_admin=true`

### Step 6: Verify Code Restoration

**Priority: MEDIUM - Ensure clean codebase**

The following files contain test mode code that can remain in the codebase (they're inactive when flags are false):

- `apps/main/pages/api/admin/auth.js` - API will not be called when test mode is off
- `apps/main/pages/admin/universal.js` - Falls back to Supabase auth
- `apps/main/components/ProtectedRoute.js` - Falls back to Supabase auth
- `apps/main/components/PaidUserProtectedRoute.js` - Falls back to paywall checks

**Optional:** If you want to completely remove test mode code, revert these files to their pre-test-mode state using git.

### Step 7: Verify Application Security

**Priority: HIGH - Final verification**

Run through this security checklist:

- [ ] Visit `/admin/universal` - should require Supabase login
- [ ] Try accessing admin pages without login - should redirect
- [ ] Try accessing paid content without payment - should show paywall
- [ ] Check browser console - no test mode warnings
- [ ] Check server logs - no "TEST MODE" or "PUBLIC MODE" messages
- [ ] Verify HttpOnly cookies are cleared (admin_token should not exist)
- [ ] Test admin access with valid Supabase admin user - should work
- [ ] Test admin access with non-admin user - should deny

### Step 8: Update Documentation

**Priority: LOW - Housekeeping**

Update or add notices to:

- `README.md` - Remove test mode references
- `AUTHENTICATION_ARCHITECTURE.md` - Mark test mode as disabled
- `NAVIGATION_AUTH_GUIDE.md` - Update admin access instructions
- This file (`TEST_MODE_ROLLBACK.md`) - Add completion date

## Post-Rollback Verification

### Test Admin Access Flow

1. **Logout completely** from all sessions
2. **Clear browser cookies** for *.iiskills.cloud
3. **Visit** `/admin`
4. **Should redirect** to `/admin/login` or `/login`
5. **Login** with a Supabase account that has `is_admin=true`
6. **Should be** granted access to admin dashboard
7. **Try with** a regular user account
8. **Should be** denied access

### Test Paywall Protection

1. **Logout** from all sessions
2. **Visit** a page using `PaidUserProtectedRoute`
3. **Should see** access denied message
4. **Should see** login and payment options
5. **Login** with a paid user account
6. **Should have** access to content

## Common Issues After Rollback

### Issue: Admin can't login

**Cause:** User doesn't have `is_admin=true` in profiles table

**Fix:**
```sql
UPDATE public.profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

### Issue: Paywall still bypassed

**Cause:** Environment variables not updated or app not restarted

**Fix:**
1. Check `.env.local` has `NEXT_PUBLIC_TEST_MODE=false`
2. Restart the Next.js application
3. Clear browser cache and cookies

### Issue: "Failed to check password status" errors

**Cause:** App still trying to access admin_settings table

**Fix:**
- Ensure `NEXT_PUBLIC_TEST_MODE=false`
- Restart application
- If persists, check `apps/main/pages/admin/universal.js` - it should fall back gracefully

### Issue: Service role key errors

**Cause:** Service role key not updated after rotation

**Fix:**
1. Get new key from Supabase Dashboard
2. Update all `.env.local` files
3. Restart all applications

## Environment Variable Reference

After rollback, your `.env.local` should have:

```bash
# Standard Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Service role (if needed for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your-NEW-rotated-key

# Test mode flags - MUST be false
NEXT_PUBLIC_TEST_MODE=false
TEST_MODE=false

# Admin JWT secret - remove or leave unused
# ADMIN_JWT_SECRET=

# Other configuration...
NEXT_PUBLIC_SITE_URL=https://iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
```

## Security Best Practices

After rollback:

1. **Audit Logs:** Review server logs for any suspicious admin access during test period
2. **Session Cleanup:** Clear all user sessions and require re-login
3. **Code Review:** Review all code changes made during test period
4. **Monitoring:** Set up alerts for unauthorized admin access attempts
5. **Documentation:** Document what was tested and any findings

## Emergency Rollback

If you need to rollback immediately:

```bash
# Quick disable - run in all app directories
echo "NEXT_PUBLIC_TEST_MODE=false" >> .env.local
echo "TEST_MODE=false" >> .env.local

# Restart all apps
pm2 restart all
```

Then follow the complete rollback steps above.

## Completion Checklist

- [ ] Test mode flags disabled
- [ ] Admin JWT secret removed/rotated
- [ ] Service role key rotated
- [ ] Admin settings table dropped
- [ ] Admin Supabase auth verified working
- [ ] Paywall protection verified working
- [ ] Documentation updated
- [ ] Team notified of changes
- [ ] Security audit completed

## Questions or Issues?

If you encounter issues during rollback:

1. Check server logs for error messages
2. Review Supabase dashboard for auth/database issues
3. Verify environment variables in all apps
4. Test with a clean browser session (incognito mode)
5. Refer to `AUTHENTICATION_ARCHITECTURE.md` for normal auth flow

---

**Rollback Completed:** _____________________ (Date)

**Verified By:** _____________________ (Name)

**Notes:** _____________________
