/**
 * Sandbox Supabase Health Check
 *
 * Confirms which Supabase project this app is connected to.
 * Safe to expose publicly — returns the URL *hostname* only, never credentials.
 *
 * GET /api/sandbox-health
 *
 * Response fields:
 *   ok              — overall health (true/false)
 *   sandbox         — true when NEXT_PUBLIC_TESTING_MODE is enabled
 *   suspended       — true when mock client is active (no real Supabase)
 *   supabaseHostname — hostname of the configured Supabase URL
 *   mode            — "mock (suspended)" | "live" | "error"
 *   queryOk         — result of a lightweight DB round-trip (live mode only)
 *   queryError      — error message from DB query if any
 *   ts              — ISO timestamp
 *
 * Access: public — no authentication required.
 */

import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const isSuspended = process.env.NEXT_PUBLIC_SUPABASE_SUSPENDED === 'true';
  const isSandbox = process.env.NEXT_PUBLIC_TESTING_MODE === 'true';

  // Expose hostname only — never expose the anon/service-role key
  let supabaseHostname = '(not configured)';
  try {
    if (supabaseUrl) supabaseHostname = new URL(supabaseUrl).hostname;
  } catch {
    supabaseHostname = supabaseUrl ? '(invalid URL)' : '(not configured)';
  }

  const result = {
    ok: false,
    sandbox: isSandbox,
    suspended: isSuspended,
    supabaseHostname,
    mode: null,
    queryOk: null,
    queryError: null,
    ts: new Date().toISOString(),
  };

  if (isSuspended) {
    result.ok = true;
    result.mode = 'mock (suspended)';
    return res.status(200).json(result);
  }

  // Live mode — attempt a lightweight query to confirm connectivity
  try {
    const { error } = await supabase.from('profiles').select('id').limit(1);
    result.ok = !error;
    result.queryOk = !error;
    result.queryError = error ? error.message : null;
    result.mode = 'live';
  } catch (err) {
    result.ok = false;
    result.queryOk = false;
    result.queryError = err.message;
    result.mode = 'error';
  }

  return res.status(result.ok ? 200 : 503).json(result);
}
