#!/usr/bin/env node
/**
 * Content Migration Script
 * 
 * This script migrates ALL educational content from local files to Supabase.
 * It extracts content from:
 * - seeds/content.json (courses, modules, lessons, questions)
 * - apps/learn-govt-jobs/data/* (geography, deadlines, eligibility)
 * - Future: cricket trivia, biographical content, etc.
 * 
 * Usage:
 *   node scripts/migrate-content-to-supabase.ts
 *   
 * Environment Variables Required:
 *   SUPABASE_URL - Your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key (has admin access)
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials!');
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Statistics tracking
const stats = {
  courses: { created: 0, updated: 0, errors: 0 },
  modules: { created: 0, updated: 0, errors: 0 },
  lessons: { created: 0, updated: 0, errors: 0 },
  questions: { created: 0, updated: 0, errors: 0 },
  geography: { created: 0, updated: 0, errors: 0 },
  governmentJobs: { created: 0, updated: 0, errors: 0 },
};

/**
 * Log with timestamp
 */
function log(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

/**
 * Migrate courses from seed data
 */
async function migrateCourses(courses: any[]): Promise<Map<string, string>> {
  log(`📚 Migrating ${courses.length} courses...`);
  const idMapping = new Map<string, string>();

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
            short_description: course.short_description,
            full_description: course.full_description,
            duration: course.duration,
            category: course.category,
            subdomain: course.subdomain,
            price: course.price,
            is_free: course.is_free,
            status: course.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) {
          console.error(`Error updating course ${course.slug}:`, error);
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
            short_description: course.short_description,
            full_description: course.full_description,
            duration: course.duration,
            category: course.category,
            subdomain: course.subdomain,
            price: course.price,
            is_free: course.is_free,
            status: course.status,
          })
          .select('id')
          .single();

        if (error) {
          console.error(`Error creating course ${course.slug}:`, error);
          stats.courses.errors++;
        } else if (data) {
          idMapping.set(course.id, data.id);
          stats.courses.created++;
        }
      }
    } catch (err) {
      console.error(`Exception migrating course ${course.slug}:`, err);
      stats.courses.errors++;
    }
  }

  log(`✅ Courses: ${stats.courses.created} created, ${stats.courses.updated} updated, ${stats.courses.errors} errors`);
  return idMapping;
}

/**
 * Migrate modules from seed data
 */
async function migrateModules(modules: any[], courseIdMap: Map<string, string>): Promise<Map<string, string>> {
  log(`📖 Migrating ${modules.length} modules...`);
  const idMapping = new Map<string, string>();

  for (const module of modules) {
    try {
      const courseId = courseIdMap.get(module.course_id);
      if (!courseId) {
        console.error(`Course ID not found for module ${module.slug}`);
        stats.modules.errors++;
        continue;
      }

      // Check if module already exists
      const { data: existing } = await supabase
        .from('modules')
        .select('id')
        .eq('course_id', courseId)
        .eq('slug', module.slug)
        .single();

      if (existing) {
        // Update existing module
        const { error } = await supabase
          .from('modules')
          .update({
            title: module.title,
            description: module.description,
            order_index: module.order || 0,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) {
          console.error(`Error updating module ${module.slug}:`, error);
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
            slug: module.slug,
            description: module.description,
            order_index: module.order || 0,
          })
          .select('id')
          .single();

        if (error) {
          console.error(`Error creating module ${module.slug}:`, error);
          stats.modules.errors++;
        } else if (data) {
          idMapping.set(module.id, data.id);
          stats.modules.created++;
        }
      }
    } catch (err) {
      console.error(`Exception migrating module ${module.slug}:`, err);
      stats.modules.errors++;
    }
  }

  log(`✅ Modules: ${stats.modules.created} created, ${stats.modules.updated} updated, ${stats.modules.errors} errors`);
  return idMapping;
}

/**
 * Migrate lessons from seed data
 */
