// tests/e2e/utils/helpers.js

/**
 * Helper functions for E2E tests
 */

/**
 * Login helper - logs in a user and returns the authenticated page
 * @param {Page} page - Playwright page object
 * @param {Object} user - User credentials {email, password}
 * @returns {Promise<Page>} - Authenticated page
 */
async function login(page, user) {
  await page.goto('/login');
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  
  // Wait for redirect after login
  await page.waitForURL(/dashboard|learn/, { timeout: 10000 });
  
  return page;
}

/**
 * Logout helper - logs out the current user
 * @param {Page} page - Playwright page object
 */
async function logout(page) {
  // Click user menu
  await page.click('[data-testid="user-menu"]');
  
  // Click logout
  await page.click('text=Logout');
  
  // Wait for redirect to login or home
  await page.waitForURL(/login|^\/$/, { timeout: 5000 });
}

/**
 * Navigate to a specific app
 * @param {Page} page - Playwright page object
 * @param {string} appName - Name of the app (e.g., 'learn-ai')
 */
async function navigateToApp(page, appName) {
  // Open app switcher
  await page.click('[data-testid="app-switcher"]');
  
  // Click on the app
  await page.click(`text=${appName}`);
  
  // Wait for navigation
  await page.waitForURL(new RegExp(appName), { timeout: 10000 });
}

/**
 * Wait for element to be visible with custom error message
 * @param {Page} page - Playwright page object
 * @param {string} selector - Element selector
 * @param {string} message - Error message if element not found
 * @param {number} timeout - Timeout in milliseconds (default: 5000)
 */
async function waitForElement(page, selector, message, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { state: 'visible', timeout });
  } catch (error) {
    throw new Error(`${message}: Element "${selector}" not found`);
  }
}

/**
 * Take a timestamped screenshot
 * @param {Page} page - Playwright page object
 * @param {string} name - Screenshot name
 */
async function takeScreenshot(page, name) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `screenshot-${name}-${timestamp}.png`;
  await page.screenshot({ path: `test-results/screenshots/${filename}`, fullPage: true });
  console.log(`Screenshot saved: ${filename}`);
}

/**
 * Check if user is authenticated
 * @param {Page} page - Playwright page object
 * @returns {Promise<boolean>} - True if authenticated
 */
async function isAuthenticated(page) {
  try {
    await page.waitForSelector('[data-testid="user-menu"]', { timeout: 2000 });
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear all cookies and local storage
 * @param {BrowserContext} context - Playwright browser context
 */
async function clearSession(context) {
  await context.clearCookies();
  await context.clearPermissions();
}

module.exports = {
  login,
  logout,
  navigateToApp,
  waitForElement,
  takeScreenshot,
  isAuthenticated,
  clearSession,
};
