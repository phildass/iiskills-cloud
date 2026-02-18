# Learn-AI and Learn-Developer App Isolation Fix

## Issue Summary

The learn-ai and learn-developer apps were experiencing deployment issues where:
1. `learn-ai.iiskills.cloud` was showing the main app's landing page instead of its own content
2. `learn-developer.iiskills.cloud` was unreachable ("This site can't be reached")

## Root Cause Analysis

After thorough investigation, the following root causes were identified:

### 1. Missing Build Artifacts
- Neither app had `.next` build directories
- PM2 processes were attempting to run `next start` without pre-built artifacts
- This caused apps to either fail to start or serve incorrect content

### 2. Missing Environment Configuration
- Neither app had `.env.local` files
- Without proper environment configuration, apps couldn't determine their identity
- `NEXT_PUBLIC_APP_ID` and `NEXT_PUBLIC_SITE_URL` were not set

### 3. Configuration Error in Template
- `apps/learn-developer/.env.local.example` had incorrect port (3024 instead of 3007)
- This was a copy-paste error from learn-ai that could cause port conflicts

## Investigation Results

### ✅ What Was Already Correct

1. **Source Code Identity**
   - Both apps have hardcoded `appId` in their `_app.js` files
   - `learn-ai/pages/_app.js`: `<SiteHeader appId="learn-ai" />`
   - `learn-developer/pages/_app.js`: `<SiteHeader appId="learn-developer" />`
   - Both `index.js` files correctly pass `appId` props to `PaidAppLandingPage`

2. **PM2 Configuration** (`ecosystem.config.js`)
   - learn-ai: Correct directory (`apps/learn-ai`), port (3024)
   - learn-developer: Correct directory (`apps/learn-developer`), port (3007)
   - No process conflicts or shared configurations

3. **NGINX Configuration**
   - `nginx-configs/learn-ai.iiskills.cloud`: Correctly proxies to localhost:3024
   - `nginx-configs/learn-developer.iiskills.cloud`: Correctly proxies to localhost:3007
   - No routing conflicts

4. **AppRegistry** (`lib/appRegistry.js`)
   - learn-ai: Port 3024, domain `learn-ai.iiskills.cloud`
   - learn-developer: Port 3007, domain `learn-developer.iiskills.cloud`
   - Both apps correctly configured as paid (`isFree: false`)
   - Bundle relationship properly configured (isBundle/bundleWith)

5. **No Symlinks or Shared Builds**
   - All directories are real, not symlinks
   - No shared `.next` directories that could cause conflicts

## Solution Implemented

### 1. Fixed Environment Configuration Template
```bash
# Fixed apps/learn-developer/.env.local.example
NEXT_PUBLIC_SITE_URL=http://localhost:3007  # Changed from 3024
```

### 2. Created .env.local Files
Used `ensure-env-files.sh` to create `.env.local` for both apps with:
- `NEXT_PUBLIC_APP_ID=learn-ai` / `learn-developer`
- `NEXT_PUBLIC_SITE_URL=http://localhost:3024` / `3007`
- `NEXT_PUBLIC_SUPABASE_SUSPENDED=true` (for testing without credentials)

### 3. Built Both Apps Independently
```bash
# Installed dependencies
yarn install

# Built learn-ai
cd apps/learn-ai && yarn build

# Built learn-developer
cd apps/learn-developer && yarn build
```

**Build Results:**
- learn-ai BUILD_ID: `Xeh_oes05dKFROGEfmDa1`
- learn-developer BUILD_ID: `WZb6OeHzPy-HCUVuTwbSb`
- ✅ BUILD_IDs are unique - confirms complete isolation

### 4. Created Diagnostic Tool
Added `diagnose-app-isolation.sh` script to verify:
- Directory structure
- .env.local files with correct APP_ID and PORT
- .next build directories with unique BUILD_IDs
- Source code identity (hardcoded appId values)
- PM2 configuration
- NGINX configuration
- AppRegistry configuration
- No symlinks or shared resources

## Deployment Checklist

To deploy these apps to production, follow these steps:

### Step 1: Verify Build Isolation
```bash
./diagnose-app-isolation.sh
```
Ensure all checks pass before deployment.

### Step 2: Configure Production Environment
For each app, update `.env.local` with production values:

**apps/learn-ai/.env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=<production-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-anon-key>
NEXT_PUBLIC_SUPABASE_SUSPENDED=false
NEXT_PUBLIC_SITE_URL=https://learn-ai.iiskills.cloud
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_APP_ID=learn-ai
```

**apps/learn-developer/.env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=<production-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-anon-key>
NEXT_PUBLIC_SUPABASE_SUSPENDED=false
NEXT_PUBLIC_SITE_URL=https://learn-developer.iiskills.cloud
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_APP_ID=learn-developer
```

### Step 3: Build Apps for Production
```bash
# Build learn-ai
cd apps/learn-ai
yarn build
cd ../..

# Build learn-developer
cd apps/learn-developer
yarn build
cd ../..
```

### Step 4: Verify Build Uniqueness
```bash
# Check BUILD_IDs are unique
cat apps/learn-ai/.next/BUILD_ID
cat apps/learn-developer/.next/BUILD_ID
```
They should be different.

### Step 5: Deploy with PM2
```bash
# Stop any existing processes
pm2 stop iiskills-learn-ai iiskills-learn-developer

# Start apps
pm2 start ecosystem.config.js --only iiskills-learn-ai
pm2 start ecosystem.config.js --only iiskills-learn-developer

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs iiskills-learn-ai --lines 50
pm2 logs iiskills-learn-developer --lines 50
```

