# Admin Testing Mode

This document explains how to enable **TEST_ADMIN_MODE** so the admin panel works
without a Supabase database connection.  This is intended **only for the testing
period**; production should use `TEST_ADMIN_MODE=false` (the default) with
Supabase-based authentication.

---

## How it works

| Env var | Value | Effect |
|---|---|---|
| `TEST_ADMIN_MODE` | `true` | Enable test mode (no DB required) |
| `TEST_ADMIN_MODE` | `false` or unset | Production mode (Supabase auth) |
| `ADMIN_PANEL_SECRET` | your passphrase | Override the default test passphrase |
| `ADMIN_SECRET` | your passphrase | Alias for `ADMIN_PANEL_SECRET` (lower priority) |
| `ADMIN_SESSION_SIGNING_KEY` | a long random secret | Signs the session cookie (required) |

When `TEST_ADMIN_MODE=true`:

1. The admin passphrase is read **only** from env vars — no database write or read.
   - Primary: `ADMIN_PANEL_SECRET`
   - Fallback alias: `ADMIN_SECRET`
   - Default (if neither is set): `iiskills123`
2. The `/admin/setup` page is disabled and redirects to `/admin` with an
   informational message.
3. No Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are
   required for admin login.
4. A signed **HttpOnly** `admin_session` cookie is issued on successful login.

---

## Server setup (PM2 — `iiskills-main`)

### Temporary (until next reboot)

```bash
export TEST_ADMIN_MODE="true"
export ADMIN_PANEL_SECRET="iiskills123"
export ADMIN_SESSION_SIGNING_KEY="$(openssl rand -hex 32)"
pm2 restart iiskills-main --update-env
```

> **Note:** Replace `iiskills123` with a stronger passphrase for any shared
> environment.  The signing key must be kept secret; generate a new one with
> `openssl rand -hex 32`.

### Verify the env vars were applied

```bash
pm2 env iiskills-main | grep -E "TEST_ADMIN_MODE|ADMIN_PANEL_SECRET|ADMIN_SESSION_SIGNING_KEY"
```

### Making the settings persist across reboots

`export` only lasts until the next reboot or PM2 reload.  To persist across
reboots you have two options:

**Option A — PM2 ecosystem config** (recommended if you use `ecosystem.config.js`):

```js
// ecosystem.config.js
{
  name: 'iiskills-main',
  env: {
    TEST_ADMIN_MODE: 'true',
    ADMIN_PANEL_SECRET: 'your-secret-here',
    ADMIN_SESSION_SIGNING_KEY: 'your-signing-key-here',
    // ... other vars
  }
}
```

Then:
```bash
pm2 restart ecosystem.config.js --env production
pm2 save
```

**Option B — systemd / shell startup file**:

Add the `export` lines to the file that sources your PM2 environment (e.g.
`/etc/environment`, `~/.bashrc`, or a systemd unit `EnvironmentFile`), then:

```bash
pm2 save
pm2 startup   # follow the printed instructions if you haven't already
```

---

## Changing the passphrase

Update `ADMIN_PANEL_SECRET` and restart:

```bash
export ADMIN_PANEL_SECRET="my-new-secure-passphrase"
pm2 restart iiskills-main --update-env
```

All existing `admin_session` cookies will be invalidated automatically because
the session signing key is the same; users will be asked to log in again with the
new passphrase.

---

## Reverting to production (Supabase) auth

```bash
pm2 restart iiskills-main --update-env \
  TEST_ADMIN_MODE=false
# or simply unset it in your ecosystem config and restart
```

With `TEST_ADMIN_MODE=false` (the default):

- `iiskills123` is **not** accepted unless it has been explicitly stored as the
  admin passphrase hash in Supabase.
- The `/admin/setup` flow is re-enabled so a real passphrase can be written to the
  database.
- Supabase keys (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) must be
  present.
