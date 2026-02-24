# How Pull Requests are Evaluated for Requirement Fulfillment

**Version**: 1.0.0  
**Last Updated**: 2026-02-18  
**Status**: ACTIVE

---

## Overview

This document describes the automated system that evaluates every pull request (PR) to ensure it meets all project requirements before being merged. Our goal is to maintain code quality, prevent regressions, and ensure consistent standards across our monorepo.

---

## Table of Contents

1. [Quick Reference](#quick-reference)
2. [PR Template Requirements](#pr-template-requirements)
3. [Automated Checks](#automated-checks)
4. [Static & Content Analysis](#static--content-analysis)
5. [Visual QA Requirements](#visual-qa-requirements)
6. [Human Review Process](#human-review-process)
7. [Auto-Generated Reports](#auto-generated-reports)
8. [Merge Requirements](#merge-requirements)
9. [Troubleshooting](#troubleshooting)
10. [Examples](#examples)

---

## Quick Reference

### ✅ Pre-PR Checklist

Before creating a PR, ensure:

```bash
# 1. All tests pass locally
yarn test
yarn test:e2e

# 2. Code is properly formatted
yarn lint:fix
yarn format

# 3. Configuration is valid
yarn validate-config

# 4. Generate screenshots (if UI changes)
./capture-qa-screenshots.sh
```

### 📋 PR Must Include

- ✅ Linked issue(s) using "Closes #123" or "Related to #456"
- ✅ Completed PR template checklist
- ✅ Tests for new/changed functionality
- ✅ Screenshots for UI changes (desktop, tablet, mobile)
- ✅ Updated documentation (if applicable)

### 🚫 PR Will Fail If

- ❌ Any automated test fails
- ❌ Linting/formatting errors exist
- ❌ Prohibited code patterns detected
- ❌ Security vulnerabilities found
- ❌ Missing screenshots for UI changes
- ❌ .env files committed

---

## PR Template Requirements

### Required Sections

Our PR template includes comprehensive checklists that **must** be completed:

#### 1. **Related Issues**
Link your PR to relevant issues:
```markdown
- Closes #123
- Related to #456
```

#### 2. **Type of Change**
Check all applicable boxes:
- 🐛 Bug fix
- ✨ New feature
- 💥 Breaking change
- 📝 Documentation
- 🎨 UI/UX change
- ♻️ Refactor
- ⚡ Performance
- 🔒 Security

#### 3. **Requirements Checklist**

All items must be checked:

**Code Quality & Standards:**
- Uses shared components from `@iiskills/ui`
- Proper imports (`@iiskills/ui/*`, `@iiskills/core`)
- No prohibited patterns
- ESLint passes
- Prettier formatting applied

**Architecture & Integration:**
- Conforms to `common-integration-plan.md`
- Required files present (app.config.js)
- Access control via shared logic
- No code duplication

**Testing:**
- Tests written/updated
- Unit tests pass
- E2E tests pass
- Manual testing complete
- Config validation passes
- No regressions

**Visual Changes:**
- Screenshots attached (all devices)
- Visual regression tests pass
- Design reviewed
- Responsive design verified
- Accessibility standards met

**Security:**
- Security scan passed
- No secrets in code
- Dependencies reviewed

**Documentation:**
- Comments added where needed
- Docs updated
- CHANGELOG.md updated

---

## Automated Checks

Every PR triggers multiple automated workflows that run comprehensive checks:

### 1. PR Template Validation

**What it checks:**
- PR has adequate description (minimum 50 characters)
- Issue linkage present
- Template sections completed

**When it runs:** On PR open, sync, or edit

**How to fix:**
- Use the PR template
- Link to relevant issues
- Fill out all required sections

### 2. Code Quality & Linting

**What it checks:**
- ESLint rules pass (`yarn lint:check`)
- Prettier formatting applied (`yarn format:check`)
- No linting errors or warnings

**When it runs:** On every PR update

**How to fix:**
```bash
yarn lint:fix
yarn format
```

### 3. Import & Pattern Validation

**What it checks:**
- No local component imports (must use `@iiskills/ui`)
- No deprecated app references (unless marked as such)
- Proper package imports
- Required files present in modified apps

**When it runs:** On every PR update

**Example violations:**
```javascript
// ❌ BAD: Local import
import Button from '../../components/shared/Button';

// ✅ GOOD: Package import
import { Button } from '@iiskills/ui/common';
```

### 4. Unit Tests

**What it checks:**
- All unit tests pass
- Test coverage maintained
- No failing tests

**When it runs:** On every PR update

**How to run locally:**
```bash
yarn test
```

### 5. E2E Tests

**What it checks:**
- All Playwright E2E tests pass
- Tests run on multiple browsers (Chromium, Firefox, WebKit)
- Mobile and tablet tests pass

**When it runs:** On every PR update

**How to run locally:**
```bash
yarn test:e2e
```

### 6. Configuration Validation

**What it checks:**
- PORT assignments consistent
- No deprecated app references (active code)
- Environment files properly configured
- Content schema valid

**When it runs:** On every PR update

**How to run locally:**
```bash
yarn validate-config
yarn validate-content
```

### 7. Security Scan

**What it checks:**
- No critical or high severity vulnerabilities
- Dependencies reviewed
- No secrets in code

**When it runs:** On every PR update

**How to run locally:**
```bash
npm audit --audit-level=high
```

### 8. Build Verification

**What it checks:**
- All 10 active apps build successfully
- No build errors
- Build output generated

**When it runs:** On every PR update

**Apps checked:**
- main, learn-ai, learn-apt, learn-chemistry
- learn-developer, learn-geography, learn-management
- learn-math, learn-physics, learn-pr

---

## Static & Content Analysis

### Danger.js Automated Analysis

Our Danger.js configuration performs sophisticated PR analysis:

#### Checks Performed

1. **PR Metadata**
   - PR size (warns if >500 lines changed)
   - Title length (minimum 10 characters)
   - Description completeness

2. **Code Quality**
   - console.log statements (warns)
   - TODO/FIXME comments (warns if >3)

3. **Import Validation**
   - Prohibited local imports (fails)
   - Proper @iiskills/ui usage (reports count)
   - Deprecated app references (warns)

4. **Testing Requirements**
   - Tests added for source changes (warns if missing)
   - Reports test file count

5. **Configuration Safety**
   - No .env files committed (fails)
   - package.json + yarn.lock sync (warns)

6. **Visual Changes**
   - Detects UI file changes
   - Requires screenshots (fails if missing)

7. **Security Issues**
   - Hardcoded secrets (fails)
   - eval() usage (fails)
   - dangerouslySetInnerHTML (fails)

8. **Documentation**
   - Warns if significant changes without docs
   - Suggests CHANGELOG updates

#### Report Generated

Danger.js generates a comprehensive report including:
- Change statistics
- Requirements checklist
- Recommendations
- Next steps

---

## Visual QA Requirements

### When Screenshots are Required

Screenshots **must** be provided when PR modifies:
- Components in `/components/` directories
- Page files in `/pages/` directories
- CSS/styling files
- Tailwind configuration

### Required Screenshot Set

For **every UI change**, provide:

#### Desktop (1920x1080)
- Landing page (if affected)
- Navigation (if affected)
- Forms/inputs (if affected)
- Key user flows

#### Tablet (768x1024)
- Same views as desktop
- Verify responsive behavior

#### Mobile (375x667)
- Same views as desktop/tablet
- Verify mobile-specific layouts

### How to Generate Screenshots

Use our automated screenshot tool:

```bash
./capture-qa-screenshots.sh
```

This script:
- Starts all apps
- Captures screenshots at all required resolutions
- Organizes output by app and device
- Generates comparison reports

### Visual Regression Testing

We use Playwright's visual testing capabilities:

```bash
# Update snapshots (after verifying changes)
yarn test:e2e --update-snapshots

# Run visual tests
yarn test:e2e
```

---

## Human Review Process

### Reviewer Responsibilities

Every PR requires **at least one** reviewer to:

1. ✅ Verify all automated checks are green
2. ✅ Confirm all checklist items are complete
3. ✅ Review code quality and maintainability
4. ✅ Verify tests adequately cover changes
5. ✅ Check documentation clarity
6. ✅ Manually test edge cases
7. ✅ Approve if everything looks good

### Edge Case Verification

Reviewers must manually test:
- Boundary conditions
- Error handling
- Race conditions
- Cross-browser compatibility
- Mobile touch interactions
- Accessibility features

### Review Checklist

In the PR template, reviewers complete:

```markdown
## Reviewer Checklist
- [ ] All automated checks are green ✅
- [ ] All requirements in checklist are met
- [ ] Code quality is high and maintainable
- [ ] Tests adequately cover changes
- [ ] Documentation is clear and complete
- [ ] Edge cases manually verified (with comment below)
- [ ] No obvious bugs or issues
- [ ] Approved for merge
```

### When Additional Reviews are Required

- **UI changes**: Design team approval
- **Security changes**: Security team approval
- **Infrastructure**: DevOps team approval
- **Breaking changes**: Lead developer approval

---

## Auto-Generated Reports

### Requirements Fulfillment Report

Every PR automatically receives a comprehensive report:

#### Report Sections

1. **Change Statistics**
   - Files changed
   - Lines added/deleted
   - Test files updated
   - Documentation files updated

2. **Requirements Checklist**
   - ✅ Proper package imports
   - ✅ No .env files committed
   - ✅ No security issues
   - ✅ Tests included
   - ✅ Screenshots provided

3. **Recommendations**
   - List of suggested improvements
   - Links to relevant documentation

4. **Next Steps**
   - Clear action items
   - What needs to be addressed

#### Example Report

```markdown
## 🤖 Automated Requirements Analysis Report

### 📊 Change Statistics
- **Files Changed**: 5
- **Lines Added**: 142
- **Lines Deleted**: 28
- **Test Files**: 2
- **Documentation Files**: 1

### ✅ Requirements Checklist
- ✅ Proper package imports (@iiskills/ui)
- ✅ No .env files committed
- ✅ No security issues detected
- ✅ Tests included
- ✅ Screenshots provided (if UI changes)

### 💡 Recommendations
✨ **Excellent!** This PR follows all major guidelines.

### 🚀 Next Steps
1. Address any ❌ failures and ⚠️ warnings above
2. Ensure all automated tests pass
3. Request review from team members
4. Wait for reviewer approval
```

---

## Merge Requirements

### All of the Following Must Be True

Before a PR can be merged:

1. ✅ **All automated checks pass**
   - PR template validation
   - Code quality/linting
   - Import validation
   - Unit tests
   - E2E tests
   - Config validation
   - Security scan
   - Build verification

2. ✅ **Danger.js report shows no critical issues**

3. ✅ **All PR template checklist items checked**

4. ✅ **At least one human reviewer approval**

5. ✅ **Additional approvals if required**
   - UI changes: Design approval
   - Security: Security approval
   - Infrastructure: DevOps approval

6. ✅ **No unresolved comments**

7. ✅ **Branch up to date with main**

### Merge Blocker Configuration

Branch protection rules enforce:
- Required status checks must pass
- Required reviews must be approved
- Branch must be up to date
- No force pushes allowed

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: Linting Fails

**Solution:**
```bash
yarn lint:fix
yarn format
git add .
git commit -m "Fix linting issues"
```

#### Issue: Tests Fail Locally

**Solution:**
```bash
# Clear cache
yarn cache clean

# Reinstall dependencies
rm -rf node_modules
yarn install

# Run tests
yarn test
```

#### Issue: E2E Tests Timeout

**Solution:**
```bash
# Install browsers
npx playwright install --with-deps

# Run with headed mode to debug
yarn test:e2e:headed
```

#### Issue: Build Fails for Specific App

**Solution:**
```bash
# Navigate to app
cd apps/<app-name>

# Clear Next.js cache
rm -rf .next

# Rebuild
yarn build
```

#### Issue: Import Validation Fails

**Solution:**
Replace local imports with package imports:
```javascript
// Change this:
import Button from '../../components/shared/Button';

// To this:
import { Button } from '@iiskills/ui/common';
```

#### Issue: Screenshots Missing

**Solution:**
```bash
# Generate screenshots
./capture-qa-screenshots.sh

# Upload to PR description
# Attach the generated screenshots
```

#### Issue: Merge Blocked by Missing Review

**Solution:**
- Ensure all automated checks pass first
- Request review from appropriate team members
- Address any feedback promptly

---

## Examples

### Example 1: Passing PR

**Title:** Add user profile avatar feature

**Description:**
```markdown
## Related Issues
- Closes #234

## Type of Change
- [x] ✨ New feature

## Requirements Checklist
[All items checked]

## Testing Evidence
All tests pass:
- Unit tests: 42 passed
- E2E tests: 18 passed
- Config validation: ✅

## Screenshots
[Screenshots attached for desktop, tablet, mobile]
```

**Automated Report:**
```markdown
## 🤖 Automated Requirements Analysis Report

### ✅ Requirements Checklist
- ✅ Proper package imports
- ✅ No .env files committed
- ✅ No security issues detected
- ✅ Tests included
- ✅ Screenshots provided

✅ **All critical checks passed!** Ready for review.
```

**Result:** ✅ Approved and merged

---

### Example 2: Failing PR

**Title:** Fix bug

**Description:**
```markdown
Fixed a bug
```

**Automated Report:**
```markdown
## 🤖 Automated Requirements Analysis Report

### ❌ Issues Found
- ❌ PR title too short
- ❌ No issue linkage
- ❌ Local component imports detected
- ❌ No tests added
- ❌ UI changes but no screenshots

❌ **5 critical issues found.** Please address before merging.
```

**Result:** ❌ Requires fixes before review

---

## Contact & Support

### Questions?

- **Documentation**: See [CONTRIBUTING.md](../CONTRIBUTING.md)
- **Deployment**: See [DEPLOYMENT_POLICY.md](../DEPLOYMENT_POLICY.md)
- **Architecture**: See [MONOREPO_ARCHITECTURE.md](../MONOREPO_ARCHITECTURE.md)
- **Slack**: `#development` channel
- **Email**: dev@iiskills.cloud

### Requesting an Exception

For valid reasons (emergency hotfixes, special circumstances):

1. Contact DevOps lead
2. Document reason in PR
3. Get CTO approval
4. Create post-mortem after merge

**Note:** Exceptions are rare and require written approval.

---

## Appendix

### Useful Commands Reference

```bash
# Pre-PR checks
yarn test && yarn test:e2e && yarn validate-config && yarn lint:check

# Fix common issues
yarn lint:fix && yarn format

# Generate screenshots
./capture-qa-screenshots.sh

# Run specific test suite
yarn test:e2e:chrome

# Update visual snapshots
yarn test:e2e --update-snapshots

# Check security
npm audit --audit-level=high

# Validate configuration
yarn validate-config
yarn validate-content
```

### GitHub Actions Workflows

- `.github/workflows/pr-requirements-check.yml` - Main requirements check
- `.github/workflows/danger-pr-analysis.yml` - Danger.js analysis
- `.github/workflows/build-test.yml` - Build verification

### Key Files

- `.github/PULL_REQUEST_TEMPLATE.md` - PR template
- `.github/dangerfile.js` - Danger.js configuration
- `common-integration-plan.md` - Architecture guidelines
- `DEPLOYMENT_POLICY.md` - Deployment requirements

---

**Document Version**: 1.0.0  
**Maintained By**: DevOps & Platform Engineering Team  
**Last Updated**: 2026-02-18