### Step 6: Verify NGINX Configuration
```bash
# Test NGINX configuration
sudo nginx -t

# Reload NGINX if needed
sudo systemctl reload nginx

# Check NGINX logs
sudo tail -f /var/log/nginx/learn-ai.iiskills.cloud.access.log
sudo tail -f /var/log/nginx/learn-developer.iiskills.cloud.access.log
```

### Step 7: Test Apps
```bash
# Test locally first
curl http://localhost:3024
curl http://localhost:3007

# Test via domain (from server or after DNS is configured)
curl https://learn-ai.iiskills.cloud
curl https://learn-developer.iiskills.cloud
```

## Verification Tests

### Local Verification
1. **Port Isolation Test**
   ```bash
   cd apps/learn-ai && yarn start &
   cd apps/learn-developer && yarn start &
   
   # Test learn-ai on port 3024
   curl http://localhost:3024 | grep "learn-ai"
   
   # Test learn-developer on port 3007
   curl http://localhost:3007 | grep "learn-developer"
   ```

2. **Content Verification**
   - learn-ai should show: "Train the Machine. Master the Intelligence."
   - learn-developer should show: "Code the Future. Train the Machine."

### Production Verification
1. **Domain Resolution**
   ```bash
   nslookup learn-ai.iiskills.cloud
   nslookup learn-developer.iiskills.cloud
   ```

2. **SSL Certificates**
   ```bash
   openssl s_client -connect learn-ai.iiskills.cloud:443 -servername learn-ai.iiskills.cloud
   openssl s_client -connect learn-developer.iiskills.cloud:443 -servername learn-developer.iiskills.cloud
   ```

3. **App Identity Check**
   - Visit https://learn-ai.iiskills.cloud
     - Should show Learn AI branding
     - Should mention "Two for One Bundle" with Learn Developer
   - Visit https://learn-developer.iiskills.cloud
     - Should show Learn Developer branding
     - Should mention "Two for One Bundle" with Learn AI

## Bundle Payment Logic

Both apps are correctly configured as a bundle in the existing course configuration:

**apps/main/pages/courses.js (existing file, not modified in this PR):**
- Learn AI: `isBundle: true`, `bundleWith: "Learn Developer"`
- Learn Developer: `isBundle: true`, `bundleWith: "Learn AI"`

This means:
- Purchasing either app grants access to both
- Both apps show bundle messaging on their landing pages
- Access logic is handled through Supabase profiles table
- No shared build artifacts or configurations that could cause conflicts

## Troubleshooting

### Issue: App shows wrong content
**Solution:** 
1. Check BUILD_ID is unique: `cat apps/<app>/.next/BUILD_ID`
2. Verify APP_ID in .env.local: `grep NEXT_PUBLIC_APP_ID apps/<app>/.env.local`
3. Check PM2 is running from correct directory: `pm2 show iiskills-<app>`
4. Rebuild the app: `cd apps/<app> && rm -rf .next && yarn build`

### Issue: App is unreachable
**Solution:**
1. Check PM2 process is running: `pm2 status`
2. Check PM2 logs: `pm2 logs iiskills-<app>`
3. Verify port is listening: `netstat -tlnp | grep <port>`
4. Check NGINX error log: `sudo tail -f /var/log/nginx/learn-<app>.iiskills.cloud.error.log`

### Issue: Port conflict
**Solution:**
1. Verify correct ports in .env.local (3024 for learn-ai, 3007 for learn-developer)
2. Check no other process is using the port: `lsof -i :<port>`
3. Restart PM2 processes with correct ports

### Issue: Duplicate BUILD_IDs
**Solution:**
1. Delete .next directories: `rm -rf apps/learn-ai/.next apps/learn-developer/.next`
2. Rebuild sequentially:
   ```bash
   cd apps/learn-ai && yarn build && cd ../..
   cd apps/learn-developer && yarn build && cd ../..
   ```
3. Verify uniqueness: `./diagnose-app-isolation.sh`

## Key Learnings

1. **Each Next.js app MUST have its own .next directory** - Never share build artifacts
2. **Each app MUST have a unique BUILD_ID** - This ensures proper asset resolution
3. **Environment variables are critical for app identity** - APP_ID and SITE_URL must be correct
4. **Template files can be misleading** - Always verify .env.local.example files are correct
5. **PM2 requires pre-built apps** - `next start` cannot work without .next directory
6. **Diagnostic tools are invaluable** - Automated checks catch issues before deployment

## Related Files

- **Apps:**
  - `apps/learn-ai/` - Learn AI application
  - `apps/learn-developer/` - Learn Developer application
  
- **Configuration:**
  - `ecosystem.config.js` - PM2 process configuration
  - `nginx-configs/learn-ai.iiskills.cloud` - NGINX reverse proxy config
  - `nginx-configs/learn-developer.iiskills.cloud` - NGINX reverse proxy config
  - `lib/appRegistry.js` - App metadata and routing configuration
  
- **Scripts:**
  - `diagnose-app-isolation.sh` - Diagnostic tool for app isolation
  - `ensure-env-files.sh` - Creates .env.local from templates
  
- **Documentation:**
  - `MULTI_APP_DEPLOYMENT_FIX.md` - Multi-app deployment guide
  - `PM2_DEPLOYMENT.md` - PM2 deployment reference
  - `NGINX_SETUP.md` - NGINX configuration guide

## Next Steps

1. ✅ Fixed .env.local.example port error in learn-developer
2. ✅ Created diagnostic tool for future verification
3. ✅ Built both apps with unique BUILD_IDs
4. ✅ Documented complete solution and deployment process
5. ⏭️ Deploy to production following the checklist above
6. ⏭️ Monitor logs and verify both apps serve correct content
7. ⏭️ Test bundle payment logic end-to-end
