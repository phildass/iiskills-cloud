# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of IISKILLS Cloud seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Open a Public Issue

Please do not open a public GitHub issue for security vulnerabilities. Public disclosure could put our users at risk.

### 2. Email Us Directly

Send details of the vulnerability to:

📧 **security@iiskills.in**

Include in your report:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if any)
- Your contact information

### 3. Response Timeline

- **24 hours**: Initial acknowledgment of your report
- **72 hours**: Preliminary assessment and severity classification
- **7 days**: Detailed response with planned fix timeline
- **30 days**: Security patch released (for high/critical issues)

### 4. Responsible Disclosure

We kindly ask that you:
- Give us reasonable time to address the issue before public disclosure
- Make a good faith effort not to access or destroy user data
- Do not intentionally harm the availability of our services

### 5. Recognition

We appreciate your efforts to responsibly disclose security issues. If you'd like, we'll acknowledge your contribution in:
- Our security advisory
- Our contributors list (optional)

## Security Measures

### Current Implementation

IISKILLS Cloud implements multiple layers of security:

#### Network Layer
- ✅ **HTTPS/TLS 1.3**: All production traffic encrypted
- ✅ **SSL Certificates**: Let's Encrypt certificates with auto-renewal
- ✅ **NGINX Security**: Rate limiting, request size limits
- ✅ **CORS**: Properly configured cross-origin policies

#### Application Layer
- ✅ **Authentication**: Supabase Auth with JWT tokens
- ✅ **Authorization**: Centralized access control via @iiskills/access-control
- ✅ **Session Management**: Secure session handling with automatic expiration
- ✅ **Input Validation**: All user inputs validated and sanitized
- ✅ **CSRF Protection**: Built-in Next.js CSRF protection

#### Data Layer
- ✅ **Row-Level Security (RLS)**: PostgreSQL RLS policies on all tables
- ✅ **Encrypted Storage**: Data encrypted at rest (Supabase)
- ✅ **Encrypted Transit**: All database connections over SSL/TLS
- ✅ **Prepared Statements**: Protection against SQL injection
- ✅ **Audit Logging**: All access control decisions logged

#### Payment Security
- ✅ **PCI Compliance**: Payment processing via Razorpay (PCI DSS Level 1)
- ✅ **Server-side Verification**: All payments verified server-side
- ✅ **Signature Validation**: Razorpay signature verification
- ✅ **No Card Data Storage**: Card data never touches our servers

### Environment Security

#### Production Environment
- ✅ No secrets in code repository
- ✅ Environment variables for all credentials
- ✅ Separate production and development environments
- ✅ Restricted database access
- ✅ Regular backups

#### Development Environment
- ✅ Test mode for payment gateway
- ✅ Separate Supabase projects
- ✅ No production data in development

## Security Best Practices for Contributors

### Code Security

1. **Never commit secrets**
   ```bash
   # Bad - DO NOT DO THIS
   const API_KEY = "sk_live_abc123def456";
   
   # Good - Use environment variables
   const API_KEY = process.env.RAZORPAY_KEY_SECRET;
   ```

2. **Validate all inputs**
   ```javascript
   // Good
   function processPayment(amount) {
     if (typeof amount !== 'number' || amount <= 0) {
       throw new Error('Invalid amount');
     }
     // Process payment
   }
   ```

3. **Use parameterized queries**
   ```javascript
   // Good - Parameterized
   const { data } = await supabase
     .from('users')
     .select('*')
     .eq('id', userId);
   
   // Bad - String concatenation (SQL injection risk)
   const query = `SELECT * FROM users WHERE id = '${userId}'`;
   ```

4. **Sanitize HTML output**
   ```javascript
   // Good - React auto-escapes
   <div>{userInput}</div>
   
   // Dangerous - Only use with trusted content
   <div dangerouslySetInnerHTML={{__html: trustedHtml}} />
   ```

### Authentication Security

1. **Check authentication on every API route**
   ```javascript
   export default async function handler(req, res) {
     const { user, error } = await supabase.auth.getUser(
       req.headers.authorization?.split('Bearer ')[1]
     );
     
     if (error || !user) {
       return res.status(401).json({ error: 'Unauthorized' });
     }
     
     // Proceed with authenticated logic
   }
   ```

