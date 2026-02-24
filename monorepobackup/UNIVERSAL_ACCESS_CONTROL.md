# Universal App Access Control Implementation

**Version:** 1.0.0  
**Date:** 2026-02-18  
**Status:** ✅ Implemented  

## Overview

This document describes the universal app access control system implemented for iiskills.cloud. The system provides centralized management of app access, payment requirements, and bundle logic across all 10 active applications.

## Table of Contents

1. [Architecture](#architecture)
2. [Core Package](#core-package)
3. [Bundle Logic](#bundle-logic)
4. [API Reference](#api-reference)
5. [Integration Guide](#integration-guide)
6. [Admin Dashboard](#admin-dashboard)
7. [Testing](#testing)
8. [Migration Notes](#migration-notes)

---

## Architecture

### Single Source of Truth

The `@iiskills/access-control` package is the single source of truth for:
- Free vs Paid app definitions
- Bundle relationships
- Access control logic
- Payment integration
- User access verification

### Key Components

```
packages/access-control/
├── package.json          # Package metadata
├── README.md            # Package documentation
├── index.js             # Main exports
├── appConfig.js         # App and bundle definitions
├── accessControl.js     # Core access control functions
└── dbAccessManager.js   # Database integration layer
```

### Design Principles

1. **Centralized Logic**: All access control decisions made in one place
2. **Bundle-First**: Bundle logic automatically enforced at grant time
3. **Fail Closed**: Unknown apps require payment by default
4. **Backward Compatible**: Existing code continues to work
5. **Type Safe**: Clear function signatures and return types

---

## Core Package

### Installation

The package is automatically available in all apps via the monorepo workspace:

```json
{
  "dependencies": {
    "@iiskills/access-control": "workspace:*"
  }
}
```

### App Configuration

All apps are defined in `appConfig.js`:

**Free Apps (5):**
- learn-apt
- learn-chemistry
- learn-geography
- learn-math
- learn-physics

**Paid Apps (5):**
- main (iiskills.cloud)
- learn-ai *(bundled)*
- learn-developer *(bundled)*
- learn-management
- learn-pr

### Bundle Definitions

**AI-Developer Bundle:**
- Apps: `learn-ai` + `learn-developer`
- Price: ₹116.82 (introductory), ₹352.82 (regular)
- Special Offer: Purchase one, get both!

---

## Bundle Logic

### How Bundles Work

1. User purchases `learn-ai` OR `learn-developer`
2. Payment is captured by Razorpay
3. `grantBundleAccess()` is called with the purchased app
4. System identifies bundle and unlocks ALL apps:
   - `learn-ai` with `granted_via: 'payment'`
   - `learn-developer` with `granted_via: 'bundle'`
5. Payment record updated with `bundle_apps` array
6. User gets congratulatory message about unlocked apps

### Database Schema

**user_app_access table:**
```sql
- user_id (uuid)
- app_id (text)
- granted_via (text: payment|bundle|otp|admin|free)
- payment_id (uuid, nullable)
- expires_at (timestamp, nullable)
- is_active (boolean)
- access_granted_at (timestamp)
- revoked_at (timestamp, nullable)
- revoke_reason (text, nullable)
```

**payments table:**
```sql
- id (uuid)
- payment_id (text, from Razorpay)
- app_id (text)
- bundle_apps (text[], NEW!)
- user_id (uuid)
- amount (integer, in paisa)
- status (text)
- created_at (timestamp)
```

---

## API Reference

### Core Functions

#### `isFreeApp(appId: string): boolean`

Check if an app is free (no payment required).

```javascript
import { isFreeApp } from '@iiskills/access-control';

if (isFreeApp('learn-math')) {
  // Grant immediate access
}
```

#### `isBundleApp(appId: string): boolean`

Check if an app is part of a bundle.

```javascript
import { isBundleApp } from '@iiskills/access-control';

if (isBundleApp('learn-ai')) {
  // Show bundle information on payment page
}
```

#### `requiresPayment(appId: string): boolean`

Check if an app requires payment (returns false for free apps).

```javascript
import { requiresPayment } from '@iiskills/access-control';

if (requiresPayment('learn-developer')) {
  // Show payment flow
}
```

#### `userHasAccess(user: Object, appId: string): boolean`

Check if a user has access to an app (client-side check).

```javascript
import { userHasAccess } from '@iiskills/access-control';

const user = {
  id: 'uuid',
  app_access: [{ app_id: 'learn-ai', is_active: true }]
};

if (userHasAccess(user, 'learn-ai')) {
  // Grant access to content
}
```

#### `getBundleInfo(appId: string): Object|null`

Get bundle configuration for an app.

```javascript
import { getBundleInfo } from '@iiskills/access-control';

const bundle = getBundleInfo('learn-ai');
// Returns: { id, name, apps, price, features, highlight }
```

#### `getAppsToUnlock(appId: string): string[]`

Get all apps that should be unlocked when purchasing an app.

```javascript
import { getAppsToUnlock } from '@iiskills/access-control';

const apps = getAppsToUnlock('learn-ai');
// Returns: ['learn-ai', 'learn-developer']
```

### Database Functions

#### `hasAppAccess(userId: string, appId: string): Promise<boolean>`

Check user access with database query (server-side).

```javascript
import { hasAppAccess } from '@iiskills/access-control';

const access = await hasAppAccess('user-uuid', 'learn-ai');
```

#### `grantBundleAccess(params: Object): Promise<Object>`

Grant access to all apps in a bundle after payment.

```javascript
import { grantBundleAccess } from '@iiskills/access-control';

const result = await grantBundleAccess({
  userId: 'user-uuid',
  purchasedAppId: 'learn-ai',
  paymentId: 'payment-uuid'
});

// Returns:
// {
//   accessRecords: [...],
//   bundledApps: ['learn-ai', 'learn-developer'],
//   purchasedApp: 'learn-ai',
//   unlockedApps: ['learn-developer']
// }
```

#### `getUserApps(userId: string): Promise<Object>`

Get all apps a user has access to.

```javascript
import { getUserApps } from '@iiskills/access-control';

const status = await getUserApps('user-uuid');
// Returns:
// {
//   freeApps: [...],
//   accessibleApps: [...],
//   bundleAccess: { ... },
//   totalAccess: 7
// }
```

---

## Integration Guide

### In Payment Confirmation

Update payment confirmation endpoints to use the new package:

```javascript
import { 
  grantBundleAccess, 
  updatePaymentBundleInfo,
  getAppsToUnlock,
  getBundleInfo,
} from '@iiskills/access-control';

// After payment verification...
const appsToUnlock = getAppsToUnlock(appId);
const bundleInfo = getBundleInfo(appId);

// Grant access
const result = await grantBundleAccess({
  userId,
  purchasedAppId: appId,
  paymentId: payment.id,
});

// Update payment record
await updatePaymentBundleInfo(payment.id, result.bundledApps);

// Return success with bundle info
return res.json({
  success: true,
  apps_unlocked: result.bundledApps,
  message: bundleInfo 
    ? `🎉 ${bundleInfo.highlight} You now have access to ${appsToUnlock.join(' AND ')}!`
    : `Payment confirmed!`,
  bundle_info: bundleInfo,
});
```

### In Access Control Hooks

Use the package in React hooks:

```javascript
import { isFreeApp } from '@iiskills/access-control';

export function useAccessControl(appId) {
  // ... existing code ...
  
  // Check if app is free
  if (isFreeApp(appId)) {
    setHasAccess(true);
    return;
  }
  
  // ... rest of logic ...
}
```

### In Landing Pages

Show appropriate messaging based on app type:

```javascript
import { isFreeApp, isBundleApp, getBundleInfo } from '@iiskills/access-control';

function LandingPage({ appId }) {
  const isFree = isFreeApp(appId);
  const isBundle = isBundleApp(appId);
  const bundleInfo = isBundle ? getBundleInfo(appId) : null;
  
  return (
    <div>
      {isFree ? (
        <span className="bg-green-500 text-white px-4 py-2 rounded">FREE</span>
      ) : (
        <span className="bg-blue-600 text-white px-4 py-2 rounded">PAID</span>
      )}
      
      {isBundle && (
        <div className="bg-purple-50 border-purple-500 p-4 mt-4">
          <p className="text-purple-900 font-bold">{bundleInfo.highlight}</p>
          <p className="text-purple-700">{bundleInfo.description}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Admin Dashboard

### Access

Navigate to: `/admin/access-control`

**Requires:** Admin privileges (is_admin = true in profiles table)

### Features

1. **Statistics Overview**
   - Total Active Access
   - Via Payment
   - Via Bundle
   - Admin Grants

2. **Bundle Information Display**
   - Shows all active bundles
   - Lists apps in each bundle
   - Displays bundle highlights

3. **Access by App**
   - Grid view of all apps
   - FREE/PAID/BUNDLE badges
   - User count per app

4. **User Management**
   - Search users by email
   - View user's app access
   - See granted_via for each app
   - View payment information
   - Manual access grant/revoke

### Manual Overrides

Admins can:
- **Grant Access**: Give any user access to any paid app
- **Revoke Access**: Remove access with reason tracking
- Access is logged as `granted_via: 'admin'`

---

## Testing

### Unit Tests

Core package functions are tested:

```bash
node -e "
const { isFreeApp, isBundleApp, requiresPayment } = require('./packages/access-control/accessControl.js');
console.log('isFreeApp(learn-math):', isFreeApp('learn-math'));
console.log('isBundleApp(learn-ai):', isBundleApp('learn-ai'));
console.log('requiresPayment(learn-ai):', requiresPayment('learn-ai'));
"
```

### E2E Tests

Located in `tests/e2e/access-control/access-control.spec.js`:

- ✅ Free apps accessible without authentication
- ✅ Paid apps require authentication
- ✅ Bundle configuration correct
- ✅ Package functions work correctly
- ⏸️ Payment flow (requires test gateway)
- ⏸️ Admin dashboard (requires admin account)

Run with:
```bash
yarn test:e2e tests/e2e/access-control
```

### Manual Testing Checklist

- [ ] Free app landing pages show green FREE badge
- [ ] Paid app landing pages show blue PAID badge
- [ ] Bundle apps show purple BUNDLE badge
- [ ] Payment for learn-ai unlocks learn-developer
- [ ] Payment for learn-developer unlocks learn-ai
- [ ] Payment confirmation message mentions bundle
- [ ] Admin dashboard shows correct stats
- [ ] Admin can grant/revoke access
- [ ] Bundle access shows as "granted_via: bundle"

---

## Migration Notes

### Backward Compatibility

Old code continues to work:
- `lib/accessManager.js` → Re-exports from package
- `lib/bundleConfig.js` → Re-exports from package
- Existing API endpoints work unchanged

### Deprecation Warnings

Files marked as deprecated:
- `lib/accessManager.js`
- `lib/bundleConfig.js`

**New code should import from:** `@iiskills/access-control`

### Breaking Changes

**None!** All changes are backward compatible.

### Updated Files

1. **lib/accessManager.js** - Now re-exports from package
2. **lib/bundleConfig.js** - Now re-exports from package
3. **lib/hooks/useAccessControl.js** - Uses `isFreeApp()` from package
4. **lib/api-templates/check-access.js** - Uses package functions
5. **apps/learn-ai/pages/api/payment/confirm.js** - Enhanced bundle messaging
6. **apps/learn-developer/pages/api/payment/confirm.js** - Enhanced bundle messaging

### New Files

1. **packages/access-control/** - Complete package
2. **apps/main/pages/admin/access-control.js** - Admin dashboard
3. **tests/e2e/access-control/access-control.spec.js** - E2E tests

---

## Security Considerations

### Free Apps
- ✅ Always accessible (no bypass needed)
- ✅ No authentication required
- ✅ No payment checks

### Paid Apps
- ✅ Require authentication
- ✅ Verify access from database
- ✅ Fail closed (deny on error)

### Bundle Logic
- ✅ Automatically enforced at grant time
- ✅ Payment record includes bundle_apps array
- ✅ Audit trail: granted_via field tracks source

### Admin Overrides
- ✅ Require admin privileges
- ✅ Logged as granted_via: 'admin'
- ✅ Can be revoked with reason

---

## Key Benefits

1. **No More Scattered Logic**: All access control in one place
2. **Automatic Bundle Handling**: Purchase one app = unlock bundle
3. **Clear Audit Trail**: granted_via field shows access source
4. **Easy to Extend**: Add new bundles or apps easily
5. **Admin Control**: Full visibility and manual override capability
6. **Type Safety**: Clear function signatures
7. **Tested**: Core functions verified
8. **Backward Compatible**: No breaking changes

---

## Future Enhancements

Potential improvements:

1. **Time-Limited Access**: Implement expiration for promotional periods
2. **Subscription Tiers**: Add bronze/silver/gold tiers
3. **Family Plans**: Multi-user access from single payment
4. **Gift Codes**: Generate and redeem gift access
5. **Usage Analytics**: Track which apps users actually use
6. **Revenue Dashboard**: Show payment/bundle revenue breakdown
7. **Email Notifications**: Auto-send bundle unlock emails

---

## Support

For questions or issues:
- Check package README: `packages/access-control/README.md`
- Review tests: `tests/e2e/access-control/`
- Admin dashboard: `/admin/access-control`

---

**Maintained By:** AI Cloud Enterprises  
**Last Updated:** 2026-02-18  
**Version:** 1.0.0
