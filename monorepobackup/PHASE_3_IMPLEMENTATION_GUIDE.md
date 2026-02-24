# Phase 3 Implementation Guide: App Access Control & Bundle Logic

## Overview
This document describes the implementation of proper access control, payment logic, and AI-Developer bundling for the iiskills.cloud platform.

## What Has Been Implemented

### 1. Database Schema ✅
**File**: `supabase/migrations/user_app_access_table.sql`

Created `user_app_access` table to track user access to apps:
- Links users to apps they can access
- Supports multiple grant types: payment, bundle, otp, admin, free
- Includes expiration support for time-limited access
- Row-level security policies for user privacy
- References payments table for tracking purchases

**bundle_apps** column added to `payments` table to store which apps were unlocked by each payment.

### 2. Bundle Configuration Library ✅
**File**: `lib/bundleConfig.js`

Defines the AI-Developer bundle:
- Purchase either `learn-ai` or `learn-developer`  
- Get access to BOTH apps for the price of one
- Price: ₹116.82 (₹99 + 18% GST)
- Functions:
  - `getBundleForApp(appId)` - Get bundle info for an app
  - `getAppsInBundle(appId)` - Get all apps in the bundle
  - `isAppInBundle(appId)` - Check if app is bundled
  - `getPriceForApp(appId, tier)` - Get pricing with bundle logic

### 3. Access Manager Library ✅
**File**: `lib/accessManager.js`

Comprehensive access control functions:
- `grantAppAccess()` - Grant access to a single app
- `grantBundleAccess()` - Grant access to all apps in a bundle
- `hasAppAccess()` - Check if user has access (respects free apps)
- `getUserApps()` - Get all apps a user can access
- `revokeAppAccess()` - Revoke access (e.g., for refunds)
- `getAccessStats()` - Admin dashboard statistics

**Key Features**:
- Automatically handles free apps (always accessible)
- Checks payment expiration
- Integrates with bundle logic
- Uses Supabase service role for server-side operations

### 4. Payment Confirmation Handlers ✅
**Files**: 
- `apps/learn-ai/pages/api/payment/confirm.js`
- `apps/learn-developer/pages/api/payment/confirm.js`

Updated payment confirmation to:
- Store payment in database with bundle_apps array
- Call `grantBundleAccess()` to unlock all apps in bundle
- Return bundle information in API response
- Generate access codes for backwards compatibility
- Send confirmation emails with bundle details

### 5. Access Check API Template ✅
**File**: `lib/api-templates/check-access.js`

Template for universal access checking endpoint:
- Check if user has access to any app
- Return all accessible apps
- Return bundled apps separately
- Works with authentication token

**To Deploy**: Copy this to each app's `pages/api/users/check-access.js`

### 6. Universal Access Control Hook ✅
**File**: `lib/hooks/useAccessControl.js`

React hook for consistent access control:
- Respects app type (free vs paid)
- Checks bundle access
- Handles development mode bypass
- Redirects to payment if no access
- Provides loading states

**Usage**:
```javascript
import { useAccessControl } from '@/lib/hooks/useAccessControl';

function LessonPage() {
  const { hasAccess, loading, isFree, user } = useAccessControl('learn-ai');
  
  if (loading) return <LoadingSpinner />;
  if (!hasAccess) return null; // Hook handles redirect
  
  return <LessonContent />;
}
```

## App Type Configuration ✅

All app types are correctly configured in `lib/appRegistry.js`:

### FREE Apps (isFree: true)
- ✅ learn-math
- ✅ learn-physics  
- ✅ learn-chemistry
- ✅ learn-geography
- ✅ learn-apt

### PAID Apps (isFree: false)
- ✅ learn-pr
- ✅ learn-ai (bundled with learn-developer)
- ✅ learn-management
- ✅ learn-developer (bundled with learn-ai)

## What Needs To Be Done

### 1. Deploy Access Check API 🔲
Copy `lib/api-templates/check-access.js` to:
- `apps/learn-ai/pages/api/users/check-access.js`
- `apps/learn-developer/pages/api/users/check-access.js`
- `apps/learn-management/pages/api/users/check-access.js`
- `apps/learn-pr/pages/api/users/check-access.js`

