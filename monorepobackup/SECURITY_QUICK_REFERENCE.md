# Security Quick Reference Card

**Version:** 1.0 | **Date:** 2026-02-19

---

## 🚨 Emergency Contacts

| Issue | Contact | Action |
|-------|---------|--------|
| **Security Breach** | security@iiskills.in | Immediate response |
| **Credential Compromise** | security@iiskills.in | Rotate credentials immediately |
| **Production Outage** | [On-call engineer] | Follow incident response |

---

## ✅ Pre-Launch Checklist (Quick Version)

### Critical (Must Do):
- [ ] Run `./scripts/security-audit.sh` - Should pass with 0 critical issues
- [ ] Run `npm audit --production` - Should show 0 vulnerabilities
- [ ] Rotate ALL credentials (use production values, not dev)
- [ ] Set `DEBUG_ADMIN=false` in production
- [ ] Set `OPEN_ACCESS=false` in production
- [ ] Set `PAYWALL_ENABLED=true` in production
- [ ] Verify HTTPS certificate installed and valid
- [ ] Test payment flow end-to-end with test mode first

### Important (Should Do):
- [ ] Configure CDN/WAF rate limiting
- [ ] Set up error monitoring (Sentry)
- [ ] Configure uptime monitoring
- [ ] Test backup and restore
- [ ] Publish Terms of Service and Privacy Policy

---

## 🔐 Security Commands (Daily Use)

### Check Security Status:
```bash
# Run full security audit
./scripts/security-audit.sh

# Check for vulnerabilities
npm audit --production

# Verify production config
./verify-production-config.sh
```

### Before Committing Code:
```bash
# Run security audit
./scripts/security-audit.sh

# Lint code
npm run lint

# Run tests
npm test
```

### Production Deployment:
```bash
# 1. Pre-deployment checks
./scripts/pre-deploy-check.sh

# 2. Build
npm run build

# 3. Deploy (use your method)
# vercel --prod
# netlify deploy --prod
# pm2 restart all

# 4. Post-deployment checks
./scripts/post-deploy-check.sh
```

---

## 📋 Environment Variables (Critical)

### Production Settings (MUST BE SET CORRECTLY):

```bash
# Security Flags (ALL MUST BE FALSE/TRUE AS SHOWN)
DEBUG_ADMIN=false                      # ⚠️ CRITICAL
NEXT_PUBLIC_DEBUG_ADMIN=false          # ⚠️ CRITICAL
NEXT_PUBLIC_DISABLE_AUTH=false         # ⚠️ CRITICAL
NEXT_PUBLIC_PAYWALL_ENABLED=true       # ⚠️ CRITICAL
OPEN_ACCESS=false                      # ⚠️ CRITICAL
NEXT_PUBLIC_TEST_MODE=false            # ⚠️ CRITICAL

# Secrets (MUST BE ROTATED FOR PRODUCTION)
SUPABASE_SERVICE_ROLE_KEY=prod-key-here
RAZORPAY_KEY_ID=rzp_live_XXX           # Note: rzp_LIVE not rzp_test
RAZORPAY_KEY_SECRET=prod-secret
SENDGRID_API_KEY=SG.prod-key
OPENAI_API_KEY=sk-prod-key
ADMIN_JWT_SECRET=64-char-random-string
```

### Quick Check:
```bash
# In production environment
echo "DEBUG_ADMIN=$DEBUG_ADMIN"
# Should output: DEBUG_ADMIN=false

echo "RAZORPAY_KEY_ID=$RAZORPAY_KEY_ID"
# Should start with: rzp_live_ (not rzp_test_)
```

---

## 🛡️ Security Headers (Automatically Applied)

All 11 Next.js configs now include security headers:
- ✅ Content-Security-Policy (CSP)
- ✅ Strict-Transport-Security (HSTS)
- ✅ X-Frame-Options: SAMEORIGIN
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy: strict-origin-when-cross-origin

### Verify Headers:
```bash
curl -I https://iiskills.cloud | grep -i "strict-transport-security"
# Should return: Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## 🔑 Credential Rotation Schedule

| Credential Type | Rotation Interval | Next Due |
|----------------|-------------------|----------|
| Supabase Keys | 90 days | [Set after launch + 90 days] |
| Razorpay Keys | 90 days | [Set after launch + 90 days] |
| SendGrid API | 90 days | [Set after launch + 90 days] |
| OpenAI API | 90 days | [Set after launch + 90 days] |
| Admin Passwords | 90 days | [Set after launch + 90 days] |
| reCAPTCHA | 180 days | [Set after launch + 180 days] |

### Rotation Reminder:
Set calendar reminders for 2 weeks before rotation due date.

---

## 🚫 Common Mistakes (DON'T DO THIS)

### ❌ Never Commit Secrets:
```bash
# BAD - Hardcoded secret
const API_KEY = "sk_live_abc123";

# GOOD - Environment variable
const API_KEY = process.env.OPENAI_API_KEY;
```

### ❌ Never Use Test Credentials in Production:
```bash
# BAD
RAZORPAY_KEY_ID=rzp_test_...

