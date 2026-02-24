# Phase 2: Universal Components, Pilot App, and Core Workflow Build

**Version**: 1.0.0  
**Created**: 2026-02-18  
**Status**: IN PROGRESS  
**Priority**: CRITICAL

---

## Executive Summary

Phase 2 of the monorepo rebuild focuses on:
1. ✅ **Complete migration of shared components to @iiskills/ui**
2. 🔄 **Rebuild pilot apps using only @iiskills/ui components**
3. 🔄 **Test and validate all universal workflows**
4. 🔄 **Document gaps and create migration guides**
5. 🔄 **Roll out to all remaining apps**

---

## Phase 1 Completion Summary

Phase 1 (Monorepo Architecture & Migration Framework) was successfully completed:
- ✅ Turborepo with Yarn workspaces configured
- ✅ 10 active apps identified and documented
- ✅ Shared package structure defined (@iiskills/ui, @iiskills/core, @iiskills/content-sdk, @iiskills/schema)
- ✅ Development standards established
- ✅ E2E testing framework with Playwright
- ✅ QA automation scripts (capture-qa-screenshots.sh)
- ✅ Comprehensive documentation (MONOREPO_ARCHITECTURE.md, COMPONENT_MIGRATION_PLAN.md, etc.)

---

## Component Migration Status ✅ COMPLETE

### Summary
All 38 shared components successfully migrated from `/components/shared/` to `@iiskills/ui`.

### Breakdown by Category

#### 1. Common Components ✅ (5 components)
- [x] Header.js
- [x] Footer.js
- [x] Layout.js
- [x] GoogleTranslate.js
- [x] Shared404.js

#### 2. Authentication Components ✅ (4 components)
- [x] UniversalLogin.js
- [x] UniversalRegister.js
- [x] EnhancedUniversalRegister.js
- [x] AuthenticationChecker.js

#### 3. Navigation Components ✅ (6 components)
- [x] SharedNavbar.js
- [x] SubdomainNavbar.js
- [x] AppSwitcher.js
- [x] SiteHeader.js
- [x] UniversalHeader.js
- [x] canonicalNavLinks.js

#### 4. Landing Page Components ✅ (7 components)
- [x] UniversalLandingPage.js
- [x] PaidAppLandingPage.js
- [x] SharedHero.js
- [x] HeroManager.js
- [x] SampleLessonShowcase.js
- [x] imageManifest.js
- [x] imageManifest.template.json

#### 5. Payment Components ✅ (3 components)
- [x] PremiumAccessPrompt.js
- [x] AIDevBundlePitch.js
- [x] TierSelection.js

#### 6. Content Components ✅ (6 components)
- [x] StandardizedLesson.js
- [x] CurriculumTable.js
- [x] LevelSelector.js
- [x] DiagnosticQuiz.js
- [x] GatekeeperQuiz.js
- [x] CalibrationGatekeeper.js

#### 7. Newsletter Components ✅ (2 components)
- [x] NewsletterSignup.js
- [x] NewsletterNavLink.js

#### 8. Translation Components ✅ (2 components)
- [x] TranslationDisclaimer.js
- [x] TranslationFeatureBanner.js

#### 9. AI Components ✅ (2 components)
- [x] AIAssistant.js
- [x] AIContentFallback.js

#### 10. PWA Components ✅ (1 component)
- [x] InstallApp.js

**Total**: 38/38 components migrated (100%)

---

## Package Structure