Free apps don't need this API since they don't gate content.

### 2. Update Lesson Pages to Use Access Control 🔲

#### For FREE Apps (learn-math, learn-physics, learn-chemistry, learn-geography, learn-apt):
Remove all authentication checks. Allow full open access.

**Current**: Lines redirect to `/register` if not authenticated
**Required**: Remove authentication redirect, allow anyone to access

#### For PAID Apps (learn-ai, learn-developer, learn-pr, learn-management):
Use `useAccessControl` hook to enforce payment/OTP gating.

**Example Update**:
```javascript
// OLD CODE in lesson page:
const checkAuth = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser && process.env.NEXT_PUBLIC_DISABLE_AUTH !== 'true') {
    router.push('/register');
    return;
  }
  setUser(currentUser);
};

// NEW CODE:
import { useAccessControl } from '../../lib/hooks/useAccessControl';

// Inside component:
const { hasAccess, loading, user } = useAccessControl('learn-ai');

if (loading) return <div>Loading...</div>;
if (!hasAccess) return null; // Hook handles redirect
```

### 3. Update UI to Highlight Bundle 🔲

The `PaidAppLandingPage` already has `showAIDevBundle={true}` prop.
Verify bundle messaging is prominent on both:
- `apps/learn-ai/pages/index.js`
- `apps/learn-developer/pages/index.js`

The `AIDevBundlePitch` component should display after sample lesson completion.

### 4. Admin Dashboard - Show Bundle Access 🔲

Update admin dashboard to:
- Show which apps users have access to
- Indicate if access was granted via bundle
- Display payment records with bundle_apps array
- Show access statistics using `getAccessStats()` function

**Files to update**:
- `apps/main/pages/admin/users.js` (or equivalent)
- Query `user_app_access` table to show user access
- Show `granted_via` column to indicate bundle vs direct payment

### 5. Environment Variables 🔲

Ensure all apps have:
```bash
# For development - allows open access
NEXT_PUBLIC_DISABLE_AUTH=true

# For production - enforces access control
NEXT_PUBLIC_DISABLE_AUTH=false

# Required for access manager
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=... # Server-side only
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 6. Database Migration 🔲

Run the migration to create the `user_app_access` table:
1. Go to Supabase Dashboard → SQL Editor
2. Run `supabase/migrations/user_app_access_table.sql`
3. Verify table created with RLS policies
4. Verify `bundle_apps` column added to `payments` table

### 7. Testing Checklist 🔲

#### Free App Testing:
- [ ] Access learn-math without login ✓
- [ ] Access learn-physics without login ✓
- [ ] Access learn-chemistry without login ✓
- [ ] Access learn-geography without login ✓
- [ ] Access learn-apt without login ✓
- [ ] Verify NO payment prompts in free apps
- [ ] Verify NO OTP requests in free apps
- [ ] Complete full curriculum without barriers

#### Paid App Testing:
- [ ] learn-ai redirects to register if not logged in
- [ ] learn-developer redirects to register if not logged in
- [ ] learn-pr redirects to register if not logged in
- [ ] learn-management redirects to register if not logged in
- [ ] Payment prompt shown after sample lesson
- [ ] Logged-in users without payment see payment gate

#### Bundle Testing:
- [ ] Purchase learn-ai → verify learn-developer also unlocked
- [ ] Purchase learn-developer → verify learn-ai also unlocked
- [ ] Check database: user_app_access has 2 entries
- [ ] Check database: one granted_via='payment', one='bundle'
- [ ] Check database: payments.bundle_apps = ['learn-ai', 'learn-developer']
- [ ] Bundle message displayed on landing pages
- [ ] Bundle message in payment confirmation
- [ ] Both apps appear in user dashboard

#### Admin Dashboard:
- [ ] View all user access records
- [ ] See which apps each user has
- [ ] Identify bundle vs direct payments
- [ ] Revoke access functionality works
- [ ] Access statistics display correctly

### 8. Documentation 🔲

Update these docs:
- [ ] README - Add bundle information
- [ ] DEPLOYMENT.md - Add migration steps
- [ ] ADMIN_GUIDE - Add access management section

## Deployment Steps

### Prerequisites
1. Backup database
2. Test on staging environment first
3. Notify users of maintenance window if needed

### Step-by-Step Deployment

#### 1. Database Migration
```bash
# In Supabase SQL Editor
-- Run: supabase/migrations/user_app_access_table.sql
-- Verify: SELECT * FROM user_app_access LIMIT 1;
-- Verify: SELECT bundle_apps FROM payments LIMIT 1;
```

#### 2. Deploy Backend Changes
```bash
cd /home/runner/work/iiskills-cloud/iiskills-cloud

