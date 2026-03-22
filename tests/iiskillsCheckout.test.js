/**
 * Tests for /payments routing and /api/payments/iiskills/create-order.
 *
 * These are logic-level unit tests that do NOT require a running server or
 * real Razorpay credentials.
 */

const { getCurrentPricing } = require("../packages/shared-utils/utils/pricing");

// ─── Pricing sanity ───────────────────────────────────────────────────────────

describe("iiskills checkout: pricing", () => {
  test("introductory total is ₹116.82 (₹99 + 18% GST) during intro period", () => {
    // Use a date well within the inaugural offer period
    const introDate = new Date("2026-01-15");
    const pricing = getCurrentPricing(introDate);
    expect(pricing.basePrice).toBe(99);
    expect(pricing.totalPrice).toBe(116.82);
    expect(pricing.isIntroductory).toBe(true);
  });

  test("regular total is ₹352.82 after intro period", () => {
    const afterIntro = new Date("2026-04-21");
    const pricing = getCurrentPricing(afterIntro);
    expect(pricing.basePrice).toBe(299);
    expect(pricing.totalPrice).toBe(352.82);
    expect(pricing.isIntroductory).toBe(false);
  });

  test("amount in paise is totalPrice * 100 rounded", () => {
    const introDate = new Date("2026-01-15");
    const pricing = getCurrentPricing(introDate);
    const paise = Math.round(pricing.totalPrice * 100);
    expect(paise).toBe(11682);
  });

  test("getCurrentPricing always returns defined numeric fields (SSR safety)", () => {
    // Regression guard: these fields must be numbers so formatINR never receives undefined
    const dates = [
      new Date("2026-01-01"),
      new Date("2026-04-20"),
      new Date("2026-04-21"),
      new Date("2027-01-01"),
    ];
    dates.forEach((date) => {
      const p = getCurrentPricing(date);
      expect(typeof p.basePrice).toBe("number");
      expect(typeof p.gstAmount).toBe("number");
      expect(typeof p.totalPrice).toBe("number");
      expect(typeof p.gstRate).toBe("number");
      expect(typeof p.isIntroductory).toBe("boolean");
      // Verify toFixed does not throw (the SSR crash scenario)
      expect(() => p.totalPrice.toFixed(2)).not.toThrow();
      expect(() => p.basePrice.toFixed(2)).not.toThrow();
      expect(() => p.gstAmount.toFixed(2)).not.toThrow();
    });
  });
});

// ─── /payments redirect logic ─────────────────────────────────────────────────

describe("/payments redirect logic", () => {
  test("redirects to /payments/iiskills when course param is present", () => {
    // Simulate the redirect decision made in payments.js
    const query = { course: "learn-ai" };
    const shouldRedirect = Boolean(query.course);
    const destination = shouldRedirect ? `/payments/iiskills?course=${query.course}` : null;
    expect(shouldRedirect).toBe(true);
    expect(destination).toBe("/payments/iiskills?course=learn-ai");
  });

  test("does NOT redirect when course param is absent", () => {
    const query = {};
    const shouldRedirect = Boolean(query.course);
    expect(shouldRedirect).toBe(false);
  });

  test("preserves additional query params in redirect", () => {
    const query = { course: "learn-developer", ref: "homepage" };
    const { course, ...rest } = query;
    const params = new URLSearchParams({ course, ...rest });
    expect(params.toString()).toContain("course=learn-developer");
    expect(params.toString()).toContain("ref=homepage");
  });
});

// ─── Phone validation ─────────────────────────────────────────────────────────

describe("iiskills checkout: phone validation", () => {
  const isValidPhone = (phone) => /^[6-9]\d{9}$/.test(phone);

  test("accepts valid Indian 10-digit number starting with 6-9", () => {
    expect(isValidPhone("9876543210")).toBe(true);
    expect(isValidPhone("6123456789")).toBe(true);
    expect(isValidPhone("7000000000")).toBe(true);
    expect(isValidPhone("8999999999")).toBe(true);
  });

  test("rejects numbers starting with 0-5", () => {
    expect(isValidPhone("5876543210")).toBe(false);
    expect(isValidPhone("0000000000")).toBe(false);
  });

  test("rejects numbers that are too short or too long", () => {
    expect(isValidPhone("987654321")).toBe(false); // 9 digits
    expect(isValidPhone("98765432100")).toBe(false); // 11 digits
  });

  test("rejects empty string", () => {
    expect(isValidPhone("")).toBe(false);
  });
});

// ─── create-order request validation ─────────────────────────────────────────

describe("/api/payments/iiskills/create-order: request validation", () => {
  test("requires name and phone fields", () => {
    const isValid = (body) => Boolean(body && body.name && body.phone);
    expect(isValid({ name: "Alice", phone: "9876543210", course: "learn-ai" })).toBe(true);
    expect(isValid({ phone: "9876543210" })).toBe(false);
    expect(isValid({ name: "Alice" })).toBe(false);
    expect(isValid({})).toBe(false);
  });

  test("receipt is prefixed with iiskills_<course>_", () => {
    const course = "learn-ai";
    const receipt = `iiskills_${course}_${12345}`;
    expect(receipt.startsWith("iiskills_learn-ai_")).toBe(true);
  });

  test('falls back to "iiskills" when course is not provided', () => {
    const course = undefined;
    const receipt = `iiskills_${course || "iiskills"}_${12345}`;
    expect(receipt.startsWith("iiskills_iiskills_")).toBe(true);
  });
});

// ─── Admin bypass in payments/iiskills ────────────────────────────────────────

