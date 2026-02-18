# Multi-App Next.js Deployment Fix

## Problem Statement

When deploying multiple Next.js apps in the monorepo using PM2 and NGINX:
- **Main app** loads correctly on its subdomain and port
- **Secondary apps** (e.g., learn-ai.iiskills.cloud:3024) display the main app's homepage instead of their own unique content
- Issue persists after git pull, clean, yarn build, and PM2 restart

## Root Cause Analysis

### Primary Issue: Missing or Incomplete Build Outputs

Each Next.js app in the monorepo must have its own `.next/` directory containing its compiled production build. When apps are missing `.next/` directories or when builds are incomplete:

1. **`next start` cannot serve the app** - The command requires a pre-built `.next/` directory
2. **PM2 may fail to start the app** - Or the app crashes immediately after starting
3. **Wrong content may be served** - If apps somehow share build artifacts or configurations

### Contributing Factors

1. **Missing .env.local files**: Each app needs its own `.env.local` file with proper configuration
2. **Incomplete builds**: Running `yarn build` from root uses Turborepo, which may skip apps with errors
3. **Build isolation**: Each app must be built independently with its own unique pages and configuration

## Solution

### Quick Fix (Automated)

Run the provided fix script:

```bash
cd /path/to/iiskills-cloud
./fix-multi-app-deployment.sh
```

This script will:
1. ✅ Ensure each app has `.env.local` file
2. ✅ Clean all existing `.next/` directories
3. ✅ Build each app independently
4. ✅ Verify unique build outputs
5. ✅ Provide verification commands

### Manual Fix (Step-by-Step)

If you prefer to fix manually or the script fails:

#### Step 1: Ensure Environment Files

Each app needs its own `.env.local` file. For apps missing this file:

```bash
# For each app in apps/ directory
cd apps/main
cp .env.local.example .env.local

cd ../learn-ai
cp .env.local.example .env.local

# Repeat for all apps...
```

**Important**: The `.env.local` files should use production URLs for production deployment:
- `NEXT_PUBLIC_SITE_URL=https://learn-ai.iiskills.cloud` (not localhost:3024)
- `NEXT_PUBLIC_APP_ID=learn-ai` (should match the app name)

#### Step 2: Clean All Build Directories

```bash
cd /path/to/iiskills-cloud

# Remove all .next directories to ensure clean builds
rm -rf apps/main/.next
rm -rf apps/learn-ai/.next
rm -rf apps/learn-apt/.next
rm -rf apps/learn-chemistry/.next
rm -rf apps/learn-developer/.next
rm -rf apps/learn-geography/.next
rm -rf apps/learn-management/.next
rm -rf apps/learn-math/.next
rm -rf apps/learn-physics/.next
rm -rf apps/learn-pr/.next
```

#### Step 3: Build Each App Independently

Build each app from its own directory to ensure proper isolation:

```bash
cd /path/to/iiskills-cloud

# Build main app
cd apps/main
yarn build
cd ../..

# Build learn-ai
cd apps/learn-ai
yarn build
cd ../..

# Repeat for all apps...
```

**Alternative**: Use Turborepo from root (faster but may hide errors):

```bash
cd /path/to/iiskills-cloud
yarn build  # Builds all apps in parallel
```

#### Step 4: Verify Builds

Check that each app has its unique `.next/` directory:

```bash
ls -la apps/main/.next
ls -la apps/learn-ai/.next
ls -la apps/learn-apt/.next
# etc...
```

Each `.next/` directory should contain:
- `server/` directory with server-side code
- `static/` directory with static assets
- `BUILD_ID` file with unique build ID

#### Step 5: Restart PM2

```bash
cd /path/to/iiskills-cloud
pm2 restart ecosystem.config.js
```

Or restart all processes:

```bash
pm2 restart all
```

#### Step 6: Verify Each App Serves Unique Content

Test each app by accessing it directly on its port:

