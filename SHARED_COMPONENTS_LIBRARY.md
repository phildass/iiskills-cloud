# Shared Components Library Documentation

## Overview

This document provides comprehensive documentation for the centralized shared components library in the iiskills.cloud monorepo. All apps must import and inherit from this shared library to guarantee UI/UX consistency across every deployed application.

**Location**: `/components/shared/`

**Purpose**: Single source of truth for all universal UI and functional logic across the platform.

## Core Principle

> **Any update to shared components automatically propagates to every deployed app.**
> 
> This ensures platform-wide consistency and eliminates UI/UX drift between applications.

---

## Component Inventory

### Authentication Components

#### 1. **UniversalRegister.js** / **EnhancedUniversalRegister.js**
- **Purpose**: Universal registration form with Google OAuth integration
- **Used by**: All apps requiring user registration
- **Features**:
  - Email/password registration
  - Google OAuth integration
  - Form validation
  - App-specific redirects
  - Recommendation message for platform registration over Google login
- **Import Path**: `import UniversalRegister from '@/components/shared/UniversalRegister'`
- **Props**:
  - `appId` (string): Application identifier from appRegistry
  - `onSuccess` (function): Callback after successful registration
  - `redirectUrl` (string, optional): Override default redirect

#### 2. **UniversalLogin.js**
- **Purpose**: Universal login form with multi-app support
- **Used by**: All apps requiring authentication
- **Features**:
  - Email/password login
  - Google OAuth integration
  - "Forgot password" functionality
  - App-specific redirects
  - Consistent "Login" terminology (never "Sign in")
- **Import Path**: `import UniversalLogin from '@/components/shared/UniversalLogin'`
- **Props**:
  - `appId` (string): Application identifier
  - `onSuccess` (function): Callback after successful login
  - `redirectUrl` (string, optional): Override default redirect

#### 3. **AuthenticationChecker.js**
- **Purpose**: Verify user authentication state
- **Used by**: Protected pages and routes
- **Features**:
  - Session validation
  - Automatic redirect to login
  - Loading states
- **Import Path**: `import AuthenticationChecker from '@/components/shared/AuthenticationChecker'`

---

### Landing Page Components

#### 4. **UniversalLandingPage.js**
- **Purpose**: Standard landing page layout for free courses
- **Used by**: Free learning apps (learn-apt, learn-chemistry, learn-geography, learn-math, learn-physics)
- **Features**:
  - Hero section
  - Course syllabus display
  - Badge system (FREE = green, PAID = blue)
  - Call-to-action buttons
  - Responsive design
- **Import Path**: `import UniversalLandingPage from '@/components/shared/UniversalLandingPage'`
- **Props**:
  - `appId` (string): Application identifier
  - `courseData` (object): Course information
  - `heroImage` (string): Hero section image path

#### 5. **PaidAppLandingPage.js**
- **Purpose**: Landing page layout for paid courses
- **Used by**: Paid learning apps (learn-ai, learn-developer, learn-management, learn-pr)
- **Features**:
  - Hero section with pricing
  - Course benefits/features
  - Payment integration
  - Badge system (PAID = blue badge)
  - Bundle offerings
- **Import Path**: `import PaidAppLandingPage from '@/components/shared/PaidAppLandingPage'`
- **Props**:
  - `appId` (string): Application identifier
  - `courseData` (object): Course and pricing information
  - `bundleData` (object, optional): Bundle pricing information

#### 6. **SharedHero.js**
- **Purpose**: Reusable hero section component
- **Used by**: Landing pages across all apps
- **Features**:
  - Image display
  - Title and subtitle
  - CTA buttons
  - Responsive layout
- **Import Path**: `import SharedHero from '@/components/shared/SharedHero'`

#### 7. **HeroManager.js**
- **Purpose**: Centralized hero image management
- **Used by**: Landing pages requiring hero images
- **Features**:
  - App-specific hero image selection
  - Fallback images
  - Image optimization
- **Import Path**: `import { getHeroImage } from '@/components/shared/HeroManager'`

---

### Navigation Components

