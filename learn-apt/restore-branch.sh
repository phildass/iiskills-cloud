#!/bin/bash
# Script to restore the copilot/check-module-question-distribution branch
# This branch was merged in PR #15 but deleted afterwards
# 
# Usage: ./restore-branch.sh
#
# Prerequisites: 
#   - Git repository cloned
#   - Proper push permissions to the repository

set -e

BRANCH_NAME="copilot/check-module-question-distribution"
COMMIT_SHA="e8c240fecd30051b0244efc09e060ebf76ac97e9"

echo "Restoring branch: $BRANCH_NAME"
echo "At commit: $COMMIT_SHA"

# Fetch the commit if not already present
echo "Fetching from remote..."
git fetch origin

# Create the branch at the specific commit
echo "Creating branch locally..."
git branch "$BRANCH_NAME" "$COMMIT_SHA" 2>/dev/null || echo "Branch already exists locally"

# Push the branch to origin
echo "Pushing branch to remote..."
git push origin "$BRANCH_NAME":"$BRANCH_NAME"

echo "✓ Branch $BRANCH_NAME has been restored to the remote repository"
echo "✓ Commit SHA: $COMMIT_SHA"
