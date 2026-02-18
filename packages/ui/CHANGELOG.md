# Changelog

All notable changes to @iiskills/ui will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-18

### Added
- Initial package structure with proper exports
- Component category organization (authentication, navigation, landing, payment, content, common, newsletter, translation, ai, pwa)
- Migrated common components:
  - Header.js - Universal header component
  - Footer.js - Consistent footer component
  - Layout.js - Standard page layout wrapper
  - GoogleTranslate.js - Multi-language support widget
- Comprehensive package.json with proper exports configuration
- README.md with usage documentation
- CHANGELOG.md (this file)

### Changed
- Package version bumped from 0.0.0 to 1.0.0
- Reorganized src/ directory with category subdirectories
- Updated main index.js with proper exports and documentation

### Migration Status
- ✅ Common components (4/4 complete)
- 🔄 Authentication components (0/4 migrated)
- 🔄 Navigation components (0/6 migrated)
- 🔄 Landing page components (0/7 migrated)
- 🔄 Payment components (0/4 migrated)
- 🔄 Content components (0/5 migrated)
- 🔄 Newsletter components (0/2 migrated)
- 🔄 Translation components (0/2 migrated)
- 🔄 AI components (0/2 migrated)
- 🔄 PWA components (0/1 migrated)

**Total Progress**: 4/37 components (11%)

### Deprecated
- Direct imports from /components/shared/ (will be removed after migration)

### Documentation
- Created comprehensive README.md
- Added JSDoc comments to common components
- Documented import patterns and usage examples

---

## [Unreleased]

### Planned for 1.1.0
- Migrate authentication components (UniversalLogin, UniversalRegister, etc.)
- Add TypeScript type definitions
- Create Storybook stories for visual documentation
- Add component unit tests

### Planned for 1.2.0
- Migrate navigation components (SharedNavbar, AppSwitcher, etc.)
- Improve component documentation
- Add accessibility improvements

### Planned for 1.3.0
- Migrate landing page components (UniversalLandingPage, PaidAppLandingPage, etc.)
- Add responsive design improvements
- Create component usage examples

### Planned for 1.4.0
- Migrate payment and content components
- Complete migration of all remaining components
- Remove legacy /components/shared/ directory

---

## Version History

| Version | Date | Status | Components |
|---------|------|--------|------------|
| 1.0.0 | 2026-02-18 | Released | 4 (Common) |
| 0.0.0 | - | Deprecated | 3 (Initial) |

---

## Breaking Changes

### 1.0.0
**Import Path Changes** (gradual rollout):

Old way (deprecated):
```javascript
import UniversalLogin from '@/components/shared/UniversalLogin';
```

New way (after migration):
```javascript
import { UniversalLogin } from '@iiskills/ui/authentication';
```

All apps will be updated systematically during the component migration phase. No immediate action required.

---

## Migration Schedule

**Week 1**: Authentication components (4)  
**Week 2**: Navigation components (6)  
**Week 3**: Landing page components (7)  
**Week 4**: Payment & content components (9)  
**Week 5**: Newsletter, translation, AI, PWA components (7)

**Total Duration**: 5 weeks  
**Completion Target**: 2026-03-25

---

**Maintained by**: iiskills.cloud Development Team  
**Next Update**: Weekly during migration
