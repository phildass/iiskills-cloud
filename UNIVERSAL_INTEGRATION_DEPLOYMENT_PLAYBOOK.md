# Universal Integration & Deployment Playbook

**Date**: February 19, 2026  
**Version**: 1.0  
**Purpose**: Complete guide for integrating, testing, and deploying apps in production

## 🎯 Overview

This playbook provides step-by-step instructions for integrating new apps, refactoring existing apps, and deploying to production with full QA validation.

## 📋 Table of Contents

1. [New App Integration](#new-app-integration)
2. [Existing App Refactoring](#existing-app-refactoring)
3. [Testing & Validation](#testing--validation)
4. [Deployment Process](#deployment-process)
5. [Rollback Procedures](#rollback-procedures)
6. [Monitoring & Support](#monitoring--support)

## 🆕 New App Integration

### Step 1: Planning Phase

**Duration**: 1-2 hours

**Checklist**:
- [ ] Define app type (FREE/PAID)
- [ ] Determine cluster assignment (Science/AI-Tech/Business/Singleton)
- [ ] Identify bundle requirements
- [ ] Plan content structure
- [ ] Define port assignment (next available)
- [ ] Review clustering guide

**Decision Tree**:
```
Is the app free or paid?
├─ FREE
│  └─ What subject?
│     ├─ Science (Math/Physics/Chemistry/Geography) → Science Cluster
│     ├─ Aptitude/Quiz-based → Singleton
│     └─ Other → Define new cluster
└─ PAID
   └─ What category?
      ├─ Tech/AI → AI-Tech Cluster
      ├─ Business → Business Cluster
      └─ Other → Define new cluster
```

### Step 2: Create App Structure

**Duration**: 30 minutes

```bash
# Navigate to apps directory
cd /home/runner/work/iiskills-cloud/iiskills-cloud/apps

# Create new app directory
mkdir learn-[subject]
cd learn-[subject]

# Copy base structure from similar app
# For science cluster:
cp -r ../learn-physics/* .

# For paid apps:
cp -r ../learn-ai/* .

# Update package.json
```

**Base Structure**:
```
learn-[subject]/
├── pages/
│   ├── _app.js              # Use common wrapper
│   ├── _document.js         # Use common HTML doc
│   ├── index.js             # Landing page
│   ├── dashboard.js         # Main content area
│   └── api/
│       ├── payment/         # (if paid app)
│       │   └── confirm.js   # Use centralized logic
│       └── access/          # Access checking
│           └── check.js
├── lib/
│   └── constants.js         # App-specific constants
├── app.config.js            # App configuration
├── next.config.js           # Next.js config
├── package.json             # Dependencies
└── README.md                # App documentation
```

### Step 3: Configure Access Control

**Duration**: 15 minutes

**For FREE Apps**:
```javascript
// Add to packages/access-control/appConfig.js
export const APP_CONFIG = {
  // ... existing apps ...
  'learn-[subject]': {
    name: 'Learn [Subject]',
    port: 3XXX, // Next available port
    accessType: 'free',
    price: 0,
    description: 'Description of the app'
  }
};
```

**For PAID Apps**:
```javascript
// Add to packages/access-control/appConfig.js
export const APP_CONFIG = {
  // ... existing apps ...
  'learn-[subject]': {
    name: 'Learn [Subject]',
    port: 3XXX,
    accessType: 'paid',
    price: 99, // Price in INR
    currency: 'INR',
    gst: 18, // GST percentage
    description: 'Description of the app'
  }
};

// If part of a bundle, add bundle configuration
export const BUNDLE_CONFIG = {
  'bundle-name': {
    name: 'Bundle Name',
    apps: ['app-1', 'app-2'],
    description: 'Bundle description'
  }
};
```

### Step 4: Implement Landing Page

**Duration**: 1-2 hours

**For FREE Apps**:
```javascript
// pages/index.js
import { Layout } from '@iiskills/ui/common';
import { Navbar } from '@iiskills/ui/navigation';
import { Footer } from '@iiskills/ui/navigation';
import { HeroSection } from '@iiskills/ui/landing';
import { LevelSelector } from '@iiskills/ui/content';

export default function HomePage() {
  return (
    <Layout>
      <Navbar appId="learn-[subject]" />
      <HeroSection
        title="Learn [Subject]"
        subtitle="Free comprehensive course"
        isFree={true}
      />
      <LevelSelector appId="learn-[subject]" />
      <Footer />
    </Layout>
  );
}
```

**For PAID Apps**:
```javascript
// pages/index.js
import { PaidAppLandingPage } from '@iiskills/ui/landing';

export default function HomePage() {
  return (
    <PaidAppLandingPage
      appId="learn-[subject]"
      title="Learn [Subject]"
      price={99}
      features={[
        'Feature 1',
        'Feature 2',
        'Feature 3'
      ]}
    />
  );
}
```

### Step 5: Implement Payment Logic (Paid Apps Only)

**Duration**: 30 minutes

```javascript
// pages/api/payment/confirm.js
import { 
  grantBundleAccess, 
  updatePaymentBundleInfo,
  getAppsToUnlock,
  getBundleInfo,
  getBundleAccessMessage
} from '../../../../../packages/access-control';
import { createClient } from '@supabase/supabase-js';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase credentials');
  }
  
  return createClient(supabaseUrl, supabaseServiceKey);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { transactionId, email, amount, userId } = req.body;

    if (!transactionId || !email || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify payment with gateway (implement actual verification)
    const paymentVerified = true; // TODO: Implement actual verification

    if (!paymentVerified) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }
    
    const supabase = getSupabaseClient();
    const appId = 'learn-[subject]';
    
    // Get apps to unlock (includes bundle logic)
    const appsToUnlock = getAppsToUnlock(appId);
    
    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from('payments')
      .insert({
        user_id: userId,
        app_id: appId,
        amount: amount,
        status: 'completed',
        transaction_id: transactionId,
        completed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      throw new Error(`Payment record creation failed: ${paymentError.message}`);
    }

    // Grant bundle access
    const result = await grantBundleAccess({
      userId,
      purchasedAppId: appId,
      paymentId: payment.id,
      supabaseClient: supabase
    });

    // Update payment with bundle info
    if (result.bundledApps && result.bundledApps.length > 0) {
      await updatePaymentBundleInfo(payment.id, result.bundledApps, supabase);
    }

    // Get bundle message
    const bundleMessage = getBundleAccessMessage(appId);

    return res.status(200).json({
      success: true,
      message: 'Payment confirmed and access granted',
      transactionId,
      appsUnlocked: appsToUnlock,
      bundleMessage
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    return res.status(500).json({ 
      error: 'Payment confirmation failed',
      details: error.message
    });
  }
}
```

### Step 6: Add to Build System

**Duration**: 15 minutes

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    // ... existing apps ...
    {
      name: 'iiskills-learn-[subject]',
      script: 'npx',
      args: 'next start',
      cwd: './apps/learn-[subject]',
      env: {
        NODE_ENV: 'production',
        PORT: 3XXX
      },
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '500M'
    }
  ]
};
```

### Step 7: Create Tests

**Duration**: 2-3 hours

```javascript
// tests/e2e/apps/learn-[subject].spec.js
import { test, expect } from '@playwright/test';

test.describe('Learn [Subject]', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('http://localhost:3XXX');
    await expect(page.locator('h1')).toContainText('Learn [Subject]');
  });

  // For FREE apps
  test('should show content without payment', async ({ page }) => {
    await page.goto('http://localhost:3XXX/dashboard');
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
  });

  // For PAID apps
  test('should require payment', async ({ page }) => {
    await page.goto('http://localhost:3XXX/dashboard');
    await expect(page.locator('[data-testid="payment-required"]')).toBeVisible();
  });

  // Add bundle tests if applicable
});
```

## 🔄 Existing App Refactoring

### Assessment Phase

**Duration**: 2-4 hours

**Checklist**:
- [ ] Identify duplicate code
- [ ] Map to cluster patterns
- [ ] List components to extract
- [ ] Identify unique features
- [ ] Plan migration steps
- [ ] Estimate effort

**Analysis Template**:
```markdown
# App Refactoring Analysis: [App Name]

## Current State
- App ID: [app-id]
- Type: FREE/PAID
- Cluster: [cluster-name]
- LOC: [lines of code]
- Dependencies: [list]

## Code Sharing Opportunities
- UI Components: [list components that can be shared]
- Business Logic: [list shared logic]
- Data Structures: [list shared structures]
- API Endpoints: [list shared endpoints]

## Estimated Code Sharing: [percentage]%

## Migration Steps
1. Extract component X to packages/ui/
2. Extract logic Y to packages/core/
3. Update imports in app
4. Test functionality
5. Deploy and verify

## Risks
- [List potential issues]

## Timeline
- Analysis: [days]
- Implementation: [days]
- Testing: [days]
- Deployment: [days]
```

### Refactoring Process

**Step 1: Extract Shared Components**
```bash
# Move component to shared package
mv apps/learn-[subject]/components/ComponentName.js \
   packages/ui/src/[cluster]/ComponentName.js

# Update package exports
# packages/ui/src/[cluster]/index.js
export { ComponentName } from './ComponentName';
```

**Step 2: Update Imports**
```javascript
// Before
import ComponentName from '../components/ComponentName';

// After
import { ComponentName } from '@iiskills/ui/[cluster]';
```

**Step 3: Test Incrementally**
```bash
# Test app build
cd apps/learn-[subject]
npm run build

# Test app functionality
npm run dev

# Run E2E tests
npm run test:e2e -- tests/e2e/apps/learn-[subject].spec.js
```

**Step 4: Repeat for All Cluster Apps**

## ✅ Testing & Validation

### Local Testing Checklist

**Unit Tests**:
```bash
# Run all unit tests
npm run test

# Run with coverage
npm run test:coverage

# Should achieve 80%+ coverage
```

**E2E Tests**:
```bash
# Start all apps
npm run build
npm run start

# Run E2E tests
npm run test:e2e

# Run specific app tests
npm run test:e2e -- tests/e2e/apps/learn-[subject].spec.js

# Run visual regression
npm run test:e2e -- tests/e2e/visual/
```

**Integration Tests**:
```bash
# Test access control
npm run test -- tests/integration/access-control.test.js

# Test payment flows (paid apps)
npm run test -- tests/integration/payment.test.js

# Test bundle logic
npm run test -- tests/integration/bundle.test.js
```

**Manual Testing**:
- [ ] App loads correctly
- [ ] Navigation works
- [ ] Content displays properly
- [ ] Authentication works (if required)
- [ ] Payment flow works (paid apps)
- [ ] Bundle logic works (bundled apps)
- [ ] Admin functions work
- [ ] Mobile responsive
- [ ] Cross-browser compatible

### Staging Deployment

```bash
# Deploy to staging
./deploy-standalone.sh learn-[subject] staging

# Verify deployment
curl http://staging.learn-[subject].iiskills.in

# Run smoke tests
./smoke-test.sh learn-[subject] staging

# Monitor logs
pm2 logs iiskills-learn-[subject]
```

## 🚀 Deployment Process

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates valid
- [ ] DNS configured
- [ ] Monitoring enabled
- [ ] Rollback plan ready
- [ ] Team notified

### Production Deployment

```bash
# 1. Create production build
cd apps/learn-[subject]
npm run build

# 2. Run final tests
npm run test
npm run test:e2e

# 3. Deploy to production
cd ../..
./deploy-standalone.sh learn-[subject] production

# 4. Verify deployment
curl https://learn-[subject].iiskills.in

# 5. Run health check
./health-check.sh learn-[subject]

# 6. Monitor logs
pm2 logs iiskills-learn-[subject]

# 7. Check metrics
pm2 monit
```

### Post-Deployment Verification

```bash
# Check app status
pm2 status | grep learn-[subject]

# Test critical flows
# - Landing page loads
# - Content accessible (FREE) or payment required (PAID)
# - Navigation works
# - Authentication works

# Monitor error logs
tail -f logs/learn-[subject]-error.log

# Check response times
curl -w "@curl-format.txt" -o /dev/null -s https://learn-[subject].iiskills.in
```

## ⏮️ Rollback Procedures

### When to Rollback

- Critical bugs affecting user experience
- Security vulnerabilities
- Performance degradation >50%
- Data corruption issues
- Payment processing failures

### Rollback Steps

```bash
# 1. Stop new deployment
pm2 stop iiskills-learn-[subject]

# 2. Revert to previous version
pm2 delete iiskills-learn-[subject]
git checkout <previous-commit>
npm run build
pm2 start ecosystem.config.js --only iiskills-learn-[subject]

# 3. Verify rollback
curl https://learn-[subject].iiskills.in
./health-check.sh learn-[subject]

# 4. Notify team
# Send notification about rollback

# 5. Document incident
# Create incident report with:
# - Issue description
# - Impact assessment
# - Rollback decision
# - Lessons learned
```

## 📊 Monitoring & Support

### Health Monitoring

```bash
# Real-time monitoring
pm2 monit

# Application logs
pm2 logs iiskills-learn-[subject]

# Error logs
pm2 logs iiskills-learn-[subject] --err

# Check memory usage
pm2 show iiskills-learn-[subject]
```

### Performance Metrics

- **Response Time**: < 200ms (p95)
- **Uptime**: > 99.9%
- **Error Rate**: < 0.1%
- **Memory Usage**: < 500MB per instance

### Alerting

Configure alerts for:
- App crashes
- High error rates
- Slow response times
- High memory usage
- Failed health checks

### Support Escalation

1. **Level 1**: Developer on-call
2. **Level 2**: Tech lead
3. **Level 3**: CTO/Senior architect

## 📝 Documentation Requirements

For each new/refactored app, create:

1. **App README**:
   - Purpose and features
   - Installation instructions
   - Configuration options
   - API documentation
   - Troubleshooting guide

2. **Integration Notes**:
   - Cluster assignment
   - Shared components used
   - Unique features
   - Known limitations

3. **Testing Documentation**:
   - Test coverage report
   - E2E test scenarios
   - Manual test checklist

4. **Deployment Notes**:
   - Port assignment
   - Environment variables
   - DNS configuration
   - SSL certificate details

## 🎓 Best Practices

### Code Quality
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Keep functions small and focused
- Add comments for complex logic

### Security
- Never commit secrets
- Use environment variables
- Validate all inputs
- Implement rate limiting
- Use HTTPS everywhere

### Performance
- Optimize images
- Minimize bundle size
- Use code splitting
- Implement caching
- Lazy load components

### Maintainability
- Use shared components
- Follow DRY principle
- Write self-documenting code
- Keep dependencies updated
- Document architectural decisions

## 🆘 Troubleshooting

### Common Issues

**Build Failures**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Port Conflicts**:
```bash
# Find process using port
lsof -i :3XXX

# Kill process
kill -9 <PID>
```

**Database Connection Issues**:
```bash
# Verify environment variables
env | grep SUPABASE

# Test connection
node -e "const { createClient } = require('@supabase/supabase-js'); const c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); c.from('profiles').select('count').then(d => console.log('OK'));"
```

**PM2 Issues**:
```bash
# Restart PM2
pm2 restart ecosystem.config.js

# Clear PM2 cache
pm2 kill
pm2 start ecosystem.config.js
```

## 📞 Support Contacts

- **Technical Issues**: tech@iiskills.in
- **Deployment Help**: devops@iiskills.in
- **Security Concerns**: security@iiskills.in
- **Emergency**: +91-XXX-XXXX-XXX

---

**Status**: Production-ready integration and deployment playbook.

**Version**: 1.0  
**Last Updated**: February 19, 2026
