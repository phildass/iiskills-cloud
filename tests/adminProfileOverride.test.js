/**
 * Tests for POST /api/admin/profile-override
 *
 * Covers:
 *   - 405 for non-POST requests
 *   - 403 when not authenticated as admin
 *   - 400 when userId is missing
 *   - 400 when fields is missing or empty
 *   - 400 when unknown/non-overridable fields are provided
 *   - 404 when user is not found
 *   - 200 with updated profile when valid override is submitted
 *   - Audit event is written with previous and new values
 */

"use strict";

// ---------------------------------------------------------------------------
// Environment setup
// ---------------------------------------------------------------------------
process.env.ADMIN_SESSION_SIGNING_KEY = "test-signing-key-minimum-32-chars-padding";
process.env.ADMIN_AUTH_DISABLED = "true"; // bypass auth in most tests
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key";

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

jest.mock("../apps/main/lib/adminAuth", () => {
  const actual = jest.requireActual("../apps/main/lib/adminAuth");
  return {
    ...actual,
    validateAdminRequestAsync: jest.fn().mockResolvedValue({ valid: true }),
    createServiceRoleClient: jest.fn(),
    getActorInfo: jest.fn().mockResolvedValue({
      actorUserId: null,
      actorEmail: null,
      actorType: "password_admin",
    }),
    writeAuditEvent: jest.fn().mockResolvedValue(undefined),
  };
});

const {
  validateAdminRequestAsync,
  createServiceRoleClient,
  writeAuditEvent,
} = require("../apps/main/lib/adminAuth");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeRes() {
  const res = { statusCode: null, body: null, headers: {} };
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

function loadHandler() {
  let handler;
  jest.isolateModules(() => {
    handler = require("../apps/main/pages/api/admin/profile-override").default;
  });
  return handler;
}

/** Build a mock Supabase service-role client */
function makeSupabase({
  profile = null,
  fetchError = null,
  updateError = null,
  updatedProfile = null,
} = {}) {
  const chain = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockResolvedValue({ data: profile, error: fetchError }),
    update: jest.fn().mockReturnThis(),
  };
  // For the update chain, maybeSingle returns the updated profile
  const updateChain = {
    eq: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    maybeSingle: jest
      .fn()
      .mockResolvedValue({ data: updatedProfile || profile, error: updateError }),
  };
  chain.update.mockReturnValue(updateChain);

  const sb = {
    from: jest.fn((table) => {
      if (table === "profiles") return chain;
      return chain;
    }),
    _chain: chain,
    _updateChain: updateChain,
  };
  return sb;
}

