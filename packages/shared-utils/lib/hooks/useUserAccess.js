/**
 * useUserAccess — Unified Access Hook
 *
 * Single hook that evaluates access for all learn-* apps following a strict
 * priority hierarchy:
 *
 *   Admin > Paid_User > Free_User > None
 *
 * Rules (applied in order):
 *  1. Admin   — `adminAccess: true` returned by the entitlement API
 *               (user has `is_admin = true` OR `role = 'admin'` on their profile).
 *               Always returns `canAccessCourse() === true` for every course.
 *  2. Paid_User — `entitled: true` returned by the entitlement API.
 *               Returns `canAccessCourse(courseId) === true` when `courseId`
 *               matches the purchased app (or its bundle).
 *  3. Free_User — the app is in the free-app registry.
 *               Returns `canAccessCourse() === true` (no payment needed).
 *  4. None    — authenticated but not entitled, OR unauthenticated.
 *               Returns `canAccessCourse() === false`.
 *
 * Backwards-compatible: the hook also exposes an `entitled` property that
 * mirrors the boolean returned by the old `useEntitlement` hook so existing
 * lesson-page code can be migrated with a one-line change.
 *
 * Usage (paid lesson page):
 *
 *   const { entitled, isAdmin, canAccessCourse } = useUserAccess('learn-ai', {
 *     skip: FREE_ACCESS || lesson.isFree,
 *   });
 *
 *   // Block non-sample lessons when not entitled:
 *   useEffect(() => {
 *     if (entitled === false && !isSampleLesson) setShowEnrollment(true);
 *   }, [entitled, isSampleLesson]);
 *
 *   // Upsell after sample lesson — only for non-entitled users:
 *   if (passed && isSampleLesson && !FREE_ACCESS && entitled === false) {
 *     setShowEnrollment(true);
 *   }
 *
 * @module useUserAccess
 */

import { useState, useEffect } from "react";
import { isFreeAccessEnabled } from "../freeAccess";
import { hasBypassCookieFromString } from "../../../access-control/src/index.js";

// ---------------------------------------------------------------------------
// Storage key for cross-navigation admin access cache
// ---------------------------------------------------------------------------

/**
 * sessionStorage key used to cache a confirmed adminAccess=true result from
 * the entitlement API so that subsequent lesson-page navigations in the same
 * tab restore ADMIN access immediately — without a loader flash — for users
 * with is_admin=true who do not have the bypass cookie.
 *
 * Cleared on SIGNED_OUT to prevent stale state leaking between users.
 */
const _UA_ADMIN_SESSION_KEY = "__iiskills_ua_admin";

// ---------------------------------------------------------------------------
// Access level constants
// ---------------------------------------------------------------------------

/**
 * Ordered access levels.  Higher index = higher privilege.
 * @enum {string}
 */
export const ACCESS_LEVEL = {
  /** User is not authenticated or has no access to this content. */
  NONE: "none",
  /** Authenticated user with no payment — may access free courses only. */
  FREE_USER: "free_user",
  /** Authenticated user who has paid for / been granted this course. */
  PAID_USER: "paid_user",
  /**
   * Administrator — unrestricted access to every course.
   * Triggered when the entitlement API returns `adminAccess: true`, which
   * itself fires when the profile has `is_admin = true` OR `role = 'admin'`.
   */
  ADMIN: "admin",
};

// ---------------------------------------------------------------------------
// Pure helper: resolve whether an app is free without bundling access-control
// ---------------------------------------------------------------------------

async function _resolveIsFreeApp(appId) {
  try {
    const { isFreeApp } = await import("../../../access-control/accessControl.js");
    return isFreeApp(appId);
  } catch {
    // If the package is unavailable, default to open (never incorrectly block).
    return true;
  }
}

// ---------------------------------------------------------------------------
// Network helper: fetch the full entitlement response object
// ---------------------------------------------------------------------------

/**
 * Fetch the entitlement API and return the full JSON response.
 *
 * Exported so it can be injected in unit tests.
 *
 * @param {string} appId
 * @param {Object} [_deps] - Injectable test deps.
 * @param {Function} [_deps.getSession]
 * @param {Function} [_deps.fetchImpl]
 * @returns {Promise<{authenticated:boolean, entitled:boolean, adminAccess?:boolean, expiresAt?:string|null}>}
 */
