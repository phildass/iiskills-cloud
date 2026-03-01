/**
 * Link Payment API
 *
 * POST /api/profile/link-payment
 *
 * Called after a user registers or logs in to link any pre-existing payment
 * records (public.payments or public.entitlements) to their profile, setting
 * profiles.is_paid_user = true and paid_at if a match is found.
 *
 * This supports the "paid before register" flow: a user pays first,
 * then registers/logs in later.
 *
 * Requires: Authorization: Bearer <supabase_access_token>
 *
 * Response:
 *   200 { linked: bool, message: string }
 *   401 { error: 'Unauthorized' }
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
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
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
  const email = user.email?.toLowerCase().trim();

  // Check if already marked as paid
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_paid_user')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.is_paid_user) {
    return res.status(200).json({ linked: true, message: 'Already a paid user' });
  }

  let linked = false;
  let paidAt = null;

  // Check for active entitlements
  const now = new Date().toISOString();
  const { data: entitlement } = await supabase
    .from('entitlements')
    .select('id, purchased_at')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .order('purchased_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (entitlement) {
    linked = true;
    paidAt = entitlement.purchased_at;
  }

  // Fallback: check payments table by email
  if (!linked && email) {
    const { data: payment } = await supabase
      .from('payments')
      .select('id, created_at')
      .eq('status', 'captured')
      .ilike('user_email', email)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (payment) {
      linked = true;
      paidAt = payment.created_at;
    }
  }

  if (linked) {
    await supabase
      .from('profiles')
      .update({
        is_paid_user: true,
        paid_at: paidAt || new Date().toISOString(),
      })
      .eq('id', user.id);

    console.log(`[link-payment] Linked paid status for user=${user.id} email=${email}`);
    return res.status(200).json({ linked: true, message: 'Paid status linked to profile' });
  }

  return res.status(200).json({ linked: false, message: 'No payment record found' });
}
