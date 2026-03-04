/**
 * Checks whether the logged-in user has completed registration.
 * Returns { status, registrationCompleted }.
 *
 * Uses dynamic import for safety (matches your existing useUser.js pattern).
 */
import { useEffect, useState } from "react";

export function useRegistrationGate() {
  const [state, setState] = useState({
    status: "loading", // "loading" | "anon" | "ready"
    registrationCompleted: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const { getCurrentUser, supabase } = await import("@lib/supabaseClient");

        const user = await getCurrentUser();
        if (cancelled) return;

        if (!user) {
          setState({ status: "anon", registrationCompleted: false });
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("registration_completed")
          .eq("id", user.id)
          .single();

        if (cancelled) return;

        if (error) {
          // Fail-open to incomplete so CTA shows
          setState({ status: "ready", registrationCompleted: false });
          return;
        }

        setState({
          status: "ready",
          registrationCompleted: !!profile?.registration_completed,
        });
      } catch (e) {
        // If supabaseClient missing in some app context, treat as anon
        if (!cancelled) setState({ status: "anon", registrationCompleted: false });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
