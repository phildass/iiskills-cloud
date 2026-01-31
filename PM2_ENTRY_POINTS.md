# PM2 Entry Points Detection Summary

This file documents the automatically detected entry points and configurations
for all applications in the iiskills-cloud repository.

Generated: 2026-01-31T13:27:25.673Z

## Detected Applications

| App Name | Directory | Port | Source | Start Script |
|----------|-----------|------|--------|--------------|
| iiskills-learn-ai | apps/learn-ai | 3024 | package.json | `next start -p 3024` |
| iiskills-learn-apt | apps/learn-apt | 3002 | package.json | `next start -p 3002` |
| iiskills-learn-companion | apps/learn-companion | 3023 | package.json | `next start -p 3023` |
| iiskills-main | apps/main | 3000 | package.json | `next start -p 3000` |

## Port Assignment Details

### Ports from package.json

These apps have port specifications in their package.json start scripts:

- **iiskills-learn-ai**: Port 3024
  - Start script: `next start -p 3024`
- **iiskills-learn-apt**: Port 3002
  - Start script: `next start -p 3002`
- **iiskills-learn-companion**: Port 3023
  - Start script: `next start -p 3023`
- **iiskills-main**: Port 3000
  - Start script: `next start -p 3000`

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
