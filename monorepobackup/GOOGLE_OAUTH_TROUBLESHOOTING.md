# Google OAuth Troubleshooting Guide

**Last Updated**: January 2026  
**Purpose**: Comprehensive guide to diagnose and fix Google sign-in issues across all iiskills.cloud domains and subdomains

---

## 🔍 Problem Overview

Google sign-in may fail across certain or all domains/subdomains due to:
- Missing or incorrect callback URLs in Supabase and Google Cloud Console
- Incorrect OAuth provider configuration
- Environment variable issues
- Cookie domain misconfiguration

This guide provides step-by-step instructions to audit, diagnose, and fix all Google OAuth issues.

---

## ✅ Quick Checklist

Use this checklist to verify your Google OAuth setup:

- [ ] Google OAuth provider is enabled in Supabase
- [ ] Google Client ID and Secret are configured in Supabase
- [ ] All callback URLs are added to Supabase
- [ ] All authorized redirect URIs are added to Google Cloud Console
- [ ] Environment variables are correctly set
- [ ] Cookie domain is configured for cross-subdomain auth
- [ ] Google OAuth button appears on login pages
- [ ] Redirect URLs match between Google Console and Supabase

---

## 🎯 Step 1: Verify Supabase Google OAuth Configuration

### 1.1 Enable Google Provider in Supabase

1. Log in to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Authentication** → **Providers**
4. Find **Google** in the list
5. Click to expand Google settings
6. Toggle **Enable Sign in with Google** to **ON**

### 1.2 Configure Google OAuth Credentials

You need to get credentials from Google Cloud Console first (see Step 2), then add them to Supabase:

1. In Supabase **Authentication** → **Providers** → **Google**
2. Enter your **Client ID** (from Google Cloud Console)
3. Enter your **Client Secret** (from Google Cloud Console)
4. Note the **Callback URL** shown in Supabase (e.g., `https://your-project.supabase.co/auth/v1/callback`)
5. Click **Save**

⚠️ **IMPORTANT**: Copy the callback URL shown in Supabase - you'll need this for Google Cloud Console.

---

## 🎯 Step 2: Configure Google Cloud Console

### 2.1 Create/Select Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Either:
   - Click **Select a project** → **New Project** to create a new one
   - Or select an existing project

### 2.2 Create OAuth 2.0 Credentials

**Important Note**: You do **NOT** need to enable "Google People API" or any specific API in the API Library for standard profile sign-in. Google Identity Services (OAuth/OpenID Connect) with scopes `email profile openid` provides basic user info (name, email, avatar) without requiring additional APIs. The Google People API is only needed for extended profile data like contacts.

1. Go to **APIs & Services** → **Credentials**
2. Click **+ Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - Choose **External** (unless your organization uses Workspace)
   - Fill in the required fields:
     - App name: `iiskills.cloud`
     - User support email: Your email
     - Developer contact email: Your email
   - Click **Save and Continue**
   - Add scopes (optional for basic auth)
   - Add test users if needed
   - Click **Save and Continue**

4. Back to creating OAuth client ID:
   - Application type: **Web application**
   - Name: `iiskills.cloud OAuth`
   
5. **Add Authorized JavaScript origins** (domains that can initiate OAuth):
   ```
   http://localhost:3000
   http://localhost:3001
   http://localhost:3009
   http://localhost:3014
   http://localhost:3015
   https://iiskills.cloud
   https://learn-ai.iiskills.cloud
   https://learn-apt.iiskills.cloud
   https://learn-chemistry.iiskills.cloud
   https://learn-data-science.iiskills.cloud
   https://learn-geography.iiskills.cloud
   https://learn-govt-jobs.iiskills.cloud
   https://learn-ias.iiskills.cloud
   https://learn-jee.iiskills.cloud
   https://learn-leadership.iiskills.cloud
   https://learn-management.iiskills.cloud
   https://learn-math.iiskills.cloud
   https://learn-neet.iiskills.cloud
   https://learn-physics.iiskills.cloud
   https://learn-pr.iiskills.cloud
   https://learn-winning.iiskills.cloud
   ```

