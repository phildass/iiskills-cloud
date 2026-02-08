// ============================================================================
// AUTHENTICATION REMOVED - OPEN ACCESS REFACTOR
// ============================================================================
// This navigation bar previously managed user authentication state.
// All authentication logic has been commented out to make navigation fully public.
// ============================================================================

"use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";

// Import Supabase helpers for authentication state and logout - DISABLED
// import { getCurrentUser, signOutUser } from "../lib/supabaseClient";
import SharedNavbar from "./shared/SharedNavbar";
import { canonicalLinks } from "../../../components/shared/canonicalNavLinks";

/**
 * Navigation Bar Component for Main Domain - AUTHENTICATION DISABLED
 *
 * OPEN ACCESS MODE: This component now provides fully open-access navigation.
 * All authentication state management and logout functionality has been removed.
 *
 * Previous functionality (now disabled):
 * - Managed user authentication state
 * - Provided logout functionality
 * - Checked authentication status on mount
 */
export default function Navbar() {
  // OPEN ACCESS: All auth state management removed
  // const [user, setUser] = useState(null);
  // const router = useRouter();

  // Authentication check disabled
  // useEffect(() => {
  //   checkUser();
  // }, []);

  /**
   * Check if a user is currently logged in - DISABLED
   */
  // const checkUser = async () => {
  //   const currentUser = await getCurrentUser();
  //   setUser(currentUser);
  // };

  /**
   * Handle user logout - DISABLED
   * Signs out the user from Supabase and redirects to login page
   */
  // const handleLogout = async () => {
  //   const { success } = await signOutUser();
  //   if (success) {
  //     setUser(null);
  //     router.push("/login");
  //   }
  // };

  return (
    <SharedNavbar
      user={null} // OPEN ACCESS: No user authentication
      onLogout={null} // OPEN ACCESS: No logout functionality
      appName="iiskills.cloud"
      homeUrl="/"
      showAuthButtons={false} // OPEN ACCESS: Auth buttons disabled - all content is public
      customLinks={canonicalLinks}
    />
  );
}
