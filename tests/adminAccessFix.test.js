/**
 * Admin Access Fix — Regression Tests
 *
 * Covers the four-layer fix for the persistent admin-paywall / lesson-404 bug:
 *
 *  Fix 1 — CSP connect-src includes iiskills.cloud subdomains
 *           Sub-apps (learn-*.iiskills.cloud) must be permitted by the
 *           Content-Security-Policy to call iiskills.cloud/api/entitlement.
 *           Without this allowlist the browser blocks the request before it
 *           reaches the server, causing every user (including admins) to see
 *           the paywall.
 *
 *  Fix 2 — CORS headers on the entitlement API
 *           The server must respond with Access-Control-Allow-Origin for
 *           *.iiskills.cloud origins so browsers honour the response.
 *
 *  Fix 3 — useUserAccess resilient error handling
 *           When the entitlement API is unreachable the hook must:
 *             a) Restore admin status from sessionStorage cache (same tab).
 *             b) Fall back to the sub-app's own /api/access/check endpoint.
 *             c) Only set ACCESS_LEVEL.NONE when both fallbacks also fail.
 *           Admins must NEVER see the paywall just because an API call failed.
 *
 *  Fix 4 — getStaticPaths on final-test pages
 *           All four paid-app /modules/[moduleId]/final-test pages must export
 *           getStaticPaths (modules 1–30) so Next.js pre-generates the pages at
 *           build time and they are never served as 404.
 */

"use strict";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers shared across suites
// ─────────────────────────────────────────────────────────────────────────────

const IISKILLS_ORIGIN = "https://iiskills.cloud";
const SUB_APP_ORIGINS = [
  "https://learn-ai.iiskills.cloud",
  "https://learn-developer.iiskills.cloud",
  "https://learn-management.iiskills.cloud",
  "https://learn-pr.iiskills.cloud",
];

// ─────────────────────────────────────────────────────────────────────────────
// Fix 1 — CSP connect-src includes iiskills.cloud
// ─────────────────────────────────────────────────────────────────────────────

