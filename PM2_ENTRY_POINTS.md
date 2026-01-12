# PM2 Entry Points Detection Summary

This file documents the automatically detected entry points and configurations
for all applications in the iiskills-cloud repository.

Generated: 2026-01-08T04:49:30.463Z

## Detected Applications

| App Name                    | Directory          | Port | Source        | Start Script         |
| --------------------------- | ------------------ | ---- | ------------- | -------------------- |
| iiskills-main               | (root)             | 3000 | auto-assigned | `next start`         |
| iiskills-learn-ai           | learn-ai           | 3007 | package.json  | `next start -p 3007` |
| iiskills-learn-apt          | learn-apt          | 3001 | auto-assigned | `next start`         |
| iiskills-learn-chemistry    | learn-chemistry    | 3009 | package.json  | `next start -p 3009` |
| iiskills-learn-data-science | learn-data-science | 3004 | package.json  | `next start -p 3004` |
| iiskills-learn-geography    | learn-geography    | 3010 | reassigned    | `next start -p 3009` |
| iiskills-learn-govt-jobs    | learn-govt-jobs    | 3014 | package.json  | `next start -p 3014` |
| iiskills-learn-ias          | learn-ias          | 3015 | package.json  | `next start -p 3015` |
| iiskills-learn-jee          | learn-jee          | 3011 | reassigned    | `next start -p 3009` |
| iiskills-learn-leadership   | learn-leadership   | 3006 | package.json  | `next start -p 3006` |
| iiskills-learn-management   | learn-management   | 3005 | package.json  | `next start -p 3005` |
| iiskills-learn-math         | learn-math         | 3002 | package.json  | `next start -p 3002` |
| iiskills-learn-neet         | learn-neet         | 3012 | reassigned    | `next start -p 3009` |
| iiskills-learn-physics      | learn-physics      | 3013 | reassigned    | `next start -p 3009` |
| iiskills-learn-pr           | learn-pr           | 3008 | package.json  | `next start -p 3008` |
| iiskills-learn-winning      | learn-winning      | 3003 | package.json  | `next start -p 3003` |

## Port Assignment Details

### Ports from package.json

These apps have port specifications in their package.json start scripts:

- **iiskills-learn-ai**: Port 3007
  - Start script: `next start -p 3007`
- **iiskills-learn-chemistry**: Port 3009
  - Start script: `next start -p 3009`
- **iiskills-learn-data-science**: Port 3004
  - Start script: `next start -p 3004`
- **iiskills-learn-govt-jobs**: Port 3014
  - Start script: `next start -p 3014`
- **iiskills-learn-ias**: Port 3015
  - Start script: `next start -p 3015`
- **iiskills-learn-leadership**: Port 3006
  - Start script: `next start -p 3006`
- **iiskills-learn-management**: Port 3005
  - Start script: `next start -p 3005`
- **iiskills-learn-math**: Port 3002
  - Start script: `next start -p 3002`
- **iiskills-learn-pr**: Port 3008
  - Start script: `next start -p 3008`
- **iiskills-learn-winning**: Port 3003
  - Start script: `next start -p 3003`

### Auto-assigned Ports

These apps did not specify a port, so one was automatically assigned:

- **iiskills-main**: Port 3000 (auto-assigned)
  - Start script: `next start`
- **iiskills-learn-apt**: Port 3001 (auto-assigned)
  - Start script: `next start`

### Reassigned Ports

These apps had port conflicts and were reassigned to different ports:

- **iiskills-learn-geography**: Port 3010 (reassigned to resolve conflict)
  - Original: Port 3009
  - Start script: `next start -p 3009`
- **iiskills-learn-jee**: Port 3011 (reassigned to resolve conflict)
  - Original: Port 3009
  - Start script: `next start -p 3009`
- **iiskills-learn-neet**: Port 3012 (reassigned to resolve conflict)
  - Original: Port 3009
  - Start script: `next start -p 3009`
- **iiskills-learn-physics**: Port 3013 (reassigned to resolve conflict)
  - Original: Port 3009
  - Start script: `next start -p 3009`

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
