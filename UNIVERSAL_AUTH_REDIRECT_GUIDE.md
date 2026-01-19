# Universal Auth Redirect Implementation Guide

## Overview

This guide explains the universal authentication redirect implementation across all iiskills.cloud apps and subdomains. After authentication (sign in, sign up, or magic link), users are **always redirected back** to the exact page where they began the auth flow.

## How It Works

### 1. Protected Routes Capture Origin URL

When a user tries to access a protected page without being authenticated, the protection wrapper captures the current URL and passes it as a redirect parameter:

```javascript
// Example: User visits /learn-ai
// Protection wrapper redirects to: /register?redirect=%2Flearn-ai
const currentPath = router.asPath;
router.push(`/register?redirect=${encodeURIComponent(currentPath)}`);
```

### 2. Auth Components Use Redirect Parameter

All authentication methods check for the `redirect` query parameter and use it for post-auth redirection:

#### Email/Password Login
```javascript
// UniversalLogin.js
const redirectUrl = router.query.redirect || redirectAfterLogin;
setTimeout(() => {
  router.push(redirectUrl); // Returns to /learn-ai
}, 1000);
```

#### Magic Link
```javascript
// UniversalLogin.js
const targetPath = router.query.redirect || redirectAfterLogin;
const redirectUrl = `${window.location.origin}${targetPath}`;
await sendMagicLink(email, redirectUrl);
```

#### Google OAuth
```javascript
// UniversalLogin.js & UniversalRegister.js
const targetPath = router.query.redirect || redirectAfterLogin;
const redirectUrl = `${window.location.origin}${targetPath}`;
await signInWithGoogle(redirectUrl);
```

### 3. Fallback Behavior

If the redirect parameter cannot be determined:
- Falls back to the component's `redirectAfterLogin` or `redirectAfterRegister` prop
- Ultimate fallback is home page (`/`)

## Implementation Details

### Components Updated

#### Core Shared Components
1. **UniversalLogin.js** (`/components/shared/UniversalLogin.js`)
   - Captures `router.query.redirect` parameter
   - Uses it for all auth methods (email/password, magic link, Google OAuth)
   - Falls back to `redirectAfterLogin` prop

2. **UniversalRegister.js** (`/components/shared/UniversalRegister.js`)
   - Captures `router.query.redirect` parameter from protected routes
   - Sets `emailRedirectTo` for email confirmation links
   - Uses redirect for Google OAuth signup
   - Passes redirect to login page after registration

#### Protected Route Wrappers
1. **UserProtectedRoute.js** - For authenticated users
2. **ProtectedRoute.js** - For admin users
3. **PaidUserProtectedRoute.js** - For paid users

All wrappers preserve the destination URL when redirecting to auth:
```javascript
router.push(`/register?redirect=${encodeURIComponent(currentPath)}`);
```

#### Learn-Apt (App Router)
- **AuthContext.tsx** - Updated `signInWithGoogle()` to accept optional `redirectPath` parameter
- Maintains consistency with Pages Router apps

### Apps Covered

✅ All 16 applications updated:
- Main site (`iiskills.cloud`)
- 15 subdomain apps (learn-ai, learn-apt, learn-chemistry, etc.)

## Supabase Configuration

### Required Redirect URLs

To enable OAuth and magic link authentication from all pages, configure the following in your Supabase dashboard:

**Navigation:** Supabase Dashboard → Authentication → URL Configuration

#### Redirect URLs to Add

**Main Domain:**
```
https://iiskills.cloud/*
http://localhost:3000/*
```

**All Subdomains:**
```
https://learn-ai.iiskills.cloud/*
https://learn-apt.iiskills.cloud/*
https://learn-chemistry.iiskills.cloud/*
https://learn-data-science.iiskills.cloud/*
https://learn-geography.iiskills.cloud/*
https://learn-govt-jobs.iiskills.cloud/*
https://learn-ias.iiskills.cloud/*
https://learn-jee.iiskills.cloud/*
https://learn-leadership.iiskills.cloud/*
https://learn-management.iiskills.cloud/*
https://learn-math.iiskills.cloud/*
https://learn-neet.iiskills.cloud/*
https://learn-physics.iiskills.cloud/*
https://learn-pr.iiskills.cloud/*
https://learn-winning.iiskills.cloud/*
```

**Development (Local):**
```
http://localhost:3000/*
http://localhost:3001/*
http://localhost:3002/*
http://localhost:3003/*
(etc., for each app port)
```

### Wildcard Pattern

The `/*` wildcard at the end is **critical** - it allows authentication callbacks to any page path on each domain.

**Example:** User starts at `https://learn-ai.iiskills.cloud/courses/module-1`
- After OAuth: Supabase redirects to `https://learn-ai.iiskills.cloud/courses/module-1`
- The wildcard pattern `https://learn-ai.iiskills.cloud/*` allows this

