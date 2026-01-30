import "../styles/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import SharedNavbar from "@shared/SharedNavbar";
import SubdomainNavbar from "@shared/SubdomainNavbar";
import AuthenticationChecker from "@shared/AuthenticationChecker";
import ErrorBoundary from "@components/ErrorBoundary";
import Footer from "../components/Footer";
import AIAssistant from "@shared/AIAssistant";
import NewsletterSignup from "@shared/NewsletterSignup";
import { supabase, getCurrentUser, signOutUser } from "../lib/supabaseClient";
import { useNewsletterPopup } from "../utils/useNewsletterPopup";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { showPopup, closePopup, isClosing } = useNewsletterPopup(30); // Show for 30 seconds on each page load

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

  // Define subdomain-specific navigation sections
  const subdomainSections = [
    {
      label: "Home",
      href: "/",
      description: "Welcome to Learn Chemistry",
    },
    {
      label: "Learning Content",
      href: "/learn",
      description: "Access Chemistry learning materials",
    },
    {
      label: "Login",
      href: "/login",
      description: "Access your account",
    },
    {
      label: "Register",
      href: "/register",
      description: "Create a new account",
    },
  ];

  return (
    <ErrorBoundary>
      <AuthenticationChecker />
      <SharedNavbar
        user={user}
        onLogout={handleLogout}
        appName="Learn Chemistry"
        homeUrl="/"
        showAuthButtons={true}
        customLinks={[
          {
            href: "https://iiskills.cloud",
            label: "Home",
            className: "hover:text-primary transition",
          },
          {
            href: "https://iiskills.cloud/courses",
            label: "Courses",
            className: "hover:text-primary transition",
          },
          {
            href: "https://iiskills.cloud/certification",
            label: "Certification",
            className: "hover:text-primary transition",
          },
          {
            href: "https://www.aienter.in/payments",
            label: "Payments",
            className:
              "bg-accent text-white px-4 py-2 rounded hover:bg-purple-600 transition font-bold",
            mobileClassName:
              "block bg-accent text-white px-4 py-2 rounded hover:bg-purple-600 transition font-bold",
            target: "_blank",
            rel: "noopener noreferrer",
          },
          {
            href: "https://iiskills.cloud/about",
            label: "About",
            className: "hover:text-primary transition",
          },
          {
            href: "https://iiskills.cloud/terms",
            label: "Terms & Conditions",
            className: "hover:text-primary transition",
          },
        ]}
      />
      <SubdomainNavbar subdomainName="Learn Chemistry" sections={subdomainSections} />
      <Component {...pageProps} />
      <Footer />

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
    </ErrorBoundary>
  );
}
