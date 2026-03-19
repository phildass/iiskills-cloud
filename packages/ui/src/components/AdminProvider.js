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

const AdminModeContext = createContext({ isAdminMode: false, adminLabel: "" });

const _SESSION_KEY = "__iiskills_admin";
const _LABEL_KEY = "__iiskills_admin_label";

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
 * Checks sessionStorage for a cached result, then verifies with /api/admin/me.
 *
 * @param {{ children: React.ReactNode, adminApiBase?: string }} props
 *   adminApiBase — prefix for API calls; defaults to "" (relative, for apps/main).
 *                  Pass NEXT_PUBLIC_MAIN_APP_URL for sub-apps.
 */
export function AdminModeProvider({ children, adminApiBase = "" }) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminLabel, setAdminLabel] = useState("");

  useEffect(() => {
    // Optimistic hydration from sessionStorage — avoids banner flash on navigation
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem(_SESSION_KEY) === "1") {
        setIsAdminMode(true);
        setAdminLabel(sessionStorage.getItem(_LABEL_KEY) || "");
      }
    }

    // Server verification — fast because the admin session cookie is in the request
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = setTimeout(() => controller?.abort(), 3000);

    fetch(`${adminApiBase}/api/admin/me`, {
      credentials: "same-origin",
      signal: controller?.signal,
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        clearTimeout(timeoutId);
        const active = Boolean(data?.ok);
        const label = data?.label || "";
        setIsAdminMode(active);
        setAdminLabel(label);
        if (typeof window !== "undefined") {
          if (active) {
            sessionStorage.setItem(_SESSION_KEY, "1");
            sessionStorage.setItem(_LABEL_KEY, label);
          } else {
            sessionStorage.removeItem(_SESSION_KEY);
            sessionStorage.removeItem(_LABEL_KEY);
          }
        }
      })
      .catch(() => clearTimeout(timeoutId));

    return () => {
      clearTimeout(timeoutId);
      controller?.abort();
    };
  }, [adminApiBase]);

  return (
    <AdminModeContext.Provider value={{ isAdminMode, adminLabel }}>
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
          gap: "12px",
          fontSize: "13px",
          fontWeight: 700,
          color: "#000",
          boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
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
      <AdminWrapperInner>{children}</AdminWrapperInner>
    </AdminModeProvider>
  );
}

function AdminWrapperInner({ children }) {
  const { isAdminMode } = useAdminMode();

  return (
    <div className="min-h-screen relative">
      <AdminModeBanner />
      <main className={isAdminMode ? "pt-10" : ""}>{children}</main>
    </div>
  );
}

export default AdminWrapper;
