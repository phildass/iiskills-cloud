/**
 * PM2 Ecosystem Configuration — Historical Sandbox (newapps/)
 *
 * ⚠️  HISTORICAL / DEPRECATED — This config is kept for reference only.
 *
 * The active staging environment is now served from apps/ via ecosystem.config.js
 * and is accessible at https://app.iiskills.cloud (staging).
 * Production cutover to https://iiskills.cloud is a DNS + Nginx flip.
 *
 * This file previously pointed at the newapps/ sandbox directory.  The
 * "sandbox" / newapps concept has been superseded by the apps/ monorepo
 * build as the current staging environment.
 *
 * Usage:
 *   # Build sandbox apps first (from repo root):
 *   yarn sandbox:build
 *
 *   # Start sandbox via PM2:
 *   pm2 start ecosystem.newapps.config.js
 *
 *   # Start a single sandbox app:
 *   pm2 start ecosystem.newapps.config.js --only sandbox-main
 *
 *   # Stop sandbox:
 *   pm2 stop ecosystem.newapps.config.js
 *
 * Ports (same as production — sandbox replaces production when active):
 *   sandbox-main             → :3000  (app.iiskills.cloud)
 *   sandbox-learn-apt        → :3002  (app1.iiskills.cloud / learn-apt.iiskills.cloud)
 *   sandbox-learn-chemistry  → :3005
 *   sandbox-learn-developer  → :3007
 *   sandbox-learn-geography  → :3011
 *   sandbox-learn-management → :3016
 *   sandbox-learn-math       → :3017
 *   sandbox-learn-physics    → :3020
 *   sandbox-learn-pr         → :3021
 *   sandbox-learn-ai         → :3024
 *
 * ─── Sandbox Supabase (optional) ───────────────────────────────────────────────
 * To point the sandbox at a dedicated (non-production) Supabase project, export
 * the following variables in the server environment BEFORE running pm2 start and
 * BEFORE running `yarn sandbox:build`:
 *
 *   export SANDBOX_SUPABASE_URL=https://<sandbox-project-ref>.supabase.co
 *   export SANDBOX_SUPABASE_ANON_KEY=<sandbox-anon-key>
 *   export SANDBOX_SUPABASE_SERVICE_ROLE_KEY=<sandbox-service-role-key>  # server-only
 *
 * When these are set:
 *   • NEXT_PUBLIC_SUPABASE_URL / ANON_KEY are forwarded to every sandbox app
 *   • NEXT_PUBLIC_SUPABASE_SUSPENDED is set to "false" (live Supabase used)
 *   • SUPABASE_SERVICE_ROLE_KEY is forwarded for server-side API routes
 *
 * When they are NOT set (default):
 *   • Apps run fully offline — NEXT_PUBLIC_SUPABASE_SUSPENDED stays "true"
 *   • A mock Supabase client is used; no real credentials are needed
 *
 * Recommended: add them to /etc/profile.d/sandbox-supabase.sh on the server
 * so they survive reboots and are picked up by the deploy script.
 * See newapps/README.md for full setup instructions.
 * ───────────────────────────────────────────────────────────────────────────────
 */

const path = require('path');

const sandboxRoot = path.join(__dirname, 'newapps');

// ---------------------------------------------------------------------------
// Sandbox Supabase env vars — read from the server environment at PM2 start
// time.  No secrets are hardcoded here; they must be exported in the shell.
// ---------------------------------------------------------------------------
const SANDBOX_SUPABASE_URL = process.env.SANDBOX_SUPABASE_URL || '';
const SANDBOX_SUPABASE_ANON_KEY = process.env.SANDBOX_SUPABASE_ANON_KEY || '';
const SANDBOX_SUPABASE_SERVICE_ROLE_KEY = process.env.SANDBOX_SUPABASE_SERVICE_ROLE_KEY || '';

// True only when both public credentials are provided
const useLiveSupabase = !!(SANDBOX_SUPABASE_URL && SANDBOX_SUPABASE_ANON_KEY);

/**
 * Returns the Supabase-related env vars to inject into each PM2 app.
 * When sandbox credentials are present they override the placeholder defaults
 * baked into each app's .env.local at build time (Next.js respects process.env
 * over .env.local for variables already set in the environment).
 */
