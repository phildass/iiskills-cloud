/**
 * POST /api/tickets/create
 *
 * Creates a support ticket for the authenticated user.
 * Optionally uploads a proof-of-payment file to the "ticket-proofs" bucket.
 *
 * Enforces:
 *   - Server-side content moderation (banned keywords/phrases)
 *   - Monthly ticket limits (Free: 1/month, Paid: 5/month)
 *   - Strike/ban system for repeated content violations
 *
 * Body (multipart/form-data or JSON):
 *   - name        {string}  required
 *   - phone       {string}  optional – E.164 or normalized to +91
 *   - email       {string}  required
 *   - issue_type  {string}  one of: payment_auth_not_made | payment_wrongly_made_refund |
 *                                   paid_course_not_satisfactory | other
 *   - other_text  {string}  required when issue_type === 'other'; max 100 chars
 *   - proof       {file}    optional image/PDF
 *
 * Returns:
 *   201 { id }
 *   400 validation error
 *   401 not authenticated
 *   422 content moderation rejection
 *   429 monthly ticket limit reached
 *   500 server error
 */

import { createClient } from "@supabase/supabase-js";
import formidable from "formidable";
import fs from "fs";
import {
  checkContent,
  MODERATION_STRIKE_LIMIT,
} from "../../../../../packages/shared-utils/lib/contentFilter";

export const config = {
  api: {
    bodyParser: false, // we parse multipart ourselves
  },
};

// Monthly ticket limits
const TICKET_LIMIT_FREE = 1;
const TICKET_LIMIT_PAID = 5;

const VALID_ISSUE_TYPES = [
  "payment_auth_not_made",
  "payment_wrongly_made_refund",
  "paid_course_not_satisfactory",
  "other",
];

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function getSupabaseUser(accessToken) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;
  if (!url || !anonKey) return null;
  const client = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  return client;
}

/** Normalize phone to E.164: if no leading +, prepend +91 */
function normalizePhone(phone) {
  if (!phone) return null;
  const trimmed = phone.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("+")) return trimmed;
  return `+91${trimmed}`;
}

/**
 * Check if user has an active paid entitlement.
 * Any active, non-expired entitlement row is treated as "paid".
 */
async function isPaidUser(supabaseAdmin, userId) {
  const now = new Date().toISOString();
  const { data } = await supabaseAdmin
    .from("entitlements")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .limit(1)
    .maybeSingle();
  if (data) return true;

  // Legacy check
  const { data: legacy } = await supabaseAdmin
    .from("user_app_access")
    .select("id")
    .eq("user_id", userId)
    .eq("is_active", true)
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .limit(1)
    .maybeSingle();
  return !!legacy;
}

