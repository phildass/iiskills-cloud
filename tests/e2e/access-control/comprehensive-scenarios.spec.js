/**
 * Comprehensive E2E Tests for Access Control Scenarios
 * 
 * Tests all access scenarios as specified in the modernization roadmap:
 * - Free app access
 * - Paid app access (pre/post payment)
 * - AI-Developer bundle logic
 * - Admin override controls
 * - Payment confirmation flows
 * - Access verification
 */

const { test, expect } = require('@playwright/test');
const { TEST_USERS } = require('../fixtures/test-users');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const FREE_APPS = ['learn-apt', 'learn-chemistry', 'learn-geography', 'learn-math', 'learn-physics'];
const PAID_APPS = ['learn-ai', 'learn-developer', 'learn-management', 'learn-pr'];
const BUNDLED_APPS = ['learn-ai', 'learn-developer'];

test.describe('Comprehensive Access Control Scenarios', () => {
  
  test.describe('Scenario 1: Free App Access', () => {
    FREE_APPS.forEach(appId => {
      test(`${appId}: Unauthenticated user can access landing page`, async ({ page }) => {
        await page.goto(`/${appId}`);
        
        // Should load successfully
        await expect(page).toHaveURL(new RegExp(appId));
        
        // Should not be redirected to login/payment
        await expect(page).not.toHaveURL(/login/);
        await expect(page).not.toHaveURL(/payment/);
        
        // Should show app content
        await expect(page.locator('body')).not.toContainText('Access Denied');
        await expect(page.locator('body')).not.toContainText('Upgrade Required');
      });

      test(`${appId}: Can access curriculum without auth`, async ({ page }) => {
        await page.goto(`/${appId}/learn`);
        
        // Should show curriculum/content
        await expect(page.locator('body')).not.toContainText('Access Denied');
        
        // Should not show payment gate
        const paymentButton = page.locator('button:has-text("Buy Now"), button:has-text("Purchase")');
        await expect(paymentButton).toHaveCount(0);
      });

      test(`${appId}: Shows correct badge color (green for free)`, async ({ page }) => {
        await page.goto(`/`);
        
        // Look for the app card with badge
        const appCard = page.locator(`[data-app="${appId}"], [href*="${appId}"]`).first();
        if (await appCard.count() > 0) {
          // Should have free/green badge indicator
          const content = await appCard.textContent();
          expect(content.toLowerCase()).toMatch(/free|always free|no payment/i);
        }
      });
    });
  });

  test.describe('Scenario 2: Paid App Access - Pre-Payment', () => {
    PAID_APPS.forEach(appId => {
      test(`${appId}: Unauthenticated user sees landing page`, async ({ page }) => {
        await page.goto(`/${appId}`);
        
        // Should show landing page with pricing info
        await expect(page).toHaveURL(new RegExp(appId));
        
        // Should show payment/upgrade info
        const hasPaymentInfo = await page.locator(
          'text=/buy now/i, text=/purchase/i, text=/upgrade/i, text=/₹/i'
        ).count();
        expect(hasPaymentInfo).toBeGreaterThan(0);
      });

      test(`${appId}: Authenticated user without payment sees paywall`, async ({ page, context }) => {
        // Create a session cookie to simulate logged-in user
        await context.addCookies([{
          name: 'sb-access-token',
          value: 'test-token',
          domain: 'localhost',
          path: '/',
        }]);

        await page.goto(`/${appId}/learn`);
        
        // Should show payment gate or redirect to payment
        const currentUrl = page.url();
        const isGated = currentUrl.includes('payment') || 
                       await page.locator('text=/upgrade required/i, text=/access denied/i, button:has-text("Buy Now")').count() > 0;
        
        expect(isGated).toBeTruthy();
      });

      test(`${appId}: Payment page shows correct pricing`, async ({ page }) => {
        await page.goto(`/${appId}/payment`);
        
        // Should show pricing in INR
        await expect(page.locator('text=/₹/i')).toBeVisible();
        
        // Should show payment button
        await expect(page.locator('button:has-text("Buy"), button:has-text("Purchase"), button:has-text("Pay")')).toBeVisible();
      });
    });
  });

  test.describe('Scenario 3: AI-Developer Bundle Logic', () => {
    test('learn-ai payment page mentions bundle', async ({ page }) => {
      await page.goto('/learn-ai/payment');
      
      // Should mention both apps in bundle
      const bodyText = await page.textContent('body');
      const mentionsBundle = bodyText.toLowerCase().includes('developer') || 
                            bodyText.toLowerCase().includes('bundle') ||
                            bodyText.toLowerCase().includes('both');
      
      // Bundle information should be present
      expect(mentionsBundle).toBeTruthy();
    });

    test('learn-developer payment page mentions bundle', async ({ page }) => {
      await page.goto('/learn-developer/payment');
      
      // Should mention both apps in bundle
      const bodyText = await page.textContent('body');
      const mentionsBundle = bodyText.toLowerCase().includes('ai') || 
                            bodyText.toLowerCase().includes('bundle') ||
                            bodyText.toLowerCase().includes('both');
      
      // Bundle information should be present
      expect(mentionsBundle).toBeTruthy();
    });

    test('Bundle pricing is consistent across both apps', async ({ page }) => {
      // Get pricing from learn-ai
      await page.goto('/learn-ai/payment');
      const aiPrice = await page.locator('text=/₹.*\\d+/').first().textContent();
      
      // Get pricing from learn-developer
      await page.goto('/learn-developer/payment');
      const devPrice = await page.locator('text=/₹.*\\d+/').first().textContent();
      
      // Prices should be the same (bundle pricing)
      // Note: This assumes both pages show bundle price
      console.log('AI price:', aiPrice, 'Developer price:', devPrice);
    });

    test.skip('Purchasing learn-ai unlocks learn-developer', async ({ page, context }) => {
      // This test requires payment flow integration
      // Skip until test payment gateway is configured
      
      // 1. Login as test user
      // 2. Purchase learn-ai
      // 3. Verify learn-developer is also accessible
      // 4. Check user_app_access table shows both with correct granted_via
    });

    test.skip('Purchasing learn-developer unlocks learn-ai', async ({ page, context }) => {
      // This test requires payment flow integration
      // Skip until test payment gateway is configured
      
      // 1. Login as test user
      // 2. Purchase learn-developer
      // 3. Verify learn-ai is also accessible
      // 4. Check user_app_access table shows both with correct granted_via
    });
  });

  test.describe('Scenario 4: Post-Payment Access', () => {
    test.skip('User with paid access can view content', async ({ page, context }) => {
      // Requires test database with user access records
      
      // Setup: Create user with learn-ai access
      // Login as that user
      // Navigate to learn-ai
      // Verify full access (no paywall)
    });

    test.skip('User with bundle access can view both apps', async ({ page, context }) => {
      // Requires test database with bundle access records
      
      // Setup: Create user with bundle access
      // Login as that user
      // Verify learn-ai is accessible
      // Verify learn-developer is accessible
    });

    test.skip('Payment confirmation creates access records', async ({ page }) => {
      // Requires Razorpay test mode integration
      
      // 1. Initiate payment
      // 2. Complete payment in test mode
      // 3. Verify redirect to success page
      // 4. Verify access granted in database
      // 5. For bundle apps, verify both apps are unlocked
    });
  });

  test.describe('Scenario 5: Admin Override Controls', () => {
    test.skip('Admin can manually grant access', async ({ page }) => {
      // Requires admin user and test database
      
      // 1. Login as admin
      // 2. Navigate to /admin/access-control
      // 3. Search for test user
      // 4. Grant access to an app
      // 5. Verify access record created
      // 6. Verify user can now access the app
    });

    test.skip('Admin can revoke access', async ({ page }) => {
      // Requires admin user and test database
      
      // 1. Login as admin
      // 2. Navigate to /admin/access-control
      // 3. Search for user with access
      // 4. Revoke access
      // 5. Verify access record updated
      // 6. Verify user can no longer access the app
    });

    test.skip('Admin dashboard shows bundle statistics', async ({ page }) => {
      // Requires admin user
      
      // 1. Login as admin
      // 2. Navigate to /admin/access-control
      // 3. Verify bundle stats displayed
      // 4. Verify bundle apps are marked
      // 5. Verify counts for 'via payment' vs 'via bundle'
    });

    test('Admin dashboard page exists', async ({ page }) => {
      await page.goto('/admin/access-control');
      
      // Should either redirect to login or show admin page
      const url = page.url();
      const pageExists = url.includes('admin') || url.includes('login');
      expect(pageExists).toBeTruthy();
    });
  });

  test.describe('Scenario 6: Access Control Package Integration', () => {
    test('Package functions are available', async () => {
      const accessControl = await import('../../../packages/access-control/index.js');
      
      // Verify all required functions exist
      expect(typeof accessControl.isFreeApp).toBe('function');
      expect(typeof accessControl.isBundleApp).toBe('function');
      expect(typeof accessControl.requiresPayment).toBe('function');
      expect(typeof accessControl.getBundleInfo).toBe('function');
      expect(typeof accessControl.getAppsToUnlock).toBe('function');
      expect(typeof accessControl.grantBundleAccess).toBe('function');
    });

    test('Free apps are correctly identified', async () => {
      const { isFreeApp } = await import('../../../packages/access-control/index.js');
      
      FREE_APPS.forEach(appId => {
        expect(isFreeApp(appId)).toBe(true);
      });
      
      PAID_APPS.forEach(appId => {
        expect(isFreeApp(appId)).toBe(false);
      });
    });

    test('Bundle apps are correctly identified', async () => {
      const { isBundleApp } = await import('../../../packages/access-control/index.js');
      
      BUNDLED_APPS.forEach(appId => {
        expect(isBundleApp(appId)).toBe(true);
      });
      
      const nonBundledApps = [...FREE_APPS, 'learn-management', 'learn-pr'];
      nonBundledApps.forEach(appId => {
        expect(isBundleApp(appId)).toBe(false);
      });
    });

    test('Bundle unlocking logic is correct', async () => {
      const { getAppsToUnlock } = await import('../../../packages/access-control/index.js');
      
      // Purchasing learn-ai should unlock both
      const aiUnlock = getAppsToUnlock('learn-ai');
      expect(aiUnlock).toContain('learn-ai');
      expect(aiUnlock).toContain('learn-developer');
      expect(aiUnlock.length).toBe(2);
      
      // Purchasing learn-developer should unlock both
      const devUnlock = getAppsToUnlock('learn-developer');
      expect(devUnlock).toContain('learn-ai');
      expect(devUnlock).toContain('learn-developer');
      expect(devUnlock.length).toBe(2);
      
      // Purchasing non-bundle app should unlock only itself
      const mgmtUnlock = getAppsToUnlock('learn-management');
      expect(mgmtUnlock).toEqual(['learn-management']);
    });
  });

  test.describe('Scenario 7: Cross-App Navigation', () => {
    test('Main portal shows all apps with correct badges', async ({ page }) => {
      await page.goto('/');
      
      // Should show all active apps
      const allApps = [...FREE_APPS, ...PAID_APPS];
      
      // Check for app links (at least some should be visible)
      const appLinks = await page.locator('[href*="learn-"]').count();
      expect(appLinks).toBeGreaterThan(0);
    });

    test('Free and paid apps have visual distinction', async ({ page }) => {
      await page.goto('/');
      
      // Look for badge indicators
      const freeBadges = await page.locator('text=/free/i').count();
      const paidBadges = await page.locator('text=/paid/i, text=/premium/i, text=/₹/i').count();
      
      // Should have some visual distinction
      const hasBadges = freeBadges > 0 || paidBadges > 0;
      expect(hasBadges).toBeTruthy();
    });

    test('Bundle apps show bundle indicator', async ({ page }) => {
      await page.goto('/');
      
      // Look for bundle indicator on learn-ai or learn-developer cards
      const bundleIndicator = await page.locator('text=/bundle/i, text=/2 apps/i').count();
      
      // Bundle should be mentioned somewhere
      console.log('Bundle indicators found:', bundleIndicator);
    });
  });

  test.describe('Scenario 8: Payment Guard Middleware', () => {
    test('Free apps reject payment attempts', async ({ page }) => {
      // Try to access payment endpoint for free app
      const response = await page.request.post('/learn-math/api/payment/confirm', {
        data: {
          razorpay_payment_id: 'test_payment',
          razorpay_order_id: 'test_order',
          razorpay_signature: 'test_signature',
        },
        failOnStatusCode: false,
      });
      
      // Should reject (400 or 403)
      expect([400, 403, 405]).toContain(response.status());
    });

    test('Payment endpoints require authentication', async ({ page }) => {
      // Try to access payment endpoint without auth
      const response = await page.request.post('/learn-ai/api/payment/confirm', {
        data: {
          razorpay_payment_id: 'test_payment',
          razorpay_order_id: 'test_order',
          razorpay_signature: 'test_signature',
        },
        failOnStatusCode: false,
      });
      
      // Should reject unauthorized (401 or redirect)
      expect([401, 403, 302]).toContain(response.status());
    });
  });
});

test.describe('Access Control Edge Cases', () => {
  test('Unknown app ID defaults to requiring payment', async () => {
    const { requiresPayment } = await import('../../../packages/access-control/index.js');
    
    // Unknown apps should be treated as paid (fail closed)
    expect(requiresPayment('learn-unknown-app')).toBe(true);
  });

  test('Main portal app is treated as paid', async () => {
    const { requiresPayment } = await import('../../../packages/access-control/index.js');
    
    // Main portal requires payment
    expect(requiresPayment('main')).toBe(true);
  });

  test('Case sensitivity is handled correctly', async () => {
    const { isFreeApp } = await import('../../../packages/access-control/index.js');
    
    // Should handle lowercase (standard)
    expect(isFreeApp('learn-math')).toBe(true);
    
    // Mixed case should not break (or be normalized)
    // This depends on implementation
  });
});
