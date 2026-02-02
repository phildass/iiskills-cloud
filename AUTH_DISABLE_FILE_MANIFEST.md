# Auth Disable Feature - File Manifest

This document lists all files modified or created as part of the global authentication disable feature (PR: feature/disable-auth-temporary).

## Files Created (New)

### Core Infrastructure
1. `lib/feature-flags/disableAuth.js` - Centralized feature flag module
2. `docs/DISABLE_AUTH_README.md` - Complete documentation and usage guide
3. `scripts/set-disable-auth.sh` - Helper script to set environment variables
4. `scripts/test-disable-auth.sh` - Test script to verify feature is working
5. `AUTH_DISABLE_FILE_MANIFEST.md` - This file

## Files Modified (with .bak.20260202_072142 backups)

### Root/Shared Files
1. `lib/supabaseClient.js` - Modified `getCurrentUser()` to return mock user when auth disabled
   - Backup: `lib/supabaseClient.js.bak.20260202_072142`

### Protected Route Components  
2. `components/ProtectedRoute.js` - Admin route protection bypass
   - Backup: `components/ProtectedRoute.js.bak.20260202_072142`
   
3. `components/PaidUserProtectedRoute.js` - Paywall/paid content bypass
   - Backup: `components/PaidUserProtectedRoute.js.bak.20260202_072142`
   
4. `components/UserProtectedRoute.js` - User authentication bypass
   - Backup: `components/UserProtectedRoute.js.bak.20260202_072142`

### Main App
5. `apps/main/lib/supabaseClient.js` - Main app auth bypass
   - Backup: `apps/main/lib/supabaseClient.js.bak.20260202_072142`

### Learn Apps (13 total)
6. `apps/learn-ai/lib/supabaseClient.js`
   - Backup: `apps/learn-ai/lib/supabaseClient.js.bak.20260202_072142`
   
7. `apps/learn-apt/lib/supabaseClient.js`
   - Backup: `apps/learn-apt/lib/supabaseClient.js.bak.20260202_072142`
   
8. `apps/learn-chemistry/lib/supabaseClient.js`
   - Backup: `apps/learn-chemistry/lib/supabaseClient.js.bak.20260202_072142`
   
9. `apps/learn-companion/lib/supabaseClient.js`
   - Backup: `apps/learn-companion/lib/supabaseClient.js.bak.20260202_072142`
   
10. `apps/learn-cricket/lib/supabaseClient.js`
    - Backup: `apps/learn-cricket/lib/supabaseClient.js.bak.20260202_072142`
    
11. `apps/learn-geography/lib/supabaseClient.js`
    - Backup: `apps/learn-geography/lib/supabaseClient.js.bak.20260202_072142`
    
12. `apps/learn-govt-jobs/lib/supabaseClient.js`
    - Backup: `apps/learn-govt-jobs/lib/supabaseClient.js.bak.20260202_072142`
    
13. `apps/learn-leadership/lib/supabaseClient.js`
    - Backup: `apps/learn-leadership/lib/supabaseClient.js.bak.20260202_072142`
    
14. `apps/learn-management/lib/supabaseClient.js`
    - Backup: `apps/learn-management/lib/supabaseClient.js.bak.20260202_072142`
    
15. `apps/learn-math/lib/supabaseClient.js`
    - Backup: `apps/learn-math/lib/supabaseClient.js.bak.20260202_072142`
    
16. `apps/learn-physics/lib/supabaseClient.js`
    - Backup: `apps/learn-physics/lib/supabaseClient.js.bak.20260202_072142`
    
17. `apps/learn-pr/lib/supabaseClient.js`
    - Backup: `apps/learn-pr/lib/supabaseClient.js.bak.20260202_072142`
    
18. `apps/learn-winning/lib/supabaseClient.js`
    - Backup: `apps/learn-winning/lib/supabaseClient.js.bak.20260202_072142`

## Summary Statistics

- **Total files created:** 5
- **Total files modified:** 18
- **Total backup files:** 18
- **Apps covered:** Main + 13 learn-* apps = 14 apps total

## What Gets Bypassed

When `DISABLE_AUTH=true` and `NEXT_PUBLIC_DISABLE_AUTH=true`:

### Client-Side
- `getCurrentUser()` returns mock user with admin & paid status
- `ProtectedRoute` allows access without login
- `PaidUserProtectedRoute` allows access without payment
- `UserProtectedRoute` allows access without auth
- All protected pages become publicly accessible

