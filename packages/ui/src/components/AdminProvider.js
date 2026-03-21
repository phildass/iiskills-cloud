"use client";

/**
 * AdminProvider.js — packages/ui/src/components/AdminProvider.js
 *
 * Global, fixed-position Admin Mode overlay for iiskills.cloud.
 *
 * Exports:
 *   AdminWrapper          — wraps the entire app; renders sticky banner when admin
 *   AdminModeProvider     — React context provider (use when you need the hook)
 *   AdminModeBanner       — standalone fixed banner (renders via AdminWrapper)
 *   useAdminMode          — hook: { isAdminMode, adminLabel }
 *
 * The yellow banner pins to top:0 with z-index:9999, staying visible even when
 * navigating deep into module and lesson pages.
 */

import React, { createContext, useContext, useEffect, useState } from "react";

// ─── Context ──────────────────────────────────────────────────────────────────

const AdminModeContext = createContext({
  isAdminMode: false,
  adminLabel: "",
  authState: { isAuthorized: false, isAdmin: null, loading: true },
});

const _SESSION_KEY = "__iiskills_admin";
const _LABEL_KEY = "__iiskills_admin_label";
const _LOCAL_KEY = "__iiskills_admin_local";
const _LOCAL_LABEL_KEY = "__iiskills_admin_local_label";
const _LOCAL_EXPIRY_KEY = "__iiskills_admin_local_expiry";
// Admin mode from the URL param expires after 8 hours (ms) to avoid indefinite localStorage persistence.
const _LOCAL_TTL_MS = 8 * 60 * 60 * 1000;

/**
 * Purge all admin-mode storage entries.
 * Called on logout (SIGNED_OUT) and when no Supabase session is found on mount.
 */
function _clearAdminStorage() {
  try {
    localStorage.removeItem(_LOCAL_KEY);
    localStorage.removeItem(_LOCAL_LABEL_KEY);
    localStorage.removeItem(_LOCAL_EXPIRY_KEY);
    sessionStorage.removeItem(_SESSION_KEY);
    sessionStorage.removeItem(_LABEL_KEY);
  } catch {
    // Storage may be unavailable in certain contexts (e.g. private browsing).
  }
}

/**
 * useAdminMode
 * Returns { isAdminMode: boolean, adminLabel: string } from the nearest provider.
 */
