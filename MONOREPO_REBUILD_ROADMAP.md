# iiskills.cloud Monorepo Rebuild Roadmap

**Version**: 1.0.0  
**Created**: 2026-02-18  
**Status**: IN PROGRESS  
**Priority**: CRITICAL

---

## Executive Summary

This roadmap outlines the systematic rebuild of the iiskills.cloud monorepo to achieve consistency, quality, and maintainability across all applications. Rather than patching existing issues, this is a comprehensive, modular rebuild based on best practices.

**Estimated Timeline**: 8-12 weeks  
**Team Size**: 2-3 developers + 1 QA engineer  
**Deployment Strategy**: Incremental, with thorough testing at each phase

---

## Guiding Principles

1. **No Partial Fixes** - Complete, systematic changes only
2. **Test First** - All changes validated with automated tests
3. **Document Everything** - Maintain living documentation
4. **Consistency Over Speed** - Quality and uniformity are paramount
5. **Incremental Deployment** - Deploy and validate each phase before proceeding

---

## Phase 1: Foundation & Architecture (Weeks 1-2)

### Objectives
- Formalize monorepo structure
- Document architecture
- Establish shared package boundaries
- Set up development standards

### Tasks

#### 1.1 Architecture Documentation ✅
- [x] Create MONOREPO_ARCHITECTURE.md (comprehensive)
- [x] Document application registry (10 active apps)
- [x] Define shared package structure
- [x] Document data flow and authentication
- [ ] Create architecture diagrams (flowcharts, dependency graphs)
- [ ] Review and approve with team

**Deliverable**: Complete architecture documentation

#### 1.2 Development Standards
- [ ] Define code style guide (ESLint + Prettier configs)
- [ ] Define component naming conventions
- [ ] Define file organization standards
- [ ] Create PR template with checklist
- [ ] Document git workflow (branching, commits)

**Deliverable**: Development standards document

#### 1.3 Tooling Setup
- [x] Verify Turborepo configuration
- [x] Verify Yarn workspaces
- [ ] Set up commit hooks (Husky)
- [ ] Configure automatic code formatting
- [ ] Set up CI/CD pipeline basics

**Deliverable**: Automated tooling configured

#### 1.4 Package Boundaries
- [ ] Define @iiskills/ui scope and exports
- [ ] Define @iiskills/core scope and exports
- [ ] Define @iiskills/content-sdk scope
- [ ] Define @iiskills/schema scope
- [ ] Create inter-package dependency rules

**Deliverable**: Clear package boundaries documented

**Success Criteria**:
- Architecture fully documented and approved
- Development standards in place
- Team trained on new standards
- All tooling configured and tested

---

## Phase 2: Shared Component Library Consolidation (Weeks 3-4)

### Objectives
- Migrate all shared components to @iiskills/ui package
- Version and document all components
- Remove duplicate components from apps
- Establish component development workflow

### Tasks

#### 2.1 Component Audit
- [ ] Inventory all 38 components in /components/shared/
- [ ] Identify duplicates in individual apps
- [ ] Categorize components (authentication, navigation, landing, etc.)
- [ ] Document component dependencies
- [ ] Identify components needing refactoring

**Deliverable**: Component audit report with migration plan

#### 2.2 Component Migration
- [ ] Set up @iiskills/ui package structure
  ```
  packages/ui/
  ├── src/
  │   ├── authentication/    # Login, Register components
  │   ├── navigation/        # Header, Footer, Navbar
  │   ├── landing/           # Landing page components
  │   ├── payment/           # Payment, OTP components
  │   ├── admin/             # Admin interface components
  │   ├── common/            # Buttons, modals, forms
  │   └── index.ts           # Main exports
  ├── package.json
  ├── tsconfig.json
  └── README.md
  ```
- [ ] Migrate authentication components
  - UniversalLogin.js
  - EnhancedUniversalRegister.js
  - AuthenticationChecker.js
- [ ] Migrate navigation components
  - SharedNavbar.js
  - SubdomainNavbar.js
  - AppSwitcher.js
  - SiteHeader.js