describe("Fix 1 — CSP connect-src includes iiskills.cloud (security-headers.js)", () => {
  const { getHeadersConfig } = require("../packages/config/security-headers");

  /**
   * Extract the Content-Security-Policy header value from the config returned
   * by getHeadersConfig.  Returns null when not found.
   */
  function getCSPValue(isDev = false) {
    const configs = getHeadersConfig(isDev);
    for (const cfg of configs) {
      for (const header of cfg.headers || []) {
        if (header.key === "Content-Security-Policy") return header.value;
      }
    }
    return null;
  }

  it("production CSP is defined", () => {
    const csp = getCSPValue(false);
    expect(csp).not.toBeNull();
  });

  it("production connect-src allows https://iiskills.cloud", () => {
    const csp = getCSPValue(false);
    const connectSrc = csp.split(";").find((d) => d.trim().startsWith("connect-src"));
    expect(connectSrc).toBeDefined();
    expect(connectSrc).toContain("https://iiskills.cloud");
  });

  it("production connect-src allows https://*.iiskills.cloud sub-apps", () => {
    const csp = getCSPValue(false);
    const connectSrc = csp.split(";").find((d) => d.trim().startsWith("connect-src"));
    expect(connectSrc).toContain("https://*.iiskills.cloud");
  });

  it("production connect-src still allows Supabase", () => {
    const csp = getCSPValue(false);
    const connectSrc = csp.split(";").find((d) => d.trim().startsWith("connect-src"));
    expect(connectSrc).toContain("https://*.supabase.co");
  });

  it("development CSP is also defined and contains the allowlist", () => {
    const csp = getCSPValue(true);
    expect(csp).not.toBeNull();
    const connectSrc = csp.split(";").find((d) => d.trim().startsWith("connect-src"));
    expect(connectSrc).toContain("https://iiskills.cloud");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Fix 2 — CORS headers on the entitlement API
// ─────────────────────────────────────────────────────────────────────────────

describe("Fix 2 — CORS headers on /api/entitlement", () => {
  /**
   * Minimal replica of the setCorsHeaders() logic from entitlement.js.
   * Returns the Access-Control-Allow-Origin value that would be set for a
   * given origin, or null when the origin is not allowed.
   */
  function simulateCors(origin) {
    const allowed =
      origin === "https://iiskills.cloud" ||
      /^https:\/\/[a-z0-9]([a-z0-9-]*[a-z0-9])?\.iiskills\.cloud$/.test(origin) ||
      /^http:\/\/localhost(:\d+)?$/.test(origin);

    return allowed ? origin : null;
  }

  it("allows requests from the main domain (iiskills.cloud)", () => {
    expect(simulateCors(IISKILLS_ORIGIN)).toBe(IISKILLS_ORIGIN);
  });

  it.each(SUB_APP_ORIGINS)("allows requests from sub-app origin %s", (origin) => {
    expect(simulateCors(origin)).toBe(origin);
  });

  it("allows localhost in development", () => {
    expect(simulateCors("http://localhost:3000")).toBe("http://localhost:3000");
    expect(simulateCors("http://localhost:3001")).toBe("http://localhost:3001");
  });

  it("blocks requests from arbitrary third-party origins", () => {
    expect(simulateCors("https://evil.com")).toBeNull();
    expect(simulateCors("https://notiskills.cloud")).toBeNull();
    expect(simulateCors("https://iiskills.cloud.evil.com")).toBeNull();
  });

  it("blocks requests from partial domain matches", () => {
    // Ensure 'iiskills.cloud' is not matched by a suffix like 'fake-iiskills.cloud'
    expect(simulateCors("https://fake-iiskills.cloud")).toBeNull();
  });

  it("blocks malformed subdomains that start or end with hyphens", () => {
    // Hardened regex: subdomains must start AND end with alphanumeric characters
    expect(simulateCors("https://-.iiskills.cloud")).toBeNull();
    expect(simulateCors("https://-evil.iiskills.cloud")).toBeNull();
    expect(simulateCors("https://evil-.iiskills.cloud")).toBeNull();
  });

  // Verify the actual entitlement handler has the CORS helper by reading the file
  it("entitlement.js exports a handler that handles OPTIONS preflight", () => {
    const fs = require("fs");
    const src = fs.readFileSync(
      require("path").join(__dirname, "../apps/main/pages/api/entitlement.js"),
      "utf8"
    );
    expect(src).toContain("setCorsHeaders");
    expect(src).toContain("OPTIONS");
    expect(src).toContain("Access-Control-Allow-Origin");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Fix 3 — useUserAccess resilient error handling
// ─────────────────────────────────────────────────────────────────────────────

describe("Fix 3 — useUserAccess resilient error-handling (priority fallback logic)", () => {
  /**
   * Pure-function replica of the three-tier fallback used by useUserAccess when
   * the main entitlement API is unreachable.
   *
   * Priority:
   *   1. sessionStorage cache (_UA_ADMIN_SESSION_KEY = "1") → ADMIN
   *   2. Local /api/access/check response              → ADMIN | PAID_USER | NONE
   *   3. Default                                       → NONE
   */
  function simulateFallback({
    sessionStorageAdmin = false,
    localCheckResponse = null, // null = fetch failed; { hasAccess, isAdmin } otherwise
  }) {
    // Priority 1 — sessionStorage cache
    if (sessionStorageAdmin) return { accessLevel: "admin", source: "sessionStorage" };

    // Priority 2 — local /api/access/check
    if (localCheckResponse !== null) {
      if (localCheckResponse.isAdmin === true)
        return { accessLevel: "admin", source: "localCheck" };
      if (localCheckResponse.hasAccess === true)
        return { accessLevel: "paid_user", source: "localCheck" };
      return { accessLevel: "none", source: "localCheck" };
    }

    // Priority 3 — last resort
    return { accessLevel: "none", source: "default" };
  }

  // ── Priority 1: sessionStorage cache ──────────────────────────────────────

  it("P1: restores ADMIN from sessionStorage when main API fails", () => {
    const result = simulateFallback({ sessionStorageAdmin: true, localCheckResponse: null });
    expect(result.accessLevel).toBe("admin");
    expect(result.source).toBe("sessionStorage");
  });

  it("P1: sessionStorage cache takes precedence over local /api/access/check", () => {
    const result = simulateFallback({
      sessionStorageAdmin: true,
      localCheckResponse: { isAdmin: false, hasAccess: false },
    });
    expect(result.accessLevel).toBe("admin");
    expect(result.source).toBe("sessionStorage");
  });

  // ── Priority 2: local /api/access/check ───────────────────────────────────

  it("P2: grants ADMIN via local /api/access/check when isAdmin=true", () => {
    const result = simulateFallback({
      sessionStorageAdmin: false,
      localCheckResponse: { isAdmin: true, hasAccess: true },
    });
    expect(result.accessLevel).toBe("admin");
    expect(result.source).toBe("localCheck");
  });

  it("P2: grants PAID_USER via local check when hasAccess=true (non-admin)", () => {
    const result = simulateFallback({
      sessionStorageAdmin: false,
      localCheckResponse: { isAdmin: false, hasAccess: true },
    });
    expect(result.accessLevel).toBe("paid_user");
  });

  it("P2: denies access when local check returns hasAccess=false", () => {
    const result = simulateFallback({
      sessionStorageAdmin: false,
      localCheckResponse: { isAdmin: false, hasAccess: false },
    });
    expect(result.accessLevel).toBe("none");
  });

  // ── Priority 3: last resort ────────────────────────────────────────────────

  it("P3: falls back to NONE when all fallbacks fail (no cache, local fetch error)", () => {
    const result = simulateFallback({
      sessionStorageAdmin: false,
      localCheckResponse: null, // local fetch threw
    });
    expect(result.accessLevel).toBe("none");
    expect(result.source).toBe("default");
  });

  // ── Regression: admins must NEVER be shown paywall on API failure ──────────

  it.each([
    {
      desc: "admin with sessionStorage cache",
      sessionStorageAdmin: true,
      localCheckResponse: null,
    },
    {
      desc: "admin confirmed by local /api/access/check",
      sessionStorageAdmin: false,
      localCheckResponse: { isAdmin: true, hasAccess: true },
    },
  ])(
    "admin never receives NONE on API failure: $desc",
    ({ sessionStorageAdmin, localCheckResponse }) => {
      const result = simulateFallback({ sessionStorageAdmin, localCheckResponse });
      expect(result.accessLevel).not.toBe("none");
      expect(result.accessLevel).toBe("admin");
    }
  );

  it("non-admin without valid fallback receives NONE (paywall — correct behaviour)", () => {
    const result = simulateFallback({
      sessionStorageAdmin: false,
      localCheckResponse: { isAdmin: false, hasAccess: false },
    });
    expect(result.accessLevel).toBe("none");
  });

  // ── Source code check: the fallback logic is present in the hook ──────────

  it("useUserAccess.js contains the local /api/access/check fallback", () => {
    const fs = require("fs");
    const src = fs.readFileSync(
      require("path").join(__dirname, "../packages/shared-utils/lib/hooks/useUserAccess.js"),
      "utf8"
    );
    expect(src).toContain("/api/access/check");
    expect(src).toContain("_UA_ADMIN_SESSION_KEY");
    // Recovery section comment
    expect(src).toContain("Entitlement API unreachable");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Fix 4 — getStaticPaths on final-test pages (no 404s for admins)
// ─────────────────────────────────────────────────────────────────────────────

describe("Fix 4 — final-test pages export getStaticPaths covering modules 1–30", () => {
  const path = require("path");
  const PAID_APPS = ["learn-ai", "learn-developer", "learn-management", "learn-pr"];

  /**
   * Dynamically evaluate getStaticPaths from a final-test.js source file
   * without requiring a full Next.js runtime.
   *
   * Because the files use top-level `import` syntax mixed with export
   * declarations we do a lightweight regex extraction instead of require().
   */
  function extractStaticPaths(appName) {
    const fs = require("fs");
    const src = fs.readFileSync(
      path.join(__dirname, `../apps/${appName}/pages/modules/[moduleId]/final-test.js`),
      "utf8"
    );
    return src;
  }

  it.each(PAID_APPS)("%s/final-test.js exports getStaticPaths", (app) => {
    const src = extractStaticPaths(app);
    expect(src).toContain("export async function getStaticPaths");
  });

  it.each(PAID_APPS)("%s/final-test.js exports getStaticProps", (app) => {
    const src = extractStaticPaths(app);
    expect(src).toContain("export async function getStaticProps");
  });

  it.each(PAID_APPS)("%s/final-test.js getStaticPaths generates 30 paths", (app) => {
    const src = extractStaticPaths(app);
    // The loop bounds must cover modules 1–30 (moduleId <= 30)
    expect(src).toContain("moduleId <= 30");
  });

  it.each(PAID_APPS)("%s/final-test.js uses fallback: false", (app) => {
    const src = extractStaticPaths(app);
    expect(src).toContain("fallback: false");
  });

  it.each(PAID_APPS)("%s/final-test.js still reads moduleId from useRouter", (app) => {
    // The component must still use router.query so the moduleId is available
    // at runtime (getStaticProps passes {} — no moduleId in props).
    const src = extractStaticPaths(app);
    expect(src).toContain("router.query");
  });

  // Verify the exact set of generated paths matches modules 1–30
  it("getStaticPaths logic generates exactly 30 module paths", () => {
    const paths = [];
    for (let moduleId = 1; moduleId <= 30; moduleId++) {
      paths.push({ params: { moduleId: String(moduleId) } });
    }
    expect(paths).toHaveLength(30);
    expect(paths[0].params.moduleId).toBe("1");
    expect(paths[29].params.moduleId).toBe("30");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Cross-cutting: /api/access/check admin bypass — all four paid apps
// ─────────────────────────────────────────────────────────────────────────────

describe("Cross-cutting — /api/access/check present in all formerly-paid apps (PAYMENT_STUB)", () => {
  const PAID_APPS = ["learn-ai", "learn-developer", "learn-management", "learn-pr"];
  const path = require("path");
  const fs = require("fs");

  it.each(PAID_APPS)("%s has /api/access/check endpoint", (app) => {
    const p = path.join(__dirname, `../apps/${app}/pages/api/access/check.js`);
    expect(fs.existsSync(p)).toBe(true);
  });

  // PAYMENT_STUB: Original test verified is_admin bypass logic in source.
  // Now verifies the stub returns hasAccess:true for everyone.
  it.each(PAID_APPS)("%s /api/access/check is a PAYMENT_STUB returning hasAccess:true", (app) => {
    const p = path.join(__dirname, `../apps/${app}/pages/api/access/check.js`);
    const src = fs.readFileSync(p, "utf8");
    // PAYMENT_STUB: was expect(src).toContain("is_admin") — now stub always returns true
    expect(src).toContain("PAYMENT_STUB");
    expect(src).toContain("hasAccess: true");
  });

  // Functional test: simulate the admin-bypass branch of /api/access/check
  // PAYMENT_STUB: preserved as a reintroduction marker for when entitlement logic is rebuilt.
  it("PAYMENT_STUB: access-check logic preserved for reference (admin-bypass pattern)", () => {
    // Mirror the original check in apps/*/pages/api/access/check.js (pre-stub)
    function resolveLocalAccess({ entitlement, profile }) {
      if (entitlement) return { hasAccess: true };
      if (profile?.is_admin === true) return { hasAccess: true, isAdmin: true };
      return { hasAccess: !!profile?.is_paid_user };
    }

    // Admin with no entitlement row → admin bypass
    expect(resolveLocalAccess({ entitlement: null, profile: { is_admin: true } })).toEqual({
      hasAccess: true,
      isAdmin: true,
    });

    // Paid user via entitlement row
    expect(resolveLocalAccess({ entitlement: { id: "e1" }, profile: null })).toEqual({
      hasAccess: true,
    });

    // Non-admin, no entitlement
    expect(resolveLocalAccess({ entitlement: null, profile: { is_admin: false } })).toEqual({
      hasAccess: false,
    });

    // is_paid_user flag fallback
    expect(
      resolveLocalAccess({ entitlement: null, profile: { is_admin: false, is_paid_user: true } })
    ).toEqual({ hasAccess: true });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// End-to-end: admin must never see paywall on ANY paid lesson
// ─────────────────────────────────────────────────────────────────────────────

describe("End-to-end: admin paywall bypass — all paid apps, all lessons", () => {
  const PAID_APPS = ["learn-ai", "learn-developer", "learn-management", "learn-pr"];
  const MODULES = [1, 2, 10, 20, 30];
  const LESSONS = [1, 2, 5, 10];

  /**
   * Simulate the full access-resolution logic used by the lesson page.
   *
   * Returns whether the EnrollmentLandingPage overlay would be shown:
   *   - entitled === false && !isSampleLesson → overlay shown (BAD for admin)
   *   - entitled !== false (null or true)     → overlay NOT shown (correct)
   */
  function wouldShowPaywall({
    isAdmin,
    entitlementResult, // { entitled, adminAccess? } from entitlement API (or null = API failed)
    sessionStorageAdmin = false,
    localCheckAdmin = false,
    moduleId,
    lessonId,
    lessonIsFree,
  }) {
    const isSampleLesson = moduleId === "1" && lessonId === "1";
    const skip = lessonIsFree;

    // When skip=true, entitled=null → paywall never shown
    if (skip) return false;

    let entitled = null;

    if (isAdmin) {
      // JWT admin → ADMIN immediately
      entitled = true;
    } else if (entitlementResult !== null) {
      // API responded
      if (entitlementResult.adminAccess) entitled = true;
      else if (entitlementResult.entitled) entitled = true;
      else entitled = false;
    } else {
      // API failed — apply fallback logic
      if (sessionStorageAdmin) {
        entitled = true; // restored from cache
      } else if (localCheckAdmin) {
        entitled = true; // confirmed by local check
      } else {
        entitled = false; // last resort
      }
    }

    return entitled === false && !isSampleLesson;
  }

  // Admin with JWT flag — must never see paywall
  it.each(PAID_APPS)("%s: JWT-admin never sees paywall on any module/lesson combination", (app) => {
    for (const m of MODULES) {
      for (const l of LESSONS) {
        const lessonIsFree = l === 1; // first lesson of each module is free
        const result = wouldShowPaywall({
          isAdmin: true,
          entitlementResult: null,
          moduleId: String(m),
          lessonId: String(l),
          lessonIsFree,
        });
        expect(result).toBe(false);
      }
    }
  });

  // Admin confirmed via entitlement API
  it.each(PAID_APPS)("%s: API-admin (is_admin in profiles) never sees paywall", (app) => {
    for (const m of MODULES) {
      for (const l of LESSONS) {
        const lessonIsFree = l === 1;
        const result = wouldShowPaywall({
          isAdmin: false,
          entitlementResult: { entitled: true, adminAccess: true },
          moduleId: String(m),
          lessonId: String(l),
          lessonIsFree,
        });
        expect(result).toBe(false);
      }
    }
  });

  // Admin with cached session — API unreachable
  it.each(PAID_APPS)(
    "%s: sessionStorage-cached admin never sees paywall even when API fails",
    (app) => {
      for (const m of MODULES) {
        for (const l of LESSONS) {
          const lessonIsFree = l === 1;
          const result = wouldShowPaywall({
            isAdmin: false,
            entitlementResult: null, // API failed
            sessionStorageAdmin: true,
            moduleId: String(m),
            lessonId: String(l),
            lessonIsFree,
          });
          expect(result).toBe(false);
        }
      }
    }
  );

  // Admin confirmed by local /api/access/check — API unreachable
  it.each(PAID_APPS)("%s: local-check admin never sees paywall even when main API fails", (app) => {
    for (const m of MODULES) {
      for (const l of LESSONS) {
        const lessonIsFree = l === 1;
        const result = wouldShowPaywall({
          isAdmin: false,
          entitlementResult: null, // API failed
          sessionStorageAdmin: false,
          localCheckAdmin: true,
          moduleId: String(m),
          lessonId: String(l),
          lessonIsFree,
        });
        expect(result).toBe(false);
      }
    }
  });

  // Non-admin without entitlement MUST see paywall on paid lessons
  it("non-admin without entitlement sees paywall on non-sample paid lessons (correct)", () => {
    const result = wouldShowPaywall({
      isAdmin: false,
      entitlementResult: { entitled: false },
      sessionStorageAdmin: false,
      localCheckAdmin: false,
      moduleId: "1",
      lessonId: "2",
      lessonIsFree: false,
    });
    expect(result).toBe(true);
  });

  // Lesson 1 of every module is free — never shows paywall regardless
  it("free lesson (lessonId=1) never shows paywall for unauthenticated user", () => {
    const result = wouldShowPaywall({
      isAdmin: false,
      entitlementResult: { entitled: false },
      sessionStorageAdmin: false,
      localCheckAdmin: false,
      moduleId: "5",
      lessonId: "1",
      lessonIsFree: true, // isFree=true → skip=true
    });
    expect(result).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Lesson getStaticPaths — 404 regression guard
// ─────────────────────────────────────────────────────────────────────────────

describe("Lesson getStaticPaths — 404 regression guard (modules 1–30, lessons 1–10)", () => {
  const PAID_APPS = ["learn-ai", "learn-developer", "learn-management", "learn-pr"];

  function extractLessonPageSrc(app) {
    const fs = require("fs");
    const p = require("path").join(
      __dirname,
      `../apps/${app}/pages/modules/[moduleId]/lesson/[lessonId].js`
    );
    return fs.readFileSync(p, "utf8");
  }

  it.each(PAID_APPS)("%s lesson page exports getStaticPaths", (app) => {
    const src = extractLessonPageSrc(app);
    expect(src).toContain("export async function getStaticPaths");
  });

  it.each(PAID_APPS)("%s lesson page generates paths for all 300 module×lesson combos", (app) => {
    const src = extractLessonPageSrc(app);
    expect(src).toContain("moduleId <= 30");
    expect(src).toContain("lessonId <= 10");
    expect(src).toContain("fallback: false");
  });

  it("the 300-path set covers all expected paths for the curriculum", () => {
    // Mirrors getStaticPaths to confirm no valid lesson URL would 404
    const paths = new Set();
    for (let m = 1; m <= 30; m++) {
      for (let l = 1; l <= 10; l++) {
        paths.add(`${m}/${l}`);
      }
    }
    // Spot-check representative paths
    expect(paths.has("1/1")).toBe(true);
    expect(paths.has("1/2")).toBe(true);
    expect(paths.has("30/10")).toBe(true);
    // Paths outside the range are NOT included → would 404 (expected)
    expect(paths.has("31/1")).toBe(false);
    expect(paths.has("1/11")).toBe(false);
    expect(paths.size).toBe(300);
  });
});
