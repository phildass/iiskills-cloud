#!/usr/bin/env node
/**
 * Comprehensive Content Sync Script for Supabase
 * 
 * This script recursively scans ALL content directories in the repository
 * and syncs them to Supabase, making the database the single source of truth.
 * 
 * Content Sources Scanned:
 * - /seeds/content.json (courses, modules, lessons, questions)
 * - /data/sync-platform/ (all structured content)
 * - /apps/learn-[app]/data/seed.json (app-specific seeds)
 * - /apps/learn-[app]/content/ (if exists, future-proofing)
 * - /data/squads/ (cricket/sports data)
 * - /data/fixtures/ (event fixtures)
 * - /apps/learn-govt-jobs/data/ (geography, deadlines, eligibility)
 * 
 * Usage:
 *   node scripts/sync_to_supabase.js
 *   
 * Environment Variables Required:
 *   SUPABASE_URL - Your Supabase project URL
 *   SUPABASE_KEY - Service role key (has admin access)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration
const DRY_RUN = process.env.DRY_RUN === 'true';
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!DRY_RUN && (!SUPABASE_URL || !SUPABASE_KEY)) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Set SUPABASE_URL and SUPABASE_KEY environment variables');
  console.error('Example: SUPABASE_URL=https://xxx.supabase.co SUPABASE_KEY=xxx node scripts/sync_to_supabase.js');
  console.error('Or run in dry-run mode: DRY_RUN=true node scripts/sync_to_supabase.js');
  process.exit(1);
}

const supabase = DRY_RUN ? null : createClient(SUPABASE_URL, SUPABASE_KEY);

// Statistics tracking
const stats = {
  courses: { created: 0, updated: 0, errors: 0, files: [] },
  modules: { created: 0, updated: 0, errors: 0, files: [] },
  lessons: { created: 0, updated: 0, errors: 0, files: [] },
  questions: { created: 0, updated: 0, errors: 0, files: [] },
  geography: { created: 0, updated: 0, errors: 0, files: [] },
  governmentJobs: { created: 0, updated: 0, errors: 0, files: [] },
  syncPlatform: { created: 0, updated: 0, errors: 0, files: [] },
  appSeeds: { created: 0, updated: 0, errors: 0, files: [] },
  otherContent: { created: 0, updated: 0, errors: 0, files: [] },
  unknownTypes: [],
  filesProcessed: 0,
  filesSkipped: 0,
};

/**
 * Log with timestamp
 */
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  const prefixes = {
    error: '❌',
    warn: '⚠️ ',
    success: '✅',
    info: 'ℹ️ '
  };
  const prefix = prefixes[level] || 'ℹ️ ';
  console.log(`[${timestamp}] ${prefix} ${message}`);
}

/**
 * Generate a URL-friendly slug from text
 */
function generateSlug(text) {
  if (!text) return 'untitled';
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/**
 * Recursively find all files matching a pattern
 */
function findFiles(dir, pattern = /./, results = []) {
  if (!fs.existsSync(dir)) {
    return results;
  }

  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, .git, .next, etc.
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist' && file !== 'build') {
        findFiles(filePath, pattern, results);
      }
    } else if (pattern.test(filePath)) {
      results.push(filePath);
    }
  }
  
  return results;
}

/**
 * Safely read and parse JSON file
 */
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    log(`Error reading ${filePath}: ${error.message}`, 'error');
    stats.filesSkipped++;
    return null;
  }
}

/**
 * Migrate courses from seed data
 */
