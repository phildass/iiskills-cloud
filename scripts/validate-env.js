#!/usr/bin/env node

/**
 * Environment Validation Script
 * 
 * This script validates environment configuration before build/deploy to ensure:
 * 1. Required environment variables are present and not placeholders
 * 2. Testing/bypass mode is not accidentally enabled in production
 * 3. Configuration is consistent and safe for deployment
 * 
 * Usage:
 *   node scripts/validate-env.js [--allow-testing] [--app=app-name]
 * 
 * Exit codes:
 *   0 = All validations passed
 *   1 = Validation failures detected
 */

const fs = require('fs');
const path = require('path');

// Parse command line arguments
const args = process.argv.slice(2);
const allowTesting = args.includes('--allow-testing') || process.env.CI_ALLOW_TESTING === '1';
const appArg = args.find(arg => arg.startsWith('--app='));
const specificApp = appArg ? appArg.split('=')[1] : null;

// ANSI color codes
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

let errors = 0;
let warnings = 0;

console.log(`${BOLD}${CYAN}========================================${RESET}`);
console.log(`${BOLD}${CYAN}Environment Configuration Validator${RESET}`);
console.log(`${BOLD}${CYAN}========================================${RESET}\n`);

if (allowTesting) {
  console.log(`${YELLOW}⚠️  Testing mode check DISABLED (--allow-testing or CI_ALLOW_TESTING=1)${RESET}\n`);
}

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
    'your-',
    'example',
  ];
  
  return placeholders.some(placeholder => 
    value.toLowerCase().includes(placeholder)
  );
}

/**
 * Validate environment variables from a file
 */
function validateEnvFile(envPath, label) {
  console.log(`${CYAN}Checking ${label}: ${envPath}${RESET}`);
  
  if (!fs.existsSync(envPath)) {
    console.log(`  ${YELLOW}⚠️  File not found (optional)${RESET}\n`);
    return;
  }
  
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n');
  
  let fileErrors = 0;
  let fileWarnings = 0;
  
  // Check for testing mode flags (unless allowed)
  if (!allowTesting) {
    const testingFlags = [
      'NEXT_PUBLIC_DISABLE_AUTH=true',
      'NEXT_PUBLIC_DISABLE_PAYWALL=true',
      'NEXT_PUBLIC_USE_LOCAL_CONTENT=true',
      'NEXT_PUBLIC_SUPABASE_SUSPENDED=true',
    ];
    
    testingFlags.forEach(flag => {
      if (content.includes(flag)) {
        console.log(`  ${RED}✗ FAIL: Found ${flag}${RESET}`);
        console.log(`    Testing mode detected in production config!`);
        console.log(`    Either remove this flag or run with --allow-testing for test environments\n`);
        fileErrors++;
        errors++;
      }
    });
  }
  
  // Check for required variables with placeholders
  const requiredVars = {
    'NEXT_PUBLIC_SUPABASE_URL': 'Supabase project URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase anonymous key',
  };
  
  Object.entries(requiredVars).forEach(([varName, description]) => {
    const regex = new RegExp(`^${varName}=(.*)$`, 'm');
    const match = content.match(regex);
    
    if (!match) {
      // Variable not found - check if suspension mode is enabled
      const isSuspended = content.includes('NEXT_PUBLIC_SUPABASE_SUSPENDED=true');
      const isLocalContent = content.includes('NEXT_PUBLIC_USE_LOCAL_CONTENT=true');
      
      if (!isSuspended && !isLocalContent && !allowTesting) {
        console.log(`  ${RED}✗ FAIL: ${varName} is missing${RESET}`);
        console.log(`    Required: ${description}`);
        console.log(`    Either set this variable or enable NEXT_PUBLIC_SUPABASE_SUSPENDED=true\n`);
        fileErrors++;
        errors++;
      }
    } else {
      const value = match[1].trim();
      
      if (isPlaceholder(value)) {
        console.log(`  ${RED}✗ FAIL: ${varName} has placeholder value${RESET}`);
        console.log(`    Current: ${value}`);
        console.log(`    Required: ${description}\n`);
        fileErrors++;
        errors++;
      }
    }
  });
  
  if (fileErrors === 0 && fileWarnings === 0) {
    console.log(`  ${GREEN}✓ PASS: Configuration looks good${RESET}\n`);
  } else if (fileErrors === 0) {
    console.log(`  ${YELLOW}⚠️  ${fileWarnings} warning(s)${RESET}\n`);
  }
}

/**
 * Validate ecosystem.config.js
 */
