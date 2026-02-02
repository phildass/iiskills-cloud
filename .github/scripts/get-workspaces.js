#!/usr/bin/env node
/**
 * Generate GitHub Actions matrix JSON for active app workspaces.
 * Output format: { "include": [ { "workspaceName": "...", "workspacePath": "apps/..." }, ... ] }
 *
 * This script:
 * - Scans apps/* directories for package.json files
 * - Excludes apps-backup/* (preserved but not built)
 * - Filters to workspaces that have a "build" script
 * - Outputs a JSON matrix for GitHub Actions dynamic job generation
 *
 * Usage:
 *   node .github/scripts/get-workspaces.js
 *   # Outputs: {"include":[{"workspaceName":"learn-math","workspacePath":"apps/learn-math"},...]}
 */

const fs = require('fs');
const path = require('path');

const APPS_DIR = path.join(__dirname, '../../apps');

// Fallback static list if dynamic detection fails
const FALLBACK_WORKSPACES = [
  { workspaceName: 'main', workspacePath: 'apps/main' },
  { workspaceName: 'learn-ai', workspacePath: 'apps/learn-ai' },
  { workspaceName: 'learn-apt', workspacePath: 'apps/learn-apt' },
  { workspaceName: 'learn-chemistry', workspacePath: 'apps/learn-chemistry' },
  { workspaceName: 'learn-companion', workspacePath: 'apps/learn-companion' },
  { workspaceName: 'learn-cricket', workspacePath: 'apps/learn-cricket' },
  { workspaceName: 'learn-geography', workspacePath: 'apps/learn-geography' },
  { workspaceName: 'learn-govt-jobs', workspacePath: 'apps/learn-govt-jobs' },
  { workspaceName: 'learn-leadership', workspacePath: 'apps/learn-leadership' },
  { workspaceName: 'learn-management', workspacePath: 'apps/learn-management' },
  { workspaceName: 'learn-math', workspacePath: 'apps/learn-math' },
  { workspaceName: 'learn-physics', workspacePath: 'apps/learn-physics' },
  { workspaceName: 'learn-pr', workspacePath: 'apps/learn-pr' },
  { workspaceName: 'learn-winning', workspacePath: 'apps/learn-winning' }
];

function getWorkspaces() {
  try {
    if (!fs.existsSync(APPS_DIR)) {
      console.log('apps/ directory not found, using fallback');
      return FALLBACK_WORKSPACES;
    }

    const workspaces = [];
    const entries = fs.readdirSync(APPS_DIR, { withFileTypes: true });

    for (const entry of entries) {
      // Skip non-directories and apps-backup
      if (!entry.isDirectory()) continue;
      if (entry.name === 'apps-backup') continue;
      if (entry.name.startsWith('.')) continue;

      const appPath = path.join(APPS_DIR, entry.name);
      const pkgPath = path.join(appPath, 'package.json');

      if (!fs.existsSync(pkgPath)) {
        console.log(`Skipping ${entry.name}: no package.json`);
        continue;
      }

      try {
        const pkgContent = fs.readFileSync(pkgPath, 'utf8');
        const pkg = JSON.parse(pkgContent);

        // Only include workspaces that have a build script
        if (pkg.scripts && pkg.scripts.build) {
          workspaces.push({
            workspaceName: entry.name,
            workspacePath: `apps/${entry.name}`
          });
        } else {
          console.log(`Skipping ${entry.name}: no build script`);
        }
      } catch (err) {
        console.log(`Error reading package.json for ${entry.name}:`, err.message);
      }
    }

    if (workspaces.length === 0) {
      console.log('No workspaces found, using fallback');
      return FALLBACK_WORKSPACES;
    }

    return workspaces;
  } catch (err) {
    console.log('Error scanning workspaces, using fallback:', err.message);
    return FALLBACK_WORKSPACES;
  }
}

const workspaces = getWorkspaces();
const matrix = { include: workspaces };

// Output JSON for GitHub Actions
console.log(JSON.stringify(matrix));
