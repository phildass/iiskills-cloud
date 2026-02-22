#!/usr/bin/env bash
# =============================================================================
# scripts/preflight-main.sh
#
# Pre-flight checks for iiskills-main (apps/main) deployments.
#
# Checks:
#   - Node version (>=18)
#   - Yarn version (>=4)
#   - Required environment variables based on TEST_ADMIN_MODE
#   - Optionally checks that port 3000 is either free or already occupied by PM2
#
# Usage:
#   bash scripts/preflight-main.sh          # normal / prod mode
#   TEST_ADMIN_MODE=true bash scripts/preflight-main.sh  # test-admin mode
#
# Exit codes:
#   0 — all checks passed
#   1 — one or more checks failed
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Colours
# ---------------------------------------------------------------------------
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

pass()  { echo -e "  ${GREEN}✓${NC} $*"; }
fail()  { echo -e "  ${RED}✗${NC} $*"; ERRORS=$((ERRORS + 1)); }
warn()  { echo -e "  ${YELLOW}⚠${NC}  $*"; WARNINGS=$((WARNINGS + 1)); }

echo ""
echo -e "${BOLD}${CYAN}========================================${NC}"
echo -e "${BOLD}${CYAN} iiskills-main Pre-flight Check${NC}"
echo -e "${BOLD}${CYAN}========================================${NC}"
echo ""

# ---------------------------------------------------------------------------
# 1. Node version
# ---------------------------------------------------------------------------
echo -e "${CYAN}1. Node.js version${NC}"
if ! command -v node &>/dev/null; then
  fail "node not found"
