/**
 * PM2 Ecosystem Configuration File for iiskills-cloud
 * 
 * Auto-generated configuration for all Next.js applications in the repository.
 * Each app is configured to run independently with its own port and logs.
 * 
 * All apps use Next.js and their package.json 'start' scripts, which include
 * port specifications where defined.
 * 
 * Usage:
 *   pm2 start ecosystem.config.js          # Start all apps
 *   pm2 start ecosystem.config.js --only <app-name>  # Start specific app
 *   pm2 stop all                           # Stop all apps
 *   pm2 restart all                        # Restart all apps
 *   pm2 logs                               # View logs
 *   pm2 monit                              # Monitor processes
 *   pm2 save                               # Save current process list
 *   pm2 startup                            # Enable PM2 to start on system boot
 * 
 * Prerequisites:
 *   1. Run 'npm install' in root and each subdirectory before starting
 *   2. Run 'npm run build' in root and each subdirectory to build production bundles
 *   3. Ensure all environment variables are configured (.env files)
 * 
 * Cross-platform compatible with Windows and Unix-like systems.
 */

const path = require('path');

module.exports = {
  apps: [
    // Main iiskills.cloud application
    {
      name: 'iiskills-main',
      cwd: path.join(__dirname),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'main-error.log'),
      out_file: path.join(__dirname, 'logs', 'main-out.log'),
      log_file: path.join(__dirname, 'logs', 'main-combined.log'),
      time: true
    },
    
    // Learn-APT: Aptitude assessment module
    {
      name: 'iiskills-learn-apt',
      cwd: path.join(__dirname, 'learn-apt'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-apt-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-apt-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-apt-combined.log'),
      time: true
    },
    
    // Learn-Math: Mathematics learning module
    {
      name: 'iiskills-learn-math',
      cwd: path.join(__dirname, 'learn-math'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        // PORT 3002 is specified in package.json start script
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-math-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-math-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-math-combined.log'),
      time: true
    },
    
    // Learn-Winning: Success strategies module
    {
      name: 'iiskills-learn-winning',
      cwd: path.join(__dirname, 'learn-winning'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        // PORT 3003 is specified in package.json start script
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-winning-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-winning-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-winning-combined.log'),
      time: true
    },
    
    // Learn-Data-Science: Data science fundamentals
    {
      name: 'iiskills-learn-data-science',
      cwd: path.join(__dirname, 'learn-data-science'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        // PORT 3004 is specified in package.json start script
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-data-science-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-data-science-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-data-science-combined.log'),
      time: true
    },
    
    // Learn-Management: Management skills module
    {
      name: 'iiskills-learn-management',
      cwd: path.join(__dirname, 'learn-management'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        // PORT 3005 is specified in package.json start script
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-management-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-management-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-management-combined.log'),
      time: true
    },
    
    // Learn-Leadership: Leadership development module
    {
      name: 'iiskills-learn-leadership',
      cwd: path.join(__dirname, 'learn-leadership'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        // PORT 3006 is specified in package.json start script
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-leadership-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-leadership-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-leadership-combined.log'),
      time: true
    },
    
    // Learn-AI: Artificial Intelligence module
    {
      name: 'iiskills-learn-ai',
      cwd: path.join(__dirname, 'learn-ai'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        // PORT 3007 is specified in package.json start script
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-ai-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-ai-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-ai-combined.log'),
      time: true
    },
    
    // Learn-PR: Public Relations module
    {
      name: 'iiskills-learn-pr',
      cwd: path.join(__dirname, 'learn-pr'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        // PORT 3008 is specified in package.json start script
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-pr-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-pr-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-pr-combined.log'),
      time: true
    },
    
    // Learn-JEE: JEE preparation module (PORT REASSIGNED from 3009 to 3010)
    {
      name: 'iiskills-learn-jee',
      cwd: path.join(__dirname, 'learn-jee'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3010  // Overriding package.json port to resolve conflict
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-jee-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-jee-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-jee-combined.log'),
      time: true
    },
    
    // Learn-Chemistry: Chemistry module (PORT REASSIGNED from 3009 to 3011)
    {
      name: 'iiskills-learn-chemistry',
      cwd: path.join(__dirname, 'learn-chemistry'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3011  // Overriding package.json port to resolve conflict
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-chemistry-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-chemistry-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-chemistry-combined.log'),
      time: true
    },
    
    // Learn-Geography: Geography module (PORT REASSIGNED from 3009 to 3012)
    {
      name: 'iiskills-learn-geography',
      cwd: path.join(__dirname, 'learn-geography'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3012  // Overriding package.json port to resolve conflict
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-geography-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-geography-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-geography-combined.log'),
      time: true
    },
    
    // Learn-NEET: NEET preparation module (PORT REASSIGNED from 3009 to 3013)
    {
      name: 'iiskills-learn-neet',
      cwd: path.join(__dirname, 'learn-neet'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3013  // Overriding package.json port to resolve conflict
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-neet-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-neet-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-neet-combined.log'),
      time: true
    },
    
    // Learn-Physics: Physics module (PORT REASSIGNED from 3009 to 3016)
    {
      name: 'iiskills-learn-physics',
      cwd: path.join(__dirname, 'learn-physics'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3016  // Overriding package.json port to resolve conflict
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-physics-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-physics-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-physics-combined.log'),
      time: true
    },
    
    // Learn-Govt-Jobs: Government jobs preparation
    {
      name: 'iiskills-learn-govt-jobs',
      cwd: path.join(__dirname, 'learn-govt-jobs'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        // PORT 3014 is specified in package.json start script
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-govt-jobs-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-govt-jobs-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-govt-jobs-combined.log'),
      time: true
    },
    
    // Learn-IAS: UPSC Civil Services preparation
    {
      name: 'iiskills-learn-ias',
      cwd: path.join(__dirname, 'learn-ias'),
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        // PORT 3015 is specified in package.json start script
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: path.join(__dirname, 'logs', 'learn-ias-error.log'),
      out_file: path.join(__dirname, 'logs', 'learn-ias-out.log'),
      log_file: path.join(__dirname, 'logs', 'learn-ias-combined.log'),
      time: true
    }
  ]
}
