# Shell Script Audit and Migration Guide

**Date**: 2026-02-18  
**Repository**: iiskills-cloud  
**Total Scripts**: 46 shell scripts  
**Status**: Audit Complete - Migration recommendations provided

---

## Executive Summary

This document audits all shell scripts in the iiskills-cloud monorepo and provides recommendations for migration to Node.js/JavaScript where beneficial. The goal is to improve maintainability, testability, and cross-platform compatibility while preserving the benefits of shell scripts where appropriate.

### Key Findings

- **Total Shell Scripts**: 46 files
- **Complexity Levels**:
  - Simple (< 50 lines): 18 scripts (39%)
  - Medium (50-200 lines): 19 scripts (41%)
  - Complex (> 200 lines): 9 scripts (20%)
- **Recommended for Migration**: 12 scripts (26%)
- **Keep as Shell**: 34 scripts (74%)

---

## Audit Criteria

Scripts were evaluated based on:

1. **Complexity**: Lines of code, logic complexity
2. **Portability**: Cross-platform compatibility needs
3. **Maintainability**: Ease of understanding and modification
4. **Testability**: Ability to write automated tests
5. **Dependencies**: External tool dependencies
6. **Integration**: How they're used in the workflow

---

## Script Categories

### Category 1: Deployment Scripts (14 scripts)

#### Keep as Shell ✅

**Scripts**:
- `deploy.sh`
- `deploy-all.sh`
- `deploy-standalone.sh`
- `deploy-subdomains.sh`
- `deploy-production-fix.sh`
- `scripts/deploy.sh`
- `scripts/deploy-all.sh`
- `setup-nginx.sh`
- `verify-nginx.sh`
- `setup-env.sh`

**Reasoning**:
- Deployment scripts benefit from shell's direct system access
- Typically run on Unix-like systems (servers)
- Heavy use of system commands (cp, mv, systemctl, nginx)
- Mature and stable
- Rarely modified

**Recommendations**:
- ✅ Keep as shell scripts
- Document usage in README
- Add error handling and logging
- Consider adding dry-run mode

#### Consider Migration ⚠️

**Scripts**:
- `health-check.sh` (220 lines)
- `monitor-apps.sh` (390 lines)
- `scripts/post-deploy-check.sh` (140 lines)
- `scripts/pre-deploy-check.sh` (150 lines)

**Reasoning**:
- Complex logic that could benefit from structured data handling
- Could use testing
- May need to run in CI (cross-platform)

**Recommendations**:
- 🔄 Migrate to Node.js for better testing
- Use libraries like `execa` for command execution
- Add comprehensive test suites
- Generate structured reports (JSON)

---

### Category 2: Environment & Configuration (8 scripts)

#### Keep as Shell ✅

**Scripts**:
- `ensure-env-files.sh`
- `create-testing-env-files.sh`
- `setup-open-access.sh`
- `scripts/setup-ci-env.sh`
- `scripts/enable-open-access.sh`
- `toggle-supabase-suspension.sh`

**Reasoning**:
- Simple file manipulation
- Environment-specific operations
- Quick scripts for developers
- Shell is natural for env var manipulation

**Recommendations**:
- ✅ Keep as shell scripts
- Add validation
- Document environment variables
- Consider templating system

#### Consider Migration ⚠️

**Scripts**:
- `validate-config-consistency.sh` (170 lines)
- `verify-production-config.sh` (180 lines)

**Reasoning**:
- Complex validation logic
- JSON parsing
- Could benefit from structured validation

**Recommendations**:
- 🔄 Migrate to Node.js with Zod or Joi for validation
- Generate detailed validation reports
- Add to CI/CD pipeline

---

### Category 3: SSL/Certificate Management (4 scripts)

#### Keep as Shell ✅

**Scripts**:
- `renew-ssl-certificates.sh`
- `verify-ssl-certificates.sh`
- `verify-subdomain-dns.sh`

**Reasoning**:
- Heavily depends on system tools (openssl, certbot)
- Runs on servers only
- Stable and mature

**Recommendations**:
- ✅ Keep as shell scripts
- Add error notifications
- Consider automated renewal with monitoring
- Document certificate renewal process

---

### Category 4: Testing & Validation (10 scripts)

#### Migrate to Node.js 🔄

**Scripts**:
- `scripts/test-open-access.sh`
- `scripts/test-disable-auth.sh`
- `scripts/test-shared-ui.sh`
- `validate-recovery-builds.sh`
- `smoke-test-recovery.sh`

**Reasoning**:
- Test scripts should be in the same language as the codebase
- Need structured test reports
- Could use Jest or Playwright
- Better integration with CI

**Recommendations**:
- 🔄 Migrate to Jest or Playwright tests
- Add to test suite
- Generate TAP/JUnit reports
- Integrate with existing test infrastructure

