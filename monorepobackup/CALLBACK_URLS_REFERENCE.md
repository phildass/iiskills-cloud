# Complete Callback URLs Reference for Google OAuth

**Purpose**: This document provides all the callback URLs and redirect URIs needed to configure Google OAuth across all iiskills.cloud domains and subdomains.

**Last Updated**: January 2026

---

## 🎯 Quick Copy-Paste Lists

### 1. Supabase Callback URL (for Google Cloud Console)

Add this to **Google Cloud Console → Credentials → OAuth 2.0 Client → Authorized redirect URIs**:

```
https://YOUR-PROJECT-ID.supabase.co/auth/v1/callback
```

**Important**: Replace `YOUR-PROJECT-ID` with your actual Supabase project ID.

**How to find your Supabase project ID**:
1. Go to Supabase Dashboard → Settings → API
2. Look at your Project URL: `https://[PROJECT-ID].supabase.co`
3. The `[PROJECT-ID]` is what you need

**Example**: If your Supabase URL is `https://abcxyz123.supabase.co`, use:
```
https://abcxyz123.supabase.co/auth/v1/callback
```

---

### 2. Authorized JavaScript Origins (for Google Cloud Console)

Add ALL of these to **Google Cloud Console → Credentials → OAuth 2.0 Client → Authorized JavaScript origins**:

#### Development (localhost)
```
http://localhost:3000
http://localhost:3001
http://localhost:3009
http://localhost:3014
http://localhost:3015
```

#### Production - Main Domain
```
https://iiskills.cloud
```

#### Production - All Learning Subdomains
```
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

**Total**: 21 origins (5 localhost + 16 production domains)

---

### 3. Redirect URLs (for Supabase Dashboard)

Add ALL of these to **Supabase Dashboard → Authentication → URL Configuration → Redirect URLs**:

#### Development (localhost)
```
http://localhost:3000/**
http://localhost:3001/**
http://localhost:3009/**
http://localhost:3014/**
http://localhost:3015/**
```

#### Production - Main Domain
```
https://iiskills.cloud/**
```

#### Production - All Learning Subdomains
```
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

**Note**: The `/**` wildcard allows any path on that domain.

---

## 🔍 Port Assignments Reference

Each subdomain uses a specific port for local development:

| App/Subdomain | Port | Local URL |
|---------------|------|-----------|
| Main site | 3000 | http://localhost:3000 |
| learn-apt | 3001 | http://localhost:3001 |
| learn-winning | 3003 | http://localhost:3003 |
| learn-neet | 3009 | http://localhost:3009 |
| learn-jee | 3009 | http://localhost:3009 |
| learn-govt-jobs | 3014 | http://localhost:3014 |
| learn-ias | 3015 | http://localhost:3015 |

**Note**: Adjust the localhost ports in the JavaScript origins based on which apps you're actively developing.

---

## 📋 Verification Checklist

Use this checklist after configuration:

### Google Cloud Console
- [ ] OAuth 2.0 Client ID created (Web application type)
- [ ] Supabase callback URL added to Authorized redirect URIs
- [ ] All localhost origins added to Authorized JavaScript origins
- [ ] All production domains added to Authorized JavaScript origins
- [ ] OAuth consent screen is configured
- [ ] Client ID and Secret copied

