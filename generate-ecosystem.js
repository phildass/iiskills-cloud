#!/usr/bin/env node
/**
 * Auto-generate PM2 Ecosystem Configuration
 * 
 * This script automatically detects all Next.js applications in the repository,
 * inspects their package.json files, and generates a complete PM2 ecosystem
 * configuration with proper entry points and port assignments.
 * 
 * Usage: node generate-ecosystem.js [--dry-run] [--output FILE]
 */

const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function log(message, color = RESET) {
  console.log(`${color}${message}${RESET}`);
}

function info(message) {
  log(`ℹ ${message}`, BLUE);
}

function success(message) {
  log(`✓ ${message}`, GREEN);
}

function warn(message) {
  log(`⚠ ${message}`, YELLOW);
}

function header(message) {
  log(`\n${BOLD}${message}${RESET}`);
}

/**
 * Detect all Next.js applications in the repository
 */
function detectApps(rootDir) {
  const apps = [];
  
  // Check root directory
  const rootPkgPath = path.join(rootDir, 'package.json');
  if (fs.existsSync(rootPkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf8'));
      if (isNextJsApp(pkg)) {
        apps.push({
          name: 'main',
          displayName: 'iiskills-main',
          dir: rootDir,
          relativeDir: '.',
          package: pkg,
          description: 'Main iiskills.cloud application'
        });
      }
    } catch (err) {
      warn(`Failed to read root package.json: ${err.message}`);
    }
  }
  
  // Check subdirectories
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) {
      continue;
    }
    
    const dirPath = path.join(rootDir, entry.name);
    const pkgPath = path.join(dirPath, 'package.json');
    
    if (fs.existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        if (isNextJsApp(pkg)) {
          apps.push({
            name: entry.name,
            displayName: `iiskills-${entry.name}`,
            dir: dirPath,
            relativeDir: entry.name,
            package: pkg,
            description: pkg.description || `${entry.name} module`
          });
        }
      } catch (err) {
        warn(`Failed to read package.json in ${entry.name}: ${err.message}`);
      }
    }
  }
  
  return apps;
}

/**
 * Check if package.json indicates a Next.js application
 */
function isNextJsApp(pkg) {
  return pkg.dependencies && 
         pkg.dependencies.next &&
         pkg.scripts &&
         pkg.scripts.start;
}

/**
 * Extract port from start script or return null
 */
function extractPortFromScript(script) {
  const match = script.match(/-p\s+(\d+)|--port\s+(\d+)/);
  return match ? parseInt(match[1] || match[2]) : null;
}

/**
 * Detect entry point information for an app
 */
function detectEntryPoint(app) {
  const pkg = app.package;
  const startScript = pkg.scripts.start;
  const port = extractPortFromScript(startScript);
  
  return {
    script: 'npm',
    args: 'start',
    startScript: startScript,
    port: port,
    usesNpm: true,
    entryType: 'next.js'
  };
}

/**
 * Assign unique ports to apps, detecting from package.json or assigning new ones
 */
function assignPorts(apps) {
  const portAssignments = [];
  const usedPorts = new Set();
  let nextAvailablePort = 3000;
  
  // First pass: collect explicitly defined ports
  for (const app of apps) {
    const entry = detectEntryPoint(app);
    if (entry.port) {
      portAssignments.push({
        app,
        port: entry.port,
        source: 'package.json',
        entry
      });
      usedPorts.add(entry.port);
    } else {
      portAssignments.push({
        app,
        port: null,
        source: null,
        entry
      });
    }
  }
  
  // Second pass: assign ports to apps without explicit ports
  for (const assignment of portAssignments) {
    if (assignment.port === null) {
      // Find next available port
      while (usedPorts.has(nextAvailablePort)) {
        nextAvailablePort++;
      }
      assignment.port = nextAvailablePort;
      assignment.source = 'auto-assigned';
      usedPorts.add(nextAvailablePort);
      nextAvailablePort++;
    }
  }
  
  // Check for conflicts
  const portMap = new Map();
  for (const assignment of portAssignments) {
    if (!portMap.has(assignment.port)) {
      portMap.set(assignment.port, []);
    }
    portMap.get(assignment.port).push(assignment.app.displayName);
  }
  
  const conflicts = [];
  for (const [port, appNames] of portMap.entries()) {
    if (appNames.length > 1) {
      conflicts.push({ port, apps: appNames });
    }
  }
  
  if (conflicts.length > 0) {
    warn('Port conflicts detected:');
    for (const conflict of conflicts) {
      warn(`  Port ${conflict.port}: ${conflict.apps.join(', ')}`);
    }
    warn('Reassigning conflicting ports...');
    
    // Reassign conflicting ports
    for (const [port, appNames] of portMap.entries()) {
      if (appNames.length > 1) {
        // Keep the first app, reassign the rest
        for (let i = 1; i < appNames.length; i++) {
          const assignment = portAssignments.find(a => a.app.displayName === appNames[i]);
          while (usedPorts.has(nextAvailablePort)) {
            nextAvailablePort++;
          }
          assignment.port = nextAvailablePort;
          assignment.source = 'reassigned';
          usedPorts.add(nextAvailablePort);
          nextAvailablePort++;
        }
      }
    }
  }
  
  return portAssignments;
}

