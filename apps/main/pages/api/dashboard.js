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
 *   - Refund requests (user's own)
 *
 * Requires: Authorization: Bearer <supabase_access_token>
 *
 * Unlike /api/profile this endpoint is accessible to ALL authenticated users,
 * not just paid users.
 */

import { createClient } from "@supabase/supabase-js";

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
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
  // Use select('*') for schema safety so missing optional columns do not cause
  // "column does not exist" errors. The explicit column list was replaced to
  // avoid silent breakage when migrations add new columns to the schema.
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    console.error("[api/dashboard] profile fetch error:", {
      message: profileError.message,
      code: profileError.code,
      details: profileError.details,
      hint: profileError.hint,
      userId,
    });
  }

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
  // Fetch ALL entitlements for the user — active, expired, and revoked — so
  // the dashboard can display a complete, accurate history. Access control
  // (paidCourseSlugs) is derived separately from only active + non-expired rows.
  const { data: entitlements } = await supabase
    .from("entitlements")
    .select("id, app_id, status, purchased_at, expires_at, source, course_slug")
    .eq("user_id", userId)
    .order("purchased_at", { ascending: false });

  // ── User App Access (certified paid user records) ──────────────────────────
  // Fetch user_app_access records that are certified paid (annual entitlements)
  // for display on the dashboard with expiry info and "Paid User" badge.
  const { data: appAccessRecords } = await supabase
    .from("user_app_access")
    .select(
      "id, app_id, is_active, is_certified_paid_user, entitlement_type, expires_at, granted_via, access_granted_at"
    )
    .eq("user_id", userId)
    .eq("is_certified_paid_user", true)
    .order("access_granted_at", { ascending: false });

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
    .select("app_id, module_id, lesson_id, passed, completed_at, last_seen_at")
    .eq("user_id", userId);

  const progressList = progressRows || [];
  const totalLessonsCompleted = progressList.filter((p) => p.completed_at).length;
  const totalLessonsPassed = progressList.filter((p) => p.passed).length;

  // Group progress by app and track last-seen lesson
  const progressByApp = progressList.reduce((acc, row) => {
    if (!acc[row.app_id]) acc[row.app_id] = { total: 0, passed: 0, lastLesson: null };
    acc[row.app_id].total++;
    if (row.passed) acc[row.app_id].passed++;
    // Track most-recently-seen lesson
    const current = acc[row.app_id].lastLesson;
    const rowTs = row.last_seen_at || row.completed_at;
    if (rowTs && (!current || new Date(rowTs) > new Date(current.last_active_at))) {
      acc[row.app_id].lastLesson = {
        module_id: row.module_id,
        lesson_id: row.lesson_id,
        last_active_at: rowTs,
      };
    }
    return acc;
  }, {});

  // ── Refund requests ───────────────────────────────────────────────────────
  const { data: refundRequests } = await supabase
    .from("refund_requests")
    .select(
      "id, purchase_id, course_slug, amount_paise, reason, status, admin_note, created_at, updated_at"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const refundRequestList = refundRequests || [];

  // ── Paid course slugs ──────────────────────────────────────────────────────
  // All paid apps available in the system.
  const ALL_PAID_APP_IDS = ["learn-ai", "learn-developer", "learn-management", "learn-pr"];

  // Admin bypass: admins have access to all paid courses immediately.
  const isAdmin = profile?.is_admin === true;

  const purchaseList = purchases || [];
  const entitlementList = entitlements || [];

  let paidCourseSlugs;
  if (isAdmin) {
    paidCourseSlugs = [...ALL_PAID_APP_IDS];
  } else {
    // Primary: purchases with status='paid', de-duplicated by course_slug
    const paidSlugsFromPurchases = [...new Set(purchaseList.map((p) => p.course_slug))];

    // Fallback: only active, non-expired entitlements grant course access
    const nowIso = new Date().toISOString();
    const activeEntitlements = entitlementList.filter(
      (e) => e.status === "active" && (!e.expires_at || e.expires_at > nowIso)
    );
    const paidSlugsFromEntitlements = activeEntitlements
      .flatMap((e) => {
        if (e.app_id === "ai-developer-bundle") return ["learn-ai", "learn-developer"];
        return [e.app_id];
      })
      .filter((slug) => !paidSlugsFromPurchases.includes(slug));

    paidCourseSlugs = [...new Set([...paidSlugsFromPurchases, ...paidSlugsFromEntitlements])];
  }

  // ── Last lesson per paid course (for deep-link CTA) ───────────────────────
  const lastLessonByApp = Object.fromEntries(
    Object.entries(progressByApp)
      .filter(([appId]) => paidCourseSlugs.includes(appId))
      .map(([appId, data]) => [appId, data.lastLesson])
  );

  return res.status(200).json({
    profile: profile || null,
    email: user.email,
    isGoogleUser,
    isAdmin,
    purchases: purchaseList,
    purchasesTotal: purchaseList.reduce((sum, p) => sum + (p.amount_paise || 0), 0),
    entitlements: entitlementList,
    appAccess: appAccessRecords || [],
    badges: badgeList,
    badgeCount,
    honourStudent,
    certificates: certList,
    certificateCount: certList.length,
    paidCourseSlugs,
    lastLessonByApp,
    refundRequests: refundRequestList,
    progress: {
      totalLessonsCompleted,
      totalLessonsPassed,
      byApp: Object.fromEntries(
        Object.entries(progressByApp).map(([k, v]) => [k, { total: v.total, passed: v.passed }])
      ),
    },
  });
}
