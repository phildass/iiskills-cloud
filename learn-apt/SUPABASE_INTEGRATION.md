# Supabase Integration Guide for learn-apt

This document explains the Supabase authentication integration for the learn-apt subdomain at `learn-apt.iiskills.cloud`.

## Overview

The learn-apt application now uses Supabase for authentication, **sharing the same Supabase project** as the main iiskills-cloud repository. This enables:

- **Unified Authentication**: Users can authenticate across all `*.iiskills.cloud` subdomains
- **Centralized User Management**: All users are stored in one Supabase project
- **Secure Session Management**: JWT-based authentication with automatic token refresh
- **Admin Role Support**: Distinguishes between regular users and administrators
- **Cross-Subdomain Sessions**: Sessions persist across all iiskills.cloud subdomains

## Prerequisites

- Access to the main iiskills-cloud Supabase project
- Supabase project URL and anon key from the main project
- Node.js 18.x or later
- npm or yarn

## Environment Setup

### Step 1: Get Supabase Credentials

**IMPORTANT**: Use the **SAME** Supabase project as the main iiskills-cloud repository.

1. Contact the project administrator or check the main iiskills-cloud repository
2. You need two values:
   - `NEXT_PUBLIC_SUPABASE_URL`: The Supabase project URL (e.g., `https://octgncmruhsbrxpxrkzl.supabase.co`)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anon/public key

### Step 2: Configure Environment Variables

1. Create a `.env.local` file in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with the Supabase credentials:
   ```env
   # Supabase Configuration (REQUIRED)
   NEXT_PUBLIC_SUPABASE_URL=https://octgncmruhsbrxpxrkzl.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
   
   # Site URL
   # Development
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   # Production
   # NEXT_PUBLIC_SITE_URL=https://learn-apt.iiskills.cloud
   
   # Cross-subdomain authentication
   NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
   NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
   
   # Optional: Admin emails (comma-separated)
   # NEXT_PUBLIC_ADMIN_EMAILS=admin@iiskills.cloud,phil@iiskills.cloud
   ```

3. **Never commit `.env.local`** - it's already in `.gitignore`

### Step 3: Install Dependencies

The `@supabase/supabase-js` package is already added to `package.json`:

```bash
npm install
```

## Architecture

### File Structure

```
src/
├── lib/
│   └── supabaseClient.ts        # Supabase client initialization and helpers
├── contexts/
│   └── AuthContext.tsx          # Auth state management using Supabase
└── app/
    └── admin/
        └── page.tsx             # Admin login page (updated for email/password)
```

### Key Components

#### 1. Supabase Client (`src/lib/supabaseClient.ts`)

Provides:
- `supabase`: Configured Supabase client instance
- `getCurrentUser()`: Get the currently authenticated user
- `signInWithEmail(email, password)`: Sign in with credentials
- `signUpWithEmail(email, password, metadata)`: Register new user
- `signOutUser()`: Sign out current user
- `isAdmin(user)`: Check if user has admin privileges

#### 2. Auth Context (`src/contexts/AuthContext.tsx`)

Provides React context for authentication state:
- `user`: Current user object (or null)
- `isAuthenticated`: Boolean indicating if user is logged in
- `isAdmin`: Boolean indicating if user has admin role
- `isLoading`: Boolean indicating loading state
- `login(email, password)`: Login function
- `logout()`: Logout function

#### 3. Admin Page (`src/app/admin/page.tsx`)

Updated to use email/password authentication instead of a hardcoded password.

## Usage

### Authentication Flow

1. **User Registration** (if not already registered in main iiskills-cloud):
   - Users should register through the main iiskills.cloud application
   - Or use the Supabase dashboard to create users manually

2. **Admin Login**:
   - Navigate to `/admin`
   - Enter email and password
   - System validates credentials via Supabase
   - On success, user is authenticated and can access admin panel

3. **Session Persistence**:
   - Sessions are stored in localStorage
   - Sessions persist across page reloads
   - Sessions are shared across `*.iiskills.cloud` subdomains (when configured)