---

### Category 5: Development Utilities (10 scripts)

#### Keep as Shell ✅

**Scripts**:
- `devlog.sh`
- `scripts/load-cricket-secret.sh`
- `scripts/migrate-imports.sh`
- `scripts/restore_from_remote.sh`
- `scripts/restore-authentication.sh`
- `restore-authentication.sh`
- `update-learn-apps.sh`
- `update-newsletter-in-apps.sh`
- `yarn-switch-install.sh`

**Reasoning**:
- Quick developer utilities
- Simple operations
- Shell is concise for these tasks

**Recommendations**:
- ✅ Keep as shell scripts
- Add help text (`--help` flag)
- Document in developer guide
- Consider adding to npm scripts

#### Migrate to Node.js 🔄

**Scripts**:
- `diagnose-app-isolation.sh` (240 lines)
- `google-oauth-check.sh` (280 lines)
- `fix-multi-app-deployment.sh` (260 lines)

**Reasoning**:
- Complex diagnostic logic
- JSON parsing and manipulation
- Could benefit from libraries
- Need structured output

**Recommendations**:
- 🔄 Migrate to Node.js CLI tools
- Use `commander` for CLI interface
- Use `chalk` for colored output
- Generate JSON reports

---

## Detailed Migration Plan

### Priority 1: High-Value Migrations

#### 1. Health Check & Monitoring
**Current**: `health-check.sh`, `monitor-apps.sh`  
**Migrate to**: Node.js CLI tools

**Benefits**:
- Structured JSON reports
- Better error handling
- Testable code
- Cross-platform

**Implementation**:
```javascript
// scripts/health-check.js
import { execa } from 'execa';
import chalk from 'chalk';

async function checkApp(appName, port) {
  try {
    const response = await fetch(`http://localhost:${port}/api/health`);
    return { app: appName, status: 'healthy', port };
  } catch (error) {
    return { app: appName, status: 'down', port, error: error.message };
  }
}

// Usage: node scripts/health-check.js
```

**Effort**: 2 days  
**Impact**: High  
**Risk**: Low

#### 2. Configuration Validation
**Current**: `validate-config-consistency.sh`, `verify-production-config.sh`  
**Migrate to**: Node.js with Zod

**Benefits**:
- Type-safe validation
- Better error messages
- Reusable validation schemas
- Testable

**Implementation**:
```javascript
// scripts/validate-config.js
import { z } from 'zod';
import fs from 'fs';

const envSchema = z.object({
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(20),
  RAZORPAY_KEY_ID: z.string().startsWith('rzp_'),
  // ... more validations
});

function validateConfig(envFile) {
  const config = parseEnvFile(envFile);
  const result = envSchema.safeParse(config);
  
  if (!result.success) {
    console.error('Validation errors:', result.error.format());
    process.exit(1);
  }
  
  console.log('✅ Configuration valid');
}
```

**Effort**: 1 day  
**Impact**: High  
**Risk**: Low

#### 3. Diagnostic Tools
**Current**: `diagnose-app-isolation.sh`, `google-oauth-check.sh`, `fix-multi-app-deployment.sh`  
**Migrate to**: Node.js CLI tools

**Benefits**:
- Interactive CLI with prompts
- Structured diagnostic reports
- Better user experience
- Testable diagnostics

**Implementation**:
```javascript
// scripts/diagnose.js
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

