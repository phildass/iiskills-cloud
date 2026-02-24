# @iiskills/ui

**Version**: 1.0.0  
**Status**: Active Development - Component Migration In Progress

Shared UI component library for all iiskills.cloud applications. This package provides a centralized, versioned collection of React components ensuring consistent user experience across the entire platform.

---

## 📦 Installation

This package is part of the iiskills-cloud monorepo and is automatically available to all apps via Yarn workspaces.

```json
// In your app's package.json
{
  "dependencies": {
    "@iiskills/ui": "workspace:*"
  }
}
```

---

## 🚀 Quick Start

### Basic Usage

```javascript
// Import common components
import { Header, Footer, Layout } from '@iiskills/ui';

export default function Page() {
  return (
    <Layout>
      <Header />
      <main>Your content here</main>
      <Footer />
    </Layout>
  );
}
```

### Category-Specific Imports

```javascript
// Authentication components
import { UniversalLogin, EnhancedUniversalRegister } from '@iiskills/ui/authentication';

// Navigation components
import { SharedNavbar, AppSwitcher } from '@iiskills/ui/navigation';

// Landing page components
import { UniversalLandingPage, PaidAppLandingPage } from '@iiskills/ui/landing';
```

---

## 📚 Component Categories

### Common Components ✅
*Status: Migrated*

- **Header** - Universal header with branding
- **Footer** - Consistent footer across all apps
- **Layout** - Standard page layout wrapper
- **GoogleTranslate** - Multi-language support widget

```javascript
import { Header, Footer, Layout, GoogleTranslate } from '@iiskills/ui/common';
// or
import { Header, Footer } from '@iiskills/ui';
```

### Authentication Components 🔄
*Status: Migration Pending*

- **UniversalLogin** - Standardized login page
- **UniversalRegister** - Basic registration form
- **EnhancedUniversalRegister** - Full registration with captcha
- **AuthenticationChecker** - Auth state verification

```javascript
import { UniversalLogin, EnhancedUniversalRegister } from '@iiskills/ui/authentication';
```

### Navigation Components 🔄
*Status: Migration Pending*

- **SharedNavbar** - Main navigation bar
- **SubdomainNavbar** - App-specific navigation
- **AppSwitcher** - Switch between apps
- **SiteHeader** - Minimal header
- **UniversalHeader** - Full-featured header
- **canonicalNavLinks** - Navigation link utilities

```javascript
import { SharedNavbar, AppSwitcher } from '@iiskills/ui/navigation';
```

### Landing Page Components 🔄
*Status: Migration Pending*

- **UniversalLandingPage** - FREE app landing page
- **PaidAppLandingPage** - PAID app landing page
- **SharedHero** - Hero section component
- **HeroManager** - Hero image management
- **SampleLessonShowcase** - Sample content display
- **imageManifest** - Image asset management

```javascript
import { UniversalLandingPage, PaidAppLandingPage } from '@iiskills/ui/landing';
```

### Payment Components 🔄
*Status: Migration Pending*

- **PremiumAccessPrompt** - Payment/upgrade prompt
- **AIDevBundlePitch** - 2-for-1 bundle offer
- **TierSelection** - Pricing tier selector
- **CalibrationGatekeeper** - Quiz-based access control

```javascript
import { PremiumAccessPrompt, AIDevBundlePitch } from '@iiskills/ui/payment';
```

### Content Components 🔄
*Status: Migration Pending*

- **StandardizedLesson** - Lesson display component
- **CurriculumTable** - Course syllabus table
- **LevelSelector** - Difficulty level selector
- **DiagnosticQuiz** - Diagnostic quiz component
- **GatekeeperQuiz** - Access control quiz

```javascript
import { StandardizedLesson, CurriculumTable } from '@iiskills/ui/content';
```

### Newsletter Components 🔄
*Status: Migration Pending*

- **NewsletterSignup** - Newsletter subscription form
- **NewsletterNavLink** - Newsletter navigation link

```javascript
import { NewsletterSignup } from '@iiskills/ui/newsletter';
```

### Translation Components 🔄
*Status: Migration Pending*

- **TranslationDisclaimer** - Translation notice
- **TranslationFeatureBanner** - Translation feature promotion

```javascript
import { TranslationDisclaimer } from '@iiskills/ui/translation';
```

