# Common Integration Plan for Monorepo Apps

## Objective
Ensure every current and future app in the monorepo automatically inherits all core platform features, branding, and workflows—without duplicating code or manual integration.

## How It Works

- All universal features (UI, auth, payment, admin, layouts, etc.) live in `/packages/`.
- Every app is created with the `yarn create-app` generator, pre-wired to common packages, layout, and testing.
- Per-app configuration and unique pages are minimal.
- All navigation, theme, auth, payment, admin features “just work” and stay consistent everywhere.

## Adding a New App

1. Run: `yarn create-app <myApp>`
2. Fill out `apps/<myApp>/app.config.js` with app details.
3. Add unique content/modules/lessons as needed.
4. Commit. Auto lint, E2E, and snapshot tests verify compliance.
5. PRs must pass all tests and be reviewed for adherence to universal patterns.

## Benefits

- **Consistency:** Same experience for users and admin in all apps.
- **Maintainability:** Core updates propagate instantly.
- **Scalability:** Onboarding new apps fast and error-free.

---
