/**
 * API endpoint to check for orphans and broken links across all learning apps
 * 
 * GET /api/admin/check-orphans
 * 
 * Query params:
 *   - app: Optional app filter (e.g., "learn-ai")
 * 
 * Returns:
 *   {
 *     results: Array of app check results,
 *     summary: { totalIssues, totalWarnings, appsChecked }
 *   }
 */

const fs = require('fs');
const path = require('path');

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
      console.error(`Error reading ${filePath}:`, error.message);
    }
  }

  return content;
}

/**
 * Check for issues in an app
 */
function checkApp(appName, appsDir) {
  const appDir = path.join(appsDir, appName);
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

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { app: specificApp } = req.query;

    // Find apps directory relative to this API route
    const appsDir = path.join(process.cwd(), '..', '..');
    const allApps = fs.readdirSync(appsDir);
    const learningApps = allApps.filter(app => app.startsWith('learn-'));

    let appsToCheck = learningApps;
    if (specificApp) {
      if (!learningApps.includes(specificApp)) {
        return res.status(404).json({ error: `App ${specificApp} not found` });
      }
      appsToCheck = [specificApp];
    }

    const results = appsToCheck.map(app => checkApp(app, appsDir));

    const summary = {
      appsChecked: results.length,
      totalIssues: results.reduce((sum, r) => sum + r.issues.length, 0),
      totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
      appsWithContent: results.filter(r => r.hasContent).length
    };

    res.status(200).json({ results, summary });
  } catch (error) {
    console.error('Error checking orphans:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}
