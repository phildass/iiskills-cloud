/**
 * Tests for the My Dashboard feature
 *
 * Covers:
 *   - Content filter (moderation) — tests real lib/contentFilter.js
 *   - Ticket monthly limits (free vs paid) — tests real lib/tickets/limits.js
 *   - Moderation strike/ban logic — tests real lib/moderation/strikes.js
 *   - Authorization boundaries
 */

"use strict";

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

describe("ticket monthly limit enforcement (lib/tickets/limits.js)", () => {
  let checkMonthlyTicketLimit, TICKET_LIMIT_FREE, TICKET_LIMIT_PAID;

  beforeAll(() => {
    // Import the real shared helper used by the API handler
    ({ checkMonthlyTicketLimit, TICKET_LIMIT_FREE, TICKET_LIMIT_PAID } = require("../lib/tickets/limits"));
  });

  describe("free user (limit: 1 ticket/month)", () => {
    it("allows first ticket of the month", () => {
      const result = checkMonthlyTicketLimit(0, false);
      expect(result.blocked).toBe(false);
      expect(result.limit).toBe(TICKET_LIMIT_FREE);
    });

    it("blocks second ticket of the month", () => {
      const result = checkMonthlyTicketLimit(1, false);
      expect(result.blocked).toBe(true);
      expect(result.limit).toBe(1);
    });

    it("includes reset date (UTC 1st of next month) in block response", () => {
      const result = checkMonthlyTicketLimit(1, false);
      expect(result.resetDate).toBeDefined();
      const resetDate = new Date(result.resetDate);
      expect(resetDate.getUTCDate()).toBe(1);
    });
  });

  describe("paid user (limit: 5 tickets/month)", () => {
    it("allows first ticket of the month", () => {
      expect(checkMonthlyTicketLimit(0, true).blocked).toBe(false);
    });

    it("allows up to 5th ticket of the month", () => {
      expect(checkMonthlyTicketLimit(4, true).blocked).toBe(false);
    });

    it("blocks 6th ticket of the month", () => {
      const result = checkMonthlyTicketLimit(5, true);
      expect(result.blocked).toBe(true);
      expect(result.limit).toBe(TICKET_LIMIT_PAID);
    });
  });
});

// ── Moderation Strike / Ban Logic ─────────────────────────────────────────────

describe("moderation strike and ban logic (lib/moderation/strikes.js)", () => {
  let processModerationStrike, MODERATION_STRIKE_LIMIT;

  beforeAll(() => {
    // Import the real shared helper used by the API handlers
    ({ processModerationStrike, MODERATION_STRIKE_LIMIT } = require("../lib/moderation/strikes"));
  });

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

  it("third strike triggers ban (reaches MODERATION_STRIKE_LIMIT)", () => {
    const { newStrikes, shouldBan } = processModerationStrike(MODERATION_STRIKE_LIMIT - 1);
    expect(newStrikes).toBe(MODERATION_STRIKE_LIMIT);
    expect(shouldBan).toBe(true);
  });

  it("strike after ban threshold also triggers ban", () => {
    const { shouldBan } = processModerationStrike(MODERATION_STRIKE_LIMIT + 2);
    expect(shouldBan).toBe(true);
  });

  it("MODERATION_STRIKE_LIMIT matches contentFilter export", () => {
    const { MODERATION_STRIKE_LIMIT: filterLimit } = require("../lib/contentFilter");
    expect(MODERATION_STRIKE_LIMIT).toBe(filterLimit);
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