async function migrateLessons(lessons: any[], moduleIdMap: Map<string, string>): Promise<Map<string, string>> {
  log(`📝 Migrating ${lessons.length} lessons...`);
  const idMapping = new Map<string, string>();

  for (const lesson of lessons) {
    try {
      const moduleId = moduleIdMap.get(lesson.module_id);
      if (!moduleId) {
        console.error(`Module ID not found for lesson ${lesson.id}`);
        stats.lessons.errors++;
        continue;
      }

      const slug = lesson.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

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
            order_index: lesson.order || 0,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);

        if (error) {
          console.error(`Error updating lesson ${lesson.title}:`, error);
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
            order_index: lesson.order || 0,
          })
          .select('id')
          .single();

        if (error) {
          console.error(`Error creating lesson ${lesson.title}:`, error);
          stats.lessons.errors++;
        } else if (data) {
          idMapping.set(lesson.id, data.id);
          stats.lessons.created++;
        }
      }
    } catch (err) {
      console.error(`Exception migrating lesson ${lesson.title}:`, err);
      stats.lessons.errors++;
    }
  }

  log(`✅ Lessons: ${stats.lessons.created} created, ${stats.lessons.updated} updated, ${stats.lessons.errors} errors`);
  return idMapping;
}

/**
 * Migrate questions from seed data
 */
async function migrateQuestions(questions: any[], lessonIdMap: Map<string, string>) {
  log(`❓ Migrating ${questions.length} questions...`);

  for (const question of questions) {
    try {
      const lessonId = lessonIdMap.get(question.lesson_id);
      if (!lessonId) {
        console.error(`Lesson ID not found for question ${question.id}`);
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
            question_type: 'multiple_choice',
            options: question.options,
            correct_answer: question.correct_answer,
            explanation: question.explanation,
            difficulty: question.difficulty,
          })
          .eq('id', existing.id);

        if (error) {
          console.error(`Error updating question:`, error);
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
            question_type: 'multiple_choice',
            options: question.options,
            correct_answer: question.correct_answer,
            explanation: question.explanation,
            difficulty: question.difficulty,
          });

        if (error) {
          console.error(`Error inserting question:`, error);
          stats.questions.errors++;
        } else {
          stats.questions.created++;
        }
      }
    } catch (err) {
      console.error(`Exception migrating question:`, err);
      stats.questions.errors++;
    }
  }

  log(`✅ Questions: ${stats.questions.created} created, ${stats.questions.errors} errors`);
}

/**
 * Migrate geography data from learn-govt-jobs
 */
async function migrateGeography() {
  const geographyFile = path.join(__dirname, '../apps/learn-govt-jobs/data/geography.json');
  
  if (!fs.existsSync(geographyFile)) {
    log('⚠️  Geography data file not found, skipping...');
    return;
  }

  log('🌍 Migrating geography data...');
  const geographyData = JSON.parse(fs.readFileSync(geographyFile, 'utf-8'));

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
          onConflict: 'name,type,parent_id',
          ignoreDuplicates: false,
        })
        .select('id')
        .single();

      if (countryError) {
        console.error(`Error inserting country ${country.name}:`, countryError);
        stats.geography.errors++;
        continue;
      }

      stats.geography.created++;

      // Insert states
      for (const state of country.children || []) {
        const { data: stateData, error: stateError } = await supabase
          .from('geography')
          .upsert({
            name: state.name,
            type: state.type,
            parent_id: countryData.id,
          }, {
            onConflict: 'name,type,parent_id',
            ignoreDuplicates: false,
          })
          .select('id')
          .single();

        if (stateError) {
          console.error(`Error inserting state ${state.name}:`, stateError);
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
              onConflict: 'name,type,parent_id',
              ignoreDuplicates: false,
            });

          if (districtError) {
            console.error(`Error inserting district ${district.name}:`, districtError);
            stats.geography.errors++;
          } else {
            stats.geography.created++;
          }
        }
      }
    } catch (err) {
      console.error(`Exception migrating geography:`, err);
      stats.geography.errors++;
    }
  }

  log(`✅ Geography: ${stats.geography.created} created, ${stats.geography.errors} errors`);
}

