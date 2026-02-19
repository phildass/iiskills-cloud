# App Clustering & Modularization Guide

**Date**: February 19, 2026  
**Version**: 1.0  
**Purpose**: Strategic guide for app clustering, code sharing, and modular architecture

## 🎯 Overview

This document defines the clustering strategy for organizing the 10 apps in the iiskills-cloud monorepo to maximize code reuse, consistency, and maintainability.

## 📊 Current App Inventory

### Total Apps: 10 (11 including main portal)

| App ID | Port | Type | Cluster | Bundle |
|--------|------|------|---------|--------|
| main | 3000 | Portal | - | - |
| learn-apt | 3002 | FREE | Singleton | - |
| learn-chemistry | 3005 | FREE | Science | - |
| learn-geography | 3011 | FREE | Science | - |
| learn-math | 3017 | FREE | Science | - |
| learn-physics | 3020 | FREE | Science | - |
| learn-ai | 3024 | PAID | AI/Tech | AI-Developer |
| learn-developer | 3007 | PAID | AI/Tech | AI-Developer |
| learn-management | 3016 | PAID | Business | - |
| learn-pr | 3021 | PAID | Business | - |

## 🏗️ Cluster Definitions

### 1. Science Cluster (4 apps) 🔬

**Apps**: `learn-physics`, `learn-math`, `learn-chemistry`, `learn-geography`

**Common Characteristics**:
- ✅ All FREE apps (no payment logic needed)
- ✅ Similar content structure (modules → topics → subtopics)
- ✅ Consistent UI patterns
- ✅ Educational content format
- ✅ Progress tracking system
- ✅ Certificate generation

**Shared Components**:
```javascript
// Already shared via @iiskills/ui
import { LevelSelector } from '@iiskills/ui/content';
import { ModuleCard } from '@iiskills/ui/content';
import { ProgressTracker } from '@iiskills/ui/content';
import { CertificateGenerator } from '@iiskills/ui/content';
```

**Shared Data Structure**:
```javascript
// packages/content-sdk/src/structures/science.ts
interface ScienceContent {
  modules: Module[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  certification: boolean;
}

interface Module {
  id: string;
  title: string;
  topics: Topic[];
  prerequisites?: string[];
}
```

**Shared Configuration**:
```javascript
// packages/core/src/config/science-apps.ts
export const scienceAppConfig = {
  contentType: 'educational',
  accessType: 'free',
  progressTracking: true,
  certificateEnabled: true,
  quizEnabled: true,
  moduleStructure: 'hierarchical'
};
```

**Code Sharing Opportunity**: **85%**

### 2. AI/Tech Cluster (2 apps) 🤖

**Apps**: `learn-ai`, `learn-developer`

**Common Characteristics**:
- ✅ PAID apps (₹99 + GST each)
- ✅ Bundle logic (AI-Developer bundle)
- ✅ Premium content
- ✅ Interactive coding/AI features
- ✅ Project-based learning
- ✅ Advanced progress tracking

**Bundle Implementation**:
```javascript
// Fully implemented in packages/access-control/
import { grantBundleAccess } from '@iiskills/access-control';

// Auto-grants access to both apps
await grantBundleAccess({
  userId,
  purchasedAppId: 'learn-ai',  // or 'learn-developer'
  paymentId
});
```

**Shared Payment Logic**:
```javascript
// packages/access-control/dbAccessManager.js
export async function grantBundleAccess({ userId, purchasedAppId, paymentId }) {
  const bundleConfig = getBundleInfo(purchasedAppId);
  
  // Create access for purchased app
  await createUserAppAccess({
    userId,
    appId: purchasedAppId,
    grantedVia: 'payment',
    paymentId
  });
  
  // Create access for bundled app(s)
  if (bundleConfig?.bundledApps) {
    for (const bundledAppId of bundleConfig.bundledApps) {
      await createUserAppAccess({
        userId,
        appId: bundledAppId,
        grantedVia: 'bundle',
        paymentId
      });
    }
  }
  
  return { bundledApps: bundleConfig?.bundledApps || [] };
}
```

**Shared Features**:
- Payment confirmation endpoints
- Access verification
- Bundle unlock notifications
- Premium content gating
- Subscription management (future)

**Code Sharing Opportunity**: **75%**

### 3. Business Cluster (2 apps) 💼

**Apps**: `learn-management`, `learn-pr`

**Common Characteristics**:
- ✅ PAID apps
- ✅ Professional development focus
- ✅ Business/corporate content
- ✅ Case study format
- ✅ Practical exercises
- ✅ Certificate of completion

**Shared Components**:
```javascript
// Potential shared components
import { CaseStudyViewer } from '@iiskills/ui/business';
import { ProfessionalCertificate } from '@iiskills/ui/business';
import { CareerPathway } from '@iiskills/ui/business';
```

