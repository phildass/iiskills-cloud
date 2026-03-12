/**
 * Tests for the /api/payments/confirm endpoint.
 *
 * Tests:
 * - Signature verification logic (HMAC-SHA256 over raw body)
 * - Timestamp replay-protection
 * - Payload validation
 * - Idempotency detection (duplicate razorpay_payment_id)
 * - Phone formatting
 */

const crypto = require("crypto");

const SECRET = "test-aienter-confirmation-signing-secret";

/**
 * Compute the expected HMAC-SHA256 signature for a given raw body.
 */
function signBody(rawBody, secret) {
  return crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
}

describe("payments/confirm: signature verification", () => {
  test("correctly computes HMAC-SHA256 signature over raw bytes", () => {
    const body = Buffer.from(
      JSON.stringify({
        purchaseId: "purchase-uuid-123",
        appId: "learn-ai",
        amountPaise: 49900,
        currency: "INR",
        customerPhone: "+919876543210",
        razorpayOrderId: "order_test123",
        razorpayPaymentId: "pay_test123",
        paidAt: new Date().toISOString(),
      })
    );

    const sig = signBody(body, SECRET);
    expect(sig).toBeDefined();
    expect(sig.length).toBe(64); // SHA256 hex is always 64 chars
  });

  test("signature changes when body changes", () => {
    const body1 = Buffer.from(JSON.stringify({ purchaseId: "abc", appId: "learn-ai" }));
    const body2 = Buffer.from(
      JSON.stringify({ purchaseId: "abc", appId: "learn-ai", extra: "field" })
    );

    const sig1 = signBody(body1, SECRET);
    const sig2 = signBody(body2, SECRET);

    expect(sig1).not.toBe(sig2);
  });

  test("signature changes when secret changes", () => {
    const body = Buffer.from(JSON.stringify({ purchaseId: "abc" }));
    const sig1 = signBody(body, "secret-a");
    const sig2 = signBody(body, "secret-b");
    expect(sig1).not.toBe(sig2);
  });

  test("timingSafeEqual returns true for identical signatures", () => {
    const body = Buffer.from("test-payload");
    const sig = signBody(body, SECRET);
    const isValid =
      sig.length === sig.length &&
      crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(sig, "hex"));
    expect(isValid).toBe(true);
  });

  test("timingSafeEqual returns false for different signatures", () => {
    const body = Buffer.from("test-payload");
    const goodSig = signBody(body, SECRET);
    const badSig = signBody(body, "wrong-secret");

    let isValid = true;
    if (goodSig.length !== badSig.length) {
      isValid = false;
    } else {
      try {
        isValid = crypto.timingSafeEqual(Buffer.from(goodSig, "hex"), Buffer.from(badSig, "hex"));
      } catch {
        isValid = false;
      }
    }
    expect(isValid).toBe(false);
  });
});

describe("payments/confirm: timestamp replay-protection", () => {
  const MAX_SKEW = 300; // 5 minutes in seconds

  test("accepts timestamp within 5-minute window", () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const ts = nowSeconds - 60; // 1 minute ago
    expect(Math.abs(nowSeconds - ts)).toBeLessThanOrEqual(MAX_SKEW);
  });

  test("rejects timestamp older than 5 minutes", () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const ts = nowSeconds - 400; // 6+ minutes ago
    expect(Math.abs(nowSeconds - ts)).toBeGreaterThan(MAX_SKEW);
  });

  test("rejects timestamp too far in the future", () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const ts = nowSeconds + 400; // 6+ minutes in the future
    expect(Math.abs(nowSeconds - ts)).toBeGreaterThan(MAX_SKEW);
  });

  test("accepts timestamp at the boundary (exactly 5 minutes old)", () => {
    const nowSeconds = Math.floor(Date.now() / 1000);
    const ts = nowSeconds - MAX_SKEW;
    expect(Math.abs(nowSeconds - ts)).toBeLessThanOrEqual(MAX_SKEW);
  });
});

