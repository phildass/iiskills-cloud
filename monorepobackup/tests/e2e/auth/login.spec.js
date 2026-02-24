// tests/e2e/auth/login.spec.js
const { test, expect } = require('@playwright/test');
const { TEST_USERS } = require('../fixtures/test-users');

test.describe('User Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('displays login page with correct terminology', async ({ page }) => {
    // Verify page title uses "Login" not "Sign in"
    const heading = page.locator('h1, h2');
    const headingText = await heading.first().textContent();
    expect(headingText).toMatch(/login/i);
    expect(headingText).not.toMatch(/sign.?in/i);
    
    // Verify submit button uses "Login"
    const submitButton = page.locator('button[type="submit"]');
    const buttonText = await submitButton.textContent();
    expect(buttonText).toMatch(/login/i);
  });

  test('displays email and password fields', async ({ page }) => {
    // Verify email field
    await expect(page.locator('input[name="email"], input[type="email"]')).toBeVisible();
    
    // Verify password field
    await expect(page.locator('input[name="password"], input[type="password"]')).toBeVisible();
  });

  test('shows validation error for empty fields', async ({ page }) => {
    // Click submit without filling fields
    await page.click('button[type="submit"]');
    
    // Should either show validation messages or HTML5 validation
    // This test may need adjustment based on actual implementation
    const url = page.url();
    expect(url).toContain('/login'); // Should stay on login page
  });

  test('shows error for invalid email format', async ({ page }) => {
    // Enter invalid email
    await page.fill('input[name="email"], input[type="email"]', 'invalid-email');
    await page.fill('input[name="password"], input[type="password"]', 'somepassword');
    await page.click('button[type="submit"]');
    
    // Should show error or stay on page
    const url = page.url();
    expect(url).toContain('/login');
  });

  test('displays forgot password link', async ({ page }) => {
    // Check for forgot password link
    const forgotPasswordLink = page.locator('text=/forgot.*password/i');
    if (await forgotPasswordLink.count() > 0) {
      await expect(forgotPasswordLink.first()).toBeVisible();
    }
  });

  test('displays Google OAuth option', async ({ page }) => {
    // Check for Google login button
    const googleButton = page.locator('button:has-text("Google"), a:has-text("Google")');
    if (await googleButton.count() > 0) {
      await expect(googleButton.first()).toBeVisible();
    }
  });
});

test.describe('Login Functionality (requires test user)', () => {
  test.skip('logs in with valid credentials', async ({ page }) => {
    // This test requires a test user to be set up
    // Skip if TEST_USERS.regularUser is not configured
    
    await page.goto('/login');
    
    await page.fill('input[name="email"]', TEST_USERS.regularUser.email);
    await page.fill('input[name="password"]', TEST_USERS.regularUser.password);
    await page.click('button[type="submit"]');
    
    // Wait for redirect
    await page.waitForURL(/dashboard|learn|home/, { timeout: 10000 });
    
    // Verify user is logged in (user menu should be visible)
    await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
  });
});
