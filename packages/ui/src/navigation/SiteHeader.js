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
 * Additional gating:
 *   - If registration is NOT completed, show "Complete Registration →" as PRIMARY CTA
 *     and demote the course/app link to SECONDARY.
 *
 * @param {string} appId - The app identifier (e.g., 'learn-ai', 'main')
 * @param {boolean} isFreeApp - Whether this is a free app (affects payment link display)
 */
export default function SiteHeader({ appId = "main", isFreeApp = false }) {
  const [user, setUser] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [registrationCompleted, setRegistrationCompleted] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAuthState() {
      try {
        const { getCurrentUser } = await import("@lib/supabaseClient");
        const currentUser = await getCurrentUser();
        if (!mounted) return;
        setUser(currentUser);

        // Default assumptions:
        // - No user => registration gate irrelevant (treat as completed for nav logic)
        // - User exists => assume incomplete until proven complete (fail-open into CTA)
        if (!currentUser) {
          setRegistrationCompleted(true);
          setIsPaid(false);
          return;
        }

        setRegistrationCompleted(false);

        // Check paid + registration state from profiles (plus fallback entitlement)
        const { createClient } = await import("@supabase/supabase-js");
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (url && key) {
          const sb = createClient(url, key, {
            auth: { persistSession: false },
          });

          const { data: profile } = await sb
            .from("profiles")
            .select("is_paid_user,registration_completed")
            .eq("id", currentUser.id)
            .maybeSingle();

          if (!mounted) return;

          // Registration gate
          // If column is missing or null, treat as NOT completed so the CTA shows.
          setRegistrationCompleted(!!profile?.registration_completed);

          // Paid gate
          if (profile?.is_paid_user) {
            setIsPaid(true);
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

          if (!mounted) return;
          setIsPaid(!!entitlement);
        }
      } catch {
        // Credentials missing or mock client — stay unauthenticated
        // Keep defaults as-is.
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
      setRegistrationCompleted(true);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch {
      // ignore
    }
  };

  // When registration is incomplete, show Complete Registration CTA as primary
  // and allow Header to demote normal course/app link(s).
  const registrationIncomplete = !!user && registrationCompleted === false;

  return (
    <Header
      appName="" // Removed to create more space in navigation
      homeUrl="/"
      customLinks={getCanonicalLinks(appId, isFreeApp)}
      showAuthButtons={true} // UNIVERSAL NAV: Register and Login links visible to ALL users
      user={user}
      isPaid={isPaid}
      registrationIncomplete={registrationIncomplete}
      primaryCta={
        registrationIncomplete
          ? { label: "Complete Registration →", href: "/complete-registration" }
          : null
      }
      onLogout={handleLogout}
    />
  );
}