/**
 * Migrate government jobs data
 */
async function migrateGovernmentJobs() {
  const deadlinesFile = path.join(__dirname, '../apps/learn-govt-jobs/data/deadlines.json');
  
  if (!fs.existsSync(deadlinesFile)) {
    log('⚠️  Deadlines data file not found, skipping...');
    return;
  }

  log('💼 Migrating government jobs data...');
  const deadlinesData = JSON.parse(fs.readFileSync(deadlinesFile, 'utf-8'));

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

  for (const [jobId, jobData] of Object.entries(deadlinesData) as any) {
    try {
      // Parse job ID to extract location and type
      const parts = jobId.split('-');
      const level = parts[1] === 'central' ? 'central' : 'state';
      const state = parts[1] !== 'central' ? parts[1] : null;
      const district = parts[2] !== 'all' ? parts[2] : null;
      const jobType = parts[parts.length - 2];

      // Get eligibility template
      const eligibility = eligibilityTemplates[jobType as keyof typeof eligibilityTemplates] || eligibilityTemplates.clerk;

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
        console.error(`Error upserting job ${jobId}:`, error);
        stats.governmentJobs.errors++;
      } else {
        stats.governmentJobs.created++;
      }
    } catch (err) {
      console.error(`Exception migrating job ${jobId}:`, err);
      stats.governmentJobs.errors++;
    }
  }

  log(`✅ Government Jobs: ${stats.governmentJobs.created} created, ${stats.governmentJobs.errors} errors`);
}

/**
 * Main migration function
 */
async function main() {
  console.log('');
  console.log('========================================');
  console.log('  CONTENT MIGRATION TO SUPABASE');
  console.log('========================================');
  console.log('');

  try {
    // Load seed data
    const seedFile = path.join(__dirname, '../seeds/content.json');
    
    if (!fs.existsSync(seedFile)) {
      console.error('❌ Seed data file not found!');
      process.exit(1);
    }

    const seedData = JSON.parse(fs.readFileSync(seedFile, 'utf-8'));

    // Migrate in order (courses -> modules -> lessons -> questions)
    const courseIdMap = await migrateCourses(seedData.courses || []);
    const moduleIdMap = await migrateModules(seedData.modules || [], courseIdMap);
    const lessonIdMap = await migrateLessons(seedData.lessons || [], moduleIdMap);
    await migrateQuestions(seedData.questions || [], lessonIdMap);

    // Migrate geography and government jobs data
    await migrateGeography();
    await migrateGovernmentJobs();

    // Print summary
    console.log('');
    console.log('========================================');
    console.log('  MIGRATION COMPLETE!');
    console.log('========================================');
    console.log('');
    console.log('Summary:');
    console.log(`  Courses:        ${stats.courses.created} created, ${stats.courses.updated} updated, ${stats.courses.errors} errors`);
    console.log(`  Modules:        ${stats.modules.created} created, ${stats.modules.updated} updated, ${stats.modules.errors} errors`);
    console.log(`  Lessons:        ${stats.lessons.created} created, ${stats.lessons.updated} updated, ${stats.lessons.errors} errors`);
    console.log(`  Questions:      ${stats.questions.created} created, ${stats.questions.errors} errors`);
    console.log(`  Geography:      ${stats.geography.created} created, ${stats.geography.errors} errors`);
    console.log(`  Govt Jobs:      ${stats.governmentJobs.created} created, ${stats.governmentJobs.errors} errors`);
    console.log('');

    const totalErrors = Object.values(stats).reduce((sum, s) => sum + s.errors, 0);
    if (totalErrors > 0) {
      console.log(`⚠️  Migration completed with ${totalErrors} errors. Check logs above.`);
      process.exit(1);
    } else {
      console.log('✅ Migration completed successfully!');
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Fatal error during migration:', error);
    process.exit(1);
  }
}

// Run migration
main();
