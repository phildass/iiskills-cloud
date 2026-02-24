# PRODUCTION DEPLOYMENT - REMOVE TESTING MODE

## ⚠️ CRITICAL: Testing Mode Removal

This document provides instructions for deploying the fix that removes testing mode flags from production.

## Changes Made

The `ecosystem.config.js` file has been updated to remove all testing/bypass flags that were incorrectly enabled in production:

### Removed Flags (from 14 learn-* apps):
- ❌ `NEXT_PUBLIC_TESTING_MODE=true`
- ❌ `NEXT_PUBLIC_DISABLE_AUTH=true`
- ❌ `NEXT_PUBLIC_DISABLE_PAYWALL=true`
- ❌ `NEXT_PUBLIC_PAYWALL_ENABLED=false`

### Result:
- ✅ Authentication is now enforced
- ✅ Paywalls are now active
- ✅ All apps use proper production configuration

## Deployment Instructions

### Step 1: Verify Current State

First, check that no `.env` or `.env.local` files have `NEXT_PUBLIC_USE_LOCAL_CONTENT=true`:

```bash
# Run from repository root
cd /root/iiskills-cloud

# Check for any .env files with local content mode enabled
find . -name ".env*" -type f ! -name "*.example" -exec grep -l "NEXT_PUBLIC_USE_LOCAL_CONTENT.*true" {} \;

# Should return no results
```

### Step 2: Pull Latest Changes

```bash
cd /root/iiskills-cloud
git pull origin main  # or your default branch
```

### Step 3: Clean Build Caches

Remove the `.next` build cache from ALL apps:

```bash
cd /root/iiskills-cloud

# Clean main app
rm -rf apps/main/.next

# Clean coming-soon app
rm -rf coming-soon/.next

# Clean all learning apps
for app in learn-ai learn-apt learn-chemistry learn-cricket learn-data-science \
           learn-geography learn-govt-jobs learn-ias learn-jee learn-leadership \
           learn-management learn-math learn-neet learn-physics learn-pr learn-winning; do
  echo "Cleaning $app..."
  rm -rf "$app/.next"
done

echo "✓ All .next directories cleaned"
```

### Step 4: Rebuild All Apps

```bash
cd /root/iiskills-cloud

# Install dependencies (if needed)
yarn install

# Build all apps using turbo
yarn build

# OR build individually if turbo fails:
# cd apps/main && yarn build && cd ../..
# cd coming-soon && yarn build && cd ..
# for app in learn-*; do cd $app && yarn build && cd ..; done
```

### Step 5: Update PM2 Configuration

```bash
cd /root/iiskills-cloud

# Stop all PM2 processes
pm2 stop all

# Delete old PM2 processes
pm2 delete all

# Start apps with new configuration
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Verify all apps are running
pm2 status
```

### Step 6: Restart Individual Apps (Alternative)

If you prefer to restart apps individually without stopping all:

```bash
cd /root/iiskills-cloud

# Restart main app
pm2 restart iiskills-main

# Restart coming-soon
pm2 restart iiskills-comingsoon

# Restart all learning apps
pm2 restart iiskills-learn-ai
pm2 restart iiskills-learn-apt
pm2 restart iiskills-learn-chemistry
pm2 restart iiskills-learn-cricket
pm2 restart iiskills-learn-data-science
pm2 restart iiskills-learn-geography
pm2 restart iiskills-learn-govt-jobs
pm2 restart iiskills-learn-ias
pm2 restart iiskills-learn-jee
pm2 restart iiskills-learn-leadership
pm2 restart iiskills-learn-management
pm2 restart iiskills-learn-math
pm2 restart iiskills-learn-neet
pm2 restart iiskills-learn-physics
pm2 restart iiskills-learn-pr
pm2 restart iiskills-learn-winning
```

### Step 7: Verify Deployment

Check that the environment variables are NOT set to bypass mode:

```bash
# Check environment variables for one of the apps
pm2 show iiskills-learn-jee | grep -E "(TESTING|DISABLE|PAYWALL)"

# Should only show NODE_ENV=production, no testing flags

# Check multiple apps
for app in iiskills-learn-jee iiskills-learn-ai iiskills-main; do
  echo "=== $app ==="
  pm2 show "$app" | grep -E "env:" -A 5
done
```

### Step 8: Test Authentication

1. **Visit one of the learning apps** (e.g., https://jee.iiskills.cloud)
2. **Attempt to access protected content**
3. **Verify that authentication is required** (should redirect to login)
4. **Test login flow** (should work properly with Supabase)
5. **Verify paywall is active** (premium content should be gated)

### Step 9: Monitor Logs

```bash
# Watch logs for errors
pm2 logs --lines 50

# Watch logs for specific app
pm2 logs iiskills-learn-jee --lines 50

# Check for any authentication errors
pm2 logs | grep -i "auth"

# Check for any errors
pm2 logs --err
```

## Verification Checklist

After deployment, verify:

- [ ] All PM2 processes are running (`pm2 status` shows all online)
- [ ] No testing mode flags in environment (`pm2 show <app-name>` shows only NODE_ENV)
- [ ] Authentication is enforced (cannot access protected content without login)
- [ ] Login/signup flows work correctly
- [ ] Paywalls are active (premium content is gated)
- [ ] No errors in PM2 logs (`pm2 logs --err`)
- [ ] Apps are accessible via their URLs

## Rollback Plan (Emergency Only)

⚠️ **WARNING**: Only use rollback for emergency situations. Testing mode should NEVER remain enabled in production.

If there are critical issues and you need to temporarily restore the previous configuration:

### Option 1: Using Git History

```bash
cd /root/iiskills-cloud

# View recent commits to find the one before this fix
git log --oneline -10

# Revert to the specific commit (replace <commit-hash> with the actual hash)
git checkout <commit-hash> -- ecosystem.config.js

# Then restart PM2
pm2 restart all
```

### Option 2: Manual Edit (Not Recommended)

If absolutely necessary, you can manually re-enable testing mode by editing `ecosystem.config.js` and adding these environment variables to the affected apps:

```javascript
env: {
  NODE_ENV: "production",
  NEXT_PUBLIC_TESTING_MODE: "true",
  NEXT_PUBLIC_DISABLE_AUTH: "true",
  NEXT_PUBLIC_DISABLE_PAYWALL: "true",
  NEXT_PUBLIC_PAYWALL_ENABLED: "false"
}
```

Then restart: `pm2 restart all`

## Support

If you encounter issues:

1. Check PM2 logs: `pm2 logs --err`
2. Verify environment: `pm2 show <app-name>`
3. Check build output: `yarn build` in app directory
4. Verify `.env` files don't have conflicting settings

## Related Files

- `ecosystem.config.js` - PM2 production configuration
- `.env.local.example` - Example environment configuration (not used in production)
- Individual app `.env.local` files (if they exist - should not have testing flags)