/**
 * Generate PM2 ecosystem configuration
 */
function generateEcosystemConfig(portAssignments) {
  const configHeader = `/**
 * PM2 Ecosystem Configuration File for iiskills-cloud
 * 
 * Auto-generated configuration for all Next.js applications in the repository.
 * Each app is configured to run independently with its own port and logs.
 * 
 * This file was automatically generated by generate-ecosystem.js
 * DO NOT EDIT MANUALLY - regenerate using: node generate-ecosystem.js
 * 
 * All apps use Next.js and their package.json 'start' scripts, which include
 * port specifications where defined.
 * 
 * Usage:
 *   pm2 start ecosystem.config.js          # Start all apps
 *   pm2 start ecosystem.config.js --only <app-name>  # Start specific app
 *   pm2 stop all                           # Stop all apps
 *   pm2 restart all                        # Restart all apps
 *   pm2 logs                               # View logs
 *   pm2 monit                              # Monitor processes
 *   pm2 save                               # Save current process list
 *   pm2 startup                            # Enable PM2 to start on system boot
 * 
 * Prerequisites:
 *   1. Run 'npm install' in root and each subdirectory before starting
 *   2. Run 'npm run build' in root and each subdirectory to build production bundles
 *   3. Ensure all environment variables are configured (.env files)
 * 
 * Cross-platform compatible with Windows and Unix-like systems.
 */

const path = require('path');

module.exports = {
  apps: [`;

  const apps = [];
  
  for (const assignment of portAssignments) {
    const app = assignment.app;
    const needsPortOverride = assignment.source === 'auto-assigned' || 
                             assignment.source === 'reassigned';
    
    let envConfig;
    if (needsPortOverride) {
      envConfig = `      env: {
        NODE_ENV: 'production',
        PORT: ${assignment.port}  // ${assignment.source === 'reassigned' ? 'Reassigned to resolve conflict' : 'Auto-assigned'}
      },`;
    } else if (assignment.source === 'package.json') {
      envConfig = `      env: {
        NODE_ENV: 'production',
        // PORT ${assignment.port} is specified in package.json start script
      },`;
    } else {
      envConfig = `      env: {
        NODE_ENV: 'production',
        PORT: ${assignment.port}
      },`;
    }
    
    const dirPath = app.relativeDir === '.' ? '__dirname' : `path.join(__dirname, '${app.relativeDir}')`;
    const logPrefix = app.name === 'main' ? 'main' : app.name;
    
    apps.push(`    // ${app.description}
    {
      name: '${app.displayName}',
      cwd: ${dirPath},
      script: 'npm',
      args: 'start',
${envConfig}
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', '${logPrefix}-error.log'),
      out_file: path.join(__dirname, 'logs', '${logPrefix}-out.log'),
      log_file: path.join(__dirname, 'logs', '${logPrefix}-combined.log'),
      time: true
    }`);
  }
  
  const configFooter = `
  ]
}
`;
  
  return configHeader + '\n' + apps.join(',\n    \n') + configFooter;
}

/**
 * Generate documentation about detected entry points
 */
