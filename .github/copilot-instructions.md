# Copilot Coding Agent Instructions

## Repository Overview

This is the **IISkills Cloud monorepo** — a Next.js / Yarn 4 workspaces project that hosts a suite of e-learning apps and a shared component/package ecosystem.

**Package manager**: Yarn 4 (`corepack enable && yarn install`)  
**Build system**: Turborepo (`turbo`)  
**Framework**: Next.js (all apps)  
**Database/Auth**: Supabase  
**Styling**: Tailwind CSS + CSS Modules  

---

## Monorepo Structure

```
apps/
  main/             # Production main site (port 3000) — the only deployed "main" app
  admin/            # Admin dashboard (port 3001, basePath /admin)
  learn-ai/         # Paid AI learning app
  learn-developer/  # Paid developer learning app
  learn-management/ # Paid management learning app
  learn-pr/         # Paid PR learning app
  learn-math/       # Free math learning app
  learn-chemistry/  # Free chemistry app
  learn-geography/  # Free geography app
  learn-physics/    # Free physics app
  learn-apt/        # Free APT learning app
  web/              # Placeholder — NOT deployed to production
packages/
  ui/               # Shared React components (@iiskills/ui)
  core/             # Shared types & helpers (@iiskills/core)
  content/          # Git-based content (courses/modules/lessons)
  content-loader/   # Content loading utilities
  content-sdk/      # Content SDK
  schema/           # Shared schema definitions
  access-control/   # Access control utilities
lib/                # Root-level shared utilities (supabaseClient, appRegistry, etc.)
components/         # Shared React components (shared/ subfolder for cross-app use)
config/             # Security headers, course display order
```

---

## Essential Commands

```bash
# Install dependencies (use corepack, not npm/npx)
corepack enable
yarn install

# Development
yarn dev                    # All apps via Turbo
yarn dev:main               # apps/main only
yarn dev:web                # apps/web only
yarn dev:admin              # apps/admin only
yarn dev:learn-physics      # apps/learn-physics only

# Build
yarn build                  # All apps via Turbo

# Lint & Format
yarn lint                   # ESLint
yarn lint:fix               # ESLint with auto-fix
yarn format                 # Prettier write
yarn format:check           # Prettier check only

# Tests
yarn test                   # Jest unit tests
yarn test:coverage          # Jest with coverage
yarn test:e2e               # Playwright E2E tests
yarn test:e2e:chrome        # Playwright (Chromium only)

# Validation
yarn validate-config        # Config consistency check
yarn validate-content       # Content schema validation
```

---

## Key Conventions

### Imports
- **Always** import shared UI components from `@iiskills/ui/*` — never copy or locally override them.
- Import `Layout`, `Header`, `Footer` from `@iiskills/ui/common` (not `@iiskills/ui`) to avoid loading auth modules.
- Pricing utilities must be imported from `utils/pricing.js` (root) or `apps/main/utils/pricing.js`. Never hardcode prices.

### Components
- All paid learn apps have a `@shared` webpack/turbopack alias pointing to `../../components/shared`.
- Use `PremiumAccessPrompt` and `EnrollmentLandingPage` from `@shared` or `@iiskills/ui`.

### Entitlements / Paywall
- Check entitlements via `GET /api/entitlement?appId=<app-id>` (handled by `apps/main/pages/api/entitlement.js`).
- When querying entitlements, use `.in('app_id', [appId, 'ai-developer-bundle'])` to handle bundle access.
- The bundle app ID `ai-developer-bundle` grants access to both `learn-ai` AND `learn-developer`.

### Supabase Client
- `lib/supabaseClient.js` and `apps/main/lib/supabaseClient.js` must **not** throw at init when credentials are missing — they fall back to a mock client so builds succeed in CI without `.env.local`.

### Lesson Pages
- Lesson pages in all learn apps are **open-access** — do not redirect unauthenticated users to `/register`.
- Style lesson content via the `LessonContent` component from `packages/ui/src/content/LessonContent.js`.

---

## Screenshots for UI Changes

**When making any UI change, always take a screenshot** and include it in the pull request.

Use the Playwright-based screenshot approach:

```bash
# Start the app in dev mode first (e.g., apps/main)
yarn dev:main

# Then in another terminal, take a screenshot with Playwright
yarn test:e2e:codegen   # to inspect pages interactively
# or run a targeted Playwright script
```

Alternatively, use the browser tool to navigate to the running app and capture a screenshot.

**Required viewports for UI screenshots**:
| Viewport | Width | Height |
|----------|-------|--------|
| Desktop  | 1920  | 1080   |
| Tablet   | 768   | 1024   |
| Mobile   | 375   | 667    |

Attach all three viewport screenshots to the pull request under the **Screenshots/Videos** section of the PR template.

---

## Pull Request Requirements

Before opening a PR, ensure:
1. `yarn lint:check` passes — no ESLint errors
2. `yarn format:check` passes — no Prettier violations
3. `yarn test` passes — all unit tests green
4. `yarn validate-config` passes — configuration is consistent
5. Screenshots attached for any UI changes (desktop + tablet + mobile)
6. PR description uses the `.github/PULL_REQUEST_TEMPLATE.md` format

---

## Production Deployment

- **apps/main** is the production main app on port 3000 (PM2 name: `iiskills-main`).
- **apps/web** is a placeholder skeleton and is **not deployed**.
- Learn apps are deployed to `<app>.iiskills.cloud` (e.g., `learn-ai.iiskills.cloud`).
- Deployment uses PM2 via `ecosystem.config.js` and `deploy-all.sh`.
