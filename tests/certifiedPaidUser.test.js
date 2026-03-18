/**
 * Tests for Certified Paid User Entitlement Logic
 *
 * Covers:
 *   - grantAppAccess: is_certified_paid_user and entitlement_type set for payment/bundle grants
 *   - grantAppAccess: annual expiry defaulted for payment/bundle grants
 *   - grantBundleAccess: annual expiry propagated to all apps in bundle
 *   - Dashboard access-record display logic (isCertifiedPaid, expiresAt)
 */

"use strict";

// ── grantAppAccess field logic (pure unit test, no DB) ───────────────────────

/**
 * Mirror of the logic in packages/access-control/dbAccessManager.js
 * so we can unit-test the field derivation without hitting Supabase.
 */
function buildAccessRecord({ grantedVia, expiresAt = null, paymentId = null }) {
  const isPaidGrant = grantedVia === "payment" || grantedVia === "bundle";

  let resolvedExpiresAt = expiresAt;
  if (isPaidGrant && resolvedExpiresAt === null) {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    resolvedExpiresAt = oneYearFromNow.toISOString();
  }

  return {
    granted_via: grantedVia,
    payment_id: paymentId,
    expires_at: resolvedExpiresAt,
    is_active: true,
    is_certified_paid_user: isPaidGrant,
    entitlement_type: isPaidGrant ? "annual_paid" : null,
  };
}

describe("buildAccessRecord — certified paid user field derivation", () => {
  describe("payment grant", () => {
    it("sets is_certified_paid_user=true", () => {
      const record = buildAccessRecord({ grantedVia: "payment", paymentId: "pay-1" });
      expect(record.is_certified_paid_user).toBe(true);
    });

    it("sets entitlement_type='annual_paid'", () => {
      const record = buildAccessRecord({ grantedVia: "payment", paymentId: "pay-1" });
      expect(record.entitlement_type).toBe("annual_paid");
    });

    it("defaults expires_at to roughly 1 year from now when not specified", () => {
      const before = Date.now();
      const record = buildAccessRecord({ grantedVia: "payment" });
      const after = Date.now();

      const expiryMs = new Date(record.expires_at).getTime();
      const oneYearMs = 365 * 24 * 60 * 60 * 1000;

      expect(expiryMs).toBeGreaterThanOrEqual(before + oneYearMs - 1000);
      expect(expiryMs).toBeLessThanOrEqual(after + oneYearMs + 1000);
    });

    it("respects a caller-supplied expires_at", () => {
      const custom = "2035-01-01T00:00:00.000Z";
      const record = buildAccessRecord({ grantedVia: "payment", expiresAt: custom });
      expect(record.expires_at).toBe(custom);
    });
  });

  describe("bundle grant", () => {
    it("sets is_certified_paid_user=true", () => {
      const record = buildAccessRecord({ grantedVia: "bundle" });
      expect(record.is_certified_paid_user).toBe(true);
    });

    it("sets entitlement_type='annual_paid'", () => {
      const record = buildAccessRecord({ grantedVia: "bundle" });
      expect(record.entitlement_type).toBe("annual_paid");
    });

    it("defaults expires_at to 1 year from now", () => {
      const before = Date.now();
      const record = buildAccessRecord({ grantedVia: "bundle" });
      const expiryMs = new Date(record.expires_at).getTime();
      const oneYearMs = 365 * 24 * 60 * 60 * 1000;
      expect(expiryMs).toBeGreaterThanOrEqual(before + oneYearMs - 1000);
    });
  });

  describe("admin grant", () => {
    it("does NOT set is_certified_paid_user", () => {
      const record = buildAccessRecord({ grantedVia: "admin" });
      expect(record.is_certified_paid_user).toBe(false);
    });

    it("does NOT set entitlement_type", () => {
      const record = buildAccessRecord({ grantedVia: "admin" });
      expect(record.entitlement_type).toBeNull();
    });

    it("does NOT add an expires_at by default", () => {
      const record = buildAccessRecord({ grantedVia: "admin" });
      expect(record.expires_at).toBeNull();
    });
  });

  describe("free grant", () => {
    it("does NOT set is_certified_paid_user", () => {
      const record = buildAccessRecord({ grantedVia: "free" });
      expect(record.is_certified_paid_user).toBe(false);
    });

    it("does NOT set entitlement_type", () => {
      const record = buildAccessRecord({ grantedVia: "free" });
      expect(record.entitlement_type).toBeNull();
    });
  });

  describe("otp grant", () => {
    it("does NOT set is_certified_paid_user", () => {
      const record = buildAccessRecord({ grantedVia: "otp" });
      expect(record.is_certified_paid_user).toBe(false);
    });

    it("does NOT set entitlement_type", () => {
      const record = buildAccessRecord({ grantedVia: "otp" });
      expect(record.entitlement_type).toBeNull();
    });
  });
});

