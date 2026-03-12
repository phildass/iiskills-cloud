/**
 * Admin Authentication Utilities (Server-Side Only)
 *
 * Admin access is password-based only — no Supabase user account required.
 *
 * Access gate: passphrase via x-admin-secret header or signed admin_session cookie.
 * Optional IP allowlist: ADMIN_IP_ALLOWLIST (comma-separated).
 *
 * Cookie: admin_session (HttpOnly; Secure; SameSite=Lax) signed with ADMIN_SESSION_SIGNING_KEY
 * Session expiry: 12 hours
 *
 * TEST MODE (TEST_ADMIN_MODE=true):
 * - Passphrase checked against ADMIN_PANEL_SECRET → ADMIN_SECRET → "iiskills123"
 * - No Supabase / DB interaction required
 * - set-passphrase endpoint is disabled
 */

import crypto from "crypto";
import jwt from "jsonwebtoken";
import { serialize, parse } from "cookie";
import { createClient } from "@supabase/supabase-js";

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_EXPIRY_SECONDS = 12 * 60 * 60; // 12 hours

/**
 * Returns true when TEST_ADMIN_MODE=true is set in the server environment.
 * In this mode, the admin passphrase is read from env vars only (no Supabase).
 */
export function isTestAdminMode() {
  return process.env.TEST_ADMIN_MODE === "true";
}

/**
 * Returns true when ADMIN_AUTH_DISABLED=true is explicitly set.
 * When unset (or set to any other value) admin auth is ENABLED.
 * Setting ADMIN_AUTH_DISABLED=true is appropriate for local dev/staging;
 * it MUST be false (or absent) in production.
 */
export function isAdminAuthDisabled() {
  return process.env.ADMIN_AUTH_DISABLED === "true";
}

/**
 * Returns the effective admin passphrase for test mode (server-side only).
 * Priority: ADMIN_PANEL_SECRET → ADMIN_SECRET → "iiskills123"
 */
export function getTestPassphrase() {
  return process.env.ADMIN_PANEL_SECRET || process.env.ADMIN_SECRET || "iiskills123";
}

function getSigningKey() {
  const key = process.env.ADMIN_SESSION_SIGNING_KEY || process.env.ADMIN_JWT_SECRET;
  if (!key) throw new Error("ADMIN_SESSION_SIGNING_KEY is not configured");
  return key;
}

/**
 * Create a signed admin session JWT.
 * @param {boolean} needsSetup - true if the admin must set a passphrase before proceeding
 */
export function createAdminToken(needsSetup = false) {
  return jwt.sign({ admin: true, needs_setup: needsSetup }, getSigningKey(), {
    expiresIn: SESSION_EXPIRY_SECONDS,
  });
}

/**
 * Verify a signed admin session JWT.
 * @returns {{ valid: boolean, needsSetup: boolean }}
 */
export function verifyAdminToken(token) {
  try {
    const decoded = jwt.verify(token, getSigningKey());
    if (decoded.admin !== true) return { valid: false, needsSetup: false };
    return { valid: true, needsSetup: !!decoded.needs_setup };
  } catch {
    return { valid: false, needsSetup: false };
  }
}

/** Set the admin_session HttpOnly cookie on the response */
export function setAdminSessionCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    serialize(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_EXPIRY_SECONDS,
      path: "/",
    })
  );
}

/** Clear the admin_session cookie (logout) */
export function clearAdminSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    serialize(ADMIN_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })
  );
}

