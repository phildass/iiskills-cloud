/**
 * POST /api/admin/bootstrap-or-login
 *
 * Handles both the first-run bootstrap login and regular passphrase login.
 *

 * TEST_ADMIN_MODE=true (testing):
 * - Passphrase checked against ADMIN_PANEL_SECRET → ADMIN_SECRET → "iiskills123"
 * - No DB interaction; always returns needs_setup=false
 *
 * TEST_ADMIN_MODE=false (production, default):

 * TEST_ADMIN_MODE=true (env-only, no Supabase writes):
 * - Accepts ADMIN_PANEL_SECRET env var as passphrase; falls back to `iiskills123`.
 * - Never touches Supabase; always returns needs_setup=false.
 *
 * TEST_ADMIN_MODE=false / unset (production path):

 * - If no admin passphrase is stored in DB AND no ADMIN_PANEL_SECRET is set:
 *   accept ONLY the bootstrap passphrase `iiskills123`, then return needs_setup=true
 *   so the UI forces the admin to set a real passphrase.
 * - If a passphrase hash is stored in DB:
 *   verify against bcrypt hash; if correct, return needs_setup=false.
 * - If ADMIN_PANEL_SECRET env var is set:
 *   accept it as an emergency override (needs_setup=false).
 *
 * Cookie: HttpOnly admin_session signed with ADMIN_SESSION_SIGNING_KEY (12 h).
 */

import crypto from 'crypto';
import bcrypt from 'bcrypt';
import {
  createAdminToken,
  setAdminSessionCookie,
  createServiceRoleClient,
  isTestAdminMode,
  getTestPassphrase,
} from '../../../lib/adminAuth';

const BOOTSTRAP_PASSPHRASE = 'iiskills123';

async function getAdminPassphraseHash() {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'admin_passphrase_hash')
      .single();
    return data?.value || null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { passphrase } = req.body || {};
  if (!passphrase || typeof passphrase !== 'string') {
    return res.status(400).json({ error: 'passphrase is required' });
  }

  if (!process.env.ADMIN_SESSION_SIGNING_KEY && !process.env.ADMIN_JWT_SECRET) {
    return res.status(500).json({
      error: 'ADMIN_SESSION_SIGNING_KEY is not configured on the server',
    });
  }


  // ── TEST MODE ──────────────────────────────────────────────────────────────
  // When TEST_ADMIN_MODE=true, check only against the env-var passphrase.
  // No DB / Supabase access; no bootstrap setup flow.
  if (isTestAdminMode()) {
    const expected = getTestPassphrase();

  // ── TEST_ADMIN_MODE: env-only passphrase, no Supabase writes ──────────────
  if (process.env.TEST_ADMIN_MODE === 'true') {
    const expected = process.env.ADMIN_PANEL_SECRET || BOOTSTRAP_PASSPHRASE;

    const a = Buffer.from(passphrase);
    const b = Buffer.from(expected);
    const match = a.length === b.length && crypto.timingSafeEqual(a, b);
    if (!match) {
      return res.status(401).json({ error: 'Invalid passphrase' });
    }
    const token = createAdminToken(false);
    setAdminSessionCookie(res, token);
    return res.status(200).json({ ok: true, needs_setup: false });
  }


  // ── PRODUCTION MODE ────────────────────────────────────────────────────────

  // ──────────────────────────────────────────────────────────────────────────


  // Emergency override: ADMIN_PANEL_SECRET env var
  const masterSecret = process.env.ADMIN_PANEL_SECRET;
  if (masterSecret) {
    const a = Buffer.from(passphrase);
    const b = Buffer.from(masterSecret);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      const token = createAdminToken(false);
      setAdminSessionCookie(res, token);
      return res.status(200).json({ ok: true, needs_setup: false });
    }
  }

  // Check DB for a stored passphrase hash
  const storedHash = await getAdminPassphraseHash();

  if (storedHash) {
    // Normal login: verify passphrase against bcrypt hash
    const valid = await bcrypt.compare(passphrase, storedHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid passphrase' });
    }
    const token = createAdminToken(false);
    setAdminSessionCookie(res, token);
    return res.status(200).json({ ok: true, needs_setup: false });
  }

  // No hash stored yet: only the bootstrap passphrase is accepted
  if (passphrase !== BOOTSTRAP_PASSPHRASE) {
    return res.status(401).json({ error: 'Invalid passphrase' });
  }
  const token = createAdminToken(true); // needs_setup = true
  setAdminSessionCookie(res, token);
  return res.status(200).json({ ok: true, needs_setup: true });
}
