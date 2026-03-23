# Contributing to iiskills.cloud

Thank you for contributing to the iiskills monorepo. Please read this document before opening a pull request. The rules below are enforced automatically by the Danger.js bot on every PR.

---

## Table of Contents

1. [Admin and Paywall Access Control](#admin-and-paywall-access-control)
2. [Environment Variables and Config](#environment-variables-and-config)
3. [Adding New Apps or Services](#adding-new-apps-or-services)
4. [Deployment](#deployment)
5. [Code Review Checklist](#code-review-checklist)

---

## Admin and Paywall Access Control

> **⚠️ CRITICAL — Violations will cause your PR to be blocked by the Danger.js bot.**

### Rule 1: Never check admin status directly

**DO NOT** check admin status or entitlement outside the shared access-control package. The following patterns are **forbidden** outside `packages/access-control/` and `packages/shared-utils/lib/hooks/useUserAccess.js`:

```js
// ❌ FORBIDDEN — direct flag checks
user.is_admin === true
user.role === "admin"
user.app_metadata?.is_admin
user.user_metadata?.is_admin

// ❌ FORBIDDEN — hardcoded product-owner emails
user.email === "philipda@gmail.com"
ADMIN_EMAILS.includes(user.email)
```

### Rule 2: Always use the centralised predicates

Import and use the correct helper from `@iiskills/access-control`:

```js
import { isUnrestrictedAdmin, isAdminFromJwtUser } from '@iiskills/access-control';

// ✅ For a normalised profile/DB user (flat is_admin field):
if (isUnrestrictedAdmin(user)) { /* admin bypass */ }

// ✅ For a raw Supabase JWT session user (nested app_metadata/user_metadata):
if (isAdminFromJwtUser(sessionUser)) { /* admin bypass */ }
```

| Function | When to use |
|---|---|
| `isUnrestrictedAdmin(user)` | User object from DB / normalised profile (flat `is_admin` field) |
| `isAdminFromJwtUser(jwtUser)` | Raw Supabase JWT user from `supabase.auth.getUser()` or `getSession().user` |
| `hasAccess(user)` | Edge Middleware with cookie-parsed user (`parseUserFromCookies`) |
| `checkUserAccess(user, appId)` | Edge Middleware — returns `{ allowed, reason }` |

### Rule 3: Never hardcode product-owner emails

Use `PRODUCT_OWNER_EMAILS` from the shared package:

```js
import { PRODUCT_OWNER_EMAILS } from '@iiskills/access-control';

// ✅ Correct
if (PRODUCT_OWNER_EMAILS.includes(user.email)) { ... }
```

The `isAdminFromJwtUser` and `isUnrestrictedAdmin` helpers already include this check — in most cases you don't need to reference `PRODUCT_OWNER_EMAILS` directly.

### Rule 4: New apps must use the access-control package

Every new learn app or service that implements a paywall or access gate **must**:

1. Import access-control functions from `@iiskills/access-control`.
2. Use `checkUserAccess(user, appId)` in its Edge Middleware.
3. Use `isAdminFromJwtUser(sessionUser)` for session-level checks in pages and API routes.

---

## Environment Variables and Config

> **⚠️ CRITICAL — Never introduce access/bypass env vars "by hand".**

### Rule 5: Single source of truth for env variables

All environment toggles for access control and bypass (`OPEN_ACCESS`, `ADMIN_AUTH_DISABLED`, etc.) must live in **one place only**: `/etc/iiskills.env` (the canonical centralised env file on the server).

The deployment script (`deploy-all.sh`) symlinks `/etc/iiskills.env` →  `apps/*/.env.production` before every build so all apps always share the same values.

**Never**:
- Hardcode access/bypass env variables in individual `apps/*/.env.production` files that are not symlinked from `/etc/iiskills.env`.
- Introduce a new access/bypass env variable in a PR without updating `/etc/iiskills.env` and documenting it here.

---

## Adding New Apps or Services

1. Add the new app to the `APPS` array in `deploy-all.sh`.
2. Add it to `ecosystem.config.js` with the correct PM2 process name.
3. Register it in `packages/access-control/appConfig.js` (free or paid, bundle membership, etc.).
4. Add its subdomain to the CSP `connect-src` in `packages/config/security-headers.js`.
5. Implement access control using `@iiskills/access-control` as described above.
6. Add it to the post-deploy entitlement check list in `deploy-all.sh`.

---

## Deployment

The `deploy-all.sh` script handles the full production deployment. Key behaviour:

- **Deep clean**: deletes all `.next/` build caches before rebuilding.
- **Serial builds**: apps are built one at a time to prevent OOM issues.
- **Env sync**: `/etc/iiskills.env` is symlinked to every `apps/*/.env.production` before any build.
- **PM2 restart**: all processes are restarted after a successful build.
- **Post-deploy entitlement check**: `/api/entitlement` is tested for every paid app. Deployment fails if any check returns not-entitled for the admin test user.
- **Rollback**: if the entitlement check fails, the previous `.next/` snapshot is restored and PM2 is restarted with the old build.

Never run builds in parallel by hand — always use `deploy-all.sh` or the serial build loop it defines.

---

## Code Review Checklist

Before requesting a review, verify:

- [ ] No direct `is_admin`, `role === "admin"`, or hardcoded email checks outside `packages/access-control/`.
- [ ] All new admin/paywall checks use `isUnrestrictedAdmin`, `isAdminFromJwtUser`, or `checkUserAccess`.
- [ ] No new access/bypass env variables introduced outside `/etc/iiskills.env`.
- [ ] New apps are registered in `appConfig.js`, `ecosystem.config.js`, and `deploy-all.sh`.
- [ ] `yarn lint` passes.
- [ ] `yarn test` passes.
- [ ] Screenshots attached for any UI changes (desktop + tablet + mobile).
- [ ] PR description uses the pull request template format.
