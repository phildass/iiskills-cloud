/**
 * Profile Update API
 *
 * POST /api/profile/update
 *
 * Updates the authenticated user's profile, enforcing field-locking rules:
 *
 * LOCK RULES (server-side enforced):
 *   - On FIRST submission (profile_submitted_at is null):
 *       All fields may be set. Sets profile_submitted_at = now().
 *   - After first submission:
 *       Locked fields (cannot change): first_name, last_name, full_name,
 *         phone, gender, date_of_birth, age, qualification, state, district,
 *         country, specify_country
 *       Unlocked (always editable): location, education_self, education_father,
 *         education_mother, education, subscribed_to_newsletter
 *       Name (first_name/last_name/full_name): may be changed ONCE after
 *         first submission (name_change_count < 1).
 *
 * Requires: Authorization: Bearer <supabase_access_token>
 *
 * Body: { first_name?, last_name?, full_name?, phone?, location?, gender?,
 *         date_of_birth?, age?, education?, qualification?, state?, district?,
 *         country?, specify_country?, education_self?, education_father?,
 *         education_mother?, subscribed_to_newsletter? }
 *
 * Response:
 *   200 { profile: { ... } }
 *   400 { error: '...', lockedFields?: [...] }
 *   401 { error: 'Unauthorized' }
 *   404 { error: 'Profile not found' }
 */

import { createClient } from "@supabase/supabase-js";

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

// Fields that are locked after first submission (unless eligible for one-time name change)
const LOCKED_FIELDS_AFTER_SUBMIT = [
  "phone",
  "gender",
  "date_of_birth",
  "age",
  "qualification",
  "state",
  "district",
  "country",
  "specify_country",
];

// Name fields — allowed to change once after first submission
const NAME_FIELDS = ["first_name", "last_name", "full_name"];

// Fields that are always editable regardless of submission status
const ALWAYS_EDITABLE = [
  "location",
  "education",
  "education_self",
  "education_father",
  "education_mother",
  "subscribed_to_newsletter",
];

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "PATCH") {
    res.setHeader("Allow", ["POST", "PATCH"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  // Authenticate the request via Bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = userData.user.id;

  // Fetch current profile to check lock state
  const { data: current, error: fetchError } = await supabase
    .from("profiles")
    .select(
      "id, first_name, last_name, full_name, phone, gender, date_of_birth, age, " +
        "education, qualification, location, state, district, country, specify_country, " +
        "profile_submitted_at, name_change_count, " +
        "education_self, education_father, education_mother, subscribed_to_newsletter"
    )
    .eq("id", userId)
    .maybeSingle();

  if (fetchError) {
    console.error("[api/profile/update] fetch error:", fetchError.message);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }

  if (!current) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const isFirstSubmission = !current.profile_submitted_at;

  // Build the update object from request body
  const body = req.body || {};
  const updates = {};
  const lockedFields = [];

  const allPossibleFields = [...LOCKED_FIELDS_AFTER_SUBMIT, ...NAME_FIELDS, ...ALWAYS_EDITABLE];

  for (const field of allPossibleFields) {
    if (!(field in body)) continue; // field not in payload, skip

    const newValue = body[field];

    if (isFirstSubmission) {
      // First submission: allow everything
      updates[field] = newValue;
    } else if (ALWAYS_EDITABLE.includes(field)) {
      // Always editable
      updates[field] = newValue;
    } else if (NAME_FIELDS.includes(field)) {
      // Name can change once after first submission
      if ((current.name_change_count || 0) < 1) {
        updates[field] = newValue;
      } else {
        lockedFields.push(field);
      }
    } else if (LOCKED_FIELDS_AFTER_SUBMIT.includes(field)) {
      // Locked after first submission
      lockedFields.push(field);
    }
  }

  if (lockedFields.length > 0 && Object.keys(updates).length === 0) {
    return res.status(400).json({
      error: "These fields cannot be changed after profile submission",
      lockedFields,
    });
  }

  // If name fields were updated and this is after first submission, increment counter
  if (!isFirstSubmission && NAME_FIELDS.some((f) => f in updates)) {
    updates.name_change_count = (current.name_change_count || 0) + 1;
  }

  // Mark first submission
  if (isFirstSubmission) {
    updates.profile_submitted_at = new Date().toISOString();
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select(
      "id, first_name, last_name, full_name, phone, gender, date_of_birth, age, " +
        "education, qualification, location, state, district, country, specify_country, " +
        "profile_submitted_at, name_change_count, " +
        "education_self, education_father, education_mother, subscribed_to_newsletter, " +
        "is_paid_user, paid_at, registration_completed, username, created_at, updated_at"
    )
    .maybeSingle();

  if (updateError) {
    console.error("[api/profile/update] update error:", updateError.message);
    return res.status(500).json({ error: "Failed to update profile" });
  }

  const response = { profile: updatedProfile };
  if (lockedFields.length > 0) {
    response.warnings = {
      message: "Some fields could not be updated because they are locked",
      lockedFields,
    };
  }

  return res.status(200).json(response);
}
