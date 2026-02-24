# Multi-App Subdomain Deployment - Quick Reference

## 🚀 One-Command Deployment

```bash
# Full automated deployment (requires sudo)
sudo ./deploy-subdomains.sh
```

---

## 📋 Essential Commands

### Pre-Deployment

```bash
# Verify DNS configuration
./verify-subdomain-dns.sh

# Dry-run deployment (test without changes)
sudo ./deploy-subdomains.sh --dry-run
```

### Deployment Options

```bash
# Full deployment
sudo ./deploy-subdomains.sh

# Skip specific phases
sudo ./deploy-subdomains.sh --skip-dns       # Skip DNS check
sudo ./deploy-subdomains.sh --skip-build     # Skip building
sudo ./deploy-subdomains.sh --skip-nginx     # Skip Nginx config
sudo ./deploy-subdomains.sh --skip-ssl       # Skip SSL setup

# Build and deploy only (no infrastructure)
sudo ./deploy-subdomains.sh --skip-nginx --skip-ssl
```

### Post-Deployment

```bash
# Monitor all apps
./monitor-apps.sh

# Detailed monitoring
./monitor-apps.sh --detailed

# Show logs
./monitor-apps.sh --logs

# JSON output
./monitor-apps.sh --json
```

---

## 🔧 PM2 Commands

```bash
# Status
pm2 status

# Logs (all apps)
pm2 logs

# Logs (specific app)
pm2 logs iiskills-learn-chemistry

# Restart
pm2 restart all                        # All apps
pm2 restart iiskills-learn-chemistry   # Specific app

# Stop
pm2 stop all                           # All apps
pm2 stop iiskills-learn-chemistry      # Specific app

# Monitor
pm2 monit

# Save process list
pm2 save

# View app details
pm2 describe iiskills-learn-chemistry
```

---

## 🌐 Nginx Commands

```bash
# Test configuration
sudo nginx -t

# Reload (no downtime)
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx

# Status
sudo systemctl status nginx

# Logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

---

## 🔒 SSL Commands

```bash
# List certificates
sudo certbot certificates

# Test renewal (dry-run)
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal

# Renew specific domain
sudo certbot renew --cert-name iiskills.cloud

# Check renewal timer
sudo systemctl status certbot.timer
```

---

## 📊 Port Assignments

| App | Port | Subdomain |
|-----|------|-----------|
| main | 3000 | iiskills.cloud |
| learn-apt | 3001 | learn-apt.iiskills.cloud |
| learn-ai | 3002 | learn-ai.iiskills.cloud |
| learn-chemistry | 3003 | learn-chemistry.iiskills.cloud |
| learn-data-science | 3004 | learn-data-science.iiskills.cloud |
| learn-geography | 3005 | learn-geography.iiskills.cloud |
| learn-govt-jobs | 3006 | learn-govt-jobs.iiskills.cloud |
| learn-ias | 3007 | learn-ias.iiskills.cloud |
| learn-jee | 3008 | learn-jee.iiskills.cloud |
| learn-leadership | 3009 | learn-leadership.iiskills.cloud |
| learn-management | 3010 | learn-management.iiskills.cloud |
| learn-math | 3011 | learn-math.iiskills.cloud |
| learn-neet | 3012 | learn-neet.iiskills.cloud |
| learn-physics | 3013 | learn-physics.iiskills.cloud |
| learn-pr | 3014 | learn-pr.iiskills.cloud |
| learn-winning | 3015 | learn-winning.iiskills.cloud |

---

## 🔍 Troubleshooting Quick Fixes

### App Not Running

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs iiskills-learn-chemistry --lines 50

# Restart app
pm2 restart iiskills-learn-chemistry
```

### App Not Responding

```bash
# Check if port is listening
curl http://localhost:3003

# Check health
./monitor-apps.sh --detailed

# View PM2 logs
pm2 logs iiskills-learn-chemistry --err
```

### DNS Issues

```bash
# Verify DNS
./verify-subdomain-dns.sh

# Check specific domain
dig A learn-chemistry.iiskills.cloud

# Check global propagation
# Visit: https://dnschecker.org
```

### SSL Issues

```bash
# Check certificates
sudo certbot certificates

# View certificate details
sudo ls -la /etc/letsencrypt/live/

# Test renewal
sudo certbot renew --dry-run

# Check Certbot logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### Nginx Issues

```bash
# Test config
sudo nginx -t

# Check error log
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### Build Failures

```bash
# Check build logs
cat logs/learn-chemistry-build.log

# Manual build
cd learn-chemistry
npm install
npm run build

# Check Node version
node --version  # Should be 16+
```

---

## 📁 Important File Locations

| Item | Location |
|------|----------|
| PM2 Config | `~/iiskills-cloud/ecosystem.config.js` |
| PM2 Logs | `~/iiskills-cloud/logs/` |
| Nginx Configs | `/etc/nginx/sites-available/` |
| SSL Certs | `/etc/letsencrypt/live/` |
| Deployment Report | `~/iiskills-cloud/DEPLOYMENT_REPORT.md` |
| Environment Files | `~/iiskills-cloud/.env.local` (and in each app dir) |

---

## 🆘 Emergency Recovery

### All Apps Down

```bash
# Check PM2
pm2 status

# Restart all
pm2 restart all

# If PM2 lost processes
pm2 start ecosystem.config.js
pm2 save

# Check Nginx
sudo systemctl status nginx
sudo systemctl restart nginx
```

### Single App Down

```bash
# Identify the app
pm2 status

# Check logs
pm2 logs iiskills-learn-chemistry --err

# Restart
pm2 restart iiskills-learn-chemistry

# If still failing, rebuild
cd learn-chemistry
npm run build
pm2 restart iiskills-learn-chemistry
```

### Server Reboot

PM2 should auto-start all apps. If not:

```bash
# Start all apps
pm2 start ecosystem.config.js

# Enable startup
pm2 startup
pm2 save

# Restart Nginx
sudo systemctl start nginx
```

---

## 📞 Support

- **Email**: info@iiskills.cloud
- **Docs**: See `MULTI_APP_DEPLOYMENT_GUIDE.md`
- **Logs**: Always include PM2 logs and deployment report

---

## ⏱️ Typical Timings

| Task | Duration |
|------|----------|
| DNS Verification | 1-2 minutes |
| Building All Apps | 10-20 minutes |
| PM2 Deployment | 1-2 minutes |
| Nginx Configuration | < 1 minute |
| SSL Certificates (first time) | 5-10 minutes |
| Total First Deployment | 15-30 minutes |
| Subsequent Deployments | 10-15 minutes |

---

## ✅ Pre-Flight Checklist

Before deployment:

- [ ] VPS accessible via SSH
- [ ] DNS records configured (run `./verify-subdomain-dns.sh`)
- [ ] Node.js 16+ installed
- [ ] Nginx installed
- [ ] Certbot installed
- [ ] PM2 installed globally
- [ ] `.env.local` files configured
- [ ] Ports 80, 443, 22 open in firewall
- [ ] At least 4GB RAM available
- [ ] At least 20GB disk space available

---

**Quick Start:**
```bash
./verify-subdomain-dns.sh && sudo ./deploy-subdomains.sh
```

**Monitor Status:**
```bash
./monitor-apps.sh && pm2 status
```

**View Logs:**
```bash
pm2 logs --lines 20
```
