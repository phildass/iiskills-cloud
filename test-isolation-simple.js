/**
 * Simple Content Isolation Test
 */

import { discoverAllContent, getAppContent } from './lib/contentDiscovery.js';

console.log('='.repeat(80));
console.log('CONTENT ISOLATION TEST');
console.log('='.repeat(80));
console.log();

async function runTests() {
  try {
    console.log('Test 1: Discovering all content...');
    const allContent = await discoverAllContent();
    
    console.log(`✓ Discovered ${allContent.courses.length} courses`);
    console.log(`✓ Found ${allContent._metadata.totalFilesFound} files in ${allContent._metadata.totalAppsScanned} apps`);
    console.log();
    
    // Check appId tagging
    console.log('Test 2: Checking appId tagging...');
    let withAppId = 0;
    let withoutAppId = 0;
    const apps = new Set();
    
    allContent.courses.forEach(course => {
      if (course.appId) {
        withAppId++;
        apps.add(course.appId);
      } else if (course._discoveredFrom) {
        withAppId++;
        apps.add(course._discoveredFrom);
      } else {
        withoutAppId++;
        console.log(`  ❌ Missing appId: ${course.title || course.id}`);
      }
    });
    
    console.log(`✓ ${withAppId} courses have appId`);
    if (withoutAppId > 0) {
      console.log(`❌ ${withoutAppId} courses missing appId`);
    }
    console.log(`✓ Found ${apps.size} apps: ${Array.from(apps).join(', ')}`);
    console.log();
    
    // Test app isolation
    console.log('Test 3: Testing app isolation...');
    const appsArray = Array.from(apps);
    for (const appId of appsArray.slice(0, 3)) {
      const appContent = await getAppContent(appId);
      const total = appContent.courses.length + appContent.modules.length + appContent.lessons.length;
      
      console.log(`\n${appId}: ${total} total items`);
      console.log(`  - Courses: ${appContent.courses.length}`);
      console.log(`  - Modules: ${appContent.modules.length}`);
      console.log(`  - Lessons: ${appContent.lessons.length}`);
      
      // Check for leaks
      let leaked = 0;
      [...appContent.courses, ...appContent.modules, ...appContent.lessons].forEach(item => {
        const itemApp = item.appId || item._discoveredFrom;
        if (itemApp && itemApp !== appId) {
          leaked++;
          console.log(`  ❌ LEAK: ${item.title} from ${itemApp}`);
        }
      });
      
      if (leaked === 0) {
        console.log(`  ✓ No leaks detected`);
      }
    }
    
    console.log();
    console.log('='.repeat(80));
    console.log('✅ TESTS COMPLETED SUCCESSFULLY');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

runTests();
