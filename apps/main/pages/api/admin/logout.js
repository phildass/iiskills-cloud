/**
 * POST /api/admin/logout
 *
 * Clears the admin_session cookie, effectively logging the admin out.
 */

import { clearAdminSessionCookie } from '../../../lib/adminAuth';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  clearAdminSessionCookie(res);
  return res.status(200).json({ ok: true });
}
