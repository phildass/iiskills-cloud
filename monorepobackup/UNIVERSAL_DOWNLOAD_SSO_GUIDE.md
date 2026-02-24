# Universal App Download & Unified Sign-In System

## Overview

The iiskills.cloud platform implements a comprehensive **Universal App Download UX** and **Unified Sign-In (SSO)** system that provides seamless access across all applications in the ecosystem.

## Key Features

### ✅ Universal Single Sign-On (SSO)
- **One Registration, Universal Access**: Register on any app, access all apps
- **Cross-Subdomain Authentication**: Session cookies work across `*.iiskills.cloud`
- **Persistent Sessions**: Auto-refresh tokens, localStorage persistence
- **Multiple Auth Methods**: Email/password, Magic Link, Google OAuth
- **Session Sync**: Sign in once, authenticated everywhere

### ✅ Universal Download System
- **PWA Installation**: All apps installable as Progressive Web Apps
- **Universal Install Prompt**: Smart install prompts with iOS support
- **App Launcher Dashboard**: Central hub showing all apps with install status
- **Mother App Promotion**: Mini-apps promote the full Mother App
- **Cross-Platform Support**: Works on desktop, mobile, iOS, Android

### ✅ Unified Access Control
- **Centralized Package**: `@iiskills/access-control` manages all app access
- **Bundle Support**: AI-Developer bundle unlocks both apps together
- **Free vs Paid**: 5 free apps, 5 paid apps with clear differentiation
- **Access Persistence**: Access rights sync across all apps

## Architecture

### 1. Single Sign-On Implementation

#### Supabase Configuration
**File**: `/lib/supabaseClient.js`

```javascript
// All apps use the same Supabase project
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: window.localStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      cookieOptions: {
        domain: '.iiskills.cloud',  // Wildcard domain for SSO
        secure: true,                // HTTPS only in production
        sameSite: 'lax'             // Cross-site cookies allowed
      }
    }
  }
);
```

**Key Configuration**:
- **Cookie Domain**: `.iiskills.cloud` (leading dot) enables wildcard matching
- **Persistence**: Session stored in localStorage and cookies
- **Auto-Refresh**: Tokens automatically refreshed before expiry
- **Security**: Secure flag for HTTPS, sameSite for CSRF protection

#### Cross-App Session Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User Actions                                                │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Register/Login on ANY app                                │
│     - iiskills.cloud                                         │
│     - learn-ai.iiskills.cloud                                │
│     - learn-apt.iiskills.cloud                               │
│     - Any other subdomain                                    │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Supabase Creates Session                                 │
│     - User authenticated in central Supabase project         │
│     - Session token generated                                │
│     - Cookie set with domain=.iiskills.cloud                 │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Session Available Everywhere                             │
│     ✓ Automatically logged in on iiskills.cloud             │
│     ✓ Automatically logged in on learn-ai.iiskills.cloud    │
│     ✓ Automatically logged in on learn-developer...         │
│     ✓ Automatically logged in on ALL *.iiskills.cloud       │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Logout on Any App = Logout Everywhere                    │
│     - Session cleared from localStorage                      │
│     - Cookie removed from .iiskills.cloud domain             │
│     - User logged out across all apps simultaneously         │
└─────────────────────────────────────────────────────────────┘
```

### 2. Universal Download System

#### Component Hierarchy

```
UniversalInstallPrompt (New)
├── Detects PWA installability
├── Handles iOS vs Android/Chrome differences
├── Shows Mother App promotion in mini-apps
├── Multiple display variants (button, banner, card)
└── iOS installation instructions modal

AppLauncher (New)
├── Displays all iiskills apps
├── Shows install status per app
├── Groups by free/paid apps
├── Integrates user access control
└── Direct launch/install buttons