else
  NODE_VERSION=$(node --version | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
  if [ "$NODE_MAJOR" -ge 18 ]; then
    pass "node v${NODE_VERSION} (>=18)"
  else
    fail "node v${NODE_VERSION} — require >=18"
  fi
fi
echo ""

# ---------------------------------------------------------------------------
# 2. Yarn version
# ---------------------------------------------------------------------------
echo -e "${CYAN}2. Yarn version${NC}"
if ! command -v yarn &>/dev/null; then
  fail "yarn not found"
else
  YARN_VERSION=$(yarn --version 2>/dev/null || echo "0.0.0")
  YARN_MAJOR=$(echo "$YARN_VERSION" | cut -d. -f1)
  if [ "$YARN_MAJOR" -ge 4 ]; then
    pass "yarn v${YARN_VERSION} (>=4)"
  else
    warn "yarn v${YARN_VERSION} — recommend upgrading to >=4 (berry)"
  fi
fi
echo ""

# ---------------------------------------------------------------------------
# 3. Required environment variables
# ---------------------------------------------------------------------------
echo -e "${CYAN}3. Environment variables${NC}"

# Detect TEST_ADMIN_MODE — check both the exported env and the .env.local of apps/main
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_LOCAL="${REPO_ROOT}/apps/main/.env.local"

# Helper: resolve an env var from the caller's environment first, then .env.local.
# Usage: resolve_env VAR_NAME
resolve_env() {
  local var_name="$1"
  local value="${!var_name:-}"
  if [ -z "$value" ] && [ -f "$ENV_LOCAL" ]; then
    value=$(grep -E "^${var_name}=" "$ENV_LOCAL" | cut -d= -f2- | tr -d '"' | tr -d "'" || true)
  fi
  echo "$value"
}

# Read TEST_ADMIN_MODE from environment (caller may export it) or from .env.local
EFFECTIVE_TEST_MODE="$(resolve_env TEST_ADMIN_MODE)"

if [ "${EFFECTIVE_TEST_MODE}" = "true" ]; then
  echo "  Mode: TEST_ADMIN_MODE=true"

  # ADMIN_SESSION_SIGNING_KEY is required in test mode
  KEY_VALUE="$(resolve_env ADMIN_SESSION_SIGNING_KEY)"
  if [ -n "$KEY_VALUE" ]; then
    pass "ADMIN_SESSION_SIGNING_KEY is set"
  else
    fail "ADMIN_SESSION_SIGNING_KEY is required in TEST_ADMIN_MODE (sign admin JWT)"
  fi

  # ADMIN_PANEL_SECRET is optional in test mode (fallback: iiskills123) — warn if default
  SECRET_VALUE="$(resolve_env ADMIN_PANEL_SECRET)"
  if [ -z "$SECRET_VALUE" ] || [ "$SECRET_VALUE" = "iiskills123" ] || [ "$SECRET_VALUE" = "change-me-to-a-strong-random-secret" ]; then
    warn "ADMIN_PANEL_SECRET not set or is default 'iiskills123' — OK only in test, NOT for production"
  else
    pass "ADMIN_PANEL_SECRET is set (non-default)"
  fi

else
  echo "  Mode: PRODUCTION (TEST_ADMIN_MODE not set or false)"

  # In production, forbid default passphrase
  SECRET_VALUE="$(resolve_env ADMIN_PANEL_SECRET)"
  if [ -z "$SECRET_VALUE" ]; then
    fail "ADMIN_PANEL_SECRET is not configured (required in production)"
  elif [ "$SECRET_VALUE" = "iiskills123" ] || [ "$SECRET_VALUE" = "change-me-to-a-strong-random-secret" ]; then
    fail "ADMIN_PANEL_SECRET is the default 'iiskills123' — MUST be changed for production"
  else
    pass "ADMIN_PANEL_SECRET is set (non-default)"
  fi

  # ADMIN_SESSION_SIGNING_KEY required
  KEY_VALUE="$(resolve_env ADMIN_SESSION_SIGNING_KEY)"
  if [ -n "$KEY_VALUE" ]; then
    pass "ADMIN_SESSION_SIGNING_KEY is set"
  else
    fail "ADMIN_SESSION_SIGNING_KEY is required in production"
  fi

  # Guard: Supabase URL and anon key must be present in production
  SUPABASE_URL_VALUE="$(resolve_env NEXT_PUBLIC_SUPABASE_URL)"
  if [ -n "$SUPABASE_URL_VALUE" ] && [ "$SUPABASE_URL_VALUE" != "your-project-url-here" ]; then
    pass "NEXT_PUBLIC_SUPABASE_URL is set"
  else
    fail "NEXT_PUBLIC_SUPABASE_URL is required in production (Supabase auth path)"
  fi

  SUPABASE_ANON_VALUE="$(resolve_env NEXT_PUBLIC_SUPABASE_ANON_KEY)"
  if [ -n "$SUPABASE_ANON_VALUE" ] && [ "$SUPABASE_ANON_VALUE" != "your-anon-key-here" ]; then
    pass "NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
  else
    fail "NEXT_PUBLIC_SUPABASE_ANON_KEY is required in production"
  fi
fi
echo ""

# ---------------------------------------------------------------------------
# 4. Port 3000 check (optional / informational)
# ---------------------------------------------------------------------------
echo -e "${CYAN}4. Port 3000 status${NC}"
if command -v ss &>/dev/null; then
  if ss -tlnp 2>/dev/null | grep -q ':3000 '; then
    pass "Port 3000 is in use (likely iiskills-main is already running)"
  else
    warn "Port 3000 is free — iiskills-main is not currently running"
  fi
elif command -v netstat &>/dev/null; then
  if netstat -tlnp 2>/dev/null | grep -q ':3000 '; then
    pass "Port 3000 is in use"
  else
    warn "Port 3000 is free"
  fi
else
  warn "Cannot check port 3000 (ss/netstat not available)"
fi
echo ""

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
echo -e "${BOLD}${CYAN}========================================${NC}"
if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
  echo -e "${GREEN}${BOLD}✅ All pre-flight checks passed!${NC}"
  exit 0
elif [ "$ERRORS" -eq 0 ]; then
  echo -e "${YELLOW}${BOLD}⚠  Pre-flight passed with ${WARNINGS} warning(s)${NC}"
  exit 0
else
  echo -e "${RED}${BOLD}❌ Pre-flight FAILED — ${ERRORS} error(s), ${WARNINGS} warning(s)${NC}"
  echo -e "${RED}Fix the errors above before deploying.${NC}"
  exit 1
fi
