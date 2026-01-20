# Paywall Toggle Documentation

## Overview

The iiskills-cloud platform includes a configurable paywall system that can be enabled or disabled across all learning apps using an environment variable. This allows for unrestricted testing while maintaining the ability to easily restore paywall functionality for production use.

## Environment Variable

### NEXT_PUBLIC_PAYWALL_ENABLED

Controls paywall behavior across all apps in the monorepo.

**Values:**
- `"true"` - Enable paywalls (default, production setting)
- `"false"` - Disable all paywalls (testing/development setting)

**Type:** String (must be quoted)

**Default:** `"true"` (paywalls enabled)

## Configuration

### Option 1: Environment Files (.env.local)

Add the following to your `.env.local` files:

```bash
# Disable paywalls for testing
NEXT_PUBLIC_PAYWALL_ENABLED=false

# Or enable paywalls for production
NEXT_PUBLIC_PAYWALL_ENABLED=true
```

**Note:** Each app in the monorepo has its own `.env.local` file. For consistency, set the same value across all apps:
- Main app: `/home/runner/work/iiskills-cloud/iiskills-cloud/.env.local`
- Learn apps: `/home/runner/work/iiskills-cloud/iiskills-cloud/learn-*/.env.local`

### Option 2: PM2 Ecosystem Configuration

For production deployments using PM2, the variable is set in `ecosystem.config.js`:

```javascript
env: { 
  NODE_ENV: "production", 
  PORT: 3008, 
  NEXT_PUBLIC_PAYWALL_ENABLED: "true"  // Change to "false" to disable
}
```

To disable paywalls in production:

1. Edit `ecosystem.config.js`
2. Change `NEXT_PUBLIC_PAYWALL_ENABLED: "true"` to `"false"` for all apps
3. Restart PM2 apps: `pm2 restart ecosystem.config.js`

## Affected Apps

The following apps have paywall implementations that respect this toggle:

### Purchase-Based Paywalls
- **learn-jee** - JEE preparation course
- **learn-winning** - Winning mindset course  
- **learn-ias** - IAS/UPSC preparation

### Subscription-Based Paywalls
- **learn-neet** - NEET preparation (2-year subscription model)

## How It Works

### For Purchase-Based Apps (JEE, Winning, IAS)

**When PAYWALL_ENABLED="false":**
- `hasPurchased` state is automatically set to `true` for all users
- All course content becomes accessible regardless of purchase status
- Free preview lessons remain marked as free
- Purchase prompts and locked indicators still display but don't block access

**When PAYWALL_ENABLED="true":**
- Normal paywall behavior resumes
- Only users with `purchased_[app]_course=true` in user metadata get access
- Free lessons (e.g., Chapter 1, Lesson 1 in JEE) remain accessible to all
- Locked content shows paywall prompts

### For Subscription-Based Apps (NEET)

**When PAYWALL_ENABLED="false":**
- `checkActiveSubscription()` function returns `true` for all users
- All content, including premium resources, becomes accessible
- Subscription end date checks are bypassed

**When PAYWALL_ENABLED="true":**
- Normal subscription validation resumes
- Only users with valid `neet_subscription_end` date (future date) get access
- Expired subscriptions are blocked

## Testing Workflow

### Enable Testing Mode

1. **Local Development:**
   ```bash
   # Add to all .env.local files
   NEXT_PUBLIC_PAYWALL_ENABLED=false
   
   # Restart dev servers
   npm run dev
   ```

2. **Production/Staging:**
   ```bash
   # Edit ecosystem.config.js
   # Change NEXT_PUBLIC_PAYWALL_ENABLED to "false"
   
   # Restart apps
   pm2 restart ecosystem.config.js
   ```

3. **Verify Changes:**
   - Log in to any learn-* app with a regular (non-paying) user account
   - Navigate to `/learn` page
   - Verify all content is accessible
   - Check that locked indicators (🔒) don't prevent access

### Restore Production Mode

1. **Local Development:**
   ```bash
   # Change in all .env.local files
   NEXT_PUBLIC_PAYWALL_ENABLED=true
   
   # Restart dev servers
   npm run dev
   ```

