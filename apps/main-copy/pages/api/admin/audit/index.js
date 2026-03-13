/**
 * GET /api/admin/audit
 *
 * Returns a paged list of admin audit events from admin_audit_events table.
 *
 * Query params:
 *   - page (default 1)
 *   - per_page (default 50, max 200)
 *   - action — filter by action string
 *   - actor_email — filter by actor email (substring match)
 *   - target — filter by target_email_or_phone (substring match)
 *   - app_id — filter by app_id
 *   - date_from — ISO timestamp (inclusive)
 *   - date_to — ISO timestamp (inclusive)
 *
 * Authentication: admin (cookie or Bearer token via validateAdminRequestAsync)
 */

import { validateAdminRequestAsync, createServiceRoleClient } from "../../../../lib/adminAuth";
import sendError from "../../../../utils/sendError";
import checkConfig from "../../../../utils/checkConfig";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const auth = await validateAdminRequestAsync(req);
  if (!auth.valid) {
    return res.status(auth.status || 403).json({ error: auth.reason || "Forbidden" });
  }

  let supabase;
  try {
    checkConfig(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
    supabase = createServiceRoleClient();
  } catch {
    sendError(res, 500, "Server misconfiguration", "Required environment variables are missing");
    return;
  }

  const {
    page = "1",
    per_page = "50",
    action,
    actor_email,
    target,
    app_id,
    date_from,
    date_to,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const perPage = Math.min(200, Math.max(1, parseInt(per_page, 10) || 50));
  const offset = (pageNum - 1) * perPage;

  let query = supabase
    .from("admin_audit_events")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + perPage - 1);

  if (action) {
    query = query.eq("action", action);
  }
  if (actor_email) {
    query = query.ilike("actor_email", `%${actor_email}%`);
  }
  if (target) {
    query = query.ilike("target_email_or_phone", `%${target}%`);
  }
  if (app_id) {
    query = query.eq("app_id", app_id);
  }
  if (date_from) {
    query = query.gte("created_at", date_from);
  }
  if (date_to) {
    query = query.lte("created_at", date_to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("[audit GET] DB error:", error);
    return res.status(500).json({ error: "Failed to fetch audit events" });
  }

  return res.status(200).json({
    events: data || [],
    total: count ?? 0,
    page: pageNum,
    per_page: perPage,
    total_pages: Math.ceil((count ?? 0) / perPage),
  });
}
