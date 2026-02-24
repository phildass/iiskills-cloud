# Universal reCAPTCHA Setup Guide

## Overview

This guide explains how to configure Google reCAPTCHA v3 for universal bot protection across all iiskills.cloud apps and subdomains. The implementation uses a **single site key** that covers the entire platform.

## Why Universal reCAPTCHA?

The iiskills.cloud platform consists of:
- 1 main application (iiskills.cloud)
- 1 apps/main application
- 16 learning module applications (learn-*.iiskills.cloud)

Instead of managing 18 separate reCAPTCHA configurations, we use a **single, unified configuration** that:
- ✅ Covers all subdomains with one site key
- ✅ Simplifies credential management
- ✅ Ensures consistent bot protection
- ✅ Reduces configuration errors
- ✅ Works seamlessly across all apps

## Current Usage

As of this implementation, reCAPTCHA v3 is actively used in:

### Newsletter Signup Forms
- **Component:** `components/shared/NewsletterSignup.js`
- **API:** `pages/api/newsletter/subscribe.js`
- **Location:** Available on all apps at `/newsletter` and as modal popup
- **Protection:** Validates user interaction before accepting newsletter subscriptions

### Future Usage (Documented for Reference)

The universal reCAPTCHA keys are configured and ready for use in:
- User registration forms (`components/shared/UniversalRegister.js`)
- Login forms (`components/shared/UniversalLogin.js`)
- Password reset forms
- Contact forms
- Any other form requiring bot protection

**Note:** While authentication forms don't currently use reCAPTCHA, the keys are configured universally so they can be easily integrated in the future without additional setup.

## Setup Instructions

### Step 1: Register Your Site Key

1. Visit [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin/create)

2. Create a new site:
   - **Label:** iiskills.cloud (or your preferred name)
   - **reCAPTCHA Type:** Choose **reCAPTCHA v3** (invisible verification)
   - **Domains:** Add `iiskills.cloud`
     - This automatically covers ALL subdomains: `*.iiskills.cloud`
     - Including: learn-ai.iiskills.cloud, learn-math.iiskills.cloud, etc.

3. Accept the terms and submit

4. Save your keys:
   - **Site Key** (public, starts with `6Lc...`)
   - **Secret Key** (private, starts with `6Lc...`)

### Step 2: Configure Environment Variables

Add the keys to **ALL** `.env.local` files in the repository:

#### Root Directory
```bash
# /home/runner/work/iiskills-cloud/iiskills-cloud/.env.local
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...your-site-key...
RECAPTCHA_SECRET_KEY=6Lc...your-secret-key...
```

#### Apps/Main Directory
```bash
# /home/runner/work/iiskills-cloud/iiskills-cloud/apps/main/.env.local
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...your-site-key...
RECAPTCHA_SECRET_KEY=6Lc...your-secret-key...
```

#### All Learning Modules
```bash
# Example: /home/runner/work/iiskills-cloud/iiskills-cloud/learn-math/.env.local
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...your-site-key...
RECAPTCHA_SECRET_KEY=6Lc...your-secret-key...
```

**Important:** Use the **EXACT SAME** keys in all locations.

### Step 3: Verify Configuration

Run the verification script to ensure all `.env.local` files exist:

```bash
./ensure-env-files.sh
```

**Note:** This script only validates Supabase credentials. You must manually verify reCAPTCHA keys are present.

### Step 4: Test reCAPTCHA Integration

1. Start any application:
   ```bash
   npm run dev
   # or for a specific app
   cd learn-math && npm run dev
   ```

2. Navigate to the newsletter page:
   ```
   http://localhost:3000/newsletter
   ```

3. Submit the newsletter signup form

4. Verify in browser console:
   - reCAPTCHA script loads successfully
   - Token is generated before form submission
   - No "reCAPTCHA not loaded" errors

5. Check server logs:
   - reCAPTCHA token verification succeeds
   - Response includes success: true and score >= 0.5

## Environment Variable Reference

### NEXT_PUBLIC_RECAPTCHA_SITE_KEY
- **Type:** Public (exposed in browser)
- **Required:** Yes (for forms using reCAPTCHA)
- **Format:** String starting with `6Lc`
- **Usage:** Client-side reCAPTCHA script initialization
- **Same across all apps:** YES

### RECAPTCHA_SECRET_KEY
- **Type:** Private (server-side only)
- **Required:** Yes (for backend validation)
- **Format:** String starting with `6Lc`
- **Usage:** Server-side token verification
- **Same across all apps:** YES
- **Security:** Never expose in client code or commit to git

## File Locations

All `.env.local.example` files have been updated with reCAPTCHA configuration:

```
.env.local.example                           ← Root configuration
apps/main/.env.local.example                 ← Main app configuration
learn-ai/.env.local.example                  ← Learn AI module
learn-apt/.env.local.example                 ← Learn Apt module
learn-chemistry/.env.local.example           ← Learn Chemistry module
learn-cricket/.env.local.example             ← Learn Cricket module
learn-data-science/.env.local.example        ← Learn Data Science module
learn-geography/.env.local.example           ← Learn Geography module
learn-govt-jobs/.env.local.example           ← Learn Govt Jobs module
learn-ias/.env.local.example                 ← Learn IAS module
learn-jee/.env.local.example                 ← Learn JEE module
learn-leadership/.env.local.example          ← Learn Leadership module
learn-management/.env.local.example          ← Learn Management module
learn-math/.env.local.example                ← Learn Math module
learn-neet/.env.local.example                ← Learn NEET module
learn-physics/.env.local.example             ← Learn Physics module
learn-pr/.env.local.example                  ← Learn PR module
learn-winning/.env.local.example             ← Learn Winning module
```

