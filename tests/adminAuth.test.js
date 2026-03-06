/**
 * Tests for admin authentication (adminAuth.js)
 *
 * Covers:
 * - getAdminAllowlistEmails: reads ADMIN_ALLOWLIST_EMAILS env var
 * - validateAdminRequest (sync): IP allowlist, header secret, admin_session cookie
 * - validateAdminRequestAsync: supreme-admin + Supabase Bearer token (allowlist, profiles.is_admin, denial)
 */

process.env.ADMIN_SESSION_SIGNING_KEY = "test-signing-key-minimum-32-chars-padding";
process.env.ADMIN_PANEL_SECRET = "test-panel-secret";
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

const jwt = require("jsonwebtoken");
const { serialize } = require("cookie");

// ---------------------------------------------------------------------------
// Module under test (imported after env vars are set)
// ---------------------------------------------------------------------------

const {
  getAdminAllowlistEmails,
  validateAdminRequest,
  validateAdminRequestAsync,
  ADMIN_COOKIE_NAME,
  createAdminToken,
} = require("../apps/main/lib/adminAuth");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeReq(overrides = {}) {
  return {
    headers: { cookie: "" },
    socket: { remoteAddress: "127.0.0.1" },
    ...overrides,
  };
}

function adminCookieHeader() {
  const token = createAdminToken(false);
  return serialize(ADMIN_COOKIE_NAME, token, { path: "/" });
}

// ---------------------------------------------------------------------------
// getAdminAllowlistEmails
// ---------------------------------------------------------------------------

describe("getAdminAllowlistEmails", () => {
  afterEach(() => {
    delete process.env.ADMIN_ALLOWLIST_EMAILS;
  });

  test("returns empty array when env var is not set", () => {
    expect(getAdminAllowlistEmails()).toEqual([]);
  });

  test("returns trimmed lower-cased emails", () => {
    process.env.ADMIN_ALLOWLIST_EMAILS = "Admin@Example.com, user@Test.org";
    expect(getAdminAllowlistEmails()).toEqual(["admin@example.com", "user@test.org"]);
  });

  test("ignores empty entries from trailing comma", () => {
    process.env.ADMIN_ALLOWLIST_EMAILS = "a@b.com,";
    expect(getAdminAllowlistEmails()).toEqual(["a@b.com"]);
  });
});

// ---------------------------------------------------------------------------
// validateAdminRequest (sync — supreme-admin only)
// ---------------------------------------------------------------------------

describe("validateAdminRequest", () => {
  test("returns valid=true when ADMIN_AUTH_DISABLED=true", () => {
    process.env.ADMIN_AUTH_DISABLED = "true";
    expect(validateAdminRequest(makeReq()).valid).toBe(true);
    delete process.env.ADMIN_AUTH_DISABLED;
  });

  test("rejects request with no credentials", () => {
    const result = validateAdminRequest(makeReq());
    expect(result.valid).toBe(false);
    expect(result.status).toBe(401);
  });

  test("accepts valid x-admin-secret header", () => {
    const req = makeReq({ headers: { cookie: "", "x-admin-secret": "test-panel-secret" } });
    expect(validateAdminRequest(req).valid).toBe(true);
  });

  test("rejects wrong x-admin-secret header", () => {
    const req = makeReq({ headers: { cookie: "", "x-admin-secret": "wrong-secret" } });
    expect(validateAdminRequest(req).valid).toBe(false);
  });

  test("accepts valid admin_session cookie", () => {
    const req = makeReq({ headers: { cookie: adminCookieHeader() } });
    expect(validateAdminRequest(req).valid).toBe(true);
  });

  test("rejects tampered admin_session cookie", () => {
    const req = makeReq({ headers: { cookie: `${ADMIN_COOKIE_NAME}=invalid.token.here` } });
    expect(validateAdminRequest(req).valid).toBe(false);
  });

  test("returns status 403 when IP not in allowlist", () => {
    process.env.ADMIN_IP_ALLOWLIST = "10.0.0.1";
    const result = validateAdminRequest(makeReq());
    expect(result.valid).toBe(false);
    expect(result.status).toBe(403);
    delete process.env.ADMIN_IP_ALLOWLIST;
  });

  test("accepts request when IP is in allowlist", () => {
    process.env.ADMIN_IP_ALLOWLIST = "127.0.0.1";
    const req = makeReq({ headers: { cookie: adminCookieHeader() } });
    const result = validateAdminRequest(req);
    expect(result.valid).toBe(true);
    delete process.env.ADMIN_IP_ALLOWLIST;
  });
});

