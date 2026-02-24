# Universal Authentication Architecture

## Overview

iiskills.cloud implements a **universal authentication system** where users register **once** and gain access to **all** applications and subdomains. This document explains the architecture, implementation, and benefits of this approach.

## Current Implementation Status

**All apps and subdomains now use standardized Supabase authentication:**

### Main Domain (`iiskills.cloud`)
- ✅ Uses `UniversalLogin` and `UniversalRegister` components
- ✅ Admin login (`/admin/login`) uses `UniversalLogin` with automatic role detection
- ✅ Configured for cross-subdomain authentication

### Subdomain Apps - Pages Router (Next.js 12)
All of the following apps use the shared `UniversalLogin` and `UniversalRegister` components:
- ✅ learn-ai
- ✅ learn-chemistry
- ✅ learn-data-science
- ✅ learn-geography
- ✅ learn-govt-jobs
- ✅ learn-ias
- ✅ learn-jee
- ✅ learn-leadership
- ✅ learn-management
- ✅ learn-math
- ✅ learn-neet
- ✅ learn-physics
- ✅ learn-pr
- ✅ learn-winning

### Subdomain Apps - App Router (Next.js 13+)
- ✅ learn-apt: Uses modern `@supabase/ssr` package with custom `AuthContext` wrapper
  - Still connects to the same Supabase project
  - Configured for cross-subdomain authentication via environment variables
  - Provides backward compatibility with legacy authentication during transition

**Result:** 100% of iiskills.cloud apps now use standardized Supabase authentication with universal access.

## Key Principle: Single Registration, Universal Access

**Register on ANY app → Access ALL apps**

When a user creates an account on any iiskills.cloud app (main site, Learn-Apt, Learn-JEE, Learn-NEET, etc.), they automatically get access to:
- Main iiskills.cloud website
- All 13+ learning module subdomains
- Future apps and services
- Mobile applications (when implemented)

## Architecture Components

### 1. Centralized User Pool (Supabase)

All applications connect to the **same Supabase project**, ensuring:
- **Single source of truth** for user accounts
- **Unified user profiles** with consistent metadata
- **Cross-app authentication** without separate registrations

#### Configuration
```javascript
// All apps use these same credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Cross-Subdomain Session Management

Sessions are shared across all `*.iiskills.cloud` domains using:

```javascript
// lib/supabaseClient.js
cookieOptions: {
  domain: '.iiskills.cloud',  // Leading dot enables wildcard
  secure: true,                // HTTPS only in production
  sameSite: 'lax'
}
```

**What this means:**
- Login on `iiskills.cloud` → Automatically logged in on `learn-apt.iiskills.cloud`
- Login on `learn-jee.iiskills.cloud` → Automatically logged in on main site
- Logout on any app → Logged out everywhere

### 3. Standardized Authentication Components

#### UniversalRegister Component
Location: `/components/shared/UniversalRegister.js`

**Features:**
- Two modes: Full registration (main app) or Simplified (subdomain apps)
- Email/password registration
- Google OAuth registration
- Writes to shared Supabase user pool
- Configurable field requirements

**Usage:**
```javascript
// Full registration (main app)
<UniversalRegister 
  simplified={false}
  appName="iiskills.cloud"
/>

// Simplified registration (subdomain apps)
<UniversalRegister 
  simplified={true}
  appName="Learn-Apt"
/>
```

#### UniversalLogin Component
Location: `/components/shared/UniversalLogin.js`

**Features:**
- Email/password authentication
- Magic link (passwordless) authentication
- Google OAuth authentication
- Works across all subdomains
- Automatic session creation

**Usage:**
```javascript
<UniversalLogin 
  redirectAfterLogin="/dashboard"
  appName="iiskills.cloud"
  showMagicLink={true}
  showGoogleAuth={true}
/>
```

### 4. Consistent Supabase Client Configuration

All apps use the same Supabase client initialization pattern:

```javascript
// Main app: /lib/supabaseClient.js
// Subdomain apps: /learn-*/lib/supabaseClient.js

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    cookieOptions: {
      domain: getCookieDomain(),  // Returns '.iiskills.cloud'
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    }
  }
})
```

## User Registration Flow

### Scenario 1: Register on Main App

1. User visits `https://iiskills.cloud/register`
2. Fills out **full registration form** (name, gender, education, location, etc.)
3. Account created in Supabase with comprehensive metadata
4. Email confirmation sent
5. User can now login on:
   - `iiskills.cloud`
   - `learn-apt.iiskills.cloud`
   - `learn-jee.iiskills.cloud`
   - All other subdomains

