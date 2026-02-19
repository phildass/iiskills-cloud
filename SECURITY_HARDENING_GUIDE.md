# Security Hardening Guide

**Document Version:** 1.0  
**Last Updated:** 2026-02-19  
**Audience:** Development Team, DevOps, Security Engineers

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Secrets Management](#secrets-management)
4. [Authentication & Authorization](#authentication--authorization)
5. [Code Protection & Anti-Copy Measures](#code-protection--anti-copy-measures)
6. [API & Server Security](#api--server-security)
7. [Frontend Security](#frontend-security)
8. [Dependency Management](#dependency-management)
9. [Monitoring & Incident Response](#monitoring--incident-response)
10. [Compliance & Legal](#compliance--legal)

---

## Overview

This guide provides comprehensive security hardening instructions for the iiskills-cloud platform. It covers all aspects of application security from development through production deployment.

### Security Philosophy

Our security approach follows **defense-in-depth** principles:
- Multiple layers of protection
- Fail securely by default
- Principle of least privilege
- Regular audits and updates
- Rapid incident response

### Threat Model

Key threats we protect against:
- **Credential theft:** API keys, passwords, tokens
- **Data breaches:** User data, payment information
- **Code theft:** Proprietary algorithms, business logic
- **Content scraping:** Automated copying of content
- **Account takeover:** Unauthorized admin/user access
- **Payment fraud:** Fake transactions, chargebacks
- **DDoS attacks:** Service disruption

---

## Quick Start

### For Developers

```bash
# 1. Clone repository
git clone https://github.com/phildass/iiskills-cloud.git
cd iiskills-cloud

# 2. Install dependencies
yarn install

# 3. Set up development environment
cp .env.local.example .env.local
# Edit .env.local with your development credentials

# 4. Run security audit
chmod +x scripts/security-audit.sh
./scripts/security-audit.sh

# 5. Start development server
yarn dev
```

### For Production Deployment

```bash
# 1. Use production environment template
cp .env.production.example .env.production
# Fill in ALL production credentials (never use dev values!)

# 2. Verify configuration
./verify-production-config.sh

# 3. Run pre-deployment checks
./scripts/pre-deploy-check.sh

# 4. Build for production
npm run build

# 5. Deploy (using your deployment method)
# 6. Run post-deployment verification
./scripts/post-deploy-check.sh
```

---

## Secrets Management

### 1. Environment Variables

**NEVER commit secrets to git.** Always use environment variables.

#### Development
```bash
# .env.local (NEVER commit this file)
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RAZORPAY_KEY_ID=rzp_test_...
```

#### Production
```bash
# Use secure vault (AWS Secrets Manager, HashiCorp Vault, etc.)
# Or use hosting platform's environment variable management
# Examples: Vercel Environment Variables, Netlify Environment Variables
```

### 2. Secret Rotation Schedule

**Mandatory rotation intervals:**
- **API Keys:** Every 90 days
- **Database Credentials:** Every 90 days
- **JWT Secrets:** Every 90 days
- **Webhook Secrets:** Every 180 days
- **Admin Passwords:** Every 90 days

**Emergency rotation:**
- Immediately after any suspected compromise
- After team member departure with secret access
- After third-party security incident

### 3. Secret Scanning

**Pre-commit scanning:**
```bash
# Run before every commit
./scripts/security-audit.sh
```

**CI/CD scanning:**
- GitHub Actions workflow: `.github/workflows/security-audit.yml`
- Runs on every push and PR
- Fails build if secrets detected

**Tools:**
- GitGuardian (recommended)
- TruffleHog
- git-secrets
- GitHub Secret Scanning (automatic)

### 4. Secure Storage

**Development:**
- Store in `.env.local` (gitignored)
- Use 1Password/LastPass for team sharing
- Never send secrets via email/Slack

**Production:**
- Use AWS Secrets Manager, Azure Key Vault, or similar
- Enable automatic rotation where supported
- Audit secret access logs
- Implement break-glass procedures

---

## Authentication & Authorization

### 1. User Authentication

**Powered by Supabase Auth:**
```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Sign up
const { user, error } = await supabase.auth.signUp({
  email: email,
  password: password
});

// Sign in
const { user, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password
});
```

**Security features:**
- Password hashing (bcrypt)
- Email verification required
- Password reset via email
- Session management
- OAuth providers (Google)

### 2. Admin Authentication

**Production configuration:**
```bash
# MUST be false in production
DEBUG_ADMIN=false
NEXT_PUBLIC_DEBUG_ADMIN=false

# Use strong JWT secret
ADMIN_JWT_SECRET=<64+ character random string>

# Remove or set strong password
# NEXT_PUBLIC_ADMIN_SECRET_PASSWORD=
```

**Admin protection:**
```javascript
// In admin pages
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Never bypass in production
    if (process.env.NEXT_PUBLIC_DEBUG_ADMIN === 'true') {
      // Only in development
      return;
    }
    
    // Verify admin session
    const isAdmin = checkAdminAuth();
    if (!isAdmin) {
      router.push('/admin/login');
    }
  }, []);
  
  // ...
}
```

### 3. Access Control

**App-level access control:**
```javascript
import { userHasAccess } from '@iiskills/access-control';

// Check if user has access to paid content
const hasAccess = await userHasAccess(userId, appId);

if (!hasAccess) {
  // Show paywall
  return <PaywallComponent />;
}

// Show premium content
return <PremiumContent />;
```

**Row Level Security (RLS):**
- Enforced at database level (Supabase)
- Users can only access their own data
- Admin role has elevated permissions
- RLS policies tested before deployment

### 4. Password Policy

**Requirements:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (recommended)

**Implementation:**
```javascript
function validatePassword(password) {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return null; // Valid
}
```

### 5. Session Management

**Configuration:**
```javascript
// Supabase client configuration
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // More secure than implicit flow
  },
  global: {
    headers: {
      'x-client-info': 'iiskills-cloud'
    }
  }
});
```

**Security measures:**
- Session timeout: 30 minutes inactivity
- Automatic token refresh
- Secure cookie flags
- CSRF protection (built into Next.js)

---

## Code Protection & Anti-Copy Measures

### 1. Source Code Protection

**Disable source maps in production:**
```javascript
// next.config.js
module.exports = {
  productionBrowserSourceMaps: false, // CRITICAL!
  // ... other config
};
```

**Verify source maps disabled:**
```bash
# After build
ls .next/static/ | grep ".map$"
# Should return nothing
```

### 2. Code Minification & Obfuscation

**Automatic (Next.js built-in):**
- JavaScript minification (Terser)
- CSS minification
- Dead code elimination
- Tree shaking

**Additional obfuscation (optional):**
```bash
# Install webpack-obfuscator
yarn add --dev webpack-obfuscator

# Configure in next.config.js (use cautiously - can break code)
```

### 3. Client-Side Protection

**Usage:**
```javascript
import { enableProtections } from '@/utils/client-protection';
import { useEffect } from 'react';

export default function ProtectedPage() {
  useEffect(() => {
    // Only enable in production or for sensitive pages
    if (process.env.NEXT_PUBLIC_ENABLE_COPY_PROTECTION === 'true') {
      const cleanup = enableProtections({
        contextMenu: true,      // Disable right-click
        textSelection: true,    // Disable text selection
        copyShortcuts: true,    // Disable Ctrl+C, Ctrl+V, etc.
        dragDrop: true,         // Disable drag & drop
        watermark: {
          text: userEmail || 'Confidential',
          opacity: 0.1
        },
        onDevTools: (isOpen) => {
          if (isOpen) {
            console.warn('DevTools detected');
            // Optional: Log to analytics, show warning
          }
        }
      });
      
      return cleanup;
    }
  }, []);
  
  return <div>Protected content here</div>;
}
```

**⚠️ Important Disclaimers:**
- Client-side protections are **deterrents**, not foolproof
- Skilled attackers can bypass any client-side protection
- Combine with:
  - Watermarking (track source of leaks)
  - Server-side rate limiting
  - Legal protections (copyright, NDAs)
  - User tracking and analytics

### 4. Asset Protection

**Watermarking strategy:**
```javascript
// For PDF certificates
import jsPDF from 'jspdf';

function generateCertificate(userName, userId) {
  const doc = new jsPDF();
  
  // Visible content
  doc.text(`Certificate for ${userName}`, 10, 10);
  
  // Invisible watermark (metadata)
  doc.setProperties({
    title: 'iiskills Certificate',
    subject: `User: ${userId}`,
    keywords: `cert-${userId}-${Date.now()}`,
    creator: 'iiskills.cloud'
  });
  
  return doc;
}
```

**Image protection:**
- Low-resolution previews for free content
- High-resolution only for paid users
- Visible watermark on sample images
- CDN hotlink protection

---

## API & Server Security

### 1. Security Headers

**Implementation:**
```javascript
// next.config.js
const { getHeadersConfig } = require('./config/security-headers');

module.exports = {
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    return getHeadersConfig(isDev);
  }
};
```

**Key headers:**
- `Strict-Transport-Security`: Force HTTPS
- `X-Frame-Options`: Prevent clickjacking
- `X-Content-Type-Options`: Prevent MIME sniffing
- `Content-Security-Policy`: Prevent XSS
- `Referrer-Policy`: Control referrer information

### 2. CORS Configuration

**Restrictive CORS (production):**
```javascript
// pages/api/some-endpoint.js
export default async function handler(req, res) {
  // Set CORS headers
  const allowedOrigins = [
    'https://iiskills.cloud',
    'https://www.iiskills.cloud',
    'https://admin.iiskills.cloud',
    // Add other subdomains
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Handle request
  // ...
}
```

### 3. Rate Limiting

**Recommended implementation:**
```bash
# At CDN/WAF level (Cloudflare, AWS WAF)
# Or use API-level rate limiting
yarn add express-rate-limit
```

**Example:**
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'Too many requests, please try again later.'
});

// Apply to API routes
export default async function handler(req, res) {
  await limiter(req, res);
  
  // Handle request
  // ...
}
```

**Rate limits (recommended):**
- General API: 100 requests/minute
- Authentication: 5 attempts/15 minutes
- Payment APIs: 10 requests/minute
- Newsletter signup: 1 request/minute

### 4. Input Validation

**Never trust user input:**
```javascript
import { z } from 'zod';

// Define schema
const PaymentSchema = z.object({
  amount: z.number().positive().max(100000),
  email: z.string().email(),
  appId: z.enum(['main', 'learn-ai', 'learn-developer', /* ... */])
});

// Validate input
export default async function handler(req, res) {
  try {
    const validData = PaymentSchema.parse(req.body);
    // Process valid data
  } catch (error) {
    return res.status(400).json({ error: 'Invalid input' });
  }
}
```

### 5. Webhook Security

**Signature verification (Razorpay):**
```javascript
import crypto from 'crypto';

export default async function handler(req, res) {
  const signature = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  // Verify signature
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process webhook
  // ...
}
```

---

## Frontend Security

### 1. Content Security Policy (CSP)

**Configured in:** `config/security-headers.js`

**Key directives:**
- `default-src 'self'`: Only load resources from same origin
- `script-src`: Allow scripts only from trusted sources
- `style-src`: Allow styles only from trusted sources
- `img-src`: Control image sources
- `connect-src`: Control AJAX/WebSocket connections

**⚠️ Testing CSP:**
Start with `Content-Security-Policy-Report-Only` to avoid breaking functionality:
```javascript
key: 'Content-Security-Policy-Report-Only',
value: '...'  // Same as CSP but only reports violations
```

### 2. XSS Prevention

**React built-in protection:**
```jsx
// Automatic escaping
<div>{userInput}</div>  // Safe

// DANGEROUS - never use unless absolutely necessary
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // UNSAFE!
```

**Sanitize HTML if needed:**
```bash
yarn add dompurify
```

```javascript
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(dirtyHTML);
```

### 3. CSRF Protection

**Built into Next.js** for same-origin requests.

**For additional protection:**
```javascript
// Use SameSite cookies (already configured in Supabase auth)
res.setHeader('Set-Cookie', [
  `token=${token}; HttpOnly; Secure; SameSite=Strict`
]);
```

---

## Dependency Management

### 1. Regular Audits

**Weekly:**
```bash
npm audit
npm audit --production  # Production deps only
```

**Fix vulnerabilities:**
```bash
npm audit fix
npm audit fix --force  # For breaking changes
```

### 2. Automated Scanning

**GitHub Dependabot:**
- Configured in: `.github/dependabot.yml` (create if missing)
- Automatic PRs for dependency updates
- Security vulnerability alerts

### 3. License Compliance

**Check licenses:**
```bash
npx license-checker --summary
npx license-checker --json > licenses.json
```

**Avoid:**
- GPL/AGPL (copyleft - may require open-sourcing your code)
- Unlicensed packages

---

## Monitoring & Incident Response

### 1. Error Tracking

**Recommended: Sentry**
```bash
yarn add @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    // Don't send errors in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  }
});
```

### 2. Logging

**Structured logging:**
```javascript
const logger = {
  info: (message, meta) => {
    if (process.env.NODE_ENV === 'production') {
      console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
    } else {
      console.log(message, meta);
    }
  },
  error: (message, error, meta) => {
    console.error(JSON.stringify({ level: 'error', message, error: error.message, stack: error.stack, ...meta, timestamp: new Date().toISOString() }));
  }
};
```

**What to log:**
- ✅ Failed login attempts
- ✅ Admin actions
- ✅ Payment transactions
- ✅ API errors
- ✅ Unusual patterns
- ❌ Passwords, tokens, PII (never log sensitive data!)

### 3. Alerting

**Configure alerts for:**
- Multiple failed login attempts (5+ in 15 min)
- Admin password changes
- Payment failures
- API error rate >1%
- Service downtime
- Certificate expiration (30 days before)

### 4. Incident Response

**1. Detection**
- Monitoring alert triggers
- User reports
- Security scan findings

**2. Assessment**
- Severity: Critical / High / Medium / Low
- Scope: Single user / Multiple users / System-wide
- Data involved: PII / Payment data / Credentials

**3. Containment**
- Isolate affected systems
- Rotate compromised credentials
- Block malicious IPs
- Preserve evidence

**4. Resolution**
- Patch vulnerabilities
- Restore from backup if needed
- Verify fix

**5. Communication**
- Internal: Security team, management
- External: Affected users (if data breach)
- Legal: Report to authorities if required

**6. Post-Mortem**
- Document incident timeline
- Root cause analysis
- Preventive measures
- Update procedures

---

## Compliance & Legal

### 1. Data Protection

**GDPR (if serving EU users):**
- [ ] Privacy policy published
- [ ] Cookie consent banner
- [ ] Data export capability
- [ ] Data deletion capability
- [ ] Data processing agreements

**CCPA (if serving California users):**
- [ ] Privacy policy with CCPA disclosures
- [ ] "Do Not Sell My Personal Information" link
- [ ] User data access request process

### 2. Payment Compliance

**PCI DSS (required for payment processing):**
- [ ] Never store full card numbers
- [ ] Use Razorpay's hosted checkout (reduces PCI scope)
- [ ] Secure transmission (HTTPS)
- [ ] Access control and monitoring
- [ ] Regular security testing

**Implementation:**
```javascript
// GOOD: Use Razorpay checkout (PCI compliant)
const options = {
  key: process.env.RAZORPAY_KEY_ID,
  amount: amount,
  currency: 'INR',
  name: 'iiskills.cloud',
  handler: function(response) {
    // Verify payment on server
  }
};

const rzp = new Razorpay(options);
rzp.open();
```

### 3. Copyright Protection

**Measures:**
- [ ] Copyright notice in footer
- [ ] Terms of Service
- [ ] DMCA policy
- [ ] Watermarking strategy
- [ ] Content monitoring

**Legal text:**
```
© 2026 iiskills.cloud. All rights reserved.

Unauthorized copying, distribution, or use of this content
is strictly prohibited and may result in legal action.
```

---

## Appendix

### A. Security Checklist Summary

Quick reference - see `PRODUCTION_SECURITY_CHECKLIST.md` for full details.

**Pre-Launch:**
- [ ] All secrets rotated
- [ ] All debug flags disabled
- [ ] Security headers configured
- [ ] HTTPS enabled
- [ ] Rate limiting active
- [ ] Monitoring configured
- [ ] Penetration testing completed
- [ ] Legal documents published

### B. Emergency Contacts

- **Security Team:** security@iiskills.in
- **On-Call:** [Configure]
- **Hosting Support:** [Your hosting provider]
- **Legal Team:** [Configure]

### C. Tools & Resources

**Security Scanning:**
- GitGuardian: https://www.gitguardian.com/
- Snyk: https://snyk.io/
- npm audit: Built-in

**Penetration Testing:**
- OWASP ZAP: https://www.zaproxy.org/
- Burp Suite: https://portswigger.net/burp

**Monitoring:**
- Sentry: https://sentry.io/
- Datadog: https://www.datadoghq.com/
- New Relic: https://newrelic.com/

**Education:**
- OWASP Top 10: https://owasp.org/www-project-top-ten/
- Web Security Academy: https://portswigger.net/web-security

---

## Changelog

- **2026-02-19:** Initial version created for pre-launch security audit

---

*For questions or clarifications, contact: security@iiskills.in*
