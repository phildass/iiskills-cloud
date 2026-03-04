import { useEffect, useState } from "react";

/**
 * Expects that the app already has a Supabase client helper somewhere.
 * Update the import below to your actual client location in iiskills-cloud.
 */
import { supabase } from "../../authentication/supabaseClient"; // <-- adjust this path if different

type GateState =
  | { status: "loading" }
  | { status: "anon" }
  | { status: "ready"; registrationCompleted: boolean };

export function useRegistrationGate() {
  const [state, setState] = useState<GateState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const { data: auth } = await supabase.auth.getUser();
      if (cancelled) return;

      if (!auth?.user) {
        setState({ status: "anon" });
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("registration_completed")
        .eq("id", auth.user.id)
        .single();

      if (cancelled) return;

      if (error) {
        // Fail-open into "incomplete" so the CTA shows
        setState({ status: "ready", registrationCompleted: false });
        return;
      }

      setState({
        status: "ready",
        registrationCompleted: !!profile?.registration_completed,
      });
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
