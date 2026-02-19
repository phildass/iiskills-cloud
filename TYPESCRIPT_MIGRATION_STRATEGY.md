# TypeScript Migration Strategy

**Version**: 1.0  
**Date**: February 19, 2026  
**Status**: In Progress

## Overview

This document outlines the strategy for gradually migrating the iiskills-cloud monorepo to TypeScript for improved type safety, better developer experience, and self-documenting code.

## Current State

### TypeScript Usage

**Packages with TypeScript:**
- ✅ `@iiskills/core` - 100% TypeScript
- ✅ `@iiskills/schema` - 100% TypeScript
- ✅ `@iiskills/content-sdk` - 100% TypeScript

**Packages with JavaScript:**
- ❌ `@iiskills/access-control` - 0% TypeScript (migration target)
- ❌ `@iiskills/ui` - 0% TypeScript (migration target)

**Apps:**
- All 10 Next.js apps use JavaScript
- Can consume TypeScript packages without issues

## Migration Strategy

### Guiding Principles

1. **Gradual Migration**: Migrate incrementally, not all at once
2. **Critical Path First**: Start with business logic (access control, payments)
3. **Backward Compatible**: Maintain JavaScript compatibility during transition
4. **Type Safety**: Strict TypeScript with no `any` types
5. **Developer Experience**: Improve IDE autocomplete and error detection

### Phase-Based Approach

#### Phase 1: @iiskills/access-control (Priority 1) 🎯

**Status**: In Progress

Convert access control package to TypeScript:

```
packages/access-control/
├── src/
│   ├── types/
│   │   ├── index.ts          # Export all types
│   │   ├── app.types.ts      # App configuration types
│   │   ├── access.types.ts   # Access control types
│   │   └── payment.types.ts  # Payment types
│   │
│   ├── accessControl.ts      # Core logic (from .js)
│   ├── appConfig.ts          # App configuration (from .js)
│   ├── dbAccessManager.ts    # Database operations (from .js)
│   ├── paymentGuard.ts       # Payment guards (from .js)
│   └── index.ts              # Public API exports
│
├── tsconfig.json             # TypeScript config
└── package.json              # Updated with TS build
```

**Files to Convert:**
1. `appConfig.js` → `appConfig.ts` - App configuration with types
2. `accessControl.js` → `accessControl.ts` - Core access control logic
3. `dbAccessManager.js` → `dbAccessManager.ts` - Database operations
4. `paymentGuard.js` → `paymentGuard.ts` - Payment guards
5. `accessControl.test.js` → `accessControl.test.ts` - Tests

**Benefits:**
- Type-safe access control checks
- Autocomplete for app IDs
- Catch errors at compile time
- Self-documenting API

**Timeline**: 2-3 days

#### Phase 2: @iiskills/ui (Priority 2)

**Status**: Planned

Convert UI component library to TypeScript:

```
packages/ui/
├── src/
│   ├── types/
│   │   ├── index.ts
│   │   ├── common.types.ts
│   │   └── props.types.ts
│   │
│   ├── authentication/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   │
│   ├── navigation/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   │
│   └── ... (other categories)
│
├── tsconfig.json
└── package.json
```

**Approach:**
- Convert one component category at a time
- Start with common components (Button, Card, Layout)
- Add prop types for all components
- Maintain .js exports for backward compatibility

**Timeline**: 1-2 weeks

#### Phase 3: Critical API Routes (Priority 3)

**Status**: Planned

Add TypeScript to critical API endpoints:

**Target APIs:**
- Payment endpoints (create, confirm)
- Access control checks
- Admin operations
- Authentication flows

**Approach:**
- Create shared types for API requests/responses
- Add runtime validation with Zod or similar
- Type-safe Supabase queries

**Timeline**: 1 week

#### Phase 4: Full App Migration (Priority 4)

**Status**: Future

Gradually migrate Next.js apps to TypeScript:

1. Start with new features in TypeScript
2. Convert one app as a pilot (learn-apt)
3. Document learnings and best practices
4. Roll out to other apps

**Timeline**: 3-6 months (gradual)

## TypeScript Configuration

### Strict Configuration

