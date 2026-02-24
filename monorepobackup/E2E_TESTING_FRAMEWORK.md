# E2E Testing Framework & Release Policy

## Overview

This document defines the automated integration/E2E testing framework and test-before-deploy policy for iiskills.cloud. All UI changes must pass automated tests and be accompanied by updated screenshots before merging PRs or deploying.

---

## Testing Framework: Playwright

We use **Playwright** as our E2E testing framework for the following reasons:

1. **Cross-browser support**: Chromium, Firefox, WebKit
2. **Modern web support**: Excellent support for React and Next.js
3. **Auto-waiting**: Automatically waits for elements to be ready
4. **Network control**: Mock APIs, intercept requests
5. **Screenshot/video**: Built-in visual testing support
6. **Parallel execution**: Fast test execution

---

## Installation & Setup

### 1. Install Playwright

```bash
# Install Playwright and browsers
npm install -D @playwright/test
npx playwright install

# Verify installation
npx playwright --version
```

### 2. Project Structure

```
tests/
├── e2e/
│   ├── auth/
│   │   ├── registration.spec.js
│   │   ├── login.spec.js
│   │   ├── logout.spec.js
│   │   └── oauth.spec.js
│   ├── navigation/
│   │   ├── navbar.spec.js
│   │   ├── app-switcher.spec.js
│   │   └── cross-app-navigation.spec.js
│   ├── payments/
│   │   ├── single-course.spec.js
│   │   ├── bundle-purchase.spec.js
│   │   └── payment-errors.spec.js
│   ├── otp/
│   │   ├── otp-generation.spec.js
│   │   ├── otp-redemption.spec.js
│   │   └── otp-expiry.spec.js
│   ├── access-control/
│   │   ├── free-course-access.spec.js
│   │   ├── paid-course-gates.spec.js
│   │   └── cross-app-isolation.spec.js
│   ├── sample-lessons/
│   │   ├── free-app-lessons.spec.js
│   │   └── paid-app-samples.spec.js
│   └── admin/
│       ├── admin-auth.spec.js
│       ├── grant-access.spec.js
│       └── revoke-access.spec.js
├── fixtures/
│   ├── test-users.js
│   ├── test-courses.js
│   └── test-data.js
├── utils/
│   ├── helpers.js
│   ├── assertions.js
│   └── config.js
└── playwright.config.js
```

### 3. Configuration File

Create `playwright.config.js` in project root:

```javascript
// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  
  // Maximum time one test can run for
  timeout: 30 * 1000,
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  
  // Run your local dev server before starting the tests
  webServer: process.env.CI ? undefined : {
    command: 'yarn dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

---

## Test Implementation Examples

### 1. Navigation Tests

```javascript
// tests/e2e/navigation/navbar.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Universal Navbar', () => {
  test('displays all navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Verify navbar is visible
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for key navigation items
    await expect(page.locator('text=Courses')).toBeVisible();
    await expect(page.locator('text=About')).toBeVisible();
    
    // Verify Login/Register buttons for non-authenticated users
    await expect(page.locator('text=Login')).toBeVisible();
    await expect(page.locator('text=Register')).toBeVisible();
  });
  
  test('app switcher works correctly', async ({ page }) => {
    await page.goto('/');
    
    // Click app switcher
    await page.click('[data-testid="app-switcher"]');
    
    // Verify app list displays
    await expect(page.locator('text=Learn-AI')).toBeVisible();
    await expect(page.locator('text=Learn-APT')).toBeVisible();
    
    // Click an app
    await page.click('text=Learn-AI');
    
    // Verify redirect
    await expect(page).toHaveURL(/learn-ai/);
  });
});
```

### 2. Registration Tests

```javascript
// tests/e2e/auth/registration.spec.js
const { test, expect } = require('@playwright/test');

