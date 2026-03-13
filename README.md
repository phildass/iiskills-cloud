# IISkills Cloud — Monorepo

This is the IISkills Cloud monorepo following a **Strict Monorepo Pattern** using **Yarn 4** workspaces and **Turborepo**.

## Structure

```
.
├── apps/
│   ├── main/                  # Production main site + admin at /admin (port 3000)
│   └── learn-*/               # Learning apps (various ports)
├── packages/
│   ├── ui/                    # Shared React UI component library (@iiskills/ui)
│   ├── shared-utils/          # Shared lib/ and utils/ helpers (@iiskills/shared-utils)
│   │   ├── lib/               # Server & client utilities (auth, content, payments, etc.)
│   │   └── utils/             # Client-side utility helpers (pricing, data, etc.)
│   ├── shared-components/     # Shared React components for all apps (@iiskills/shared-components)
│   ├── config/                # Shared configuration presets (@iiskills/config)
│   │   ├── security-headers.js
│   │   ├── courseDisplayOrder.js
│   │   └── content-banlist.json
│   ├── styles/                # Shared global CSS (@iiskills/styles)
│   ├── content/               # Git-based content source of truth
│   ├── content-loader/        # Content loading utilities
│   ├── content-sdk/           # Content SDK
│   ├── access-control/        # Access control utilities
│   ├── schema/                # Shared schema definitions
│   └── core/                  # Shared types & helpers
├── scripts/                   # DevOps & CI scripts (never bundled)
├── nginx/                     # Nginx configuration templates
├── supabase/                  # Supabase migrations and schema
└── docs/                      # Architecture and operational documentation
```

### Root Boundary Enforcement

The root of the repository contains **only**:
- Configuration presets (`turbo.json`, `eslint.config.mjs`, `tailwind.config.js`, `postcss.config.js`)
- Infrastructure scripts (`deploy-all.sh`, `scripts/`, `nginx/`, `supabase/`)
- Workspace orchestration (`package.json`, `yarn.lock`, `turbo.json`)

No application source code lives at the root. All shared logic lives in `packages/`.

## Dev Commands

```bash
# Install all dependencies
yarn install

# Run all apps in dev mode (via Turbo)
yarn dev

# Run individual apps
yarn dev:main           # http://localhost:3000
yarn dev:learn-physics  # http://localhost:3002

# Build all apps
yarn build

# Lint all apps
yarn lint
```

## Environments

| Environment | URL                    | Notes                                   |
| ----------- | ---------------------- | --------------------------------------- |
| Production  | https://iiskills.cloud | Served from `apps/` via `deploy-all.sh` |

Learn apps are served at their own subdomains (e.g. `https://learn-apt.iiskills.cloud`).

## Apps

| App                  | Description                             | Port | Notes                          |
| -------------------- | --------------------------------------- | ---- | ------------------------------ |
| `apps/main`          | Main production app + admin at `/admin` | 3000 | Admin secured by password auth |
| `apps/learn-physics` | Physics learning app                    | 3002 | Reads from `packages/content`  |

## Packages

| Package                        | Description                                                        |
| ------------------------------ | ------------------------------------------------------------------ |
| `packages/ui`                  | Shared React UI component library (navbar, layout, auth, payments) |
| `packages/shared-utils`        | Shared lib/ and utils/ helpers (auth, content, payments, etc.)     |
| `packages/shared-components`   | Shared React components used across all learn apps via `@shared`   |
| `packages/config`              | Shared config presets: security headers, course order, banlist     |
| `packages/styles`              | Shared global CSS baseline                                         |
| `packages/content`             | Git-based content: courses, modules, lessons as JSON/Markdown      |
| `packages/content-loader`      | Content loading utilities                                          |
| `packages/content-sdk`         | Content SDK                                                        |
| `packages/access-control`      | Access control utilities                                           |
| `packages/schema`              | Shared schema definitions                                          |
| `packages/core`                | Shared types and utility helpers                                   |

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

All Next.js apps import `packages/config/security-headers.js` and apply the following headers via
`next.config.js → headers()`:

