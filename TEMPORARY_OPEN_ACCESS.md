# Temporary Open Access Configuration (LEGACY)

**Status:** ⚠️ DEPRECATED - Use OPEN_ACCESS Mode Instead  
**Last Updated:** February 7, 2026  
**Purpose:** Enable full platform access without authentication for testing period  
**Recommended:** See [OPEN_ACCESS_MODE.md](OPEN_ACCESS_MODE.md) for the current implementation

---

## ⚠️ Notice: This Document is Deprecated

This document describes the **legacy** method for enabling open access using `NEXT_PUBLIC_DISABLE_AUTH`.

**For new implementations, please use:**
- **New Variable:** `OPEN_ACCESS=true` (see [OPEN_ACCESS_MODE.md](OPEN_ACCESS_MODE.md))
- **New Script:** `./scripts/enable-open-access.sh` (updated to use OPEN_ACCESS)

The legacy `NEXT_PUBLIC_DISABLE_AUTH` variable is still supported for backward compatibility but is no longer recommended.

---

## 🎯 Quick Activation (Legacy Method)

### Option 1: New Method (Recommended)
Use the new OPEN_ACCESS mode:

```bash
# In .env.local
OPEN_ACCESS=true
```

See [OPEN_ACCESS_MODE.md](OPEN_ACCESS_MODE.md) for full documentation.

### Option 2: Legacy Method (Deprecated)
Set this in your `.env.local` file at the root of the repository:

```bash
# Enable temporary open access - bypass all authentication (LEGACY)
NEXT_PUBLIC_DISABLE_AUTH=true

# Disable paywalls (optional - already disabled by default)
NEXT_PUBLIC_PAYWALL_ENABLED=false
```

After setting these variables, rebuild and restart all apps:

```bash
# Rebuild all apps
yarn workspace learn-developer build
yarn workspace learn-ai build
# ... repeat for other apps

# Or use the deployment script
./deploy-all.sh
```

### Option 2: Guest Mode Button (Per-Session)
Users can click the **"Continue as Guest"** or **"Explore Without Signup"** button on any protected page. This adds `?guest=true` to the URL and grants read-only access for that session.

---

## 🔧 What This Enables

✅ **All Content Accessible:** Browse all 11 learning apps without signing in  
✅ **No Payment Required:** All premium features available for testing  
✅ **Guest Mode Available:** One-click exploration via "Continue as Guest" button  
✅ **No Registration Prompts:** Direct navigation to content  
✅ **Read-Only Access:** Users can view but not save progress (in guest mode)

---

## 📱 Active Apps with Open Access

When `NEXT_PUBLIC_DISABLE_AUTH=true` is set, all these apps are fully accessible:

1. **Main Portal** (`apps/main`) - Landing page and content hub ✅
2. **Learn Developer** (`apps/learn-developer`) - Software development skills ✅
3. **Learn AI** (`apps/learn-ai`) - Artificial intelligence courses ✅
4. **Learn Government Jobs** (`apps/learn-govt-jobs`) - Government exam preparation ✅
5. **Learn Management** (`apps/learn-management`) - Business management ✅ **ENHANCED LANDING PAGE**
6. **Learn PR** (`apps/learn-pr`) - Public relations ✅ **ENHANCED LANDING PAGE**
7. **Learn Physics** (`apps/learn-physics`) - Physics education ✅
8. **Learn Chemistry** (`apps/learn-chemistry`) - Chemistry courses ✅
9. **Learn Math** (`apps/learn-math`) - Mathematics learning ✅
10. **Learn Geography** (`apps/learn-geography`) - Geography content ✅
11. **Learn APT** (`apps/learn-apt`) - APT exam preparation ✅

### 🎨 Landing Page Enhancements (February 7, 2026)

**Learn Physics:**
- ✨ New engaging headline: "Unlock the Universe of Physics 🌟"
- 📊 Expanded from 3 to 6 comprehensive feature cards
- 🎯 Added: Thermodynamics & Energy, Waves & Optics, Applied Physics
- 🌈 Updated gradient: Blue to Indigo for scientific appeal
- 📝 Enhanced descriptions covering mechanics to quantum theory

**Learn Math:**
- ✨ New engaging headline: "Master the Language of Mathematics 📐"
- 📊 Expanded from 3 to 6 comprehensive feature cards
- 🎯 Added: Statistics & Probability, Discrete Mathematics, Applied Mathematics
- 🌈 Updated gradient: Purple to Pink for dynamic appeal
- 📝 Enhanced descriptions from arithmetic to advanced calculus

**Learn Chemistry:**
- ✨ New engaging headline: "Discover the Magic of Chemistry 🧪"
- 📊 Expanded from 3 to 6 comprehensive feature cards
- 🎯 Added: Atomic & Molecular Structure, Thermochemistry, Organic & Biochemistry
- 🌈 Updated gradient: Green to Teal for fresh appeal
- 📝 Enhanced descriptions covering atomic structure to complex reactions

**Learn Geography:**
- ✨ New engaging headline: "Explore Our Interconnected World 🌍"
- 📊 Expanded from 3 to 6 comprehensive feature cards
- 🎯 Added: Environmental Resources, Urban & Economic Geography, Geopolitics
- 🌈 Updated gradient: Emerald to Cyan for global appeal
- 📝 Enhanced descriptions covering physical and human geography

