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
  const anonKeyLines = src.split("\n").filter((line) => line.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
  return (
    anonKeyLines.length === 0 ||
    anonKeyLines.every((line) => /^\s*(\/\/|\*)/.test(line))
  );
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
// ---------------------------------------------------------------------------

describe("api/payments/confirm.js — service role enforcement", () => {
  let src;
  beforeAll(() => {
    src = readSource("payments/confirm.js");
  });

  test("uses SUPABASE_SERVICE_ROLE_KEY for the admin DB client", () => {
    expect(src).toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("does NOT use the ambiguous SUPABASE_KEY variable as DB client key", () => {
    expect(checkNoAmbiguousSUPABASE_KEY(src)).toBe(true);
  });

  test("getSupabaseAdmin returns null when service role key is absent", () => {
    const factoryMatch = src.match(/function getSupabaseAdmin\(\)[^}]+\}/s);
    expect(factoryMatch).not.toBeNull();
    const factory = factoryMatch[0];
    expect(factory).toContain("return null");
    expect(factory).not.toContain("SUPABASE_KEY");
  });
});

// ---------------------------------------------------------------------------
// 4. apps/main/pages/api/payment/webhook.js
// ---------------------------------------------------------------------------

describe("api/payment/webhook.js — service role enforcement", () => {
  let src;
  beforeAll(() => {
    src = readSource("payment/webhook.js");
  });

  test("does NOT have a module-level supabase client using SUPABASE_KEY", () => {
    // Old pattern: const supabase = createClient(..., process.env.SUPABASE_KEY ...)
    expect(src).not.toMatch(/const supabase\s*=\s*createClient\s*\(/);
  });

  test("uses SUPABASE_SERVICE_ROLE_KEY for the admin DB client", () => {
    expect(src).toContain("SUPABASE_SERVICE_ROLE_KEY");
  });

  test("does NOT use the ambiguous SUPABASE_KEY variable", () => {
    expect(checkNoAmbiguousSUPABASE_KEY(src)).toBe(true);
  });

  test("getSupabaseAdmin returns null when service role key is absent", () => {
    const factoryMatch = src.match(/function getSupabaseAdmin\(\)[^}]+\}/s);
    expect(factoryMatch).not.toBeNull();
    const factory = factoryMatch[0];
    expect(factory).toContain("return null");
    expect(factory).not.toContain("SUPABASE_KEY");
  });

  test("returns 503 when service role client is unavailable", () => {
    // When supabase is null, the handler must NOT silently skip the insert.
    // It should return a 503 error response.
    expect(src).toContain("Payment service not configured");
    expect(src).toContain("503");
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
// ---------------------------------------------------------------------------

describe("payment endpoints — checkConfig guard", () => {
  test("payments/confirm.js calls checkConfig before processing", () => {
    const src = readSource("payments/confirm.js");
    expect(src).toContain("checkConfig");
    expect(src).toContain("AIENTER_CONFIRMATION_SIGNING_SECRET");
    expect(src).toContain("PAYMENT_TOKEN_SECRET");
  });

  test("payments/generate-token.js calls checkConfig before processing", () => {
    const src = readSource("payments/generate-token.js");
    expect(src).toContain("checkConfig");
    expect(src).toContain("PAYMENT_TOKEN_SECRET");
  });

  test('payments/confirm.js returns "Server misconfiguration" on missing env', () => {
    const src = readSource("payments/confirm.js");
    expect(src).toContain("Server misconfiguration");
  });
});

console.log("✅ serverRoleEnforcement tests defined successfully");
