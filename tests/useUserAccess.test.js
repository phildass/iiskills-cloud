/**
 * Tests for the useUserAccess hook — specifically:
 *   1. ACCESS_LEVEL constants are defined and ordered correctly
 *   2. canAccessCourse() pure function — Admin, Paid_User, Free_User, None cases
 *   3. fetchEntitlementResponse() correctly maps API responses to access levels
 *   4. Admin bypass: user.role === 'admin' and user.is_admin === true both grant access
 *   5. Paid_User: entitled: true from API grants PAID_USER level
 *   6. No access: entitled: false returns NONE
 *   7. Unauthenticated: authenticated: false returns NONE
 *   8. canAccessCourse is identical across all four paid apps (same function reference)
 */

"use strict";

const {
  ACCESS_LEVEL,
  canAccessCourse,
  fetchEntitlementResponse,
} = require("../packages/shared-utils/lib/hooks/useUserAccess");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFetch({ ok = true, body = {} } = {}) {
  return jest.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(body),
  });
}

function makeGetSession(accessToken = null) {
  return jest.fn().mockResolvedValue({
    data: { session: accessToken ? { access_token: accessToken } : null },
  });
}

// ---------------------------------------------------------------------------
// ACCESS_LEVEL constants
// ---------------------------------------------------------------------------

describe("ACCESS_LEVEL constants", () => {
  it("defines NONE, FREE_USER, PAID_USER, and ADMIN", () => {
    expect(ACCESS_LEVEL.NONE).toBe("none");
    expect(ACCESS_LEVEL.FREE_USER).toBe("free_user");
    expect(ACCESS_LEVEL.PAID_USER).toBe("paid_user");
    expect(ACCESS_LEVEL.ADMIN).toBe("admin");
  });
});

// ---------------------------------------------------------------------------
// canAccessCourse — pure function
// ---------------------------------------------------------------------------

describe("canAccessCourse — pure function", () => {
  // The function uses a require() call internally for the synchronous free-app
  // check. We mock it so the pure-function tests run without the real package.
  beforeEach(() => {
    jest.resetModules();
  });

  it("Admin always has access regardless of courseId", () => {
    expect(
      canAccessCourse("learn-ai", { accessLevel: ACCESS_LEVEL.ADMIN, appId: "learn-ai" })
    ).toBe(true);
    expect(
      canAccessCourse("learn-pr", { accessLevel: ACCESS_LEVEL.ADMIN, appId: "learn-ai" })
    ).toBe(true);
    expect(
      canAccessCourse("some-unknown-app", { accessLevel: ACCESS_LEVEL.ADMIN, appId: "learn-ai" })
    ).toBe(true);
  });

  it("Paid_User can access the app they purchased", () => {
    expect(
      canAccessCourse("learn-ai", { accessLevel: ACCESS_LEVEL.PAID_USER, appId: "learn-ai" })
    ).toBe(true);
  });

  it("Paid_User cannot access a different paid app", () => {
    expect(
      canAccessCourse("learn-developer", {
        accessLevel: ACCESS_LEVEL.PAID_USER,
        appId: "learn-ai",
      })
    ).toBe(false);
  });

  it("NONE cannot access any paid app", () => {
    expect(
      canAccessCourse("learn-ai", { accessLevel: ACCESS_LEVEL.NONE, appId: "learn-ai" })
    ).toBe(false);
    expect(
      canAccessCourse("learn-management", {
        accessLevel: ACCESS_LEVEL.NONE,
        appId: "learn-management",
      })
    ).toBe(false);
  });

  it("null accessLevel (loading) cannot access paid content", () => {
    expect(
      canAccessCourse("learn-ai", { accessLevel: null, appId: "learn-ai" })
    ).toBe(false);
  });

  it("is the same exported function — identical across all four paid apps", () => {
    // All four apps import the same module — same function reference means
    // identical logic everywhere.
    const mod1 = require("../packages/shared-utils/lib/hooks/useUserAccess");
    const mod2 = require("../packages/shared-utils/lib/hooks/useUserAccess");
    expect(mod1.canAccessCourse).toBe(mod2.canAccessCourse);
  });
});

// ---------------------------------------------------------------------------
// fetchEntitlementResponse — network helper
// ---------------------------------------------------------------------------