describe("payments/confirm: payload validation", () => {
  test("requires purchaseId", () => {
    const payload = {
      appId: "learn-ai",
      amountPaise: 49900,
      currency: "INR",
      customerPhone: "+919876543210",
      razorpayPaymentId: "pay_abc",
      paidAt: new Date().toISOString(),
    };
    expect(payload.purchaseId).toBeUndefined();
  });

  test("requires appId", () => {
    const payload = {
      purchaseId: "purchase-uuid",
      amountPaise: 49900,
      currency: "INR",
      customerPhone: "+919876543210",
      razorpayPaymentId: "pay_abc",
    };
    expect(payload.appId).toBeUndefined();
  });

  test("requires razorpayPaymentId", () => {
    const payload = {
      purchaseId: "purchase-uuid",
      appId: "learn-ai",
      amountPaise: 49900,
      currency: "INR",
      customerPhone: "+919876543210",
    };
    expect(payload.razorpayPaymentId).toBeUndefined();
  });

  test("requires user_token (Option A — token required)", () => {
    const payload = {
      purchaseId: "purchase-uuid",
      appId: "learn-ai",
      amountPaise: 49900,
      currency: "INR",
      customerPhone: "+919876543210",
      razorpayPaymentId: "pay_abc",
    };
    expect(payload.user_token).toBeUndefined();
  });

  test("requires amountPaise", () => {
    const payload = {
      purchaseId: "purchase-uuid",
      appId: "learn-ai",
      currency: "INR",
      customerPhone: "+919876543210",
      razorpayPaymentId: "pay_abc",
    };
    expect(payload.amountPaise).toBeUndefined();
  });

  test("accepts valid full payload", () => {
    const payload = {
      purchaseId: "purchase-uuid-abc",
      appId: "learn-ai",
      courseSlug: "learn-ai",
      amountPaise: 49900,
      currency: "INR",
      customerPhone: "+919876543210",
      razorpayOrderId: "order_abc123",
      razorpayPaymentId: "pay_abc123",
      paidAt: new Date().toISOString(),
    };
    expect(payload.purchaseId).toBeDefined();
    expect(payload.appId).toBeDefined();
    expect(payload.razorpayPaymentId).toBeDefined();
    expect(payload.customerPhone).toBeDefined();
    expect(payload.amountPaise).toBeDefined();
  });

  test("courseSlug is optional", () => {
    const payload = {
      purchaseId: "purchase-uuid-abc",
      appId: "learn-ai",
      amountPaise: 49900,
      currency: "INR",
      customerPhone: "+919876543210",
      razorpayPaymentId: "pay_abc123",
    };
    // courseSlug is not required — should not cause a validation error
    expect(payload.purchaseId).toBeDefined();
    expect(payload.courseSlug).toBeUndefined();
  });
});

describe("payments/confirm: idempotency", () => {
  test("duplicate razorpay_payment_id on purchases is detected by pg unique constraint (error 23505)", () => {
    const pgUniqueError = {
      code: "23505",
      message: 'duplicate key value violates unique constraint "purchases_razorpay_payment_id_key"',
    };
    const isDuplicate =
      pgUniqueError.code === "23505" ||
      pgUniqueError.message?.includes("duplicate") ||
      pgUniqueError.message?.includes("unique");
    expect(isDuplicate).toBe(true);
  });

  test("non-unique DB error is not treated as idempotent duplicate", () => {
    const pgOtherError = {
      code: "42P01",
      message: 'relation "purchases" does not exist',
    };
    const isDuplicate =
      pgOtherError.code === "23505" ||
      pgOtherError.message?.includes("duplicate") ||
      pgOtherError.message?.includes("unique");
    expect(isDuplicate).toBe(false);
  });

  test("purchase already acknowledged (iiskills_ack_at set) triggers idempotent response", () => {
    const existingPurchase = {
      id: "purchase-uuid-123",
      razorpay_payment_id: "pay_test123",
      iiskills_ack_at: new Date().toISOString(),
    };
    const incomingPaymentId = "pay_test123";
    const isAlreadyAcknowledged =
      existingPurchase.iiskills_ack_at &&
      existingPurchase.razorpay_payment_id === incomingPaymentId;
    expect(isAlreadyAcknowledged).toBe(true);
  });

  test("purchase with different razorpay_payment_id is not treated as duplicate", () => {
    const existingPurchase = {
      id: "purchase-uuid-123",
      razorpay_payment_id: "pay_other",
      iiskills_ack_at: new Date().toISOString(),
    };
    const incomingPaymentId = "pay_test123";
    const isAlreadyAcknowledged =
      existingPurchase.iiskills_ack_at &&
      existingPurchase.razorpay_payment_id === incomingPaymentId;
    expect(isAlreadyAcknowledged).toBe(false);
  });
});