function generateDocumentation(portAssignments) {
  const lines = [];
  
  lines.push('# PM2 Entry Points Detection Summary');
  lines.push('');
  lines.push('This file documents the automatically detected entry points and configurations');
  lines.push('for all applications in the iiskills-cloud repository.');
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push('## Detected Applications');
  lines.push('');
  lines.push('| App Name | Directory | Port | Source | Start Script |');
  lines.push('|----------|-----------|------|--------|--------------|');
  
  for (const assignment of portAssignments) {
    const app = assignment.app;
    const dir = app.relativeDir === '.' ? '(root)' : app.relativeDir;
    const script = assignment.entry.startScript;
    lines.push(`| ${app.displayName} | ${dir} | ${assignment.port} | ${assignment.source} | \`${script}\` |`);
  }
  
  lines.push('');
  lines.push('## Port Assignment Details');
  lines.push('');
  
  const bySource = {
    'package.json': [],
    'auto-assigned': [],
    'reassigned': []
  };
  
  for (const assignment of portAssignments) {
    bySource[assignment.source].push(assignment);
  }
  
  if (bySource['package.json'].length > 0) {
    lines.push('### Ports from package.json');
    lines.push('');
    lines.push('These apps have port specifications in their package.json start scripts:');
    lines.push('');
    for (const assignment of bySource['package.json']) {
      lines.push(`- **${assignment.app.displayName}**: Port ${assignment.port}`);
      lines.push(`  - Start script: \`${assignment.entry.startScript}\``);
    }
    lines.push('');
  }
  
  if (bySource['auto-assigned'].length > 0) {
    lines.push('### Auto-assigned Ports');
    lines.push('');
    lines.push('These apps did not specify a port, so one was automatically assigned:');
    lines.push('');
    for (const assignment of bySource['auto-assigned']) {
      lines.push(`- **${assignment.app.displayName}**: Port ${assignment.port} (auto-assigned)`);
      lines.push(`  - Start script: \`${assignment.entry.startScript}\``);
    }
    lines.push('');
  }
  
  if (bySource['reassigned'].length > 0) {
    lines.push('### Reassigned Ports');
    lines.push('');
    lines.push('These apps had port conflicts and were reassigned to different ports:');
    lines.push('');
    for (const assignment of bySource['reassigned']) {
      lines.push(`- **${assignment.app.displayName}**: Port ${assignment.port} (reassigned to resolve conflict)`);
      lines.push(`  - Original: Port ${extractPortFromScript(assignment.entry.startScript)}`);
      lines.push(`  - Start script: \`${assignment.entry.startScript}\``);
    }
    lines.push('');
  }
  
  lines.push('## Entry Point Strategy');
  lines.push('');
  lines.push('All detected applications are Next.js applications. The entry point strategy is:');
  lines.push('');
  lines.push('1. **Script**: Use `npm` as the script executable');
  lines.push('2. **Args**: Use `start` as the argument to run the package.json start script');
  lines.push('3. **Port**: Either use the port from package.json or assign one automatically');
  lines.push('');
  lines.push('This approach ensures that:');
  lines.push('- Each app uses its own configured build and start process');
  lines.push('- Port assignments are clear and conflict-free');
  lines.push('- The configuration works on a fresh clone without manual intervention');
  lines.push('');
  lines.push('## Regenerating the Configuration');
  lines.push('');
  lines.push('To regenerate the PM2 ecosystem configuration:');
  lines.push('');
  lines.push('```bash');
  lines.push('node generate-ecosystem.js');
  lines.push('```');
  lines.push('');
  lines.push('This will:');
  lines.push('1. Scan all directories for Next.js applications');
  lines.push('2. Detect entry points from package.json');
  lines.push('3. Assign ports (from package.json or auto-assign)');
  lines.push('4. Resolve any port conflicts');
  lines.push('5. Generate ecosystem.config.js');
  lines.push('6. Update this documentation file');
  lines.push('');
  
  return lines.join('\n');
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const outputIndex = args.indexOf('--output');
  const outputFile = outputIndex >= 0 && args[outputIndex + 1] 
    ? args[outputIndex + 1] 
    : 'ecosystem.config.js';
  
  log(`${BOLD}PM2 Ecosystem Configuration Generator${RESET}`);
  log('='.repeat(70));
  
  const rootDir = process.cwd();
  
  // Detect applications
  header('Detecting Applications');
  const apps = detectApps(rootDir);
  success(`Found ${apps.length} Next.js applications`);
  
  for (const app of apps) {
    info(`  - ${app.displayName} (${app.relativeDir})`);
  }
  
  // Assign ports
  header('Assigning Ports');
  const portAssignments = assignPorts(apps);
  
  for (const assignment of portAssignments) {
    const sourceLabel = assignment.source === 'package.json' 
      ? 'from package.json' 
      : assignment.source === 'reassigned'
      ? 'reassigned'
      : 'auto-assigned';
    info(`  - ${assignment.app.displayName}: Port ${assignment.port} (${sourceLabel})`);
  }
  
  // Generate configuration
  header('Generating Configuration');
  const config = generateEcosystemConfig(portAssignments);
  
  if (dryRun) {
    warn('Dry-run mode: Configuration will not be written');
    console.log('\n' + config);
  } else {
    const configPath = path.join(rootDir, outputFile);
    fs.writeFileSync(configPath, config, 'utf8');
    success(`Configuration written to ${outputFile}`);
  }
  
  // Generate documentation
  header('Generating Documentation');
  const docs = generateDocumentation(portAssignments);
  const docsPath = path.join(rootDir, 'PM2_ENTRY_POINTS.md');
  
  if (!dryRun) {
    fs.writeFileSync(docsPath, docs, 'utf8');
    success('Documentation written to PM2_ENTRY_POINTS.md');
  }
  
  // Summary
  header('Summary');
  log('='.repeat(70));
  success(`Detected ${apps.length} applications`);
  success(`Generated PM2 configuration with ${portAssignments.length} app entries`);
  
  if (!dryRun) {
    info('\nNext steps:');
    info('  1. Review the generated ecosystem.config.js');
    info('  2. Review PM2_ENTRY_POINTS.md for details');
    info('  3. Validate with: node validate-ecosystem.js');
    info('  4. Start with PM2: pm2 start ecosystem.config.js');
  }
  
  log('='.repeat(70));
}

main().catch(err => {
  console.error(`Error: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});
