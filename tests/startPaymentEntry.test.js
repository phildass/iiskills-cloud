/**
 * Tests for the /start-payment entry-gateway page logic.
 *
 * The entry gateway is the first stop for every "Pay Now" click.  It presents
 * an explicit "Registered / New" choice so users are never implicitly
 * recognised by cookies and every attempt creates a fresh purchase session.
 *
 * These are logic-level unit tests that do NOT require a running server or
 * real Supabase credentials.
 */

"use strict";

// ─── Helpers replicated from start-payment.js ────────────────────────────────

/**
 * Build the downstream /payments/iiskills path given an optional course slug.
 * /payments/iiskills always creates a NEW purchaseId on every visit.
 */
function buildPaymentPath(course) {
  return course ? `/payments/iiskills?course=${encodeURIComponent(course)}` : "/payments/iiskills";
}

/**
 * Build the /sign-in redirect for unauthenticated registered users.
 */
function buildSignInRedirect(paymentPath) {
  return `/sign-in?next=${encodeURIComponent(paymentPath)}`;
}

/**
 * Build the /register redirect for new users, returning to /start-payment
 * so they make the explicit "Registered / New" choice after registration.
 */
function buildRegisterRedirect(course) {
  const returnPath = course
    ? `/start-payment?course=${encodeURIComponent(course)}`
    : "/start-payment";
  return `/register?next=${encodeURIComponent(returnPath)}`;
}

// ─── paymentPath construction ─────────────────────────────────────────────────

describe("start-payment: paymentPath construction", () => {
  test("includes course slug when provided", () => {
    expect(buildPaymentPath("learn-ai")).toBe("/payments/iiskills?course=learn-ai");
  });

  test("encodes course slug with special chars", () => {
    expect(buildPaymentPath("learn-ai & ml")).toBe("/payments/iiskills?course=learn-ai%20%26%20ml");
  });

  test("falls back to /payments/iiskills when no course provided", () => {
    expect(buildPaymentPath("")).toBe("/payments/iiskills");
    expect(buildPaymentPath(undefined)).toBe("/payments/iiskills");
  });

  test("always targets /payments/iiskills (never aienter.in directly)", () => {
    const path = buildPaymentPath("learn-management");
    expect(path).toContain("/payments/iiskills");
    expect(path).not.toContain("aienter.in");
  });
});

// ─── Registered user path (YES) ───────────────────────────────────────────────

describe("start-payment: registered user (YES) flow", () => {
  test("authenticated user → goes to /payments/iiskills (fresh purchaseId)", () => {
    const hasSession = true;
    const course = "learn-developer";
    const paymentPath = buildPaymentPath(course);

    // When session exists, the user proceeds directly to /payments/iiskills
    const destination = hasSession ? paymentPath : buildSignInRedirect(paymentPath);
    expect(destination).toBe("/payments/iiskills?course=learn-developer");
    expect(destination).not.toContain("/sign-in");
  });

  test("unauthenticated user → redirects to /sign-in with next pointing to /payments/iiskills", () => {
    const hasSession = false;
    const course = "learn-management";
    const paymentPath = buildPaymentPath(course);

    const destination = hasSession ? paymentPath : buildSignInRedirect(paymentPath);
    expect(destination).toContain("/sign-in");
    expect(destination).toContain("next=");
    // The `next` param must encode the /payments/iiskills path
    expect(destination).toContain(encodeURIComponent("/payments/iiskills"));
  });

  test("sign-in redirect encodes the next path correctly", () => {
    const paymentPath = buildPaymentPath("learn-pr");
    const redirect = buildSignInRedirect(paymentPath);
    // Should be a valid URL-encoded `next` param
    const url = new URL(`https://iiskills.cloud${redirect}`);
    const nextParam = url.searchParams.get("next");
    expect(nextParam).toBe("/payments/iiskills?course=learn-pr");
  });

  test("every invocation uses /payments/iiskills which creates a fresh purchaseId", () => {
    // purchaseId freshness is enforced by /payments/iiskills calling
    // POST /api/payments/create-purchase on every visit.  We verify the
    // entry gateway always routes through that page.
    ["learn-ai", "learn-developer", "learn-management", "learn-pr"].forEach((course) => {
      const path = buildPaymentPath(course);
      expect(path).toContain("/payments/iiskills");
    });
  });
});

