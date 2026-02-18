# PR Requirements Quick Reference Card

**Save this for easy access when creating PRs**

---

## ✅ Before Creating PR

```bash
# 1. Run all tests
yarn test && yarn test:e2e

# 2. Check code quality
yarn lint:check && yarn format:check

# 3. Validate configuration
yarn validate-config

# 4. Generate screenshots (if UI changes)
./capture-qa-screenshots.sh
```

---

## 📋 PR Template Checklist

### Must Include
- [ ] Link to issue(s): `Closes #123` or `Related to #456`
- [ ] Complete description (minimum 50 characters)
- [ ] Type of change selected
- [ ] All checklist items checked

### Code Quality
- [ ] Uses @iiskills/ui (no local imports)
- [ ] ESLint passes
- [ ] Prettier formatted
- [ ] No prohibited patterns

### Testing
- [ ] Tests added/updated
- [ ] All unit tests pass
- [ ] All E2E tests pass
- [ ] No regressions

### Visual Changes (if applicable)
- [ ] Screenshots attached (desktop, tablet, mobile)
- [ ] Visual regression tests pass
- [ ] Responsive design verified
- [ ] Accessibility verified

### Security
- [ ] No .env files committed
- [ ] No hardcoded secrets
- [ ] Security scan passed
- [ ] Dependencies reviewed

---

## 🚫 Common Mistakes

### ❌ Will Fail Automated Checks

```javascript
// ❌ Local component import
import Button from '../../components/shared/Button';

// ✅ Use package import
import { Button } from '@iiskills/ui/common';
```

```bash
# ❌ Don't commit .env files
git add .env

# ✅ Use .env.example
git add .env.example
```

```javascript
// ❌ Don't hardcode secrets
const API_KEY = 'sk_live_abc123';

// ✅ Use environment variables
const API_KEY = process.env.API_KEY;
```

---

## 🤖 What Gets Checked Automatically

### GitHub Actions
✅ PR template validation  
✅ Code quality (ESLint + Prettier)  
✅ Import validation  
✅ Unit tests  
✅ E2E tests (all browsers)  
✅ Configuration validation  
✅ Security scan  
✅ Build verification (10 apps)  

### Danger.js
✅ PR metadata (title, description)  
✅ Code quality issues  
✅ Import validation  
✅ Security issues  
✅ Testing requirements  
✅ Visual changes detection  
✅ Documentation checks  

---

## 📊 Auto-Generated Report

Every PR gets a comprehensive report with:

- 📊 Change statistics
- ✅ Requirements checklist
- 🎯 Detailed analysis
- 💡 Recommendations
- 🚀 Next steps

---

## 🔒 Merge Blockers

PR **cannot** be merged if:

❌ Any automated test fails  
❌ Linting/formatting errors  
❌ Prohibited patterns detected  
❌ Security vulnerabilities found  
❌ Missing screenshots (for UI changes)  
❌ .env files committed  
❌ Hardcoded secrets found  
❌ No reviewer approval  

---

## 🚀 Getting PR Approved

### Step 1: Automated Checks
- All GitHub Actions must pass (green ✅)
- Danger.js report must show no critical issues

### Step 2: Address Feedback
- Fix any ❌ failures
- Address ⚠️ warnings when possible
- Update PR based on report recommendations

### Step 3: Request Review
- Tag appropriate reviewers
- Wait for approval
- Address review comments

### Step 4: Merge
- Ensure branch is up to date
- All checks still green
- Reviewer has approved
- Click "Merge" button

---

## 🆘 Quick Fixes

### Linting Issues
```bash
yarn lint:fix
yarn format
```

### Test Failures
```bash
yarn cache clean
rm -rf node_modules
yarn install
yarn test
```

### E2E Issues
```bash
npx playwright install --with-deps
yarn test:e2e:headed
```

### Build Failures
```bash
cd apps/<app-name>
rm -rf .next
yarn build
```

### Import Issues
Replace local imports:
```javascript
// Change this:
import Button from '../../components/shared/Button';
// To this:
import { Button } from '@iiskills/ui/common';
```

---

## 📚 Full Documentation

- **Complete Guide**: [docs/PR_REQUIREMENTS_GUIDE.md](docs/PR_REQUIREMENTS_GUIDE.md)
- **Examples**: [docs/PR_REPORT_EXAMPLES.md](docs/PR_REPORT_EXAMPLES.md)
- **Contributing**: [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Deployment**: [DEPLOYMENT_POLICY.md](../DEPLOYMENT_POLICY.md)
- **Architecture**: [MONOREPO_ARCHITECTURE.md](../MONOREPO_ARCHITECTURE.md)

---

## 💬 Need Help?

- Check the [Troubleshooting](docs/PR_REQUIREMENTS_GUIDE.md#troubleshooting) section
- Ask in Slack: `#development` channel
- Email: dev@iiskills.cloud

---

**Remember**: Quality over speed. Better to take time getting it right than rushing and breaking production! 🎯

---

**Last Updated**: 2026-02-18  
**Version**: 1.0.0
