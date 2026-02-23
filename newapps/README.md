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