6. **Add Authorized redirect URIs** (CRITICAL):
   - Add the Supabase callback URL you copied earlier
   - Format: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
   - Example: `https://abcdefghijk.supabase.co/auth/v1/callback`
   
   ⚠️ **This is the most common source of errors!** Make sure:
   - The URL matches EXACTLY what Supabase shows
   - It ends with `/auth/v1/callback`
   - No trailing slashes
   - Uses `https://` (not `http://`)

7. Click **Create**
8. Copy the **Client ID** and **Client Secret** that appear
9. Go back to Supabase and paste these into the Google provider settings

---

## 🎯 Step 3: Configure Redirect URLs in Supabase

### 3.1 Add All Redirect URLs

Supabase needs to know which URLs are allowed after OAuth authentication.

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. In the **Redirect URLs** section, add the following (one per line):

**For Development (localhost):**
```
http://localhost:3000/**
http://localhost:3001/**
http://localhost:3009/**
http://localhost:3014/**
http://localhost:3015/**
```

**For Production (all subdomains):**
```
https://iiskills.cloud/**
https://learn-ai.iiskills.cloud/**
https://learn-apt.iiskills.cloud/**
https://learn-chemistry.iiskills.cloud/**
https://learn-data-science.iiskills.cloud/**
https://learn-geography.iiskills.cloud/**
https://learn-govt-jobs.iiskills.cloud/**
https://learn-ias.iiskills.cloud/**
https://learn-jee.iiskills.cloud/**
https://learn-leadership.iiskills.cloud/**
https://learn-management.iiskills.cloud/**
https://learn-math.iiskills.cloud/**
https://learn-neet.iiskills.cloud/**
https://learn-physics.iiskills.cloud/**
https://learn-pr.iiskills.cloud/**
https://learn-winning.iiskills.cloud/**
```

3. Click **Save**

### 3.2 Set Site URL

1. In the same **URL Configuration** page
2. Set **Site URL** to:
   - Development: `http://localhost:3000`
   - Production: `https://iiskills.cloud`

---

## 🎯 Step 4: Verify Environment Variables

### 4.1 Check Root Directory `.env.local`

Ensure `/home/runner/work/iiskills-cloud/iiskills-cloud/.env.local` exists with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=
```

⚠️ **For production**, set:
```env
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
```

### 4.2 Check Subdomain `.env.local` Files

Each subdomain (e.g., `learn-neet`, `learn-jee`) needs its own `.env.local`:

```env
# MUST use the SAME Supabase credentials as root
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Use subdomain-specific URL
NEXT_PUBLIC_SITE_URL=http://localhost:3009  # or production URL
NEXT_PUBLIC_COOKIE_DOMAIN=
```

### 4.3 Verify All Apps Use Same Supabase Project

**Critical**: All apps must use the **SAME** `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for universal authentication.

Run this to check:
```bash
grep -r "NEXT_PUBLIC_SUPABASE_URL" .env.local learn-*/.env.local 2>/dev/null
```

All should show the same Supabase project URL.

---

## 🎯 Step 5: Verify Code Implementation

### 5.1 Check Google Sign-In Function

The `lib/supabaseClient.js` file should have:

```javascript
export async function signInWithGoogle(redirectTo = null) {
  try {
    const redirectUrl = redirectTo || (typeof window !== 'undefined' 
      ? `${window.location.origin}/` 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      }
    })
    
    if (error) {
      return { success: false, error: error.message }
    }
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Error in signInWithGoogle:', error)
    return { success: false, error: error.message }
  }
}
```

### 5.2 Verify Cookie Domain Configuration

Check `lib/supabaseClient.js` has proper cookie domain setup:

```javascript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    cookieOptions: {
      domain: getCookieDomain(),
      secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    }
  }
})
```

And `utils/urlHelper.js` should have:

```javascript
export function getCookieDomain() {
  if (typeof window === 'undefined') {
    return process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.iiskills.cloud'
  }
  
  const hostname = window.location.hostname
  
  // On localhost, don't set domain (allows cookies to work)
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return undefined
  }
  
  // Use dot prefix for subdomain wildcard
  const mainDomain = getMainDomain()
  return `.${mainDomain}`
}
```

