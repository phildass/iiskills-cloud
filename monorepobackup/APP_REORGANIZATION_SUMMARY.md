# App Reorganization and Testing Mode Summary

## Overview

This document summarizes the app reorganization and testing mode implementation completed on February 5, 2026.

## Apps Moved to Backup

The following apps have been moved from `apps/` to `apps-backup/`:

1. **learn-cricket** - Moved to backup
2. **learn-winning** - Moved to backup
3. **learn-leadership** - Moved to backup
4. **learn-companion** - Moved to backup

These apps are no longer active in the main deployment.

## Current Active Apps

The following apps remain active in `apps/`:

### Free Apps (No login required - isFree: true)
1. **Learn Math** - Free mathematics learning platform
2. **Learn Chemistry** - Free chemistry learning platform
3. **Learn Geography** - Free geography learning platform
4. **Learn Physics** - Free physics learning platform
5. **Learn Apt** - Free aptitude testing platform

### Paid Apps (Marked as paid but temporarily accessible - isFree: false)
1. **Learn Developer** - Paid development course
2. **Learn AI** - Paid AI course
3. **Learn Govt Jobs** - Paid government jobs preparation
4. **Learn PR** - Paid public relations course
5. **Learn Management** - Management course

### Main App
- **main** - Main iiskills.cloud application

## Testing Mode Configuration

### Current Status: FULLY PUBLIC ACCESS

All apps are currently in **TEMPORARY TESTING MODE** with the following settings:

```bash
# Authentication is DISABLED (public access)
NEXT_PUBLIC_DISABLE_AUTH=false

# Paywalls are DISABLED (all content free)
NEXT_PUBLIC_PAYWALL_ENABLED=false

# Admin routes accessible without authentication
DEBUG_ADMIN=true
NEXT_PUBLIC_DEBUG_ADMIN=true
```

### What This Means

✅ **All apps are accessible without login or payment**
- Free apps: Learn Math, Learn Chemistry, Learn Geography, Learn Physics, Learn Apt
- Paid apps: Learn Developer, Learn AI, Learn Govt Jobs, Learn PR, Learn Management
- All content, lessons, modules, and resources are publicly accessible
- No authentication or paywall restrictions

### Important Notes

1. **Temporary Mode**: This is a temporary testing configuration to allow users to test all apps
2. **Free vs Paid Classification**: Apps are still classified as free or paid in the registry (`lib/appRegistry.js`), but the global testing mode overrides all restrictions
3. **Admin Access**: Admin routes are accessible without authentication during testing period
4. **App Registry**: The app registry has been updated to reflect:
   - Removed apps (cricket, winning, leadership, companion)
   - Added learn-developer (was missing)
   - Correctly marked free apps (Math, Chemistry, Geography, Physics, Apt)
   - Correctly marked paid apps (Developer, AI, Govt Jobs, PR)

## Implementation Files

### Modified Files
1. **lib/appRegistry.js** - Updated app registry with correct free/paid status
   - Removed: learn-cricket, learn-winning, learn-leadership, learn-companion
   - Added: learn-developer
   - Updated isFree flags for all apps

2. **ecosystem.config.js** - Regenerated PM2 configuration
   - Removed entries for moved apps
   - Updated with current 11 active apps

3. **PM2_ENTRY_POINTS.md** - Auto-generated documentation of PM2 apps

### Configuration Files
- **.env.local.example** - Contains testing mode settings (already configured)

## Restoring Normal Operation

When the testing period ends, to restore normal authentication and paywall behavior:

1. Update `.env.local` files:
```bash
NEXT_PUBLIC_DISABLE_AUTH=true    # Enable authentication
NEXT_PUBLIC_PAYWALL_ENABLED=true  # Enable paywalls
DEBUG_ADMIN=false                 # Require auth for admin
NEXT_PUBLIC_DEBUG_ADMIN=false
```

2. Rebuild and restart all apps:
```bash
npm run build
pm2 restart ecosystem.config.js
```

## App Classification Reference

### Free Apps (Always Free)
- Learn Math
- Learn Chemistry
- Learn Geography
- Learn Physics
- Learn Apt

### Paid Apps (Require Payment When Testing Mode Disabled)
- Learn Developer
- Learn AI
- Learn Govt Jobs
- Learn PR
- Learn Management

### Backup Apps (Not Deployed)
- learn-cricket
- learn-winning
- learn-leadership
- learn-companion
- learn-data-science (already in backup)
- learn-ias (already in backup)
- learn-jee (already in backup)
- learn-neet (already in backup)

---

**Date Created**: February 5, 2026  
**Status**: Active - Testing Mode Enabled  
**Contact**: Development Team
