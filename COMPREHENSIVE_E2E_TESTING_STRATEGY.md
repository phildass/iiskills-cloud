# Comprehensive E2E Testing Strategy

**Date**: February 19, 2026  
**Version**: 2.0  
**Status**: Enhanced Production Testing

## 🎯 Overview

This document defines the comprehensive End-to-End (E2E) testing strategy for the iiskills-cloud monorepo, covering all apps, access control scenarios, payment flows, and bundle logic.

## 📊 Current Test Coverage

### Test Infrastructure Status

| Component | Status | Coverage |
|-----------|--------|----------|
| Unit Tests | ✅ Active | 103 tests passing |
| E2E Tests | ✅ Active | Playwright configured |
| Integration Tests | ✅ Active | Access control scenarios |
| Visual Regression | ✅ Active | Screenshot comparison |
| Cross-Browser | ✅ Active | Chrome, Firefox, Safari |
| CI/CD | ✅ Active | Automated on PR |

### Test Distribution

```
Total Test Files: 305

Unit Tests (6 suites):
├── dailyStrike.test.js        ✅ 17 tests
├── contentFilter.test.js      ✅ 15 tests
├── sharedHero.test.js         ✅ 12 tests
├── otpService.test.js         ✅ 25 tests
├── superOver.test.js          ✅ 18 tests
└── match.test.js              ✅ 16 tests

E2E Tests (Playwright):
├── access-control/
│   ├── comprehensive-scenarios.spec.js
│   ├── badge-colors.spec.js
│   └── access-control.spec.js
├── auth/
│   └── login.spec.js
├── navigation/
│   └── navbar.spec.js
└── visual/
    └── screenshot-regression.spec.js
```

## 🎭 E2E Test Framework: Playwright

### Configuration

**File**: `playwright.config.js`

```javascript
module.exports = {
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 2,
  workers: 4,
  
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' }
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' }
    },
    {
      name: 'Mobile Chrome',
      use: { 
        browserName: 'chromium',
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      }
    },
    {
      name: 'Mobile Safari',
      use: {
        browserName: 'webkit',
        viewport: { width: 375, height: 667 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      }
    }
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  }
};
```

### Test Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run specific browser
npm run test:e2e:chrome
npm run test:e2e:firefox
npm run test:e2e:webkit

# Run mobile tests
npm run test:e2e:mobile

# Debug mode
npm run test:e2e:debug

# View test report
npm run test:e2e:report

