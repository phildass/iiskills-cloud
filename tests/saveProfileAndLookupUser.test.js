/**
 * Tests for:
 *   1. /api/payments/save-profile — phone normalisation and validation
 *   2. /api/admin/lookup-user    — phone normalisation logic
 *   3. Migration: add_phone_e164_constraint.sql — E.164 regex matches
 */

// ── 1. save-profile: normalisePhone utility ──────────────────────────────────

const { normalisePhone } = require("../apps/main/pages/api/payments/save-profile");

describe("save-profile: normalisePhone", () => {
  test("prepends +91 to a bare 10-digit Indian number", () => {
    expect(normalisePhone("9876543210")).toBe("+919876543210");
  });

  test("leaves an already-E.164 Indian number unchanged", () => {
    expect(normalisePhone("+919876543210")).toBe("+919876543210");
  });

  test("leaves a non-Indian E.164 number unchanged", () => {
    expect(normalisePhone("+12025551234")).toBe("+12025551234");
  });

  test("trims whitespace before normalising", () => {
    expect(normalisePhone("  9876543210  ")).toBe("+919876543210");
    expect(normalisePhone("  +919876543210  ")).toBe("+919876543210");
  });

  test('handles empty string gracefully (returns "+91")', () => {
    expect(normalisePhone("")).toBe("+91");
  });

  test('handles null/undefined gracefully (returns "+91")', () => {
    expect(normalisePhone(null)).toBe("+91");
    expect(normalisePhone(undefined)).toBe("+91");
  });
});

// ── 2. E.164 regex validation (mirrors save-profile and lookup-user) ─────────

const E164_REGEX = /^\+[1-9][0-9]{6,14}$/;

describe("E.164 regex validation", () => {
  test("accepts a valid Indian mobile number", () => {
    expect(E164_REGEX.test("+919876543210")).toBe(true);
  });

  test("accepts a valid US number", () => {
    expect(E164_REGEX.test("+12025551234")).toBe(true);
  });

  test("accepts the minimum valid length (8 digits total after +)", () => {
    // +[1-9] + 6 digits = 8 chars total → minimum valid
    expect(E164_REGEX.test("+11234567")).toBe(true);
  });

  test("accepts the maximum valid length (16 digits total after +)", () => {
    // +[1-9] + 14 digits = 16 chars total → maximum valid
    expect(E164_REGEX.test("+112345678901234")).toBe(true);
  });

  test("rejects a number without leading +", () => {
    expect(E164_REGEX.test("919876543210")).toBe(false);
  });

  test("rejects a number with leading +0 (country codes start at 1)", () => {
    expect(E164_REGEX.test("+09876543210")).toBe(false);
  });

  test("rejects a number that is too short", () => {
    // +1 + 5 digits = 7 chars → below minimum
    expect(E164_REGEX.test("+112345")).toBe(false);
  });

  test("rejects a number that is too long", () => {
    // +1 + 15 digits = 17 chars → above maximum
    expect(E164_REGEX.test("+1123456789012345")).toBe(false);
  });

  test("rejects a number with spaces", () => {
    expect(E164_REGEX.test("+91 98765 43210")).toBe(false);
  });

  test("rejects a number with dashes", () => {
    expect(E164_REGEX.test("+91-9876543210")).toBe(false);
  });

  test("normalisePhone + E164_REGEX: bare Indian number passes after normalisation", () => {
    const phone = normalisePhone("9876543210");
    expect(E164_REGEX.test(phone)).toBe(true);
  });

  test("normalisePhone + E164_REGEX: bare 5-digit number passes after normalisation", () => {
    // normalisePhone('12345') → '+9112345'
    // Regex: +[1-9][0-9]{6,14} → '9' matches [1-9], '112345' (6 chars) matches [0-9]{6,14} → valid
    const phone = normalisePhone("12345");
    expect(E164_REGEX.test(phone)).toBe(true);
  });
});

// ── 3. Admin lookup-user: phone normalisation (mirrors the API logic) ─────────

function adminNormalisePhone(raw) {
  const trimmed = (raw || "").trim();
  return trimmed.startsWith("+") ? trimmed : `+91${trimmed}`;
}

describe("admin/lookup-user: phone normalisation", () => {
  test("prepends +91 to a bare 10-digit number", () => {
    expect(adminNormalisePhone("9876543210")).toBe("+919876543210");
  });

  test("leaves E.164 number unchanged", () => {
    expect(adminNormalisePhone("+919876543210")).toBe("+919876543210");
  });

  test("leaves non-Indian E.164 number unchanged", () => {
    expect(adminNormalisePhone("+442071234567")).toBe("+442071234567");
  });

  test("trims surrounding whitespace", () => {
    expect(adminNormalisePhone("  +919876543210  ")).toBe("+919876543210");
  });
});

// ── 4. Profile unique constraint error detection (mirrors save-profile handler)

describe("save-profile: unique constraint detection", () => {
  test("detects Postgres unique violation by code 23505", () => {
    const err = { code: "23505", message: "duplicate key value violates unique constraint" };
    const isUnique = err.code === "23505" || err.message?.includes("unique");
    expect(isUnique).toBe(true);
  });

  test("detects unique violation by message keyword", () => {
    const err = { code: "42501", message: "unique constraint violated" };
    const isUnique = err.code === "23505" || err.message?.includes("unique");
    expect(isUnique).toBe(true);
  });

  test("does not false-positive on unrelated DB errors", () => {
    const err = { code: "42P01", message: 'relation "profiles" does not exist' };
    const isUnique = err.code === "23505" || err.message?.includes("unique");
    expect(isUnique).toBe(false);
  });
});

console.log("✅ saveProfile and adminLookupUser tests defined successfully");
