# newapps/ — Sandbox Clone

This folder is a **runnable, deployable sandbox** of the production `apps/` system.
All Supabase authentication and paywalls are **disabled** here — the apps run fully open.

Production code in `apps/` is **never affected** by this sandbox.

---

## How it works

Each `newapps/<app>/` directory:
- Shares **all source code** with `apps/<app>/` via symlinks (pages, components, lib, styles, public, …)
- Has its **own `.env.local`** that disables auth/Supabase/paywall
- Has its **own `package.json`** (prefixed `sandbox-*`) to avoid workspace name conflicts
- Produces its **own build output** (`.next/` inside `newapps/<app>/`) — entirely separate from production

### Key sandbox env vars (set in each `newapps/<app>/.env.local`)

| Variable | Value | Effect |
|---|---|---|
| `NEXT_PUBLIC_DISABLE_AUTH` | `true` | Auth checks bypassed; mock user returned |
| `NEXT_PUBLIC_SUPABASE_SUSPENDED` | `true` | Supabase replaced by no-op mock client |
| `NEXT_PUBLIC_TESTING_MODE` | `true` | Paywall and premium-lock UI removed |
| `NEXT_PUBLIC_OPEN_ACCESS` | `true` | All content freely accessible |

---

## Ports & Hostnames

The sandbox is configured to run on the **same ports and hostnames** as production.
Run the sandbox instead of production (they cannot run simultaneously on the same ports).

| App | Port | Hostname |
|---|---|---|
| main | 3000 | app.iiskills.cloud |
| learn-apt | 3002 | app1.iiskills.cloud / learn-apt.iiskills.cloud |
| learn-chemistry | 3005 | learn-chemistry.iiskills.cloud |
| learn-developer | 3007 | learn-developer.iiskills.cloud |
| learn-geography | 3011 | learn-geography.iiskills.cloud |
| learn-management | 3016 | learn-management.iiskills.cloud |
| learn-math | 3017 | learn-math.iiskills.cloud |
| learn-physics | 3020 | learn-physics.iiskills.cloud |
| learn-pr | 3021 | learn-pr.iiskills.cloud |
| learn-ai | 3024 | learn-ai.iiskills.cloud |

---

## Build & Deploy

### 1. Build sandbox apps

From the **repo root**:

```bash
yarn sandbox:build
```

This builds every app in `newapps/` using each app's sandbox `.env.local`.

To build a single sandbox app:

```bash
cd newapps/learn-pr && npx next build
```

### 2. Start sandbox with PM2

```bash
# Stop production (sandbox uses the same ports)
pm2 stop ecosystem.config.js

# Start sandbox
pm2 start newapps/ecosystem.config.js

# Start only one sandbox app
pm2 start newapps/ecosystem.config.js --only sandbox-learn-pr
```

### 3. Switch back to production

```bash
pm2 stop newapps/ecosystem.config.js
pm2 start ecosystem.config.js
```

---

## Development mode

Run individual sandbox apps in dev mode:

```bash
cd newapps/learn-pr && npx next dev -p 3021
```

Or use the workspace shortcut from repo root:

```bash
yarn workspace sandbox-learn-pr dev
```

---

## Connecting to a sandbox Supabase project

By default the sandbox runs with `NEXT_PUBLIC_SUPABASE_SUSPENDED=true` — a no-op
mock client is used and no database connection is required.

To point the sandbox at a **dedicated, isolated Supabase project** (fully separate from
production), follow these steps.

### Step 1 — Create a sandbox Supabase project