### Scenario 2: Register on Subdomain

1. User visits `https://learn-apt.iiskills.cloud/register`
2. Fills out **simplified registration form** (name, age, qualification)
3. Account created in **same Supabase project** with basic metadata
4. Email confirmation sent
5. User can now login on:
   - `learn-apt.iiskills.cloud`
   - `iiskills.cloud`
   - All other subdomains

**Note:** Users who register on a subdomain with simplified form can later complete their profile on the main app.

## User Login Flow

### Universal Login Recognition

**The system automatically recognizes users regardless of where they registered:**

1. User goes to ANY app's `/login` page
2. Enters email and password (or uses magic link/Google OAuth)
3. Supabase validates credentials against centralized user pool
4. Session token created and stored in cookie with `.iiskills.cloud` domain
5. User redirected to app's default page
6. Session automatically available on all other subdomains

### Multiple Authentication Methods

All apps support three authentication methods:

#### 1. Email/Password
```javascript
// Traditional authentication
const { user, error } = await signInWithEmail(email, password)
```

#### 2. Magic Link (Passwordless)
```javascript
// Send secure sign-in link via email
const { success, error } = await sendMagicLink(email, redirectUrl)
```

#### 3. Google OAuth
```javascript
// One-click sign-in with Google account
const { success, error } = await signInWithGoogle(redirectUrl)
```

## Session Token Validity

**Session tokens work across ALL apps and APIs:**

✅ Valid on `iiskills.cloud`
✅ Valid on `learn-apt.iiskills.cloud`
✅ Valid on `learn-jee.iiskills.cloud`
✅ Valid on all other `*.iiskills.cloud` subdomains
✅ Valid for API calls to any subdomain
✅ Valid for mobile apps (when configured)

**Session duration:**
- Default: 1 week
- Configurable in Supabase dashboard
- Auto-refresh enabled

## Profile Data Consistency

### User Metadata Structure

All user accounts store metadata in consistent format:

```javascript
{
  // Always present (from any registration)
  first_name: "John",
  last_name: "Doe",
  full_name: "John Doe",
  
  // From full registration (main app)
  gender: "male",
  date_of_birth: "1995-05-15",
  education: "bachelors",
  location: "Mumbai",
  state: "maharashtra",
  district: "Mumbai",
  country: "india",
  
  // From simplified registration (subdomain apps)
  age: 28,
  qualification: "B.Tech Computer Science"
}
```

### Profile Completion

Users can enhance their profile:
1. Register with simplified form on subdomain
2. Later visit main app
3. Complete additional profile fields
4. Data merged into same account

## Benefits of This Architecture

### 1. User Convenience
- ✅ Register once, access everything
- ✅ No need to remember which app they registered on
- ✅ Single set of credentials
- ✅ Seamless cross-app navigation

### 2. Business Benefits
- ✅ Unified user database
- ✅ Better user analytics across all apps
- ✅ Easier user management
- ✅ Consistent user experience
- ✅ Higher conversion rates

### 3. Technical Benefits
- ✅ Single authentication codebase
- ✅ Shared components reduce duplication
- ✅ Easier to maintain and update
- ✅ Consistent security practices
- ✅ Simplified testing

### 4. Security
- ✅ Centralized security updates
- ✅ No hardcoded credentials
- ✅ Server-side validation
- ✅ Automatic token refresh
- ✅ Secure session management

## Implementation Checklist

### For New Apps/Subdomains

When adding a new app to the iiskills.cloud ecosystem:

- [x] Use same Supabase project credentials
- [x] Import `UniversalRegister` and `UniversalLogin` components
- [x] Configure cookie domain to `.iiskills.cloud`
- [x] Set up environment variables
- [x] Test cross-subdomain authentication

**Note:** For Next.js App Router (13+) apps like learn-apt, you may use the modern `@supabase/ssr` package with a custom AuthContext wrapper, but ensure it uses the same Supabase project and cookie domain configuration.

### Environment Variables Required

