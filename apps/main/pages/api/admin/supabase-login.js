/**
 * POST /api/admin/supabase-login
 *
 * Verifies a Supabase access token and issues an admin_session cookie when
 * the user qualifies as admin (ADMIN_ALLOWLIST_EMAILS OR profiles.is_admin = true).
 *
 * This endpoint bridges Supabase-authenticated admins into the existing
 * supreme-admin cookie flow so that all /api/admin/* endpoints (which use
 * the synchronous validateAdminRequest check) transparently accept both
 * auth paths without any changes to those individual handlers.
 *
 * Body: { access_token: string }
 * Responses:
 *   200 — admin_session cookie set
 *   400 — missing or invalid body
 *   403 — valid Supabase token but user is not an admin
 *   500 — server misconfiguration
 */

import {
  createAdminToken,
  createServiceRoleClient,
  getAdminAllowlistEmails,
  setAdminSessionCookie,
} from "../../../lib/adminAuth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { access_token } = req.body || {};
  if (!access_token || typeof access_token !== "string") {
    return res.status(400).json({ error: "access_token is required" });
  }

  let serviceClient;
  try {
    serviceClient = createServiceRoleClient();
  } catch {
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  // Verify the Supabase access token
  const {
    data: { user },
    error: authError,
  } = await serviceClient.auth.getUser(access_token);

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid or expired access token" });
  }

  // Check email allowlist
  const allowlistEmails = getAdminAllowlistEmails();
  if (user.email && allowlistEmails.includes(user.email.toLowerCase())) {
    const token = createAdminToken(false);
    setAdminSessionCookie(res, token);
    return res.status(200).json({ ok: true });
  }

  // Check profiles.is_admin via service role (bypasses RLS)
  const { data: profile } = await serviceClient
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (profile?.is_admin === true) {
    const token = createAdminToken(false);
    setAdminSessionCookie(res, token);
    return res.status(200).json({ ok: true });
  }

  return res.status(403).json({ error: "Not authorized as admin" });
}
