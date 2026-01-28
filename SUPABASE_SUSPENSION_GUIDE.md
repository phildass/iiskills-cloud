# Supabase Suspension Guide

## Overview

The Supabase suspension feature allows you to temporarily disable all Supabase database connections across all apps in the iiskills-cloud platform. This is useful for content review, testing, and maintenance periods when you want to run the apps without database dependencies.

## When to Use Suspension Mode

Use suspension mode when you want to:

- **Review and correct content** across all apps without database interference
- **Test UI and layouts** without needing authentication or user data
- **Perform content updates** and verify they work correctly before connecting to the database
- **Temporary maintenance** when you need apps running but don't want database activity
- **Development and testing** when the database has minimal or null data

## What Happens When Suspended

When Supabase suspension is enabled:

### Authentication
- ❌ All login and registration forms will be disabled
- ❌ Google OAuth authentication will not work
- ❌ Magic link authentication will not work
- ❌ Password-based login will not work
- ✅ Apps will run without requiring user authentication

### Database Operations
- ❌ No data will be read from Supabase
- ❌ No data will be written to Supabase
- ❌ Admin role checks will return false
- ❌ Payment status checks will return false
- ✅ Apps will display static content without database queries

### Content Display
- ✅ All static content remains visible
- ✅ UI components work normally
- ✅ Navigation and routing work as expected
- ✅ No authentication walls blocking content

## Quick Start

### Enable Suspension (3 Easy Steps)

```bash
# Step 1: Run the toggle script
./toggle-supabase-suspension.sh enable

# Step 2: Restart all apps (if using PM2)
pm2 restart all

# Step 3: Verify apps are running
pm2 status
```

That's it! All apps are now running without Supabase connections.

### Disable Suspension (Restore Normal Operation)

```bash
# Step 1: Run the toggle script
./toggle-supabase-suspension.sh disable

# Step 2: Restart all apps (if using PM2)
pm2 restart all

# Step 3: Verify apps are connected to Supabase
# Check logs for normal Supabase connection messages
pm2 logs --lines 50
```

## Manual Configuration

If you prefer to configure suspension manually, you can edit the `.env.local` files directly.

### Enable Suspension Manually

Add or update this line in **each** app's `.env.local` file:

```bash
NEXT_PUBLIC_SUPABASE_SUSPENDED=true
```

Apps that need this setting:
- Root directory: `./.env.local`
- Main app: `./apps/main/.env.local`
- All learning apps: `./learn-*/.env.local` (16 apps total)

### Disable Suspension Manually

Change the value to `false` in all `.env.local` files:

```bash
NEXT_PUBLIC_SUPABASE_SUSPENDED=false
```

Or completely remove the line from all files.

## Technical Details

### How It Works

The suspension feature modifies the Supabase client initialization in `lib/supabaseClient.js` files across all apps:

1. **Environment Variable Check**: Reads `NEXT_PUBLIC_SUPABASE_SUSPENDED` from environment
2. **Conditional Client**: Creates either a real Supabase client or a mock client
3. **Mock Client**: Returns empty/error responses for all database operations
4. **No Validation**: Skips Supabase URL/key validation when suspended

### Modified Files

The following files have been updated to support suspension mode:

**Core Library:**
- `lib/supabaseClient.js` (root)

**Apps:**
- `apps/main/lib/supabaseClient.js`

**Learning Modules (16 apps):**
- `learn-ai/lib/supabaseClient.js`
- `learn-chemistry/lib/supabaseClient.js`
- `learn-cricket/lib/supabaseClient.js`
- `learn-data-science/lib/supabaseClient.js`
- `learn-geography/lib/supabaseClient.js`
- `learn-govt-jobs/lib/supabaseClient.js`
- `learn-ias/lib/supabaseClient.js`
- `learn-jee/lib/supabaseClient.js`
- `learn-leadership/lib/supabaseClient.js`
- `learn-management/lib/supabaseClient.js`
- `learn-math/lib/supabaseClient.js`
- `learn-neet/lib/supabaseClient.js`
- `learn-physics/lib/supabaseClient.js`
- `learn-pr/lib/supabaseClient.js`
- `learn-winning/lib/supabaseClient.js`

### Code Changes

Each `supabaseClient.js` file now includes:

