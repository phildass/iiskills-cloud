import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";
import { getPaymentReturnToUrl } from "@lib/appRegistry";

/**
 * POST /api/payments/generate-token
 *
 * Generates a short-lived signed JWT for an authenticated user initiating
 * a payment on aienter.in.  The token is appended to the redirect URL so
 * that aienter can pass it back in the server-to-server callback, allowing
 * iiskills to identify the buyer without relying on an OTP.
 *
 * Security:
 * - Requires a valid Supabase access token in the Authorization header.
 * - Token payload includes a random `jti` (nonce) to prevent replay attacks.
 * - Signed with PAYMENT_TOKEN_SECRET; expires in 10 minutes.
 *
 * Required env vars:
 *   PAYMENT_TOKEN_SECRET — long random string used to sign/verify tokens
 *
 * Request:
 *   POST /api/payments/generate-token
 *   Authorization: Bearer <supabase_access_token>
 *   Body: { courseSlug: string }
 *
 * Response:
 *   200 { token: string }
 *   400 { error: string }   — missing or invalid fields
 *   401 { error: string }   — unauthenticated
 *   500 { error: string }   — server misconfiguration
 */

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── 1. Authenticate the caller via Supabase access token ──────────────────
  const authHeader = req.headers.authorization;
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!accessToken) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[generate-token] Supabase not configured");
    return res.status(500).json({ error: "Server not configured" });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken);

  if (authError || !user) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }

  // ── 2. Validate request body ──────────────────────────────────────────────
  const { courseSlug } = req.body || {};
  if (!courseSlug) {
    return res.status(400).json({ error: "courseSlug is required" });
  }

  // ── 3. Fetch user profile (name + phone) ──────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select("phone, first_name, last_name")
    .eq("id", user.id)
    .single();

  // ── 4. Build and sign the JWT ─────────────────────────────────────────────
  const secret = process.env.PAYMENT_TOKEN_SECRET;
  if (!secret) {
    console.error("[generate-token] PAYMENT_TOKEN_SECRET is not set");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  const payload = {
    user_id: user.id,
    email: user.email || null,
    phone: profile?.phone || null,
    name: [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || null,
    course_slug: courseSlug,
    return_to: getPaymentReturnToUrl(courseSlug),
    jti: crypto.randomUUID(), // nonce — prevents replay attacks
  };

  const token = jwt.sign(payload, secret, { expiresIn: "10m" });

  console.log("[generate-token] Token issued for user:", user.id.slice(0, 8) + "...");

  return res.status(200).json({ token });
}
