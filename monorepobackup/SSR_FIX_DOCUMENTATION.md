# Next.js SSR Build Error Fix - Documentation for Developers

## Problem Overview

### The Error
When running `yarn build` in the `/learn-ai` app, the build was failing during prerendering with:

```
TypeError: Cannot read properties of null (reading 'useState')
Error occurred prerendering page "/admin". 
Error occurred prerendering page "/".
```

### What This Error Means
This error indicates that React was `null` or `undefined` when components tried to use the `useState` hook during server-side rendering (SSR). In Next.js, pages are prerendered at build time to generate static HTML, and all components must be compatible with SSR.

## Root Cause Analysis

### Why the Error Occurred

With **Next.js 16.x** and **React 19.x**, the framework has stricter requirements for distinguishing between:
- **Server Components** (run on server during SSR/build)
- **Client Components** (run in the browser with interactivity)

Components that use React hooks like `useState`, `useEffect`, or browser APIs like `window` need to be explicitly marked as **Client Components** using the `"use client"` directive.

### The Specific Issues

1. **Missing "use client" directives**: Components using hooks weren't marked for client-side execution
2. **Multiple routes affected**: Both `/` and `/admin` pages imported client-side components
3. **Shared components**: Components in `/components/shared/` used across apps needed the directive
4. **Temporary workaround**: The admin page was renamed to `admin.ignore` to skip it during build

## The Solution

### What We Fixed

Added `"use client"` directive to all components that use:
- React hooks (`useState`, `useEffect`, `useRef`, etc.)
- Browser APIs (`window`, `document`, etc.)
- User interactions (forms, buttons with onClick, etc.)
- Next.js router hooks (`useRouter`)

### Files Modified

#### Root-level Shared Components (`/components/shared/`)
These are used across multiple apps in the monorepo:

1. **UniversalLogin.js** - Authentication form with hooks and window usage
2. **SharedNavbar.js** - Navigation with state for mobile menu
3. **SubdomainNavbar.js** - Dropdown navigation with useState
4. **AuthenticationChecker.js** - PWA auth check with useEffect and useRouter
5. **AIAssistant.js** - Chatbot component with hooks and DOM manipulation
6. **InstallApp.js** - PWA install button using browser APIs
7. **UniversalRegister.js** - Registration form with state management
8. **NewsletterSignup.js** - Newsletter subscription form with hooks

#### App-level Components (`/learn-ai/components/shared/`)
These are local to the learn-ai app:

1. **InstallApp.js**
2. **AIAssistant.js**
3. **UniversalRegister.js**
4. **NewsletterSignup.js**

#### Other Components

1. **PaidUserProtectedRoute.js** - Route guard with authentication checks

### The "use client" Directive

#### What It Does
The `"use client"` directive tells Next.js:
- ✅ This component needs to run in the browser
- ✅ Bundle this with the client JavaScript
- ✅ Don't try to render this during SSR (but still prerender the page)

#### Where to Place It
Always at the **very top** of the file, before any imports:

```javascript
"use client"; // This component uses React hooks - must run on client side

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
// ... rest of imports
```

#### When You Need It

Add `"use client"` when your component:
- ✅ Uses React hooks (`useState`, `useEffect`, `useContext`, etc.)
- ✅ Uses browser-only APIs (`window`, `document`, `localStorage`, etc.)
- ✅ Uses event handlers (`onClick`, `onChange`, etc.)
- ✅ Uses Next.js client-side routing (`useRouter`, `usePathname`, etc.)
- ✅ Uses any third-party library that requires browser environment

#### When You DON'T Need It

You don't need `"use client"` for:
- ❌ Static components that just render JSX
- ❌ Components that only use props (no hooks or browser APIs)
- ❌ Server-only operations (database queries, file system access)

### Example: InstallApp Component

**Before (causing SSR error):**
```javascript
import { useState, useEffect } from "react";

export default function InstallApp({ appName = "iiskills.cloud" }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  
  useEffect(() => {
    if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) {
      // ... browser-specific code
    }
  }, []);
  
  // ... rest of component
}
```

**After (SSR-safe):**
```javascript
"use client"; // This component uses browser APIs and React hooks - must run on client side

import { useState, useEffect } from "react";

export default function InstallApp({ appName = "iiskills.cloud" }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  
  useEffect(() => {
    // window is safe here because component only runs on client
    if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) {
      // ... browser-specific code
    }
  }, []);
  
  // ... rest of component
}
```

## How SSR Works in Next.js

### Build Process

1. **Compilation**: Next.js compiles all pages and components
2. **Prerendering**: Each page is rendered to static HTML
3. **Hydration**: Client-side JavaScript makes the page interactive

