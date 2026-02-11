/**
 * PM2 Ecosystem Configuration for Next.js Apps
 * 
 * This configuration uses `npx next start` for Next.js 16+ apps.
 * 
 * Prerequisites:
 *   1. Build all apps: yarn build (from root)
 *   2. Ensure .env.local files exist in each app directory
 * 
 * Usage:
 *   pm2 start ecosystem.config.js          # Start all apps
 *   pm2 start ecosystem.config.js --only <app-name>  # Start specific app
 *   pm2 stop all                           # Stop all apps
 *   pm2 restart all                        # Restart all apps
 *   pm2 logs                               # View logs
 *   pm2 monit                              # Monitor processes
 */

const path = require('path');

module.exports = {
  "apps": [
    {
      "name": "iiskills-main",
      "cwd": path.join(__dirname, 'apps/main'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3000
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'main-error.log'),
      "out_file": path.join(__dirname, 'logs', 'main-out.log'),
      "log_file": path.join(__dirname, 'logs', 'main-combined.log'),
      "time": true
    },
    {
      "name": "iiskills-learn-ai",
      "cwd": path.join(__dirname, 'apps/learn-ai'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3024
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'learn-ai-error.log'),
      "out_file": path.join(__dirname, 'logs', 'learn-ai-out.log'),
      "log_file": path.join(__dirname, 'logs', 'learn-ai-combined.log'),
      "time": true
    },
    {
      "name": "iiskills-learn-apt",
      "cwd": path.join(__dirname, 'apps/learn-apt'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3002
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'learn-apt-error.log'),
      "out_file": path.join(__dirname, 'logs', 'learn-apt-out.log'),
      "log_file": path.join(__dirname, 'logs', 'learn-apt-combined.log'),
      "time": true
    },
    {
      "name": "iiskills-learn-chemistry",
      "cwd": path.join(__dirname, 'apps/learn-chemistry'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3005
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'learn-chemistry-error.log'),
      "out_file": path.join(__dirname, 'logs', 'learn-chemistry-out.log'),
      "log_file": path.join(__dirname, 'logs', 'learn-chemistry-combined.log'),
      "time": true
    },
    {
      "name": "iiskills-learn-developer",
      "cwd": path.join(__dirname, 'apps/learn-developer'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3007
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'learn-developer-error.log'),
      "out_file": path.join(__dirname, 'logs', 'learn-developer-out.log'),
      "log_file": path.join(__dirname, 'logs', 'learn-developer-combined.log'),
      "time": true
    },
    {
      "name": "iiskills-learn-geography",
      "cwd": path.join(__dirname, 'apps/learn-geography'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3011
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'learn-geography-error.log'),
      "out_file": path.join(__dirname, 'logs', 'learn-geography-out.log'),
      "log_file": path.join(__dirname, 'logs', 'learn-geography-combined.log'),
      "time": true
    },
    {
      "name": "iiskills-learn-govt-jobs",
      "cwd": path.join(__dirname, 'apps/learn-govt-jobs'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3013
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'learn-govt-jobs-error.log'),
      "out_file": path.join(__dirname, 'logs', 'learn-govt-jobs-out.log'),
      "log_file": path.join(__dirname, 'logs', 'learn-govt-jobs-combined.log'),
      "time": true
    },
    {
      "name": "iiskills-learn-management",
      "cwd": path.join(__dirname, 'apps/learn-management'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3016
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'learn-management-error.log'),
      "out_file": path.join(__dirname, 'logs', 'learn-management-out.log'),
      "log_file": path.join(__dirname, 'logs', 'learn-management-combined.log'),
      "time": true
    },
    {
      "name": "iiskills-learn-math",
      "cwd": path.join(__dirname, 'apps/learn-math'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3017
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'learn-math-error.log'),
      "out_file": path.join(__dirname, 'logs', 'learn-math-out.log'),
      "log_file": path.join(__dirname, 'logs', 'learn-math-combined.log'),
      "time": true
    },
    {
      "name": "iiskills-learn-physics",
      "cwd": path.join(__dirname, 'apps/learn-physics'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3020
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'learn-physics-error.log'),
      "out_file": path.join(__dirname, 'logs', 'learn-physics-out.log'),
      "log_file": path.join(__dirname, 'logs', 'learn-physics-combined.log'),
      "time": true
    },
    {
      "name": "iiskills-learn-pr",
      "cwd": path.join(__dirname, 'apps/learn-pr'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3021
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'learn-pr-error.log'),
      "out_file": path.join(__dirname, 'logs', 'learn-pr-out.log'),
      "log_file": path.join(__dirname, 'logs', 'learn-pr-combined.log'),
      "time": true
    },
    {
      "name": "iiskills-learn-finesse",
      "cwd": path.join(__dirname, 'apps/learn-finesse'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3025
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'learn-finesse-error.log'),
      "out_file": path.join(__dirname, 'logs', 'learn-finesse-out.log'),
      "log_file": path.join(__dirname, 'logs', 'learn-finesse-combined.log'),
      "time": true
    },
    {
      "name": "iiskills-learn-biology",
      "cwd": path.join(__dirname, 'apps/learn-biology'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3026
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'learn-biology-error.log'),
      "out_file": path.join(__dirname, 'logs', 'learn-biology-out.log'),
      "log_file": path.join(__dirname, 'logs', 'learn-biology-combined.log'),
      "time": true
    },
    {
      "name": "iiskills-mpa",
      "cwd": path.join(__dirname, 'apps/mpa'),
      "script": "npx",
      "args": "next start",
      "interpreter": "none",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3014
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": path.join(__dirname, 'logs', 'mpa-error.log'),
      "out_file": path.join(__dirname, 'logs', 'mpa-out.log'),
      "log_file": path.join(__dirname, 'logs', 'mpa-combined.log'),
      "time": true
    }
  ]
};
