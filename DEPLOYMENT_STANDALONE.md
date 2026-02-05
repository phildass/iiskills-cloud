# Standalone Deployment Guide

This guide explains how to deploy all Next.js apps using the standalone build mode with PM2.

## Prerequisites

- Node.js 18+ installed
- Yarn 4.12.0 (via Corepack)
- PM2 installed globally (`npm install -g pm2`)

## Quick Start

### 1. Enable Corepack (for Yarn 4)

```bash
corepack enable
```

### 2. Install Dependencies

```bash
# From repository root
yarn install
```

### 3. Create Environment Files

Create a `.env.local` file in each app directory (`apps/*/`) with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# For testing without Supabase, use:
NEXT_PUBLIC_SUPABASE_SUSPENDED=true
NEXT_PUBLIC_USE_LOCAL_CONTENT=true

# Public access mode
NEXT_PUBLIC_DISABLE_AUTH=false
NEXT_PUBLIC_PAYWALL_ENABLED=false

# Admin debug mode
DEBUG_ADMIN=true
NEXT_PUBLIC_DEBUG_ADMIN=true

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
```

You can use the helper script:

```bash
# Create .env.local files for all apps
for app in apps/*; do
  cp .env.local.example "$app/.env.local"
done
```

### 4. Build All Apps

```bash
# Build all apps
yarn build
```

Or build individually:

```bash
cd apps/learn-ai && yarn build
cd apps/main && yarn build
# etc.
```

### 5. Setup Standalone Deployments

After building, copy required files to standalone directories:

```bash
#!/bin/bash
# setup-standalone.sh

for app_dir in apps/*; do
  if [ -d "$app_dir" ]; then
    app_name=$(basename "$app_dir")
    standalone_dir="$app_dir/.next/standalone/apps/$app_name"
    
    if [ -d "$standalone_dir" ]; then
      echo "Setting up $app_name..."
      
      # Copy .env.local
      [ -f "$app_dir/.env.local" ] && cp "$app_dir/.env.local" "$standalone_dir/.env.local"
      
      # Copy public folder
      [ -d "$app_dir/public" ] && cp -r "$app_dir/public" "$standalone_dir/public"
      
      # Copy .next/static
      [ -d "$app_dir/.next/static" ] && mkdir -p "$standalone_dir/.next" && \
        cp -r "$app_dir/.next/static" "$standalone_dir/.next/static"
      
      echo "✓ $app_name standalone setup complete"
    fi
  fi
done
```

### 6. Start Apps with PM2

```bash
# Create logs directory
mkdir -p logs

# Start all apps
pm2 start ecosystem.config.js

# Or start specific app
pm2 start ecosystem.config.js --only iiskills-learn-ai

# Save PM2 process list
pm2 save
```

### 7. Verify Deployment

Check if all apps are running:

```bash
pm2 status
```

Test app responses:

```bash
# Test all apps
curl http://localhost:3000  # main
curl http://localhost:3024  # learn-ai
curl http://localhost:3002  # learn-apt
# etc.
```

## App Ports

| App | Port |
|-----|------|
| main | 3000 |
| learn-apt | 3002 |
| learn-chemistry | 3005 |
| learn-developer | 3007 |
| learn-cricket | 3009 |
| learn-geography | 3011 |
| learn-govt-jobs | 3013 |
| learn-leadership | 3015 |
| learn-management | 3016 |
| learn-math | 3017 |
| learn-physics | 3020 |
| learn-pr | 3021 |
| learn-winning | 3022 |
| learn-companion | 3023 |
| learn-ai | 3024 |

## PM2 Management

### Start/Stop/Restart

```bash
# Start all apps
pm2 start ecosystem.config.js

# Start specific app
pm2 start ecosystem.config.js --only iiskills-learn-ai

# Stop all apps
pm2 stop all

# Stop specific app
pm2 stop iiskills-learn-ai

# Restart all apps
pm2 restart all

# Restart specific app
pm2 restart iiskills-learn-ai

# Delete all apps from PM2
pm2 delete all
```

### Monitoring

```bash
# View status
pm2 status

# Monitor in real-time
pm2 monit

# View logs
pm2 logs

# View logs for specific app
pm2 logs iiskills-learn-ai

# View only error logs
pm2 logs --err

# Follow logs
pm2 logs --lines 100
```

### Process Management

```bash
# Save process list
pm2 save

# Resurrect saved processes
pm2 resurrect

# Setup PM2 to start on system boot
pm2 startup

# Generate startup script
pm2 startup systemd  # for systemd (most Linux)
pm2 startup launchd  # for macOS
```

## Production Deployment

### 1. Configure Environment Variables

Update `.env.local` files with production credentials:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# Disable testing modes
NEXT_PUBLIC_SUPABASE_SUSPENDED=false
NEXT_PUBLIC_USE_LOCAL_CONTENT=false

# Enable authentication and paywalls
NEXT_PUBLIC_DISABLE_AUTH=false
NEXT_PUBLIC_PAYWALL_ENABLED=true
DEBUG_ADMIN=false
NEXT_PUBLIC_DEBUG_ADMIN=false

# Production domain
NEXT_PUBLIC_SITE_URL=https://iiskills.cloud
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud

# API Keys
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
OPENAI_API_KEY=your-openai-api-key
RESEND_API_KEY=your-resend-api-key
```

### 2. Configure Reverse Proxy

Example Nginx configuration for subdomain routing:

```nginx
# Main app
server {
    listen 80;
    server_name iiskills.cloud;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Learn AI subdomain
server {
    listen 80;
    server_name ai.iiskills.cloud;
    
    location / {
        proxy_pass http://localhost:3024;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Repeat for other apps...
```

### 3. Enable SSL/HTTPS

```bash
# Using Let's Encrypt with Certbot
sudo certbot --nginx -d iiskills.cloud -d ai.iiskills.cloud -d apt.iiskills.cloud
```

### 4. Setup PM2 Startup

```bash
# Enable PM2 to start on system boot
pm2 startup systemd

# Save current process list
pm2 save

# Verify startup script
systemctl status pm2-runner
```

## Troubleshooting

### Apps not starting

Check PM2 logs:

```bash
pm2 logs iiskills-learn-ai --lines 50
```

Check error logs:

```bash
cat logs/learn-ai-error.log
```

### Port conflicts

If a port is already in use, update the port in:
1. `ecosystem.config.js` - Update the `PORT` environment variable
2. `apps/[app]/package.json` - Update the `start` script port

### Missing dependencies

Rebuild the app:

```bash
cd apps/learn-ai
yarn install
yarn build
```

Then copy files to standalone:

```bash
# From app directory
cp .env.local .next/standalone/apps/learn-ai/
cp -r public .next/standalone/apps/learn-ai/
cp -r .next/static .next/standalone/apps/learn-ai/.next/
```

### Memory issues

Increase memory limit in `ecosystem.config.js`:

```js
{
  name: 'iiskills-learn-ai',
  // ...
  max_memory_restart: '2G',  // Increase from 1G to 2G
}
```

## Updating Apps

### Update single app

```bash
# 1. Stop the app
pm2 stop iiskills-learn-ai

# 2. Pull latest code
git pull

# 3. Install dependencies
cd apps/learn-ai
yarn install

# 4. Build
yarn build

# 5. Setup standalone
cp .env.local .next/standalone/apps/learn-ai/
cp -r public .next/standalone/apps/learn-ai/
cp -r .next/static .next/standalone/apps/learn-ai/.next/

# 6. Restart
cd ../..
pm2 restart iiskills-learn-ai
```

### Update all apps

```bash
# Stop all apps
pm2 stop all

# Pull latest code
git pull

# Install dependencies
yarn install

# Build all apps
yarn build

# Setup all standalones
bash setup-standalone.sh  # Use the script from step 5 above

# Restart all apps
pm2 restart all
```

## Monitoring & Maintenance

### Daily Health Checks

```bash
# Check app status
pm2 status

# Check memory usage
pm2 list | grep -E "(memory|cpu)"

# Check logs for errors
pm2 logs --err --lines 50
```

### Log Rotation

PM2 includes log rotation by default, but you can configure it:

```bash
# Install PM2 log rotate module
pm2 install pm2-logrotate

# Configure rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

### Backup Strategy

1. **Environment files**: Back up all `.env.local` files securely
2. **Database**: Regular Supabase backups
3. **Static assets**: Back up `public/` directories
4. **PM2 config**: Keep `ecosystem.config.js` in version control

## Performance Optimization

### Clustering (for high traffic)

Update `ecosystem.config.js`:

```js
{
  name: 'iiskills-learn-ai',
  instances: 'max',  // Use all CPU cores
  exec_mode: 'cluster',
  // ...
}
```

### Memory Optimization

Monitor and tune memory limits:

```bash
pm2 monit  # Real-time monitoring
pm2 describe iiskills-learn-ai  # Detailed stats
```

## Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure environment variables
- [ ] Enable firewall (only open necessary ports)
- [ ] Regular security updates (`yarn upgrade`)
- [ ] Monitor logs for suspicious activity
- [ ] Use secure Supabase RLS policies
- [ ] Enable rate limiting on API routes
- [ ] Use strong reCAPTCHA keys

## Support

For issues or questions:
- Check logs: `pm2 logs`
- Review this guide
- Check Next.js standalone documentation
- Check PM2 documentation

## Summary

This deployment uses:
- ✅ Next.js standalone mode for optimal performance
- ✅ PM2 for process management and monitoring
- ✅ Separate ports for each app
- ✅ Centralized logging
- ✅ Auto-restart on failure
- ✅ Production-ready configuration
