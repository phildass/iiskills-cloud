# Admin Authentication

## Overview

Admin access to `/admin` is protected by a **password (passphrase)-based** authentication flow.
No Supabase user account is required. Authentication state is managed via a signed, HttpOnly
session cookie (`admin_session`).

---

## First Access — Initial Setup (No Passphrase Set)

On a fresh installation no passphrase is stored. The system uses a built-in bootstrap
passphrase (`iiskills123`) for the very first login.

1. Visit `/admin/login`.
2. Enter the default bootstrap passphrase `iiskills123`.
3. You will be redirected to `/admin/setup` to set a strong, permanent passphrase.
4. Choose a passphrase of **at least 8 characters** and save it.
5. The passphrase is hashed with **bcrypt (12 rounds)** and stored in
   `/var/lib/iiskills/admin.json` (override with the `ADMIN_DATA_FILE` env var).
6. You are immediately logged in and redirected to `/admin`.

> **Important:** After setup, the bootstrap passphrase is no longer accepted.
> Only the new passphrase (stored as a bcrypt hash) grants access.

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
| `TEST_ADMIN_MODE`           | No       | Set to `true` in CI/test environments. Passphrase is read from `ADMIN_PANEL_SECRET` → `ADMIN_SECRET` → `"iiskills123"`. No file reads. |

---

## Password Reset

There is no self-service password reset. To reset the passphrase:

1. **SSH into the server.**
2. Delete or edit the admin data file:
   ```bash
   rm /var/lib/iiskills/admin.json
   # OR set a new hash directly (using bcrypt CLI or a one-time script)
   ```
3. Alternatively, set `ADMIN_PANEL_SECRET=<new-emergency-passphrase>` in the PM2
   environment and restart the server. This acts as an override that bypasses the
   file-based hash.
4. Log in with the bootstrap passphrase (`iiskills123`) or the `ADMIN_PANEL_SECRET`
   override, and set a new permanent passphrase via `/admin/setup`.

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
