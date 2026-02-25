"use client";

import { useState, useEffect } from 'react';

/**
 * useUser — shared hook to get the current Supabase authenticated user.
 *
 * Returns { user, loading } where:
 *   user   — the Supabase User object, or null if not authenticated
 *   loading — true while the session is being fetched
 *
 * Uses dynamic import so it is safe on apps where supabaseClient
 * may use a mock fallback (missing credentials in CI).
 */
export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      try {
        const { getCurrentUser } = await import('@lib/supabaseClient');
        const currentUser = await getCurrentUser();
        if (mounted) setUser(currentUser);
      } catch {
        // supabase credentials missing or mock client — treat as unauthenticated
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUser();
    return () => { mounted = false; };
  }, []);

  return { user, loading };
}

export default useUser;
