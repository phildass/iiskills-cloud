/**
 * POST /api/admin/set-passphrase
 *
 * Sets (or changes) the admin passphrase stored as a bcrypt hash in Supabase.
 * Requires a valid admin_session cookie (needs_setup=true or a full session).
 *
 * Body: { newPassphrase: string }
 * On success: rotates cookie to needs_setup=false, returns { ok: true }
 *
 * When TEST_ADMIN_MODE=true this endpoint is disabled — the passphrase must be
 * set via the ADMIN_PANEL_SECRET environment variable instead.
 */

import bcrypt from 'bcrypt';
import { parse } from 'cookie';
import {
  ADMIN_COOKIE_NAME,
  verifyAdminToken,
  createAdminToken,
  setAdminSessionCookie,
  createServiceRoleClient,
} from '../../../lib/adminAuth';

const BCRYPT_ROUNDS = 12;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // TEST_ADMIN_MODE: passphrase management is handled via env var only
  if (process.env.TEST_ADMIN_MODE === 'true') {
    return res.status(403).json({
      error: 'Set ADMIN_PANEL_SECRET in server env and restart.',
    });
  }

  // Require a valid admin session (needs_setup or full)
  const cookies = parse(req.headers.cookie || '');
  const sessionToken = cookies[ADMIN_COOKIE_NAME];
  if (!sessionToken) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const tokenResult = verifyAdminToken(sessionToken);
  if (!tokenResult.valid) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  const { newPassphrase } = req.body || {};
  if (!newPassphrase || typeof newPassphrase !== 'string') {
    return res.status(400).json({ error: 'newPassphrase is required' });
  }
  if (newPassphrase.length < 8) {
    return res.status(400).json({ error: 'Passphrase must be at least 8 characters' });
  }

  // Hash and upsert into admin_settings
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Database not configured' });
  }

  const hash = await bcrypt.hash(newPassphrase, BCRYPT_ROUNDS);
  const { error } = await supabase
    .from('admin_settings')
    .upsert({ key: 'admin_passphrase_hash', value: hash }, { onConflict: 'key' });

  if (error) {
    return res.status(500).json({ error: 'Failed to store passphrase' });
  }

  // Rotate session: mark needs_setup=false
  const newToken = createAdminToken(false);
  setAdminSessionCookie(res, newToken);

  return res.status(200).json({ ok: true });
}
