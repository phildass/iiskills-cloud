# IISkills Cloud — Monorepo

This is the rebuilt IISkills Cloud monorepo using **Yarn Classic (v1)** workspaces and **Next.js**.

> The original repository snapshot is preserved in [`monorepobackup/`](./monorepobackup/) (frozen, safe to delete once the new build is stable).

## Structure

```
.
├── apps/
│   ├── web/             # Main landing page (port 3000)
│   ├── admin/           # Admin dashboard shell (port 3001, basePath /admin)
│   └── learn-physics/   # Physics learning app (port 3002)
├── packages/
│   ├── ui/              # Universal navbar, layout (shared across all apps)
│   ├── content/         # Git-based content source of truth
│   └── core/            # Shared types & helpers
└── monorepobackup/      # Frozen snapshot of previous repo (2026-02-24)
```

## Dev Commands

```bash
# Install all dependencies
yarn install

# Run all apps in dev mode (via Turbo)
yarn dev

# Run individual apps
yarn dev:web            # http://localhost:3000
yarn dev:admin          # http://localhost:3001/admin
yarn dev:learn-physics  # http://localhost:3002

# Build all apps
yarn build

# Lint all apps
yarn lint
```

## Environments

| Environment | URL | Notes |
|-------------|-----|-------|
| Staging (current) | https://app.iiskills.cloud | Served from `apps/` via `deploy-all.sh` |
| Production (future) | https://iiskills.cloud | DNS + Nginx flip when ready to cut over |

Learn apps are served at their own subdomains (e.g. `https://learn-apt.iiskills.cloud`).

## Apps

| App | Description | Port | Notes |
|-----|-------------|------|-------|
| `apps/main` | Main production app + admin at `/admin` | 3000 | Admin secured by Supabase auth |
| `apps/learn-physics` | Physics learning app | 3002 | Reads from `packages/content` |

## Packages

| Package | Description |
|---------|-------------|
| `packages/ui` | Universal navbar (with Google Translate hook), Layout |
| `packages/content` | Git-based content: courses, modules, lessons as JSON/Markdown |
| `packages/core` | Shared types and utility helpers |

## Content Structure

Content lives in `packages/content/courses/<course-id>/`:
- `course.json` — metadata (title, hours, modules list)
- `modules/<module-id>/<lesson>.md` — lesson content with YAML frontmatter

## Google Translate

The universal navbar (`packages/ui/src/common/Header.js`) includes a Google Translate widget
rendered **once** in the always-visible part of the header (desktop and mobile).

- **Default: enabled** – the widget shows automatically in every app.
- **To disable** in a specific app, set `NEXT_PUBLIC_DISABLE_GOOGLE_TRANSLATE=true` in that
  app's `.env.local`.

> **Troubleshooting:** If the translate widget is missing, check that the element
> `#google_translate_element` exists in the DOM (it should appear inside the `<nav>` element)
> and that `NEXT_PUBLIC_DISABLE_GOOGLE_TRANSLATE` is not `true`.

---

## Security Hardening

### Security Headers

All Next.js apps import `config/security-headers.js` and apply the following headers via
`next.config.js → headers()`:

| Header | Value |
|--------|-------|
| `Content-Security-Policy` | Restricts script/style/frame/connect sources; allows Supabase, Razorpay, and Google Translate |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` (production only) |
| `X-Frame-Options` | `SAMEORIGIN` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Disables camera, microphone; allows geolocation and payment for self |
| `X-XSS-Protection` | `1; mode=block` |

`productionBrowserSourceMaps: false` is set on all apps to avoid exposing source code in production.

### Rate Limiting

`apps/main/middleware.js` implements in-process sliding-window rate limiting for sensitive routes:

| Route group | Limit (default) | Window |
|-------------|-----------------|--------|
| `/api/auth/*` | 10 req | 1 min |
| `/api/pay`, `/api/payment/*`, `/api/verify-otp` | 5 req | 1 min |
| `/admin/*` | 30 req | 1 min |

Override defaults via environment variables:
```
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_AUTH_MAX=10
RATE_LIMIT_PAYMENT_MAX=5
RATE_LIMIT_ADMIN_MAX=30
```

### Admin Route Protection

The admin panel (`/admin/*`) is protected by:

1. **Passphrase authentication** — `ADMIN_PANEL_SECRET` (checked via `x-admin-secret` header or signed `admin_session` cookie).
2. **Signed session cookie** — `admin_session`; `HttpOnly; Secure; SameSite=Lax`; expires in 12 hours; signed with `ADMIN_SESSION_SIGNING_KEY`.
3. **Optional IP allowlist** — Set `ADMIN_IP_ALLOWLIST=1.2.3.4,5.6.7.8` to restrict access to specific IPs.

Required environment variables for admin auth (production):

```
ADMIN_PANEL_SECRET=<strong-passphrase>
ADMIN_SESSION_SIGNING_KEY=<32+-char-random-string>   # openssl rand -base64 64
```

> **Dev/staging:** Set `ADMIN_AUTH_DISABLED=true` and `NEXT_PUBLIC_DISABLE_ADMIN_GATE=true` to bypass authentication locally.

### Razorpay Payment Gateway

#### Test mode (no real charges)

To run Razorpay in a **production deployment** using test keys (safe, no live charges):

```
RAZORPAY_MODE=test
RAZORPAY_KEY_ID=rzp_test_<your-test-key-id>
RAZORPAY_KEY_SECRET=<your-test-secret>
RAZORPAY_WEBHOOK_SECRET=<your-webhook-secret>
```

The `/api/pay` endpoint validates that `rzp_test_*` keys are used when `RAZORPAY_MODE=test` and
refuses to create orders if live keys are accidentally configured.

#### Webhook security

`/api/payment/webhook` verifies the `x-razorpay-signature` header using HMAC-SHA256 and
`crypto.timingSafeEqual` before processing any payment event.

#### Go-live (real charges)

Switch to live mode by updating:
```
RAZORPAY_MODE=live
RAZORPAY_KEY_ID=rzp_live_<your-live-key-id>
RAZORPAY_KEY_SECRET=<your-live-secret>
RAZORPAY_WEBHOOK_SECRET=<your-live-webhook-secret>
```

### Supabase / Secrets

- `SUPABASE_SERVICE_ROLE_KEY` is **never** exposed to the browser. It is only used in server-side
  API routes via `createServiceRoleClient()` in `apps/main/lib/adminAuth.js`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the public anon key (safe for client use).
- Server-side Supabase clients use the service role key to bypass RLS for admin operations.

### Required Production Environment Variables (summary)

Copy `.env.production.example` to each app's `.env.local` (or set via your deployment platform):

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Admin
ADMIN_PANEL_SECRET=
ADMIN_SESSION_SIGNING_KEY=

# Razorpay (test or live)
RAZORPAY_MODE=test          # or live
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# Security flags (all must be false in production)
ADMIN_AUTH_DISABLED=false
NEXT_PUBLIC_DISABLE_ADMIN_GATE=false
NEXT_PUBLIC_DISABLE_AUTH=false
```

