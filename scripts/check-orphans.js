#!/usr/bin/env node

/**
 * Orphan and Broken Link Checker
 * 
 * Checks for orphaned content and broken links across all learning apps:
 * - Lessons not linked to any module
 * - Modules not linked to any course
 * - Duplicate IDs across all apps
 * - Invalid parent references
 * 
 * Usage:
 *   node scripts/check-orphans.js [--app=learn-ai] [--json] [--verbose]
 * 
 * Options:
 *   --app=<name>  Check specific app only
 *   --json        Output results as JSON
 *   --verbose     Show detailed information
 * 
 * Exit codes:
 *   0 - No issues found
 *   1 - Issues found (orphans or broken links)
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const specificApp = args.find(arg => arg.startsWith('--app='))?.split('=')[1];
const jsonOutput = args.includes('--json');
const verbose = args.includes('--verbose');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  if (!jsonOutput) {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }
}

/**
 * Find all learning apps
 */
function findLearningApps() {
  const appsDir = path.join(__dirname, '..', 'apps');
  const allApps = fs.readdirSync(appsDir);
  const learningApps = allApps.filter(app => app.startsWith('learn-'));
  
  if (specificApp) {
    if (!learningApps.includes(specificApp)) {
      log(`Error: App ${specificApp} not found`, 'red');
      process.exit(1);
    }
    return [specificApp];
  }
  
  return learningApps;
}

/**
 * Read all JSON files from a directory
 */
function readContentFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = fs.readdirSync(directory).filter(f => f.endsWith('.json'));
  const content = [];

  for (const file of files) {
    const filePath = path.join(directory, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      content.push({ file: path.basename(file), path: filePath, data });
    } catch (error) {
      log(`Error reading ${filePath}: ${error.message}`, 'red');
    }
  }

  return content;
}

/**
 * Check for issues in an app
 */
function checkApp(appName) {
  const appDir = path.join(__dirname, '..', 'apps', appName);
  const contentDir = path.join(appDir, 'content');
  
  if (!fs.existsSync(contentDir)) {
    return {
      app: appName,
      hasContent: false,
      issues: [],
      warnings: [],
      stats: { courses: 0, modules: 0, lessons: 0 }
    };
  }

  const courses = readContentFiles(path.join(contentDir, 'courses'));
  const modules = readContentFiles(path.join(contentDir, 'modules'));
  const lessons = readContentFiles(path.join(contentDir, 'lessons'));

  const issues = [];
  const warnings = [];

  // Build ID maps
  const courseIds = new Set(courses.map(c => c.data.id).filter(Boolean));
  const moduleIds = new Set(modules.map(m => m.data.id).filter(Boolean));
  const lessonIds = new Set(lessons.map(l => l.data.id).filter(Boolean));

  // Check for duplicate IDs
  const allIds = {};
  
  courses.forEach(c => {
    if (c.data.id) {
      if (!allIds[c.data.id]) allIds[c.data.id] = [];
      allIds[c.data.id].push({ type: 'course', file: c.file });
    }
  });
  
  modules.forEach(m => {
    if (m.data.id) {
      if (!allIds[m.data.id]) allIds[m.data.id] = [];
      allIds[m.data.id].push({ type: 'module', file: m.file });
    }
  });
  
  lessons.forEach(l => {
    if (l.data.id) {
      if (!allIds[l.data.id]) allIds[l.data.id] = [];
      allIds[l.data.id].push({ type: 'lesson', file: l.file });
    }
  });

  // Report duplicates
  Object.entries(allIds).forEach(([id, occurrences]) => {
    if (occurrences.length > 1) {
      issues.push({
        type: 'duplicate_id',
        id,
        occurrences,
        message: `Duplicate ID "${id}" found in ${occurrences.length} files: ${occurrences.map(o => o.file).join(', ')}`
      });
    }
  });

  // Check for orphaned modules (no parent course)
  modules.forEach(module => {
    if (!module.data.course_id) {
      warnings.push({
        type: 'orphaned_module',
        file: module.file,
        id: module.data.id,
        message: `Module "${module.file}" has no course_id`
      });
    } else if (!courseIds.has(module.data.course_id)) {
      issues.push({
        type: 'broken_link',
        file: module.file,
        id: module.data.id,
        parentType: 'course',
        parentId: module.data.course_id,
        message: `Module "${module.file}" references non-existent course "${module.data.course_id}"`
      });
    }
  });

  // Check for orphaned lessons (no parent module)
  lessons.forEach(lesson => {
    if (!lesson.data.module_id) {
      warnings.push({
        type: 'orphaned_lesson',
        file: lesson.file,
        id: lesson.data.id,
        message: `Lesson "${lesson.file}" has no module_id`
      });
    } else if (!moduleIds.has(lesson.data.module_id)) {
      issues.push({
        type: 'broken_link',
        file: lesson.file,
        id: lesson.data.id,
        parentType: 'module',
        parentId: lesson.data.module_id,
        message: `Lesson "${lesson.file}" references non-existent module "${lesson.data.module_id}"`
      });
    }

    // Check course_id if present
    if (lesson.data.course_id && !courseIds.has(lesson.data.course_id)) {
      issues.push({
        type: 'broken_link',
        file: lesson.file,
        id: lesson.data.id,
        parentType: 'course',
        parentId: lesson.data.course_id,
        message: `Lesson "${lesson.file}" references non-existent course "${lesson.data.course_id}"`
      });
    }
  });

  // Check for courses with no modules
  courses.forEach(course => {
    const hasModules = modules.some(m => m.data.course_id === course.data.id);
    if (!hasModules) {
      warnings.push({
        type: 'empty_course',
        file: course.file,
        id: course.data.id,
        message: `Course "${course.file}" has no modules`
      });
    }
  });

  // Check for modules with no lessons
  modules.forEach(module => {
    const hasLessons = lessons.some(l => l.data.module_id === module.data.id);
    if (!hasLessons) {
      warnings.push({
        type: 'empty_module',
        file: module.file,
        id: module.data.id,
        message: `Module "${module.file}" has no lessons`
      });
    }
  });

  return {
    app: appName,
    hasContent: true,
    issues,
    warnings,
    stats: {
      courses: courses.length,
      modules: modules.length,
      lessons: lessons.length
    }
  };
}

