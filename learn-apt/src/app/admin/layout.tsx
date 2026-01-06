"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Only redirect once loading is complete
    if (!isLoading) {
      // If not authenticated, redirect to /admin login page
      if (!isAuthenticated) {
        router.push("/admin");
      }
      // If authenticated but not an admin, redirect to home with error
      else if (!isAdmin) {
        router.push("/?error=unauthorized");
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return null;
  }

  // The /admin page itself will show the login form when not authenticated
  // All other admin routes require authentication AND admin role
  if (!isAuthenticated && pathname !== "/admin") {
    return null;
  }

  // If authenticated but not admin, don't render admin content
  if (isAuthenticated && !isAdmin && pathname !== "/admin") {
    return null;
  }

  return <>{children}</>;
}
