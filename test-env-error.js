#!/usr/bin/env node

/**
 * Test script to verify Supabase environment variable error handling
 * 
 * This script tests that:
 * 1. Missing environment variables throw clear errors
 * 2. Error messages contain helpful information
 * 3. App does not start with invalid configuration
 */

const path = require('path');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧪 Testing Supabase Environment Variable Error Handling');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// Test 1: Missing environment variables should throw error
console.log('Test 1: Importing supabaseClient without environment variables...');
console.log('');

// Clear any existing environment variables
delete process.env.NEXT_PUBLIC_SUPABASE_URL;
delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

try {
  // This should throw an error
  const supabaseClient = require('./lib/supabaseClient');
  console.log('❌ FAILED: supabaseClient should have thrown an error');
  process.exit(1);
} catch (error) {
  console.log('✅ PASSED: supabaseClient threw an error as expected');
  console.log('');
  console.log('Error message preview:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Show first few lines of error message
  const errorLines = error.message.split('\n').slice(0, 10);
  errorLines.forEach(line => console.log(line));
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
}

// Test 2: Error message should be informative
console.log('Test 2: Checking error message content...');
console.log('');

try {
  require('./lib/supabaseClient');
  console.log('❌ FAILED: Should have thrown error');
  process.exit(1);
} catch (error) {
  const message = error.message;
  
  const checks = [
    { test: 'Contains "Supabase"', result: message.includes('Supabase') },
    { test: 'Contains "environment variables"', result: message.includes('environment') },
    { test: 'Contains ".env.local"', result: message.includes('.env.local') },
    { test: 'Contains "NEXT_PUBLIC_SUPABASE_URL"', result: message.includes('NEXT_PUBLIC_SUPABASE_URL') },
    { test: 'Contains "NEXT_PUBLIC_SUPABASE_ANON_KEY"', result: message.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY') },
  ];
  
  let allPassed = true;
  checks.forEach(check => {
    const status = check.result ? '✅ PASSED' : '❌ FAILED';
    console.log(`  ${status}: ${check.test}`);
    if (!check.result) allPassed = false;
  });
  
  console.log('');
  
  if (allPassed) {
    console.log('✅ All error message content checks passed!');
  } else {
    console.log('❌ Some error message content checks failed');
    process.exit(1);
  }
}

console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ All Tests Passed!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('Summary:');
console.log('  • Missing environment variables correctly throw errors');
console.log('  • Error messages contain helpful information');
console.log('  • Users will see clear instructions to fix the issue');
console.log('');
console.log('Next: Configure environment variables and test successful startup');
console.log('  1. Run: ./setup-env.sh');
console.log('  2. Or see: ENV_SETUP_GUIDE.md');
console.log('');