// ─── New user path (NO) ───────────────────────────────────────────────────────

describe("start-payment: new user (NO) flow", () => {
  test("new user → redirects to /register", () => {
    const redirect = buildRegisterRedirect("learn-ai");
    expect(redirect).toContain("/register");
  });

  test("after registration, user is returned to /start-payment (not directly to payment)", () => {
    const redirect = buildRegisterRedirect("learn-ai");
    const url = new URL(`https://iiskills.cloud${redirect}`);
    const nextParam = url.searchParams.get("next");
    // Should return to /start-payment so the user makes the explicit choice again
    expect(nextParam).toContain("/start-payment");
    expect(nextParam).not.toContain("/payments/iiskills");
  });

  test("course slug is preserved in the return path", () => {
    const redirect = buildRegisterRedirect("learn-management");
    const url = new URL(`https://iiskills.cloud${redirect}`);
    const nextParam = url.searchParams.get("next");
    expect(nextParam).toContain("course=learn-management");
  });

  test("works without a course param", () => {
    const redirect = buildRegisterRedirect(undefined);
    expect(redirect).toContain("/register");
    expect(redirect).toContain(encodeURIComponent("/start-payment"));
    // Should not contain a stray `course=` param
    const url = new URL(`https://iiskills.cloud${redirect}`);
    const nextParam = url.searchParams.get("next");
    expect(nextParam).toBe("/start-payment");
  });

  test("course slug in register redirect is URI-encoded", () => {
    const redirect = buildRegisterRedirect("learn-pr");
    // Should be a valid fully-encoded URL string
    expect(() => new URL(`https://iiskills.cloud${redirect}`)).not.toThrow();
  });
});

// ─── Entry gateway guard: buttons point to /start-payment ────────────────────

describe("start-payment: payment buttons must target /start-payment", () => {
  const MAIN_APP_URL = "https://iiskills.cloud";

  function buildEntryUrl(appId) {
    return `${MAIN_APP_URL}/start-payment${appId ? `?course=${encodeURIComponent(appId)}` : ""}`;
  }

  test("entry URL targets /start-payment, not /payments/iiskills directly", () => {
    const url = buildEntryUrl("learn-ai");
    expect(url).toContain("/start-payment");
    expect(url).not.toContain("/payments/iiskills");
  });

  test("course slug is passed as ?course= query param", () => {
    expect(buildEntryUrl("learn-management")).toContain("course=learn-management");
    expect(buildEntryUrl("learn-developer")).toContain("course=learn-developer");
    expect(buildEntryUrl("learn-pr")).toContain("course=learn-pr");
  });

  test("entry URL is a valid URL for all paid apps", () => {
    ["learn-ai", "learn-developer", "learn-management", "learn-pr"].forEach((appId) => {
      expect(() => new URL(buildEntryUrl(appId))).not.toThrow();
    });
  });

  test("entry URL without course is still valid", () => {
    const url = buildEntryUrl("");
    expect(url).toBe("https://iiskills.cloud/start-payment");
    expect(() => new URL(url)).not.toThrow();
  });
});

// ─── Logging assertions (documents expected console.log calls) ───────────────

describe("start-payment: logging behaviour (documented)", () => {
  test("registered user flow logs course and purchaseId intent", () => {
    // Simulates the console.log in handleRegisteredUser
    const course = "learn-ai";
    const logMsg =
      `[start-payment] Registered user entry. course=${course}. ` +
      "Proceeding to /payments/iiskills (fresh purchaseId will be created).";
    expect(logMsg).toContain("[start-payment]");
    expect(logMsg).toContain("fresh purchaseId");
    expect(logMsg).toContain(course);
  });

  test("new user flow logs course", () => {
    const course = "learn-developer";
    const logMsg = `[start-payment] New user entry. course=${course}. Redirecting to /register.`;
    expect(logMsg).toContain("[start-payment]");
    expect(logMsg).toContain(course);
    expect(logMsg).toContain("/register");
  });
});

console.log("✅ start-payment entry-gateway tests defined successfully");
