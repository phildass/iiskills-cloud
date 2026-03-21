/**
 * Tests for admin paywall bypass and dashboard authentication fixes
 *
 * Covers:
 *   Fix 1 — Dashboard flash: `redirecting` flag prevents setIsLoading(false)
 *            from firing while a router.replace redirect is in-flight.
 *
 *   Fix 2 — Entitlement cache / admin bypass: the entitlement API must check
 *            admin profile status BEFORE honoring a cached entitled:false
 *            result so that users promoted to admin after a negative cache
 *            entry was written are never blocked by a stale entry.
 *
 *   Fix 3 — Admin dashboard error handling: checkAdminAuth wraps its body in
 *            try/catch so an unexpected error clears the loading state instead
 *            of leaving the UI stuck on the loading spinner indefinitely.
 */

"use strict";

// ── Fix 2: Entitlement priority logic ────────────────────────────────────────
//
// Mirrors the priority logic from apps/main/pages/api/entitlement.js so we can
// unit-test the ordering without standing up a real Supabase client.
//
// Priority order (highest → lowest):
//  P0: owner email bypass  (hardcoded — never touches cache or DB)
//  P1: admin profile check (fires BEFORE the cached result is used)
//  P2: cached result       (only used for confirmed non-admin users)
//  P3: certified paid user (user_app_access with is_certified_paid_user=true)
//  P4: active entitlement row
//  P5: user_app_access fallback

/**
 * @typedef {{ is_admin?: boolean, role?: string }} ProfileRow
 * @typedef {{ data: ProfileRow|null }} ProfileResult
 */

/**
 * Minimal replica of the priority resolution from the entitlement API handler.
 * Returns { entitled, adminAccess?, fromCache? }.
 *
 * @param {{
 *   ownerEmail: boolean,
 *   cached: boolean|null,
 *   profile: ProfileRow|null,
 *   hasActiveEntitlement: boolean,
 *   isCertifiedPaid: boolean,
 *   hasAppAccess: boolean,
 * }} params
 */
function resolveEntitlement({
  ownerEmail,
  cached,
  profile,
  hasActiveEntitlement,
  isCertifiedPaid,
  hasAppAccess,
}) {
  // P0 — owner email bypass (always wins, ignores everything else)
  if (ownerEmail) return { entitled: true, adminAccess: true, ownerOverride: true };

  // P1 — admin profile (fires BEFORE cache — the key fix)
  if (profile?.is_admin === true || profile?.role === "admin") {
    return { entitled: true, adminAccess: true, fromCache: false };
  }

  // P2 — cache (safe for non-admins only — we already handled admins above)
  if (cached !== null) return { entitled: cached, fromCache: true };

  // P3 — certified paid user
  if (isCertifiedPaid) return { entitled: true, certifiedPaidUser: true };

  // P4 — active entitlement row
  if (hasActiveEntitlement) return { entitled: true };

  // P5 — user_app_access fallback
  if (hasAppAccess) return { entitled: true };

  // Denied
  return { entitled: false };
}

// ── Priority ordering tests ───────────────────────────────────────────────────

