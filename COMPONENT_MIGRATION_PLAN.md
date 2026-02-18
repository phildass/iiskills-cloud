# Shared Component Library Migration Plan

**Version**: 1.0.0  
**Created**: 2026-02-18  
**Status**: IN PROGRESS  
**Target Package**: @iiskills/ui

---

## Overview

This document outlines the migration of 38 shared components from `/components/shared/` to the centralized `@iiskills/ui` package. This migration ensures:

1. **Single source of truth** for all UI components
2. **Versioned releases** with semantic versioning
3. **Consistent imports** across all apps
4. **Better maintainability** and documentation
5. **Type safety** with TypeScript (future enhancement)

---

## Current State

**Location**: `/components/shared/`  
**Total Components**: 38  
**Current Usage**: Direct imports from /components/shared/  
**Package Status**: Partial (/packages/ui exists with 5 components)

---

## Component Inventory

### Authentication Components (4)
| # | Component | Size | Dependencies | Priority |
|---|-----------|------|--------------|----------|
| 1 | UniversalLogin.js | 12.3 KB | Supabase, Next Router | HIGH |
| 2 | UniversalRegister.js | 32.8 KB | Supabase, Next Router | HIGH |
| 3 | EnhancedUniversalRegister.js | 28.2 KB | Supabase, Next Router, reCAPTCHA | HIGH |
| 4 | AuthenticationChecker.js | 2.1 KB | Supabase | HIGH |

**Migration Order**: 1 (Critical for all apps)

### Navigation Components (6)
| # | Component | Size | Dependencies | Priority |
|---|-----------|------|--------------|----------|
| 5 | SharedNavbar.js | 8.5 KB | Next Router, appRegistry | HIGH |
| 6 | SubdomainNavbar.js | 3.3 KB | Next Router, appRegistry | HIGH |
| 7 | AppSwitcher.js | 5.3 KB | Next Router, appRegistry | MEDIUM |
| 8 | SiteHeader.js | 1.0 KB | None | MEDIUM |
| 9 | UniversalHeader.js | 3.5 KB | Next Router | MEDIUM |
| 10 | canonicalNavLinks.js | 2.6 KB | appRegistry | MEDIUM |

**Migration Order**: 2 (Required for navigation consistency)

### Landing Page Components (7)
| # | Component | Size | Dependencies | Priority |
|---|-----------|------|--------------|----------|
| 11 | UniversalLandingPage.js | 18.7 KB | SharedHero, SharedNavbar | HIGH |
| 12 | PaidAppLandingPage.js | 12.3 KB | SharedHero, PremiumAccessPrompt | HIGH |
| 13 | SharedHero.js | 6.0 KB | HeroManager, imageManifest | HIGH |
| 14 | HeroManager.js | 8.2 KB | imageManifest | MEDIUM |
| 15 | SampleLessonShowcase.js | 13.7 KB | StandardizedLesson | MEDIUM |
| 16 | imageManifest.js | 2.8 KB | None | LOW |
| 17 | imageManifest.template.json | 3.0 KB | None | LOW |

**Migration Order**: 3 (Core UX components)

### Payment & Access Components (4)
| # | Component | Size | Dependencies | Priority |
|---|-----------|------|--------------|----------|
| 18 | PremiumAccessPrompt.js | 7.5 KB | Next Router | HIGH |
| 19 | AIDevBundlePitch.js | 4.8 KB | Next Router | MEDIUM |
| 20 | TierSelection.js | 5.4 KB | None | MEDIUM |
| 21 | CalibrationGatekeeper.js | 13.1 KB | Supabase, DiagnosticQuiz | LOW |

**Migration Order**: 4 (Payment flows)

### Content Components (5)
| # | Component | Size | Dependencies | Priority |
|---|-----------|------|--------------|----------|
| 22 | StandardizedLesson.js | 13.2 KB | Supabase | MEDIUM |
| 23 | CurriculumTable.js | 9.6 KB | None | MEDIUM |
| 24 | LevelSelector.js | 9.7 KB | None | LOW |
| 25 | DiagnosticQuiz.js | 7.9 KB | Supabase | LOW |
| 26 | GatekeeperQuiz.js | 8.0 KB | Supabase | LOW |

