#!/usr/bin/env node
/**
 * Test script to verify universal content aggregation
 * Tests ContentManager and content discovery without starting the server
 */

const path = require('path');
const { ContentManager } = require('./apps/main/lib/admin/contentManager');
const { getAllApps } = require('./apps/main/lib/admin/contentRegistry');

async function testContentAggregation() {
  console.log('🔍 Testing Universal Content Aggregation\n');
  console.log('=' .repeat(60));
  
  const contentManager = new ContentManager(true); // dev mode
  const allApps = getAllApps();
  
  console.log(`\n📦 Total Apps Registered: ${allApps.length}\n`);
  
  let totalContent = 0;
  const results = [];
  
  for (const app of allApps) {
    console.log(`\n🔎 Scanning: ${app.displayName} (${app.id})`);
    console.log(`   Type: ${app.contentType}`);
    console.log(`   Path: ${app.dataPath}`);
    
    try {
      const content = await contentManager.getAllContent(app.id);
      console.log(`   ✅ Found ${content.length} items`);
      
      if (content.length > 0) {
        // Show sample item
        const sample = content[0];
        console.log(`   📄 Sample: "${sample.title}"`);
        console.log(`      - ID: ${sample.id}`);
        console.log(`      - Source App: ${sample.sourceApp || sample.appId}`);
        console.log(`      - Source Backend: ${sample.sourceBackend || sample.source}`);
      }
      
      totalContent += content.length;
      results.push({
        app: app.displayName,
        icon: app.icon,
        count: content.length,
        status: 'success',
      });
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      results.push({
        app: app.displayName,
        icon: app.icon,
        count: 0,
        status: 'error',
        error: error.message,
      });
    }
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('\n📊 Summary:\n');
  console.table(results);
  console.log(`\n✨ Total Content Items: ${totalContent}`);
  console.log(`✅ Apps with Content: ${results.filter(r => r.count > 0).length}`);
  console.log(`❌ Apps with Errors: ${results.filter(r => r.status === 'error').length}`);
  
  // Test search functionality
  console.log('\n' + '=' .repeat(60));
  console.log('\n🔍 Testing Search Functionality\n');
  
  try {
    const searchResults = await contentManager.searchAllContent('test');
    console.log(`✅ Search for "test" found ${searchResults.length} items`);
    
    if (searchResults.length > 0) {
      console.log('\nTop 3 results:');
      searchResults.slice(0, 3).forEach((item, idx) => {
        console.log(`${idx + 1}. ${item.title} (${item.sourceApp || item.appId})`);
      });
    }
  } catch (error) {
    console.log(`❌ Search error: ${error.message}`);
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('\n✅ Content Aggregation Test Complete!\n');
}

// Run the test
testContentAggregation().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
