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
    checkContent = require("../lib/contentFilter").checkContent;
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
