/**
 * Admin Authentication Utilities (Server-Side Only)
 *
 * Provides "supreme" admin access:
 * - No dependency on Supabase user accounts, profiles, or RLS
 * - All admin actions use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS)
 * - Access gate: ADMIN_PANEL_SECRET via x-admin-secret header or signed cookie
 * - Optional IP allowlist: ADMIN_IP_ALLOWLIST (comma-separated)
 *
 * Cookie: admin_session (HttpOnly; Secure; SameSite=Lax) signed with ADMIN_SESSION_SIGNING_KEY
 * Session expiry: 12 hours
 */

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';
import { createClient } from '@supabase/supabase-js';

export const ADMIN_COOKIE_NAME = 'admin_session';
const SESSION_EXPIRY_SECONDS = 12 * 60 * 60; // 12 hours

function getSigningKey() {
  const key = process.env.ADMIN_SESSION_SIGNING_KEY || process.env.ADMIN_JWT_SECRET;
  if (!key) throw new Error('ADMIN_SESSION_SIGNING_KEY is not configured');
  return key;
}

/** Create a signed admin session JWT */
export function createAdminToken() {
  return jwt.sign({ admin: true }, getSigningKey(), {
    expiresIn: SESSION_EXPIRY_SECONDS,
  });
}

/** Verify a signed admin session JWT; returns true if valid */
export function verifyAdminToken(token) {
  try {
    const decoded = jwt.verify(token, getSigningKey());
    return decoded.admin === true;
  } catch {
    return false;
  }
}

/** Set the admin_session HttpOnly cookie on the response */
export function setAdminSessionCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    serialize(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_EXPIRY_SECONDS,
      path: '/',
    })
  );
}

/** Clear the admin_session cookie (logout) */
export function clearAdminSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    serialize(ADMIN_COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })
  );
}

/** Extract the real client IP from request headers */
function getClientIp(req) {
  return (
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

/** Check if the client IP is in ADMIN_IP_ALLOWLIST (if configured) */
function checkIpAllowlist(req) {
  const allowlist = process.env.ADMIN_IP_ALLOWLIST;
  if (!allowlist) return true; // No allowlist configured — allow all
  const clientIp = getClientIp(req);
  const allowedIps = allowlist.split(',').map((ip) => ip.trim()).filter(Boolean);
  return allowedIps.includes(clientIp);
}

/**
 * Validate an incoming admin API request.
 *
 * Checks (in order):
 * 1. Optional IP allowlist (ADMIN_IP_ALLOWLIST)
 * 2. x-admin-secret header matching ADMIN_PANEL_SECRET
 * 3. Signed admin_session cookie
 *
 * @returns {{ valid: boolean, reason?: string }}
 */
export function validateAdminRequest(req) {
  if (!checkIpAllowlist(req)) {
    return { valid: false, reason: 'IP not in allowlist' };
  }

  // Accept direct secret in header (useful for scripts / curl)
  const headerSecret = req.headers['x-admin-secret'];
  if (headerSecret) {
    const expectedSecret = process.env.ADMIN_PANEL_SECRET;
    if (!expectedSecret) {
      return { valid: false, reason: 'ADMIN_PANEL_SECRET is not configured' };
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
  const cookies = parse(req.headers.cookie || '');
  const sessionToken = cookies[ADMIN_COOKIE_NAME];
  if (sessionToken && verifyAdminToken(sessionToken)) {
    return { valid: true };
  }

  return { valid: false, reason: 'Unauthorized' };
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
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
    );
  }

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
