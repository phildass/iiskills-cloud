# Deployment Guide - Temporary Testing Mode

⚠️ **CRITICAL: RESTORE AFTER JANUARY 28, 2026**

This guide explains how to deploy the temporary authentication and paywall bypass changes to production.

## Prerequisites

- SSH access to production server
- PM2 installed and configured
- Node.js and npm/yarn installed
- Repository cloned at `/root/iiskills-cloud` (or update paths in ecosystem.config.js)

## Deployment Steps

### Step 1: Pull Latest Changes

```bash
cd /root/iiskills-cloud
git pull origin main
# OR pull from the feature branch if not merged yet
git pull origin copilot/remove-paywalls-and-deploy-design
```

### Step 2: Install Dependencies (if needed)

```bash
# From repository root
npm install
# or
yarn install
```

### Step 3: Create Environment Files

**Option A: Use the automated script (recommended)**

```bash
# This will create .env.local files for all apps
chmod +x create-testing-env-files.sh
./create-testing-env-files.sh
```

**Option B: Manual creation**

For each app, create a `.env.local` file with:

```bash
NEXT_PUBLIC_TESTING_MODE=true
NEXT_PUBLIC_DISABLE_AUTH=true
NEXT_PUBLIC_DISABLE_PAYWALL=true
NEXT_PUBLIC_PAYWALL_ENABLED=false
```

Apps requiring .env.local:
- Root directory: `/root/iiskills-cloud/.env.local`
- Each learning app: `/root/iiskills-cloud/learn-*/.env.local`

### Step 4: Build All Apps

```bash
# Clean existing builds (optional but recommended)
find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true

# Build all apps using turbo
npm run build
# or
turbo build
```

Expected output:
- All 16+ apps should build successfully
- Build artifacts in each app's `.next/` directory

### Step 5: Verify PM2 Configuration

The `ecosystem.config.js` file should already have testing environment variables. Verify:

```bash
cat ecosystem.config.js | grep -A 5 "NEXT_PUBLIC_TESTING_MODE"
```

Expected output for each app:
```javascript
NEXT_PUBLIC_TESTING_MODE: "true",
NEXT_PUBLIC_DISABLE_AUTH: "true",
NEXT_PUBLIC_DISABLE_PAYWALL: "true",
NEXT_PUBLIC_PAYWALL_ENABLED: "false"
```

### Step 6: Restart PM2 Apps

**Option A: Restart all apps (recommended)**

```bash
pm2 restart ecosystem.config.js
```

**Option B: Restart specific apps**

```bash
# Restart individual apps
pm2 restart iiskills-learn-jee
pm2 restart iiskills-learn-apt
pm2 restart iiskills-learn-neet
# ... etc for all 16 apps
```

**Option C: Stop and start (for fresh deployment)**

```bash
pm2 stop all
pm2 delete all
pm2 start ecosystem.config.js
```

### Step 7: Verify Deployment

Check PM2 status:

```bash
pm2 status
pm2 logs --lines 50
```

Expected output:
- All apps should show "online" status
- No error messages in logs
- Look for "⚠️ TESTING MODE: Authentication bypassed" in logs when apps are accessed

### Step 8: Test One App

Visit one of the learning apps to verify bypass is working:

**Test URLs:**
- https://app1.learn-jee.iiskills.cloud (Port 3003)
- https://app1.learn-apt.iiskills.cloud (Port 3002)
- https://app1.learn-ai.iiskills.cloud (Port 3001)

**Expected behavior:**
- No login/registration prompts
- Direct access to all content
- No paywall screens
- All features accessible

**Console logs (check browser DevTools):**
- Should see: "⚠️ TESTING MODE: Authentication bypassed - returning mock user"

### Step 9: Test All 16 Apps

Verify each app is accessible:

| App | Port | URL |
|-----|------|-----|
| learn-ai | 3001 | app1.learn-ai.iiskills.cloud |
| learn-apt | 3002 | app1.learn-apt.iiskills.cloud |
| learn-jee | 3003 | app1.learn-jee.iiskills.cloud |
| learn-chemistry | 3005 | app1.learn-chemistry.iiskills.cloud |
| learn-cricket | 3009 | app1.learn-cricket.iiskills.cloud |
| learn-data-science | 3010 | app1.learn-data-science.iiskills.cloud |
| learn-geography | 3011 | app1.learn-geography.iiskills.cloud |
| learn-govt-jobs | 3013 | app1.learn-govt-jobs.iiskills.cloud |
| learn-ias | 3014 | app1.learn-ias.iiskills.cloud |
| learn-leadership | 3015 | app1.learn-leadership.iiskills.cloud |
| learn-management | 3016 | app1.learn-management.iiskills.cloud |
| learn-math | 3017 | app1.learn-math.iiskills.cloud |
| learn-neet | 3018 | app1.learn-neet.iiskills.cloud |
| learn-physics | 3020 | app1.learn-physics.iiskills.cloud |
| learn-pr | 3021 | app1.learn-pr.iiskills.cloud |
| learn-winning | 3022 | app1.learn-winning.iiskills.cloud |

## Troubleshooting

### Apps Not Starting

Check logs:
```bash
pm2 logs [app-name] --lines 100
```

Common issues:
- Missing dependencies: Run `npm install` in root and app directories
- Port conflicts: Check if ports are already in use
- Environment variables not loaded: Verify .env.local files exist

### Build Failures

```bash
# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

Verify variables are loaded:
```bash
# In Node.js (or browser console)
console.log(process.env.NEXT_PUBLIC_DISABLE_AUTH)
// Should output: "true"
```

If undefined:
- Rebuild the app after adding .env.local
- Restart PM2 to pick up new environment

### Still Seeing Login Prompts

1. Clear browser cache
2. Open in incognito mode
3. Check browser console for testing mode logs
4. Verify .env.local exists in the app directory
5. Restart the specific PM2 app

## Monitoring

### Check PM2 Status Regularly

```bash
# Status overview
pm2 status

# Real-time logs
pm2 logs

# Specific app logs
pm2 logs iiskills-learn-jee

# Resource usage
pm2 monit
```

### Look for Testing Mode Indicators

In the logs, you should see when users access apps:
```
⚠️ TESTING MODE: Authentication bypassed - returning mock user
⚠️ TESTING MODE: Paywall bypassed - granting subscription access
```

## Post-Testing Restoration (AFTER JAN 28, 2026)

See `TEMPORARY_TESTING_MODE.md` for detailed restoration instructions.

**Quick restoration:**

1. Edit ecosystem.config.js - set all testing flags to "false"
2. Rebuild: `npm run build`
3. Restart: `pm2 restart ecosystem.config.js`
4. Verify auth and paywalls work

## Rollback Procedure

If issues occur, rollback:

```bash
# Revert to previous commit
cd /root/iiskills-cloud
git log --oneline -5  # Find commit before changes
git checkout [previous-commit-hash]

# Rebuild
npm run build

# Restart
pm2 restart ecosystem.config.js
```

## Support Checklist

Before declaring success:

- [ ] All 16 apps show "online" in PM2
- [ ] No error logs in `pm2 logs`
- [ ] Can access all apps without login
- [ ] No paywall screens appear
- [ ] Console shows testing mode messages
- [ ] All app URLs resolve correctly
- [ ] Apps serve content properly

## Emergency Contact

If critical issues arise:
- Check PM2 logs first
- Review this guide's troubleshooting section
- Contact: info@iiskills.cloud

---

**Deployment Date:** January 25, 2026
**Testing Window:** Now - January 28, 2026
**Restoration Due:** After January 28, 2026
