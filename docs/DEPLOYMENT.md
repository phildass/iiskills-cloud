# IISkills Cloud — Deployment Guide

This document describes the complete deployment procedure for the `iiskills-cloud` monorepo.

---

## Quick Reference

| Command                             | Purpose                                                 |
| ----------------------------------- | ------------------------------------------------------- |
| `./deploy-all.sh`                   | Full production deploy (clone → build → verify → start) |
| `yarn verify:build-no-placeholders` | Check `apps/main` bundle for placeholder strings        |
| `yarn verify:build-env:main`        | Alias for the above                                     |
| `curl localhost:3000`               | Smoke-test the main app                                 |
| `pm2 status`                        | View all running services                               |

---

## Prerequisites

| Item    | Details                                    |
| ------- | ------------------------------------------ |
| Node.js | 20 LTS                                     |
| Yarn    | 4.x via Corepack (`corepack enable`)       |
| PM2     | `npm i -g pm2`                             |
| Nginx   | Proxying `127.0.0.1:3000 → iiskills.cloud` |

---

## Step 1 — Set Real Environment Variables (never commit secrets)

### Critical: `NEXT_PUBLIC_*` variables are inlined at build time

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are embedded
verbatim into the compiled `.next/static/` JavaScript bundles during `yarn build`.
**They must be present in the environment before the build runs, not just at runtime.**

Setting them only in PM2's environment or at server startup has **no effect** on the
compiled bundle — the old value is already baked in.

### Option A — /etc/iiskills.env (recommended for deploy-all.sh)

`deploy-all.sh` automatically sources `/etc/iiskills.env` at startup.
Create it on the server:

```bash
# /etc/iiskills.env  — server only, never committed to git
export NEXT_PUBLIC_SUPABASE_URL=https://<your-real-project-id>.supabase.co
export NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-real-supabase-anon-key>
export SUPABASE_SERVICE_ROLE_KEY=<your-real-service-role-key>
export ADMIN_PANEL_SECRET=<strong-random-secret>
export ADMIN_SESSION_SIGNING_KEY=<strong-random-signing-key>
export NEXT_PUBLIC_SITE_URL=https://iiskills.cloud
export NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
```

Set permissions so only root can read it:

```bash
chmod 600 /etc/iiskills.env
```

### Option B — apps/main/.env.production

Create `apps/main/.env.production` on the server (git-ignored):

```bash
# apps/main/.env.production  — server only, never committed to git
NEXT_PUBLIC_SUPABASE_URL=https://<your-real-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-real-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-real-service-role-key>
```

> **Note:** Next.js automatically reads `.env.production` when `NODE_ENV=production`.

---

## Step 2 — Deploy

```bash
cd /root/iiskills-cloud-apps   # or wherever deploy-all.sh lives
./deploy-all.sh
```

`deploy-all.sh` performs these steps automatically:

1. Sources `/etc/iiskills.env` for credentials
2. Stops existing PM2 processes (only iiskills-\*)
3. Backs up the previous checkout and fresh-clones from GitHub
4. Installs dependencies (`yarn install`)
5. Runs the OTP policy guard (CI test)
6. Builds all packages (`yarn turbo run build`)
7. **Verifies `apps/main/.next/BUILD_ID` exists** — aborts if missing
8. **Verifies no placeholder strings in `apps/main/.next/static`** — aborts if found
9. Starts PM2 processes for main + learn apps

If any verification step fails, the script exits **without** starting PM2 processes
(preventing a broken build from serving traffic).

---

## Step 3 — Verify

### Smoke test the main app:

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
# Expected: 200
```

### Check BUILD_ID exists:

```bash
ls -la /root/iiskills-cloud-apps/apps/main/.next/BUILD_ID
# Should show a file with recent timestamp
```

### Verify no placeholder strings in compiled bundle:

```bash
cd /root/iiskills-cloud-apps
node scripts/verify-build-env.js --app=apps/main
# Expected: ✓ Verification passed — no placeholder strings in bundle
```

### Manual grep check:

```bash
grep -r "your-anon-key-here\|your-project-url-here\|placeholder.supabase.co" \
  /root/iiskills-cloud-apps/apps/main/.next/static
# Expected: no output (zero matches)
```

### Check PM2 status:

```bash
pm2 status
# All iiskills-* processes should be "online"
```

---

## Troubleshooting

### "SUPABASE MOCK MODE" in logs / "No database connection"

The app has entered mock mode, meaning Supabase credentials were not set at
**build time**. The `NEXT_PUBLIC_*` values in `.env.production` or `/etc/iiskills.env`
were not available when `yarn turbo run build` ran.

**Fix:**

1. Ensure `/etc/iiskills.env` contains real `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Delete the old build: `rm -rf /root/iiskills-cloud-apps/apps/main/.next`
3. Rebuild: `yarn turbo run build --filter=main`
4. Verify: `node scripts/verify-build-env.js --app=apps/main`

### `apps/main/.next/BUILD_ID` not found

The Next.js build for `apps/main` failed. Check the deploy log file (printed at the
start of `deploy-all.sh` output, e.g. `/var/log/iiskills/deploy-YYYY-MM-DD-HHMM.log`)
for build errors.

### PM2 process crashed (502 from nginx)