beforeEach(() => {
  jest.clearAllMocks();
  validateAdminRequestAsync.mockResolvedValue({ valid: true });
  writeAuditEvent.mockResolvedValue(undefined);
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
// Auth guard
// ---------------------------------------------------------------------------

test("returns 403 when admin session is invalid", async () => {
  validateAdminRequestAsync.mockResolvedValue({
    valid: false,
    reason: "Unauthorized",
    status: 401,
  });
  const handler = loadHandler();
  const req = { method: "POST", body: {}, headers: {} };
  const res = makeRes();
  await handler(req, res);
  expect(res.statusCode).toBe(401);
});

// ---------------------------------------------------------------------------
// Input validation
// ---------------------------------------------------------------------------

test("returns 400 when userId is missing", async () => {
  createServiceRoleClient.mockReturnValue(makeSupabase());
  const handler = loadHandler();
  const req = { method: "POST", body: { fields: { first_name: "Test" } }, headers: {} };
  const res = makeRes();
  await handler(req, res);
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toMatch(/userId/i);
});

test("returns 400 when fields is missing", async () => {
  createServiceRoleClient.mockReturnValue(makeSupabase());
  const handler = loadHandler();
  const req = { method: "POST", body: { userId: "some-uuid" }, headers: {} };
  const res = makeRes();
  await handler(req, res);
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toMatch(/fields/i);
});

test("returns 400 when fields is an empty object", async () => {
  createServiceRoleClient.mockReturnValue(makeSupabase());
  const handler = loadHandler();
  const req = { method: "POST", body: { userId: "some-uuid", fields: {} }, headers: {} };
  const res = makeRes();
  await handler(req, res);
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toMatch(/at least one/i);
});

test("returns 400 when unknown field is provided", async () => {
  createServiceRoleClient.mockReturnValue(makeSupabase());
  const handler = loadHandler();
  const req = {
    method: "POST",
    body: { userId: "some-uuid", fields: { is_admin: true, is_paid_user: true } },
    headers: {},
  };
  const res = makeRes();
  await handler(req, res);
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toMatch(/non-overridable/i);
});

// ---------------------------------------------------------------------------
// User not found
// ---------------------------------------------------------------------------

test("returns 404 when user profile does not exist", async () => {
  const sb = makeSupabase({ profile: null, fetchError: null });
  createServiceRoleClient.mockReturnValue(sb);
  const handler = loadHandler();
  const req = {
    method: "POST",
    body: { userId: "missing-uuid", fields: { first_name: "Alice" }, reason: "test" },
    headers: {},
  };
  const res = makeRes();
  await handler(req, res);
  expect(res.statusCode).toBe(404);
  expect(res.body.error).toMatch(/not found/i);
});

// ---------------------------------------------------------------------------
// Successful override
// ---------------------------------------------------------------------------

test("returns 200 and updated profile on valid override", async () => {
  const existingProfile = {
    id: "user-123",
    first_name: "OldFirst",
    last_name: "OldLast",
    phone: "9999999999",
  };
  const updatedProfile = { ...existingProfile, first_name: "NewFirst" };
  const sb = makeSupabase({ profile: existingProfile, updatedProfile });
  createServiceRoleClient.mockReturnValue(sb);

  const handler = loadHandler();
  const req = {
    method: "POST",
    body: {
      userId: "user-123",
      fields: { first_name: "NewFirst" },
      reason: "User reported typo",
    },
    headers: {},
  };
  const res = makeRes();
  await handler(req, res);
  expect(res.statusCode).toBe(200);
  expect(res.body.profile.first_name).toBe("NewFirst");
});

test("writes audit event with previous and new values on successful override", async () => {
  const existingProfile = {
    id: "user-123",
    first_name: "OldFirst",
    phone: "9999999999",
  };
  const updatedProfile = { ...existingProfile, first_name: "NewFirst" };
  const sb = makeSupabase({ profile: existingProfile, updatedProfile });
  createServiceRoleClient.mockReturnValue(sb);

  const handler = loadHandler();
  const req = {
    method: "POST",
    body: {
      userId: "user-123",
      fields: { first_name: "NewFirst" },
      reason: "Correction requested by user",
    },
    headers: {},
  };
  const res = makeRes();
  await handler(req, res);

  expect(writeAuditEvent).toHaveBeenCalledTimes(1);
  const auditCall = writeAuditEvent.mock.calls[0][1];
  expect(auditCall.action).toBe("admin_profile_override");
  expect(auditCall.targetUserId).toBe("user-123");
  expect(auditCall.metadata.fieldsChanged).toEqual(["first_name"]);
  expect(auditCall.metadata.previousValues).toEqual({ first_name: "OldFirst" });
  expect(auditCall.metadata.newValues).toEqual({ first_name: "NewFirst" });
  expect(auditCall.metadata.reason).toBe("Correction requested by user");
});

// ---------------------------------------------------------------------------
// DB error handling
// ---------------------------------------------------------------------------

test("returns 500 when Supabase update fails", async () => {
  const existingProfile = { id: "user-123", first_name: "Old" };
  const sb = makeSupabase({
    profile: existingProfile,
    updateError: { message: "permission denied" },
  });
  createServiceRoleClient.mockReturnValue(sb);

  const handler = loadHandler();
  const req = {
    method: "POST",
    body: { userId: "user-123", fields: { first_name: "New" }, reason: "test" },
    headers: {},
  };
  const res = makeRes();
  await handler(req, res);
  expect(res.statusCode).toBe(500);
  expect(res.body.error).toMatch(/failed to update/i);
});
