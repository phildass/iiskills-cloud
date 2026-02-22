/**
 * Admin Login / Logout API
 *
 * POST /api/admin/login  — validate ADMIN_PANEL_SECRET and set admin_session cookie
 * DELETE /api/admin/login — clear admin_session cookie (logout)
 *
 * The cookie is HttpOnly; Secure; SameSite=Lax and signed with ADMIN_SESSION_SIGNING_KEY.
 * It expires after 12 hours.
 *
 * No Supabase user accounts, profiles, or RLS are involved.
 */

import crypto from 'crypto';
import {
  createAdminToken,
  setAdminSessionCookie,
  clearAdminSessionCookie,
} from '../../../lib/adminAuth';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { secret } = req.body || {};

    const expectedSecret = process.env.ADMIN_PANEL_SECRET;
    if (!expectedSecret) {
      return res
        .status(500)
        .json({ error: 'ADMIN_PANEL_SECRET is not configured on the server' });
    }

    // Use constant-time comparison to prevent timing attacks
    const secretsMatch =
      typeof secret === 'string' &&
      secret.length === expectedSecret.length &&
      crypto.timingSafeEqual(Buffer.from(secret), Buffer.from(expectedSecret));

    if (!secretsMatch) {
      return res.status(401).json({ error: 'Invalid admin secret' });
    }

    // Ensure signing key is present before creating token
    if (
      !process.env.ADMIN_SESSION_SIGNING_KEY &&
      !process.env.ADMIN_JWT_SECRET
    ) {
      return res
        .status(500)
        .json({ error: 'ADMIN_SESSION_SIGNING_KEY is not configured on the server' });
    }

    const token = createAdminToken();
    setAdminSessionCookie(res, token);
    return res.status(200).json({ success: true });
  }

  if (req.method === 'DELETE') {
    clearAdminSessionCookie(res);
    return res.status(200).json({ success: true });
  }

  res.setHeader('Allow', ['POST', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
