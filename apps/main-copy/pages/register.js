import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EnhancedUniversalRegister } from "@iiskills/ui/authentication";

/**
 * Registration Page - Main App
 *
 * Comprehensive registration form with:
 * - First Name, Last Name
 * - Age
 * - Stage (Student, Employed, Other)
 * - Father's Occupation
 * - Mother's Occupation
 * - Location (Taluk, District, State for India; Other for non-India)
 * - Phone Number
 * - Purpose (Just Browsing, Intend to take a course)
 * - CAPTCHA (I'm not a robot)
 * - User status display
 * - Automated welcome email for verification
 *
 * Auth guard: signed-in users are immediately redirected to /dashboard so
 * that the registration form is never shown to an already-authenticated user.
 */
export default function Register() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // ── Auth guard ─────────────────────────────────────────────────────────────
  // If there is an active Supabase session the user is already registered.
  // Send them straight to the dashboard instead of showing the register form.
  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const { supabase } = await import("../lib/supabaseClient");
        const { data } = await supabase.auth.getSession();
        if (!cancelled && data?.session) {
          router.replace("/dashboard");
          return;
        }
      } catch {
        // Supabase unavailable — fall through and show register form
      }
      if (!cancelled) setChecking(false);
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, [router]);

  // Show nothing while the session check is in progress to avoid a flash of
  // the registration form for already-authenticated users.
  if (checking) return null;

  return (
    <>
      <Head>
        <title>Register - iiskills.cloud</title>
        <meta
          name="description"
          content="Create your account - Access all iiskills.cloud apps and learning modules"
        />
      </Head>

      <EnhancedUniversalRegister
        redirectAfterRegister="/sign-in"
        appName="iiskills.cloud"
        showGoogleAuth={true}
      />
    </>
  );
}
