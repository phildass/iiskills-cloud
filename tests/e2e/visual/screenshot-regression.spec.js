/**
 * Visual Regression Tests with Screenshot Comparison
 * 
 * Captures screenshots of key pages and compares them against baselines
 * to detect unintended visual changes.
 * 
 * Usage:
 * - First run: npx playwright test visual --update-snapshots
 * - Subsequent runs: npx playwright test visual
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const FREE_APPS = ['learn-apt', 'learn-chemistry', 'learn-geography', 'learn-math', 'learn-physics'];
const PAID_APPS = ['learn-ai', 'learn-developer', 'learn-management', 'learn-pr'];

// Configure screenshot options
const screenshotOptions = {
  fullPage: true,
  animations: 'disabled',
};

test.describe('Visual Regression - Landing Pages', () => {
  test.describe('Desktop (1280x720)', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('Main portal landing page', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot('main-landing-desktop.png', screenshotOptions);
    });

    FREE_APPS.slice(0, 2).forEach(appId => {
      test(`${appId} landing page`, async ({ page }) => {
        await page.goto(`/${appId}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
        
        await expect(page).toHaveScreenshot(`${appId}-landing-desktop.png`, screenshotOptions);
      });
    });

    PAID_APPS.slice(0, 2).forEach(appId => {
      test(`${appId} landing page`, async ({ page }) => {
        await page.goto(`/${appId}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
        
        await expect(page).toHaveScreenshot(`${appId}-landing-desktop.png`, screenshotOptions);
      });
    });
  });

  test.describe('Mobile (375x667)', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('Main portal landing page - mobile', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      
      await expect(page).toHaveScreenshot('main-landing-mobile.png', screenshotOptions);
    });
  });
});

test.describe('Visual Regression - Authentication Pages', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('Login page', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('login-page-desktop.png', screenshotOptions);
  });

  test('Register page', async ({ page }) => {
    await page.goto('/register');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    
    await expect(page).toHaveScreenshot('register-page-desktop.png', screenshotOptions);
  });
});
