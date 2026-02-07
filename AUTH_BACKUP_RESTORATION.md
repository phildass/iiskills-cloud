# Authentication Backup & Restoration Guide

**Created:** February 7, 2026  
**Purpose:** Temporary removal of all authentication barriers for testing period  
**Status:** ⚠️ ACTIVE - Authentication is currently DISABLED

---

## 🎯 Current Configuration

### What Has Been Changed

All authentication has been **temporarily disabled** across the entire monorepo:

✅ **Environment Configuration:**
- Created `.env.local` files for all apps with `NEXT_PUBLIC_DISABLE_AUTH=true`
- Set `NEXT_PUBLIC_PAYWALL_ENABLED=false` to disable all paywalls
- Set `NEXT_PUBLIC_SUPABASE_SUSPENDED=true` to bypass database

✅ **Affected Applications:**
1. Main Portal (`apps/main`)
2. Learn Physics (`apps/learn-physics`)
3. Learn Math (`apps/learn-math`)
4. Learn Chemistry (`apps/learn-chemistry`)
5. Learn Geography (`apps/learn-geography`)
6. Learn AI (`apps/learn-ai`)
7. Learn APT (`apps/learn-apt`)
8. Learn Developer (`apps/learn-developer`)
9. Learn Government Jobs (`apps/learn-govt-jobs`)
10. Learn Management (`apps/learn-management`)
11. Learn PR (`apps/learn-pr`)

### Auth Bypass Mechanism

The existing protected route components already support auth bypass:

**File:** `components/PaidUserProtectedRoute.js` (and per-app versions)
- Checks `process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true'`
- When true, creates mock user with full admin permissions
- Bypasses all authentication checks
- Grants immediate access to all protected content

**Mock User Object:**
```javascript
{
  id: 'dev-override',
  email: 'dev@iiskills.cloud',
  user_metadata: {
    full_name: 'Dev Override',
    firstName: 'Dev',
    lastName: 'Override',
    is_admin: true,
    payment_status: 'paid'
  }
}
```

---

## 📋 What Was NOT Changed

✅ **Code Integrity:**
- NO code deletions or modifications to auth logic
- NO changes to protected route component code
- NO changes to Supabase client configuration
- NO changes to API routes or middleware
- NO changes to database schema

✅ **Content Safety:**
- Landing page enhancements preserved
- New features and content updates preserved
- UI/UX improvements maintained
- All content remains intact

**All authentication code remains in place and functional** - only disabled via environment variables.

---

## 🔄 How to Restore Authentication

### Quick Restore (Recommended)

Run the provided restoration script:

```bash
# From repository root
./restore-authentication.sh
```

This will:
1. Remove all temporary `.env.local` files
2. Restore any `.env.local.backup` files (if they existed)
3. Return apps to default authentication state

### Manual Restore

If you need to manually restore:

1. **Delete temporary .env.local files:**
   ```bash
   rm .env.local
   rm apps/*/.env.local
   ```

2. **OR update existing .env.local files:**
   ```bash
   # In each .env.local file, change:
   NEXT_PUBLIC_DISABLE_AUTH=false  # or remove this line entirely
   NEXT_PUBLIC_PAYWALL_ENABLED=true
   NEXT_PUBLIC_SUPABASE_SUSPENDED=false
   ```

3. **Configure proper Supabase credentials:**
   - See `.env.local.example` for template
   - Add your actual `NEXT_PUBLIC_SUPABASE_URL`
   - Add your actual `NEXT_PUBLIC_SUPABASE_ANON_KEY`

4. **Rebuild all apps:**
   ```bash
   yarn build
   # or
   ./deploy-all.sh
   ```

---

## 🔐 Authentication Files Reference

### Protected Route Components

These components contain the auth bypass logic (NO CHANGES MADE):

```
/components/PaidUserProtectedRoute.js
/components/UserProtectedRoute.js
/components/ProtectedRoute.js
/apps/main/components/PaidUserProtectedRoute.js
/apps/main/components/UserProtectedRoute.js
/apps/main/components/ProtectedRoute.js
```

**Key Logic (lines 48-68 in PaidUserProtectedRoute.js):**
```javascript
// TEMPORARY AUTH DISABLE - PR: feature/disable-auth-temporary  
// Bypass paywall when global auth disable flag is enabled
const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';

if (isAuthDisabled) {
  console.log('⚠️ AUTH DISABLED: PaidUserProtectedRoute bypassed - granting full access');
  setUser({...mockUserObject...});
  return; // Skip all auth checks
}
```

### Supabase Client Files

These files respect the suspension mode (NO CHANGES MADE):

```
/lib/supabaseClient.js
/apps/*/lib/supabaseClient.js
```

**Key Logic:**
```javascript
const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
const isSuspended = process.env.NEXT_PUBLIC_SUPABASE_SUSPENDED === 'true';

if (isAuthDisabled || isSuspended) {
  // Return mock client or bypass auth
}
```

---

## ✅ Verification Checklist

