# Port Assignment Changes

This document describes the port assignments for all applications in the iiskills-cloud monorepo to prevent EADDRINUSE errors when running multiple apps concurrently.

## Problem

Multiple applications in the repository had conflicting port assignments in their `package.json` files. Specifically, five applications were all configured to use port 3009:

- learn-jee
- learn-chemistry
- learn-geography
- learn-neet
- learn-physics

This caused conflicts when running multiple apps simultaneously with turbo or PM2.

## Solution

All applications have been assigned unique, sequential ports starting from 3000. The port assignments are now consistent across both `package.json` files and `ecosystem.config.js`.

## Complete Port Map

Here is the complete port assignment for all active applications:

| Port | Application | Notes |
|------|-------------|-------|
| 3000 | iiskills-main | Main website (app.iiskills.cloud) |
| 3001 | learn-ai | Artificial Intelligence fundamentals |
| 3002 | learn-apt | Aptitude assessment |
| 3005 | learn-chemistry | Chemistry mastery |
| 3009 | learn-cricket | Cricket Know-All (Free) |
| 3011 | learn-geography | Geography and world exploration |
| 3013 | learn-govt-jobs | Government job exam preparation |
| 3015 | learn-leadership | Leadership development |
| 3016 | learn-management | Management and business skills |
| 3017 | learn-math | Mathematics learning |
| 3020 | learn-physics | Physics mastery |
| 3021 | learn-pr | Public Relations |
| 3022 | learn-winning | Success strategies |
| 9000 | webhook | Webhook service |

## How It Works

Each application has the port hardcoded in its `package.json` file:

```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "start": "next start -p 3001"
  }
}
```

Next.js will use the port specified in the start command. The PM2 configuration (`ecosystem.config.js`) relies on these port specifications from the package.json files.

## For Developers

### Running Individual Apps

When running apps individually during development, they will use the ports specified in their respective `package.json` files:

```bash
cd learn-jee
npm run dev  # Uses port 3008
```

### Running All Apps with Turbo

To run all apps concurrently:

```bash
yarn dev --concurrency=17
# or
npm run dev
```

All apps will start on their assigned ports without conflicts.

### Running with PM2

When using PM2, the apps will use the same ports:

```bash
pm2 start ecosystem.config.js
# or start a specific app
pm2 start ecosystem.config.js --only iiskills-learn-jee
```

### Updating Ports

If you need to change a port assignment:

1. Edit the app's `package.json` and update the port in both `dev` and `start` scripts
2. Update `ecosystem.config.js` comments to reflect the change
3. Update this documentation
4. Ensure no port conflicts exist across all applications
5. Restart the app: `pm2 restart <app-name>` or restart your dev server

## Important Notes

- All ports are unique and assigned to active applications only
- Port assignments are consistent across development and production
- No environment variable overrides are needed
- All port specifications are in the package.json files for transparency
- Archived apps (learn-jee, learn-neet, learn-ias, learn-data-science, coming-soon, admin, iiskills-admin) are in apps-backup/ and are not deployed