InstallApp (Legacy)
└── Basic PWA install prompt (kept for compatibility)
```

#### Install Flow

**Desktop (Chrome/Edge)**:
```
1. User visits any iiskills app
2. Browser fires 'beforeinstallprompt' event
3. UniversalInstallPrompt shows "Install App" button
4. User clicks → Native install dialog appears
5. User accepts → App installs to OS
6. App opens in standalone window
```

**Mobile Android (Chrome)**:
```
1. User visits any iiskills app
2. Browser fires 'beforeinstallprompt' event
3. UniversalInstallPrompt shows "Install App" button
4. User clicks → Native install prompt
5. App installs to home screen
6. Launches like native app
```

**iOS (Safari)**:
```
1. User visits any iiskills app
2. UniversalInstallPrompt detects iOS
3. Shows "Add to Home Screen" button
4. User clicks → Instructions modal appears
5. User follows: Share → Add to Home Screen
6. App appears on home screen
```

### 3. Session Management Utilities

#### Multi-App Session Tracking
**File**: `/lib/sessionManager.js`

**Functions**:
- `recordAppVisit(appId)` - Track last visited app
- `getLastVisitedApp()` - Retrieve last app visited
- `recordLoginApp(appId)` - Track where user logged in
- `getBestAuthRedirect()` - Smart post-login redirect
- `navigateToApp(appId, path)` - Navigate between apps
- `isSessionValid()` - Check if session is active

**Smart Redirect Logic**:
```javascript
// Priority order for post-login redirect:
1. Explicit URL parameter (with validation)
   → redirectTo=/dashboard
2. App where login initiated
   → Last recorded via recordLoginApp()
3. User's preferred app
   → Stored in user preferences
4. Current app
   → Stay on current subdomain
5. Main app (fallback)
   → Default to iiskills.cloud
```

### 4. Access Control Integration

#### Centralized Package
**Package**: `@iiskills/access-control`

**App Configuration**:
```javascript
// Free Apps (5 total)
- learn-apt       (Aptitude)
- learn-chemistry (Chemistry)
- learn-geography (Geography)
- learn-math      (Mathematics)
- learn-physics   (Physics)

// Paid Apps (5 total)
- main            (Mother App)
- learn-ai        (Artificial Intelligence)
- learn-developer (Software Development)
- learn-management (Management Skills)
- learn-pr        (Public Relations)

// Bundle
- AI-Developer Bundle
  ├── learn-ai
  └── learn-developer
  └── Purchase one → unlock both
```

**Integration with App Launcher**:
```javascript
// Check user access per app
const hasAccess = await userHasAccess(userId, appId);

// Display logic
if (app.type === 'FREE') {
  // Always show as unlocked
} else if (hasAccess) {
  // Show as unlocked for paid apps
} else {
  // Show as locked, prompt purchase
}
```

## Components

### 1. UniversalInstallPrompt

**Location**: `/apps/main/components/shared/UniversalInstallPrompt.js`

**Props**:
- `currentAppId` - Current app identifier
- `showMotherAppPromo` - Show Mother App promotion (mini-apps)
- `variant` - Display style: 'button' | 'banner' | 'card'
- `size` - Button size: 'sm' | 'md' | 'lg'

**Features**:
- ✅ Detects PWA installability
- ✅ iOS-specific instructions
- ✅ Standalone mode detection
- ✅ Mother App promotion for mini-apps
- ✅ Multiple display variants
- ✅ Responsive design

**Usage**:
```jsx
// Button variant
<UniversalInstallPrompt 
  currentAppId="learn-ai"
  variant="button"
  size="md"
  showMotherAppPromo={true}
/>

// Banner variant (prominent)
<UniversalInstallPrompt 
  currentAppId="main"
  variant="banner"
  size="lg"
  showMotherAppPromo={false}
/>

// Card variant (standalone section)
<UniversalInstallPrompt 
  currentAppId="learn-math"
  variant="card"
  showMotherAppPromo={true}
/>
```

### 2. AppLauncher

**Location**: `/apps/main/components/shared/AppLauncher.js`

**Props**:
- `userAccess` - User's access status per app
- `showInstallButtons` - Show install buttons
- `view` - Display mode: 'grid' | 'list'

**Features**:
- ✅ Displays all apps with cards
- ✅ Shows install status
- ✅ Groups by free/paid
- ✅ Integrates access control
- ✅ Direct launch buttons
- ✅ Install tracking via localStorage
- ✅ Responsive grid layout

**Usage**:
```jsx
import AppLauncher from '../components/shared/AppLauncher';

