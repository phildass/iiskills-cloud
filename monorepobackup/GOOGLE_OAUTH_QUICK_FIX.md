# Google OAuth Quick Fix Guide

**If Google sign-in is not working**, follow these steps in order:

## 🚀 Quick Fix Steps (5 minutes)

### Step 1: Run the Verification Script
```bash
cd /path/to/iiskills-cloud
./google-oauth-check.sh
```

**Note**: If you get a "permission denied" error, run:
```bash
chmod +x google-oauth-check.sh
./google-oauth-check.sh
```

This will tell you what's missing. Fix any errors shown.

---

### Step 2: Verify Supabase Callback URL in Google Console

**Most Common Issue**: The callback URL in Google Cloud Console doesn't match Supabase.

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to: **Authentication → Providers → Google**
3. Copy the **Callback URL** shown (e.g., `https://abcxyz123.supabase.co/auth/v1/callback`)

4. Go to [Google Cloud Console](https://console.cloud.google.com/)
5. Navigate to: **APIs & Services → Credentials**
6. Click on your OAuth 2.0 Client ID
7. Under **Authorized redirect URIs**, add the EXACT callback URL from Supabase
8. Click **Save**

⚠️ **Critical**: The URLs must match EXACTLY. Even a trailing `/` will cause errors.

---

### Step 3: Add All Redirect URLs to Supabase

1. In Supabase Dashboard, go to: **Authentication → URL Configuration**
2. Add these redirect URLs (one per line):

**For Development**:
```
http://localhost:3000/**
http://localhost:3009/**
```

**For Production** (add ALL domains where users will log in):
```
https://iiskills.cloud/**
https://learn-neet.iiskills.cloud/**
https://learn-jee.iiskills.cloud/**
https://learn-govt-jobs.iiskills.cloud/**
```

(See [CALLBACK_URLS_REFERENCE.md](CALLBACK_URLS_REFERENCE.md) for complete list)

3. Click **Save**

---

### Step 4: Verify Google Provider is Enabled

1. Supabase Dashboard → **Authentication → Providers**
2. Find **Google** in the list
3. Ensure toggle is **ON** (enabled)
4. Verify **Client ID** and **Client Secret** are filled in
5. If not, get them from Google Cloud Console and paste them

---

### Step 5: Check Environment Variables

Verify `.env.local` exists and has:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_COOKIE_DOMAIN=
```

**Restart your dev server** after changing `.env.local`!

---

### Step 6: Test Google Sign-In

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Open browser to `http://localhost:3000/login`

3. Click "Continue with Google"

4. Should redirect to Google, then back to your app

**If it works**: ✅ Success! Google OAuth is now configured.

**If it still fails**: Continue to Step 7

---

### Step 7: Check Browser Console for Errors

1. Open browser DevTools (F12)
2. Go to Console tab
3. Click "Continue with Google" again
4. Look for error messages

**Common errors and fixes**:

- **"redirect_uri_mismatch"**: See Step 2 - URLs don't match
- **"invalid_client"**: Client ID or Secret is wrong in Supabase
- **"access_denied"**: OAuth consent screen not configured or user not added as test user

---

## 📋 Still Not Working?

If Google OAuth still doesn't work after following all steps:

1. **Read the comprehensive guide**: [GOOGLE_OAUTH_TROUBLESHOOTING.md](GOOGLE_OAUTH_TROUBLESHOOTING.md)

2. **Check Supabase logs**:
   - Supabase Dashboard → Logs
   - Look for authentication errors

3. **Verify Google Cloud Console OAuth Consent Screen**:
   - Go to: APIs & Services → OAuth consent screen
   - Ensure it's configured
   - Add yourself as a test user if app is in testing mode

4. **Check all authorized origins**:
   - Google Cloud Console → Credentials → Your OAuth Client
   - **Authorized JavaScript origins** should include:
     - `http://localhost:3000`
     - `https://iiskills.cloud`
     - All subdomains you're using

5. **Clear browser cache and cookies**:
   - Sometimes old OAuth tokens cause issues
   - Try in incognito/private browsing mode

---

## 🎯 Production Deployment Checklist

Before deploying to production:

- [ ] Google provider enabled in Supabase
- [ ] Client ID and Secret configured in Supabase
- [ ] Supabase callback URL added to Google Console
- [ ] ALL production domains added to Google Console JavaScript origins
- [ ] ALL production domains added to Supabase redirect URLs
- [ ] `NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud` set in production env vars
- [ ] `NEXT_PUBLIC_SITE_URL` set to production URL
- [ ] OAuth consent screen published (or you're added as test user)
- [ ] Tested on at least 2 different subdomains to verify cross-subdomain auth

---

## 📞 Get Help

- **Verification Script**: `./google-oauth-check.sh`
- **Complete Guide**: [GOOGLE_OAUTH_TROUBLESHOOTING.md](GOOGLE_OAUTH_TROUBLESHOOTING.md)
- **URL Reference**: [CALLBACK_URLS_REFERENCE.md](CALLBACK_URLS_REFERENCE.md)
- **Auth Setup**: [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md)

---

**Last Updated**: January 2026
