// dangerfile.js - Automated PR Requirements Analysis
// This file is executed by Danger.js during CI to analyze PRs and provide feedback

import { danger, warn, fail, message, markdown } from 'danger';

const pr = danger.github.pr;
const modifiedFiles = danger.git.modified_files;
const createdFiles = danger.git.created_files;
const deletedFiles = danger.git.deleted_files;
const allFiles = [...modifiedFiles, ...createdFiles];

// ============================================================================
// 1. PR METADATA CHECKS
// ============================================================================

// Check PR size
const bigPRThreshold = 500;
const totalChanges = danger.github.pr.additions + danger.github.pr.deletions;

if (totalChanges > bigPRThreshold) {
  warn(`⚠️ This PR is quite large (${totalChanges} lines changed). Consider breaking it into smaller PRs for easier review.`);
}

// Check PR title
if (pr.title.length < 10) {
  fail('❌ PR title is too short. Please provide a descriptive title (at least 10 characters).');
}

// Check PR description
if (!pr.body || pr.body.length < 50) {
  fail('❌ PR description is too short. Please use the PR template and provide adequate details.');
}

// Check for issue linkage
const issueRegex = /(?:Closes|Fixes|Resolves|Related to)\s+#\d+/i;
if (!issueRegex.test(pr.body)) {
  warn('⚠️ No issue linkage found. Consider linking this PR to relevant issues using "Closes #123" or "Related to #456".');
}

// ============================================================================
// 2. CODE QUALITY CHECKS
// ============================================================================

// Check for console.log statements (should use proper logging)
const jsFiles = allFiles.filter(file => 
  file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')
);

let consoleLogCount = 0;
for (const file of jsFiles) {
  const diff = await danger.git.diffForFile(file);
  const addedLines = diff.added.split('\n').filter(line => line.trim().startsWith('+'));
  
  for (const line of addedLines) {
    if (line.includes('console.log') && !line.includes('// eslint-disable')) {
      consoleLogCount++;
    }
  }
}

if (consoleLogCount > 0) {
  warn(`⚠️ Found ${consoleLogCount} new console.log statement(s). Consider using proper logging or removing debug statements.`);
}

// Check for TODO comments
let todoCount = 0;
for (const file of jsFiles) {
  const diff = await danger.git.diffForFile(file);
  const addedLines = diff.added.split('\n').filter(line => line.trim().startsWith('+'));
  
  for (const line of addedLines) {
    if (line.includes('TODO') || line.includes('FIXME')) {
      todoCount++;
    }
  }
}

if (todoCount > 3) {
  warn(`⚠️ Found ${todoCount} new TODO/FIXME comments. Consider creating issues for these tasks.`);
}

// ============================================================================
// 3. IMPORT & ARCHITECTURE CHECKS
// ============================================================================

// Check for prohibited local component imports
const appsFiles = allFiles.filter(file => file.startsWith('apps/'));
let localImportViolations = [];

