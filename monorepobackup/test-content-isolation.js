#!/usr/bin/env node

/**
 * Test Content Isolation
 * 
 * This script tests that content from different apps is properly isolated
 * and never mixed together.
 */

import { discoverAllContent, getAppContent } from './lib/contentDiscovery.js';
import { createUnifiedContentProvider } from './lib/unifiedContentProvider.js';

console.log('='.repeat(80));
console.log('CONTENT ISOLATION TEST');
console.log('='.repeat(80));
console.log();

async function testContentDiscovery() {
  console.log('Test 1: Content Discovery with App Tagging');
  console.log('-'.repeat(80));
  
  const allContent = await discoverAllContent();
  
  console.log(`✓ Discovered ${allContent.courses.length} courses from ${allContent._metadata.totalFilesFound} files`);
  console.log(`✓ Total apps scanned: ${allContent._metadata.totalAppsScanned}`);
  console.log();
  
  // Check that all content has appId
  let missingAppId = 0;
  const appsFound = new Set();
  
  allContent.courses.forEach(course => {
    if (!course.appId && !course._discoveredFrom) {
      missingAppId++;
      console.log(`  ❌ Course missing appId: ${course.title || course.id}`);
    } else {
      appsFound.add(course.appId || course._discoveredFrom);
    }
  });
  
  if (missingAppId === 0) {
    console.log('✓ All courses have appId field');
  } else {
    console.log(`❌ ${missingAppId} courses missing appId field`);
  }
  
  console.log(`✓ Found content from ${appsFound.size} apps: ${Array.from(appsFound).join(', ')}`);
  console.log();
  
  return { allContent, appsFound: Array.from(appsFound) };
}

async function testAppIsolation(appsFound) {
  console.log('Test 2: App-Specific Content Isolation');
  console.log('-'.repeat(80));
  
  for (const appId of appsFound) {
    const appContent = await getAppContent(appId);
    const totalItems = appContent.courses.length + appContent.modules.length + 
                       appContent.lessons.length + appContent.profiles.length +
                       appContent.questions.length;
    
    console.log(`\n${appId}:`);
    console.log(`  - Courses: ${appContent.courses.length}`);
    console.log(`  - Modules: ${appContent.modules.length}`);
    console.log(`  - Lessons: ${appContent.lessons.length}`);
    console.log(`  - Total: ${totalItems}`);
    
    // Check no content from other apps leaked in
    let leaked = 0;
    [...appContent.courses, ...appContent.modules, ...appContent.lessons].forEach(item => {
      const itemApp = item.appId || item._discoveredFrom || item.app;
      if (itemApp && itemApp !== appId) {
        leaked++;
        console.log(`  ❌ LEAKED: ${item.title} from ${itemApp} found in ${appId}!`);
      }
    });
    
    if (leaked === 0) {
      console.log(`  ✓ No content leakage detected`);
    } else {
      console.log(`  ❌ ${leaked} items leaked from other apps!`);
    }
  }
  console.log();
}

async function testUnifiedProvider(appsFound) {
  console.log('Test 3: Unified Provider App Filtering');
  console.log('-'.repeat(80));
  
  const provider = await createUnifiedContentProvider();
  
  // Test filtering by app
  for (const appId of appsFound.slice(0, 3)) { // Test first 3 apps
    const courses = await provider.getCourses({ appId });
    
    console.log(`\n${appId}: ${courses.length} courses`);
    
    // Verify all courses belong to this app
    let wrongApp = 0;
    courses.forEach(course => {
      const courseApp = course.appId || course._discoveredFrom || course.app || course.subdomain;
      if (courseApp !== appId) {
        wrongApp++;
        console.log(`  ❌ Wrong app: ${course.title} belongs to ${courseApp}, not ${appId}`);
      }
    });
    
    if (wrongApp === 0) {
      console.log(`  ✓ All courses correctly filtered to ${appId}`);
    } else {
      console.log(`  ❌ ${wrongApp} courses from wrong app!`);
    }
  }
  console.log();
}

async function testGetAllApps() {
  console.log('Test 4: Get All Apps');
  console.log('-'.repeat(80));
  
  const provider = await createUnifiedContentProvider();
  const apps = await provider.getAllApps();
  
  console.log(`✓ Found ${apps.length} apps with content:\n`);
  
  apps.forEach(app => {
    console.log(`  ${app.name} (${app.appId})`);
    console.log(`    - Courses: ${app.coursesCount}`);
    console.log(`    - Modules: ${app.modulesCount}`);
    console.log(`    - Lessons: ${app.lessonsCount}`);
  });
  console.log();
}

async function testStats() {
  console.log('Test 5: Statistics with Per-App Breakdown');
  console.log('-'.repeat(80));
  
  const provider = await createUnifiedContentProvider();
  const stats = await provider.getStats();
  
  console.log(`\nOverall Stats:`);
  console.log(`  - Total Courses: ${stats.totalCourses}`);
  console.log(`  - Total Modules: ${stats.totalModules}`);
  console.log(`  - Total Lessons: ${stats.totalLessons}`);
  console.log(`  - Total Apps: ${stats.totalApps || 0}`);
  
  console.log(`\nBy Source:`);
  console.log(`  - Supabase: ${stats.sources.supabase.courses} courses, ${stats.sources.supabase.modules} modules, ${stats.sources.supabase.lessons} lessons`);
  console.log(`  - Local: ${stats.sources.local.courses} courses, ${stats.sources.local.modules} modules, ${stats.sources.local.lessons} lessons`);
  console.log(`  - Discovered: ${stats.sources.discovered.courses} courses, ${stats.sources.discovered.modules} modules, ${stats.sources.discovered.lessons} lessons`);
  
  if (stats.perApp && Object.keys(stats.perApp).length > 0) {
    console.log(`\nPer-App Breakdown:`);
    Object.entries(stats.perApp).forEach(([appId, counts]) => {
      console.log(`  ${appId}: ${counts.courses} courses, ${counts.modules} modules, ${counts.lessons} lessons`);
    });
  }
  console.log();
}

async function runTests() {
  try {
    const { appsFound } = await testContentDiscovery();
    await testAppIsolation(appsFound);
    await testUnifiedProvider(appsFound);
    await testGetAllApps();
    await testStats();
    
    console.log('='.repeat(80));
    console.log('✅ ALL TESTS COMPLETED');
    console.log('='.repeat(80));
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runTests();