### Site URL

Set the main site URL in Supabase:
```
https://iiskills.cloud
```

## Testing Checklist

Test authentication from various entry points to ensure redirect works:

### Email/Password Authentication
- [ ] Login from `/learn-ai` → Returns to `/learn-ai`
- [ ] Login from `/courses/module-1` → Returns to `/courses/module-1`
- [ ] Login from home page → Returns to configured default

### Magic Link Authentication
- [ ] Request magic link from `/learn-jee` → Email link returns to `/learn-jee`
- [ ] Request from nested route → Returns to that exact route
- [ ] Click link on mobile → Returns to original page

### Google OAuth Authentication
- [ ] Start OAuth from `/learn-neet` → Returns to `/learn-neet` after Google auth
- [ ] Start from protected page → Returns to that protected page
- [ ] Test on both desktop and mobile

### Registration Flow
- [ ] Register from protected page → After email confirmation, login preserves redirect
- [ ] Google signup from specific page → Returns to that page
- [ ] Email signup → Confirmation link returns to registration context

### Edge Cases
- [ ] Direct access to `/login` (no redirect param) → Goes to default
- [ ] Invalid redirect parameter → Falls back to default
- [ ] External redirect attempt → Prevented by security checks

## Security Considerations

### Open Redirect Prevention

Protected route wrappers validate redirect URLs:
```javascript
// Only allow relative paths for security (prevent open redirect)
const returnUrl = router.asPath.startsWith("/") ? router.asPath : "/";
router.push(`/login?redirect=${encodeURIComponent(returnUrl)}`);
```

This prevents malicious redirects to external sites.

### HTTPS in Production

Supabase cookies are configured for security:
```javascript
cookieOptions: {
  domain: '.iiskills.cloud',
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: 'lax'
}
```

## Code Comments

All modified code includes inline comments explaining the universal redirect mechanism:

```javascript
// Universal Redirect: Use query param redirect if available, otherwise use default
// This ensures users return to where they started the auth flow
```

These comments help future maintainers understand the implementation.

## Troubleshooting

### Issue: Users Not Redirected After OAuth

**Cause:** Redirect URL not whitelisted in Supabase
**Solution:** Add the specific URL pattern to Supabase redirect URLs (see configuration above)

### Issue: Redirect Works Locally But Not in Production

**Cause:** Production domain not added to Supabase configuration
**Solution:** Ensure all production domains are in the Supabase redirect URL list

### Issue: Magic Link Returns to Home Instead of Original Page

**Cause:** `emailRedirectTo` not set correctly
**Solution:** Verify UniversalRegister.js is using the updated code with proper `emailRedirectTo`

### Issue: Redirect Parameter Lost After Registration

**Cause:** Registration flow not preserving redirect
**Solution:** Check that redirect parameter is passed to login page after registration:
```javascript
const finalRedirect = redirectPath
  ? `/login?redirect=${encodeURIComponent(redirectPath)}`
  : redirectAfterRegister;
```

## Maintenance

### Adding New Apps

When adding a new subdomain app:

1. **Copy Auth Components:**
   - Copy `UniversalLogin.js` and `UniversalRegister.js` from `/components/shared/`
   - Copy protection wrappers from `/components/`

2. **Update Supabase:**
   - Add new subdomain to Supabase redirect URLs
   - Format: `https://new-app.iiskills.cloud/*`

3. **Test All Flows:**
   - Email/password login
   - Magic link
   - Google OAuth
   - Registration

### Updating Auth Logic

When modifying authentication logic:

1. Update core components in `/components/shared/`
2. Copy updates to all subdomain apps
3. Update learn-apt `AuthContext.tsx` if applicable
4. Test across multiple apps
5. Update this documentation

## Related Documentation

- [AUTHENTICATION_ARCHITECTURE.md](./AUTHENTICATION_ARCHITECTURE.md) - Overall auth architecture
- [CALLBACK_URLS_REFERENCE.md](./CALLBACK_URLS_REFERENCE.md) - OAuth callback configuration
- [SUPABASE_AUTH_SETUP.md](./SUPABASE_AUTH_SETUP.md) - Supabase setup guide

## Summary

The universal auth redirect implementation ensures a seamless user experience by:

1. ✅ Capturing the original page where users start auth
2. ✅ Preserving this through all auth methods (email, magic link, OAuth)
3. ✅ Returning users to their exact starting point after auth
4. ✅ Working consistently across all 16 iiskills.cloud apps
5. ✅ Falling back to sensible defaults when needed
6. ✅ Protecting against security vulnerabilities

Users can now authenticate from any page and return exactly where they started, improving the experience across the entire iiskills.cloud platform.