```json
// packages/access-control/tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    
    // Strict type checking
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    
    // Additional checks
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Root Configuration

```json
// tsconfig.json (root)
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "paths": {
      "@iiskills/access-control": ["./packages/access-control/src"],
      "@iiskills/ui": ["./packages/ui/src"],
      "@iiskills/core": ["./packages/core"],
      "@iiskills/schema": ["./packages/schema"]
    }
  },
  "references": [
    { "path": "./packages/access-control" },
    { "path": "./packages/ui" },
    { "path": "./packages/core" },
    { "path": "./packages/schema" }
  ]
}
```

## Type Definitions

### Access Control Types

```typescript
// packages/access-control/src/types/app.types.ts

export type AppId = 
  | 'main'
  | 'learn-ai'
  | 'learn-apt'
  | 'learn-chemistry'
  | 'learn-developer'
  | 'learn-geography'
  | 'learn-management'
  | 'learn-math'
  | 'learn-physics'
  | 'learn-pr';

export type AppCategory = 'FREE' | 'PAID';

export interface AppConfig {
  id: AppId;
  name: string;
  price: number;
  currency: 'INR';
  category: AppCategory;
  isBundle: boolean;
  bundleWith?: AppId[];
  description: string;
}

export interface BundleConfig {
  apps: AppId[];
  price: number;
  currency: 'INR';
  description: string;
}
```

```typescript
// packages/access-control/src/types/access.types.ts

export interface UserAppAccess {
  id: string;
  user_id: string;
  app_id: AppId;
  granted_via: 'payment' | 'bundle' | 'admin' | 'free';
  payment_id?: string;
  granted_at: Date;
  expires_at?: Date;
}

export interface AccessCheckResult {
  hasAccess: boolean;
  reason?: 'free_app' | 'payment' | 'bundle' | 'admin' | 'no_access';
  accessRecord?: UserAppAccess;
}
```

```typescript
// packages/access-control/src/types/payment.types.ts

export interface PaymentRecord {
  id: string;
  user_id: string;
  app_id: AppId;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount: number;
  currency: string;
  status: 'created' | 'completed' | 'failed';
  bundle_apps?: AppId[];
  created_at: Date;
  confirmed_at?: Date;
}

export interface GrantBundleAccessParams {
  userId: string;
  purchasedAppId: AppId;
  paymentId: string;
}

export interface GrantBundleAccessResult {
  success: boolean;
  bundledApps: AppId[];
  accessRecords: UserAppAccess[];
  error?: string;
}
```

### API Types

```typescript
// packages/schema/src/api.types.ts

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  page: number;
  perPage: number;
  total: number;
  hasMore: boolean;
}

export interface PaymentCreateRequest {
  appId: AppId;
  userId: string;
}

export interface PaymentCreateResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string;
}

export interface PaymentConfirmRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}
```

## Migration Process

### Step-by-Step Guide

#### 1. Set Up TypeScript Configuration

```bash
# Install TypeScript and types
cd packages/access-control
npm install -D typescript @types/node

# Create tsconfig.json
# (See configuration above)
```

#### 2. Create Type Definitions

```bash
# Create types directory
mkdir -p src/types

# Create type files
touch src/types/index.ts
touch src/types/app.types.ts
touch src/types/access.types.ts
touch src/types/payment.types.ts
```

#### 3. Convert Files One by One

```bash
# Rename .js to .ts
mv appConfig.js src/appConfig.ts

# Add types
# Fix type errors
# Test thoroughly

# Repeat for each file
```

#### 4. Update Package.json

```json
{
  "name": "@iiskills/access-control",
  "version": "2.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch",
    "test": "jest",
    "lint": "eslint src/**/*.ts"
  },
  "files": [
    "dist",
    "src"
  ]
}
```

#### 5. Build and Test

```bash
# Build TypeScript
npm run build

# Run tests
npm test

# Check types
tsc --noEmit
```

#### 6. Update Consumers

```typescript
// Before (JavaScript)
import { userHasAccess } from '@iiskills/access-control';

// After (TypeScript with types)
import { userHasAccess } from '@iiskills/access-control';
import type { AppId, AccessCheckResult } from '@iiskills/access-control';

