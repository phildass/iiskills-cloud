import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { AdminModeProvider, AdminModeBanner } from "../components/AdminProvider";
// Note: global.css should be imported in _app.js, not here

/**
 * Shared Layout Component
 *
 * Wraps page content with consistent header, footer, and the global Admin Mode
 * banner.  The AdminModeProvider verifies the admin session against
 * /api/admin/me so the ⚠️ HIGH-VALUE ADMIN MODE bar stays visible on every
 * page — including "Preview" deep-links into paid courses.
 *
 * Used by all apps in the monorepo for visual consistency.
 *
 * @param {string}  [adminApiBase=""] - Base URL for /api/admin/me calls.
 *   Pass NEXT_PUBLIC_MAIN_APP_URL for sub-apps (learn-ai, learn-developer, …)
 *   so they hit the main app's admin endpoint instead of their own origin.
 */
export default function Layout({
  children,
  appName,
  homeUrl,
  customLinks,
  user,
  onLogout,
  showAuthButtons,
  adminApiBase = "",
}) {
  return (
    <AdminModeProvider adminApiBase={adminApiBase}>
      <AdminModeBanner />
      <Header
        appName={appName}
        homeUrl={homeUrl}
        customLinks={customLinks}
        user={user}
        onLogout={onLogout}
        showAuthButtons={showAuthButtons}
      />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </AdminModeProvider>
  );
}
