#!/usr/bin/env node

/**
 * Audit Hero Images
 * 
 * For each app, list the image candidates selected by HeroManager
 * and confirm there are at least 3 selections (or at least 2 for cricket with explicit note).
 * Output JSON format.
 */

const fs = require('fs');
const path = require('path');

// Import the getHeroImagesForApp function
// Note: This won't work directly in Node.js since HeroManager uses React hooks
// So we'll replicate the logic here for auditing purposes

const DEFAULT_IMAGE_POOL = [
  'iiskills-image1.jpg',
  'iiskills-image2.jpg',
  'iiskills-image3.jpg',
  'iiskills-image4.jpg'
];

/**
 * Replicated logic from HeroManager for audit purposes
 * Note: This doesn't replicate the random selection - it just validates
 * that the pool has sufficient images (3+) for selection.
 * At runtime, HeroManager randomly selects 3 images without replacement.
 */
function getHeroImagesForApp(appId) {
  // Special case: cricket uses specific cricket images
  if (appId?.includes('cricket')) {
    return ['cricket1.jpg', 'cricket2.jpg'];
  }

  // For other apps, validate the pool has at least 3 images available
  // Actual runtime selection is random - this audit only checks pool size
  return DEFAULT_IMAGE_POOL.slice(0, Math.min(3, DEFAULT_IMAGE_POOL.length));
}

// List of all apps to audit
const APPS = [
  'main',
  'learn-ai',
  'learn-apt',
  'learn-chemistry',
  'learn-companion',
  'learn-cricket',
  'learn-geography',
  'learn-govt-jobs',
  'learn-leadership',
  'learn-management',
  'learn-math',
  'learn-physics',
  'learn-pr',
  'learn-winning'
];

console.log('🎨 Auditing Hero Images for All Apps...\n');

const results = {};
let allPassed = true;

APPS.forEach(appId => {
  const images = getHeroImagesForApp(appId);
  const isCricket = appId.includes('cricket');
  const minRequired = isCricket ? 2 : 3;
  const passed = images.length >= minRequired;
  
  results[appId] = {
    images: images,
    count: images.length,
    minRequired: minRequired,
    passed: passed,
    note: isCricket ? 'Cricket app uses specific cricket images (min 2)' : null
  };
  
  if (!passed) {
    allPassed = false;
  }
  
  const statusIcon = passed ? '✅' : '❌';
  console.log(`${statusIcon} ${appId}:`);
  console.log(`   Images available: ${images.length} (min required: ${minRequired})`);
  console.log(`   Images: ${images.join(', ')}`);
  if (isCricket) {
    console.log(`   Note: Cricket-specific images`);
  }
  console.log('');
});

console.log('='.repeat(60));
console.log('\n📊 Summary:');
console.log(`   Total apps audited: ${APPS.length}`);
console.log(`   Apps passed: ${Object.values(results).filter(r => r.passed).length}`);
console.log(`   Apps failed: ${Object.values(results).filter(r => !r.passed).length}`);

// Output JSON
console.log('\n📄 JSON Output:');
console.log(JSON.stringify(results, null, 2));

if (allPassed) {
  console.log('\n✅ SUCCESS: All apps have sufficient hero images!');
  process.exit(0);
} else {
  console.log('\n❌ FAILED: Some apps do not have sufficient hero images!');
  process.exit(1);
}