- [ ] Migrate landing page components
  - UniversalLandingPage.js
  - PaidAppLandingPage.js
  - SharedHero.js
  - HeroManager.js
- [ ] Migrate payment components
  - PremiumAccessPrompt.js
  - AIDevBundlePitch.js
  - TierSelection.js
- [ ] Migrate admin components
  - CalibrationGatekeeper.js
  - GatekeeperQuiz.js
- [ ] Migrate common components
  - NewsletterSignup.js
  - GoogleTranslate.js
  - TranslationDisclaimer.js
  - InstallApp.js
  - Shared404.js

**Deliverable**: All components migrated to @iiskills/ui

#### 2.3 Component Documentation
- [ ] Write JSDoc comments for all components
- [ ] Create usage examples for each component
- [ ] Document props and types
- [ ] Create Storybook stories (optional but recommended)
- [ ] Document breaking changes from old versions

**Deliverable**: Complete component documentation

#### 2.4 App Updates
- [ ] Update main app to import from @iiskills/ui
- [ ] Update learn-ai to import from @iiskills/ui
- [ ] Update learn-apt to import from @iiskills/ui
- [ ] Update learn-chemistry to import from @iiskills/ui
- [ ] Update learn-developer to import from @iiskills/ui
- [ ] Update learn-geography to import from @iiskills/ui
- [ ] Update learn-management to import from @iiskills/ui
- [ ] Update learn-math to import from @iiskills/ui
- [ ] Update learn-physics to import from @iiskills/ui
- [ ] Update learn-pr to import from @iiskills/ui
- [ ] Remove duplicate components from apps
- [ ] Test all apps after migration

**Deliverable**: All apps using @iiskills/ui

#### 2.5 Package Versioning
- [ ] Set initial version (1.0.0)
- [ ] Create CHANGELOG.md
- [ ] Document semantic versioning strategy
- [ ] Set up automatic version bumping

**Deliverable**: Versioned, published package

**Success Criteria**:
- All shared components in @iiskills/ui
- Zero duplicate components in apps
- All apps successfully import from package
- All apps build and run successfully
- Component documentation complete

---

## Phase 3: Core Business Logic Centralization (Weeks 5-6)

### Objectives
- Extract payment logic to @iiskills/core
- Extract OTP logic to @iiskills/core
- Extract access control to @iiskills/core
- Remove duplicate business logic from apps

### Tasks

#### 3.1 Payment Logic Centralization
- [ ] Audit payment implementations across all PAID apps
- [ ] Create @iiskills/core/payment module
  ```typescript
  // packages/core/src/payment/razorpay.ts
  export class RazorpayService {
    createOrder(amount, currency, appId)
    verifyPayment(signature, orderId, paymentId)
    grantAccess(userId, appId)
  }
  
  // packages/core/src/payment/bundle.ts
  export class BundleService {
    isBundle(appId)
    getBundleApps(appId)
    grantBundleAccess(userId, appId)
  }
  ```
- [ ] Migrate Razorpay integration to @iiskills/core
- [ ] Implement bundle logic (2-for-1) at core level
- [ ] Create payment webhook handlers
- [ ] Add payment confirmation emails
- [ ] Update all PAID apps to use @iiskills/core/payment

**Deliverable**: Centralized payment logic

#### 3.2 OTP Logic Centralization
- [ ] Audit OTP implementations across apps
- [ ] Create @iiskills/core/otp module
  ```typescript
  // packages/core/src/otp/service.ts
  export class OTPService {
    generateOTP(appId, expiryDays, adminId)
    validateOTP(code, userId, appId)
    sendOTPEmail(userId, code, appId)
    sendOTPSMS(userId, code, appId)
    listOTPs(appId, status)
    deactivateOTP(code)
  }
  ```
- [ ] Migrate OTP generation to @iiskills/core
- [ ] Implement OTP validation logic
- [ ] Create OTP email templates
- [ ] Create OTP SMS templates
- [ ] Add OTP audit logging
- [ ] Update all apps to use @iiskills/core/otp

**Deliverable**: Centralized OTP system