<AppLauncher 
  userAccess={userAccessObject}
  showInstallButtons={true}
  view="grid"
/>
```

### 3. Apps Dashboard Page

**Location**: `/apps/main/pages/apps-dashboard.js`

**Features**:
- ✅ Central hub for all apps
- ✅ Loads user access status
- ✅ Integrates AppLauncher
- ✅ Sign-in prompts for guests
- ✅ Benefits section
- ✅ Loading states

**Access**:
- URL: `https://iiskills.cloud/apps-dashboard`
- Available to all users (authenticated + guest)

## User Flows

### Flow 1: New User Registration

```
1. User visits ANY iiskills app (e.g., learn-math.iiskills.cloud)
2. Clicks "Register" or "Sign Up"
3. Fills registration form (UniversalRegister component)
4. Account created in Supabase
5. Email confirmation sent
6. User confirms email
7. Session created with cookie domain=.iiskills.cloud
8. ✓ User now authenticated on ALL apps automatically
```

### Flow 2: Existing User Login

```
1. User visits ANY iiskills app (e.g., learn-ai.iiskills.cloud)
2. Clicks "Login" or "Sign In"
3. Enters credentials (UniversalLogin component)
4. Supabase validates against central user pool
5. Session created with cross-subdomain cookie
6. ✓ User authenticated across iiskills.cloud, learn-ai.iiskills.cloud, etc.
7. Can immediately access any other app without re-login
```

### Flow 3: Install Mother App from Mini-App

```
1. User on mini-app (e.g., learn-physics.iiskills.cloud)
2. Sees UniversalInstallPrompt with "Get Full App Suite" button
3. Clicks → Redirects to iiskills.cloud
4. Main app shows install prompt
5. User installs Mother App
6. Mother App opens → Shows AppLauncher dashboard
7. ✓ User sees all apps, can install any mini-app too
```

### Flow 4: Install Mini-App from Mother App

```
1. User on Mother App (iiskills.cloud)
2. Navigates to /apps-dashboard
3. Sees AppLauncher with all apps
4. Clicks "Open" on any mini-app (e.g., learn-chemistry)
5. Browser opens mini-app subdomain
6. Mini-app shows install prompt
7. User clicks "Install"
8. ✓ Mini-app installed to home screen/OS
9. User already authenticated (SSO)
```

### Flow 5: Cross-App Navigation with SSO

```
1. User logged in on main app (iiskills.cloud)
2. Clicks link to learn-developer.iiskills.cloud
3. Browser sends request with .iiskills.cloud cookie
4. Learn-developer app reads Supabase session
5. ✓ User automatically authenticated
6. No login prompt, seamless access
7. User can navigate back to main app
8. ✓ Still authenticated everywhere
```

## Environment Variables

### Required for All Apps

```bash
# Supabase Configuration (MUST be identical across all apps)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Domain Configuration
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud

# Service Role (Server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Optional Configuration

```bash
# Development Mode
NODE_ENV=development

