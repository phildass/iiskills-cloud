/**
 * PM2 Ecosystem Configuration — Sandbox (newapps/)
 *
 * Runs the same Next.js apps as production but with Supabase/auth/paywall DISABLED.
 * Each app builds from newapps/<app>/ which holds a sandbox-specific .env.local.
 *
 * Usage:
 *   # Build sandbox apps first (from repo root):
 *   yarn sandbox:build
 *
 *   # Start sandbox via PM2:
 *   pm2 start newapps/ecosystem.config.js
 *
 *   # Start a single sandbox app:
 *   pm2 start newapps/ecosystem.config.js --only sandbox-main
 *
 *   # Stop sandbox:
 *   pm2 stop newapps/ecosystem.config.js
 *
 * Ports (same as production — sandbox replaces production when active):
 *   sandbox-main          → :3000  (app.iiskills.cloud)
 *   sandbox-learn-apt     → :3002  (app1.iiskills.cloud / learn-apt.iiskills.cloud)
 *   sandbox-learn-chemistry → :3005
 *   sandbox-learn-developer → :3007
 *   sandbox-learn-geography → :3011
 *   sandbox-learn-management → :3016
 *   sandbox-learn-math    → :3017
 *   sandbox-learn-physics → :3020
 *   sandbox-learn-pr      → :3021
 *   sandbox-learn-ai      → :3024
 */

const path = require('path');

const sandboxRoot = __dirname;

module.exports = {
  apps: [
    {
      name: 'sandbox-main',
      cwd: path.join(sandboxRoot, 'main'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        // Sandbox: disable auth and paywall at process level (server-side)
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, '..', 'logs', 'sandbox-main-error.log'),
      out_file: path.join(__dirname, '..', 'logs', 'sandbox-main-out.log'),
      log_file: path.join(__dirname, '..', 'logs', 'sandbox-main-combined.log'),
      time: true,
    },
    {
      name: 'sandbox-learn-ai',
      cwd: path.join(sandboxRoot, 'learn-ai'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3024,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-ai-error.log'),
      out_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-ai-out.log'),
      log_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-ai-combined.log'),
      time: true,
    },
    {
      name: 'sandbox-learn-apt',
      cwd: path.join(sandboxRoot, 'learn-apt'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-apt-error.log'),
      out_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-apt-out.log'),
      log_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-apt-combined.log'),
      time: true,
    },
    {
      name: 'sandbox-learn-chemistry',
      cwd: path.join(sandboxRoot, 'learn-chemistry'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3005,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-chemistry-error.log'),
      out_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-chemistry-out.log'),
      log_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-chemistry-combined.log'),
      time: true,
    },
    {
      name: 'sandbox-learn-developer',
      cwd: path.join(sandboxRoot, 'learn-developer'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3007,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-developer-error.log'),
      out_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-developer-out.log'),
      log_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-developer-combined.log'),
      time: true,
    },
    {
      name: 'sandbox-learn-geography',
      cwd: path.join(sandboxRoot, 'learn-geography'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3011,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-geography-error.log'),
      out_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-geography-out.log'),
      log_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-geography-combined.log'),
      time: true,
    },
    {
      name: 'sandbox-learn-management',
      cwd: path.join(sandboxRoot, 'learn-management'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3016,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-management-error.log'),
      out_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-management-out.log'),
      log_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-management-combined.log'),
      time: true,
    },
    {
      name: 'sandbox-learn-math',
      cwd: path.join(sandboxRoot, 'learn-math'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3017,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-math-error.log'),
      out_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-math-out.log'),
      log_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-math-combined.log'),
      time: true,
    },
    {
      name: 'sandbox-learn-physics',
      cwd: path.join(sandboxRoot, 'learn-physics'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3020,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-physics-error.log'),
      out_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-physics-out.log'),
      log_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-physics-combined.log'),
      time: true,
    },
    {
      name: 'sandbox-learn-pr',
      cwd: path.join(sandboxRoot, 'learn-pr'),
      script: 'npx',
      args: 'next start',
      interpreter: 'none',
      env: {
        NODE_ENV: 'production',
        PORT: 3021,
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        NEXT_PUBLIC_TESTING_MODE: 'true',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-pr-error.log'),
      out_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-pr-out.log'),
      log_file: path.join(__dirname, '..', 'logs', 'sandbox-learn-pr-combined.log'),
      time: true,
    },
  ],
};
