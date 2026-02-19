# Production Security Checklist

**Version:** 1.0  
**Last Updated:** 2026-02-19  
**Status:** Pre-Launch Security Audit

## Overview

This document provides a comprehensive security checklist for deploying iiskills-cloud to production. Each item must be verified and checked off before launch.

---

## 🔐 1. Passwords & Secrets Management

### 1.1 Secret Storage
- [ ] All secrets stored in environment variables (never in code)
- [ ] Production `.env.local` never committed to git
- [ ] `.env.production.example` created with dummy values
- [ ] Secrets stored in secure vault (AWS Secrets Manager, HashiCorp Vault, or similar)
- [ ] Secret access limited to authorized personnel only

### 1.2 Credential Rotation
- [ ] All development credentials replaced with production credentials
- [ ] Supabase keys rotated
- [ ] Razorpay keys switched to live mode (rzp_live_*)
- [ ] SendGrid API key regenerated
- [ ] OpenAI API key regenerated
- [ ] reCAPTCHA keys replaced with production keys
- [ ] Admin JWT secret generated (64+ characters)
- [ ] Admin password changed from default 'iiskills123'

### 1.3 Encryption
- [ ] Database encryption at rest enabled (Supabase)
- [ ] SSL/TLS configured for all connections
- [ ] Minimum TLS 1.2 enforced
- [ ] Strong cipher suites configured

### 1.4 Secret Scanning
- [ ] Git history scanned for leaked secrets (GitGuardian, TruffleHog)
- [ ] Pre-commit hooks installed (`scripts/security-audit.sh`)
- [ ] CI/CD includes secret scanning step
- [ ] No API keys, passwords, or tokens in source code

**Verification Command:**
```bash
./scripts/security-audit.sh
```

---

## 🛡️ 2. Authentication & Access Control

### 2.1 Password Policy
- [ ] Minimum 8 characters enforced
- [ ] Complexity requirements (uppercase, lowercase, numbers)
- [ ] Password strength meter implemented
- [ ] Failed login attempt monitoring enabled
- [ ] Account lockout after 5 failed attempts

### 2.2 Multi-Factor Authentication (MFA)
- [ ] MFA enabled for all admin accounts
- [ ] MFA recommended (or required) for user accounts
- [ ] TOTP-based MFA configured (Google Authenticator, Authy)
- [ ] Backup codes generated and stored securely

### 2.3 Production Configuration
- [ ] `DEBUG_ADMIN=false`
- [ ] `NEXT_PUBLIC_DISABLE_AUTH=false`
- [ ] `NEXT_PUBLIC_PAYWALL_ENABLED=true`
- [ ] `OPEN_ACCESS=false`
- [ ] `NEXT_PUBLIC_TEST_MODE=false`
- [ ] `ADMIN_SETUP_MODE=false`

### 2.4 Session Management
- [ ] Session timeout configured (30 minutes recommended)
- [ ] Secure cookie flags set (`HttpOnly`, `Secure`, `SameSite`)
- [ ] Cookie domain properly scoped (`.iiskills.cloud`)
- [ ] Session invalidation on logout

### 2.5 Admin Access Monitoring
- [ ] Admin login attempts logged
- [ ] Admin actions audited
- [ ] Unusual admin activity alerts configured
- [ ] Admin access logs retained for 90+ days

**Verification:**
```bash
grep -r "DEBUG_ADMIN=false" .env.production.example
grep -r "DISABLE_AUTH=false" .env.production.example
```

---

## 🚫 3. Code & Site Anti-Copy Protection

### 3.1 Code Obfuscation
- [ ] JavaScript bundles minified
- [ ] Production source maps disabled
- [ ] Code splitting optimized
- [ ] Dead code eliminated
- [ ] Environment variables properly scoped (NEXT_PUBLIC_ only for client)

### 3.2 Client-Side Protection
- [ ] Right-click disable implemented (optional - see `utils/client-protection.js`)
- [ ] Text selection disable available (optional)
- [ ] Copy/paste shortcuts disabled (optional)
- [ ] DevTools detection configured (optional)
- [ ] Watermarking strategy documented

### 3.3 Asset Protection
- [ ] Critical assets watermarked
- [ ] Image optimization applied
- [ ] CDN configured with hotlink protection
- [ ] PDF certificates include unique IDs

### 3.4 Legal Protection
- [ ] Copyright notice in footer
- [ ] Terms of Service published
- [ ] DMCA policy published
- [ ] Trademark protection filed (if applicable)

**Configuration Files:**
- `config/security-headers.js` - Security headers
- `utils/client-protection.js` - Client-side protections
- Next.js configs - Source map settings

---

## 🌐 4. Server & API Security

