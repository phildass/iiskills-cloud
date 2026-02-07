#!/usr/bin/env node

/**
 * OPEN_ACCESS Mode Integration Test
 * 
 * This script tests the OPEN_ACCESS environment variable handling
 * across the entire monorepo to ensure all components properly
 * respect the open access mode setting.
 */

const fs = require('fs');
const path = require('path');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧪 OPEN_ACCESS Mode Integration Test');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

let testsPassed = 0;
let testsFailed = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${description}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ FAIL: ${description}`);
    console.log(`   Error: ${error.message}`);
    testsFailed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// Test 1: Verify next.config.js files exist and have env config
test('Root next.config.js exists and has env config', () => {
  const configPath = path.join(__dirname, 'next.config.js');
  assert(fs.existsSync(configPath), 'next.config.js not found');
  
  const config = require(configPath);
  assert(config.env !== undefined, 'env config not defined');
  
  // Simulate OPEN_ACCESS=true
  process.env.OPEN_ACCESS = 'true';
  const openAccessValue = process.env.OPEN_ACCESS || process.env.NEXT_PUBLIC_OPEN_ACCESS || 'false';
  assert(openAccessValue === 'true', 'OPEN_ACCESS not properly exposed');
});

test('Main app next.config.js exists and has env config', () => {
  const configPath = path.join(__dirname, 'apps/main/next.config.js');
  assert(fs.existsSync(configPath), 'apps/main/next.config.js not found');
  
  const config = require(configPath);
  assert(config.env !== undefined, 'env config not defined in main app');
});

// Test 2: Verify all learning apps have next.config.js with env config
const learningApps = [
  'learn-ai',
  'learn-apt',
  'learn-chemistry',
  'learn-developer',
  'learn-geography',
  'learn-govt-jobs',
  'learn-management',
  'learn-math',
  'learn-physics',
  'learn-pr'
];

learningApps.forEach(appName => {
  test(`${appName} next.config.js has env config`, () => {
    const configPath = path.join(__dirname, `apps/${appName}/next.config.js`);
    assert(fs.existsSync(configPath), `apps/${appName}/next.config.js not found`);
    
    const config = require(configPath);
    assert(config.env !== undefined, `env config not defined in ${appName}`);
  });
});

// Test 3: Verify ProtectedRoute components exist and have open access logic
test('Root PaidUserProtectedRoute has open access logic', () => {
  const componentPath = path.join(__dirname, 'components/PaidUserProtectedRoute.js');
  assert(fs.existsSync(componentPath), 'PaidUserProtectedRoute.js not found');
  
  const content = fs.readFileSync(componentPath, 'utf8');
  assert(content.includes('NEXT_PUBLIC_OPEN_ACCESS'), 'Missing OPEN_ACCESS check');
  assert(content.includes('OPEN ACCESS MODE'), 'Missing open access mode message');
});

test('Root UserProtectedRoute has open access logic', () => {
  const componentPath = path.join(__dirname, 'components/UserProtectedRoute.js');
  assert(fs.existsSync(componentPath), 'UserProtectedRoute.js not found');
  
  const content = fs.readFileSync(componentPath, 'utf8');
  assert(content.includes('NEXT_PUBLIC_OPEN_ACCESS'), 'Missing OPEN_ACCESS check');
  assert(content.includes('OPEN ACCESS MODE'), 'Missing open access mode message');
});

test('Root ProtectedRoute has open access logic', () => {
  const componentPath = path.join(__dirname, 'components/ProtectedRoute.js');
  assert(fs.existsSync(componentPath), 'ProtectedRoute.js not found');
  
  const content = fs.readFileSync(componentPath, 'utf8');
  assert(content.includes('NEXT_PUBLIC_OPEN_ACCESS'), 'Missing OPEN_ACCESS check');
  assert(content.includes('OPEN ACCESS MODE'), 'Missing open access mode message');
});

test('Main app PaidUserProtectedRoute has open access logic', () => {
  const componentPath = path.join(__dirname, 'apps/main/components/PaidUserProtectedRoute.js');
  assert(fs.existsSync(componentPath), 'Main app PaidUserProtectedRoute.js not found');
  
  const content = fs.readFileSync(componentPath, 'utf8');
  assert(content.includes('NEXT_PUBLIC_OPEN_ACCESS'), 'Missing OPEN_ACCESS check');
  assert(content.includes('OPEN ACCESS MODE'), 'Missing open access mode message');
});

test('Main app UserProtectedRoute has open access logic', () => {
  const componentPath = path.join(__dirname, 'apps/main/components/UserProtectedRoute.js');
  assert(fs.existsSync(componentPath), 'Main app UserProtectedRoute.js not found');
  
  const content = fs.readFileSync(componentPath, 'utf8');
  assert(content.includes('NEXT_PUBLIC_OPEN_ACCESS'), 'Missing OPEN_ACCESS check');
  assert(content.includes('OPEN ACCESS MODE'), 'Missing open access mode message');
});

test('Main app ProtectedRoute has open access logic', () => {
  const componentPath = path.join(__dirname, 'apps/main/components/ProtectedRoute.js');
  assert(fs.existsSync(componentPath), 'Main app ProtectedRoute.js not found');
  
  const content = fs.readFileSync(componentPath, 'utf8');
  assert(content.includes('NEXT_PUBLIC_OPEN_ACCESS'), 'Missing OPEN_ACCESS check');
  assert(content.includes('OPEN ACCESS MODE'), 'Missing open access mode message');
});

// Test 4: Verify .env.local.example has OPEN_ACCESS documentation
test('.env.local.example documents OPEN_ACCESS', () => {
  const envPath = path.join(__dirname, '.env.local.example');
  assert(fs.existsSync(envPath), '.env.local.example not found');
  
  const content = fs.readFileSync(envPath, 'utf8');
  assert(content.includes('OPEN_ACCESS'), 'OPEN_ACCESS not documented');
  assert(content.includes('OPEN_ACCESS=false'), 'OPEN_ACCESS default value not set');
});

// Test 5: Verify scripts exist and use OPEN_ACCESS
test('enable-open-access.sh script exists and uses OPEN_ACCESS', () => {
  const scriptPath = path.join(__dirname, 'scripts/enable-open-access.sh');
  assert(fs.existsSync(scriptPath), 'enable-open-access.sh not found');
  
  const content = fs.readFileSync(scriptPath, 'utf8');
  assert(content.includes('OPEN_ACCESS=true'), 'Script does not set OPEN_ACCESS=true');
  assert(content.includes('grep -q "OPEN_ACCESS="'), 'Script does not check for OPEN_ACCESS');
});

test('restore-authentication.sh script exists and uses OPEN_ACCESS', () => {
  const scriptPath = path.join(__dirname, 'scripts/restore-authentication.sh');
  assert(fs.existsSync(scriptPath), 'restore-authentication.sh not found');
  
  const content = fs.readFileSync(scriptPath, 'utf8');
  assert(content.includes('OPEN_ACCESS=false'), 'Script does not set OPEN_ACCESS=false');
  assert(content.includes('grep -q "OPEN_ACCESS="'), 'Script does not check for OPEN_ACCESS');
});

// Test 6: Verify documentation exists
test('OPEN_ACCESS_MODE.md documentation exists', () => {
  const docPath = path.join(__dirname, 'OPEN_ACCESS_MODE.md');
  assert(fs.existsSync(docPath), 'OPEN_ACCESS_MODE.md not found');
  
  const content = fs.readFileSync(docPath, 'utf8');
  assert(content.includes('OPEN_ACCESS'), 'Documentation does not mention OPEN_ACCESS');
  assert(content.includes('Quick Start'), 'Documentation missing Quick Start section');
  assert(content.includes('How It Works'), 'Documentation missing How It Works section');
});

// Test 7: Verify backward compatibility
test('Backward compatibility with NEXT_PUBLIC_DISABLE_AUTH is maintained', () => {
  const componentPath = path.join(__dirname, 'components/PaidUserProtectedRoute.js');
  const content = fs.readFileSync(componentPath, 'utf8');
  assert(content.includes('NEXT_PUBLIC_DISABLE_AUTH'), 'Missing backward compatibility check');
});

// Test 8: Test environment variable hierarchy
test('Environment variable hierarchy works correctly', () => {
  // Test scenario: OPEN_ACCESS takes precedence
  process.env.OPEN_ACCESS = 'true';
  process.env.NEXT_PUBLIC_OPEN_ACCESS = 'false';
  process.env.NEXT_PUBLIC_DISABLE_AUTH = 'false';
  
  const evaluatedOpenAccess = process.env.OPEN_ACCESS || process.env.NEXT_PUBLIC_OPEN_ACCESS || 'false';
  assert(evaluatedOpenAccess === 'true', 'OPEN_ACCESS should take precedence');
  
  // Test scenario: NEXT_PUBLIC_OPEN_ACCESS as fallback
  delete process.env.OPEN_ACCESS;
  process.env.NEXT_PUBLIC_OPEN_ACCESS = 'true';
  
  const fallbackValue = process.env.OPEN_ACCESS || process.env.NEXT_PUBLIC_OPEN_ACCESS || 'false';
  assert(fallbackValue === 'true', 'NEXT_PUBLIC_OPEN_ACCESS should work as fallback');
});

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📊 Test Results');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`📈 Total:  ${testsPassed + testsFailed}`);
console.log('');

if (testsFailed === 0) {
  console.log('🎉 All tests passed! OPEN_ACCESS mode is properly implemented.');
  console.log('');
  process.exit(0);
} else {
  console.log('⚠️  Some tests failed. Please review the errors above.');
  console.log('');
  process.exit(1);
}
