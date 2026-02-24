# NGINX Deployment Checklist

Use this checklist when deploying NGINX reverse proxy on the production server.

## Prerequisites

- [ ] Server running Ubuntu/Debian Linux
- [ ] Root or sudo access to the server
- [ ] Git repository cloned on server
- [ ] All apps built and tested locally

## Pre-Deployment Steps

### 1. DNS Configuration
- [ ] Verify DNS A records point to server IP for:
  - [ ] app.iiskills.cloud
  - [ ] learn-ai.iiskills.cloud
  - [ ] learn-apt.iiskills.cloud
  - [ ] learn-chemistry.iiskills.cloud
  - [ ] learn-developer.iiskills.cloud
  - [ ] learn-geography.iiskills.cloud
  - [ ] learn-management.iiskills.cloud
  - [ ] learn-math.iiskills.cloud
  - [ ] learn-physics.iiskills.cloud
  - [ ] learn-pr.iiskills.cloud

### 2. Server Preparation
- [ ] Update system packages: `sudo apt-get update && sudo apt-get upgrade`
- [ ] Install NGINX: `sudo apt-get install nginx` (or let script do it)
- [ ] Install Certbot: `sudo apt-get install certbot python3-certbot-nginx`
- [ ] Open firewall ports: `sudo ufw allow 80` and `sudo ufw allow 443`
- [ ] Install Node.js and npm (for PM2)
- [ ] Install PM2 globally: `npm install -g pm2`

### 3. Repository Setup
- [ ] Clone repository: `git clone https://github.com/phildass/iiskills-cloud.git`
- [ ] Navigate to directory: `cd iiskills-cloud`
- [ ] Checkout correct branch if needed
- [ ] Install dependencies: `yarn install`
- [ ] Create .env.local files for all apps
- [ ] Build all apps: `yarn build`

### 4. PM2 Configuration
- [ ] Verify ecosystem.config.js is present
- [ ] Check port assignments match appRegistry.js
- [ ] Start all apps: `pm2 start ecosystem.config.js`
- [ ] Verify all apps are online: `pm2 list`
- [ ] Save PM2 configuration: `pm2 save`
- [ ] Setup PM2 startup: `pm2 startup` (follow instructions)

## Deployment Steps

### 5. NGINX Configuration Deployment
- [ ] Make scripts executable: `chmod +x setup-nginx.sh verify-nginx.sh`
- [ ] Run setup script: `sudo ./setup-nginx.sh`
- [ ] Review script output for errors
- [ ] Verify configs copied to /etc/nginx/sites-available/
- [ ] Verify symlinks created in /etc/nginx/sites-enabled/
- [ ] Test NGINX configuration: `sudo nginx -t`
- [ ] Check NGINX is running: `sudo systemctl status nginx`

### 6. SSL Certificate Setup
- [ ] Run Certbot for all domains:
  ```bash
  sudo certbot --nginx \
    -d app.iiskills.cloud \
    -d learn-ai.iiskills.cloud \
    -d learn-apt.iiskills.cloud \
    -d learn-chemistry.iiskills.cloud \
    -d learn-developer.iiskills.cloud \
    -d learn-geography.iiskills.cloud \
    -d learn-management.iiskills.cloud \
    -d learn-math.iiskills.cloud \
    -d learn-physics.iiskills.cloud \
    -d learn-pr.iiskills.cloud
  ```
- [ ] Provide email address for urgent renewal notices
- [ ] Agree to Let's Encrypt Terms of Service
- [ ] Wait for certificate issuance (can take 1-2 minutes)
- [ ] Verify certificates installed: `sudo ls -la /etc/letsencrypt/live/`
- [ ] Test renewal: `sudo certbot renew --dry-run`

### 7. Verification
- [ ] Run verification script: `./verify-nginx.sh`
- [ ] Check all localhost ports are responding
- [ ] Verify HTTP to HTTPS redirects (301/302)
- [ ] Verify HTTPS serves content (200 OK)
- [ ] Verify no 502 errors

## Post-Deployment Testing