| Header                      | Value                                                                                         |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`   | Restricts script/style/frame/connect sources; allows Supabase, Razorpay, and Google Translate |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` (production only)                                       |
| `X-Frame-Options`           | `SAMEORIGIN`                                                                                  |
| `X-Content-Type-Options`    | `nosniff`                                                                                     |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`                                                             |
| `Permissions-Policy`        | Disables camera, microphone; allows geolocation and payment for self                          |
| `X-XSS-Protection`          | `1; mode=block`                                                                               |

`productionBrowserSourceMaps: false` is set on all apps to avoid exposing source code in production.

### Rate Limiting

`apps/main/middleware.js` implements in-process sliding-window rate limiting for sensitive routes:

| Route group                  | Limit (default) | Window |
| ---------------------------- | --------------- | ------ |
| `/api/auth/*`                | 10 req          | 1 min  |
| `/api/pay`, `/api/payment/*` | 5 req           | 1 min  |
| `/admin/*`                   | 30 req          | 1 min  |

Override defaults via environment variables:

```
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_AUTH_MAX=10
RATE_LIMIT_PAYMENT_MAX=5
RATE_LIMIT_ADMIN_MAX=30
```

### Admin Route Protection

The admin panel (`/admin/*`) uses **password-based authentication only** — no Supabase user accounts are involved in admin access.

#### How it works

1. **First access** — Set `ADMIN_PANEL_SECRET` in `/etc/iiskills.env` before the first login. Admin login is blocked (503) if no passphrase is configured — there is no default or bootstrap passphrase.
2. **Regular login** — Visit `/admin/login`, enter your passphrase. The server verifies it against the stored bcrypt hash (or `ADMIN_PANEL_SECRET`) and issues a signed `admin_session` cookie (12-hour expiry).
3. **Emergency override** — If `ADMIN_PANEL_SECRET` is set as an env var, it bypasses the file-based hash and grants access directly (useful after a reset). Unset this var once the hash is re-established.
4. **Session** — `admin_session` is `HttpOnly; Secure; SameSite=Lax`, signed with `ADMIN_SESSION_SIGNING_KEY`.
5. **Optional IP allowlist** — Set `ADMIN_IP_ALLOWLIST=1.2.3.4,5.6.7.8` to restrict access to specific IPs.

Required environment variables for admin auth (production):

```
ADMIN_SESSION_SIGNING_KEY=<32+-char-random-string>   # openssl rand -base64 64
ADMIN_PANEL_SECRET=<strong-passphrase>               # required to log in initially
```

Optional:

```
ADMIN_IP_ALLOWLIST=1.2.3.4,5.6.7.8                  # optional IP restriction
ADMIN_DATA_FILE=/custom/path/admin.json              # default: /var/lib/iiskills/admin.json
```

> **Dev/staging:** Set `ADMIN_AUTH_DISABLED=true` and `NEXT_PUBLIC_DISABLE_ADMIN_GATE=true` to bypass authentication locally.

#### Password setup workflow

```bash
# 1. Before first deploy, set ADMIN_PANEL_SECRET in /etc/iiskills.env:
#    ADMIN_PANEL_SECRET=<strong-unique-passphrase>
# 2. Restart the server: pm2 restart iiskills-main
# 3. Visit /admin/login and enter your ADMIN_PANEL_SECRET passphrase.
# 4. (Optional) Visit /admin/setup to store a permanent bcrypt hash.
#    Once saved, you can remove ADMIN_PANEL_SECRET from /etc/iiskills.env and restart.
# 5. The hash is saved to /var/lib/iiskills/admin.json (mode 600, owned by the app process user).
#    Ensure the directory /var/lib/iiskills/ is writable by the user running the Node.js process.
```

#### Password reset (server owner access required)

```bash
# Option A: Set ADMIN_PANEL_SECRET as an emergency override, then set a new permanent hash
# In /etc/iiskills.env:
ADMIN_PANEL_SECRET="temporary-recovery-passphrase"
# Restart: pm2 restart iiskills-main
# Log in at /admin/login with the temporary passphrase.
# Then visit /admin/setup to set a new permanent passphrase.
# Afterwards, REMOVE ADMIN_PANEL_SECRET from the environment and restart.
```

> **Note:** All other user authentication (login, registration, paid access) remains Supabase-based and is unaffected by admin authentication changes.

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
