# Production Deployment Guide — iiskills-cloud (apps/main)

This document describes the **repeatable, safe deployment procedure** for the
`iiskills-main` PM2 process that serves `apps/main` on port 3000.

---

## Prerequisites

| Item | Details |
|------|---------|
| Node.js | 18 or 20 LTS |
| Yarn | 4.x (managed via Corepack) |
| PM2 | latest (`npm i -g pm2`) |
| Nginx | Configured to proxy `127.0.0.1:3000 → iiskills.cloud` |

---

## Step 1 — Set Real Environment Variables (never commit secrets)

Create `apps/main/.env.production` on the server (this file is in `.gitignore`):

```bash
# apps/main/.env.production  — server only, never committed to git
NEXT_PUBLIC_SUPABASE_URL=https://<your-real-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-real-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-real-service-role-key>
ADMIN_PANEL_SECRET=<strong-random-secret>
ADMIN_SESSION_SIGNING_KEY=<strong-random-signing-key>
NEXT_PUBLIC_SITE_URL=https://iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
# ... (other non-placeholder values from apps/main/.env.local.example)
```

> **Critical:** `NEXT_PUBLIC_*` variables are **inlined at build time**.
> They must be set in the environment *before* running `yarn build`.
> Setting them only at runtime has no effect on the compiled bundle.

### Verify no placeholders are present:

```bash
cd /root/iiskills-cloud-apps
node scripts/validate-env.js --app=main
```

This script checks `apps/main/.env.production` for placeholder values and exits
with code 1 if any are found.

---

## Step 2 — Build

```bash
cd /root/iiskills-cloud-apps

# Export env vars so Next.js picks them up at build time
set -a
source apps/main/.env.production
set +a

# Remove stale build artefacts
rm -rf apps/main/.next

# Build (turbo caches per-package; --force clears cache)
yarn build
# or for main only:
# cd apps/main && yarn build
```

> **Note:** If using PM2 `ecosystem.config.js`, ensure the `env_production` block
> contains real values for `NEXT_PUBLIC_SUPABASE_URL` and
> `NEXT_PUBLIC_SUPABASE_ANON_KEY` — or source the env file before building.

---

## Step 3 — Verify BUILD_ID Exists

```bash
ls -la apps/main/.next/BUILD_ID
```

If this file is missing, the build failed or was interrupted.
PM2 will crash immediately without it (error: `production-start-no-build-id`).

Do **not** start PM2 until `BUILD_ID` is present.

---

## Step 4 — Verify No Placeholder Strings in Bundle

```bash
yarn verify:build-env:main
# or
node scripts/verify-build-env.js --app=apps/main
```

This script scans `.next/static` for the literal strings `your-anon-key-here`
and `your-project-url-here`. If either is found, the build is bad — the real
env vars were not set at build time. Fix, rebuild, and verify again.

**Expected output on success:**
```
✓ OK: "your-anon-key-here" not found in bundle
✓ OK: "your-project-url-here" not found in bundle
✓ Verification passed — no placeholder strings in bundle
```

---

## Step 5 — Start / Restart PM2

```bash
# First deployment:
pm2 start ecosystem.config.js --env production

# Subsequent deployments (zero-downtime reload):
pm2 reload iiskills-main --update-env

# Or full restart:
pm2 restart iiskills-main --update-env

# Save PM2 process list (survives server reboots):
pm2 save
```

Confirm the process is running:

```bash
pm2 list
pm2 logs iiskills-main --lines 50
```

---

## Step 6 — Verify the App Responds

```bash
# Local check (bypasses Nginx):
curl -sf http://127.0.0.1:3000/ | head -5

# Via Nginx / external domain:
curl -sf https://iiskills.cloud/ | head -5
```

If `curl` returns a 502, check `pm2 logs iiskills-main` for errors such as:
- `production-start-no-build-id` → BUILD_ID missing, rebuild required
- `APPLICATION STARTUP ABORTED` → Supabase env vars missing/invalid in PM2 env
- `EACCES` or `EADDRINUSE` → Port conflict

---

## Troubleshooting

### "No database connection" banner on sign-in

The app is running in **SUPABASE MOCK MODE**. This means the `NEXT_PUBLIC_*`
credentials were invalid at build time. The bundle contains a placeholder rather
than real credentials.

**Fix:**
1. Set real values in `apps/main/.env.production`
2. Run `yarn verify:build-env:main` to confirm before build
3. Rebuild: `rm -rf apps/main/.next && yarn build`
4. Verify again: `yarn verify:build-env:main`
5. Reload PM2: `pm2 reload iiskills-main --update-env`

### "SUPABASE MOCK MODE" in server logs

Same root cause. The server-side Supabase client validates credentials on startup.
In production, the server exits immediately if credentials are missing/invalid
(see `lib/supabaseClient.js`). Check `pm2 logs iiskills-main` for the
`APPLICATION STARTUP ABORTED` message and the specific variable that's invalid.

### PM2 crashes immediately (no-build-id)

The `.next/BUILD_ID` file is missing. The build was incomplete or `.next` was
deleted after building. Rebuild:

```bash
rm -rf apps/main/.next
yarn build
ls -la apps/main/.next/BUILD_ID  # must exist
pm2 restart iiskills-main
```

---

## Env Variable Precedence (Next.js)

| File | Loaded | Committed to git |
|------|--------|-----------------|
| `.env.local` | Dev + production server | ❌ (in .gitignore) |
| `apps/main/.env.production` | Production builds only | ❌ (in .gitignore) |
| `apps/main/.env.local.example` | Never loaded — docs only | ✅ (example only) |
| PM2 `env_production` block | Runtime only (not build-time) | Avoid secrets |

> **Important:** `NEXT_PUBLIC_*` variables must be present in the **build
> environment**, not just the PM2 runtime environment. If you set them only in
> PM2's `env_production` block, they will NOT be compiled into the bundle.
> Use `apps/main/.env.production` and source it before `yarn build`.

---

## Security Checklist

- [ ] Real Supabase credentials set in `apps/main/.env.production` (not committed)
- [ ] `ADMIN_PANEL_SECRET` and `ADMIN_SESSION_SIGNING_KEY` are strong random values
- [ ] `NEXT_PUBLIC_DISABLE_AUTH` is NOT set to `true` in production
- [ ] `NEXT_PUBLIC_DISABLE_PAYWALL` is NOT set to `true` in production
- [ ] `yarn verify:build-env:main` passes (no placeholders in bundle)
- [ ] `ls -la apps/main/.next/BUILD_ID` exists
- [ ] PM2 process is running: `pm2 list`
- [ ] Nginx returns 200: `curl -sf https://iiskills.cloud/`
