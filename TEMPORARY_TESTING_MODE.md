# TEMPORARY TESTING MODE - REMOVE ALL PAYWALLS & AUTH

⚠️ **CRITICAL: THIS IS TEMPORARY - RESTORE AFTER JANUARY 28, 2026**

## Overview

This document describes the TEMPORARY removal of all authentication requirements and paywalls across all 16 learning apps for testing purposes.

**Testing Window:** Now until January 28, 2026
**Restoration Date:** After January 28, 2026

## Changes Made

### Environment Variables Added

Three new environment variables control the temporary bypass:

```bash
# TEMPORARY - RESTORE AFTER JAN 28, 2026
NEXT_PUBLIC_TESTING_MODE=true
NEXT_PUBLIC_DISABLE_AUTH=true
NEXT_PUBLIC_DISABLE_PAYWALL=true
```

These variables are added to:
- Root `.env.local`
- All 16 apps' `.env.local` files
- `ecosystem.config.js` (for PM2 production deployment)

### Apps Modified (16 Total)

1. **learn-ai** - Free app, auth bypass added
2. **learn-apt** - Admin portal, auth bypass added
3. **learn-chemistry** - Free app, auth bypass added
4. **learn-cricket** - Free app, auth bypass added
5. **learn-data-science** - Free app, auth bypass added
6. **learn-geography** - Free app, auth bypass added
7. **learn-govt-jobs** - Free app, auth bypass added
8. **learn-ias** - Paid app, auth + paywall bypass added
9. **learn-jee** - Paid app, auth + paywall bypass added
10. **learn-leadership** - Free app, auth bypass added
11. **learn-management** - Free app, auth bypass added
12. **learn-math** - Free app, auth bypass added
13. **learn-neet** - Subscription app, auth + paywall bypass added
14. **learn-physics** - Free app, auth bypass added
15. **learn-pr** - Free app, auth bypass added
16. **learn-winning** - Paid app, auth + paywall bypass added

### Code Changes

#### Pattern 1: Supabase Auth Bypass (15 apps)

**File:** `lib/supabaseClient.js`

**Changes:**
- `getCurrentUser()` - Returns mock authenticated user when DISABLE_AUTH=true
- `checkActiveSubscription()` (learn-neet only) - Returns true when DISABLE_PAYWALL=true

#### Pattern 2: Modern Auth Context Bypass (learn-apt)

**File:** `src/contexts/AuthContext.tsx`

**Changes:**
- Returns mock authenticated state when DISABLE_AUTH=true
- Bypasses all authentication checks

#### Pattern 3: Paywall Bypass (learn-jee, learn-winning, learn-ias, learn-neet)

**Already Implemented:**
- These apps already respect `NEXT_PUBLIC_PAYWALL_ENABLED`
- We set `NEXT_PUBLIC_DISABLE_PAYWALL=true` which also sets `NEXT_PUBLIC_PAYWALL_ENABLED=false`

## Files Modified

### Configuration Files
- `/ecosystem.config.js` - Added testing env vars to all apps
- `/.env.local` - Created with testing flags
- `/learn-*/​.env.local` - Created for all 16 apps

### Code Files (Auth Bypass)
- `/learn-ai/lib/supabaseClient.js`
- `/learn-apt/src/contexts/AuthContext.tsx`
- `/learn-chemistry/lib/supabaseClient.js`
- `/learn-cricket/lib/supabaseClient.js`
- `/learn-data-science/lib/supabaseClient.js`
- `/learn-geography/lib/supabaseClient.js`
- `/learn-govt-jobs/lib/supabaseClient.js`
- `/learn-ias/lib/supabaseClient.js`
- `/learn-jee/lib/supabaseClient.js`
- `/learn-leadership/lib/supabaseClient.js`
- `/learn-management/lib/supabaseClient.js`
- `/learn-math/lib/supabaseClient.js`
- `/learn-neet/lib/supabaseClient.js`
- `/learn-physics/lib/supabaseClient.js`
- `/learn-pr/lib/supabaseClient.js`
- `/learn-winning/lib/supabaseClient.js`

