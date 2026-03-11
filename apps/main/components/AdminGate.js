/**
 * AdminGate — client-side admin session guard
 *
 * Usage:
 *   import { useAdminGate, AccessDenied } from '../../components/AdminGate';
 *   ...
 *   const { ready, denied } = useAdminGate();
 *   if (!ready) return null; // or a loading spinner
 *   if (denied) return <AccessDenied />;
 *
 * Behaviour:
 * - When NEXT_PUBLIC_DISABLE_ADMIN_GATE=true, always allows access (local dev only).
 * - Otherwise, calls GET /api/admin/health to validate the admin_session cookie.
 *   - If health returns 200 → allow access immediately (no Supabase call needed).
 *   - If health returns 401 AND a Supabase session exists in the browser:
 *       1. Call POST /api/admin/supabase-login with { access_token }.
 *       2. If that returns 200, retry /api/admin/health and allow access.
 *       3. If it returns 403, set denied=true (show AccessDenied UI).
 *   - If health returns 401 and there is no Supabase session → redirect to /admin/login.
 *   - If health returns needs_setup → redirect to /admin/setup.
 *
 * For superadmin-only pages pass `requireSuperadmin: true`. The hook will
 * additionally call /api/admin/admins?self=1 which returns 403 when the
 * authenticated user is not a superadmin.
 *
 * Do NOT set NEXT_PUBLIC_DISABLE_ADMIN_GATE=true in production.
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

// Admin gate is disabled when NEXT_PUBLIC_DISABLE_ADMIN_GATE=true (local dev only).
// In production, leave NEXT_PUBLIC_DISABLE_ADMIN_GATE unset (or set to 'false').
const GATE_DISABLED = process.env.NEXT_PUBLIC_DISABLE_ADMIN_GATE === "true";

export function useAdminGate({ requireSuperadmin = false } = {}) {
  const router = useRouter();
  const [ready, setReady] = useState(GATE_DISABLED);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (GATE_DISABLED) {
      return;
    }

    let cancelled = false;

    async function checkSession() {
      try {
        // Step 1: validate existing admin_session cookie via health check.
        const healthRes = await fetch("/api/admin/health");
        if (cancelled) return;

        if (healthRes.status === 401) {
          // Step 2: No valid admin_session cookie — try the Supabase bridge.
          const {
            data: { session },
          } = await supabase.auth.getSession();

          if (cancelled) return;

          if (!session?.access_token) {
            // No Supabase session either — send to login.
            router.replace(`/admin/login?redirect=${encodeURIComponent(router.asPath)}`);
            return;
          }

          // Step 3: Mint an admin_session cookie via the Supabase bridge.
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
            console.error("[AdminGate] supabase-login error:", loginRes.status);
            setDenied(true);
            return;
          }

          // Step 4: Retry health now that the cookie is set.
          const retryRes = await fetch("/api/admin/health");
          if (cancelled) return;

          if (!retryRes.ok) {
            setDenied(true);
            return;
          }

          const retryData = await retryRes.json().catch(() => ({}));
          if (retryData.needs_setup) {
            router.replace("/admin/setup");
            return;
          }
        } else if (healthRes.ok) {
          // Health check passed with existing cookie — check needs_setup.
          const data = await healthRes.json().catch(() => ({}));
          if (data.needs_setup) {
            router.replace("/admin/setup");
            return;
          }
        } else {
          // Unexpected status (5xx etc.) — redirect to login for safety.
          router.replace(`/admin/login?redirect=${encodeURIComponent(router.asPath)}`);
          return;
        }

        // Optional superadmin check.
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
          // Network error — redirect to login for safety.
          router.replace(`/admin/login?redirect=${encodeURIComponent(router.asPath)}`);
        }
      }
    }

    checkSession();
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