2. **Verify access control**
   ```javascript
   import { userHasAccess } from '@iiskills/access-control';
   
   const hasAccess = await userHasAccess(userId, appId);
   if (!hasAccess) {
     return res.status(403).json({ error: 'Access denied' });
   }
   ```

### Data Security

1. **Use Row-Level Security**
   - All tables must have RLS enabled
   - Users can only access their own data
   - Admins have elevated privileges via policies

2. **Encrypt sensitive data**
   - Personal information encrypted at rest
   - Payment data handled by PCI-compliant provider
   - No sensitive data in logs

3. **Minimize data exposure**
   ```javascript
   // Good - Only return necessary fields
   const { data } = await supabase
     .from('users')
     .select('id, full_name, email');
   
   // Bad - Exposing internal fields
   const { data } = await supabase
     .from('users')
     .select('*');  // May include sensitive fields
   ```

## Vulnerability Disclosure Timeline

Past security issues (none currently):

| Date | Severity | Issue | Status |
|------|----------|-------|--------|
| - | - | - | - |

## Security Contacts

- **Security Issues**: security@iiskills.in
- **General Support**: support@iiskills.in
- **Business Inquiries**: contact@iiskills.in

## Automated Security Measures

### CI/CD Security Checks

Every pull request automatically runs:
1. ✅ npm audit (dependency vulnerabilities)
2. ✅ ESLint security rules
3. ✅ CodeQL analysis (planned)
4. ✅ Dependency review
5. ✅ Secret scanning (GitHub)

### Regular Security Activities

- **Weekly**: Automated dependency updates (Dependabot)
- **Monthly**: Manual security review
- **Quarterly**: External security audit
- **Annual**: Penetration testing (planned)

## Compliance

### Standards We Follow

- **OWASP Top 10**: Protection against common web vulnerabilities
- **PCI DSS**: Payment card data security (via Razorpay)
- **GDPR**: Data protection and privacy (EU users)
- **SOC 2**: Infrastructure security (via Supabase)

### Data Protection

- **User Data**: Stored securely in Supabase (SOC 2 compliant)
- **Payment Data**: Handled by Razorpay (PCI DSS Level 1)
- **Backups**: Automated daily backups with encryption
- **Data Retention**: As per our Privacy Policy

## Security Updates

Security updates are released as:
- **Critical**: Immediate patch release
- **High**: Patch within 7 days
- **Moderate**: Next scheduled release
- **Low**: Next major release

Subscribe to security updates:
- Watch this repository for releases
- Follow [@iiskills](https://twitter.com/iiskills) on Twitter
- Subscribe to our security mailing list (coming soon)

## Additional Resources

### Core Documentation
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture overview
- [DEPLOYMENT.md](DEPLOYMENT.md) - Secure deployment guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [SECURITY_AUDIT_REPORT.md](SECURITY_AUDIT_REPORT.md) - Latest security audit

### Pre-Launch Security Resources (NEW)
- **[Production Security Checklist](PRODUCTION_SECURITY_CHECKLIST.md)** - Complete pre-launch security verification checklist
- **[Security Hardening Guide](SECURITY_HARDENING_GUIDE.md)** - Comprehensive security implementation guide
- **[Credential Rotation Policy](CREDENTIAL_ROTATION_POLICY.md)** - Credential management and rotation procedures
- **[Anti-Copy & Legal Protection](ANTI_COPY_LEGAL_PROTECTION.md)** - Content protection and legal measures

### Security Tools
- **Security Audit Script:** `./scripts/security-audit.sh` - Run automated security checks
- **Production Config:** `.env.production.example` - Production-ready environment template
- **Security Headers:** `config/security-headers.js` - HTTP security headers configuration
- **Client Protection:** `utils/client-protection.js` - Client-side content protection utilities

## Questions?

For any security-related questions that don't involve a vulnerability, feel free to:
- Open a GitHub discussion
- Email security@iiskills.in
- Contact our support team

---

**Last Updated**: February 19, 2026  
**Next Review**: March 19, 2026

Thank you for helping keep IISKILLS Cloud and our users safe! 🔒
