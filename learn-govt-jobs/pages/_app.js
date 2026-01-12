import "../styles/globals.css";
import { useEffect, useState } from "react";
import { supabase, getCurrentUser } from "../lib/supabaseClient";
import AuthenticationChecker from "../../components/shared/AuthenticationChecker";

/**
 * Main App Component for Learn Government Jobs
 *
 * This component:
 * - Sets up global styles
 * - Initializes authentication state
 * - Provides authentication context to all pages
 */
function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    async function checkUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    }

    checkUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <AuthenticationChecker />
      <Component {...pageProps} user={user} loading={loading} />
    </>
  );
}

export default MyApp;