#### 3.3 Access Control Centralization
- [ ] Audit access control across all apps
- [ ] Create @iiskills/core/access module
  ```typescript
  // packages/core/src/access/control.ts
  export class AccessControl {
    checkAccess(userId, appId, contentType)
    grantAccess(userId, appId, method)
    revokeAccess(userId, appId)
    getUserAccess(userId)
    isContentPublic(appId, contentType)
  }
  ```
- [ ] Define access levels (Public, Registered, Premium, Admin)
- [ ] Implement access checking middleware
- [ ] Create access audit logging
- [ ] Update all apps to use @iiskills/core/access

**Deliverable**: Centralized access control

#### 3.4 Email/SMS Notification System
- [ ] Create @iiskills/core/notifications module
- [ ] Implement email templates
  - Welcome email
  - Payment confirmation
  - OTP delivery
  - Password reset
  - Certification issued
- [ ] Implement SMS templates
  - OTP delivery
  - Payment confirmation
- [ ] Add notification queue (optional: Bull/Redis)
- [ ] Add notification logging and tracking
- [ ] Update all apps to use centralized notifications

**Deliverable**: Centralized notification system

**Success Criteria**:
- Payment logic centralized and tested
- OTP system centralized and tested
- Access control centralized and tested
- Notifications centralized and tested
- All apps successfully use @iiskills/core
- No duplicate business logic in apps

---

## Phase 4: App Structure Standardization (Weeks 7-8)

### Objectives
- Define standard app structure
- Create app scaffold generator
- Apply standard structure to all apps
- Enforce component usage patterns

### Tasks

#### 4.1 Standard Structure Definition
- [ ] Document required pages (landing, curriculum, login, register, payment, admin)
- [ ] Document required components
- [ ] Document required API routes
- [ ] Define folder structure template
- [ ] Define naming conventions

**Deliverable**: Standard app structure document

#### 4.2 App Scaffold Generator
- [ ] Create CLI tool for generating new apps
  ```bash
  yarn create-app <app-name> --type=<free|paid>
  ```
- [ ] Generate standard folder structure
- [ ] Generate required pages with correct components
- [ ] Generate API routes
- [ ] Generate configuration files
- [ ] Generate README with setup instructions

**Deliverable**: App generator CLI tool

#### 4.3 App Standardization
- [ ] Apply standard structure to main
- [ ] Apply standard structure to learn-ai
- [ ] Apply standard structure to learn-apt
- [ ] Apply standard structure to learn-chemistry
- [ ] Apply standard structure to learn-developer
- [ ] Apply standard structure to learn-geography
- [ ] Apply standard structure to learn-management
- [ ] Apply standard structure to learn-math
- [ ] Apply standard structure to learn-physics
- [ ] Apply standard structure to learn-pr

**Deliverable**: All apps follow standard structure

#### 4.4 Visual Consistency Enforcement
- [ ] Audit badge colors (FREE=green, PAID=blue)
- [ ] Audit typography consistency
- [ ] Audit spacing and layout
- [ ] Audit button styles and placement
- [ ] Audit hero sections
- [ ] Fix any inconsistencies

**Deliverable**: Visually consistent apps

#### 4.5 Component Usage Validation
- [ ] Create linting rules for component imports
- [ ] Prevent importing from /components/shared (use @iiskills/ui)
- [ ] Prevent creating local copies of shared components
- [ ] Add automated checks to CI/CD

**Deliverable**: Automated component usage validation

**Success Criteria**:
- All apps follow identical structure
- App generator creates valid apps
- Visual consistency across all apps
- Component usage enforced automatically

---

## Phase 5: Testing & QA Infrastructure (Weeks 9-10)

### Objectives
- Complete E2E test coverage
- Implement screenshot-diff QA
- Add payment flow tests
- Add OTP flow tests
- Establish test-before-deploy policy

### Tasks

#### 5.1 E2E Test Expansion
- [x] Navigation tests (already done)
- [x] Authentication tests (already done)
- [x] Badge color tests (already done)
- [ ] Payment flow tests
  - Razorpay checkout
  - Payment success
  - Payment failure
  - Payment confirmation email
