import { useState, useEffect } from "react";
import Header from "../common/Header";
import { getCanonicalLinks } from "./canonicalNavLinks";

/**
 * Shared site header used across all apps.
 * Provides consistent navigation and branding across the entire platform.
 *
 * Tracks authentication and paid-user state client-side:
 *   - Unauthenticated: shows Login / Register buttons only.
 *   - Authenticated but not paid: shows user name + Logout; no Profile link.
 *   - Authenticated and paid: shows user name + "PAID" badge + Profile link + Logout.
 *
 * @param {string} appId - The app identifier (e.g., 'learn-ai', 'main')
 * @param {boolean} isFreeApp - Whether this is a free app (affects payment link display)
 */
export default function SiteHeader({ appId = "main", isFreeApp = false }) {
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAuthState() {
      try {
        const { getCurrentUser } = await import("@lib/supabaseClient");
        const currentUser = await getCurrentUser();
        if (!mounted) return;
        setUser(currentUser);

        if (currentUser) {
          // Check paid status: profiles.is_paid_user OR active entitlement
          const { createClient } = await import("@supabase/supabase-js");
          const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          if (url && key) {
            const sb = createClient(url, key, {
              auth: { persistSession: false },
            });
            const { data: profile } = await sb
              .from("profiles")
              .select("is_paid_user")
              .eq("id", currentUser.id)
              .maybeSingle();

            if (profile?.is_paid_user) {
              if (mounted) setIsPaid(true);
              return;
            }

            // Fallback: active entitlement
            const now = new Date().toISOString();
            const { data: entitlement } = await sb
              .from("entitlements")
              .select("id")
              .eq("user_id", currentUser.id)
              .eq("status", "active")
              .or(`expires_at.is.null,expires_at.gt.${now}`)
              .limit(1)
              .maybeSingle();

            if (mounted) setIsPaid(!!entitlement);
          }
        }
      } catch {
        // Credentials missing or mock client — stay unauthenticated
      }
    }

    loadAuthState();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { signOutUser } = await import("@lib/supabaseClient");
      await signOutUser();
      setUser(null);
      setIsPaid(false);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch {
      // ignore
    }
  };

  return (
    <Header
      appName="" // Removed to create more space in navigation
      homeUrl="/"
      customLinks={getCanonicalLinks(appId, isFreeApp)}
      showAuthButtons={true} // UNIVERSAL NAV: Register and Login links visible to ALL users
      user={user}
      isPaid={isPaid}
      onLogout={handleLogout}
    />
  );
}
