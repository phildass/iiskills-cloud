/**
 * GET /api/admin/status
 *
 * Returns the current admin configuration state:
 *   { configured: boolean, needs_setup: boolean, testMode: boolean }
 *
 * TEST_ADMIN_MODE=true:
 * - Always returns configured=true (passphrase comes from env / default)
 * - testMode=true is included so the UI can show appropriate messaging
 * - No DB access
 *
 * Production (TEST_ADMIN_MODE=false):
 * - configured: true if a passphrase hash exists in the local data file OR
 *               ADMIN_PANEL_SECRET is set
 * - needs_setup: true if the current session cookie has needs_setup=true
 * - testMode: false
 *
 * This endpoint does NOT require authentication so the login page can display
 * the correct message (bootstrap vs. normal login) before any session exists.
 */

import fs from 'fs';
import { parse } from 'cookie';
import {
  ADMIN_COOKIE_NAME,
  verifyAdminToken,
  isTestAdminMode,
} from '../../../lib/adminAuth';

function getAdminDataFile() {
  return process.env.ADMIN_DATA_FILE || '/var/lib/iiskills/admin.json';
}

function isPassphraseConfigured() {
  if (process.env.ADMIN_PANEL_SECRET) return true;
  try {
    const data = JSON.parse(fs.readFileSync(getAdminDataFile(), 'utf8'));
    return !!(data?.admin_passphrase_hash);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('[adminStatus] Error reading admin data file:', err.message);
    }
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const testMode = isTestAdminMode();
  const configured = testMode ? true : isPassphraseConfigured();

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

  return res.status(200).json({ configured, needs_setup: needsSetup, testMode });
}
