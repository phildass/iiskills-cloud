/**
 * Save Profile API
 *
 * POST /api/payments/save-profile
 *
 * Saves first_name, last_name (optional), and phone to the authenticated
 * user's profile record in public.profiles.  Phone is normalised to E.164
 * format before storage: if no leading '+' is present, +91 (India) is
 * assumed.
 *
 * Called from the /payments/iiskills flow to capture contact details
 * before token generation so that aienter.in can pre-fill the payment form.
 *
 * Security:
 *   - Requires a valid Supabase access token in the Authorization header.
 *   - Users can only update their own profile (enforced by .eq('id', user.id)).
 *   - Phone is validated against E.164 regex after normalisation.
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY as fallback)
 *
 * Request:
 *   POST /api/payments/save-profile
 *   Authorization: Bearer <supabase_access_token>
 *   Body: { first_name: string, last_name?: string, phone: string }
 *
 * Response:
 *   200 { success: true, phone: string }   — normalised E.164 phone returned
 *   400 { error: string }                  — validation failure
 *   401 { error: string }                  — unauthenticated
 *   500 { error: string }                  — server error
 */

import { createClient } from '@supabase/supabase-js';

/** E.164 pattern: + then country code (1-9) then 6–14 digits */
const E164_REGEX = /^\+[1-9][0-9]{6,14}$/;

/**
 * Normalise a phone string to E.164.
 * Assumes +91 (India) when no leading '+' is present.
 * @param {string} raw
 * @returns {string}
 */
export function normalisePhone(raw) {
  const trimmed = (raw || '').trim();
  return trimmed.startsWith('+') ? trimmed : `+91${trimmed}`;
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // ── 1. Authenticate ─────────────────────────────────────────────────────────
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!accessToken) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error('[save-profile] Supabase not configured');
    return res.status(500).json({ error: 'Server not configured' });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken);

  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  // ── 2. Validate body ────────────────────────────────────────────────────────
  const { first_name, last_name, phone } = req.body || {};

  if (!first_name || typeof first_name !== 'string' || !first_name.trim()) {
    return res.status(400).json({ error: 'first_name is required' });
  }
  if (!phone || typeof phone !== 'string' || !phone.trim()) {
    return res.status(400).json({ error: 'phone is required' });
  }

  // ── 3. Normalise phone to E.164 ─────────────────────────────────────────────
  const normalisedPhone = normalisePhone(phone);

  if (!E164_REGEX.test(normalisedPhone)) {
    return res.status(400).json({
      error:
        'Invalid phone number. Please enter a valid number (e.g. 9876543210 or +919876543210).',
    });
  }

  // ── 4. Upsert profile fields ────────────────────────────────────────────────
  const updates = {
    first_name: first_name.trim(),
    phone: normalisedPhone,
    updated_at: new Date().toISOString(),
  };

  if (last_name && typeof last_name === 'string' && last_name.trim()) {
    updates.last_name = last_name.trim();
    updates.full_name = `${first_name.trim()} ${last_name.trim()}`;
  }

  const { error: updateErr } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id);

  if (updateErr) {
    console.error('[save-profile] Profile update failed:', updateErr.message);
    // Surface unique constraint violation with a friendly message
    if (updateErr.code === '23505' || updateErr.message?.includes('unique')) {
      return res.status(409).json({
        error: 'This phone number is already associated with another account.',
      });
    }
    if (updateErr.code === '23514' || updateErr.message?.includes('check')) {
      return res.status(400).json({
        error: 'Phone number does not meet the required format.',
      });
    }
    return res.status(500).json({ error: 'Failed to update profile. Please try again.' });
  }

  console.log(
    `[save-profile] Profile saved for user=${user.id.slice(0, 8)}... phone=***${normalisedPhone.slice(-4)}`
  );

  return res.status(200).json({ success: true, phone: normalisedPhone });
}
