# TypeScript Migration Guide

## Overview

This guide documents the TypeScript support added to the iiskills-cloud monorepo, starting with the `@iiskills/access-control` package.

**Status**: Phase 1 Complete - Type Definitions Added  
**Date**: 2026-02-18  
**Version**: 1.1.0

---

## Table of Contents

1. [Current State](#current-state)
2. [Type Definitions](#type-definitions)
3. [Usage in TypeScript](#usage-in-typescript)
4. [Usage in JavaScript](#usage-in-javascript)
5. [Type Checking](#type-checking)
6. [Migration Roadmap](#migration-roadmap)
7. [Best Practices](#best-practices)

---

## Current State

### Package: @iiskills/access-control

#### What's Been Added

1. **TypeScript Type Definitions** (`index.d.ts`)
   - Complete type definitions for all exported functions
   - Interface definitions for all data structures
   - JSDoc comments with examples
   - Strict typing for function parameters and return values

2. **TypeScript Configuration** (`tsconfig.json`)
   - Configured for ES2020 with ESNext modules
   - Strict type checking enabled
   - JavaScript type checking support (opt-in)
   - Declaration file generation

3. **Package Configuration** (`package.json`)
   - `types` field pointing to `index.d.ts`
   - `exports` with type definitions
   - TypeScript scripts: `typecheck`, `build:types`
   - Version bumped to 1.1.0

#### What Hasn't Changed

- All source files remain JavaScript (`.js`)
- No breaking changes to existing APIs
- Backward compatible with all existing code
- No migration required for existing users

---

## Type Definitions

### Core Types

```typescript
// App identifiers (strict typing)
type AppId = 
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

// App configuration
interface AppConfig {
  id: AppId;
  name: string;
  type: 'free' | 'paid';
  bundleId: BundleId | null;
  price: Price | null;
}

// Bundle configuration
interface Bundle {
  id: BundleId;
  name: string;
  description: string;
  apps: AppId[];
  price: Price;
  features: string[];
  highlight: string;
}

// User with access information
interface User {
  id: string;
  email: string;
  name?: string;
  is_admin?: boolean;
  apps?: AppId[];
}

// Access status
interface AccessStatus {
  hasAccess: boolean;
  reason: string;
  grantedVia?: GrantedVia;
  message: string;
}
```

### Function Signatures

```typescript
// Check if app is free
function isFreeApp(appId: string): boolean;

// Check if app requires payment
function requiresPayment(appId: string): boolean;

// Check user access
function userHasAccess(user: User | null, appId: string): boolean;

// Get bundle info
function getBundleInfo(appId: string): Bundle | null;

// Grant bundle access
function grantBundleAccess(
  params: GrantBundleAccessParams
): Promise<BundleAccessResult>;

// Get access status
function getAccessStatus(
  user: User | null,
  appId: string
): AccessStatus;
```

---

## Usage in TypeScript

### Installation

The type definitions are automatically included when you import the package:

```typescript
import { 
  isFreeApp, 
  requiresPayment,
  userHasAccess,
  type AppId,
  type User,
  type Bundle,
} from '@iiskills/access-control';
```

### Basic Usage

```typescript
import { isFreeApp, requiresPayment } from '@iiskills/access-control';

// TypeScript knows these return boolean
const isMathFree: boolean = isFreeApp('learn-math'); // ✅
const needsPayment: boolean = requiresPayment('learn-ai'); // ✅

// TypeScript catches invalid app IDs (at compile time if using strict AppId type)
const invalid = isFreeApp('invalid-app'); // ⚠️ Works but not type-safe
```

### With Type Annotations

```typescript
import { 
  type User, 
  type AppId,
  type AccessStatus,
  userHasAccess,
  getAccessStatus,
} from '@iiskills/access-control';

// Define user with correct type
const user: User = {
  id: 'uuid-123',
  email: 'test@example.com',
  apps: ['learn-ai', 'learn-developer'],
};

// TypeScript knows the return types
const hasAccess: boolean = userHasAccess(user, 'learn-ai');

// Get detailed status with full type safety
const status: AccessStatus = getAccessStatus(user, 'learn-ai');
console.log(status.hasAccess); // ✅ TypeScript knows this exists
console.log(status.reason);    // ✅ TypeScript knows this exists
```

### Database Operations

```typescript
import { 
  grantBundleAccess,
  hasAppAccess,
  type BundleAccessResult,
} from '@iiskills/access-control';

// Grant bundle access with type safety
const result: BundleAccessResult = await grantBundleAccess({
  userId: 'uuid-123',
  purchasedAppId: 'learn-ai',
  paymentId: 'payment-uuid',
});

// TypeScript knows the structure
console.log(result.purchasedApp);   // ✅ AppId
console.log(result.unlockedApps);   // ✅ AppId[]
console.log(result.bundledApps);    // ✅ AppId[]
console.log(result.accessRecords);  // ✅ UserAppAccess[]

// Check access with type inference
const access: boolean = await hasAppAccess('uuid-123', 'learn-ai');
```

### React Components (TypeScript)

```typescript
import { useState, useEffect } from 'react';
import { 
  type User,
  type AppId,
  userHasAccess,
} from '@iiskills/access-control';

interface AppGateProps {
  user: User | null;
  appId: AppId;
  children: React.ReactNode;
}

function AppGate({ user, appId, children }: AppGateProps) {
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    setHasAccess(userHasAccess(user, appId));
  }, [user, appId]);

  if (!hasAccess) {
    return <div>Access Denied</div>;
  }

  return <>{children}</>;
}
```

---

## Usage in JavaScript

### With JSDoc Type Annotations

You can get TypeScript-like type checking in JavaScript files using JSDoc:

```javascript
// @ts-check
import { isFreeApp, userHasAccess } from '@iiskills/access-control';

/**
 * Check if user can access an app
 * @param {import('@iiskills/access-control').User | null} user
 * @param {string} appId
 * @returns {boolean}
 */
function canAccessApp(user, appId) {
  // TypeScript will check this code even though it's JavaScript
  return isFreeApp(appId) || userHasAccess(user, appId);
}
```

### IDE Autocomplete

Even without JSDoc, your IDE will provide autocomplete and type hints:

```javascript
import { getAccessStatus } from '@iiskills/access-control';

const user = { id: '123', email: 'test@example.com' };
const status = getAccessStatus(user, 'learn-ai');

// Your IDE will show:
// - status.hasAccess (boolean)
// - status.reason (string)
// - status.grantedVia (GrantedVia | undefined)
// - status.message (string)
```

### No Migration Required

All existing JavaScript code continues to work unchanged:

```javascript
// This still works exactly as before
import { isFreeApp } from '@iiskills/access-control';

if (isFreeApp('learn-math')) {
  console.log('Free app!');
}
```

---

## Type Checking

### Check Types Without Building

```bash
# In the access-control package
cd packages/access-control
yarn typecheck

# Or from root
yarn workspace @iiskills/access-control typecheck
```

### Enable JavaScript Type Checking

To enable type checking for JavaScript files, update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "checkJs": true  // Change from false to true
  }
}
```

Then run:

```bash
yarn typecheck
```

TypeScript will now check your JavaScript files using the JSDoc comments.

### Generate Declaration Files

```bash
yarn build:types
```

This generates `.d.ts` files from JSDoc comments in JavaScript files (future enhancement).

---

## Migration Roadmap

### Phase 1: Type Definitions (COMPLETE ✅)
- [x] Create comprehensive type definitions (`index.d.ts`)
- [x] Add TypeScript configuration (`tsconfig.json`)
- [x] Update package.json with types field
- [x] Document TypeScript usage
- [x] Test with TypeScript projects

### Phase 2: Gradual TypeScript Adoption (PLANNED)
- [ ] Convert utility functions to TypeScript (`.ts`)
- [ ] Convert configuration files to TypeScript
- [ ] Add TypeScript to test files
- [ ] Maintain JavaScript compatibility via compilation

### Phase 3: Full TypeScript (FUTURE)
- [ ] Convert all source files to TypeScript
- [ ] Enable strict mode across all files
- [ ] Generate declaration files from source
- [ ] Set up build pipeline for TypeScript

### Phase 4: Expand to Other Packages (FUTURE)
- [ ] Add types to `@iiskills/ui`
- [ ] Add types to `@iiskills/core`
- [ ] Add types to `@iiskills/content-sdk`
- [ ] Add types to `@iiskills/schema`

---

## Best Practices

### For TypeScript Projects

1. **Import Types Explicitly**
   ```typescript
   import { 
     isFreeApp,
     type AppId,
     type User,
   } from '@iiskills/access-control';
   ```

2. **Use Strict Type Checking**
   ```json
   {
     "compilerOptions": {
       "strict": true
     }
   }
   ```

3. **Leverage Type Inference**
   ```typescript
   // TypeScript infers the return type
   const status = getAccessStatus(user, appId);
   ```

4. **Use Union Types for App IDs**
   ```typescript
   type MyAppId = 'learn-ai' | 'learn-developer';
   const app: MyAppId = 'learn-ai'; // ✅ Type-safe
   ```

### For JavaScript Projects

1. **Use JSDoc for Critical Functions**
   ```javascript
   /**
    * @param {import('@iiskills/access-control').User} user
    * @param {string} appId
    * @returns {Promise<boolean>}
    */
   async function checkAccess(user, appId) {
     // ...
   }
   ```

2. **Enable Type Checking with `// @ts-check`**
   ```javascript
   // @ts-check
   import { isFreeApp } from '@iiskills/access-control';
   // TypeScript will now check this file
   ```

3. **Leverage IDE Type Hints**
   - Hover over functions to see types
   - Use autocomplete for object properties
   - See parameter hints

### For Package Maintainers

1. **Keep Types Updated**
   - Update `index.d.ts` when adding new functions
   - Test types with TypeScript projects
   - Document breaking changes

2. **Maintain Backward Compatibility**
   - Don't break JavaScript APIs
   - Keep JavaScript as source of truth (for now)
   - Add TypeScript gradually

3. **Document Type Changes**
   - Update CHANGELOG.md with type additions
   - Provide migration guides for breaking changes
   - Include examples in documentation

---

## Testing

### Test TypeScript Usage

Create a test TypeScript file:

```typescript
// test-types.ts
import { 
  isFreeApp,
  requiresPayment,
  type AppId,
  type User,
} from '@iiskills/access-control';

// Test basic functions
const isMathFree: boolean = isFreeApp('learn-math');
const needsPayment: boolean = requiresPayment('learn-ai');

// Test with user
const user: User = {
  id: '123',
  email: 'test@example.com',
  apps: ['learn-ai'],
};

console.log('Types work!');
```

Run with:

```bash
npx ts-node test-types.ts
```

Or compile and run:

```bash
npx tsc test-types.ts
node test-types.js
```

---

## Troubleshooting

### Types Not Recognized in IDE

1. **Restart IDE/Language Server**
   - VS Code: Reload window (Cmd/Ctrl + Shift + P → "Reload Window")
   - Other IDEs: Restart TypeScript server

2. **Check Package Installation**
   ```bash
   yarn install
   ls -la packages/access-control/index.d.ts
   ```

3. **Verify TypeScript Version**
   ```bash
   npx tsc --version  # Should be 5.9.3 or higher
   ```

### Type Errors in JavaScript Files

If you get type errors in JavaScript:

1. **Disable Type Checking for That File**
   ```javascript
   // @ts-nocheck
   ```

2. **Ignore Specific Lines**
   ```javascript
   // @ts-ignore
   const result = someUntypedFunction();
   ```

3. **Fix the Types**
   - Add proper JSDoc comments
   - Use correct types from the package

### Missing Types for Dependencies

If types are missing for dependencies:

```bash
# Install type definitions
yarn add -D @types/node
yarn add -D @types/react
```

---

## Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [JSDoc Type Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [TypeScript for JavaScript Programmers](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [@iiskills/access-control README](../../packages/access-control/README.md)
- [UNIVERSAL_ACCESS_CONTROL.md](../UNIVERSAL_ACCESS_CONTROL.md)

---

**Last Updated**: 2026-02-18  
**Maintained By**: Development Team  
**Status**: Active - Phase 1 Complete