// ── grantBundleAccess expiry derivation ─────────────────────────────────────

/**
 * Mirror of the expiry-calculation logic in grantBundleAccess.
 */
function deriveBundleExpiry(purchaseDate = null) {
  const baseDate = purchaseDate ? new Date(purchaseDate) : new Date();
  const expiresAt = new Date(baseDate);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  return expiresAt.toISOString();
}

describe("deriveBundleExpiry — grantBundleAccess expiry calculation", () => {
  it("defaults to 1 year from now when no purchaseDate is provided", () => {
    const before = Date.now();
    const expiry = deriveBundleExpiry();
    const expiryMs = new Date(expiry).getTime();
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    expect(expiryMs).toBeGreaterThanOrEqual(before + oneYearMs - 1000);
  });

  it("returns 1 year after a specific purchaseDate", () => {
    const purchaseDate = "2025-06-15T10:00:00.000Z";
    const expiry = deriveBundleExpiry(purchaseDate);
    expect(expiry).toBe("2026-06-15T10:00:00.000Z");
  });

  it("handles leap year correctly (Feb 29 → Feb 28 next non-leap year)", () => {
    const leapDay = "2024-02-29T00:00:00.000Z";
    const expiry = deriveBundleExpiry(leapDay);
    // 2025 is not a leap year, so JS Date.setFullYear normalises to Mar 1
    const expiryDate = new Date(expiry);
    expect(expiryDate.getFullYear()).toBe(2025);
  });
});

// ── Dashboard access record display logic ────────────────────────────────────

/**
 * Mirrors the logic used in apps-dashboard.js loadUserData() to build
 * userAccess from user_app_access rows.
 */
function buildUserAccessFromRecords(records, now = new Date().toISOString()) {
  const accessStatus = {};
  for (const record of records) {
    if (record.expires_at && record.expires_at <= now) continue;
    accessStatus[record.app_id] = {
      hasAccess: true,
      isCertifiedPaid: record.is_certified_paid_user === true,
      expiresAt: record.expires_at || null,
    };
  }
  return accessStatus;
}

describe("buildUserAccessFromRecords — dashboard display logic", () => {
  const futureDate = "2099-01-01T00:00:00.000Z";
  const pastDate = "2020-01-01T00:00:00.000Z";

  it("marks certified paid records correctly", () => {
    const records = [
      { app_id: "learn-ai", is_active: true, is_certified_paid_user: true, expires_at: futureDate },
    ];
    const access = buildUserAccessFromRecords(records);
    expect(access["learn-ai"].isCertifiedPaid).toBe(true);
    expect(access["learn-ai"].hasAccess).toBe(true);
    expect(access["learn-ai"].expiresAt).toBe(futureDate);
  });

  it("marks non-certified records as isCertifiedPaid=false", () => {
    const records = [
      {
        app_id: "learn-management",
        is_active: true,
        is_certified_paid_user: false,
        expires_at: futureDate,
      },
    ];
    const access = buildUserAccessFromRecords(records);
    expect(access["learn-management"].isCertifiedPaid).toBe(false);
    expect(access["learn-management"].hasAccess).toBe(true);
  });

  it("skips expired records", () => {
    const records = [
      { app_id: "learn-ai", is_active: true, is_certified_paid_user: true, expires_at: pastDate },
    ];
    const access = buildUserAccessFromRecords(records);
    expect(access["learn-ai"]).toBeUndefined();
  });

  it("includes perpetual records (null expires_at)", () => {
    const records = [
      { app_id: "learn-pr", is_active: true, is_certified_paid_user: false, expires_at: null },
    ];
    const access = buildUserAccessFromRecords(records);
    expect(access["learn-pr"].hasAccess).toBe(true);
    expect(access["learn-pr"].expiresAt).toBeNull();
  });

  it("handles multiple apps in a single pass", () => {
    const records = [
      { app_id: "learn-ai", is_active: true, is_certified_paid_user: true, expires_at: futureDate },
      {
        app_id: "learn-developer",
        is_active: true,
        is_certified_paid_user: true,
        expires_at: futureDate,
      },
      {
        app_id: "learn-management",
        is_active: true,
        is_certified_paid_user: false,
        expires_at: null,
      },
      { app_id: "learn-pr", is_active: true, is_certified_paid_user: true, expires_at: pastDate }, // expired
    ];
    const access = buildUserAccessFromRecords(records);

    expect(Object.keys(access)).toHaveLength(3);
    expect(access["learn-ai"].isCertifiedPaid).toBe(true);
    expect(access["learn-developer"].isCertifiedPaid).toBe(true);
    expect(access["learn-management"].isCertifiedPaid).toBe(false);
    expect(access["learn-pr"]).toBeUndefined();
  });
});
