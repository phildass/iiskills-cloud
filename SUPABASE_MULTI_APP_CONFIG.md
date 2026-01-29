# Supabase Multi-App Configuration Guide

## Quick Reference

This guide provides the essential Supabase configuration needed for the multi-app authentication system.

## Required Supabase Settings

### 1. Redirect URLs (Authentication → URL Configuration)

#### Production URLs

Add all app domains to the allowed redirect URLs:

**Recommended: Use Wildcard Pattern**
```
https://*.iiskills.cloud/*
```

**Or Add Individual Domains:**
```
https://iiskills.cloud/*
https://admin.iiskills.cloud/*
https://learn-ai.iiskills.cloud/*
https://learn-apt.iiskills.cloud/*
https://learn-jee.iiskills.cloud/*
https://learn-neet.iiskills.cloud/*
https://learn-chemistry.iiskills.cloud/*
https://learn-cricket.iiskills.cloud/*
https://learn-data-science.iiskills.cloud/*
https://learn-geography.iiskills.cloud/*
https://learn-govt-jobs.iiskills.cloud/*
https://learn-ias.iiskills.cloud/*
https://learn-leadership.iiskills.cloud/*
https://learn-management.iiskills.cloud/*
https://learn-math.iiskills.cloud/*
https://learn-physics.iiskills.cloud/*
https://learn-pr.iiskills.cloud/*
https://learn-winning.iiskills.cloud/*
```

#### Development URLs

Add localhost URLs for all development ports:

```
http://localhost:3000/*
http://localhost:3001/*
http://localhost:3002/*
http://localhost:3003/*
http://localhost:3004/*
http://localhost:3005/*
http://localhost:3006/*
http://localhost:3007/*
http://localhost:3009/*
http://localhost:3010/*
http://localhost:3011/*
http://localhost:3013/*
http://localhost:3014/*
http://localhost:3015/*
http://localhost:3016/*
http://localhost:3017/*
http://localhost:3018/*
http://localhost:3019/*
http://localhost:3020/*
http://localhost:3023/*
```

**Note:** The `/*` wildcard is critical - it allows callbacks to any path within the domain.

### 2. Site URL

Set the main site URL:

**Production:**
```
https://iiskills.cloud
```

**Development:**
```
http://localhost:3000
```

### 3. Email Templates

Configure email templates for:
- Confirmation email
- Magic link email
- Password reset email

**Variables available:**
- `{{ .ConfirmationURL }}` - Confirmation link
- `{{ .Token }}` - Auth token
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Configured site URL

### 4. OAuth Providers

#### Google OAuth Setup

1. **Enable Google Provider** in Supabase Dashboard
2. **Get Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create OAuth 2.0 Client ID
   - Add authorized JavaScript origins:
     ```
     https://iiskills.cloud
     https://learn-jee.iiskills.cloud
     https://learn-neet.iiskills.cloud
     (add all domains)
     ```
   - Add authorized redirect URIs:
     ```
     https://[your-project].supabase.co/auth/v1/callback
     ```

3. **Configure in Supabase:**
   - Client ID: `[from Google Console]`
   - Client Secret: `[from Google Console]`

### 5. Session Settings

**JWT Expiry:**
- Default: 3600 seconds (1 hour)
- Recommended: 604800 seconds (1 week)

**Refresh Token Rotation:**
- Enable: Yes (recommended)

**Auto-confirm Email:**
- Production: No (users must confirm)
- Development: Optional (set to Yes for testing)

## Database Configuration

### Required Tables

#### profiles Table

```sql
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT,
  email TEXT,
  gender TEXT,
  date_of_birth DATE,
  age INTEGER,
  education TEXT,
  qualification TEXT,
  location TEXT,
  state TEXT,
  district TEXT,
  country TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Row Level Security (RLS)

Enable RLS and add policies:

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);
```

### Automatic Profile Creation

Create a function to auto-create profile on user registration:

```sql
-- Function to create profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Environment Variables

### Required Variables for All Apps

Create `.env.local` in each app directory:

```bash
# Supabase Configuration (SAME for all apps)
NEXT_PUBLIC_SUPABASE_URL=https://[your-project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Cookie Domain (MUST be .iiskills.cloud for cross-domain sessions)
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud

# Main Domain
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud

# Site URL (optional, for server-side fallback)
NEXT_PUBLIC_SITE_URL=https://iiskills.cloud
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings → API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

⚠️ **Never commit `.env.local` to git!**

## Testing Checklist

After configuration, test:

### Authentication Tests

- [ ] Register on main app
- [ ] Confirm email
- [ ] Login on main app
- [ ] Navigate to subdomain app → should be authenticated
- [ ] Logout on subdomain → should logout everywhere

### OAuth Tests