4. **Logout**:
   - Click "Logout" button in admin panel
   - Session is cleared from localStorage
   - User is redirected to login page

### Admin Role Detection

Admins are identified by:
1. **User metadata**: `user.user_metadata.role === 'admin'`
2. **Admin email list**: Email is in `NEXT_PUBLIC_ADMIN_EMAILS` environment variable

To grant admin access:
- **Option 1**: Update user metadata in Supabase dashboard:
  ```sql
  UPDATE auth.users 
  SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
  WHERE email = 'admin@example.com';
  ```
- **Option 2**: Add email to `NEXT_PUBLIC_ADMIN_EMAILS` in `.env.local`

### Programmatic Usage

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth()
  
  // Check if user is logged in
  if (isAuthenticated) {
    console.log('User:', user.email)
  }
  
  // Check if user is admin
  if (isAdmin) {
    console.log('User has admin privileges')
  }
  
  // Login
  const handleLogin = async () => {
    const result = await login(email, password)
    if (result.success) {
      console.log('Login successful')
    } else {
      console.error('Login failed:', result.error)
    }
  }
  
  // Logout
  const handleLogout = async () => {
    await logout()
  }
}
```

## Testing

### Local Development Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/admin`

3. Test with Supabase credentials:
   - Use an existing user from the main iiskills-cloud project
   - Or create a test user in Supabase dashboard

4. Verify:
   - ✅ Login works with valid credentials
   - ✅ Login fails with invalid credentials
   - ✅ Session persists on page reload
   - ✅ Logout clears session
   - ✅ Admin detection works correctly

### Production Testing

1. Deploy to production (Vercel or self-hosted)

2. Update `.env.local` or environment variables with production values:
   ```env
   NEXT_PUBLIC_SITE_URL=https://learn-apt.iiskills.cloud
   NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
   ```

3. Test authentication flows:
   - ✅ Login from learn-apt subdomain
   - ✅ Session persists across subdomain navigation (if applicable)
   - ✅ Logout works correctly
   - ✅ HTTPS cookies are secure

### Cross-Subdomain Testing

If you have multiple subdomains (e.g., `iiskills.cloud`, `learn-apt.iiskills.cloud`, `admin.iiskills.cloud`):

1. Login on one subdomain
2. Navigate to another subdomain
3. Verify session is maintained

**Note**: This requires:
- All subdomains use the same Supabase project
- `NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud` is set correctly
- All apps are on HTTPS in production

## Security Considerations

### Best Practices

1. **Environment Variables**:
   - Never commit `.env.local` to version control
   - Use environment variables for all sensitive data
   - Rotate keys if compromised

2. **Supabase Configuration**:
   - Enable email confirmation for new users
   - Configure Row Level Security (RLS) policies in Supabase
   - Set up proper redirect URLs in Supabase dashboard

3. **Authentication**:
   - Use HTTPS in production (required by Supabase)
   - Implement rate limiting on login attempts
   - Monitor failed login attempts

4. **Admin Access**:
   - Limit admin emails to trusted addresses
   - Use strong passwords
   - Regularly audit admin access

### Row Level Security (RLS)

If you plan to store data in Supabase tables, always enable RLS:

```sql
-- Example: Enable RLS on a table
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- Example: Allow users to read their own data
CREATE POLICY "Users can view own assessments"
ON assessments
FOR SELECT
USING (auth.uid() = user_id);

-- Example: Allow admins to view all data
CREATE POLICY "Admins can view all assessments"
ON assessments
FOR SELECT
USING (
  auth.jwt() ->> 'role' = 'admin'
  OR auth.jwt() ->> 'email' = ANY(string_to_array(current_setting('app.admin_emails', true), ','))
);
```

## Troubleshooting

### "Invalid API key" Error

**Cause**: Incorrect or missing Supabase credentials

**Solution**:
1. Verify `.env.local` exists and has correct values
2. Check that values match the main iiskills-cloud project
3. Restart development server after changing `.env.local`