```bash
# Main app (port 3000)
curl http://localhost:3000 | grep -o '<title>.*</title>'
# Should show: <title>iiskills.cloud - Democratizing Education...</title>

# Learn AI (port 3024)
curl http://localhost:3024 | grep -o '<title>.*</title>'
# Should show: <title>iiskills-ai - Master Artificial Intelligence</title>

# Learn APT (port 3002)
curl http://localhost:3002 | grep -o '<title>.*</title>'
# Should show: <title>Learn Aptitude...</title>
```

## Verification Checklist

After applying the fix, verify:

- [ ] Each app has `.env.local` file with correct configuration
- [ ] Each app has its own `.next/` directory
- [ ] Each app's `.next/BUILD_ID` is unique (different build IDs prove independent builds)
- [ ] PM2 shows all apps running: `pm2 list`
- [ ] Each port serves unique content: `curl http://localhost:<port> | grep title`
- [ ] NGINX routing works: `curl https://<subdomain>.iiskills.cloud | grep title`

## Understanding the Architecture

### Monorepo Structure

```
iiskills-cloud/
├── apps/
│   ├── main/                  # Main app (app.iiskills.cloud)
│   │   ├── pages/            # Unique pages for main app
│   │   ├── .next/            # Build output (must exist!)
│   │   ├── .env.local        # Environment config
│   │   └── next.config.js    # Next.js config
│   │
│   ├── learn-ai/             # Learn AI app (learn-ai.iiskills.cloud)
│   │   ├── pages/            # Unique pages for learn-ai
│   │   ├── .next/            # Build output (must exist!)
│   │   ├── .env.local        # Environment config
│   │   └── next.config.js    # Next.js config
│   │
│   └── ...                    # Other apps
│
├── ecosystem.config.js        # PM2 configuration
└── nginx-configs/             # NGINX reverse proxy configs
```

### How PM2 Runs Each App

The `ecosystem.config.js` configures each app with:

```javascript
{
  name: "iiskills-learn-ai",
  cwd: path.join(__dirname, 'apps/learn-ai'),  // Run from app directory
  script: "npx",
  args: "next start",                           // Requires .next/ to exist!
  env: {
    NODE_ENV: "production",
    PORT: 3024                                  // Unique port per app
  }
}
```

**Critical**: PM2 runs `next start` **from each app's directory**. This requires:
1. The `.next/` directory must exist in that app's directory
2. The app must be built with `next build` before running `next start`

### How NGINX Routes Requests

NGINX configuration maps subdomains to backend ports:

```nginx
# learn-ai.iiskills.cloud → localhost:3024
server {
    listen 443 ssl;
    server_name learn-ai.iiskills.cloud;
    
    location / {
        proxy_pass http://localhost:3024;
        proxy_set_header Host $host;
        # ... other headers
    }
}
```

**Important**: When accessing apps:
- ✅ **Recommended**: `https://learn-ai.iiskills.cloud` (via NGINX)
- ⚠️ **Direct access**: `http://server:3024` (bypasses NGINX, no host header)

## Common Mistakes to Avoid

### ❌ Running `next start` Without Building First

```bash
cd apps/learn-ai
yarn start  # ❌ FAILS if .next/ doesn't exist!
```

**Correct**:
```bash
cd apps/learn-ai
yarn build   # ✅ Creates .next/ directory
yarn start   # ✅ Now works
```

### ❌ Building Only Root, Not Individual Apps

```bash
# At repo root
yarn build   # This might not build ALL apps if some have errors
```

**Correct**:
```bash
# Build each app individually to see errors
cd apps/main && yarn build && cd ../..
cd apps/learn-ai && yarn build && cd ../..
# etc...
```

### ❌ Sharing .env.local Files

Don't symlink or copy the same `.env.local` to all apps. Each needs unique values:

- `NEXT_PUBLIC_SITE_URL` should match the app's production URL
- `NEXT_PUBLIC_APP_ID` should match the app's name

### ❌ Accessing Directly by Port Without NGINX