1. Go to [https://supabase.com](https://supabase.com) and create a **new project**.
   Give it a recognisable name such as `iiskills-sandbox`.
2. After the project is ready, open **Settings → API** and note:
   - **Project URL** (e.g. `https://abcdefgh.supabase.co`)
   - **anon / public** key
   - **service_role** key *(server-only — never expose in the browser)*

### Step 2 — Run migrations (optional but recommended)

The SQL migration files in `supabase/migrations/` define the database schema.

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your sandbox project (run once)
supabase link --project-ref <sandbox-project-ref>

# Apply all migrations
supabase db push
```

If you want to seed from a production export instead:

```bash
# Export data from production (run on a machine with prod access)
supabase db dump --data-only > /tmp/prod-seed.sql

# Import into sandbox
psql "$(supabase db remote connection-string)" < /tmp/prod-seed.sql
```

### Step 3 — Set env vars on the server

Add the following to `/etc/profile.d/sandbox-supabase.sh` (creates a system-wide
file that survives reboots and is sourced automatically by the deploy scripts):

```bash
sudo tee /etc/profile.d/sandbox-supabase.sh > /dev/null << 'EOF'
export SANDBOX_SUPABASE_URL=https://<sandbox-project-ref>.supabase.co
export SANDBOX_SUPABASE_ANON_KEY=<sandbox-anon-key>
export SANDBOX_SUPABASE_SERVICE_ROLE_KEY=<sandbox-service-role-key>
EOF
sudo chmod 644 /etc/profile.d/sandbox-supabase.sh
source /etc/profile.d/sandbox-supabase.sh
```

> **Security**: `/etc/profile.d/sandbox-supabase.sh` is readable by any user on the
> server. If that is a concern, place the file in a root-only location and source it
> from the deploy script instead.

For **local development**, export them in your shell session:

```bash
export SANDBOX_SUPABASE_URL=https://<sandbox-project-ref>.supabase.co
export SANDBOX_SUPABASE_ANON_KEY=<sandbox-anon-key>
export SANDBOX_SUPABASE_SERVICE_ROLE_KEY=<sandbox-service-role-key>
```

Or add them to a local `.env` file that is gitignored:

```bash
# .env  (gitignored — do NOT commit real credentials)
SANDBOX_SUPABASE_URL=https://<ref>.supabase.co
SANDBOX_SUPABASE_ANON_KEY=<anon-key>
SANDBOX_SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

### Step 4 — Build and start the sandbox

Next.js respects already-set `process.env` values over `.env.local` placeholders,
so the real credentials are used automatically when they are exported before the build:

```bash
# With SANDBOX_SUPABASE_* vars already exported:
yarn sandbox:build
pm2 start ecosystem.newapps.config.js
```

The `ecosystem.newapps.config.js` reads `SANDBOX_SUPABASE_URL/ANON_KEY/SERVICE_ROLE_KEY`
from the server environment at PM2 start time and injects them into every sandbox app.
When these vars are present, `NEXT_PUBLIC_SUPABASE_SUSPENDED` is set to `'false'`
automatically — no manual edits are needed.

---

## Health check

A dedicated endpoint and a standalone CLI script let you confirm which Supabase
project the sandbox is connected to.

### HTTP endpoint (requires a running sandbox app)

```bash
curl http://localhost:3000/api/sandbox-health
```

Example response (suspended / mock mode):

```json
{
  "ok": true,
  "sandbox": true,
  "suspended": true,
  "supabaseHostname": "placeholder.supabase.co",
  "mode": "mock (suspended)",
  "queryOk": null,
  "queryError": null,
  "ts": "2026-01-01T00:00:00.000Z"
}
```

Example response (live sandbox Supabase):

```json
{
  "ok": true,
  "sandbox": true,
  "suspended": false,
  "supabaseHostname": "abcdefgh.supabase.co",
  "mode": "live",
  "queryOk": true,
  "queryError": null,
  "ts": "2026-01-01T00:00:00.000Z"
}
```

The endpoint reports **only the hostname** — the anon key and service-role key are
never returned.

### CLI script (no running app required)

```bash
./scripts/sandbox-health-check.sh
```

With a running sandbox to check the live endpoint too:

```bash
BASE_URL=http://localhost:3000 ./scripts/sandbox-health-check.sh
```

The script:
- Verifies the `SANDBOX_SUPABASE_*` env vars are set
- Pings the Supabase REST API directly (no Next.js needed)
- Optionally checks the `/api/sandbox-health` endpoint of a running app

---

## Adding a new sandbox app

When a new app is added to `apps/`, add it to the sandbox by running from the repo root:

```bash
scripts/create-sandbox-app.sh <app-name>
```

Or manually:
1. Create `newapps/<app-name>/` and symlink all source dirs/files from `apps/<app-name>/`
2. Add `newapps/<app-name>/package.json` with name `sandbox-<app-name>`
3. Add `newapps/<app-name>/.env.local` (copy template from any existing sandbox app)
4. Add a new entry to `newapps/ecosystem.config.js`
5. Add `newapps/<app-name>` to the `workspaces` array in the root `package.json`
