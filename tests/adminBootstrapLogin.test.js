/**
 * Tests for POST /api/admin/bootstrap-or-login
 *
 * Covers every decision branch in the handler:
 * - Missing signing key → 500
 * - TEST_ADMIN_MODE: correct passphrase → 200, wrong passphrase → 401
 * - Production / ADMIN_PANEL_SECRET override: match → 200
 * - Production / bcrypt hash: correct → 200, wrong → 401
 * - Production / bootstrap (no hash): correct → 200 + needs_setup, wrong → 401
 * - Missing passphrase in body → 400
 */

// ---------------------------------------------------------------------------
// Environment setup — must happen before any module imports
// ---------------------------------------------------------------------------
process.env.ADMIN_SESSION_SIGNING_KEY = "test-signing-key-minimum-32-chars-padding";
delete process.env.ADMIN_PANEL_SECRET;
delete process.env.TEST_ADMIN_MODE;
delete process.env.ADMIN_DATA_FILE;

// ---------------------------------------------------------------------------
// Mocks — use factory functions so native addons are never loaded
// ---------------------------------------------------------------------------

jest.mock("fs");
jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

const fs = require("fs");
const bcrypt = require("bcrypt");

// Spy on setAdminSessionCookie without loading the actual adminAuth module twice.
jest.mock("../apps/main/lib/adminAuth", () => {
  const actual = jest.requireActual("../apps/main/lib/adminAuth");
  return {
    ...actual,
    setAdminSessionCookie: jest.fn(),
  };
});

const { setAdminSessionCookie } = require("../apps/main/lib/adminAuth");

// Lazily require the handler after all mocks are in place.
// Use jest.isolateModules so env var changes between tests work correctly.
function loadHandler() {
  let handler;
  jest.isolateModules(() => {
    handler = require("../apps/main/pages/api/admin/bootstrap-or-login").default;
  });
  return handler;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeReq(body = {}) {
  return {
    method: "POST",
    body,
    headers: {},
  };
}

function makeRes() {
  const res = {
    statusCode: null,
    body: null,
    headers: {},
  };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  res.setHeader = (name, value) => {
    res.headers[name] = value;
    return res;
  };
  return res;
}

// ---------------------------------------------------------------------------
// Reset mocks between tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks();
  setAdminSessionCookie.mockImplementation(() => {});
  // Default: admin.json does not exist
  fs.readFileSync.mockImplementation(() => {
    const err = new Error("ENOENT");
    err.code = "ENOENT";
    throw err;
  });
  // Default bcrypt: always resolves to false (override per-test when needed)
  bcrypt.compare.mockResolvedValue(false);
  // Reset env vars
  delete process.env.ADMIN_PANEL_SECRET;
  delete process.env.TEST_ADMIN_MODE;
  delete process.env.ADMIN_DATA_FILE;
  process.env.ADMIN_SESSION_SIGNING_KEY = "test-signing-key-minimum-32-chars-padding";
});

// ---------------------------------------------------------------------------
// Method guard
// ---------------------------------------------------------------------------

test("returns 405 for non-POST requests", async () => {
  const handler = loadHandler();
  const req = { method: "GET", body: {}, headers: {} };
  const res = makeRes();
  await handler(req, res);
  expect(res.statusCode).toBe(405);
});

// ---------------------------------------------------------------------------
// Missing passphrase in body
// ---------------------------------------------------------------------------

test("returns 400 when passphrase is missing from body", async () => {
  const handler = loadHandler();
  const req = makeReq({});
  const res = makeRes();
  await handler(req, res);
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toMatch(/passphrase is required/i);
});

test("returns 400 when passphrase is not a string", async () => {
  const handler = loadHandler();
  const req = makeReq({ passphrase: 12345 });
  const res = makeRes();
  await handler(req, res);
  expect(res.statusCode).toBe(400);
});

// ---------------------------------------------------------------------------
// Missing signing key
// ---------------------------------------------------------------------------

test("returns 500 when ADMIN_SESSION_SIGNING_KEY and ADMIN_JWT_SECRET are both absent", async () => {
  delete process.env.ADMIN_SESSION_SIGNING_KEY;
  delete process.env.ADMIN_JWT_SECRET;
  const handler = loadHandler();
  const req = makeReq({ passphrase: "anything" });
  const res = makeRes();
  await handler(req, res);
  expect(res.statusCode).toBe(500);
  expect(res.body.error).toMatch(/ADMIN_SESSION_SIGNING_KEY/i);
});

// ---------------------------------------------------------------------------
// TEST_ADMIN_MODE
// ---------------------------------------------------------------------------

describe("TEST_ADMIN_MODE=true", () => {
  beforeEach(() => {
    process.env.TEST_ADMIN_MODE = "true";
    process.env.ADMIN_PANEL_SECRET = "test-secret";
  });

  test("accepts ADMIN_PANEL_SECRET as passphrase", async () => {
    const handler = loadHandler();
    const req = makeReq({ passphrase: "test-secret" });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.needs_setup).toBe(false);
    expect(setAdminSessionCookie).toHaveBeenCalledTimes(1);
  });

  test("falls back to iiskills123 when ADMIN_PANEL_SECRET is unset", async () => {
    delete process.env.ADMIN_PANEL_SECRET;
    const handler = loadHandler();
    const req = makeReq({ passphrase: "iiskills123" });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.needs_setup).toBe(false);
  });

  test("rejects wrong passphrase in TEST_ADMIN_MODE", async () => {
    const handler = loadHandler();
    const req = makeReq({ passphrase: "wrong-passphrase" });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid passphrase");
  });
});

// ---------------------------------------------------------------------------
// Production mode — ADMIN_PANEL_SECRET override
// ---------------------------------------------------------------------------

