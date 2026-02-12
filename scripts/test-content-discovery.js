#!/usr/bin/env node
/**
 * Test script to verify content discovery by the admin panel
 */

const path = require('path');
const { ContentManager } = require('../apps/main/lib/admin/contentManager');

async function test() {
  console.log('🔍 Testing content discovery...\n');
  
  // Change to the main app directory so paths resolve correctly
  process.chdir(path.join(__dirname, '..', 'apps', 'main'));
  
  const manager = new ContentManager(true);
  
  try {
    // Test getting all content from all apps
    console.log('📊 Loading all content from all apps...');
    const allContent = await manager.getAllContentFromAllApps();
    console.log(`   Total items: ${allContent.length}\n`);
    
    // Group by app
    const byApp = {};
    allContent.forEach(item => {
      const app = item.sourceApp || item.appId || 'unknown';
      if (!byApp[app]) {
        byApp[app] = { courses: 0, modules: 0, lessons: 0, other: 0 };
      }
      const type = (item.type || '').toLowerCase();
      if (type === 'course') {
        byApp[app].courses++;
      } else if (type === 'module') {
        byApp[app].modules++;
      } else if (type === 'lesson') {
        byApp[app].lessons++;
      } else {
        byApp[app].other++;
      }
    });
    
    // Display results
    console.log('📋 Content by App:');
    Object.keys(byApp).sort().forEach(app => {
      const stats = byApp[app];
      console.log(`\n   ${app}:`);
      console.log(`      Courses: ${stats.courses}`);
      console.log(`      Modules: ${stats.modules}`);
      console.log(`      Lessons: ${stats.lessons}`);
      if (stats.other > 0) {
        console.log(`      Other: ${stats.other}`);
      }
    });
    
    // Test specific methods
    console.log('\n\n🎯 Testing specific content types...');
    
    const courses = await manager.getAllCourses();
    console.log(`   Courses: ${courses.length}`);
    
    const modules = await manager.getAllModules();
    console.log(`   Modules: ${modules.length}`);
    
    const lessons = await manager.getAllLessons();
    console.log(`   Lessons: ${lessons.length}`);
    
    console.log('\n✅ Content discovery test complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

test();