test.describe('User Registration', () => {
  test('registers new user with email', async ({ page }) => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'SecurePassword123!';
    
    await page.goto('/register');
    
    // Fill registration form
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    
    // Verify platform recommendation message is visible
    await expect(page.locator('text=/Google login is available/i')).toBeVisible();
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL(/dashboard|learn/);
    
    // Verify successful registration
    await expect(page.locator('text=/welcome/i')).toBeVisible();
  });
  
  test('validates email format', async ({ page }) => {
    await page.goto('/register');
    
    // Enter invalid email
    await page.fill('input[name="email"]', 'invalid-email');
    await page.fill('input[name="password"]', 'Password123!');
    
    // Attempt submit
    await page.click('button[type="submit"]');
    
    // Verify error message
    await expect(page.locator('text=/invalid email/i')).toBeVisible();
  });
  
  test('enforces password requirements', async ({ page }) => {
    await page.goto('/register');
    
    // Enter weak password
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'weak');
    
    // Verify password strength indicator
    await expect(page.locator('[data-testid="password-strength"]')).toContainText(/weak/i);
  });
});
```

### 3. Login Tests

```javascript
// tests/e2e/auth/login.spec.js
const { test, expect } = require('@playwright/test');
const { TEST_USERS } = require('../../fixtures/test-users');

test.describe('User Login', () => {
  test('logs in with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Verify "Login" terminology (not "Sign in")
    await expect(page.locator('h1')).toContainText('Login');
    await expect(page.locator('button[type="submit"]')).toContainText('Login');
    
    // Fill login form
    await page.fill('input[name="email"]', TEST_USERS.regularUser.email);
    await page.fill('input[name="password"]', TEST_USERS.regularUser.password);
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify redirect to dashboard
    await page.waitForURL(/dashboard/);
    
    // Verify user is logged in
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });
  
  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Verify error message
    await expect(page.locator('text=/invalid credentials/i')).toBeVisible();
  });
});
```

### 4. Payment Tests

```javascript
// tests/e2e/payments/single-course.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Single Course Purchase', () => {
  test('displays Razorpay payment modal', async ({ page, context }) => {
    // Login first
    await page.goto('/login');
    // ... login code ...
    
    // Navigate to paid course
    await page.goto('/learn-ai');
    
    // Click Buy Now
    await page.click('button:has-text("Buy Now")');
    
    // Wait for Razorpay modal
    await page.waitForSelector('[data-razorpay]', { timeout: 10000 });
    
    // Verify modal displays correct amount
    await expect(page.locator('[data-razorpay]')).toContainText('₹');
    
    // Verify payment methods available
    await expect(page.locator('text=/card/i')).toBeVisible();
    await expect(page.locator('text=/upi/i')).toBeVisible();
  });
  
  test('grants access after successful payment', async ({ page }) => {
    // This test would use Razorpay test mode
    // ... payment flow ...
    
    // Verify access granted
    await expect(page.locator('text=/access granted/i')).toBeVisible();
    
    // Verify can access premium content
    await page.goto('/learn-ai/lessons/advanced-topic');
    await expect(page.locator('text=/premium content/i')).toBeVisible();
  });
});
```

### 5. OTP Flow Tests

```javascript
// tests/e2e/otp/otp-redemption.spec.js
const { test, expect } = require('@playwright/test');

test.describe('OTP Redemption', () => {
  test('accepts valid OTP and grants access', async ({ page }) => {
    const validOTP = '123456'; // Generated by admin in test setup
    
    await page.goto('/redeem-otp');
    
    // Enter OTP
    await page.fill('input[name="otp"]', validOTP);
    await page.click('button:has-text("Redeem")');
    
    // Verify success message
    await expect(page.locator('text=/access granted/i')).toBeVisible();
    
    // Verify redirect to course
    await page.waitForURL(/learn/);
  });
  
  test('rejects expired OTP', async ({ page }) => {
    const expiredOTP = '999999';
    
    await page.goto('/redeem-otp');
    await page.fill('input[name="otp"]', expiredOTP);
    await page.click('button:has-text("Redeem")');
    
    // Verify error message
    await expect(page.locator('text=/expired/i')).toBeVisible();
  });
});
```

### 6. Access Control Tests

```javascript
// tests/e2e/access-control/paid-course-gates.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Paid Course Access Control', () => {
  test('sample lessons accessible without payment', async ({ page }) => {
    await page.goto('/learn-ai/sample-lesson');
    
    // Should be able to view sample
    await expect(page.locator('[data-testid="lesson-content"]')).toBeVisible();
    
    // Should NOT see payment gate on sample
    await expect(page.locator('text=/buy now/i')).not.toBeVisible();
  });
  
  test('premium content shows payment gate', async ({ page }) => {
    await page.goto('/learn-ai/lessons/advanced-ai');
    
    // Should see payment prompt
    await expect(page.locator('text=/upgrade/i')).toBeVisible();
    await expect(page.locator('button:has-text("Buy Now")')).toBeVisible();
    
    // Content should be blurred or hidden
    await expect(page.locator('[data-testid="lesson-content"]')).toHaveAttribute('data-locked', 'true');
  });
});
```

---

## Test-Before-Deploy Policy

### Pre-Merge Requirements

Before any PR can be merged:

1. ✅ **All E2E tests pass** in CI
2. ✅ **No console errors** during test execution
3. ✅ **Visual regression tests pass** (screenshot comparison)
4. ✅ **Performance tests pass** (page load times < thresholds)
5. ✅ **Accessibility tests pass** (a11y audit)
6. ✅ **Code review approved** by at least one reviewer
7. ✅ **Updated screenshots** provided for UI changes

### Pre-Deployment Checklist

Before deploying to production:

```bash
# 1. Run full test suite
npm run test:e2e

