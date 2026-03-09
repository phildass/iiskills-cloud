import { createSupabasePagesServerClient } from "../../../lib/supabase/pagesServerClient";

export function normalizePhone(raw) {
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

export function isValidE164(e164) {
  if (!e164) return false;
  return /^\+\d{8,15}$/.test(e164);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = createSupabasePagesServerClient(req, res);

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  const { first_name, last_name, phone } = req.body || {};

  const trimmedFirstName = typeof first_name === "string" ? first_name.trim() : "";
  if (!trimmedFirstName) return res.status(400).json({ error: "first_name is required" });

  const normalizedPhone = normalizePhone(phone);
  if (!isValidE164(normalizedPhone)) {
    return res.status(400).json({ error: "A valid phone number is required" });
  }

  const trimmedLastName = typeof last_name === "string" ? last_name.trim() : null;

  // Lock: disallow name/phone changes once the user has paid or completed registration.
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("is_paid_user, registration_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile?.is_paid_user || existingProfile?.registration_completed) {
    return res.status(409).json({
      error: "Profile name and phone cannot be changed after payment or registration.",
      code: "profile_locked",
    });
  }

  const updates = {
    first_name: trimmedFirstName,
    phone: normalizedPhone,
    last_name: trimmedLastName || null,
    full_name: trimmedLastName ? `${trimmedFirstName} ${trimmedLastName}` : trimmedFirstName,
  };

  const { error: upsertError } = await supabase
    .from("profiles")
    .upsert({ id: user.id, ...updates }, { onConflict: "id" });

  if (upsertError) {
    console.error("[save-profile] DB upsert error:", upsertError.message);

    if (upsertError.code === "23505" || upsertError.message?.includes("unique")) {
      return res.status(409).json({
        error: "This phone number is already associated with another account.",
      });
    }

    return res.status(500).json({ error: "Failed to update profile. Please try again." });
  }

  return res.status(200).json({ success: true, phone: normalizedPhone });
}
