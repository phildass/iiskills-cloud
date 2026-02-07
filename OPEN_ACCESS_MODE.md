# Open Access Mode

**Status:** ✅ ACTIVE  
**Last Updated:** February 7, 2026  
**Purpose:** Enable complete open access mode across the entire monorepo

---

## 🎯 Overview

Open Access Mode allows you to bypass **ALL** authentication, login, signup, registration, paywall, and restriction logic across the entire iiskills-cloud monorepo. When enabled, any user (including unauthenticated guests) can freely access and use every section and feature of every app without any login, sign-in, verification, or payment prompts.

## 🚀 Quick Start

### Enable Open Access

Set this in your `.env.local` file at the root of the repository:

```bash
# Enable complete open access mode
OPEN_ACCESS=true
```

**OR** use the automated script:

```bash
./scripts/enable-open-access.sh
```

After setting the variable, rebuild and restart all apps:

```bash
./deploy-all.sh
```

### Disable Open Access

Set this in your `.env.local` file:

```bash
# Disable open access mode (restore authentication)
OPEN_ACCESS=false
```

**OR** use the automated script:

```bash
./scripts/restore-authentication.sh
```

Then rebuild and restart all apps.

---

## 🔧 How It Works

### Environment Variable Hierarchy

The system checks for open access in the following order:

1. **`OPEN_ACCESS=true`** (Server-side variable, automatically exposed to client)
2. **`NEXT_PUBLIC_OPEN_ACCESS=true`** (Direct client-side variable)
3. **`NEXT_PUBLIC_DISABLE_AUTH=true`** (Legacy backward compatibility)
4. **`NEXT_PUBLIC_TEST_MODE=true`** (Legacy test mode)

If **any** of these variables is set to `true`, open access mode is enabled.

### Technical Implementation

1. **next.config.js Files:**
   - All `next.config.js` files expose `OPEN_ACCESS` to the client as `NEXT_PUBLIC_OPEN_ACCESS`
   - This allows server-side env vars to work seamlessly with client-side components

2. **Protected Route Components:**
   - `PaidUserProtectedRoute.js` - Bypasses paywall and authentication
   - `UserProtectedRoute.js` - Bypasses user authentication
   - `ProtectedRoute.js` - Bypasses admin authentication

3. **Mock User Creation:**
   - When open access is enabled, protected routes create a mock user with full permissions
   - Mock user has admin rights and paid status

---

## 📱 Affected Components

### Protected Routes
All protected route components support open access mode:
- `/components/PaidUserProtectedRoute.js` (root)
- `/components/UserProtectedRoute.js` (root)
- `/components/ProtectedRoute.js` (root)
- `/apps/main/components/PaidUserProtectedRoute.js`
- `/apps/main/components/UserProtectedRoute.js`
- `/apps/main/components/ProtectedRoute.js`

### Apps
All 11 learning apps are fully accessible in open access mode:
1. **Main Portal** (`apps/main`)
2. **Learn Developer** (`apps/learn-developer`)
3. **Learn AI** (`apps/learn-ai`)
4. **Learn Government Jobs** (`apps/learn-govt-jobs`)
5. **Learn Management** (`apps/learn-management`)
6. **Learn PR** (`apps/learn-pr`)
7. **Learn Physics** (`apps/learn-physics`)
8. **Learn Chemistry** (`apps/learn-chemistry`)
9. **Learn Math** (`apps/learn-math`)
10. **Learn Geography** (`apps/learn-geography`)
11. **Learn APT** (`apps/learn-apt`)

---

## 🧪 Testing

### Verify Open Access Mode

1. Set `OPEN_ACCESS=true` in `.env.local`
2. Rebuild and restart apps
3. Navigate to any protected route (e.g., `/modules/1/lesson/1`)
4. Verify:
   - ✅ Content loads immediately without login prompt
   - ✅ Console shows: `⚠️ OPEN ACCESS MODE: All authentication bypassed - granting full access`
   - ✅ No registration or payment screens appear

### Test Across All Apps

1. Visit each of the 11 learning apps
2. Navigate to protected routes in each app
3. Confirm no authentication barriers exist
4. Verify all features are accessible

### Verify Restoration