### Supabase Dashboard
- [ ] Google provider enabled (Authentication → Providers → Google)
- [ ] Client ID pasted from Google Cloud Console
- [ ] Client Secret pasted from Google Cloud Console
- [ ] All localhost redirect URLs added (Authentication → URL Configuration)
- [ ] All production redirect URLs added (Authentication → URL Configuration)
- [ ] Site URL configured (http://localhost:3000 for dev, https://iiskills.cloud for prod)

### Environment Configuration
- [ ] `.env.local` exists in root directory
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set correctly
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set correctly
- [ ] `NEXT_PUBLIC_COOKIE_DOMAIN` set to `.iiskills.cloud` for production (empty for localhost)
- [ ] Each subdomain has its own `.env.local` with same Supabase credentials

### Code Verification
- [ ] Run `./google-oauth-check.sh` to verify code configuration
- [ ] `signInWithGoogle` function exists in lib/supabaseClient.js
- [ ] `UniversalLogin` component imports and uses `signInWithGoogle`
- [ ] Google sign-in button appears on /login page

---

## 🧪 Testing Procedure

### Local Testing
1. Start development server:
   ```bash
   npm run dev
   ```

2. Open browser to `http://localhost:3000/login`

3. Click "Continue with Google" button

4. Expected behavior:
   - Redirects to Google OAuth consent screen
   - Shows list of Google accounts
   - After selecting account, redirects back to `http://localhost:3000/`
   - User is logged in

5. Verify session persistence:
   - Start a subdomain app (e.g., learn-neet on port 3009)
   - Navigate to `http://localhost:3009`
   - User should still be logged in

### Production Testing
1. Deploy all environment variables to production

2. Visit `https://iiskills.cloud/login`

3. Click "Continue with Google"

4. Expected behavior:
   - Redirects to Google OAuth consent screen
   - After selecting account, redirects to `https://iiskills.cloud/`
   - User is logged in

5. Test cross-subdomain authentication:
   - Visit `https://learn-neet.iiskills.cloud`
   - Should be automatically logged in (no re-authentication needed)
   - Session persists across all `*.iiskills.cloud` subdomains

6. Test all subdomains:
   - Visit each learning subdomain
   - Verify user remains logged in on all of them

---

## ❌ Common Mistakes

### 1. Missing `/auth/v1/callback` in redirect URI
❌ Wrong: `https://abcxyz123.supabase.co`
✅ Correct: `https://abcxyz123.supabase.co/auth/v1/callback`

### 2. Using http:// for production Supabase callback
❌ Wrong: `http://abcxyz123.supabase.co/auth/v1/callback`
✅ Correct: `https://abcxyz123.supabase.co/auth/v1/callback`

### 3. Forgetting wildcard in Supabase redirect URLs
❌ Wrong: `https://iiskills.cloud`
✅ Correct: `https://iiskills.cloud/**`

### 4. Different Supabase projects for different apps
❌ Wrong: Main app uses project A, learn-neet uses project B
✅ Correct: All apps use the same Supabase project

### 5. Missing domains in JavaScript origins
❌ Wrong: Only adding main domain
✅ Correct: Adding ALL subdomains where Google OAuth will be used

### 6. Not setting cookie domain for production
❌ Wrong: `NEXT_PUBLIC_COOKIE_DOMAIN=` (empty in production)
✅ Correct: `NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud` (with leading dot)

---

## 🔄 Update Procedure

When adding a new subdomain to iiskills.cloud:

1. **Add to Google Cloud Console**:
   - JavaScript origin: `https://learn-newapp.iiskills.cloud`

2. **Add to Supabase Dashboard**:
   - Redirect URL: `https://learn-newapp.iiskills.cloud/**`

3. **Configure subdomain environment**:
   - Create `.env.local` with same Supabase credentials
   - Set `NEXT_PUBLIC_SITE_URL=https://learn-newapp.iiskills.cloud`
   - Set `NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud`

4. **Test Google OAuth** on the new subdomain

---

## 📞 Support

If Google OAuth still doesn't work after configuring all URLs:

1. Run verification script:
   ```bash
   ./google-oauth-check.sh
   ```

2. Check browser console for detailed error messages

3. Check Supabase logs:
   - Dashboard → Logs
   - Look for authentication errors

4. Verify OAuth consent screen:
   - Google Cloud Console → OAuth consent screen
   - Ensure it's published or you're added as a test user

5. See comprehensive troubleshooting:
   - [GOOGLE_OAUTH_TROUBLESHOOTING.md](GOOGLE_OAUTH_TROUBLESHOOTING.md)

---

## 📝 Summary

**For Google Cloud Console**:
- 1 Supabase callback URL in Authorized redirect URIs
- 21 JavaScript origins (5 localhost + 16 production)

**For Supabase Dashboard**:
- 21 redirect URLs (5 localhost + 16 production, all with `/**` suffix)
- Google provider enabled with Client ID and Secret

**For Environment Variables**:
- Same Supabase URL and anon key across all apps
- Cookie domain set to `.iiskills.cloud` for production

**Verification**:
- Run `./google-oauth-check.sh` to verify code
- Test on localhost first, then production
- Verify session persists across subdomains

---

**Document Version**: 1.0  
**Maintained by**: iiskills.cloud Development Team  
**Related Documents**: 
- [GOOGLE_OAUTH_TROUBLESHOOTING.md](GOOGLE_OAUTH_TROUBLESHOOTING.md)
- [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md)
- [AUTHENTICATION_ARCHITECTURE.md](AUTHENTICATION_ARCHITECTURE.md)
