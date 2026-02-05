/**
 * PM2 Ecosystem Configuration for Standalone Next.js Apps
 * 
 * This configuration runs the standalone server.js files directly
 * for optimal production performance.
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
      "name": "iiskills-learn-ai",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-ai/.next/standalone/apps/learn-ai",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3024
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-ai-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-ai-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-ai-combined.log",
      "time": true
    },
    {
      "name": "iiskills-learn-apt",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-apt/.next/standalone/apps/learn-apt",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3002
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-apt-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-apt-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-apt-combined.log",
      "time": true
    },
    {
      "name": "iiskills-learn-chemistry",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-chemistry/.next/standalone/apps/learn-chemistry",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3005
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-chemistry-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-chemistry-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-chemistry-combined.log",
      "time": true
    },

    
    // Learn Web Development - Web Developer Bootcamp
    {
      name: 'iiskills-learn-developer',
      cwd: path.join(__dirname, 'apps/learn-developer'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001  // Reassigned to resolve conflict
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-developer-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-developer-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-developer-combined.log'),
      time: true

    {
      "name": "iiskills-learn-companion",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-companion/.next/standalone/apps/learn-companion",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3023
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-companion-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-companion-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-companion-combined.log",
      "time": true
    },
    {
      "name": "iiskills-learn-cricket",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-cricket/.next/standalone/apps/learn-cricket",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3009
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-cricket-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-cricket-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-cricket-combined.log",
      "time": true

    },
    {
      "name": "iiskills-learn-developer",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-developer/.next/standalone/apps/learn-developer",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3007
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-developer-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-developer-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-developer-combined.log",
      "time": true
    },
    {
      "name": "iiskills-learn-geography",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-geography/.next/standalone/apps/learn-geography",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3011
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-geography-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-geography-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-geography-combined.log",
      "time": true
    },

    
    // Learn Management - Management and business skills

    {
      "name": "iiskills-learn-govt-jobs",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-govt-jobs/.next/standalone/apps/learn-govt-jobs",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3013
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-govt-jobs-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-govt-jobs-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-govt-jobs-combined.log",
      "time": true
    },

    {
      "name": "iiskills-learn-leadership",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-leadership/.next/standalone/apps/learn-leadership",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3015
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-leadership-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-leadership-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-leadership-combined.log",
      "time": true
    },
    {
      "name": "iiskills-learn-management",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-management/.next/standalone/apps/learn-management",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3016
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-management-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-management-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-management-combined.log",
      "time": true
    },
    {
      "name": "iiskills-learn-math",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-math/.next/standalone/apps/learn-math",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3017
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-math-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-math-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-math-combined.log",
      "time": true
    },
    {
      "name": "iiskills-learn-physics",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-physics/.next/standalone/apps/learn-physics",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3020
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-physics-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-physics-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-physics-combined.log",
      "time": true
    },

    
    // main module

    {
      "name": "iiskills-learn-pr",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-pr/.next/standalone/apps/learn-pr",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3021
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-pr-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-pr-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-pr-combined.log",
      "time": true
    },
    {
      "name": "iiskills-learn-winning",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/learn-winning/.next/standalone/apps/learn-winning",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3022
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-winning-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-winning-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/learn-winning-combined.log",
      "time": true
    },
    {
      "name": "iiskills-main",
      "cwd": "/home/runner/work/iiskills-cloud/iiskills-cloud/apps/main/.next/standalone/apps/main",
      "script": "server.js",
      "env": {
        "NODE_ENV": "production",
        "PORT": 3000
      },
      "instances": 1,
      "autorestart": true,
      "watch": false,
      "max_memory_restart": "1G",
      "error_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/main-error.log",
      "out_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/main-out.log",
      "log_file": "/home/runner/work/iiskills-cloud/iiskills-cloud/logs/main-combined.log",
      "time": true
    }
  ]
};

