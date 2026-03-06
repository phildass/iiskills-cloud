/**
 * Complete Registration API
 *
 * POST /api/complete-registration
 *
 * Called from the /complete-registration page after a user completes payment.
 * Sets the user's password, generates a unique username, and marks the
 * profile as registration_completed.
 *
 * Security:
 * - Requires a valid Supabase access token in the Authorization header.
 * - Validates password strength server-side (min 10 chars, complexity rules).
 * - Uses Supabase Admin API to update the password (never handles raw session upgrade).
 * - Username generation is idempotent: existing usernames are preserved.
 *
 * Required env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (or NEXT_PUBLIC_SUPABASE_ANON_KEY as fallback)
 *
 * Request:
 *   POST /api/complete-registration
 *   Authorization: Bearer <supabase_access_token>
 *   Body: { password: string, confirmPassword: string }
 *
 * Response:
 *   200 { success: true, username: string, alreadyCompleted?: true }
 *   400 { error: string }   — validation failures
 *   401 { error: string }   — unauthenticated
 *   500 { error: string }   — server error
 */

import { createClient } from "@supabase/supabase-js";

// ─── Password validation ──────────────────────────────────────────────────────

/**
 * Validate password strength.
 * Rules: min 10 chars, at least one uppercase, lowercase, digit, special char.
 * @param {string} password
 * @returns {string[]} Array of error messages (empty = valid)
 */
export function validatePassword(password) {
  const errors = [];
  if (!password || typeof password !== "string") {
    return ["Password is required"];
  }
  if (password.length < 10) {
    errors.push("Password must be at least 10 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    errors.push("Password must contain at least one special character (e.g. @, #, $, !)");
  }
  return errors;
}

// ─── Username generation ──────────────────────────────────────────────────────

/**
 * Sanitise a name to produce a username base:
 * letters only, lowercase, max 10 chars.
 * @param {string} name
 * @returns {string}
 */
function sanitiseName(name) {
  const cleaned = (name || "")
    .replace(/[^a-zA-Z]/g, "")
    .toLowerCase()
    .slice(0, 10);
  return cleaned || "user";
}

/**
 * Generate a candidate username: base + 4 random digits.
 * @param {string} base
 * @returns {string}
 */
export function generateUsername(base) {
  const sanitised = sanitiseName(base);
  const digits = String(Math.floor(1000 + Math.random() * 9000));
  return `${sanitised}${digits}`;
}

// ─── Supabase client (service role) ──────────────────────────────────────────

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
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
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ── 1. Authenticate ────────────────────────────────────────────────────────
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!accessToken) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[complete-registration] Supabase not configured");
    return res.status(500).json({ error: "Server not configured" });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken);

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  // ── 2. Validate body ───────────────────────────────────────────────────────
  const { password, confirmPassword } = req.body || {};

  if (!password) {
    return res.status(400).json({ error: "Password is required" });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  const passwordErrors = validatePassword(password);
  if (passwordErrors.length > 0) {
    return res.status(400).json({ error: passwordErrors[0], errors: passwordErrors });
  }

  // ── 3. Check if already completed (idempotent) ────────────────────────────
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("registration_completed, username, first_name, last_name, full_name")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile?.registration_completed) {
    return res.status(200).json({
      success: true,
      alreadyCompleted: true,
      username: existingProfile.username,
    });
  }

  // ── 4. Update password via Supabase Admin API ──────────────────────────────
  const { error: pwError } = await supabase.auth.admin.updateUserById(user.id, { password });
  if (pwError) {
    console.error("[complete-registration] Password update failed:", pwError.message);
    return res.status(500).json({ error: "Failed to update password. Please try again." });
  }

  // ── 5. Generate unique username (skip if user already has one) ────────────
  let username = existingProfile?.username || null;

  if (!username) {
    const baseName =
      existingProfile?.full_name ||
      [existingProfile?.first_name, existingProfile?.last_name].filter(Boolean).join(" ") ||
      user.email?.split("@")[0] ||
      "user";

    // Retry loop for uniqueness
    let attempts = 0;
    while (!username && attempts < 10) {
      attempts++;
      const candidate = generateUsername(baseName);

      // Try to insert; if unique constraint fires we retry
      const { error: upsertErr } = await supabase
        .from("profiles")
        .update({ username: candidate })
        .eq("id", user.id)
        .is("username", null); // only set if still null (race-safe)

      // Check for uniqueness violation
      if (!upsertErr) {
        username = candidate;
      } else if (
        upsertErr.code === "23505" ||
        upsertErr.message?.includes("unique") ||
        upsertErr.message?.includes("duplicate")
      ) {
        // Collision — retry with a new candidate
        continue;
      } else {
        console.error("[complete-registration] Username update error:", upsertErr.message);
        break; // non-uniqueness error — stop retrying
      }
    }

    // Fallback: fetch whatever username was set (in case another request won the race)
    if (!username) {
      const { data: refetched } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();
      username = refetched?.username || null;
    }
  }

  // ── 6. Mark registration as completed ─────────────────────────────────────
  const { error: updateErr } = await supabase
    .from("profiles")
    .update({ registration_completed: true })
    .eq("id", user.id);

  if (updateErr) {
    console.error("[complete-registration] Profile update failed:", updateErr.message);
    return res.status(500).json({ error: "Failed to update profile. Please try again." });
  }

  console.log(
    `[complete-registration] Completed for user=${user.id.slice(0, 8)}... username=${username}`
  );

  return res.status(200).json({ success: true, username });
}
