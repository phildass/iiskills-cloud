# Credential Rotation Policy

**Document Version:** 1.0  
**Last Updated:** 2026-02-19  
**Owner:** Security Team  
**Review Frequency:** Quarterly

---

## 1. Purpose

This policy establishes procedures and schedules for rotating credentials, API keys, passwords, and secrets used in the iiskills-cloud platform. Regular rotation reduces the risk of credential compromise and limits the window of exposure if a breach occurs.

---

## 2. Scope

This policy applies to:
- All production credentials and secrets
- Staging/development environment credentials (lower priority)
- All personnel with access to credentials
- All systems and services that use authentication

---

## 3. Credential Categories

### 3.1 Critical Credentials (90-day rotation)

**Supabase:**
- Service Role Key
- Database passwords
- JWT secrets

**Payment Gateway (Razorpay):**
- API Key ID
- API Key Secret
- Webhook Secret

**Email Service (SendGrid):**
- API Key

**AI Services:**
- OpenAI API Key

**Admin Authentication:**
- Admin JWT Secret
- Admin passwords

### 3.2 Standard Credentials (180-day rotation)

**Bot Protection:**
- reCAPTCHA keys

**Analytics & Monitoring:**
- Sentry DSN
- Analytics tokens

**Third-party APIs:**
- Adzuna API keys
- News API keys
- Gemini API keys

### 3.3 User Passwords (User-initiated)

- Minimum 90-day reminder
- Force rotation after security incident

---

## 4. Rotation Schedule

### Regular Schedule

| Credential Type | Rotation Interval | Responsible Party | Notification Timeline |
|----------------|-------------------|-------------------|----------------------|
| Supabase Service Key | 90 days | DevOps Lead | 2 weeks before |
| Razorpay Keys | 90 days | Payment Team Lead | 2 weeks before |
| SendGrid API Key | 90 days | DevOps Lead | 2 weeks before |
| OpenAI API Key | 90 days | Backend Lead | 2 weeks before |
| Admin JWT Secret | 90 days | Security Lead | 2 weeks before |
| Admin Passwords | 90 days | Individual Admins | 1 week before |
| reCAPTCHA Keys | 180 days | DevOps Lead | 4 weeks before |
| Third-party APIs | 180 days | Backend Lead | 4 weeks before |

### Emergency Rotation

Immediate rotation required when:
- Credential suspected or confirmed compromised
- Team member with access leaves company
- Security breach at third-party provider
- Credential accidentally exposed (e.g., committed to git)
- As mandated by compliance requirements

---

## 5. Rotation Procedures

### 5.1 Pre-Rotation Checklist

- [ ] Schedule rotation during low-traffic period (if possible)
- [ ] Notify all stakeholders 48 hours in advance
- [ ] Prepare rollback plan
- [ ] Verify backup systems are current
- [ ] Test rotation procedure in staging first

### 5.2 Rotation Steps

#### A. Supabase Service Role Key

```bash
# 1. Generate new key in Supabase Dashboard
#    - Go to Project Settings → API
#    - Click "Generate new service_role key"
#    - Copy new key

# 2. Update in production environment
#    - In hosting platform (Vercel, Netlify, etc.)
#    - Or in secrets management system (AWS Secrets Manager, etc.)

# 3. Deploy with new key
#    - Use blue-green deployment if available
#    - Monitor for errors

# 4. Verify functionality
./scripts/post-deploy-check.sh

# 5. Revoke old key after 24-hour grace period
#    - In Supabase Dashboard → Project Settings → API
```

#### B. Razorpay API Keys

