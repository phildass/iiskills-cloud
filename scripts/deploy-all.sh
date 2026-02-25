#!/usr/bin/env bash
# scripts/deploy-all.sh
#
# DEPRECATED WRAPPER — do NOT run this directly.
# The canonical deployment entrypoint is ./deploy-all.sh at the repository root.
# This file exists only for backward compatibility with any tooling that invokes
# scripts/deploy-all.sh; it simply delegates to the root entrypoint.
#
# Usage:
#   ./deploy-all.sh           ← preferred
#   ./scripts/deploy-all.sh   ← calls the same script
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "⚠️  Note: scripts/deploy-all.sh is a thin wrapper. Delegating to ${REPO_ROOT}/deploy-all.sh"
exec "${REPO_ROOT}/deploy-all.sh" "$@"
