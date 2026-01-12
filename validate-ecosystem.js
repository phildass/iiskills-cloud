#!/usr/bin/env node
/**
 * Validate PM2 Ecosystem Configuration
 * 
 * This script validates the ecosystem.config.js file to ensure it's ready
 * for PM2 deployment without actually starting any processes.
 * 
 * Usage: node validate-ecosystem.js
 */

const path = require('path');
const fs = require('fs');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
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

function warn(message) {
  log(`⚠ ${message}`, YELLOW);
}

function header(message) {
  log(`\n${BOLD}${message}${RESET}`);
}

async function main() {
  log(`${BOLD}PM2 Ecosystem Configuration Validator${RESET}`);
  log('='.repeat(70));

  let hasErrors = false;

  // Load configuration
  header('Loading Configuration');
  let config;
  try {
    config = require(path.join(process.cwd(), 'ecosystem.config.js'));
    success('Configuration file loaded');
  } catch (err) {
    error(`Failed to load ecosystem.config.js: ${err.message}`);
    process.exit(1);
  }

  // Validate structure
  header('Validating Structure');
  if (!config.apps || !Array.isArray(config.apps)) {
    error('Configuration must have an "apps" array');
    process.exit(1);
  }
  success(`Found ${config.apps.length} app configurations`);

  // Validate each app
  header('Validating Applications');
  config.apps.forEach((app, idx) => {
    const appNum = idx + 1;
    
    // Check required fields
    const required = ['name', 'cwd', 'script', 'args'];
    const missing = required.filter(field => !app[field]);
    
    if (missing.length > 0) {
      error(`App ${appNum} (${app.name || 'unnamed'}): Missing ${missing.join(', ')}`);
      hasErrors = true;
    }
    
    // Check directory exists
    if (app.cwd && !fs.existsSync(app.cwd)) {
      error(`App ${appNum} (${app.name}): Directory not found: ${app.cwd}`);
      hasErrors = true;
    }
    
    // Check package.json exists
    if (app.cwd) {
      const pkgPath = path.join(app.cwd, 'package.json');
      if (!fs.existsSync(pkgPath)) {
        error(`App ${appNum} (${app.name}): Missing package.json`);
        hasErrors = true;
      }
    }
  });

  if (!hasErrors) {
    success('All apps have required fields and valid paths');
  }

  // Check for duplicate names
  header('Checking for Duplicate Names');
  const names = config.apps.map(a => a.name);
  const duplicates = names.filter((n, i) => names.indexOf(n) !== i);
  if (duplicates.length > 0) {
    error(`Duplicate app names: ${[...new Set(duplicates)].join(', ')}`);
    hasErrors = true;
  } else {
    success('All app names are unique');
  }

  // Check for port conflicts
  header('Checking Port Assignments');
  const ports = config.apps
    .filter(a => a.env && a.env.PORT)
    .map(a => ({ name: a.name, port: a.env.PORT }));

  const portMap = {};
  ports.forEach(p => {
    if (!portMap[p.port]) portMap[p.port] = [];
    portMap[p.port].push(p.name);
  });

  const conflicts = Object.entries(portMap).filter(([port, apps]) => apps.length > 1);
  if (conflicts.length > 0) {
    error('Port conflicts detected:');
    conflicts.forEach(([port, apps]) => {
      error(`  Port ${port}: ${apps.join(', ')}`);
    });
    hasErrors = true;
  } else {
    success(`No port conflicts (${ports.length} explicit assignments)`);
  }

  // Check cross-platform compatibility
  header('Checking Cross-Platform Compatibility');
  const pathIssues = config.apps.filter(app => {
    return typeof app.cwd === 'string' && 
           (app.cwd.includes('__dirname + ') || app.cwd.includes('\\'));
  });
  
  if (pathIssues.length > 0) {
    warn(`${pathIssues.length} apps may have path compatibility issues`);
    pathIssues.forEach(app => warn(`  ${app.name}`));
  } else {
    success('All paths use cross-platform compatible format');
  }

  // Summary
  header('Summary');
  log('='.repeat(70));
  
  if (hasErrors) {
    error('VALIDATION FAILED - Please fix the errors above');
    process.exit(1);
  } else {
    success('VALIDATION PASSED - Configuration is ready for PM2!');
    log('\nNext steps:');
    log('  1. Install dependencies: npm install (in root and subdirectories)');
    log('  2. Build all apps: npm run build (in root and subdirectories)');
    log('  3. Start with PM2: pm2 start ecosystem.config.js');
    log('  4. Save PM2 config: pm2 save');
    log('  5. Enable startup: pm2 startup');
    log('\nFor detailed instructions, see PM2_DEPLOYMENT.md');
  }
  
  log('='.repeat(70));
}

main().catch(err => {
  error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
