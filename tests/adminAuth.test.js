/**
 * Tests for admin authentication (adminAuth.js)
 *
 * Covers:
 * - getAdminAllowlistEmails: reads ADMIN_ALLOWLIST_EMAILS env var
 * - validateAdminRequest (sync): IP allowlist, header secret, admin_session cookie
 * - validateAdminRequestAsync: delegates to validateAdminRequest (password-based only)
 */

process.env.ADMIN_SESSION_SIGNING_KEY = "test-signing-key-minimum-32-chars-padding";
process.env.ADMIN_PANEL_SECRET = "test-panel-secret";

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
// validateAdminRequest (sync — password-based only)
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
// validateAdminRequestAsync — delegates to validateAdminRequest
// ---------------------------------------------------------------------------

describe("validateAdminRequestAsync", () => {
  beforeEach(() => {
    delete process.env.ADMIN_AUTH_DISABLED;
    delete process.env.ADMIN_IP_ALLOWLIST;
  });

  test("accepts valid admin_session cookie (async)", async () => {
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

  test("rejects request with no credentials (async)", async () => {
    const result = await validateAdminRequestAsync(makeReq());
    expect(result.valid).toBe(false);
    expect(result.status).toBe(401);
  });

  test("does not accept Bearer tokens as admin credentials", async () => {
    const req = makeReq({
      headers: { cookie: "", authorization: "Bearer some-token" },
    });
    const result = await validateAdminRequestAsync(req);
    expect(result.valid).toBe(false);
    expect(result.status).toBe(401);
  });
});