- [ ] OTP flow tests
  - OTP generation (admin)
  - OTP entry (user)
  - OTP validation
  - OTP expiry
- [ ] Registration flow tests
  - All fields present
  - Google OAuth
  - Welcome email
  - User status display
- [ ] Dashboard tests
  - User content access
  - Premium content gating
  - Navigation between modules
- [ ] Admin tests
  - OTP generation
  - User management
  - Content management

**Deliverable**: Complete E2E test suite

#### 5.2 Screenshot-Diff QA
- [ ] Set up Percy or similar screenshot-diff tool
- [ ] Define baseline screenshots for all pages
- [ ] Configure screenshot capture for:
  - Desktop (1920x1080)
  - Tablet (768x1024)
  - Mobile (375x667)
- [ ] Integrate screenshot-diff into CI/CD
- [ ] Establish approval workflow for visual changes

**Deliverable**: Automated screenshot-diff QA

#### 5.3 Unit Test Coverage
- [ ] Test payment logic (target: 100%)
- [ ] Test OTP logic (target: 100%)
- [ ] Test access control (target: 100%)
- [ ] Test shared components (target: 80%)
- [ ] Test utilities and helpers (target: 90%)

**Deliverable**: High unit test coverage

#### 5.4 Integration Tests
- [ ] Test Supabase integration
- [ ] Test Razorpay integration
- [ ] Test email sending
- [ ] Test SMS sending (if implemented)
- [ ] Test content discovery

**Deliverable**: Integration test suite

#### 5.5 Test Infrastructure
- [ ] Set up test database (Supabase)
- [ ] Create test user fixtures
- [ ] Create test data factories
- [ ] Set up test payment gateway (Razorpay test mode)
- [ ] Document test data setup

**Deliverable**: Complete test infrastructure

**Success Criteria**:
- E2E test coverage > 90%
- Unit test coverage > 80%
- Screenshot-diff QA operational
- All tests pass reliably
- Test infrastructure documented

---

## Phase 6: Data Migration & Content Structure (Week 11)

### Objectives
- Audit all course content
- Migrate to standardized structure
- Validate all navigation and menus
- Ensure no legacy references

### Tasks

#### 6.1 Content Audit
- [ ] Audit learn-ai content
- [ ] Audit learn-apt content
- [ ] Audit learn-chemistry content
- [ ] Audit learn-developer content
- [ ] Audit learn-geography content
- [ ] Audit learn-management content
- [ ] Audit learn-math content
- [ ] Audit learn-physics content
- [ ] Audit learn-pr content
- [ ] Identify content quality issues
- [ ] Identify missing content

**Deliverable**: Content audit report

#### 6.2 Content Structure Standardization
- [ ] Define standard content schema
- [ ] Define standard module structure
- [ ] Define standard lesson structure
- [ ] Define standard quiz/test structure
- [ ] Create content validation scripts

**Deliverable**: Standard content schema

#### 6.3 Content Migration
- [ ] Migrate learn-ai content to new structure
- [ ] Migrate learn-apt content to new structure
- [ ] Migrate learn-chemistry content to new structure
- [ ] Migrate learn-developer content to new structure
- [ ] Migrate learn-geography content to new structure
- [ ] Migrate learn-management content to new structure
- [ ] Migrate learn-math content to new structure
- [ ] Migrate learn-physics content to new structure
- [ ] Migrate learn-pr content to new structure

**Deliverable**: All content in standard structure

#### 6.4 Navigation Validation
- [ ] Validate course listings on main portal
- [ ] Validate app switcher links
- [ ] Validate curriculum navigation
- [ ] Validate lesson navigation
- [ ] Remove any legacy/deprecated references

**Deliverable**: Validated navigation across platform

**Success Criteria**:
- All content in standardized structure
- All navigation validated
- No legacy references
- Content validation scripts pass

---

## Phase 7: Admin & Access Control Enhancement (Week 12)

