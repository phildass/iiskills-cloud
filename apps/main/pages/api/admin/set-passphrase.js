/**
 * POST /api/admin/set-passphrase
 *
 * Sets (or changes) the admin passphrase, stored as a bcrypt hash in a local
 * JSON file (ADMIN_DATA_FILE env var, default /var/lib/iiskills/admin.json).
 * Does NOT require Supabase.
 *
 * When TEST_ADMIN_MODE=true this endpoint is disabled — the passphrase must be
 * set via the ADMIN_PANEL_SECRET environment variable instead.
 *
 * Body: { newPassphrase: string }
 * On success: rotates cookie to needs_setup=false, returns { ok: true }
 */

import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { parse } from 'cookie';
import {
  ADMIN_COOKIE_NAME,
  verifyAdminToken,
  createAdminToken,
  setAdminSessionCookie,
  isTestAdminMode,
} from '../../../lib/adminAuth';

const BCRYPT_ROUNDS = 12;

function getAdminDataFile() {
  return process.env.ADMIN_DATA_FILE || '/var/lib/iiskills/admin.json';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // In test mode, passphrase management is via env var only.
  if (isTestAdminMode()) {
    return res.status(400).json({
      error: 'Set ADMIN_PANEL_SECRET in server env and restart.',
      testMode: true,
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

  const hash = await bcrypt.hash(newPassphrase, BCRYPT_ROUNDS);
  const dataFile = getAdminDataFile();
  try {
    const dir = path.dirname(dataFile);
    fs.mkdirSync(dir, { recursive: true });
    const data = { admin_passphrase_hash: hash, updated_at: new Date().toISOString() };
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), { mode: 0o600 });
    // Ensure restricted permissions even if file already existed
    fs.chmodSync(dataFile, 0o600);
  } catch (err) {
    return res.status(500).json({
      error: `Failed to store passphrase: ${err.message}. Ensure ${dataFile} is writable or set ADMIN_DATA_FILE env var.`,
    });
  }

  // Rotate session: mark needs_setup=false
  const newToken = createAdminToken(false);
  setAdminSessionCookie(res, newToken);

  return res.status(200).json({ ok: true });
}
