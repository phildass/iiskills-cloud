#!/usr/bin/env node
/**
 * sync-content-stats.js
 *
 * Upserts the canonical platform content counts to the `content_stats` table in
 * Supabase. The counts are derived from the hard-coded 8-site architecture:
 *
 *   8 sites × 3 courses   =   24 courses
 *   24 courses × 10 modules =  240 modules
 *   240 modules × 10 lessons = 2,400 lessons
 *
 * Usage (on the production server after sourcing /etc/iiskills.env):
 *   node scripts/sync-content-stats.js
 *
 * Or from the monorepo root:
 *   yarn node scripts/sync-content-stats.js
 *
 * CI / dry-run:
 *   DRY_RUN=true node scripts/sync-content-stats.js
 */

"use strict";

// Load credentials from /etc/iiskills.env when running on the server
const fs = require("fs");
const path = require("path");

const envFile = "/etc/iiskills.env";
if (fs.existsSync(envFile)) {
  const lines = fs.readFileSync(envFile, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    // Support: export KEY=VALUE  or  KEY=VALUE
    const match = trimmed.replace(/^export\s+/, "").match(/^([^=]+)=(.*)$/);
    if (match) {
      const [, key, val] = match;
      if (!process.env[key]) {
        process.env[key] = val.replace(/^['"]|['"]$/g, "");
      }
    }
  }
}

const { createClient } = require("@supabase/supabase-js");

// ─── Architecture constants ────────────────────────────────────────────────────

const SITE_ARCH = {
  sites: 8,     // learn-ai, learn-apt, learn-chemistry, learn-developer,
                // learn-geography, learn-management, learn-math, learn-physics
  courses: 3,   // 3 courses per site
  modules: 10,  // 10 modules per course
  lessons: 10,  // 10 lessons per module
};

const TOTALS = {
  total_courses: SITE_ARCH.sites * SITE_ARCH.courses,          //  24
  total_modules: SITE_ARCH.sites * SITE_ARCH.courses * SITE_ARCH.modules,  // 240
  total_lessons: SITE_ARCH.sites * SITE_ARCH.courses * SITE_ARCH.modules * SITE_ARCH.lessons, // 2400
};

// ─── Main ──────────────────────────────────────────────────────────────────────

async function syncHighValueStats() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
    console.error("    Source /etc/iiskills.env or export them before running this script.");
    process.exit(1);
  }

  const isDryRun = process.env.DRY_RUN === "true";

  console.log("📐  Architecture:");
  console.log(`    Sites:   ${SITE_ARCH.sites}`);
  console.log(`    Courses: ${TOTALS.total_courses}  (${SITE_ARCH.sites} × ${SITE_ARCH.courses})`);
  console.log(`    Modules: ${TOTALS.total_modules}  (${TOTALS.total_courses} × ${SITE_ARCH.modules})`);
  console.log(`    Lessons: ${TOTALS.total_lessons}  (${TOTALS.total_modules} × ${SITE_ARCH.lessons})`);
  console.log();

  if (isDryRun) {
    console.log("🔍  DRY_RUN=true — no database write performed.");
    return;
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const row = {
    id: "global_production_stats",
    total_sites: SITE_ARCH.sites,
    total_courses: TOTALS.total_courses,
    total_modules: TOTALS.total_modules,
    total_lessons: TOTALS.total_lessons,
    courses_per_site: SITE_ARCH.courses,
    modules_per_course: SITE_ARCH.modules,
    lessons_per_module: SITE_ARCH.lessons,
    last_verified: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("content_stats")
    .upsert(row, { onConflict: "id" });

  if (error) {
    console.error("❌  Upsert failed:", error.message);
    if (error.code === "42P01") {
      console.error(
        "    Table 'content_stats' does not exist. Run the migration first:\n" +
        "    supabase/migrations/2026-03-18_content_stats_table.sql"
      );
    }
    process.exit(1);
  }

  console.log("✅  High-Value Stats Synced to Supabase:");
  console.log(`    24 Courses · 240 Modules · 2,400 Lessons — Live.`);
}

syncHighValueStats().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
