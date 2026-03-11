/**
 * Dashboard API
 *
 * GET /api/dashboard
 *
 * Returns aggregated dashboard data for any authenticated user:
 *   - Profile (all fields including new education/locking fields)
 *   - Purchases / credits summary
 *   - Entitlements
 *   - Badges count + list
 *   - Certificates count + list
 *   - honourStudent (badges > 10)
 *   - Progress summary
 *
 * Requires: Authorization: Bearer <supabase_access_token>
 *
 * Unlike /api/profile this endpoint is accessible to ALL authenticated users,
 * not just paid users.
 */

import { createClient } from "@supabase/supabase-js";

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  // Authenticate the request via Bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = userData.user;
  const userId = user.id;

  // ── Profile ────────────────────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, first_name, last_name, full_name, gender, date_of_birth, age, " +
        "education, qualification, location, state, district, country, specify_country, " +
        "is_paid_user, paid_at, subscribed_to_newsletter, created_at, updated_at, " +
        "registration_completed, username, phone, " +
        "profile_submitted_at, name_change_count, " +
        "education_self, education_father, education_mother"
    )
    .eq("id", userId)
    .maybeSingle();

  // ── Google provider detection ──────────────────────────────────────────────
  const identities = user.identities || [];
  const isGoogleUser = identities.some((i) => i.provider === "google");

  // ── Purchases ─────────────────────────────────────────────────────────────
  const { data: purchases } = await supabase
    .from("purchases")
    .select("id, course_slug, amount_paise, currency, status, paid_at, created_at")
    .eq("user_id", userId)
    .eq("status", "paid")
    .order("paid_at", { ascending: false });

  // ── Entitlements ──────────────────────────────────────────────────────────
  const now = new Date().toISOString();
  const { data: entitlements } = await supabase
    .from("entitlements")
    .select("id, app_id, status, purchased_at, expires_at")
    .eq("user_id", userId)
    .eq("status", "active")
    .or(`expires_at.is.null,expires_at.gt.${now}`);

  // ── Badges ─────────────────────────────────────────────────────────────────
  const { data: badges } = await supabase
    .from("user_badges")
    .select("id, app_id, module_id, lesson_id, badge_type, score, earned_at")
    .eq("user_id", userId)
    .order("earned_at", { ascending: false });

  const badgeList = badges || [];
  const badgeCount = badgeList.length;
  const honourStudent = badgeCount > 10;

  // ── Certificates ───────────────────────────────────────────────────────────
  const { data: certificates } = await supabase
    .from("user_certificates")
    .select("id, app_id, certificate_no, course_name, issued_at, score")
    .eq("user_id", userId)
    .order("issued_at", { ascending: false });

  const certList = certificates || [];

  // ── Progress summary ──────────────────────────────────────────────────────
  const { data: progressRows } = await supabase
    .from("user_lesson_progress")
    .select("app_id, passed, completed_at")
    .eq("user_id", userId);

  const progressList = progressRows || [];
  const totalLessonsCompleted = progressList.filter((p) => p.completed_at).length;
  const totalLessonsPassed = progressList.filter((p) => p.passed).length;

  // Group progress by app
  const progressByApp = progressList.reduce((acc, row) => {
    if (!acc[row.app_id]) acc[row.app_id] = { total: 0, passed: 0 };
    acc[row.app_id].total++;
    if (row.passed) acc[row.app_id].passed++;
    return acc;
  }, {});

  return res.status(200).json({
    profile: profile || null,
    email: user.email,
    isGoogleUser,
    purchases: purchases || [],
    purchasesTotal: (purchases || []).reduce((sum, p) => sum + (p.amount_paise || 0), 0),
    entitlements: entitlements || [],
    badges: badgeList,
    badgeCount,
    honourStudent,
    certificates: certList,
    certificateCount: certList.length,
    progress: {
      totalLessonsCompleted,
      totalLessonsPassed,
      byApp: progressByApp,
    },
  });
}