**Shared Configuration**:
```javascript
// packages/core/src/config/business-apps.ts
export const businessAppConfig = {
  contentType: 'professional',
  accessType: 'paid',
  caseStudies: true,
  practicalExercises: true,
  certificateEnabled: true,
  careerPathway: true
};
```

**Code Sharing Opportunity**: **70%**

### 4. Singleton - Aptitude App (1 app) 🎯

**App**: `learn-apt`

**Unique Characteristics**:
- ✅ FREE app
- ✅ Quiz-based learning (vs content-based)
- ✅ Timed assessments
- ✅ Score tracking & leaderboards
- ✅ Different UI patterns
- ✅ Real-time scoring

**Why Singleton?**
- Different learning model (quiz vs modules)
- Unique UI requirements (timer, scoring)
- Distinct data structure (questions vs lessons)
- Specialized features (leaderboards)

**Code Sharing**: Limited to common components only (Navbar, Footer, Layout)

**Code Sharing Opportunity**: **30%**

## 🔄 Shared Scaffolding Strategy

### Base App Template

All apps should use a consistent base structure:

```
apps/[app-name]/
├── pages/
│   ├── _app.js                 # App wrapper (common)
│   ├── _document.js            # HTML document (common)
│   ├── index.js                # Landing page (cluster-specific)
│   ├── dashboard.js            # User dashboard (cluster-specific)
│   └── api/
│       ├── payment/            # Payment endpoints (shared logic)
│       └── access/             # Access control (shared logic)
├── lib/
│   ├── constants.js            # App-specific constants
│   └── utils.js                # Utility functions
├── app.config.js               # App configuration
├── next.config.js              # Next.js config (common base)
├── package.json                # Dependencies
└── README.md                   # App documentation
```

### Shared Code Locations

```
packages/
├── ui/                         # UI components (all clusters)
│   ├── common/                # Universal components
│   ├── landing/               # Landing page components
│   ├── content/               # Content display components
│   ├── payment/               # Payment components (paid apps)
│   └── [cluster]/             # Cluster-specific components
│
├── access-control/            # Access control (all apps)
│   ├── accessControl.js       # Core logic
│   ├── appConfig.js           # App definitions
│   ├── dbAccessManager.js     # Database operations
│   └── paymentGuard.js        # Payment guards
│
├── core/                      # Core utilities (TypeScript)
│   ├── config/                # App configurations
│   ├── utils/                 # Utility functions
│   └── types/                 # TypeScript types
│
├── content-sdk/               # Content management (TypeScript)
│   ├── structures/            # Content structures
│   ├── loaders/               # Content loaders
│   └── validators/            # Content validators
│
└── schema/                    # Database schemas (TypeScript)
    ├── tables/                # Table definitions
    └── migrations/            # Migration helpers
```

## 🎨 Cluster-Specific Scaffolds

### Science Cluster Scaffold

```javascript
// packages/ui/src/clusters/science/

export { ScienceLayout } from './ScienceLayout';
export { ModuleNavigator } from './ModuleNavigator';
export { TopicViewer } from './TopicViewer';
export { QuizComponent } from './QuizComponent';
export { ProgressDashboard } from './ProgressDashboard';
export { CertificateViewer } from './CertificateViewer';

// Configuration
export const scienceDefaults = {
  moduleStructure: 'hierarchical',
  quizEnabled: true,
  certificateEnabled: true,
  progressTracking: true
};
```

### AI/Tech Cluster Scaffold

```javascript
// packages/ui/src/clusters/tech/

export { TechLayout } from './TechLayout';
export { CodeEditor } from './CodeEditor';
export { ProjectViewer } from './ProjectViewer';
export { AIInteraction } from './AIInteraction';
export { BundleStatus } from './BundleStatus';

// Configuration
export const techDefaults = {
  accessType: 'paid',
  bundleEnabled: true,
  codingEnabled: true,
  projectBased: true
};
```

### Business Cluster Scaffold

```javascript
// packages/ui/src/clusters/business/

export { BusinessLayout } from './BusinessLayout';
export { CaseStudyViewer } from './CaseStudyViewer';
export { ExerciseComponent } from './ExerciseComponent';
export { CareerPathway } from './CareerPathway';

// Configuration
export const businessDefaults = {
  accessType: 'paid',
  caseStudies: true,
  exercises: true,
  careerPathway: true
};
```

## 🔧 Refactoring Workflow

### Step 1: Identify Common Patterns

For each cluster, identify:
1. Common UI components
2. Shared data structures
3. Duplicate business logic
4. Similar API endpoints

### Step 2: Extract to Packages