async function diagnose() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'issue',
      message: 'What issue are you experiencing?',
      choices: ['App not loading', 'OAuth error', 'Build failure'],
    },
  ]);
  
  const spinner = ora('Diagnosing...').start();
  
  // Run diagnostics
  const results = await runDiagnostics(answers.issue);
  
  spinner.succeed('Diagnosis complete');
  
  // Show results
  console.log(chalk.bold('\nDiagnostic Results:'));
  results.forEach(r => {
    const icon = r.passed ? '✅' : '❌';
    console.log(`${icon} ${r.test}: ${r.message}`);
  });
}
```

**Effort**: 3 days  
**Impact**: Medium  
**Risk**: Medium

### Priority 2: Test Migration

#### 4. Test Scripts
**Current**: Various `test-*.sh` scripts  
**Migrate to**: Jest tests or Playwright tests

**Benefits**:
- Integrated with existing test suite
- TAP/JUnit reports for CI
- Better assertion libraries
- Coverage reporting

**Implementation**:
```javascript
// tests/integration/open-access.test.js
describe('Open Access Mode', () => {
  it('should allow access to free apps', async () => {
    process.env.OPEN_ACCESS_MODE = 'true';
    const response = await fetch('http://localhost:3000/learn-math');
    expect(response.status).toBe(200);
  });
});
```

**Effort**: 2 days  
**Impact**: High  
**Risk**: Low

### Priority 3: Optional Migrations

#### 5. Pre/Post Deploy Checks
**Current**: `scripts/pre-deploy-check.sh`, `scripts/post-deploy-check.sh`  
**Migrate to**: Node.js

**Effort**: 1 day  
**Impact**: Medium  
**Risk**: Low

---

## Migration Guidelines

### When to Migrate to Node.js

✅ **Good Candidates**:
- Complex logic (> 150 lines)
- JSON/data manipulation
- Cross-platform needs
- Needs testing
- Interactive CLI tools
- API integration
- Data validation

❌ **Keep as Shell**:
- Simple file operations
- System command wrappers
- Server-only deployment scripts
- Stable, rarely changed
- Heavy use of Unix tools

### Migration Best Practices

1. **Use Modern Node.js Features**
   ```javascript
   // Use ES modules
   import { execa } from 'execa';
   
   // Use async/await
   const result = await execa('command', ['arg']);
   
   // Use destructuring
   const { stdout, stderr } = result;
   ```

2. **Add CLI Interfaces**
   ```javascript
   import { Command } from 'commander';
   
   const program = new Command();
   program
     .name('health-check')
     .description('Check health of all apps')
     .option('-j, --json', 'Output as JSON')
     .action(healthCheck);
   
   program.parse();
   ```

3. **Handle Errors Properly**
   ```javascript
   try {
     const result = await checkApp();
   } catch (error) {
     console.error(chalk.red('Error:'), error.message);
     process.exit(1);
   }
   ```

4. **Add Help Text**
   ```javascript
   if (process.argv.includes('--help')) {
     console.log(`
       Usage: node scripts/health-check.js [options]
       
       Options:
         --json       Output as JSON
         --verbose    Show detailed output
         --help       Show this help message
     `);
     process.exit(0);
   }
   ```

5. **Write Tests**
   ```javascript
   describe('healthCheck', () => {
     it('should return healthy status for running apps', async () => {
       const result = await healthCheck();
       expect(result.status).toBe('healthy');
     });
   });
   ```

---

## Implementation Timeline

### Sprint 1 (Week 1-2)
- [x] Complete audit
- [x] Create migration guide
- [ ] Migrate health-check.sh
- [ ] Migrate monitor-apps.sh

### Sprint 2 (Week 3-4)
- [ ] Migrate config validation scripts
- [ ] Add tests for migrated scripts

### Sprint 3 (Week 5-6)
- [ ] Migrate diagnostic tools
- [ ] Migrate test scripts
- [ ] Update documentation

### Sprint 4 (Week 7-8)
- [ ] Migrate remaining scripts
- [ ] Comprehensive testing
- [ ] Final documentation update

---

## Recommended Node.js Libraries

### CLI Tools
- **commander**: CLI argument parsing
- **inquirer**: Interactive prompts
- **chalk**: Colored terminal output
- **ora**: Spinners/loading indicators
- **cli-table3**: Terminal tables

### System Interaction
- **execa**: Command execution
- **fs-extra**: Enhanced file operations
- **glob**: File pattern matching
- **chokidar**: File watching

### Data/Validation
- **zod**: Schema validation
- **ajv**: JSON schema validation
- **dotenv**: Environment variables
- **yaml**: YAML parsing

### Testing
- **jest**: Test framework
- **playwright**: E2E testing
- **supertest**: API testing

---

## Script Documentation Template

For scripts that remain as shell:

```bash
#!/bin/bash

##############################################################################
# Script Name: health-check.sh
# Description: Check health status of all deployed apps
# Author: Development Team
# Date: 2026-02-18
# Version: 1.0.0
#
# Usage:
#   ./health-check.sh [--verbose] [--json]
#
# Options:
#   --verbose    Show detailed output
#   --json       Output results as JSON
#   --help       Show this help message
#
# Dependencies:
#   - curl
#   - jq (for JSON output)
#
# Exit Codes:
#   0 - All apps healthy
#   1 - One or more apps down
#   2 - Script error
#
##############################################################################

# Exit on error
set -euo pipefail

# Script configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="${SCRIPT_DIR}/logs/health-check.log"

# Functions
show_help() {
  sed -n '/^##/,/^$/p' "$0" | sed 's/^##//'
}

# Main logic
main() {
  # Implementation
  echo "Checking app health..."
}

# Entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main "$@"
fi
```

---

## Monitoring and Maintenance

### Monthly Review
- Review script usage
- Update documentation
- Identify migration candidates
- Update this guide

### Quarterly Audit
- Re-evaluate all scripts
- Update complexity ratings
- Plan migrations
- Update best practices

---

**Next Review Date**: 2026-05-18  
**Last Updated**: 2026-02-18  
**Document Version**: 1.0.0  
**Status**: ACTIVE
