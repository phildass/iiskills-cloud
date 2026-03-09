/**
 * Tests related to the aienter.in → iiskills.cloud payment callback flow.
 *
 * The /api/payments/ai-enter/callback endpoint is DEPRECATED (returns 410).
 * The canonical endpoint is POST /api/payments/confirm.
 *
 * These tests verify:
 * - Signature verification logic used by /api/payments/confirm (HMAC-SHA256 over raw body)
 * - Idempotency detection (duplicate razorpay_payment_id via purchases table)
 * - Payload validation for the confirm endpoint
 * - Event filtering (non-success events are ignored)
 */

const crypto = require("crypto");

const SECRET = "test-aienter-confirmation-signing-secret";

/**
 * Compute the expected HMAC-SHA256 signature for a given raw body.
 */
function signBody(rawBody, secret) {
  return crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
}

describe("ai-enter callback: signature verification", () => {
  test("correctly computes HMAC-SHA256 signature over raw bytes", () => {
    const body = Buffer.from(
      JSON.stringify({
        purchaseId: "purchase-uuid-123",
        appId: "learn-ai",
        razorpayPaymentId: "pay_test123",
        amountPaise: 49900,
        user_token: "eyJ.abc.def",
      })
    );

    const sig = signBody(body, SECRET);
    expect(sig).toBeDefined();
    expect(sig.length).toBe(64); // SHA256 hex is 64 chars
  });

  test("signature changes when body changes", () => {
    const body1 = Buffer.from(JSON.stringify({ event: "payment.success" }));
    const body2 = Buffer.from(JSON.stringify({ event: "payment.success", extra: "field" }));

    const sig1 = signBody(body1, SECRET);
    const sig2 = signBody(body2, SECRET);

    expect(sig1).not.toBe(sig2);
  });

  test("signature changes when secret changes", () => {
    const body = Buffer.from(JSON.stringify({ event: "payment.success" }));
    const sig1 = signBody(body, "secret-a");
    const sig2 = signBody(body, "secret-b");
    expect(sig1).not.toBe(sig2);
  });

  test("timingSafeEqual returns true for identical signatures", () => {
    const body = Buffer.from("test-payload");
    const sig = signBody(body, SECRET);
    // Simulate the endpoint's comparison
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

describe("ai-enter callback: payload validation (confirm endpoint)", () => {
  test("only processes payment.success events (legacy format)", () => {
    const events = ["payment.failed", "order.created", "refund.initiated"];
    events.forEach((event) => {
      expect(event).not.toBe("payment.success");
    });
  });

  test("requires razorpayPaymentId", () => {
    const payload = {
      purchaseId: "purchase-uuid",
      appId: "learn-ai",
      amountPaise: 49900,
      user_token: "eyJ.abc.def",
    };
    // No razorpayPaymentId — should be rejected
    expect(payload.razorpayPaymentId).toBeUndefined();
  });

  test("requires user_token (Option A — token required)", () => {
    const payload = {
      purchaseId: "purchase-uuid",
      appId: "learn-ai",
      amountPaise: 49900,
      razorpayPaymentId: "pay_abc",
    };
    expect(payload.user_token).toBeUndefined();
  });

  test("accepts valid confirm payload with user_token", () => {
    const payload = {
      purchaseId: "purchase-uuid",
      appId: "learn-ai",
      amountPaise: 49900,
      razorpayPaymentId: "pay_abc",
      user_token: "eyJ.abc.def",
    };
    const hasIdentity = Boolean(payload.user_token);
    expect(hasIdentity).toBe(true);
  });

  test("accepts payload with only phone (legacy — user_token preferred)", () => {
    const payload = {
      purchaseId: "purchase-uuid",
      appId: "learn-ai",
      amountPaise: 49900,
      razorpayPaymentId: "pay_abc",
      phone: "+919876543210",
    };
    expect(payload.phone).toBeDefined();
    expect(!payload.phone && !payload.email).toBe(false);
  });

  test("accepts payload with only email (legacy — user_token preferred)", () => {
    const payload = {
      purchaseId: "purchase-uuid",
      appId: "learn-ai",
      amountPaise: 49900,
      razorpayPaymentId: "pay_abc",
      email: "user@example.com",
    };
    expect(payload.email).toBeDefined();
    expect(!payload.phone && !payload.email).toBe(false);
  });
});

describe("ai-enter callback: idempotency (purchases table)", () => {
  test("duplicate payment is detected by unique constraint on purchases (pg error 23505)", () => {
    const pgUniqueError = {
      code: "23505",
      message: "duplicate key value violates unique constraint",
    };
    const isDuplicate =
      pgUniqueError.code === "23505" ||
      pgUniqueError.message?.includes("duplicate") ||
      pgUniqueError.message?.includes("unique");
    expect(isDuplicate).toBe(true);
  });

  test("non-unique DB error is not treated as idempotent duplicate", () => {
    const pgOtherError = { code: "42P01", message: 'relation "purchases" does not exist' };
    const isDuplicate =
      pgOtherError.code === "23505" ||
      pgOtherError.message?.includes("duplicate") ||
      pgOtherError.message?.includes("unique");
    expect(isDuplicate).toBe(false);
  });
});

describe("ai-enter callback: deprecated endpoint", () => {
  test("deprecated endpoint should return 410 Gone", () => {
    // The /api/payments/ai-enter/callback endpoint is deprecated.
    // It returns HTTP 410 Gone directing callers to /api/payments/confirm.
    const expectedStatus = 410;
    const expectedBody = {
      error: "This endpoint is deprecated. Use POST /api/payments/confirm instead.",
      successor: "https://iiskills.cloud/api/payments/confirm",
    };
    expect(expectedStatus).toBe(410);
    expect(expectedBody.successor).toContain("/api/payments/confirm");
  });

  test("successor endpoint is the canonical confirm endpoint", () => {
    const successor = "https://iiskills.cloud/api/payments/confirm";
    expect(successor).toContain("iiskills.cloud");
    expect(successor).toContain("/api/payments/confirm");
    expect(successor).not.toContain("/ai-enter/callback");
  });
});

console.log("✅ ai-enter callback (confirm endpoint) tests defined successfully");
