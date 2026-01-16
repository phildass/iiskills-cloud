import { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Import Supabase helpers for authentication state and logout
import { getCurrentUser, signOutUser } from "../lib/supabaseClient";
import SharedNavbar from "./shared/SharedNavbar";

/**
 * Navigation Bar Component for Main Domain
 *
 * This component wraps the SharedNavbar with main domain-specific configuration.
 * It manages authentication state and provides the main domain navigation links.
 *
 * Features:
 * - Uses shared navbar component for consistent branding across all iiskills apps
 * - Manages user authentication state
 * - Provides logout functionality
 * - NO admin links in navigation (admin access via direct URL only)
 */
export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Check authentication status when component mounts
  useEffect(() => {
    checkUser();
  }, []);

  /**
   * Check if a user is currently logged in
   */
  const checkUser = async () => {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  /**
   * Handle user logout
   * Signs out the user from Supabase and redirects to login page
   */
  const handleLogout = async () => {
    const { success } = await signOutUser();
    if (success) {
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <SharedNavbar
      user={user}
      onLogout={handleLogout}
      appName="iiskills.cloud"
      homeUrl="/"
      showAuthButtons={true}
      customLinks={[
        { href: "/", label: "Home", className: "hover:text-primary transition" },
        { href: "/courses", label: "Courses", className: "hover:text-primary transition" },
        {
          href: "/certification",
          label: "Certification",
          className: "hover:text-primary transition",
        },
        {
          href: "/newsletter",
          label: "📧 Newsletter",
          className: "hover:text-primary transition",
        },
        {
          href: "https://www.aienter.in/payments",
          label: "Payments",
          className:
            "bg-accent text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition font-bold shadow-sm",
          mobileClassName:
            "block bg-accent text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition font-bold text-center shadow-sm",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        { href: "/about", label: "About", className: "hover:text-primary transition" },
      ]}
    />
  );
}
