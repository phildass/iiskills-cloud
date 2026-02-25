/**
 * AdminGate — client-side admin session guard
 *
 * Usage:
 *   import { useAdminGate } from '../../components/AdminGate';
 *   ...
 *   const { ready } = useAdminGate();
 *   if (!ready) return null; // or a loading spinner
 *
 * Behaviour:
 * - When NEXT_PUBLIC_DISABLE_ADMIN_GATE=true, always allows access (sandbox mode).
 * - Otherwise, calls GET /api/admin/health to validate the admin_session cookie.
 * - If the response is 401, redirects to /admin/login.
 * - If the response is ok (200 or even 500/env issues), the session is valid
 *   and the page is allowed to render.
 *
 * The guard never touches Supabase auth, profiles, or RLS.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// NEXT_PUBLIC_* vars are baked in at build time — identical on server and client.
const GATE_DISABLED = process.env.NEXT_PUBLIC_DISABLE_ADMIN_GATE === 'true';

export function useAdminGate() {
  const router = useRouter();
  const [ready, setReady] = useState(GATE_DISABLED);

  useEffect(() => {
    if (GATE_DISABLED) {
      return;
    }

    let cancelled = false;

    async function checkSession() {
      try {
        const res = await fetch('/api/admin/health');
        if (cancelled) return;
        if (res.status === 401) {
          router.replace(`/admin/login?redirect=${encodeURIComponent(router.asPath)}`);
        } else {
          const data = await res.json().catch(() => ({}));
          if (data.needs_setup) {
            router.replace('/admin/setup');
          } else {
            setReady(true);
          }
        }
      } catch {
        if (!cancelled) {
          // Network error — redirect to login for safety
          router.replace(`/admin/login?redirect=${encodeURIComponent(router.asPath)}`);
        }
      }
    }

    checkSession();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return { ready };
}
