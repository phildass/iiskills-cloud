/**
 * AdminProtectedPage — Supabase-based admin guard
 *
 * Usage:
 *   import { useAdminProtectedPage } from '../../components/AdminProtectedPage';
 *   ...
 *   const { ready, denied } = useAdminProtectedPage();
 *   if (!ready) return null; // or a loading spinner
 *
 * Behaviour:
 * - Checks if user is logged in via Supabase auth.
 * - If not logged in → redirects to /login?redirect=<current path>.
 * - If logged in → checks admin authorization via public.profiles.is_admin.
 * - If unauthorized → renders the AccessDenied (403) component in place.
 *   (Does NOT redirect to / or /dashboard.)
 * - If authorized → calls /api/admin/supabase-login to mint an admin_session
 *   cookie so that all /api/admin/* endpoints (which use the sync
 *   validateAdminRequest check) also accept this session.
 * - Sets ready=true once the cookie is obtained and the page may render.
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
          return;
        }

        // Mint an admin_session cookie so /api/admin/* sync checks pass
        try {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.access_token) {
            await fetch("/api/admin/supabase-login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ access_token: session.access_token }),
            });
          }
        } catch {
          // Non-fatal — admin pages may still work via the Bearer token path
        }

        if (!cancelled) setReady(true);
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
 * AccessDenied — rendered when the user lacks admin privileges.
 * Shows a clear 403 message without an automatic redirect.
 */
export function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-sm">
        <div className="text-5xl mb-4">🚫</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-500 text-sm">
          You do not have admin privileges to access this page.
        </p>
      </div>
    </div>
  );
}