2. **Production/Staging:**
   ```bash
   # Edit ecosystem.config.js
   # Change NEXT_PUBLIC_PAYWALL_ENABLED to "true"
   
   # Restart apps
   pm2 restart ecosystem.config.js
   ```

3. **Verify Restoration:**
   - Log in with a non-paying user account
   - Verify paywalls are enforced
   - Check that only free content is accessible
   - Test with a paying user to ensure access works

## Important Notes

### Safety & Rollback

✅ **Safe to Toggle:** The paywall toggle is completely reversible
- No code is deleted or modified
- All paywall logic remains intact
- Switching back to `"true"` immediately restores paywalls

✅ **Production Safety:** 
- Always verify `NEXT_PUBLIC_PAYWALL_ENABLED="true"` in production
- Default value is `"true"` for safety
- Monitor logs after any PM2 restart

### User Experience

⚠️ **UI Indicators Remain Visible:**
- Purchase prompts still display when paywall is disabled
- Lock icons (🔒) may still appear on content
- Pricing information remains visible
- However, clicking locked content will grant access

⚠️ **Authentication Still Required:**
- Users must still register and log in
- Disabling paywalls does NOT disable authentication
- Only affects payment/subscription checks

### Testing Best Practices

1. **Use Separate Test Accounts:**
   - Create dedicated test accounts without purchases
   - Don't use admin or paying user accounts for testing
   - Verify both enabled and disabled states

2. **Document Current State:**
   - Track whether paywall is enabled/disabled
   - Note configuration changes in deployment logs
   - Communicate state to team members

3. **Automated Testing:**
   - Test both `PAYWALL_ENABLED="true"` and `"false"` paths
   - Verify environment variable is respected
   - Check all affected apps (JEE, NEET, IAS, Winning)

## Troubleshooting

### Paywall Still Blocking After Setting to "false"

1. Check environment variable is set correctly:
   ```bash
   # In browser console
   console.log(process.env.NEXT_PUBLIC_PAYWALL_ENABLED)
   ```

2. Verify .env.local file exists and is not .gitignored

3. Restart the development server or PM2 process:
   ```bash
   # Development
   npm run dev
   
   # Production
   pm2 restart ecosystem.config.js
   ```

4. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

### Paywall Not Enforcing After Setting to "true"

1. Verify variable is set to string `"true"`, not boolean `true`

2. Check for typos in environment variable name

3. Restart application to pick up new environment value

4. Clear browser cache and reload

### Different Apps Have Different Behavior

1. Ensure all apps have the same environment variable value

2. For PM2 deployments, verify ecosystem.config.js has consistent values

3. Check each app's .env.local file in local development

## Code Implementation Details

### Modified Files

The following files were updated to support the paywall toggle:

1. **Environment Configuration:**
   - `.env.local.example` - Added NEXT_PUBLIC_PAYWALL_ENABLED variable

2. **PM2 Configuration:**
   - `ecosystem.config.js` - Added variable to all app configurations

3. **Purchase-Based Apps:**
   - `learn-jee/pages/learn.js` - Check environment variable before enforcing paywall
   - `learn-jee/learn-jee/pages/learn.js` - Same for nested version
   - `learn-winning/pages/learn.js` - Check environment variable in useEffect and handleLessonClick
   - `learn-ias/pages/learn.js` - Check environment variable for hasPurchased

4. **Subscription-Based Apps:**
   - `learn-neet/lib/supabaseClient.js` - Modified checkActiveSubscription() function

### Implementation Pattern

All apps follow this pattern:

```javascript
// Check if paywall is enabled via environment variable
const paywallEnabled = process.env.NEXT_PUBLIC_PAYWALL_ENABLED !== "false";

// Grant access if paywall is disabled OR user has purchased/subscribed
const hasAccess = !paywallEnabled || userHasPurchased;
```

This ensures:
- Default behavior is enabled (safe)
- Explicit "false" string disables paywall
- Any other value (including undefined) enables paywall

## Support

For questions or issues:
- Check this documentation first
- Review environment configuration in `.env.local` files
- Verify PM2 configuration in `ecosystem.config.js`
- Contact: info@iiskills.cloud

---

**Last Updated:** 2026-01-20  
**Version:** 1.0  
**Author:** iiskills-cloud development team