```bash
# 1. Log in to Razorpay Dashboard
#    - Go to Settings → API Keys

# 2. Generate new key pair
#    - Click "Generate Key"
#    - Download and securely store new credentials

# 3. Update production environment variables
RAZORPAY_KEY_ID=rzp_live_NEW_KEY_ID
RAZORPAY_KEY_SECRET=NEW_KEY_SECRET

# 4. Update webhook secret
#    - Go to Settings → Webhooks
#    - Regenerate secret for webhook URL
#    - Update RAZORPAY_WEBHOOK_SECRET

# 5. Deploy and test
#    - Test payment flow end-to-end
#    - Verify webhook delivery

# 6. Deactivate old keys after 48-hour grace period
```

#### C. SendGrid API Key

```bash
# 1. Log in to SendGrid Dashboard
#    - Go to Settings → API Keys

# 2. Create new API key
#    - Click "Create API Key"
#    - Set permissions: "Mail Send" (restricted access)
#    - Copy new key (shown only once!)

# 3. Update production environment
SENDGRID_API_KEY=SG.NEW_API_KEY_HERE

# 4. Deploy and test
#    - Send test newsletter
#    - Verify email delivery

# 5. Delete old API key
#    - In SendGrid Dashboard → Settings → API Keys
```

#### D. Admin JWT Secret

```bash
# 1. Generate new secret
openssl rand -base64 64

# 2. Update production environment
ADMIN_JWT_SECRET=NEW_SECRET_HERE

# 3. Deploy
#    - All existing admin sessions will be invalidated
#    - Admins will need to re-authenticate

# 4. Notify admins
#    - Send email notification
#    - "You will be logged out and need to sign in again"

# 5. Monitor for issues
```

#### E. Admin Passwords

```bash
# 1. Admin initiates password change
#    - Go to /admin/settings
#    - Click "Change Password"

# 2. System enforces password policy
#    - Minimum 8 characters
#    - Complexity requirements

# 3. Invalidate all existing sessions
#    - Force re-login

# 4. Log password change event
#    - Timestamp, user, IP address
```

### 5.3 Post-Rotation Checklist

- [ ] Verify all services functioning normally
- [ ] Test critical user flows
- [ ] Check error logs for authentication failures
- [ ] Confirm monitoring and alerts working
- [ ] Update credential inventory spreadsheet
- [ ] Document rotation in audit log
- [ ] Schedule next rotation reminder

---

## 6. Credential Storage

### 6.1 Development