### 4.1 HTTPS/TLS
- [ ] Valid SSL/TLS certificate installed
- [ ] Certificate auto-renewal configured (Let's Encrypt)
- [ ] HTTPS redirect configured (HTTP → HTTPS)
- [ ] HSTS header enabled (`Strict-Transport-Security`)
- [ ] Certificate expiration monitoring active

### 4.2 CORS Configuration
- [ ] CORS limited to iiskills.cloud domains only
- [ ] No wildcard CORS (`*`) in production
- [ ] Preflight requests handled correctly
- [ ] Credentials mode properly configured

### 4.3 Rate Limiting
- [ ] API rate limiting configured at CDN/WAF level
- [ ] Per-IP rate limits: 100 requests/minute
- [ ] Per-endpoint limits for sensitive operations
- [ ] Rate limit headers exposed (`X-RateLimit-*`)
- [ ] Brute force protection on login endpoints

### 4.4 DDoS Protection
- [ ] CDN with DDoS protection active (Cloudflare, AWS CloudFront)
- [ ] WAF rules configured
- [ ] Bot detection enabled
- [ ] Challenge pages for suspicious traffic

### 4.5 API Security
- [ ] All API endpoints require authentication (except public ones)
- [ ] Webhook signature verification implemented (Razorpay)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] NoSQL injection prevention

**Verification:**
```bash
curl -I https://iiskills.cloud | grep -i "strict-transport-security"
```

---

## 💻 5. Frontend Hardening

### 5.1 Security Headers
- [ ] Security headers configured in `next.config.js`
- [ ] `X-Frame-Options: SAMEORIGIN`
- [ ] `X-Content-Type-Options: nosniff`
- [ ] `X-XSS-Protection: 1; mode=block`
- [ ] `Referrer-Policy: strict-origin-when-cross-origin`
- [ ] `Permissions-Policy` configured
- [ ] Content Security Policy (CSP) configured

### 5.2 Build Configuration
- [ ] `productionBrowserSourceMaps: false` in all Next.js configs
- [ ] `reactStrictMode: true` in all Next.js configs
- [ ] Environment variables properly scoped
- [ ] Unnecessary dependencies removed
- [ ] Bundle size optimized (<500KB initial load)

### 5.3 Runtime Integrity
- [ ] Subresource Integrity (SRI) for external scripts
- [ ] Build hash verification
- [ ] Tamper detection for critical code paths

**Implementation:**
```javascript
// In next.config.js
const { getHeadersConfig } = require('./config/security-headers');

module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  async headers() {
    return getHeadersConfig(false); // false = production mode
  }
};
```

---

## 📦 6. Dependency Auditing

### 6.1 Vulnerability Scanning
- [ ] `npm audit` shows 0 vulnerabilities in production deps
- [ ] All dependencies up to date
- [ ] Deprecated packages replaced
- [ ] Unused dependencies removed

### 6.2 Automated Scanning
- [ ] Dependabot enabled on GitHub
- [ ] Weekly dependency update PRs
- [ ] Security Advisory workflow configured
- [ ] Critical vulnerability alerts to Slack/email

### 6.3 License Compliance
- [ ] All dependencies use compatible licenses
- [ ] License compliance report generated
- [ ] No GPL/AGPL dependencies (if applicable)

**Verification Commands:**
```bash
npm audit --production
npm audit --production --json > security-audit.json
npx license-checker --summary
```

---

## 🔍 7. Security Testing & Validation

### 7.1 Automated Testing
- [ ] Security audit script runs in CI/CD
- [ ] Unit tests for authentication
- [ ] Integration tests for payment flow
- [ ] E2E tests for critical paths

### 7.2 Manual Security Testing
- [ ] SQL injection testing
- [ ] XSS testing
- [ ] CSRF testing
- [ ] Authentication bypass testing
- [ ] Authorization bypass testing
- [ ] Input validation testing

### 7.3 External Audit
- [ ] Third-party penetration testing completed
- [ ] Penetration test report reviewed
- [ ] Critical vulnerabilities fixed
- [ ] Re-testing completed

### 7.4 Bug Bounty (Optional)
- [ ] Public bug bounty program configured (HackerOne, Bugcrowd)
- [ ] Responsible disclosure policy published
- [ ] Vulnerability reward structure defined

**Run Security Tests:**
```bash
npm run test
npm run test:e2e
./scripts/security-audit.sh
```

---

## 🏗️ 8. Production Configuration & Infrastructure

### 8.1 Environment Variables
- [ ] Production environment variables documented
- [ ] `.env.production.example` provided
- [ ] All debug flags disabled
- [ ] All test modes disabled
- [ ] Proper logging levels set (`LOG_LEVEL=error`)

