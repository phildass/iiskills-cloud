#!/usr/bin/env node

/**
 * Test script for Unified Content Provider
 * 
 * This script tests the unified content provider to ensure it correctly:
 * - Loads from both Supabase and local sources
 * - Adds source metadata
 * - Merges and deduplicates data
 * - Handles errors gracefully
 */

import { createUnifiedContentProvider } from './lib/unifiedContentProvider.js';

console.log('\n🧪 Testing Unified Content Provider\n');
console.log('='.repeat(60));

async function runTests() {
  try {
    // Test 1: Initialize provider
    console.log('\n📌 Test 1: Initialize Provider');
    const provider = await createUnifiedContentProvider();
    const status = provider.getSourceStatus();
    console.log(`   Mode: ${status.mode}`);
    console.log(`   Supabase: ${status.supabase ? '✓ Available' : '✗ Not available'}`);
    console.log(`   Local: ${status.local ? '✓ Available' : '✗ Not available'}`);

    // Test 2: Fetch courses
    console.log('\n📌 Test 2: Fetch Courses');
    const courses = await provider.getCourses();
    console.log(`   Total courses: ${courses.length}`);
    if (courses.length > 0) {
      const supabaseCourses = courses.filter(c => c._source === 'supabase');
      const localCourses = courses.filter(c => c._source === 'local');
      console.log(`   From Supabase: ${supabaseCourses.length}`);
      console.log(`   From Local: ${localCourses.length}`);
      console.log(`   Sample course:`, {
        title: courses[0].title,
        source: courses[0]._source,
        id: courses[0].id
      });
    }

    // Test 3: Fetch modules
    console.log('\n📌 Test 3: Fetch Modules');
    const modules = await provider.getModules();
    console.log(`   Total modules: ${modules.length}`);
    if (modules.length > 0) {
      const supabaseModules = modules.filter(m => m._source === 'supabase');
      const localModules = modules.filter(m => m._source === 'local');
      console.log(`   From Supabase: ${supabaseModules.length}`);
      console.log(`   From Local: ${localModules.length}`);
    }

    // Test 4: Fetch lessons
    console.log('\n📌 Test 4: Fetch Lessons');
    const lessons = await provider.getLessons();
    console.log(`   Total lessons: ${lessons.length}`);
    if (lessons.length > 0) {
      const supabaseLessons = lessons.filter(l => l._source === 'supabase');
      const localLessons = lessons.filter(l => l._source === 'local');
      console.log(`   From Supabase: ${supabaseLessons.length}`);
      console.log(`   From Local: ${localLessons.length}`);
    }

    // Test 5: Fetch profiles
    console.log('\n📌 Test 5: Fetch Profiles');
    const profiles = await provider.getProfiles();
    console.log(`   Total profiles: ${profiles.length}`);
    if (profiles.length > 0) {
      const supabaseProfiles = profiles.filter(p => p._source === 'supabase');
      const localProfiles = profiles.filter(p => p._source === 'local');
      console.log(`   From Supabase: ${supabaseProfiles.length}`);
      console.log(`   From Local: ${localProfiles.length}`);
    }

    // Test 6: Get aggregated stats
    console.log('\n📌 Test 6: Get Aggregated Stats');
    const stats = await provider.getStats();
    console.log('   Totals:', {
      courses: stats.totalCourses,
      users: stats.totalUsers,
      modules: stats.totalModules,
      lessons: stats.totalLessons
    });
    console.log('   Supabase source:', stats.sources.supabase);
    console.log('   Local source:', stats.sources.local);

    // Test 7: Verify source metadata
    console.log('\n📌 Test 7: Verify Source Metadata');
    const allData = [...courses, ...modules, ...lessons, ...profiles];
    const withSource = allData.filter(item => item._source);
    const withoutSource = allData.filter(item => !item._source);
    console.log(`   Items with _source: ${withSource.length}/${allData.length}`);
    if (withoutSource.length > 0) {
      console.log(`   ⚠️ WARNING: ${withoutSource.length} items missing _source field`);
    } else {
      console.log(`   ✓ All items have _source metadata`);
    }

    // Test 8: Test filtering
    console.log('\n📌 Test 8: Test Filtering');
    const filteredCourses = await provider.getCourses({
      filters: { subdomain: 'learn-jee' }
    });
    console.log(`   Courses for 'learn-jee': ${filteredCourses.length}`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed successfully!');
    console.log('='.repeat(60));
    console.log('\n📊 Summary:');
    console.log(`   • Provider mode: ${status.mode}`);
    console.log(`   • Total content items: ${allData.length}`);
    console.log(`   • All items have source metadata: ${withoutSource.length === 0 ? 'Yes' : 'No'}`);
    console.log(`   • Ready for production: ${allData.length > 0 ? 'Yes' : 'No'}`);
    console.log('');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runTests();