# GOOD
RAZORPAY_KEY_ID=rzp_live_...
```

### ❌ Never Expose Secrets on Client:
```bash
# BAD - Available in browser
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

# GOOD - Server-side only (no NEXT_PUBLIC_ prefix)
const SECRET_KEY = process.env.SECRET_KEY;
```

### ❌ Never Skip Security Audit:
```bash
# BAD - Committing without checking
git commit -m "quick fix"
git push

# GOOD - Always audit first
./scripts/security-audit.sh
# Fix any issues
git commit -m "fix: security improvements"
git push
```

---

## 📚 Documentation Quick Links

### Essential Reading:
1. **[PRODUCTION_SECURITY_CHECKLIST.md](PRODUCTION_SECURITY_CHECKLIST.md)** - 180+ item checklist
2. **[SECURITY_HARDENING_GUIDE.md](SECURITY_HARDENING_GUIDE.md)** - Comprehensive guide
3. **[.env.production.example](.env.production.example)** - Production config template

### Reference Guides:
- **[CREDENTIAL_ROTATION_POLICY.md](CREDENTIAL_ROTATION_POLICY.md)** - Rotation procedures
- **[ANTI_COPY_LEGAL_PROTECTION.md](ANTI_COPY_LEGAL_PROTECTION.md)** - Protection strategies
- **[SECURITY.md](SECURITY.md)** - Security policy and reporting

### Tools:
- **`scripts/security-audit.sh`** - Automated security scanner
- **`scripts/update-nextjs-security.sh`** - Config updater
- **`config/security-headers.js`** - Security headers module
- **`utils/client-protection.js`** - Client-side protections

---

## 🔍 Incident Response (Quick Actions)

### 1. Suspected Credential Compromise:
```bash
# IMMEDIATE (within 1 hour):
# 1. Verify compromise (check logs)
# 2. Rotate compromised credential IMMEDIATELY
# 3. Check for unauthorized access
# 4. Email security@iiskills.in

# Example: Rotate Razorpay key
# - Login to Razorpay Dashboard
# - Settings → API Keys → Generate New Key
# - Update production environment
# - Deploy
# - Deactivate old key
```

### 2. Security Vulnerability Discovered:
```bash
# 1. DO NOT open public GitHub issue
# 2. Email security@iiskills.in with details
# 3. Include:
#    - Description of vulnerability
#    - Steps to reproduce
#    - Potential impact
# 4. Wait for response (24 hours)
```

### 3. Production Security Issue:
```bash
# 1. Take affected system offline (if critical)
# 2. Email security@iiskills.in
# 3. Document everything:
#    - What happened
#    - When it happened
#    - What was affected
# 4. Preserve logs
# 5. Follow incident response plan
```

---

## 🎯 Security Score Card

Track your security score:

### Current Status (Check Daily):
```bash
./scripts/security-audit.sh
# Target: 0 critical issues, <5 warnings

npm audit --production
# Target: 0 vulnerabilities
```

### Production Readiness:
- [ ] Security audit passes (0 critical)
- [ ] 0 production vulnerabilities
- [ ] All credentials rotated
- [ ] Production config correct
- [ ] HTTPS enabled
- [ ] Monitoring configured
- [ ] Backup tested
- [ ] Team trained

**Score:** ___/8 (Target: 8/8 before launch)

---

## 📞 Support Contacts

| Need | Contact | Response Time |
|------|---------|---------------|
| Security Issue | security@iiskills.in | 24 hours |
| Production Emergency | [On-call engineer] | Immediate |
| General Support | support@iiskills.in | 48 hours |
| Legal Questions | legal@iiskills.in | 3-5 days |

---

## 🔄 Monthly Tasks

### Week 1:
- [ ] Run security audit
- [ ] Review access logs
- [ ] Check for failed login attempts

### Week 2:
- [ ] Review dependency updates
- [ ] Check monitoring alerts
- [ ] Verify backups working

### Week 3:
- [ ] Review credential rotation schedule
- [ ] Check for unauthorized copies (Google Alerts)
- [ ] Audit admin access

### Week 4:
- [ ] Monthly security review meeting
- [ ] Update documentation if needed
- [ ] Plan next month's security tasks

---

## 💡 Tips & Best Practices

1. **When in doubt, ask** - Email security@iiskills.in
2. **Never commit .env files** - Always in .gitignore
3. **Rotate credentials regularly** - Set calendar reminders
4. **Monitor logs daily** - Check for anomalies
5. **Keep dependencies updated** - Review Dependabot PRs weekly
6. **Test in staging first** - Never deploy untested to production
7. **Document everything** - Especially security-related changes
8. **Train the team** - Quarterly security awareness training

---

## 🚀 Quick Win Actions (Do These Today)

1. Run security audit: `./scripts/security-audit.sh`
2. Check vulnerabilities: `npm audit --production`
3. Verify .env.local not in git: `git ls-files | grep .env.local` (should be empty)
4. Bookmark this page for quick reference
5. Set calendar reminder for 90-day credential rotation
6. Join security mailing list (when available)
7. Complete onboarding security training

---

**Print this card and keep it at your desk! 📌**

---

*Last Updated: 2026-02-19 | Version: 1.0 | Owner: Security Team*
