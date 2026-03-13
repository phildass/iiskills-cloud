/**
 * Tests for IS_TEST_SITE middleware blocking logic.
 *
 * The middleware in apps/main/middleware.js checks IS_TEST_SITE_SERVER and
 * blocks all non-GET/HEAD requests to /api/* with HTTP 423 when the flag is
 * set. These tests mirror that logic inline (avoiding importing Edge-runtime
 * modules into Jest, following the pattern in middlewarePublicPaths.test.js).
 */

"use strict";

// ---------------------------------------------------------------------------
// Inline copy of the IS_TEST_SITE blocking logic from apps/main/middleware.js
// ---------------------------------------------------------------------------

const TEST_SITE_ERROR = "Test Site Only \u2014 No actions allowed";

/**
 * Simulate whether a request would be blocked by the test-site guard.
 *
 * @param {object} opts
 * @param {boolean} opts.isTestSite  - value of IS_TEST_SITE_SERVER
 * @param {string}  opts.pathname    - request pathname
 * @param {string}  opts.method      - HTTP method (uppercase)
 * @returns {{ blocked: boolean, status?: number, body?: object }}
 */
function checkTestSiteGuard({ isTestSite, pathname, method }) {
  if (isTestSite && pathname.startsWith("/api/")) {
    const m = method.toUpperCase();
    if (m !== "GET" && m !== "HEAD") {
      return { blocked: true, status: 423, body: { error: TEST_SITE_ERROR } };
    }
  }
  return { blocked: false };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Test Site middleware guard — IS_TEST_SITE disabled", () => {
  const isTestSite = false;

  test("POST /api/pay is NOT blocked when IS_TEST_SITE=false", () => {
    const result = checkTestSiteGuard({ isTestSite, pathname: "/api/pay", method: "POST" });
    expect(result.blocked).toBe(false);
  });

  test("PUT /api/profile is NOT blocked when IS_TEST_SITE=false", () => {
    const result = checkTestSiteGuard({ isTestSite, pathname: "/api/profile", method: "PUT" });
    expect(result.blocked).toBe(false);
  });

  test("DELETE /api/tickets/1 is NOT blocked when IS_TEST_SITE=false", () => {
    const result = checkTestSiteGuard({
      isTestSite,
      pathname: "/api/tickets/1",
      method: "DELETE",
    });
    expect(result.blocked).toBe(false);
  });
});

describe("Test Site middleware guard — IS_TEST_SITE enabled", () => {
  const isTestSite = true;

  test("POST /api/pay is blocked with 423", () => {
    const result = checkTestSiteGuard({ isTestSite, pathname: "/api/pay", method: "POST" });
    expect(result.blocked).toBe(true);
    expect(result.status).toBe(423);
  });

  test("PUT /api/profile is blocked with 423", () => {
    const result = checkTestSiteGuard({ isTestSite, pathname: "/api/profile", method: "PUT" });
    expect(result.blocked).toBe(true);
    expect(result.status).toBe(423);
  });

  test("DELETE /api/tickets/1 is blocked with 423", () => {
    const result = checkTestSiteGuard({
      isTestSite,
      pathname: "/api/tickets/1",
      method: "DELETE",
    });
    expect(result.blocked).toBe(true);
    expect(result.status).toBe(423);
  });

  test("PATCH /api/admin/courses/1 is blocked with 423", () => {
    const result = checkTestSiteGuard({
      isTestSite,
      pathname: "/api/admin/courses/1",
      method: "PATCH",
    });
    expect(result.blocked).toBe(true);
    expect(result.status).toBe(423);
  });

  test("blocked response body contains TEST_SITE_ERROR message", () => {
    const result = checkTestSiteGuard({ isTestSite, pathname: "/api/pay", method: "POST" });
    expect(result.body).toEqual({ error: TEST_SITE_ERROR });
    expect(result.body.error).toBe("Test Site Only \u2014 No actions allowed");
  });

  test("GET /api/health is NOT blocked (read-only)", () => {
    const result = checkTestSiteGuard({ isTestSite, pathname: "/api/health", method: "GET" });
    expect(result.blocked).toBe(false);
  });

  test("HEAD /api/healthz is NOT blocked (read-only)", () => {
    const result = checkTestSiteGuard({ isTestSite, pathname: "/api/healthz", method: "HEAD" });
    expect(result.blocked).toBe(false);
  });

  test("GET /api/entitlement is NOT blocked (read-only)", () => {
    const result = checkTestSiteGuard({
      isTestSite,
      pathname: "/api/entitlement",
      method: "GET",
    });
    expect(result.blocked).toBe(false);
  });

  test("non-API POST path is NOT blocked by test-site guard", () => {
    // /admin and other non-api paths are handled by separate rate-limiting logic
    const result = checkTestSiteGuard({
      isTestSite,
      pathname: "/admin/login",
      method: "POST",
    });
    expect(result.blocked).toBe(false);
  });
});

describe("Test Site middleware guard — case insensitivity", () => {
  test("lowercase 'post' method is treated as blocked", () => {
    const result = checkTestSiteGuard({ isTestSite: true, pathname: "/api/pay", method: "post" });
    expect(result.blocked).toBe(true);
  });

  test("mixed-case 'Post' method is treated as blocked", () => {
    const result = checkTestSiteGuard({ isTestSite: true, pathname: "/api/pay", method: "Post" });
    expect(result.blocked).toBe(true);
  });
});

console.log("✅ Test Site middleware guard tests defined successfully");
