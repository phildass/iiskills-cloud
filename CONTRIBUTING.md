# Contributing Guidelines

## AI/Automation Agent Guidelines

**All AI/automation agents must update DEV_AI_LOG.md with each session for handover.**

When working with AI tools (GitHub Copilot, automation scripts, etc.):

1. **Before starting**: Review [DEV_AI_LOG.md](DEV_AI_LOG.md) to understand previous agent sessions
2. **After completing changes**: Append a detailed session summary to [DEV_AI_LOG.md](DEV_AI_LOG.md)
3. **Include in summary**:
   - Session date/time and agent used
   - Objective and issues addressed
   - Detailed list of changes made
   - Testing/validation performed
   - Status and any follow-up needed
   - Important context for future agents

**Guideline for Copilot prompts**: "After completing your changes, append a detailed session summary to ./DEV_AI_LOG.md for future Copilots/agents."

This ensures continuity and knowledge transfer between different AI sessions and human developers.

## File Structure Rules

### Import Paths for Shared Components

**For apps in apps/ subdirectory** (apps/main, apps/learn-ai, etc.):
```javascript
import Component from "../../../components/shared/Component"
```

### Testing Your Changes

**Before creating a PR, ALWAYS:**

1. Run the pre-deployment check:
   ```bash
   ./scripts/pre-deploy-check.sh
   ```

2. **Validate content** (if you added/modified content files):
   ```bash
   npm run validate-content
   npm run check-orphans
   ```

3. Ensure ALL apps build successfully

4. Test on localhost:
   ```bash
   cd <your-app>
   yarn dev
   ```

### Content Validation Requirements

When adding or modifying content files:

1. **Follow the schema** defined in `lib/contentSchema.js`
2. **Required fields** for all content:
   - `id` - Unique identifier
   - `title` - Content title
   - `description` - Content description
   - `sourceApp` - Must match app name (e.g., "learn-ai")
3. **Parent links** must be valid:
   - Modules must reference existing courses
   - Lessons must reference existing modules
4. **Run validators**:
   ```bash
   npm run validate-content -- --app=<your-app> --verbose
   npm run check-orphans -- --app=<your-app>
   ```

### Adding a New Learning App

See [ADDING_NEW_APP.md](ADDING_NEW_APP.md) for complete instructions. Quick checklist:

- [ ] Choose and document port in PORT_ASSIGNMENTS.md
- [ ] Create content structure (courses/, modules/, lessons/)
- [ ] Add sample content following schema
- [ ] Validate content with `npm run validate-content`
- [ ] Run `npm run generate:registry` to update app registry
- [ ] Test locally before deploying

### Shared Component Changes

**CRITICAL**: Shared components affect ALL apps. Follow this strict policy:

1. **Impact Assessment**:
   ```bash
   # Find all apps using the component
   grep -r "ComponentName" apps/*/
   ```

2. **Testing Requirements**:
   - [ ] Test in **at least 2 different apps** manually
   - [ ] Run E2E tests: `yarn test:e2e`
   - [ ] Run unit tests: `yarn test`
   - [ ] Visual regression check (screenshots)
   - [ ] Verify in desktop + mobile

3. **Documentation**:
   - [ ] Update `SHARED_COMPONENTS_LIBRARY.md`
   - [ ] Update component JSDoc comments
   - [ ] Document breaking changes (if any)
   - [ ] Update migration guide (if needed)

4. **Deployment**:
   - Must deploy to **all apps simultaneously**
   - Never leave apps in inconsistent state
   - Have rollback plan ready

5. **PR Requirements**:
   - [ ] Before/after screenshots for **every affected app**
   - [ ] List of all apps tested
   - [ ] Confirmation that all apps still build
   - [ ] E2E test results

**See also**: [DEPLOYMENT_POLICY.md](DEPLOYMENT_POLICY.md) for full deployment requirements.

### Pull Request Checklist

**Pre-Merge Requirements** (see [DEPLOYMENT_POLICY.md](DEPLOYMENT_POLICY.md) for details):

- [ ] All unit tests pass: `yarn test`
- [ ] All E2E tests pass: `yarn test:e2e`
- [ ] Config validation passes: `yarn validate-config`
- [ ] All apps build successfully locally
- [ ] Pre-deployment check passes
- [ ] Content validation passes (if applicable): `npm run validate-content`
- [ ] Orphan checker passes (if applicable): `npm run check-orphans`
- [ ] App registry updated (if new app): `npm run generate:registry`
- [ ] No console errors in browser
- [ ] Tested on localhost
- [ ] **Screenshots provided** (for UI changes - desktop/tablet/mobile)
- [ ] Updated documentation if needed
- [ ] Added/updated content follows schema (if applicable)
- [ ] **Code review approved** by senior developer
- [ ] **Security scan passed** (if dependencies changed)

## GitHub Actions CI/CD

All pull requests are automatically tested by GitHub Actions:
- ✅ All 13 active apps must build successfully
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
