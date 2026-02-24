# Newsletter Subscription System - Implementation Guide

## Overview

This implementation makes the newsletter subscription system production-ready with clear messaging, robust Supabase integration, and user-friendly opt-in/opt-out flows.

## Key Features Implemented

### 1. Clear Newsletter Policy Messaging
All newsletter touchpoints now display the policy:
> "The Skilling Newsletter will be sent ONLY when new courses are introduced, or important announcements/changes are made. You will NOT receive unnecessary or frequent emails."

This appears in:
- Newsletter signup popup/modal
- /newsletter page
- Registration form
- All newsletter-related UI components

### 2. Registration Flow Updates

#### New Newsletter Subscription Options
During registration (email/password or Google OAuth), users see:
- **Pre-selected option**: "✅ Yes, sign me up for updates!" (default)
- **Alternative option**: "No thanks, not right now"

The selection is saved to the user's Supabase profile as `subscribed_to_newsletter` (boolean).

#### Google OAuth Auto-Subscription
Users registering via Google are auto-subscribed by default, but they can:
- Opt out during registration
- Unsubscribe later from settings or email links

### 3. Supabase Database Schema

#### New Field: `subscribed_to_newsletter`
Added to `public.profiles` table:
```sql
subscribed_to_newsletter boolean DEFAULT true NOT NULL
```

#### Unsubscribe Token System
New table `newsletter_unsubscribe_tokens`:
- Stores secure tokens for one-click email unsubscription
- Tokens expire after 90 days
- No login required to unsubscribe
- Prevents token reuse

#### Database Functions
- `generate_unsubscribe_token(user_id, email)` - Creates secure tokens
- `process_unsubscribe(token)` - Handles unsubscribe with validation

### 4. API Endpoints

#### `/api/newsletter/subscribe` (Updated)
- Now syncs with user profiles if authenticated
- Updates `subscribed_to_newsletter = true` in profiles table
- Maintains backward compatibility with newsletter_subscribers table

#### `/api/newsletter/unsubscribe` (New)
- Token-based unsubscribe (no login required)
- Updates both profiles and newsletter_subscribers tables
- Validates token expiration and usage

#### `/api/newsletter/generate-token` (New)
- Generates secure unsubscribe tokens for email campaigns
- Should be called when sending newsletter emails
- Returns token and full unsubscribe URL

### 5. User-Facing Pages

#### `/newsletter` Page (Updated)
- Removed placeholder text
- Shows clear policy messaging
- Highlights "only important updates" promise
- Updated benefits section to match policy

#### `/unsubscribe` Page (New)
- One-click unsubscribe from email links
- Friendly, AI-generated confirmation messages
- Shows what unsubscribing means
- Option to resubscribe
- Helpful error messages for expired/invalid tokens

### 6. Updated Components

#### `NewsletterSignup` Component
- Updated messaging with policy promise
- Clear value proposition
- Success message emphasizes "no spam"

#### `UniversalRegister` Component
- Newsletter subscription checkbox section
- Pre-checked "Yes" option by default
- Radio button UX for clear choice
- Syncs preference to user metadata → Supabase profile

## Deployment Steps

### 1. Database Migration

Run the following SQL migrations in your Supabase SQL Editor:

#### Step 1: Update Profiles Schema
```bash
# Location: supabase/profiles_schema.sql
```
This adds the `subscribed_to_newsletter` field and updates the trigger.

#### Step 2: Run Newsletter Migration
```bash
# Location: supabase/migrations/add_newsletter_subscription_to_profiles.sql
```
This creates:
- `subscribed_to_newsletter` field (if not exists)
- `newsletter_unsubscribe_tokens` table
- Database functions for token management

### 2. Environment Variables

Ensure these are set in `.env.local`:

```bash
# Required for Supabase integration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Required for unsubscribe token generation (admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Required for reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# Required for unsubscribe URLs
NEXT_PUBLIC_SITE_URL=https://iiskills.cloud
```

### 3. Test the Implementation

#### Test Registration Flow
1. Go to `/register`
2. Fill out the form
3. Verify the newsletter checkbox appears with both options
4. Register with "Yes" selected
5. Check Supabase profiles table - `subscribed_to_newsletter` should be `true`
6. Register a new user with "No" selected
7. Check Supabase profiles table - `subscribed_to_newsletter` should be `false`

#### Test Google OAuth Flow
1. Register via Google
2. Check that user is auto-subscribed (`subscribed_to_newsletter = true`)

#### Test Newsletter Page
1. Visit `/newsletter`
2. Verify no placeholder text appears
3. Verify policy messaging is clear
4. Test newsletter signup form