function validateEcosystemConfig() {
  const ecosystemPath = path.join(process.cwd(), 'ecosystem.config.js');
  
  console.log(`${CYAN}Checking PM2 configuration: ecosystem.config.js${RESET}`);
  
  if (!fs.existsSync(ecosystemPath)) {
    console.log(`  ${YELLOW}⚠️  ecosystem.config.js not found${RESET}\n`);
    warnings++;
    return;
  }
  
  // Read the file as text since it's a JS module
  const content = fs.readFileSync(ecosystemPath, 'utf8');
  
  let fileErrors = 0;
  
  // Check for testing mode flags in the config (unless allowed)
  // Note: Admin apps are allowed to have DISABLE_AUTH for administrative access
  if (!allowTesting) {
    // Split content into app blocks
    const appBlocks = content.split(/name:\s*["']/).slice(1);
    
    for (const block of appBlocks) {
      const appName = block.split(["'"])[0];
      const appConfig = block.split('},')[0];
      
      // Skip validation for admin apps (intentionally have auth disabled)
      if (appName.includes('admin')) {
        continue;
      }
      
      // Check for testing flags in non-admin apps
      if (/NEXT_PUBLIC_DISABLE_AUTH:\s*["']true["']/.test(appConfig)) {
        console.log(`  ${RED}✗ FAIL: ${appName} has NEXT_PUBLIC_DISABLE_AUTH=true${RESET}`);
        console.log(`    Remove testing flags from non-admin apps in ecosystem.config.js\n`);
        fileErrors++;
        errors++;
      }
      
      if (/NEXT_PUBLIC_DISABLE_PAYWALL:\s*["']true["']/.test(appConfig)) {
        console.log(`  ${RED}✗ FAIL: ${appName} has NEXT_PUBLIC_DISABLE_PAYWALL=true${RESET}`);
        console.log(`    Remove testing flags from non-admin apps in ecosystem.config.js\n`);
        fileErrors++;
        errors++;
      }
      
      if (/NEXT_PUBLIC_USE_LOCAL_CONTENT:\s*["']true["']/.test(appConfig)) {
        console.log(`  ${RED}✗ FAIL: ${appName} has NEXT_PUBLIC_USE_LOCAL_CONTENT=true${RESET}`);
        console.log(`    Remove testing flags from ecosystem.config.js for production\n`);
        fileErrors++;
        errors++;
      }
    }
  }
  
  if (fileErrors === 0) {
    console.log(`  ${GREEN}✓ PASS: PM2 configuration looks good${RESET}`);
    console.log(`  ${GREEN}  (Admin apps correctly configured with auth bypass)${RESET}\n`);
  }
}

/**
 * Main validation flow
 */
function main() {
  // Check root .env files
  validateEnvFile('.env.local', 'Root environment (local)');
  validateEnvFile('.env.production', 'Root environment (production)');
  
  // Check PM2 configuration
  validateEcosystemConfig();
  
  // Check app-specific env files
  const appsDir = path.join(process.cwd(), 'apps');
  if (fs.existsSync(appsDir)) {
    const apps = fs.readdirSync(appsDir).filter(name => {
      const appPath = path.join(appsDir, name);
      return fs.statSync(appPath).isDirectory();
    });
    
    apps.forEach(app => {
      // Skip if specific app is requested and this isn't it
      if (specificApp && app !== specificApp) {
        return;
      }
      
      const appEnvLocal = path.join(appsDir, app, '.env.local');
      const appEnvProd = path.join(appsDir, app, '.env.production');
      
      validateEnvFile(appEnvLocal, `${app} (local)`);
      validateEnvFile(appEnvProd, `${app} (production)`);
    });
  }
  
  // Print summary
  console.log(`${BOLD}${CYAN}========================================${RESET}`);
  console.log(`${BOLD}Validation Summary${RESET}`);
  console.log(`${BOLD}${CYAN}========================================${RESET}`);
  
  if (errors === 0 && warnings === 0) {
    console.log(`${GREEN}${BOLD}✅ All validations passed!${RESET}`);
    console.log(`${GREEN}Environment configuration is safe for deployment${RESET}\n`);
    process.exit(0);
  } else if (errors === 0) {
    console.log(`${YELLOW}${BOLD}⚠️  ${warnings} warning(s)${RESET}`);
    console.log(`${YELLOW}Review warnings above, but safe to proceed${RESET}\n`);
    process.exit(0);
  } else {
    console.log(`${RED}${BOLD}❌ ${errors} error(s), ${warnings} warning(s)${RESET}`);
    console.log(`${RED}${BOLD}DEPLOYMENT BLOCKED${RESET}`);
    console.log(`\nFix the errors above before deploying:`);
    console.log(`  1. Remove testing mode flags from production configs`);
    console.log(`  2. Set all required environment variables`);
    console.log(`  3. Replace placeholder values with real credentials`);
    console.log(`  4. Re-run this script to verify\n`);
    console.log(`For testing/staging environments, use: ${CYAN}--allow-testing${RESET}\n`);
    process.exit(1);
  }
}

// Run validation
main();
