/**
 * PM2 Ecosystem Configuration File
 * 
 * This file defines the configuration for running both iiskills.cloud apps
 * using PM2 process manager.
 * 
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [
    {
      name: 'iiskills-main',
      cwd: __dirname,
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/main-error.log',
      out_file: './logs/main-out.log',
      log_file: './logs/main-combined.log',
      time: true
    },
    {
      name: 'iiskills-learn-apt',
      cwd: __dirname + '/learn-apt',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3001,
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/learn-apt-error.log',
      out_file: './logs/learn-apt-out.log',
      log_file: './logs/learn-apt-combined.log',
      time: true
    }
  ]
}
