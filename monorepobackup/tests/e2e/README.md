# E2E Testing with Playwright

## Overview

This directory contains end-to-end tests for the iiskills.cloud monorepo using Playwright. These tests validate critical user flows across all apps to ensure consistent functionality and user experience.

## Structure

```
tests/e2e/
├── auth/                    # Authentication tests (login, registration, logout)
├── navigation/              # Navigation and navbar tests
├── access-control/          # Access control and badge color tests
├── payments/                # Payment flow tests (to be implemented)
├── fixtures/                # Test data and user fixtures
│   └── test-users.js
└── utils/                   # Helper functions
    └── helpers.js
```

## Running Tests

### Prerequisites

```bash
# Install dependencies (includes Playwright)
yarn install

# Install Playwright browsers (first time only)
npx playwright install
```

### Test Commands

```bash
# Run all E2E tests
yarn test:e2e

# Run tests with browser UI visible
yarn test:e2e:headed

# Debug tests interactively
yarn test:e2e:debug

# Run tests in specific browser
yarn test:e2e:chrome
yarn test:e2e:firefox
yarn test:e2e:webkit

# Run mobile tests
yarn test:e2e:mobile

# Open interactive UI mode
yarn test:e2e:ui

# View test report
yarn test:e2e:report

# Generate test code (opens browser to record actions)
yarn test:e2e:codegen
```

## Test Categories

### 1. Navigation Tests (`navigation/`)
- Universal navbar visibility and responsiveness
- Login/Register button presence
- Terminology verification (uses "Login" not "Sign in")
- App switcher functionality
- Mobile menu behavior

### 2. Authentication Tests (`auth/`)
- Login page display and terminology
- Form validation
- Error handling
- Google OAuth button presence
- Forgot password link

### 3. Access Control Tests (`access-control/`)
- Badge color standardization:
  - FREE apps: green badges (bg-green-500)
  - PAID apps: blue badges (bg-blue-600)
- Landing page badge verification

### 4. Payment Tests (`payments/`) - To be implemented
- Razorpay integration
- Single course purchase flow
- Bundle purchase flow
- Payment error handling

## Writing New Tests

### Basic Test Structure

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/your-page');
  });

  test('should do something', async ({ page }) => {
    // Your test code
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Using Helper Functions

```javascript
const { login, logout, navigateToApp } = require('../utils/helpers');
const { TEST_USERS } = require('../fixtures/test-users');

test('test with authentication', async ({ page }) => {
  // Login using helper
  await login(page, TEST_USERS.regularUser);
  
  // Your test code
  
  // Logout
  await logout(page);
});
```

## Test Data

Test users are defined in `fixtures/test-users.js`:

- `regularUser`: Basic user with no special permissions
- `premiumUser`: User with paid course access
- `adminUser`: Admin user with elevated permissions
- `newUser`: Dynamic user for registration tests

**Note**: These users need to be pre-created in your test database, or you can create them as part of test setup.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: yarn install
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      - name: Run E2E tests
        run: yarn test:e2e
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Configuration

Configuration is defined in `/playwright.config.js`:

- **Test timeout**: 30 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari, Tablet
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Traces**: Collected on first retry

## Best Practices

1. **Independence**: Each test should be independent and not rely on other tests
2. **Clean State**: Use `beforeEach` to reset state between tests
3. **Meaningful Assertions**: Use descriptive assertion messages
4. **Wait Strategies**: Rely on Playwright's auto-waiting, avoid hard-coded sleeps
5. **Test Data**: Use fixtures for consistent test data
6. **Parallel Execution**: Design tests to run in parallel safely
7. **Skip When Needed**: Use `test.skip()` for tests requiring special setup

## Troubleshooting

### Tests timing out
- Increase timeout in test or config
- Check if the application is running
- Verify network conditions

### Element not found
- Check selector syntax
- Ensure element is visible (not just present in DOM)
- Verify page has loaded completely

### Flaky tests
- Add explicit waits for dynamic content
- Check for race conditions
- Use `waitForLoadState()` when needed

## Coverage Requirements

Minimum test coverage targets:

- **Authentication flows**: 100%
- **Payment flows**: 100%
- **Navigation**: 90%
- **Access control**: 100%
- **Admin tools**: 90%

## Related Documentation

- [E2E Testing Framework Documentation](../../E2E_TESTING_FRAMEWORK.md)
- [QA Comprehensive Checklist](../../QA_COMPREHENSIVE_CHECKLIST.md)
- [Shared Components Library](../../SHARED_COMPONENTS_LIBRARY.md)

## Support

For questions or issues with E2E tests:
1. Check this README
2. Review [Playwright documentation](https://playwright.dev)
3. Check existing tests for examples
4. Contact the QA team