## How It Works

### Authentication Bypass

When `NEXT_PUBLIC_DISABLE_AUTH=true`:

```javascript
// TEMPORARY - RESTORE AFTER JAN 28, 2026
const DISABLE_AUTH = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';

if (DISABLE_AUTH) {
  return {
    id: 'test-user',
    email: 'test@iiskills.cloud',
    user_metadata: {
      full_name: 'Test User',
      role: 'admin', // Full access
      // All purchase flags set to true
      purchased_jee_course: true,
      purchased_ias_course: true,
      purchased_winning_course: true,
      neet_subscription_end: '2099-12-31' // Never expires
    }
  };
}
```

### Paywall Bypass

When `NEXT_PUBLIC_DISABLE_PAYWALL=true`:

```javascript
// TEMPORARY - RESTORE AFTER JAN 28, 2026
const PAYWALL_DISABLED = process.env.NEXT_PUBLIC_DISABLE_PAYWALL === 'true';

if (PAYWALL_DISABLED) {
  // Grant full access
  return true;
}
```

## User Experience During Testing

✅ **What Users Will See:**
- No login/registration prompts
- All content accessible immediately
- All videos playable
- All downloads available
- All modules unlocked
- Full admin access (for learn-apt)

❌ **What Is Hidden:**
- Login/signup redirects bypassed
- Paywall prompts bypassed
- Authentication checks bypassed
- Purchase requirements bypassed
- Subscription checks bypassed

## Restoration Instructions (AFTER JAN 28, 2026)

### Step 1: Update Environment Variables

**Option A: Local Development**

Edit all `.env.local` files and set:

```bash
NEXT_PUBLIC_TESTING_MODE=false
NEXT_PUBLIC_DISABLE_AUTH=false
NEXT_PUBLIC_DISABLE_PAYWALL=false
```

Or simply delete these variables (default is disabled).

**Option B: Production (PM2)**

Edit `ecosystem.config.js` and change for all apps:

```javascript
env: {
  // ... other vars
  NEXT_PUBLIC_TESTING_MODE: "false",
  NEXT_PUBLIC_DISABLE_AUTH: "false",
  NEXT_PUBLIC_DISABLE_PAYWALL: "false"
}
```

### Step 2: Rebuild and Restart

```bash
# Rebuild all apps
npm run build
# or
turbo build

# Restart PM2
pm2 restart ecosystem.config.js

# Verify
pm2 logs
```

### Step 3: Verify Restoration

1. Open any learn-* app in incognito mode
2. Verify you are redirected to login
3. Try accessing premium content without purchase
4. Confirm paywall is enforced

### Step 4: Optional Code Cleanup

If desired, you can remove the temporary bypass code after restoration:

1. Search for comments: `TEMPORARY - RESTORE AFTER JAN 28, 2026`
2. Remove the conditional bypass blocks
3. Keep only the original auth/paywall logic
4. Test thoroughly

## Safety Features

✅ **Easily Reversible:**
- Just flip environment variables
- No code deleted
- All auth/paywall logic preserved
- Clear comments mark all changes

✅ **Feature Flag Controlled:**
- Changes disabled by default
- Explicit opt-in required
- No accidental production exposure

✅ **Documented:**
- All changes marked with TEMPORARY comments
- This restoration guide
- Clear timeline

## Testing Checklist

Before launch (Jan 28):

- [ ] Set all env vars to `false` or delete them
- [ ] Rebuild all apps
- [ ] Restart PM2
- [ ] Test authentication works
- [ ] Test paywalls are enforced
- [ ] Test with non-paying user account
- [ ] Test with paying user account
- [ ] Verify admin access requires real login
- [ ] Check all 16 apps

## Support

If you encounter issues during restoration:

1. Check environment variables are set correctly
2. Verify applications were rebuilt after changes
3. Clear browser cache
4. Check PM2 logs for errors
5. Restart PM2 if needed

---

**Created:** January 25, 2026
**Restoration Due:** January 28, 2026
**Contact:** info@iiskills.cloud