- [ ] Click "Sign in with Google" on main app
- [ ] Authorize with Google
- [ ] Verify redirect back to main app
- [ ] Check session works on subdomain apps

### Magic Link Tests

- [ ] Request magic link on subdomain app
- [ ] Check email received
- [ ] Click link
- [ ] Verify redirect back to subdomain app
- [ ] Check session works on other apps

### Cross-App Tests

- [ ] Register on app1 → Login on app2 with same credentials
- [ ] Login on app1 → Open app2 in new tab → should be authenticated
- [ ] Logout on app1 → Refresh app2 → should be logged out

## Common Issues

### Issue: OAuth Redirect Error

**Error:** "redirect_uri_mismatch" or "invalid redirect URL"

**Solution:**
1. Verify redirect URL added to Supabase dashboard
2. Check Google OAuth console has correct redirect URI
3. Ensure URL format exactly matches (with trailing `/*`)

### Issue: Session Not Shared Across Apps

**Symptom:** Login on app1, not authenticated on app2

**Solution:**
1. Verify cookie domain is `.iiskills.cloud` (with leading dot)
2. Ensure HTTPS enabled in production
3. Check browser not blocking third-party cookies
4. Verify all apps use same Supabase project

### Issue: Email Confirmation Not Working

**Symptom:** User doesn't receive confirmation email

**Solution:**
1. Check Supabase email settings
2. Verify SMTP configuration
3. Check spam folder
4. For development, enable auto-confirm in Supabase

### Issue: Can't Add Wildcard URL

**Symptom:** Supabase doesn't accept `*.iiskills.cloud`

**Solution:**
1. Some Supabase plans don't support wildcards
2. Add individual domains instead
3. Or upgrade Supabase plan if available

## Security Best Practices

### 1. Keep Credentials Secret

- ✅ Use `.env.local` files
- ✅ Add `.env.local` to `.gitignore`
- ❌ Never commit credentials to git
- ❌ Never expose credentials in client code

### 2. Use RLS Policies

- ✅ Enable RLS on all tables
- ✅ Create specific policies for each operation
- ✅ Test policies thoroughly
- ❌ Never disable RLS in production

### 3. Validate Admin Access

- ✅ Check `is_admin` flag in database
- ✅ Verify on server-side (API routes)
- ✅ Use Row Level Security
- ❌ Never trust client-side admin checks alone

### 4. Monitor Auth Logs

- ✅ Check Supabase auth logs regularly
- ✅ Monitor failed login attempts
- ✅ Set up alerts for suspicious activity
- ✅ Review OAuth provider usage

## Adding New Apps - Supabase Checklist

When adding a new app:

- [ ] Add production domain to redirect URLs
- [ ] Add development localhost URL
- [ ] Add domain to Google OAuth authorized origins (if using OAuth)
- [ ] Test OAuth flow on new app
- [ ] Test magic link on new app
- [ ] Verify session shared with existing apps
- [ ] Check email templates have correct branding

## Production Deployment

### Pre-deployment Checklist

- [ ] All redirect URLs added to Supabase
- [ ] HTTPS enabled on all domains
- [ ] Cookie domain set to `.iiskills.cloud`
- [ ] Email templates configured
- [ ] OAuth providers configured
- [ ] RLS policies enabled
- [ ] Database functions created
- [ ] Environment variables set correctly

### Post-deployment Checklist

- [ ] Test authentication on main app
- [ ] Test authentication on subdomain apps
- [ ] Verify session sharing works
- [ ] Test OAuth flow
- [ ] Test magic link
- [ ] Monitor error logs
- [ ] Check user registration flow

## Quick Commands

### Check Supabase Connection

```bash
# Test from any app directory
curl https://[your-project].supabase.co/rest/v1/ \
  -H "apikey: [your-anon-key]" \
  -H "Authorization: Bearer [your-anon-key]"
```

### Verify User in Database

```sql
-- In Supabase SQL Editor
SELECT * FROM auth.users WHERE email = 'user@example.com';
SELECT * FROM public.profiles WHERE email = 'user@example.com';
```

### Set User as Admin

```sql
-- In Supabase SQL Editor
UPDATE public.profiles 
SET is_admin = true 
WHERE email = 'admin@example.com';
```

### Check Active Sessions

```sql
-- In Supabase SQL Editor
SELECT * FROM auth.sessions 
WHERE user_id = '[user-uuid]';
```

## Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase OAuth Providers](https://supabase.com/docs/guides/auth/social-login)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

## Support

For Supabase-specific issues:
1. Check [Supabase Status](https://status.supabase.com)
2. Review [Supabase Logs](https://app.supabase.com) → Logs
3. Check [Supabase Community](https://github.com/supabase/supabase/discussions)

---

**Last Updated:** January 2026  
**Maintained by:** iiskills.cloud Development Team