### 8.2 Server Configuration
- [ ] Only necessary ports open (80, 443)
- [ ] SSH key-based authentication only (no passwords)
- [ ] Root login disabled
- [ ] Firewall configured (UFW, iptables, or cloud firewall)
- [ ] Fail2ban or similar intrusion prevention installed

### 8.3 Database Security
- [ ] Row Level Security (RLS) policies enabled
- [ ] Database user with minimal privileges
- [ ] Database backups automated (daily)
- [ ] Backup restoration tested
- [ ] Database connection pooling configured
- [ ] SSL/TLS required for DB connections

### 8.4 Monitoring & Alerting
- [ ] Error tracking configured (Sentry, Rollbar)
- [ ] Uptime monitoring active (Pingdom, UptimeRobot)
- [ ] Performance monitoring (New Relic, Datadog)
- [ ] Log aggregation (Logtail, Papertrail)
- [ ] Security alerts configured
- [ ] On-call rotation established

**Infrastructure as Code:**
```bash
# Deploy with verified configuration
./scripts/pre-deploy-check.sh
# Deploy
./scripts/post-deploy-check.sh
```

---

## 📋 9. Documentation & Policies

### 9.1 Security Documentation
- [ ] `SECURITY.md` updated with production contacts
- [ ] `SECURITY_HARDENING_GUIDE.md` created (this document)
- [ ] `CREDENTIAL_ROTATION_POLICY.md` created
- [ ] Incident response plan documented
- [ ] Disaster recovery plan documented

### 9.2 Legal Documents
- [ ] Terms of Service published
- [ ] Privacy Policy published
- [ ] Cookie Policy published
- [ ] GDPR compliance documented (if EU users)
- [ ] CCPA compliance documented (if CA users)
- [ ] PCI DSS compliance (payment handling)

### 9.3 Operational Procedures
- [ ] Deployment runbook
- [ ] Rollback procedure
- [ ] Incident response runbook
- [ ] Data breach response plan
- [ ] Backup/restore procedure

---

## 🚀 10. Pre-Launch Final Verification

### 10.1 Configuration Verification
Run the following commands and verify all pass:

```bash
# 1. Security audit
./scripts/security-audit.sh

# 2. Dependency audit
npm audit --production

# 3. Build verification
npm run build

# 4. Production config check
./verify-production-config.sh

# 5. E2E tests
npm run test:e2e
```

### 10.2 Manual Checks
- [ ] Test user registration flow
- [ ] Test user login flow
- [ ] Test password reset flow
- [ ] Test payment flow (Razorpay test mode first)
- [ ] Test access control (free vs paid content)
- [ ] Test admin authentication
- [ ] Test admin functionality
- [ ] Test newsletter signup
- [ ] Test certificate generation
- [ ] Verify all debug modes disabled

### 10.3 Security Headers Verification
```bash
# Check security headers
curl -I https://iiskills.cloud

# Should include:
# Strict-Transport-Security
# X-Frame-Options
# X-Content-Type-Options
# Content-Security-Policy
```

### 10.4 Performance & Load Testing
- [ ] Load testing completed (simulate 1000+ concurrent users)
- [ ] Database performance under load verified
- [ ] CDN caching verified
- [ ] API response times acceptable (<200ms p95)

---

## 📊 Security Score

**Target:** 95%+ before launch

Calculate your security score:
- Each completed checklist item = 1 point
- Total possible points: ~180
- Score = (Completed / Total) × 100

**Current Status:** Run `./scripts/security-audit.sh` for automated checks

---

## 🚨 Incident Response

If a security incident occurs:

1. **Immediate Actions:**
   - Isolate affected systems
   - Preserve logs and evidence
   - Contact security team

2. **Assessment:**
   - Determine scope of breach
   - Identify affected data/users
   - Document timeline

3. **Containment:**
   - Rotate compromised credentials
   - Patch vulnerabilities
   - Deploy fixes

4. **Communication:**
   - Notify affected users (if required)
   - Report to authorities (if required)
   - Update status page

5. **Post-Incident:**
   - Conduct post-mortem
   - Update security policies
   - Implement additional controls

**Emergency Contacts:**
- Security Team: security@iiskills.in
- On-Call: [Configure on-call rotation]

---

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [PCI DSS Requirements](https://www.pcisecuritystandards.org/)
- [GDPR Compliance](https://gdpr.eu/)

---

## 📝 Sign-Off

Before deploying to production, this checklist must be reviewed and signed off by:

- [ ] **Lead Developer:** _________________ Date: _______
- [ ] **Security Lead:** __________________ Date: _______
- [ ] **DevOps Lead:** ___________________ Date: _______
- [ ] **Project Manager:** ________________ Date: _______

**Deployment Authorization:** _______________
**Date:** _______________

---

*This checklist is a living document. Update as security requirements evolve.*
