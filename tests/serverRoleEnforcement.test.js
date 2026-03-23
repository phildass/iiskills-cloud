/**
 * Server-side role enforcement tests.
 *
 * Verifies that server-side API routes that perform database writes or
 * privileged reads always use the service role key (SUPABASE_SERVICE_ROLE_KEY)
 * and NEVER fall back to the anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY) or the
 * ambiguous SUPABASE_KEY for their primary Supabase DB client.
 *
 * Using the anon key in these endpoints would subject DB operations to RLS
 * policies that are scoped to `auth.uid()`, which is not set when the client
 * is created server-side without a user session context — causing silent
 * permission failures or data leakage.
 *
 * Covered endpoints:
 *   - apps/main/pages/api/profile.js            (GET / PATCH)
 *   - apps/main/pages/api/profile/update.js     (POST / PATCH with lock rules)
 *   - apps/main/pages/api/payments/confirm.js   (POST — aienter.in callback)
 *   - apps/main/pages/api/payment/webhook.js    (POST — Razorpay webhook)
 *   - apps/main/pages/api/complete-registration.js (POST)
 */

"use strict";

const fs = require("fs");
const path = require("path");

const API_ROOT = path.join(__dirname, "..", "apps", "main", "pages", "api");

function readSource(relPath) {
  return fs.readFileSync(path.join(API_ROOT, relPath), "utf8");
}

// ---------------------------------------------------------------------------
// Helper: verify that a source file's server-side DB client factory only uses
// SUPABASE_SERVICE_ROLE_KEY and does NOT fall back to anon key variants.
// ---------------------------------------------------------------------------