**Migration Order**: 5 (Content display)

### Common/Utility Components (6)
| # | Component | Size | Dependencies | Priority |
|---|-----------|------|--------------|----------|
| 27 | NewsletterSignup.js | 7.8 KB | Supabase, reCAPTCHA | LOW |
| 28 | NewsletterNavLink.js | 0.6 KB | Next Link | LOW |
| 29 | GoogleTranslate.js | 5.1 KB | Google Translate API | LOW |
| 30 | TranslationDisclaimer.js | 2.0 KB | None | LOW |
| 31 | TranslationFeatureBanner.js | 4.0 KB | None | LOW |
| 32 | InstallApp.js | 2.6 KB | Next Head | LOW |

**Migration Order**: 6 (Utility features)

### AI & Special Features (3)
| # | Component | Size | Dependencies | Priority |
|---|-----------|------|--------------|----------|
| 33 | AIAssistant.js | 16.2 KB | Supabase, OpenAI | LOW |
| 34 | AIContentFallback.js | 14.9 KB | Supabase, OpenAI | LOW |
| 35 | Shared404.js | 4.9 KB | Next Router | MEDIUM |

**Migration Order**: 7 (Special features)

### Already Migrated (3) ✅
| # | Component | Location | Status |
|---|-----------|----------|--------|
| 36 | Header.js | packages/ui/src/ | ✅ Migrated |
| 37 | Footer.js | packages/ui/src/ | ✅ Migrated |
| 38 | Layout.js | packages/ui/src/ | ✅ Migrated |

---

## Migration Strategy

### Phase 1: Package Structure Setup
- [x] Create packages/ui directory
- [ ] Update package.json with proper configuration
- [ ] Create proper folder structure
- [ ] Set up TypeScript (optional, recommended for future)
- [ ] Create index.ts/js with exports
- [ ] Create README.md with usage documentation

### Phase 2: Authentication Components (Week 1)
Priority: HIGH - These are critical for all apps

**Components**:
1. UniversalLogin.js
2. UniversalRegister.js
3. EnhancedUniversalRegister.js
4. AuthenticationChecker.js

**Steps**:
1. Move components to `packages/ui/src/authentication/`
2. Update internal imports
3. Test components in isolation
4. Update exports in index.js
5. Create usage documentation
6. Update one app as proof of concept (learn-ai)
7. Verify functionality
8. Update remaining apps

### Phase 3: Navigation Components (Week 2)
Priority: HIGH - Required for consistent navigation

**Components**:
1. SharedNavbar.js
2. SubdomainNavbar.js
3. AppSwitcher.js
4. SiteHeader.js
5. UniversalHeader.js
6. canonicalNavLinks.js

**Steps**:
Same as Phase 2, move to `packages/ui/src/navigation/`

### Phase 4: Landing Page Components (Week 3)
Priority: HIGH - Core UX components

**Components**:
1. UniversalLandingPage.js
2. PaidAppLandingPage.js
3. SharedHero.js
4. HeroManager.js
5. SampleLessonShowcase.js
6. imageManifest.js
7. imageManifest.template.json

**Steps**:
Same as Phase 2, move to `packages/ui/src/landing/`

### Phase 5: Payment & Content Components (Week 4)
Priority: MEDIUM

**Components**:
- Payment: PremiumAccessPrompt, AIDevBundlePitch, TierSelection
- Content: StandardizedLesson, CurriculumTable, etc.

**Steps**:
- Move to `packages/ui/src/payment/` and `packages/ui/src/content/`

### Phase 6: Utility & Special Components (Week 5)
Priority: LOW - Can be done last

**Components**:
- Newsletter, Translation, AI components

**Steps**:
- Move to appropriate subdirectories

---

## Target Package Structure