### What Happens with "use client"

1. **Build time**: Server renders the page, but skips rendering client component internals
2. **Runtime**: Browser loads and executes client component JavaScript
3. **Hydration**: React attaches event handlers and makes components interactive

### Pages Router vs App Router

This project uses **Pages Router** (`/pages` directory), but the `"use client"` directive is still beneficial for:
- Clarity about component boundaries
- Future compatibility if migrating to App Router
- Avoiding SSR issues with strict rendering modes
- Better tree-shaking and code splitting

## Testing Your Changes

### 1. Clean Build Test
```bash
cd learn-ai
rm -rf .next
yarn build
```

**Expected Output:**
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (11/11)
```

### 2. Check for Errors
The build should complete without:
- ❌ "Cannot read properties of null (reading 'useState')"
- ❌ "window is not defined"
- ❌ "document is not defined"

### 3. Verify All Routes Build
Check that all pages appear in the build output:
```
○ / 
○ /admin
○ /learn
○ /login
○ /register
```

## Best Practices Going Forward

### 1. Always Add "use client" for Interactive Components
When creating a new component with interactivity:
```javascript
"use client";

import { useState } from "react";
// ... component code
```

### 2. Keep Components Focused
- Separate server logic from client logic
- Create smaller, focused components
- Server components for static content, client components for interactivity

### 3. Test SSR Compatibility
Before deploying:
```bash
# Clean build
rm -rf .next
yarn build

# If successful, test the production build
yarn start
```

### 4. Use TypeScript for Better Type Safety (Optional)
TypeScript can help catch SSR issues at compile time by warning about browser APIs in server contexts.

## Common SSR Pitfalls to Avoid

### ❌ Don't: Access window/document at module level
```javascript
const userAgent = window.navigator.userAgent; // ERROR: SSR fails

export default function MyComponent() {
  // ...
}
```

### ✅ Do: Access in useEffect or with guards
```javascript
"use client";

import { useEffect, useState } from "react";

export default function MyComponent() {
  const [userAgent, setUserAgent] = useState("");
  
  useEffect(() => {
    setUserAgent(window.navigator.userAgent); // Safe in useEffect
  }, []);
}
```

### ❌ Don't: Import browser-only libraries at top level without "use client"
```javascript
import SomeBrowserLibrary from "browser-lib"; // May fail SSR

export default function MyComponent() {
  // ...
}
```

### ✅ Do: Mark component as client or use dynamic import
```javascript
"use client";

import SomeBrowserLibrary from "browser-lib"; // Safe with "use client"
```

## Environment Variables

### Required for Build
Make sure `.env.local` exists with:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Why This Matters
The Supabase client is used in several components. Missing env vars can cause build failures.

## Monorepo Considerations

### Shared Components
This project uses a monorepo structure with shared components:
```
/components/shared/          # Shared across all apps
/learn-ai/components/shared/ # Specific to learn-ai app
```

### Turbopack Configuration
Each app's `next.config.js` has:
```javascript
turbopack: {
  root: path.resolve(__dirname, ".."),
}
```

This allows importing from parent directory:
```javascript
import UniversalLogin from "../../components/shared/UniversalLogin";
```

## Troubleshooting

### Build Still Fails?

1. **Check for missing "use client" directives**
   ```bash
   grep -r "useState\|useEffect" components/ pages/ --include="*.js" --include="*.jsx"
   ```
   Verify all files using hooks have `"use client"`

2. **Check for window/document usage**
   ```bash
   grep -r "window\.\|document\." components/ pages/ --include="*.js" --include="*.jsx"
   ```
   Ensure it's inside useEffect or component has `"use client"`

3. **Clear all caches**
   ```bash
   rm -rf .next node_modules/.cache
   ```

4. **Check Node.js version**
   ```bash
   node --version  # Should be 18.x or higher
   ```

## Summary

The SSR build error was resolved by:
1. ✅ Adding `"use client"` directive to all interactive components
2. ✅ Ensuring browser APIs are only used in client components
3. ✅ Restoring the admin page (from admin.ignore to admin.js)
4. ✅ Maintaining SSR compatibility while enabling client-side features

The build now succeeds for all routes including `/`, `/admin`, and all other pages!

## Questions?

If you encounter similar issues:
1. Check if component uses hooks or browser APIs → Add `"use client"`
2. Verify env vars are set in `.env.local`
3. Run clean build: `rm -rf .next && yarn build`
4. Check Next.js documentation for Pages Router vs App Router

---

**Last Updated**: January 18, 2026
**Next.js Version**: 16.1.1
**React Version**: 19.2.3
