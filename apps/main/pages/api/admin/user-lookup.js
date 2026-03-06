/**
 * Admin User Lookup API
 *
 * GET /api/admin/user-lookup?q=<phone_or_email>
 *
 * Searches for a user by phone (E.164) or email address.
 * Returns matching user profiles with their entitlements.
 *
 * - Phone queries must be a valid E.164 number (e.g. +919876543210).
 * - Email queries are case-insensitive exact matches against auth.users.
 *
 * Requires valid admin_session cookie or x-admin-secret header.
 * All DB operations use SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
 *
 * Response:
 *   200 — { users: [ { id, email, phone, first_name, last_name, full_name,
 *                       is_admin, registration_completed, created_at,
 *                       entitlements: [...] } ] }
 *   400 — invalid / missing query
 *   401 — not authenticated
 *   404 — no users found (empty users array)
 *   500 — internal error
 */

import { validateAdminRequest, createServiceRoleClient } from "../../../lib/adminAuth";

/** Regex for E.164 phone format: + followed by 7–15 digits */
const E164_RE = /^\+[1-9]\d{6,14}$/;

/** Very simple email sanity check */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const auth = validateAdminRequest(req);
  if (!auth.valid) {
    return res.status(401).json({ error: auth.reason || "Unauthorized" });
  }

  const { q } = req.query;
  if (!q || !q.trim()) {
    return res.status(400).json({ error: "Query parameter ?q= is required" });
  }

  const query = q.trim();

  const isPhone = E164_RE.test(query);
  const isEmail = EMAIL_RE.test(query);

  if (!isPhone && !isEmail) {
    return res.status(400).json({
      error: "Query must be a valid E.164 phone number (e.g. +919876543210) or email address",
    });
  }

  let supabase;
  try {
    supabase = createServiceRoleClient();
  } catch {
    return res.status(500).json({ error: "Service configuration error" });
  }

  try {
    let profileRows = [];

    if (isPhone) {
      // Look up by phone in profiles table (uses the profiles_phone_unique_idx)
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("phone", query)
        .limit(5);

      if (error) throw error;
      profileRows = profiles || [];
    } else {
      // Look up by email in auth.users via the admin auth API
      const { data: authData, error } = await supabase.auth.admin.listUsers({
        perPage: 1000,
        page: 1,
      });

      if (error) throw error;

      const matchedUser = authData?.users?.find(
        (u) => u.email?.toLowerCase() === query.toLowerCase()
      );

      if (matchedUser) {
        // Fetch profile row for the matched user
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", matchedUser.id)
          .single();

        // Synthesise a profile-like row even if the profiles row is missing
        profileRows = [
          {
            ...(profile || {}),
            id: matchedUser.id,
            _authEmail: matchedUser.email,
          },
        ];
      }
    }

    if (profileRows.length === 0) {
      return res.status(200).json({ users: [] });
    }

    // Resolve emails for phone-lookup results (profiles don't store email)
    if (isPhone) {
      const { data: authData } = await supabase.auth.admin.listUsers({
        perPage: 1000,
        page: 1,
      });

      const emailById = {};
      if (authData?.users) {
        for (const u of authData.users) {
          emailById[u.id] = u.email;
        }
      }

      profileRows = profileRows.map((p) => ({
        ...p,
        _authEmail: emailById[p.id] || null,
      }));
    }

    // Fetch entitlements for all matched users in a single query
    const userIds = profileRows.map((p) => p.id);
    const { data: entitlements } = await supabase
      .from("entitlements")
      .select("*")
      .in("user_id", userIds);

    const entitlementsByUser = {};
    if (entitlements) {
      for (const e of entitlements) {
        if (!entitlementsByUser[e.user_id]) entitlementsByUser[e.user_id] = [];
        entitlementsByUser[e.user_id].push(e);
      }
    }

    const users = profileRows.map((p) => ({
      id: p.id,
      email: p._authEmail || null,
      phone: p.phone || null,
      first_name: p.first_name || null,
      last_name: p.last_name || null,
      full_name: p.full_name || null,
      is_admin: p.is_admin || false,
      registration_completed: p.registration_completed || false,
      created_at: p.created_at || null,
      entitlements: entitlementsByUser[p.id] || [],
    }));

    return res.status(200).json({ users });
  } catch (error) {
    console.error("[admin/user-lookup] error:", error);
    return res.status(500).json({
      error: "Lookup failed",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