When testing production:
- ✅ Use `https://learn-ai.iiskills.cloud`
- ⚠️ Avoid `https://learn-ai.iiskills.cloud:3024` (bypasses NGINX)

## Deployment Best Practices

### 1. Pre-Deployment Checklist

Before deploying to production:

```bash
# 1. Ensure environment files exist
./ensure-env-files.sh

# 2. Clean all builds
./fix-multi-app-deployment.sh

# 3. Verify PM2 config
pm2 ecosystem.config.js --dry-run

# 4. Test NGINX configs
sudo nginx -t
```

### 2. Production Deployment Process

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
yarn install

# 3. Run the fix script
./fix-multi-app-deployment.sh

# 4. Restart PM2
pm2 restart ecosystem.config.js

# 5. Verify deployment
pm2 list
pm2 logs --lines 20
```

### 3. Post-Deployment Verification

```bash
# Check PM2 status
pm2 list

# Check each app is running
curl -s https://app.iiskills.cloud | grep -o '<title>.*</title>'
curl -s https://learn-ai.iiskills.cloud | grep -o '<title>.*</title>'
curl -s https://learn-apt.iiskills.cloud | grep -o '<title>.*</title>'

# Check NGINX logs if issues
sudo tail -f /var/log/nginx/learn-ai.iiskills.cloud.access.log
sudo tail -f /var/log/nginx/learn-ai.iiskills.cloud.error.log
```

## Troubleshooting

### Issue: App Shows 404 or "Page Not Found"

**Cause**: App built successfully but `.next/` directory is incomplete or corrupted

**Solution**:
```bash
cd apps/<app-name>
rm -rf .next
yarn build
pm2 restart ecosystem.config.js --only iiskills-<app-name>
```

### Issue: PM2 Shows App "Errored" or "Stopped"

**Cause**: App failed to start, usually because `.next/` doesn't exist

**Solution**:
```bash
# Check PM2 logs
pm2 logs iiskills-<app-name> --lines 50

# Rebuild the app
cd apps/<app-name>
yarn build

# Restart PM2
pm2 restart ecosystem.config.js --only iiskills-<app-name>
```

### Issue: Multiple Apps Show Same Content

**Cause**: 
1. Apps sharing build directories (shouldn't happen with proper `cwd`)
2. Apps not built independently
3. NGINX misconfigured (routing all to same port)

**Solution**:
```bash
# 1. Verify PM2 cwd settings
cat ecosystem.config.js | grep -A 2 "learn-ai"
# Should show: "cwd": path.join(__dirname, 'apps/learn-ai')

# 2. Verify each app has unique .next/
ls -la apps/main/.next/BUILD_ID
ls -la apps/learn-ai/.next/BUILD_ID
# Each should have different content

# 3. Rebuild everything
./fix-multi-app-deployment.sh

# 4. Restart PM2
pm2 restart all
```

### Issue: Changes Not Reflected After Deployment

**Cause**: Next.js caching old builds

**Solution**:
```bash
# 1. Clear all .next directories
rm -rf apps/*/.next

# 2. Rebuild all
./fix-multi-app-deployment.sh

# 3. Hard restart PM2
pm2 delete all
pm2 start ecosystem.config.js
```

## Additional Resources

- [PM2_DEPLOYMENT.md](./PM2_DEPLOYMENT.md) - Full PM2 deployment guide
- [NGINX_SETUP.md](./NGINX_SETUP.md) - NGINX configuration guide
- [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md) - Environment variable setup
- [PORT_ASSIGNMENTS.md](./PORT_ASSIGNMENTS.md) - Port mapping reference

## Support

If issues persist after following this guide:

1. Check PM2 logs: `pm2 logs --lines 100`
2. Check NGINX logs: `sudo tail -f /var/log/nginx/*.log`
3. Verify disk space: `df -h`
4. Check Node.js/yarn versions: `node --version && yarn --version`
5. Review build logs in `/tmp/build-*.log`
