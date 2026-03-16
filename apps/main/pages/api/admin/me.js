/**
 * GET /api/admin/me
 *
 * Returns the current admin's display label when authenticated.
 * Used by AdminNav to show the admin username in the navigation bar.
 *
 * Response: { ok: true, label: string } | { ok: false }
 */

import { parse } from "cookie";
import { verifyAdminToken, ADMIN_COOKIE_NAME, isAdminAuthDisabled, getAdminLabel } from "../../../lib/adminAuth";

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  // When auth is disabled (e.g., local dev), return a default label
  if (isAdminAuthDisabled()) {
    return res.status(200).json({ ok: true, label: getAdminLabel() });
  }

  const cookies = parse(req.headers.cookie || "");
  const token = cookies[ADMIN_COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ ok: false });
  }

  const result = verifyAdminToken(token);
  if (!result.valid) {
    return res.status(401).json({ ok: false });
  }

  return res.status(200).json({ ok: true, label: result.label || getAdminLabel() });
}
