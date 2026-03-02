/**
 * Profile API
 *
 * GET /api/profile
 *
 * Returns the authenticated user's profile record from public.profiles,
 * including paid status (is_paid_user).
 *
 * Requires: Authorization: Bearer <supabase_access_token>
 *
 * Response:
 *   200 { profile: { id, first_name, last_name, ... , is_paid_user, paid_at } }
 *   401 { error: 'Unauthorized' }
 *   404 { error: 'Profile not found' }
 */

import { createClient } from '@supabase/supabase-js';

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return res.status(503).json({ error: 'Database not configured' });
  }

  // Authenticate the request
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.substring(7);
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = userData.user;

  // Fetch profile from public.profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select(
      'id, first_name, last_name, full_name, gender, date_of_birth, age, education, ' +
        'qualification, location, state, district, country, specify_country, ' +
        'is_paid_user, paid_at, subscribed_to_newsletter, created_at, updated_at'
    )
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('[api/profile] DB error:', profileError.message);
    return res.status(500).json({ error: 'Failed to fetch profile' });
  }

  if (!profile) {
    return res.status(404).json({ error: 'Profile not found' });
  }

  // Also check entitlements table as fallback for paid status
  if (!profile.is_paid_user) {
    const now = new Date().toISOString();
    const { data: entitlement } = await supabase
      .from("entitlements")
      .select("id, purchased_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order("purchased_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (entitlement) {
      profile.is_paid_user = true;
      // Sync flags for future fast lookups (idempotent):
      // Always set is_paid_user; only set paid_at once (first grant)
      await supabase
        .from("profiles")
        .update({ is_paid_user: true })
        .eq("id", user.id)
        .eq("is_paid_user", false);

      await supabase
        .from("profiles")
        .update({ paid_at: entitlement.purchased_at || new Date().toISOString() })
        .eq("id", user.id)
        .is("paid_at", null);
    }
  }

  if (!profile.is_paid_user) {
    return res.status(403).json({ error: "Not a paid user" });
  }

  return res.status(200).json({ profile, email: user.email });
}
