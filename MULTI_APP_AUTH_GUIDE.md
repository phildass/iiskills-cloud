# Multi-App Authentication System Guide

## Overview

The iiskills.cloud platform implements a sophisticated multi-app authentication system that enables users to:
- Register once and access all available apps
- Navigate seamlessly between apps without re-authentication
- Experience app-specific features while maintaining a unified identity
- Enjoy automatic session persistence across all subdomains

## Architecture

### Core Components

#### 1. App Registry (`lib/appRegistry.js`)
Centralized configuration for all apps in the ecosystem.

**Key Features:**
- Defines app metadata (name, domain, ports, redirects)
- Provides utilities to query app information
- Manages app-specific features and access control
- Supports both development (localhost) and production (domains)

**Example Usage:**
```javascript
import { getCurrentApp, getAppById, getAccessibleApps } from '../lib/appRegistry';

// Get current app configuration
const app = getCurrentApp();
console.log(app.name); // "Learn-Jee"
console.log(app.postLoginRedirect); // "/learn"

// Get app by ID
const mainApp = getAppById('main');

// Get apps accessible to a user
const apps = getAccessibleApps(user, isAdmin);
```

#### 2. Session Manager (`lib/sessionManager.js`)
Manages user sessions across multiple apps.

**Key Features:**
- Tracks last visited app
- Records user's preferred app
- Provides intelligent redirect logic after authentication
- Manages app navigation with session preservation

**Example Usage:**
```javascript
import { recordAppVisit, getBestAuthRedirect, navigateToApp } from '../lib/sessionManager';

// Record app visit (automatically called)
recordAppVisit();

// Get best redirect after login
const redirect = getBestAuthRedirect();
console.log(redirect.appId); // 'learn-jee'
console.log(redirect.path); // '/learn'

// Navigate to another app
navigateToApp('learn-neet', '/courses');
```

#### 3. Enhanced Authentication Components

**UniversalLogin** (`components/shared/UniversalLogin.js`)
- Now uses app registry for dynamic redirects
- Records login app for proper OAuth callbacks
- Supports intelligent redirect based on user preferences

**UniversalRegister** (`components/shared/UniversalRegister.js`)
- Integrates with app registry for post-registration flow
- Records registration app for seamless onboarding
- Redirects to appropriate app after registration

**AppSwitcher** (`components/shared/AppSwitcher.js`)
- Dropdown UI for app navigation
- Shows only accessible apps (based on user permissions)
- Highlights current app
- Preserves authentication on navigation

## How It Works

### Authentication Flow

#### 1. User Signs In on Any App

```
User visits learn-jee.iiskills.cloud/login
  ↓
UniversalLogin records: "login initiated on learn-jee"
  ↓
User enters credentials or uses OAuth
  ↓
Supabase authenticates and creates session
  ↓
Session cookie set with domain: .iiskills.cloud
  ↓
App Registry determines best redirect: /learn
  ↓
User redirected to learn-jee.iiskills.cloud/learn
```

#### 2. User Navigates to Another App

```
User clicks link to learn-neet.iiskills.cloud
  ↓
Browser sends session cookie (domain: .iiskills.cloud)
  ↓
learn-neet app validates session with Supabase
  ↓
User automatically authenticated
  ↓
Content displayed without re-login
```

### OAuth Flow (Google Sign-In)

```
User clicks "Sign in with Google" on learn-jee
  ↓
recordLoginApp('learn-jee') called
  ↓
OAuth redirect URL: learn-jee.iiskills.cloud/learn
  ↓
User authenticates with Google
  ↓
Google redirects back to learn-jee.iiskills.cloud/learn
  ↓
Session created, user stays on learn-jee
```

### Intelligent Redirect Logic

The system uses a priority-based redirect algorithm:

1. **Explicit redirect parameter** (e.g., `?redirect=/courses`)
2. **App where login was initiated** (recorded in localStorage)
3. **User's preferred app** (if set)
4. **Current app** (from app registry)
5. **Main app** (fallback)

## Configuration

### Adding a New App

Follow these steps to add a new app to the ecosystem:

#### Step 1: Add to App Registry

Edit `lib/appRegistry.js`:

```javascript
export const APPS = {
  // ... existing apps
  'learn-newcourse': {
    id: 'learn-newcourse',
    name: 'Learn-New Course',
    subdomain: 'learn-newcourse',
    primaryDomain: 'learn-newcourse.iiskills.cloud',
    localPort: 3020, // Choose unused port
    postLoginRedirect: '/learn',
    postRegisterRedirect: '/learn',
    features: ['simplified-registration', 'courses'],
    isFree: false, // Set to true if free
  },
};
```

#### Step 2: Create App Structure

```bash
# Copy existing app as template
cp -r apps/learn-jee apps/learn-newcourse

# Update package.json
cd apps/learn-newcourse
# Edit name, description, etc.
```

#### Step 3: Use Universal Components

Ensure your login and register pages use the universal components:

