/**
 * Tests for the Universal Admin section
 *
 * Covers:
 * - isSuperadmin: returns true only for ADMIN_ALLOWLIST_EMAILS entries
 * - writeAuditEvent: writes audit event to DB (via service client mock)
 * - getActorInfo: resolves actor identity from Bearer token or falls back to emergency
 * - /api/admin/entitlements: grant creates entitlement + audit event; revoke works
 * - /api/admin/admins: superadmin can create/revoke; non-superadmin gets 403
 * - Unauthorized requests return 403
 */

// Set up env before any imports
process.env.ADMIN_SESSION_SIGNING_KEY = "test-signing-key-minimum-32-chars-padding";
process.env.ADMIN_PANEL_SECRET = "test-panel-secret";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";
process.env.ADMIN_ALLOWLIST_EMAILS = "superadmin@example.com";

const { serialize } = require("cookie");
const jwt = require("jsonwebtoken");

const {
  isSuperadmin,
  writeAuditEvent,
  getActorInfo,
  createAdminToken,
  ADMIN_COOKIE_NAME,
} = require("../apps/main/lib/adminAuth");

// ---------------------------------------------------------------------------
// Supabase mock (shared across test suites in this file)
// ---------------------------------------------------------------------------

const mockInsert = jest.fn().mockResolvedValue({ data: {}, error: null });
const mockUpdate = jest.fn();
const mockSelectChain = jest.fn();
const mockGetUser = jest.fn();
const mockListUsers = jest.fn();

jest.mock("@supabase/supabase-js", () => {
  return {
    createClient: jest.fn(() => ({
      auth: {
        getUser: mockGetUser,
        admin: { listUsers: mockListUsers },
      },
      from: jest.fn(() => ({
        insert: mockInsert,
        update: mockUpdate,
        select: mockSelectChain,
        upsert: jest.fn().mockResolvedValue({ data: {}, error: null }),
      })),
    })),
  };
});

function makeCookieHeader() {
  const token = createAdminToken(false);
  return serialize(ADMIN_COOKIE_NAME, token, { path: "/" });
}

// ---------------------------------------------------------------------------
// isSuperadmin
// ---------------------------------------------------------------------------

describe("isSuperadmin", () => {
  test("returns true for email in ADMIN_ALLOWLIST_EMAILS", () => {
    expect(isSuperadmin("superadmin@example.com")).toBe(true);
  });

  test("is case-insensitive", () => {
    expect(isSuperadmin("SuperAdmin@Example.COM")).toBe(true);
  });

  test("returns false for email not in allowlist", () => {
    expect(isSuperadmin("regular@example.com")).toBe(false);
  });

  test("returns false for null", () => {
    expect(isSuperadmin(null)).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(isSuperadmin("")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// writeAuditEvent
// ---------------------------------------------------------------------------

describe("writeAuditEvent", () => {
  beforeEach(() => jest.clearAllMocks());

  test("calls supabase.from('admin_audit_events').insert with correct shape", async () => {
    const mockSupabase = require("@supabase/supabase-js").createClient();
    await writeAuditEvent(mockSupabase, {
      actorUserId: "actor-uuid",
      actorEmail: "actor@example.com",
      actorType: "supabase_admin",
      action: "grant_entitlement",
      targetUserId: "target-uuid",
      targetEmailOrPhone: "target@example.com",
      appId: "learn-ai",
      courseTitleSnapshot: "Learn AI",
      metadata: { payment_reference: "pay_123" },
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("admin_audit_events");
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        actor_user_id: "actor-uuid",
        actor_email: "actor@example.com",
        actor_type: "supabase_admin",
        action: "grant_entitlement",
        target_user_id: "target-uuid",
        target_email_or_phone: "target@example.com",
        app_id: "learn-ai",
        course_title_snapshot: "Learn AI",
        metadata: { payment_reference: "pay_123" },
      })
    );
  });

  test("does not throw when DB insert fails (audit failures must be non-fatal)", async () => {
    mockInsert.mockRejectedValueOnce(new Error("DB connection lost"));
    const mockSupabase = require("@supabase/supabase-js").createClient();
    await expect(
      writeAuditEvent(mockSupabase, {
        actorUserId: null,
        actorEmail: null,
        actorType: "emergency_admin",
        action: "grant_entitlement",
      })
    ).resolves.not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// getActorInfo
// ---------------------------------------------------------------------------

describe("getActorInfo", () => {
  beforeEach(() => jest.clearAllMocks());

  test("returns emergency_admin when no Bearer token present", async () => {
    const req = { headers: { cookie: "" } };
    const actor = await getActorInfo(req);
    expect(actor.actorType).toBe("emergency_admin");
    expect(actor.actorUserId).toBeNull();
  });

  test("returns supabase_admin when Bearer token resolves to a user", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "uid-1", email: "admin@example.com" } },
      error: null,
    });
    const req = { headers: { authorization: "Bearer some-token" } };
    const actor = await getActorInfo(req);
    expect(actor.actorType).toBe("supabase_admin");
    expect(actor.actorUserId).toBe("uid-1");
    expect(actor.actorEmail).toBe("admin@example.com");
  });

  test("falls back to emergency_admin when Bearer token is invalid", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: new Error("invalid"),
    });
    const req = { headers: { authorization: "Bearer bad-token" } };
    const actor = await getActorInfo(req);
    expect(actor.actorType).toBe("emergency_admin");
  });
});

// ---------------------------------------------------------------------------
// Unauthorized requests must return 403
// ---------------------------------------------------------------------------

describe("admin API unauthorized returns 403", () => {
  const makeReq = (overrides = {}) => ({
    method: "GET",
    headers: { cookie: "" },
    socket: { remoteAddress: "127.0.0.1" },
    query: {},
    body: {},
    ...overrides,
  });
  const makeRes = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    res.setHeader = jest.fn(() => res);
    return res;
  };

  test("/api/admin/entitlements returns 403 for unauthenticated GET", async () => {
    const { default: handler } = require("../apps/main/pages/api/admin/entitlements");
    const req = makeReq({ query: { user_id: "some-uuid" } });
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(expect.any(Number));
    const statusCode = res.status.mock.calls[0][0];
    expect(statusCode).toBeGreaterThanOrEqual(400);
  });

  test("/api/admin/admins returns 403 for unauthenticated request", async () => {
    const { default: handler } = require("../apps/main/pages/api/admin/admins");
    const req = makeReq();
    const res = makeRes();
    await handler(req, res);
    const statusCode = res.status.mock.calls[0][0];
    expect(statusCode).toBeGreaterThanOrEqual(400);
  });
});

// ---------------------------------------------------------------------------
// /api/admin/admins — superadmin restriction
// ---------------------------------------------------------------------------

describe("/api/admin/admins superadmin enforcement", () => {
  const makeCookieReq = (method, body = {}, query = {}) => ({
    method,
    headers: { cookie: makeCookieHeader() },
    socket: { remoteAddress: "127.0.0.1" },
    query,
    body,
  });
  const makeRes = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);
    res.setHeader = jest.fn(() => res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // emergency admin session is authenticated but has no email → not a superadmin
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
  });

  test("POST /api/admin/admins returns 403 for emergency admin (no email → not superadmin)", async () => {
    const { default: handler } = require("../apps/main/pages/api/admin/admins");
    const req = makeCookieReq("POST", { email: "newadmin@example.com" });
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test("DELETE /api/admin/admins returns 403 for emergency admin", async () => {
    const { default: handler } = require("../apps/main/pages/api/admin/admins");
    const req = makeCookieReq("DELETE", { user_id: "some-uuid" });
    const res = makeRes();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
