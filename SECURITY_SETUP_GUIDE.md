# Security Setup Guide - Manual GitHub Configuration

This guide covers the manual configuration steps required in GitHub repository settings to complete the security hardening of this monorepo.

## ⚠️ CRITICAL: These steps must be completed manually in GitHub Settings

## 1. Enable Secret Scanning

**Path:** Settings → Security → Code security and analysis

### Steps:
1. Navigate to repository **Settings**
2. Click **Security** in the left sidebar
3. Click **Code security and analysis**
4. Under **Secret scanning**:
   - Click **Enable** for "Secret scanning"
   - Click **Enable** for "Push protection" (recommended)
   - This prevents accidental commits of secrets

### What this does:
- Automatically scans repository for known secret patterns
- Alerts when secrets are detected
- Can block pushes containing secrets (with push protection)

---

## 2. Configure Branch Protection Rules

**Path:** Settings → Branches → Branch protection rules

### For `main` branch:

1. Navigate to **Settings** → **Branches**
2. Click **Add branch protection rule**
3. Branch name pattern: `main`
4. Enable the following settings:

#### Required Settings:
- ✅ **Require a pull request before merging**
  - ✅ Require approvals: **1** (minimum, increase for larger teams)
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners (if CODEOWNERS file exists)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Select the following required status checks:
    - `lint-and-format`
    - `security-scan`
    - `build`
    - `CodeQL`

- ✅ **Require conversation resolution before merging**

- ✅ **Require signed commits** (recommended for enhanced security)

- ✅ **Include administrators** (apply rules to admins too)

- ✅ **Restrict who can push to matching branches** (optional, for larger teams)

- ✅ **Allow force pushes**: ❌ (disabled)

- ✅ **Allow deletions**: ❌ (disabled)

#### Optional but Recommended:
- **Require linear history** - Prevents merge commits, enforces rebase
- **Require deployments to succeed** - If you have deployment workflows

5. Click **Create** to save the rule

### For `develop` branch (if used):
Repeat the above steps with slightly relaxed requirements:
- Require approvals: **1**
- Same status checks required

---

## 3. Enable Two-Factor Authentication (2FA)

**Path:** Organization Settings → Authentication security (for organizations)

### For Organization Owners:
1. Navigate to **Organization Settings**
2. Click **Authentication security**
3. Under **Two-factor authentication**:
   - Click **Require two-factor authentication**
   - Set grace period for members to enable 2FA
   - This will remove members who don't enable 2FA

### For Individual Collaborators:
Each collaborator must enable 2FA on their GitHub account:
1. Click profile photo → **Settings**
2. Click **Password and authentication**
3. Click **Enable two-factor authentication**
4. Follow the setup wizard

### Enforcement Timeline:
- Send notification to all collaborators
- Set 2-week grace period for enablement
- Remove access for users who don't comply

---

## 4. Configure Repository Access & Permissions

**Path:** Settings → Collaborators and teams

### Review and Restrict Access:

1. **Audit Current Access:**
   - Review all collaborators and teams
   - Remove users who no longer need access
   - Follow principle of least privilege

2. **Set Base Permissions:**
   - Default permission: **Read** (not Write)
   - Grant Write/Admin only as needed

3. **For Each Collaborator:**
   - Admin: Only repository owners
   - Write: Active developers only
   - Read: Everyone else (reviewers, stakeholders)

4. **For Organizations:**
   - Create teams by function (developers, reviewers, etc.)
   - Assign team-level permissions
   - Individual overrides only when necessary

---

## 5. Enable Dependabot Alerts

**Path:** Settings → Security → Code security and analysis

### Steps:
1. Navigate to **Settings** → **Security**
2. Under **Dependabot**:
   - ✅ **Dependency graph**: Enable (should be enabled by default)
   - ✅ **Dependabot alerts**: Enable
   - ✅ **Dependabot security updates**: Enable

### What this does:
- Automatically creates PRs to fix vulnerable dependencies
- Sends alerts for new vulnerabilities
- Works with the `.github/dependabot.yml` configuration file

### Configure Notifications:
1. Go to **Settings** → **Notifications**
2. Under **Dependabot alerts**:
   - Choose notification preferences
   - Recommended: Enable email notifications

---

## 6. Enable Code Scanning with CodeQL

**Path:** Settings → Security → Code security and analysis

### Steps:
1. Navigate to **Settings** → **Security**
2. Under **Code scanning**:
   - Click **Set up** → **Advanced**
   - The CodeQL workflow has already been added (`.github/workflows/codeql.yml`)
   - Verify the workflow runs successfully

### What this does:
- Automatically scans code for security vulnerabilities
- Runs on every push and PR
- Weekly scheduled scans
- Results appear in Security tab

---

## 7. Configure Security Advisories

**Path:** Security → Advisories

### Steps:
1. Navigate to **Security** tab
2. Review **Security advisories**
3. Set up notification preferences

### For Private Vulnerability Reporting:
1. Go to **Settings** → **Security**
2. Under **Private vulnerability reporting**:
   - Click **Enable**
   - This allows security researchers to privately report vulnerabilities

---

## 8. Review and Configure Webhooks (Optional)

**Path:** Settings → Webhooks

### Recommended:
- Set up webhooks for security events
- Integrate with Slack/Discord for real-time alerts
- Monitor push events, PR events, security alerts

---

## 9. Environment Variables and Secrets

**Path:** Settings → Secrets and variables → Actions

### For GitHub Actions:
1. Add required secrets:
   - `SUPABASE_URL` (if needed for tests)
   - `SUPABASE_ANON_KEY` (if needed for tests)
   - Any other CI/CD secrets

2. **Never** commit actual credentials to repository
3. Use repository secrets for CI/CD
4. Use environment-specific secrets for deployments

---

## 10. Code Owners (Optional but Recommended)

### Create `.github/CODEOWNERS` file:
```
# Global owners
* @phildass

# Security-related files require security team review
SECURITY.md @phildass
.github/workflows/* @phildass
.env.local.example @phildass

# Each learning module
/learn-management/* @phildass
/learn-neet/* @phildass
# ... etc
```

This ensures specific people must review certain files.

---

## Verification Checklist

After completing all steps, verify:

- [ ] Secret scanning is enabled
- [ ] Push protection is enabled
- [ ] Branch protection rules are active on `main`
- [ ] Required status checks are configured
- [ ] 2FA is enforced for all collaborators
- [ ] Repository access is reviewed and restricted
- [ ] Dependabot alerts are enabled
- [ ] Dependabot security updates are enabled
- [ ] CodeQL scanning is active
- [ ] Private vulnerability reporting is enabled
- [ ] Security notifications are configured
- [ ] Environment secrets are properly configured

---

## Ongoing Maintenance

### Weekly:
- Review Dependabot PRs
- Check security alerts

### Monthly:
- Audit repository access
- Review failed status checks
- Update security documentation

### Quarterly:
- Review and rotate credentials
- Audit security policies
- Update threat model

---

## Support and Questions

For questions about this security setup:
- Review `SECURITY.md` for security policy
- Check existing issues and discussions
- Contact repository owner: @phildass

## Emergency Security Response

If you discover a security vulnerability:
1. **DO NOT** create a public issue
2. Follow responsible disclosure process in `SECURITY.md`
3. Contact: security@iiskills.cloud or repository owner

---

## Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)
- [Dependabot Documentation](https://docs.github.com/en/code-security/dependabot)
- [CodeQL Documentation](https://codeql.github.com/docs/)
- [Two-Factor Authentication](https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa)