### "Invalid login credentials" Error

**Cause**: User doesn't exist or password is incorrect

**Solution**:
1. Verify user exists in Supabase dashboard (Authentication → Users)
2. Check if email is confirmed (if email confirmation is enabled)
3. Try resetting password through Supabase
4. For testing, create a user manually in Supabase dashboard

### Session Not Persisting

**Cause**: localStorage issues or cookie configuration problems

**Solution**:
1. Clear browser localStorage and cookies
2. Check browser console for errors
3. Verify `NEXT_PUBLIC_COOKIE_DOMAIN` is set correctly (`.iiskills.cloud` with leading dot)
4. Ensure HTTPS is used in production

### Admin Access Not Working

**Cause**: User not configured as admin

**Solution**:
1. Verify user metadata in Supabase dashboard
2. Check `NEXT_PUBLIC_ADMIN_EMAILS` environment variable
3. Update user metadata:
   ```sql
   UPDATE auth.users 
   SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
   WHERE email = 'your-email@example.com';
   ```

### Cross-Subdomain Authentication Not Working

**Cause**: Cookie domain misconfigured or HTTPS not used

**Solution**:
1. Verify `NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud` (note the leading dot)
2. Ensure all subdomains use HTTPS in production
3. Check that all apps use the same Supabase project
4. Verify cookie settings in browser DevTools

## Migration from Legacy Auth

The previous implementation used a hardcoded password (`phil123`) stored client-side. This has been replaced with Supabase authentication.

### Changes Made

1. **Removed**:
   - Hardcoded `ADMIN_PASSWORD` constant
   - SessionStorage-based authentication
   - Password-only login

2. **Added**:
   - Supabase client configuration
   - Email/password authentication
   - Session management via Supabase
   - Admin role detection
   - Cross-subdomain support

3. **Updated**:
   - `AuthContext.tsx`: Now uses Supabase instead of sessionStorage
   - `admin/page.tsx`: Now requires email + password instead of just password
   - `.env.example`: Added Supabase configuration

### Data Migration

No data migration is required as the previous auth system didn't store user data in a database.

## Support and Resources

### Documentation

- [Supabase Authentication Docs](https://supabase.com/docs/guides/auth)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Main Repository

For the shared Supabase project configuration, refer to:
- Main repository: [phildass/iiskills-cloud](https://github.com/phildass/iiskills-cloud)
- Supabase setup guide: `SUPABASE_AUTH_SETUP.md` in main repository

### Contact

For issues or questions:
- Check this guide and the main repository documentation
- Review Supabase dashboard for user and configuration issues
- Contact: info@iiskills.cloud

## Appendix: Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL | `https://octgncmruhsbrxpxrkzl.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key | `eyJhbGci...` |
| `NEXT_PUBLIC_SITE_URL` | Yes | Application URL | `http://localhost:3000` (dev)<br/>`https://learn-apt.iiskills.cloud` (prod) |
| `NEXT_PUBLIC_MAIN_DOMAIN` | No | Main domain for cookies | `iiskills.cloud` |
| `NEXT_PUBLIC_COOKIE_DOMAIN` | No | Cookie domain for cross-subdomain auth | `.iiskills.cloud` |
| `NEXT_PUBLIC_ADMIN_EMAILS` | No | Comma-separated admin emails | `admin@iiskills.cloud,phil@iiskills.cloud` |

## Summary

✅ **Supabase integration complete**
- Uses the same Supabase project as iiskills-cloud
- Email/password authentication implemented
- Admin role detection configured
- Cross-subdomain support enabled
- Session management working
- Documentation provided

🔐 **Security**:
- Environment variables properly configured
- .env.local excluded from git
- Secure cookie settings for production
- Admin access controlled

📚 **Documentation**:
- Setup instructions provided
- Usage examples included
- Troubleshooting guide available
- Testing procedures documented

---

**Last Updated**: December 30, 2025  
**Version**: 1.0.0  
**Author**: GitHub Copilot
