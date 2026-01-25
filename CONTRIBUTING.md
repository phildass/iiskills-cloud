# Contributing Guidelines

## File Structure Rules

### Import Paths for Shared Components

**For apps in root directory** (learn-ai, learn-apt, etc.):
```javascript
import Component from "../../components/shared/Component"
```

**For apps in /apps/ subdirectory** (apps/main, apps/coming-soon):
```javascript
import Component from "../../../components/shared/Component"
```

### Testing Your Changes

**Before creating a PR, ALWAYS:**

1. Run the pre-deployment check:
   ```bash
   ./scripts/pre-deploy-check.sh
   ```

2. Ensure ALL apps build successfully

3. Test on localhost:
   ```bash
   cd <your-app>
   yarn dev
   ```

### Shared Component Changes

When modifying files in `/components/shared/`:

1. Test import in BOTH:
   - Root-level app (e.g., learn-ai)
   - Apps subdirectory app (e.g., apps/main)

2. Verify with: `yarn build` in both locations

### Pull Request Checklist

- [ ] All apps build successfully locally
- [ ] Pre-deployment check passes
- [ ] No console errors in browser
- [ ] Tested on localhost
- [ ] Updated documentation if needed

## GitHub Actions CI/CD

All pull requests are automatically tested by GitHub Actions:
- ✅ All 18 apps must build successfully
- ✅ PRs with build failures cannot be merged
- ✅ Check the "Actions" tab to see build status

## Deployment

### Manual Deployment

Use the automated deployment script:
```bash
cd ~/iiskills-cloud
./scripts/deploy.sh
```

### What the Deployment Does

1. Pulls latest code from main branch
2. Installs dependencies
3. Tests all app builds
4. Restarts PM2 processes
5. Health checks all apps
6. Reports success/failure

### Rollback

If deployment fails:
```bash
git log --oneline -10  # Find previous commit
git checkout <commit-hash>
./scripts/deploy.sh
```

## Common Issues

### Import Path Errors

**Problem:** `Module not found: Can't resolve '../../components/...'`

**Solution:** Check if you're in `/apps/` subdirectory - use `../../../` instead of `../../`

### Build Fails Locally But Not in CI

**Problem:** Works on your machine, fails in GitHub Actions

**Solution:** 
- Run `yarn install --frozen-lockfile`
- Check `.env.local` variables match CI secrets
- Clear cache: `rm -rf .next node_modules && yarn install`

### PM2 App Won't Start After Deploy

**Problem:** Build succeeds but app crashes

**Solution:**
- Check logs: `pm2 logs <app-name> --lines 50`
- Verify `.env.local` on server
- Check port conflicts: `netstat -tlnp | grep <port>`
