# Multi-App Deployment Issue - SOLUTION SUMMARY

## Problem
Secondary apps (e.g., learn-ai.iiskills.cloud:3024) were showing the main app's homepage instead of their own unique content.

## Root Cause
**Apps were not built before deployment.** Each Next.js app requires its own `.next/` build directory created by running `next build`. Without this:
- `next start` cannot serve the app properly
- PM2 may fail to start the app or serve incorrect content  
- Each app must be built independently to ensure unique pages are compiled

## Solution

### One-Line Fix
```bash
./fix-multi-app-deployment.sh && pm2 restart all
```

### What the Fix Does
1. ✅ Ensures `.env.local` files exist for all apps
2. ✅ Enables Corepack for correct Yarn version (4.12.0)
3. ✅ Cleans all `.next/` directories for fresh builds
4. ✅ Installs dependencies if needed
5. ✅ Builds each app independently  
6. ✅ Verifies unique `BUILD_ID` for each app
7. ✅ Provides verification commands

### Files Changed/Created
- ✅ `fix-multi-app-deployment.sh` - Automated fix script (executable)
- ✅ `MULTI_APP_DEPLOYMENT_FIX.md` - Comprehensive documentation
- ✅ `ensure-env-files.sh` - Enhanced to include main app
- ✅ `.env.local` files created for all apps (gitignored)

## Verification

After running the fix, verify each app is unique:

```bash
# 1. Check unique BUILD_IDs
cat apps/main/.next/BUILD_ID       # Should be different
cat apps/learn-ai/.next/BUILD_ID   # from learn-ai

# 2. Verify PM2 status
pm2 list                           # All apps should be "online"

# 3. Test unique content on each port
curl -s http://localhost:3000 | grep '<title>'
# Expected: <title>iiskills.cloud - Democratizing Education...</title>

curl -s http://localhost:3024 | grep '<title>'
# Expected: <title>iiskills-ai - Master Artificial Intelligence</title>

# 4. Test via NGINX (production)
curl -s https://app.iiskills.cloud | grep '<title>'
curl -s https://learn-ai.iiskills.cloud | grep '<title>'
```

## Why This Happened

1. **Missing Builds**: The `yarn build` step creates the `.next/` directory with compiled pages
2. **PM2 Expectation**: PM2's `next start` command requires a pre-built `.next/` directory
3. **Monorepo Architecture**: Each app in `apps/` is independent and needs its own build
4. **Yarn Version**: Project uses Yarn 4.12.0 via Corepack (not system Yarn 1.x)

## Architecture Overview

```
iiskills-cloud/                      # Monorepo root
├── apps/
│   ├── main/                        # Main app (port 3000)
│   │   ├── pages/                  # Unique pages
│   │   ├── .next/                  # ← Must be built!
│   │   └── .env.local              # ← Must exist!
│   │
│   ├── learn-ai/                    # Learn AI (port 3024)
│   │   ├── pages/                  # Different pages
│   │   ├── .next/                  # ← Must be built!
│   │   └── .env.local              # ← Must exist!
│   │
│   └── ...                          # Other apps (each independent)
│
├── ecosystem.config.js              # PM2: maps apps to ports
├── nginx-configs/                   # NGINX: maps subdomains to ports
└── fix-multi-app-deployment.sh     # ← Run this to fix!
```

## Key Lessons

### ❌ Don't Do This
```bash
# Starting PM2 without building apps first
pm2 start ecosystem.config.js  # ❌ Will fail or serve wrong content
```

### ✅ Do This
```bash
# Build all apps, then start PM2
./fix-multi-app-deployment.sh  # Builds everything
pm2 start ecosystem.config.js  # ✅ Now works correctly
```

## Production Deployment Process

### First-Time Setup
```bash
# 1. Clone repo
git clone https://github.com/phildass/iiskills-cloud
cd iiskills-cloud

# 2. Enable Corepack
corepack enable

# 3. Run fix script
chmod +x fix-multi-app-deployment.sh
./fix-multi-app-deployment.sh

# 4. Start PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Enable auto-start on reboot
```

### Subsequent Deployments
```bash
# 1. Pull latest code
git pull origin main

# 2. Rebuild apps
./fix-multi-app-deployment.sh

# 3. Restart PM2
pm2 restart all

# 4. Verify
pm2 list
curl https://learn-ai.iiskills.cloud | grep title
```

## Common Issues & Solutions

### Issue: "yarn: command not found"
**Solution**: Enable Corepack
```bash
corepack enable
yarn --version  # Should show 4.12.0
```

### Issue: "error This project's package.json defines packageManager: yarn@4.12.0"
**Solution**: Same as above - enable Corepack

### Issue: "Invalid supabaseUrl" during build
**Solution**: Set `NEXT_PUBLIC_SUPABASE_SUSPENDED=true` in `.env.local`
```bash
# The fix script handles this automatically
./fix-multi-app-deployment.sh
```

### Issue: Apps still show same content after fix
**Solution**: Hard restart PM2
```bash
pm2 delete all
rm -rf apps/*/.next
./fix-multi-app-deployment.sh
pm2 start ecosystem.config.js
```

## Documentation

For detailed information, see:

- **[MULTI_APP_DEPLOYMENT_FIX.md](./MULTI_APP_DEPLOYMENT_FIX.md)** - Complete troubleshooting guide
- **[PM2_DEPLOYMENT.md](./PM2_DEPLOYMENT.md)** - PM2 configuration reference
- **[NGINX_SETUP.md](./NGINX_SETUP.md)** - NGINX reverse proxy setup
- **[ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md)** - Environment variables guide

## Quick Command Reference

```bash
# Fix everything
./fix-multi-app-deployment.sh

# Restart PM2
pm2 restart all

# Check PM2 status
pm2 list
pm2 logs --lines 20

# Verify unique builds
ls -la apps/*/.next/BUILD_ID
cat apps/main/.next/BUILD_ID
cat apps/learn-ai/.next/BUILD_ID

# Test content
curl http://localhost:3000 | grep title
curl http://localhost:3024 | grep title
curl http://localhost:3002 | grep title
```

## Timeline
- **Issue Reported**: Multi-app deployment showing wrong content
- **Root Cause Found**: Missing .next build directories
- **Solution Created**: Automated fix script + documentation  
- **Status**: ✅ RESOLVED - Ready for deployment

---

**Next Steps**: Run `./fix-multi-app-deployment.sh` on the production server to fix the issue.
