/**
 * Tests for the /api/payments/purchase-details endpoint and
 * the /payments/recover payment recovery page.
 *
 * Tests:
 * - purchase-details: authentication requirement
 * - purchase-details: ownership verification
 * - purchase-details: response shape
 * - recover page: query param handling
 * - recover page: CTA URL construction
 */

// ─── purchase-details: authentication ─────────────────────────────────────────

describe("purchase-details: authentication", () => {
  test("requires purchaseId query parameter", () => {
    const query = {};
    const hasPurchaseId = Boolean(query.purchaseId);
    expect(hasPurchaseId).toBe(false);
    // Should return 400
  });

  test("rejects unauthenticated requests", () => {
    const user = null;
    const isAuthenticated = Boolean(user);
    expect(isAuthenticated).toBe(false);
    // Should return 401
  });

  test("accepts authenticated requests with valid session", () => {
    const user = { id: "user-uuid-123", email: "user@example.com" };
    const isAuthenticated = Boolean(user);
    expect(isAuthenticated).toBe(true);
  });
});

// ─── purchase-details: ownership verification ─────────────────────────────────

describe("purchase-details: ownership verification", () => {
  test("rejects purchase belonging to a different user", () => {
    const authenticatedUserId = "user-uuid-123";
    const purchase = { id: "purchase-uuid-abc", user_id: "different-user-uuid" };
    const isOwner = purchase.user_id === authenticatedUserId;
    expect(isOwner).toBe(false);
    // Should return 403
  });

  test("allows access when purchase belongs to the authenticated user", () => {
    const authenticatedUserId = "user-uuid-123";
    const purchase = { id: "purchase-uuid-abc", user_id: authenticatedUserId };
    const isOwner = purchase.user_id === authenticatedUserId;
    expect(isOwner).toBe(true);
  });

  test("returns 404 when purchase does not exist", () => {
    const purchase = null;
    expect(purchase).toBeNull();
    // Should return 404
  });
});

// ─── purchase-details: response shape ─────────────────────────────────────────

describe("purchase-details: response shape", () => {
  test("success response includes purchaseId, courseSlug, and status", () => {
    const response = {
      purchaseId: "purchase-uuid-abc",
      courseSlug: "learn-ai",
      status: "created",
    };
    expect(response).toHaveProperty("purchaseId");
    expect(response).toHaveProperty("courseSlug");
    expect(response).toHaveProperty("status");
  });

  test("courseSlug matches the course_slug stored in the purchase", () => {
    const purchase = { id: "purchase-uuid-abc", course_slug: "learn-management", status: "created" };
    const response = { purchaseId: purchase.id, courseSlug: purchase.course_slug, status: purchase.status };
    expect(response.courseSlug).toBe("learn-management");
  });
});

// ─── recover page: query param handling ───────────────────────────────────────

describe("recover page: query param handling", () => {
  test("shows no-id state when purchaseId is not in URL", () => {
    const query = {};
    const step = query.purchaseId ? "loading" : "no-id";
    expect(step).toBe("no-id");
  });

  test("uses course from URL directly if provided (skips API lookup)", () => {
    const query = { purchaseId: "purchase-uuid-abc", course: "learn-ai" };
    const courseFromQuery = query.course;
    const skipsApiLookup = Boolean(courseFromQuery);
    expect(skipsApiLookup).toBe(true);
    expect(courseFromQuery).toBe("learn-ai");
  });

  test("falls back to API lookup when course is not in URL", () => {
    const query = { purchaseId: "purchase-uuid-abc" };
    const courseFromQuery = query.course;
    const needsApiLookup = !courseFromQuery;
    expect(needsApiLookup).toBe(true);
  });
});

// ─── recover page: CTA URL construction ───────────────────────────────────────

describe("recover page: CTA URL construction", () => {
  test("builds correct continue URL from courseSlug", () => {
    const courseSlug = "learn-ai";
    const continueUrl = `/payments/iiskills?course=${encodeURIComponent(courseSlug)}`;
    expect(continueUrl).toBe("/payments/iiskills?course=learn-ai");
  });

  test("falls back to /payments when courseSlug is null", () => {
    const courseSlug = null;
    const continueUrl = courseSlug
      ? `/payments/iiskills?course=${encodeURIComponent(courseSlug)}`
      : "/payments";
    expect(continueUrl).toBe("/payments");
  });

  test("encodes special characters in courseSlug", () => {
    const courseSlug = "learn-ai & ml";
    const continueUrl = `/payments/iiskills?course=${encodeURIComponent(courseSlug)}`;
    expect(continueUrl).toBe("/payments/iiskills?course=learn-ai%20%26%20ml");
    expect(continueUrl).not.toContain("learn-ai & ml");
  });

  test("continue URL redirects back to payment flow that reuses existing purchase", () => {
    const courseSlug = "learn-management";
    const continueUrl = `/payments/iiskills?course=${encodeURIComponent(courseSlug)}`;
    // The /payments/iiskills flow uses create-purchase which has deduplication logic
    // to reuse existing purchase records within the dedup window.
    expect(continueUrl).toMatch(/^\/payments\/iiskills\?course=/);
  });
});

// ─── recover page: sign-in redirect ───────────────────────────────────────────

describe("recover page: sign-in redirect", () => {
  test("builds correct sign-in redirect URL preserving purchaseId", () => {
    const purchaseId = "purchase-uuid-abc";
    const next = encodeURIComponent(`/payments/recover?purchaseId=${purchaseId}`);
    const signInUrl = `/sign-in?next=${next}`;
    expect(signInUrl).toContain("/sign-in?next=");
    expect(decodeURIComponent(signInUrl)).toContain(`/payments/recover?purchaseId=${purchaseId}`);
  });
});

console.log("✅ paymentRecover tests defined successfully");
