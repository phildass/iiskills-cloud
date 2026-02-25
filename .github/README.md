# GitHub Workflows & Automation

This directory contains GitHub Actions workflows and automation scripts for the iiskills-cloud monorepo.

---

## 📁 Directory Structure

```
.github/
├── workflows/              # GitHub Actions workflows
│   ├── pr-requirements-check.yml    # Main PR requirements validation
│   ├── danger-pr-analysis.yml       # Danger.js PR analysis
│   ├── build-test.yml               # Build verification for all apps
│   ├── build-workspaces.yml         # Workspace build jobs
│   └── sync-content.yml             # Content synchronization
├── scripts/                # Helper scripts for workflows
│   └── get-workspaces.js           # Get workspace information
├── dangerfile.js           # Danger.js configuration
└── PULL_REQUEST_TEMPLATE.md # PR template with requirements checklist
```

---

## 🔄 Workflows

### 1. PR Requirements Check (`pr-requirements-check.yml`)

**Purpose**: Comprehensive automated validation of all PR requirements

**Triggers**: 
- Pull request opened, synchronized, reopened, or edited
- Target branch: `main`

**Jobs**:
1. **PR Template Validation** - Ensures PR uses template and has adequate description
2. **Code Quality** - Runs ESLint and Prettier checks
3. **Import Validation** - Checks for prohibited patterns and proper imports
4. **Unit Tests** - Runs all unit tests
5. **E2E Tests** - Runs Playwright E2E tests across browsers
6. **Configuration Validation** - Validates config consistency
7. **Security Scan** - Runs npm audit for vulnerabilities
8. **Build Verification** - Builds all 10 active apps
9. **Requirements Report** - Generates comprehensive report
10. **Final Status** - Overall pass/fail status

**Required Secrets**:
- None (uses `GITHUB_TOKEN` automatically)

### 2. Danger.js PR Analysis (`danger-pr-analysis.yml`)

**Purpose**: Sophisticated PR analysis with automated commenting

**Triggers**:
- Pull request opened, synchronized, reopened, or edited
- Target branch: `main`

**What it checks**:
- PR metadata (title, description, size)
- Code quality issues (console.log, TODOs)
- Import validation (local vs package imports)
- Security issues (hardcoded secrets, eval usage)
- Testing requirements
- Visual changes (screenshots)
- Documentation updates

**Output**: Posts detailed analysis comment on PR

### 3. Build & Test All Apps (`build-test.yml`)

**Purpose**: Verify all apps build successfully

**Triggers**:
- Pull request to `main`
- Push to `main`

**What it does**:
- Builds all 17 apps in parallel (matrix strategy)
- Validates content schema
- Checks for orphans and broken links

**Required Secrets**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🎯 Pull Request Template

### Location
`.github/PULL_REQUEST_TEMPLATE.md`

### Sections