**Local Development:**
```bash
# .env.local (gitignored)
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

**Team Sharing:**
- Use 1Password Teams or LastPass Enterprise
- Create shared vault for dev credentials
- Enable audit logging
- Require 2FA for access

### 6.2 Production

**Hosting Platform:**
- Vercel: Environment Variables (encrypted at rest)
- Netlify: Environment Variables (encrypted at rest)
- AWS: Secrets Manager (automatic rotation support)
- Azure: Key Vault
- Google Cloud: Secret Manager

**Best Practices:**
- Never store in source code
- Never commit to git
- Encrypt at rest
- Encrypt in transit
- Limit access (principle of least privilege)
- Enable audit logging
- Use separate credentials per environment

---

## 7. Access Control

### 7.1 Who Has Access

| Credential Type | Access Required |
|----------------|----------------|
| Supabase Service Key | DevOps Lead, Backend Lead |
| Razorpay Keys | Payment Team, DevOps Lead |
| SendGrid API Key | DevOps Lead, Backend Lead |
| OpenAI API Key | Backend Lead |
| Admin Passwords | Individual Admins Only |
| Production .env | DevOps Lead Only |

### 7.2 Access Granting Process

1. **Request:** Submit access request ticket
2. **Justification:** Business need documented
3. **Approval:** Manager + Security Lead approval
4. **Access:** Granted with minimum privileges
5. **Audit:** Access logged and reviewed monthly
6. **Revocation:** Automatic upon role change/departure

### 7.3 Offboarding Process

When team member with credential access leaves:

**Immediate (same day):**
- [ ] Revoke all system access
- [ ] Disable VPN/SSH keys
- [ ] Reset shared passwords they knew
- [ ] Remove from 1Password/LastPass vaults

**Within 24 hours:**
- [ ] Rotate all credentials they had access to
- [ ] Review audit logs for their activity
- [ ] Update access control documentation

**Within 7 days:**
- [ ] Conduct exit interview security review
- [ ] Verify all access revoked
- [ ] Document offboarding completion

---

## 8. Monitoring & Auditing

### 8.1 Audit Logs

**What to log:**
- Credential creation/rotation/deletion
- Access to credential storage
- Credential usage (API calls with key ID)
- Failed authentication attempts
- Unusual access patterns

**Retention:**
- Keep logs for minimum 12 months
- Production logs: 24 months
- Compliance logs: 7 years (if required)

### 8.2 Monitoring Alerts

**Configure alerts for:**
- Credential used from unusual location
- Credential used outside business hours
- Multiple failed authentication attempts
- Credential approaching rotation deadline
- Credential expired

### 8.3 Regular Reviews

**Monthly:**
- [ ] Review credential access logs
- [ ] Verify rotation schedule on track
- [ ] Check for expired credentials
- [ ] Review failed authentication attempts

**Quarterly:**
- [ ] Audit all credential access
- [ ] Review and update rotation policy
- [ ] Test emergency rotation procedures
- [ ] Conduct security awareness training

**Annually:**
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Policy review and update
- [ ] Disaster recovery drill

---

## 9. Incident Response

### 9.1 Suspected Credential Compromise

**Immediate Actions (within 1 hour):**
1. **Verify:** Confirm compromise (check logs, reports)
2. **Contain:** Rotate compromised credential immediately
3. **Assess:** Determine scope of access
4. **Notify:** Alert security team and management

**Within 24 hours:**
1. **Investigate:** Full forensic analysis
2. **Remediate:** Fix vulnerability that led to compromise
3. **Monitor:** Enhanced monitoring for related activity
4. **Document:** Incident report with timeline

**Within 7 days:**
1. **Review:** Conduct post-mortem
2. **Improve:** Update policies and procedures
3. **Train:** Security awareness for team
4. **Comply:** Notify authorities if required (data breach laws)

### 9.2 Accidental Exposure

**If credential accidentally committed to git:**

```bash
# DO NOT just delete the file and commit!
# The secret is still in git history

# 1. Immediately rotate the exposed credential
#    - Follow rotation procedure for that credential type

# 2. Remove from git history (use BFG Repo-Cleaner or git-filter-repo)
git clone --mirror https://github.com/phildass/iiskills-cloud.git
java -jar bfg.jar --replace-text passwords.txt iiskills-cloud.git
cd iiskills-cloud.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force

# 3. Notify all team members to re-clone
#    - Old clones may still contain the secret

# 4. Document incident
#    - What was exposed, for how long
#    - Actions taken to remediate
```

**If credential sent via insecure channel:**
1. Rotate immediately
2. Verify no unauthorized usage
3. Document incident
4. Retrain team on secure communication

---

## 10. Compliance & Reporting

### 10.1 Compliance Requirements

**PCI DSS:**
- Rotate payment-related credentials every 90 days
- Document all rotations
- Audit access to payment credentials

**SOC 2:**
- Automated credential rotation preferred
- Audit trail of all credential access
- Quarterly access reviews

**GDPR/CCPA:**
- Secure credential storage
- Access control and monitoring
- Data breach notification procedures

### 10.2 Reporting

**Monthly Report:**
- Credentials rotated this month
- Upcoming rotations (next 30 days)
- Access grants/revocations
- Security incidents

**Quarterly Report:**
- Compliance status
- Audit findings
- Policy updates
- Training completed

**Annual Report:**
- Full credential inventory
- Rotation compliance rate
- Security incidents summary
- Recommendations for improvement

---

## 11. Training & Awareness

### 11.1 New Employee Onboarding

**Security training includes:**
- Credential handling procedures
- Password policy requirements
- 2FA setup and usage
- Incident reporting process
- This rotation policy

### 11.2 Ongoing Training

**Quarterly:**
- Security awareness refresher
- New threat landscape updates
- Policy changes

**Annual:**
- Comprehensive security training
- Phishing simulation exercises
- Incident response drills

### 11.3 Resources

- Security Hardening Guide
- Production Security Checklist
- Incident Response Playbook
- Internal wiki/documentation

---

## 12. Policy Enforcement

### 12.1 Automated Enforcement

**CI/CD Checks:**
```yaml
# .github/workflows/security-audit.yml
- name: Check for credential rotation
  run: |
    # Check credential age
    ./scripts/check-credential-age.sh
    
    # Fail if credentials older than policy
    if [ $? -ne 0 ]; then
      echo "::error::Credentials past rotation deadline"
      exit 1
    fi
