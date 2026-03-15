/**
 * Tests for POST /api/admin/login (emergency login handler)
 *
 * Covers:
 * - ADMIN_PANEL_SECRET: match → 200, mismatch → 401, missing → 500
 * - ADMIN_EMERGENCY_PASSPHRASE alias: match → 200, mismatch → 401
 * - ADMIN_PASSWORD alias: match → 200, mismatch → 401
 * - Missing ADMIN_SESSION_SIGNING_KEY → 500
 * - DELETE (logout) → 200
 * - Invalid method → 405
 */

// ---------------------------------------------------------------------------
// Environment setup — must happen before any module imports
// ---------------------------------------------------------------------------
process.env.ADMIN_SESSION_SIGNING_KEY = "test-signing-key-minimum-32-chars-padding";
delete process.env.ADMIN_PANEL_SECRET;
delete process.env.ADMIN_EMERGENCY_PASSPHRASE;
delete process.env.ADMIN_PASSWORD;

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../apps/main/lib/adminAuth", () => {
  const actual = jest.requireActual("../apps/main/lib/adminAuth");
  return {
    ...actual,
    setAdminSessionCookie: jest.fn(),
    clearAdminSessionCookie: jest.fn(),
  };
});

const { setAdminSessionCookie, clearAdminSessionCookie } = require("../apps/main/lib/adminAuth");

function loadHandler() {
  let handler;
  jest.isolateModules(() => {
    handler = require("../apps/main/pages/api/admin/login").default;
  });
  return handler;
}

function makeReq(method, body = {}) {
  return { method, body, headers: {} };
}

function makeRes() {
  const res = { statusCode: null, body: null, headers: {} };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.body = data; return res; };
  res.setHeader = (name, value) => { res.headers[name] = value; return res; };
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
  setAdminSessionCookie.mockImplementation(() => {});
  clearAdminSessionCookie.mockImplementation(() => {});
  delete process.env.ADMIN_PANEL_SECRET;
  delete process.env.ADMIN_EMERGENCY_PASSPHRASE;
  delete process.env.ADMIN_PASSWORD;
  process.env.ADMIN_SESSION_SIGNING_KEY = "test-signing-key-minimum-32-chars-padding";
});

// ---------------------------------------------------------------------------
// Method guard
// ---------------------------------------------------------------------------

test("returns 405 for unsupported method", async () => {
  const handler = loadHandler();
  const req = makeReq("GET");
  const res = makeRes();
  handler(req, res);
  expect(res.statusCode).toBe(405);
});

// ---------------------------------------------------------------------------
// No secret configured
// ---------------------------------------------------------------------------

test("returns 500 when no secret env var is set", () => {
  const handler = loadHandler();
  const req = makeReq("POST", { secret: "anything" });
  const res = makeRes();
  handler(req, res);
  expect(res.statusCode).toBe(500);
  expect(res.body.error).toMatch(/not configured/i);
});

// ---------------------------------------------------------------------------
// ADMIN_PANEL_SECRET
// ---------------------------------------------------------------------------

describe("ADMIN_PANEL_SECRET", () => {
  beforeEach(() => {
    process.env.ADMIN_PANEL_SECRET = "panel-secret";
  });

  test("accepts correct ADMIN_PANEL_SECRET", () => {
    const handler = loadHandler();
    const req = makeReq("POST", { secret: "panel-secret" });
    const res = makeRes();
    handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(setAdminSessionCookie).toHaveBeenCalledTimes(1);
  });

  test("rejects wrong ADMIN_PANEL_SECRET", () => {
    const handler = loadHandler();
    const req = makeReq("POST", { secret: "wrong-secret" });
    const res = makeRes();
    handler(req, res);
    expect(res.statusCode).toBe(401);
    expect(setAdminSessionCookie).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// ADMIN_EMERGENCY_PASSPHRASE alias
// ---------------------------------------------------------------------------

describe("ADMIN_EMERGENCY_PASSPHRASE alias", () => {
  beforeEach(() => {
    process.env.ADMIN_EMERGENCY_PASSPHRASE = "emergency-passphrase";
  });
  afterEach(() => {
    delete process.env.ADMIN_EMERGENCY_PASSPHRASE;
  });

  test("accepts correct ADMIN_EMERGENCY_PASSPHRASE", () => {
    const handler = loadHandler();
    const req = makeReq("POST", { secret: "emergency-passphrase" });
    const res = makeRes();
    handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(setAdminSessionCookie).toHaveBeenCalledTimes(1);
  });

  test("rejects wrong passphrase when ADMIN_EMERGENCY_PASSPHRASE is set", () => {
    const handler = loadHandler();
    const req = makeReq("POST", { secret: "wrong" });
    const res = makeRes();
    handler(req, res);
    expect(res.statusCode).toBe(401);
    expect(setAdminSessionCookie).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// ADMIN_PASSWORD alias
// ---------------------------------------------------------------------------

describe("ADMIN_PASSWORD alias", () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = "my-admin-password";
  });
  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
  });

  test("accepts correct ADMIN_PASSWORD", () => {
    const handler = loadHandler();
    const req = makeReq("POST", { secret: "my-admin-password" });
    const res = makeRes();
    handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(setAdminSessionCookie).toHaveBeenCalledTimes(1);
  });

  test("rejects wrong passphrase when ADMIN_PASSWORD is set", () => {
    const handler = loadHandler();
    const req = makeReq("POST", { secret: "wrong" });
    const res = makeRes();
    handler(req, res);
    expect(res.statusCode).toBe(401);
    expect(setAdminSessionCookie).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Missing signing key
// ---------------------------------------------------------------------------

test("returns 500 when ADMIN_SESSION_SIGNING_KEY is absent", () => {
  process.env.ADMIN_PANEL_SECRET = "panel-secret";
  delete process.env.ADMIN_SESSION_SIGNING_KEY;
  delete process.env.ADMIN_JWT_SECRET;
  const handler = loadHandler();
  const req = makeReq("POST", { secret: "panel-secret" });
  const res = makeRes();
  handler(req, res);
  expect(res.statusCode).toBe(500);
  expect(res.body.error).toMatch(/ADMIN_SESSION_SIGNING_KEY/i);
});

// ---------------------------------------------------------------------------
// Logout (DELETE)
// ---------------------------------------------------------------------------

test("DELETE clears admin session cookie and returns 200", () => {
  const handler = loadHandler();
  const req = makeReq("DELETE");
  const res = makeRes();
  handler(req, res);
  expect(res.statusCode).toBe(200);
  expect(clearAdminSessionCookie).toHaveBeenCalledTimes(1);
});
