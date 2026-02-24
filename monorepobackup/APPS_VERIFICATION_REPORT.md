# Apps Verification Report: learn-ai and learn-developer

**Date**: February 18, 2026  
**Task**: Investigate reported file overwrites in apps/learn-ai and apps/learn-developer  
**Result**: ✅ **NO FILE OVERWRITES DETECTED** - Apps contain unique, correct content

---

## Executive Summary

After thorough investigation, **no file overwrites were found**. The `apps/learn-ai` and `apps/learn-developer` directories contain their unique, app-specific content and have not been overwritten with the main app's files.

The user's concern appears to stem from confusion about an earlier deployment issue (PRs #353 & #354) where apps were **serving** wrong content at runtime due to missing builds, not because the source files were overwritten.

---

## Detailed Verification

### 1. Source File Analysis

#### apps/learn-ai/pages/index.js
- **Status**: ✅ Unique AI-specific content
- **Title**: "iiskills-ai - Master Artificial Intelligence"
- **Headline**: "Train the Machine. Master the Intelligence."
- **Subheadline**: "Don't Just Use AI—Control It. Master the Logic Behind the Machine."
- **Component**: Uses `PaidAppLandingPage` with AI-specific features
- **Last Modified**: February 9, 2026 (no recent overwrites)

#### apps/learn-developer/pages/index.js
- **Status**: ✅ Unique Developer-specific content
- **Title**: "iiskills-developer - Master Software Development"
- **Headline**: "Code the Future. Train the Machine."
- **Subheadline**: "Stop Guessing. Start Building. The Path to Senior Engineer."
- **Component**: Uses `PaidAppLandingPage` with Developer-specific features
- **Last Modified**: February 9, 2026 (no recent overwrites)

#### apps/main/pages/index.js
- **Status**: ✅ Completely different from learn apps
- **Title**: "iiskills.cloud - Democratizing Education for Viksit Bharat"
- **Content**: Full landing page with 9 courses, pricing, testimonials (540+ lines)
- **Structure**: Custom implementation, not using PaidAppLandingPage

### 2. Curriculum Pages

#### apps/learn-ai/pages/curriculum.js
- **Title**: "Full Curriculum - Learn AI"
- **Content**: "Complete AI Course Curriculum"
- **Data Source**: Uses `getAllModules()` from curriculumGenerator

#### apps/learn-developer/pages/curriculum.js
- **Title**: "Web Developer Bootcamp Curriculum - Learn Developer"
- **Content**: "Web Developer Bootcamp Curriculum"
- **Data Source**: Uses `curriculumData.modules` from curriculumData

### 3. Git History Analysis

```bash
# Checking git history for apps/learn-ai/pages/index.js
Commits found: Last change on February 9, 2026
Recent commits:
- 5f93398: "Standardize page titles across all apps for consistency"
- d5b5bc5: "Add favicon SVG files and update all apps with iiskills branding"

# Checking git history for apps/learn-developer/pages/index.js
Commits found: Last change on February 9, 2026
Same commit history as learn-ai (bulk update across all apps)

# No overwrites detected in the past 2 weeks
```

### 4. Build Verification

All apps were successfully built with unique BUILD_IDs:

```bash
apps/main/.next/BUILD_ID:          41HEWOKZfEbVRKMuh1BSc (379 files)
apps/learn-ai/.next/BUILD_ID:      On-Mhyyu7HFdVRBhG-msL (119 files)
apps/learn-developer/.next/BUILD_ID: 1vdKHuqyK3OdZ7aWEpeNr (63 files)
```

#### Learn AI Build Output Verification:
```html
<title>iiskills-ai - Master Artificial Intelligence</title>
<h1>Train the Machine. Master the Intelligence.</h1>
<meta name="description" content="Master AI from prompts to production...">
```

#### Learn Developer Build Output Verification:
```html
<title>iiskills-developer - Master Software Development</title>
<h1>Code the Future. Train the Machine.</h1>
<meta name="description" content="Master the complete developer stack...">
```

---

## What Actually Happened (Historical Context)

### The Earlier Deployment Issue (PRs #353 & #354)

**Timeline**:
- **February 18, 2026 ~05:00 UTC**: PR #353 merged - "Configure Next.js apps for monorepo operation"
- **February 18, 2026 ~06:00 UTC**: PR #354 merged - "Fix multi-app deployment: ensure independent builds"