export function useAdminMode() {
  return useContext(AdminModeContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * AdminModeProvider
 *
 * Mount once at the root of your app (e.g., _app.js).
 * Checks sessionStorage/localStorage for a cached result, then verifies with
 * /api/admin/me.  Also recognises the ?admin_access=true URL parameter that is
 * appended to preview links by apps/main/pages/admin/courses.js so the admin
 * banner is shown immediately on sub-app domains (where the admin session cookie
 * is not available).
 *
 * @param {{ children: React.ReactNode, adminApiBase?: string }} props
 *   adminApiBase — prefix for API calls; defaults to "" (relative, for apps/main).
 *                  Pass NEXT_PUBLIC_MAIN_APP_URL for sub-apps.
 */
export function AdminModeProvider({ children, adminApiBase = "" }) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminLabel, setAdminLabel] = useState("");
  // authState tracks authorization derived from the URL param and/or the server
  // session.  Initialised synchronously so that consumers can read isAdmin/isAuthorized
  // on the very first render — before any async work — to prevent redirect flashes.
  const [authState, setAuthState] = useState({
    isAuthorized: false,
    isAdmin: null,
    loading: true,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isMounted = true;
    let authSubscription = null;
    let fetchController = null;
    let fetchTimeoutId = null;

    // Helper: check whether the localStorage admin flag is still within its TTL.
    const isLocalAdminValid = () => {
      if (localStorage.getItem(_LOCAL_KEY) !== "1") return false;
      const expiry = parseInt(localStorage.getItem(_LOCAL_EXPIRY_KEY) || "0", 10);
      return Date.now() < expiry;
    };

    // ── High-Priority Override ─────────────────────────────────────────────
    // Evaluate admin_access URL parameter synchronously BEFORE any async work.
    // Appended by admin preview links (apps/main/pages/admin/courses.js).
    const searchParams = new URLSearchParams(window.location.search);
    const hasAdminFlag = searchParams.get("admin_access") === "true";
    const hasAdminAccessParam = hasAdminFlag;

    if (hasAdminFlag) {
      // Force the state to 'authorized' BEFORE the redirect logic can fire
      setAuthState({ isAuthorized: true, isAdmin: true, loading: false });
      // Immediately activate banner and persist so it survives lesson-to-lesson navigation.
      setIsAdminMode(true);
      localStorage.setItem(_LOCAL_KEY, "1");
      localStorage.setItem(_LOCAL_EXPIRY_KEY, String(Date.now() + _LOCAL_TTL_MS));
    }

    // ── Async: subscribe to Supabase auth, gate storage restoration ────────
    (async () => {
      let hasSession = false;

      try {
        const { supabase } = await import("@lib/supabaseClient");

        // Subscribe BEFORE calling getSession() to avoid missing a SIGNED_OUT
        // event that fires between the two calls.
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
          if (!isMounted) return;
          if (event === "SIGNED_OUT") {
            // Wipe admin state instantly — do not wait for an API round-trip.
            setIsAdminMode(false);
            setAdminLabel("");
            setAuthState({ isAuthorized: false, isAdmin: false, loading: false });
            _clearAdminStorage();
          }
        });
        authSubscription = subscription;

        const { data: { session } } = await supabase.auth.getSession();
        hasSession = !!session;
      } catch {
        // Supabase unavailable (CI / mock) — skip session check.
      }

      if (!isMounted) return;

      // ── Restore from storage — only when a Supabase session is active ────
      // This prevents stale localStorage entries from showing the banner to
      // logged-out users.
      if (!hasAdminAccessParam) {
        if (hasSession && isLocalAdminValid()) {
          setIsAdminMode(true);
          setAdminLabel(localStorage.getItem(_LOCAL_LABEL_KEY) || "");
        } else if (!hasSession) {
          // No active Supabase session — purge stale admin storage.
          _clearAdminStorage();
        } else if (localStorage.getItem(_LOCAL_KEY) === "1") {
          // Session exists but TTL has expired — clean up.
          _clearAdminStorage();
        }
        // Optimistic sessionStorage hydration — only when session is active.
        if (hasSession && sessionStorage.getItem(_SESSION_KEY) === "1") {
          setIsAdminMode(true);
          setAdminLabel(sessionStorage.getItem(_LABEL_KEY) || "");
        }
      }

      // ── Server verification ───────────────────────────────────────────────
      // Fast when the admin session cookie is present (apps/main).
      // On sub-app domains the cookie is absent; in that case we preserve
      // admin state only if it was set via the URL param or valid localStorage.
      fetchController = typeof AbortController !== "undefined" ? new AbortController() : null;
      fetchTimeoutId = setTimeout(() => fetchController?.abort(), 3000);

      fetch(`${adminApiBase}/api/admin/me`, {
        credentials: "same-origin",
        signal: fetchController?.signal,
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!isMounted) return;
          clearTimeout(fetchTimeoutId);
          const active = Boolean(data?.ok);
          const label = data?.label || "";
          if (active) {
            // Full server-verified admin session: update state and both storage layers.
            setIsAdminMode(true);
            setAdminLabel(label);
            setAuthState({ isAuthorized: true, isAdmin: true, loading: false });
            sessionStorage.setItem(_SESSION_KEY, "1");
            sessionStorage.setItem(_LABEL_KEY, label);
            localStorage.setItem(_LOCAL_KEY, "1");
            localStorage.setItem(_LOCAL_LABEL_KEY, label);
            localStorage.setItem(_LOCAL_EXPIRY_KEY, String(Date.now() + _LOCAL_TTL_MS));
          } else if (!hasAdminAccessParam && !isLocalAdminValid()) {
            // API says not-admin AND there is no active admin_access token (URL param or
            // valid localStorage entry) — clear admin mode entirely.
            setIsAdminMode(false);
            setAdminLabel("");
            setAuthState({ isAuthorized: false, isAdmin: false, loading: false });
            sessionStorage.removeItem(_SESSION_KEY);
            sessionStorage.removeItem(_LABEL_KEY);
          } else {
            // URL param or localStorage validates admin — mark loading complete.
            setAuthState((prev) => ({ ...prev, loading: false }));
          }
        })
        .catch(() => clearTimeout(fetchTimeoutId));
    })();

    return () => {
      isMounted = false;
      authSubscription?.unsubscribe();
      clearTimeout(fetchTimeoutId);
      fetchController?.abort();
    };
  }, [adminApiBase]);

  return (
    <AdminModeContext.Provider value={{ isAdminMode, adminLabel, authState }}>
      {children}
    </AdminModeContext.Provider>
  );
}

