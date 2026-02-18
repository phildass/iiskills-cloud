# Deployment Policy & Test-Before-Deploy Requirements

**Version**: 1.0.0  
**Last Updated**: 2026-02-18  
**Status**: ENFORCED

---

## Overview

This document defines the mandatory deployment policy for iiskills.cloud. **No code may be deployed to production without completing all steps in this policy**. This policy exists to prevent regressions, maintain consistent user experience, and protect our brand reputation.

---

## Core Principle

> **"If it's not tested, it's not deployable."**

Every change—no matter how small—must pass automated tests and manual verification before deployment.

---

## Non-Negotiable Requirements

### 1. ✅ All Automated Tests Must Pass

Before any PR can be merged:

```bash
# Unit tests
yarn test

# E2E tests (all browsers)
yarn test:e2e

# Configuration validation
yarn validate-config
```

**No exceptions.** If tests fail, the PR cannot be merged.

### 2. 📸 Screenshot Evidence Required

For any UI/UX change, provide before/after screenshots for:

- **Desktop** (1920x1080)
- **Tablet** (768x1024)
- **Mobile** (375x667)

**Minimum Required:**
- Landing page (if affected)
- Authentication flows (if affected)
- Payment flows (if affected)
- Navigation (if affected)

Upload screenshots to PR description using:
```bash
./capture-qa-screenshots.sh
```

### 3. 🔒 Security Scan Must Pass

Before finalizing any PR:

```bash
# Check for security vulnerabilities
npm audit
yarn audit

# Check dependencies (if adding new ones)
# (Use gh-advisory-database tool in GitHub Copilot)
```

### 4. 📝 PR Description Must Include

Every PR must have:

- **What**: Clear description of what changed
- **Why**: Justification for the change
- **Testing**: List of tests added/updated
- **Screenshots**: Visual evidence (for UI changes)
- **Risks**: Any potential risks or breaking changes
- **Rollback Plan**: How to revert if issues arise

### 5. 👥 Code Review Approval

- **Minimum**: 1 approval from a senior developer
- **UI changes**: Additional approval from design team
- **Security changes**: Additional approval from security team
- **Infrastructure changes**: Additional approval from DevOps team

---

## Deployment Checklist

### Pre-Merge Checklist

- [ ] All unit tests pass locally (`yarn test`)
- [ ] All E2E tests pass locally (`yarn test:e2e`)
- [ ] Configuration validation passes (`yarn validate-config`)
- [ ] No console errors in browser
- [ ] Code reviewed and approved
- [ ] Screenshots provided (if UI change)
- [ ] Security scan passed
- [ ] Documentation updated (if needed)
- [ ] CHANGELOG.md updated

### Pre-Deployment Checklist

- [ ] CI/CD pipeline passes
- [ ] Staging environment tested
- [ ] Database migrations tested (if applicable)
- [ ] Environment variables verified
- [ ] SSL certificates valid
- [ ] Monitoring alerts configured
- [ ] Rollback plan documented

### Post-Deployment Checklist

- [ ] Smoke tests pass
- [ ] All 10 apps accessible
- [ ] No errors in logs
- [ ] Performance metrics normal
- [ ] User acceptance testing (UAT) passed
- [ ] Stakeholders notified

---

## Test Coverage Requirements

### Minimum Coverage Targets

| Area | Coverage | Status |
|------|----------|--------|
| Authentication | 100% | Required |
| Payment Flows | 100% | Required |
| OTP Flows | 100% | Required |
| Access Control | 100% | Required |
| Navigation | 90% | Required |
| Admin Tools | 90% | Required |
| Sample Lessons | 80% | Recommended |

### Testing Matrix

Every major feature must be tested across:

- ✅ Chromium (Desktop)
- ✅ Firefox (Desktop)
- ✅ WebKit (Desktop)
- ✅ Mobile Chrome
- ✅ Mobile Safari
- ✅ Tablet (iPad Pro)

---

## Shared Component Update Policy

When updating shared components (`/components/shared/`):

### 1. Impact Assessment

Identify all apps using the component:
```bash
# Search for component usage
grep -r "ComponentName" apps/*/
```

### 2. Test All Affected Apps

- Run E2E tests for **every app** that uses the component
- Manual testing on at least 2 different apps
- Verify no regressions

### 3. Update Documentation

- Update `SHARED_COMPONENTS_LIBRARY.md`
- Document breaking changes
- Update component JSDoc

### 4. Synchronous Deployment

- Deploy changes to **all apps simultaneously**
- Never leave apps in inconsistent state

---

## Emergency Hotfix Policy

### When Emergency Deployment is Allowed

- **P0 Security Vulnerability**: Actively exploited security issue
- **P0 Production Outage**: Complete service down for users
- **P0 Data Loss Risk**: Risk of losing user data

### Emergency Deployment Process