All apps need these variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
```

### Admin Authentication

Admin access is controlled through the **public.profiles** table, not separate credentials:

- Admins use the same login pages as regular users (e.g., `/login` or `/admin/login`)
- The `isAdmin()` function automatically checks the `profiles.is_admin` field from the database
- Admin users are redirected to `/admin` after successful authentication
- Non-admin users attempting to access admin routes are denied via the ProtectedRoute component

**There are no separate admin credentials** - admin status is determined by the `is_admin` flag in the public.profiles table.

**Setting up admin users:**
```sql
-- Make a user an admin in Supabase SQL Editor
UPDATE public.profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

For complete documentation on admin validation, see [PROFILES_TABLE_ADMIN.md](PROFILES_TABLE_ADMIN.md).

## Testing Universal Authentication

### Test Scenario 1: Cross-App Registration and Login

1. Register new account on `learn-apt.iiskills.cloud/register`
2. Verify account created in Supabase
3. Go to `iiskills.cloud/login`
4. Login with same credentials
5. ✅ Should succeed - proves universal recognition

### Test Scenario 2: Cross-App Session Persistence

1. Login on `iiskills.cloud/login`
2. Open `learn-jee.iiskills.cloud` in new tab
3. ✅ Should be automatically logged in
4. Logout on `learn-jee.iiskills.cloud`
5. Refresh `iiskills.cloud`
6. ✅ Should be logged out there too

### Test Scenario 3: Multiple Authentication Methods

1. Register with email/password on main app
2. Logout
3. Login with Google OAuth on subdomain using same email
4. ✅ Should link to existing account
5. Test magic link authentication
6. ✅ Should work on any subdomain

## Troubleshooting

### Issue: User can't login on subdomain after registering on main app

**Possible causes:**
- Different Supabase projects configured
- Cookie domain not set to `.iiskills.cloud`
- Email not confirmed

**Solution:**
1. Verify all apps use same `NEXT_PUBLIC_SUPABASE_URL`
2. Check cookie domain in Supabase client config
3. Confirm email in Supabase dashboard

### Issue: Session not persisting across subdomains

**Possible causes:**
- Cookie domain misconfigured
- HTTPS not enabled in production
- Browser blocking third-party cookies

**Solution:**
1. Ensure cookie domain is `.iiskills.cloud` (with leading dot)
2. Enable HTTPS in production
3. Check browser cookie settings

### Issue: User data inconsistent between apps

**Possible causes:**
- Apps reading from different metadata fields
- Caching issues

**Solution:**
1. Standardize metadata field names across apps
2. Use `getUserProfile()` helper function consistently
3. Clear localStorage and retry

## Future Enhancements

### Planned Features

1. **Mobile App Integration**
   - React Native apps using same Supabase instance
   - Mobile deep linking for magic links
   - Push notification integration

2. **Social Login Expansion**
   - Facebook authentication
   - GitHub authentication (for developer courses)
   - LinkedIn authentication

3. **Profile Unification**
   - Automatic profile completion prompts
   - Profile migration from simplified to full
   - User preference sync across apps

4. **Enhanced Security**
   - Two-factor authentication (2FA)
   - Biometric authentication for mobile
   - Session activity monitoring

## Test Mode Admin Authentication (TEMPORARY)

⚠️ **WARNING: FOR TESTING ONLY - NOT FOR PRODUCTION USE**

### Overview

A temporary password-first admin authentication system has been implemented for testing purposes. This system allows admin access without requiring Supabase user authentication.

**Status:** 🧪 **TEST MODE ONLY** - Must be disabled before production deployment

### How It Works

1. **First Visit to /admin/universal:**
   - System checks if admin password has been set
   - If not set, shows "Setup Admin Password" flow
   - Admin creates a password (minimum 8 characters)