function hasNoAnonKeyFallback(src) {
  // True when NEXT_PUBLIC_SUPABASE_ANON_KEY is absent OR only appears in comments
  const anonKeyLines = src
    .split("\n")
    .filter((line) => line.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
  return anonKeyLines.length === 0 || anonKeyLines.every((line) => /^\s*(\/\/|\*)/.test(line));
}

function checkNoAmbiguousSUPABASE_KEY(src) {
  // SUPABASE_KEY (without SERVICE_ROLE qualifier) should not be used as the
  // key for creating a server-side Supabase client.
  const lines = src.split("\n").filter((line) => /\bSUPABASE_KEY\b/.test(line));
  return lines.every((line) => /^\s*(\/\/|\*)/.test(line)); // only in comments
}

// ---------------------------------------------------------------------------
// 1. apps/main/pages/api/profile.js
// ---------------------------------------------------------------------------

describe("api/profile.js — service role enforcement", () => {
  let src;
  beforeAll(() => {
    src = readSource("profile.js");
  });

  test("uses SUPABASE_SERVICE_ROLE_KEY for the server DB client", () => {
    expect(src).toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("does NOT fall back to NEXT_PUBLIC_SUPABASE_ANON_KEY in client creation", () => {
    expect(hasNoAnonKeyFallback(src)).toBe(true);
  });

  test("does NOT use the ambiguous SUPABASE_KEY variable", () => {
    expect(checkNoAmbiguousSUPABASE_KEY(src)).toBe(true);
  });

  test("returns null (→ 503) when service role key is absent", () => {
    // The factory function must return null, not create a client with a weaker key
    const factoryMatch = src.match(/function getSupabaseServer\(\)[^}]+\}/s);
    expect(factoryMatch).not.toBeNull();
    const factory = factoryMatch[0];
    expect(factory).toContain("return null");
    // Must not contain anon key
    expect(factory).not.toContain("ANON_KEY");
    expect(factory).not.toContain("SUPABASE_KEY");
  });
});

// ---------------------------------------------------------------------------
// 2. apps/main/pages/api/profile/update.js
// ---------------------------------------------------------------------------

describe("api/profile/update.js — service role enforcement", () => {
  let src;
  beforeAll(() => {
    src = readSource("profile/update.js");
  });

  test("uses SUPABASE_SERVICE_ROLE_KEY for the server DB client", () => {
    expect(src).toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("does NOT fall back to NEXT_PUBLIC_SUPABASE_ANON_KEY in client creation", () => {
    expect(hasNoAnonKeyFallback(src)).toBe(true);
  });

  test("does NOT use the ambiguous SUPABASE_KEY variable", () => {
    expect(checkNoAmbiguousSUPABASE_KEY(src)).toBe(true);
  });

  test("returns null (→ 503) when service role key is absent", () => {
    const factoryMatch = src.match(/function getSupabaseServer\(\)[^}]+\}/s);
    expect(factoryMatch).not.toBeNull();
    const factory = factoryMatch[0];
    expect(factory).toContain("return null");
    expect(factory).not.toContain("ANON_KEY");
    expect(factory).not.toContain("SUPABASE_KEY");
  });
});

// ---------------------------------------------------------------------------
// 3. apps/main/pages/api/payments/confirm.js
// PAYMENT_STUB: This endpoint is disabled. Tests updated to verify stub behavior.
// ---------------------------------------------------------------------------

describe("api/payments/confirm.js — PAYMENT_STUB (disabled)", () => {
  let src;
  beforeAll(() => {
    src = readSource("payments/confirm.js");
  });

  // PAYMENT_STUB: Original tests checked for SUPABASE_SERVICE_ROLE_KEY, getSupabaseAdmin, etc.
  // Those checks are no longer valid since the endpoint is disabled.
  // New tests verify the stub is properly in place.

  test("PAYMENT_STUB: file contains PAYMENT_STUB marker", () => {
    expect(src).toContain("PAYMENT_STUB");
  });

  test("PAYMENT_STUB: returns 503 for all requests", () => {
    expect(src).toContain("503");
    expect(src).toContain("payment_system_disabled");
  });

  test("does NOT use the ambiguous SUPABASE_KEY variable as DB client key", () => {
    // Still valid — stubs must not introduce key leakage
    expect(checkNoAmbiguousSUPABASE_KEY(src)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 4. apps/main/pages/api/payment/webhook.js
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 4. apps/main/pages/api/payment/webhook.js
// PAYMENT_STUB: This endpoint is disabled. Tests updated to verify stub behavior.
// ---------------------------------------------------------------------------

describe("api/payment/webhook.js — PAYMENT_STUB (disabled)", () => {
  let src;
  beforeAll(() => {
    src = readSource("payment/webhook.js");
  });

  // PAYMENT_STUB: Original tests checked for service role key usage, etc.
  // New tests verify the stub is properly in place.

  test("PAYMENT_STUB: file contains PAYMENT_STUB marker", () => {
    expect(src).toContain("PAYMENT_STUB");
  });

  test("PAYMENT_STUB: returns 503 for all requests", () => {
    expect(src).toContain("503");
    expect(src).toContain("payment_system_disabled");
  });

  test("does NOT have a module-level supabase client using SUPABASE_KEY", () => {
    // Old pattern: const supabase = createClient(..., process.env.SUPABASE_KEY ...)
    expect(src).not.toMatch(/const supabase\s*=\s*createClient\s*\(/);
  });

  test("does NOT use the ambiguous SUPABASE_KEY variable", () => {
    expect(checkNoAmbiguousSUPABASE_KEY(src)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 5. apps/main/pages/api/complete-registration.js
// ---------------------------------------------------------------------------

describe("api/complete-registration.js — service role enforcement", () => {
  let src;
  beforeAll(() => {
    src = readSource("complete-registration.js");
  });

  test("uses SUPABASE_SERVICE_ROLE_KEY for the admin DB client", () => {
    expect(src).toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("does NOT fall back to NEXT_PUBLIC_SUPABASE_ANON_KEY in client creation", () => {
    expect(hasNoAnonKeyFallback(src)).toBe(true);
  });

  test("does NOT use the ambiguous SUPABASE_KEY variable", () => {
    expect(checkNoAmbiguousSUPABASE_KEY(src)).toBe(true);
  });

  test("JSDoc does not advertise anon key as a fallback", () => {
    expect(src).not.toContain("NEXT_PUBLIC_SUPABASE_ANON_KEY as fallback");
    expect(src).not.toContain("anon key as fallback");
  });

  test("getSupabaseAdmin returns null when service role key is absent", () => {
    const factoryMatch = src.match(/function getSupabaseAdmin\(\)[^}]+\}/s);
    expect(factoryMatch).not.toBeNull();
    const factory = factoryMatch[0];
    expect(factory).toContain("return null");
    expect(factory).not.toContain("ANON_KEY");
    expect(factory).not.toContain("SUPABASE_KEY");
  });
});

// ---------------------------------------------------------------------------
// 6. apps/main/pages/api/entitlement.js
// ---------------------------------------------------------------------------

describe("api/entitlement.js — service role enforcement", () => {
  let src;
  beforeAll(() => {
    src = readSource("entitlement.js");
  });

  test("uses SUPABASE_SERVICE_ROLE_KEY for the server DB client", () => {
    expect(src).toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("does NOT fall back to NEXT_PUBLIC_SUPABASE_ANON_KEY in client creation", () => {
    expect(hasNoAnonKeyFallback(src)).toBe(true);
  });

  test("does NOT use the ambiguous SUPABASE_KEY variable", () => {
    expect(checkNoAmbiguousSUPABASE_KEY(src)).toBe(true);
  });

  test("getSupabaseServer returns null when service role key is absent", () => {
    const factoryMatch = src.match(/function getSupabaseServer\(\)[^}]+\}/s);
    expect(factoryMatch).not.toBeNull();
    const factory = factoryMatch[0];
    expect(factory).toContain("return null");
    expect(factory).not.toContain("ANON_KEY");
    expect(factory).not.toContain("SUPABASE_KEY");
  });
});

// ---------------------------------------------------------------------------
// 7. Cross-cutting: checkConfig guards on payment endpoints
// PAYMENT_STUB: Payment endpoints are disabled. Tests updated to verify stub behavior.
// ---------------------------------------------------------------------------

describe("payment endpoints — PAYMENT_STUB (disabled)", () => {
  // PAYMENT_STUB: Original tests verified checkConfig guards and env var checks.
  // Since payment endpoints are now stubs, we verify stub markers are present.

  test("PAYMENT_STUB: payments/confirm.js is a stub returning 503", () => {
    const src = readSource("payments/confirm.js");
    expect(src).toContain("PAYMENT_STUB");
    expect(src).toContain("503");
    expect(src).toContain("payment_system_disabled");
  });

  test("PAYMENT_STUB: payments/generate-token.js is a stub returning 503", () => {
    const src = readSource("payments/generate-token.js");
    expect(src).toContain("PAYMENT_STUB");
    expect(src).toContain("503");
    expect(src).toContain("payment_system_disabled");
  });

  test("PAYMENT_STUB: payments/create-purchase.js is a stub returning 503", () => {
    const src = readSource("payments/create-purchase.js");
    expect(src).toContain("PAYMENT_STUB");
    expect(src).toContain("503");
    expect(src).toContain("payment_system_disabled");
  });
});

console.log("✅ serverRoleEnforcement tests defined successfully");