### 8. Manual Browser Testing
Test each URL in a browser:
- [ ] https://app.iiskills.cloud - Main app loads
- [ ] https://learn-ai.iiskills.cloud - Learn-AI loads
- [ ] https://learn-apt.iiskills.cloud - Learn-Apt loads
- [ ] https://learn-chemistry.iiskills.cloud - Learn-Chemistry loads
- [ ] https://learn-developer.iiskills.cloud - Learn-Developer loads
- [ ] https://learn-geography.iiskills.cloud - Learn-Geography loads
- [ ] https://learn-management.iiskills.cloud - Learn-Management loads
- [ ] https://learn-math.iiskills.cloud - Learn-Math loads
- [ ] https://learn-physics.iiskills.cloud - Learn-Physics loads
- [ ] https://learn-pr.iiskills.cloud - Learn-PR loads

### 9. Functionality Testing
For each subdomain:
- [ ] Homepage loads without errors
- [ ] Navigation works
- [ ] Images load correctly
- [ ] API endpoints respond
- [ ] Authentication works (if applicable)
- [ ] No console errors in browser

### 10. Performance and Monitoring
- [ ] Check response times are acceptable
- [ ] Monitor NGINX access logs: `sudo tail -f /var/log/nginx/*.access.log`
- [ ] Monitor NGINX error logs: `sudo tail -f /var/log/nginx/*.error.log`
- [ ] Monitor PM2 processes: `pm2 monit`
- [ ] Check server resources: `htop` or `top`

## Documentation

### 11. Record Configuration
- [ ] Document server IP address
- [ ] Document DNS provider and account
- [ ] Note any firewall rules added
- [ ] Save Certbot email address used
- [ ] Document any custom configurations made

### 12. Backup
- [ ] Backup NGINX configs: `sudo tar -czf nginx-backup-$(date +%Y%m%d).tar.gz /etc/nginx/`
- [ ] Store backup in secure location
- [ ] Document backup location

## Ongoing Maintenance

### 13. Setup Monitoring
- [ ] Configure uptime monitoring (e.g., UptimeRobot, Pingdom)
- [ ] Set up log rotation for NGINX logs
- [ ] Configure alerts for disk space
- [ ] Set up alerts for PM2 process failures

### 14. Schedule Regular Tasks
- [ ] Weekly: Review NGINX access logs for issues
- [ ] Weekly: Check PM2 status: `pm2 list`
- [ ] Monthly: Verify SSL certificates auto-renew
- [ ] Monthly: Update system packages
- [ ] Quarterly: Review and update NGINX security headers

## Rollback Plan

If deployment fails:
- [ ] Stop NGINX: `sudo systemctl stop nginx`
- [ ] Remove symlinks: `sudo rm /etc/nginx/sites-enabled/*`
- [ ] Restore previous configs (if any)
- [ ] Start NGINX: `sudo systemctl start nginx`
- [ ] Review logs to identify issue
- [ ] Fix issue and retry deployment

## Success Criteria

Deployment is successful when:
- ✅ All 10 subdomains are accessible via HTTPS
- ✅ HTTP automatically redirects to HTTPS
- ✅ No 502 Bad Gateway errors
- ✅ SSL certificates valid and trusted
- ✅ All PM2 apps running and healthy
- ✅ NGINX configuration valid and loaded
- ✅ Response times acceptable
- ✅ No errors in logs

## Sign-Off

- [ ] Deployment completed by: _________________ Date: _______
- [ ] Verified by: _________________ Date: _______
- [ ] Known issues documented: _________________
- [ ] Next review scheduled: _________________

---

## Quick Commands Reference

```bash
# PM2 Status
pm2 list
pm2 monit
pm2 logs

# NGINX Status
sudo systemctl status nginx
sudo nginx -t
sudo systemctl reload nginx

# Logs
sudo tail -f /var/log/nginx/*.access.log
sudo tail -f /var/log/nginx/*.error.log
pm2 logs

# Restart Everything
pm2 restart all
sudo systemctl reload nginx
```

## Support Contacts

- Infrastructure: _________________
- Development Team: _________________
- DNS Provider: _________________
- Hosting Provider: _________________

---

**Note**: Keep this checklist with your deployment documentation for future reference.
