#!/usr/bin/env bash
set -euo pipefail

# Usage: scripts/workspace-install-build.sh <workspaceNameOrPath> [production|dev]
# Examples:
#   scripts/workspace-install-build.sh learn-math
#   scripts/workspace-install-build.sh apps/learn-math production
#   scripts/workspace-install-build.sh learn-ai dev
#
# This script performs workspace-focused install and build:
# - Enables Corepack if needed (for Yarn Berry)
# - Detects Yarn version (Berry v2+ vs Classic v1)
# - Uses "yarn workspaces focus" for Yarn v2+ (efficient workspace-only install)
# - Falls back to root install for Yarn v1
# - Runs the workspace's build script
# - Compatible with CI and local development

WORKSPACE_ARG="${1:-}"
MODE="${2:-production}"

if [ -z "$WORKSPACE_ARG" ]; then
  echo "Error: workspace name or path required"
  echo "Usage: $0 <workspaceName|workspacePath> [production|dev]"
  exit 1
fi

# Normalize workspace path
if [[ "$WORKSPACE_ARG" == apps/* ]]; then
  WORKSPACE_PATH="$WORKSPACE_ARG"
  WORKSPACE_NAME=$(basename "$WORKSPACE_ARG")
else
  WORKSPACE_NAME="$WORKSPACE_ARG"
  WORKSPACE_PATH="apps/$WORKSPACE_NAME"
fi

echo "========================================="
echo "Workspace: $WORKSPACE_NAME"
echo "Path: $WORKSPACE_PATH"
echo "Mode: $MODE"
echo "========================================="

# Check if workspace exists
if [ ! -d "$WORKSPACE_PATH" ]; then
  echo "Error: workspace directory not found: $WORKSPACE_PATH"
  exit 1
fi

if [ ! -f "$WORKSPACE_PATH/package.json" ]; then
  echo "Error: package.json not found in $WORKSPACE_PATH"
  exit 1
fi

# Enable Corepack if available (for Yarn Berry/modern versions)
if command -v corepack &> /dev/null; then
  echo "Enabling Corepack for package manager..."
  corepack enable || true
fi

# Detect Yarn version
YARN_VERSION=$(yarn --version 2>/dev/null || echo "unknown")
echo "Detected Yarn version: $YARN_VERSION"

# Determine if Yarn supports workspaces focus (Yarn v2+)
YARN_MAJOR_VERSION=$(echo "$YARN_VERSION" | cut -d. -f1)
SUPPORTS_FOCUS=false

if [ "$YARN_MAJOR_VERSION" -ge 2 ] 2>/dev/null; then
  SUPPORTS_FOCUS=true
elif [ "$YARN_VERSION" = "unknown" ]; then
  echo "Warning: Could not detect Yarn version, assuming v1 fallback"
  SUPPORTS_FOCUS=false
fi

echo "Supports 'yarn workspaces focus': $SUPPORTS_FOCUS"

# Install dependencies
echo ""
echo "Installing dependencies..."
if [ "$SUPPORTS_FOCUS" = true ]; then
  echo "Using Yarn workspaces focus (efficient workspace-only install)"
  if [ "$MODE" = "production" ]; then
    yarn workspaces focus "$WORKSPACE_NAME" --production
  else
    yarn workspaces focus "$WORKSPACE_NAME"
  fi
else
  echo "Using Yarn v1 fallback (root install)"
  if [ "$MODE" = "production" ]; then
    yarn install --frozen-lockfile --production
  else
    yarn install --frozen-lockfile
  fi
fi

# Build the workspace
echo ""
echo "Building workspace: $WORKSPACE_NAME"
cd "$WORKSPACE_PATH"

# Check if build script exists
if ! grep -q '"build"' package.json 2>/dev/null; then
  echo "Warning: No build script found in package.json, skipping build"
  exit 0
fi

# Run build
yarn build

echo ""
echo "✓ Build complete for $WORKSPACE_NAME"

# Verify build output
if [ -d ".next" ]; then
  echo "✓ Next.js build output: .next/"
  du -sh .next
elif [ -d "build" ]; then
  echo "✓ Build output: build/"
  du -sh build
elif [ -d "dist" ]; then
  echo "✓ Build output: dist/"
  du -sh dist
else
  echo "⚠ No standard build output directory found"
fi