**Issue Description**:
- Apps were **serving** wrong content at runtime (showing main app's content)
- **Root Cause**: Apps were never properly built (missing .next directories)
- **NOT a file overwrite issue** - source files always had unique content
- **Solution**: Created .env.local files and built each app independently

### Why This Might Have Been Confused as "Overwrite"

1. **Symptom**: When accessing learn-ai.iiskills.cloud, users saw the main app's content
2. **User Perception**: "The app files must have been overwritten!"
3. **Reality**: The source files were correct, but the apps weren't built, so PM2/NGINX served wrong content
4. **Fix**: Building the apps properly resolved the issue

---

## Current State

### Environment Setup
- ✅ All apps have `.env.local` files with proper configuration
- ✅ Supabase suspended mode enabled for all apps
- ✅ Valid Supabase URL format configured

### Build Status
| App | BUILD_ID | Files | Status |
|-----|----------|-------|--------|
| main | 41HEWOKZfEbVRKMuh1BSc | 379 | ✅ Built |
| learn-ai | On-Mhyyu7HFdVRBhG-msL | 119 | ✅ Built |
| learn-apt | (varies) | 103 | ✅ Built |
| learn-chemistry | (varies) | 111 | ✅ Built |
| learn-developer | 1vdKHuqyK3OdZ7aWEpeNr | 63 | ✅ Built |
| learn-geography | (varies) | 111 | ✅ Built |
| learn-management | (varies) | 119 | ✅ Built |
| learn-math | (varies) | 111 | ✅ Built |
| learn-physics | (varies) | 111 | ✅ Built |
| learn-pr | (varies) | 119 | ✅ Built |

### Deployment Readiness
- ✅ All apps properly configured
- ✅ All apps independently built
- ✅ Each app has unique content and BUILD_ID
- ✅ Ready for PM2 deployment

---

## Recommendations

### 1. No Restoration Needed ✅
The apps are already in the correct state with unique content. **No backup restoration is required.**

### 2. Deployment Steps

If you need to deploy or redeploy the apps:

```bash
# Option 1: Restart PM2 (if already configured)
pm2 restart ecosystem.config.js

# Option 2: Start fresh
pm2 delete ecosystem.config.js
pm2 start ecosystem.config.js
pm2 save

# Option 3: Use deployment script
./deploy-all.sh
```

### 3. Verify Deployment

After deployment, verify each app serves unique content:

```bash
# Via localhost ports
curl http://localhost:3000 | grep -o '<title>.*</title>'
# Expected: <title>iiskills.cloud - Democratizing Education for Viksit Bharat</title>

curl http://localhost:3024 | grep -o '<title>.*</title>'
# Expected: <title>iiskills-ai - Master Artificial Intelligence</title>

curl http://localhost:3007 | grep -o '<title>.*</title>'
# Expected: <title>iiskills-developer - Master Software Development</title>
```

```bash
# Via NGINX subdomains
curl https://app.iiskills.cloud | grep -o '<title>.*</title>'
curl https://learn-ai.iiskills.cloud | grep -o '<title>.*</title>'
curl https://learn-developer.iiskills.cloud | grep -o '<title>.*</title>'
```

### 4. Future Prevention

To prevent confusion in the future:

1. **Always build apps before PM2 deployment**: Run `yarn build` in each app directory
2. **Use the fix script**: Run `./fix-multi-app-deployment.sh` when in doubt
3. **Check BUILD_IDs**: Verify each app has a unique BUILD_ID after building
4. **Test locally first**: Verify content via localhost ports before checking subdomains

---

## Files Checked

### Source Files
- ✅ apps/learn-ai/pages/index.js
- ✅ apps/learn-ai/pages/curriculum.js
- ✅ apps/learn-ai/pages/_app.js
- ✅ apps/learn-ai/pages/404.js
- ✅ apps/learn-developer/pages/index.js
- ✅ apps/learn-developer/pages/curriculum.js
- ✅ apps/learn-developer/pages/_app.js
- ✅ apps/learn-developer/pages/404.js
- ✅ apps/main/pages/index.js

### Configuration Files
- ✅ apps/learn-ai/next.config.js (path aliases configured)
- ✅ apps/learn-ai/jsconfig.json (path aliases configured)
- ✅ apps/learn-ai/.env.local (created by fix script)
- ✅ apps/learn-developer/next.config.js (path aliases configured)
- ✅ apps/learn-developer/jsconfig.json (path aliases configured)
- ✅ apps/learn-developer/.env.local (created by fix script)

### Build Outputs
- ✅ apps/learn-ai/.next/BUILD_ID
- ✅ apps/learn-ai/.next/server/pages/index.html
- ✅ apps/learn-ai/.next/server/pages/curriculum.html
- ✅ apps/learn-developer/.next/BUILD_ID
- ✅ apps/learn-developer/.next/server/pages/index.html
- ✅ apps/learn-developer/.next/server/pages/curriculum.html

---

## Conclusion

**The apps/learn-ai and apps/learn-developer directories are in perfect condition with their unique, correct content. No file restoration is needed.**

If you believed files were overwritten, it was likely due to the earlier runtime issue (now fixed) where unbuild apps were serving incorrect content. The source files were never affected.

**Next Steps**: Simply deploy the apps using PM2 and verify they serve correctly via their respective subdomains.

---

**Verified By**: Automated verification script  
**Date**: February 18, 2026  
**Status**: ✅ VERIFIED - No action required
