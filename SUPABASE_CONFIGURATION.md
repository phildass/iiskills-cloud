# Supabase Configuration Guide

This guide explains how to properly configure Supabase authentication across all subdomains in the iiskills-cloud monorepo.

## Overview

The iiskills-cloud monorepo uses a **unified Supabase authentication system** that works across all subdomains. This means users can log in once and access all learn-\* subdomains without re-authenticating.

## Security Status ✅

As of the latest audit (January 2026):

- ✅ **No hardcoded credentials** in source code
- ✅ **Consistent environment variable usage** across all 15+ subdomains
- ✅ **Proper .gitignore configuration** to prevent credential leaks
- ✅ **Standardized validation** with helpful error messages

## Architecture

### Cross-Subdomain Authentication

All subdomains (main site and all learn-\* apps) share:

- **Same Supabase project** (same URL and anon key)
- **Same authentication state** via shared localStorage key: `iiskills-auth-token`
- **Same cookie domain** in production: `.iiskills.cloud` (note the leading dot)

### Subdomains

The following subdomains are configured:

1. Main site: `iiskills.cloud`
2. learn-ai: `learn-ai.iiskills.cloud`
3. learn-apt: `learn-apt.iiskills.cloud`
4. learn-chemistry: `learn-chemistry.iiskills.cloud`
5. learn-data-science: `learn-data-science.iiskills.cloud`
6. learn-geography: `learn-geography.iiskills.cloud`
7. learn-govt-jobs: `learn-govt-jobs.iiskills.cloud`
8. learn-ias: `learn-ias.iiskills.cloud`
9. learn-jee: `learn-jee.iiskills.cloud`
10. learn-leadership: `learn-leadership.iiskills.cloud`
11. learn-management: `learn-management.iiskills.cloud`
12. learn-math: `learn-math.iiskills.cloud`
13. learn-neet: `learn-neet.iiskills.cloud`
14. learn-physics: `learn-physics.iiskills.cloud`
15. learn-pr: `learn-pr.iiskills.cloud`
16. learn-winning: `learn-winning.iiskills.cloud`

## Required Environment Variables

Each application (root and all learn-\* directories) requires these environment variables:

```env
# Supabase Project URL (SAME for all subdomains)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous/Public Key (SAME for all subdomains)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Site URL for OAuth redirects (UNIQUE per subdomain)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Cookie domain for cross-subdomain authentication
# Leave empty for localhost, set to .iiskills.cloud for production
NEXT_PUBLIC_COOKIE_DOMAIN=
```

## Local Development Setup

### Step 1: Set Up Root Directory

```bash
# In the root directory
cd /path/to/iiskills-cloud
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=
```

### Step 2: Set Up Each Subdomain

For each learn-\* directory you're working with:

```bash
# Example for learn-govt-jobs
cd learn-govt-jobs
cp .env.local.example .env.local
```

Edit `learn-govt-jobs/.env.local`:

```env
# ⚠️ IMPORTANT: Use the SAME credentials as root .env.local
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE

# Use subdomain-specific port for development
NEXT_PUBLIC_SITE_URL=http://localhost:3014
NEXT_PUBLIC_COOKIE_DOMAIN=
```

### Development Ports

Each subdomain uses a different port for local development:

- Root: `3000`
- learn-winning: `3003`
- learn-neet: `3009`
- learn-jee: `3009`
- learn-govt-jobs: `3014`
- learn-ias: `3015`
- (See each subdomain's `.env.local.example` for its default port)

## Production Deployment

### Environment Variables

Set these in your deployment platform (Vercel, Netlify, etc.):

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
NEXT_PUBLIC_SITE_URL=https://learn-govt-jobs.iiskills.cloud
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
```

### Key Points for Production

1. **Same Supabase Project**: All subdomains MUST use the same `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **Cookie Domain**: Set `NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud` (with leading dot) to enable cross-subdomain authentication

3. **Site URL**: Each subdomain should have its own unique `NEXT_PUBLIC_SITE_URL`

4. **Never Commit**: Never commit `.env.local` or `.env.production` files to git

## Getting Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Supabase Dashboard Configuration

### Cookie Domain Setting

In your Supabase dashboard:

1. Go to **Authentication** → **Settings**
2. Set **Cookie Domain** to: `.iiskills.cloud`
3. This enables authentication to work across all `*.iiskills.cloud` subdomains

### Allowed Redirect URLs

Add all your production URLs to the allowed redirect list:

1. Go to **Authentication** → **URL Configuration**
2. Add redirect URLs:
   ```
   https://iiskills.cloud/*
   https://learn-govt-jobs.iiskills.cloud/*
   https://learn-neet.iiskills.cloud/*
   https://learn-jee.iiskills.cloud/*
   (... and all other subdomains)
   http://localhost:*  (for development)
   ```

## Code Implementation

### Standard Pattern

All `lib/supabaseClient.js` files follow this pattern:

```javascript
import { createClient } from "@supabase/supabase-js";

// Get credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Warn if not configured (doesn't break builds)
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
  );
}

// Create client with cross-subdomain support
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    storageKey: "iiskills-auth-token", // Shared across subdomains
  },
});
```

### Helper Functions

All supabaseClient files export these helper functions:

- `getCurrentUser()`: Get the current authenticated user
- `signOutUser()`: Sign out the current user
- `signInWithEmail(email, password)`: Sign in with email/password
- `isAdmin(user)`: Check if user has admin role
- `getUserProfile(user)`: Get user profile data
- `getSiteUrl()`: Get the site URL for redirects

## Testing

### Local Testing

1. Start the main app:

   ```bash
   npm run dev
   ```

2. Start a subdomain:

   ```bash
   cd learn-govt-jobs
   npm run dev
   ```

3. Log in on one app and verify you're logged in on the other

### Production Testing

1. Deploy to production
2. Navigate to main site and log in
3. Navigate to any learn-\* subdomain
4. Verify you're automatically logged in (session shared)
5. Test sign-out works across all subdomains

## Troubleshooting

### "Missing Supabase environment variables" warning

**Cause**: Environment variables not set in `.env.local`

**Fix**: Copy `.env.local.example` to `.env.local` and add your credentials

### Authentication not working across subdomains

**Cause**: Different Supabase projects used, or cookie domain not set

**Fix**:

1. Verify all `.env.local` files use the SAME Supabase URL and key
2. In production, ensure `NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud`
3. In Supabase dashboard, set cookie domain to `.iiskills.cloud`

### OAuth redirects failing

**Cause**: Redirect URL not allowed in Supabase

**Fix**: Add the URL to allowed redirect URLs in Supabase dashboard

## Security Best Practices

1. ✅ **Never hardcode credentials** in source code
2. ✅ **Use environment variables** for all secrets
3. ✅ **Don't commit `.env.local`** to git (already in .gitignore)
4. ✅ **Use different credentials** for development and production (recommended)
5. ✅ **Rotate keys** if they're ever exposed
6. ✅ **Share credentials securely** via password manager or encrypted channels

## Recent Audit (January 2026)

A comprehensive audit was performed to:

- ✅ Remove all hardcoded Supabase URLs and keys
- ✅ Standardize environment variable validation
- ✅ Fix corrupted configuration files
- ✅ Ensure consistency across all 15+ subdomains
- ✅ Update documentation

**Result**: All configurations are now secure and consistent.

## Support

For issues or questions:

1. Check this documentation
2. Review `SECURITY_CREDENTIALS.md` for security guidelines
3. Check `SUPABASE_AUTH_SETUP.md` for authentication details
4. Contact the development team

---

**Last Updated**: January 2026
**Audit Status**: ✅ Verified Secure
