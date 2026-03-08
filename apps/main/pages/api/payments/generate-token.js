import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getPaymentReturnToUrl } from "@lib/appRegistry";
import { createSupabasePagesServerClient } from "../../../lib/supabase/serverPagesClient";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const supabase = createSupabasePagesServerClient(req, res);

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) return res.status(401).json({ error: "Invalid or expired session" });

  const { courseSlug } = req.body || {};
  if (!courseSlug) return res.status(400).json({ error: "courseSlug is required" });

  // Fetch profile using maybeSingle() so a missing row does not throw an error.
  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("phone, first_name, last_name")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    console.error("[generate-token] profiles select error:", fetchError.message);
    return res.status(500).json({ error: "Failed to fetch profile", code: "profile_fetch_error" });
  }

  // If no profile row exists, self-heal by creating a minimal stub so the user
  // is not permanently blocked.  The profile will still be incomplete (missing
  // first_name / phone), but the 422 below will guide the client to collect them.
  let profile = existingProfile;
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

    if (refetchError) {
      console.error("[generate-token] profile re-fetch error:", refetchError.message);
      return res
        .status(500)
        .json({ error: "Failed to fetch profile", code: "profile_fetch_error" });
    }

    profile = refetched;
  }

  if (!profile?.first_name || !profile?.phone) {
    return res.status(422).json({ error: "Profile incomplete", code: "profile_incomplete" });
  }

  const secret = process.env.PAYMENT_TOKEN_SECRET;
  if (!secret) return res.status(500).json({ error: "Server misconfiguration" });

  const payload = {
    user_id: user.id,
    email: user.email || null,
    phone: profile.phone,
    name: [profile.first_name, profile.last_name].filter(Boolean).join(" ") || null,
    course_slug: courseSlug,
    return_to: getPaymentReturnToUrl(courseSlug),
    jti: crypto.randomUUID(),
  };

  const token = jwt.sign(payload, secret, { expiresIn: "10m" });
  return res.status(200).json({ token });
}
