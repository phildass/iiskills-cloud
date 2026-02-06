#!/usr/bin/env node

/**
 * Content Integration Verification Script
 * 
 * Verifies that the unified content structure is properly integrated
 * across all learning apps without requiring a full build.
 */

console.log('🔍 Verifying Unified Content Integration...\n');

let errors = 0;
let warnings = 0;

// Test 1: Check content files exist
console.log('Test 1: Checking content files...');
const fs = require('fs');
const path = require('path');

const contentFiles = [
  'data/unified-content-structure.js',
  'data/physics-content.js',
  'data/math-content.js',
  'data/chemistry-content.js',
  'data/geography-content.js'
];

contentFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - NOT FOUND`);
    errors++;
  }
});

// Test 2: Check shared components
console.log('\nTest 2: Checking shared components...');
const componentFiles = [
  'components/shared/StandardizedLesson.js',
  'components/shared/CurriculumTable.js'
];

componentFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - NOT FOUND`);
    errors++;
  }
});

// Test 3: Check curriculum generators are updated
console.log('\nTest 3: Checking curriculum generators...');
const apps = ['physics', 'math', 'chemistry', 'geography'];

apps.forEach(app => {
  const generatorPath = path.join(__dirname, `apps/learn-${app}/lib/curriculumGenerator.js`);
  if (fs.existsSync(generatorPath)) {
    const content = fs.readFileSync(generatorPath, 'utf8');
    if (content.includes(`from '../../../data/${app}-content'`)) {
      console.log(`  ✅ learn-${app} imports from data/${app}-content.js`);
    } else {
      console.log(`  ⚠️  learn-${app} may not be using unified content`);
      warnings++;
    }
  } else {
    console.log(`  ❌ learn-${app}/lib/curriculumGenerator.js - NOT FOUND`);
    errors++;
  }
});

// Test 4: Check documentation
console.log('\nTest 4: Checking documentation...');
const docFiles = [
  'UNIFIED_CONTENT_FORMAT.md',
  'CONTENT_CONTRIBUTION_GUIDE.md',
  'data/README.md'
];

docFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - NOT FOUND`);
    errors++;
  }
});

// Test 5: Verify content structure
console.log('\nTest 5: Verifying content structure...');

try {
  // We can't actually import ESM modules in this context, but we can check syntax
  const subjects = ['physics', 'math', 'chemistry', 'geography'];
  
  subjects.forEach(subject => {
    const contentPath = path.join(__dirname, `data/${subject}-content.js`);
    const content = fs.readFileSync(contentPath, 'utf8');
    
    // Check for required exports (with subject prefix)
    const hasBasic = content.includes(`${subject}BasicModules`);
    const hasIntermediate = content.includes(`${subject}IntermediateModules`);
    const hasAdvanced = content.includes(`${subject}AdvancedModules`);
    
    if (hasBasic && hasIntermediate && hasAdvanced) {
      console.log(`  ✅ ${subject}-content.js has all three levels`);
    } else {
      console.log(`  ⚠️  ${subject}-content.js may be missing level exports`);
      warnings++;
    }
    
    // Check for lesson structure
    if (content.includes('hook:') && content.includes('coreConcept:') && 
        content.includes('interactive:') && content.includes('test:')) {
      console.log(`  ✅ ${subject}-content.js uses standardized lesson format`);
    } else {
      console.log(`  ⚠️  ${subject}-content.js may not follow complete lesson format`);
      warnings++;
    }
  });
} catch (e) {
  console.log(`  ❌ Error reading content files: ${e.message}`);
  errors++;
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('VERIFICATION SUMMARY');
console.log('='.repeat(60));

if (errors === 0 && warnings === 0) {
  console.log('✅ All checks passed! The unified content format is properly integrated.');
  console.log('\nNext steps:');
  console.log('  1. Run yarn install to update dependencies');
  console.log('  2. Build individual apps to test');
  console.log('  3. Add more complete lessons to template modules');
  console.log('  4. Update remaining curriculum pages');
  process.exit(0);
} else {
  if (errors > 0) {
    console.log(`❌ ${errors} error(s) found`);
  }
  if (warnings > 0) {
    console.log(`⚠️  ${warnings} warning(s) found`);
  }
  console.log('\nPlease address the issues above before proceeding.');
  process.exit(errors > 0 ? 1 : 0);
}
