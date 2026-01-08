# Port Assignment Changes

This document describes the port reassignments made to resolve conflicts in the ecosystem.config.js.

## Problem

Multiple applications in the repository had conflicting port assignments in their `package.json` files. Specifically, five applications were all configured to use port 3009:

- learn-jee
- learn-chemistry
- learn-geography
- learn-neet
- learn-physics

This would have caused conflicts when running multiple apps simultaneously with PM2.

## Solution

The `ecosystem.config.js` file has been configured to override ports for these applications using environment variables:

### Original Port Assignments (from package.json)

| Application | Port in package.json |
|------------|---------------------|
| learn-jee | 3009 (CONFLICT) |
| learn-chemistry | 3009 (CONFLICT) |
| learn-geography | 3009 (CONFLICT) |
| learn-neet | 3009 (CONFLICT) |
| learn-physics | 3009 (CONFLICT) |

### New Port Assignments (from ecosystem.config.js)

| Application | New Port | Status |
|------------|----------|--------|
| learn-jee | 3010 | ✓ Reassigned |
| learn-chemistry | 3011 | ✓ Reassigned |
| learn-geography | 3012 | ✓ Reassigned |
| learn-neet | 3013 | ✓ Reassigned |
| learn-physics | 3016 | ✓ Reassigned |

## Complete Port Map

Here is the complete port assignment for all applications:

| Port | Application | Notes |
|------|-------------|-------|
| 3000 | iiskills-main | Main website |
| 3001 | learn-apt | Override (no port in package.json) |
| 3002 | learn-math | From package.json |
| 3003 | learn-winning | From package.json |
| 3004 | learn-data-science | From package.json |
| 3005 | learn-management | From package.json |
| 3006 | learn-leadership | From package.json |
| 3007 | learn-ai | From package.json |
| 3008 | learn-pr | From package.json |
| 3010 | learn-jee | Override (was 3009) |
| 3011 | learn-chemistry | Override (was 3009) |
| 3012 | learn-geography | Override (was 3009) |
| 3013 | learn-neet | Override (was 3009) |
| 3014 | learn-govt-jobs | From package.json |
| 3015 | learn-ias | From package.json |
| 3016 | learn-physics | Override (was 3009) |

## How It Works

Next.js respects the `PORT` environment variable when starting. The PM2 configuration sets this variable for apps that need overrides:

```javascript
{
  name: 'iiskills-learn-jee',
  cwd: path.join(__dirname, 'learn-jee'),
  script: 'npm',
  args: 'start',
  env: {
    NODE_ENV: 'production',
    PORT: 3010  // Overrides package.json port 3009
  }
}
```

## For Developers

### Running Individual Apps

When running apps individually during development, use the ports specified in their respective `package.json` files:

```bash
cd learn-jee
npm run dev  # Uses port 3009 from package.json
```

### Running with PM2

When using PM2, the ecosystem.config.js ports take precedence:

```bash
pm2 start ecosystem.config.js --only iiskills-learn-jee
# App will run on port 3010, not 3009
```

### Updating Ports

If you need to change a port assignment:

1. Edit `ecosystem.config.js` and update the `PORT` in the `env` section
2. **Optional:** Update the port in `package.json` for consistency
3. Restart the app: `pm2 restart <app-name>`

### Important Notes

- PM2 environment variables take precedence over package.json scripts
- All port overrides are documented in the ecosystem.config.js comments
- No manual updates to package.json files were made (minimal change approach)
- Cross-platform compatible (Windows and Unix-like systems)
