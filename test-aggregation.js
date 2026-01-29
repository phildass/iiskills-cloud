/**
 * Test Content Aggregation
 * 
 * This script tests the ContentManager to verify it aggregates content
 * from all sources (filesystem and Supabase)
 */

const { ContentManager } = require('./apps/main/lib/admin/contentManager');

async function testContentAggregation() {
  console.log('🧪 Testing Content Aggregation\n');
  
  const contentManager = new ContentManager();
  
  // Test 1: Get all courses
  console.log('📚 Test 1: Fetching all courses...');
  try {
    const courses = await contentManager.getAllCourses();
    console.log(`✅ Found ${courses.length} courses`);
    
    // Show breakdown by source
    const bySource = {};
    courses.forEach(course => {
      const source = course.sourceBackend || 'unknown';
      bySource[source] = (bySource[source] || 0) + 1;
    });
    
    console.log('   Source breakdown:');
    Object.entries(bySource).forEach(([source, count]) => {
      console.log(`   - ${source}: ${count} courses`);
    });
    
    // Show breakdown by app
    const byApp = {};
    courses.forEach(course => {
      const app = course.sourceApp || 'unknown';
      byApp[app] = (byApp[app] || 0) + 1;
    });
    
    console.log('   App breakdown:');
    Object.entries(byApp).forEach(([app, count]) => {
      console.log(`   - ${app}: ${count} courses`);
    });
    
    // Show sample courses
    console.log('\n   Sample courses:');
    courses.slice(0, 5).forEach(course => {
      console.log(`   - ${course.title} (${course.sourceApp} / ${course.sourceBackend})`);
    });
  } catch (error) {
    console.error('❌ Error fetching courses:', error.message);
  }
  
  // Test 2: Get all modules
  console.log('\n📋 Test 2: Fetching all modules...');
  try {
    const modules = await contentManager.getAllModules();
    console.log(`✅ Found ${modules.length} modules`);
    
    const bySource = {};
    modules.forEach(mod => {
      const source = mod.sourceBackend || 'unknown';
      bySource[source] = (bySource[source] || 0) + 1;
    });
    
    console.log('   Source breakdown:');
    Object.entries(bySource).forEach(([source, count]) => {
      console.log(`   - ${source}: ${count} modules`);
    });
    
    // Show sample modules
    console.log('\n   Sample modules:');
    modules.slice(0, 5).forEach(mod => {
      console.log(`   - ${mod.title} (${mod.sourceApp} / ${mod.sourceBackend})`);
    });
  } catch (error) {
    console.error('❌ Error fetching modules:', error.message);
  }
  
  // Test 3: Get all lessons
  console.log('\n📖 Test 3: Fetching all lessons...');
  try {
    const lessons = await contentManager.getAllLessons();
    console.log(`✅ Found ${lessons.length} lessons`);
    
    const bySource = {};
    lessons.forEach(lesson => {
      const source = lesson.sourceBackend || 'unknown';
      bySource[source] = (bySource[source] || 0) + 1;
    });
    
    console.log('   Source breakdown:');
    Object.entries(bySource).forEach(([source, count]) => {
      console.log(`   - ${source}: ${count} lessons`);
    });
    
    // Show sample lessons
    console.log('\n   Sample lessons:');
    lessons.slice(0, 5).forEach(lesson => {
      console.log(`   - ${lesson.title} (${lesson.sourceApp} / ${lesson.sourceBackend})`);
    });
  } catch (error) {
    console.error('❌ Error fetching lessons:', error.message);
  }
  
  // Test 4: Get content from specific app
  console.log('\n🏏 Test 4: Fetching content from learn-cricket...');
  try {
    const cricketContent = await contentManager.getAllContent('learn-cricket');
    console.log(`✅ Found ${cricketContent.length} items in learn-cricket`);
    
    cricketContent.forEach(item => {
      console.log(`   - ${item.title} (${item.type} / ${item.sourceBackend})`);
    });
  } catch (error) {
    console.error('❌ Error fetching cricket content:', error.message);
  }
  
  // Test 5: Search all content
  console.log('\n🔍 Test 5: Searching for "physics"...');
  try {
    const results = await contentManager.searchAllContent('physics');
    console.log(`✅ Found ${results.length} results for "physics"`);
    
    results.slice(0, 5).forEach(item => {
      console.log(`   - ${item.title} (${item.sourceApp})`);
    });
  } catch (error) {
    console.error('❌ Error searching content:', error.message);
  }
  
  console.log('\n✨ Testing complete!');
}

testContentAggregation().catch(console.error);
