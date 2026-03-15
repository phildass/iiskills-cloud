/**
 * POST /api/admin/bootstrap-or-login
 *
 * Handles admin passphrase login.
 *
 * TEST_ADMIN_MODE=true (env-only, no file writes):
 * - Accepts ADMIN_PANEL_SECRET env var as passphrase. ADMIN_PANEL_SECRET is required.
 * - Never touches the local data file; always returns needs_setup=false.
 *
 * TEST_ADMIN_MODE=false / unset (production path):
 * - If ADMIN_PANEL_SECRET env var is set: accept it as an emergency override (needs_setup=false).
 * - If a passphrase hash is stored in the local file: verify against bcrypt hash.
 * - If neither ADMIN_PANEL_SECRET nor a stored hash is present: reject all logins (503).
 *
 * Cookie: HttpOnly admin_session signed with ADMIN_SESSION_SIGNING_KEY (12 h).
 *
 * Diagnostic logging: each code path emits a [adminLogin] console message so
 * operators can see exactly why a login succeeded or failed in PM2/server logs
 * without any sensitive values being disclosed.
 */

import crypto from "crypto";
import bcrypt from "bcrypt";
import fs from "fs";
import {
  createAdminToken,
  setAdminSessionCookie,
  isTestAdminMode,
  getTestPassphrase,
  createServiceRoleClient,
  writeAuditEvent,
} from "../../../lib/adminAuth";

/** Attempt to write a failed-login audit event without blocking the response. */
async function logFailedLogin(reason, req) {
  try {
    const supabase = createServiceRoleClient();
    const ip =
      req.headers["x-real-ip"] ||
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "unknown";
    await writeAuditEvent(supabase, {
      actorUserId: null,
      actorEmail: null,
      actorType: "unknown",
      action: "admin_login_failed",
      targetUserId: null,
      targetEmailOrPhone: null,
      metadata: { reason, ip },
    });
  } catch {
    // Audit failure must never surface to the caller — already logged by writeAuditEvent
  }
}

function getAdminDataFile() {
  return process.env.ADMIN_DATA_FILE || "/var/lib/iiskills/admin.json";
}

function getAdminPassphraseHash() {
  try {
    const data = JSON.parse(fs.readFileSync(getAdminDataFile(), "utf8"));
    return data?.admin_passphrase_hash || null;
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("[adminAuth] Error reading admin data file:", err.message);
    }
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { passphrase } = req.body || {};
  if (!passphrase || typeof passphrase !== "string") {
    return res.status(400).json({ error: "passphrase is required" });
  }

  const signingKeyConfigured = !!(
    process.env.ADMIN_SESSION_SIGNING_KEY || process.env.ADMIN_JWT_SECRET
  );
  console.log(
    `[adminLogin] Login attempt — ADMIN_SESSION_SIGNING_KEY configured: ${signingKeyConfigured}`
  );

  if (!signingKeyConfigured) {
    console.error(
      "[adminLogin] ADMIN_SESSION_SIGNING_KEY (or ADMIN_JWT_SECRET) is not set. " +
        "Ensure it is present in /etc/iiskills.env and restart the server."
    );
    return res.status(500).json({
      error: "ADMIN_SESSION_SIGNING_KEY is not configured on the server",
    });
  }

  // -- TEST MODE --
  if (isTestAdminMode()) {
    console.log("[adminLogin] Running in TEST_ADMIN_MODE");
    const expected = getTestPassphrase();
    if (!expected) {
      console.error(
        "[adminLogin] TEST_ADMIN_MODE requires a passphrase to be set. " +
          "Set ADMIN_PANEL_SECRET (or ADMIN_EMERGENCY_PASSPHRASE / ADMIN_PASSWORD) in /etc/iiskills.env and restart the server."
      );
      return res.status(503).json({
        error:
          "A passphrase (ADMIN_PANEL_SECRET, ADMIN_EMERGENCY_PASSPHRASE, or ADMIN_PASSWORD) must be configured for TEST_ADMIN_MODE",
      });
    }
    const a = Buffer.from(passphrase);
    const b = Buffer.from(expected);
    const match = a.length === b.length && crypto.timingSafeEqual(a, b);
    if (!match) {
      console.warn("[adminLogin] TEST_ADMIN_MODE: passphrase mismatch");
      logFailedLogin("passphrase_mismatch_test_mode", req);
      return res.status(401).json({ error: "Invalid passphrase" });
    }
    const token = createAdminToken(false);
    setAdminSessionCookie(res, token);
    return res.status(200).json({ ok: true, needs_setup: false });
  }

  // -- PRODUCTION MODE --

  // Emergency override: ADMIN_PANEL_SECRET / ADMIN_EMERGENCY_PASSPHRASE / ADMIN_PASSWORD env vars
  const masterSecret =
    process.env.ADMIN_PANEL_SECRET ||
    process.env.ADMIN_EMERGENCY_PASSPHRASE ||
    process.env.ADMIN_PASSWORD;
  if (masterSecret) {
    const a = Buffer.from(passphrase);
    const b = Buffer.from(masterSecret);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      console.log("[adminLogin] Login succeeded via ADMIN_PANEL_SECRET override");
      const token = createAdminToken(false);
      setAdminSessionCookie(res, token);
      return res.status(200).json({ ok: true, needs_setup: false });
    }
    console.log("[adminLogin] ADMIN_PANEL_SECRET is set but did not match — trying hash file");
  }

  // Check local file for a stored passphrase hash
  const dataFile = getAdminDataFile();
  const isCustomDataFile = !!process.env.ADMIN_DATA_FILE;
  const storedHash = getAdminPassphraseHash();
  console.log(
    `[adminLogin] Hash file: ${isCustomDataFile ? "(custom path)" : "(default path)"} — hash present: ${!!storedHash}`
  );

  if (storedHash) {
    // Normal login: verify passphrase against bcrypt hash
    const valid = await bcrypt.compare(passphrase, storedHash);
    if (!valid) {
      console.warn("[adminLogin] Bcrypt comparison failed — passphrase does not match stored hash");
      logFailedLogin("passphrase_mismatch_bcrypt", req);
      return res.status(401).json({ error: "Invalid passphrase" });
    }
    console.log("[adminLogin] Login succeeded via bcrypt hash");
    const token = createAdminToken(false);
    setAdminSessionCookie(res, token);
    return res.status(200).json({ ok: true, needs_setup: false });
  }

  // No hash stored. If ADMIN_PANEL_SECRET was set it already failed the match above → unauthorized.
  if (masterSecret) {
    console.warn("[adminLogin] ADMIN_PANEL_SECRET did not match and no hash is stored");
    logFailedLogin("passphrase_mismatch_master_secret", req);
    return res.status(401).json({ error: "Invalid passphrase" });
  }

  // No hash and no passphrase env var at all: admin login is not configured
  console.error(
    "[adminLogin] No passphrase configured: no stored bcrypt hash and no passphrase env var is set. " +
      "Set ADMIN_PANEL_SECRET (or ADMIN_EMERGENCY_PASSPHRASE / ADMIN_PASSWORD) in /etc/iiskills.env, " +
      "or configure a passphrase via /admin/setup, then restart the server."
  );
  return res.status(503).json({
    error:
      "Admin login is not configured. Set ADMIN_PANEL_SECRET, ADMIN_EMERGENCY_PASSPHRASE, or ADMIN_PASSWORD, or configure a passphrase via /admin/setup.",
  });
}