### AI Components 🔄
*Status: Migration Pending*

- **AIAssistant** - AI chat assistant
- **AIContentFallback** - AI-generated content fallback

```javascript
import { AIAssistant } from '@iiskills/ui/ai';
```

### PWA Components 🔄
*Status: Migration Pending*

- **InstallApp** - PWA installation prompt

```javascript
import { InstallApp } from '@iiskills/ui/pwa';
```

---

## 🎨 Component Guidelines

### Badge Colors

**CRITICAL**: Always use correct badge colors:
- **FREE apps**: Green (`bg-green-500`)
- **PAID apps**: Blue (`bg-blue-600`)

```javascript
// FREE app
<span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
  FREE
</span>

// PAID app
<span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
  PAID
</span>
```

### Terminology

**Login vs Sign in**: Always use "Login" in user-facing text.

```javascript
// ✅ Correct
<button>Login to Your Account</button>

// ❌ Incorrect
<button>Sign in to Your Account</button>
```

### Component Props

All components accept standard props:
- `appId` (string) - Application identifier from appRegistry
- `className` (string, optional) - Additional CSS classes
- `children` (ReactNode, optional) - Child components

```javascript
<UniversalLandingPage 
  appId="learn-ai"
  className="custom-class"
  courseData={...}
/>
```

---

## 🔧 Development

### Adding New Components

1. Create component in appropriate category directory
2. Add exports to category index.js
3. Document props and usage
4. Add tests
5. Update CHANGELOG.md

### Testing Components

```bash
# Run unit tests
yarn test

# Run E2E tests
yarn test:e2e
```

### Building

Components are used directly from source (not compiled). Ensure your app's build process handles JSX/ES6.

---

## 📖 Documentation

### Component-Level

Each component should have JSDoc comments:

```javascript
/**
 * UniversalLogin - Standardized login component
 * 
 * @param {Object} props
 * @param {string} props.appId - App identifier
 * @param {Function} props.onSuccess - Success callback
 * @param {string} [props.redirectUrl] - Redirect URL
 * @returns {JSX.Element}
 * 
 * @example
 * <UniversalLogin 
 *   appId="learn-ai"
 *   onSuccess={() => router.push('/dashboard')}
 * />
 */
```

### Package-Level

- **README.md** - This file
- **CHANGELOG.md** - Version history
- **COMPONENT_MIGRATION_PLAN.md** - Migration roadmap

---

## 🚨 Breaking Changes

### Version 1.0.0 → 1.x.x

When components are migrated, import paths will change:

**Before**:
```javascript
import UniversalLogin from '@/components/shared/UniversalLogin';
```

**After**:
```javascript
import { UniversalLogin } from '@iiskills/ui/authentication';
```

All apps will be updated systematically. See [COMPONENT_MIGRATION_PLAN.md](../../COMPONENT_MIGRATION_PLAN.md) for details.

---

## 📋 Migration Status

| Category | Components | Status | Target Date |
|----------|-----------|--------|-------------|
| Common | 4 | ✅ Complete | Done |
| Authentication | 4 | 🔄 Pending | Week 1 |
| Navigation | 6 | 🔄 Pending | Week 2 |
| Landing | 7 | 🔄 Pending | Week 3 |
| Payment | 4 | 🔄 Pending | Week 4 |
| Content | 5 | 🔄 Pending | Week 4 |
| Newsletter | 2 | 🔄 Pending | Week 5 |
| Translation | 2 | 🔄 Pending | Week 5 |
| AI | 2 | 🔄 Pending | Week 5 |
| PWA | 1 | 🔄 Pending | Week 5 |

**Total**: 37 components (4 migrated, 33 pending)

---

## 🤝 Contributing

1. Follow existing code style
2. Add JSDoc comments
3. Test components thoroughly
4. Update documentation
5. Get code review approval

---

## 📞 Support

- **Migration Issues**: See [COMPONENT_MIGRATION_PLAN.md](../../COMPONENT_MIGRATION_PLAN.md)
- **Usage Questions**: Check component JSDoc comments
- **Bug Reports**: Create an issue with reproduction steps

---

## 📄 License

MIT

---

**Maintained by**: iiskills.cloud Development Team  
**Last Updated**: 2026-02-18  
**Next Review**: Weekly during migration