1. Set `OPEN_ACCESS=false` in `.env.local`
2. Rebuild and restart apps
3. Navigate to a protected route
4. Verify:
   - ✅ Login/register screen appears
   - ✅ Console does NOT show "OPEN ACCESS MODE" message
   - ✅ Authentication is required

---

## 🔒 Security Considerations

### ⚠️ Important Warnings

- **NEVER** enable open access mode in production without explicit approval
- **ALWAYS** use for testing, demo, and preview purposes only
- **DO NOT** commit `.env.local` files with `OPEN_ACCESS=true`
- **MONITOR** console warnings about open access mode being active

### Console Warnings

When open access is enabled, you'll see clear warnings:

```
⚠️ OPEN ACCESS MODE: All authentication bypassed - granting full access
```

This serves as a visual reminder that security features are disabled.

### Production Deployment

Before deploying to production:

1. Verify `OPEN_ACCESS=false` in all `.env.local` files
2. Run `./scripts/restore-authentication.sh` to ensure proper settings
3. Rebuild all apps to apply authentication
4. Test that authentication is working correctly

---

## 🆚 Comparison: Open Access vs. Guest Mode

### Open Access Mode (`OPEN_ACCESS=true`)
- **Scope:** Entire monorepo
- **Activation:** Environment variable in `.env.local`
- **Duration:** Permanent until disabled
- **Access:** Full access to all features
- **Use Case:** Testing, demos, previews

### Guest Mode (`?guest=true`)
- **Scope:** Single session
- **Activation:** URL parameter
- **Duration:** Current session only
- **Access:** Read-only access
- **Use Case:** Quick browsing without signup

Both modes can work independently or together.

---

## 📖 Related Documentation

- `TEMPORARY_OPEN_ACCESS.md` - Legacy documentation for the old implementation
- `ENV_SETUP_GUIDE.md` - Environment variable setup guide
- `AUTHENTICATION_ARCHITECTURE.md` - Authentication system overview
- `.env.local.example` - Environment variable templates

---

## 🔄 Migration from Legacy Variables

If you were using the old `NEXT_PUBLIC_DISABLE_AUTH` variable:

### Before (Legacy)
```bash
NEXT_PUBLIC_DISABLE_AUTH=true
NEXT_PUBLIC_PAYWALL_ENABLED=false
```

### After (Recommended)
```bash
OPEN_ACCESS=true
NEXT_PUBLIC_PAYWALL_ENABLED=false
```

**Note:** The legacy variables still work for backward compatibility, but `OPEN_ACCESS` is the recommended approach going forward.

---

## 💡 Tips and Best Practices

1. **Use Scripts:** Always use `enable-open-access.sh` and `restore-authentication.sh` scripts instead of manual edits
2. **Check Console:** Monitor browser console for open access mode warnings
3. **Test Locally:** Always test open access mode locally before deploying
4. **Document Usage:** If using open access in staging/demo, document it clearly
5. **Temporary Only:** Remember this is for temporary use, not permanent deployment

---

## 🐛 Troubleshooting

### Open Access Not Working

**Problem:** Open access mode is enabled but authentication is still required

**Solutions:**
1. Verify `OPEN_ACCESS=true` is set in `.env.local`
2. Rebuild apps: `./deploy-all.sh`
3. Clear browser cache and cookies
4. Check browser console for open access mode message
5. Verify no conflicting environment variables

### Authentication Not Restored

**Problem:** Set `OPEN_ACCESS=false` but still seeing open access behavior

**Solutions:**
1. Run `./scripts/restore-authentication.sh` to ensure proper settings
2. Rebuild apps: `./deploy-all.sh`
3. Check all `.env.local` files (root and all apps)
4. Verify no legacy variables are set to `true`
5. Restart development servers

---

## 📞 Support

For questions or issues with open access mode:

1. Check this documentation for troubleshooting steps
2. Verify environment variables are set correctly
3. Ensure apps are rebuilt after changing `.env.local`
4. Review console messages for helpful warnings
5. Consult related documentation listed above

---

**Remember:** Open Access Mode is a powerful feature for testing and demos. Use it responsibly and always restore authentication before production deployment! 🚀
