import "../styles/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SharedNavbar from "../../components/shared/SharedNavbar";
import Footer from "../components/Footer";
import { supabase, getCurrentUser, signOutUser } from "../lib/supabaseClient";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };

    checkUser();

    // Listen for auth state changes to update navbar when user logs in/out
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { success } = await signOutUser();
    if (success) {
      setUser(null);
      router.push("/");
    }
  };

  return (
    <>
      <SharedNavbar
        user={user}
        onLogout={handleLogout}
        appName="Learn Your Aptitude"
        homeUrl="/"
        showAuthButtons={true}
        customLinks={[
          {
            href: "https://iiskills.cloud",
            label: "Home",
            className: "hover:text-primary transition",
          },
          {
            href: "https://iiskills.cloud/about",
            label: "About",
            className: "hover:text-primary transition",
          },
        ]}
      />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
