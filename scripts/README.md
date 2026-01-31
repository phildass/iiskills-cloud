# Scripts Directory

This directory contains utility scripts for managing the IISKILLS Cloud platform.

## Available Scripts

### AI Content Generation

#### seed_data.js
Generates comprehensive AI/Data Science course content using OpenAI's LLM API.

- **What it does**: Creates 10 modules × 10 lessons with 5-question quizzes
- **Output**: `data/learn-ai-seed.json`
- **Documentation**: See [SEED_DATA_README.md](./SEED_DATA_README.md)

**Usage:**
```bash
# Generate content only
npm run seed:ai-content

# Generate and upload to Supabase
npm run seed:ai-content:upload
```

### Deployment & Validation

### audit-apps.sh

Scans the `apps/` directory and creates an audit file (`apps_audit.txt`) listing any missing expected files or directories.

**Expected structure for each app:**
- `app/` directory
- `public/` directory
- `README.md` (for the main app only)

**Usage:**
```bash
./scripts/audit-apps.sh
```

**Output:**
- Creates `apps_audit.txt` in the repository root
- Lists each app and its missing files/directories

### restore_from_remote.sh

Restores missing files from `origin/main` branch based on the audit file.

**Prerequisites:**
- Must run `audit-apps.sh` first to generate `apps_audit.txt`
- Must have `origin/main` branch available

**Usage:**
```bash
./scripts/restore_from_remote.sh
```

**Behavior:**
- Reads `apps_audit.txt`
- For each missing file/directory, checks if it exists on `origin/main`
- If it exists on remote, restores it using `git checkout origin/main -- <path>`
- If it doesn't exist on remote, skips it with a message
- Reports completion when done

## Example Workflow

```bash
# Step 1: Run the audit
./scripts/audit-apps.sh

# Step 2: Review the audit results
cat apps_audit.txt

# Step 3: Restore missing files from origin/main
./scripts/restore_from_remote.sh

# Step 4: Review what was restored
git status
```

## Notes

- The scripts use `set -euo pipefail` for safer error handling
- Files that don't exist on `origin/main` cannot be restored and will be skipped
- After restoration, use `git status` to review changes before committing