```
packages/ui/
├── package.json
├── README.md
├── CHANGELOG.md
├── tsconfig.json (future)
├── src/
│   ├── index.js                    # Main exports
│   │
│   ├── authentication/             # Auth components
│   │   ├── UniversalLogin.js
│   │   ├── UniversalRegister.js
│   │   ├── EnhancedUniversalRegister.js
│   │   ├── AuthenticationChecker.js
│   │   └── index.js
│   │
│   ├── navigation/                 # Navigation components
│   │   ├── SharedNavbar.js
│   │   ├── SubdomainNavbar.js
│   │   ├── AppSwitcher.js
│   │   ├── SiteHeader.js
│   │   ├── UniversalHeader.js
│   │   ├── canonicalNavLinks.js
│   │   └── index.js
│   │
│   ├── landing/                    # Landing page components
│   │   ├── UniversalLandingPage.js
│   │   ├── PaidAppLandingPage.js
│   │   ├── SharedHero.js
│   │   ├── HeroManager.js
│   │   ├── SampleLessonShowcase.js
│   │   ├── imageManifest.js
│   │   └── index.js
│   │
│   ├── payment/                    # Payment & access components
│   │   ├── PremiumAccessPrompt.js
│   │   ├── AIDevBundlePitch.js
│   │   ├── TierSelection.js
│   │   └── index.js
│   │
│   ├── content/                    # Content display components
│   │   ├── StandardizedLesson.js
│   │   ├── CurriculumTable.js
│   │   ├── LevelSelector.js
│   │   ├── DiagnosticQuiz.js
│   │   ├── GatekeeperQuiz.js
│   │   ├── CalibrationGatekeeper.js
│   │   └── index.js
│   │
│   ├── common/                     # Common components
│   │   ├── Header.js ✅
│   │   ├── Footer.js ✅
│   │   ├── Layout.js ✅
│   │   ├── GoogleTranslate.js
│   │   ├── Shared404.js
│   │   └── index.js
│   │
│   ├── newsletter/                 # Newsletter components
│   │   ├── NewsletterSignup.js
│   │   ├── NewsletterNavLink.js
│   │   └── index.js
│   │
│   ├── translation/                # Translation components
│   │   ├── TranslationDisclaimer.js
│   │   ├── TranslationFeatureBanner.js
│   │   └── index.js
│   │
│   ├── ai/                         # AI-powered components
│   │   ├── AIAssistant.js
│   │   ├── AIContentFallback.js
│   │   └── index.js
│   │
│   ├── pwa/                        # PWA components
│   │   ├── InstallApp.js
│   │   └── index.js
│   │
│   └── global.css                  # Global styles
```

---

## Import Path Changes

### Before (Current)
```javascript
import UniversalLogin from '@/components/shared/UniversalLogin';
import SharedNavbar from '@/components/shared/SharedNavbar';
import UniversalLandingPage from '@/components/shared/UniversalLandingPage';
```

### After (Target)
```javascript
// Option 1: Named imports from main package
import { UniversalLogin, SharedNavbar, UniversalLandingPage } from '@iiskills/ui';

// Option 2: Category imports (recommended for tree-shaking)
import { UniversalLogin } from '@iiskills/ui/authentication';
import { SharedNavbar } from '@iiskills/ui/navigation';
import { UniversalLandingPage } from '@iiskills/ui/landing';

// Option 3: Direct imports (best for tree-shaking)
import UniversalLogin from '@iiskills/ui/authentication/UniversalLogin';
```

---

## App Update Process

For each app (10 total):

1. **Update jsconfig.json** (if needed)
```json
{
  "compilerOptions": {
    "paths": {
      "@iiskills/ui": ["../../packages/ui/src"],
      "@iiskills/ui/*": ["../../packages/ui/src/*"]
    }
  }
}
```

2. **Update package.json dependencies**
```json
{
  "dependencies": {
    "@iiskills/ui": "workspace:*"
  }
}
```

3. **Find and replace imports**
```bash
# Find all imports
grep -r "from '@/components/shared" apps/[app-name]/

# Replace with new imports
# (Can be automated with a script)
```

4. **Test the app**
```bash
cd apps/[app-name]
yarn dev
# Manual testing of all affected pages
```

5. **Run E2E tests**
```bash
yarn test:e2e
```

---

## Testing Strategy