```
packages/ui/
├── package.json
├── README.md
├── CHANGELOG.md (updated with v1.1.0 migration notes)
├── src/
│   ├── index.js                    # Main exports - all categories
│   │
│   ├── authentication/             # Auth components
│   │   ├── UniversalLogin.js       ✅
│   │   ├── UniversalRegister.js    ✅
│   │   ├── EnhancedUniversalRegister.js ✅
│   │   ├── AuthenticationChecker.js ✅
│   │   └── index.js
│   │
│   ├── navigation/                 # Navigation components
│   │   ├── SharedNavbar.js         ✅
│   │   ├── SubdomainNavbar.js      ✅
│   │   ├── AppSwitcher.js          ✅
│   │   ├── SiteHeader.js           ✅
│   │   ├── UniversalHeader.js      ✅
│   │   ├── canonicalNavLinks.js    ✅
│   │   └── index.js
│   │
│   ├── landing/                    # Landing page components
│   │   ├── UniversalLandingPage.js ✅
│   │   ├── PaidAppLandingPage.js   ✅
│   │   ├── SharedHero.js           ✅
│   │   ├── HeroManager.js          ✅
│   │   ├── SampleLessonShowcase.js ✅
│   │   ├── imageManifest.js        ✅
│   │   ├── imageManifest.template.json ✅
│   │   └── index.js
│   │
│   ├── payment/                    # Payment components
│   │   ├── PremiumAccessPrompt.js  ✅
│   │   ├── AIDevBundlePitch.js     ✅
│   │   ├── TierSelection.js        ✅
│   │   └── index.js
│   │
│   ├── content/                    # Content components
│   │   ├── StandardizedLesson.js   ✅
│   │   ├── CurriculumTable.js      ✅
│   │   ├── LevelSelector.js        ✅
│   │   ├── DiagnosticQuiz.js       ✅
│   │   ├── GatekeeperQuiz.js       ✅
│   │   ├── CalibrationGatekeeper.js ✅
│   │   └── index.js
│   │
│   ├── common/                     # Common components
│   │   ├── Header.js               ✅
│   │   ├── Footer.js               ✅
│   │   ├── Layout.js               ✅
│   │   ├── GoogleTranslate.js      ✅
│   │   ├── Shared404.js            ✅
│   │   └── index.js
│   │
│   ├── newsletter/                 # Newsletter components
│   │   ├── NewsletterSignup.js     ✅
│   │   ├── NewsletterNavLink.js    ✅
│   │   └── index.js
│   │
│   ├── translation/                # Translation components
│   │   ├── TranslationDisclaimer.js ✅
│   │   ├── TranslationFeatureBanner.js ✅
│   │   └── index.js
│   │
│   ├── ai/                         # AI components
│   │   ├── AIAssistant.js          ✅
│   │   ├── AIContentFallback.js    ✅
│   │   └── index.js
│   │
│   ├── pwa/                        # PWA components
│   │   ├── InstallApp.js           ✅
│   │   └── index.js
│   │
│   └── global.css                  # Global styles
```

---

## Import Path Changes

### Before (Old Way - Deprecated)
```javascript
import UniversalLogin from '@/components/shared/UniversalLogin';
import SharedNavbar from '@/components/shared/SharedNavbar';
import UniversalLandingPage from '@/components/shared/UniversalLandingPage';
```

### After (New Way - Current)
```javascript
// Option 1: Named imports from main package
import { UniversalLogin, SharedNavbar, UniversalLandingPage } from '@iiskills/ui';

// Option 2: Category imports (recommended for clarity)
import { UniversalLogin } from '@iiskills/ui/authentication';
import { SharedNavbar } from '@iiskills/ui/navigation';
import { UniversalLandingPage } from '@iiskills/ui/landing';

// Option 3: Direct imports (best for tree-shaking)
import UniversalLogin from '@iiskills/ui/authentication/UniversalLogin';
```

---

## Next Steps: Pilot Apps

### Pilot App 1: learn-apt (FREE App)
**Rationale**: Simple, FREE app with no payment/OTP complexity. Perfect for initial migration.

#### Current Structure
- Port: 3002
- Type: FREE (NEXT_PUBLIC_DISABLE_AUTH=true)
- Features: Landing page, quiz functionality, content access
- Complexity: LOW

#### Migration Plan
- [ ] Audit all component imports in learn-apt
- [ ] Replace all `@/components/shared/` imports with `@iiskills/ui` imports
- [ ] Test landing page
- [ ] Test navigation
- [ ] Test quiz functionality
- [ ] Test content access
- [ ] Run E2E tests
- [ ] Capture QA screenshots
- [ ] Document any gaps or issues

### Pilot App 2: learn-ai (PAID App)
**Rationale**: PAID app with full functionality including payment, OTP, and admin.

#### Current Structure
- Port: 3024
- Type: PAID (payment required)
- Features: Landing, registration, login, payment, OTP, premium content, admin panel
- Complexity: HIGH

#### Migration Plan
- [ ] Audit all component imports in learn-ai
- [ ] Replace all `@/components/shared/` imports with `@iiskills/ui` imports
- [ ] Test landing page
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test payment flow (Razorpay integration)
- [ ] Test OTP generation and validation
- [ ] Test premium content access
- [ ] Test admin panel
- [ ] Test bundle functionality (AI + Developer 2-for-1)
- [ ] Run E2E tests
- [ ] Capture QA screenshots
- [ ] Document any gaps or issues

