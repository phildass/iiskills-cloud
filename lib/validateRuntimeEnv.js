/**
 * Runtime Environment Validator
 * 
 * This module validates environment configuration at application startup.
 * It should be imported early in your Next.js application (e.g., in _app.js or _app.tsx).
 * 
 * Features:
 * - Validates required environment variables are present
 * - Checks for placeholder values in production
 * - Warns about testing mode in production
 * - Provides actionable error messages
 * 
 * Usage:
 *   import '@/lib/validateRuntimeEnv';
 *   // or
 *   import '/path/to/validateRuntimeEnv';
 */

const isServer = typeof window === 'undefined';
const isProd = process.env.NODE_ENV === 'production';
const allowTesting = process.env.CI_ALLOW_TESTING === '1' || process.env.ALLOW_TESTING_MODE === '1';

/**
 * Check if a value is a placeholder
 */
function isPlaceholder(value) {
  if (!value || value === '') return true;
  
  const placeholders = [
    'your-project-url-here',
    'your-anon-key-here',
    'your-supabase-url',
    'your-supabase-key',
    'placeholder',
    'changeme',
  ];
  
  return placeholders.some(placeholder => 
    value.toLowerCase().includes(placeholder)
  );
}

/**
 * Log validation errors/warnings
 */
function logValidationIssue(level, message, details) {
  const prefix = level === 'error' ? '❌ STARTUP ERROR' : '⚠️  STARTUP WARNING';
  
  if (isServer) {
    console.error(`\n${prefix}: ${message}`);
    if (details) {
      details.forEach(detail => console.error(`  ${detail}`));
    }
    console.error('');
  } else {
    console.warn(`${prefix}: ${message}`, details || '');
  }
}

/**
 * Main validation function
 */
function validateRuntimeEnvironment() {
  // Only run validation on server-side
  if (!isServer) return;
  
  const errors = [];
  const warnings = [];
  
  // Detect if this is the admin app
  const isAdminApp = (
    process.env.APP_NAME && process.env.APP_NAME.includes('admin')
  ) || (
    // Check if we're in an admin directory (note: admin apps are now in apps-backup)
    process.cwd && (
      process.cwd().includes('/apps-backup/admin') ||
      process.cwd().includes('/apps-backup/iiskills-admin') ||
      process.cwd().includes('/apps/main/pages/admin')
    )
  );
  
  // Check for testing mode in production
  const isTestingMode = (
    process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true' ||
    process.env.NEXT_PUBLIC_DISABLE_PAYWALL === 'true' ||
    process.env.NEXT_PUBLIC_USE_LOCAL_CONTENT === 'true' ||
    process.env.NEXT_PUBLIC_SUPABASE_SUSPENDED === 'true'
  );
  
  // Only warn about testing mode if:
  // 1. It's production
  // 2. Testing mode is enabled
  // 3. It's NOT the admin app (admin intentionally has auth disabled)
  // 4. Testing mode is not explicitly allowed
  if (isProd && isTestingMode && !isAdminApp && !allowTesting) {
    errors.push('TESTING MODE DETECTED IN PRODUCTION!');
    errors.push('One or more of these flags are enabled:');
    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
      errors.push('  - NEXT_PUBLIC_DISABLE_AUTH=true (authentication bypassed)');
    }
    if (process.env.NEXT_PUBLIC_DISABLE_PAYWALL === 'true') {
      errors.push('  - NEXT_PUBLIC_DISABLE_PAYWALL=true (paywall bypassed)');
    }
    if (process.env.NEXT_PUBLIC_USE_LOCAL_CONTENT === 'true') {
      errors.push('  - NEXT_PUBLIC_USE_LOCAL_CONTENT=true (using local data)');
    }
    if (process.env.NEXT_PUBLIC_SUPABASE_SUSPENDED === 'true') {
      errors.push('  - NEXT_PUBLIC_SUPABASE_SUSPENDED=true (database suspended)');
    }
    errors.push('Fix: Remove these flags from production .env or ecosystem.config.js');
    errors.push('For staging/testing: Set ALLOW_TESTING_MODE=1 or CI_ALLOW_TESTING=1');
  }
  
  // Admin app with testing mode is OK in production (by design)
  if (isProd && isTestingMode && isAdminApp) {
    console.log('ℹ️  Admin app running with auth bypass (intentional configuration)');
  }
  
  // Check for required Supabase variables (unless suspended or using local content)
  const isSuspended = process.env.NEXT_PUBLIC_SUPABASE_SUSPENDED === 'true';
  const isLocalContent = process.env.NEXT_PUBLIC_USE_LOCAL_CONTENT === 'true';
  
  if (!isSuspended && !isLocalContent) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Check if variables are set
    if (!supabaseUrl) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL is not set');
      errors.push('Fix: Add NEXT_PUBLIC_SUPABASE_URL to your .env.local or environment');
    } else if (isPlaceholder(supabaseUrl)) {
      errors.push('NEXT_PUBLIC_SUPABASE_URL has a placeholder value');
      errors.push(`Current value: ${supabaseUrl}`);
      errors.push('Fix: Replace with your actual Supabase project URL');
    }
    
    if (!supabaseKey) {
      errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
      errors.push('Fix: Add NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local or environment');
    } else if (isPlaceholder(supabaseKey)) {
      errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY has a placeholder value');
      errors.push(`Current value: ${supabaseKey.substring(0, 20)}...`);
      errors.push('Fix: Replace with your actual Supabase anonymous key');
    }
  }
  
  // Log warnings for development
  if (!isProd && isTestingMode && !isAdminApp) {
    warnings.push('Testing mode is enabled (OK for development)');
    if (process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true') {
      warnings.push('  - Authentication is bypassed');
    }
    if (process.env.NEXT_PUBLIC_DISABLE_PAYWALL === 'true') {
      warnings.push('  - Paywall is bypassed');
    }
    if (process.env.NEXT_PUBLIC_USE_LOCAL_CONTENT === 'true') {
      warnings.push('  - Using local content instead of database');
    }
  }
  
  // Report results
  if (errors.length > 0) {
    logValidationIssue('error', 'Invalid environment configuration', errors);
    
    // In production, fail fast
    if (isProd) {
      console.error('APPLICATION STARTUP ABORTED');
      console.error('Fix the configuration errors above and restart the application\n');
      process.exit(1);
    }
  }
  
  if (warnings.length > 0) {
    logValidationIssue('warning', 'Environment configuration notice', warnings);
  }
  
  // Log success in production
  if (isProd && errors.length === 0) {
    console.log('✅ Environment validation passed');
  }
}

// Run validation immediately when this module is imported
try {
  validateRuntimeEnvironment();
} catch (error) {
  console.error('❌ Environment validation failed with exception:', error);
  if (isProd) {
    process.exit(1);
  }
}

// Export validation function for programmatic use
module.exports = { validateRuntimeEnvironment };
