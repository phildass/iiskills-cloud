# Safe Deploy Runbook — iiskills-main

This document explains how to deploy the `apps/main` Next.js application
(PM2 process **`iiskills-main`**, port **3000**) safely and roll back when needed.

---

## Table of contents

1. [Overview](#1-overview)
2. [Prerequisites](#2-prerequisites)
3. [Running the deploy script](#3-running-the-deploy-script)
4. [What the script does (step by step)](#4-what-the-script-does)
5. [If the build fails](#5-if-the-build-fails)
6. [Rolling back](#6-rolling-back)
7. [Enabling / disabling TEST_ADMIN_MODE](#7-enabling--disabling-test_admin_mode)
8. [Environment variable setup with PM2 ecosystem file](#8-environment-variable-setup-with-pm2-ecosystem-file)
9. [Pre-flight checks](#9-pre-flight-checks)
10. [Deploy logs](#10-deploy-logs)

---

## 1. Overview

The deploy pipeline guarantees **no-downtime on failed builds**:

```
git pull → yarn build → (build OK?) → pm2 restart → health check
                             ↓ NO
                    ABORT — PM2 is NOT restarted
                    Previous .next build is restored
```

Key properties:

| Property | Behaviour |
|---|---|
| Concurrent deploys | Prevented by `flock` on `/tmp/iiskills-main-deploy.lock` |
| Failed build | PM2 is **never** restarted; site remains up |
| Health check | `GET http://127.0.0.1:3000/api/health` must return `200` within 60 s |
| Last-known-good build | Saved to `apps/main/.next.prev` before every build |
| Previous git SHA | Captured before `git reset --hard` for manual git rollback |
| Logs | Written to `logs/deploy-main/<timestamp>.log` |

---

## 2. Prerequisites

Ensure the following are available on the server:

| Tool | Version |
|---|---|
| Node.js | ≥ 18 |
| Yarn | ≥ 4 (berry) |
| PM2 | any recent version |
| `curl` | standard |
| `flock` | standard (part of `util-linux`) |
| `git` | standard |

The file `apps/main/.env.local` must exist and contain the correct env vars
(see [section 8](#8-environment-variable-setup-with-pm2-ecosystem-file)).

---

## 3. Running the deploy script

```bash
# From the repo root on the server:
bash scripts/deploy-main-safe.sh
```

### Options

| Flag | Effect |
|---|---|
| `--skip-preflight` | Skip `scripts/preflight-main.sh` (e.g. in CI where checks run separately) |
| `--port PORT` | Override the health-check port (default: `3000`) |

Example — skip pre-flight and use a custom port:

```bash
bash scripts/deploy-main-safe.sh --skip-preflight --port 3000
```

---

## 4. What the script does

| Step | Action |
|---|---|
| 0 | Runs `scripts/preflight-main.sh` (unless `--skip-preflight`) |
| 1 | Verifies the working tree is clean (no uncommitted changes) |
| 2 | Records `PREV_SHA=$(git rev-parse HEAD)` for rollback |
| 3 | `git fetch origin && git checkout main && git reset --hard origin/main` |
| 4 | `yarn install --immutable` (deterministic deps) |
| 5 | Copies `apps/main/.next` → `apps/main/.next.prev` (last-known-good backup) |
| 6 | `cd apps/main && yarn build` — **exits non-zero on failure; PM2 untouched** |
| 7 | Validates `apps/main/.next/BUILD_ID` exists |
| 8 | `pm2 restart iiskills-main --update-env` |
| 9 | Polls `http://127.0.0.1:3000/api/health` until `200` (up to 60 s); rolls back on failure |

---

## 5. If the build fails

When `yarn build` exits non-zero:

1. The script **does not restart PM2**.
2. The previous `.next.prev` build is restored to `.next` so the running site
   stays healthy.
3. The script exits with code `1`.
4. Full build output is in `logs/deploy-main/<timestamp>.log`.

**Inspect the failure:**

```bash
# Show the last deploy log
ls -lt logs/deploy-main/ | head -5
tail -100 logs/deploy-main/<timestamp>.log
```

---

## 6. Rolling back

### Option A — restore the last-known-good build artefact (fastest)

```bash
# On the server, from the repo root:
mv apps/main/.next apps/main/.next.broken
mv apps/main/.next.prev apps/main/.next
pm2 restart iiskills-main --update-env
```

### Option B — git rollback and rebuild

```bash
# The deploy script prints PREV_SHA at the start of the log.
# Replace <sha> with the value from the log:
git reset --hard <sha>
cd apps/main
yarn build
pm2 restart iiskills-main --update-env
```

### Option C — full fresh deploy from a known-good tag

```bash
git fetch origin
git checkout tags/<tag>   # e.g. v2025-01-15
yarn install --immutable
cd apps/main && yarn build && cd ../..
pm2 restart iiskills-main --update-env
```

---

## 7. Enabling / disabling TEST_ADMIN_MODE

`TEST_ADMIN_MODE=true` activates password-only admin authentication (no Supabase required).

### Enable test mode

1. Edit `apps/main/.env.local` (or the ecosystem env block — see section 8):

   ```env
   TEST_ADMIN_MODE=true
   ADMIN_SESSION_SIGNING_KEY=<random-32+-chars>
   # ADMIN_PANEL_SECRET is optional in test mode; defaults to iiskills123
   # ADMIN_PANEL_SECRET=iiskills123
   ```

2. Reload env vars and restart:

   ```bash
   pm2 restart iiskills-main --update-env
   ```

3. Log in at `https://app.iiskills.cloud/admin/login` using the passphrase
   (`iiskills123` if `ADMIN_PANEL_SECRET` is not set).

### Disable test mode (go to production)

1. Set a strong secret before disabling test mode:

   ```env
   TEST_ADMIN_MODE=false
   ADMIN_PANEL_SECRET=<strong-random-secret>
   ADMIN_SESSION_SIGNING_KEY=<random-32+-chars>
   NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
   ```

2. Never commit `.env.local` — it is in `.gitignore`.

3. Run preflight checks to validate the config:

   ```bash
   bash scripts/preflight-main.sh
   ```

---

## 8. Environment variable setup with PM2 ecosystem file

The repo includes `ecosystem.config.js` at the repo root which PM2 uses to
manage all apps. It is **the recommended way** to set persistent env vars so
they survive server reboots.

### Persisting env vars in ecosystem.config.js

Open `ecosystem.config.js` and add/update the `env` block for `iiskills-main`:

```js
{
  name: "iiskills-main",
  cwd: path.join(__dirname, 'apps/main'),
  // ...existing fields...
  env: {
    NODE_ENV: "production",
    PORT: 3000,
    // Admin auth
    ADMIN_PANEL_SECRET: "your-strong-secret-here",
    ADMIN_SESSION_SIGNING_KEY: "your-signing-key-here",
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: "https://<project>.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "<anon-key>",
    SUPABASE_SERVICE_ROLE_KEY: "<service-role-key>",
  }
}
```

> ⚠️ **Security**: `ecosystem.config.js` is committed to git. Do **not** put
> real secrets in it. Instead, use a separate file that is excluded from git:

```bash
# Create a file that is sourced before pm2 starts, or use a secrets manager.
# Alternatively, keep secrets only in apps/main/.env.local (already gitignored).
```

After editing, apply the new env vars without downtime:

```bash
pm2 reload ecosystem.config.js --only iiskills-main --update-env
```

Or use the deploy script which automatically passes `--update-env` on restart.

### Saving the PM2 process list for auto-start on reboot

```bash
pm2 save
pm2 startup   # follow the printed instructions to install the systemd/init script
```

---

## 9. Pre-flight checks

Run the pre-flight script at any time to verify the server environment is ready
for deployment:

```bash
bash scripts/preflight-main.sh
```

In TEST_ADMIN_MODE:

```bash
TEST_ADMIN_MODE=true bash scripts/preflight-main.sh
```

The script checks:

- Node.js ≥ 18
- Yarn ≥ 4
- Required env vars (differs by mode — see inline comments in the script)
- Port 3000 availability (informational)

---

## 10. Deploy logs

All deploy runs write a timestamped log to:

```
logs/deploy-main/YYYYMMDD-HHMMSS.log
```

To view recent logs:

```bash
ls -lt logs/deploy-main/ | head -10
tail -f logs/deploy-main/<timestamp>.log
```

The `logs/` directory is gitignored; logs are retained on the server only.
