import "../styles/globals.css";
import { useEffect, useState } from "react";
import { supabase, getCurrentUser } from "../lib/supabaseClient";
import AuthenticationChecker from "@shared/AuthenticationChecker";
import AIAssistant from "@shared/AIAssistant";
import NewsletterSignup from "@shared/NewsletterSignup";
import { useNewsletterPopup } from "../utils/useNewsletterPopup";

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
  const { showPopup, closePopup, isClosing } = useNewsletterPopup(30); // Show for 30 seconds on each page load

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

      {/* AI Assistant - always visible */}
      <AIAssistant />

      {/* Newsletter Popup - shows based on timing */}
      {showPopup && (
        <NewsletterSignup
          mode="modal"
          onClose={() => closePopup(false)}
          onSuccess={() => closePopup(true)}
          isClosing={isClosing}
        />
      )}
    </>
  );
}

export default MyApp;