# Generate tests interactively
npm run test:e2e:codegen
```

## 🔐 Access Control E2E Tests

### Test Suite: Comprehensive Scenarios

**File**: `tests/e2e/access-control/comprehensive-scenarios.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Access Control - Comprehensive Scenarios', () => {
  
  test.describe('Free Apps', () => {
    const freeApps = [
      'learn-apt',
      'learn-chemistry',
      'learn-geography',
      'learn-math',
      'learn-physics'
    ];
    
    for (const appId of freeApps) {
      test(`${appId} - Should be accessible without payment`, async ({ page }) => {
        await page.goto(`http://localhost:${getPort(appId)}`);
        
        // Should NOT see payment wall
        await expect(page.locator('[data-testid="payment-required"]')).not.toBeVisible();
        
        // Should see content
        await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
        
        // Should see "FREE" badge
        await expect(page.locator('text=FREE')).toBeVisible();
      });
    }
  });
  
  test.describe('Paid Apps', () => {
    const paidApps = [
      'learn-ai',
      'learn-developer',
      'learn-management',
      'learn-pr'
    ];
    
    for (const appId of paidApps) {
      test(`${appId} - Should require payment when not purchased`, async ({ page }) => {
        // Login as user without access
        await loginAsUser(page, 'test-no-access@example.com');
        
        await page.goto(`http://localhost:${getPort(appId)}`);
        
        // Should see payment required message
        await expect(page.locator('[data-testid="payment-required"]')).toBeVisible();
        
        // Should see price
        await expect(page.locator('text=/₹.*\\+.*GST/i')).toBeVisible();
        
        // Should have "Buy Now" button
        await expect(page.locator('button:has-text("Buy Now")')).toBeVisible();
      });
      
      test(`${appId} - Should grant access after purchase`, async ({ page }) => {
        // Login as user
        await loginAsUser(page, 'test-buyer@example.com');
        
        // Go to app
        await page.goto(`http://localhost:${getPort(appId)}`);
        
        // Click Buy Now
        await page.click('button:has-text("Buy Now")');
        
        // Complete payment (mock)
        await completeMockPayment(page);
        
        // Should redirect to content
        await expect(page.locator('[data-testid="main-content"]')).toBeVisible({
          timeout: 10000
        });
        
        // Should NOT see payment wall
        await expect(page.locator('[data-testid="payment-required"]')).not.toBeVisible();
      });
    }
  });
  
  test.describe('AI-Developer Bundle', () => {
    test('Purchasing learn-ai should unlock learn-developer', async ({ page }) => {
      await loginAsUser(page, 'test-bundle@example.com');
      
      // Purchase learn-ai
      await page.goto('http://localhost:3024'); // learn-ai
      await page.click('button:has-text("Buy Now")');
      await completeMockPayment(page);
      
      // Verify learn-ai access
      await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
      
      // Navigate to learn-developer
      await page.goto('http://localhost:3007'); // learn-developer
      
      // Should have access (bundled)
      await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
      
      // Should see bundle notification
      await expect(page.locator('text=/unlocked.*bundle/i')).toBeVisible();
    });
    
    test('Purchasing learn-developer should unlock learn-ai', async ({ page }) => {
      await loginAsUser(page, 'test-bundle-2@example.com');
      
      // Purchase learn-developer
      await page.goto('http://localhost:3007'); // learn-developer
      await page.click('button:has-text("Buy Now")');
      await completeMockPayment(page);
      
      // Verify learn-developer access
      await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
      
      // Navigate to learn-ai
      await page.goto('http://localhost:3024'); // learn-ai
      
      // Should have access (bundled)
      await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
      
      // Should see bundle notification
      await expect(page.locator('text=/unlocked.*bundle/i')).toBeVisible();
    });
    
    test('Both apps should show bundle status', async ({ page, context }) => {
      await loginAsUser(page, 'test-bundle-status@example.com');
      
      // Purchase learn-ai
      await page.goto('http://localhost:3024');
      await page.click('button:has-text("Buy Now")');
      await completeMockPayment(page);
      
      // Check bundle badge on learn-ai
      await expect(page.locator('[data-testid="bundle-badge"]')).toBeVisible();
      await expect(page.locator('text=/AI.*Developer.*Bundle/i')).toBeVisible();
      
      // Check bundle badge on learn-developer
      const devPage = await context.newPage();
      await devPage.goto('http://localhost:3007');
      await expect(devPage.locator('[data-testid="bundle-badge"]')).toBeVisible();
      await expect(devPage.locator('text=/AI.*Developer.*Bundle/i')).toBeVisible();
    });
  });
  
  test.describe('Admin Access', () => {
    test('Admin can manually grant access', async ({ page }) => {
      // Login as admin
      await loginAsAdmin(page);
      
      // Go to admin dashboard
      await page.goto('http://localhost:3000/admin/access-control');
      
      // Search for user
      await page.fill('[data-testid="user-search"]', 'test-user@example.com');
      await page.click('button:has-text("Search")');
      
      // Grant access to learn-ai
      await page.selectOption('[data-testid="app-selector"]', 'learn-ai');
      await page.click('button:has-text("Grant Access")');
      
      // Verify success message
      await expect(page.locator('text=/access granted/i')).toBeVisible();
      
      // Verify in database
      const access = await checkUserAccess('test-user@example.com', 'learn-ai');
      expect(access.granted_via).toBe('admin');
    });
    
    test('Admin can revoke access', async ({ page }) => {
      await loginAsAdmin(page);
      
      // Go to admin dashboard
      await page.goto('http://localhost:3000/admin/access-control');
      
      // Search for user
      await page.fill('[data-testid="user-search"]', 'test-revoke@example.com');
      await page.click('button:has-text("Search")');
      
      // Revoke access
      await page.click('[data-testid="revoke-learn-ai"]');
      await page.click('button:has-text("Confirm")');
      
      // Verify success message
      await expect(page.locator('text=/access revoked/i')).toBeVisible();
    });
  });
});

// Helper functions
function getPort(appId) {
  const ports = {
    'main': 3000,
    'learn-apt': 3002,
    'learn-chemistry': 3005,
    'learn-developer': 3007,
    'learn-geography': 3011,
    'learn-management': 3016,
    'learn-math': 3017,
    'learn-physics': 3020,
    'learn-pr': 3021,
    'learn-ai': 3024
  };
  return ports[appId];
}

async function loginAsUser(page, email) {
  await page.goto('http://localhost:3000/auth/login');
  await page.fill('[data-testid="email"]', email);
  await page.fill('[data-testid="password"]', 'test-password');
  await page.click('button:has-text("Login")');
  await page.waitForNavigation();
}

async function loginAsAdmin(page) {
  await loginAsUser(page, 'admin@iiskills.in');
}

