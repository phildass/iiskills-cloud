/**
 * POST /api/payments/save-profile
 *
 * Saves minimum profile details required before payment:
 * - first_name (required)
 * - last_name  (optional)
 * - phone      (required, normalised to E.164)
 *
 * Phone normalisation rules:
 *   - Strip all non-digit characters (except a leading "+").
 *   - If the raw value already starts with "+", keep it as "+<digits>".
 *   - Otherwise assume an Indian (+91) number:
 *       10-digit input  → "+91<digits>"
 *       12-digit input starting with "91" → "+<digits>"
 *       Any other length → "+91<digits>" (best-effort; validation catches bad numbers)
 *
 * Validation:
 *   - first_name: non-empty string (after trimming)
 *   - phone: must normalise to a valid E.164 string of 8–15 digits total
 *            (i.e. "+<8-15 digits>")
 *
 * Security:
 *   - Requires a valid Supabase Bearer token in the Authorization header.
 *   - Only first_name, last_name and phone are written; all other columns are
 *     untouched.
 *
 * Request:
 *   POST /api/payments/save-profile
 *   Authorization: Bearer <supabase_access_token>
 *   Body: { first_name: string, last_name?: string, phone: string }
 *
 * Response:
 *   200 { success: true }
 *   400 { error: string }   — validation failure
 *   401 { error: string }   — unauthenticated
 *   405 { error: string }   — wrong method
 *   500 { error: string }   — server error
 */

import { createClient } from "@supabase/supabase-js";

// ─── Phone normalisation ──────────────────────────────────────────────────────

/**
 * Normalise a raw phone input to E.164 format.
 *
 * @param {string} raw
 * @returns {string|null}  E.164 string (e.g. "+919876543210") or null if empty.
 */
export function normalizePhone(raw) {
  if (!raw || typeof raw !== "string") return null;

  const trimmed = raw.trim();
  if (!trimmed) return null;

  const hasLeadingPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");

  if (!digits) return null;

  if (hasLeadingPlus) {
    // Trust the caller's country code; just strip non-digits after the "+".
    return "+" + digits;
  }

  // No leading "+": assume India (+91).
  if (digits.length === 10) {
    return "+91" + digits;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return "+" + digits;
  }
  // Best-effort fallback: prepend +91.
  return "+91" + digits;
}

// ─── Validation ───────────────────────────────────────────────────────────────

/**
 * Validate E.164-normalised phone number.
 * Accepts "+<8–15 digits>".
 *
 * @param {string|null} e164
 * @returns {boolean}
 */
export function isValidE164(e164) {
  if (!e164) return false;
  return /^\+\d{8,15}$/.test(e164);
}

// ─── Supabase admin client ────────────────────────────────────────────────────

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── 1. Authenticate ──────────────────────────────────────────────────────────
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!accessToken) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[save-profile] Supabase not configured");
    return res.status(500).json({ error: "Server not configured" });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken);

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  // ── 2. Parse and validate body ───────────────────────────────────────────────
  const { first_name, last_name, phone } = req.body || {};

  const trimmedFirstName = typeof first_name === "string" ? first_name.trim() : "";
  if (!trimmedFirstName) {
    return res.status(400).json({ error: "first_name is required" });
  }

  const normalizedPhone = normalizePhone(phone);
  if (!isValidE164(normalizedPhone)) {
    return res.status(400).json({ error: "A valid phone number is required" });
  }

  const trimmedLastName = typeof last_name === "string" ? last_name.trim() : null;

  // ── 3. Upsert profile ────────────────────────────────────────────────────────
  const updates = {
    first_name: trimmedFirstName,
    phone: normalizedPhone,
    ...(trimmedLastName !== null && { last_name: trimmedLastName }),
  };

  const { error: updateError } = await supabase.from("profiles").update(updates).eq("id", user.id);

  if (updateError) {
    console.error("[save-profile] DB update error:", updateError.message);
    return res.status(500).json({ error: "Failed to update profile" });
  }

  console.log("[save-profile] Profile updated for user:", user.id.slice(0, 8) + "...");

  return res.status(200).json({ success: true });
}
