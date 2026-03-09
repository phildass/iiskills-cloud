/**
 * Regression tests for the middleware public-path pass-through guard.
 *
 * These tests mirror the isPublicPath helper in apps/main/middleware.js.
 * They ensure that browser-critical files (manifest.json, favicon.ico, etc.)
 * and static-asset prefixes (_next/*, images/*) are always classified as
 * public so they are NEVER blocked by rate-limiting or auth gating.
 *
 * If you change the PUBLIC_PATH_EXACT / PUBLIC_PATH_PREFIXES sets in
 * middleware.js, update this test file accordingly.
 */

"use strict";

// ---------------------------------------------------------------------------
// Inline copy of the isPublicPath logic from apps/main/middleware.js.
// Kept here to avoid importing Edge-runtime code into Jest.
// ---------------------------------------------------------------------------
const PUBLIC_PATH_PREFIXES = ["/_next/", "/images/"];
const PUBLIC_PATH_EXACT = new Set([
  "/manifest.json",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]);

function isPublicPath(pathname) {
  if (PUBLIC_PATH_EXACT.has(pathname)) return true;
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("middleware: isPublicPath — exact matches", () => {
  test("/manifest.json is public", () => {
    expect(isPublicPath("/manifest.json")).toBe(true);
  });

  test("/favicon.ico is public", () => {
    expect(isPublicPath("/favicon.ico")).toBe(true);
  });

  test("/robots.txt is public", () => {
    expect(isPublicPath("/robots.txt")).toBe(true);
  });

  test("/sitemap.xml is public", () => {
    expect(isPublicPath("/sitemap.xml")).toBe(true);
  });
});

describe("middleware: isPublicPath — prefix matches", () => {
  test("/_next/static/* is public", () => {
    expect(isPublicPath("/_next/static/chunks/main.js")).toBe(true);
  });

  test("/_next/image/* is public", () => {
    // In Next.js middleware, request.nextUrl.pathname strips the query string.
    // So /_next/image requests arrive with just the path (no ?url=...).
    // Since the prefix is "/_next/", any path starting with it is public.
    expect(isPublicPath("/_next/image")).toBe(true);
    expect(isPublicPath("/_next/")).toBe(true);
  });

  test("/images/icon-192x192.png is public", () => {
    expect(isPublicPath("/images/icon-192x192.png")).toBe(true);
  });

  test("/images/logo.svg is public", () => {
    expect(isPublicPath("/images/logo.svg")).toBe(true);
  });
});

describe("middleware: isPublicPath — gated routes are NOT public", () => {
  test("/api/auth/callback is NOT public", () => {
    expect(isPublicPath("/api/auth/callback")).toBe(false);
  });

  test("/api/payments/generate-token is NOT public", () => {
    expect(isPublicPath("/api/payments/generate-token")).toBe(false);
  });

  test("/admin/dashboard is NOT public", () => {
    expect(isPublicPath("/admin/dashboard")).toBe(false);
  });

  test("/profile is NOT public", () => {
    expect(isPublicPath("/profile")).toBe(false);
  });

  test("/payments/iiskills is NOT public", () => {
    expect(isPublicPath("/payments/iiskills")).toBe(false);
  });

  test("/ (home) is NOT classified as a public static path", () => {
    expect(isPublicPath("/")).toBe(false);
  });
});

console.log("✅ middleware public-path pass-through tests defined successfully");