const appId: AppId = 'learn-ai';
const result: AccessCheckResult = await userHasAccess(userId, appId);
```

## Benefits of TypeScript

### Developer Experience

- **Autocomplete**: IDE suggests valid app IDs, function parameters
- **Error Detection**: Catch typos and type mismatches at compile time
- **Refactoring**: Safely rename and restructure code
- **Documentation**: Types serve as inline documentation

### Code Quality

- **Type Safety**: Prevent runtime type errors
- **Consistency**: Enforce consistent data structures
- **Maintainability**: Easier to understand and modify code
- **Confidence**: Refactor with confidence

### Examples

#### Before (JavaScript)

```javascript
// appConfig.js
export const APPS = {
  FREE: ['learn-apt', 'learn-chemistry', 'learn-geography', 'learn-math', 'learn-physics'],
  PAID: ['main', 'learn-ai', 'learn-developer', 'learn-management', 'learn-pr']
};

// Can pass any string - no validation
export function isFreeApp(appId) {
  return APPS.FREE.includes(appId);
}

// Usage - typo not caught until runtime
const isFree = isFreeApp('learn-aai');  // Typo! Returns false instead of error
```

#### After (TypeScript)

```typescript
// appConfig.ts
export type AppId = 
  | 'learn-ai'
  | 'learn-apt'
  | 'learn-chemistry'
  // ... (exhaustive list)

export const APPS = {
  FREE: ['learn-apt', 'learn-chemistry', 'learn-geography', 'learn-math', 'learn-physics'],
  PAID: ['main', 'learn-ai', 'learn-developer', 'learn-management', 'learn-pr']
} as const;

// Only accepts valid AppId
export function isFreeApp(appId: AppId): boolean {
  return APPS.FREE.includes(appId);
}

// Usage - typo caught at compile time
const isFree = isFreeApp('learn-aai');  // ❌ Type error: 'learn-aai' is not assignable to type AppId
```

## Testing Strategy

### Type Testing

```typescript
// src/__tests__/types.test.ts
import { AppId, AppConfig, AccessCheckResult } from '../types';

// Type-only tests (no runtime)
describe('Type Tests', () => {
  it('should have correct AppId type', () => {
    const validAppId: AppId = 'learn-ai';
    // @ts-expect-error - Invalid app ID should fail
    const invalidAppId: AppId = 'invalid-app';
  });
  
  it('should have correct AccessCheckResult structure', () => {
    const result: AccessCheckResult = {
      hasAccess: true,
      reason: 'payment'
    };
  });
});
```

### Runtime Testing

```typescript
// src/__tests__/accessControl.test.ts
import { userHasAccess } from '../accessControl';
import type { AppId } from '../types';

describe('Access Control', () => {
  it('should check access correctly', async () => {
    const appId: AppId = 'learn-ai';
    const result = await userHasAccess('user-123', appId);
    
    expect(result).toHaveProperty('hasAccess');
    expect(result).toHaveProperty('reason');
  });
});
```

## Rollout Plan

### Week 1-2: @iiskills/access-control
- [ ] Set up TypeScript configuration
- [ ] Create type definitions
- [ ] Convert appConfig.js
- [ ] Convert accessControl.js
- [ ] Convert dbAccessManager.js
- [ ] Convert paymentGuard.js
- [ ] Update tests
- [ ] Build and verify
- [ ] Update documentation

### Week 3-4: API Type Definitions
- [ ] Create shared API types in @iiskills/schema
- [ ] Add request/response types
- [ ] Add validation schemas (Zod)
- [ ] Document usage examples

### Week 5-8: @iiskills/ui
- [ ] Set up TypeScript for UI package
- [ ] Convert common components
- [ ] Convert authentication components
- [ ] Convert payment components
- [ ] Convert navigation components
- [ ] Add prop types for all components
- [ ] Update Storybook (if exists)

### Month 3-6: Apps (Gradual)
- [ ] New features in TypeScript
- [ ] Pilot: Convert learn-apt to TypeScript
- [ ] Document learnings
- [ ] Roll out to other apps

## Success Metrics

- **Type Coverage**: > 90% of package code type-safe
- **Build Time**: No significant increase
- **Developer Satisfaction**: Improved IDE experience
- **Bug Reduction**: Fewer type-related runtime errors
- **Maintenance**: Easier refactoring and updates

## References

- TypeScript Handbook: https://www.typescriptlang.org/docs/
- TypeScript for React: https://react-typescript-cheatsheet.netlify.app/
- Next.js with TypeScript: https://nextjs.org/docs/basic-features/typescript
- Testing TypeScript: https://jestjs.io/docs/getting-started#using-typescript

---

**Last Updated**: February 19, 2026  
**Next Review**: March 19, 2026