# The following files are already committed:
# - lib/bundleConfig.js
# - lib/accessManager.js
# - lib/hooks/useAccessControl.js
# - lib/api-templates/check-access.js
# - apps/learn-ai/pages/api/payment/confirm.js
# - apps/learn-developer/pages/api/payment/confirm.js

# Deploy check-access API to paid apps
cp lib/api-templates/check-access.js apps/learn-ai/pages/api/users/check-access.js
cp lib/api-templates/check-access.js apps/learn-developer/pages/api/users/check-access.js
cp lib/api-templates/check-access.js apps/learn-pr/pages/api/users/check-access.js
cp lib/api-templates/check-access.js apps/learn-management/pages/api/users/check-access.js
```

#### 3. Update Lesson Pages (TODO - Need to implement)
This requires careful updates to each app's lesson pages to use the new access control.

#### 4. Build and Deploy
```bash
# Build all apps
yarn build

# Deploy via PM2
pm2 restart ecosystem.config.js
```

#### 5. Smoke Test
- Test free app (learn-math) - should work without login
- Test paid app (learn-ai) - should require login/payment
- Test bundle - buy one, verify both unlocked

## Security Considerations

### Row-Level Security (RLS)
✅ Implemented in `user_app_access` table:
- Users can only view their own access records
- Admins can view all access records
- Service role (API) can manage all records

### API Security
✅ Payment confirmation uses server-side Supabase client with service role key
✅ Access check API verifies user session before granting access
✅ Bundle logic runs server-side, not client-side

### Environment Variables
⚠️ Ensure `SUPABASE_SERVICE_ROLE_KEY` is:
- Set only in server environment
- Never exposed to client
- Not committed to git

## Rollback Plan

If issues occur after deployment:

### 1. Revert Database
```sql
-- Drop new table
DROP TABLE IF EXISTS public.user_app_access;

-- Remove new column from payments
ALTER TABLE public.payments DROP COLUMN IF EXISTS bundle_apps;
```

### 2. Revert Code
```bash
git revert <commit-hash>
pm2 restart ecosystem.config.js
```

### 3. Re-enable Open Access
Set `NEXT_PUBLIC_DISABLE_AUTH=true` temporarily to bypass access control while investigating issues.

## Support & Troubleshooting

### Common Issues

**Issue**: Free app showing payment prompt
**Solution**: Verify `isFree: true` in lib/appRegistry.js for that app

**Issue**: Bundle not working
**Solution**: Check `grantBundleAccess()` logs, verify bundle_apps in payments table

**Issue**: Access check API failing
**Solution**: Verify SUPABASE_SERVICE_ROLE_KEY is set correctly

**Issue**: User has payment but no access
**Solution**: Run manual grant: `INSERT INTO user_app_access (user_id, app_id, granted_via) VALUES (...)`

## Monitoring

After deployment, monitor:
1. **Error logs**: Check for access control errors
2. **Payment confirmations**: Verify bundle logic working
3. **User complaints**: Quick response to access issues
4. **Database growth**: user_app_access table size

## Conclusion

This implementation provides:
- ✅ Clear separation of FREE vs PAID apps
- ✅ Bundle logic for AI-Developer combo
- ✅ Comprehensive access control
- ✅ Database-backed access tracking
- ✅ Admin visibility into user access
- ✅ Future-proof extensible design

Next steps: Complete lesson page updates and run comprehensive QA testing.

---
**Version**: 1.0.0  
**Last Updated**: 2026-02-18  
**Author**: iiskills-cloud team
