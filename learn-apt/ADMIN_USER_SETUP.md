# Admin User Setup Guide

## Overview
This guide explains how to grant and revoke admin access for users in the Learnapt application.

## Admin Access Requirements

Admin access is controlled by the `is_admin` flag in user metadata:
- Users with `user_metadata.is_admin === true` have full admin access
- All other users are denied access to admin routes
- Both server-side (middleware) and client-side checks enforce this

## Granting Admin Access

### Option 1: Using Supabase SQL Editor (Recommended)

1. Log into your Supabase Dashboard
2. Navigate to: SQL Editor
3. Run this query to grant admin access:

```sql
-- Grant admin access to a specific user by email
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email = 'user@example.com';
```

4. Verify the change:

```sql
-- Check user's metadata
SELECT email, raw_user_meta_data->'is_admin' as is_admin
FROM auth.users 
WHERE email = 'user@example.com';
```

### Option 2: Using Supabase JavaScript Client

```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Note: This requires the service role key (server-side only)
async function grantAdminAccess(userId) {
  const { data, error } = await supabase.auth.admin.updateUserById(
    userId,
    { 
      user_metadata: { is_admin: true }
    }
  )
  
  if (error) {
    console.error('Error granting admin access:', error)
    return false
  }
  
  console.log('Admin access granted to:', data.user.email)
  return true
}
```

### Option 3: During User Registration

When creating a new user, you can set the metadata directly:

```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'admin@example.com',
  password: 'secure-password',
  options: {
    data: {
      is_admin: true
    }
  }
})
```

## Revoking Admin Access

### Using Supabase SQL Editor

```sql
-- Remove admin access from a user
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data - 'is_admin'
WHERE email = 'user@example.com';
```

Or explicitly set it to false:

```sql
-- Set is_admin to false
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": false}'::jsonb
WHERE email = 'user@example.com';
```

## Bulk Operations

### Grant admin access to multiple users

```sql
-- Grant admin access to multiple users
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
WHERE email IN (
  'admin1@example.com',
  'admin2@example.com',
  'admin3@example.com'
);
```

### List all current admins

```sql
-- Find all users with admin access
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data->'is_admin' as is_admin
FROM auth.users 
WHERE raw_user_meta_data->>'is_admin' = 'true'
ORDER BY created_at DESC;
```

## Verification

After granting or revoking admin access:

1. **Check Database:**
   ```sql
   SELECT email, raw_user_meta_data 
   FROM auth.users 
   WHERE email = 'user@example.com';
   ```

2. **Test Login:**
   - Log out if currently logged in
   - Log in with the user account
   - Navigate to `/admin`
   - Verify access is granted/denied as expected

3. **Check Middleware Logs:**
   - Look for middleware logs in server console
   - Should see admin check being performed

## Security Best Practices

1. **Limit Admin Access:**
   - Only grant admin access to trusted users
   - Regularly audit who has admin access

2. **Use Strong Passwords:**
   - Admin accounts should use strong, unique passwords
   - Enable MFA if available

3. **Monitor Admin Activity:**
   - Keep logs of admin logins and actions
   - Review admin access regularly

4. **Service Role Key:**
   - NEVER expose the service role key in client-side code
   - Only use it in secure server-side environments
   - Store it in environment variables, not in code

5. **Regular Audits:**
   - Quarterly review of all admin users
   - Remove admin access from inactive accounts

## Troubleshooting

### User Can't Access Admin Despite Having is_admin Flag

1. **Check the flag value:**
   ```sql
   SELECT raw_user_meta_data FROM auth.users WHERE email = 'user@example.com';
   ```
   Make sure `is_admin` is exactly `true` (boolean), not `"true"` (string)

2. **Clear browser cache and cookies:**
   - Sometimes old session data can cause issues
   - Log out, clear cache, and log in again

3. **Check middleware logs:**
   - Look for errors in server console
   - Middleware should log when admin check fails

### User Still Has Admin Access After Revocation

1. **Verify the database change:**
   ```sql
   SELECT raw_user_meta_data FROM auth.users WHERE email = 'user@example.com';
   ```

2. **Force user to log out:**
   - The user needs to log out and back in for changes to take effect
   - Or revoke their session tokens:
   ```sql
   -- Force sign out by updating session (use with caution)
   DELETE FROM auth.sessions WHERE user_id = 'user-id-here';
   ```

3. **Clear server cache:**
   - Restart the application server if needed

## Environment-Specific Notes

### Development
- Use test admin accounts
- Can use simpler passwords for testing
- OK to have multiple admin accounts for testing

### Production
- Limit admin accounts to essential personnel only
- Use strong passwords and MFA
- Regularly audit admin access
- Keep detailed logs of admin actions

## Support

If you encounter issues with admin access control:
1. Check Supabase dashboard for user metadata
2. Check application logs for errors
3. Verify middleware is running correctly
4. Test with a fresh browser session (incognito mode)
