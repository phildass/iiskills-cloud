/**
 * GET /api/admin/status
 *
 * Returns the current admin configuration state:
 *   { configured: boolean, needs_setup: boolean }
 *
 * - configured: true if a passphrase hash exists in DB OR ADMIN_PANEL_SECRET is set
 * - needs_setup: true if the current session cookie has needs_setup=true
 *
 * This endpoint does NOT require authentication so the login page can display
 * the correct message (bootstrap vs. normal login) before any session exists.
 */

import { parse } from 'cookie';
import {
  ADMIN_COOKIE_NAME,
  verifyAdminToken,
  createServiceRoleClient,
} from '../../../lib/adminAuth';

async function isPassphraseConfigured() {
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from('admin_settings')
      .select('value')
      .eq('key', 'admin_passphrase_hash')
      .single();
    return !!(data?.value);
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const dbConfigured = await isPassphraseConfigured();
  const configured = dbConfigured || !!process.env.ADMIN_PANEL_SECRET;

  // Check current session for needs_setup flag
  const cookies = parse(req.headers.cookie || '');
  const sessionToken = cookies[ADMIN_COOKIE_NAME];
  let needsSetup = false;
  if (sessionToken) {
    const result = verifyAdminToken(sessionToken);
    if (result.valid) {
      needsSetup = result.needsSetup;
    }
  }

  return res.status(200).json({ configured, needs_setup: needsSetup });
}
