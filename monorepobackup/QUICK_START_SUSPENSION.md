# Quick Start: Suspend Supabase for 3 Days

This is a quick reference guide for suspending Supabase connections to review and correct content.

## Enable Suspension (Do This Now)

```bash
# On your server (SSH into your deployment server)
cd /root/iiskills-cloud  # Or wherever the repo is deployed

# Run the toggle script to enable suspension
./toggle-supabase-suspension.sh enable

# Restart all apps to apply changes
pm2 restart all

# Verify apps are running
pm2 status
```

**That's it!** All apps are now running without Supabase connections.

## What You Can Do Now

✅ **Review Content**: Visit all your apps and review the content
- Main app: https://app.iiskills.cloud
- Learning apps: https://app1.learn-ai.iiskills.cloud, https://app2.learn-chemistry.iiskills.cloud, etc.

✅ **Correct Content**: Make changes to files in the codebase and test them

✅ **Test UI**: All UI elements work normally, just without database

✅ **No Login Required**: Content is visible without authentication

❌ **No Database Access**: No data is read from or written to Supabase

## Restore Supabase (After 3 Days)

```bash
# On your server
cd /root/iiskills-cloud

# Run the toggle script to disable suspension
./toggle-supabase-suspension.sh disable

# Restart all apps to restore Supabase connections
pm2 restart all

# Verify Supabase is working
pm2 logs --lines 50
```

## Troubleshooting

### Apps won't start?
Check that .env.local files exist:
```bash
ls -la .env.local
ls -la apps/main/.env.local
ls -la learn-*/.env.local
```

### Still see login screens?
1. Make sure you ran the enable command
2. Restart apps: `pm2 restart all`
3. Clear browser cache and cookies
4. Check console for warning: "SUPABASE SUSPENDED MODE"

### Need help?
See the full guide: `SUPABASE_SUSPENSION_GUIDE.md`

## Summary

**To Suspend**: `./toggle-supabase-suspension.sh enable` + `pm2 restart all`

**To Restore**: `./toggle-supabase-suspension.sh disable` + `pm2 restart all`

That's all you need to know!
