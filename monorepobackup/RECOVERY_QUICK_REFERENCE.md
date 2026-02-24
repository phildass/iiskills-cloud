# Quick Reference - Recovery Operations

This guide provides quick commands for working with the recovered apps.

## Recovered Apps List

```
learn-management  (3016)    learn-math        (3017)
learn-leadership  (3015)    learn-physics     (3020)
learn-pr          (3021)    learn-chemistry   (3005)
learn-cricket     (3009)    learn-geography   (3011)
learn-winning     (3022)    learn-govt-jobs   (3013)
```

## Quick Commands

### Validate All Apps

```bash
# Run build validation
./validate-recovery-builds.sh

# Run smoke tests
./smoke-test-recovery.sh
```

### Build Commands

```bash
# Build all apps
yarn build

# Build specific app
cd apps/learn-{app-name}
yarn build
```

### PM2 Commands

```bash
# Start all apps
pm2 start ecosystem.config.js

# Start specific app
pm2 start ecosystem.config.js --only iiskills-learn-{app-name}

# Stop all apps
pm2 stop all

# Restart all apps
pm2 restart all

# View logs
pm2 logs iiskills-learn-{app-name}

# Monitor
pm2 monit

# Save configuration
pm2 save
```

### Development Commands

```bash
# Run in dev mode
cd apps/learn-{app-name}
yarn dev

# Run in production mode
cd apps/learn-{app-name}
yarn build
yarn start
```

### Environment Setup

```bash
# Copy environment template
cd apps/learn-{app-name}
cp .env.local.example .env.local

# Edit with your values
nano .env.local
```

## Port Assignments

| App               | Port | Status |
|-------------------|------|--------|
| learn-management  | 3016 | ✅     |
| learn-leadership  | 3015 | ✅     |
| learn-pr          | 3021 | ✅     |
| learn-cricket     | 3009 | ✅     |
| learn-math        | 3017 | ✅     |
| learn-physics     | 3020 | ✅     |
| learn-chemistry   | 3005 | ✅     |
| learn-geography   | 3011 | ✅     |
| learn-winning     | 3022 | ✅     |
| learn-govt-jobs   | 3013 | ✅     |

## Files to Review

### Documentation
- `RECOVERY_COMPLETE.md` - Task completion summary
- `RECOVERY_DOCUMENTATION.md` - Full recovery report
- `RECOVERY_VALIDATION_REPORT.md` - Initial validation
- `PM2_ENTRY_POINTS.md` - PM2 configuration details

### Scripts
- `validate-recovery-builds.sh` - Build validation script
- `smoke-test-recovery.sh` - Smoke test script

### Configuration
- `ecosystem.config.js` - PM2 process configuration
- `.env.local.example` - Environment template (per app)

## Troubleshooting

### Build Issues
```bash
# Clean and rebuild
cd apps/learn-{app-name}
rm -rf .next node_modules
yarn install
yarn build
```

### Port Conflicts
```bash
# Check what's using a port
lsof -i :3016

# Kill process on port
kill $(lsof -t -i:3016)
```

### PM2 Issues
```bash
# Reset PM2
pm2 kill
pm2 start ecosystem.config.js

# View error logs
pm2 logs --err

# Flush logs
pm2 flush
```

## Deployment Checklist

- [ ] Configure environment variables
- [ ] Set up Supabase database
- [ ] Run `yarn install`
- [ ] Run `yarn build`
- [ ] Test locally
- [ ] Deploy with PM2
- [ ] Verify logs
- [ ] Test endpoints

## Support

For issues or questions:
1. Check `RECOVERY_DOCUMENTATION.md` for detailed information
2. Review build logs in `build-validation-reports/`
3. Check PM2 logs: `pm2 logs`
4. Contact repository maintainer

---

**Last Updated:** 2026-02-01  
**Branch:** copilot/recover-missing-learn-apps
