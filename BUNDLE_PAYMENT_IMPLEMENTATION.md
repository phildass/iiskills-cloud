# Learn AI + Learn Developer Bundle Payment Logic

## Requirement
When a user purchases **Learn AI** OR **Learn Developer** for Rs 99 (+ GST), they should receive access to **BOTH** apps.

## Current Pricing
- Introductory: ₹99 + GST (₹17.82) = ₹116.82 (valid until specified date)
- Regular: ₹299 + GST (₹53.82) = ₹352.82

## Implementation Specification

### 1. Database Schema Changes

#### Update `user_app_access` table (or create if not exists)
```sql
CREATE TABLE IF NOT EXISTS user_app_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  app_id VARCHAR(50) NOT NULL, -- 'learn-ai', 'learn-developer', etc.
  access_granted_at TIMESTAMP DEFAULT NOW(),
  granted_via VARCHAR(50), -- 'payment', 'bundle', 'otp', 'admin'
  payment_id UUID REFERENCES payments(id), -- If granted via payment
  expires_at TIMESTAMP, -- NULL for permanent access
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, app_id)
);

-- Index for fast user access checks
CREATE INDEX idx_user_app_access_user ON user_app_access(user_id, is_active);
CREATE INDEX idx_user_app_access_app ON user_app_access(app_id);
```

#### Update `payments` table
```sql
ALTER TABLE payments ADD COLUMN IF NOT EXISTS 
  bundle_apps TEXT[] DEFAULT NULL; -- Apps unlocked by this payment
```

### 2. Bundle Configuration

Location: `/lib/bundleConfig.js`

```javascript
export const APP_BUNDLES = {
  'ai-developer-bundle': {
    id: 'ai-developer-bundle',
    name: 'AI + Developer Bundle',
    description: 'Learn AI and Learn Developer - Two Apps for the Price of One',
    apps: ['learn-ai', 'learn-developer'],
    price: {
      introductory: 11682, // Rs 116.82 in paisa
      regular: 35282, // Rs 352.82 in paisa
    },
    features: [
      'Complete Learn AI course access',
      'Complete Learn Developer course access',
      'Shared progress tracking',
      'Universal certification',
      'Mentor Mode unlock at 30% completion',
    ],
  },
};

// App to bundle mapping
export const APP_TO_BUNDLE = {
  'learn-ai': 'ai-developer-bundle',
  'learn-developer': 'ai-developer-bundle',
};

export function getBundleForApp(appId) {
  const bundleId = APP_TO_BUNDLE[appId];
  return bundleId ? APP_BUNDLES[bundleId] : null;
}

export function getAppsInBundle(appId) {
  const bundle = getBundleForApp(appId);
  return bundle ? bundle.apps : [appId];
}
```

### 3. Payment Handler Updates

#### Update: `/apps/learn-ai/pages/api/payment/confirm.js`
#### Update: `/apps/learn-developer/pages/api/payment/confirm.js`

```javascript
import { getBundleForApp, getAppsInBundle } from '@lib/bundleConfig';
import { grantAppAccess } from '@lib/accessManager';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transactionId, email, amount, userId, appId } = req.body;

    // Verify payment with payment gateway
    const paymentVerified = await verifyPaymentWithGateway(transactionId, amount);
    
    if (!paymentVerified) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Get all apps that should be unlocked (bundle logic)
    const appsToUnlock = getAppsInBundle(appId);
    
    // Store payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        email,
        transaction_id: transactionId,
        amount,
        status: 'completed',
        app_id: appId,
        bundle_apps: appsToUnlock, // Store all apps unlocked by this payment
      })
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Grant access to all apps in bundle
    for (const app of appsToUnlock) {
      await grantAppAccess({
        userId,
        appId: app,
        grantedVia: 'payment',
        paymentId: payment.id,
      });
    }

    // Send confirmation email
    await sendBundleConfirmationEmail({
      email,
      apps: appsToUnlock,
      transactionId,
      amount,
    });

    return res.status(200).json({
      success: true,
      message: `Access granted to ${appsToUnlock.join(' and ')}`,
      appsUnlocked: appsToUnlock,
      payment: payment,
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### 4. Access Manager Library

Location: `/lib/accessManager.js`

```javascript
import { supabase } from './supabaseClient';

/**
 * Grant app access to a user
 */