### Objectives
- Standardize admin interfaces
- Prevent cross-app content leaks
- Implement modular admin approach
- Add comprehensive admin features

### Tasks

#### 7.1 Admin Interface Standardization
- [ ] Define standard admin dashboard layout
- [ ] Create shared admin components
- [ ] Implement consistent admin navigation
- [ ] Add admin access control

**Deliverable**: Standard admin interface

#### 7.2 OTP Management Interface
- [ ] Admin OTP generation UI
- [ ] OTP list/search interface
- [ ] OTP activation/deactivation
- [ ] OTP usage analytics
- [ ] Bulk OTP generation

**Deliverable**: Complete OTP management system

#### 7.3 User Management Interface
- [ ] User list/search interface
- [ ] User access management
- [ ] User analytics and reporting
- [ ] Payment history view
- [ ] Access grant/revoke controls

**Deliverable**: Complete user management system

#### 7.4 Content Management Interface
- [ ] Module management UI
- [ ] Lesson management UI
- [ ] Quiz/test management UI
- [ ] Content preview
- [ ] Content publishing workflow

**Deliverable**: Complete content management system

#### 7.5 Analytics Dashboard
- [ ] User registration metrics
- [ ] Payment metrics
- [ ] OTP usage metrics
- [ ] Content engagement metrics
- [ ] User retention metrics

**Deliverable**: Admin analytics dashboard

**Success Criteria**:
- Consistent admin interface across all apps
- No cross-app data leaks
- Complete OTP management
- Complete user management
- Analytics operational

---

## Phase 8: Documentation & Deployment (Week 13)

### Objectives
- Update all documentation
- Create deployment workflows
- Establish maintenance procedures
- Prepare for client handoff

### Tasks

#### 8.1 Documentation Updates
- [x] MONOREPO_ARCHITECTURE.md (done)
- [ ] Update COMPREHENSIVE_CORRECTIONS_IMPLEMENTATION_SUMMARY.md
- [ ] Update SHARED_COMPONENTS_LIBRARY.md
- [ ] Update E2E_TESTING_FRAMEWORK.md
- [ ] Update DEPLOYMENT_POLICY.md
- [ ] Create API documentation
- [ ] Create admin user guide
- [ ] Create developer onboarding guide

**Deliverable**: Complete, up-to-date documentation

#### 8.2 Architecture Diagrams
- [ ] System architecture diagram
- [ ] Data flow diagrams
- [ ] Authentication flow diagram
- [ ] Payment flow diagram
- [ ] Component dependency graph

**Deliverable**: Visual architecture documentation

#### 8.3 Deployment Automation
- [ ] Automate SSL certificate renewal
- [ ] Automate health checks
- [ ] Automate downtime monitoring
- [ ] Create deployment runbooks
- [ ] Set up deployment notifications

**Deliverable**: Automated deployment workflows

#### 8.4 Maintenance Procedures
- [ ] Document backup procedures
- [ ] Document rollback procedures
- [ ] Document incident response
- [ ] Document scaling procedures
- [ ] Create maintenance calendar

**Deliverable**: Operations manual

**Success Criteria**:
- All documentation current
- Architecture diagrams complete
- Deployment fully automated
- Maintenance procedures documented

---

## Phase 9: Final QA & Staging Deployment (Week 14)

### Objectives
- Run comprehensive QA
- Deploy to staging
- Conduct client review
- Obtain signoff

### Tasks

#### 9.1 Comprehensive Testing
- [ ] Run full E2E test suite
- [ ] Run full unit test suite
- [ ] Run screenshot-diff QA
- [ ] Manual testing of all critical flows
- [ ] Cross-browser testing
- [ ] Cross-device testing
- [ ] Load testing
- [ ] Security testing

**Deliverable**: QA test results

#### 9.2 Staging Deployment
- [ ] Deploy all 10 apps to staging
- [ ] Configure staging environment
- [ ] Verify SSL certificates
- [ ] Verify DNS configuration
- [ ] Verify NGINX routing
- [ ] Verify PM2 processes
- [ ] Conduct smoke tests

**Deliverable**: Staging environment ready