1. **Description** - Clear explanation of changes
2. **Related Issues** - Linked issues (Closes #, Related to #)
3. **Type of Change** - Bug fix, feature, breaking change, etc.
4. **Requirements Checklist** - Comprehensive checklist covering:
   - Code quality & standards
   - Architecture & integration
   - Testing
   - Visual changes
   - Security
   - Documentation
5. **Testing Evidence** - Test results and screenshots
6. **Performance Impact** - Performance considerations
7. **Breaking Changes** - Migration guide if needed
8. **Deployment Notes** - Special deployment requirements
9. **Reviewer Checklist** - For human reviewers

---

## 🤖 Danger.js Configuration

### Location
`.github/dangerfile.js`

### What it analyzes

1. **PR Metadata**
   - PR size (warns if >500 lines)
   - Title length
   - Description completeness
   - Issue linkage

2. **Code Quality**
   - console.log statements
   - TODO/FIXME comments
   - Code formatting

3. **Import Validation**
   - Local component imports (prohibited)
   - Proper @iiskills/ui usage
   - Deprecated app references

4. **Security**
   - Hardcoded secrets
   - eval() usage
   - dangerouslySetInnerHTML
   - Committed .env files

5. **Testing**
   - Test files updated
   - Source changes without tests

6. **Visual Changes**
   - UI file modifications
   - Screenshot requirements

7. **Documentation**
   - Documentation updates
   - CHANGELOG updates

### Report Format

Danger.js generates a comprehensive report including:
- Change statistics
- Requirements checklist
- Recommendations
- Next steps
- Critical issues (if any)

---

## 🔒 Branch Protection

### Recommended Settings

Enable these branch protection rules for `main`:

- ✅ Require pull request reviews before merging (1 approval minimum)
- ✅ Require status checks to pass before merging:
  - `All Checks Status` (from pr-requirements-check.yml)
  - `Run Danger.js` (from danger-pr-analysis.yml)
  - `build-all-apps` (from build-test.yml)
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging
- ❌ Allow force pushes (keep disabled)
- ❌ Allow deletions (keep disabled)

---

## 🛠️ Local Testing

### Test PR Template
```bash
# The template will automatically appear when creating a PR via GitHub UI
```

### Test Danger.js Locally
```bash
# Install dependencies
yarn install

# Run Danger.js in local mode
yarn danger pr https://github.com/phildass/iiskills-cloud/pull/123
```

### Test Workflows Locally (with act)
```bash
# Install act (https://github.com/nektos/act)
brew install act  # macOS
# or
sudo apt install act  # Linux

# Run a specific workflow
act pull_request -W .github/workflows/pr-requirements-check.yml
```

### Run Pre-PR Checks
```bash
# Run all checks that CI will run
yarn lint:check
yarn format:check
yarn test
yarn test:e2e
yarn validate-config
```

---

## 📝 Adding a New Workflow

1. Create a new `.yml` file in `.github/workflows/`
2. Follow the naming convention: `descriptive-name.yml`
3. Include proper documentation at the top
4. Use appropriate triggers
5. Add required secrets (if any)
6. Test locally with `act` before pushing
7. Update this README with workflow details

### Example Workflow Structure

```yaml
name: My New Workflow

# Purpose and description

on:
  pull_request:
    branches: [main]

jobs:
  my-job:
    name: Job Name
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'yarn'
      
      - name: Install dependencies
        run: yarn install --frozen-lockfile
      
      - name: Run my task
        run: yarn my-script
```

---

## 🐛 Troubleshooting

### Workflow Failing?

1. **Check logs**: Go to Actions tab → Click on failed run → View logs
2. **Run locally**: Use `act` to test workflows locally
3. **Check secrets**: Ensure required secrets are configured
4. **Verify syntax**: YAML syntax errors are common

### Danger.js Not Commenting?

1. **Check permissions**: Ensure workflow has `pull-requests: write`
2. **Check token**: `GITHUB_TOKEN` should be available
3. **Test locally**: Run `yarn danger pr <PR-URL>`
4. **Check logs**: Look at Danger.js workflow logs

### Build Failures?

1. **Check environment**: Ensure all env vars are set
2. **Dependencies**: Run `yarn install --frozen-lockfile`
3. **Cache issues**: Clear GitHub Actions cache
4. **Local test**: Build app locally to reproduce issue

---

## 📚 Documentation

- **Complete Guide**: [docs/PR_REQUIREMENTS_GUIDE.md](../docs/PR_REQUIREMENTS_GUIDE.md)
- **Examples**: [docs/PR_REPORT_EXAMPLES.md](../docs/PR_REPORT_EXAMPLES.md)
- **Quick Reference**: [docs/PR_REQUIREMENTS_QUICK_REFERENCE.md](../docs/PR_REQUIREMENTS_QUICK_REFERENCE.md)
- **Contributing**: [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Deployment Policy**: [DEPLOYMENT_POLICY.md](../DEPLOYMENT_POLICY.md)

---

## 📞 Support

Need help with workflows or automation?

- **Slack**: `#development` channel
- **Email**: devops@iiskills.cloud
- **Documentation**: See docs/ directory

---

**Last Updated**: 2026-02-18  
**Maintained By**: DevOps & Platform Engineering Team
