#!/usr/bin/env node

/**
 * Content Validator
 * 
 * Validates all content JSON files across all learning apps.
 * Checks for:
 * - Required fields present
 * - Correct schema format
 * - Valid parent links (module_id -> module exists, course_id -> course exists)
 * - No duplicate IDs within the same app
 * 
 * Usage:
 *   node scripts/validate-content.js [--app=learn-ai] [--verbose]
 * 
 * Exit codes:
 *   0 - All validations passed
 *   1 - Validation errors found
 */

const fs = require('fs');
const path = require('path');

// Import schema definitions (using require for Node.js compatibility)
const { courseSchema, moduleSchema, lessonSchema, validateContent, getSchema } = require('../lib/contentSchema.js');

// Parse command line arguments
const args = process.argv.slice(2);
const specificApp = args.find(arg => arg.startsWith('--app='))?.split('=')[1];
const verbose = args.includes('--verbose');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
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
function readContentFiles(directory, contentType) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  const files = fs.readdirSync(directory).filter(f => f.endsWith('.json'));
  const content = [];

  for (const file of files) {
    const filePath = path.join(directory, file);
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      content.push({ file: filePath, data, type: contentType });
    } catch (error) {
      log(`Error reading ${filePath}: ${error.message}`, 'red');
    }
  }

  return content;
}

/**
 * Validate all content for an app
 */
function validateApp(appName) {
  const appDir = path.join(__dirname, '..', 'apps', appName);
  const contentDir = path.join(appDir, 'content');
  
  if (!fs.existsSync(contentDir)) {
    log(`Warning: ${appName} has no content directory`, 'yellow');
    return { passed: true, warnings: 1, errors: 0 };
  }

  const courses = readContentFiles(path.join(contentDir, 'courses'), 'course');
  const modules = readContentFiles(path.join(contentDir, 'modules'), 'module');
  const lessons = readContentFiles(path.join(contentDir, 'lessons'), 'lesson');

  let errors = 0;
  let warnings = 0;

  // Track IDs for duplicate detection
  const courseIds = new Set();
  const moduleIds = new Set();
  const lessonIds = new Set();

  log(`\n${'='.repeat(60)}`, 'blue');
  log(`Validating ${appName}`, 'cyan');
  log(`${'='.repeat(60)}`, 'blue');
  log(`Found: ${courses.length} courses, ${modules.length} modules, ${lessons.length} lessons`);

  // Validate courses
  for (const { file, data, type } of courses) {
    const schema = getSchema(type);
    const result = validateContent(data, schema);
    
    if (!result.valid) {
      errors++;
      log(`\n✗ ${path.basename(file)}:`, 'red');
      result.errors.forEach(err => log(`  - ${err}`, 'red'));
    } else if (verbose) {
      log(`✓ ${path.basename(file)}`, 'green');
    }

    // Check for duplicate IDs
    if (data.id) {
      if (courseIds.has(data.id)) {
        errors++;
        log(`✗ Duplicate course ID: ${data.id} in ${path.basename(file)}`, 'red');
      }
      courseIds.add(data.id);
    }

    // Validate sourceApp matches
    if (data.sourceApp !== appName) {
      warnings++;
      log(`⚠ ${path.basename(file)}: sourceApp is "${data.sourceApp}" but should be "${appName}"`, 'yellow');
    }
  }

  // Validate modules
  for (const { file, data, type } of modules) {
    const schema = getSchema(type);
    const result = validateContent(data, schema);
    
    if (!result.valid) {
      errors++;
      log(`\n✗ ${path.basename(file)}:`, 'red');
      result.errors.forEach(err => log(`  - ${err}`, 'red'));
    } else if (verbose) {
      log(`✓ ${path.basename(file)}`, 'green');
    }

    // Check for duplicate IDs
    if (data.id) {
      if (moduleIds.has(data.id)) {
        errors++;
        log(`✗ Duplicate module ID: ${data.id} in ${path.basename(file)}`, 'red');
      }
      moduleIds.add(data.id);
    }

    // Validate parent course exists
    if (data.course_id && !courseIds.has(data.course_id)) {
      errors++;
      log(`✗ ${path.basename(file)}: References non-existent course "${data.course_id}"`, 'red');
    }

    // Validate sourceApp matches
    if (data.sourceApp !== appName) {
      warnings++;
      log(`⚠ ${path.basename(file)}: sourceApp is "${data.sourceApp}" but should be "${appName}"`, 'yellow');
    }
  }

  // Validate lessons
  for (const { file, data, type } of lessons) {
    const schema = getSchema(type);
    const result = validateContent(data, schema);
    
    if (!result.valid) {
      errors++;
      log(`\n✗ ${path.basename(file)}:`, 'red');
      result.errors.forEach(err => log(`  - ${err}`, 'red'));
    } else if (verbose) {
      log(`✓ ${path.basename(file)}`, 'green');
    }

    // Check for duplicate IDs
    if (data.id) {
      if (lessonIds.has(data.id)) {
        errors++;
        log(`✗ Duplicate lesson ID: ${data.id} in ${path.basename(file)}`, 'red');
      }
      lessonIds.add(data.id);
    }

    // Validate parent module exists
    if (data.module_id && !moduleIds.has(data.module_id)) {
      errors++;
      log(`✗ ${path.basename(file)}: References non-existent module "${data.module_id}"`, 'red');
    }

    // Validate parent course exists (if specified)
    if (data.course_id && !courseIds.has(data.course_id)) {
      errors++;
      log(`✗ ${path.basename(file)}: References non-existent course "${data.course_id}"`, 'red');
    }

    // Validate sourceApp matches
    if (data.sourceApp !== appName) {
      warnings++;
      log(`⚠ ${path.basename(file)}: sourceApp is "${data.sourceApp}" but should be "${appName}"`, 'yellow');
    }
  }

  // Check for orphaned content
  const orphanedModules = modules.filter(m => !m.data.course_id || !courseIds.has(m.data.course_id));
  const orphanedLessons = lessons.filter(l => !l.data.module_id || !moduleIds.has(l.data.module_id));

  if (orphanedModules.length > 0) {
    warnings++;
    log(`\n⚠ Found ${orphanedModules.length} orphaned modules (not linked to any course)`, 'yellow');
  }

  if (orphanedLessons.length > 0) {
    warnings++;
    log(`\n⚠ Found ${orphanedLessons.length} orphaned lessons (not linked to any module)`, 'yellow');
  }

  return { passed: errors === 0, warnings, errors };
}

