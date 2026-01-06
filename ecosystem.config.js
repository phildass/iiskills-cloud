/**
 * PM2 Ecosystem Configuration File
 * 
 * This file defines the configuration for running all iiskills.cloud apps
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
    },
    {
      name: 'iiskills-learn-math',
      cwd: __dirname + '/learn-math',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3002,
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/learn-math-error.log',
      out_file: './logs/learn-math-out.log',
      log_file: './logs/learn-math-combined.log',
      time: true
    },
    {
      name: 'iiskills-learn-winning',
      cwd: __dirname + '/learn-winning',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3003,
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/learn-winning-error.log',
      out_file: './logs/learn-winning-out.log',
      log_file: './logs/learn-winning-combined.log',
      time: true
    },
    {
      name: 'iiskills-learn-data-science',
      cwd: __dirname + '/learn-data-science',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3004,
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/learn-data-science-error.log',
      out_file: './logs/learn-data-science-out.log',
      log_file: './logs/learn-data-science-combined.log',
      time: true
    },
    {
      name: 'iiskills-learn-management',
      cwd: __dirname + '/learn-management',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3005,
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/learn-management-error.log',
      out_file: './logs/learn-management-out.log',
      log_file: './logs/learn-management-combined.log',
      time: true
    },
    {
      name: 'iiskills-learn-leadership',
      cwd: __dirname + '/learn-leadership',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3006,
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/learn-leadership-error.log',
      out_file: './logs/learn-leadership-out.log',
      log_file: './logs/learn-leadership-combined.log',
      time: true
    },
    {
      name: 'iiskills-learn-ai',
      cwd: __dirname + '/learn-ai',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3007,
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/learn-ai-error.log',
      out_file: './logs/learn-ai-out.log',
      log_file: './logs/learn-ai-combined.log',
      time: true
    },
    {
      name: 'iiskills-learn-pr',
      cwd: __dirname + '/learn-pr',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3008,
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/learn-pr-error.log',
      out_file: './logs/learn-pr-out.log',
      log_file: './logs/learn-pr-combined.log',
      time: true
    },
    {

      name: 'iiskills-learn-geography',
      cwd: __dirname + '/learn-geography',


      name: 'iiskills-learn-jee',
      cwd: __dirname + '/learn-jee',

      name: 'iiskills-learn-neet',
      cwd: __dirname + '/learn-neet',
      name: 'iiskills-learn-physics',
      cwd: __dirname + '/learn-physics',


      script: 'npm',
      args: 'start',
      env: {
        PORT: 3009,
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: './logs/learn-geography-error.log',
      out_file: './logs/learn-geography-out.log',
      log_file: './logs/learn-geography-combined.log',


      error_file: './logs/learn-jee-error.log',
      out_file: './logs/learn-jee-out.log',
      log_file: './logs/learn-jee-combined.log',


      error_file: './logs/learn-neet-error.log',
      out_file: './logs/learn-neet-out.log',
      log_file: './logs/learn-neet-combined.log',
      error_file: './logs/learn-physics-error.log',
      out_file: './logs/learn-physics-out.log',
      log_file: './logs/learn-physics-combined.log',

      time: true
    }
  ]
}