#### 8. **SharedNavbar.js**
- **Purpose**: Universal navigation bar for all apps
- **Used by**: All applications
- **Features**:
  - App switcher
  - Authentication status
  - Responsive mobile menu
  - Consistent styling
- **Import Path**: `import SharedNavbar from '@/components/shared/SharedNavbar'`
- **Props**:
  - `appId` (string): Current application identifier
  - `user` (object, optional): Current user data

#### 9. **SubdomainNavbar.js**
- **Purpose**: Subdomain-specific navigation
- **Used by**: Subdomain applications
- **Features**:
  - Breadcrumb navigation
  - App-specific links
  - Back navigation
- **Import Path**: `import SubdomainNavbar from '@/components/shared/SubdomainNavbar'`

#### 10. **canonicalNavLinks.js**
- **Purpose**: Centralized navigation link definitions
- **Used by**: All navigation components
- **Features**:
  - Canonical URL definitions
  - Link categorization
  - Active link highlighting
- **Import Path**: `import { navLinks } from '@/components/shared/canonicalNavLinks'`

---

### Access Control Components

#### 11. **CalibrationGatekeeper.js**
- **Purpose**: Skill calibration and access gating
- **Used by**: Learning apps with diagnostic quizzes
- **Features**:
  - Diagnostic quiz display
  - Skill level assessment
  - Access tier determination
  - Progress tracking
- **Import Path**: `import CalibrationGatekeeper from '@/components/shared/CalibrationGatekeeper'`

#### 12. **PremiumAccessPrompt.js**
- **Purpose**: Payment prompt for premium content
- **Used by**: Paid learning apps
- **Features**:
  - Pricing display
  - Payment integration
  - Bundle options
  - Trial offers
- **Import Path**: `import PremiumAccessPrompt from '@/components/shared/PremiumAccessPrompt'`

---

### Content Display Components

#### 13. **SampleLessonShowcase.js**
- **Purpose**: Display sample lessons to prospects
- **Used by**: Landing pages for paid courses
- **Features**:
  - Lesson preview
  - Content teaser
  - Engagement tracking
- **Import Path**: `import SampleLessonShowcase from '@/components/shared/SampleLessonShowcase'`

#### 14. **StandardizedLesson.js**
- **Purpose**: Consistent lesson display format
- **Used by**: All learning apps
- **Features**:
  - Content rendering
  - Progress tracking
  - Navigation controls
  - Quiz integration
- **Import Path**: `import StandardizedLesson from '@/components/shared/StandardizedLesson'`

#### 15. **CurriculumTable.js**
- **Purpose**: Display course curriculum/syllabus
- **Used by**: Landing pages and course overview pages
- **Features**:
  - Module listing
  - Lesson breakdown
  - Progress indicators
  - Expandable sections
- **Import Path**: `import CurriculumTable from '@/components/shared/CurriculumTable'`

---

### Quiz & Assessment Components

#### 16. **DiagnosticQuiz.js**
- **Purpose**: Initial skill assessment quiz
- **Used by**: Apps with calibration gatekeeping
- **Features**:
  - Question display
  - Answer validation
  - Score calculation
  - Results display
- **Import Path**: `import DiagnosticQuiz from '@/components/shared/DiagnosticQuiz'`

#### 17. **GatekeeperQuiz.js**
- **Purpose**: Quiz-based access control
- **Used by**: Apps requiring skill verification
- **Features**:
  - Timed quizzes
  - Pass/fail logic
  - Attempt tracking
- **Import Path**: `import GatekeeperQuiz from '@/components/shared/GatekeeperQuiz'`

---

### User Experience Components

#### 18. **AppSwitcher.js**
- **Purpose**: Switch between different iiskills apps
- **Used by**: Navigation bars across all apps
- **Features**:
  - App listing
  - Quick navigation
  - Visual app identification
- **Import Path**: `import AppSwitcher from '@/components/shared/AppSwitcher'`

#### 19. **LevelSelector.js**
- **Purpose**: Select learning level/difficulty
- **Used by**: Learning apps with tiered content
- **Features**:
  - Level display
  - Selection interface
  - Progress indication