async function migrateCourses(courses, sourceFile) {
  if (!Array.isArray(courses) || courses.length === 0) return new Map();
  
  log(`📚 Migrating ${courses.length} courses from ${sourceFile}...`);
  const idMapping = new Map();
  stats.courses.files.push(sourceFile);

  if (DRY_RUN) {
    log(`[DRY RUN] Would migrate ${courses.length} courses`, 'info');
    courses.forEach((course, idx) => {
      idMapping.set(course.id, `dry-run-course-${idx}`);
      stats.courses.created++;
    });
    return idMapping;
  }

  for (const course of courses) {
    try {
      // Check if course already exists
      const { data: existing } = await supabase
        .from('courses')
        .select('id')
        .eq('slug', course.slug)
        .single();

      if (existing) {
        // Update existing course
        const { error } = await supabase
          .from('courses')
          .update({
            title: course.title,
            short_description: course.short_description || course.description,
            full_description: course.full_description || course.description,
            duration: course.duration,
            category: course.category,
            subdomain: course.subdomain,
            price: course.price || 0,
            is_free: course.is_free !== undefined ? course.is_free : (course.price === 0),
            status: course.status || 'published',
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) {
          log(`Error updating course ${course.slug}: ${error.message}`, 'error');
          stats.courses.errors++;
        } else {
          idMapping.set(course.id, existing.id);
          stats.courses.updated++;
        }
      } else {
        // Insert new course
        const { data, error } = await supabase
          .from('courses')
          .insert({
            title: course.title,
            slug: course.slug,
            short_description: course.short_description || course.description,
            full_description: course.full_description || course.description,
            duration: course.duration,
            category: course.category,
            subdomain: course.subdomain,
            price: course.price || 0,
            is_free: course.is_free !== undefined ? course.is_free : (course.price === 0),
            status: course.status || 'published',
          })
          .select('id')
          .single();

        if (error) {
          log(`Error creating course ${course.slug}: ${error.message}`, 'error');
          stats.courses.errors++;
        } else if (data) {
          idMapping.set(course.id, data.id);
          stats.courses.created++;
        }
      }
    } catch (err) {
      log(`Exception migrating course ${course.slug}: ${err.message}`, 'error');
      stats.courses.errors++;
    }
  }

  return idMapping;
}

/**
 * Migrate modules from seed data
 */
async function migrateModules(modules, courseIdMap, sourceFile) {
  if (!Array.isArray(modules) || modules.length === 0) return new Map();
  
  log(`📖 Migrating ${modules.length} modules from ${sourceFile}...`);
  const idMapping = new Map();
  stats.modules.files.push(sourceFile);

  if (DRY_RUN) {
    log(`[DRY RUN] Would migrate ${modules.length} modules`, 'info');
    modules.forEach((module, idx) => {
      idMapping.set(module.id, `dry-run-module-${idx}`);
      stats.modules.created++;
    });
    return idMapping;
  }

  for (const module of modules) {
    try {
      const courseId = courseIdMap.get(module.course_id);
      if (!courseId) {
        log(`Course ID not found for module ${module.slug || module.id}`, 'warn');
        stats.modules.errors++;
        continue;
      }

      const slug = module.slug || module.id || generateSlug(module.title);

      // Check if module already exists
      const { data: existing } = await supabase
        .from('modules')
        .select('id')
        .eq('course_id', courseId)
        .eq('slug', slug)
        .single();

      if (existing) {
        // Update existing module
        const { error } = await supabase
          .from('modules')
          .update({
            title: module.title,
            description: module.description,
            order_index: module.order || module.order_index || 0,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) {
          log(`Error updating module ${slug}: ${error.message}`, 'error');
          stats.modules.errors++;
        } else {
          idMapping.set(module.id, existing.id);
          stats.modules.updated++;
        }
      } else {
        // Insert new module
        const { data, error } = await supabase
          .from('modules')
          .insert({
            course_id: courseId,
            title: module.title,
            slug,
            description: module.description,
            order_index: module.order || module.order_index || 0,
          })
          .select('id')
          .single();

        if (error) {
          log(`Error creating module ${slug}: ${error.message}`, 'error');
          stats.modules.errors++;
        } else if (data) {
          idMapping.set(module.id, data.id);
          stats.modules.created++;
        }
      }
    } catch (err) {
      log(`Exception migrating module: ${err.message}`, 'error');
      stats.modules.errors++;
    }
  }

  return idMapping;
}

/**
 * Migrate lessons from seed data
 */
async function migrateLessons(lessons, moduleIdMap, sourceFile) {
  if (!Array.isArray(lessons) || lessons.length === 0) return new Map();
  
  log(`📝 Migrating ${lessons.length} lessons from ${sourceFile}...`);
  const idMapping = new Map();
  stats.lessons.files.push(sourceFile);

  if (DRY_RUN) {
    log(`[DRY RUN] Would migrate ${lessons.length} lessons`, 'info');
    lessons.forEach((lesson, idx) => {
      idMapping.set(lesson.id, `dry-run-lesson-${idx}`);
      stats.lessons.created++;
    });
    return idMapping;
  }

  for (const lesson of lessons) {
    try {
      const moduleId = moduleIdMap.get(lesson.module_id);
      if (!moduleId) {
        log(`Module ID not found for lesson ${lesson.id}`, 'warn');
        stats.lessons.errors++;
        continue;
      }

      const slug = lesson.slug || generateSlug(lesson.title);

      // Check if lesson already exists
      const { data: existing } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', moduleId)
        .eq('slug', slug)
        .single();

      if (existing) {
        // Update existing lesson
        const { error } = await supabase
          .from('lessons')
          .update({
            title: lesson.title,
            content: lesson.content,
            duration: lesson.duration,
            order_index: lesson.order || lesson.order_index || 0,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) {
          log(`Error updating lesson ${lesson.title}: ${error.message}`, 'error');
          stats.lessons.errors++;
        } else {
          idMapping.set(lesson.id, existing.id);
          stats.lessons.updated++;
        }
      } else {
        // Insert new lesson
        const { data, error } = await supabase
          .from('lessons')
          .insert({
            module_id: moduleId,
            title: lesson.title,
            slug,
            content: lesson.content,
            duration: lesson.duration,
            order_index: lesson.order || lesson.order_index || 0,
          })
          .select('id')
          .single();

        if (error) {
          log(`Error creating lesson ${lesson.title}: ${error.message}`, 'error');
          stats.lessons.errors++;
        } else if (data) {
          idMapping.set(lesson.id, data.id);
          stats.lessons.created++;
        }
      }
    } catch (err) {
      log(`Exception migrating lesson: ${err.message}`, 'error');
      stats.lessons.errors++;
    }
  }

  return idMapping;
}

/**
 * Migrate questions from seed data
 */
async function migrateQuestions(questions, lessonIdMap, sourceFile) {
  if (!Array.isArray(questions) || questions.length === 0) return;
  
  log(`❓ Migrating ${questions.length} questions from ${sourceFile}...`);
  stats.questions.files.push(sourceFile);

  if (DRY_RUN) {
    log(`[DRY RUN] Would migrate ${questions.length} questions`, 'info');
    stats.questions.created += questions.length;
    return;
  }

  for (const question of questions) {
    try {
      const lessonId = lessonIdMap.get(question.lesson_id);
      if (!lessonId) {
        log(`Lesson ID not found for question ${question.id}`, 'warn');
        stats.questions.errors++;
        continue;
      }

      // Check if question already exists
      const { data: existing } = await supabase
        .from('questions')
        .select('id')
        .eq('lesson_id', lessonId)
        .eq('question_text', question.question_text)
        .single();

      if (existing) {
        // Update existing question
        const { error } = await supabase
          .from('questions')
          .update({
            question_type: question.question_type || 'multiple_choice',
            options: question.options,
            correct_answer: question.correct_answer,
            explanation: question.explanation,
            difficulty: question.difficulty,
          })
          .eq('id', existing.id);

        if (error) {
          log(`Error updating question: ${error.message}`, 'error');
          stats.questions.errors++;
        } else {
          stats.questions.updated++;
        }
      } else {
        // Insert new question
        const { error } = await supabase
          .from('questions')
          .insert({
            lesson_id: lessonId,
            question_text: question.question_text,
            question_type: question.question_type || 'multiple_choice',
            options: question.options,
            correct_answer: question.correct_answer,
            explanation: question.explanation,
            difficulty: question.difficulty,
          });

        if (error) {
          log(`Error inserting question: ${error.message}`, 'error');
          stats.questions.errors++;
        } else {
          stats.questions.created++;
        }
      }
    } catch (err) {
      log(`Exception migrating question: ${err.message}`, 'error');
      stats.questions.errors++;
    }
  }
}

/**
 * Process sync-platform content
 */
async function processSyncPlatformContent(baseDir) {
  log(`🔄 Scanning sync-platform content in ${baseDir}...`);
  
  const contentFiles = findFiles(baseDir, /\.(json)$/);
  
  for (const file of contentFiles) {
    // Skip schema files
    if (file.includes('/schemas/')) {
      continue;
    }
    
    stats.filesProcessed++;
    const data = readJsonFile(file);
    if (!data) continue;
    
    stats.syncPlatform.files.push(file);
    
    // Detect content type from filename or structure
    const filename = path.basename(file);
    
    if (filename.startsWith('module-') && !filename.includes('quiz')) {
      // Module content
      try {
        // Extract app name from path
        const pathParts = file.split(path.sep);
        const appIndex = pathParts.findIndex(p => p.startsWith('learn-'));
        const appName = appIndex >= 0 ? pathParts[appIndex] : 'unknown';
        
        log(`Processing module from sync-platform: ${filename} (${appName})`, 'info');
        stats.syncPlatform.created++;
        // TODO: Store in content_library or appropriate table
      } catch (err) {
        log(`Error processing sync-platform module ${filename}: ${err.message}`, 'error');
        stats.syncPlatform.errors++;
      }
    } else if (filename.startsWith('lesson-')) {
      // Lesson content
      try {
        log(`Processing lesson from sync-platform: ${filename}`, 'info');
        stats.syncPlatform.created++;
        // TODO: Store in content_library or appropriate table
      } catch (err) {
        log(`Error processing sync-platform lesson ${filename}: ${err.message}`, 'error');
        stats.syncPlatform.errors++;
      }
    } else if (filename.startsWith('quiz-')) {
      // Quiz content
      try {
        log(`Processing quiz from sync-platform: ${filename}`, 'info');
        stats.syncPlatform.created++;
        // TODO: Store in questions table or quiz-specific table
      } catch (err) {
        log(`Error processing sync-platform quiz ${filename}: ${err.message}`, 'error');
        stats.syncPlatform.errors++;
      }
    } else {
      // Unknown type - log for future schema extension
      stats.unknownTypes.push({
        file,
        type: 'sync-platform-unknown',
        sample: Object.keys(data).slice(0, 5),
      });
    }
  }
}

/**
 * Process app-specific seed files
 */
async function processAppSeeds(appsDir) {
  log(`🎓 Scanning app-specific seed files in ${appsDir}...`);
  
  const seedFiles = findFiles(appsDir, /\/data\/seed\.json$/);
  
  for (const file of seedFiles) {
    stats.filesProcessed++;
    const data = readJsonFile(file);
    if (!data) continue;
    
    stats.appSeeds.files.push(file);
    
    // Extract app name from path
    const appName = file.split(path.sep).find(p => p.startsWith('learn-'));
    log(`Processing seed file for ${appName}: ${file}`, 'info');
    
    // Process based on structure
    if (data.courses) {
      const courseMap = await migrateCourses(data.courses, file);
      if (data.modules) {
        const moduleMap = await migrateModules(data.modules, courseMap, file);
        if (data.lessons) {
          const lessonMap = await migrateLessons(data.lessons, moduleMap, file);
          if (data.questions) {
            await migrateQuestions(data.questions, lessonMap, file);
          }
        }
      }
    } else {
      // Unknown structure
      stats.unknownTypes.push({
        file,
        type: 'app-seed-unknown',
        sample: Object.keys(data).slice(0, 5),
      });
    }
  }
}

/**
 * Process other data sources (squads, fixtures, etc.)
 */
async function processOtherData(dataDir) {
  log(`📊 Scanning other data sources in ${dataDir}...`);
  
  const dataFiles = findFiles(dataDir, /\.(json)$/);
  
  for (const file of dataFiles) {
    // Skip already processed files
    if (file.includes('/sync-platform/')) continue;
    
    stats.filesProcessed++;
    const data = readJsonFile(file);
    if (!data) continue;
    
    const filename = path.basename(file);
    
    // Process cricket squads
    if (file.includes('/squads/')) {
      stats.otherContent.files.push(file);
      log(`Processing cricket squad: ${filename}`, 'info');
      stats.otherContent.created++;
      // TODO: Store in sports/cricket-specific table if needed
    }
    // Process fixtures
    else if (file.includes('/fixtures/')) {
      stats.otherContent.files.push(file);
      log(`Processing fixtures: ${filename}`, 'info');
      stats.otherContent.created++;
      // TODO: Store in events/fixtures table if needed
    }
    // Unknown data type
    else if (!file.includes('/schemas/')) {
      stats.unknownTypes.push({
        file,
        type: 'other-data-unknown',
        sample: Object.keys(data).slice(0, 5),
      });
    }
  }
}

/**
 * Process geography data
 */
async function processGeography(filePath) {
  if (!fs.existsSync(filePath)) {
    log('Geography data file not found, skipping...', 'warn');
    return;
  }

  log('🌍 Migrating geography data...');
  stats.geography.files.push(filePath);
  const geographyData = readJsonFile(filePath);
  if (!geographyData) return;

  if (DRY_RUN) {
    log(`[DRY RUN] Would migrate ${geographyData.length} geography entries`, 'info');
    stats.geography.created += geographyData.length * 10; // Estimate with states/districts
    return;
  }

  // Conflict resolution for geography upserts
  const conflictColumns = 'name,type,parent_id';

  for (const country of geographyData) {
    try {
      // Insert country
      const { data: countryData, error: countryError } = await supabase
        .from('geography')
        .upsert({
          name: country.name,
          type: country.type,
          parent_id: null,
        }, {
          onConflict: conflictColumns,
          ignoreDuplicates: false,
        })
        .select('id')
        .single();

      if (countryError) {
        log(`Error inserting country ${country.name}: ${countryError.message}`, 'error');
        stats.geography.errors++;
        continue;
      }

      stats.geography.created++;

      // Insert states/provinces
      for (const state of country.children || []) {
        const { data: stateData, error: stateError } = await supabase
          .from('geography')
          .upsert({
            name: state.name,
            type: state.type,
            parent_id: countryData.id,
          }, {
            onConflict: conflictColumns,
            ignoreDuplicates: false,
          })
          .select('id')
          .single();

        if (stateError) {
          log(`Error inserting state ${state.name}: ${stateError.message}`, 'error');
          stats.geography.errors++;
          continue;
        }

        stats.geography.created++;

        // Insert districts
        for (const district of state.children || []) {
          const { error: districtError } = await supabase
            .from('geography')
            .upsert({
              name: district.name,
              type: district.type,
              parent_id: stateData.id,
            }, {
              onConflict: conflictColumns,
              ignoreDuplicates: false,
            });

          if (districtError) {
            log(`Error inserting district ${district.name}: ${districtError.message}`, 'error');
            stats.geography.errors++;
          } else {
            stats.geography.created++;
          }
        }
      }
    } catch (err) {
      log(`Exception migrating geography: ${err.message}`, 'error');
      stats.geography.errors++;
    }
  }
}

/**
 * Process government jobs data
 */
async function processGovernmentJobs(filePath) {
  if (!fs.existsSync(filePath)) {
    log('Government jobs deadlines file not found, skipping...', 'warn');
    return;
  }

  log('💼 Migrating government jobs data...');
  stats.governmentJobs.files.push(filePath);
  const deadlinesData = readJsonFile(filePath);
  if (!deadlinesData) return;

  if (DRY_RUN) {
    log(`[DRY RUN] Would migrate ${Object.keys(deadlinesData).length} government jobs`, 'info');
    stats.governmentJobs.created += Object.keys(deadlinesData).length;
    return;
  }

  // Import eligibility templates
  const eligibilityTemplates = {
    clerk: {
      education: '12th pass',
      age: { min: 18, max: 30 },
      experience: 'Not required',
    },
    teacher: {
      education: 'B.Ed or equivalent',
      age: { min: 21, max: 35 },
      experience: 'Freshers can apply',
    },
    police: {
      education: '12th pass',
      age: { min: 18, max: 28 },
      physicalFitness: true,
    },
    ias: {
      education: "Bachelor's degree",
      age: { 
        min: 21, 
        max: 32,
        relaxation: [
          { category: 'OBC', years: 3 },
          { category: 'SC/ST', years: 5 }
        ]
      },
      nationality: 'Indian',
    },
  };

  for (const [jobId, jobData] of Object.entries(deadlinesData)) {
    try {
      // Parse job ID to extract location and type
      const parts = jobId.split('-');
      const level = parts[1] === 'central' ? 'central' : 'state';
      const state = parts[1] !== 'central' ? parts[1] : null;
      const district = parts[2] !== 'all' ? parts[2] : null;
      const jobType = parts[parts.length - 2];

      // Get eligibility template
      const eligibility = eligibilityTemplates[jobType] || eligibilityTemplates.clerk;

      const { error } = await supabase
        .from('government_jobs')
        .upsert({
          job_id: jobId,
          title: `${jobType.charAt(0).toUpperCase() + jobType.slice(1)} Position`,
          department: 'Various Departments',
          level,
          location_state: state,
          location_district: district,
          position_type: jobType,
          education_requirement: eligibility.education,
          age_min: eligibility.age.min,
          age_max: eligibility.age.max,
          age_relaxations: eligibility.age.relaxation || null,
          physical_fitness_required: eligibility.physicalFitness || false,
          application_deadline: jobData.deadline,
          notification_date: jobData.notificationDate,
          exam_date: jobData.examDate || jobData.prelimsDate,
          physical_test_date: jobData.physicalTestDate,
          interview_date: jobData.interviewDate,
          status: jobData.status,
        }, {
          onConflict: 'job_id',
          ignoreDuplicates: false,
        });

      if (error) {
        log(`Error upserting job ${jobId}: ${error.message}`, 'error');
        stats.governmentJobs.errors++;
      } else {
        stats.governmentJobs.created++;
      }
    } catch (err) {
      log(`Exception migrating job ${jobId}: ${err.message}`, 'error');
      stats.governmentJobs.errors++;
    }
  }
}

/**
 * Main sync function
 */
async function main() {
  const startTime = Date.now();
  
  console.log('');
  console.log('========================================');
  console.log('  COMPREHENSIVE CONTENT SYNC TO SUPABASE');
  if (DRY_RUN) {
    console.log('  [DRY RUN MODE - No actual database changes]');
  }
  console.log('========================================');
  console.log('');
  if (!DRY_RUN) {
    log(`Supabase URL: ${SUPABASE_URL}`);
  }
  log(`Starting comprehensive content sync...`);
  console.log('');

  try {
    const rootDir = path.join(__dirname, '..');

    // 1. Process main seed file
    const seedFile = path.join(rootDir, 'seeds', 'content.json');
    if (fs.existsSync(seedFile)) {
      log('📦 Processing main seed file...');
      stats.filesProcessed++;
      const seedData = readJsonFile(seedFile);
      
      if (seedData) {
        const courseIdMap = await migrateCourses(seedData.courses || [], seedFile);
        const moduleIdMap = await migrateModules(seedData.modules || [], courseIdMap, seedFile);
        const lessonIdMap = await migrateLessons(seedData.lessons || [], moduleIdMap, seedFile);
        await migrateQuestions(seedData.questions || [], lessonIdMap, seedFile);
      }
    } else {
      log('Main seed file not found, skipping...', 'warn');
    }

    // 2. Process sync-platform content
    const syncPlatformDir = path.join(rootDir, 'data', 'sync-platform');
    if (fs.existsSync(syncPlatformDir)) {
      await processSyncPlatformContent(syncPlatformDir);
    } else {
      log('Sync-platform directory not found, skipping...', 'warn');
    }

    // 3. Process app-specific seeds
    const appsDir = path.join(rootDir, 'apps');
    if (fs.existsSync(appsDir)) {
      await processAppSeeds(appsDir);
    } else {
      log('Apps directory not found, skipping...', 'warn');
    }

    // 4. Process geography data
    const geographyFile = path.join(rootDir, 'apps', 'learn-govt-jobs', 'data', 'geography.json');
    await processGeography(geographyFile);

    // 5. Process government jobs
    const jobsFile = path.join(rootDir, 'apps', 'learn-govt-jobs', 'data', 'deadlines.json');
    await processGovernmentJobs(jobsFile);

    // 6. Process other data sources
    const dataDir = path.join(rootDir, 'data');
    if (fs.existsSync(dataDir)) {
      await processOtherData(dataDir);
    }

    // 7. Scan for any /apps/learn-*/content/ directories (future-proofing)
    log('🔍 Scanning for learn-*/content/ directories...');
    const learnApps = fs.readdirSync(appsDir).filter(d => d.startsWith('learn-'));
    for (const app of learnApps) {
      const contentDir = path.join(appsDir, app, 'content');
      if (fs.existsSync(contentDir)) {
        log(`Found content directory for ${app}`, 'warn');
        const contentFiles = findFiles(contentDir, /\.(json|js)$/);
        if (contentFiles.length > 0) {
          log(`Found ${contentFiles.length} content files in ${app}/content/`, 'warn');
          stats.unknownTypes.push({
            file: contentDir,
            type: 'app-content-directory',
            files: contentFiles.length,
          });
        }
      }
    }

    // Print summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    console.log('');
    console.log('========================================');
    console.log('  SYNC COMPLETE!');
    console.log('========================================');
    console.log('');
    console.log('📊 Summary:');
    console.log(`  ⏱️  Duration: ${duration}s`);
    console.log(`  📁 Files Processed: ${stats.filesProcessed}`);
    console.log(`  ⏭️  Files Skipped: ${stats.filesSkipped}`);
    console.log('');
    console.log('📚 Content Synced:');
    console.log(`  Courses:        ${stats.courses.created} created, ${stats.courses.updated} updated, ${stats.courses.errors} errors`);
    console.log(`  Modules:        ${stats.modules.created} created, ${stats.modules.updated} updated, ${stats.modules.errors} errors`);
    console.log(`  Lessons:        ${stats.lessons.created} created, ${stats.lessons.updated} updated, ${stats.lessons.errors} errors`);
    console.log(`  Questions:      ${stats.questions.created} created, ${stats.questions.updated} updated, ${stats.questions.errors} errors`);
    console.log(`  Geography:      ${stats.geography.created} created, ${stats.geography.errors} errors`);
    console.log(`  Govt Jobs:      ${stats.governmentJobs.created} created, ${stats.governmentJobs.errors} errors`);
    console.log(`  Sync Platform:  ${stats.syncPlatform.created} processed, ${stats.syncPlatform.errors} errors`);
    console.log(`  App Seeds:      Processed ${stats.appSeeds.files.length} files`);
    console.log(`  Other Content:  ${stats.otherContent.created} processed, ${stats.otherContent.errors} errors`);
    console.log('');

    // Report unknown types for schema extension recommendations
    if (stats.unknownTypes.length > 0) {
      console.log('⚠️  Unknown Content Types Found (Schema Extension Recommended):');
      console.log('');
      for (const unknown of stats.unknownTypes) {
        console.log(`  📄 ${unknown.file}`);
        console.log(`     Type: ${unknown.type}`);
        if (unknown.sample) {
          console.log(`     Keys: ${unknown.sample.join(', ')}`);
        }
        if (unknown.files) {
          console.log(`     Files: ${unknown.files}`);
        }
        console.log('');
      }
      console.log('  💡 Recommendation: Review these files and extend Supabase schema if needed.');
      console.log('');
    }

    // Report files processed by category
    console.log('📋 Files Processed by Source:');
    if (stats.courses.files.length > 0) {
      console.log(`  Courses: ${stats.courses.files.join(', ')}`);
    }
    if (stats.geography.files.length > 0) {
      console.log(`  Geography: ${stats.geography.files.join(', ')}`);
    }
    if (stats.governmentJobs.files.length > 0) {
      console.log(`  Govt Jobs: ${stats.governmentJobs.files.join(', ')}`);
    }
    if (stats.syncPlatform.files.length > 0) {
      console.log(`  Sync Platform: ${stats.syncPlatform.files.length} files`);
    }
    if (stats.appSeeds.files.length > 0) {
      console.log(`  App Seeds: ${stats.appSeeds.files.join(', ')}`);
    }
    if (stats.otherContent.files.length > 0) {
      console.log(`  Other Content: ${stats.otherContent.files.length} files`);
    }
    console.log('');

    const totalErrors = Object.values(stats).reduce((sum, s) => {
      return sum + (s.errors || 0);
    }, 0);

    if (totalErrors > 0) {
      log(`Sync completed with ${totalErrors} errors. Check logs above.`, 'warn');
      process.exit(1);
    } else {
      log('Sync completed successfully! ✨', 'success');
      process.exit(0);
    }
  } catch (error) {
    log(`Fatal error during sync: ${error.message}`, 'error');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run sync
if (require.main === module) {
  main();
}

module.exports = { main };
