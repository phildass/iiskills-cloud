#!/usr/bin/env bash
# sandbox-health-check.sh
#
# Standalone CLI health check — confirms the sandbox is connected to the
# intended Supabase project without requiring a running Next.js server.
#
# Usage (run from repo root or anywhere):
#   ./scripts/sandbox-health-check.sh
#
# Or check a live Next.js sandbox via the HTTP endpoint:
#   BASE_URL=http://localhost:3000 ./scripts/sandbox-health-check.sh
#
# Environment variables read:
#   SANDBOX_SUPABASE_URL            — sandbox project URL
#   SANDBOX_SUPABASE_ANON_KEY       — sandbox anon key
#   SANDBOX_SUPABASE_SERVICE_ROLE_KEY — (optional) service-role key
#   BASE_URL                        — base URL of a running sandbox app (optional)

set -euo pipefail

BOLD='\033[1m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
RESET='\033[0m'

ok()   { echo -e "${GREEN}  ✓${RESET} $*"; }
warn() { echo -e "${YELLOW}  ⚠${RESET} $*"; }
fail() { echo -e "${RED}  ✗${RESET} $*"; }

echo ""
echo -e "${BOLD}══════════════════════════════════════════${RESET}"
echo -e "${BOLD}  Sandbox Supabase Health Check${RESET}"
echo -e "${BOLD}══════════════════════════════════════════${RESET}"
echo ""

# ── 1. Check env vars ────────────────────────────────────────────────────────
SUPABASE_URL="${SANDBOX_SUPABASE_URL:-}"
ANON_KEY="${SANDBOX_SUPABASE_ANON_KEY:-}"
SRK="${SANDBOX_SUPABASE_SERVICE_ROLE_KEY:-}"

if [[ -z "$SUPABASE_URL" || -z "$ANON_KEY" ]]; then
  warn "SANDBOX_SUPABASE_URL or SANDBOX_SUPABASE_ANON_KEY is not set."
  echo -e "     Sandbox will run in ${BOLD}suspended (mock) mode${RESET} — no real Supabase connection."
  echo ""
  echo "  To connect to a sandbox Supabase project, export:"
  echo "     export SANDBOX_SUPABASE_URL=https://<ref>.supabase.co"
  echo "     export SANDBOX_SUPABASE_ANON_KEY=<anon-key>"
  echo "     export SANDBOX_SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # optional"
  echo ""
  echo "  See newapps/README.md for full setup instructions."
  echo ""
  exit 0
fi

# Extract hostname safely
HOSTNAME=$(python3 -c "from urllib.parse import urlparse; print(urlparse('${SUPABASE_URL}').hostname)" 2>/dev/null || echo "(parse error)")

ok "SANDBOX_SUPABASE_URL   → ${SUPABASE_URL}"
ok "Supabase hostname       → ${HOSTNAME}"
ok "SANDBOX_SUPABASE_ANON_KEY is set (${#ANON_KEY} chars)"
if [[ -n "$SRK" ]]; then
  ok "SANDBOX_SUPABASE_SERVICE_ROLE_KEY is set (${#SRK} chars)"
else
  warn "SANDBOX_SUPABASE_SERVICE_ROLE_KEY is NOT set (server-only APIs may be limited)"
fi

echo ""

# ── 2. Lightweight REST API ping ─────────────────────────────────────────────
REST_URL="${SUPABASE_URL}/rest/v1/profiles?select=id&limit=1"

echo "  Pinging Supabase REST API…"
HTTP_STATUS=$(curl -s -o /tmp/_sandbox_health_body.json -w "%{http_code}" \
  -H "apikey: ${ANON_KEY}" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  "${REST_URL}" 2>/dev/null || echo "000")

if [[ "$HTTP_STATUS" == "200" ]]; then
  ok "REST query succeeded (HTTP ${HTTP_STATUS})"
elif [[ "$HTTP_STATUS" == "401" ]]; then
  fail "REST query returned 401 — anon key may be wrong or RLS is blocking access"
  echo "     Raw response: $(cat /tmp/_sandbox_health_body.json 2>/dev/null)"
elif [[ "$HTTP_STATUS" == "000" ]]; then
  fail "Could not reach ${SUPABASE_URL} — check URL and network connectivity"
else
  warn "Unexpected HTTP status: ${HTTP_STATUS}"
  echo "     Raw response: $(cat /tmp/_sandbox_health_body.json 2>/dev/null)"
fi

rm -f /tmp/_sandbox_health_body.json

echo ""

# ── 3. Optional: check running Next.js endpoint ──────────────────────────────
BASE_URL="${BASE_URL:-}"
if [[ -n "$BASE_URL" ]]; then
  ENDPOINT="${BASE_URL}/api/sandbox-health"
  echo "  Checking running app at ${ENDPOINT}…"
  APP_STATUS=$(curl -s -o /tmp/_app_health_body.json -w "%{http_code}" "${ENDPOINT}" 2>/dev/null || echo "000")
  if [[ "$APP_STATUS" == "200" ]]; then
    ok "App endpoint returned HTTP 200"
    APP_HOSTNAME=$(python3 -c "import json,sys; d=json.load(open('/tmp/_app_health_body.json')); print(d.get('supabaseHostname','?'))" 2>/dev/null || echo "?")
    APP_MODE=$(python3 -c "import json,sys; d=json.load(open('/tmp/_app_health_body.json')); print(d.get('mode','?'))" 2>/dev/null || echo "?")
    ok "App sees supabaseHostname=${APP_HOSTNAME}, mode=${APP_MODE}"
  else
    warn "App endpoint returned HTTP ${APP_STATUS} — is the sandbox running?"
  fi
  rm -f /tmp/_app_health_body.json
  echo ""
fi

echo -e "${BOLD}══════════════════════════════════════════${RESET}"
ok "Sandbox Supabase health check complete."
echo ""