#### Test Unsubscribe Flow
1. Generate a test token using `/api/newsletter/generate-token`:
   ```bash
   curl -X POST http://localhost:3000/api/newsletter/generate-token \
     -H "Content-Type: application/json" \
     -d '{"email": "test@example.com", "userId": "user-uuid-here"}'
   ```
2. Visit `/unsubscribe?token=<generated-token>`
3. Verify friendly confirmation message appears
4. Check database - `subscribed_to_newsletter` should be `false`
5. Check newsletter_subscribers - status should be `unsubscribed`

#### Test Duplicate Token Usage
1. Try using the same token again
2. Verify error message about token already being used

#### Test Expired Tokens
1. Manually set a token's `expires_at` to past date in database
2. Try using the token
3. Verify error message about expired token

### 4. Email Integration

When sending newsletter emails, you MUST include an unsubscribe link:

```javascript
// Example: Generate unsubscribe token before sending email
const response = await fetch('/api/newsletter/generate-token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: user.id,
    email: user.email
  })
});

const { token, unsubscribeUrl } = await response.json();

// Include unsubscribeUrl in your email template
// Example: <a href="${unsubscribeUrl}">Unsubscribe</a>
```

## Testing Checklist

- [ ] New user registration with newsletter opt-in works
- [ ] New user registration with newsletter opt-out works
- [ ] Google OAuth auto-subscribes users
- [ ] Newsletter page loads without placeholder text
- [ ] Newsletter signup updates user profile if authenticated
- [ ] Unsubscribe page works with valid token
- [ ] Unsubscribe page shows error for invalid/expired token
- [ ] Unsubscribe updates both profiles and newsletter_subscribers tables
- [ ] Token cannot be reused after unsubscribe
- [ ] Policy messaging appears in all relevant locations
- [ ] All 15 learn-* apps have updated files
- [ ] apps/main has updated files

## Files Modified/Created

### Root Directory
- ✅ `components/shared/NewsletterSignup.js` - Updated messaging
- ✅ `components/shared/UniversalRegister.js` - Added newsletter checkbox
- ✅ `pages/newsletter.js` - Removed placeholder, added policy
- ✅ `pages/unsubscribe.js` - New unsubscribe page
- ✅ `pages/api/newsletter/subscribe.js` - Profile sync
- ✅ `pages/api/newsletter/unsubscribe.js` - New unsubscribe API
- ✅ `pages/api/newsletter/generate-token.js` - New token generation API
- ✅ `supabase/profiles_schema.sql` - Added field and trigger
- ✅ `supabase/migrations/add_newsletter_subscription_to_profiles.sql` - New migration

### Replicated to All Apps
All above files copied to:
- apps/main
- learn-ai
- learn-apt
- learn-chemistry
- learn-data-science
- learn-geography
- learn-govt-jobs
- learn-ias
- learn-jee
- learn-leadership
- learn-management
- learn-math
- learn-neet
- learn-physics
- learn-pr
- learn-winning

## Edge Cases Handled

1. ✅ User registers without selecting newsletter preference → Defaults to subscribed
2. ✅ User registers via Google → Auto-subscribed
3. ✅ Expired unsubscribe token → Clear error message with alternatives
4. ✅ Already-used unsubscribe token → Prevents duplicate processing
5. ✅ Unauthenticated user subscribing → Works via newsletter_subscribers table
6. ✅ Authenticated user subscribing → Updates both profile and newsletter_subscribers
7. ✅ Database table missing → Graceful degradation with warnings

## Security Considerations

1. ✅ Unsubscribe tokens are cryptographically random (32 bytes)
2. ✅ Tokens expire after 90 days
3. ✅ Tokens are single-use (cannot be reused)
4. ✅ reCAPTCHA v3 protection on newsletter signup
5. ✅ Row Level Security (RLS) enabled on all tables
6. ✅ Service role key required for admin operations (token generation)

## Future Enhancements

Consider adding:
- User settings page to manage newsletter preferences
- Different newsletter categories (course updates, announcements, etc.)
- Email confirmation when subscribing/unsubscribing
- Admin dashboard to view subscriber statistics
- Newsletter sending interface

## Support

For issues or questions:
- Check Supabase logs for database errors
- Check Next.js server logs for API errors
- Review browser console for frontend errors
- Contact: support@iiskills.cloud

## Summary

This implementation provides a production-ready newsletter system with:
- ✅ Clear, honest messaging about email frequency
- ✅ User-friendly opt-in/opt-out at registration
- ✅ Robust Supabase integration
- ✅ One-click unsubscribe (no login needed)
- ✅ Security best practices
- ✅ Consistent experience across all apps
- ✅ No dev placeholders

The system is ready for UAT and live testing!
