# NGINX Quick Reference Card

## Setup Commands (Run on Production Server)

```bash
# 1. Deploy NGINX configurations
sudo ./setup-nginx.sh

# 2. Obtain SSL certificates (all subdomains)
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

# 3. Verify setup
./verify-nginx.sh
```

## Port Reference

| Subdomain | Port |
|-----------|------|
| app.iiskills.cloud | 3000 |
| learn-ai.iiskills.cloud | 3024 |
| learn-apt.iiskills.cloud | 3002 |
| learn-chemistry.iiskills.cloud | 3005 |
| learn-developer.iiskills.cloud | 3007 |
| learn-geography.iiskills.cloud | 3011 |
| learn-management.iiskills.cloud | 3016 |
| learn-math.iiskills.cloud | 3017 |
| learn-physics.iiskills.cloud | 3020 |
| learn-pr.iiskills.cloud | 3021 |

## Common Tasks

### Check Status
```bash
# PM2 apps
pm2 list
pm2 monit

# NGINX
sudo systemctl status nginx
sudo nginx -t

# Ports
sudo lsof -i :80
sudo lsof -i :443
```

### Restart Services
```bash
# Restart all PM2 apps
pm2 restart all

# Restart specific app
pm2 restart iiskills-main

# Reload NGINX
sudo systemctl reload nginx

# Restart NGINX
sudo systemctl restart nginx
```

### View Logs
```bash
# All access logs
sudo tail -f /var/log/nginx/*.access.log

# All error logs
sudo tail -f /var/log/nginx/*.error.log

# Specific subdomain
sudo tail -f /var/log/nginx/learn-ai.iiskills.cloud.access.log

# PM2 logs
pm2 logs
pm2 logs iiskills-learn-ai
```

### Troubleshooting 502 Errors
```bash
# 1. Check if app is running
pm2 list

# 2. Check if port is listening
sudo lsof -i :3024

# 3. Test localhost directly
curl http://localhost:3024

# 4. Restart app
pm2 restart iiskills-learn-ai

# 5. Check NGINX error logs
sudo tail -f /var/log/nginx/learn-ai.iiskills.cloud.error.log
```

### Update Configuration
```bash
# 1. Edit config in repository
nano nginx-configs/learn-ai.iiskills.cloud

# 2. Copy to NGINX
sudo cp nginx-configs/learn-ai.iiskills.cloud /etc/nginx/sites-available/

# 3. Test configuration
sudo nginx -t

# 4. Reload if valid
sudo systemctl reload nginx

# 5. Commit to git
git add nginx-configs/
git commit -m "Update NGINX config for learn-ai"
git push
```

### SSL Certificate Renewal
```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal

# Reload NGINX after renewal
sudo systemctl reload nginx
```

## Emergency Procedures

### All Sites Down
```bash
# Check NGINX
sudo systemctl status nginx
sudo nginx -t
sudo systemctl restart nginx

# Check PM2
pm2 list
pm2 restart all
pm2 save
```

### Single Site 502 Error
```bash
# Identify the app
pm2 list | grep learn-ai

# Check if running
pm2 describe iiskills-learn-ai

# Restart
pm2 restart iiskills-learn-ai

# Check logs
pm2 logs iiskills-learn-ai --lines 100
```

### NGINX Won't Start
```bash
# Check configuration
sudo nginx -t

# Check error logs
sudo tail -100 /var/log/nginx/error.log

# Restore from backup
sudo cp /path/to/backup/nginx-site.conf /etc/nginx/sites-available/

# Test again
sudo nginx -t
sudo systemctl start nginx
```

## File Locations

- **NGINX Configs (VCS)**: `./nginx-configs/`
- **NGINX Sites Available**: `/etc/nginx/sites-available/`
- **NGINX Sites Enabled**: `/etc/nginx/sites-enabled/`
- **SSL Certificates**: `/etc/letsencrypt/live/`
- **NGINX Logs**: `/var/log/nginx/`
- **PM2 Logs**: `~/.pm2/logs/`

## URLs to Test

After setup, verify these URLs work:
- https://app.iiskills.cloud
- https://learn-ai.iiskills.cloud
- https://learn-apt.iiskills.cloud
- https://learn-chemistry.iiskills.cloud
- https://learn-developer.iiskills.cloud
- https://learn-geography.iiskills.cloud
- https://learn-management.iiskills.cloud
- https://learn-math.iiskills.cloud
- https://learn-physics.iiskills.cloud
- https://learn-pr.iiskills.cloud

All should:
- ✓ Redirect HTTP to HTTPS (301)
- ✓ Return 200 OK on HTTPS
- ✓ Serve actual content (not 502)

## See Also
- `NGINX_SETUP.md` - Complete documentation
- `setup-nginx.sh` - Automated setup script
- `verify-nginx.sh` - Verification script