describe("Production mode — ADMIN_PANEL_SECRET override", () => {
  beforeEach(() => {
    process.env.ADMIN_PANEL_SECRET = "my-emergency-secret";
  });

  test("accepts ADMIN_PANEL_SECRET and returns needs_setup=false", async () => {
    const handler = loadHandler();
    const req = makeReq({ passphrase: "my-emergency-secret" });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.needs_setup).toBe(false);
    expect(setAdminSessionCookie).toHaveBeenCalledTimes(1);
  });

  test("falls through to bcrypt when ADMIN_PANEL_SECRET does not match", async () => {
    // Provide a stored hash; bcrypt resolves to true for the correct passphrase
    fs.readFileSync.mockReturnValue(
      JSON.stringify({ admin_passphrase_hash: "$2b$12$fakehash" })
    );
    bcrypt.compare.mockResolvedValue(true);

    const handler = loadHandler();
    // Enter neither ADMIN_PANEL_SECRET nor bootstrap — just a "regular" passphrase
    const req = makeReq({ passphrase: "my-file-passphrase" });
    const res = makeRes();
    await handler(req, res);
    expect(bcrypt.compare).toHaveBeenCalledWith("my-file-passphrase", "$2b$12$fakehash");
    expect(res.statusCode).toBe(200);
  });
});

// ---------------------------------------------------------------------------
// Production mode — bcrypt hash file
// ---------------------------------------------------------------------------

describe("Production mode — bcrypt hash file", () => {
  beforeEach(() => {
    // No ADMIN_PANEL_SECRET — pure file-based path
    delete process.env.ADMIN_PANEL_SECRET;
    fs.readFileSync.mockReturnValue(
      JSON.stringify({ admin_passphrase_hash: "$2b$12$realhashinfile" })
    );
  });

  test("accepts correct passphrase matching stored hash", async () => {
    bcrypt.compare.mockResolvedValue(true);
    const handler = loadHandler();
    const req = makeReq({ passphrase: "correct-passphrase" });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.needs_setup).toBe(false);
    expect(setAdminSessionCookie).toHaveBeenCalledTimes(1);
  });

  test("rejects wrong passphrase (bcrypt mismatch)", async () => {
    bcrypt.compare.mockResolvedValue(false);
    const handler = loadHandler();
    const req = makeReq({ passphrase: "wrong-passphrase" });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid passphrase");
    expect(setAdminSessionCookie).not.toHaveBeenCalled();
  });

  test("reads hash from ADMIN_DATA_FILE when env var is set", async () => {
    process.env.ADMIN_DATA_FILE = "/custom/path/admin.json";
    bcrypt.compare.mockResolvedValue(true);
    const handler = loadHandler();
    const req = makeReq({ passphrase: "correct-passphrase" });
    const res = makeRes();
    await handler(req, res);
    expect(fs.readFileSync).toHaveBeenCalledWith("/custom/path/admin.json", "utf8");
    expect(res.statusCode).toBe(200);
  });

  test("falls through to bootstrap when file exists but has no hash key", async () => {
    // File exists but no admin_passphrase_hash field
    fs.readFileSync.mockReturnValue(JSON.stringify({ some_other_key: "value" }));
    // Without hash, bootstrap passphrase should work
    const handler = loadHandler();
    const req = makeReq({ passphrase: "iiskills123" });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.needs_setup).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Production mode — bootstrap (no hash, no ADMIN_PANEL_SECRET)
// ---------------------------------------------------------------------------

describe("Production mode — bootstrap passphrase (no hash file)", () => {
  beforeEach(() => {
    delete process.env.ADMIN_PANEL_SECRET;
    // fs already mocks ENOENT in outer beforeEach
  });

  test("accepts bootstrap passphrase and returns needs_setup=true", async () => {
    const handler = loadHandler();
    const req = makeReq({ passphrase: "iiskills123" });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.needs_setup).toBe(true);
    expect(setAdminSessionCookie).toHaveBeenCalledTimes(1);
  });

  test("rejects any passphrase other than bootstrap passphrase", async () => {
    const handler = loadHandler();
    const req = makeReq({ passphrase: "someOtherPassphrase" });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("Invalid passphrase");
    expect(setAdminSessionCookie).not.toHaveBeenCalled();
  });

  test("rejects bootstrap passphrase with wrong casing", async () => {
    const handler = loadHandler();
    const req = makeReq({ passphrase: "IISKILLS123" });
    const res = makeRes();
    await handler(req, res);
    expect(res.statusCode).toBe(401);
  });

  test("handles corrupted admin.json (invalid JSON) by falling back to bootstrap", async () => {
    fs.readFileSync.mockReturnValue("not-valid-json{{{");
    const handler = loadHandler();
    const req = makeReq({ passphrase: "iiskills123" });
    const res = makeRes();
    await handler(req, res);
    // JSON.parse throws → getAdminPassphraseHash returns null → bootstrap path
    expect(res.statusCode).toBe(200);
    expect(res.body.needs_setup).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Production mode — ADMIN_PANEL_SECRET set + bootstrap passphrase fallthrough
// ---------------------------------------------------------------------------

test("bootstrap passphrase still works when ADMIN_PANEL_SECRET is set but does not match", async () => {
  process.env.ADMIN_PANEL_SECRET = "different-emergency-secret";
  // No admin.json → ENOENT is already mocked
  const handler = loadHandler();
  const req = makeReq({ passphrase: "iiskills123" });
  const res = makeRes();
  await handler(req, res);
  // ADMIN_PANEL_SECRET != "iiskills123", no hash, bootstrap passes
  expect(res.statusCode).toBe(200);
  expect(res.body.needs_setup).toBe(true);
});