export async function fetchEntitlementResponse(appId, _deps) {
  const getSession =
    _deps?.getSession ??
    (async () => {
      const { supabase } = await import("../supabaseClient");
      return supabase.auth.getSession();
    });
  const fetchImpl = _deps?.fetchImpl ?? fetch;

  const {
    data: { session },
  } = await getSession();

  const headers = {};
  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  const apiBase =
    typeof window !== "undefined"
      ? `${window.location.protocol}//iiskills.cloud`
      : "https://iiskills.cloud";

  const res = await fetchImpl(`${apiBase}/api/entitlement?appId=${encodeURIComponent(appId)}`, {
    headers,
  });

  if (!res.ok) return { authenticated: false, entitled: false };
  return res.json();
}

// ---------------------------------------------------------------------------
// Pure function: canAccessCourse
// ---------------------------------------------------------------------------

/**
 * Determine whether a user may access a specific course.
 *
 * This is a **pure function** — identical implementation used in all four
 * paid apps (learn-ai, learn-developer, learn-management, learn-pr).
 * Import it directly when you need to perform an access check outside of
 * a React component, or use the bound version returned by `useUserAccess`.
 *
 * Priority: Admin → Paid_User → Free_User (checked via isFreeApp) → None
 *
 * Note on free-app detection: this function performs a best-effort synchronous
 * check by calling `require('@iiskills/access-control')`.  If the package is
 * unavailable (e.g. in certain SSR or test environments) the require throws and
 * the check silently falls through — no access is granted for unknown courses.
 * The `useUserAccess` hook performs a full async resolution via `_resolveIsFreeApp`
 * which always falls back to open-access on error.
 *
 * @param {string} courseId    - App/course ID to check (e.g. `'learn-ai'`).
 * @param {Object} context
 * @param {string|null} context.accessLevel - One of the `ACCESS_LEVEL` values.
 * @param {string}      context.appId       - The app this hook was created for.
 * @returns {boolean}
 */
export function canAccessCourse(courseId, { accessLevel, appId }) {
  // 1. Admin — unrestricted
  if (accessLevel === ACCESS_LEVEL.ADMIN) return true;

  // 2. Free app — always accessible regardless of payment
  //    (checked synchronously; resolveIsFreeApp is async and only used in the hook)
  try {
    // Best-effort synchronous check using the bundled registry.

    const acModule = require("../../../access-control/accessControl.js");
    if (typeof acModule.isFreeApp === "function" && acModule.isFreeApp(courseId)) return true;
  } catch {
    // Package unavailable — cannot confirm free; fall through.
  }

  // 3. Paid_User — entitled to the specific course they purchased
  if (accessLevel === ACCESS_LEVEL.PAID_USER && courseId === appId) return true;

  // 4. No access
  return false;
}

// ---------------------------------------------------------------------------
// Pure helper: Hard Admin Override — detect is_admin from Supabase session user
// ---------------------------------------------------------------------------

/**
 * Returns `true` when the Supabase session user has `is_admin: true` on either
 * `app_metadata` or `user_metadata`.
 *
 * This is the client-side Hard Admin Override check used by `useUserAccess`.
 * When it returns `true` the hook grants `ACCESS_LEVEL.ADMIN` immediately
 * without making any API call or consulting the entitlement cache.
 *
 * Exported for unit testing.  Not intended for direct use outside this module.
 *
 * @param {{ app_metadata?: object, user_metadata?: object } | null | undefined} user
 * @returns {boolean}
 */
export function _isAdminFromSessionUser(user) {
  return user?.app_metadata?.is_admin === true || user?.user_metadata?.is_admin === true;
}

// ---------------------------------------------------------------------------
// React hook
// ---------------------------------------------------------------------------

/**
 * Unified user-access hook.
 *
 * @param {string}  appId              - App/course to check (e.g. `'learn-ai'`).
 * @param {Object}  [options]
 * @param {boolean} [options.skip]     - Skip the check entirely (e.g. for
 *                                       explicitly free lessons).  Returns
 *                                       `{ entitled: null, accessLevel: null }`.
 * @returns {{
 *   accessLevel: string|null,
 *   loading: boolean,
 *   entitled: boolean|null,
 *   isAdmin: boolean,
 *   isPaidUser: boolean,
 *   isFreeUser: boolean,
 *   canAccessCourse: (courseId: string) => boolean,
 * }}
 */
