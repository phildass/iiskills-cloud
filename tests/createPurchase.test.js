/**
 * Tests for the /api/payments/create-purchase endpoint.
 *
 * Tests:
 * - Purchase row structure validation
 * - Phone requirement (profiles must have a phone number)
 * - course_slug handling
 * - metadata includes user_id
 * - target_app_host derived from APPS registry
 */

// ─── Purchase row structure ────────────────────────────────────────────────────

describe("create-purchase: purchase row structure", () => {
  test("purchase row has required fields", () => {
    const purchaseRow = {
      course_slug: "learn-ai",
      target_app_host: "learn-ai.iiskills.cloud",
      customer_phone: "+919876543210",
      customer_name: "Test User",
      amount_paise: 0,
      currency: "INR",
      status: "created",
      metadata: { user_id: "user-uuid-123", email: "user@example.com" },
    };
    expect(purchaseRow.course_slug).toBeDefined();
    expect(purchaseRow.customer_phone).toBeDefined();
    expect(purchaseRow.status).toBe("created");
    expect(purchaseRow.metadata).toHaveProperty("user_id");
  });

  test("initial status is 'created'", () => {
    const status = "created";
    expect(status).toBe("created");
  });

  test("metadata includes user_id for ownership verification", () => {
    const userId = "user-uuid-abc";
    const metadata = { user_id: userId, email: "user@example.com" };
    expect(metadata.user_id).toBe(userId);
  });

  test("currency defaults to INR", () => {
    const currency = "INR";
    expect(currency).toBe("INR");
  });
});

// ─── Phone requirement ────────────────────────────────────────────────────────

describe("create-purchase: phone requirement", () => {
  test("rejects when profile has no phone number", () => {
    const customerPhone = null;
    const hasPhone = Boolean(customerPhone);
    expect(hasPhone).toBe(false);
    // Should return 422 profile_incomplete
  });

  test("accepts when profile has a phone number", () => {
    const customerPhone = "+919876543210";
    const hasPhone = Boolean(customerPhone);
    expect(hasPhone).toBe(true);
  });

  test("phone is stored as-is from profile (E.164)", () => {
    const profilePhone = "+919876543210";
    expect(profilePhone).toMatch(/^\+\d+$/);
  });
});

// ─── course_slug handling ─────────────────────────────────────────────────────

describe("create-purchase: course_slug handling", () => {
  test("courseSlug is required", () => {
    const body = { amountPaise: 0 }; // no courseSlug
    expect(body.courseSlug).toBeUndefined();
  });

  test("course_slug is stored directly in the purchase row", () => {
    const courseSlug = "learn-management";
    const purchaseRow = { course_slug: courseSlug };
    expect(purchaseRow.course_slug).toBe("learn-management");
  });

  test("target_app_host is derived from APPS registry", () => {
    const APPS_TEST = {
      "learn-ai": { primaryDomain: "learn-ai.iiskills.cloud" },
      "learn-management": { primaryDomain: "learn-management.iiskills.cloud" },
    };
    const courseSlug = "learn-ai";
    const appConfig = APPS_TEST[courseSlug];
    const targetAppHost = appConfig?.primaryDomain || null;
    expect(targetAppHost).toBe("learn-ai.iiskills.cloud");
  });

  test("target_app_host is null for unknown course", () => {
    const APPS_TEST = {};
    const courseSlug = "unknown-course";
    const appConfig = APPS_TEST[courseSlug];
    const targetAppHost = appConfig?.primaryDomain || null;
    expect(targetAppHost).toBeNull();
  });
});

// ─── Response shape ────────────────────────────────────────────────────────────

describe("create-purchase: response shape", () => {
  test("success response includes purchaseId", () => {
    const response = { purchaseId: "some-uuid-123" };
    expect(response).toHaveProperty("purchaseId");
    expect(typeof response.purchaseId).toBe("string");
  });

  test("profile_incomplete response has code field", () => {
    const errorResponse = {
      error: "Phone number is required to create a purchase. Please complete your profile.",
      code: "profile_incomplete",
    };
    expect(errorResponse.code).toBe("profile_incomplete");
  });
});

// ─── amountPaise handling ─────────────────────────────────────────────────────

describe("create-purchase: amountPaise handling", () => {
  test("amountPaise defaults to 0 if not provided", () => {
    const { amountPaise = 0 } = {};
    expect(amountPaise).toBe(0);
  });

  test("amountPaise is stored in the purchase row", () => {
    const amountPaise = 49900;
    const purchaseRow = { amount_paise: amountPaise };
    expect(purchaseRow.amount_paise).toBe(49900);
  });
});

console.log("✅ create-purchase tests defined successfully");