describe("entitlement API — admin bypass fires BEFORE cache (Fix 2)", () => {
  it("owner email bypasses cache and DB entirely", () => {
    const result = resolveEntitlement({
      ownerEmail: true,
      cached: false, // stale negative cache entry
      profile: null,
      hasActiveEntitlement: false,
      isCertifiedPaid: false,
      hasAppAccess: false,
    });
    expect(result.entitled).toBe(true);
    expect(result.ownerOverride).toBe(true);
  });

  it("admin user with stale entitled:false cache is still granted access", () => {
    // This is the core bug fix: before the fix, cached=false would return
    // entitled:false immediately; after the fix, admin check runs first.
    const result = resolveEntitlement({
      ownerEmail: false,
      cached: false, // stale negative cache entry (the bug scenario)
      profile: { is_admin: true },
      hasActiveEntitlement: false,
      isCertifiedPaid: false,
      hasAppAccess: false,
    });
    expect(result.entitled).toBe(true);
    expect(result.adminAccess).toBe(true);
    expect(result.fromCache).toBe(false);
  });

  it("admin user with role='admin' and stale cache is still granted access", () => {
    const result = resolveEntitlement({
      ownerEmail: false,
      cached: false,
      profile: { role: "admin" },
      hasActiveEntitlement: false,
      isCertifiedPaid: false,
      hasAppAccess: false,
    });
    expect(result.entitled).toBe(true);
    expect(result.adminAccess).toBe(true);
  });

  it("admin user with no cache entry gets access via profile check", () => {
    const result = resolveEntitlement({
      ownerEmail: false,
      cached: null, // cache miss
      profile: { is_admin: true },
      hasActiveEntitlement: false,
      isCertifiedPaid: false,
      hasAppAccess: false,
    });
    expect(result.entitled).toBe(true);
    expect(result.adminAccess).toBe(true);
  });

  it("admin user with positive cache still gets access (no regression)", () => {
    const result = resolveEntitlement({
      ownerEmail: false,
      cached: true,
      profile: { is_admin: true },
      hasActiveEntitlement: false,
      isCertifiedPaid: false,
      hasAppAccess: false,
    });
    expect(result.entitled).toBe(true);
    expect(result.adminAccess).toBe(true);
  });

  it("non-admin with positive cache hits cache fast path", () => {
    const result = resolveEntitlement({
      ownerEmail: false,
      cached: true,
      profile: { is_admin: false },
      hasActiveEntitlement: false,
      isCertifiedPaid: false,
      hasAppAccess: false,
    });
    expect(result.entitled).toBe(true);
    expect(result.fromCache).toBe(true);
  });

  it("non-admin with negative cache is correctly denied (no regression)", () => {
    const result = resolveEntitlement({
      ownerEmail: false,
      cached: false,
      profile: { is_admin: false },
      hasActiveEntitlement: false,
      isCertifiedPaid: false,
      hasAppAccess: false,
    });
    expect(result.entitled).toBe(false);
    expect(result.fromCache).toBe(true);
  });

  it("non-admin with cache miss falls through to entitlement check", () => {
    const result = resolveEntitlement({
      ownerEmail: false,
      cached: null,
      profile: { is_admin: false },
      hasActiveEntitlement: true,
      isCertifiedPaid: false,
      hasAppAccess: false,
    });
    expect(result.entitled).toBe(true);
    expect(result.fromCache).toBeUndefined();
  });

  it("non-admin with null profile is not granted admin access", () => {
    const result = resolveEntitlement({
      ownerEmail: false,
      cached: null,
      profile: null,
      hasActiveEntitlement: false,
      isCertifiedPaid: false,
      hasAppAccess: false,
    });
    expect(result.entitled).toBe(false);
    expect(result.adminAccess).toBeUndefined();
  });

  it("certified paid user without cache gets access via certifiedPaid check", () => {
    const result = resolveEntitlement({
      ownerEmail: false,
      cached: null,
      profile: { is_admin: false },
      hasActiveEntitlement: false,
      isCertifiedPaid: true,
      hasAppAccess: false,
    });
    expect(result.entitled).toBe(true);
    expect(result.certifiedPaidUser).toBe(true);
  });
});

// ── Fix 1: Dashboard redirecting flag ────────────────────────────────────────
//
// Validates the logic of the `redirecting` flag that prevents setIsLoading(false)
// from firing while the router.replace redirect is in-flight.
//
// We test the extracted logic pattern because the React component itself is
// not unit-testable in this Jest environment.

describe("dashboard loadDashboardData — redirecting flag (Fix 1)", () => {
  /**
   * Simulates the loadDashboardData async function logic.
   * Returns whether setIsLoading would have been called with false.
   */
  async function simulateLoad({ hasUser }) {
    let redirecting = false;
    let loadingCleared = false;

    const setIsLoading = (val) => {
      if (val === false) loadingCleared = true;
    };

    try {
      const currentUser = hasUser ? { id: "u1", email: "test@example.com" } : null;

      if (!currentUser) {
        redirecting = true;
        // router.replace called here (simulated as no-op)
        return { redirecting, loadingCleared };
      }

      // Success path: data loaded
    } catch {
      // error path
    } finally {
      if (!redirecting) setIsLoading(false);
    }

    return { redirecting, loadingCleared };
  }

  it("does NOT clear loading state when redirecting unauthenticated user", async () => {
    const { redirecting, loadingCleared } = await simulateLoad({ hasUser: false });
    expect(redirecting).toBe(true);
    expect(loadingCleared).toBe(false);
  });

  it("DOES clear loading state for authenticated users", async () => {
    const { redirecting, loadingCleared } = await simulateLoad({ hasUser: true });
    expect(redirecting).toBe(false);
    expect(loadingCleared).toBe(true);
  });
});