---

## 🎯 Step 6: Test Google Sign-In

### 6.1 Local Testing

1. Start the main app:
   ```bash
   cd /home/runner/work/iiskills-cloud/iiskills-cloud
   npm install
   npm run dev
   ```

2. Open browser to `http://localhost:3000/login`
3. Click **Continue with Google** button
4. Should redirect to Google OAuth consent screen
5. After selecting account, should redirect back to app and log in

### 6.2 Production Testing

1. Deploy to production
2. Visit `https://iiskills.cloud/login`
3. Click **Continue with Google**
4. Complete OAuth flow
5. Verify logged in
6. Visit `https://learn-neet.iiskills.cloud`
7. Should be automatically logged in (cross-subdomain session)

---

## 🔧 Common Error Messages & Fixes

### Error: "redirect_uri_mismatch"

**Cause**: The redirect URI used doesn't match what's configured in Google Cloud Console.

**Fix**:
1. Check browser console for the actual redirect URI being used
2. Go to Google Cloud Console → Credentials → Your OAuth Client
3. Add the EXACT redirect URI shown in the error to **Authorized redirect URIs**
4. The URI should be: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`

### Error: "Invalid login credentials" after Google OAuth

**Cause**: Email not confirmed in Supabase, or Google account email doesn't match.

**Fix**:
1. Go to Supabase Dashboard → Authentication → Users
2. Find the user account
3. Manually confirm the email if needed
4. Or disable email confirmation: Authentication → Settings → Email Settings → Uncheck "Confirm email"

### Error: "Failed to sign in with Google"

**Cause**: Google provider not enabled in Supabase or incorrect credentials.

**Fix**:
1. Verify Google provider is enabled in Supabase
2. Check Client ID and Client Secret are correct
3. Verify OAuth 2.0 credentials are correctly configured in Google Cloud Console

### Error: "Session not persisting across subdomains"

**Cause**: Cookie domain not configured correctly.

**Fix**:
1. Set `NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud` in production
2. Verify `getCookieDomain()` function returns `.iiskills.cloud`
3. Ensure all apps use same Supabase project
4. Check browser allows third-party cookies

### Error: "Sign in button doesn't appear"

**Cause**: Component not configured to show Google OAuth, or error in code.

**Fix**:
1. Check `UniversalLogin` component has `showGoogleAuth={true}`
2. Verify `signInWithGoogle` function is imported
3. Check browser console for JavaScript errors

### Error: "Access blocked: This app's request is invalid"

**Cause**: OAuth consent screen not properly configured.

**Fix**:
1. Go to Google Cloud Console → APIs & Services → OAuth consent screen
2. Complete all required fields
3. Add your email as a test user if app is in testing mode
4. Publish the app if ready for production

---

## 🧪 Verification Script

Create a test script to verify Google OAuth configuration:

```bash
#!/bin/bash
# google-oauth-check.sh

echo "=== Google OAuth Configuration Check ==="
echo ""

# Check environment variables
echo "1. Checking environment variables..."
if [ -f .env.local ]; then
  if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local; then
    echo "✅ NEXT_PUBLIC_SUPABASE_URL found"
  else
    echo "❌ NEXT_PUBLIC_SUPABASE_URL missing"
  fi
  
  if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local; then
    echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY found"
  else
    echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY missing"
  fi
else
  echo "❌ .env.local file not found"
fi

echo ""
echo "2. Checking supabaseClient.js..."
if [ -f lib/supabaseClient.js ]; then
  if grep -q "signInWithGoogle" lib/supabaseClient.js; then
    echo "✅ signInWithGoogle function found"
  else
    echo "❌ signInWithGoogle function missing"
  fi
  
  if grep -q "cookieOptions" lib/supabaseClient.js; then
    echo "✅ cookieOptions configuration found"
  else
    echo "⚠️  cookieOptions configuration missing"
  fi
else
  echo "❌ lib/supabaseClient.js not found"
fi