for (const file of appsFiles) {
  const diff = await danger.git.diffForFile(file);
  const addedLines = diff.added.split('\n').filter(line => line.trim().startsWith('+'));
  
  for (const line of addedLines) {
    // Check for relative imports going up multiple levels to components
    if (line.includes('import') && line.match(/from\s+['"]\.\.[\/\\]\.\.[\/\\]components/)) {
      localImportViolations.push({ file, line: line.trim() });
    }
  }
}

if (localImportViolations.length > 0) {
  fail('❌ **Prohibited Pattern**: Local component imports detected. Apps should use `@iiskills/ui` package instead.');
  
  let violationsList = '\n**Files with violations:**\n';
  localImportViolations.forEach(({ file, line }) => {
    violationsList += `- \`${file}\`: ${line.substring(0, 80)}\n`;
  });
  markdown(violationsList);
}

// Check for proper @iiskills/ui usage
let properImportCount = 0;
for (const file of appsFiles) {
  const diff = await danger.git.diffForFile(file);
  const addedLines = diff.added.split('\n').filter(line => line.trim().startsWith('+'));
  
  for (const line of addedLines) {
    if (line.includes("from '@iiskills/ui")) {
      properImportCount++;
    }
  }
}

if (properImportCount > 0) {
  message(`✅ Found ${properImportCount} proper imports using @iiskills/ui package. Great!`);
}

// Check for deprecated app references
const deprecatedApps = [
  'learn-govt-jobs',
  'learn-finesse', 
  'learn-biology',
  'learn-cricket',
  'learn-companion',
  'learn-jee',
  'learn-neet',
  'learn-ias',
  'learn-leadership',
  'learn-winning',
  'mpa'
];

let deprecatedRefs = [];
for (const file of jsFiles) {
  if (file.includes('apps-backup')) continue; // Skip backup directory
  
  const diff = await danger.git.diffForFile(file);
  const addedLines = diff.added.split('\n').filter(line => line.trim().startsWith('+'));
  
  for (const line of addedLines) {
    for (const app of deprecatedApps) {
      if (line.includes(app) && !line.includes('deprecated') && !line.includes('archived')) {
        deprecatedRefs.push({ file, app, line: line.trim() });
      }
    }
  }
}

if (deprecatedRefs.length > 0) {
  warn('⚠️ References to deprecated apps detected. Ensure they are properly marked as deprecated/archived.');
}

// ============================================================================
// 4. TESTING REQUIREMENTS
// ============================================================================

// Check if tests were added/updated
const testFiles = allFiles.filter(file => 
  file.includes('.test.') || file.includes('.spec.') || file.includes('tests/')
);

const hasSourceChanges = jsFiles.some(file => 
  !file.includes('.test.') && !file.includes('.spec.') && !file.includes('tests/')
);

if (hasSourceChanges && testFiles.length === 0) {
  warn('⚠️ No test files were added or modified. Consider adding tests for your changes.');
}

if (testFiles.length > 0) {
  message(`✅ Test files updated: ${testFiles.length} file(s)`);
}

// ============================================================================
// 5. CONFIGURATION CHECKS
// ============================================================================

// Check for .env changes
const envFiles = allFiles.filter(file => 
  file.includes('.env') && !file.includes('.example')
);

if (envFiles.length > 0) {
  fail('❌ **Security Risk**: Direct .env files should not be committed. Use .env.example files instead.');
}

// Check for package.json changes
const packageJsonFiles = allFiles.filter(file => file.endsWith('package.json'));

if (packageJsonFiles.length > 0) {
  message('📦 Package.json files were modified. Make sure dependencies are properly reviewed.');
  
  // Check if yarn.lock was also updated
  if (!allFiles.includes('yarn.lock')) {
    warn('⚠️ package.json was modified but yarn.lock was not updated. Did you run `yarn install`?');
  }
}

// ============================================================================
// 6. VISUAL CHANGES CHECKS
// ============================================================================

// Check for UI-related file changes
const uiFiles = allFiles.filter(file => 
  file.includes('/components/') || 
  file.includes('/pages/') ||
  file.endsWith('.css') ||
  file.endsWith('.scss') ||
  file.includes('styles/') ||
  file.includes('tailwind.config')
);

if (uiFiles.length > 0) {
  warn('📸 UI/Visual changes detected. Please attach screenshots (desktop, tablet, mobile) to the PR description.');
  
  // Check if PR body mentions screenshots
  const hasScreenshots = pr.body.toLowerCase().includes('screenshot') || 
                          pr.body.includes('![') ||
                          pr.body.includes('<img');
  
  if (!hasScreenshots) {
    fail('❌ UI changes detected but no screenshots found in PR description. Please run `./capture-qa-screenshots.sh` and attach results.');
  } else {
    message('✅ Screenshots appear to be included in PR description.');
  }
}

// ============================================================================
// 7. SECURITY CHECKS
// ============================================================================

// Check for potential security issues
let securityIssues = [];

for (const file of jsFiles) {
  const diff = await danger.git.diffForFile(file);
  const addedLines = diff.added.split('\n').filter(line => line.trim().startsWith('+'));
  
  for (const line of addedLines) {
    // Check for hardcoded secrets
    if (line.match(/['"](?:password|secret|key|token)['"]?\s*[:=]\s*['"][^'"]+['"]/i)) {
      securityIssues.push({ file, type: 'Potential hardcoded secret', line: line.substring(0, 50) });
    }
    
    // Check for eval usage
    if (line.includes('eval(')) {
      securityIssues.push({ file, type: 'Usage of eval()', line: line.substring(0, 50) });
    }
    
    // Check for dangerouslySetInnerHTML
    if (line.includes('dangerouslySetInnerHTML')) {
      securityIssues.push({ file, type: 'Usage of dangerouslySetInnerHTML', line: line.substring(0, 50) });
    }
  }
}

if (securityIssues.length > 0) {
  fail('❌ **Security Issues Detected**:');
  
  let issuesList = '\n';
  securityIssues.forEach(({ file, type, line }) => {
    issuesList += `- \`${file}\`: ${type}\n  \`${line}...\`\n`;
  });
  markdown(issuesList);
}

// ============================================================================
// 8. DOCUMENTATION CHECKS
// ============================================================================

// Check if documentation was updated
const docFiles = allFiles.filter(file => 
  file.endsWith('.md') && !file.includes('node_modules')
);

const hasSignificantChanges = totalChanges > 100;

if (hasSignificantChanges && docFiles.length === 0) {
  warn('⚠️ Significant changes detected but no documentation updates. Consider updating relevant docs.');
}

// Check for CHANGELOG update
const hasChangelogUpdate = allFiles.includes('CHANGELOG.md');

if (hasSignificantChanges && !hasChangelogUpdate) {
  warn('⚠️ Consider updating CHANGELOG.md for this significant change.');
}

// ============================================================================
// 9. FILE ORGANIZATION CHECKS
// ============================================================================

// Check for deleted files
if (deletedFiles.length > 0) {
  message(`🗑️ ${deletedFiles.length} file(s) deleted. Make sure these deletions are intentional and documented.`);
  
  if (deletedFiles.length > 10) {
    warn('⚠️ Large number of files deleted. Please ensure this is intentional and all references are updated.');
  }
}

// Check for large files
const largeFileThreshold = 100000; // 100KB
for (const file of createdFiles) {
  try {
    const stats = await danger.git.structuredDiffForFile(file);
    if (stats && stats.chunks && stats.chunks.length > 500) {
      warn(`⚠️ Large file detected: \`${file}\`. Consider optimization or splitting.`);
    }
  } catch (e) {
    // File might be binary or unavailable
  }
}

// ============================================================================
// 10. GENERATE COMPREHENSIVE REPORT
// ============================================================================

let report = '\n## 🤖 Automated Requirements Analysis Report\n\n';

// Summary statistics
report += '### 📊 Change Statistics\n\n';
report += `- **Files Changed**: ${allFiles.length}\n`;
report += `- **Lines Added**: ${pr.additions}\n`;
report += `- **Lines Deleted**: ${pr.deletions}\n`;
report += `- **Test Files**: ${testFiles.length}\n`;
report += `- **Documentation Files**: ${docFiles.length}\n\n`;

// Requirements checklist
report += '### ✅ Requirements Checklist\n\n';
report += `- ${localImportViolations.length === 0 ? '✅' : '❌'} Proper package imports (@iiskills/ui)\n`;
report += `- ${envFiles.length === 0 ? '✅' : '❌'} No .env files committed\n`;
report += `- ${securityIssues.length === 0 ? '✅' : '❌'} No security issues detected\n`;
report += `- ${testFiles.length > 0 || !hasSourceChanges ? '✅' : '⚠️'} Tests included\n`;
report += `- ${!uiFiles.length || (uiFiles.length > 0 && pr.body.toLowerCase().includes('screenshot')) ? '✅' : '❌'} Screenshots provided (if UI changes)\n\n`;

// Recommendations
report += '### 💡 Recommendations\n\n';

if (localImportViolations.length === 0 && securityIssues.length === 0 && envFiles.length === 0) {
  report += '✨ **Excellent!** This PR follows all major guidelines and best practices.\n\n';
} else {
  report += '📋 Please address the issues marked with ❌ before requesting final review.\n\n';
}

// Next steps
report += '### 🚀 Next Steps\n\n';
report += '1. Address any ❌ failures and ⚠️ warnings above\n';
report += '2. Ensure all automated tests pass (unit + E2E)\n';
report += '3. Request review from team members\n';
report += '4. Wait for reviewer approval\n\n';

report += '---\n';
report += '*Generated by Danger.js - Automated PR Analysis System*\n';
report += '*For questions about this report, see [PR Requirements Guide](docs/PR_REQUIREMENTS_GUIDE.md)*\n';

markdown(report);

// ============================================================================
// FINAL STATUS
// ============================================================================

const criticalIssues = localImportViolations.length + envFiles.length + securityIssues.length;

if (criticalIssues === 0) {
  message('✅ **All critical checks passed!** This PR is ready for human review.');
} else {
  fail(`❌ **${criticalIssues} critical issue(s) found.** Please address them before merging.`);
}
