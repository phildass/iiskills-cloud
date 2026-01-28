# Contributing Guidelines

## Understanding Repository Cloning

**Important for New Contributors:**

When you clone this repository, you create an **independent copy** on your local machine. Changes you make locally do NOT automatically affect the original repository. See [GIT_BASICS.md](GIT_BASICS.md) for a complete explanation.

### Quick Facts:
- ✅ Your cloned repository is completely independent
- ✅ Local changes stay on your machine unless you explicitly push them
- ✅ You need write permissions to push directly to this repository
- ✅ Use Pull Requests to propose changes (recommended for all contributors)

### Recommended Workflow:

1. **Fork** this repository on GitHub (creates your own copy)
2. **Clone** your fork to your local machine
3. **Create a branch** for your changes
4. **Make and test** your changes locally
5. **Push** to your fork
6. **Create a Pull Request** to propose merging your changes

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

### GitHub Secrets Required

The following secrets must be configured in the repository (Settings → Secrets and variables → Actions):

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key

These are used during the build process to ensure apps compile correctly. The CI workflow also sets `NEXT_PUBLIC_DISABLE_AUTH=true` to allow builds without full authentication setup.

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
