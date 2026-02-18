# iiskills.cloud Monorepo Architecture

**Version**: 2.0.0  
**Last Updated**: 2026-02-18  
**Status**: ACTIVE - Comprehensive Rebuild  
**Maintained By**: Development Team

---

## Executive Summary

This document defines the complete architecture for the iiskills.cloud monorepo, establishing clear boundaries, shared infrastructure, and best practices for all applications. This architecture supports 10 applications (1 main portal + 9 learning apps) with consistent UX, maintainability, and scalability.

---

## Table of Contents

1. [Monorepo Structure](#monorepo-structure)
2. [Application Registry](#application-registry)
3. [Shared Packages](#shared-packages)
4. [App Architecture](#app-architecture)
5. [Data Flow](#data-flow)
6. [Authentication & Authorization](#authentication--authorization)
7. [Payment & Access Control](#payment--access-control)
8. [Build & Deployment](#build--deployment)
9. [Testing Strategy](#testing-strategy)
10. [Best Practices](#best-practices)

---

## Monorepo Structure

### Overview

The monorepo uses **Turborepo** for build orchestration and **Yarn Workspaces** for dependency management.

```
iiskills-cloud/
├── apps/                      # All applications
│   ├── main/                  # Main portal (iiskills.cloud)
│   ├── learn-ai/              # AI Learning App (PAID)
│   ├── learn-apt/             # Aptitude Learning App (FREE)
│   ├── learn-chemistry/       # Chemistry Learning App (FREE)
│   ├── learn-developer/       # Developer Learning App (PAID)
│   ├── learn-geography/       # Geography Learning App (FREE)
│   ├── learn-management/      # Management Learning App (PAID)
│   ├── learn-math/            # Math Learning App (FREE)
│   ├── learn-physics/         # Physics Learning App (FREE)
│   └── learn-pr/              # PR Learning App (PAID)
│
├── packages/                  # Shared packages
│   ├── ui/                    # Shared UI components (@iiskills/ui)
│   ├── core/                  # Core business logic (@iiskills/core)
│   ├── content-sdk/           # Content management SDK
│   └── schema/                # Database schemas and types
│
├── components/                # Legacy shared components (migrating to packages/ui)
│   └── shared/                # 38 shared components
│
├── lib/                       # Shared utilities and services
│   ├── appRegistry.js         # Application registry and metadata
│   ├── supabaseClient.js      # Database client
│   ├── otpService.js          # OTP generation and validation
│   ├── razorpay.js            # Payment integration
│   └── email-sender.js        # Email notification service
│
├── tests/                     # Test suites
│   ├── e2e/                   # End-to-end tests (Playwright)
│   └── unit/                  # Unit tests (Jest)
│
├── scripts/                   # Build and deployment scripts
├── nginx-configs/             # NGINX reverse proxy configs
├── docs/                      # Documentation
└── turbo.json                 # Turborepo configuration
```

### Workspace Configuration

**package.json (root)**:
```json
{
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

**turbo.json**:
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## Application Registry

### Active Applications

| App ID | Name | Port | Type | Status | Bundle |
|--------|------|------|------|--------|--------|
| `main` | iiskills.cloud | 3000 | Portal | Production | - |
| `learn-ai` | Learn AI | 3024 | PAID | Production | w/ Learn Developer |
| `learn-apt` | Learn Aptitude | 3002 | FREE | Production | - |
| `learn-chemistry` | Learn Chemistry | 3005 | FREE | Production | - |
| `learn-developer` | Learn Developer | 3007 | PAID | Production | w/ Learn AI |
| `learn-geography` | Learn Geography | 3011 | FREE | Production | - |
| `learn-management` | Learn Management | 3016 | PAID | Production | - |
| `learn-math` | Learn Math | 3017 | FREE | Production | - |
| `learn-physics` | Learn Physics | 3020 | FREE | Production | - |
| `learn-pr` | Learn PR | 3021 | PAID | Production | - |

### Course Categorization

**FREE Courses (5)**:
- Learn Aptitude
- Learn Chemistry
- Learn Geography
- Learn Math
- Learn Physics

**Badge Color**: Green (`bg-green-500`)

**PAID Courses (4)**:
- Learn AI (₹99 + GST, bundled with Developer)
- Learn Developer (₹99 + GST, bundled with AI)
- Learn Management (₹99 + GST)
- Learn PR (₹99 + GST)

**Badge Color**: Blue (`bg-blue-600`)

### Deprecated Applications

The following apps have been archived to `apps-backup/` and are no longer active:
- learn-govt-jobs
- learn-finesse
- learn-biology
- learn-cricket
- learn-companion
- learn-jee
- learn-neet
- learn-ias
- learn-leadership
- learn-winning
- mpa

**Important**: These apps must NOT be referenced in active code, deployment scripts, or configurations.

---

## Shared Packages

### 1. @iiskills/ui

**Purpose**: Universal UI component library for consistent UX across all apps.

**Location**: `/packages/ui/`

**Key Components**:
- `Header` - Universal header with app switcher
- `Footer` - Consistent footer across all apps
- `Layout` - Standard page layout wrapper
- `GoogleTranslate` - Multi-language support widget

**Usage**:
```javascript
import { Header, Footer, Layout } from '@iiskills/ui';

export default function Page() {
  return (
    <Layout>
      <Header />
      <main>{/* page content */}</main>
      <Footer />
    </Layout>
  );
}
```

**Migration Status**: Currently migrating components from `/components/shared/` to this package.

### 2. @iiskills/core

**Purpose**: Core business logic, utilities, and hooks shared across all apps.

**Location**: `/packages/core/`

**Modules**:
- Authentication utilities
- Payment processing logic
- OTP generation/validation
- Access control
- Session management

**Documentation**: See `/packages/core/README.md`

### 3. @iiskills/content-sdk

**Purpose**: Content management and discovery SDK.

**Location**: `/packages/content-sdk/`

**Features**:
- Course content aggregation
- Lesson data management
- Quiz/test generation
- Content validation

### 4. @iiskills/schema

**Purpose**: Database schemas, TypeScript types, and data validation.

**Location**: `/packages/schema/`

**Contents**:
- Supabase table schemas
- TypeScript type definitions
- Zod validation schemas
- Database migration scripts

---

## App Architecture

### Standard App Structure

Every app must follow this standardized structure:

```
apps/[app-name]/
├── pages/                     # Next.js pages
│   ├── index.js               # Landing page (UniversalLandingPage or PaidAppLandingPage)
│   ├── curriculum.js          # Course syllabus page
│   ├── login.js               # Login page (UniversalLogin)
│   ├── register.js            # Registration page (EnhancedUniversalRegister)
│   ├── payment.js             # Payment page (PAID apps only)
│   ├── dashboard.js           # User dashboard
│   ├── admin/                 # Admin interface
│   │   └── index.js           # Admin dashboard
│   └── api/                   # API routes
│       ├── payment/           # Payment endpoints
│       ├── users/             # User management
│       └── send-otp.js        # OTP generation
│
├── components/                # App-specific components ONLY
│   ├── LessonCard.js          # Custom lesson UI (if needed)
│   ├── QuizComponent.js       # Quiz interface
│   └── ModuleCard.js          # Module display
│
├── lib/                       # App-specific utilities ONLY
│   ├── supabaseClient.js      # App-specific Supabase client
│   └── accessCode.js          # App-specific access logic
│
├── data/                      # Static course content
│   ├── modules.json           # Course modules
│   ├── lessons.json           # Lesson data
│   └── tests.json             # Quiz/test data
│
├── public/                    # Static assets
│   ├── hero.jpg               # Hero image
│   └── favicon.ico            # App favicon
│
├── styles/                    # App-specific styles
│   └── globals.css            # Global CSS
│
├── .env.local.example         # Environment template
├── next.config.js             # Next.js configuration
├── package.json               # App dependencies
├── tailwind.config.js         # Tailwind configuration
└── README.md                  # App documentation
```

### Required Pages

Every app MUST implement these pages:

1. **Landing Page** (`/`)
   - Use `UniversalLandingPage` (FREE) or `PaidAppLandingPage` (PAID)
   - Display course overview, benefits, and CTA
   - Show FREE (green) or PAID (blue) badge

2. **Curriculum Page** (`/curriculum`)
   - Display complete course syllabus
   - Use `CurriculumTable` component
   - Show module/lesson breakdown

3. **Login Page** (`/login`)
   - Use `UniversalLogin` component
   - Terminology: "Login" (not "Sign in")
   - Include Google OAuth option

4. **Registration Page** (`/register`)
   - Use `EnhancedUniversalRegister` component
   - All demographic fields required
   - Captcha checkbox
   - Welcome email on success

5. **Payment Page** (`/payment`) [PAID apps only]
   - Razorpay integration
   - OTP code entry option
   - Clear pricing display

6. **Admin Dashboard** (`/admin`)
   - User management
   - OTP/code generation
   - Course content management

### Component Usage Rules

**DO:**
- ✅ Import shared components from `/components/shared/` or `@iiskills/ui`
- ✅ Use `UniversalLandingPage` or `PaidAppLandingPage` for landing pages
- ✅ Use `SharedNavbar` or `SubdomainNavbar` for navigation
- ✅ Use `EnhancedUniversalRegister` for registration forms
- ✅ Use `UniversalLogin` for login pages
- ✅ Inherit styles and colors from shared components

**DON'T:**
- ❌ Create local copies of shared components
- ❌ Duplicate navbar, footer, or layout logic
- ❌ Use custom authentication flows
- ❌ Implement custom payment logic
- ❌ Create app-specific hero sections (use SharedHero)

---

## Data Flow

### Application Initialization

```
User visits app → 
  App loads appRegistry.js → 
    Identifies app by hostname/port → 
      Loads app-specific configuration → 
        Renders shared components with app context
```

### Authentication Flow

```
User clicks "Login" → 
  UniversalLogin component → 
    Supabase authentication → 
      Session stored → 
        User redirected to dashboard → 
          Access checked for premium content
```

### Payment Flow (PAID apps)

```
User clicks "Enroll" → 
  Payment page loads → 
    Option 1: Razorpay payment (₹99 + GST) → 
      Payment confirmed → 
        Access granted
    Option 2: OTP code entry → 
      Code validated → 
        Access granted
```

### Content Access Flow

```
User requests lesson → 
  Access control checks:
    1. Is user authenticated?
    2. Is app FREE or PAID?
    3. If PAID, does user have access?
  → Grant or deny access → 
    Show content or payment prompt
```

---

## Authentication & Authorization

### Authentication Methods

1. **Email/Password** (Primary)
   - Standard registration with demographic fields
   - Email verification
   - Password reset flow

2. **Google OAuth** (Secondary)
   - Available on login/register pages
   - Recommendation: Use platform registration for certifications
   - Auto-creates user profile

### Access Control Levels

| Level | Description | Apps |
|-------|-------------|------|
| **Public** | No authentication required | All landing pages, curriculum pages |
| **Registered** | Authenticated user | FREE app content, user dashboard |
| **Premium** | Paid or OTP-verified user | PAID app content |
| **Admin** | Administrative access | Admin dashboards |

### Session Management

- Sessions stored in Supabase
- Automatic refresh on token expiry
- Cross-app session sharing (same domain)
- Logout invalidates session across all apps

---

## Payment & Access Control

### Razorpay Integration

**Configuration**:
```javascript
// lib/razorpay.js
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
```

**Payment Flow**:
1. User clicks "Enroll Now"
2. Payment modal opens with ₹99 + GST pricing
3. User completes payment via Razorpay
4. Backend verifies payment signature
5. Access granted, confirmation email sent

### OTP/Code System

**OTP Generation** (Admin):
```javascript
// lib/otpService.js
function generateOTP(appId, expiryDays = 365) {
  const code = crypto.randomBytes(8).toString('hex').toUpperCase();
  // Store in database with expiry
  return code;
}
```

**OTP Validation** (User):
```javascript
function validateOTP(code, appId, userId) {
  // Check code exists, not expired, not used
  // Grant access if valid
  // Mark code as used
}
```

### Bundle Logic (2-for-1)

**Learn AI + Learn Developer Bundle**:
- Purchase either app for ₹99 + GST
- Automatically grants access to both apps
- Implemented in payment confirmation handler
- Logic location: `/lib/otpService.js` (bundleAccess function)

```javascript
function grantBundleAccess(userId, appId) {
  if (appId === 'learn-ai' || appId === 'learn-developer') {
    // Grant access to both learn-ai AND learn-developer
    grantAccess(userId, 'learn-ai');
    grantAccess(userId, 'learn-developer');
  }
}
```

---

## Build & Deployment

### Build Process

**Development**:
```bash
yarn dev              # Start all apps in dev mode
yarn dev:main         # Start main app only
```

**Production Build**:
```bash
yarn build            # Build all apps (Turborepo)
yarn start            # Start all apps in production mode
```

### Deployment Strategy

**PM2 Process Manager**:
```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'main',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: './apps/main',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
    // ... other apps
  ],
};
```

**NGINX Reverse Proxy**:
- SSL/TLS termination (A+ rating)
- Subdomain routing (learn-ai.iiskills.cloud → :3024)
- Static asset caching
- Rate limiting

**Deployment Steps**:
1. Run tests: `yarn test && yarn test:e2e`
2. Validate config: `yarn validate-config`
3. Build apps: `yarn build`
4. Deploy to server
5. Restart PM2 processes
6. Verify health checks

---

## Testing Strategy

### E2E Testing (Playwright)

**Test Categories**:
1. **Navigation** - Navbar, app switcher, mobile menu
2. **Authentication** - Login, registration, logout
3. **Access Control** - FREE vs PAID content
4. **Payments** - Razorpay integration, OTP flow
5. **Badge Colors** - FREE=green, PAID=blue

**Commands**:
```bash
yarn test:e2e              # Run all E2E tests
yarn test:e2e:headed       # Run with visible browser
yarn test:e2e:debug        # Interactive debugging
yarn test:e2e:ui           # Playwright UI mode
```

**Test Files**:
- `tests/e2e/navigation/navbar.spec.js`
- `tests/e2e/auth/login.spec.js`
- `tests/e2e/access-control/badge-colors.spec.js`
- `tests/e2e/payments/razorpay.spec.js` (to be implemented)
- `tests/e2e/payments/otp.spec.js` (to be implemented)

### Unit Testing (Jest)

**Test Categories**:
1. **Utilities** - OTP service, email sender, session manager
2. **Components** - Shared components
3. **API Routes** - Payment handlers, user management

**Commands**:
```bash
yarn test              # Run all unit tests
yarn test:watch        # Watch mode
yarn test:coverage     # Coverage report
```

### Screenshot QA

**Automated Screenshot Capture**:
```bash
./capture-qa-screenshots.sh
```

**Captures**:
- Landing pages (desktop, tablet, mobile)
- Registration pages
- Login pages
- Payment flows
- Admin dashboards

**Evidence Storage**: `/qa-evidence/[timestamp]/`

---

## Best Practices

### Component Development

1. **Use Shared Components**
   - Always import from `/components/shared/` or `@iiskills/ui`
   - Don't create local copies

2. **Consistent Styling**
   - Use Tailwind utility classes
   - Follow color scheme (FREE=green, PAID=blue)
   - Use consistent spacing (p-4, p-6, p-8)

3. **Responsive Design**
   - Mobile-first approach
   - Test on desktop, tablet, mobile
   - Use responsive Tailwind classes

### Code Organization

1. **Keep App Code Minimal**
   - Only app-specific logic in `/apps/[app]/`
   - Shared logic in `/lib/` or `/packages/`

2. **Avoid Duplication**
   - DRY principle
   - Extract common patterns to shared components

3. **Clear Naming**
   - Use descriptive names
   - Follow conventions (camelCase for variables, PascalCase for components)

### Configuration Management

1. **Environment Variables**
   - Keep `.env.local.example` up to date
   - Never commit secrets
   - Use validation scripts

2. **PORT Assignments**
   - Must match across:
     - `ecosystem.config.js`
     - `.env.local.example`
     - NGINX configs

3. **Validation**
   - Run `yarn validate-config` before deployment
   - Check for deprecated app references

### Testing Requirements

1. **Test Before Deploy**
   - All tests must pass
   - Screenshot evidence for UI changes
   - Manual QA for critical flows

2. **Coverage Targets**
   - Authentication: 100%
   - Payments: 100%
   - Navigation: 90%
   - Components: 80%

3. **PR Requirements**
   - Tests added/updated for changes
   - E2E tests pass
   - Config validation passes
   - Code review approved

---

## Migration Path

### Current State → Target State

**Phase 1: Component Migration**
- Move `/components/shared/` → `/packages/ui/src/`
- Update all imports to use `@iiskills/ui`
- Version and document components

**Phase 2: Logic Centralization**
- Extract payment logic to `@iiskills/core`
- Extract OTP logic to `@iiskills/core`
- Extract access control to `@iiskills/core`

**Phase 3: App Standardization**
- Apply standard structure to all 10 apps
- Remove duplicate code
- Enforce component usage

**Phase 4: Testing & Documentation**
- Complete E2E test coverage
- Implement screenshot QA
- Update all documentation

---

## Related Documentation

- [Shared Components Library](SHARED_COMPONENTS_LIBRARY.md)
- [E2E Testing Framework](E2E_TESTING_FRAMEWORK.md)
- [Deployment Policy](DEPLOYMENT_POLICY.md)
- [QA Comprehensive Checklist](QA_COMPREHENSIVE_CHECKLIST.md)
- [Config Cleanliness Report](CONFIG_CLEANLINESS_REPORT.md)
- [SSL Infrastructure Audit](SSL_INFRASTRUCTURE_AUDIT.md)
- [Admin & Payment Systems Audit](ADMIN_PAYMENT_SYSTEMS_AUDIT.md)

---

## Appendix

### Quick Reference

**Active Apps**: 10 (main + 9 learn apps)  
**Monorepo Tool**: Turborepo  
**Package Manager**: Yarn 4.12.0  
**Testing**: Playwright (E2E) + Jest (Unit)  
**Deployment**: PM2 + NGINX  
**Database**: Supabase (PostgreSQL)  
**Payments**: Razorpay  
**Authentication**: Supabase Auth + Google OAuth

### Contact & Support

For questions about this architecture, consult:
- Architecture documentation (this file)
- Individual package README files
- Team knowledge base

---

**Document Version**: 2.0.0  
**Last Reviewed**: 2026-02-18  
**Next Review**: 2026-03-18
