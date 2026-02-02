# Navigation and Authentication Guide

This guide explains the navigation structure and authentication flow across all iiskills.cloud applications (main domain and subdomains).

## Table of Contents
1. [Navigation Structure](#navigation-structure)
2. [Authentication Flow](#authentication-flow)
3. [Admin Access](#admin-access)
4. [Cross-Subdomain SSO](#cross-subdomain-sso)
5. [Shared Components](#shared-components)

---

## Navigation Structure

### Main Domain (iiskills.cloud)

The main domain uses a **shared navigation component** that provides consistent branding and user experience across all iiskills applications.

#### Navigation Links

**Public Navigation:**
- **Home** - Main landing page
- **Courses** - Browse available courses
- **Certification** - Certificate information
- **Payments** - External payment link (aienter.in/payments)
- **About** - About iiskills and AI Cloud Enterprises
- **Terms & Conditions** - Legal terms

**Authentication Links:**
- **Sign In** - Login page (shown when not authenticated)
- **Register** - Registration page (shown when not authenticated)
- **User Email** - Display current user email (shown when authenticated)
- **Logout** - Sign out button (shown when authenticated)

#### Important: No Admin Link in Navigation

**The admin link is NOT displayed in the navigation bar**, even for admin users. This is a security best practice:

- ✅ Admin section is accessible only via direct URL: `/admin`
- ✅ Regular users cannot discover admin section through UI
- ✅ Admin users can bookmark the URL or type it directly
- ❌ No visual indicator in navbar reveals admin access

### Learn-Apt Subdomain (learn-apt.iiskills.cloud)

The learn-apt app uses the **same shared navigation component** with learn-apt specific configuration:

#### Navigation Links

**All Main Domain Links** - Same links as main domain for consistency
- Users can navigate to main domain pages from learn-apt
- External links to courses, certification, etc.

**App-Specific:**
- **App Name:** "Learn-Apt" displayed in navbar
- **Home URL:** Points to learn-apt home page

---

## Authentication Flow

### User Registration and Login

Both main domain and learn-apt use **Supabase authentication** with shared session management.

#### Registration Flow

1. User clicks "Register" in navbar (or goes to `/register`)
2. User fills registration form:
   - First Name
   - Last Name
   - Email
   - Password
3. Form submitted to Supabase
4. User account created with metadata
5. Email confirmation sent (if enabled in Supabase)
6. User can log in after email confirmation

#### Login Flow

1. User clicks "Sign In" in navbar (or goes to `/login`)
2. User enters credentials:
   - Email
   - Password
3. Credentials validated against Supabase
4. Session created and stored in localStorage
5. User redirected to dashboard or return URL
6. Navbar updates to show user email and logout button

#### Logout Flow

1. User clicks "Logout" button in navbar
2. Supabase session cleared
3. User redirected to login page or home
4. Navbar updates to show "Sign In" and "Register"

### Protected Routes

Protected routes require authentication to access:

**Main Domain Protected Pages:**
- `/dashboard` - User dashboard
- `/my-certificates` - User certificates
- `/admin/*` - Admin pages (requires admin role)

**Learn-Apt Protected Pages:**
- `/learn` - Learning content
- `/test` - Assessment tests
- `/results` - Test results
- `/admin/*` - Learn-apt admin pages (requires admin role)

**Protection Implementation:**
- `ProtectedRoute` component wraps protected pages
- Checks for valid Supabase session
- Redirects to login if not authenticated
- For admin pages: also checks for admin role in user metadata

---

## Admin Access

### Security Model

**Admin access is role-based and uses Supabase authentication:**

✅ **Secure Approach:**
- Admin role stored in Supabase user metadata (`user_metadata.role = 'admin'`)
- Backend validation of admin status
- No hardcoded passwords
- No client-side bypass possible
- Session managed by Supabase

❌ **Legacy Approach (REMOVED):**
- ~~Hardcoded admin password~~
- ~~localStorage authentication~~
- ~~Client-side role check~~

### Accessing Admin Section

**Main Domain Admin:** `https://iiskills.cloud/admin`
**Learn-Apt Admin:** `https://learn-apt.iiskills.cloud/admin`

#### Access Steps:

1. **Direct URL Access Only**
   - No link in navigation bar
   - Type URL directly: `/admin`
   - Or bookmark the admin URL

2. **Authentication Check**
   - If not logged in → redirected to `/login?redirect=/admin`
   - Log in with your user account
   - After login → redirected back to admin section

3. **Role Verification**
   - System checks user metadata for admin role
   - If not admin → redirected to home with error
   - If admin → access granted to admin dashboard

4. **Admin Navigation**
   - Yellow admin navigation bar appears
   - Access to: Dashboard, Courses, Content, Users, Settings
   - "Main Site" link to return to public site
   - Logout button (uses Supabase signOut)

### Setting Admin Role

Admin role must be set in Supabase:

**Option 1: Supabase Dashboard**
1. Go to Supabase project → Authentication → Users
2. Select user
3. Edit user metadata
4. Add: `{ "role": "admin" }`
5. Save changes

**Option 2: SQL**
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

**Option 3: API (for automated setup)**
```javascript
// In a secure server-side function
const { data, error } = await supabase.auth.admin.updateUserById(
  userId,
  { 
    user_metadata: { role: 'admin' } 
  }
)
```

---

## Cross-Subdomain SSO

### How It Works

Both main domain and learn-apt share the same authentication session:

**Shared Configuration:**
- Same Supabase project URL
- Same Supabase anon key
- Same storage key: `iiskills-auth-token`
- Cookie domain: `.iiskills.cloud` (note the leading dot)

**User Experience:**

1. **Scenario A: Login on Main Domain**
   - User logs in at `iiskills.cloud/login`
   - Session created in Supabase
   - User navigates to `learn-apt.iiskills.cloud`
   - **Automatically authenticated** on learn-apt
   - No need to log in again

2. **Scenario B: Login on Learn-Apt**
   - User logs in at `learn-apt.iiskills.cloud/login`
   - Session created in Supabase
   - User navigates to `iiskills.cloud`
   - **Automatically authenticated** on main site
   - No need to log in again

3. **Logout from Any Domain**
   - User logs out from either domain
   - Session cleared from Supabase
   - **User logged out on all domains**
   - Must log in again to access protected content

### Technical Implementation

**Main Domain (`/lib/supabaseClient.js`):**
```javascript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    cookieOptions: {
      domain: getCookieDomain(), // Returns '.iiskills.cloud' in production
      secure: true, // HTTPS only
      sameSite: 'lax',
    }
  }
})
```

**Learn-Apt (`/learn-apt/lib/supabaseClient.js`):**
```javascript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storageKey: 'iiskills-auth-token' // Shared storage key
  }
})
```

### Supabase Configuration

**Required Supabase Settings:**

1. **Site URL** (Authentication → Settings)
   - Development: `http://localhost:3000`
   - Production: `https://iiskills.cloud`

2. **Redirect URLs** (Authentication → Settings)
   - `http://localhost:3000/**`
   - `http://localhost:3001/**`
   - `https://iiskills.cloud/**`
   - `https://learn-apt.iiskills.cloud/**`

3. **Cookie Domain** (for production)
   - Set to `.iiskills.cloud` (with leading dot)
   - Enables cross-subdomain sessions

---

## Shared Components

### SharedNavbar Component

Located at: `/components/shared/SharedNavbar.js`

**Purpose:** Provides consistent navigation across all iiskills applications

**Features:**
- Dual logo display (iiskills + AI Cloud Enterprises)
- Configurable app name
- Customizable navigation links
- Authentication state display
- Responsive mobile menu
- Logout functionality

**Usage in Main Domain:**

```javascript
// components/Navbar.js
import SharedNavbar from './shared/SharedNavbar'

export default function Navbar() {
  const [user, setUser] = useState(null)
  
  return (
    <SharedNavbar 
      user={user}
      onLogout={handleLogout}
      appName="iiskills.cloud"
      homeUrl="/"
      showAuthButtons={true}
      customLinks={[
        { href: '/', label: 'Home', className: 'hover:text-primary transition' },
        { href: '/courses', label: 'Courses', className: 'hover:text-primary transition' },
        // ... more links
      ]}
    />
  )
}
```

**Usage in Learn-Apt:**

```javascript
// learn-apt/pages/_app.js
import SharedNavbar from '../components/shared/SharedNavbar'

export default function App({ Component, pageProps }) {
  return (
    <>
      <SharedNavbar 
        user={user}
        onLogout={handleLogout}
        appName="Learn-Apt"
        homeUrl="/"
        showAuthButtons={true}
        customLinks={[
          { href: 'https://iiskills.cloud', label: 'Home' },
          { href: 'https://iiskills.cloud/courses', label: 'Courses' },
          // ... more links
        ]}
      />
      <Component {...pageProps} />
    </>
  )
}
```

**Props:**

- `user` (object|null) - Current user from Supabase
- `onLogout` (function) - Logout callback
- `appName` (string) - Name displayed in navbar
- `homeUrl` (string) - Home link URL
- `showAuthButtons` (boolean) - Show login/register buttons
- `customLinks` (array) - Navigation links configuration

---

## Best Practices

### For Users

1. **Login once, access everywhere** - Single login works across all domains
2. **Bookmark admin URL** - Save `/admin` URL for quick access
3. **Logout when done** - Use logout button to clear session
4. **Check email for confirmation** - Verify email after registration

### For Developers

1. **Use SharedNavbar** - Always use shared component for consistency
2. **Check admin role properly** - Verify `user_metadata.role` or `app_metadata.role`
3. **Protect all admin routes** - Wrap with `ProtectedRoute` component
4. **Test cross-domain auth** - Verify SSO works across subdomains
5. **No admin UI in navbar** - Keep admin access invisible to regular users
6. **Use direct URLs for admin** - Document admin URL, don't expose in UI

### For Administrators

1. **Set admin roles in Supabase** - Use dashboard or SQL to grant admin access
2. **Document admin access** - Share admin URL with authorized users
3. **Monitor authentication** - Check Supabase logs for security issues
4. **Regular security audits** - Review user roles and permissions
5. **Enable email confirmation** - Require email verification for new users

---

## Troubleshooting

### "Access Denied" when visiting /admin

**Solution:** Check if your user has admin role in Supabase:
```sql
SELECT raw_user_meta_data->>'role' as role 
FROM auth.users 
WHERE email = 'your@email.com';
```

### Not logged in across subdomains

**Possible causes:**
1. Cookie domain not set to `.iiskills.cloud`
2. Different Supabase projects used
3. Different storage keys
4. Cookies blocked by browser

**Solutions:**
- Verify cookie domain in Supabase settings
- Check `.env.local` has same credentials in both apps
- Clear browser cookies and try again
- Check browser console for errors

### Admin logout doesn't work

**Solution:** AdminNav now uses Supabase logout instead of localStorage. Update AdminNav component:
```javascript
import { signOutUser } from '../lib/supabaseClient'

const handleLogout = async () => {
  const { success } = await signOutUser()
  if (success) {
    router.push('/')
  }
}
```

### Can't find admin link in navbar

**This is intentional!** Admin access is via direct URL only:
- Main domain: `https://iiskills.cloud/admin`
- Learn-apt: `https://learn-apt.iiskills.cloud/admin`

---

## Summary

**Navigation:**
- ✅ All apps use SharedNavbar for consistency
- ✅ Same navigation links across all domains
- ✅ No admin link in navbar (security by obscurity)

**Authentication:**
- ✅ Single sign-on across all subdomains
- ✅ Supabase-based role management
- ✅ Protected routes with proper role checks
- ✅ No hardcoded credentials

**Admin Access:**
- ✅ Direct URL access only (`/admin`)
- ✅ Role-based with Supabase metadata
- ✅ Separate admin navigation when accessed
- ✅ No UI hints for regular users

This architecture provides a secure, consistent, and user-friendly experience across all iiskills.cloud applications.

---

## Test Mode Configuration (TEMPORARY)

⚠️ **WARNING: FOR TESTING ONLY - NEVER USE IN PRODUCTION**

### Overview

A temporary test mode has been implemented to allow:
1. Password-first admin authentication (no Supabase login required)
2. Universal bypass of all paywalls and authentication checks
3. Full admin access to all content across all apps

**This mode MUST be disabled before any production deployment.**

### Enabling Test Mode

**Step 1: Set Environment Variables**

Add to `.env.local` in all apps (main and subdomains):

```bash
# Test mode flags
NEXT_PUBLIC_TEST_MODE=true  # Client-side - bypasses paywalls
TEST_MODE=true              # Server-side - bypasses auth checks

# Admin authentication
ADMIN_JWT_SECRET=<generate-with: openssl rand -base64 32>
SUPABASE_SERVICE_ROLE_KEY=<from-supabase-dashboard>
```

**Step 2: Apply Supabase Migration**

Run the SQL migration in Supabase SQL Editor:

```bash
# File: supabase/migrations/admin_settings_table.sql
# Creates the admin_settings table for password storage
```

Or manually:
```sql
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
```

**Step 3: Restart Applications**

```bash
pm2 restart all
# Or for development:
npm run dev
```

### Admin Password Setup Flow

**First Visit to `/admin/universal`:**

1. System checks if admin password exists in `admin_settings` table
2. If not found, displays "Setup Admin Password" screen
3. Admin creates password (minimum 8 characters)
4. Password is hashed with bcrypt (12 rounds)
5. Hash stored in `admin_settings` table (key: 'admin_password_hash')
6. JWT token generated and set as HttpOnly cookie
7. Admin gains immediate access to dashboard

**Subsequent Visits:**

1. If valid `admin_token` cookie exists → automatically authenticated
2. If no valid cookie → shows login screen
3. Admin enters password
4. System verifies against stored hash
5. On success → new JWT token issued
6. Admin gains access to dashboard

### Test Mode Features

When `NEXT_PUBLIC_TEST_MODE=true`:

**1. Paywall Bypass**
- All content protected by `PaidUserProtectedRoute` is accessible
- No payment checks performed
- Warning banner shows "TEST MODE" on all pages

**2. Authentication Relaxation**
- Admin routes accept `admin_token` cookie for authentication
- Supabase user authentication is optional
- Falls back to Supabase auth if `admin_token` not present

**3. Visual Indicators**
- Yellow warning banner on admin pages: "TEST MODE: All paywalls and authentication bypassed"
- Setup page shows test mode notice
- Console warnings in browser developer tools

**4. Admin Access**
- Direct access to `/admin/universal` (no redirect to login)
- Logout button prominently displayed
- Session expires after 24 hours

### URLs and Routes

| Route | Test Mode | Production |
|-------|-----------|------------|
| `/admin/universal` | Password setup/login | Redirect to Supabase login |
| `/admin` | Protected by admin_token | Protected by Supabase + is_admin |
| `/admin/*` | Protected by admin_token | Protected by Supabase + is_admin |
| Paid content pages | Accessible to all | Requires auth + payment |

### Security Considerations

⚠️ **Test mode reduces security:**

- Service role key used client-side (normally server-only)
- Single shared admin password (not user-specific)
- All paywalls disabled (revenue protection removed)
- No audit trail of admin actions
- RLS policies effectively bypassed

**Therefore:**
- ✅ Use ONLY in development/testing environments
- ✅ Set strong admin password
- ✅ Rotate all keys after testing
- ❌ NEVER enable on production domain
- ❌ NEVER commit secrets to git
- ❌ NEVER leave enabled after testing

### Disabling Test Mode

**Follow the complete rollback guide: `TEST_MODE_ROLLBACK.md`**

**Quick Disable (Emergency):**

```bash
# In .env.local for all apps:
NEXT_PUBLIC_TEST_MODE=false
TEST_MODE=false

# Restart apps
pm2 restart all
```

**Complete Rollback:**

1. Set `NEXT_PUBLIC_TEST_MODE=false` and `TEST_MODE=false`
2. Remove/rotate `ADMIN_JWT_SECRET`
3. Rotate `SUPABASE_SERVICE_ROLE_KEY`
4. Drop `admin_settings` table
5. Configure Supabase admin users (`is_admin=true`)
6. Restart all applications
7. Verify normal authentication works
8. Verify paywalls are active

### Testing Checklist

Use this checklist when testing in test mode:

**Admin Access:**
- [ ] Visit `/admin/universal` - should show password setup
- [ ] Create admin password - should succeed
- [ ] Access admin dashboard - should see all features
- [ ] Logout - should clear session
- [ ] Login again - should accept password
- [ ] Check cookie - `admin_token` should be HttpOnly

**Paywall Bypass:**
- [ ] Visit paid content page - should show content
- [ ] Check for test mode banner - should be visible
- [ ] Console warnings - should show test mode messages

**Cross-App Access:**
- [ ] Admin can see content from all apps
- [ ] Admin queries return complete data
- [ ] No permission errors in console

### Environment Variable Reference

```bash
# Required for test mode
NEXT_PUBLIC_TEST_MODE=true              # Enable test mode (client)
TEST_MODE=true                          # Enable test mode (server)
ADMIN_JWT_SECRET=<secret>               # JWT signing secret
SUPABASE_SERVICE_ROLE_KEY=<key>         # Service role key

# Standard Supabase (still required)
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_COOKIE_DOMAIN=              # Empty for localhost
```

### Troubleshooting

**Issue: "Failed to check password status"**
- Check `SUPABASE_SERVICE_ROLE_KEY` is set
- Verify `admin_settings` table exists
- Check server logs for errors

**Issue: "Invalid password" even with correct password**
- Check password was created in test mode
- Verify `admin_settings` table has 'admin_password_hash' row
- Try setting up password again

**Issue: Test mode not activating**
- Verify `NEXT_PUBLIC_TEST_MODE=true` (exact string)
- Restart the application
- Clear browser cache and cookies
- Check `.env.local` file syntax

**Issue: Paywall still showing**
- Confirm `NEXT_PUBLIC_TEST_MODE=true` in `.env.local`
- Restart application
- Check browser console for test mode messages
- Verify environment variable is loaded: `console.log(process.env.NEXT_PUBLIC_TEST_MODE)`

### Migration from Test Mode to Production

**Before Production Launch:**

1. Complete all testing and documentation
2. Follow `TEST_MODE_ROLLBACK.md` instructions completely
3. Set up proper Supabase admin users
4. Enable all authentication and paywall checks
5. Test normal auth flow thoroughly
6. Verify security is fully restored
7. Remove test mode code (optional)
8. Update documentation to remove test mode references

**Admin Setup for Production:**

```sql
-- Grant admin access to specific users
UPDATE public.profiles 
SET is_admin = true 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email IN ('admin1@example.com', 'admin2@example.com')
);

-- Verify admin users
SELECT u.email, p.is_admin 
FROM auth.users u 
JOIN public.profiles p ON u.id = p.id 
WHERE p.is_admin = true;
```

---

This architecture provides a secure, consistent, and user-friendly experience across all iiskills.cloud applications.