function sandboxSupabaseEnv() {
  if (useLiveSupabase) {
    return {
      NEXT_PUBLIC_SUPABASE_URL: SANDBOX_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: SANDBOX_SUPABASE_ANON_KEY,
      NEXT_PUBLIC_SUPABASE_SUSPENDED: 'false',
      ...(SANDBOX_SUPABASE_SERVICE_ROLE_KEY && {
        SUPABASE_SERVICE_ROLE_KEY: SANDBOX_SUPABASE_SERVICE_ROLE_KEY,
      }),
    };
  }
  // Default: keep Supabase suspended (mock client, no real credentials needed)
  return { NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true' };
}

module.exports = {
  apps: [
    {
      name: 'iiskills-main',
      cwd: path.join(sandboxRoot, 'main'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
        NEXT_PUBLIC_DISABLE_ADMIN_GATE: 'true',
        ...sandboxSupabaseEnv(),
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'sandbox-main-error.log'),
      out_file: path.join(__dirname, 'logs', 'sandbox-main-out.log'),
      log_file: path.join(__dirname, 'logs', 'sandbox-main-combined.log'),
      time: true,
    },
    {
      name: 'iiskills-learn-ai',
      cwd: path.join(sandboxRoot, 'learn-ai'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3024,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
        ...sandboxSupabaseEnv(),
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'sandbox-learn-ai-error.log'),
      out_file: path.join(__dirname, 'logs', 'sandbox-learn-ai-out.log'),
      log_file: path.join(__dirname, 'logs', 'sandbox-learn-ai-combined.log'),
      time: true,
    },
    {
      name: 'iiskills-learn-apt',
      cwd: path.join(sandboxRoot, 'learn-apt'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
        ...sandboxSupabaseEnv(),
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'sandbox-learn-apt-error.log'),
      out_file: path.join(__dirname, 'logs', 'sandbox-learn-apt-out.log'),
      log_file: path.join(__dirname, 'logs', 'sandbox-learn-apt-combined.log'),
      time: true,
    },
    {
      name: 'iiskills-learn-chemistry',
      cwd: path.join(sandboxRoot, 'learn-chemistry'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
        ...sandboxSupabaseEnv(),
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'sandbox-learn-chemistry-error.log'),
      out_file: path.join(__dirname, 'logs', 'sandbox-learn-chemistry-out.log'),
      log_file: path.join(__dirname, 'logs', 'sandbox-learn-chemistry-combined.log'),
      time: true,
    },
    {
      name: 'iiskills-learn-developer',
      cwd: path.join(sandboxRoot, 'learn-developer'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3007,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
        ...sandboxSupabaseEnv(),
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'sandbox-learn-developer-error.log'),
      out_file: path.join(__dirname, 'logs', 'sandbox-learn-developer-out.log'),
      log_file: path.join(__dirname, 'logs', 'sandbox-learn-developer-combined.log'),
      time: true,
    },
    {
      name: 'iiskills-learn-geography',
      cwd: path.join(sandboxRoot, 'learn-geography'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3011,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
        ...sandboxSupabaseEnv(),
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'sandbox-learn-geography-error.log'),
      out_file: path.join(__dirname, 'logs', 'sandbox-learn-geography-out.log'),
      log_file: path.join(__dirname, 'logs', 'sandbox-learn-geography-combined.log'),
      time: true,
    },
    {
      name: 'iiskills-learn-management',
      cwd: path.join(sandboxRoot, 'learn-management'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3016,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
        ...sandboxSupabaseEnv(),
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'sandbox-learn-management-error.log'),
      out_file: path.join(__dirname, 'logs', 'sandbox-learn-management-out.log'),
      log_file: path.join(__dirname, 'logs', 'sandbox-learn-management-combined.log'),
      time: true,
    },
    {
      name: 'iiskills-learn-math',
      cwd: path.join(sandboxRoot, 'learn-math'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3017,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
        ...sandboxSupabaseEnv(),
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'sandbox-learn-math-error.log'),
      out_file: path.join(__dirname, 'logs', 'sandbox-learn-math-out.log'),
      log_file: path.join(__dirname, 'logs', 'sandbox-learn-math-combined.log'),
      time: true,
    },
    {
      name: 'iiskills-learn-physics',
      cwd: path.join(sandboxRoot, 'learn-physics'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3020,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
        ...sandboxSupabaseEnv(),
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'sandbox-learn-physics-error.log'),
      out_file: path.join(__dirname, 'logs', 'sandbox-learn-physics-out.log'),
      log_file: path.join(__dirname, 'logs', 'sandbox-learn-physics-combined.log'),
      time: true,
    },
    {
      name: 'iiskills-learn-pr',
      cwd: path.join(sandboxRoot, 'learn-pr'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3021,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
        ...sandboxSupabaseEnv(),
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'sandbox-learn-pr-error.log'),
      out_file: path.join(__dirname, 'logs', 'sandbox-learn-pr-out.log'),
      log_file: path.join(__dirname, 'logs', 'sandbox-learn-pr-combined.log'),
      time: true,
    },
  ],
};
