// playwright.config.js
const { defineConfig, devices } = require("@playwright/test");

/**
 * Playwright Test Configuration for iiskills.cloud monorepo
 *
 * This configuration enables comprehensive E2E testing across all apps
 * with support for multiple browsers and devices.
 */

module.exports = defineConfig({
  testDir: "./tests/e2e",

  // Maximum time one test can run for
  timeout: 30 * 1000,

  // Expect timeout for assertions
  expect: {
    timeout: 5000,
  },

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI to avoid resource contention
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ["html", { outputFolder: "test-results/html" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
    ["list"], // Console output
  ],

  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || "http://localhost:3000",

    // Collect trace when retrying the failed test
    trace: "on-first-retry",

    // Screenshot on failure
    screenshot: "only-on-failure",

    // Video on failure
    video: "retain-on-failure",

    // Navigation timeout
    navigationTimeout: 30 * 1000,

    // Action timeout
    actionTimeout: 10 * 1000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Viewport size
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1280, height: 720 },
      },
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Mobile testing
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
      },
    },

    {
      name: "Mobile Safari",
      use: {
        ...devices["iPhone 12"],
      },
    },

    // Tablet testing
    {
      name: "Tablet",
      use: {
        ...devices["iPad Pro"],
      },
    },
  ],

  // Run local dev server before starting tests.
  // reuseExistingServer: true — Playwright reuses a server that is already
  // listening on the URL (e.g. started manually in CI via `yarn start`).
  // If nothing is running yet, Playwright launches `command` automatically.
  webServer: {
    command: "yarn dev:main",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    // 120 seconds — sufficient for Next.js cold start in CI
    timeout: 120000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
