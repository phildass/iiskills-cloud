# Access Control Quick Reference

> **TL;DR:** Use `@iiskills/access-control` for all app access logic. Five apps are free, five require payment. Learn-AI and Learn-Developer are bundled (buy one, get both).

## Import

```javascript
import { 
  isFreeApp, 
  isBundleApp, 
  requiresPayment, 
  userHasAccess,
  getBundleInfo,
  getAppsToUnlock,
} from '@iiskills/access-control';
```

## Free vs Paid

```javascript
// Check if app is free
if (isFreeApp('learn-math')) {
  // ✅ No payment needed
}

// Check if payment required
if (requiresPayment('learn-ai')) {
  // 💳 Show payment page
}
```

## Bundle Logic

```javascript
// Check if app is bundled
if (isBundleApp('learn-ai')) {
  // 🎁 This app is part of a bundle
}

// Get bundle info
const bundle = getBundleInfo('learn-ai');
console.log(bundle.highlight);
// "🎉 Special Offer: Get BOTH courses for the price of one!"

// Get apps that will be unlocked
const apps = getAppsToUnlock('learn-ai');
// Returns: ['learn-ai', 'learn-developer']
```

## User Access Check (Client-Side)

```javascript
// User object must include app_access array
const user = {
  id: 'uuid',
  app_access: [
    { app_id: 'learn-ai', is_active: true, granted_via: 'payment' },
    { app_id: 'learn-developer', is_active: true, granted_via: 'bundle' }
  ]
};

if (userHasAccess(user, 'learn-ai')) {
  // ✅ User has access
}
```

## Database Operations (Server-Side)

```javascript
import { 
  hasAppAccess, 
  grantBundleAccess,
  getUserApps 
} from '@iiskills/access-control';

// Check access
const access = await hasAppAccess(userId, 'learn-ai');

// Grant bundle access after payment
const result = await grantBundleAccess({
  userId: 'uuid',
  purchasedAppId: 'learn-ai',
  paymentId: 'payment-uuid'
});
// This grants BOTH learn-ai and learn-developer

// Get all user apps
const status = await getUserApps(userId);
console.log(status.accessibleApps);
console.log(status.bundleAccess);
```

## App Definitions

### Free Apps (5)
✅ No payment required, no authentication needed
- `learn-apt`
- `learn-chemistry`
- `learn-geography`
- `learn-math`
- `learn-physics`

### Paid Apps (5)
💳 Payment required
- `main` (iiskills.cloud)
- `learn-ai` 🎁 (bundled with learn-developer)
- `learn-developer` 🎁 (bundled with learn-ai)
- `learn-management`
- `learn-pr`

## Payment Confirmation Example

```javascript
// In pages/api/payment/confirm.js
import { 
  grantBundleAccess, 
  updatePaymentBundleInfo,
  getAppsToUnlock,
  getBundleInfo 
} from '@iiskills/access-control';

export default async function handler(req, res) {
  const { userId, appId, paymentId } = req.body;
  
  // Get apps to unlock
  const appsToUnlock = getAppsToUnlock(appId);
  const bundleInfo = getBundleInfo(appId);
  
  // Grant access (handles bundle automatically)
  const result = await grantBundleAccess({
    userId,
    purchasedAppId: appId,
    paymentId
  });
  
  // Update payment record
  await updatePaymentBundleInfo(paymentId, result.bundledApps);
  
  // Return success
  res.json({
    success: true,
    apps_unlocked: result.bundledApps,
    message: bundleInfo 
      ? `🎉 ${bundleInfo.highlight}`
      : 'Payment confirmed!',
  });
}
```

## Landing Page Example

```javascript
import { isFreeApp, isBundleApp, getBundleInfo } from '@iiskills/access-control';

function AppLandingPage({ appId }) {
  const isFree = isFreeApp(appId);
  const isBundle = isBundleApp(appId);
  const bundleInfo = isBundle ? getBundleInfo(appId) : null;
  
  return (
    <div>
      {/* Badge */}
      {isFree ? (
        <span className="bg-green-500 text-white px-3 py-1 rounded">
          FREE
        </span>
      ) : (
        <span className="bg-blue-600 text-white px-3 py-1 rounded">
          PAID
        </span>
      )}
      
      {/* Bundle callout */}
      {isBundle && (
        <div className="mt-4 p-4 bg-purple-50 border-l-4 border-purple-500">
          <p className="font-bold text-purple-900">{bundleInfo.highlight}</p>
          <p className="text-purple-700">{bundleInfo.description}</p>
          <div className="mt-2">
            <span className="text-sm font-medium">Includes:</span>
            <ul className="list-disc ml-5 mt-1">
              {bundleInfo.apps.map(id => (
                <li key={id}>{id}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Access Control Hook Example

```javascript
import { useEffect, useState } from 'react';
import { isFreeApp } from '@iiskills/access-control';

export function useAccessControl(appId) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function checkAccess() {
      // Free apps always have access
      if (isFreeApp(appId)) {
        setHasAccess(true);
        setLoading(false);
        return;
      }
      
      // For paid apps, check with API
      const response = await fetch(`/api/users/check-access?appId=${appId}`);
      const data = await response.json();
      setHasAccess(data.hasAccess);
      setLoading(false);
    }
    
    checkAccess();
  }, [appId]);
  
  return { hasAccess, loading };
}
```

## Admin Dashboard

Access: `/admin/access-control`

Features:
- View all access stats
- See bundle status
- Search users
- Grant/revoke access manually
- View payment history

## Testing

```bash
# Test package functions
node -e "
const { isFreeApp, isBundleApp } = require('./packages/access-control/accessControl.js');
console.log('learn-math is free:', isFreeApp('learn-math'));
console.log('learn-ai is bundled:', isBundleApp('learn-ai'));
"

# Run E2E tests
yarn test:e2e tests/e2e/access-control
```

## Common Patterns

### ✅ DO

```javascript
// Use the package
import { isFreeApp } from '@iiskills/access-control';
if (isFreeApp(appId)) { /* ... */ }

// Check user access
import { userHasAccess } from '@iiskills/access-control';
if (userHasAccess(user, appId)) { /* ... */ }

// Grant bundle access
import { grantBundleAccess } from '@iiskills/access-control';
await grantBundleAccess({ userId, purchasedAppId, paymentId });
```

### ❌ DON'T

```javascript
// Don't manually check app type
if (appId === 'learn-math' || appId === 'learn-physics') { /* ... */ }

// Don't manually implement bundle logic
if (appId === 'learn-ai') {
  grantAccess('learn-ai');
  grantAccess('learn-developer'); // Use grantBundleAccess instead!
}

// Don't use old imports (they work but are deprecated)
import { getAppsInBundle } from '@/lib/bundleConfig'; // Use @iiskills/access-control
```

## Need Help?

- 📖 Full docs: `UNIVERSAL_ACCESS_CONTROL.md`
- 📦 Package README: `packages/access-control/README.md`
- 🧪 Tests: `tests/e2e/access-control/`
- 👨‍💼 Admin: `/admin/access-control`