1. **Create hotfix branch** from production
2. **Implement minimal fix** (smallest possible change)
3. **Test on staging** (even for emergencies)
4. **Get emergency approval** (CTO or on-call lead)
5. **Deploy with rollback ready**
6. **Create post-mortem** within 24 hours

**Note**: Even emergencies require basic testing. Untested code is never deployed.

---

## Staging Environment

### Purpose

Staging is a production-like environment for final validation before deployment.

### Requirements

- Mirror production configuration
- Use production-like data (anonymized)
- Test all deployment scripts
- Validate SSL certificates
- Run full E2E test suite

### Staging Deployment

```bash
# Deploy to staging
./deploy-standalone.sh --env=staging

# Run smoke tests
./smoke-test-recovery.sh staging

# Verify all apps
./health-check.sh staging
```

---

## Rollback Procedures

### Immediate Rollback Triggers

Rollback immediately if:

- Error rate > 5%
- Any app completely unavailable
- Data corruption detected
- Security breach suspected

### Rollback Process

```bash
# 1. Stop PM2 processes
pm2 stop all

# 2. Checkout previous stable version
git checkout <previous-stable-tag>

# 3. Rebuild if necessary
yarn build

# 4. Restart services
pm2 restart all

# 5. Verify rollback
./health-check.sh production
```

### Post-Rollback

- Notify all stakeholders
- Create incident report
- Schedule post-mortem
- Document lessons learned

---

## Feature Flags

For large changes, use feature flags to enable gradual rollout:

```javascript
// Example feature flag usage
const ENABLE_NEW_FEATURE = process.env.NEXT_PUBLIC_ENABLE_NEW_FEATURE === 'true';

if (ENABLE_NEW_FEATURE) {
  // New implementation
} else {
  // Old implementation
}
```

### Feature Flag Best Practices

- Default to `false` (opt-in)
- Test both enabled and disabled states
- Remove flag after 30 days
- Document in code comments

---

## Monitoring & Alerts

### Required Monitoring

- **Uptime**: All 10 apps monitored (99.9% target)
- **Response Time**: Page load < 3s (95th percentile)
- **Error Rate**: < 1% errors
- **SSL Certificates**: 30-day expiry warning

### Alert Channels

- Slack: `#production-alerts`
- Email: `ops@iiskills.cloud`
- PagerDuty: Critical issues

---

## Documentation Requirements

### Must Update

When making changes, update relevant documentation:

- **README.md**: If setup process changes
- **SHARED_COMPONENTS_LIBRARY.md**: If components change
- **ENV_SETUP_GUIDE.md**: If environment variables change
- **DEPLOYMENT.md**: If deployment process changes
- **CHANGELOG.md**: For all user-facing changes

---

## Deployment Schedule

### Regular Deployments

- **Staging**: Daily (Monday-Friday, 2 PM)
- **Production**: Tuesday/Thursday only, 10 AM
- **Hotfixes**: As needed (with emergency approval)

### Blackout Periods (No Deployments)

- Friday after 2 PM
- Weekends (except emergencies)
- Public holidays
- During major events/sales

---

## Compliance & Audit

### Audit Trail

Every deployment must be logged:

- **Who** deployed
- **What** was deployed (commit SHA)
- **When** deployed (timestamp)
- **Why** deployed (PR/issue reference)
- **Results** (success/failure)

### Retention

- Deployment logs: 1 year
- Test results: 6 months
- Screenshots: 3 months

---

## Violation Consequences

### First Violation

- Warning
- Required training on deployment policy

### Second Violation

- PR privileges suspended for 1 week
- Manager notified

### Third Violation

- Formal disciplinary action
- Extended privilege suspension

### Severe Violations (Untested Production Deployment)

- Immediate privilege revocation
- Incident review with management

---

## Policy Review

This policy is reviewed quarterly and updated as needed. Last review: 2026-02-18

**Next Review**: 2026-05-18

---

## Questions or Exceptions

For questions about this policy or to request an exception:

1. Contact: DevOps Lead
2. Email: devops@iiskills.cloud
3. Slack: `#deployment-policy`

**Note**: Exceptions are rare and require written approval from CTO.

---

## Quick Reference Card

```
PRE-MERGE CHECKLIST:
☐ yarn test (unit tests)
☐ yarn test:e2e (E2E tests)
☐ yarn validate-config (config check)
☐ Screenshots (if UI change)
☐ Code review approved
☐ Documentation updated

PRE-DEPLOY CHECKLIST:
☐ CI/CD passes
☐ Staging tested
☐ SSL valid
☐ Rollback plan ready

POST-DEPLOY CHECKLIST:
☐ Smoke tests pass
☐ All apps accessible
☐ No errors in logs
☐ Stakeholders notified
```

---

**Remember**: Quality over speed. A delayed deployment is better than a broken production environment.

---

**Maintained By**: DevOps & Platform Engineering Team  
**Document Version**: 1.0.0  
**Effective Date**: 2026-02-18