- **Import Path**: `import LevelSelector from '@/components/shared/LevelSelector'`

#### 20. **TierSelection.js**
- **Purpose**: Select subscription tier
- **Used by**: Payment and upgrade pages
- **Features**:
  - Tier comparison
  - Pricing display
  - Feature lists
- **Import Path**: `import TierSelection from '@/components/shared/TierSelection'`

---

### Utility Components

#### 21. **AIAssistant.js**
- **Purpose**: AI-powered learning assistant
- **Used by**: Learning apps with AI support
- **Features**:
  - Chat interface
  - Context-aware responses
  - Learning recommendations
- **Import Path**: `import AIAssistant from '@/components/shared/AIAssistant'`

#### 22. **AIContentFallback.js**
- **Purpose**: Fallback for AI-generated content failures
- **Used by**: Apps using AI content generation
- **Features**:
  - Error handling
  - Alternative content display
  - Retry logic
- **Import Path**: `import AIContentFallback from '@/components/shared/AIContentFallback'`

#### 23. **NewsletterSignup.js**
- **Purpose**: Newsletter subscription form
- **Used by**: Landing pages and footers
- **Features**:
  - Email capture
  - Validation
  - Subscription confirmation
- **Import Path**: `import NewsletterSignup from '@/components/shared/NewsletterSignup'`

#### 24. **NewsletterNavLink.js**
- **Purpose**: Navigation link to newsletter
- **Used by**: Navigation components
- **Import Path**: `import NewsletterNavLink from '@/components/shared/NewsletterNavLink'`

#### 25. **GoogleTranslate.js**
- **Purpose**: Multi-language translation widget
- **Used by**: Apps with internationalization
- **Features**:
  - Language selection
  - Auto-detection
  - Translation API integration
- **Import Path**: `import GoogleTranslate from '@/components/shared/GoogleTranslate'`

#### 26. **TranslationDisclaimer.js**
- **Purpose**: Disclaimer for translated content
- **Used by**: Apps with translation features
- **Import Path**: `import TranslationDisclaimer from '@/components/shared/TranslationDisclaimer'`

#### 27. **TranslationFeatureBanner.js**
- **Purpose**: Promote translation features
- **Used by**: Landing pages of multilingual apps
- **Import Path**: `import TranslationFeatureBanner from '@/components/shared/TranslationFeatureBanner'`

#### 28. **InstallApp.js**
- **Purpose**: PWA installation prompt
- **Used by**: All apps with PWA support
- **Features**:
  - Install button
  - Platform detection
  - Install instructions
- **Import Path**: `import InstallApp from '@/components/shared/InstallApp'`

#### 29. **Shared404.js**
- **Purpose**: Consistent 404 error page
- **Used by**: All apps
- **Features**:
  - Error message
  - Navigation suggestions
  - Home link
- **Import Path**: `import Shared404 from '@/components/shared/Shared404'`

---

### Bundle & Pricing Components

#### 30. **AIDevBundlePitch.js**
- **Purpose**: Promote AI + Developer bundle
- **Used by**: learn-ai and learn-developer apps
- **Features**:
  - Bundle benefits
  - Pricing comparison
  - Purchase CTA
- **Import Path**: `import AIDevBundlePitch from '@/components/shared/AIDevBundlePitch'`

---

### Image Management

#### 31. **imageManifest.js**
- **Purpose**: Centralized image asset registry
- **Used by**: All components using images
- **Features**:
  - Asset paths
  - Image metadata
  - Lazy loading configuration
- **Import Path**: `import { images } from '@/components/shared/imageManifest'`

---

## Integration Guidelines

### 1. **Import Pattern**

All apps should use absolute imports from the shared components directory:

```javascript
// ✅ Correct - Absolute import from shared
import UniversalLogin from '@/components/shared/UniversalLogin';
import { getAppById } from '@/lib/appRegistry';

// ❌ Incorrect - Relative imports from shared directory
import UniversalLogin from '../../components/shared/UniversalLogin';
```

### 2. **Props Standardization**

Components accept standardized props based on the app registry:

```javascript
// Get app configuration
const appConfig = getAppById('learn-ai');

// Pass to shared component
<UniversalLandingPage 
  appId={appConfig.id}
  courseData={courseData}
  heroImage={getHeroImage(appConfig.id)}
/>
```

### 3. **Styling Consistency**

All shared components use Tailwind CSS classes. Apps should not override shared component styles unless absolutely necessary.

```javascript
// ✅ Correct - Use component as-is
<SharedNavbar appId="learn-ai" user={currentUser} />

// ❌ Incorrect - Overriding shared component styles
<SharedNavbar 
  appId="learn-ai" 
  user={currentUser}
  className="custom-nav-override"  // Don't do this
/>
```

### 4. **Version Control**

When updating shared components:

1. **Document the change** in this file
2. **Test across ALL apps** that use the component
3. **Update screenshots** for affected user flows
4. **Run full test suite** before deploying
5. **Deploy changes simultaneously** to all apps

### 5. **Component Addition Checklist**

When adding a new shared component:

- [ ] Create component in `/components/shared/`
- [ ] Add comprehensive JSDoc documentation
- [ ] Add PropTypes or TypeScript types
- [ ] Document in this file (SHARED_COMPONENTS_LIBRARY.md)
- [ ] Add unit tests if applicable
- [ ] Test integration in at least 2 apps
- [ ] Update component inventory above
- [ ] Add import examples

---

## Badge System Standards

### Color Coding

- **FREE courses**: Green badge (`bg-green-500`)
- **PAID courses**: Blue badge (`bg-blue-600`)

This standardization is enforced in:
- `UniversalLandingPage.js`
- `PaidAppLandingPage.js`
- Course listing pages

### Implementation

```javascript
// FREE course badge
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 text-white">
  FREE
</span>

// PAID course badge
<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
  PAID
</span>
```

---

## Authentication Terminology

**Standard**: Always use **"Login"** (never "Sign in" or "Sign-in")

This applies to:
- Button labels
- Page titles
- Navigation links
- User-facing messages

**Enforcement locations**:
- `UniversalLogin.js`
- `SharedNavbar.js`
- `canonicalNavLinks.js`

---

## Testing Requirements

### Component Testing

Every shared component should have:

1. **Unit tests** (if applicable)
2. **Integration tests** showing usage in apps
3. **Visual regression tests** (screenshots)
4. **Accessibility tests**

### Testing Before Deployment

Before deploying changes to shared components:

```bash
# 1. Run unit tests
yarn test

# 2. Build all apps to verify no breaking changes
yarn build

# 3. Run E2E tests (when implemented)
yarn test:e2e

# 4. Manual verification in at least 2 apps
yarn dev:main
yarn dev:learn-ai
```

---

## Future Enhancements

### Planned Additions

1. **Component Versioning System**
   - Track component versions
   - Manage breaking changes
   - Provide migration guides

2. **Component Playground**
   - Interactive documentation
   - Live component preview
   - Props playground

3. **Automated Testing**
   - Visual regression testing
   - Component contract testing
   - Cross-browser testing

4. **Performance Monitoring**
   - Component render times
   - Bundle size tracking
   - Lazy loading optimization

---

## Maintenance

### Component Deprecation Process

When deprecating a component:

1. Mark as `@deprecated` in JSDoc
2. Add deprecation notice in this document
3. Provide migration path to replacement
4. Set deprecation timeline (min 3 months)
5. Update all apps to use new component
6. Remove deprecated component after timeline

### Security Updates

Security-sensitive components:
- `UniversalLogin.js`
- `UniversalRegister.js`
- `AuthenticationChecker.js`
- `PremiumAccessPrompt.js`

These require:
- Security review for all changes
- Immediate deployment after security fixes
- Notification to all app maintainers

---

## Contact & Support

For questions about shared components:

1. Check this documentation first
2. Review component source code and JSDoc
3. Check existing app implementations for examples
4. Contact platform architecture team

---

**Last Updated**: 2026-02-18  
**Document Version**: 1.0.0  
**Maintained By**: Platform Architecture Team