echo ""
echo "3. Checking UniversalLogin component..."
if [ -f components/shared/UniversalLogin.js ]; then
  if grep -q "signInWithGoogle" components/shared/UniversalLogin.js; then
    echo "✅ Google sign-in imported in UniversalLogin"
  else
    echo "❌ Google sign-in not found in UniversalLogin"
  fi
else
  echo "❌ components/shared/UniversalLogin.js not found"
fi

echo ""
echo "=== Manual Checks Required ==="
echo "1. Verify Google provider is enabled in Supabase Dashboard"
echo "2. Verify Client ID and Secret are configured in Supabase"
echo "3. Verify callback URL in Supabase matches Google Cloud Console"
echo "4. Verify all redirect URIs are added to both Supabase and Google Console"
echo "5. Test Google sign-in on login page"
```

Run with: `chmod +x google-oauth-check.sh && ./google-oauth-check.sh`

---

## 📋 Complete Callback URL List

For easy copy-paste into Google Cloud Console and Supabase:

### Supabase Callback URL (for Google Cloud Console)
```
https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
```
Replace `YOUR-PROJECT-ID` with your actual Supabase project ID.

### All Domain Origins (for Google Cloud Console - JavaScript origins)
```
http://localhost:3000
http://localhost:3001
http://localhost:3009
http://localhost:3014
http://localhost:3015
https://iiskills.cloud
https://learn-ai.iiskills.cloud
https://learn-apt.iiskills.cloud
https://learn-chemistry.iiskills.cloud
https://learn-data-science.iiskills.cloud
https://learn-geography.iiskills.cloud
https://learn-govt-jobs.iiskills.cloud
https://learn-ias.iiskills.cloud
https://learn-jee.iiskills.cloud
https://learn-leadership.iiskills.cloud
https://learn-management.iiskills.cloud
https://learn-math.iiskills.cloud
https://learn-neet.iiskills.cloud
https://learn-physics.iiskills.cloud
https://learn-pr.iiskills.cloud
https://learn-winning.iiskills.cloud
```

### All Redirect URLs (for Supabase URL Configuration)
```
http://localhost:3000/**
http://localhost:3001/**
http://localhost:3009/**
http://localhost:3014/**
http://localhost:3015/**
https://iiskills.cloud/**
https://learn-ai.iiskills.cloud/**
https://learn-apt.iiskills.cloud/**
https://learn-chemistry.iiskills.cloud/**
https://learn-data-science.iiskills.cloud/**
https://learn-geography.iiskills.cloud/**
https://learn-govt-jobs.iiskills.cloud/**
https://learn-ias.iiskills.cloud/**
https://learn-jee.iiskills.cloud/**
https://learn-leadership.iiskills.cloud/**
https://learn-management.iiskills.cloud/**
https://learn-math.iiskills.cloud/**
https://learn-neet.iiskills.cloud/**
https://learn-physics.iiskills.cloud/**
https://learn-pr.iiskills.cloud/**
https://learn-winning.iiskills.cloud/**
```

---

## 🎓 Summary

To restore working Google sign-in:

1. ✅ **Enable Google provider** in Supabase with Client ID and Secret
2. ✅ **Configure Google Cloud Console** with correct redirect URIs
3. ✅ **Add all callback URLs** to both Supabase and Google Console
4. ✅ **Set environment variables** correctly in all apps
5. ✅ **Verify cookie domain** configuration for cross-subdomain auth
6. ✅ **Test on all domains/subdomains** to ensure universal access

The most common issue is **mismatched redirect URIs**. Always ensure:
- Supabase callback URL is in Google Cloud Console Authorized redirect URIs
- All app URLs are in Supabase Redirect URLs
- All app URLs are in Google Cloud Console JavaScript origins

---

## 📞 Support

If issues persist after following this guide:
1. Check Supabase logs: Dashboard → Logs
2. Check browser console for detailed error messages
3. Verify Google Cloud Console OAuth consent screen is published
4. Contact: info@iiskills.cloud

---

**Document Version**: 1.0  
**Last Tested**: January 2026  
**Status**: ✅ Comprehensive troubleshooting guide complete
