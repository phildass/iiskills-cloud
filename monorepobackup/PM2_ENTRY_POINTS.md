# PM2 Entry Points Detection Summary

This file documents the automatically detected entry points and configurations
for all applications in the iiskills-cloud repository.

Generated: 2026-02-05T10:42:05.782Z

## Detected Applications

| App Name | Directory | Port | Source | Start Script |
|----------|-----------|------|--------|--------------|
| iiskills-learn-ai | apps/learn-ai | 3024 | package.json | `next start -p 3024` |
| iiskills-learn-apt | apps/learn-apt | 3002 | package.json | `next start -p 3002` |
| iiskills-learn-chemistry | apps/learn-chemistry | 3005 | package.json | `next start -p 3005` |
| iiskills-learn-developer | apps/learn-developer | 3001 | reassigned | `next start -p 3024` |
| iiskills-learn-geography | apps/learn-geography | 3011 | package.json | `next start -p 3011` |
| iiskills-learn-govt-jobs | apps/learn-govt-jobs | 3013 | package.json | `next start -p 3013` |
| iiskills-learn-management | apps/learn-management | 3016 | package.json | `next start -p 3016` |
| iiskills-learn-math | apps/learn-math | 3017 | package.json | `next start -p 3017` |
| iiskills-learn-physics | apps/learn-physics | 3020 | package.json | `next start -p 3020` |
| iiskills-learn-pr | apps/learn-pr | 3021 | package.json | `next start -p 3021` |
| iiskills-main | apps/main | 3000 | package.json | `next start -p 3000` |

## Port Assignment Details

### Ports from package.json

These apps have port specifications in their package.json start scripts:

- **iiskills-learn-ai**: Port 3024
  - Start script: `next start -p 3024`
- **iiskills-learn-apt**: Port 3002
  - Start script: `next start -p 3002`
- **iiskills-learn-chemistry**: Port 3005
  - Start script: `next start -p 3005`
- **iiskills-learn-geography**: Port 3011
  - Start script: `next start -p 3011`
- **iiskills-learn-govt-jobs**: Port 3013
  - Start script: `next start -p 3013`
- **iiskills-learn-management**: Port 3016
  - Start script: `next start -p 3016`
- **iiskills-learn-math**: Port 3017
  - Start script: `next start -p 3017`
- **iiskills-learn-physics**: Port 3020
  - Start script: `next start -p 3020`
- **iiskills-learn-pr**: Port 3021
  - Start script: `next start -p 3021`
- **iiskills-main**: Port 3000
  - Start script: `next start -p 3000`

### Reassigned Ports

These apps had port conflicts and were reassigned to different ports:

- **iiskills-learn-developer**: Port 3001 (reassigned to resolve conflict)
  - Original: Port 3024
  - Start script: `next start -p 3024`

## Entry Point Strategy

All detected applications are Next.js applications. The entry point strategy is:

1. **Script**: Use `npm` as the script executable
2. **Args**: Use `start` as the argument to run the package.json start script
3. **Port**: Either use the port from package.json or assign one automatically

This approach ensures that:
- Each app uses its own configured build and start process
- Port assignments are clear and conflict-free
- The configuration works on a fresh clone without manual intervention

## Regenerating the Configuration

To regenerate the PM2 ecosystem configuration:

```bash
node generate-ecosystem.js
```

This will:
1. Scan all directories for Next.js applications
2. Detect entry points from package.json
3. Assign ports (from package.json or auto-assign)
4. Resolve any port conflicts
5. Generate ecosystem.config.js
6. Update this documentation file