### Mock User Object
```javascript
{
  id: 'dev-override' (or 'dev-override-{appname}'),
  email: 'dev@iiskills.cloud',
  role: 'bypass',
  user_metadata: {
    firstName: 'Dev',
    lastName: 'Override',
    full_name: 'Dev Override',
    is_admin: true,
    payment_status: 'paid'
  },
  app_metadata: {
    payment_status: 'paid',
    is_admin: true
  }
}
```

## Locations Where Auth Enforcement Was Found & Patched

### Client-Side Auth Checks
1. **Root lib/supabaseClient.js**
   - Function: `getCurrentUser()`
   - Location: Line 294
   - Type: Returns null or user session
   - Patch: Returns mock user when flag enabled

2. **Main app lib/supabaseClient.js**
   - Function: `getCurrentUser()`
   - Location: Line 276  
   - Type: Returns null or user session
   - Patch: Returns mock user when flag enabled

3. **All 13 learn-* apps lib/supabaseClient.js**
   - Function: `getCurrentUser()`
   - Type: Returns null or user session (with isSuspended check for most)
   - Patch: Returns mock user when flag enabled (before isSuspended check)

### Protected Route Components
4. **components/ProtectedRoute.js**
   - Function: `checkAuth()`
   - Location: Line 25
   - Type: Redirects to /login if no user or not admin
   - Patch: Sets isAuthenticated=true when flag enabled

5. **components/PaidUserProtectedRoute.js**
   - Function: `checkAccess()`
   - Location: Line 46
   - Type: Shows registration wall if no user
   - Patch: Sets mock user when flag enabled

6. **components/UserProtectedRoute.js**
   - Function: `checkAuth()`
   - Location: Line 38
   - Type: Redirects to /register if no user
   - Patch: Sets isAuthenticated=true when flag enabled

### Admin Pages (use ProtectedRoute or getCurrentUser)
- `pages/admin/index.js` - Uses getCurrentUser() (already patched)
- `apps/main/pages/admin/index.js` - Uses ProtectedRoute (already patched)
- `apps/learn-*/pages/admin/index.js` - Use getCurrentUser() (already patched)

### API Routes
- Most API routes don't enforce authentication directly
- Those that do use getCurrentUser() which is patched
- Server-side calls already work through the patched getCurrentUser()

## How to Revert Individual Files

If you need to revert a specific file:

```bash
# Example: Revert root supabaseClient
cp lib/supabaseClient.js.bak.20260202_072142 lib/supabaseClient.js

# Example: Revert main app
cp apps/main/lib/supabaseClient.js.bak.20260202_072142 apps/main/lib/supabaseClient.js
```

## How to Revert All Changes

```bash
# Revert all modified files
find . -name "*.bak.20260202_072142" | while read backup; do
  original="${backup%.bak.20260202_072142}"
  cp "$backup" "$original"
  echo "Reverted $original"
done

# Remove the new files
rm -f lib/feature-flags/disableAuth.js
rm -f docs/DISABLE_AUTH_README.md
rm -f scripts/set-disable-auth.sh
rm -f scripts/test-disable-auth.sh
rm -f AUTH_DISABLE_FILE_MANIFEST.md
```

Then rebuild and restart your apps.

## Testing Checklist

Before deploying to any environment with auth disabled:

- [ ] Set `DISABLE_AUTH=true`
- [ ] Set `NEXT_PUBLIC_DISABLE_AUTH=true`
- [ ] Rebuild all apps
- [ ] Verify console shows "⚠️ AUTH DISABLED" warnings
- [ ] Test accessing /admin without login
- [ ] Test accessing protected content without payment
- [ ] Verify mock user appears in app state
- [ ] Document why auth is disabled
- [ ] Set calendar reminder to re-enable auth
- [ ] Have rollback plan ready

## Security Warnings

⚠️ **CRITICAL:**
- ALL content becomes publicly accessible
- ALL admin features become publicly accessible  
- NO authentication checks are performed
- NO payment verification occurs
- ONLY use for debugging/maintenance
- NEVER enable in production without approval
- RE-ENABLE immediately after testing

## Support

For questions or issues:
1. Read `docs/DISABLE_AUTH_README.md`
2. Run `scripts/test-disable-auth.sh`
3. Check backup files for reverting
4. Review this manifest

---

**Created:** 2026-02-02
**PR:** feature/disable-auth-temporary
**Backup Timestamp:** 20260202_072142
