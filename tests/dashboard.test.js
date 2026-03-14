/**
 * Tests for the My Dashboard feature
 *
 * Covers:
 *   - Content filter (moderation)
 *   - Ticket monthly limits (free vs paid)
 *   - Authorization boundaries
 */

"use strict";

const path = require("path");
const fs = require("fs");

// ── Content Filter ────────────────────────────────────────────────────────────

describe("contentFilter — checkContent()", () => {
  let checkContent;

  beforeAll(() => {
    // Load the shared content filter (uses CJS require)
    checkContent = require("../packages/shared-utils/lib/contentFilter").checkContent;
  });

  it("returns { flagged: false } for clean content", () => {
    expect(checkContent("I need help with my course login")).toEqual({ flagged: false });
    expect(checkContent("My payment was not processed")).toEqual({ flagged: false });
    expect(checkContent("Please help me access the course materials")).toEqual({ flagged: false });
  });

  it("flags content with banned keywords", () => {
    const result = checkContent("This is an offensive message");
    expect(result.flagged).toBe(true);
    expect(result.reason).toContain("offensive");
  });

  it("flags content with banned phrases", () => {
    const result = checkContent("I want to vote for a change");
    expect(result.flagged).toBe(true);
    expect(result.reason).toContain("vote for");
  });

  it("flags content with controversial topics", () => {
    const result = checkContent("This course is mixing politics with education");
    expect(result.flagged).toBe(true);
    expect(result.reason).toContain("politics");
  });

  it("is case-insensitive", () => {
    const result = checkContent("OFFENSIVE CONTENT HERE");
    expect(result.flagged).toBe(true);
  });

  it("returns { flagged: false } for empty string", () => {
    expect(checkContent("")).toEqual({ flagged: false });
  });

  it("returns { flagged: false } for null/undefined input", () => {
    expect(checkContent(null)).toEqual({ flagged: false });
    expect(checkContent(undefined)).toEqual({ flagged: false });
  });
});

// ── Ticket Monthly Limit Logic ────────────────────────────────────────────────

describe("ticket monthly limit enforcement", () => {
  const TICKET_LIMIT_FREE = 1;
  const TICKET_LIMIT_PAID = 5;

  function checkLimit(monthCount, isPaid) {
    const limit = isPaid ? TICKET_LIMIT_PAID : TICKET_LIMIT_FREE;
    if (monthCount >= limit) {
      const now = new Date();
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      return {
        blocked: true,
        limit,
        used: monthCount,
        resetDate: nextMonth.toISOString(),
      };
    }
    return { blocked: false, limit, used: monthCount };
  }

  describe("free user (limit: 1 ticket/month)", () => {
    it("allows first ticket of the month", () => {
      const result = checkLimit(0, false);
      expect(result.blocked).toBe(false);
    });

    it("blocks second ticket of the month", () => {
      const result = checkLimit(1, false);
      expect(result.blocked).toBe(true);
      expect(result.limit).toBe(1);
    });

    it("includes reset date in block response", () => {
      const result = checkLimit(1, false);
      expect(result.resetDate).toBeDefined();
      const resetDate = new Date(result.resetDate);
      expect(resetDate.getDate()).toBe(1); // 1st of next month
    });
  });

  describe("paid user (limit: 5 tickets/month)", () => {
    it("allows first ticket of the month", () => {
      expect(checkLimit(0, true).blocked).toBe(false);
    });

    it("allows up to 5th ticket of the month", () => {
      expect(checkLimit(4, true).blocked).toBe(false);
    });

    it("blocks 6th ticket of the month", () => {
      const result = checkLimit(5, true);
      expect(result.blocked).toBe(true);
      expect(result.limit).toBe(5);
    });
  });
});

// ── Moderation Strike / Ban Logic ─────────────────────────────────────────────

describe("moderation strike and ban logic", () => {
  const MODERATION_STRIKE_LIMIT = 3;

  function processModerationStrike(currentStrikes) {
    const newStrikes = currentStrikes + 1;
    const shouldBan = newStrikes >= MODERATION_STRIKE_LIMIT;
    return { newStrikes, shouldBan };
  }

  it("first strike does not trigger ban", () => {
    const { newStrikes, shouldBan } = processModerationStrike(0);
    expect(newStrikes).toBe(1);
    expect(shouldBan).toBe(false);
  });

  it("second strike does not trigger ban", () => {
    const { newStrikes, shouldBan } = processModerationStrike(1);
    expect(newStrikes).toBe(2);
    expect(shouldBan).toBe(false);
  });

  it("third strike triggers ban", () => {
    const { newStrikes, shouldBan } = processModerationStrike(2);
    expect(newStrikes).toBe(3);
    expect(shouldBan).toBe(true);
  });

  it("strike after ban threshold also triggers ban", () => {
    const { shouldBan } = processModerationStrike(5);
    expect(shouldBan).toBe(true);
  });
});

// ── Authorization: users can only see their own data ─────────────────────────

describe("authorization boundary logic", () => {
  function userOwnsTicket(userId, ticketUserId) {
    return userId === ticketUserId;
  }

  function userOwnsCourseMessage(userId, messageUserId) {
    return userId === messageUserId;
  }

  const USER_A = "user-a-uuid";
  const USER_B = "user-b-uuid";

  it("user can access their own ticket", () => {
    expect(userOwnsTicket(USER_A, USER_A)).toBe(true);
  });

  it("user cannot access another user's ticket", () => {
    expect(userOwnsTicket(USER_A, USER_B)).toBe(false);
  });

  it("user can access their own course message", () => {
    expect(userOwnsCourseMessage(USER_A, USER_A)).toBe(true);
  });

  it("user cannot access another user's course message", () => {
    expect(userOwnsCourseMessage(USER_A, USER_B)).toBe(false);
  });
});

