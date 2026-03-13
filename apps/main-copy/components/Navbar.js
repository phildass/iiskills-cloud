"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SharedNavbar from "./shared/SharedNavbar";
import { canonicalLinks } from "../../../packages/shared-components/canonicalNavLinks";

/**
 * Navigation Bar Component for Main Domain
 *
 * Shows the "My Dashboard" link when a user is logged in.
 * Unauthenticated users see the canonical nav links plus Login/Register.
 */
export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    async function checkUser() {
      try {
        const { getCurrentUser } = await import("../lib/supabaseClient");
        const currentUser = await getCurrentUser();
        if (mounted) setUser(currentUser || null);
      } catch {
        // Silently fail — nav degrades gracefully to unauthenticated state
      }
    }
    checkUser();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { signOutUser } = await import("../lib/supabaseClient");
      const { success } = await signOutUser();
      if (success) {
        setUser(null);
        router.push("/");
      }
    } catch {
      // Silently fail
    }
  };

  // Append "My Dashboard" to canonical links when user is logged in
  const navLinks = user
    ? [
        ...canonicalLinks,
        {
          href: "/dashboard",
          label: "My Dashboard",
          className: "hover:text-primary transition text-base font-semibold text-blue-700",
          mobileClassName:
            "block hover:text-primary transition text-base py-2 font-semibold text-blue-700",
        },
      ]
    : canonicalLinks;

  return (
    <SharedNavbar
      user={user}
      onLogout={handleLogout}
      appName="iiskills.cloud"
      homeUrl="/"
      showAuthButtons={true}
      customLinks={navLinks}
    />
  );
}
