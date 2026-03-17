/**
 * Tests for centralized content statistics:
 *   1. The filesystem-scan logic used by /api/admin/content-stats
 *   2. The admin bypass in accessControl.userHasAccess()
 *
 * Counts are always derived from the `content/` directory of the repository
 * (real filesystem scan), NOT from Supabase tables.
 */

/* global describe, it, expect, beforeAll */

"use strict";

const path = require("path");
const fs = require("fs");

// ── Content filesystem scan logic ─────────────────────────────────────────────

/**
 * Mirror of the scanContentDirectory() function inside content-stats.js.
 * Kept inline here so the test has zero runtime dependencies on Next.js.
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

  sites.sort((a, b) => a.site.localeCompare(b.site));

  return { sites, totalModules, totalLessons };
}

describe("content-stats — filesystem scan", () => {
  const CONTENT_ROOT = path.join(__dirname, "..", "content");

  it("content/ directory exists", () => {
    expect(fs.existsSync(CONTENT_ROOT)).toBe(true);
  });

  it("returns non-empty sites from the real content/ directory", () => {
    const { sites } = scanContentDirectory(CONTENT_ROOT);
    expect(sites.length).toBeGreaterThan(0);
  });

  it("finds the expected learn-* site directories", () => {
    const { sites } = scanContentDirectory(CONTENT_ROOT);
    const siteNames = sites.map((s) => s.site);
    expect(siteNames).toContain("learn-ai");
    expect(siteNames).toContain("learn-developer");
    expect(siteNames).toContain("learn-management");
    expect(siteNames).toContain("learn-pr");
    expect(siteNames).toContain("learn-chemistry");
    expect(siteNames).toContain("learn-geography");
    expect(siteNames).toContain("learn-math");
    expect(siteNames).toContain("learn-physics");
  });

  it("each site has a course.json (1 course per site)", () => {
    const { sites } = scanContentDirectory(CONTENT_ROOT);
    sites.forEach(({ hasCourseJson }) => {
      expect(hasCourseJson).toBe(true); // all sites should have course.json
    });
  });

  it("each site has exactly 10 modules", () => {
    const { sites } = scanContentDirectory(CONTENT_ROOT);
    sites.forEach(({ site, modules }) => {
      expect({ site, modules }).toMatchObject({ modules: 10 });
    });
  });

  it("each site has exactly 100 lessons (10 per module)", () => {
    const { sites } = scanContentDirectory(CONTENT_ROOT);
    sites.forEach(({ site, lessons }) => {
      expect({ site, lessons }).toMatchObject({ lessons: 100 });
    });
  });

  it("returns correct aggregate totals across all sites", () => {
    const { sites, totalModules, totalLessons } = scanContentDirectory(CONTENT_ROOT);
    const expectedSites = 8;
    expect(sites).toHaveLength(expectedSites);
    expect(totalModules).toBe(expectedSites * 10); // 80
    expect(totalLessons).toBe(expectedSites * 100); // 800
  });

  it("returns zeros when content directory does not exist", () => {
    const { sites, totalModules, totalLessons } = scanContentDirectory("/nonexistent/path/content");
    expect(sites).toHaveLength(0);
    expect(totalModules).toBe(0);
    expect(totalLessons).toBe(0);
  });

  it("sites are returned in alphabetical order", () => {
    const { sites } = scanContentDirectory(CONTENT_ROOT);
    const names = sites.map((s) => s.site);
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });
});

// ── accessControl admin bypass ────────────────────────────────────────────────

describe("accessControl — admin bypass in userHasAccess()", () => {
  let userHasAccess;

  beforeAll(async () => {
    // Dynamic import of the ESM module
    const mod = await import("../packages/access-control/accessControl.js");
    userHasAccess = mod.userHasAccess;
  });

  it("admin user (is_admin=true) gains access to all paid apps without app_access records", () => {
    const adminUser = { id: "admin-uuid", is_admin: true, app_access: [] };
    expect(userHasAccess(adminUser, "learn-ai")).toBe(true);
    expect(userHasAccess(adminUser, "learn-developer")).toBe(true);
    expect(userHasAccess(adminUser, "learn-management")).toBe(true);
    expect(userHasAccess(adminUser, "learn-pr")).toBe(true);
  });

  it("admin user still has access to free apps", () => {
    const adminUser = { id: "admin-uuid", is_admin: true, app_access: [] };
    expect(userHasAccess(adminUser, "learn-math")).toBe(true);
    expect(userHasAccess(adminUser, "learn-chemistry")).toBe(true);
  });

  it("non-admin user (is_admin=false) still requires app_access for paid apps", () => {
    const regularUser = { id: "user-uuid", is_admin: false, app_access: [] };
    expect(userHasAccess(regularUser, "learn-ai")).toBe(false);
  });

  it("admin user with no is_admin field does not get bypass", () => {
    const regularUser = { id: "user-uuid", app_access: [] };
    expect(userHasAccess(regularUser, "learn-ai")).toBe(false);
  });

  it("admin bypass works even when app_access array is missing", () => {
    const adminUser = { id: "admin-uuid", is_admin: true };
    expect(userHasAccess(adminUser, "learn-ai")).toBe(true);
  });

  it("is_admin=true on null user does not cause errors", () => {
    // Null user cannot have is_admin — should be denied for paid apps
    expect(userHasAccess(null, "learn-ai")).toBe(false);
  });
});