# Feature Flags
NEXT_PUBLIC_ENABLE_OFFLINE_MODE=false
NEXT_PUBLIC_ENABLE_SERVICE_WORKER=true
```

## PWA Manifests

### Mother App Manifest
**File**: `/apps/main/public/manifest.json`

```json
{
  "name": "iiskills.cloud - Indian Institute of Professional Skills Development",
  "short_name": "iiskills.cloud",
  "description": "Education for All, Online and Affordable",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/images/icon-192x192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    },
    {
      "src": "/images/icon-512x512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml"
    }
  ]
}
```

### Mini-App Manifests
Each mini-app has its own manifest at `/apps/{app-name}/public/manifest.json` with:
- App-specific name and description
- Same icon structure
- Same display mode (standalone)
- Consistent theme color

## Security Considerations

### ✅ Implemented

1. **Cookie Security**
   - Secure flag in production (HTTPS only)
   - SameSite='lax' for CSRF protection
   - HttpOnly where applicable

2. **Token Management**
   - Auto-refresh prevents expired tokens
   - Stored securely in localStorage
   - Cleared on logout across all apps

3. **Open Redirect Prevention**
   - `getBestAuthRedirect()` validates URLs
   - Only allows same-domain redirects
   - Sanitizes user-provided redirect URLs

4. **Access Control**
   - Centralized via `@iiskills/access-control`
   - Server-side validation required
   - Never trust client-side checks alone

### ⚠️ Recommendations

1. **Service Worker Implementation**
   - Add service workers for true offline mode
   - Cache critical assets
   - Background sync for data

2. **Rate Limiting**
   - Implement rate limits on auth endpoints
   - Prevent brute force attacks
   - Monitor suspicious activity

3. **Session Monitoring**
   - Track active sessions per user
   - Alert on unusual access patterns
   - Allow users to revoke sessions

## Testing Guide

### Test Scenario 1: Cross-App SSO

```
1. Open iiskills.cloud
2. Register new account
3. Verify email confirmation
4. Open learn-ai.iiskills.cloud in new tab
5. ✓ Should be automatically logged in
6. Open learn-math.iiskills.cloud in another tab
7. ✓ Should be automatically logged in
8. Logout from learn-math.iiskills.cloud
9. Refresh iiskills.cloud tab
10. ✓ Should be logged out there too
```

### Test Scenario 2: PWA Installation

```
Desktop (Chrome):
1. Visit any iiskills app
2. Look for install icon in address bar
3. Click "Install" button on page
4. ✓ Native install dialog should appear
5. Accept → App installs
6. ✓ App opens in standalone window
7. Close and reopen from OS
8. ✓ Session persists, user still logged in

Mobile (Android):
1. Open any iiskills app in Chrome
2. Tap "Install" button on page
3. ✓ Android install prompt appears
4. Add to home screen
5. ✓ App icon appears on home screen
6. Launch app
7. ✓ Looks like native app
8. ✓ User session persists

iOS (Safari):
1. Open any iiskills app in Safari
2. Tap "Add to Home Screen" button
3. ✓ Instructions modal appears
4. Follow instructions
5. Tap Share → Add to Home Screen
6. ✓ App appears on home screen
7. Launch from home screen
8. ✓ User session persists
```

### Test Scenario 3: App Launcher Dashboard

```
1. Login to iiskills.cloud
2. Navigate to /apps-dashboard
3. ✓ Should see all 10 apps listed
4. ✓ Free apps show green badges
5. ✓ Paid apps show blue/lock badges
6. Click "Launch" on learn-chemistry
7. ✓ Opens learn-chemistry.iiskills.cloud
8. ✓ User already authenticated
9. See "Get Full App Suite" button
10. Click → Returns to iiskills.cloud
11. ✓ Seamless navigation
```

### Test Scenario 4: Access Control Integration

```
1. Create new user account
2. Login to iiskills.cloud
3. Go to /apps-dashboard
4. ✓ All free apps unlocked
5. ✓ Paid apps show locked badges
6. Purchase learn-ai (via payment flow)
7. ✓ learn-ai unlocks
8. ✓ learn-developer also unlocks (bundle)
9. Navigate to learn-developer.iiskills.cloud
10. ✓ Full access granted
11. Navigate to learn-management.iiskills.cloud
12. ✓ Still locked (not purchased)
```

## Deployment Checklist

### Pre-Deployment

- [ ] All apps use same Supabase project credentials
- [ ] Cookie domain set to `.iiskills.cloud` in all apps
- [ ] PWA manifests configured for all apps
- [ ] Icons generated at 192x192 and 512x512
- [ ] HTTPS enabled for all subdomains
- [ ] Environment variables set in production
- [ ] Access control package deployed

### Post-Deployment Verification

- [ ] Test SSO across all subdomains
- [ ] Verify PWA installation on desktop
- [ ] Verify PWA installation on Android
- [ ] Verify "Add to Home Screen" on iOS
- [ ] Test logout synchronization
- [ ] Verify access control restrictions
- [ ] Test bundle unlock logic
- [ ] Check Mother App promotion in mini-apps
- [ ] Verify app launcher dashboard
- [ ] Test all user flows end-to-end

## Troubleshooting

### Issue: Session Not Persisting Across Apps

**Symptoms**: User logs in on one app but not authenticated on others

**Possible Causes**:
1. Cookie domain not set to `.iiskills.cloud`
2. Different Supabase projects configured
3. HTTPS not enabled in production
4. Browser blocking third-party cookies

**Solutions**:
```javascript
// 1. Verify cookie domain in supabaseClient.js
cookieOptions: {
  domain: '.iiskills.cloud',  // Must have leading dot
  secure: true,               // Must be true in production
  sameSite: 'lax'
}

