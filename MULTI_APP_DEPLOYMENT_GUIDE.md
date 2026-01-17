# Multi-App Subdomain Deployment Guide

## 🎯 Overview

This guide provides complete instructions for deploying all iiskills.cloud learning applications to their respective subdomains on the Hostinger VPS (`72.60.203.189`).

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Deployment Steps](#detailed-deployment-steps)
4. [DNS Configuration](#dns-configuration)
5. [Troubleshooting](#troubleshooting)
6. [Maintenance](#maintenance)
7. [Monitoring](#monitoring)

---

## Prerequisites

### Server Requirements

- **VPS**: Hostinger VPS at `72.60.203.189`
- **OS**: Ubuntu 20.04+ or similar Linux distribution
- **RAM**: Minimum 4GB (8GB+ recommended for all apps)
- **Storage**: 50GB+ available
- **Root Access**: Required for Nginx and SSL configuration

### Software Requirements

Install the following on your VPS:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18 or higher)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Install PM2 globally
sudo npm install -g pm2

# Install build tools
sudo apt install -y build-essential git
```

### DNS Requirements

All subdomains must have A records pointing to `72.60.203.189`:

- `iiskills.cloud` → `72.60.203.189`
- `www.iiskills.cloud` → `72.60.203.189`
- `learn-ai.iiskills.cloud` → `72.60.203.189`
- `learn-apt.iiskills.cloud` → `72.60.203.189`
- `learn-chemistry.iiskills.cloud` → `72.60.203.189`
- `learn-data-science.iiskills.cloud` → `72.60.203.189`
- `learn-geography.iiskills.cloud` → `72.60.203.189`
- `learn-govt-jobs.iiskills.cloud` → `72.60.203.189`
- `learn-ias.iiskills.cloud` → `72.60.203.189`
- `learn-jee.iiskills.cloud` → `72.60.203.189`
- `learn-leadership.iiskills.cloud` → `72.60.203.189`
- `learn-management.iiskills.cloud` → `72.60.203.189`
- `learn-math.iiskills.cloud` → `72.60.203.189`
- `learn-neet.iiskills.cloud` → `72.60.203.189`
- `learn-physics.iiskills.cloud` → `72.60.203.189`
- `learn-pr.iiskills.cloud` → `72.60.203.189`
- `learn-winning.iiskills.cloud` → `72.60.203.189`

---

## Quick Start

### One-Command Deployment

If you have all prerequisites installed and DNS configured:

```bash
# Clone repository
git clone https://github.com/phildass/iiskills-cloud.git
cd iiskills-cloud

# Run full deployment (DNS, build, Nginx, SSL, monitoring)
sudo ./deploy-subdomains.sh
```

This will:
1. ✅ Verify all DNS records
2. 🏗️ Build all applications
3. 🚀 Deploy with PM2
4. 🌐 Configure Nginx reverse proxies
5. 🔒 Setup SSL certificates
6. 📊 Generate deployment report

---

## Detailed Deployment Steps

### Step 1: Verify DNS Configuration

Before deployment, verify that all DNS records are configured correctly:

```bash
./verify-subdomain-dns.sh
```

**Expected Output:**
```
✅ VERIFIED  - iiskills.cloud -> 72.60.203.189
✅ VERIFIED  - www.iiskills.cloud -> 72.60.203.189
✅ VERIFIED  - learn-ai.iiskills.cloud -> 72.60.203.189
...
```

**If DNS records are missing or incorrect:**

1. Log in to your DNS provider (Hostinger, Cloudflare, etc.)
2. Navigate to DNS management for `iiskills.cloud`
3. Add/update A records as shown in the script output
4. Wait 5-60 minutes for DNS propagation
5. Run the verification script again

**Continue anyway?** You can proceed with deployment even if DNS isn't ready, but apps won't be accessible until DNS is correct.

### Step 2: Configure Environment Variables

Each app needs a `.env.local` file with proper configuration:

```bash
# Copy example files for all apps
for dir in learn-*; do
  if [ -f "$dir/.env.local.example" ] && [ ! -f "$dir/.env.local" ]; then
    cp "$dir/.env.local.example" "$dir/.env.local"
    echo "Created .env.local for $dir"
  fi
done

# Also copy for main app
if [ -f ".env.local.example" ] && [ ! -f ".env.local" ]; then
  cp ".env.local.example" ".env.local"
fi
```

**Important:** Edit each `.env.local` file with your actual credentials:
- Supabase URL and API keys
- Google OAuth credentials
- Resend API keys
- Any other app-specific secrets

**Never commit `.env.local` files to Git!**

### Step 3: Run the Deployment Script

The main deployment script handles everything:

```bash
sudo ./deploy-subdomains.sh
```

**Available Options:**

```bash
# Skip specific phases
sudo ./deploy-subdomains.sh --skip-dns      # Skip DNS verification
sudo ./deploy-subdomains.sh --skip-build    # Skip building apps
sudo ./deploy-subdomains.sh --skip-nginx    # Skip Nginx configuration
sudo ./deploy-subdomains.sh --skip-ssl      # Skip SSL setup

# Dry run (show what would happen without making changes)
sudo ./deploy-subdomains.sh --dry-run

# Help
sudo ./deploy-subdomains.sh --help
```

**What the script does:**

#### Phase 1: DNS Verification
- Checks all A records point to correct IP
- Alerts on missing/incorrect records
- Option to continue despite DNS issues

#### Phase 2: Build & Deploy Applications
- Validates environment files
- Installs dependencies (`npm install`)
- Builds all apps (`npm run build`)
- Deploys with PM2
- Configures PM2 startup on boot

#### Phase 3: Nginx Configuration
- Generates reverse proxy configs for each subdomain
- Sets up HTTP to HTTPS redirects
- Configures security headers
- Tests configuration validity
- Reloads Nginx

#### Phase 4: SSL Certificate Setup
- Obtains Let's Encrypt certificates for all domains
- Configures automatic renewal
- Sets up systemd timer for renewal
- Tests renewal process

#### Phase 5: Process Management
- Verifies PM2 process status
- Checks app health on each port
- Displays process dashboard

#### Phase 6: Deployment Report
- Generates comprehensive status report
- Includes troubleshooting commands
- Documents all configurations

### Step 4: Verify Deployment

After deployment completes, verify all apps are running:

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs

# Monitor all apps
./monitor-apps.sh

# Detailed monitoring
./monitor-apps.sh --detailed
```

### Step 5: Test HTTPS Access

Test each subdomain in your browser:

- https://iiskills.cloud
- https://www.iiskills.cloud
- https://learn-ai.iiskills.cloud
- https://learn-apt.iiskills.cloud
- (... and so on for all subdomains)

**All should:**
- ✅ Load over HTTPS (with valid certificate)
- ✅ Redirect from HTTP to HTTPS automatically
- ✅ Display the correct app
- ✅ Have working authentication

---

## DNS Configuration

### Hostinger DNS Setup

1. Log in to [Hostinger Control Panel](https://hpanel.hostinger.com)
2. Go to **Domains** → Select `iiskills.cloud`
3. Click **DNS / Nameservers**
4. Add the following A records:

| Type | Name | Points to | TTL |
|------|------|-----------|-----|
| A | @ | 72.60.203.189 | 14400 |
| A | www | 72.60.203.189 | 14400 |
| A | learn-ai | 72.60.203.189 | 14400 |
| A | learn-apt | 72.60.203.189 | 14400 |
| A | learn-chemistry | 72.60.203.189 | 14400 |
| A | learn-data-science | 72.60.203.189 | 14400 |
| A | learn-geography | 72.60.203.189 | 14400 |
| A | learn-govt-jobs | 72.60.203.189 | 14400 |
| A | learn-ias | 72.60.203.189 | 14400 |
| A | learn-jee | 72.60.203.189 | 14400 |
| A | learn-leadership | 72.60.203.189 | 14400 |
| A | learn-management | 72.60.203.189 | 14400 |
| A | learn-math | 72.60.203.189 | 14400 |
| A | learn-neet | 72.60.203.189 | 14400 |
| A | learn-physics | 72.60.203.189 | 14400 |
| A | learn-pr | 72.60.203.189 | 14400 |
| A | learn-winning | 72.60.203.189 | 14400 |

5. Wait 5-60 minutes for propagation
6. Verify with `./verify-subdomain-dns.sh`

### Alternative DNS Providers

#### Cloudflare

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select `iiskills.cloud`
3. Go to **DNS** → **Records**
4. Add A records as shown above
5. **Important:** Disable Cloudflare proxy (gray cloud) initially for Let's Encrypt
6. After SSL is configured, you can enable proxy (orange cloud)

#### Other Providers

The process is similar for GoDaddy, Namecheap, etc.:
1. Find DNS management section
2. Add A records
3. Point to `72.60.203.189`
4. Wait for propagation

---

## Troubleshooting

### Common Issues

#### 1. DNS Not Propagating

**Symptom:** `verify-subdomain-dns.sh` shows missing/incorrect records

**Solution:**
- Wait longer (up to 48 hours in rare cases)
- Check DNS provider interface
- Use [dnschecker.org](https://dnschecker.org) to check global propagation
- Verify you saved changes in DNS panel

#### 2. Build Fails

**Symptom:** Apps fail to build during deployment

**Solution:**
```bash
# Check Node.js version (should be 16+)
node --version

# Check build logs
cat logs/<app-name>-build.log

# Try building individual app manually
cd learn-chemistry
npm install
npm run build

# Common fixes:
# - Ensure .env.local exists
# - Check for syntax errors in code
# - Verify all dependencies are available
```

#### 3. PM2 Process Crashes

**Symptom:** Apps show as "errored" or "stopped" in PM2

**Solution:**
```bash
# Check PM2 logs
pm2 logs iiskills-learn-chemistry

# View error logs
pm2 logs iiskills-learn-chemistry --err

# Restart app
pm2 restart iiskills-learn-chemistry

# If persistent issues:
# 1. Check .env.local configuration
# 2. Verify port isn't already in use
# 3. Check for runtime errors in logs
```

#### 4. SSL Certificate Fails

**Symptom:** Certbot unable to obtain certificate

**Solution:**
```bash
# Verify DNS is correct
dig A learn-chemistry.iiskills.cloud

# Check Nginx is running
sudo systemctl status nginx

# Verify port 80 is accessible
sudo netstat -tulpn | grep :80

# Try manual certificate
sudo certbot certonly --nginx -d learn-chemistry.iiskills.cloud

# Check Certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

#### 5. Nginx Configuration Error

**Symptom:** `nginx -t` fails

**Solution:**
```bash
# Test configuration
sudo nginx -t

# Check error details
# Fix syntax errors in config files

# Verify config file exists
ls -la /etc/nginx/sites-available/
ls -la /etc/nginx/sites-enabled/

# Re-run deployment with --skip-build --skip-ssl
sudo ./deploy-subdomains.sh --skip-build --skip-ssl
```

#### 6. Port Already in Use

**Symptom:** App fails to start with EADDRINUSE error

**Solution:**
```bash
# Check what's using the port
sudo lsof -i :3003

# Kill the process if needed
sudo kill -9 <PID>

# Restart PM2
pm2 restart all
```

#### 7. Apps Not Responding

**Symptom:** PM2 shows online but app doesn't respond

**Solution:**
```bash
# Check app health
./monitor-apps.sh --detailed

# Check if port is listening
curl http://localhost:3003

# View app logs
pm2 logs iiskills-learn-chemistry --lines 100

# Common causes:
# - App still starting up (wait 30-60 seconds)
# - Environment variable missing
# - Database connection issue
# - Build artifact corruption
```

### Getting Help

If you're stuck:

1. **Check Logs:**
   ```bash
   pm2 logs --lines 50
   sudo tail -f /var/log/nginx/error.log
   ```

2. **Review Deployment Report:**
   ```bash
   cat DEPLOYMENT_REPORT.md
   ```

3. **Run Health Check:**
   ```bash
   ./monitor-apps.sh --detailed --logs
   ```

4. **Contact Support:**
   - Email: info@iiskills.cloud
   - Include: deployment report, PM2 status, relevant logs

---

## Maintenance

### Updating Apps

To deploy updates from Git:

```bash
# Pull latest code
git pull origin main

# Option 1: Full redeployment
sudo ./deploy-subdomains.sh --skip-dns --skip-nginx --skip-ssl

# Option 2: Update specific app
cd learn-chemistry
npm install
npm run build
pm2 restart iiskills-learn-chemistry
```

### Managing PM2 Processes

```bash
# View all processes
pm2 status

# View specific app logs
pm2 logs iiskills-learn-chemistry

# Restart all apps
pm2 restart all

# Restart specific app
pm2 restart iiskills-learn-chemistry

# Stop all apps
pm2 stop all

# Delete all processes
pm2 delete all

# Monitor resources
pm2 monit

# Save process list
pm2 save

# View startup script
pm2 startup
```

### SSL Certificate Renewal

Certificates auto-renew via systemd timer:

```bash
# Check renewal timer status
sudo systemctl status certbot.timer

# List all certificates
sudo certbot certificates

# Test renewal (dry run)
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal

# Renew specific certificate
sudo certbot renew --cert-name iiskills.cloud
```

### Nginx Management

```bash
# Test configuration
sudo nginx -t

# Reload configuration (no downtime)
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx

# View status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log

# View access logs
sudo tail -f /var/log/nginx/access.log
```

### Monitoring and Alerts

Set up external monitoring:

1. **UptimeRobot** (free):
   - Add monitors for each subdomain
   - Get email alerts on downtime
   - https://uptimerobot.com

2. **Cron Health Checks:**
   ```bash
   # Add to crontab (crontab -e)
   */5 * * * * /path/to/iiskills-cloud/monitor-apps.sh --json > /var/log/app-health.json
   ```

3. **PM2 Monitoring:**
   ```bash
   # Install PM2 monitoring (optional)
   pm2 install pm2-logrotate
   ```

### Backup Strategy

Important files to backup:

```bash
# Environment files (IMPORTANT: Contains secrets)
find . -name ".env.local" -type f

# Nginx configurations
/etc/nginx/sites-available/*

# SSL certificates (auto-backed by Certbot)
/etc/letsencrypt/

# PM2 configuration
~/.pm2/

# Create backup script:
mkdir -p ~/backups
tar -czf ~/backups/iiskills-$(date +%Y%m%d).tar.gz \
  --exclude node_modules \
  --exclude .next \
  /path/to/iiskills-cloud
```

---

## Monitoring

### Health Check Dashboard

Run the monitoring script to see current status:

```bash
# Basic health check
./monitor-apps.sh

# Detailed information
./monitor-apps.sh --detailed

# Show recent logs
./monitor-apps.sh --logs

# JSON output (for automation)
./monitor-apps.sh --json
```

### Example Output

```
═══════════════════════════════════════════════════════════════════════════
Multi-App Health Monitoring Dashboard
═══════════════════════════════════════════════════════════════════════════

Time: 2026-01-17 04:00:00
Domain: iiskills.cloud

App Status Overview

SUBDOMAIN                      PORT     PM2        HTTP       HTTPS
────────────────────────────────────────────────────────────────────────────
iiskills.cloud                 3000     ✅         ✅         ✅
learn-ai.iiskills.cloud        3002     ✅         ✅         ✅
learn-apt.iiskills.cloud       3001     ✅         ✅         ✅
...

Summary
────────────────────────────────────────────────────────────────────────────
Total Apps:       16
Healthy:          16
PM2 Running:      16
HTTP OK:          16
HTTPS OK:         16

═══════════════════════════════════════════════════════════════════════════
✅ All systems operational!
═══════════════════════════════════════════════════════════════════════════
```

### Key Metrics

- **PM2 Status**: Is the process running in PM2?
- **HTTP Health**: Is the app responding on its port?
- **HTTPS Health**: Is the app accessible via HTTPS?
- **Uptime**: How long has the app been running?
- **Memory**: Current memory usage
- **CPU**: Current CPU usage

---

## Deployment Checklist

Use this checklist for production deployment:

- [ ] Prerequisites installed (Node.js, Nginx, Certbot, PM2)
- [ ] Repository cloned
- [ ] DNS records configured and verified
- [ ] Environment files created and configured
- [ ] Firewall rules allow ports 80, 443, 22
- [ ] Deployment script executed successfully
- [ ] All apps show "online" in PM2
- [ ] All subdomains accessible via HTTPS
- [ ] SSL certificates obtained for all domains
- [ ] Cross-subdomain authentication tested
- [ ] PM2 startup configured for auto-restart on reboot
- [ ] SSL auto-renewal tested
- [ ] External monitoring configured
- [ ] Backup strategy implemented
- [ ] Documentation reviewed by team

---

## Support

For issues, questions, or support:

- **Email**: info@iiskills.cloud
- **Documentation**: Check individual app README files
- **Logs**: Always include PM2 logs and deployment report when requesting help

---

## Appendix

### Port Assignments

| Port | Application | Subdomain |
|------|-------------|-----------|
| 3000 | iiskills-main | iiskills.cloud |
| 3001 | learn-apt | learn-apt.iiskills.cloud |
| 3002 | learn-ai | learn-ai.iiskills.cloud |
| 3003 | learn-chemistry | learn-chemistry.iiskills.cloud |
| 3004 | learn-data-science | learn-data-science.iiskills.cloud |
| 3005 | learn-geography | learn-geography.iiskills.cloud |
| 3006 | learn-govt-jobs | learn-govt-jobs.iiskills.cloud |
| 3007 | learn-ias | learn-ias.iiskills.cloud |
| 3008 | learn-jee | learn-jee.iiskills.cloud |
| 3009 | learn-leadership | learn-leadership.iiskills.cloud |
| 3010 | learn-management | learn-management.iiskills.cloud |
| 3011 | learn-math | learn-math.iiskills.cloud |
| 3012 | learn-neet | learn-neet.iiskills.cloud |
| 3013 | learn-physics | learn-physics.iiskills.cloud |
| 3014 | learn-pr | learn-pr.iiskills.cloud |
| 3015 | learn-winning | learn-winning.iiskills.cloud |

### File Locations

- **Nginx Configs**: `/etc/nginx/sites-available/`
- **Nginx Enabled**: `/etc/nginx/sites-enabled/`
- **SSL Certificates**: `/etc/letsencrypt/live/`
- **PM2 Config**: `~/iiskills-cloud/ecosystem.config.js`
- **PM2 Logs**: `~/iiskills-cloud/logs/`
- **App Logs**: Via `pm2 logs`

### Useful Commands Reference

```bash
# Deployment
sudo ./deploy-subdomains.sh                 # Full deployment
sudo ./deploy-subdomains.sh --dry-run       # Test without changes
./verify-subdomain-dns.sh                   # Check DNS
./monitor-apps.sh                           # Health check

# PM2
pm2 status                                  # View all processes
pm2 logs                                    # View logs
pm2 restart all                             # Restart all
pm2 monit                                   # Resource monitor

# Nginx
sudo nginx -t                               # Test config
sudo systemctl reload nginx                 # Reload
sudo tail -f /var/log/nginx/error.log      # Error logs

# SSL
sudo certbot certificates                   # List certificates
sudo certbot renew --dry-run               # Test renewal
```

---

**Last Updated**: January 2026  
**Version**: 1.0.0