---

## Universal Workflow Validation

### Critical Flows to Test

#### 1. Landing Page Flow
- [ ] Hero section displays correctly
- [ ] Badge colors correct (FREE=green, PAID=blue)
- [ ] Navigation links work
- [ ] App switcher functional
- [ ] Sample lesson showcase (if applicable)
- [ ] CTA buttons functional

#### 2. Registration Flow (PAID apps only)
- [ ] All demographic fields present
- [ ] Captcha checkbox ("I'm not a robot")
- [ ] Google OAuth button
- [ ] User status display
- [ ] Welcome email sent on success
- [ ] Redirect to login or dashboard

#### 3. Login Flow (PAID apps only)
- [ ] Email/password login
- [ ] Google OAuth login
- [ ] Forgot password link
- [ ] Remember me checkbox
- [ ] Redirect to previous page or dashboard

#### 4. Payment Flow (PAID apps only)
- [ ] Payment prompt displays
- [ ] Razorpay checkout opens
- [ ] Test payment succeeds
- [ ] Access granted to user
- [ ] Confirmation email sent
- [ ] Bundle logic works (if applicable)

#### 5. OTP Flow (PAID apps only)
- [ ] Admin can generate OTP
- [ ] OTP codes displayed with expiry
- [ ] User can enter OTP
- [ ] OTP validation works
- [ ] Access granted on valid OTP
- [ ] OTP email sent (if configured)

#### 6. Content Access Flow
- [ ] Public content accessible without auth
- [ ] Premium content gated for non-paying users
- [ ] Premium content accessible after payment/OTP
- [ ] Navigation between modules works
- [ ] Quiz/test functionality works

#### 7. Admin Flow (PAID apps only)
- [ ] Admin authentication works
- [ ] OTP generation interface
- [ ] User management interface
- [ ] Content management interface
- [ ] Analytics dashboard
- [ ] No cross-app data leaks

---

## Testing Strategy

### Component-Level Testing
- [ ] Verify all components import successfully
- [ ] Test each component with typical props
- [ ] Verify styling is preserved
- [ ] Test responsive behavior
- [ ] Test accessibility

### Integration Testing
- [ ] Test Supabase integration
- [ ] Test Razorpay integration
- [ ] Test Google OAuth
- [ ] Test email sending
- [ ] Test content discovery

### E2E Testing
- [ ] Run existing E2E test suite
- [ ] Add new tests for pilot apps
- [ ] Test all critical user flows
- [ ] Test across browsers (Chrome, Firefox, Safari)
- [ ] Test across devices (Desktop, Tablet, Mobile)

### Performance Testing
- [ ] Measure page load times
- [ ] Measure bundle sizes
- [ ] Verify no performance regressions
- [ ] Optimize if necessary

---

## Rollout Plan: All Apps

After pilot apps are validated, roll out to remaining 8 apps in order of complexity:

### Phase 1: Simple FREE Apps (Week 1)
1. [ ] **learn-apt** (Pilot, already done)
2. [ ] **learn-geography** - FREE, similar to learn-apt
3. [ ] **learn-pr** - FREE, similar to learn-apt

### Phase 2: Simple PAID Apps (Week 2)
4. [ ] **learn-math** - PAID, standard payment flow
5. [ ] **learn-physics** - PAID, standard payment flow
6. [ ] **learn-chemistry** - PAID, standard payment flow

### Phase 3: Complex PAID Apps (Week 3)
7. [ ] **learn-ai** (Pilot, already done)
8. [ ] **learn-developer** - PAID, bundle with learn-ai
9. [ ] **learn-management** - PAID, advanced features

### Phase 4: Main Portal (Week 4)
10. [ ] **main** - Main portal, all apps aggregation

---

## Rollout Process (Per App)

### Step 1: Preparation
```bash
# Create feature branch
git checkout -b migrate-app-[app-name]

# Audit current imports
grep -r "from '@/components/shared" apps/[app-name]/
```

### Step 2: Update Imports
```bash
# Find and replace imports (can be automated with script)
# Old: import Component from '@/components/shared/Component'
# New: import { Component } from '@iiskills/ui/category'
```

### Step 3: Test Locally
```bash
# Start app in dev mode
cd apps/[app-name]
yarn dev

# Manual testing of all pages
# - Landing page
# - Registration (if PAID)
# - Login (if PAID)
# - Dashboard
# - Content pages
# - Admin panel (if PAID)
```