export async function grantAppAccess({ userId, appId, grantedVia, paymentId = null, expiresAt = null }) {
  const { data, error } = await supabase
    .from('user_app_access')
    .upsert({
      user_id: userId,
      app_id: appId,
      granted_via: grantedVia,
      payment_id: paymentId,
      expires_at: expiresAt,
      is_active: true,
      access_granted_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,app_id',
    });

  if (error) {
    console.error('Error granting app access:', error);
    throw error;
  }

  return data;
}

/**
 * Check if user has access to an app
 */
export async function hasAppAccess(userId, appId) {
  const { data, error } = await supabase
    .from('user_app_access')
    .select('*')
    .eq('user_id', userId)
    .eq('app_id', appId)
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
    console.error('Error checking app access:', error);
    return false;
  }

  // Check if access is expired
  if (data && data.expires_at) {
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    if (now > expiresAt) {
      // Access expired
      await revokeAppAccess(userId, appId, 'expired');
      return false;
    }
  }

  return !!data;
}

/**
 * Get all apps a user has access to
 */
export async function getUserApps(userId) {
  const { data, error } = await supabase
    .from('user_app_access')
    .select('app_id, access_granted_at, granted_via')
    .eq('user_id', userId)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching user apps:', error);
    return [];
  }

  return data || [];
}

/**
 * Revoke app access
 */
export async function revokeAppAccess(userId, appId, reason = 'manual') {
  const { error } = await supabase
    .from('user_app_access')
    .update({
      is_active: false,
      revoked_at: new Date().toISOString(),
      revoke_reason: reason,
    })
    .eq('user_id', userId)
    .eq('app_id', appId);

  if (error) {
    console.error('Error revoking app access:', error);
    throw error;
  }
}
```

### 5. UI Updates

#### Payment Page Banner
Display bundle information prominently:

```jsx
<div className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-300 rounded-lg p-6 mb-8">
  <h3 className="text-2xl font-bold text-blue-900 mb-2">
    🎉 Special Bundle Offer!
  </h3>
  <p className="text-lg text-gray-800 mb-4">
    Purchase Learn AI or Learn Developer and get <strong>BOTH courses</strong> for the price of one!
  </p>
  <ul className="list-disc list-inside text-gray-700 space-y-1">
    <li>Complete access to both courses</li>
    <li>Shared progress tracking</li>
    <li>Universal certification</li>
    <li>One-time payment: ₹116.82 (introductory offer)</li>
  </ul>
</div>
```

#### Dashboard - Show All Accessible Apps
```jsx
const MyApps = () => {
  const [userApps, setUserApps] = useState([]);
  
  useEffect(() => {
    async function fetchUserApps() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const apps = await getUserApps(user.id);
        setUserApps(apps);
      }
    }
    fetchUserApps();
  }, []);
  
  return (
    <div>
      <h2>Your Apps</h2>
      {userApps.map(app => (
        <AppCard key={app.app_id} appId={app.app_id} />
      ))}
    </div>
  );
};
```

### 6. Migration Steps

1. **Create database tables** (run in Supabase SQL editor)
2. **Deploy bundleConfig.js** with bundle definitions
3. **Deploy accessManager.js** with access control functions
4. **Update payment confirmation handlers** in both apps
5. **Update landing pages** with bundle messaging
6. **Test payment flow** thoroughly:
   - Purchase Learn AI → verify both apps unlocked
   - Purchase Learn Developer → verify both apps unlocked
   - Verify email confirmation includes both apps
   - Verify dashboard shows both apps

### 7. Testing Checklist

- [ ] Database tables created successfully
- [ ] Bundle configuration loads correctly
- [ ] Payment from Learn AI unlocks both apps
- [ ] Payment from Learn Developer unlocks both apps
- [ ] User dashboard displays all accessible apps
- [ ] Email confirmation mentions both apps
- [ ] Access check works correctly across apps
- [ ] Payment record stores bundle information
- [ ] No double-charging if user already has one app
- [ ] Expiration logic works (if time-limited access added later)

### 8. Future Enhancements

- **Upgrade Path**: Allow users who previously bought only one app to pay the difference
- **Family Bundles**: Multiple user accounts with shared access
- **Course-Specific Bundles**: Bundle specific courses within an app
- **Time-Limited Bundles**: Promotional bundles with expiration
- **Volume Discounts**: Reduced price for purchasing multiple apps

## Related Documentation

- See `RAZORPAY_INTEGRATION_GUIDE.md` for payment gateway integration
- See `utils/pricing.js` for current pricing configuration
- See `components/shared/AIDevBundlePitch.js` for existing bundle messaging component
