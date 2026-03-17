/**
 * Admin Content Statistics API
 *
 * GET /api/admin/content-stats
 *
 * Returns accurate content counts derived directly from the repository filesystem
 * (the `content/` directory at the monorepo root). Stats reflect the real
 * GitHub content structure — NOT Supabase tables, which may be incomplete.
 *
 * Structure scanned:
 *   content/
 *     {site}/               ← one site per learn-* app
 *       course.json         ← one course per site
 *       lessons/
 *         module-{N}/       ← one module directory per module
 *           lesson-{N}.json ← one lesson file per lesson
 *
 * Response shape:
 *   {
 *     totalSites:   number,   // # of sites (subdirectories in content/)
 *     totalCourses: number,   // 1 course per site (from course.json)
 *     totalModules: number,   // total module-* directories across all sites
 *     totalLessons: number,   // total lesson-*.json files across all modules
 *     bysite: [
 *       {
 *         site:    string,    // e.g. "learn-ai"
 *         modules: number,
 *         lessons: number,
 *       },
 *       ...
 *     ],
 *     source: "filesystem",   // always "filesystem" — never Supabase
 *     scannedAt: string,      // ISO timestamp of scan
 *   }
 *
 * Authentication: admin session cookie or x-admin-secret header
 *   (via validateAdminRequest from lib/adminAuth).
 *   No Supabase access required for the stats themselves.
 */

import fs from "fs";
import path from "path";
import { validateAdminRequest } from "../../../lib/adminAuth";

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
  const { sites, totalModules, totalLessons } = scanContentDirectory(contentRoot);

  // Each site corresponds to exactly one course (its curriculum).
  // A site with a course.json is confirmed; others are counted too.
  const totalSites = sites.length;
  const totalCourses = sites.filter((s) => s.hasCourseJson).length;

  return res.status(200).json({
    /**
     * Stats are derived from the `content/` directory of the main repository.
     * They reflect the actual file structure on disk at request time and are
     * NOT sourced from Supabase tables, which may be incomplete or outdated.
     */
    totalSites,
    totalCourses,
    totalModules,
    totalLessons,
    bySite: sites.map(({ site, modules, lessons }) => ({ site, modules, lessons })),
    source: "filesystem",
    scannedAt: new Date().toISOString(),
  });
}
