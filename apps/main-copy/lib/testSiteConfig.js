/**
 * Test Site Configuration
 *
 * Controls whether the site is running in "Test Site Only" mode.
 * When enabled:
 *   - All mutation/action requests are blocked at the API level
 *   - A prominent "Test Site Only" banner is displayed on every page
 *   - Action buttons and links show a modal instead of performing the action
 *   - Site is publicly accessible for viewing but no real actions can be taken
 *
 * Usage:
 *   Set NEXT_PUBLIC_IS_TEST_SITE=true  (client-side, visible in browser)
 *   Set IS_TEST_SITE=true              (server-side, for API middleware)
 *
 * Deployment: deploy apps/main with IS_TEST_SITE=true to create a read-only
 * demo/test copy of the site (e.g., main-copy.iiskills.cloud).
 */

/**
 * Whether the current deployment is a "Test Site Only" instance.
 * Reads NEXT_PUBLIC_IS_TEST_SITE for client + server contexts.
 */
export const IS_TEST_SITE = process.env.NEXT_PUBLIC_IS_TEST_SITE === "true";

/**
 * Server-side check (also reads IS_TEST_SITE without the NEXT_PUBLIC prefix).
 * Useful in middleware and API routes running outside the browser bundle.
 */
export const IS_TEST_SITE_SERVER =
  process.env.IS_TEST_SITE === "true" || process.env.NEXT_PUBLIC_IS_TEST_SITE === "true";

/** Standard error response body returned by all blocked API endpoints. */
export const TEST_SITE_ERROR = "Test Site Only \u2014 No actions allowed";