// ─── Banner ───────────────────────────────────────────────────────────────────

/**
 * AdminModeBanner
 *
 * Fixed-position yellow bar (z-index: 9999) that renders inside an
 * AdminModeProvider.  Invisible to regular users; zero render cost.
 */
export function AdminModeBanner() {
  const { isAdminMode, adminLabel } = useAdminMode();
  if (!isAdminMode) return null;

  return (
    <>
      {/* Push page content down so it isn't hidden behind the fixed bar */}
      <div style={{ height: "34px" }} aria-hidden="true" />

      <div
        role="banner"
        aria-label="Admin mode active"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "#eab308" /* yellow-500 */,
          borderBottom: "2px solid #ca8a04" /* yellow-600 */,
          padding: "4px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "8px",
          fontSize: "13px",
          fontWeight: 700,
          color: "#000",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          overflowX: "hidden",
        }}
      >
        <span>⚠️ HIGH-VALUE ADMIN MODE: UNRESTRICTED ACCESS ACTIVE</span>
        {adminLabel && (
          <span style={{ fontWeight: 400, fontSize: "12px", opacity: 0.8 }}>({adminLabel})</span>
        )}
        <a href="/admin" style={{ color: "#000", textDecoration: "underline", fontSize: "12px" }}>
          Dashboard
        </a>
        <a
          href="/admin/users"
          style={{ color: "#000", textDecoration: "underline", fontSize: "12px" }}
        >
          Users
        </a>
        <a
          href="/admin/entitlements"
          style={{ color: "#000", textDecoration: "underline", fontSize: "12px" }}
        >
          Entitlements
        </a>
      </div>
    </>
  );
}

// ─── AdminWrapper ─────────────────────────────────────────────────────────────

/**
 * AdminWrapper
 *
 * Drop-in wrapper for the entire app tree.  Mounts AdminModeProvider and
 * renders the sticky AdminModeBanner automatically.
 *
 * Usage in _app.js:
 *   <AdminWrapper isAdmin={false}>   ← isAdmin is optional; provider auto-detects
 *     {children}
 *   </AdminWrapper>
 *
 * The `isAdmin` prop is kept for SSR hint purposes only (e.g. if you know the
 * admin status from a server-rendered cookie). The client-side provider always
 * re-validates with /api/admin/me.
 *
 * @param {{ children: React.ReactNode, isAdmin?: boolean, adminApiBase?: string }} props
 */
export function AdminWrapper({ children, isAdmin: _ssrHint, adminApiBase = "" }) {
  return (
    <AdminModeProvider adminApiBase={adminApiBase}>
      {/* Banner rendered at provider level so it is always visible, even when
          AdminWrapperInner does the early admin-access pass-through. */}
      <AdminModeBanner />
      <AdminWrapperInner>{children}</AdminWrapperInner>
    </AdminModeProvider>
  );
}

function AdminWrapperInner({ children }) {
  const { authState } = useAdminMode();

  // High-Priority Override: when admin_access URL param confirms admin status,
  // pass through children immediately — before any redirect logic can fire —
  // to prevent the payment/enrollment page from flashing over the lesson.
  if (authState?.isAdmin && authState?.isAuthorized && !authState?.loading) {
    return <>{children}</>;
  }

  // Default: render children directly.  Layout is the responsibility of each
  // app's own page components, not the shared wrapper.
  return <>{children}</>;
}

export default AdminWrapper;
