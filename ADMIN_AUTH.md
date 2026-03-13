# Admin Authentication

## Overview

Admin access to `/admin` is protected by a **password (passphrase)-based** authentication flow.
No Supabase user account is required. Authentication state is managed via a signed, HttpOnly
session cookie (`admin_session`).

---

## First Access — Initial Setup (No Passphrase Set)

On a fresh installation no passphrase is stored. Admin login is **blocked** until a passphrase is
explicitly configured. There is no default or bootstrap passphrase.

To enable admin login for the first time:

1. Set `ADMIN_PANEL_SECRET=<strong-passphrase>` in `/etc/iiskills.env`.
2. Restart the server: `pm2 restart iiskills-main`.
3. Visit `/admin/login` and enter the same passphrase.
4. (Optional) Go to `/admin/setup` to store a permanent bcrypt hash. Once a hash is stored
   you can remove `ADMIN_PANEL_SECRET` from the env file and restart.

> **Important:** A strong, unique passphrase must be configured before the admin panel
> can be accessed. Choose a passphrase of **at least 16 characters** using a password manager.

---

## Subsequent Access

1. Visit `/admin` (or any `/admin/*` page).
2. The client-side `AdminGate` checks `GET /api/admin/health` to validate your
   `admin_session` cookie.
3. If no valid session cookie exists you are redirected to `/admin/login`.
4. Enter your passphrase and submit.
5. The server verifies it against the stored bcrypt hash; on success an `admin_session`
   JWT cookie is issued (12-hour expiry).

---

## Session Cookie

| Property     | Value                  |
|--------------|------------------------|
| Name         | `admin_session`        |
| Algorithm    | HS256 JWT              |
| Signing key  | `ADMIN_SESSION_SIGNING_KEY` env var |
| Expiry       | 12 hours               |
| HttpOnly     | ✅                     |
| Secure       | ✅ (production only)   |
| SameSite     | Lax                    |

---

## Environment Variables

| Variable                    | Required | Description                                                     |
|-----------------------------|----------|-----------------------------------------------------------------|
| `ADMIN_SESSION_SIGNING_KEY` | **Yes**  | Secret key used to sign the admin JWT cookie (min. 32 chars recommended). |
| `ADMIN_DATA_FILE`           | No       | Path to the JSON file storing the bcrypt passphrase hash. Default: `/var/lib/iiskills/admin.json`. |
| `ADMIN_PANEL_SECRET`        | No       | Emergency override passphrase (plain text). If set, overrides the stored hash. Useful for recovery. |
| `ADMIN_IP_ALLOWLIST`        | No       | Comma-separated list of IPv4/IPv6 addresses allowed to access `/admin`. Example: `203.0.113.1,2001:db8::1`. All IPs are allowed when unset. CIDR notation is not supported — use exact addresses. |
| `ADMIN_ALLOWLIST_EMAILS`    | No       | Comma-separated email addresses that have **superadmin** privileges (can create/revoke admin accounts). Not used for general admin authentication. Example: `phil@example.com,ops@example.com`. |
| `ADMIN_AUTH_DISABLED`       | No       | Set to `true` to bypass all admin auth (local dev only — **never in production**). |
| `TEST_ADMIN_MODE`           | No       | Set to `true` in CI/test environments. `ADMIN_PANEL_SECRET` (or `ADMIN_SECRET`) is **required** when this is enabled. No file reads. |

---

## Password Reset

There is no self-service password reset. To reset the passphrase:

1. **SSH into the server.**
2. Set `ADMIN_PANEL_SECRET=<new-emergency-passphrase>` in `/etc/iiskills.env` and restart.
3. Log in at `/admin/login` with the new `ADMIN_PANEL_SECRET` value.
4. Go to `/admin/setup` to store a new permanent bcrypt hash.
5. Once the hash is saved, remove `ADMIN_PANEL_SECRET` from `/etc/iiskills.env` and restart.

---

## Migration Notes — Removing Supabase Admin Checks

The previous admin system supported two access paths:
1. Passphrase / signed cookie (unchanged)
2. Supabase Bearer token (user email in `ADMIN_ALLOWLIST_EMAILS` or `profiles.is_admin = true`)

**Path 2 has been removed.** The following changes were made:

- `apps/main/lib/adminAuth.js`: Removed `checkSupabaseBearerToken()`. Simplified
  `validateAdminRequestAsync()` to delegate directly to `validateAdminRequest()`.
  Simplified `getActorInfo()` to always return `actorType: "password_admin"` without any
  Supabase lookup.