## Implementation Details

### Frontend Integration

The `NewsletterSignup.js` component:

1. Loads reCAPTCHA script dynamically:
   ```javascript
   const script = document.createElement("script");
   script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
   ```

2. Executes reCAPTCHA on form submission:
   ```javascript
   const token = await window.grecaptcha.execute(
     process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
     { action: "newsletter_signup" }
   );
   ```

3. Sends token to API for validation

### Backend Validation

The `pages/api/newsletter/subscribe.js` API:

1. Receives reCAPTCHA token from frontend
2. Validates token with Google:
   ```javascript
   const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
     method: "POST",
     body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
   });
   ```

3. Checks score (minimum 0.5 required)
4. Processes subscription if validation succeeds

## Security Considerations

### What's Public
- ✅ `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` - Safe to expose in browser
- ✅ Domain name (iiskills.cloud) - Already public

### What's Private
- ⚠️ `RECAPTCHA_SECRET_KEY` - Must remain server-side only
- ⚠️ Never commit `.env.local` files (they're in `.gitignore`)
- ⚠️ Use environment variables in production deployment

### Best Practices
1. Always use environment variables, never hardcode keys
2. Keep secret key out of client-side code
3. Rotate keys periodically for enhanced security
4. Monitor reCAPTCHA admin console for suspicious activity
5. Set appropriate score thresholds (0.5 is default)

## Troubleshooting

### "reCAPTCHA not loaded" Error

**Cause:** Environment variable not set or script loading failed

**Solution:**
1. Verify `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set in `.env.local`
2. Restart development server after updating `.env.local`
3. Check browser console for script loading errors
4. Ensure site key is valid and matches Google reCAPTCHA admin

### "reCAPTCHA verification failed" Error

**Cause:** Invalid token or secret key mismatch

**Solution:**
1. Verify `RECAPTCHA_SECRET_KEY` is set correctly in `.env.local`
2. Ensure secret key matches the site key (from same reCAPTCHA site)
3. Check server logs for detailed error messages
4. Verify domain is registered in reCAPTCHA admin console

### Different Keys Across Apps

**Cause:** Inconsistent configuration across `.env.local` files

**Solution:**
1. Use the **SAME** keys in **ALL** `.env.local` files
2. Run `./setup-env.sh` to automatically configure all apps
3. Manually verify keys match in all locations
4. Restart all running development servers

## Production Deployment

When deploying to production:

### Environment Configuration

Set the same environment variables on your hosting platform:

**Vercel:**
```bash
vercel env add NEXT_PUBLIC_RECAPTCHA_SITE_KEY production
vercel env add RECAPTCHA_SECRET_KEY production
```

**PM2 Ecosystem:**
Already configured in `.env.local` files, ensure they're deployed with the code.

**Docker:**
```dockerfile
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Lc...your-site-key...
ENV RECAPTCHA_SECRET_KEY=6Lc...your-secret-key...
```

### Domain Verification

1. Ensure `iiskills.cloud` is listed in reCAPTCHA admin console
2. This automatically covers all subdomains
3. No additional configuration needed for new subdomains

## Future Enhancements

While reCAPTCHA is currently used for newsletter signups, the universal configuration enables easy integration with:

### Authentication Forms
- Registration: Add reCAPTCHA to `UniversalRegister.js`
- Login: Add reCAPTCHA to `UniversalLogin.js`
- Password Reset: Protect password reset requests

### Contact Forms
- General inquiries
- Support requests
- Feedback forms

### Payment Forms
- Course enrollment
- Subscription purchases
- Special logic per course ID (as needed)

**Note:** The problem statement mentions that "future paid-course payment/restricted logic can use its own additional checks (scoped by course ID/payment logic)." The universal reCAPTCHA provides baseline protection, and additional validation can be layered on top for specific use cases.

## Related Documentation

- [README.md](README.md) - Main project documentation
- [ENV_SETUP_GUIDE.md](ENV_SETUP_GUIDE.md) - Detailed environment setup guide
- [NEWSLETTER_AI_ASSISTANT_README.md](NEWSLETTER_AI_ASSISTANT_README.md) - Newsletter system documentation
- [NEWSLETTER_RECAPTCHA_PDF_IMPLEMENTATION.md](NEWSLETTER_RECAPTCHA_PDF_IMPLEMENTATION.md) - reCAPTCHA implementation details
- [.env.local.example](.env.local.example) - Root environment template

## Summary

This implementation provides:

✅ **Universal Coverage** - One site key covers all apps and subdomains  
✅ **Simplified Management** - Update once, works everywhere  
✅ **Consistent Protection** - Same validation rules across all forms  
✅ **Easy Integration** - Keys pre-configured, ready for future features  
✅ **Production Ready** - Documented deployment process  
✅ **Secure** - Follows best practices for key management  

The reCAPTCHA keys work on:
- Main site: iiskills.cloud
- All subdomains: *.iiskills.cloud
- Development: localhost (all ports)
- Production: All deployed environments

---

**Last Updated:** 2026-01-20  
**Maintainer:** AI Cloud Enterprises - Indian Institute of Professional Skills Development  
**Status:** ✅ Implementation Complete