// 2. Verify same Supabase URL across all apps
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
// Should be identical everywhere

// 3. Check HTTPS
// All apps must be served via HTTPS in production

// 4. Check browser settings
// Ensure third-party cookies not blocked
```

### Issue: Install Button Not Appearing

**Symptoms**: UniversalInstallPrompt doesn't show

**Possible Causes**:
1. App already installed
2. Browser doesn't support PWA
3. Missing manifest.json
4. HTTPS not enabled
5. iOS without proper handling

**Solutions**:
```javascript
// 1. Check if already installed
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('App already installed');
}

// 2. Check manifest exists
// Visit: https://yourdomain.com/manifest.json
// Should return valid JSON

// 3. Verify HTTPS
// PWAs require HTTPS (except localhost)

// 4. Check iOS detection
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
console.log('Is iOS:', isIOS);
```

### Issue: Access Control Not Working

**Symptoms**: User can't access paid apps after purchase

**Possible Causes**:
1. Payment not confirmed in database
2. Access control package not checking correctly
3. Bundle logic not applied
4. Cache issue

**Solutions**:
```sql
-- Check user_app_access table
SELECT * FROM user_app_access WHERE user_id = 'user-id';

-- Check payments table
SELECT * FROM payments WHERE user_id = 'user-id' AND status = 'completed';

-- Grant access manually if needed
INSERT INTO user_app_access (user_id, app_id, granted_via)
VALUES ('user-id', 'learn-ai', 'payment');
```

## Future Enhancements

### Planned Features

1. **Service Worker Implementation**
   - True offline mode
   - Background sync
   - Push notifications
   - Update notifications

2. **Deep Linking**
   - Direct deep links to content
   - Universal links for iOS
   - App links for Android
   - Fallback to web

3. **Enhanced Install Prompts**
   - A/B testing different variants
   - User segment targeting
   - Install conversion tracking
   - Personalized messaging

4. **Progressive Enhancement**
   - Incremental feature unlocking
   - Background downloads
   - Preload resources
   - Smart caching strategies

5. **Analytics Integration**
   - Track install rates
   - Monitor SSO usage
   - Measure cross-app engagement
   - User journey mapping

## Support & Documentation

### Additional Resources

- [AUTHENTICATION_ARCHITECTURE.md](AUTHENTICATION_ARCHITECTURE.md) - Detailed auth architecture
- [UNIVERSAL_ACCESS_CONTROL.md](UNIVERSAL_ACCESS_CONTROL.md) - Access control system
- [PWA_INSTALL_BUTTON.md](PWA_INSTALL_BUTTON.md) - PWA installation guide
- [MULTI_APP_AUTH_GUIDE.md](MULTI_APP_AUTH_GUIDE.md) - Multi-app authentication

### Contact & Support

For technical issues or questions:
- Create an issue on GitHub
- Contact the development team
- Refer to inline code documentation

---

**Last Updated**: February 2026  
**Version**: 1.0.0  
**Maintained by**: iiskills.cloud Development Team
