import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../global.css";

/**
 * Shared Layout Component
 * 
 * Wraps page content with consistent header and footer
 * Used by all apps in the monorepo for visual consistency
 */
export default function Layout({ 
  children,
  appName,
  homeUrl,
  customLinks,
  user,
  onLogout,
  showAuthButtons,
}) {
  return (
    <>
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
    </>
  );
}
