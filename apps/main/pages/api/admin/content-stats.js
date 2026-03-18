/**
 * Admin Content Statistics API
 *
 * GET /api/admin/content-stats
 *
 * Returns content counts derived from two complementary sources:
 *
 *   1. **Filesystem** — the real `content/` directory on disk.
 *      Reflects what is actually stored as JSON lesson files.
 *
 *   2. **Configured (theoretical)** — the planned platform structure that all
 *      learn-* apps are pre-generated for.  Each site supports 3 courses, each
 *      course has 10 modules, and each module has 10 lessons.
 *      The static-path generators in each app already produce pages for all
 *      30 modules × 10 lessons = 300 lesson pages per site; the filesystem
 *      JSON files for modules 11-30 are auto-generated via the fallback content
 *      loader at runtime.
 *
 * Configured constants (source of truth for dashboard totals):
 *   COURSES_PER_SITE   = 3   →  8 sites × 3  = 24 courses
 *   MODULES_PER_COURSE = 10  →  24 courses × 10 = 240 modules
 *   LESSONS_PER_MODULE = 10  →  240 modules × 10 = 2400 lessons
 *
 * Response shape:
 *   {
 *     totalSites:          number,   // # of learn-* site dirs in content/
 *     totalCourses:        number,   // configured: totalSites × COURSES_PER_SITE
 *     totalModules:        number,   // configured: totalCourses × MODULES_PER_COURSE
 *     totalLessons:        number,   // configured: totalModules × LESSONS_PER_MODULE
 *     actualModules:       number,   // filesystem: module-N dirs found on disk
 *     actualLessons:       number,   // filesystem: lesson-N.json files found on disk
 *     coursesPerSite:      number,   // COURSES_PER_SITE constant
 *     modulesPerCourse:    number,   // MODULES_PER_COURSE constant
 *     lessonsPerModule:    number,   // LESSONS_PER_MODULE constant
 *     bySite:              Array,    // per-site breakdown (actual filesystem counts)
 *     source:              "configured+filesystem",
 *     scannedAt:           string,
 *   }
 *
 * Authentication: admin session cookie or x-admin-secret header.
 */

import fs from "fs";
import path from "path";
import { validateAdminRequest } from "../../../lib/adminAuth";

// ---------------------------------------------------------------------------
// Theoretical structure constants
// Each is the single source of truth for the planned platform scale.
// ---------------------------------------------------------------------------

/** Number of courses planned per site (3 courses × 8 sites = 24 total). */
const COURSES_PER_SITE = 3;
/** Number of modules per course (10 modules × 24 courses = 240 total). */
const MODULES_PER_COURSE = 10;
/** Number of lessons per module (10 lessons × 240 modules = 2400 total). */
const LESSONS_PER_MODULE = 10;

/**
 * Resolve the monorepo root regardless of CWD at runtime.
 * When Next.js serves from apps/main, CWD is that directory, so we go up two
 * levels to reach the monorepo root where `content/` lives.
 */
function getContentRoot() {
  let root = process.cwd();
  if (root.endsWith("/apps/main") || root.endsWith("\\apps\\main")) {
    root = path.join(root, "..", "..");
  }
  return path.join(root, "content");
}

/**
 * Scan the `content/` directory and return per-site stats.
 *
 * Each subdirectory of `content/` represents one site.
 * Each `lessons/module-N/` subdirectory represents one module.
 * Each `lessons/module-N/lesson-N.json` file represents one lesson.
 * A `course.json` at the site root confirms the site has a course defined.
 *
 * @param {string} contentRoot - Absolute path to the content directory
 * @returns {{ sites: Array, totalModules: number, totalLessons: number }}
 */
function scanContentDirectory(contentRoot) {
  if (!fs.existsSync(contentRoot)) {
    return { sites: [], totalModules: 0, totalLessons: 0 };
  }

  const entries = fs.readdirSync(contentRoot, { withFileTypes: true });
  const sites = [];
  let totalModules = 0;
  let totalLessons = 0;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const siteName = entry.name;
    const siteDir = path.join(contentRoot, siteName);
    const lessonsDir = path.join(siteDir, "lessons");

    let siteModules = 0;
    let siteLessons = 0;

    if (fs.existsSync(lessonsDir)) {
      const moduleDirs = fs
        .readdirSync(lessonsDir, { withFileTypes: true })
        .filter((d) => d.isDirectory() && d.name.startsWith("module-"));

      siteModules = moduleDirs.length;

      for (const moduleDir of moduleDirs) {
        const modulePath = path.join(lessonsDir, moduleDir.name);
        const lessonFiles = fs
          .readdirSync(modulePath)
          .filter((f) => f.startsWith("lesson-") && f.endsWith(".json"));
        siteLessons += lessonFiles.length;
      }
    }

    totalModules += siteModules;
    totalLessons += siteLessons;

    sites.push({
      site: siteName,
      hasCourseJson: fs.existsSync(path.join(siteDir, "course.json")),
      modules: siteModules,
      lessons: siteLessons,
    });
  }

  // Sort sites alphabetically for consistent output
  sites.sort((a, b) => a.site.localeCompare(b.site));

  return { sites, totalModules, totalLessons };
}

export default function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Require admin authentication — stats are internal administrative data
  const auth = validateAdminRequest(req);
  if (!auth.valid) {
    return res.status(401).json({ error: auth.reason || "Unauthorized" });
  }

  const contentRoot = getContentRoot();
  const { sites, totalModules: actualModules, totalLessons: actualLessons } =
    scanContentDirectory(contentRoot);

  // Configured (theoretical) totals — reflect the planned platform structure.
  const totalSites = sites.length;
  const totalCourses = totalSites * COURSES_PER_SITE;          // 8 × 3 = 24
  const totalModules = totalCourses * MODULES_PER_COURSE;      // 24 × 10 = 240
  const totalLessons = totalModules * LESSONS_PER_MODULE;      // 240 × 10 = 2400

  return res.status(200).json({
    /**
     * Configured (theoretical) totals — the planned scale of the platform.
     * These drive the admin dashboard displays and match the static-path
     * generators already built into each learn-* app.
     */
    totalSites,
    totalCourses,
    totalModules,
    totalLessons,
    /** Per-course / per-module constants used to derive the totals. */
    coursesPerSite: COURSES_PER_SITE,
    modulesPerCourse: MODULES_PER_COURSE,
    lessonsPerModule: LESSONS_PER_MODULE,
    /**
     * Actual filesystem counts — what is stored as JSON on disk right now.
     * Useful for progress tracking; will grow towards the configured totals
     * as content is authored.
     */
    actualModules,
    actualLessons,
    bySite: sites.map(({ site, modules, lessons }) => ({ site, modules, lessons })),
    source: "configured+filesystem",
    scannedAt: new Date().toISOString(),
  });
}