```bash
pm2 logs iiskills-main --lines 50
pm2 restart iiskills-main
```

If the build is valid but the app crashes at startup, the most likely cause is
missing server-side environment variables (like `SUPABASE_SERVICE_ROLE_KEY`).

### OTP guard failed

The CI guard `tests/noOtpRemnants.test.js` is blocking the deploy. Remove any OTP
remnants before deploying.

---

## Module Format Notes

- `lib/supabaseClient.js` uses **ESM** (`import`/`export`). All consumers (apps/main
  through `@iiskills/ui`, learn-\* apps) use the same file via webpack/Turbopack bundling.
- The `require()` call inside `lib/supabaseClient.js` (for `localContentProvider.js`)
  is guarded by `NEXT_PUBLIC_USE_LOCAL_CONTENT === "true"` and
  `typeof window === "undefined"`. Webpack replaces the env var at build time, so for
  all production builds the branch is dead code and is eliminated.
- **Never** add `|| "your-anon-key-here"` or `|| "placeholder-key"` fallbacks to
  Supabase client initialization code — these strings get compiled into `.next/static`
  and will be detected by `yarn verify:build-no-placeholders`.

---

## Deploy Script Reference

Located at: `deploy-all.sh` (root of repo, deployed to `/root/iiskills-cloud-apps/`)

Environment variables that control the deploy:

| Variable                         | Default                    | Description             |
| -------------------------------- | -------------------------- | ----------------------- |
| `IISKILLS_MAX_OLD_SPACE_SIZE_MB` | auto (½ RAM, 1024–4096 MB) | Node.js heap limit      |
| `IISKILLS_TURBO_CONCURRENCY`     | 2                          | Turbo build parallelism |

All deploy output is logged to `/var/log/iiskills/deploy-<timestamp>.log` (or
`/tmp/iiskills-deploy-<timestamp>.log` if the log dir is not writable).

---

## Monorepo Architecture

This repository is a **Yarn 4 workspaces** monorepo orchestrated by **Turborepo**.

### Workspace Layout

```
apps/               # Deployable Next.js applications
  main/             # Production main site (port 3000)
  learn-ai/         # AI learning app
  learn-apt/        # APT learning app (free)
  learn-chemistry/  # Chemistry app (free)
  learn-developer/  # Developer learning app (paid)
  learn-geography/  # Geography app (free)
  learn-management/ # Management learning app (paid)
  learn-math/       # Math learning app (free)
  learn-physics/    # Physics learning app (free)
  learn-pr/         # PR learning app (paid)

packages/           # Shared, reusable workspace packages
  access-control/   # @iiskills/access-control — entitlement and payment guards
  config/           # @iiskills/config — shared security headers, course display order
  content/          # @iiskills/content — Git-based course/lesson content
  content-loader/   # @iiskills/content-loader — static filesystem content loader (server-only)
  content-sdk/      # @iiskills/content-sdk — content discovery and management SDK (TypeScript)
  core/             # @iiskills/core — schema-driven UI library (TypeScript)
  schema/           # @iiskills/schema — unified content type definitions (TypeScript)
  shared-components/ # @iiskills/shared-components — cross-app React components
  shared-utils/     # @iiskills/shared-utils — shared lib/utils helpers
  styles/           # @iiskills/styles — global Tailwind CSS base styles
  ui/               # @iiskills/ui — primary shared UI component library

scripts/            # DevOps and developer tooling (not deployed)
nginx/              # Nginx virtual-host configs and templates
supabase/           # Database migrations, schema, and seed files
docs/               # Developer documentation
```

### Strict Boundary Rules

1. **No source code in the root.** The root contains only config presets
   (ESLint, Prettier, Tailwind, Turbo, PostCSS), workspace orchestration
   (`package.json`, `yarn.lock`), and infrastructure scripts.

2. **Shared logic lives in `/packages`.** React components go in
   `@iiskills/ui` or `@iiskills/shared-components`. Utility functions go
   in `@iiskills/shared-utils`. Styles go in `@iiskills/styles`.

3. **Apps import from packages, never from each other.** Cross-app imports
   are forbidden. Use the workspace package instead.

4. **Configs extend base presets.** Each app's `tailwind.config.js` extends
   the root config; each app's `next.config.js` imports security headers
   from `@iiskills/config`.

### Adding a New App

Use the scaffold generator:

```bash
node scripts/create-app.js learn-<topic> --type=<free|paid>
```

This creates the full app skeleton under `apps/learn-<topic>/` with the
correct structure, config files, and component usage patterns.

### Developer Convenience Scripts

Each app can be started individually:

| Script                      | App started           |
| --------------------------- | --------------------- |
| `yarn dev:main`             | apps/main (port 3000) |
| `yarn dev:learn-ai`         | apps/learn-ai         |
| `yarn dev:learn-apt`        | apps/learn-apt        |
| `yarn dev:learn-chemistry`  | apps/learn-chemistry  |
| `yarn dev:learn-developer`  | apps/learn-developer  |
| `yarn dev:learn-geography`  | apps/learn-geography  |
| `yarn dev:learn-management` | apps/learn-management |
| `yarn dev:learn-math`       | apps/learn-math       |
| `yarn dev:learn-physics`    | apps/learn-physics    |
| `yarn dev:learn-pr`         | apps/learn-pr         |