### Before Restoration (Current State)

- [ ] All apps accessible without login
- [ ] No registration/signup prompts anywhere
- [ ] No paywall screens
- [ ] Console shows "⚠️ AUTH DISABLED" messages
- [ ] All content viewable by anonymous users
- [ ] Protected routes accessible without authentication

### After Restoration (Target State)

- [ ] Protected routes require login
- [ ] Registration/signup flow working
- [ ] Supabase authentication active
- [ ] User sessions persist correctly
- [ ] Console NO LONGER shows "AUTH DISABLED" warnings
- [ ] Only public pages accessible without login

---

## 🎨 Landing Page Enhancements (NOT AFFECTED)

The following landing page updates were made and **will remain after auth restoration**:

### Learn Physics
- ✨ New headline: "Unlock the Universe of Physics 🌟"
- 📊 Expanded from 3 to 6 feature cards
- 🎯 Added: Thermodynamics, Waves & Optics, Applied Physics
- 🌈 Blue to Indigo gradient

### Learn Math
- ✨ New headline: "Master the Language of Mathematics 📐"
- 📊 Expanded from 3 to 6 feature cards
- 🎯 Added: Statistics, Discrete Math, Applied Mathematics
- 🌈 Purple to Pink gradient

### Learn Chemistry
- ✨ New headline: "Discover the Magic of Chemistry 🧪"
- 📊 Expanded from 3 to 6 feature cards
- 🎯 Added: Atomic Structure, Thermochemistry, Organic Chemistry
- 🌈 Green to Teal gradient

### Learn Geography
- ✨ New headline: "Explore Our Interconnected World 🌍"
- 📊 Expanded from 3 to 6 feature cards
- 🎯 Added: Environmental Resources, Urban Geography, Geopolitics
- 🌈 Emerald to Cyan gradient

---

## 📁 Files Created for This Test Period

### Scripts
- `setup-open-access.sh` - Script to enable open access
- `restore-authentication.sh` - Script to restore authentication

### Configuration
- `.env.local` (root) - Temporary auth disable config
- `apps/*/.env.local` - Temporary auth disable config for each app

### Documentation
- `AUTH_BACKUP_RESTORATION.md` (this file) - Complete restoration guide

### Backups
- `.env.local.backup` - Automatic backups (if files existed before)
- `apps/*/.env.local.backup` - Per-app backups (if files existed)

---

## ⚠️ Important Warnings

1. **Temporary Configuration Only**
   - This setup is for testing/demo purposes ONLY
   - NOT suitable for production deployment
   - Provides no user data protection

2. **Data Persistence**
   - Users cannot save progress during test period
   - No user accounts created
   - No data written to database

3. **Security**
   - All content is publicly accessible
   - No authentication barriers
   - No authorization checks

4. **Timeline**
   - Restore authentication before production deployment
   - Test period should be limited in duration
   - Monitor console warnings about disabled auth

---

## 🔧 Troubleshooting

### Apps still require login after restoration

**Solution:**
1. Verify `.env.local` files are removed or updated
2. Clear browser cache and cookies
3. Rebuild apps: `yarn build`
4. Restart development server
5. Check Supabase credentials are valid

### Apps not building after changes

**Solution:**
1. Check `.env.local` syntax
2. Verify all environment variables are properly set
3. Check for typos in variable names
4. Review build logs for specific errors

### Protected routes not working

**Solution:**
1. Verify Supabase connection is active
2. Check `NEXT_PUBLIC_SUPABASE_SUSPENDED=false`
3. Test authentication flow manually
4. Review browser console for errors
5. Check Supabase dashboard for auth errors

---

## 📞 Support & Additional Resources

### Related Documentation
- `TEMPORARY_OPEN_ACCESS.md` - Detailed open access guide
- `.env.local.example` - Environment configuration template
- `ENV_SETUP_GUIDE.md` - Supabase setup instructions
- `AUTHENTICATION_ARCHITECTURE.md` - Auth system architecture

### Console Messages

**During Test Period (Auth Disabled):**
```
⚠️ AUTH DISABLED: PaidUserProtectedRoute bypassed - granting full access
```

**After Restoration (Auth Enabled):**
```
(No auth warnings in console)
```

---

## 📝 Summary

| Aspect | Current State | After Restoration |
|--------|--------------|-------------------|
| Authentication | ❌ Disabled | ✅ Enabled |
| Registration | ❌ Bypassed | ✅ Required |
| Paywalls | ❌ Disabled | ✅ Enabled |
| Content Access | 🌐 Public | 🔐 Protected |
| User Sessions | ❌ Mock Users | ✅ Real Users |
| Database | ❌ Suspended | ✅ Active |
| Landing Pages | ✅ Enhanced | ✅ Enhanced |
| Code Changes | ✅ None | ✅ None |

---

**Remember:** All authentication code is intact and ready to be re-enabled at any time. Simply run the restoration script or update environment variables, rebuild, and authentication will be fully restored! 🚀
