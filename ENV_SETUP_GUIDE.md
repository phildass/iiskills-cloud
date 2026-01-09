# Environment Setup Guide for iiskills-cloud

This guide helps you configure environment variables for local development in the iiskills-cloud monorepo.

## Overview

The iiskills-cloud project is a **monorepo** containing:
- 1 main Next.js app (port 3000)
- 15+ learning module Next.js apps (ports 3001-3015+)

**All apps share the same Supabase credentials** for cross-subdomain authentication.

## Quick Start

### Step 1: Get Supabase Credentials

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings → API**
4. Copy your:
   - **Project URL** (e.g., `https://xyz123abc.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOi...`)

### Step 2: Configure Main App

```bash
# In the repository root
cd /path/to/iiskills-cloud

# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and add your credentials
nano .env.local  # or use your preferred editor
```

Add these values to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_COOKIE_DOMAIN=
```

### Step 3: Configure Each Learning Module

Each learning module needs its own `.env.local` file with the **SAME credentials**:

```bash
# Example for learn-apt module
cd learn-apt
cp .env.local.example .env.local
# Edit and add the SAME Supabase credentials as the main app
nano .env.local

# Repeat for all modules you want to run
cd ../learn-math
cp .env.local.example .env.local
nano .env.local
# ... and so on
```

**Or use this quick script to configure all modules at once:**

```bash
# From repository root, run this to copy .env.local to all modules
for dir in learn-*/; do
  if [ -f "$dir/.env.local.example" ]; then
    cp .env.local.example "$dir/.env.local"
    echo "Created .env.local in $dir"
  fi
done

# Then edit each file to add your Supabase credentials
# All modules must use the SAME credentials!
```

### Step 4: Test Your Configuration

```bash
# Test the main app
npm run dev

# In separate terminals, test individual modules
cd learn-apt && npm run dev
cd learn-math && npm run dev
```

## What Happens Without Environment Variables?

If you try to start the app without configuring environment variables, you'll see a **clear error message** like:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  SUPABASE CONFIGURATION ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Missing required Supabase environment variables!

Required variables:
  ❌ NEXT_PUBLIC_SUPABASE_URL
  ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY

To fix this:
[detailed instructions follow...]
```

This error **prevents the app from starting** until you configure the environment properly.

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xyz123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | `eyJhbGciOi...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Site URL for OAuth redirects | `http://localhost:3000` |
| `NEXT_PUBLIC_MAIN_DOMAIN` | Main domain (production only) | `iiskills.cloud` |
| `NEXT_PUBLIC_COOKIE_DOMAIN` | Cookie domain for cross-subdomain auth | Empty (localhost) |

## Monorepo Structure

```
iiskills-cloud/
├── .env.local              ← Main app environment
├── lib/supabaseClient.js   ← Main Supabase client
├── learn-apt/
│   ├── .env.local          ← Module environment (SAME credentials)
│   └── lib/supabaseClient.js
├── learn-math/
│   ├── .env.local          ← Module environment (SAME credentials)
│   └── lib/supabaseClient.js
├── learn-winning/
│   ├── .env.local          ← Module environment (SAME credentials)
│   └── lib/supabaseClient.js
└── ... (more modules)
```

## Why Same Credentials?

All modules must use the **same Supabase project** because:

1. **Cross-subdomain authentication** - Users logged in on one subdomain (e.g., `iiskills.cloud`) are automatically logged in on all subdomains (e.g., `learn-math.iiskills.cloud`)

2. **Shared user database** - All apps share the same user profiles, admin status, and permissions

3. **Single source of truth** - User data, sessions, and authentication state are centralized

## Production Configuration

For production deployment:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=https://iiskills.cloud
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud  # Note the leading dot!
```

The leading dot in `NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud` enables session sharing across all subdomains.

## Troubleshooting

### "supabaseUrl is required" Error

**Cause:** Environment variables are not configured.

**Solution:** Follow Steps 1-3 above to create `.env.local` files with your Supabase credentials.

### App Starts But Can't Login

**Cause:** Different Supabase credentials across apps, or missing `.env.local` in some modules.

**Solution:** 
1. Verify all `.env.local` files have the SAME Supabase credentials
2. Restart all development servers after updating `.env.local`
3. Clear your browser cache/cookies

### "Module Not Found" Errors

**Cause:** Dependencies not installed.

**Solution:**
```bash
# Install dependencies in main app
npm install

# Install dependencies in each module
cd learn-apt && npm install
cd ../learn-math && npm install
# ... etc
```

### Changes to .env.local Not Taking Effect

**Cause:** Next.js caches environment variables on startup.

**Solution:** Restart the development server:
```bash
# Stop the server (Ctrl+C)
# Start it again
npm run dev
```

## Security Notes

⚠️ **IMPORTANT:**

- Never commit `.env.local` files to git (they're in `.gitignore`)
- The anon/public key is safe to use in the browser
- Keep your Supabase service role key secret (not used in this app)
- Use environment variables for all sensitive data

## Additional Resources

- [QUICK_START.md](./QUICK_START.md) - Quick setup guide
- [QUICK_START_MODULES.md](./QUICK_START_MODULES.md) - Module-specific setup
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment guide
- [SUPABASE_AUTH_SETUP.md](./SUPABASE_AUTH_SETUP.md) - Supabase authentication details
- [Supabase Documentation](https://supabase.com/docs)

## Getting Help

If you're still having issues:

1. Check that you've completed all steps in this guide
2. Verify your Supabase credentials are correct
3. Check the [Supabase Dashboard](https://app.supabase.com) for your project status
4. Review the error message carefully - it contains specific instructions
5. See the troubleshooting section above

---

**Last Updated:** 2026-01-09  
**Maintainer:** AI Cloud Enterprises - Indian Institute of Professional Skills Development