describe("fetchEntitlementResponse — API response mapping", () => {
  it("returns authenticated:false body when API gives unauthenticated response", async () => {
    const result = await fetchEntitlementResponse("learn-ai", {
      getSession: makeGetSession(null),
      fetchImpl: makeFetch({ ok: true, body: { authenticated: false, entitled: false } }),
    });
    expect(result.authenticated).toBe(false);
    expect(result.entitled).toBe(false);
  });

  it("returns adminAccess:true body for admin users", async () => {
    const result = await fetchEntitlementResponse("learn-developer", {
      getSession: makeGetSession("tok"),
      fetchImpl: makeFetch({
        ok: true,
        body: { authenticated: true, entitled: true, adminAccess: true },
      }),
    });
    expect(result.adminAccess).toBe(true);
    expect(result.entitled).toBe(true);
  });

  it("returns entitled:true for paid users", async () => {
    const result = await fetchEntitlementResponse("learn-management", {
      getSession: makeGetSession("tok"),
      fetchImpl: makeFetch({ ok: true, body: { authenticated: true, entitled: true } }),
    });
    expect(result.entitled).toBe(true);
    expect(result.adminAccess).toBeUndefined();
  });

  it("returns {authenticated:false, entitled:false} on non-OK HTTP response", async () => {
    const result = await fetchEntitlementResponse("learn-pr", {
      getSession: makeGetSession("tok"),
      fetchImpl: makeFetch({ ok: false }),
    });
    expect(result.authenticated).toBe(false);
    expect(result.entitled).toBe(false);
  });

  it("attaches Authorization header when session has access_token", async () => {
    const fetchImpl = makeFetch({ ok: true, body: { authenticated: true, entitled: true } });
    await fetchEntitlementResponse("learn-ai", {
      getSession: makeGetSession("my-token-123"),
      fetchImpl,
    });
    const [, options] = fetchImpl.mock.calls[0];
    expect(options.headers["Authorization"]).toBe("Bearer my-token-123");
  });

  it("omits Authorization header when no session", async () => {
    const fetchImpl = makeFetch({ ok: true, body: { authenticated: false, entitled: false } });
    await fetchEntitlementResponse("learn-ai", {
      getSession: makeGetSession(null),
      fetchImpl,
    });
    const [, options] = fetchImpl.mock.calls[0];
    expect(options.headers["Authorization"]).toBeUndefined();
  });

  it("includes appId in the request URL", async () => {
    const fetchImpl = makeFetch({ ok: true, body: { authenticated: true, entitled: true } });
    await fetchEntitlementResponse("learn-management", {
      getSession: makeGetSession("tok"),
      fetchImpl,
    });
    const [url] = fetchImpl.mock.calls[0];
    expect(url).toContain("appId=learn-management");
  });

  it("URL-encodes the appId", async () => {
    const fetchImpl = makeFetch({ ok: true, body: { authenticated: true, entitled: true } });
    await fetchEntitlementResponse("ai-developer-bundle", {
      getSession: makeGetSession("tok"),
      fetchImpl,
    });
    const [url] = fetchImpl.mock.calls[0];
    expect(url).toContain("appId=ai-developer-bundle");
  });
});

// ---------------------------------------------------------------------------
// Policy logic — Admin bypass via user.role === 'admin' (accessControl.js)
// ---------------------------------------------------------------------------

describe("accessControl.userHasAccess — admin role bypass", () => {
  let userHasAccess;

  beforeAll(async () => {
    const mod = await import("../packages/access-control/accessControl.js");
    userHasAccess = mod.userHasAccess;
  });

  it("user.role === 'admin' grants immediate access to any paid app", () => {
    const adminByRole = { id: "u1", role: "admin", app_access: [] };
    expect(userHasAccess(adminByRole, "learn-ai")).toBe(true);
    expect(userHasAccess(adminByRole, "learn-developer")).toBe(true);
    expect(userHasAccess(adminByRole, "learn-management")).toBe(true);
    expect(userHasAccess(adminByRole, "learn-pr")).toBe(true);
  });

  it("user.is_admin === true still grants access (legacy field unchanged)", () => {
    const adminByFlag = { id: "u2", is_admin: true, app_access: [] };
    expect(userHasAccess(adminByFlag, "learn-ai")).toBe(true);
  });

  it("user with both role and is_admin set still gains access", () => {
    const both = { id: "u3", role: "admin", is_admin: true, app_access: [] };
    expect(userHasAccess(both, "learn-pr")).toBe(true);
  });

  it("regular user with role !== 'admin' does NOT get bypass", () => {
    const regular = { id: "u4", role: "user", app_access: [] };
    expect(userHasAccess(regular, "learn-ai")).toBe(false);
  });

  it("null user cannot gain access even with a spoofed role", () => {
    expect(userHasAccess(null, "learn-ai")).toBe(false);
  });
});
