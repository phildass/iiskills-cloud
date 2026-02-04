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
# Generate content
npm run seed:ai-content

# To upload to Supabase, set env vars before running:
# SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=... npm run seed:ai-content
```

### Deployment & Validation

#### deploy-all.sh

Complete automated deployment script with comprehensive logging and health checks.

**What it does:**
- Pulls latest code from origin/main
- Installs dependencies with yarn
- Runs pre-deployment checks (builds all apps)
- Restarts all PM2 processes
- Performs health checks on all 13 applications
- Logs deployment to devlog and timestamped log file

**Features:**
- Timestamped log files at `/tmp/deploy-all-{timestamp}.log`
- Exit on error with detailed logging (set -euo pipefail)
- Can run in detached tmux sessions for long deployments
- Health check retries with timeout
- Comprehensive status reporting

**Usage:**

```bash
# Simple deployment from repository root
./scripts/deploy-all.sh

# Run in detached tmux session for production deployments
tmux new-session -d -s deploy './scripts/deploy-all.sh'

# Monitor the deployment
tmux attach -t deploy

# Or check the log file (find latest)
tail -f /tmp/deploy-all-*.log

# Detach from tmux session without stopping it
# Press: Ctrl+b, then d
```

**Detached Tmux Workflow (Recommended for Production):**

This workflow allows deployment to continue even if SSH connection drops:

```bash
# 1. Start deployment in detached tmux session
tmux new-session -d -s deploy './scripts/deploy-all.sh'

# 2. Check if session is running
tmux list-sessions

# 3. Attach to watch progress (optional)
tmux attach -t deploy

# 4. Detach without stopping (Ctrl+b, then d)
# or close your terminal - deployment continues

# 5. Re-attach later to check status
tmux attach -t deploy

# 6. View log file at any time
LOG_FILE=$(ls -t /tmp/deploy-all-*.log | head -1)
tail -f "$LOG_FILE"

# 7. Kill session when done (if needed)
tmux kill-session -t deploy
```

**Output:**
- Creates `/tmp/deploy-all-YYYYMMDD-HHMMSS.log` with full deployment log
- Appends deployment record to `./devlog`
- Returns exit code 0 on success, 1 on failure

**Prerequisites:**
- Must be run from repository root
- Requires PM2 to be configured
- All apps must be in ecosystem.config.js

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