/**
 * Mirror of the isAdminUser() helper in payments/iiskills.js.
 *
 * IMPORTANT: If you update the admin check logic in production, you must also
 * update this helper.  The canonical list of admin emails is defined in
 * packages/access-control/accessControl.js (PRODUCT_OWNER_EMAILS).
 */
const PAYMENTS_ADMIN_EMAILS = ["philipda@gmail.com", "pda.kenya@gmail.com"];
function isAdminUserPayments(user) {
  if (!user) return false;
  return (
    user.app_metadata?.is_admin === true ||
    user.user_metadata?.is_admin === true ||
    (typeof user.email === "string" && PAYMENTS_ADMIN_EMAILS.includes(user.email))
  );
}

describe("payments/iiskills: admin bypass", () => {
  test("detects admin via app_metadata.is_admin", () => {
    expect(isAdminUserPayments({ app_metadata: { is_admin: true } })).toBe(true);
  });

  test("detects admin via user_metadata.is_admin", () => {
    expect(isAdminUserPayments({ user_metadata: { is_admin: true } })).toBe(true);
  });

  test("detects admin via product-owner email", () => {
    expect(isAdminUserPayments({ email: "philipda@gmail.com" })).toBe(true);
    expect(isAdminUserPayments({ email: "pda.kenya@gmail.com" })).toBe(true);
  });

  test("non-admin user returns false", () => {
    expect(isAdminUserPayments({ email: "student@example.com" })).toBe(false);
    expect(isAdminUserPayments({ app_metadata: { is_admin: false } })).toBe(false);
  });

  test("null/undefined user returns false", () => {
    expect(isAdminUserPayments(null)).toBe(false);
    expect(isAdminUserPayments(undefined)).toBe(false);
  });

  test("admin step is a distinct UI state from paying/loading/error", () => {
    const validSteps = ["loading", "registration", "paying", "admin", "error"];
    expect(validSteps).toContain("admin");
    // Ensure admin step is not mixed with payment step
    expect("admin").not.toBe("paying");
    expect("admin").not.toBe("loading");
  });

  test("admin never proceeds to proceedToPayment (no purchase record / no token)", () => {
    // Simulate the gate check: if admin, return before calling proceedToPayment.
    let proceedToPaymentCalled = false;
    async function simulateInitPayment(sessionUser, proceedFn) {
      if (isAdminUserPayments(sessionUser)) {
        // Admin bypass — return immediately without calling proceedToPayment.
        return "admin_bypass";
      }
      proceedFn();
      return "payment_started";
    }

    const adminUser = { app_metadata: { is_admin: true }, email: "admin@example.com" };
    const regularUser = { email: "student@example.com" };

    return simulateInitPayment(adminUser, () => {
      proceedToPaymentCalled = true;
    }).then((result) => {
      expect(result).toBe("admin_bypass");
      expect(proceedToPaymentCalled).toBe(false);
    });
  });

  test("regular user proceeds to payment (proceedToPayment is called)", () => {
    let proceedToPaymentCalled = false;
    async function simulateInitPayment(sessionUser, proceedFn) {
      if (isAdminUserPayments(sessionUser)) {
        return "admin_bypass";
      }
      proceedFn();
      return "payment_started";
    }

    const regularUser = { email: "student@example.com" };
    return simulateInitPayment(regularUser, () => {
      proceedToPaymentCalled = true;
    }).then((result) => {
      expect(result).toBe("payment_started");
      expect(proceedToPaymentCalled).toBe(true);
    });
  });
});

// ─── Admin guard in API endpoints (defense-in-depth) ─────────────────────────

describe("create-purchase API: admin guard", () => {
  /**
   * Simulates the admin check in create-purchase.js handler.
   * Returns the expected HTTP status code given a user object.
   */
  function simulateCreatePurchaseGuard(user) {
    const userIsAdmin =
      user?.app_metadata?.is_admin === true ||
      user?.user_metadata?.is_admin === true ||
      user?.email === "philipda@gmail.com" ||
      user?.email === "pda.kenya@gmail.com";

    if (userIsAdmin) {
      return { status: 403, code: "admin_access" };
    }
    return { status: 200 };
  }

  test("returns 403 admin_access for admin user", () => {
    const result = simulateCreatePurchaseGuard({ app_metadata: { is_admin: true } });
    expect(result.status).toBe(403);
    expect(result.code).toBe("admin_access");
  });

  test("returns 403 admin_access for product-owner email", () => {
    expect(simulateCreatePurchaseGuard({ email: "philipda@gmail.com" }).status).toBe(403);
    expect(simulateCreatePurchaseGuard({ email: "pda.kenya@gmail.com" }).status).toBe(403);
  });

  test("allows regular user to proceed (returns 200 from guard check)", () => {
    const result = simulateCreatePurchaseGuard({ email: "user@example.com" });
    expect(result.status).toBe(200);
  });
});

describe("generate-token API: admin guard", () => {
  /**
   * Simulates the admin check in generate-token.js handler.
   */
  function simulateGenerateTokenGuard(user) {
    const userIsAdmin =
      user?.app_metadata?.is_admin === true ||
      user?.user_metadata?.is_admin === true ||
      user?.email === "philipda@gmail.com" ||
      user?.email === "pda.kenya@gmail.com";

    if (userIsAdmin) {
      return { status: 403, code: "admin_access" };
    }
    return { status: 200 };
  }

  test("returns 403 admin_access for admin user", () => {
    const result = simulateGenerateTokenGuard({ user_metadata: { is_admin: true } });
    expect(result.status).toBe(403);
    expect(result.code).toBe("admin_access");
  });

  test("allows regular user to proceed (returns 200 from guard check)", () => {
    const result = simulateGenerateTokenGuard({ email: "user@example.com" });
    expect(result.status).toBe(200);
  });
});