/**
 * Main execution
 */
function main() {
  log('\n╔════════════════════════════════════════════════════════════╗', 'cyan');
  log('║           iiskills-cloud Content Validator                ║', 'cyan');
  log('╚════════════════════════════════════════════════════════════╝', 'cyan');

  const apps = findLearningApps();
  let totalErrors = 0;
  let totalWarnings = 0;
  let totalApps = 0;

  for (const app of apps) {
    const result = validateApp(app);
    totalErrors += result.errors;
    totalWarnings += result.warnings;
    if (result.errors === 0) {
      totalApps++;
    }
  }

  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('VALIDATION SUMMARY', 'cyan');
  log('='.repeat(60), 'blue');
  log(`Apps validated: ${apps.length}`);
  log(`Apps passed: ${totalApps}`, totalApps === apps.length ? 'green' : 'yellow');
  log(`Total errors: ${totalErrors}`, totalErrors === 0 ? 'green' : 'red');
  log(`Total warnings: ${totalWarnings}`, totalWarnings === 0 ? 'green' : 'yellow');

  if (totalErrors > 0) {
    log('\n❌ Validation FAILED', 'red');
    process.exit(1);
  } else if (totalWarnings > 0) {
    log('\n⚠️  Validation passed with warnings', 'yellow');
    process.exit(0);
  } else {
    log('\n✅ All validations PASSED', 'green');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateApp, findLearningApps };
