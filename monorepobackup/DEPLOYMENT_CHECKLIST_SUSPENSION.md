# Deployment Checklist: Enable Supabase Suspension

Use this checklist when deploying the Supabase suspension feature to production.

## Pre-Deployment

- [ ] Merge the PR `copilot/suspend-supabase-connection` into main branch
- [ ] Backup current .env.local files (if any exist)
- [ ] Note current PM2 process status
- [ ] Verify deployment server access

## Deployment Steps

### 1. Pull Latest Code
```bash
cd /root/iiskills-cloud  # or your deployment path
git checkout main
git pull origin main
```

- [ ] Code pulled successfully
- [ ] No merge conflicts

### 2. Verify Files Exist
```bash
# Check that new files are present
ls -la toggle-supabase-suspension.sh
ls -la SUPABASE_SUSPENSION_GUIDE.md
ls -la QUICK_START_SUSPENSION.md
```

- [ ] Toggle script exists
- [ ] Documentation files exist

### 3. Make Script Executable
```bash
chmod +x toggle-supabase-suspension.sh
```

- [ ] Script is executable

### 4. Enable Suspension Mode
```bash
./toggle-supabase-suspension.sh enable
```

Expected output:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Supabase Suspension Toggle
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Action: enable
Setting NEXT_PUBLIC_SUPABASE_SUSPENDED=true

Updating .env.local files...
[... list of updated files ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ ENABLED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Supabase connections are now SUSPENDED
```

- [ ] Script ran successfully
- [ ] All .env.local files created/updated
- [ ] Success message displayed

### 5. Verify .env.local Files
```bash
# Check a few files to verify
cat .env.local
cat apps/main/.env.local
cat learn-ai/.env.local
```

Each should contain:
```
NEXT_PUBLIC_SUPABASE_SUSPENDED=true
```

- [ ] Root .env.local verified
- [ ] Main app .env.local verified
- [ ] At least one learning app .env.local verified

### 6. Restart All Apps
```bash
pm2 restart all
```

- [ ] All apps restarted successfully
- [ ] No restart errors

### 7. Verify Apps Status
```bash
pm2 status
```

Expected: All apps should be online

- [ ] All apps show status "online"
- [ ] No apps in error state

### 8. Check Logs for Suspension Warning
```bash
pm2 logs --lines 100 | grep -i "SUSPENDED"
```

Should see messages like:
```
⚠️ SUPABASE SUSPENDED MODE: Running without database connection...
```

- [ ] Suspension warnings appear in logs
- [ ] No error messages about Supabase connection failures

## Post-Deployment Verification

### 9. Test Main App
```bash
curl -I https://app.iiskills.cloud
```

- [ ] Returns 200 OK
- [ ] Site loads in browser
- [ ] Content visible without login

### 10. Test Learning Apps
Pick 2-3 learning apps to verify:

```bash
curl -I https://app1.learn-ai.iiskills.cloud
curl -I https://app2.learn-chemistry.iiskills.cloud
```

- [ ] Apps return 200 OK
- [ ] Sites load in browser
- [ ] Content visible without login

### 11. Verify No Authentication Required
- [ ] Can access content without signing in
- [ ] No login prompts appearing
- [ ] Content displays correctly

### 12. Document Suspension Period
Record the dates:
- Suspension enabled on: _________________
- Planned restoration date: _________________
- Who to contact: _________________

## Content Review Period (3 Days)

During the suspension period:
- [ ] Review content on app.iiskills.cloud
- [ ] Review content on all learning apps (app1.learn-ai.iiskills.cloud, etc.)
- [ ] Document any content issues found
- [ ] Make necessary corrections
- [ ] Test corrections work properly

## Restoration (After 3 Days)

### 1. Disable Suspension Mode
```bash
cd /root/iiskills-cloud
./toggle-supabase-suspension.sh disable
```

- [ ] Script ran successfully
- [ ] All .env.local files updated

### 2. Restart All Apps
```bash
pm2 restart all
```

- [ ] All apps restarted successfully

### 3. Verify Supabase Restored
```bash
pm2 logs --lines 100 | grep -i "supabase"
```

- [ ] No more suspension warnings
- [ ] Supabase connections working normally

### 4. Test Authentication
- [ ] Can log in successfully
- [ ] User sessions work
- [ ] Database queries functioning

### 5. Monitor for Issues
```bash
pm2 logs --lines 200
```

- [ ] No errors in logs
- [ ] Apps functioning normally
- [ ] Database operations working

## Rollback Plan (If Issues Occur)

If anything goes wrong:

```bash
# Quick rollback
./toggle-supabase-suspension.sh disable
pm2 restart all
```

Or restore from backup:
```bash
# If you backed up .env.local files
cp .env.local.backup .env.local
# ... restore other .env.local files
pm2 restart all
```

- [ ] Rollback plan documented
- [ ] Team knows how to rollback

## Notes

Additional notes or observations:

_____________________________________________________________

_____________________________________________________________

_____________________________________________________________

## Sign-Off

- Deployed by: _________________
- Date: _________________
- Time: _________________
- Status: ✅ Success / ❌ Issues

---

**Reference Documents:**
- Full Guide: `SUPABASE_SUSPENSION_GUIDE.md`
- Quick Start: `QUICK_START_SUSPENSION.md`
- Implementation Summary: `SUPABASE_SUSPENSION_IMPLEMENTATION_SUMMARY.md`
