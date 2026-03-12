/**
 * Profile API
 *
 * GET   /api/profile  — Returns the authenticated user's profile record.
 * PATCH /api/profile  — Updates editable fields of the authenticated user's profile.
 *
 * Accessible to any authenticated user (paid or unpaid). Profile is not
 * gated by payment status.
 *
 * Uses select('*') for schema safety — only returns columns that actually
 * exist in the DB, so missing optional columns do not cause errors.
 *
 * Requires: Authorization: Bearer <supabase_access_token>
 *
 * Response (GET):
 *   200 { profile: { ... } | null, email: string }
 *   401 { error: 'Unauthorized' }
 *   500 { error: 'Failed to fetch profile', details: string }
 *
 * Response (PATCH):
 *   200 { success: true }
 *   400 { error: 'No valid fields to update' }
 *   401 { error: 'Unauthorized' }
 *   500 { error: 'Failed to update profile', details: string }
 */

import { createClient } from "@supabase/supabase-js";

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

/**
 * Normalise a phone string to E.164 format, e.g. "+919876543210".
 * Returns null for blank / unparseable input.
 * Defaults to India (+91) country code when no leading "+" is present.
 */
function normalizePhone(raw) {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const hasLeadingPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return null;

  if (hasLeadingPlus) return "+" + digits;
  if (digits.length === 10) return "+91" + digits;
  if (digits.length === 12 && digits.startsWith("91")) return "+" + digits;
  return "+91" + digits;
}

/** Returns true if the string is a valid E.164 phone number. */
function isValidE164(e164) {
  if (!e164) return false;
  return /^\+[1-9]\d{6,14}$/.test(e164);
}

// Fields that users are allowed to update via PATCH
const EDITABLE_FIELDS = [
  "first_name",
  "last_name",
  "full_name",
  "gender",
  "date_of_birth",
  "age",
  "education",
  "qualification",
  "location",
  "state",
  "district",
  "country",
  "specify_country",
  "phone",
];

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "PATCH") {
    res.setHeader("Allow", ["GET", "PATCH"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  // Authenticate the request
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = userData.user;

  // ── PATCH: Update editable profile fields ──────────────────────────────────
  if (req.method === "PATCH") {
    const body = req.body || {};
    const updates = {};
    for (const field of EDITABLE_FIELDS) {
      if (field in body) {
        // Treat null, undefined, and empty string all as null (clear the field)
        const val = body[field];
        updates[field] = val == null || val === "" ? null : val;
      }
    }

    // ── Phone normalization ────────────────────────────────────────────────
    // The profiles table enforces an E.164 check constraint on the phone column.
    // Normalise any supplied phone number so plain 10-digit Indian numbers
    // (e.g. "9876543210") are automatically converted to "+919876543210".
    // Return a helpful 400 if the value cannot be normalised to a valid E.164
    // number (rather than letting the DB constraint fire a cryptic 500).
    if ("phone" in updates && updates.phone !== null) {
      const normalised = normalizePhone(updates.phone);
      if (!isValidE164(normalised)) {
        return res.status(400).json({
          error: "Invalid phone number. Please use E.164 format, e.g. +919876543210.",
        });
      }
      updates.phone = normalised;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (updateError) {
      console.error("[api/profile] PATCH error:", {
        message: updateError.message,
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint,
        userId: user.id,
      });
      return res
        .status(500)
        .json({ error: "Failed to update profile", details: updateError.message });
    }

    return res.status(200).json({ success: true });
  }

  // ── GET: Fetch profile using select('*') for schema safety ─────────────────
  // select('*') returns only columns that actually exist in the DB, so the
  // query does not fail if optional columns (e.g. is_paid_user, registration_completed)
  // have not been added by a migration yet.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    console.error("[api/profile] DB error:", {
      message: profileError.message,
      code: profileError.code,
      details: profileError.details,
      hint: profileError.hint,
      userId: user.id,
    });
    return res
      .status(500)
      .json({ error: "Failed to fetch profile", details: profileError.message });
  }

  // Check entitlements table as fallback for paid status (sync only — no gating)
  if (profile && !profile.is_paid_user) {
    const now = new Date().toISOString();
    const { data: entitlement } = await supabase
      .from("entitlements")
      .select("id, purchased_at")
      .eq("user_id", user.id)
      .eq("status", "active")
      .or(`expires_at.is.null,expires_at.gt.${now}`)
      .order("purchased_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (entitlement) {
      profile.is_paid_user = true;
      // Sync flags for future fast lookups (idempotent):
      // Always set is_paid_user; only set paid_at once (first grant)
      await supabase
        .from("profiles")
        .update({ is_paid_user: true })
        .eq("id", user.id)
        .eq("is_paid_user", false);

      await supabase
        .from("profiles")
        .update({ paid_at: entitlement.purchased_at || new Date().toISOString() })
        .eq("id", user.id)
        .is("paid_at", null);
    }
  }

  // Return profile (null for new users without a profile row yet).
  // Profile access is not gated by payment status — any authenticated user
  // can read and edit their profile.
  return res.status(200).json({ profile: profile || null, email: user.email });
}
