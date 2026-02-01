/**
 * PM2 Ecosystem Configuration for iiskills-cloud (static)
 *
 * This file lists all requested apps under apps/ with explicit PORTs.
 * - Production env (env_production) sets NODE_ENV=production and PORT.
 * - Development env (env_development) sets convenient dev flags (DO NOT USE in prod).
 *
 * IMPORTANT:
 * - THIS FILE DOES NOT CONTAIN SECRETS. Export production secrets in the shell
 *   (or your host's secret manager) BEFORE starting PM2 in production.
 * - Use `pm2 start ecosystem.config.js --env production` to start with production env.
 * - Use `pm2 start ecosystem.config.js --env development` for local dev convenience (only).
 */

const path = require('path');

module.exports = {
  apps: [
    {
      name: 'iiskills-main',
      cwd: path.resolve(__dirname, 'apps', 'main'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3000'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3000'
      },
      error_file: path.resolve(__dirname, 'logs', 'main-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'main-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'main-combined.log'),
      time: true
    },

    {
      name: 'iiskills-learn-ai',
      cwd: path.resolve(__dirname, 'apps', 'learn-ai'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3001'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3001'
      },
      error_file: path.resolve(__dirname, 'logs', 'learn-ai-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'learn-ai-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'learn-ai-combined.log'),
      time: true
    },

    {
      name: 'iiskills-learn-apt',
      cwd: path.resolve(__dirname, 'apps', 'learn-apt'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3002'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3002'
      },
      error_file: path.resolve(__dirname, 'logs', 'learn-apt-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'learn-apt-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'learn-apt-combined.log'),
      time: true
    },

    {
      name: 'iiskills-learn-management',
      cwd: path.resolve(__dirname, 'apps', 'learn-management'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3003'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3003'
      },
      error_file: path.resolve(__dirname, 'logs', 'learn-management-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'learn-management-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'learn-management-combined.log'),
      time: true
    },

    {
      name: 'iiskills-learn-leadership',
      cwd: path.resolve(__dirname, 'apps', 'learn-leadership'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3004'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3004'
      },
      error_file: path.resolve(__dirname, 'logs', 'learn-leadership-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'learn-leadership-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'learn-leadership-combined.log'),
      time: true
    },

    {
      name: 'iiskills-learn-pr',
      cwd: path.resolve(__dirname, 'apps', 'learn-pr'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3005'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3005'
      },
      error_file: path.resolve(__dirname, 'logs', 'learn-pr-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'learn-pr-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'learn-pr-combined.log'),
      time: true
    },

    {
      name: 'iiskills-learn-cricket',
      cwd: path.resolve(__dirname, 'apps', 'learn-cricket'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3006'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3006'
      },
      error_file: path.resolve(__dirname, 'logs', 'learn-cricket-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'learn-cricket-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'learn-cricket-combined.log'),
      time: true
    },

    {
      name: 'iiskills-learn-math',
      cwd: path.resolve(__dirname, 'apps', 'learn-math'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3007'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3007'
      },
      error_file: path.resolve(__dirname, 'logs', 'learn-math-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'learn-math-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'learn-math-combined.log'),
      time: true
    },

    {
      name: 'iiskills-learn-physics',
      cwd: path.resolve(__dirname, 'apps', 'learn-physics'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3008'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3008'
      },
      error_file: path.resolve(__dirname, 'logs', 'learn-physics-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'learn-physics-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'learn-physics-combined.log'),
      time: true
    },

    {
      name: 'iiskills-learn-chemistry',
      cwd: path.resolve(__dirname, 'apps', 'learn-chemistry'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3009'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3009'
      },
      error_file: path.resolve(__dirname, 'logs', 'learn-chemistry-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'learn-chemistry-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'learn-chemistry-combined.log'),
      time: true
    },

    {
      name: 'iiskills-learn-geography',
      cwd: path.resolve(__dirname, 'apps', 'learn-geography'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3010'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3010'
      },
      error_file: path.resolve(__dirname, 'logs', 'learn-geography-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'learn-geography-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'learn-geography-combined.log'),
      time: true
    },

    {
      name: 'iiskills-learn-winning',
      cwd: path.resolve(__dirname, 'apps', 'learn-winning'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3011'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3011'
      },
      error_file: path.resolve(__dirname, 'logs', 'learn-winning-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'learn-winning-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'learn-winning-combined.log'),
      time: true
    },

    {
      name: 'iiskills-learn-govt-jobs',
      cwd: path.resolve(__dirname, 'apps', 'learn-govt-jobs'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3012'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3012'
      },
      error_file: path.resolve(__dirname, 'logs', 'learn-govt-jobs-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'learn-govt-jobs-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'learn-govt-jobs-combined.log'),
      time: true
    },

    {
      name: 'iiskills-learn-companion',
      cwd: path.resolve(__dirname, 'apps', 'learn-companion'),
      script: 'npm',
      args: 'start',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_development: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_DISABLE_AUTH: 'true',
        NEXT_PUBLIC_SUPABASE_SUSPENDED: 'true',
        PORT: '3023'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: '3023'
      },
      error_file: path.resolve(__dirname, 'logs', 'learn-companion-error.log'),
      out_file: path.resolve(__dirname, 'logs', 'learn-companion-out.log'),
      log_file: path.resolve(__dirname, 'logs', 'learn-companion-combined.log'),
      time: true
    }
  ]
};