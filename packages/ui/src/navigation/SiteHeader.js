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
 *   - Authenticated and paid + registration incomplete:
 *       - shows "Complete Registration →" as PRIMARY CTA
 *       - demotes irrelevant links (payments + course/app entry links) via Header logic
 *   - Authenticated and paid + registration complete: shows user name + "PAID" badge + Profile link + Logout.
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

        if (!currentUser) {
          if (mounted) {
            setIsPaid(false);
            setRegistrationCompleted(true);
          }
          return;
        }

        const { createClient } = await import("@supabase/supabase-js");
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // If credentials missing, avoid blocking nav; treat as registered + not paid.
        if (!url || !key) {
          if (mounted) {
            setIsPaid(false);
            setRegistrationCompleted(true);
          }
          return;
        }

        const sb = createClient(url, key, { auth: { persistSession: false } });

        const { data: profile } = await sb
          .from("profiles")
          .select("is_paid_user, registration_completed")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (!mounted) return;

        // Check paid status via profiles flag first
        if (profile?.is_paid_user) {
          setIsPaid(true);
          // Treat null/undefined as not completed to be safe
          setRegistrationCompleted(profile?.registration_completed === true);
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

        setIsPaid(!!entitlement);

        if (entitlement) {
          // Paid by entitlement; require registration completion
          setRegistrationCompleted(profile?.registration_completed === true);
        } else {
          // Not paid users: don't force registration completion gating
          setRegistrationCompleted(true);
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
      setRegistrationCompleted(true);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch {
      // ignore
    }
  };

  const registrationIncomplete = !!user && isPaid && registrationCompleted === false;

  // Keep canonical links; Header will demote payment links when isPaid === true,
  // and will demote irrelevant links when registrationIncomplete === true.
  const navLinks = getCanonicalLinks(appId, isFreeApp);

  // Prefer main app domain for a central complete-registration flow
  const completeRegistrationHref =
    (process.env.NEXT_PUBLIC_MAIN_APP_URL || "https://iiskills.cloud") + "/complete-registration";

  return (
    <Header
      appName="" // Removed to create more space in navigation
      homeUrl="/"
      customLinks={navLinks}
      showAuthButtons={true} // UNIVERSAL NAV: Register and Login links visible to ALL users
      user={user}
      isPaid={isPaid}
      registrationIncomplete={registrationIncomplete}
      primaryCta={
        registrationIncomplete
          ? { label: "Complete Registration →", href: completeRegistrationHref }
          : null
      }
      onLogout={handleLogout}
    />
  );
}
