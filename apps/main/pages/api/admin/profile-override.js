/**
 * Admin Profile Override API
 *
 * POST /api/admin/profile-override
 *
 * Allows an authenticated admin to forcibly update any profile field for a given
 * user, bypassing the normal field-locking rules enforced by /api/profile/update.
 *
 * Intended for use when a user requests a correction to locked fields
 * (e.g. a data entry mistake in their first submission). Every override is
 * permanently recorded in admin_audit_events with:
 *   - the admin actor
 *   - the target user
 *   - the exact fields changed (previous values and new values)
 *
 * Authentication: admin_session cookie or x-admin-secret header.
 *
 * Body:
 *   {
 *     userId: string,           // UUID of the target user
 *     fields: { [fieldName]: newValue },  // fields to override
 *     reason: string            // required: override reason stored in audit metadata
 *   }
 *
 * Response:
 *   200 { profile: { ... } }
 *   400 { error: string }
 *   401/403 auth error
 *   404 { error: "User not found" }
 *   500 { error: string }
 */

import {
  validateAdminRequestAsync,
  createServiceRoleClient,
  getActorInfo,
  writeAuditEvent,
} from "../../../lib/adminAuth";

// All editable profile fields that admin can override (excludes system fields
// like id, is_admin, is_paid_user, paid_at, registration_completed, created_at, etc.)
const OVERRIDABLE_PROFILE_FIELDS = new Set([
  "first_name",
  "last_name",
  "full_name",
  "phone",
  "gender",
  "date_of_birth",
  "age",
  "qualification",
  "state",
  "district",
  "country",
  "specify_country",
  "location",
  "education",
  "education_self",
  "education_father",
  "education_mother",
  "subscribed_to_newsletter",
  "username",
  // Allow unlocking a profile (resetting submission lock) so user can re-submit
  "profile_submitted_at",
  "name_change_count",
]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Require a valid admin session
  const auth = await validateAdminRequestAsync(req);
  if (!auth.valid) {
    return res.status(auth.status || 403).json({ error: auth.reason || "Forbidden" });
  }

  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    return res.status(500).json({ error: "Database not configured" });
  }

  const { userId, fields, reason } = req.body || {};

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ error: "userId (string) is required" });
  }

  if (!fields || typeof fields !== "object" || Array.isArray(fields)) {
    return res.status(400).json({ error: "fields (object) is required" });
  }

  // Validate that only overridable fields are present
  const unknownFields = Object.keys(fields).filter((f) => !OVERRIDABLE_PROFILE_FIELDS.has(f));
  if (unknownFields.length > 0) {
    return res.status(400).json({
      error: `Unknown or non-overridable fields: ${unknownFields.join(", ")}`,
    });
  }

  if (Object.keys(fields).length === 0) {
    return res.status(400).json({ error: "fields object must have at least one entry" });
  }

  // Fetch the current profile to snapshot previous values for the audit log
  const { data: currentProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (fetchError) {
    console.error("[api/admin/profile-override] fetch error:", fetchError.message);
    return res.status(500).json({ error: "Failed to fetch user profile", details: fetchError.message });
  }

  if (!currentProfile) {
    return res.status(404).json({ error: "User not found" });
  }

  // Capture previous values for audit
  const previousValues = {};
  for (const key of Object.keys(fields)) {
    previousValues[key] = currentProfile[key] ?? null;
  }

  // Perform the override update
  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update(fields)
    .eq("id", userId)
    .select("*")
    .maybeSingle();

  if (updateError) {
    console.error("[api/admin/profile-override] update error:", updateError.message);
    return res.status(500).json({ error: "Failed to update profile", details: updateError.message });
  }

  // Write a detailed audit event
  const actor = await getActorInfo(req);
  await writeAuditEvent(supabase, {
    actorUserId: actor.actorUserId,
    actorEmail: actor.actorEmail,
    actorType: actor.actorType,
    action: "admin_profile_override",
    targetUserId: userId,
    targetEmailOrPhone: currentProfile.phone || null,
    metadata: {
      fieldsChanged: Object.keys(fields),
      previousValues,
      newValues: fields,
      reason: reason || null,
    },
  });

  console.log(
    `[api/admin/profile-override] Admin overrode profile for userId=${userId}, ` +
      `fields=${Object.keys(fields).join(",")}`
  );

  return res.status(200).json({ profile: updatedProfile });
}
