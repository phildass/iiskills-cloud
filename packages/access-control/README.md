# @iiskills/access-control

Universal app access control system for iiskills.cloud with AI-Developer bundle logic.

## Overview

This package provides the single source of truth for:
- Which apps are free vs paid
- Which apps are bundled together
- User access verification
- Payment requirement checks
- Bundle unlock logic

## Installation

This package is part of the iiskills-cloud monorepo and is automatically available to all apps.

```bash
# In any app's package.json dependencies
"@iiskills/access-control": "workspace:*"
```

## Core Concepts

### Free Apps
Five apps are completely free and require no authentication or payment:
- learn-apt
- learn-chemistry
- learn-geography
- learn-math
- learn-physics

### Paid Apps
Five apps require payment:
- main (iiskills.cloud)
- learn-ai *(bundled)*
- learn-developer *(bundled)*
- learn-management
- learn-pr

### Bundles
The **AI-Developer Bundle** links `learn-ai` and `learn-developer`:
- Purchasing either app unlocks both
- Users pay once, get two apps
- Bundle status is tracked in database

## API Reference

### Access Control Functions

#### `isFreeApp(appId)`
Check if an app is free (no payment required).

```javascript
import { isFreeApp } from '@iiskills/access-control';

if (isFreeApp('learn-math')) {
  // Grant immediate access
}
```

#### `isBundleApp(appId)`
Check if an app is part of a bundle.

```javascript
import { isBundleApp } from '@iiskills/access-control';

if (isBundleApp('learn-ai')) {
  // This app is bundled with learn-developer
}
```

#### `requiresPayment(appId)`
Check if an app requires payment.

```javascript
import { requiresPayment } from '@iiskills/access-control';

if (requiresPayment('learn-developer')) {
  // Show payment flow
}
```

#### `userHasAccess(user, appId)`
Check if a user has access to an app (client-side check).

```javascript
import { userHasAccess } from '@iiskills/access-control';

const user = {
  id: 'user-uuid',
  app_access: [
    { app_id: 'learn-ai', is_active: true, granted_via: 'payment' },
    { app_id: 'learn-developer', is_active: true, granted_via: 'bundle' }
  ]
};

if (userHasAccess(user, 'learn-ai')) {
  // User has access!
}
```

### Database Operations

#### `hasAppAccess(userId, appId)`
Check user access with database query (server-side).

```javascript
import { hasAppAccess } from '@iiskills/access-control';

const hasAccess = await hasAppAccess('user-uuid', 'learn-ai');
```

#### `grantBundleAccess({ userId, purchasedAppId, paymentId })`
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

#### `getUserApps(userId)`
Get all apps a user has access to.

```javascript
import { getUserApps } from '@iiskills/access-control';

const status = await getUserApps('user-uuid');
// Returns:
// {
//   freeApps: ['learn-math', 'learn-physics', ...],
//   accessibleApps: ['learn-ai', 'learn-developer', ...],
//   bundleAccess: { ... },
//   totalAccess: 7
// }
```

### Helper Functions

#### `getBundleInfo(appId)`
Get bundle configuration for an app.

```javascript
import { getBundleInfo } from '@iiskills/access-control';

const bundle = getBundleInfo('learn-ai');
// Returns bundle object or null if not bundled
```

#### `getAppsToUnlock(appId)`
Get all apps that should be unlocked when purchasing an app.

```javascript
import { getAppsToUnlock } from '@iiskills/access-control';

const apps = getAppsToUnlock('learn-ai');
// Returns: ['learn-ai', 'learn-developer']
```

#### `getBundleAccessMessage(appId, purchasedAppId)`
Get congratulatory message for bundle access.

```javascript
import { getBundleAccessMessage } from '@iiskills/access-control';

const message = getBundleAccessMessage('learn-developer', 'learn-ai');
// Returns: "🎉 Congratulations! You unlocked Learn-Developer by purchasing Learn-AI..."
```

## Usage Examples

### In a Landing Page

```javascript
import { isFreeApp, requiresPayment, isBundleApp } from '@iiskills/access-control';

function LandingPage({ appId }) {
  if (isFreeApp(appId)) {
    return <FreeLanding appId={appId} />;
  }
  
  if (requiresPayment(appId)) {
    const isBundle = isBundleApp(appId);
    return <PaidLanding appId={appId} showBundleInfo={isBundle} />;
  }
}
```

### In a Payment Confirmation API

```javascript
import { grantBundleAccess, updatePaymentBundleInfo } from '@iiskills/access-control';

export default async function handler(req, res) {
  const { userId, appId, paymentId } = req.body;
  
  // Grant access (handles bundle logic automatically)
  const result = await grantBundleAccess({
    userId,
    purchasedAppId: appId,
    paymentId
  });
  
  // Update payment record with bundle info
  await updatePaymentBundleInfo(paymentId, result.bundledApps);
  
  res.json({
    success: true,
    accessGranted: result.bundledApps
  });
}
```

### In an Access Control Hook

```javascript
import { hasAppAccess } from '@iiskills/access-control';

export function useAccessControl(appId) {
  const [hasAccess, setHasAccess] = useState(false);
  
  useEffect(() => {
    async function checkAccess() {
      const user = await getCurrentUser();
      const access = await hasAppAccess(user?.id, appId);
      setHasAccess(access);
    }
    checkAccess();
  }, [appId]);
  
  return { hasAccess };
}
```

### In Admin Dashboard

```javascript
import { getAccessStats, APPS, BUNDLES } from '@iiskills/access-control';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    async function fetchStats() {
      const data = await getAccessStats();
      setStats(data);
    }
    fetchStats();
  }, []);
  
  return (
    <div>
      <h2>Access Statistics</h2>
      <p>Total Active Access: {stats?.total}</p>
      <h3>By Grant Type:</h3>
      <ul>
        {Object.entries(stats?.byGrantType || {}).map(([type, count]) => (
          <li key={type}>{type}: {count}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Bundle Logic Flow

When a user purchases `learn-ai`:

1. Payment is captured by Razorpay
2. Webhook calls `grantBundleAccess({ userId, purchasedAppId: 'learn-ai', paymentId })`
3. Package checks bundle config and identifies `['learn-ai', 'learn-developer']`
4. Creates access records:
   - `learn-ai` with `granted_via: 'payment'`
   - `learn-developer` with `granted_via: 'bundle'`
5. Updates payment record with `bundle_apps: ['learn-ai', 'learn-developer']`
6. User now has access to both apps!

## Migration from Old Code

Replace scattered access logic:

### Before (scattered)
```javascript
// In multiple files...
const app = APPS[appId];
if (app && app.isFree) { /* ... */ }

// Elsewhere...
const bundle = getBundleForApp(appId);
if (bundle) { /* ... */ }
```

### After (centralized)
```javascript
import { isFreeApp, isBundleApp } from '@iiskills/access-control';

if (isFreeApp(appId)) { /* ... */ }
if (isBundleApp(appId)) { /* ... */ }
```

## Testing

All access control scenarios should be tested:

- Free app access (no auth required)
- Paid app access (auth + payment required)
- Bundle unlock (purchase one, get both)
- Expired access handling
- Admin override capabilities

See `/tests/e2e/access-control/` for comprehensive tests.

## Security

- Free apps: Always accessible (no bypass needed)
- Paid apps: Must verify access from database
- Bundle logic: Automatically enforced at grant time
- Failed checks: Always deny access (fail closed)

## License

MIT