Move shared code to appropriate packages:
```bash
# UI components
packages/ui/src/clusters/[cluster-name]/

# Business logic
packages/core/src/clusters/[cluster-name]/

# Data structures
packages/content-sdk/src/structures/[cluster-name]/
```

### Step 3: Update Apps to Use Shared Code

Replace duplicated code with imports:
```javascript
// Before (duplicated)
import ModuleCard from '../../components/ModuleCard';

// After (shared)
import { ModuleCard } from '@iiskills/ui/content';
```

### Step 4: Test & Verify

```bash
# Test individual app
cd apps/[app-name]
npm run build
npm run test

# Test full cluster
npm run build:all-serial

# Run E2E tests
npm run test:e2e
```

## 📈 Migration Priority

### Phase 1: Science Cluster (Highest ROI)
**Reason**: 4 apps, 85% code sharing potential, low complexity

**Timeline**: 2-3 days per app = 8-12 days total

**Approach**:
1. Extract common components to `packages/ui/src/clusters/science/`
2. Create shared configuration in `packages/core/`
3. Update all 4 apps to use shared code
4. Test each app individually
5. Run full cluster E2E tests

### Phase 2: AI/Tech Cluster (Critical Features)
**Reason**: Bundle logic critical, premium apps, 75% sharing

**Timeline**: 3-4 days per app = 6-8 days total

**Approach**:
1. Verify bundle logic consistency
2. Extract premium features to shared components
3. Consolidate payment logic
4. Test bundle scenarios extensively

### Phase 3: Business Cluster (Medium Priority)
**Reason**: 2 apps, 70% sharing, professional content

**Timeline**: 3 days per app = 6 days total

**Approach**:
1. Extract case study components
2. Share professional certificate logic
3. Consolidate career pathway features

### Phase 4: Aptitude (Singleton)
**Reason**: Unique architecture, 30% sharing only

**Timeline**: 2 days

**Approach**:
1. Use common layout components
2. Keep quiz-specific logic isolated
3. Document unique patterns

## ✅ Success Metrics

### Code Reuse
- [ ] Science Cluster: 85%+ shared code
- [ ] AI/Tech Cluster: 75%+ shared code
- [ ] Business Cluster: 70%+ shared code
- [ ] Overall monorepo: 70%+ shared code

### Build Performance
- [ ] Build time reduction: 30%+
- [ ] Bundle size reduction: 20%+
- [ ] Development mode startup: <5 seconds

### Test Coverage
- [ ] Unit test coverage: 80%+
- [ ] E2E test coverage: 90%+
- [ ] Integration test coverage: 85%+

### Developer Experience
- [ ] New app creation: <30 minutes
- [ ] Component reuse: >80% of UI
- [ ] Onboarding time: <1 day

## 🚫 Anti-Patterns to Avoid

### ❌ Don't Create Over-Abstraction
```javascript
// Bad - Too generic, loses clarity
function processContent(data, type, options) { ... }

// Good - Specific, clear purpose
function processModuleContent(module) { ... }
function processQuizContent(quiz) { ... }
```

### ❌ Don't Force All Apps into Same Pattern
```javascript
// Bad - Forces quiz app to use module structure
<ModuleLayout quiz={quiz} />

// Good - Use appropriate pattern
<QuizLayout quiz={quiz} />
```

### ❌ Don't Ignore App-Specific Needs
```javascript
// Bad - Generic config ignores uniqueness
config.contentType = 'generic';

// Good - Specific config with overrides
config.contentType = 'quiz';
config.timingEnabled = true;
```

## 📝 Documentation Requirements

For each cluster, document:
1. Shared components and their APIs
2. Configuration options
3. Data structures
4. Integration examples
5. Migration guides
6. Exception cases

## 🔐 Access Control Integration

All clusters MUST use centralized access control:

```javascript
import { 
  userHasAccess,
  isFreeApp,
  requiresPayment,
  grantBundleAccess 
} from '@iiskills/access-control';

// Check access
const hasAccess = await userHasAccess(userId, appId);

// Grant access (paid apps)
await grantBundleAccess({ userId, purchasedAppId, paymentId });
```

## 🎓 Training & Onboarding

New developers should:
1. Read this clustering guide
2. Review cluster-specific documentation
3. Examine example apps in each cluster
4. Follow migration examples
5. Practice with test app creation

## 📞 Support & Questions

- **Clustering Strategy**: See this document
- **Access Control**: `UNIVERSAL_ACCESS_CONTROL.md`
- **Component Library**: `SHARED_COMPONENTS_LIBRARY.md`
- **TypeScript**: `TYPESCRIPT_MIGRATION_STRATEGY.md`

---

**Next Steps**: Implement Science Cluster refactoring first for maximum ROI.