- `apps/main/components/AdminGate.js`: Removed the Supabase session bridge. The gate now
  only validates the `admin_session` cookie via `/api/admin/health`. A 401 response
  redirects directly to `/admin/login`.
- `apps/main/pages/admin/login.js`: Replaced the Supabase login redirect with a
  password-based login form that calls `POST /api/admin/bootstrap-or-login`.
- `apps/main/pages/api/admin/supabase-login.js`: **Deleted.**

### RLS / Supabase flags to clean up (optional)

If you previously relied on `profiles.is_admin` or `admin_invites` for admin access
you may remove those columns/tables from your Supabase schema, or simply leave them
(they are no longer consulted for admin authentication).

The `ADMIN_ALLOWLIST_EMAILS` env var is still used for **superadmin enforcement**
(controlling who can create/revoke admin accounts via `/api/admin/admins`), but it
is no longer used for general admin authentication.

---

## Security Notes

- The passphrase is **never stored or transmitted in plaintext**. Only its bcrypt hash
  is stored on disk.
- The `admin_session` cookie is **HttpOnly** (inaccessible to JavaScript) and **Secure**
  in production.
- Timing-safe comparison (`crypto.timingSafeEqual`) is used for the `ADMIN_PANEL_SECRET`
  emergency override to prevent timing attacks.
- The data file (`/var/lib/iiskills/admin.json`) is written with mode `0o600`
  (owner read/write only).

---

## Troubleshooting — "Invalid passphrase" on Every Attempt

If every passphrase you try is rejected, work through these steps in order:

### 1. Check PM2 / server logs immediately after a failed login attempt

```bash
pm2 logs iiskills-main --lines 30
```

Each login attempt now emits `[adminLogin]` log lines. Look for messages like:

| Log message | Meaning |
|---|---|
| `ADMIN_SESSION_SIGNING_KEY configured: false` | The signing key is missing — env vars are not loaded. See step 2. |
| `ADMIN_PANEL_SECRET is set but did not match` | ADMIN_PANEL_SECRET is loaded but you are not entering its exact value. |
| `Hash file: … — hash present: false` | No stored hash. Only `ADMIN_PANEL_SECRET` will work. |
| `Bcrypt comparison failed` | A hash IS stored but the passphrase you entered does not match it. Use the ADMIN_PANEL_SECRET recovery path (step 3). |
| `Admin login is not configured` | Neither a hash nor `ADMIN_PANEL_SECRET` is set — the admin panel is locked. Set `ADMIN_PANEL_SECRET` and restart. |

### 2. Ensure environment variables are loaded at runtime

```bash
# Check the env file exists and contains the required keys
grep -E "ADMIN_SESSION_SIGNING_KEY|ADMIN_PANEL_SECRET" /etc/iiskills.env

# If missing, add them then restart
pm2 restart iiskills-main
```

> **Why this can fail:** `instrumentation.js` loads `/etc/iiskills.env` when Next.js
> starts. If the file doesn't exist or the keys are absent, `ADMIN_SESSION_SIGNING_KEY`
> will be undefined and every login returns HTTP 500 (check logs).

### 3. Recover access using ADMIN_PANEL_SECRET

1. Add or update `ADMIN_PANEL_SECRET=<strong-secret>` in `/etc/iiskills.env`.
2. Restart: `pm2 restart iiskills-main`.
3. Navigate to `/admin/emergency-login` and enter the same `<strong-secret>` value.
4. Once logged in, go to `/admin/setup` and set a new permanent passphrase.
5. Remove `ADMIN_PANEL_SECRET` from `/etc/iiskills.env` and restart once more.

### 4. Reset access (nuclear option)

If you cannot use `ADMIN_PANEL_SECRET`, delete the admin data file and set a new
`ADMIN_PANEL_SECRET` before restarting:

```bash
rm /var/lib/iiskills/admin.json
# Add or update ADMIN_PANEL_SECRET in /etc/iiskills.env
pm2 restart iiskills-main
```

Then log in with `ADMIN_PANEL_SECRET` at `/admin/login` and set a new permanent passphrase
via `/admin/setup`.

### 5. Verify the fix is actually deployed

```bash
# Confirm the server is running the latest build
pm2 show iiskills-main | grep "cwd\|version"
# Check the build ID
cat /var/www/iiskills-cloud/apps/main/.next/BUILD_ID
```

If the BUILD_ID hasn't changed after a deployment, the old code is still running.
Run a fresh build and restart PM2.