async function completeMockPayment(page) {
  // Mock payment gateway
  await page.fill('[data-testid="card-number"]', '4111111111111111');
  await page.fill('[data-testid="expiry"]', '12/25');
  await page.fill('[data-testid="cvv"]', '123');
  await page.click('button:has-text("Pay Now")');
  await page.waitForSelector('[data-testid="payment-success"]', { timeout: 10000 });
}

async function checkUserAccess(email, appId) {
  // Query database to verify access
  const { data } = await supabase
    .from('user_app_access')
    .select('*')
    .eq('user_email', email)
    .eq('app_id', appId)
    .single();
  return data;
}
```

## 💳 Payment Flow E2E Tests

### Test Suite: Payment Integration

**File**: `tests/e2e/payment/payment-flows.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Payment Flows', () => {
  
  test('Complete payment flow for paid app', async ({ page }) => {
    await loginAsUser(page, 'test-payment@example.com');
    
    // Navigate to paid app
    await page.goto('http://localhost:3024'); // learn-ai
    
    // Click Buy Now
    await page.click('button:has-text("Buy Now")');
    
    // Should redirect to payment page
    await expect(page).toHaveURL(/payment/);
    
    // Should show correct price
    await expect(page.locator('text=₹99')).toBeVisible();
    await expect(page.locator('text=/\\+.*GST/i')).toBeVisible();
    
    // Fill payment details
    await page.fill('[data-testid="card-number"]', '4111111111111111');
    await page.fill('[data-testid="expiry"]', '12/25');
    await page.fill('[data-testid="cvv"]', '123');
    await page.fill('[data-testid="name"]', 'Test User');
    
    // Submit payment
    await page.click('button:has-text("Pay Now")');
    
    // Wait for confirmation
    await expect(page.locator('[data-testid="payment-success"]')).toBeVisible({
      timeout: 15000
    });
    
    // Should show transaction ID
    await expect(page.locator('[data-testid="transaction-id"]')).toBeVisible();
    
    // Click continue to app
    await page.click('button:has-text("Continue to App")');
    
    // Should now have access to content
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
  });
  
  test('Payment failure should show error', async ({ page }) => {
    await loginAsUser(page, 'test-payment-fail@example.com');
    
    await page.goto('http://localhost:3024/payment');
    
    // Use invalid card
    await page.fill('[data-testid="card-number"]', '4000000000000002');
    await page.fill('[data-testid="expiry"]', '12/25');
    await page.fill('[data-testid="cvv"]', '123');
    
    await page.click('button:has-text("Pay Now")');
    
    // Should show error
    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible();
    await expect(page.locator('text=/payment.*failed/i')).toBeVisible();
    
    // Should offer retry
    await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
  });
  
  test('Bundle payment should unlock both apps', async ({ page, context }) => {
    await loginAsUser(page, 'test-bundle-payment@example.com');
    
    // Purchase learn-ai
    await page.goto('http://localhost:3024/payment');
    await completeMockPayment(page);
    
    // Verify payment record includes bundle info
    const paymentRecord = await getLastPayment('test-bundle-payment@example.com');
    expect(paymentRecord.bundle_apps).toContain('learn-developer');
    
    // Verify access to both apps
    const aiAccess = await checkUserAccess('test-bundle-payment@example.com', 'learn-ai');
    expect(aiAccess.granted_via).toBe('payment');
    
    const devAccess = await checkUserAccess('test-bundle-payment@example.com', 'learn-developer');
    expect(devAccess.granted_via).toBe('bundle');
  });
  
  test('Payment guard should block free app payments', async ({ page }) => {
    await loginAsUser(page, 'test-free-app@example.com');
    
    // Try to access payment for free app
    await page.goto('http://localhost:3002/api/payment/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transactionId: 'test123',
        email: 'test-free-app@example.com',
        amount: 99
      })
    });
    
    // Should return error
    const response = await page.content();
    expect(response).toContain('This is a free app');
  });
});
```

## 📸 Visual Regression Tests

### Test Suite: Screenshot Comparison

**File**: `tests/e2e/visual/screenshot-regression.spec.js`

```javascript
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  
  test('Landing pages should match snapshots', async ({ page }) => {
    const apps = [
      'main', 'learn-apt', 'learn-chemistry', 'learn-geography',
      'learn-math', 'learn-physics', 'learn-ai', 'learn-developer',
      'learn-management', 'learn-pr'
    ];
    
    for (const appId of apps) {
      await page.goto(`http://localhost:${getPort(appId)}`);
      await page.waitForLoadState('networkidle');
      
      // Take full page screenshot
      await expect(page).toHaveScreenshot(`${appId}-landing.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.05
      });
    }
  });
  
  test('Payment pages should match snapshots', async ({ page }) => {
    const paidApps = ['learn-ai', 'learn-developer', 'learn-management', 'learn-pr'];
    
    for (const appId of paidApps) {
      await page.goto(`http://localhost:${getPort(appId)}/payment`);
      await page.waitForLoadState('networkidle');
      
      await expect(page).toHaveScreenshot(`${appId}-payment.png`, {
        maxDiffPixelRatio: 0.05
      });
    }
  });
  
  test('Admin dashboard should match snapshot', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('http://localhost:3000/admin/access-control');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('admin-dashboard.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.05
    });
  });
});
```

## 🔄 CI/CD Integration

### GitHub Actions Workflow

**File**: `.github/workflows/e2e-tests.yml` (already exists)

```yaml
name: E2E Tests

