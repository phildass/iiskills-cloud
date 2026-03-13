/**
 * Admin User Lookup by Phone
 *
 * GET /api/admin/lookup-user?phone=<E.164>
 *
 * Returns the profile record matching the given phone number so that
 * admins can identify a user and manually grant entitlements.
 *
 * The phone query parameter must be in E.164 format (e.g. +919876543210).
 * If the caller omits the leading '+', +91 is assumed automatically.
 *
 * Security: requires a valid admin session (admin_session cookie or
 * x-admin-secret header) — see lib/adminAuth.js.
 *
 * Response on success:
 *   {
 *     found: true,
 *     user_id: string,
 *     profile: {
 *       id, first_name, last_name, full_name, phone,
 *       is_admin, is_paid_user, paid_at,
 *       registration_completed, username,
 *       created_at, updated_at
 *     }
 *   }
 *
 * Response when not found:
 *   { found: false }
 *
 * Error responses:
 *   400 { error: string }  — missing / invalid phone
 *   401 { error: string }  — unauthorized
 *   500 { error: string }  — server error
 */

import { validateAdminRequest, createServiceRoleClient } from "../../../lib/adminAuth";

/** E.164 pattern: + then country code (1-9) then 6–14 digits */
const E164_REGEX = /^\+[1-9][0-9]{6,14}$/;

/**
 * Normalise a raw phone string to E.164.
 * Assumes +91 (India) when no leading '+' is present.
 * @param {string} raw
 * @returns {string}
 */
function normalisePhone(raw) {
  const trimmed = (raw || "").trim();
  return trimmed.startsWith("+") ? trimmed : `+91${trimmed}`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ── 1. Admin authentication ─────────────────────────────────────────────────
  const authResult = validateAdminRequest(req);
  if (!authResult.valid) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // ── 2. Validate + normalise phone param ────────────────────────────────────
  const rawPhone = req.query.phone;
  if (!rawPhone || typeof rawPhone !== "string" || !rawPhone.trim()) {
    return res.status(400).json({ error: "phone query parameter is required" });
  }

  const phone = normalisePhone(rawPhone);

  if (!E164_REGEX.test(phone)) {
    return res.status(400).json({
      error:
        "Invalid phone number format. Provide an E.164 number (e.g. +919876543210 or 9876543210).",
    });
  }

  // ── 3. Look up profile by phone ────────────────────────────────────────────
  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch (err) {
    console.error("[admin/lookup-user] Supabase not configured:", err.message);
    return res.status(500).json({ error: "Server not configured" });
  }

  const { data: profile, error: dbErr } = await supabase
    .from("profiles")
    .select(
      "id, first_name, last_name, full_name, phone, is_admin, is_paid_user, paid_at, registration_completed, username, created_at, updated_at"
    )
    .eq("phone", phone)
    .maybeSingle();

  if (dbErr) {
    console.error("[admin/lookup-user] DB error:", dbErr.message);
    return res.status(500).json({ error: "Database error" });
  }

  if (!profile) {
    return res.status(200).json({ found: false });
  }

  return res.status(200).json({
    found: true,
    user_id: profile.id,
    profile,
  });
}