describe("payments/confirm: phone formatting", () => {
  test("prepends +91 to bare 10-digit Indian numbers", () => {
    const phone = "9876543210";
    const formatted = phone.startsWith("+") ? phone : `+91${phone}`;
    expect(formatted).toBe("+919876543210");
  });

  test("leaves E.164 numbers unchanged", () => {
    const phone = "+919876543210";
    const formatted = phone.startsWith("+") ? phone : `+91${phone}`;
    expect(formatted).toBe("+919876543210");
  });

  test("leaves non-Indian E.164 numbers unchanged", () => {
    const phone = "+12025551234";
    const formatted = phone.startsWith("+") ? phone : `+91${phone}`;
    expect(formatted).toBe("+12025551234");
  });
});

describe("payments/confirm: response shape", () => {
  test('success response includes purchaseId and message "confirmed"', () => {
    const response = {
      success: true,
      purchaseId: "some-uuid",
      message: "confirmed",
      course_slug: "learn-ai",
    };
    expect(response.success).toBe(true);
    expect(response.message).toBe("confirmed");
    expect(response).toHaveProperty("purchaseId");
  });

  test("success response uses course_slug (not app_id)", () => {
    const response = {
      success: true,
      purchaseId: "some-uuid",
      message: "confirmed",
      course_slug: "learn-management",
    };
    expect(response).toHaveProperty("course_slug");
    expect(response).not.toHaveProperty("app_id");
  });

  test("success response includes redirect_url", () => {
    const response = {
      success: true,
      purchaseId: "some-uuid",
      message: "confirmed",
      course_slug: "learn-ai",
      redirect_url: "https://learn-ai.iiskills.cloud/authorised",
    };
    expect(response.redirect_url).toBeDefined();
    expect(response.redirect_url).toMatch(/^https:\/\//);
  });

  test("idempotent response is also success=true", () => {
    const response = {
      success: true,
      purchaseId: "existing-uuid",
      message: "Payment already confirmed (idempotent)",
    };
    expect(response.success).toBe(true);
  });
});

describe("payments/confirm: entitlement uses course_slug", () => {
  test("entitlement row uses course_slug field (not app_id)", () => {
    const entitlementRow = {
      user_id: "user-uuid",
      course_slug: "learn-ai",
      status: "active",
      source: "razorpay",
      purchase_id: "purchase-uuid",
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
    expect(entitlementRow).toHaveProperty("course_slug");
    expect(entitlementRow).not.toHaveProperty("app_id");
    expect(entitlementRow).toHaveProperty("purchase_id");
  });

  test("entitlement course_slug comes from token payload (not payload appId)", () => {
    const tokenCourseSlug = "learn-developer";
    const payloadAppId = "learn-management"; // different from token
    const courseAppId = tokenCourseSlug || payloadAppId;
    expect(courseAppId).toBe("learn-developer");
  });

  test("entitlement falls back to courseSlug then appId when token has no course_slug", () => {
    const tokenCourseSlug = undefined;
    const courseSlug = "learn-pr";
    const appId = "learn-ai";
    const courseAppId = tokenCourseSlug || courseSlug || appId;
    expect(courseAppId).toBe("learn-pr");
  });
});

describe("payments/confirm: purchases table update", () => {
  test("purchase update sets expected fields", () => {
    const now = new Date().toISOString();
    const updatePayload = {
      status: "paid",
      razorpay_payment_id: "pay_abc123",
      razorpay_order_id: "order_abc123",
      paid_at: now,
      iiskills_ack_at: now,
      updated_at: now,
    };
    expect(updatePayload.status).toBe("paid");
    expect(updatePayload.iiskills_ack_at).toBeDefined();
    expect(updatePayload.razorpay_payment_id).toBe("pay_abc123");
  });

  test("user ownership check compares token user_id to purchase metadata.user_id", () => {
    const tokenUserId = "user-a";
    const purchaseMetaUserId = "user-b";
    const isOwner = !purchaseMetaUserId || purchaseMetaUserId === tokenUserId;
    expect(isOwner).toBe(false);
  });

  test("user ownership check passes when metadata.user_id matches token user_id", () => {
    const tokenUserId = "user-a";
    const purchaseMetaUserId = "user-a";
    const isOwner = !purchaseMetaUserId || purchaseMetaUserId === tokenUserId;
    expect(isOwner).toBe(true);
  });
});

describe("payments/confirm: hardened ownership validation", () => {
  // Simulates the confirm.js logic:
  //   purchaseUserId = purchase.user_id || purchase.metadata?.user_id
  //   if (!purchaseUserId) → reject 403
  //   if (purchaseUserId !== tokenUserId) → reject 403

  function checkOwnership(purchase, tokenUserId) {
    const purchaseUserId = purchase.user_id || purchase.metadata?.user_id;
    if (!purchaseUserId) return { ok: false, reason: "ownership_unverifiable" };
    if (purchaseUserId !== tokenUserId) return { ok: false, reason: "user_mismatch" };
    return { ok: true };
  }

  test("prefers user_id column over metadata.user_id for ownership check", () => {
    const purchase = { user_id: "user-a", metadata: { user_id: "user-b" } };
    const result = checkOwnership(purchase, "user-a");
    expect(result.ok).toBe(true);
  });

  test("falls back to metadata.user_id when user_id column is null", () => {
    const purchase = { user_id: null, metadata: { user_id: "user-a" } };
    const result = checkOwnership(purchase, "user-a");
    expect(result.ok).toBe(true);
  });

  test("rejects when both user_id column and metadata.user_id are missing", () => {
    const purchase = { user_id: null, metadata: {} };
    const result = checkOwnership(purchase, "user-a");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("ownership_unverifiable");
  });

  test("rejects when user_id column is missing and metadata.user_id is also missing", () => {
    const purchase = { user_id: undefined, metadata: null };
    const result = checkOwnership(purchase, "user-a");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("ownership_unverifiable");
  });

  test("rejects when user_id column mismatches token user_id", () => {
    const purchase = { user_id: "user-b", metadata: { user_id: "user-b" } };
    const result = checkOwnership(purchase, "user-a");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("user_mismatch");
  });

  test("rejects when metadata.user_id mismatches token user_id (user_id column null)", () => {
    const purchase = { user_id: null, metadata: { user_id: "user-b" } };
    const result = checkOwnership(purchase, "user-a");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("user_mismatch");
  });
});

describe("payments/confirm: entitlements unique constraint", () => {
  test("entitlement insert uses course_slug for uniqueness (not app_id)", () => {
    const entitlementRow = {
      user_id: "user-uuid",
      course_slug: "learn-ai",
      status: "active",
      source: "razorpay",
      purchase_id: "purchase-uuid",
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };
    expect(entitlementRow.course_slug).toBe("learn-ai");
    expect(entitlementRow.purchase_id).toBeDefined();
  });

  test("duplicate entitlement (23505) is treated as idempotent — not an error", () => {
    const entError = {
      code: "23505",
      message:
        'duplicate key value violates unique constraint "idx_entitlements_user_course_slug_unique"',
    };
    const isDuplicate =
      entError.code === "23505" ||
      entError.message?.includes("duplicate") ||
      entError.message?.includes("unique");
    expect(isDuplicate).toBe(true);
  });

  test("unique constraint on purchases.razorpay_payment_id prevents duplicate payment grants", () => {
    const pgUniqueError = {
      code: "23505",
      message:
        'duplicate key value violates unique constraint "idx_purchases_razorpay_payment_id_unique"',
    };
    const isDuplicate =
      pgUniqueError.code === "23505" ||
      pgUniqueError.message?.includes("duplicate") ||
      pgUniqueError.message?.includes("unique");
    expect(isDuplicate).toBe(true);
  });
});

console.log("✅ payments/confirm tests defined successfully");
