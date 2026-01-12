"use client";

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * AuthenticationChecker Component (TypeScript/App Router version)
 * 
 * Checks if the user is authenticated when opening an installed PWA app.
 * On first open (in standalone mode), if the user is not authenticated,
 * redirects them to the registration page.
 * 
 * This component should be included in the layout of learn-apt subdomain app.
 */
export default function AuthenticationChecker() {
  const router = useRouter();
  const { user } = useAuth();

  const checkAuthenticationOnFirstOpen = useCallback(() => {
    // Only check if app is running in standalone mode (installed PWA)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    if (!isStandalone) {
      // Not in standalone mode, no need to check
      return;
    }

    // Check if we've already prompted for authentication in this session
    const hasCheckedAuth = sessionStorage.getItem('hasCheckedAuth');
    if (hasCheckedAuth) {
      // Already checked in this session, don't check again
      return;
    }

    // Mark that we've checked auth in this session
    sessionStorage.setItem('hasCheckedAuth', 'true');

    // Don't check on admin page to avoid redirect loops
    // Note: learn-apt uses /admin for authentication instead of separate login/register pages
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/admin')) {
      return;
    }

    // Check if user is authenticated
    if (!user) {
      // User is not authenticated, redirect to admin page (which handles login/registration)
      // Pass the current path as a query parameter to redirect back after authentication
      const redirectUrl = `/admin?redirect=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
    }
  }, [user, router]);

  useEffect(() => {
    // Run the check
    checkAuthenticationOnFirstOpen();
  }, [checkAuthenticationOnFirstOpen]);

  // This component doesn't render anything
  return null;
}