**`apps/learn-newcourse/pages/login.js`:**
```javascript
import UniversalLogin from '../../components/shared/UniversalLogin';

export default function Login() {
  return (
    <UniversalLogin
      redirectAfterLogin="/learn"
      appName="Learn-New Course"
      showMagicLink={true}
      showGoogleAuth={true}
    />
  );
}
```

**`apps/learn-newcourse/pages/register.js`:**
```javascript
import UniversalRegister from '../../components/shared/UniversalRegister';

export default function Register() {
  return (
    <UniversalRegister
      simplified={true}
      redirectAfterRegister="/login"
      appName="Learn-New Course"
      showGoogleAuth={true}
    />
  );
}
```

#### Step 4: Configure Environment Variables

Create `.env.local` in the app directory:

```bash
# Same Supabase credentials as all other apps
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Cookie domain for cross-subdomain sessions
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
```

#### Step 5: Configure Supabase Callback URLs

In Supabase Dashboard → Authentication → URL Configuration, add:

**Development:**
```
http://localhost:3020/*
```

**Production:**
```
https://learn-newcourse.iiskills.cloud/*
https://*.iiskills.cloud/* (if using wildcard)
```

#### Step 6: Update PM2/Deployment Config

Edit `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    // ... existing apps
    {
      name: "iiskills-learn-newcourse",
      script: "node_modules/.bin/next",
      args: "start -p 3020",
      cwd: "/root/iiskills-cloud/apps/learn-newcourse",
      env: { NODE_ENV: "production" }
    },
  ]
};
```

#### Step 7: Configure DNS (Production)

Add DNS record for the subdomain:
```
Type: A or CNAME
Name: learn-newcourse
Value: [Your server IP or main domain]
```

#### Step 8: Test

1. **Development:**
   ```bash
   cd apps/learn-newcourse
   npm run dev
   ```
   Visit: `http://localhost:3020`

2. **Test Authentication:**
   - Register on new app
   - Login on new app
   - Navigate to existing app → should be authenticated
   - Navigate back → should still be authenticated

3. **Test OAuth:**
   - Click "Sign in with Google"
   - Verify redirect returns to correct app

## Session Management

### Cross-Domain Session Sharing

Sessions are shared via cookies with domain `.iiskills.cloud`:

```javascript
// Configured in lib/supabaseClient.js
cookieOptions: {
  domain: '.iiskills.cloud',  // Leading dot enables wildcard
  secure: true,               // HTTPS only in production
  sameSite: 'lax'            // Allows cross-site navigation
}
```

**What this means:**
- ✅ Login on any app → Authenticated on all apps
- ✅ Logout on any app → Logged out everywhere
- ✅ Session persists across browser tabs
- ✅ Works with OAuth providers (Google, etc.)

### Session Storage

The system uses multiple storage mechanisms:

1. **Supabase Session (cookies)** - Authentication state
2. **localStorage** - App preferences and history
3. **Supabase Database** - User profile and metadata

**localStorage Keys:**
- `iiskills_last_app` - Last visited app
- `iiskills_preferred_app` - User's preferred app
- `iiskills_app_history` - App visit history
- `iiskills_last_login_app` - App where login was initiated

## App Navigation

### Using AppSwitcher Component

Add to your navigation:

```javascript
import AppSwitcher from '../components/shared/AppSwitcher';

function Navigation() {
  return (
    <nav>
      <div className="flex items-center space-x-4">
        {/* Other nav items */}
        <AppSwitcher />
      </div>
    </nav>
  );
}
```

### Programmatic Navigation

```javascript
import { navigateToApp } from '../lib/sessionManager';

// Navigate to another app
function handleAppSwitch() {
  navigateToApp('learn-neet', '/courses');
}
```

### Deep Linking

Link directly to specific pages in other apps:

```javascript
import { getAppUrl } from '../lib/appRegistry';

// Generate URL for another app
const url = getAppUrl('learn-jee', '/courses/physics');
// Result: https://learn-jee.iiskills.cloud/courses/physics
```

## Security Considerations

### Authentication Tokens

- ✅ Tokens stored securely in httpOnly cookies (when configured)
- ✅ Tokens auto-refresh via Supabase
- ✅ Tokens validated on every request
- ✅ Invalid tokens trigger automatic logout

### HTTPS Requirement

⚠️ **Production must use HTTPS** for secure cookies.

In development (localhost), HTTP is acceptable, but:
- OAuth may not work properly
- Cookie security is reduced
- Session sharing may be limited

### Admin Access

Admin access is controlled via:
1. Database flag: `profiles.is_admin = true`
2. Hardcoded emails in `lib/supabaseClient.js`
3. Protected routes using `ProtectedRoute` component

**Never expose admin links in public navigation.**

### Payment/Subscription Checks

Currently, the system supports:
- Free apps (accessible to all authenticated users)
- Paid apps (require payment verification)

**TODO:** Implement payment verification:
```javascript
// In getAccessibleApps()
if (user.subscription_status === 'active') {
  // Grant access to paid apps
}
```

