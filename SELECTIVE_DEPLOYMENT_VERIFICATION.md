# Selective Deployment Verification Report

**Date:** January 29, 2026  
**Purpose:** Verify that only the 12 active learn-* apps are built and deployed

## Verification Tests Performed

### 1. Workspace Configuration Test

**Command:** `yarn workspaces list`

**Result:** ✅ PASSED

**Output:**
- ✓ Root workspace (.)
- ✓ 12 active learn-* apps:
  - learn-ai
  - learn-apt
  - learn-chemistry
  - learn-cricket
  - learn-geography
  - learn-govt-jobs
  - learn-leadership
  - learn-management
  - learn-math
  - learn-physics
  - learn-pr
  - learn-winning
- ✓ apps/main
- ✓ 3 packages:
  - packages/content-sdk
  - packages/core
  - packages/schema

**Verification:**
- No apps-backup apps appear in workspace list
- Total learn-* apps: 12 (exactly as required)

### 2. Build Scope Test

**Command:** `yarn turbo run build --dry-run`

**Result:** ✅ PASSED

**Packages in Scope:**
- @iiskills/content-sdk
- @iiskills/core
- @iiskills/main
- @iiskills/schema
- learn-ai
- learn-apt
- learn-chemistry
- learn-cricket
- learn-geography
- learn-govt-jobs
- learn-leadership
- learn-management
- learn-math
- learn-physics
- learn-pr
- learn-winning

**Total:** 16 packages (12 learn-* apps + 1 main + 3 shared packages)

**Verification:**
- Checked for excluded apps: learn-ias, learn-jee, learn-neet, learn-data-science, coming-soon, admin, iiskills-admin
- Result: None of the backed-up apps appear in build scope ✓

### 3. PM2 Configuration Test

**Command:** `node generate-ecosystem.js --dry-run`

**Result:** ✅ PASSED

**Detected Applications:**
- Found 13 Next.js applications
- iiskills-main (apps/main)
- 12 learn-* apps (all from apps/ directory)

**Verification:**
- No apps from apps-backup/ directory detected
- Script correctly skips apps-backup folder
- Port assignments conflict-free

### 4. Directory Structure Test

**Command:** `ls -la apps/ && ls -la apps-backup/`

**Result:** ✅ PASSED

**Active apps in apps/:**
- learn-ai
- learn-apt
- learn-chemistry
- learn-cricket
- learn-geography
- learn-govt-jobs
- learn-leadership
- learn-management
- learn-math
- learn-physics
- learn-pr
- learn-winning
- main

**Backed-up apps in apps-backup/:**
- admin
- coming-soon
- iiskills-admin
- learn-data-science
- learn-ias
- learn-jee
- learn-neet

**Verification:**
- All 7 inactive apps successfully moved to apps-backup ✓
- All 12 active learn-* apps remain in apps/ ✓
- Main app remains in apps/ ✓

### 5. Node Modules Symlinks Test

**Command:** `ls -la node_modules/@iiskills/`

**Result:** ✅ PASSED

**Symlinks created:**
- content-sdk -> ../../packages/content-sdk
- core -> ../../packages/core
- main -> ../../apps/main
- schema -> ../../packages/schema

**Verification:**
- Only active packages have symlinks in node_modules
- No symlinks for backed-up apps ✓

### 6. Configuration Files Test

**Files checked:**
1. `package.json` - Workspaces exclude apps-backup ✓
2. `ecosystem.config.js` - Contains only main + 12 active learn-* apps + webhook ✓
3. `generate-ecosystem.js` - Skips apps-backup directory ✓
4. `lib/validateRuntimeEnv.js` - Updated paths to apps-backup ✓
5. `.gitignore` - Handles build artifacts globally ✓

**Result:** ✅ PASSED

## Summary

### ✅ All Verification Tests Passed

**Active Applications (13):**
- 1 main app
- 12 learn-* apps (ai, apt, chemistry, cricket, geography, govt-jobs, leadership, management, math, physics, pr, winning)

**Backed-Up Applications (7):**
- admin
- coming-soon
- iiskills-admin
- learn-data-science
- learn-ias
- learn-jee
- learn-neet

**Key Achievements:**
1. ✅ Only active apps included in yarn workspaces
2. ✅ Only active apps included in turbo build scope
3. ✅ Only active apps included in PM2 configuration
4. ✅ Backed-up apps preserved in git but excluded from builds
5. ✅ No symlinks created for backed-up apps
6. ✅ generate-ecosystem.js correctly skips apps-backup
7. ✅ All configuration files updated consistently
8. ✅ Comprehensive documentation created (README_DEPLOY_APPS.md)

**No Issues Found:**
- No backed-up apps appear in any build/deploy configuration
- No accidental builds of inactive apps possible
- Standard developer workflow only processes active apps

## Conclusion

The selective deployment configuration is working correctly. Running `yarn install`, `yarn build`, or `pm2 start ecosystem.config.js` will only process the 12 specified active learn-* apps plus the main app. All backed-up apps are preserved in the repository but excluded from all build and deployment processes.

## Next Steps for Team

1. Review the changes in this PR
2. Test deployment with: `pm2 start ecosystem.config.js`
3. Verify each app starts on its assigned port
4. Review `README_DEPLOY_APPS.md` for re-enabling apps when needed
5. Update any custom deployment scripts to reference the new structure

---

**Verified By:** GitHub Copilot Agent  
**Date:** January 29, 2026
