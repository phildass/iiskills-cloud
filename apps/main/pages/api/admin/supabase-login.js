/**
 * POST /api/admin/supabase-login — REMOVED
 *
 * This endpoint previously bridged Supabase-authenticated users into the admin
 * session flow. Admin authentication is now password-based only.
 *
 * Use POST /api/admin/bootstrap-or-login with a { passphrase } body instead.
 */

export default function handler(req, res) {
  res.setHeader("Allow", []);
  return res.status(410).json({
    error:
      "This endpoint has been removed. Admin login is now password-based only. Use POST /api/admin/bootstrap-or-login.",
  });
}