/**
 * Display results
 */
function displayResults(results) {
  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║        Orphan and Broken Link Checker Results             ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  let totalIssues = 0;
  let totalWarnings = 0;

  for (const result of results) {
    const issueCount = result.issues.length;
    const warningCount = result.warnings.length;
    totalIssues += issueCount;
    totalWarnings += warningCount;

    log(`\n${'='.repeat(60)}`, 'blue');
    log(`${result.app}`, 'cyan');
    log(`${'='.repeat(60)}`, 'blue');

    if (!result.hasContent) {
      log('  No content directory found', 'yellow');
      continue;
    }

    log(`  Stats: ${result.stats.courses} courses, ${result.stats.modules} modules, ${result.stats.lessons} lessons`);

    // Display issues
    if (issueCount > 0) {
      log(`\n  ❌ Found ${issueCount} issue(s):`, 'red');
      result.issues.forEach(issue => {
        log(`     - ${issue.message}`, 'red');
      });
    }

    // Display warnings
    if (warningCount > 0) {
      log(`\n  ⚠️  Found ${warningCount} warning(s):`, 'yellow');
      result.warnings.forEach(warning => {
        log(`     - ${warning.message}`, 'yellow');
      });
    }

    if (issueCount === 0 && warningCount === 0) {
      log(`  ✅ No issues found`, 'green');
    }
  }

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('SUMMARY', 'cyan');
  log('='.repeat(60), 'blue');
  log(`Apps checked: ${results.length}`);
  log(`Total critical issues: ${totalIssues}`, totalIssues === 0 ? 'green' : 'red');
  log(`Total warnings: ${totalWarnings}`, totalWarnings === 0 ? 'green' : 'yellow');

  if (totalIssues > 0) {
    log('\n❌ Critical issues found - please fix broken links and duplicate IDs', 'red');
    return 1;
  } else if (totalWarnings > 0) {
    log('\n⚠️  Warnings found - consider addressing orphaned content', 'yellow');
    return 0;
  } else {
    log('\n✅ All checks passed', 'green');
    return 0;
  }
}

/**
 * Main execution
 */
function main() {
  const apps = findLearningApps();
  const results = apps.map(app => checkApp(app));
  const exitCode = displayResults(results);
  process.exit(exitCode);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { checkApp, findLearningApps };
