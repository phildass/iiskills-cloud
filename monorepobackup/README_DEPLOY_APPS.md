# Selective Deployment Guide for iiskills-cloud

## Overview

This document describes the selective deployment strategy for the iiskills-cloud monorepo. Only a specific set of applications are actively built and deployed, while others are preserved in a backup state for future use.

## Universal Header & Hero Sync

### Shared Components
All apps now use shared components for consistent branding:

- **SiteHeader** (`components/shared/SiteHeader.js`) - Universal navigation header
- **HeroManager** (`components/shared/HeroManager.js`) - Hero image selection and rendering
- **UniversalLandingPage** - Updated to use HeroManager for consistent hero behavior

### Hero Image Rules
- **Default Apps**: Randomly select 2 images from pool:
  - `iiskills-image1.jpg`, `iiskills-image2.jpg`, `iiskills-image3.jpg`, `iiskills-image4.jpg`
  - First image used as full-size hero background (Next/Image fill + object-fit: cover)
  - Overlay text positioned at bottom of hero area
  
- **learn-cricket**: Uses dedicated images:
  - `cricket1.jpg`, `cricket2.jpg`
  - Same hero rendering behavior as other apps

### Deployment Notes
- All apps have SiteHeader integrated via `_app.js`
- Hero behavior is consistent across all landing pages
- Custom landing pages (main, learn-apt) preserve unique content while using shared hero
- learn-companion is a chat interface and doesn't use hero (by design)

### Audit Script
Run `node scripts/audit-landing-pages.js` to verify:
- SiteHeader presence in all apps
- Hero image selection correctness
- No unintended "Learn AI" text in other apps

## Active Applications

The following **12 learn-* applications** are currently active and will be built/deployed:

1. **learn-ai** - AI learning portal
2. **learn-apt** - Aptitude test preparation
3. **learn-chemistry** - Chemistry education portal
4. **learn-cricket** - Cricket knowledge portal
5. **learn-geography** - Geography learning portal
6. **learn-govt-jobs** - Government jobs preparation
7. **learn-leadership** - Leadership skills portal
8. **learn-management** - Management education portal
9. **learn-math** - Mathematics learning portal
10. **learn-physics** - Physics education portal
11. **learn-pr** - Public Relations portal
12. **learn-winning** - Winning strategies portal

### Additional Active Apps
- **main** - Main iiskills.cloud application
- **webhook** - Webhook service for deployments

## Inactive Applications (Backed Up)

The following applications are preserved in the `/apps-backup/` directory but are **NOT** built or deployed:

- `learn-ias` - IAS exam preparation
- `learn-jee` - JEE exam preparation
- `learn-neet` - NEET exam preparation
- `learn-data-science` - Data science learning portal
- `coming-soon` - Coming soon page
- `admin` - Admin module (legacy)
- `iiskills-admin` - Admin dashboard

These apps remain in the repository for future use but are excluded from:
- Workspace configuration (`package.json` workspaces)
- Build processes (`yarn build`, `turbo run build`)
- PM2 deployment configuration (`ecosystem.config.js`)
- Auto-generation scripts (`generate-ecosystem.js`)

## Directory Structure

```
iiskills-cloud/
├── apps/                    # Active applications only
│   ├── main/
│   ├── learn-ai/
│   ├── learn-apt/
│   ├── learn-chemistry/
│   ├── learn-cricket/
│   ├── learn-geography/
│   ├── learn-govt-jobs/
│   ├── learn-leadership/
│   ├── learn-management/
│   ├── learn-math/
│   ├── learn-physics/
│   ├── learn-pr/
│   └── learn-winning/
│
├── apps-backup/             # Inactive/backup applications
│   ├── admin/
│   ├── coming-soon/
│   ├── iiskills-admin/
│   ├── learn-data-science/
│   ├── learn-ias/
│   ├── learn-jee/
│   └── learn-neet/
│
└── packages/                # Shared packages
    ├── content-sdk/
    ├── core/
    └── schema/
```

## Build and Deployment

### Building Active Apps

Running standard build commands will **only** process the active applications:

```bash
# Install dependencies for active apps only
yarn install

# Build all active apps
yarn build

# Build with turbo
yarn turbo run build

# Start all active apps in development
yarn dev
```

### Per-Workspace CI-Friendly Builds

The repository now includes a **per-workspace build system** designed to prevent memory exhaustion and enable efficient CI builds:

- **GitHub Actions Workflow**: `.github/workflows/build-workspaces.yml` builds each workspace independently in parallel
- **Helper Script**: `scripts/workspace-install-build.sh` performs workspace-focused installs and builds
- **Yarn Version Detection**: Automatically uses `yarn workspaces focus` for Yarn v2+ (Berry) or falls back to Yarn v1 behavior
- **Matrix Generation**: `.github/scripts/get-workspaces.js` dynamically generates the list of workspaces to build

**Build a single workspace locally:**
```bash
# Using the helper script directly
bash scripts/workspace-install-build.sh learn-math

# Using package.json script
yarn ci:build:workspace learn-math production
```

**Build all workspaces serially:**
```bash
yarn build:all-serial
```

**List all buildable workspaces:**
```bash
node .github/scripts/get-workspaces.js
```

The deployment script (`deploy.sh`) now uses this per-workspace approach for production builds, ensuring memory-bounded sequential builds.

### PM2 Deployment

The PM2 ecosystem configuration (`ecosystem.config.js`) includes only active apps:

```bash
# Start all active apps
pm2 start ecosystem.config.js

# Start specific app
pm2 start ecosystem.config.js --only iiskills-learn-ai

# View running apps
pm2 list

# Monitor apps
pm2 monit

# View logs
pm2 logs
```

## Port Assignments

Active apps use the following port assignments:

| Application | Port | Service |
|------------|------|---------|
| main | 3000 | Main iiskills.cloud |
| learn-ai | 3001 | AI Portal |
| learn-apt | 3002 | Aptitude Portal |
| learn-chemistry | 3005 | Chemistry Portal |
| learn-cricket | 3009 | Cricket Portal |
| learn-geography | 3011 | Geography Portal |
| learn-govt-jobs | 3013 | Govt Jobs Portal |
| learn-leadership | 3015 | Leadership Portal |
| learn-management | 3016 | Management Portal |
| learn-math | 3017 | Math Portal |
| learn-physics | 3020 | Physics Portal |
| learn-pr | 3021 | PR Portal |
| learn-winning | 3022 | Winning Portal |
| webhook | 9000 | Deployment Webhook |

## Re-enabling a Backed-Up App

To restore and activate a backed-up application:

### 1. Move the app back to active directory

```bash
git mv apps-backup/learn-[app-name] apps/
```

### 2. Update PM2 configuration

Edit `ecosystem.config.js` and add the app configuration:

```javascript
{
  name: "iiskills-learn-[app-name]",
  script: "node_modules/.bin/next",
  args: "start -p [PORT]",
  cwd: "/root/iiskills-cloud/apps/learn-[app-name]",
  env: { NODE_ENV: "production" }
}
```

Alternatively, regenerate the config automatically:

```bash
npm run generate-pm2-config
```

### 3. Update documentation

Add the app to the "Active Applications" list in this document and remove it from "Inactive Applications".

### 4. Reinstall and build

```bash
# Install dependencies
yarn install

# Build the newly activated app
cd apps/learn-[app-name]
yarn build

# Or build all apps from root
cd ../..
yarn build
```

### 5. Deploy

```bash
# Start with PM2
pm2 start ecosystem.config.js --only iiskills-learn-[app-name]

# Or restart all
pm2 restart ecosystem.config.js
```

## Backing Up an Active App

To deactivate and back up an currently active application:

### 1. Stop the app if running

```bash
pm2 stop iiskills-learn-[app-name]
pm2 delete iiskills-learn-[app-name]
```

### 2. Move to backup directory

```bash
git mv apps/learn-[app-name] apps-backup/
```

### 3. Update PM2 configuration

Remove the app entry from `ecosystem.config.js`, or regenerate:

```bash
npm run generate-pm2-config
```

### 4. Update documentation

Move the app from "Active Applications" to "Inactive Applications" in this document.

### 5. Clean workspace

```bash
# Remove the app from yarn workspaces
yarn install
```

## Configuration Files

The following files control which apps are active:

1. **`package.json`** - `workspaces` array includes only `apps/*` (excludes `apps-backup/*`)
2. **`ecosystem.config.js`** - PM2 configuration lists only active apps
3. **`generate-ecosystem.js`** - Skips `apps-backup/` directory when auto-generating PM2 config
4. **`turbo.json`** - Uses workspace configuration (no specific app filtering needed)

## Verification

To verify that only active apps are processed:

### Check workspaces

```bash
yarn workspaces list
```

Should show only packages, main, and the 12 active learn-* apps.

### Test build

```bash
# Run build with verbose output
yarn build --verbose

# Check what was built
find apps -name ".next" -type d
```

Should only show `.next` directories in active apps.

### Verify PM2 config

```bash
# Validate PM2 configuration
npm run validate-pm2-config

# Test PM2 config parsing
npm run test-pm2-config
```

## Notes

- **Build artifacts** (`.next/`, `node_modules/`, etc.) in `apps-backup/` are automatically ignored by `.gitignore`
- **Source code** in `apps-backup/` is tracked by git and preserved
- The `apps-backup/` directory is excluded from yarn workspaces, so dependencies won't be installed
- When regenerating PM2 config with `generate-ecosystem.js`, the script automatically skips `apps-backup/`
- All deployment scripts (`deploy.sh`, etc.) only operate on apps in the `apps/` directory

## Troubleshooting

### App not building

If an active app is not building:

1. Verify it's in `apps/` directory (not `apps-backup/`)
2. Check that `yarn install` completed successfully
3. Ensure the app has a valid `package.json` with build script
4. Check for any app-specific errors in build logs

### PM2 app not starting

If an app won't start with PM2:

1. Verify the app is in `ecosystem.config.js`
2. Check that the port is not already in use
3. Ensure the app was built (`yarn build` or `cd apps/[app] && yarn build`)
4. Review PM2 logs: `pm2 logs iiskills-learn-[app-name]`

### Workspace issues

If yarn workspace commands fail:

1. Run `yarn install` to refresh workspace links
2. Verify `package.json` workspaces array is correct
3. Check that apps in `apps-backup/` are not being referenced anywhere

## Maintenance Commands

```bash
# Regenerate PM2 configuration
npm run generate-pm2-config

# Validate PM2 configuration
npm run validate-pm2-config

# Clean all build artifacts
find apps -name ".next" -type d -exec rm -rf {} +
find apps -name "node_modules" -type d -exec rm -rf {} +

# Reinstall all dependencies
yarn install --force

# Full rebuild
yarn clean && yarn install && yarn build
```

## Contact

For questions or issues related to this deployment configuration, please contact the development team or refer to the main project documentation.

---

**Last Updated:** January 2026  
**Maintained By:** iiskills-cloud development team
