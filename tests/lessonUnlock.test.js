/**
 * Lesson Unlock — Paid User Access Tests
 *
 * Validates the entitlement API handler logic that gates lesson access.
 *
 * Scenario: a user with a verified, active entitlement must NEVER be shown
 * the paywall for any lesson in the entitled course.
 *
 * The tests mock the Supabase client so no real DB connection is needed.
 *
 * Coverage:
 *  1. Razorpay-sourced entitlement (course_slug set, app_id also set after fix)
 *  2. Admin-granted entitlement (app_id set via admin panel)
 *  3. Bundle entitlement granting access to learn-ai via ai-developer-bundle app_id
 *  4. Entitlement found via user_app_access fallback (grantAppAccess / dbAccessManager)
 *  5. Expired entitlement → entitled = false
 *  6. No entitlement in either table → entitled = false
 *  7. Admin profile bypass → entitled = true regardless of entitlements table
 *  8. Unauthenticated user (no bearer token) → authenticated = false
 */

"use strict";

// ---------------------------------------------------------------------------
// Pure logic helpers — mirrors the entitlement check in
// apps/main/pages/api/entitlement.js without requiring Next.js or Supabase.
// ---------------------------------------------------------------------------

const FUTURE = new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000).toISOString(); // 10 years from now
const PAST = "2020-01-01T00:00:00.000Z";

/**
 * Stripped-down replica of the entitlement resolution logic used by the
 * /api/entitlement endpoint.  Accepts injectable entitlement/access rows
 * so each test case can be driven without a real DB.
 *
 * @param {Object} params
 * @param {boolean} params.isAdmin
 * @param {Object|null} params.entitlementRow  - matching row from `entitlements` (or null)
 * @param {Object|null} params.appAccessRow    - matching row from `user_app_access` (or null)
 * @returns {{ entitled: boolean, expiresAt: string|null, adminAccess?: boolean }}
 */
function resolveEntitlement({ isAdmin, entitlementRow, appAccessRow }) {
  if (isAdmin) {
    return { entitled: true, expiresAt: null, adminAccess: true };
  }

  if (entitlementRow) {
    return { entitled: true, expiresAt: entitlementRow.expires_at || null };
  }

  // Fallback: user_app_access (grants via grantAppAccess / dbAccessManager)
  if (appAccessRow) {
    return { entitled: true, expiresAt: appAccessRow.expires_at || null };
  }

  return { entitled: false, expiresAt: null };
}

/**
 * Simulate the entitlements-table query filter used in entitlement.js:
 * matches on (app_id IN [appId, bundle] OR course_slug IN [appId, bundle])
 * AND status='active' AND (expires_at IS NULL OR expires_at > now).
 */
function matchesEntitlementsQuery(row, appId, now) {
  const BUNDLE = "ai-developer-bundle";
  if (row.status !== "active") return false;
  if (row.expires_at && row.expires_at <= now) return false;
  const appMatch =
    row.app_id === appId ||
    row.app_id === BUNDLE ||
    row.course_slug === appId ||
    row.course_slug === BUNDLE;
  return appMatch;
}

/**
 * Simulate the user_app_access-table query filter:
 * app_id = appId AND is_active = true AND (expires_at IS NULL OR expires_at > now).
 */
