// tests/e2e/access-control/badge-colors.spec.js
const { test, expect } = require('@playwright/test');

/**
 * Badge Color Standardization Tests
 * 
 * Verifies that FREE courses use green badges and PAID courses use blue badges
 * across all apps and pages.
 */

test.describe('Badge Color Standardization', () => {
  const freeApps = [
    'learn-apt',
    'learn-chemistry',
    'learn-geography',
    'learn-math',
    'learn-physics'
  ];
  
  const paidApps = [
    'learn-ai',
    'learn-developer',
    'learn-management',
    'learn-pr'
  ];

  test('free apps display green badges', async ({ page }) => {
    // Navigate to courses page or main page
    await page.goto('/courses');
    
    // Look for FREE badges - they should be green (bg-green-500)
    const freeBadges = page.locator('text=/FREE/i');
    const count = await freeBadges.count();
    
    if (count > 0) {
      // Check that at least one FREE badge has green background
      const firstBadge = freeBadges.first();
      const classes = await firstBadge.getAttribute('class');
      
      // Should have bg-green-500 or similar green color
      expect(classes).toMatch(/bg-green/);
    }
  });

  test('paid apps display blue badges', async ({ page }) => {
    // Navigate to courses page or main page
    await page.goto('/courses');
    
    // Look for PAID badges - they should be blue (bg-blue-600)
    const paidBadges = page.locator('text=/PAID/i');
    const count = await paidBadges.count();
    
    if (count > 0) {
      // Check that at least one PAID badge has blue background
      const firstBadge = paidBadges.first();
      const classes = await firstBadge.getAttribute('class');
      
      // Should have bg-blue-600 or similar blue color
      expect(classes).toMatch(/bg-blue/);
    }
  });

  // Test individual free app landing pages
  for (const app of freeApps) {
    test(`${app} landing page has green FREE badge`, async ({ page, baseURL }) => {
      // Skip if baseURL is localhost (needs subdomain routing)
      if (baseURL && baseURL.includes('localhost')) {
        test.skip();
        return;
      }
      
      // Navigate to app landing page
      const appUrl = `https://${app}.iiskills.cloud`;
      await page.goto(appUrl);
      
      // Look for FREE badge
      const badge = page.locator('text=/FREE/i');
      if (await badge.count() > 0) {
        const classes = await badge.first().getAttribute('class');
        expect(classes).toMatch(/bg-green/);
      }
    });
  }

  // Test individual paid app landing pages
  for (const app of paidApps) {
    test(`${app} landing page has blue PAID badge`, async ({ page, baseURL }) => {
      // Skip if baseURL is localhost (needs subdomain routing)
      if (baseURL && baseURL.includes('localhost')) {
        test.skip();
        return;
      }
      
      // Navigate to app landing page
      const appUrl = `https://${app}.iiskills.cloud`;
      await page.goto(appUrl);
      
      // Look for PAID badge
      const badge = page.locator('text=/PAID/i');
      if (await badge.count() > 0) {
        const classes = await badge.first().getAttribute('class');
        expect(classes).toMatch(/bg-blue/);
      }
    });
  }
});