/** Count tickets created by user in the current calendar month */
async function countTicketsThisMonth(supabaseAdmin, userId) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const { count, error } = await supabaseAdmin
    .from("forum_tickets")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", monthStart);

  if (error) {
    console.error("[tickets/create] count error:", error);
    return 0;
  }
  return count || 0;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  const authHeader = req.headers.authorization || "";
  const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!accessToken) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const userClient = getSupabaseUser(accessToken);
  if (!userClient) {
    return res.status(500).json({ error: "Service configuration error" });
  }

  const {
    data: { user },
    error: authError,
  } = await userClient.auth.getUser();

  if (authError || !user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  // ── Parse body (multipart or JSON) ───────────────────────────────────────
  let fields = {};
  let proofFile = null;

  const contentType = req.headers["content-type"] || "";

  if (contentType.includes("multipart/form-data")) {
    const form = formidable({ maxFileSize: 10 * 1024 * 1024 }); // 10 MB limit
    try {
      const [parsedFields, parsedFiles] = await form.parse(req);
      // formidable v3 returns arrays
      for (const [k, v] of Object.entries(parsedFields)) {
        fields[k] = Array.isArray(v) ? v[0] : v;
      }
      const proof = parsedFiles.proof;
      if (proof) {
        proofFile = Array.isArray(proof) ? proof[0] : proof;
      }
    } catch {
      return res.status(400).json({ error: "Failed to parse form data" });
    }
  } else {
    // JSON body
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const body = Buffer.concat(chunks).toString();
      fields = body ? JSON.parse(body) : {};
    } catch {
      return res.status(400).json({ error: "Invalid JSON body" });
    }
  }

  // ── Validate ──────────────────────────────────────────────────────────────
  const { name, email, issue_type, other_text } = fields;
  const phone = normalizePhone(fields.phone);

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ error: "name is required" });
  }
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "valid email is required" });
  }
  if (!issue_type || !VALID_ISSUE_TYPES.includes(issue_type)) {
    return res.status(400).json({
      error: `issue_type must be one of: ${VALID_ISSUE_TYPES.join(", ")}`,
    });
  }
  if (issue_type === "other") {
    if (!other_text || !other_text.trim()) {
      return res.status(400).json({ error: "other_text is required when issue_type is 'other'" });
    }
    if (other_text.trim().length > 100) {
      return res.status(400).json({ error: "other_text must be 100 characters or fewer" });
    }
  } else if (other_text && other_text.trim()) {
    return res
      .status(400)
      .json({ error: "other_text must be empty when issue_type is not 'other'" });
  }

  // ── Admin client for DB + storage ────────────────────────────────────────
  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Service configuration error" });
  }

  // ── Check ban status ──────────────────────────────────────────────────────
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("is_banned, moderation_strikes")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.is_banned) {
    return res.status(403).json({
      error:
        "Your account has been suspended due to repeated policy violations. Please contact support via a new ticket once reinstated.",
    });
  }

  // ── Content moderation ────────────────────────────────────────────────────
  const contentToCheck = [name, other_text].filter(Boolean).join(" ");
  const flagResult = checkContent(contentToCheck);

  if (flagResult.flagged) {
    // Log rejection
    await supabaseAdmin.from("moderation_logs").insert({
      user_id: user.id,
      content_type: "ticket",
      content_snippet: contentToCheck.slice(0, 200),
      rejection_reason: flagResult.reason,
    });

    // Increment strikes
    const currentStrikes = (profile?.moderation_strikes || 0) + 1;
    const shouldBan = currentStrikes >= MODERATION_STRIKE_LIMIT;

    await supabaseAdmin
      .from("profiles")
      .update({
        moderation_strikes: currentStrikes,
        ...(shouldBan ? { is_banned: true, banned_at: new Date().toISOString() } : {}),
      })
      .eq("id", user.id);

    console.warn(
      `[tickets/create] Content rejected for user ${user.id}: ${flagResult.reason}. Strikes: ${currentStrikes}`
    );

    if (shouldBan) {
      return res.status(403).json({
        error:
          "Your ticket was rejected and your account has been suspended due to repeated policy violations.",
        flagged: true,
      });
    }

    return res.status(422).json({
      error: `Your ticket was rejected: ${flagResult.reason}. Please revise your content. (Strike ${currentStrikes} of ${MODERATION_STRIKE_LIMIT})`,
      flagged: true,
      strikes: currentStrikes,
    });
  }

  // ── Monthly ticket limit ──────────────────────────────────────────────────
  const paid = await isPaidUser(supabaseAdmin, user.id);
  const limit = paid ? TICKET_LIMIT_PAID : TICKET_LIMIT_FREE;
  const monthCount = await countTicketsThisMonth(supabaseAdmin, user.id);

  if (monthCount >= limit) {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const resetDate = nextMonth.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return res.status(429).json({
      error: `You have reached your monthly ticket limit (${limit} ticket${limit === 1 ? "" : "s"} per month for ${paid ? "paid" : "free"} users). Your limit resets on ${resetDate}.`,
      limit,
      used: monthCount,
      resetDate: nextMonth.toISOString(),
    });
  }

  // ── Upload proof (if provided) ────────────────────────────────────────────
  let proofPath = null;
  if (proofFile) {
    const ext = proofFile.originalFilename?.split(".").pop()?.toLowerCase() || "bin";
    const allowed = ["jpg", "jpeg", "png", "gif", "webp", "pdf"];
    if (!allowed.includes(ext)) {
      return res
        .status(400)
        .json({ error: "Proof file must be an image (jpg/png/gif/webp) or PDF" });
    }

    const objectPath = `${user.id}/${Date.now()}.${ext}`;
    const fileBuffer = fs.readFileSync(proofFile.filepath);

    const { error: uploadError } = await supabaseAdmin.storage
      .from("ticket-proofs")
      .upload(objectPath, fileBuffer, {
        contentType: proofFile.mimetype || "application/octet-stream",
      });

    if (uploadError) {
      console.error("[tickets/create] storage upload error:", uploadError);
      return res.status(500).json({ error: "Failed to upload proof file" });
    }

    proofPath = objectPath;
  }

  // ── Insert ticket ─────────────────────────────────────────────────────────
  const { data: ticket, error: insertError } = await supabaseAdmin
    .from("forum_tickets")
    .insert({
      user_id: user.id,
      name: name.trim(),
      phone,
      email: email.trim(),
      issue_type,
      other_text: issue_type === "other" ? other_text.trim() : null,
      proof_path: proofPath,
      status: "not_seen_yet",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[tickets/create] insert error:", insertError);
    return res.status(500).json({ error: "Failed to create ticket" });
  }

  return res.status(201).json({ id: ticket.id });
}