2. **Password Storage:**
   - Password is hashed using bcrypt (12 rounds)
   - Hash is stored in `admin_settings` Supabase table
   - Accessed via `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

3. **Subsequent Admin Access:**
   - Admin enters password
   - System verifies against stored hash
   - On success, issues JWT token signed with `ADMIN_JWT_SECRET`
   - Token stored in HttpOnly cookie (`admin_token`)
   - Cookie valid for 24 hours

4. **Admin Session Management:**
   - Token verified server-side on each protected route
   - Logout clears the HttpOnly cookie
   - Token expiry enforced by JWT

### Security Features

- ✅ Passwords hashed with bcrypt (never stored plain text)
- ✅ JWT tokens signed with secret key
- ✅ HttpOnly cookies prevent XSS attacks
- ✅ Server-side token verification
- ✅ 24-hour token expiry
- ✅ Secure cookie settings (HTTPS in production)

### Environment Variables Required

```bash
# Server-side admin JWT secret
ADMIN_JWT_SECRET=<generated-secret-32-chars-minimum>

# Supabase service role key (for admin_settings table access)
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Test mode flags
NEXT_PUBLIC_TEST_MODE=true  # Client-side flag
TEST_MODE=true              # Server-side flag
```

### Components Affected

- `apps/main/pages/api/admin/auth.js` - Auth API with bcrypt & JWT
- `apps/main/pages/admin/universal.js` - Admin login/setup UI
- `apps/main/components/ProtectedRoute.js` - Supports admin_token verification
- `supabase/migrations/admin_settings_table.sql` - Password storage table

### Test Mode Features

When `NEXT_PUBLIC_TEST_MODE=true`:

1. **Paywall Bypass:** All paid content accessible without payment
2. **Auth Relaxation:** Content available without Supabase authentication
3. **Admin Access:** Password-first authentication active
4. **Warning Banners:** UI shows test mode indicators

### Rollback Instructions

⚠️ **CRITICAL:** Follow these steps to disable test mode:

1. **Set environment flags to false:**
   ```bash
   NEXT_PUBLIC_TEST_MODE=false
   TEST_MODE=false
   ```

2. **Remove/rotate secrets:**
   ```bash
   ADMIN_JWT_SECRET=  # Remove or generate new
   # Rotate SUPABASE_SERVICE_ROLE_KEY in Supabase dashboard
   ```

3. **Drop admin_settings table:**
   ```sql
   DROP TABLE IF EXISTS public.admin_settings CASCADE;
   DROP FUNCTION IF EXISTS public.handle_admin_settings_updated_at() CASCADE;
   ```

4. **Verify Supabase admin users:**
   ```sql
   UPDATE public.profiles 
   SET is_admin = true 
   WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
   ```

5. **Restart all applications**

6. **Test normal auth flow** - should require Supabase login

**See `TEST_MODE_ROLLBACK.md` for detailed rollback instructions.**

### Security Warnings

⚠️ **NEVER use this in production because:**

1. Service role key exposure risk
2. Single admin password (not user-specific)
3. No audit trail of admin actions
4. Bypasses Supabase security policies
5. All paywalls disabled when test mode active

### Comparison: Test Mode vs Production

| Feature | Test Mode | Production |
|---------|-----------|------------|
| Admin Auth | Password-first | Supabase user-based |
| Admin Password | Single shared password | Individual user credentials |
| Paywalls | Bypassed | Active |
| Content Access | Full (no auth required) | Auth + payment required |
| Audit Trail | None | Full Supabase audit |
| Security | Reduced | Full RLS + policies |

### When to Use

✅ **Use test mode for:**
- Initial testing of admin features
- Content validation across all apps
- Pre-launch system verification
- Temporary QA access

❌ **Never use test mode for:**
- Production deployments
- Live customer environments
- Long-term operations
- Environments with real user data

### Migration Path

**From Test Mode → Production:**

1. Complete all testing and validation
2. Follow rollback instructions in `TEST_MODE_ROLLBACK.md`
3. Configure proper Supabase admin users
4. Enable all authentication and paywall checks
5. Verify security is fully restored
6. Monitor for issues in first 24 hours

---

## Summary

The universal authentication system in iiskills.cloud provides:

✅ **Single registration** works across all apps
✅ **Universal login** recognizes users everywhere
✅ **Shared sessions** via cross-subdomain cookies
✅ **Centralized user management** in Supabase
✅ **Multiple authentication methods** (email, magic link, OAuth)
✅ **Standardized components** for consistency
✅ **Seamless user experience** across the entire platform
🧪 **Test mode admin auth** for temporary testing (must be disabled for production)

Users register once and enjoy frictionless access to all iiskills.cloud services, now and in the future.

---

**Last Updated:** February 2026
**Maintained by:** iiskills.cloud Development Team