#### 9.3 Client Review
- [ ] Prepare demo walkthrough
- [ ] Conduct client demo (all apps)
- [ ] Collect feedback
- [ ] Create feedback resolution plan
- [ ] Implement feedback
- [ ] Re-test after feedback

**Deliverable**: Client feedback addressed

#### 9.4 Production Preparation
- [ ] Final security audit
- [ ] Final performance audit
- [ ] Create production deployment plan
- [ ] Create rollback plan
- [ ] Schedule production deployment
- [ ] Prepare monitoring and alerts

**Deliverable**: Production deployment plan

#### 9.5 Client Signoff
- [ ] Present final QA results
- [ ] Present screenshot evidence
- [ ] Present test coverage reports
- [ ] Obtain written signoff
- [ ] Schedule production deployment

**Deliverable**: Client signoff obtained

**Success Criteria**:
- All tests pass
- Staging environment stable
- Client feedback addressed
- Client signoff obtained
- Production deployment planned

---

## Success Metrics

### Technical Metrics
- ✅ Zero duplicate components across apps
- ✅ 100% component reuse from @iiskills/ui
- ✅ E2E test coverage > 90%
- ✅ Unit test coverage > 80%
- ✅ Build time < 5 minutes (all apps)
- ✅ Zero configuration drift
- ✅ Zero deprecated app references
- ✅ SSL rating: A+

### Quality Metrics
- ✅ Consistent UI/UX across all apps
- ✅ Consistent badge colors (FREE=green, PAID=blue)
- ✅ Consistent terminology ("Login" not "Sign in")
- ✅ No broken links or 404s
- ✅ All payments functional
- ✅ All OTP flows functional
- ✅ All admin features functional

### Business Metrics
- ✅ Zero user-facing bugs
- ✅ Zero payment failures
- ✅ 100% uptime during deployment
- ✅ Client satisfaction: 5/5
- ✅ Team confidence: High

---

## Risk Management

### High Risk Items

#### Risk: Breaking Changes During Migration
**Mitigation**:
- Incremental deployment
- Comprehensive testing at each phase
- Rollback plan for each deployment
- Feature flags for risky changes

#### Risk: Content Data Loss
**Mitigation**:
- Database backups before migrations
- Content validation scripts
- Dry-run migrations in staging
- Manual QA of migrated content

#### Risk: Payment System Disruption
**Mitigation**:
- Test payment flows extensively
- Use Razorpay test mode
- Deploy payment changes with feature flags
- Monitor payment success rates

#### Risk: Timeline Slippage
**Mitigation**:
- Buffer time in each phase (20%)
- Weekly progress reviews
- Clear blockers quickly
- Adjust scope if needed

---

## Communication Plan

### Weekly Status Updates
- Progress on current phase
- Blockers and risks
- Next week's goals
- Demos of completed work

### Stakeholder Reviews
- Phase 2 review: Component library
- Phase 5 review: Testing infrastructure
- Phase 9 review: Final QA and signoff

### Documentation
- Update this roadmap weekly
- Maintain change log
- Document all decisions
- Share learnings with team

---

## Appendix

### Team Responsibilities

**Lead Developer**:
- Architecture decisions
- Code review
- Package development
- Deployment

**Developer 2**:
- Component migration
- App updates
- Testing implementation
- Documentation

**Developer 3** (optional):
- Content migration
- Admin interface
- API development
- Integration testing

**QA Engineer**:
- Test planning
- E2E test writing
- Manual testing
- Screenshot QA
- Bug reporting

### Tools & Technologies

- **Monorepo**: Turborepo
- **Package Manager**: Yarn 4.12.0
- **Framework**: Next.js 13+
- **UI**: React 18 + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + Google OAuth
- **Payments**: Razorpay
- **E2E Testing**: Playwright
- **Unit Testing**: Jest
- **Screenshot QA**: Percy or similar
- **CI/CD**: GitHub Actions
- **Deployment**: PM2 + NGINX
- **Monitoring**: Custom + external service

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-02-18  
**Next Review**: Weekly during execution
