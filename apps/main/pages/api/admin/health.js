/**
 * Admin Health Check
 *
 * GET /api/admin/health
 *
 * Requires valid admin_session cookie or x-admin-secret header.
 *
 * TEST_ADMIN_MODE=true: Supabase connectivity is not required or checked.
 *
 * Returns:
 *   200 — { ok: true, checks: { ... } }
 *   401 — not authenticated
 *   500 — server misconfiguration
 */

import { validateAdminRequest, createServiceRoleClient, isTestAdminMode, isAdminAuthDisabled } from '../../../lib/adminAuth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const auth = validateAdminRequest(req);
  if (!auth.valid) {
    return res.status(401).json({ error: auth.reason || 'Unauthorized' });
  }

  // When auth is completely disabled, skip all credential checks.
  if (isAdminAuthDisabled()) {
    return res.status(200).json({ ok: true, authDisabled: true, needs_setup: false });
  }

  const testMode = isTestAdminMode();

  const checks = {
    adminPanelSecret: !!process.env.ADMIN_PANEL_SECRET,
    adminSessionSigningKey: !!(
      process.env.ADMIN_SESSION_SIGNING_KEY || process.env.ADMIN_JWT_SECRET
    ),
    supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    dbConnectivity: testMode ? true : false,
    dbError: null,
  };

  if (!testMode) {
    // Test DB connectivity using service role (production only)
    try {
      const supabase = createServiceRoleClient();
      const { error } = await supabase
        .from('courses')
        .select('id')
        .limit(1);
      checks.dbConnectivity = !error;
      if (error) checks.dbError = error.message;
    } catch (err) {
      checks.dbError = err.message;
    }
  }

  // In test mode, Supabase keys are not required.
  const requiredChecks = testMode
    ? { adminSessionSigningKey: checks.adminSessionSigningKey, dbConnectivity: checks.dbConnectivity }
    : checks;

  const allOk = Object.entries(requiredChecks)
    .filter(([k]) => k !== 'dbError')
    .every(([, v]) => v === true);

  return res.status(allOk ? 200 : 500).json({
    ok: allOk,
    needs_setup: auth.needsSetup || false,
    testMode,
    checks,
  });
}