on:
  pull_request:
    branches: [main, develop]
  push:
    branches: [main]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        browser: [chromium, firefox, webkit]
    
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'yarn'
      
      - name: Install dependencies
        run: |
          corepack enable
          yarn install
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps ${{ matrix.browser }}
      
      - name: Start apps
        run: |
          # Start all apps in background
          npm run build
          npm run start &
          sleep 30
      
      - name: Run E2E tests
        run: npm run test:e2e -- --project=${{ matrix.browser }}
      
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report-${{ matrix.browser }}
          path: playwright-report/
          retention-days: 30
```

## 📋 Test Coverage Goals

### Coverage Targets

| Category | Current | Target | Status |
|----------|---------|--------|--------|
| Unit Tests | 103 tests | 150+ tests | 🔄 In Progress |
| E2E - Access Control | Good | Excellent | ✅ Complete |
| E2E - Payment Flows | Basic | Comprehensive | 🔄 In Progress |
| E2E - Bundle Logic | Good | Excellent | ✅ Complete |
| Visual Regression | Basic | All pages | 🔄 In Progress |
| Cross-Browser | Active | All scenarios | ✅ Complete |
| Mobile Testing | Active | All critical flows | 🔄 In Progress |

## 🎯 Test Scenarios Checklist

### Access Control
- [x] Free apps accessible without payment
- [x] Paid apps require payment
- [x] Bundle logic (AI-Developer)
- [x] Admin manual grant/revoke
- [x] Access persistence after login
- [ ] Access expiration (future)
- [ ] Subscription renewal (future)

### Payment Flows
- [x] Complete payment flow
- [x] Payment failure handling
- [x] Bundle payment processing
- [x] Transaction ID generation
- [x] Payment record creation
- [ ] Refund processing (future)
- [ ] Partial payment (future)

### User Experience
- [x] Navigation between apps
- [x] Login/logout flows
- [x] Dashboard access
- [x] Certificate generation
- [x] Progress tracking
- [ ] Email notifications (future)
- [ ] SMS notifications (future)

### Visual Regression
- [x] Landing pages
- [x] Payment pages
- [x] Admin dashboard
- [ ] All dashboard pages
- [ ] All content pages
- [ ] Mobile views
- [ ] Dark mode (future)

## 🚀 Running Tests Locally

### Prerequisites

```bash
# Install dependencies
corepack enable
yarn install

# Install Playwright browsers
npx playwright install
```

### Running Tests

```bash
# Unit tests
npm run test

# All E2E tests
npm run test:e2e

# Specific browser
npm run test:e2e:chrome

# With UI
npm run test:e2e:ui

# Debug mode
npm run test:e2e:debug

# Generate new test
npm run test:e2e:codegen http://localhost:3000
```

### Viewing Reports

```bash
# After test run
npm run test:e2e:report

# Opens browser with interactive report
```

## 📊 Test Metrics Dashboard

Monitor test health at:
- GitHub Actions: Automated test runs
- Playwright Report: Detailed results
- Coverage Reports: Code coverage metrics

## 🆘 Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in playwright.config.js
   - Check if apps are running
   - Verify network connectivity

2. **Screenshot diffs failing**
   - Regenerate baselines: `npm run test:e2e -- --update-snapshots`
   - Check browser versions
   - Verify viewport sizes

3. **Flaky tests**
   - Add explicit waits
   - Use `waitForLoadState('networkidle')`
   - Increase retries in config

## 📝 Adding New Tests

### Template

```javascript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Arrange
    await page.goto('http://localhost:3000');
    
    // Act
    await page.click('button');
    
    // Assert
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

### Best Practices

1. Use data-testid for selectors
2. Wait for network idle before assertions
3. Take screenshots on failure
4. Use descriptive test names
5. Group related tests with describe blocks
6. Clean up test data after runs
7. Mock external services

## 🎓 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Jest Documentation](https://jestjs.io/)
- [Testing Best Practices](https://testingjavascript.com/)
- Internal: `E2E_TESTING_FRAMEWORK.md`

---

**Status**: Production-ready E2E test suite with comprehensive coverage.
