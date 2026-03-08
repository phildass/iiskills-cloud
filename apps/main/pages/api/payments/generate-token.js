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

  const { data: profile } = await supabase
    .from("profiles")
    .select("phone, first_name, last_name")
    .eq("id", user.id)
    .single();

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