export function useUserAccess(appId, options = {}) {
  const { skip = false } = options;

  // Evaluate the bypass cookie once synchronously so both state initialisers
  // share the same result and the very first render already has
  // accessLevel=ADMIN / loading=false when the cookie is present — preventing
  // any chance of the PaymentModal flashing before the useEffect runs.
  const hasBypassOnMount =
    typeof document !== "undefined" && hasBypassCookieFromString(document.cookie);

  // Check sessionStorage for a previously confirmed adminAccess=true result so
  // that is_admin users get instant ADMIN status on subsequent page navigations
  // (without re-fetching the entitlement API on every lesson page).
  // We only use this cache when the bypass cookie is absent to avoid duplication.
  const hasCachedAdminOnMount =
    !hasBypassOnMount &&
    typeof sessionStorage !== "undefined" &&
    sessionStorage.getItem(_UA_ADMIN_SESSION_KEY) === "1";

  const [accessLevel, setAccessLevel] = useState(
    hasBypassOnMount || hasCachedAdminOnMount ? ACCESS_LEVEL.ADMIN : null
  );
  const [loading, setLoading] = useState(!skip && !hasBypassOnMount && !hasCachedAdminOnMount);

  // Version counter incremented on auth state transitions so the main access
  // check effect re-runs with a fresh Supabase session.
  const [authVersion, setAuthVersion] = useState(0);

  // ── Auth state subscription ────────────────────────────────────────────────
  // Subscribes once per component instance.  On SIGNED_OUT we immediately
  // revoke all access (no API round-trip needed).  On SIGNED_IN we reset to a
  // loading state and trigger a fresh access check via authVersion.
  useEffect(() => {
    if (skip) return;

    let isMounted = true;
    let authSub = null;

    (async () => {
      try {
        const { supabase } = await import("../supabaseClient");
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
          if (!isMounted) return;
          if (event === "SIGNED_OUT") {
            // Immediately revoke access and purge the admin cache.
            setAccessLevel(ACCESS_LEVEL.NONE);
            setLoading(false);
            try {
              sessionStorage.removeItem(_UA_ADMIN_SESSION_KEY);
            } catch {
              // sessionStorage unavailable — ignore
            }
            // Bump authVersion so the main access-check effect re-runs, which
            // causes its `cancelled` cleanup flag to fire (cancelling any pending
            // async fetch) and then re-evaluates with no session.
            setAuthVersion((v) => v + 1);
          } else if (event === "SIGNED_IN") {
            // Reset to loading so the main effect re-runs with the new session.
            setAccessLevel(null);
            setLoading(true);
            setAuthVersion((v) => v + 1);
          }
        });
        authSub = subscription;
      } catch {
        // Supabase unavailable (CI / mock) — no subscription needed.
      }
    })();

    return () => {
      isMounted = false;
      authSub?.unsubscribe();
    };
  }, [skip]);

  // ── Main access check ─────────────────────────────────────────────────────
  // Re-runs whenever appId, skip, or authVersion changes (auth transitions).
  useEffect(() => {
    // ── Skipped ────────────────────────────────────────────────────────────
    if (skip) {
      setAccessLevel(null);
      setLoading(false);
      return;
    }

    // ── Global free-access mode (campaign / open-access) ───────────────────
    if (isFreeAccessEnabled()) {
      setAccessLevel(ACCESS_LEVEL.FREE_USER);
      setLoading(false);
      return;
    }

    // ── High-Priority Override: admin_access URL parameter ─────────────────
    // When ?admin_access=true is present in the URL (appended by admin preview
    // links in apps/main/pages/admin/courses.js), grant ADMIN-level access
    // immediately — BEFORE any async entitlement API call — so the enrollment
    // overlay never flashes over the lesson for admin previews.
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("admin_access") === "true") {
        setAccessLevel(ACCESS_LEVEL.ADMIN);
        setLoading(false);
        return;
      }

      // ── High-Priority Override: iiskills_admin_bypass cookie ───────────────
      // When the `iiskills_admin_bypass=true` cookie is present the session is
      // treated as admin — preventing the PaymentModal from ever rendering on
      // learn-ai and learn-developer for authorised testers / product owners.
      if (typeof document !== "undefined" && hasBypassCookieFromString(document.cookie)) {
        setAccessLevel(ACCESS_LEVEL.ADMIN);
        setLoading(false);
        return;
      }
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        // ── Free app (no payment ever required) ──────────────────────────
        const isFree = await _resolveIsFreeApp(appId);
        if (isFree) {
          if (!cancelled) {
            setAccessLevel(ACCESS_LEVEL.FREE_USER);
            setLoading(false);
          }
          return;
        }

        // ── Hard Admin Override: is_admin on Supabase session user ───────────
        // Read the Supabase session from the client's local cache (no network
        // call — just a localStorage read).  If the user has is_admin: true on
        // their app_metadata or user_metadata (set server-side via
        // supabase.auth.admin.updateUserById when the user was promoted), grant
        // ADMIN-level access immediately — bypassing all DB entitlement checks
        // and local-storage caches.
        {
          const { supabase: _sc } = await import("../supabaseClient");
          const {
            data: { session: _sess },
          } = await _sc.auth.getSession();
          if (_isAdminFromSessionUser(_sess?.user)) {
            if (!cancelled) {
              setAccessLevel(ACCESS_LEVEL.ADMIN);
              try {
                sessionStorage.setItem(_UA_ADMIN_SESSION_KEY, "1");
              } catch {
                // sessionStorage unavailable — ignore
              }
              setLoading(false);
            }
            return;
          }
        }

        // ── Fetch entitlement from main API ───────────────────────────────
        const data = await fetchEntitlementResponse(appId);

        if (!cancelled) {
          if (!data.authenticated) {
            // Unauthenticated — no access.  Also clear stale admin cache.
            setAccessLevel(ACCESS_LEVEL.NONE);
            try {
              sessionStorage.removeItem(_UA_ADMIN_SESSION_KEY);
            } catch {
              // sessionStorage unavailable — ignore
            }
          } else if (data.adminAccess === true) {
            // Admin bypass: is_admin = true OR role = 'admin' on profile.
            // Cache result so subsequent navigations restore ADMIN instantly.
            setAccessLevel(ACCESS_LEVEL.ADMIN);
            try {
              sessionStorage.setItem(_UA_ADMIN_SESSION_KEY, "1");
            } catch {
              // sessionStorage unavailable — ignore
            }
          } else if (data.entitled === true) {
            // Active entitlement (payment or admin grant)
            setAccessLevel(ACCESS_LEVEL.PAID_USER);
          } else {
            // Authenticated but not entitled
            setAccessLevel(ACCESS_LEVEL.NONE);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("[useUserAccess] access check failed for", appId, err);
        if (!cancelled) {
          setAccessLevel(ACCESS_LEVEL.NONE);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [appId, skip, authVersion]);

  // ── Derived values ────────────────────────────────────────────────────────

  /**
   * Backwards-compatible `entitled` boolean.
   *   null  → check in progress or skipped
   *   true  → user has access (Admin, Paid, or Free)
   *   false → user has no access (None)
   */
  const entitled = accessLevel === null ? null : accessLevel !== ACCESS_LEVEL.NONE;

  const isAdmin = accessLevel === ACCESS_LEVEL.ADMIN;
  const isPaidUser = accessLevel === ACCESS_LEVEL.PAID_USER || isAdmin;
  const isFreeUser = accessLevel === ACCESS_LEVEL.FREE_USER;

  /**
   * `true` when the user may access the app (any non-None access level).
   * `false` when explicitly denied.  `null` while the check is in progress.
   * Alias for `entitled` — provided for clarity at call sites that check
   * access without caring about the specific level (e.g. `if (!hasAccess)`).
   */
  const hasAccess = entitled;

  /**
   * `true` when the PaymentModal should be shown to the user.
   * `false` in any of these cases (which are mutually exclusive):
   *   - hasBypassOnMount: admin bypass cookie is present (product owners / testers)
   *   - hasCachedAdminOnMount: sessionStorage cache confirms a prior adminAccess=true
   *     (only set when bypass cookie is absent, so the two conditions never overlap)
   * Either condition independently prevents the modal from rendering.
   */
  const showPaymentModal = !hasBypassOnMount && !hasCachedAdminOnMount && entitled === false;

  return {
    accessLevel,
    loading,
    entitled,
    hasAccess,
    showPaymentModal,
    isAdmin,
    isPaidUser,
    isFreeUser,
    /**
     * Bound `canAccessCourse` — uses this hook's resolved `accessLevel` and
     * `appId`.  Identical logic to the exported pure `canAccessCourse`.
     *
     * @param {string} courseId
     * @returns {boolean}
     */
    canAccessCourse: (courseId) => canAccessCourse(courseId, { accessLevel, appId }),
  };
}
