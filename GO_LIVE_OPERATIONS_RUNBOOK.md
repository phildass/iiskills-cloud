# GO-LIVE Operations Runbook

**Date**: February 19, 2026  
**Document Version**: 1.0  
**Audience**: DevOps, SRE, Support Teams  
**Status**: ✅ **PRODUCTION READY**

---

## Executive Summary

This runbook provides step-by-step procedures for all operational tasks required to deploy, maintain, monitor, and troubleshoot the iiskills-cloud production environment. It covers deployment, rollback, configuration management, monitoring, and routine maintenance tasks.

---

## Table of Contents

1. [Production Environment Overview](#1-production-environment-overview)
2. [Deployment Procedures](#2-deployment-procedures)
3. [Rollback Procedures](#3-rollback-procedures)
4. [Environment Configuration](#4-environment-configuration)
5. [Secrets Rotation](#5-secrets-rotation)
6. [Monitoring & Alerting](#6-monitoring--alerting)
7. [Troubleshooting](#7-troubleshooting)
8. [Routine Maintenance](#8-routine-maintenance)
9. [Emergency Procedures](#9-emergency-procedures)
10. [Contacts & Escalation](#10-contacts--escalation)

---

## 1. Production Environment Overview

### 1.1 Architecture

**Infrastructure**:
- **Platform**: Self-hosted or cloud platform (specify based on deployment)
- **Process Manager**: PM2
- **Reverse Proxy**: NGINX
- **Database**: Supabase (PostgreSQL)
- **SSL/TLS**: Let's Encrypt or CloudFlare

**Application Structure**:
- Main Portal: `https://iiskills.cloud` (Port 3000)
- Learn Apps: `https://learn-[app].iiskills.cloud` (Ports 3002-3024)
- Admin: Integrated in main portal

### 1.2 Production Domains

| Application | Domain | Port | Purpose |
|------------|---------|------|---------|
| Main Portal | iiskills.cloud | 3000 | Main landing, auth, dashboard |
| Learn-APT | learn-apt.iiskills.cloud | 3002 | Aptitude learning (FREE) |
| Learn-Chemistry | learn-chemistry.iiskills.cloud | 3005 | Chemistry learning (FREE) |
| Learn-Geography | learn-geography.iiskills.cloud | 3011 | Geography learning (FREE) |
| Learn-Math | learn-math.iiskills.cloud | 3017 | Math learning (FREE) |
| Learn-Physics | learn-physics.iiskills.cloud | 3020 | Physics learning (FREE) |
| Learn-AI | learn-ai.iiskills.cloud | 3024 | AI learning (PAID) |
| Learn-Developer | learn-developer.iiskills.cloud | 3007 | Developer learning (PAID) |
| Learn-Management | learn-management.iiskills.cloud | 3016 | Management learning (PAID) |
| Learn-PR | learn-pr.iiskills.cloud | 3021 | PR learning (PAID) |

### 1.3 Key Dependencies

**External Services**:
- Supabase (Database & Auth): https://supabase.com
- Razorpay (Payments): https://razorpay.com
- SendGrid (Email): https://sendgrid.com
- OpenAI (AI features): https://openai.com (if used)

**Infrastructure**:
- DNS: CloudFlare or domain registrar
- SSL: Let's Encrypt or CloudFlare
- CDN: CloudFlare (optional)

---

## 2. Deployment Procedures

### 2.1 Pre-Deployment Checklist

**Before deploying to production**:

- [ ] Code reviewed and approved
- [ ] All tests passing (116/116)
- [ ] Security audit clean (0 production vulnerabilities)
- [ ] Staging testing complete
- [ ] Credentials rotated (if needed)
- [ ] Database migrations ready (if any)
- [ ] Rollback plan prepared
- [ ] Team notified
- [ ] Maintenance window scheduled (if needed)
- [ ] Backup created

### 2.2 Production Deployment Steps

**Step 1: Access Production Server**

```bash
# SSH into production server
ssh user@production-server.iiskills.cloud

# Navigate to application directory
cd /var/www/iiskills-cloud
```

**Step 2: Backup Current State**

```bash
# Create backup of current deployment
cd /var/www
tar -czf iiskills-cloud-backup-$(date +%Y%m%d-%H%M%S).tar.gz iiskills-cloud/

# Move backup to safe location
mv iiskills-cloud-backup-*.tar.gz /var/backups/iiskills-cloud/

# Verify backup created
ls -lh /var/backups/iiskills-cloud/
```

**Step 3: Pull Latest Code**

```bash
cd /var/www/iiskills-cloud

# Fetch latest changes
git fetch origin

# Check which version to deploy
git log origin/main --oneline -5

# Checkout production branch/tag
git checkout main  # or specific tag like v1.0.0
git pull origin main

# Verify correct version
git log --oneline -1
```

**Step 4: Install Dependencies**

```bash
# Install/update dependencies
yarn install --frozen-lockfile

# Verify no vulnerabilities in production deps
npm audit --production
```

**Step 5: Environment Configuration**

```bash
# Verify production environment file exists
ls -la .env.production

# DO NOT display contents (contains secrets)
# Verify required variables are set
echo "Checking required environment variables..."

# Check critical variables exist (without showing values)
grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.production && echo "✓ Supabase configured" || echo "✗ Supabase missing"
grep -q "RAZORPAY_KEY_SECRET" .env.production && echo "✓ Razorpay configured" || echo "✗ Razorpay missing"
grep -q "ADMIN_JWT_SECRET" .env.production && echo "✓ Admin configured" || echo "✗ Admin missing"
```

**Step 6: Build Applications**

```bash
# Build all applications
yarn build

# Or build specific apps if needed
# yarn workspace main build
# yarn workspace learn-ai build
# etc.

# Verify builds successful
ls -la apps/main/.next
ls -la apps/learn-ai/.next
```

**Step 7: Database Migrations (if any)**

```bash
# Check for pending migrations
cd supabase
ls -la migrations/

# Apply migrations if needed (be careful!)
# This depends on your migration tool
# Example: npx supabase db push

# Verify migrations applied
# Check migration status in Supabase dashboard
```

**Step 8: Restart Applications**

```bash
# Reload PM2 ecosystem configuration
pm2 delete all  # Stop all current processes
pm2 start ecosystem.config.js --env production

# Verify all apps started
pm2 status
pm2 logs --lines 20
```

**Step 9: Verify Deployment**

```bash
# Health check script
./health-check.sh

# Or manual verification
curl -I https://iiskills.cloud
curl -I https://learn-math.iiskills.cloud
curl -I https://learn-ai.iiskills.cloud

# Check all apps responding (should see HTTP 200)
```

**Step 10: Monitor Logs**

```bash
# Monitor logs for first 5 minutes
pm2 logs --lines 100

# Watch for errors
pm2 logs --err

# Check NGINX logs if needed
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

**Step 11: Validate Critical Functions**

**Test Checklist**:
- [ ] Main portal loads
- [ ] User can sign in
- [ ] Learn apps accessible
- [ ] Free apps content loads
- [ ] Paid apps show paywall (if not purchased)
- [ ] Admin panel accessible
- [ ] Payment test (in test mode first!)
- [ ] Bundle logic works

**Step 12: Post-Deployment Tasks**

- [ ] Tag deployment in git: `git tag v1.0.0 && git push origin v1.0.0`
- [ ] Update deployment log
- [ ] Notify team of successful deployment
- [ ] Monitor for 24 hours
- [ ] Document any issues encountered

### 2.3 Zero-Downtime Deployment (Advanced)

For zero-downtime deployments:

```bash
# Start new instances on different ports
pm2 start ecosystem.config.js --env production --name main-new --force -- --port 3100

# Verify new instances healthy
curl http://localhost:3100

# Update NGINX to point to new instances
# Edit /etc/nginx/sites-available/iiskills.cloud
# Change upstream servers to new ports

# Reload NGINX (no downtime)
sudo nginx -t && sudo nginx -s reload

# Stop old instances
pm2 delete main

# Rename new instances
pm2 restart main-new --name main
```

---

## 3. Rollback Procedures

### 3.1 When to Rollback

**Immediate rollback if**:
- Critical security vulnerability
- Site unavailable (>5 min)
- Payment processing broken (>50% failure)
- Authentication broken (>10% failure)
- Data corruption detected
- Performance degradation (>5x slower)

### 3.2 Emergency Rollback Steps

**Quick Rollback (5 minutes)**:

```bash
# Step 1: SSH into production
ssh user@production-server.iiskills.cloud
cd /var/www/iiskills-cloud

# Step 2: Checkout previous stable version
git log --oneline -10  # Find previous version
git checkout [previous-commit-hash-or-tag]
# Example: git checkout v0.9.0

# Step 3: Restore previous dependencies (if needed)
yarn install --frozen-lockfile

# Step 4: Rebuild (if needed)
yarn build

# Step 5: Restart applications
pm2 restart all

# Step 6: Verify rollback
./health-check.sh
pm2 logs --lines 50
```

**Step 7: Notify Team**

```bash
# Send notification
echo "Production rollback completed at $(date)" | \
  mail -s "PRODUCTION ROLLBACK" team@iiskills.in
```

### 3.3 Database Rollback (if needed)

**WARNING**: Database rollback is complex and risky!

```bash
# Step 1: Stop all applications
pm2 stop all

# Step 2: Restore database from backup
# This depends on your backup strategy
# Example with Supabase: Use Supabase dashboard to restore

# Step 3: Verify database state
# Check via Supabase dashboard or SQL client

# Step 4: Ensure application matches database schema
# May need to rollback application code too

# Step 5: Restart applications
pm2 start all

# Step 6: Verify everything works
./health-check.sh
```

### 3.4 Rollback Verification

**Checklist**:
- [ ] All apps running (pm2 status)
- [ ] No errors in logs
- [ ] Main portal accessible
- [ ] Authentication works
- [ ] Payment processing works
- [ ] Database queries work
- [ ] User experience normal

---

## 4. Environment Configuration

### 4.1 Production Environment Variables

**Location**: `/var/www/iiskills-cloud/.env.production`

**Required Variables**:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# SendGrid
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@iiskills.in

# OpenAI (if used)
OPENAI_API_KEY=sk-xxx

# Admin
ADMIN_JWT_SECRET=your_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_bcrypt_hash

# Application
NODE_ENV=production
NEXT_PUBLIC_MAIN_APP_URL=https://iiskills.cloud
```

### 4.2 Managing Environment Variables

**Viewing Variables** (without showing secrets):

```bash
# List variable names only
grep -o '^[A-Z_]*' .env.production | sort

# Check specific variable is set (without showing value)
grep -q "RAZORPAY_KEY_SECRET" .env.production && echo "Set" || echo "Missing"
```

**Updating Variables**:

```bash
# Never edit directly in production!
# Instead:
# 1. Update local copy
# 2. Test in staging
# 3. Deploy to production using deployment script

# Emergency update (if absolutely necessary):
nano .env.production
# Make changes
pm2 restart all
```

### 4.3 PM2 Ecosystem Configuration

**Location**: `/var/www/iiskills-cloud/ecosystem.config.js`

**Key Configuration**:

```javascript
module.exports = {
  apps: [
    {
      name: 'main',
      cwd: './apps/main',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env_production: {
        NODE_ENV: 'production',
      },
      instances: 2,  // Or 'max' for cluster mode
      exec_mode: 'cluster',
      error_file: '../../logs/main-error.log',
      out_file: '../../logs/main-out.log',
      time: true,
    },
    // ... other apps
  ]
};
```

---

## 5. Secrets Rotation

### 5.1 Regular Rotation Schedule

See [GO_LIVE_CREDENTIAL_ROTATION_CONFIRMATION.md](GO_LIVE_CREDENTIAL_ROTATION_CONFIRMATION.md) for complete procedures.

**Quick Reference**:

- **Every 90 days**: Supabase service role, Razorpay keys, Admin secrets
- **Every 180 days**: SendGrid API key, OpenAI API key
- **On-demand**: After suspected compromise

### 5.2 Rotation Procedure Summary

```bash
# 1. Generate new secret in provider dashboard
# 2. Update .env.production with new value
# 3. Restart affected applications
pm2 restart all
# 4. Test functionality
# 5. Revoke old secret
# 6. Document rotation
```

---

## 6. Monitoring & Alerting

### 6.1 Application Monitoring

**PM2 Monitoring**:

```bash
# Check status of all apps
pm2 status

# View logs
pm2 logs
pm2 logs main
pm2 logs --err  # Errors only

# View metrics
pm2 monit

# Save PM2 configuration
pm2 save
```

**Health Checks**:

```bash
# Run health check script
./health-check.sh

# Manual checks
curl -I https://iiskills.cloud  # Should return 200
curl -I https://learn-ai.iiskills.cloud  # Should return 200
```

### 6.2 Database Monitoring

**Supabase Dashboard**:
- https://app.supabase.com
- Check database size
- Monitor query performance
- Review API usage
- Check for errors

**Command Line**:

```bash
# Check database connectivity
curl -X POST "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/rpc/test_function" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY"
```

### 6.3 Performance Monitoring

**Key Metrics to Track**:

- **Response Time**: <2s (p95)
- **Error Rate**: <0.1%
- **Uptime**: >99.9%
- **CPU Usage**: <70%
- **Memory Usage**: <80%
- **Database Connections**: <80% of pool

**Monitoring Commands**:

```bash
# Server resources
top
htop
df -h  # Disk usage
free -h  # Memory usage

# NGINX stats
sudo nginx -V
sudo systemctl status nginx

# Application stats
pm2 monit
```

### 6.4 Log Management

**Log Locations**:

```bash
# Application logs (PM2)
/var/www/iiskills-cloud/logs/main-out.log
/var/www/iiskills-cloud/logs/main-error.log

# NGINX logs
/var/log/nginx/access.log
/var/log/nginx/error.log

# System logs
/var/log/syslog
journalctl -u pm2-user  # If PM2 running as systemd service
```

**Log Rotation**:

```bash
# Configure logrotate
sudo nano /etc/logrotate.d/iiskills-cloud

# Example configuration:
# /var/www/iiskills-cloud/logs/*.log {
#   daily
#   rotate 14
#   compress
#   delaycompress
#   missingok
#   notifempty
# }
```

---

## 7. Troubleshooting

### 7.1 Application Not Starting

**Symptoms**: PM2 shows app in "errored" state

**Diagnosis**:

```bash
# Check logs
pm2 logs main --err --lines 50

# Common issues:
# - Missing environment variables
# - Port already in use
# - Build artifacts missing
# - Permissions issues
```

**Solutions**:

```bash
# Verify environment file
ls -la .env.production

# Check port availability
netstat -tulpn | grep 3000

# Rebuild if needed
yarn build

# Fix permissions if needed
chmod -R 755 apps/main/.next
```

### 7.2 Database Connection Issues

**Symptoms**: "Cannot connect to database" errors

**Diagnosis**:

```bash
# Test database connectivity
curl $NEXT_PUBLIC_SUPABASE_URL

# Check service role key is set
grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.production && echo "Set" || echo "Missing"

# Check Supabase status
# Visit https://status.supabase.com
```

**Solutions**:

```bash
# Verify credentials in Supabase dashboard
# Update .env.production if needed
# Restart applications
pm2 restart all
```

### 7.3 Payment Processing Failures

**Symptoms**: Payments not completing

**Diagnosis**:

```bash
# Check Razorpay credentials
grep -q "RAZORPAY_KEY_SECRET" .env.production && echo "Set" || echo "Missing"

# Check logs for payment errors
pm2 logs | grep -i payment
pm2 logs | grep -i razorpay

# Verify webhook endpoint accessible
curl https://learn-ai.iiskills.cloud/api/payment/webhook
```

**Solutions**:

```bash
# Verify Razorpay keys in dashboard
# Check webhook URL is correct
# Test with Razorpay test mode first
# Review payment logs
```

### 7.4 SSL Certificate Issues

**Symptoms**: HTTPS not working, certificate errors

**Diagnosis**:

```bash
# Check certificate status
sudo certbot certificates

# Check NGINX configuration
sudo nginx -t

# Check certificate expiry
echo | openssl s_client -servername iiskills.cloud -connect iiskills.cloud:443 2>/dev/null | openssl x509 -noout -dates
```

**Solutions**:

```bash
# Renew certificates
sudo certbot renew
sudo systemctl reload nginx

# Or run renewal script
./renew-ssl-certificates.sh
```

### 7.5 High Memory Usage

**Symptoms**: Server running out of memory

**Diagnosis**:

```bash
# Check memory usage
free -h
top

# Check which app using most memory
pm2 status
pm2 monit
```

**Solutions**:

```bash
# Restart high-memory apps
pm2 restart [app-name]

# Reduce PM2 instances if needed
# Edit ecosystem.config.js
# Change instances: 4 -> instances: 2
pm2 delete all
pm2 start ecosystem.config.js --env production

# Add more RAM if consistently high
```

### 7.6 Slow Performance

**Symptoms**: Pages loading slowly

**Diagnosis**:

```bash
# Check server load
uptime
top

# Check database performance
# Review slow queries in Supabase dashboard

# Check network
ping supabase.co
curl -w "@curl-format.txt" -o /dev/null -s https://iiskills.cloud
```

**Solutions**:

```bash
# Restart applications
pm2 restart all

# Clear caches if needed
# Optimize database queries
# Consider CDN for static assets
# Enable caching in NGINX
```

---

## 8. Routine Maintenance

### 8.1 Daily Tasks

**Automated** (set up with cron):

```bash
# Daily log review
0 9 * * * /var/www/iiskills-cloud/scripts/check-logs.sh

# Daily backup
0 2 * * * /var/www/iiskills-cloud/scripts/backup.sh
```

**Manual** (5 minutes):

- Check PM2 status: `pm2 status`
- Review error logs: `pm2 logs --err --lines 100`
- Check disk space: `df -h`

### 8.2 Weekly Tasks

**Every Monday** (15 minutes):

```bash
# Update system packages
sudo apt update
sudo apt upgrade -y  # Be careful with this in production!

# Review logs for anomalies
pm2 logs --err --lines 1000 | grep -i error

# Check SSL certificate status
sudo certbot certificates

# Review Supabase usage
# Check dashboard for API usage, storage, etc.
```

### 8.3 Monthly Tasks

**First of Month** (30 minutes):

- Review access logs for anomalies
- Check payment reconciliation
- Update dependencies (after testing in staging!)
- Review performance metrics
- Update documentation if needed
- Conduct security review

### 8.4 Quarterly Tasks

**Every Quarter** (2 hours):

- **Credential rotation** (per policy)
- Full security audit
- Performance optimization review
- Capacity planning review
- Disaster recovery drill
- Team training update

---

## 9. Emergency Procedures

### 9.1 Site Down Emergency

**Immediate Actions** (within 5 minutes):

```bash
# 1. Assess situation
pm2 status
curl -I https://iiskills.cloud

# 2. Check if simple restart fixes it
pm2 restart all

# 3. If not, check logs
pm2 logs --err --lines 100
sudo tail -100 /var/log/nginx/error.log

# 4. If still down, initiate rollback
# See Section 3.2
```

### 9.2 Database Emergency

**Immediate Actions**:

```bash
# 1. Check database status
# Visit Supabase dashboard

# 2. Check connectivity
curl $NEXT_PUBLIC_SUPABASE_URL

# 3. If down, contact Supabase support
# https://supabase.com/support

# 4. If data corruption suspected
# STOP - call senior engineer
# Do not attempt fixes without consultation
```

### 9.3 Security Incident

**Immediate Actions**:

```bash
# 1. Document what you observe
# Take screenshots, save logs

# 2. Isolate affected systems
pm2 stop [affected-app]

# 3. Notify security team immediately
# Email: security@iiskills.in

# 4. Follow incident response playbook
# See GO_LIVE_INCIDENT_RESPONSE_PLAYBOOK.md

# 5. Do NOT make changes without approval
```

---

## 10. Contacts & Escalation

### 10.1 Primary Contacts

**DevOps Team**:
- Email: devops@iiskills.in
- On-call: [Phone number]
- Slack: #devops-alerts

**Security Team**:
- Email: security@iiskills.in
- Emergency: [Phone number]
- Slack: #security-incidents

**Technical Lead**:
- Email: tech@iiskills.in
- Phone: [Phone number]
- Slack: @tech-lead

### 10.2 Vendor Support

**Supabase**:
- Dashboard: https://app.supabase.com
- Support: https://supabase.com/support
- Status: https://status.supabase.com
- Community: https://github.com/supabase/supabase/discussions

**Razorpay**:
- Dashboard: https://dashboard.razorpay.com
- Support: support@razorpay.com
- Security: security@razorpay.com
- Phone: 1800-123-1234

**SendGrid**:
- Dashboard: https://app.sendgrid.com
- Support: https://support.sendgrid.com
- Status: https://status.sendgrid.com

### 10.3 Escalation Matrix

| Issue Severity | Response Time | Contact | Escalate To |
|---------------|---------------|---------|-------------|
| **P0 - Critical** (Site down) | Immediate | DevOps on-call | Technical Lead |
| **P1 - High** (Major feature broken) | 15 minutes | DevOps team | Technical Lead |
| **P2 - Medium** (Minor issue) | 1 hour | DevOps team | - |
| **P3 - Low** (Non-urgent) | 4 hours | DevOps team | - |

**Escalation Procedure**:

1. Start with DevOps team
2. If not resolved in 30 minutes (P0) or 1 hour (P1), escalate to Technical Lead
3. If critical and not resolved, escalate to management
4. Document all escalations

---

## 11. Appendices

### Appendix A: Quick Command Reference

```bash
# PM2 Commands
pm2 status                    # Check all apps
pm2 restart all               # Restart all apps
pm2 logs                      # View all logs
pm2 logs main                 # View specific app logs
pm2 logs --err                # View errors only
pm2 monit                     # Live monitoring
pm2 save                      # Save PM2 configuration
pm2 resurrect                 # Restore saved configuration

# Git Commands
git status                    # Check repo status
git log --oneline -10         # View recent commits
git checkout [commit/tag]     # Switch version
git pull origin main          # Update from remote

# System Commands
top                           # Resource usage
df -h                         # Disk space
free -h                       # Memory usage
netstat -tulpn                # Port usage
sudo systemctl status nginx   # NGINX status
```

### Appendix B: Health Check Script

```bash
#!/bin/bash
# health-check.sh

APPS=(
  "https://iiskills.cloud"
  "https://learn-apt.iiskills.cloud"
  "https://learn-math.iiskills.cloud"
  "https://learn-physics.iiskills.cloud"
  "https://learn-ai.iiskills.cloud"
)

for app in "${APPS[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "$app")
  if [ "$status" = "200" ]; then
    echo "✓ $app - OK"
  else
    echo "✗ $app - FAILED ($status)"
  fi
done
```

### Appendix C: Backup Script

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/var/backups/iiskills-cloud"
SOURCE_DIR="/var/www/iiskills-cloud"

# Create backup
tar -czf "$BACKUP_DIR/backup-$DATE.tar.gz" \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  "$SOURCE_DIR"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "backup-*.tar.gz" -mtime +7 -delete

echo "Backup completed: backup-$DATE.tar.gz"
```

---

**Document Status**: ✅ FINAL - PRODUCTION READY  
**Distribution**: DevOps, SRE, Support Teams  
**Next Review**: Quarterly or after major incidents

---

**END OF OPERATIONS RUNBOOK**