```

### 12.2 Manual Enforcement

**Rotation Reminders:**
- Email notification 14 days before rotation due
- Slack reminder 7 days before
- Escalation to manager if overdue

**Compliance Reviews:**
- Monthly review by Security Lead
- Quarterly review by management
- Annual audit by external auditor

### 12.3 Non-Compliance

**Consequences:**
- First offense: Warning + mandatory training
- Second offense: Written warning + access review
- Third offense: Access revocation + disciplinary action
- Willful violation: Immediate termination + legal action

---

## 13. Exceptions

### 13.1 Exception Process

1. **Request:** Submit exception request
2. **Justification:** Document business/technical reason
3. **Risk Assessment:** Security team evaluates risk
4. **Approval:** CTO approval required
5. **Compensating Controls:** Additional security measures
6. **Time Limit:** Exception valid for max 90 days
7. **Review:** Monthly review of active exceptions

### 13.2 Approved Exceptions

Document any approved exceptions here:

| Credential | Reason | Approved By | Expires | Compensating Controls |
|-----------|--------|-------------|---------|----------------------|
| (None currently) | - | - | - | - |

---

## 14. Tools & Automation

### 14.1 Recommended Tools

**Credential Management:**
- 1Password Teams
- LastPass Enterprise
- AWS Secrets Manager
- HashiCorp Vault

**Monitoring:**
- GitGuardian (secret scanning)
- Sentry (error tracking)
- Datadog (system monitoring)

**Automation:**
- Terraform (infrastructure as code)
- Ansible (configuration management)
- Custom scripts in `/scripts/` directory

### 14.2 Automation Scripts

**Check credential age:**
```bash
# scripts/check-credential-age.sh
# Checks when credentials were last rotated
# Alerts if past rotation deadline
```

**Rotate credentials:**
```bash
# scripts/rotate-credentials.sh
# Interactive script to guide through rotation process
# Validates new credentials before deployment
```

---

## 15. Appendix

### A. Credential Inventory Template

| Credential | Type | Location | Last Rotated | Next Rotation | Owner |
|-----------|------|----------|--------------|---------------|-------|
| Supabase Service Key | API Key | AWS Secrets | 2026-01-15 | 2026-04-15 | DevOps Lead |
| Razorpay Live Key | API Key | Vercel Env | 2026-01-20 | 2026-04-20 | Payment Lead |
| SendGrid API Key | API Key | Vercel Env | 2026-02-01 | 2026-05-01 | DevOps Lead |
| ... | ... | ... | ... | ... | ... |

### B. Emergency Contacts

- **Security Team:** security@iiskills.in
- **DevOps Lead:** [Name/Email]
- **CTO:** [Name/Email]
- **On-Call:** [Phone/Pager]

### C. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-19 | Security Team | Initial policy creation |

---

**Policy Owner:** Security Team  
**Approved By:** [CTO Name]  
**Effective Date:** [Launch Date]  
**Next Review:** [Launch Date + 3 months]

---

*For questions or clarifications, contact: security@iiskills.in*
