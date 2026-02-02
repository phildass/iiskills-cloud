# Temporary Authentication Disable Feature

## ⚠️ CRITICAL SECURITY WARNING

**This feature completely disables authentication and paywalls across the entire application.**

- All content becomes publicly accessible without login
- All API routes bypass authentication checks
- All admin features become publicly accessible
- **NEVER enable in production without explicit approval**
- Only use for temporary debugging, maintenance, or testing

## Purpose

This temporary override allows you to:
- Test the application without authentication flows
- Debug issues that may be related to auth
- Perform maintenance without user sessions
- Quickly demo features without login friction

## How to Enable

### Local Development

1. **Set environment variables in your shell:**
   ```bash
   export DISABLE_AUTH=true
   export NEXT_PUBLIC_DISABLE_AUTH=true
   ```

2. **Or add to `.env.local` file:**
   ```
   DISABLE_AUTH=true
   NEXT_PUBLIC_DISABLE_AUTH=true
   ```

3. **Rebuild and restart the application:**
   ```bash
   npm run build
   npm run dev
   # or for production build
   npm run start
   ```

4. **Use the helper script:**
   ```bash
   ./scripts/set-disable-auth.sh
   ```
   This will print the export commands you need to run.

### CI/Deployment

Add the environment variables to your deployment configuration:
- **Vercel:** Add to Environment Variables in project settings
- **Netlify:** Add to Build environment variables
- **Docker:** Add to your docker-compose.yml or Dockerfile
- **PM2:** Add to ecosystem.config.js environment section

Example for PM2:
```javascript
{
  env: {
    DISABLE_AUTH: 'true',
    NEXT_PUBLIC_DISABLE_AUTH: 'true'
  }
}
```

## How to Disable (Revert to Normal)

### Option 1: Unset Environment Variables

```bash
unset DISABLE_AUTH
unset NEXT_PUBLIC_DISABLE_AUTH
```

Then rebuild and restart:
```bash
npm run build
npm run dev
```

### Option 2: Remove from .env.local

Delete or comment out the lines in `.env.local`:
```
# DISABLE_AUTH=true
# NEXT_PUBLIC_DISABLE_AUTH=true
```

Then rebuild and restart.

### Option 3: Set to false

```bash
export DISABLE_AUTH=false
export NEXT_PUBLIC_DISABLE_AUTH=false
```

Then rebuild and restart.

## What Gets Bypassed

When this feature is enabled, the following are bypassed:

### Client-Side
- `getCurrentUser()` returns a mock user instead of null
- `ProtectedRoute` components allow access without auth
- `PaidUserProtectedRoute` components allow access without auth  
- `UserProtectedRoute` components allow access without auth
- Paywall checks are bypassed
- Login/Register redirect logic is disabled

### Server-Side
- API route authentication checks are bypassed
- `getServerSideProps` auth checks are bypassed
- Server-side redirects to /login are bypassed
- Middleware auth checks are bypassed
- Admin verification is bypassed

## Mock User Details

When auth is disabled, a mock user is provided with full permissions:

```javascript
{
  id: 'dev-override',
  email: 'dev@iiskills.cloud',
  role: 'bypass',
  user_metadata: {
    firstName: 'Dev',
    lastName: 'Override',
    full_name: 'Dev Override',
    is_admin: true,
    payment_status: 'paid'
  },
  app_metadata: {
    payment_status: 'paid',
    is_admin: true
  }
}
```

This mock user has:
- Admin privileges
- Paid/premium status
- All features unlocked

## Technical Implementation

### Feature Flag Module

The centralized flag is in: `lib/feature-flags/disableAuth.js`

```javascript
import { isAuthDisabledClient, isAuthDisabledServer, getMockUser } from '@/lib/feature-flags/disableAuth';

// Client-side check
if (isAuthDisabledClient()) {
  return getMockUser();
}

// Server-side check  
if (isAuthDisabledServer()) {
  req.user = getMockUser();
}
```

### Modified Files

All modified files have a corresponding `.bak.<timestamp>` backup file in the same directory for easy reversion.

See the PR description for the complete list of modified files.

## Verification

### Check if Auth is Disabled

1. **Console logs:** Look for this warning on server startup:
   ```
   ⚠️  AUTHENTICATION DISABLED - TEMPORARY OVERRIDE ACTIVE
   ```

2. **Visit protected pages:** Try accessing `/admin` or other protected routes without logging in

3. **Check environment:**
   ```bash
   echo $DISABLE_AUTH
   echo $NEXT_PUBLIC_DISABLE_AUTH
   ```

### Re-enable Normal Auth

To verify auth is working normally again:

1. Unset the environment variables
2. Rebuild the application
3. Try accessing a protected page - you should be redirected to login
4. Console should NOT show the "AUTHENTICATION DISABLED" warning

## Troubleshooting

### Auth still active after enabling flag

- **Did you rebuild?** Environment variables are baked into the build. You must rebuild after changing them.
- **Correct syntax?** Must be exactly `true` (lowercase)
- **Server restarted?** Server-side changes require a restart

### Auth still bypassed after disabling flag

- **Did you rebuild?** You must rebuild after unsetting variables
- **Cleared build cache?** Try: `rm -rf .next && npm run build`
- **Check .env.local:** Make sure variables are not set there

## Security Checklist

Before enabling in any environment:

- [ ] Have explicit approval from stakeholders
- [ ] Understand the security implications
- [ ] Have a plan to revert quickly
- [ ] Limited time window for the override
- [ ] Monitor for unexpected access
- [ ] Document why it was necessary
- [ ] Revert immediately after completing task

## Related Files

- Feature flag: `lib/feature-flags/disableAuth.js`
- Helper script: `scripts/set-disable-auth.sh`
- This documentation: `docs/DISABLE_AUTH_README.md`

## Support

For questions or issues:
1. Check this documentation first
2. Review the PR description: `feature/disable-auth-temporary`
3. Check backup files if you need to revert specific changes
4. Contact the development team

---

**Remember:** This is a temporary debugging tool. Always revert when done.
