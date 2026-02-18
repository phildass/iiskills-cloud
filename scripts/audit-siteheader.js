#!/usr/bin/env node

/**
 * Audit SiteHeader Usage
 * 
 * For each app check pages/_app.js or pages/index.js contains
 * import of SiteHeader or <SiteHeader /> usage.
 * Print summary.
 */

const fs = require('fs');
const path = require('path');

// List of all apps to audit
const APPS = [
  'main',
  'learn-ai',
  'learn-apt',
  'learn-chemistry',
  'learn-companion',
  'learn-cricket',
  'learn-geography',
  // MOVED TO apps-backup as per cleanup requirements
  // 'learn-govt-jobs',
  'learn-leadership',
  'learn-management',
  'learn-math',
  'learn-physics',
  'learn-pr',
  'learn-winning'
];

console.log('🔍 Auditing SiteHeader Usage Across All Apps...\n');

const results = {};
let allPassed = true;

APPS.forEach(appId => {
  const appDir = path.join(__dirname, '..', 'apps', appId);
  const appJsPath = path.join(appDir, 'pages', '_app.js');
  const indexJsPath = path.join(appDir, 'pages', 'index.js');
  
  let hasImport = false;
  let hasUsage = false;
  let foundIn = null;
  
  // Check _app.js first
  if (fs.existsSync(appJsPath)) {
    const content = fs.readFileSync(appJsPath, 'utf8');
    hasImport = /import\s+.*SiteHeader.*from/.test(content);
    hasUsage = /<SiteHeader\s*\/?>/.test(content);
    
    if (hasImport || hasUsage) {
      foundIn = '_app.js';
    }
  }
  
  // If not found in _app.js, check index.js
  if (!foundIn && fs.existsSync(indexJsPath)) {
    const content = fs.readFileSync(indexJsPath, 'utf8');
    const indexHasImport = /import\s+.*SiteHeader.*from/.test(content);
    const indexHasUsage = /<SiteHeader\s*\/?>/.test(content);
    
    if (indexHasImport || indexHasUsage) {
      hasImport = indexHasImport;
      hasUsage = indexHasUsage;
      foundIn = 'index.js';
    }
  }
  
  const passed = hasImport && hasUsage;
  
  results[appId] = {
    hasImport: hasImport,
    hasUsage: hasUsage,
    foundIn: foundIn,
    passed: passed
  };
  
  if (!passed) {
    allPassed = false;
  }
  
  const statusIcon = passed ? '✅' : '❌';
  console.log(`${statusIcon} ${appId}:`);
  
  if (foundIn) {
    console.log(`   Found in: ${foundIn}`);
    console.log(`   Import: ${hasImport ? 'Yes' : 'No'}`);
    console.log(`   Usage: ${hasUsage ? 'Yes' : 'No'}`);
  } else {
    console.log(`   SiteHeader not found in _app.js or index.js`);
  }
  console.log('');
});

console.log('='.repeat(60));
console.log('\n📊 Summary:');
console.log(`   Total apps audited: ${APPS.length}`);
console.log(`   Apps with SiteHeader: ${Object.values(results).filter(r => r.passed).length}`);
console.log(`   Apps missing SiteHeader: ${Object.values(results).filter(r => !r.passed).length}`);

// List apps missing SiteHeader
const missingApps = Object.entries(results)
  .filter(([_, r]) => !r.passed)
  .map(([app, _]) => app);

if (missingApps.length > 0) {
  console.log(`\n❌ Apps missing SiteHeader:`);
  missingApps.forEach(app => console.log(`   - ${app}`));
}

// Output JSON
console.log('\n📄 Detailed Results (JSON):');
console.log(JSON.stringify(results, null, 2));

if (allPassed) {
  console.log('\n✅ SUCCESS: All apps have SiteHeader properly implemented!');
  process.exit(0);
} else {
  console.log('\n❌ FAILED: Some apps are missing SiteHeader!');
  process.exit(1);
}
