# Admin Authentication — Feature Flag Guide

## Overview

The admin section (`/admin`) supports a **testing bypass** that removes all authentication
so you can iterate quickly during development or a testing period.

The bypass is controlled by a single environment variable: `ADMIN_AUTH_DISABLED`.

---

## Environment Variables

| Variable | Side | Purpose |
|---|---|---|
| `ADMIN_AUTH_DISABLED` | Server | Disables all server-side auth checks for admin routes/APIs |
| `NEXT_PUBLIC_ADMIN_AUTH_DISABLED` | Client (baked at build time) | Disables the client-side `AdminGate` redirect to `/admin/login` |

Both variables must be set to `true` together for the full bypass to work.

---

## Enabling the Bypass (Testing Mode)

Add the following to `/etc/iiskills.env` on your VPS (or to `apps/main/.env.local` locally):

```env
ADMIN_AUTH_DISABLED=true
NEXT_PUBLIC_ADMIN_AUTH_DISABLED=true
```

Then rebuild and restart:

```bash
# On VPS — re-run the deploy script (it sources /etc/iiskills.env automatically)
./deploy-all.sh

# Locally
cd apps/main
yarn build && yarn start
```

**Result:**

- `https://iiskills.cloud/admin` — loads directly, no login required.
- `https://iiskills.cloud/admin/login` — redirects to `/admin` (no login page shown).
- All `/api/admin/*` endpoints return data without requiring an `admin_session` cookie.

---

## Disabling the Bypass (Re-enabling Auth)

Set both variables to `false` (or remove them) and redeploy:

```env
ADMIN_AUTH_DISABLED=false
NEXT_PUBLIC_ADMIN_AUTH_DISABLED=false
```

The normal passphrase-based flow (`AdminGate` → `/admin/login` → cookie session) will
resume automatically.

---

## ⚠️ Security Warning

**Never set `ADMIN_AUTH_DISABLED=true` in production with real user or payment data.**

The flag removes every authentication layer from the admin section. Anyone who can reach
`/admin` on your domain will have full admin access without a password.

Acceptable uses:
- Local development
- Staging environments with no real data
- Short-lived testing periods on a locked-down server

---

## How It Works (Code References)

| File | What changes |
|---|---|
| `apps/main/lib/adminAuth.js` | `isAdminAuthDisabled()` helper; `validateAdminRequest()` returns `{ valid: true }` immediately when disabled |
| `apps/main/components/AdminGate.js` | `GATE_DISABLED` is `true` when `NEXT_PUBLIC_ADMIN_AUTH_DISABLED=true` — no redirect to login |
| `apps/main/pages/admin/login.js` | `getServerSideProps` redirects to `/admin` when `ADMIN_AUTH_DISABLED=true` |
| `apps/main/pages/api/admin/health.js` | Returns `{ ok: true, authDisabled: true }` without credential checks when disabled |

To restore full Supabase-based auth later, simply toggle the flag — no code changes needed.
