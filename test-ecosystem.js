#!/usr/bin/env node
/**
 * Test script to verify the ecosystem configuration would work with PM2
 * This doesn't actually start PM2, but validates the configuration thoroughly
 */

const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const BLUE = '\x1b[34m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function log(message, color = RESET) {
  console.log(`${color}${message}${RESET}`);
}

function success(message) {
  log(`✓ ${message}`, GREEN);
}

function error(message) {
  log(`✗ ${message}`, RED);
}

function info(message) {
  log(`ℹ ${message}`, BLUE);
}

function header(message) {
  log(`\n${BOLD}${message}${RESET}`);
}

async function main() {
  log(`${BOLD}PM2 Ecosystem Configuration Test${RESET}`);
  log('='.repeat(70));
  
  let hasErrors = false;
  
  // Load configuration
  header('1. Loading Configuration');
  let config;
  try {
    config = require('./ecosystem.config.js');
    success('Configuration loaded successfully');
    info(`  Found ${config.apps.length} app configurations`);
  } catch (err) {
    error(`Failed to load ecosystem.config.js: ${err.message}`);
    process.exit(1);
  }
  
  // Verify all apps
  header('2. Verifying App Directories and Package.json');
  for (const app of config.apps) {
    const dir = typeof app.cwd === 'string' ? app.cwd : process.cwd();
    const pkgPath = path.join(dir, 'package.json');
    
    if (!fs.existsSync(pkgPath)) {
      error(`${app.name}: Missing package.json at ${pkgPath}`);
      hasErrors = true;
      continue;
    }
    
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      
      // Check for start script
      if (!pkg.scripts || !pkg.scripts.start) {
        error(`${app.name}: Missing 'start' script in package.json`);
        hasErrors = true;
        continue;
      }
      
      success(`${app.name}: Package.json valid`);
      info(`  Start script: ${pkg.scripts.start}`);
      
    } catch (err) {
      error(`${app.name}: Invalid package.json: ${err.message}`);
      hasErrors = true;
    }
  }
  
  // Check port assignments
  header('3. Checking Port Assignments');
  const portMap = new Map();
  
  for (const app of config.apps) {
    let port = null;
    
    if (app.env && app.env.PORT) {
      port = app.env.PORT;
    } else {
      // Try to extract from package.json
      const dir = typeof app.cwd === 'string' ? app.cwd : process.cwd();
      const pkgPath = path.join(dir, 'package.json');
      
      if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (pkg.scripts && pkg.scripts.start) {
          const match = pkg.scripts.start.match(/-p\s+(\d+)|--port\s+(\d+)/);
          if (match) {
            port = parseInt(match[1] || match[2]);
          }
        }
      }
    }
    
    if (port) {
      if (!portMap.has(port)) {
        portMap.set(port, []);
      }
      portMap.get(port).push(app.name);
      info(`  ${app.name}: Port ${port}`);
    } else {
      info(`  ${app.name}: Port unspecified (will use Next.js default)`);
    }
  }
  
  // Check for conflicts
  const conflicts = [];
  for (const [port, apps] of portMap.entries()) {
    if (apps.length > 1) {
      conflicts.push({ port, apps });
    }
  }
  
  if (conflicts.length > 0) {
    error('Port conflicts detected:');
    for (const conflict of conflicts) {
      error(`  Port ${conflict.port}: ${conflict.apps.join(', ')}`);
    }
    hasErrors = true;
  } else {
    success('No port conflicts detected');
  }
  
  // Verify script and args
  header('4. Verifying PM2 Script Configuration');
  for (const app of config.apps) {
    if (app.script !== 'npm') {
      error(`${app.name}: Expected script='npm', got '${app.script}'`);
      hasErrors = true;
      continue;
    }
    
    if (app.args !== 'start') {
      error(`${app.name}: Expected args='start', got '${app.args}'`);
      hasErrors = true;
      continue;
    }
    
    success(`${app.name}: Script configuration valid (npm start)`);
  }
  
  // Check log directories
  header('5. Checking Log Configuration');
  const logDir = path.join(process.cwd(), 'logs');
  
  if (!fs.existsSync(logDir)) {
    info('Creating logs directory...');
    fs.mkdirSync(logDir, { recursive: true });
    success('Logs directory created');
  } else {
    success('Logs directory exists');
  }
  
  // Verify PM2 configuration structure
  header('6. Verifying PM2 Configuration Structure');
  const requiredFields = ['name', 'cwd', 'script', 'args', 'env'];
  
  for (const app of config.apps) {
    const missing = requiredFields.filter(field => !app[field]);
    if (missing.length > 0) {
      error(`${app.name}: Missing required fields: ${missing.join(', ')}`);
      hasErrors = true;
    } else {
      success(`${app.name}: All required fields present`);
    }
  }
  
  // Summary
  header('Summary');
  log('='.repeat(70));
  
  if (hasErrors) {
    error('TEST FAILED - Configuration has errors');
    error('Please fix the errors above before using PM2');
    process.exit(1);
  } else {
    success('ALL TESTS PASSED');
    success('Configuration is ready for PM2!');
    
    log('\nNext steps to start with PM2:');
    info('  1. Ensure all dependencies are installed:');
    info('     npm install && for dir in learn-*/; do (cd "$dir" && npm install); done');
    info('     (Windows PowerShell: Get-ChildItem -Directory -Filter "learn-*" | ForEach-Object { Push-Location $_.FullName; npm install; Pop-Location })');
    info('  2. Build all apps:');
    info('     npm run build && for dir in learn-*/; do (cd "$dir" && npm run build); done');
    info('     (Windows PowerShell: Get-ChildItem -Directory -Filter "learn-*" | ForEach-Object { Push-Location $_.FullName; npm run build; Pop-Location })');
    info('  3. Start with PM2:');
    info('     pm2 start ecosystem.config.js');
    info('  4. Save configuration:');
    info('     pm2 save');
    info('  5. Enable startup:');
    info('     pm2 startup');
  }
  
  log('='.repeat(70));
}

main().catch(err => {
  error(`Unexpected error: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