// ---------------------------------------------------------------------------
// validateAdminRequestAsync — Supabase Bearer token path
// ---------------------------------------------------------------------------

// We mock @supabase/supabase-js so we control what auth.getUser / from().select() returns.
jest.mock("@supabase/supabase-js", () => {
  const mockSingle = jest.fn();
  const mockEq = jest.fn(() => ({ single: mockSingle }));
  const mockSelect = jest.fn(() => ({ eq: mockEq }));
  const mockFrom = jest.fn(() => ({ select: mockSelect }));
  const mockGetUser = jest.fn();

  const mockClient = {
    auth: { getUser: mockGetUser },
    from: mockFrom,
  };

  return {
    createClient: jest.fn(() => mockClient),
    _mockGetUser: mockGetUser,
    _mockSingle: mockSingle,
  };
});

function getSupabaseMocks() {
  const mod = require("@supabase/supabase-js");
  return { mockGetUser: mod._mockGetUser, mockSingle: mod._mockSingle };
}

describe("validateAdminRequestAsync — Supabase Bearer token", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Ensure env is clean for each test
    delete process.env.ADMIN_AUTH_DISABLED;
    delete process.env.ADMIN_IP_ALLOWLIST;
  });

  test("supreme-admin path (cookie) still works", async () => {
    const req = makeReq({ headers: { cookie: adminCookieHeader() } });
    const result = await validateAdminRequestAsync(req);
    expect(result.valid).toBe(true);
  });

  test("returns 403 when IP blocked (async)", async () => {
    process.env.ADMIN_IP_ALLOWLIST = "10.0.0.1";
    const result = await validateAdminRequestAsync(makeReq());
    expect(result.valid).toBe(false);
    expect(result.status).toBe(403);
    delete process.env.ADMIN_IP_ALLOWLIST;
  });

  test("accepts Bearer token for allowlist email", async () => {
    process.env.ADMIN_ALLOWLIST_EMAILS = "admin@example.com";
    const { mockGetUser } = getSupabaseMocks();
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "uid-1", email: "admin@example.com" } },
      error: null,
    });

    const req = makeReq({
      headers: { cookie: "", authorization: "Bearer valid-token" },
    });
    const result = await validateAdminRequestAsync(req);
    expect(result.valid).toBe(true);
    delete process.env.ADMIN_ALLOWLIST_EMAILS;
  });

  test("accepts Bearer token for profiles.is_admin = true", async () => {
    const { mockGetUser, mockSingle } = getSupabaseMocks();
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "uid-2", email: "notinlist@example.com" } },
      error: null,
    });
    mockSingle.mockResolvedValueOnce({ data: { is_admin: true }, error: null });

    const req = makeReq({
      headers: { cookie: "", authorization: "Bearer valid-token" },
    });
    const result = await validateAdminRequestAsync(req);
    expect(result.valid).toBe(true);
  });

  test("denies Bearer token when user is not admin (returns 401)", async () => {
    const { mockGetUser, mockSingle } = getSupabaseMocks();
    mockGetUser.mockResolvedValueOnce({
      data: { user: { id: "uid-3", email: "regular@example.com" } },
      error: null,
    });
    mockSingle.mockResolvedValueOnce({ data: { is_admin: false }, error: null });

    const req = makeReq({
      headers: { cookie: "", authorization: "Bearer valid-token" },
    });
    const result = await validateAdminRequestAsync(req);
    expect(result.valid).toBe(false);
    expect(result.status).toBe(401);
  });

  test("denies invalid Supabase token (returns 401)", async () => {
    const { mockGetUser } = getSupabaseMocks();
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: new Error("invalid token"),
    });

    const req = makeReq({
      headers: { cookie: "", authorization: "Bearer bad-token" },
    });
    const result = await validateAdminRequestAsync(req);
    expect(result.valid).toBe(false);
    expect(result.status).toBe(401);
  });
});