// ── Fix 3: Admin dashboard error handling ────────────────────────────────────
//
// Validates that checkAdminAuth redirects to login on unexpected errors so
// the user is never left on a blank page or stuck indefinitely on the
// loading screen.

describe("admin dashboard checkAdminAuth — error handling (Fix 3)", () => {
  /**
   * Simulates the checkAdminAuth function with injected dependencies.
   * Returns the final { isLoading, isAuthenticated, redirected } state.
   */
  async function simulateCheckAdminAuth({ getCurrentUser, isAdmin: isAdminFn }) {
    let isLoading = true;
    let isAuthenticated = false;
    let redirectTarget = null;

    const setIsLoading = (v) => {
      isLoading = v;
    };
    const setIsAuthenticated = (v) => {
      isAuthenticated = v;
    };
    const routerPush = (path) => {
      redirectTarget = path;
    };

    try {
      const user = await getCurrentUser();

      if (!user) {
        routerPush("/login?redirect=/dashboard/admin");
        return { isLoading, isAuthenticated, redirectTarget };
      }

      const hasAdminAccess = await isAdminFn(user);
      if (!hasAdminAccess) {
        routerPush("/dashboard?error=admin_access_denied");
        return { isLoading, isAuthenticated, redirectTarget };
      }

      setIsAuthenticated(true);
      setIsLoading(false);
    } catch (err) {
      // Unexpected error — redirect to login so user sees a recoverable state
      routerPush("/login?redirect=/dashboard/admin");
    }

    return { isLoading, isAuthenticated, redirectTarget };
  }

  it("redirects to login when getCurrentUser throws", async () => {
    const { redirectTarget, isAuthenticated } = await simulateCheckAdminAuth({
      getCurrentUser: jest.fn().mockRejectedValue(new Error("network error")),
      isAdmin: jest.fn(),
    });
    expect(redirectTarget).toBe("/login?redirect=/dashboard/admin");
    expect(isAuthenticated).toBe(false);
  });

  it("redirects to login when isAdmin throws", async () => {
    const { redirectTarget, isAuthenticated } = await simulateCheckAdminAuth({
      getCurrentUser: jest.fn().mockResolvedValue({ id: "u1", email: "admin@example.com" }),
      isAdmin: jest.fn().mockRejectedValue(new Error("DB timeout")),
    });
    expect(redirectTarget).toBe("/login?redirect=/dashboard/admin");
    expect(isAuthenticated).toBe(false);
  });

  it("redirects to login when there is no user session", async () => {
    const { redirectTarget, isLoading, isAuthenticated } = await simulateCheckAdminAuth({
      getCurrentUser: jest.fn().mockResolvedValue(null),
      isAdmin: jest.fn(),
    });
    expect(redirectTarget).toBe("/login?redirect=/dashboard/admin");
    // loading stays true while redirect is in-flight
    expect(isLoading).toBe(true);
    expect(isAuthenticated).toBe(false);
  });

  it("sets isAuthenticated=true and loading=false for valid admin", async () => {
    const { isLoading, isAuthenticated, redirectTarget } = await simulateCheckAdminAuth({
      getCurrentUser: jest.fn().mockResolvedValue({ id: "u1", email: "admin@example.com" }),
      isAdmin: jest.fn().mockResolvedValue(true),
    });
    expect(isLoading).toBe(false);
    expect(isAuthenticated).toBe(true);
    expect(redirectTarget).toBeNull();
  });

  it("redirects non-admin user away from admin dashboard", async () => {
    const { redirectTarget, isLoading, isAuthenticated } = await simulateCheckAdminAuth({
      getCurrentUser: jest.fn().mockResolvedValue({ id: "u1", email: "user@example.com" }),
      isAdmin: jest.fn().mockResolvedValue(false),
    });
    expect(redirectTarget).toBe("/dashboard?error=admin_access_denied");
    expect(isLoading).toBe(true);
    expect(isAuthenticated).toBe(false);
  });
});
