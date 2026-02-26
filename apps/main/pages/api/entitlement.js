/**
 * Entitlement Check API
 *
 * GET /api/entitlement?appId=learn-ai
 *
 * Returns:
 *   { authenticated: bool, entitled: bool, expiresAt: string|null }
 *
 * Access: authenticated users only (reads their own entitlement row).
 * Checks the `entitlements` table for an active, non-expired record.
 */

import { createClient } from '@supabase/supabase-js';
import { isFreeAccessEnabled } from '../../../../lib/freeAccess';

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { appId } = req.query;
  if (!appId) {
    return res.status(400).json({ error: 'appId query parameter is required' });
  }

  // Free-access mode: treat all paid content as accessible.
  if (isFreeAccessEnabled()) {
    return res.status(200).json({ authenticated: true, entitled: true, expiresAt: null, freeAccess: true });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return res.status(200).json({ authenticated: false, entitled: false, expiresAt: null });
  }

  // Get authenticated user from Authorization header or cookie
  const authHeader = req.headers.authorization;
  let user = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const { data } = await supabase.auth.getUser(token);
    user = data?.user || null;
  }

  if (!user) {
    return res.status(200).json({ authenticated: false, entitled: false, expiresAt: null });
  }

  // Check entitlements table for active entitlement
  const now = new Date().toISOString();
  const { data: entitlement, error } = await supabase
    .from('entitlements')
    .select('id, status, expires_at')
    .eq('user_id', user.id)
    .in('app_id', [appId, 'ai-developer-bundle'])
    .eq('status', 'active')
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('purchased_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('[entitlement API] DB error:', error.message);
    // Fall back to checking user_app_access table (legacy)
    const { data: legacyAccess } = await supabase
      .from('user_app_access')
      .select('id, expires_at')
      .eq('user_id', user.id)
      .eq('app_id', appId)
      .eq('is_active', true)
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .limit(1)
      .maybeSingle();

    if (legacyAccess) {
      return res.status(200).json({
        authenticated: true,
        entitled: true,
        expiresAt: legacyAccess.expires_at || null,
      });
    }

    return res.status(200).json({ authenticated: true, entitled: false, expiresAt: null });
  }

  return res.status(200).json({
    authenticated: true,
    entitled: !!entitlement,
    expiresAt: entitlement?.expires_at || null,
  });
}