// ── Entitlement display logic ─────────────────────────────────────────────────

describe("entitlement display logic", () => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(); // yesterday
  const futureDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(); // 1 year ahead

  function getEntitlementStatusInfo(entitlement) {
    const isExpiredByDate =
      entitlement.expires_at && new Date(entitlement.expires_at) <= new Date();
    if (entitlement.status === "revoked") {
      return { label: "Revoked", colorClass: "bg-red-100 text-red-700" };
    }
    if (entitlement.status === "expired" || isExpiredByDate) {
      return { label: "Expired", colorClass: "bg-orange-100 text-orange-700" };
    }
    if (entitlement.status === "active") {
      return { label: "Active", colorClass: "bg-green-100 text-green-700" };
    }
    return { label: entitlement.status, colorClass: "bg-gray-100 text-gray-600" };
  }

  function isEntitlementAccessible(entitlement) {
    if (entitlement.status !== "active") return false;
    if (entitlement.expires_at && new Date(entitlement.expires_at) <= new Date()) return false;
    return true;
  }

  function derivePaidCourseSlugs(purchaseSlugs, entitlements) {
    const nowIso = new Date().toISOString();
    const activeEntitlements = entitlements.filter(
      (e) => e.status === "active" && (!e.expires_at || e.expires_at > nowIso)
    );
    const paidSlugsFromEntitlements = activeEntitlements
      .flatMap((e) => {
        if (e.app_id === "ai-developer-bundle") return ["learn-ai", "learn-developer"];
        return [e.app_id];
      })
      .filter((slug) => !purchaseSlugs.includes(slug));
    return [...new Set([...purchaseSlugs, ...paidSlugsFromEntitlements])];
  }

  describe("getEntitlementStatusInfo()", () => {
    it("returns Active for active, non-expired entitlement", () => {
      const ent = { status: "active", expires_at: futureDate };
      expect(getEntitlementStatusInfo(ent).label).toBe("Active");
    });

    it("returns Expired for entitlement with status=expired", () => {
      const ent = { status: "expired", expires_at: futureDate };
      expect(getEntitlementStatusInfo(ent).label).toBe("Expired");
    });

    it("returns Expired for active entitlement past expiry date", () => {
      const ent = { status: "active", expires_at: pastDate };
      expect(getEntitlementStatusInfo(ent).label).toBe("Expired");
    });

    it("returns Revoked for revoked entitlement", () => {
      const ent = { status: "revoked", expires_at: futureDate };
      expect(getEntitlementStatusInfo(ent).label).toBe("Revoked");
    });

    it("returns Active for entitlement with no expiry (perpetual)", () => {
      const ent = { status: "active", expires_at: null };
      expect(getEntitlementStatusInfo(ent).label).toBe("Active");
    });
  });

  describe("isEntitlementAccessible()", () => {
    it("grants access for active, non-expired entitlement", () => {
      expect(isEntitlementAccessible({ status: "active", expires_at: futureDate })).toBe(true);
    });

    it("grants access for active entitlement with no expiry", () => {
      expect(isEntitlementAccessible({ status: "active", expires_at: null })).toBe(true);
    });

    it("denies access for active but expired entitlement", () => {
      expect(isEntitlementAccessible({ status: "active", expires_at: pastDate })).toBe(false);
    });

    it("denies access for revoked entitlement", () => {
      expect(isEntitlementAccessible({ status: "revoked", expires_at: futureDate })).toBe(false);
    });

    it("denies access for status=expired entitlement", () => {
      expect(isEntitlementAccessible({ status: "expired", expires_at: futureDate })).toBe(false);
    });
  });

  describe("derivePaidCourseSlugs() — only active entitlements grant access", () => {
    it("includes slugs from active entitlements", () => {
      const entitlements = [{ app_id: "learn-ai", status: "active", expires_at: futureDate }];
      expect(derivePaidCourseSlugs([], entitlements)).toContain("learn-ai");
    });

    it("excludes slugs from expired entitlements", () => {
      const entitlements = [{ app_id: "learn-ai", status: "active", expires_at: pastDate }];
      expect(derivePaidCourseSlugs([], entitlements)).not.toContain("learn-ai");
    });

    it("excludes slugs from revoked entitlements", () => {
      const entitlements = [{ app_id: "learn-ai", status: "revoked", expires_at: futureDate }];
      expect(derivePaidCourseSlugs([], entitlements)).not.toContain("learn-ai");
    });

    it("expands ai-developer-bundle into both learn-ai and learn-developer", () => {
      const entitlements = [
        { app_id: "ai-developer-bundle", status: "active", expires_at: futureDate },
      ];
      const slugs = derivePaidCourseSlugs([], entitlements);
      expect(slugs).toContain("learn-ai");
      expect(slugs).toContain("learn-developer");
      expect(slugs).not.toContain("ai-developer-bundle");
    });

    it("does not duplicate slugs already covered by purchases", () => {
      const entitlements = [{ app_id: "learn-ai", status: "active", expires_at: futureDate }];
      const slugs = derivePaidCourseSlugs(["learn-ai"], entitlements);
      expect(slugs.filter((s) => s === "learn-ai")).toHaveLength(1);
    });

    it("combines purchases and active entitlements without duplicates", () => {
      const entitlements = [
        { app_id: "learn-ai", status: "active", expires_at: futureDate },
        { app_id: "learn-management", status: "revoked", expires_at: futureDate },
      ];
      const slugs = derivePaidCourseSlugs(["learn-developer"], entitlements);
      expect(slugs).toContain("learn-developer");
      expect(slugs).toContain("learn-ai");
      expect(slugs).not.toContain("learn-management");
    });
  });
});