/** Extract the real client IP from request headers */
function getClientIp(req) {
  return (
    req.headers["x-real-ip"] ||
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

/** Check if the client IP is in ADMIN_IP_ALLOWLIST (if configured) */
function checkIpAllowlist(req) {
  const allowlist = process.env.ADMIN_IP_ALLOWLIST;
  if (!allowlist) return true; // No allowlist configured — allow all
  const clientIp = getClientIp(req);
  const allowedIps = allowlist
    .split(",")
    .map((ip) => ip.trim())
    .filter(Boolean);
  return allowedIps.includes(clientIp);
}

/**
 * Returns the admin email allowlist from the ADMIN_ALLOWLIST_EMAILS env var.
 * Emails are lower-cased and trimmed. Returns an empty array when the var is unset.
 */
export function getAdminAllowlistEmails() {
  const raw = process.env.ADMIN_ALLOWLIST_EMAILS || "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Returns true when the given email is in the ADMIN_ALLOWLIST_EMAILS env var.
 * Superadmins have additional privileges (create/revoke admins).
 *
 * @param {string|null|undefined} email
 * @returns {boolean}
 */
export function isSuperadmin(email) {
  if (!email) return false;
  const allowlist = getAdminAllowlistEmails();
  return allowlist.includes(email.toLowerCase());
}

/**
 * Extract the actor identity from a request.
 *
 * Returns:
 *   { actorUserId: null, actorEmail: null, actorType: 'password_admin' }
 *
 * Admin access is password-based only. There is no per-user identity associated
 * with an admin session.
 *
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<{ actorUserId: null, actorEmail: null, actorType: string }>}
 */
export async function getActorInfo() {
  return { actorUserId: null, actorEmail: null, actorType: "password_admin" };
}

/**
 * Write an audit event to the admin_audit_events table.
 *
 * @param {object} supabaseServiceClient - Supabase client with service role
 * @param {object} event
 * @param {string} event.action - Action enum (grant_entitlement, revoke_entitlement, etc.)
 * @param {string|null} event.actorUserId
 * @param {string|null} event.actorEmail
 * @param {string} event.actorType - 'supabase_admin' | 'emergency_admin'
 * @param {string|null} [event.targetUserId]
 * @param {string|null} [event.targetEmailOrPhone]
 * @param {string|null} [event.appId]
 * @param {string|null} [event.courseTitleSnapshot]
 * @param {object|null} [event.metadata]
 * @returns {Promise<void>}
 */
export async function writeAuditEvent(supabaseServiceClient, event) {
  try {
    await supabaseServiceClient.from("admin_audit_events").insert({
      actor_user_id: event.actorUserId || null,
      actor_email: event.actorEmail || null,
      actor_type: event.actorType,
      action: event.action,
      target_user_id: event.targetUserId || null,
      target_email_or_phone: event.targetEmailOrPhone || null,
      app_id: event.appId || null,
      course_title_snapshot: event.courseTitleSnapshot || null,
      metadata: event.metadata || null,
    });
  } catch (err) {
    // Audit failures must never block the main action — log and continue.
    console.error("[writeAuditEvent] Failed to write audit event:", err?.message || err);
  }
}

/**
 * Validate an incoming admin API request (synchronous, supreme-admin only).
 *
 * When ADMIN_AUTH_DISABLED=true, all requests are allowed unconditionally.
 *
 * Checks (in order):
 * 1. ADMIN_AUTH_DISABLED bypass
 * 2. Optional IP allowlist (ADMIN_IP_ALLOWLIST) — status 403 when blocked
 * 3. x-admin-secret header matching ADMIN_PANEL_SECRET
 * 4. Signed admin_session cookie
 *
 * @returns {{ valid: boolean, reason?: string, status?: number }}
 */
export function validateAdminRequest(req) {
  if (isAdminAuthDisabled()) {
    return { valid: true };
  }

  if (!checkIpAllowlist(req)) {
    return { valid: false, reason: "IP not in allowlist", status: 403 };
  }

  // Accept direct secret in header (useful for scripts / curl)
  const headerSecret = req.headers["x-admin-secret"];
  if (headerSecret) {
    const expectedSecret = process.env.ADMIN_PANEL_SECRET;
    if (!expectedSecret) {
      return { valid: false, reason: "ADMIN_PANEL_SECRET is not configured", status: 500 };
    }
    // Use constant-time comparison to prevent timing attacks
    const a = Buffer.from(headerSecret);
    const b = Buffer.from(expectedSecret);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) {
      return { valid: true };
    }
    // Wrong value — fall through to cookie check
  }

  // Accept signed session cookie
  const cookies = parse(req.headers.cookie || "");
  const sessionToken = cookies[ADMIN_COOKIE_NAME];
  if (sessionToken) {
    const result = verifyAdminToken(sessionToken);
    if (result.valid) {
      return { valid: true, needsSetup: result.needsSetup };
    }
  }

  return { valid: false, reason: "Unauthorized", status: 401 };
}

/**
 * Async version of validateAdminRequest (password/cookie path only).
 *
 * Supabase Bearer tokens are no longer accepted for admin authentication.
 * All admin access requires the admin password (cookie or x-admin-secret header).
 *
 * Checks (in order):
 * 1. ADMIN_AUTH_DISABLED bypass
 * 2. Optional IP allowlist (ADMIN_IP_ALLOWLIST) — status 403 when blocked
 * 3. x-admin-secret header matching ADMIN_PANEL_SECRET
 * 4. Signed admin_session cookie
 *
 * @returns {Promise<{ valid: boolean, reason?: string, status?: number }>}
 */
export async function validateAdminRequestAsync(req) {
  return validateAdminRequest(req);
}

/**
 * Create a Supabase client using the service role key.
 * NEVER expose this to the browser — server-side only.
 * Service role bypasses all Row-Level Security policies.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
