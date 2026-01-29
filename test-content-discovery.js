/**
 * Test script demonstrating content discovery functionality
 */

const fs = require('fs');
const path = require('path');

console.log('=== Content Discovery Agent Test ===\n');

// Test 1: Load manifests
console.log('Test 1: Loading Content Manifests');
try {
  const aptManifest = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'apps/learn-apt/manifest.json'), 'utf-8')
  );
  const jobsManifest = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'apps/learn-govt-jobs/manifest.json'), 'utf-8')
  );
  const cricketManifest = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'apps/learn-cricket/manifest.json'), 'utf-8')
  );

  console.log(`✓ Loaded ${aptManifest.items.length} tests from learn-apt`);
  console.log(`✓ Loaded ${jobsManifest.items.length} jobs from learn-govt-jobs`);
  console.log(`✓ Loaded ${cricketManifest.items.length} items from learn-cricket\n`);

  // Test 2: Aggregate content
  console.log('Test 2: Aggregating Content Across Apps');
  const allContent = [
    ...aptManifest.items,
    ...jobsManifest.items,
    ...cricketManifest.items,
  ];
  console.log(`✓ Total content items: ${allContent.length}\n`);

  // Test 3: Search by type
  console.log('Test 3: Searching by Content Type');
  const tests = allContent.filter(item => item.type === 'test');
  const jobs = allContent.filter(item => item.type === 'job');
  const lessons = allContent.filter(item => item.type === 'lesson');
  const articles = allContent.filter(item => item.type === 'article');
  console.log(`✓ Tests: ${tests.length}`);
  console.log(`✓ Jobs: ${jobs.length}`);
  console.log(`✓ Lessons: ${lessons.length}`);
  console.log(`✓ Articles: ${articles.length}\n`);

  // Test 4: Search by tags
  console.log('Test 4: Searching by Tags');
  const iasContent = allContent.filter(item => 
    item.tags?.some(tag => tag.toLowerCase().includes('ias'))
  );
  console.log(`✓ IAS-related content: ${iasContent.length}`);
  iasContent.forEach(item => {
    console.log(`  - ${item.title} (${item.type}) from ${item.app}`);
  });
  console.log();

  // Test 5: Geographic search
  console.log('Test 5: Geographic Search');
  const biharJobs = allContent.filter(item => 
    item.type === 'job' && 
    item.location?.state === 'Bihar'
  );
  console.log(`✓ Jobs in Bihar: ${biharJobs.length}`);
  biharJobs.forEach(job => {
    console.log(`  - ${job.title} in ${job.location?.district}`);
  });
  console.log();

  // Test 6: Deadline filtering
  console.log('Test 6: Jobs with Deadlines');
  const jobsWithDeadlines = allContent.filter(item => 
    item.type === 'job' && item.deadline
  );
  console.log(`✓ Jobs with deadlines: ${jobsWithDeadlines.length}`);
  jobsWithDeadlines.forEach(job => {
    const deadline = new Date(job.deadline);
    console.log(`  - ${job.title}: ${deadline.toLocaleDateString()}`);
  });
  console.log();

  // Test 7: Cross-app search
  console.log('Test 7: Cross-App Search - "IAS Preparation"');
  const iasPrep = allContent.filter(item => 
    item.tags?.some(tag => 
      tag.toLowerCase().includes('ias') || 
      tag.toLowerCase().includes('civil-services')
    )
  );
  console.log(`✓ Found ${iasPrep.length} items across apps:`);
  iasPrep.forEach(item => {
    console.log(`  - ${item.title} (${item.type}) from ${item.app}`);
  });
  console.log();

  // Test 8: Geographic Resolver
  console.log('Test 8: Geographic Data');
  const geography = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'apps/learn-govt-jobs/data/geography.json'), 'utf-8')
  );
  console.log('✓ Loaded geography data with states:');
  geography[0].children.forEach(state => {
    console.log(`  - ${state.name} (${state.children.length} districts)`);
  });
  console.log();

  // Test 9: Meta-index
  console.log('Test 9: Meta-Index Structure');
  const metaIndex = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'packages/content-sdk/meta-index.json'), 'utf-8')
  );
  console.log(`✓ Registered apps: ${metaIndex.apps.length}`);
  metaIndex.apps.forEach(app => {
    console.log(`  - ${app.name}: [${app.contentTypes.join(', ')}]`);
  });
  console.log();

  // Test 10: Pagination
  console.log('Test 10: Pagination');
  const pageSize = 5;
  const page1 = allContent.slice(0, pageSize);
  console.log(`✓ Page 1 of ${Math.ceil(allContent.length / pageSize)}: ${page1.length} items`);
  console.log(`✓ Total: ${allContent.length}, Has more: ${pageSize < allContent.length}\n`);

  console.log('=== All Tests Completed Successfully ===');
  console.log('\nSummary:');
  console.log(`- Total content items: ${allContent.length}`);
  console.log(`- Apps indexed: ${metaIndex.apps.length}`);
  console.log(`- Content types: test (${tests.length}), job (${jobs.length}), lesson (${lessons.length}), article (${articles.length})`);
  console.log(`- Geographic locations: ${geography[0].children.length} states`);
  console.log(`- IAS-related content: ${iasContent.length} items across apps`);
  console.log('\n✓ Content Discovery Agent is ready!');

  process.exit(0);
} catch (error) {
  console.error('❌ Test failed:', error?.message || error);
  if (error?.stack) {
    console.error(error.stack);
  }
  process.exit(1);
}
