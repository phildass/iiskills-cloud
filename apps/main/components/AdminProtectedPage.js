/**
 * AdminProtectedPage — Supabase-based admin guard
 *
 * Usage:
 *   import { useAdminProtectedPage } from '../../components/AdminProtectedPage';
 *   ...
 *   const { ready } = useAdminProtectedPage();
 *   if (!ready) return null; // or a loading spinner
 *
 * Behaviour:
 * - Checks if user is logged in via Supabase auth.
 * - If not logged in → redirects to /login?redirect=<current path>.
 * - If logged in → checks admin authorization:
 *     • email is pda.indian@gmail.com or pda.indian@gvmail.com, OR
 *     • public.profiles.is_admin = true
 * - If unauthorized → shows "Access denied" briefly and redirects to /.
 * - If authorized → sets ready=true so the page may render.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase, isAdmin } from "../lib/supabaseClient";

export function useAdminProtectedPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAdmin() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (cancelled) return;

        if (!user) {
          router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
          return;
        }

        const adminAccess = await isAdmin(user);
        if (cancelled) return;

        if (!adminAccess) {
          setDenied(true);
          setTimeout(() => {
            if (!cancelled) router.replace("/");
          }, 2000);
          return;
        }

        setReady(true);
      } catch {
        if (!cancelled) {
          router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
        }
      }
    }

    checkAdmin();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return { ready, denied };
}

/**
 * AccessDenied — rendered while the user is being redirected away.
 */
export function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-sm">
        <div className="text-5xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-500 text-sm">You do not have admin privileges. Redirecting…</p>
      </div>
    </div>
  );
}