### Component-Level Testing
- [ ] Test each component in isolation
- [ ] Verify props interface hasn't changed
- [ ] Test with different prop combinations
- [ ] Verify styling is preserved

### Integration Testing
- [ ] Test component interactions
- [ ] Verify Supabase integration
- [ ] Verify Next.js router integration
- [ ] Test with real data

### App-Level Testing
- [ ] Manual testing of all pages
- [ ] E2E test suite
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing

---

## Risk Mitigation

### High-Risk Components
Components with complex dependencies or state:
1. EnhancedUniversalRegister (28 KB, Supabase + reCAPTCHA)
2. UniversalRegister (33 KB, Supabase)
3. AIAssistant (16 KB, OpenAI integration)
4. StandardizedLesson (13 KB, Supabase)

**Mitigation**:
- Migrate these last in their category
- Extra testing with real data
- Staged rollout (one app at a time)
- Keep rollback plan ready

### Breaking Changes
Potential breaking changes:
1. Import paths change
2. Props interface changes (unlikely but possible)
3. CSS class names change (if we refactor)
4. Dependencies version mismatches

**Mitigation**:
- Document all prop interfaces before migration
- Use same dependency versions
- Don't refactor during migration (only move)
- Comprehensive testing

---

## Rollback Plan

If issues are discovered:

1. **Immediate Rollback** (< 5 minutes)
   - Revert the specific app's imports
   - Deploy previous version

2. **Component Rollback** (< 15 minutes)
   - Keep old components in /components/shared until migration complete
   - Apps can temporarily use old imports
   - Fix issues in @iiskills/ui
   - Re-migrate when ready

3. **Full Rollback** (last resort)
   - Revert entire migration
   - Keep components in /components/shared
   - Plan better migration strategy

---

## Documentation Requirements

For each component migrated:

1. **JSDoc Comments**
```javascript
/**
 * UniversalLogin - Standardized login component for all apps
 * 
 * @param {Object} props
 * @param {string} props.appId - Application identifier from appRegistry
 * @param {Function} props.onSuccess - Callback after successful login
 * @param {string} [props.redirectUrl] - Optional redirect URL override
 * @returns {JSX.Element}
 * 
 * @example
 * <UniversalLogin 
 *   appId="learn-ai"
 *   onSuccess={() => router.push('/dashboard')}
 * />
 */
```

2. **README Section**
Add to `packages/ui/README.md`:
- Component purpose
- Props interface
- Usage example
- Dependencies
- Common issues

3. **CHANGELOG Entry**
Document in `packages/ui/CHANGELOG.md`:
- Version number
- Date
- What was added/changed
- Migration notes

---

## Success Metrics

### Technical Metrics
- ✅ 0 duplicate components across apps
- ✅ 100% component migration complete
- ✅ All 10 apps use @iiskills/ui
- ✅ 0 imports from /components/shared
- ✅ All tests passing
- ✅ Build successful for all apps

### Quality Metrics
- ✅ Component documentation complete
- ✅ Usage examples for all components
- ✅ CHANGELOG up to date
- ✅ No regression bugs
- ✅ Performance maintained

### Timeline Metrics
- ✅ Phase 1 complete in 1 week
- ✅ Phase 2 complete in 2 weeks
- ✅ Full migration in 5 weeks
- ✅ Zero downtime during migration

---

## Next Actions

### Immediate (This Week)
1. Set up proper package structure in packages/ui
2. Create comprehensive exports in index.js
3. Migrate authentication components
4. Test with one app (learn-ai)
5. Document the process

### Short Term (Next 2 Weeks)
1. Migrate navigation components
2. Migrate landing page components
3. Update 5 apps to use new imports
4. Comprehensive testing

### Long Term (Weeks 4-5)
1. Complete remaining components
2. Update all 10 apps
3. Remove old /components/shared (archive)
4. Final QA and documentation

---

## Contact & Support

**Migration Lead**: TBD  
**Code Reviews**: All component migrations require code review  
**Questions**: Create issue or discuss in team chat  
**Documentation**: Update this file as migration progresses

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-02-18  
**Next Review**: Weekly during migration
