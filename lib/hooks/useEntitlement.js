/**
 * useEntitlement — Universal entitlement hook
 *
 * Shared across all learn-* apps to check whether the current session has
 * entitlement for a given app/lesson.  Centralises the duplicated
 * `checkEntitlement` logic that previously lived inside each paid lesson page.
 *
 * Rules:
 *  1. If `skip` is true  → returns `{ entitled: null, loading: false }` immediately.
 *  2. If free-access mode is enabled → entitled = true (no network call).
 *  3. If the app is free (per access-control config) → entitled = true.
 *  4. Otherwise → calls the entitlement API on the main app (iiskills.cloud),
 *     attaching the current Supabase Bearer token when available.
 *
 * Usage (paid lesson page):
 *
 *   const { entitled } = useEntitlement({
 *     appId: 'learn-ai',
 *     // skip the check for free lessons and the public sample lesson
 *     skip: lesson.isFree || (moduleId === '1' && lessonId === '1'),
 *   });
 *
 *   useEffect(() => {
 *     if (entitled === false) setShowEnrollment(true);
 *   }, [entitled]);
 *
 * @module useEntitlement
 */

import { useState, useEffect } from 'react';
import { isFreeAccessEnabled } from '../freeAccess';

/**
 * Determine whether the app is free without importing the full access-control
 * package (avoids bundling issues in apps that don't depend on it directly).
 * Falls back to true (open access) on any import error so lessons never get
 * incorrectly blocked if the package is unavailable.
 *
 * @param {string} appId
 * @returns {Promise<boolean>}
 */
async function resolveIsFreeApp(appId) {
  try {
    const { isFreeApp } = await import('../../packages/access-control/accessControl.js');
    return isFreeApp(appId);
  } catch {
    // If the access-control package is unavailable, default to open access
    // so that lessons are never incorrectly blocked.
    return true;
  }
}

/**
 * Fetch the entitlement status from the main app's API.
 *
 * Accepts optional injectable dependencies (`_deps`) for unit testing.
 * In production usage, leave `_deps` undefined — the function imports the
 * real Supabase client and uses the global `fetch`.
 *
 * @param {string} appId
 * @param {Object} [_deps] - Injectable deps for testing only.
 * @param {Function} [_deps.getSession] - Returns `{ data: { session } }`.
 * @param {Function} [_deps.fetchImpl]  - `fetch`-compatible function.
 * @returns {Promise<boolean>} true = entitled, false = not entitled
 */
export async function fetchEntitlement(appId, _deps) {
  const getSession = _deps?.getSession ?? (async () => {
    const { supabase } = await import('../supabaseClient');
    return supabase.auth.getSession();
  });
  const fetchImpl = _deps?.fetchImpl ?? fetch;

  const { data: { session } } = await getSession();

  const headers = {};
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  const apiBase =
    typeof window !== 'undefined'
      ? `${window.location.protocol}//iiskills.cloud`
      : 'https://iiskills.cloud';

  const res = await fetchImpl(`${apiBase}/api/entitlement?appId=${encodeURIComponent(appId)}`, {
    headers,
  });

  if (!res.ok) return false;

  const data = await res.json();
  return !!data.entitled;
}

/**
 * React hook — checks entitlement for a specific app/lesson combination.
 *
 * @param {Object} params
 * @param {string}  params.appId  - App ID to check (e.g. 'learn-ai').
 * @param {boolean} [params.skip] - When true the check is skipped entirely
 *                                   (e.g. free lessons or the sample lesson).
 *                                   `entitled` will be null in this case.
 * @returns {{ entitled: boolean|null, loading: boolean }}
 *   entitled: null  → check skipped
 *   entitled: true  → user has access
 *   entitled: false → user does not have access
 */
export function useEntitlement({ appId, skip = false }) {
  const [entitled, setEntitled] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (skip) {
      setEntitled(null);
      setLoading(false);
      return;
    }

    // Short-circuit for global free-access mode (no network call needed).
    if (isFreeAccessEnabled()) {
      setEntitled(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        // Free apps never require entitlement.
        const isFree = await resolveIsFreeApp(appId);
        if (isFree) {
          if (!cancelled) {
            setEntitled(true);
            setLoading(false);
          }
          return;
        }

        const result = await fetchEntitlement(appId);
        if (!cancelled) {
          setEntitled(result);
          setLoading(false);
        }
      } catch (err) {
        console.error('[useEntitlement] entitlement check failed for', appId, err);
        if (!cancelled) {
          setEntitled(false);
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [appId, skip]);

  return { entitled, loading };
}
