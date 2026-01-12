# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of iiskills-cloud seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please DO NOT:
- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Please DO:
1. Email security reports to: **security@iiskills.cloud** (or repository owner if dedicated security email is not available)
2. Include the following information:
   - Type of vulnerability
   - Full paths of source file(s) related to the vulnerability
   - Location of the affected source code (tag/branch/commit or direct URL)
   - Any special configuration required to reproduce the issue
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the vulnerability, including how an attacker might exploit it

### What to expect:
- We will acknowledge receipt of your vulnerability report within 48 hours
- We will send you a more detailed response within 7 days indicating the next steps
- We will keep you informed about the progress towards a fix and public disclosure
- We may ask for additional information or guidance

## Security Update Process

1. Security vulnerabilities are assessed and prioritized
2. A fix is prepared and tested in a private repository
3. Security advisory is prepared
4. Fix is released and security advisory is published
5. Dependencies are updated via Dependabot

## Security Best Practices for Contributors

### Environment Variables
- **NEVER** commit `.env`, `.env.local`, or any files containing secrets
- Use `.env.local.example` as a template
- All sensitive credentials must be stored in environment variables
- Review `.gitignore` to ensure sensitive files are excluded

### Dependencies
- Keep dependencies up to date
- Review Dependabot PRs promptly
- Run `yarn security:audit` before commits
- Check for known vulnerabilities before adding new dependencies

### Code Security
- Follow ESLint security rules
- Sanitize all user inputs
- Use parameterized queries for database operations
- Implement proper authentication and authorization checks
- Avoid eval() and similar dangerous functions
- Use HTTPS for all external API calls

### Authentication & Authorization
- Use Supabase authentication for all user access
- Implement proper session management
- Use secure, httpOnly cookies
- Implement proper CORS policies
- Validate JWT tokens on every request

### Data Protection
- Encrypt sensitive data at rest and in transit
- Use environment variables for API keys and secrets
- Implement proper access controls
- Follow principle of least privilege
- Regularly rotate credentials

## Security Features

### Enabled Security Measures
- ✅ ESLint security plugin
- ✅ Automated dependency scanning (Dependabot)
- ✅ CodeQL security scanning
- ✅ GitHub Actions CI/CD with security checks
- ✅ Secret scanning (requires GitHub configuration)
- ✅ Branch protection rules (requires GitHub configuration)

### Recommended GitHub Settings
See SECURITY_SETUP_GUIDE.md for instructions on:
- Enabling secret scanning
- Configuring branch protection
- Setting up required reviewers
- Enforcing 2FA for all collaborators

## Security Contacts

For security-related questions or concerns:
- Repository Owner: phildass
- Email: security@iiskills.cloud (if available)
- GitHub Security Advisories: https://github.com/phildass/iiskills-cloud/security/advisories

## Acknowledgments

We appreciate the security research community and will acknowledge researchers who responsibly disclose vulnerabilities to us.
