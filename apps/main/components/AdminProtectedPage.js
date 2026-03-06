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
 * - If logged in → calls /api/admin/supabase-login with the access token.
 *   The server checks ADMIN_ALLOWLIST_EMAILS OR profiles.is_admin=true.
 * - If unauthorized (403) → renders the AccessDenied (403) component in place.
 *   (Does NOT redirect to / or /dashboard.)
 * - On success the server mints an admin_session cookie so that all
 *   /api/admin/* endpoints (which use the sync validateAdminRequest check)
 *   also accept this session.
 * - Sets ready=true once the cookie is obtained and the page may render.
 *
 * For superadmin-only pages pass `requireSuperadmin=true`. The hook will
 * additionally call /api/admin/admins?self=1 which returns 403 when the
 * authenticated user is not a superadmin.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export function useAdminProtectedPage({ requireSuperadmin = false } = {}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function checkAdmin() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (cancelled) return;

        if (!session?.access_token) {
          router.replace(`/login?redirect=${encodeURIComponent(router.asPath)}`);
          return;
        }

        // Server-side check: ADMIN_ALLOWLIST_EMAILS OR profiles.is_admin=true
        const loginRes = await fetch("/api/admin/supabase-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access_token: session.access_token }),
        });

        if (cancelled) return;

        if (loginRes.status === 403 || loginRes.status === 401) {
          setDenied(true);
          return;
        }

        if (!loginRes.ok) {
          // Server error — treat as denied to be safe
          setDenied(true);
          return;
        }

        // Superadmin check (if required)
        if (requireSuperadmin) {
          const saRes = await fetch("/api/admin/admins?self=1", {
            credentials: "same-origin",
          });
          if (cancelled) return;
          if (saRes.status === 403) {
            setDenied(true);
            return;
          }
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
  }, [router, requireSuperadmin]);

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