# 2. Run performance tests
npm run test:performance

# 3. Run accessibility audit
npm run test:a11y

# 4. Verify screenshots updated
npm run verify:screenshots

# 5. Run smoke tests on staging
npm run test:smoke -- --env=staging

# 6. Generate test report
npm run test:report
```

### CI/CD Integration

Add to `.github/workflows/test.yml`:

```yaml
name: E2E Tests

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: yarn install
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Build apps
        run: yarn build
      
      - name: Run E2E tests
        run: yarn test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
      
      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: test-screenshots
          path: test-results/
```

---

## Test Execution Commands

Add to `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:chrome": "playwright test --project=chromium",
    "test:e2e:firefox": "playwright test --project=firefox",
    "test:e2e:webkit": "playwright test --project=webkit",
    "test:e2e:mobile": "playwright test --project='Mobile Chrome' --project='Mobile Safari'",
    "test:report": "playwright show-report",
    "test:codegen": "playwright codegen",
    "test:smoke": "playwright test --grep @smoke"
  }
}
```

---

## Coverage Requirements

Minimum test coverage requirements:

- **Authentication flows**: 100%
- **Payment flows**: 100%
- **Navigation**: 90%
- **Access control**: 100%
- **OTP flows**: 100%
- **Admin tools**: 90%
- **Sample lessons**: 80%

---

## Continuous Monitoring

### Test Metrics Dashboard

Track:
- Test execution time
- Pass/fail rates
- Flaky test identification
- Coverage trends
- Performance regression

### Automated Reports

Generate daily reports including:
- Test execution summary
- Failed test details
- Screenshot comparisons
- Performance metrics
- Accessibility scores

---

## Best Practices

1. **Test Independence**: Each test should be independent and not rely on other tests
2. **Clean State**: Reset database/state between tests
3. **Meaningful Assertions**: Use descriptive assertion messages
4. **Page Objects**: Use Page Object Model for maintainability
5. **Wait Strategies**: Use Playwright's auto-waiting, avoid hard-coded sleeps
6. **Test Data**: Use fixtures for consistent test data
7. **Parallel Execution**: Design tests to run in parallel
8. **Retry Logic**: Retry flaky tests but investigate root cause

---

## Next Steps

1. **Phase 1: Setup** (Week 1)
   - Install Playwright
   - Create basic test structure
   - Write authentication tests
   - Set up CI integration

2. **Phase 2: Core Tests** (Week 2)
   - Navigation tests
   - Payment tests
   - OTP tests
   - Access control tests

3. **Phase 3: Advanced Tests** (Week 3)
   - Visual regression tests
   - Performance tests
   - Accessibility tests
   - Mobile tests

4. **Phase 4: Integration** (Week 4)
   - Enforce test-before-deploy policy
   - Set up monitoring dashboard
   - Train team on test writing
   - Document test patterns

---

**Last Updated**: 2026-02-18  
**Document Version**: 1.0.0  
**Maintained By**: QA & DevOps Team