```javascript
// Check if Supabase is suspended
const isSupabaseSuspended = process.env.NEXT_PUBLIC_SUPABASE_SUSPENDED === "true";

// Conditional client creation
export const supabase = isSupabaseSuspended
  ? createMockSupabaseClient()
  : createClient(supabaseUrl, supabaseAnonKey, { /* config */ });

// Mock client for suspended mode
function createMockSupabaseClient() {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signOut: async () => ({ error: null }),
      // ... other mock methods
    },
    from: () => ({ /* mock database methods */ }),
  };
}

// Helper functions check suspension
export async function getCurrentUser() {
  if (isSupabaseSuspended) {
    return null;
  }
  // ... normal implementation
}
```

## Deployment Configuration

### PM2 Deployment

If using PM2 (recommended for production), you can also add the suspension flag to `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'main',
      script: 'apps/main/node_modules/.bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true', // Enable suspension
        // ... other env vars
      }
    },
    // ... other apps
  ]
};
```

However, **using `.env.local` files is the preferred method** as it's easier to manage and doesn't require modifying the ecosystem config.

## Troubleshooting

### Apps Won't Start

**Problem**: Apps fail to start even with suspension enabled

**Solution**: 
1. Check that `.env.local` files exist in all app directories
2. Verify the environment variable is set correctly:
   ```bash
   cat .env.local | grep SUPABASE_SUSPENDED
   ```
3. Ensure the value is exactly `"true"` (lowercase, in quotes in the file)

### Console Warnings

**Problem**: Seeing warning messages in console

**Expected Behavior**: When suspension is enabled, you'll see:
```
⚠️ SUPABASE SUSPENDED MODE: Running without database connection. All auth operations will return mock data.
```

This is normal and indicates suspension is working correctly.

### Content Not Showing

**Problem**: Content that relies on database queries isn't displaying

**Expected Behavior**: When suspended, only static content will display. Any content that requires database queries will not be available. This is by design.

**Solution**: If you need to see database-driven content, you must:
1. Disable suspension mode
2. Ensure Supabase credentials are configured
3. Restart the apps

### Authentication Still Working

**Problem**: Users can still log in

**Check**: 
1. Verify `NEXT_PUBLIC_SUPABASE_SUSPENDED=true` is set in all `.env.local` files
2. Restart all apps: `pm2 restart all`
3. Clear browser cache and cookies
4. Check console for the suspension warning message

## Use Case: 3-Day Content Review Period

This feature was specifically designed for the use case described in the problem statement:

### Scenario
"For the next three days I want the supabase connection suspended as the data it has is very little or null, difficult for the admin to verify all the content which is different from each other."

### Solution Steps

**Day 1 - Morning: Enable Suspension**
```bash
# On the server
cd /root/iiskills-cloud  # or your deployment path
./toggle-supabase-suspension.sh enable
pm2 restart all
```

**Days 1-3: Review and Correct Content**
- Visit app.iiskills.cloud to review main app content
- Visit app1.learn-ai.iiskills.cloud, app2.learn-chemistry.iiskills.cloud, etc.
- Make content corrections directly in the codebase
- Test changes without database interference
- All content is visible without authentication

**Day 3 - End: Restore Supabase**
```bash
# On the server
cd /root/iiskills-cloud
./toggle-supabase-suspension.sh disable
pm2 restart all
```

## Best Practices

1. **Always use the toggle script** instead of manual edits when possible
2. **Restart apps after changing suspension mode** for changes to take effect
3. **Document when suspension is enabled** to avoid confusion
4. **Keep suspension periods short** (hours to days, not weeks)
5. **Test thoroughly** after re-enabling Supabase
6. **Backup data** before making content changes during suspension

## Related Features

This suspension feature works alongside:

- **Testing Mode** (`NEXT_PUBLIC_TESTING_MODE`) - Bypasses authentication but keeps database
- **Paywall Toggle** (`NEXT_PUBLIC_PAYWALL_ENABLED`) - Disables payment walls
- **Disable Auth** (`NEXT_PUBLIC_DISABLE_AUTH`) - Bypasses auth but keeps database

**Key Difference**: Suspension mode completely disables Supabase connections, while other modes keep the database connected but bypass specific checks.

## Support

For issues or questions:

1. Check this guide first
2. Review console logs for error messages
3. Verify all `.env.local` files have the correct settings
4. Test with a single app before applying to all apps

## Summary

The Supabase suspension feature provides a simple, safe way to temporarily disable database connections across all apps. Use it when you need to review content, test UI, or perform maintenance without database activity. The toggle script makes it easy to enable and disable with a single command.

**Remember**: Always restart apps after changing suspension mode!
