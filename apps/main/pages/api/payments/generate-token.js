import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getPaymentReturnToUrl } from "@lib/appRegistry";
import { createSupabasePagesServerClient } from "../../../lib/supabase/serverPagesClient";
import { createServiceRoleClient } from "../../../lib/adminAuth";
import { normalizePhone, isValidE164 } from "./save-profile";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const supabase = createSupabasePagesServerClient(req, res);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return res.status(401).json({ error: "Invalid or expired session" });

  const { courseSlug, first_name, last_name, phone } = req.body || {};
  if (!courseSlug) return res.status(400).json({ error: "courseSlug is required" });

  // Fetch existing profile row (maybeSingle() means "no row" is not fatal)
  let { data: profile, error: profileFetchError } = await supabase
    .from("profiles")
    .select("phone, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();

  // If we got an actual fetch error (not "no rows"), fail
  if (profileFetchError && profileFetchError.code !== "PGRST116") {
    console.error("[generate-token] profiles select error:", profileFetchError.message);
    return res.status(500).json({ error: "Failed to fetch profile", code: "profile_fetch_error" });
  }

  // If no profile row exists, self-heal by creating a minimal stub so the user
  // is not permanently blocked. The profile will still be incomplete (missing
  // first_name / phone), but the 422 below will guide the client to collect them.
  if (!profile) {
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({ id: user.id }, { onConflict: "id" });

    if (upsertError) {
      console.error("[generate-token] profile upsert error:", upsertError.message);
      return res
        .status(500)
        .json({ error: "Failed to initialize profile", code: "profile_init_error" });
    }

    // Re-fetch after upsert (row will still have null name/phone, triggering 422 below).
    const { data: refetched, error: refetchError } = await supabase
      .from("profiles")
      .select("phone, first_name, last_name")
      .eq("id", user.id)
      .maybeSingle();

    if (refetchError && refetchError.code !== "PGRST116") {
      console.error("[generate-token] profile re-fetch error:", refetchError.message);
      return res
        .status(500)
        .json({ error: "Failed to fetch profile", code: "profile_fetch_error" });
    }

    profile = refetched;
  }

  // Normalize any profile fields provided in the request body
  const bodyFirstName = typeof first_name === "string" ? first_name.trim() : null;
  const bodyLastName = typeof last_name === "string" ? last_name.trim() : null;
  const bodyPhone = normalizePhone(phone);

  // Upsert if: profile row missing, or required fields absent but body supplies them
  const needsUpsert =
    !profile ||
    (!profile.first_name && bodyFirstName) ||
    (!profile.phone && bodyPhone && isValidE164(bodyPhone));

  if (needsUpsert) {
    const upsertData = { id: user.id };
    if (!profile?.first_name && bodyFirstName) upsertData.first_name = bodyFirstName;
    if (!profile?.last_name && bodyLastName) upsertData.last_name = bodyLastName;
    if (!profile?.phone && bodyPhone && isValidE164(bodyPhone)) upsertData.phone = bodyPhone;

    try {
      const adminClient = createServiceRoleClient();
      const { error: upsertError } = await adminClient
        .from("profiles")
        .upsert(upsertData, { onConflict: "id" });

      if (upsertError) {
        console.error("[generate-token] Profile upsert failed", {
          userId: user.id,
          code: upsertError.code,
          message: upsertError.message,
          hint: upsertError.hint,
        });
      } else {
        // Re-fetch the profile so subsequent checks see the latest data
        const { data: refreshed, error: refreshError } = await adminClient
          .from("profiles")
          .select("phone, first_name, last_name")
          .eq("id", user.id)
          .single();

        if (refreshError) {
          console.error("[generate-token] Profile re-fetch after upsert failed", {
            userId: user.id,
            code: refreshError.code,
            message: refreshError