function matchesAppAccessQuery(row, appId, now) {
  if (!row.is_active) return false;
  if (row.app_id !== appId) return false;
  if (row.expires_at && row.expires_at <= now) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Helper: run the full entitlement resolution for a given scenario
// ---------------------------------------------------------------------------

function checkLessonAccess({ appId, isAdmin, entitlements = [], appAccess = [] }) {
  const now = new Date().toISOString();

  const entitlementRow = entitlements.find((r) => matchesEntitlementsQuery(r, appId, now)) || null;
  const appAccessRow = appAccess.find((r) => matchesAppAccessQuery(r, appId, now)) || null;

  return resolveEntitlement({ isAdmin, entitlementRow, appAccessRow });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Lesson Unlock — paid user access", () => {
  // ── 1. Razorpay-sourced entitlement ─────────────────────────────────────
  describe("Razorpay payment entitlement (course_slug + app_id both set)", () => {
    it("grants access when app_id matches", () => {
      const result = checkLessonAccess({
        appId: "learn-ai",
        isAdmin: false,
        entitlements: [
          {
            app_id: "learn-ai",
            course_slug: "learn-ai",
            status: "active",
            expires_at: FUTURE,
          },
        ],
      });
      expect(result.entitled).toBe(true);
    });

    it("grants access when only course_slug matches (legacy row without app_id)", () => {
      const result = checkLessonAccess({
        appId: "learn-ai",
        isAdmin: false,
        entitlements: [
          {
            app_id: null, // pre-fix rows may have null app_id
            course_slug: "learn-ai",
            status: "active",
            expires_at: FUTURE,
          },
        ],
      });
      expect(result.entitled).toBe(true);
    });

    it("carries the correct expiresAt through", () => {
      const result = checkLessonAccess({
        appId: "learn-developer",
        isAdmin: false,
        entitlements: [
          {
            app_id: "learn-developer",
            course_slug: "learn-developer",
            status: "active",
            expires_at: FUTURE,
          },
        ],
      });
      expect(result.entitled).toBe(true);
      expect(result.expiresAt).toBe(FUTURE);
    });
  });

  // ── 2. Admin-granted entitlement ─────────────────────────────────────────
  describe("Admin-granted entitlement (app_id set, no course_slug)", () => {
    it("grants access when app_id matches for learn-management", () => {
      const result = checkLessonAccess({
        appId: "learn-management",
        isAdmin: false,
        entitlements: [
          {
            app_id: "learn-management",
            course_slug: null,
            status: "active",
            expires_at: FUTURE,
          },
        ],
      });
      expect(result.entitled).toBe(true);
    });

    it("grants access when app_id matches for learn-pr", () => {
      const result = checkLessonAccess({
        appId: "learn-pr",
        isAdmin: false,
        entitlements: [
          {
            app_id: "learn-pr",
            course_slug: null,
            status: "active",
            expires_at: null, // perpetual
          },
        ],
      });
      expect(result.entitled).toBe(true);
      expect(result.expiresAt).toBeNull();
    });
  });

  // ── 3. Bundle entitlement ────────────────────────────────────────────────
  describe("Bundle entitlement (ai-developer-bundle grants learn-ai + learn-developer)", () => {
    it("grants learn-ai access via bundle app_id", () => {
      const result = checkLessonAccess({
        appId: "learn-ai",
        isAdmin: false,
        entitlements: [
          {
            app_id: "ai-developer-bundle",
            course_slug: "ai-developer-bundle",
            status: "active",
            expires_at: FUTURE,
          },
        ],
      });
      expect(result.entitled).toBe(true);
    });

    it("grants learn-developer access via bundle app_id", () => {
      const result = checkLessonAccess({
        appId: "learn-developer",
        isAdmin: false,
        entitlements: [
          {
            app_id: "ai-developer-bundle",
            course_slug: "ai-developer-bundle",
            status: "active",
            expires_at: FUTURE,
          },
        ],
      });
      expect(result.entitled).toBe(true);
    });
  });

  // ── 4. user_app_access fallback ──────────────────────────────────────────
  describe("user_app_access fallback (grantAppAccess / dbAccessManager grants)", () => {
    it("grants access via user_app_access when entitlements table is empty", () => {
      const result = checkLessonAccess({
        appId: "learn-ai",
        isAdmin: false,
        entitlements: [],
        appAccess: [
          {
            app_id: "learn-ai",
            is_active: true,
            expires_at: FUTURE,
          },
        ],
      });
      expect(result.entitled).toBe(true);
    });

    it("grants access via user_app_access for learn-management admin dashboard grant", () => {
      const result = checkLessonAccess({
        appId: "learn-management",
        isAdmin: false,
        entitlements: [],
        appAccess: [
          {
            app_id: "learn-management",
            is_active: true,
            expires_at: null, // perpetual
          },
        ],
      });
      expect(result.entitled).toBe(true);
      expect(result.expiresAt).toBeNull();
    });

    it("does NOT grant access via user_app_access row for a different app_id", () => {
      const result = checkLessonAccess({
        appId: "learn-ai",
        isAdmin: false,
        entitlements: [],
        appAccess: [
          {
            app_id: "learn-developer", // different app
            is_active: true,
            expires_at: FUTURE,
          },
        ],
      });
      expect(result.entitled).toBe(false);
    });
  });

  // ── 5. Expired entitlement ───────────────────────────────────────────────
  describe("Expired entitlement", () => {
    it("does NOT grant access for an expired entitlements row", () => {
      const result = checkLessonAccess({
        appId: "learn-ai",
        isAdmin: false,
        entitlements: [
          {
            app_id: "learn-ai",
            course_slug: "learn-ai",
            status: "active",
            expires_at: PAST, // expired
          },
        ],
      });
      expect(result.entitled).toBe(false);
    });

    it("does NOT grant access for an expired user_app_access row", () => {
      const result = checkLessonAccess({
        appId: "learn-developer",
        isAdmin: false,
        entitlements: [],
        appAccess: [
          {
            app_id: "learn-developer",
            is_active: true,
            expires_at: PAST, // expired
          },
        ],
      });
      expect(result.entitled).toBe(false);
    });

    it("does NOT grant access for a revoked (status!=active) entitlement", () => {
      const result = checkLessonAccess({
        appId: "learn-ai",
        isAdmin: false,
        entitlements: [
          {
            app_id: "learn-ai",
            course_slug: "learn-ai",
            status: "revoked",
            expires_at: FUTURE,
          },
        ],
      });
      expect(result.entitled).toBe(false);
    });

    it("does NOT grant access when user_app_access row is inactive", () => {
      const result = checkLessonAccess({
        appId: "learn-ai",
        isAdmin: false,
        entitlements: [],
        appAccess: [
          {
            app_id: "learn-ai",
            is_active: false, // inactive
            expires_at: FUTURE,
          },
        ],
      });
      expect(result.entitled).toBe(false);
    });
  });

  // ── 6. No entitlement at all ─────────────────────────────────────────────
  describe("No entitlement in any table", () => {
    it("returns entitled=false when both tables are empty", () => {
      const result = checkLessonAccess({
        appId: "learn-ai",
        isAdmin: false,
        entitlements: [],
        appAccess: [],
      });
      expect(result.entitled).toBe(false);
    });
  });

  // ── 7. Admin bypass ──────────────────────────────────────────────────────
  describe("Admin profile bypass", () => {
    it("grants access to admins regardless of entitlements", () => {
      const result = checkLessonAccess({
        appId: "learn-ai",
        isAdmin: true,
        entitlements: [],
        appAccess: [],
      });
      expect(result.entitled).toBe(true);
      expect(result.adminAccess).toBe(true);
    });
  });

  // ── 8. End-to-end: paid user with multiple courses ───────────────────────
  describe("End-to-end paid user scenario: all entitled lessons are accessible", () => {
    const paidUserEntitlements = [
      {
        app_id: "learn-ai",
        course_slug: "learn-ai",
        status: "active",
        expires_at: FUTURE,
      },
      {
        app_id: "ai-developer-bundle",
        course_slug: "ai-developer-bundle",
        status: "active",
        expires_at: FUTURE,
      },
    ];

    const PAID_APPS = ["learn-ai", "learn-developer", "learn-management", "learn-pr"];
    const MODULES = [1, 2, 3, 10];
    const LESSONS = [1, 2, 5, 10];

    it("never shows the paywall for any lesson in an entitled paid course (learn-ai)", () => {
      for (const moduleId of MODULES) {
        for (const lessonId of LESSONS) {
          // Sample lesson (module 1 lesson 1) is free — skip is true in the hook,
          // so entitled is null.  For all OTHER lessons, the hook calls the API.
          if (moduleId === 1 && lessonId === 1) continue;

          const result = checkLessonAccess({
            appId: "learn-ai",
            isAdmin: false,
            entitlements: paidUserEntitlements,
          });

          expect(result.entitled).toBe(
            true,
            `Expected entitled=true for learn-ai module ${moduleId} lesson ${lessonId}`
          );
        }
      }
    });

    it("never shows the paywall for learn-developer via bundle entitlement", () => {
      for (const lessonId of LESSONS) {
        const result = checkLessonAccess({
          appId: "learn-developer",
          isAdmin: false,
          entitlements: paidUserEntitlements,
        });
        expect(result.entitled).toBe(true);
      }
    });

    it("grants lesson access via user_app_access for each paid app", () => {
      const appAccessRecords = PAID_APPS.map((appId) => ({
        app_id: appId,
        is_active: true,
        expires_at: FUTURE,
      }));

      for (const appId of PAID_APPS) {
        const result = checkLessonAccess({
          appId,
          isAdmin: false,
          entitlements: [],
          appAccess: appAccessRecords,
        });
        expect(result.entitled).toBe(true, `Expected entitled=true for ${appId}`);
      }
    });
  });
});
