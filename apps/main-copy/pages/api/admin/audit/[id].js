/**
 * GET /api/admin/audit/[id]
 *
 * Returns a single audit event by id.
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

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: "id is required" });
  }

  let supabase;
  try {
    checkConfig(["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]);
    supabase = createServiceRoleClient();
  } catch {
    sendError(res, 500, "Server misconfiguration", "Required environment variables are missing");
    return;
  }

  const { data, error } = await supabase
    .from("admin_audit_events")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: "Audit event not found" });
  }

  return res.status(200).json({ event: data });
}
