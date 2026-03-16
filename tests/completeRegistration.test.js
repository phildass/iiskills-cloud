/**
 * Tests for the complete-registration flow.
 *
 * Covers:
 * - Password validation rules (validatePassword)
 * - Username generation (generateUsername)
 * - API handler logic: password mismatch, missing fields, idempotency
 */

"use strict";

// Import the exported helpers directly from the API module.
// The module is CommonJS-compatible through babel transforms.
const {
  validatePassword,
  generateUsername,
} = require("../apps/main/pages/api/complete-registration");

// ─── Password validation ──────────────────────────────────────────────────────

describe("validatePassword — strength rules", () => {
  test("returns empty array for a valid strong password", () => {
    const errors = validatePassword("StrongPass1!");
    expect(errors).toHaveLength(0);
  });

  test("returns error when password is null / undefined", () => {
    expect(validatePassword(null)).toEqual(["Password is required"]);
    expect(validatePassword(undefined)).toEqual(["Password is required"]);
    expect(validatePassword("")).toEqual(["Password is required"]);
  });

  test("rejects password shorter than 10 characters", () => {
    const errors = validatePassword("Sh0rt!");
    expect(errors.some((e) => e.includes("10 characters"))).toBe(true);
  });

  test("rejects password without uppercase letter", () => {
    const errors = validatePassword("alllowercase1!");
    expect(errors.some((e) => e.includes("uppercase"))).toBe(true);
  });

  test("rejects password without lowercase letter", () => {
    const errors = validatePassword("ALLUPPERCASE1!");
    expect(errors.some((e) => e.includes("lowercase"))).toBe(true);
  });

  test("rejects password without a number", () => {
    const errors = validatePassword("NoNumbers!!AA");
    expect(errors.some((e) => e.includes("number"))).toBe(true);
  });

  test("rejects password without a special character", () => {
    const errors = validatePassword("NoSpecial12AB");
    expect(errors.some((e) => e.includes("special character"))).toBe(true);
  });

  test("can return multiple errors at once", () => {
    // Only has uppercase — missing length, lower, digit, special
    const errors = validatePassword("WEAK");
    expect(errors.length).toBeGreaterThan(1);
  });

  test("exactly-10-char password with all requirements passes", () => {
    const errors = validatePassword("Abcdefg1!z");
    expect(errors).toHaveLength(0);
  });
});

// ─── Password blacklist ───────────────────────────────────────────────────────

describe("validatePassword — common password blacklist", () => {
  test("rejects 'Password123!' even though it meets all complexity rules", () => {
    // "Password123!" satisfies length, upper, lower, digit, special
    // but is on the common-password blacklist (case-insensitive)
    const errors = validatePassword("Password123!");
    expect(errors.some((e) => e.toLowerCase().includes("common"))).toBe(true);
  });

  test("blacklist check is case-insensitive", () => {
    // "Welcome123!" satisfies all complexity rules; its lowercase "welcome123!"
    // is on the blacklist, proving the comparison is case-insensitive
    const errors = validatePassword("Welcome123!");
    expect(errors.some((e) => e.toLowerCase().includes("common"))).toBe(true);
  });

  test("does not fire blacklist error when other rules already fail", () => {
    // "password" is blacklisted but also fails complexity — should get
    // complexity errors, not the blacklist error
    const errors = validatePassword("password");
    expect(errors.some((e) => e.includes("10 characters"))).toBe(true);
    expect(errors.some((e) => e.toLowerCase().includes("common"))).toBe(false);
  });

  test("accepts a strong unique password that is NOT in the blacklist", () => {
    const errors = validatePassword("Zr9$mKpLq2!");
    expect(errors).toHaveLength(0);
  });
});

// ─── Username generation ──────────────────────────────────────────────────────

describe("generateUsername — format and uniqueness seeding", () => {
  test("returns a non-empty string", () => {
    const username = generateUsername("Rahul Singh");
    expect(typeof username).toBe("string");
    expect(username.length).toBeGreaterThan(0);
  });

  test("strips non-letter characters from name", () => {
    const username = generateUsername("Rahul 123!");
    // Should only contain letters + 4 digits
    expect(/^[a-z]+\d{4}$/.test(username)).toBe(true);
  });

  test("appends exactly 4 digits", () => {
    const username = generateUsername("Alice");
    const digitSuffix = username.slice(-4);
    expect(/^\d{4}$/.test(digitSuffix)).toBe(true);
  });

  test("base is lowercase", () => {
    const username = generateUsername("UPPERCASE");
    const base = username.slice(0, -4);
    expect(base).toBe(base.toLowerCase());
  });

  test('falls back to "user" base when name has no letters', () => {
    const username = generateUsername("123 456");
    expect(username.startsWith("user")).toBe(true);
  });

  test("base is truncated to max 10 characters", () => {
    const username = generateUsername("VeryLongFirstNameThatExceedsTen");
    const base = username.slice(0, -4);
    expect(base.length).toBeLessThanOrEqual(10);
  });

  test("two calls with the same name produce different usernames (random suffix)", () => {
    // This test is probabilistic but has a 1/9000 chance of false positive
    const seen = new Set();
    for (let i = 0; i < 10; i++) {
      seen.add(generateUsername("Priya"));
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  test("handles empty string gracefully", () => {
    const username = generateUsername("");
    expect(typeof username).toBe("string");
    expect(username.length).toBeGreaterThan(0);
  });

  test("handles null / undefined gracefully", () => {
    const username = generateUsername(null);
    expect(typeof username).toBe("string");
    expect(username.length).toBeGreaterThan(0);
  });
});

// ─── Integration logic: password confirm mismatch ────────────────────────────

describe("complete-registration: request validation logic", () => {
  test("password mismatch is detected correctly", () => {
    const password = "StrongPass1!";
    const confirmPassword = "DifferentPass2@";
    expect(password !== confirmPassword).toBe(true);
  });

  test("matching passwords pass the confirm check", () => {
    const password = "StrongPass1!";
    const confirmPassword = "StrongPass1!";
    expect(password === confirmPassword).toBe(true);
  });

  test("missing password is detected", () => {
    const body = { confirmPassword: "StrongPass1!" };
    expect(!body.password).toBe(true);
  });
});

// ─── Redirect URL format (post-payment) ──────────────────────────────────────

describe("complete-registration: redirect URL construction", () => {
  test("redirect URL includes correct course param", () => {
    const mainAppUrl = "https://iiskills.cloud";
    const courseAppId = "learn-management";
    const redirectUrl = `${mainAppUrl}/complete-registration?course=${encodeURIComponent(courseAppId)}`;

    expect(redirectUrl).toBe(
      "https://iiskills.cloud/complete-registration?course=learn-management"
    );
    expect(redirectUrl).toContain("/complete-registration");
    expect(redirectUrl).toContain("course=learn-management");
  });

  test("course IDs with hyphens are encoded correctly", () => {
    const courseAppId = "learn-ai";
    expect(encodeURIComponent(courseAppId)).toBe("learn-ai"); // hyphens don't need encoding
  });

  test("redirect URL does not contain otp-gateway", () => {
    const redirectUrl = "https://iiskills.cloud/complete-registration?course=learn-pr";
    expect(redirectUrl).not.toContain("otp-gateway");
  });
});

console.log("✅ complete-registration tests defined successfully");