**Learn Management:**
- ✨ New engaging headline: "Transform Your Leadership Skills 🚀"
- 📊 Expanded from 3 to 6 comprehensive feature cards
- 🎯 Added: Team Leadership, Project Management, Change Management
- 🌈 Updated gradient: Blue to Purple for professional appeal

**Learn PR:**
- ✨ New engaging headline: "Master the Art of Public Relations ✨"
- 📊 Expanded from 3 to 6 comprehensive feature cards
- 🚨 Added: Crisis Management, Public Speaking & Events, PR Analytics
- 🌈 Updated gradient: Pink to Orange for vibrant appeal

All landing pages now feature:
- Compelling subheadlines with clear value propositions
- Detailed feature descriptions that showcase real-world applications
- Professional color gradients that match their domains
- Action-oriented copy that drives engagement
- Comprehensive coverage of each subject area

---

## 🔐 How It Works

### Protected Route Bypass
The `PaidUserProtectedRoute` component checks for:

1. **Global Auth Disable:** `NEXT_PUBLIC_DISABLE_AUTH=true`
   - Creates mock admin user with full permissions
   - Bypasses all authentication checks
   - Logged in console: "⚠️ AUTH DISABLED: PaidUserProtectedRoute bypassed"

2. **Guest Mode:** URL parameter `?guest=true`
   - Creates guest user with read-only access
   - Allows browsing without sign-up
   - Logged in console: "👤 GUEST MODE: Granting read-only access"

### Mock User Object
When auth is disabled, a mock user is created:

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

## 🧪 Testing Checklist

Use this checklist to verify open access works correctly:

### Without Authentication (Global)
- [ ] Set `NEXT_PUBLIC_DISABLE_AUTH=true` in `.env.local`
- [ ] Rebuild and restart all apps
- [ ] Navigate to any protected route (e.g., `/modules/1/lesson/1`)
- [ ] Verify content loads immediately without login prompt
- [ ] Check browser console for "⚠️ AUTH DISABLED" message

### Guest Mode (Per-Session)
- [ ] Set `NEXT_PUBLIC_DISABLE_AUTH=false` in `.env.local`
- [ ] Navigate to a protected route
- [ ] Click "Continue as Guest" button
- [ ] Verify URL changes to include `?guest=true`
- [ ] Verify content loads without authentication
- [ ] Check browser console for "👤 GUEST MODE" message

### Navigation Test
- [ ] Browse all 11 apps without signing in
- [ ] Access course modules, lessons, and quizzes
- [ ] Verify no forced sign-in or registration screens
- [ ] Confirm "Continue as Guest" button appears on protected pages

### Newsletter Content
- [ ] Visit `/newsletter` page
- [ ] Verify "Last Updated: February 6, 2026" is displayed
- [ ] Confirm platform status shows "11 Active Learning Apps"
- [ ] Check that Issue #1 mentions current open access status

---

## ⚠️ Security Warnings

**IMPORTANT:** This is a temporary configuration for testing only!

- ⚠️ **DO NOT** use in production without explicit approval
- ⚠️ **DO NOT** commit `.env.local` files with `NEXT_PUBLIC_DISABLE_AUTH=true`
- ⚠️ **ALWAYS** restore normal authentication post-launch
- ⚠️ **MONITOR** console warnings about disabled authentication

### Console Warning
When auth is disabled, you'll see this warning in server logs:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  AUTHENTICATION DISABLED - TEMPORARY OVERRIDE ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
All authentication and paywall checks are bypassed.
Content is publicly accessible without login.
This should ONLY be used for temporary debugging/maintenance.
To disable: unset DISABLE_AUTH and NEXT_PUBLIC_DISABLE_AUTH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🔄 Restoring Normal Authentication

When testing is complete, restore authentication:

1. **Update Environment Variables:**
   ```bash
   # In .env.local
   NEXT_PUBLIC_DISABLE_AUTH=false
   NEXT_PUBLIC_PAYWALL_ENABLED=true  # Optional: re-enable paywalls
   ```

2. **Rebuild All Apps:**
   ```bash
   ./deploy-all.sh
   ```

3. **Verify Authentication:**
   - Protected routes should now require login
   - "Continue as Guest" button should still work for session-based access
   - Console should not show "AUTH DISABLED" warnings

---

## 📋 Implementation Details

### Modified Files
- `/components/PaidUserProtectedRoute.js` - Root protected route component
- `/apps/main/components/PaidUserProtectedRoute.js` - Main app protected route
- `/apps/main/pages/newsletter.js` - Newsletter with updated content
- `/lib/feature-flags/disableAuth.js` - Centralized auth bypass logic
- `.env.local.example` - Environment variable documentation

### Key Functions
- `isAuthDisabledClient()` - Check client-side auth bypass flag
- `isAuthDisabledServer()` - Check server-side auth bypass flag
- `getMockUser()` - Return mock user object for bypassed auth

---

## 📞 Support

For questions or issues with temporary open access:

1. Check console for auth bypass messages
2. Verify environment variables are set correctly
3. Ensure apps are rebuilt after changing `.env.local`
4. Review this documentation for troubleshooting steps

---

**Remember:** This is a temporary configuration for pre-deployment testing. Always restore normal authentication before production launch! 🚀