### Step 4: Run Tests
```bash
# Run E2E tests
yarn test:e2e

# Capture QA screenshots
./capture-qa-screenshots.sh
```

### Step 5: Build Verification
```bash
# Build the app
cd apps/[app-name]
yarn build

# Verify no build errors
# Check bundle size (should be similar or smaller)
```

### Step 6: Document & Commit
```bash
# Document any issues found
# Update app-specific documentation
# Commit changes
git add .
git commit -m "Migrate [app-name] to @iiskills/ui components"
```

### Step 7: Code Review & Merge
- Create PR with screenshots
- Request code review
- Address feedback
- Merge to main branch

---

## Known Issues & Gaps

### Issue Tracking
Issues discovered during pilot app migration will be documented here.

*To be updated as pilot apps are migrated*

---

## Success Criteria

### Technical Criteria
- ✅ All 38 components migrated to @iiskills/ui
- [ ] Both pilot apps (learn-apt, learn-ai) successfully migrated
- [ ] All E2E tests passing for pilot apps
- [ ] No console errors or warnings
- [ ] Bundle size maintained or reduced
- [ ] Build times maintained or improved
- [ ] All 10 apps migrated and tested
- [ ] Zero imports from /components/shared/ (except deprecated archive)

### Functional Criteria
- [ ] All landing pages display correctly
- [ ] All registration flows work (PAID apps)
- [ ] All login flows work (PAID apps)
- [ ] All payment flows work (PAID apps)
- [ ] All OTP flows work (PAID apps)
- [ ] All content access works correctly
- [ ] All admin panels work correctly
- [ ] No cross-app data leaks
- [ ] Badge colors correct (FREE=green, PAID=blue)

### Quality Criteria
- [ ] Visual consistency across all apps
- [ ] Responsive design working on all devices
- [ ] Accessibility standards met
- [ ] Performance metrics maintained
- [ ] Code review approval for all migrations
- [ ] Documentation complete and up-to-date

---

## Documentation Updates

### Required Documentation
- [x] **PHASE_2_IMPLEMENTATION.md** (this document)
- [ ] **Component Migration Guide** for developers
- [ ] **Universal Workflow Guide** for QA
- [ ] Update **MONOREPO_ARCHITECTURE.md** with import patterns
- [ ] Update **DEPLOYMENT_POLICY.md** with new testing requirements
- [ ] Create **APP_MIGRATION_CHECKLIST.md** template

---

## Timeline

### Week 1: Component Migration & Pilot App 1
- [x] Day 1: Migrate all components to @iiskills/ui
- [ ] Day 2-3: Migrate learn-apt (FREE pilot)
- [ ] Day 4-5: Test and validate learn-apt

### Week 2: Pilot App 2 & Initial Rollout
- [ ] Day 1-3: Migrate learn-ai (PAID pilot)
- [ ] Day 4-5: Test and validate learn-ai
- [ ] Day 5: Begin rollout to simple FREE apps

### Week 3: Continue Rollout
- [ ] Day 1-3: Migrate simple PAID apps (math, physics, chemistry)
- [ ] Day 4-5: Migrate complex PAID apps (developer, management)

### Week 4: Main Portal & Final QA
- [ ] Day 1-2: Migrate main portal
- [ ] Day 3-4: Final comprehensive QA
- [ ] Day 5: Documentation and sign-off

**Total Duration**: 4 weeks  
**Completion Target**: 2026-03-18

---

## Team Responsibilities

### Lead Developer
- Overall architecture and migration strategy
- Code review for all migrations
- Resolve complex technical issues
- Final QA sign-off

### Developer 2
- Component migration execution
- Pilot app migrations
- App rollout execution
- E2E test updates

### QA Engineer
- Manual testing of all flows
- E2E test execution
- Screenshot QA
- Bug reporting and verification

---

## Contact & Support

**Migration Lead**: TBD  
**Code Reviews**: All migrations require review  
**Issues**: Document in this file or create GitHub issue  
**Questions**: Team chat or stand-up meetings

---

## Version History

| Version | Date | Status | Progress |
|---------|------|--------|----------|
| 1.0.0 | 2026-02-18 | In Progress | Components migrated (38/38), Apps migrated (0/10) |

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-02-18  
**Next Review**: Daily during rollout
