# How to Apply the Conflict Resolution to PR #347

## Current Situation
- **PR #347** is on branch `copilot/cleanup-apps-directory` (has merge conflicts)
- **This branch** (`copilot/resolve-pr-347-conflicts`) contains the resolved changes

## Option 1: Update PR #347 Base (Recommended)
Since the conflicts are resolved in this branch, you can:

1. **Close PR #347** or mark it as superseded
2. **Create a new PR** from `copilot/resolve-pr-347-conflicts` → `main`
   - This PR already has the conflicts resolved
   - It includes all changes from PR #347 plus the SendGrid migration from PR #346

## Option 2: Force Update PR #347 Branch
If you have write access to the `copilot/cleanup-apps-directory` branch:

```bash
# Backup the original branch first
git branch backup/cleanup-apps-directory copilot/cleanup-apps-directory

# Force update with resolved changes
git checkout copilot/cleanup-apps-directory
git reset --hard copilot/resolve-pr-347-conflicts
git push --force origin copilot/cleanup-apps-directory
```

⚠️ **Warning**: This rewrites history. Only do this if no one else is working on that branch.

## Option 3: Merge This Branch to Main
Simply merge this branch (`copilot/resolve-pr-347-conflicts`) to main, which effectively applies the resolved changes:

```bash
git checkout main
git merge copilot/resolve-pr-347-conflicts
git push origin main
```

Then close PR #347 as resolved via this branch.

## What's Included
This branch contains:
- ✅ All changes from PR #347 (move learn-biology to apps-backup)
- ✅ SendGrid configuration from PR #346 (already in main)
- ✅ Proper conflict resolution between the two PRs
- ✅ Documentation of the resolution process

## Verification Commands
```bash
# Verify learn-biology moved to apps-backup
ls apps-backup/learn-biology/

# Verify SendGrid configuration (not Resend)
grep -i "sendgrid\|resend" apps-backup/learn-biology/.env.local.example

# Verify 10 active apps
ls apps/ | wc -l

# Check all configuration updates
git diff main...copilot/resolve-pr-347-conflicts --stat
```

## Recommended Next Steps
1. Review the changes in `copilot/resolve-pr-347-conflicts`
2. Choose one of the options above to apply the resolution
3. Test the build and deployment with 10 active apps
4. Close or update PR #347 accordingly
