#!/usr/bin/env node
/**
 * scripts/normalize-courses.js
 *
 * Course Structure Normalization Audit Script
 *
 * Audits all learning apps to verify they follow the standard 3-course structure:
 *   - 3 courses (Basic, Intermediate, Advanced)
 *   - 10 modules per course (30 total)
 *   - 10 lessons per module (300 total)
 *
 * Usage:
 *   node scripts/normalize-courses.js [--fix] [--app=<appId>]
 *
 * Options:
 *   --fix       Report discrepancies but do not modify files (audit-only mode)
 *   --app=<id>  Audit a specific app only (e.g. --app=learn-math)
 */

const path = require("path");
const fs = require("fs");

const REPO_ROOT = path.resolve(__dirname, "..");

const STANDARD = {
  COURSES: 3,
  MODULES_PER_COURSE: 10,
  MODULES_TOTAL: 30,
  LESSONS_PER_MODULE: 10,
  LESSONS_PER_COURSE: 100,
  LESSONS_TOTAL: 300,
  COURSE_LEVELS: ["Basic", "Intermediate", "Advanced"],
};

const APPS = [
  { id: "learn-math",       label: "Mathematics",   type: "free" },
  { id: "learn-chemistry",  label: "Chemistry",     type: "free" },
  { id: "learn-geography",  label: "Geography",     type: "free" },
  { id: "learn-physics",    label: "Physics",       type: "free" },
  { id: "learn-ai",         label: "AI",            type: "paid" },
  { id: "learn-developer",  label: "Developer",     type: "paid" },
  { id: "learn-management", label: "Management",    type: "paid" },
  { id: "learn-pr",         label: "PR",            type: "paid" },
];

function checkApp(app) {
  const generatorPath = path.join(REPO_ROOT, "apps", app.id, "lib", "curriculumGenerator.js");
  const result = {
    appId: app.id,
    label: app.label,
    type: app.type,
    issues: [],
    passed: true,
  };

  if (!fs.existsSync(generatorPath)) {
    result.issues.push(`MISSING: lib/curriculumGenerator.js`);
    result.passed = false;
    return result;
  }

  // Parse the generator file to count modules and check COURSES export
  const source = fs.readFileSync(generatorPath, "utf8");

  // Count moduleTopics entries
  const idMatches = source.match(/\bid:\s*\d+/g) || [];
  const moduleCount = idMatches.length;

  if (moduleCount !== STANDARD.MODULES_TOTAL) {
    result.issues.push(`Module count: ${moduleCount} (expected ${STANDARD.MODULES_TOTAL})`);
    result.passed = false;
  }

  // Check COURSES export
  if (!source.includes("export const COURSES")) {
    result.issues.push(`Missing: export const COURSES`);
    result.passed = false;
  }

  // Check getModulesByCourse function
  if (!source.includes("getModulesByCourse")) {
    result.issues.push(`Missing: getModulesByCourse function`);
    result.passed = false;
  }

  // Count modules per course level
  for (const level of STANDARD.COURSE_LEVELS) {
    const regex = new RegExp(`course:\\s*["']${level}["']`, "g");
    const levelModules = (source.match(regex) || []).length;
    if (levelModules !== STANDARD.MODULES_PER_COURSE) {
      result.issues.push(
        `${level} course module count: ${levelModules} (expected ${STANDARD.MODULES_PER_COURSE})`
      );
      result.passed = false;
    }
  }

  // Check lesson pages getStaticPaths covers 30 modules
  const lessonPagePath = path.join(
    REPO_ROOT, "apps", app.id, "pages", "modules", "[moduleId]", "lesson", "[lessonId].js"
  );
  if (fs.existsSync(lessonPagePath)) {
    const lessonSource = fs.readFileSync(lessonPagePath, "utf8");
    if (!lessonSource.includes("moduleId <= 30")) {
      result.issues.push(`Lesson page getStaticPaths: does not cover all 30 modules (missing moduleId <= 30)`);
      result.passed = false;
    }
  } else {
    result.issues.push(`MISSING: pages/modules/[moduleId]/lesson/[lessonId].js`);
    result.passed = false;
  }

  // Check courses.js page exists
  const coursesPagePath = path.join(REPO_ROOT, "apps", app.id, "pages", "courses.js");
  if (!fs.existsSync(coursesPagePath)) {
    result.issues.push(`MISSING: pages/courses.js`);
    result.passed = false;
  }

  // Check content files for modules 1-10 (JSON files)
  const contentRoot = path.join(REPO_ROOT, "content", app.id, "lessons");
  if (fs.existsSync(contentRoot)) {
    let missingFiles = 0;
    for (let mod = 1; mod <= 10; mod++) {
      for (let les = 1; les <= 10; les++) {
        const file = path.join(contentRoot, `module-${mod}`, `lesson-${les}.json`);
        if (!fs.existsSync(file)) missingFiles++;
      }
    }
    if (missingFiles > 0) {
      result.issues.push(
        `Content files: ${missingFiles} lesson JSON files missing in content/${app.id}/lessons/ (modules 1–10)`
      );
      result.passed = false;
    }
  }

  return result;
}

function main() {
  const args = process.argv.slice(2);
  const appFilter = args.find((a) => a.startsWith("--app="))?.split("=")[1];
  const appsToCheck = appFilter ? APPS.filter((a) => a.id === appFilter) : APPS;

  if (appsToCheck.length === 0) {
    console.error(`Unknown app: ${appFilter}`);
    process.exit(1);
  }

  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║          Course Structure Normalization Audit                ║");
  console.log("╠══════════════════════════════════════════════════════════════╣");
  console.log(`║  Standard: ${STANDARD.COURSES} courses × ${STANDARD.MODULES_PER_COURSE} modules × ${STANDARD.LESSONS_PER_MODULE} lessons = ${STANDARD.LESSONS_TOTAL} lessons/app   ║`);
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log();

  let allPassed = true;
  const results = appsToCheck.map(checkApp);

  for (const r of results) {
    const status = r.passed ? "✅ PASS" : "❌ FAIL";
    const typeLabel = r.type === "free" ? "🆓" : "💳";
    console.log(`${status}  ${typeLabel}  ${r.appId.padEnd(20)} (${r.label})`);
    if (r.issues.length > 0) {
      allPassed = false;
      for (const issue of r.issues) {
        console.log(`       ⚠️  ${issue}`);
      }
    }
  }

  console.log();
  if (allPassed) {
    console.log("✅ All apps conform to the standard 3-course structure.");
    process.exit(0);
  } else {
    const failCount = results.filter((r) => !r.passed).length;
    console.log(`❌ ${failCount} app(s) have structural issues. Review the above warnings.`);
    console.log();
    console.log("Source of discrepancy:");
    console.log("  - lib/curriculumGenerator.js defines the module metadata");
    console.log("  - pages/modules/[moduleId]/lesson/[lessonId].js uses getStaticPaths to serve lessons");
    console.log("  - content/<appId>/lessons/ holds the JSON lesson content (modules 1-10 only)");
    console.log("  - Modules 11-30 use auto-generated fallback content (no JSON files required)");
    process.exit(1);
  }
}

main();