## Troubleshooting

### Issue: User Not Authenticated After Navigating

**Symptoms:**
- Login on app1, navigate to app2, not authenticated

**Possible Causes:**
1. Cookie domain not set to `.iiskills.cloud`
2. HTTPS not enabled in production
3. Browser blocking third-party cookies

**Solutions:**
1. Check `lib/supabaseClient.js` cookie configuration
2. Enable HTTPS on all domains
3. Test in different browser/incognito mode

### Issue: OAuth Redirect Goes to Wrong App

**Symptoms:**
- Login on learn-jee, OAuth returns to main app

**Possible Causes:**
1. Login app not recorded properly
2. Redirect URL not configured correctly

**Solutions:**
1. Verify `recordLoginApp()` is called in UniversalLogin
2. Check OAuth redirect URL in Supabase dashboard
3. Clear localStorage and try again

### Issue: App Not Listed in Registry

**Symptoms:**
- New app doesn't appear in AppSwitcher

**Solutions:**
1. Verify app added to `APPS` object in `lib/appRegistry.js`
2. Check app has correct `isFree` flag
3. Verify user has access (free apps vs paid)
4. Clear browser cache and reload

## API Reference

### App Registry

**`getAppById(appId)`**
- Returns app configuration by ID
- Returns `null` if not found

**`getAppBySubdomain(subdomain)`**
- Returns app configuration by subdomain
- Handles main domain (no subdomain)

**`getCurrentApp()`**
- Returns current app based on hostname/port
- Works in both client and server

**`getAccessibleApps(user, isAdmin)`**
- Returns array of apps user can access
- Considers free/paid status and admin role

**`getAuthRedirectUrl(context)`**
- Returns redirect path for auth context
- Context: 'login' or 'register'

**`getAppUrl(appId, path)`**
- Generates full URL for an app
- Handles development vs production

### Session Manager

**`recordAppVisit()`**
- Records current app as visited
- Updates app history

**`getLastVisitedApp()`**
- Returns last visited app configuration

**`setPreferredApp(appId)`**
- Sets user's preferred app

**`getBestAuthRedirect(explicitRedirect)`**
- Returns best redirect after authentication
- Uses priority-based algorithm

**`navigateToApp(appId, path)`**
- Navigates to another app
- Preserves authentication

**`isSessionValid()`**
- Checks if session is still valid
- Returns Promise<boolean>

## Best Practices

### 1. Always Use App Registry

❌ **Don't hardcode domains:**
```javascript
// Bad
window.location.href = 'https://learn-jee.iiskills.cloud/learn';
```

✅ **Use app registry:**
```javascript
// Good
import { navigateToApp } from '../lib/sessionManager';
navigateToApp('learn-jee', '/learn');
```

### 2. Record User Intent

❌ **Don't assume redirect:**
```javascript
// Bad - always redirects to /dashboard
router.push('/dashboard');
```

✅ **Use intelligent redirect:**
```javascript
// Good - respects user's intended destination
const redirect = getBestAuthRedirect(router.query.redirect);
router.push(redirect.path);
```

### 3. Handle All Auth Methods

✅ **Support multiple methods:**
```javascript
<UniversalLogin
  showMagicLink={true}
  showGoogleAuth={true}
  // All methods supported
/>
```

### 4. Test Cross-App Flow

Always test:
- ✅ Register on app1 → Login on app2
- ✅ Login on app1 → Navigate to app2
- ✅ OAuth on app1 → Redirect to app1
- ✅ Logout on app1 → Logged out on app2

## Future Enhancements

### Planned Features

1. **Mobile App Integration**
   - React Native apps using same authentication
   - Deep linking from mobile to web
   - Push notifications

2. **Advanced Subscription Management**
   - Per-app subscriptions
   - Bundle subscriptions (access multiple apps)
   - Trial periods and grace periods

3. **App Recommendations**
   - Suggest apps based on user interests
   - Track app usage analytics
   - Personalized app list

4. **Enhanced Security**
   - Two-factor authentication
   - Biometric authentication
   - Session activity monitoring
   - Suspicious activity alerts

5. **Performance Optimization**
   - App preloading/prefetching
   - Cached app metadata
   - Faster app switching

## Support

For issues or questions:
1. Check this documentation
2. Review existing app implementations
3. Test in development first
4. Check Supabase logs for auth errors
5. Verify DNS and domain configuration

## Summary

The multi-app authentication system provides:
- ✅ Single registration for all apps
- ✅ Seamless cross-app navigation
- ✅ Intelligent redirect logic
- ✅ Secure session management
- ✅ Easy addition of new apps
- ✅ Support for free and paid apps
- ✅ OAuth provider integration
- ✅ Admin access control

Users enjoy a unified experience across the entire iiskills.cloud ecosystem while each app maintains its own identity and features.

---

**Last Updated:** January 2026  
**Maintained by:** iiskills.cloud Development Team
