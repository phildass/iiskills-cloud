// tests/e2e/navigation/navbar.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Universal Navbar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays navigation bar with correct elements', async ({ page }) => {
    // Verify navbar is visible
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for logo/brand
    await expect(page.locator('nav >> text=/iiskills/i')).toBeVisible();
    
    // Check for key navigation items (adjust selectors based on actual implementation)
    const coursesLink = page.locator('nav >> text=/courses/i');
    if (await coursesLink.count() > 0) {
      await expect(coursesLink.first()).toBeVisible();
    }
  });

  test('displays Login and Register buttons for unauthenticated users', async ({ page }) => {
    // Verify Login button is visible (using "Login" not "Sign in")
    const loginButton = page.locator('text=/^Login$/i');
    await expect(loginButton).toBeVisible();
    
    // Verify Register button is visible
    const registerButton = page.locator('text=/Register/i');
    await expect(registerButton).toBeVisible();
  });

  test('Login button uses correct terminology', async ({ page }) => {
    // Ensure we use "Login" not "Sign in" or "Sign-in"
    const loginButton = page.locator('text=/^Login$/i');
    await expect(loginButton).toBeVisible();
    
    // Verify "Sign in" is not used
    const signInButton = page.locator('text=/sign.?in/i');
    const signInCount = await signInButton.count();
    expect(signInCount).toBe(0);
  });

  test('navbar is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify navbar is visible
    await expect(page.locator('nav')).toBeVisible();
    
    // Check if mobile menu button exists
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"], button[aria-label*="menu" i]');
    if (await mobileMenuButton.count() > 0) {
      await expect(mobileMenuButton.first()).toBeVisible();
    }
  });
});

test.describe('App Switcher', () => {
  test('displays available learning apps', async ({ page }) => {
    await page.goto('/');
    
    // Look for app switcher - adjust selector based on implementation
    const appSwitcher = page.locator('[data-testid="app-switcher"]');
    
    // Skip if app switcher doesn't exist
    if (await appSwitcher.count() === 0) {
      test.skip();
      return;
    }
    
    // Click app switcher
    await appSwitcher.click();
    
    // Verify some learning apps are visible
    const learnAI = page.locator('text=/Learn.?AI/i');
    const learnAPT = page.locator('text=/Learn.?APT/i');
    
    // At least one should be visible
    const aiCount = await learnAI.count();
    const aptCount = await learnAPT.count();
    expect(aiCount + aptCount).toBeGreaterThan(0);
  });
});
