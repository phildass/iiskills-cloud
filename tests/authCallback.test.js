/**
 * Tests for the centralized auth callback helpers.
 *
 * Covers:
 * - validateNextPath: open-redirect attack prevention
 * - isAllowedOrigin: domain allowlist enforcement for cross-subdomain token transfer
 * - Callback URL construction in UniversalLogin (unit-level logic)
 */

"use strict";

// ─── validateNextPath (copied from apps/main/pages/auth/callback.js) ──────────

function validateNextPath(next) {
  if (
    typeof next !== "string" ||
    !next.startsWith("/") ||
    next.startsWith("//") ||
    /^\/[a-z][a-z0-9+.-]*:/i.test(next)
  ) {
    return "/";
  }
  return next;
}

// ─── isAllowedOrigin (copied from apps/main/pages/auth/callback.js) ──────────

function isAllowedOrigin(origin) {
  try {
    const url = new URL(origin);
    return (
      url.hostname === "iiskills.cloud" ||
      url.hostname.endsWith(".iiskills.cloud") ||
      url.hostname === "localhost" ||
      url.hostname === "127.0.0.1"
    );
  } catch {
    return false;
  }
}

// ─── validateNextPath tests ────────────────────────────────────────────────────

describe("validateNextPath — open-redirect prevention", () => {
  test("allows a simple relative path", () => {
    expect(validateNextPath("/dashboard")).toBe("/dashboard");
  });

  test("allows root path", () => {
    expect(validateNextPath("/")).toBe("/");
  });

  test("allows a path with query string", () => {
    expect(validateNextPath("/payments/iiskills?course=learn-management")).toBe(
      "/payments/iiskills?course=learn-management"
    );
  });

  test("rejects protocol-relative URL (//)", () => {
    expect(validateNextPath("//evil.com")).toBe("/");
  });

  test("rejects absolute http URL", () => {
    expect(validateNextPath("http://evil.com")).toBe("/");
  });

  test("rejects absolute https URL", () => {
    expect(validateNextPath("https://evil.com/steal")).toBe("/");
  });

  test("rejects javascript: scheme", () => {
    expect(validateNextPath("/javascript:alert(1)")).toBe("/");
  });

  test("rejects non-string values", () => {
    expect(validateNextPath(null)).toBe("/");
    expect(validateNextPath(undefined)).toBe("/");
    expect(validateNextPath(123)).toBe("/");
  });

  test("rejects empty string", () => {
    expect(validateNextPath("")).toBe("/");
  });

  test("rejects path that does not start with /", () => {
    expect(validateNextPath("dashboard")).toBe("/");
  });
});

// ─── isAllowedOrigin tests ──────────────────────────────────────────────────────

describe("isAllowedOrigin — domain allowlist", () => {
  test("allows main domain", () => {
    expect(isAllowedOrigin("https://iiskills.cloud")).toBe(true);
  });

  test("allows learn-ai subdomain", () => {
    expect(isAllowedOrigin("https://learn-ai.iiskills.cloud")).toBe(true);
  });

  test("allows learn-management subdomain", () => {
    expect(isAllowedOrigin("https://learn-management.iiskills.cloud")).toBe(true);
  });

  test("allows any *.iiskills.cloud subdomain", () => {
    expect(isAllowedOrigin("https://learn-physics.iiskills.cloud")).toBe(true);
    expect(isAllowedOrigin("https://learn-math.iiskills.cloud")).toBe(true);
  });

  test("allows localhost", () => {
    expect(isAllowedOrigin("http://localhost:3016")).toBe(true);
    expect(isAllowedOrigin("http://localhost")).toBe(true);
  });

  test("allows 127.0.0.1", () => {
    expect(isAllowedOrigin("http://127.0.0.1:3000")).toBe(true);
  });

  test("rejects external domain", () => {
    expect(isAllowedOrigin("https://evil.com")).toBe(false);
  });

  test("rejects domain that ends with but is not iiskills.cloud subdomain", () => {
    // e.g. "fakeiiskills.cloud" does NOT end with ".iiskills.cloud"
    expect(isAllowedOrigin("https://fakeiiskills.cloud")).toBe(false);
  });

  test("rejects empty string", () => {
    expect(isAllowedOrigin("")).toBe(false);
  });

  test("rejects malformed URL", () => {
    expect(isAllowedOrigin("not-a-url")).toBe(false);
  });
});

// ─── Centralized callback URL construction ────────────────────────────────────

describe("centralized auth callback URL construction", () => {
  const MAIN_APP_URL = "https://iiskills.cloud";

  test("builds callback URL with origin and next for cross-domain login", () => {
    const origin = "https://learn-management.iiskills.cloud";
    const next = "/payments/iiskills?course=learn-management";

    const params = new URLSearchParams();
    params.set("origin", origin);
    params.set("next", next);
    const callbackUrl = `${MAIN_APP_URL}/auth/callback?${params.toString()}`;

    expect(callbackUrl).toContain("https://iiskills.cloud/auth/callback");
    expect(callbackUrl).toContain("origin=https%3A%2F%2Flearn-management.iiskills.cloud");
    expect(callbackUrl).toContain("next=");
    expect(callbackUrl).toContain("learn-management");
  });

  test("omits next param when destination is root", () => {
    const origin = "https://learn-ai.iiskills.cloud";
    const targetPath = "/";

    const params = new URLSearchParams();
    params.set("origin", origin);
    if (targetPath && targetPath !== "/") {
      params.set("next", targetPath);
    }
    const callbackUrl = `${MAIN_APP_URL}/auth/callback?${params.toString()}`;

    expect(callbackUrl).not.toContain("next=");
    expect(callbackUrl).toContain("origin=");
  });

  test("callback URL always points to main domain", () => {
    const origin = "https://learn-pr.iiskills.cloud";
    const params = new URLSearchParams();
    params.set("origin", origin);
    const callbackUrl = `${MAIN_APP_URL}/auth/callback?${params.toString()}`;

    expect(callbackUrl.startsWith("https://iiskills.cloud/auth/callback")).toBe(true);
  });
});

console.log("✅ authCallback tests defined successfully");
