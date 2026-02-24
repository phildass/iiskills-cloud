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

## Subdomain Testing Convention

Subdomain testing uses the pattern: `app1.<APPNAME>.iiskills.cloud`

Examples:
- `app1.web.iiskills.cloud` → apps/web
- `app1.admin.iiskills.cloud` → apps/admin
- `app1.learn-physics.iiskills.cloud` → apps/learn-physics

## Apps

| App | Description | Port | Notes |
|-----|-------------|------|-------|
| `apps/web` | Main landing page | 3000 | |
| `apps/admin` | Admin dashboard | 3001 | basePath: `/admin` |
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

The universal navbar in `packages/ui` includes a Google Translate integration hook.  
Enable it by setting `NEXT_PUBLIC_GOOGLE_TRANSLATE_ENABLED=true` in your app's `.env.local`.
