# SSL Certificate Deployment Checklist

This checklist ensures all SSL/TLS certificates are properly configured and no security warnings appear on any subdomain.

## Pre-Deployment Checks

### 1. Prerequisites
- [ ] Server has public IP address
- [ ] DNS A records configured for all subdomains
- [ ] Ports 80 and 443 open in firewall
- [ ] NGINX installed and running
- [ ] PM2 apps running on correct ports
- [ ] Certbot and python3-certbot-nginx installed

### 2. Verify DNS Configuration
```bash
# Test all DNS records
./verify-subdomain-dns.sh

# Or manually check each
for domain in app.iiskills.cloud learn-ai.iiskills.cloud learn-apt.iiskills.cloud learn-chemistry.iiskills.cloud learn-developer.iiskills.cloud learn-geography.iiskills.cloud learn-management.iiskills.cloud learn-math.iiskills.cloud learn-physics.iiskills.cloud learn-pr.iiskills.cloud; do
  echo "Checking $domain..."
  nslookup $domain
done
```

**Expected**: All domains should resolve to your server's IP

## Deployment Steps

### 3. Deploy NGINX Configurations
- [ ] Copy updated NGINX configs with enhanced SSL settings
  ```bash
  sudo ./setup-nginx.sh
  ```
- [ ] Verify NGINX configuration is valid
  ```bash
  sudo nginx -t
  ```
- [ ] NGINX reloaded successfully
  ```bash
  sudo systemctl reload nginx
  ```

### 4. Obtain SSL Certificates

#### Option A: All Subdomains at Once (Recommended)
- [ ] Run Certbot for all subdomains
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
    -d learn-pr.iiskills.cloud \
    --email admin@iiskills.cloud \
    --agree-tos \
    --no-eff-email \
    --redirect
  ```

#### Option B: Individual Subdomains
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

### 5. Post-Certificate Installation
- [ ] NGINX configuration test passed
  ```bash
  sudo nginx -t
  ```
- [ ] NGINX reloaded with new certificates
  ```bash
  sudo systemctl reload nginx
  ```
- [ ] All certificate files exist
  ```bash
  sudo ls -la /etc/letsencrypt/live/*/
  ```

## Verification

### 6. Automated Verification
- [ ] Run comprehensive SSL verification
  ```bash
  ./verify-ssl-certificates.sh
  ```
- [ ] All checks passed (0 failures)
- [ ] No expired certificates
- [ ] No certificate chain issues
- [ ] No TLS protocol issues

### 7. Manual Verification - Command Line

For each subdomain, verify:

#### app.iiskills.cloud
- [ ] HTTPS accessible: `curl -I https://app.iiskills.cloud`
- [ ] HTTP redirects to HTTPS: `curl -I http://app.iiskills.cloud`
- [ ] Certificate valid: `./verify-ssl-certificates.sh -d app.iiskills.cloud`

#### learn-ai.iiskills.cloud
- [ ] HTTPS accessible: `curl -I https://learn-ai.iiskills.cloud`
- [ ] HTTP redirects to HTTPS: `curl -I http://learn-ai.iiskills.cloud`
- [ ] Certificate valid: `./verify-ssl-certificates.sh -d learn-ai.iiskills.cloud`

#### learn-apt.iiskills.cloud
- [ ] HTTPS accessible: `curl -I https://learn-apt.iiskills.cloud`
- [ ] HTTP redirects to HTTPS: `curl -I http://learn-apt.iiskills.cloud`
- [ ] Certificate valid: `./verify-ssl-certificates.sh -d learn-apt.iiskills.cloud`

#### learn-chemistry.iiskills.cloud
- [ ] HTTPS accessible: `curl -I https://learn-chemistry.iiskills.cloud`
- [ ] HTTP redirects to HTTPS: `curl -I http://learn-chemistry.iiskills.cloud`
- [ ] Certificate valid: `./verify-ssl-certificates.sh -d learn-chemistry.iiskills.cloud`

#### learn-developer.iiskills.cloud
- [ ] HTTPS accessible: `curl -I https://learn-developer.iiskills.cloud`
- [ ] HTTP redirects to HTTPS: `curl -I http://learn-developer.iiskills.cloud`
- [ ] Certificate valid: `./verify-ssl-certificates.sh -d learn-developer.iiskills.cloud`

#### learn-geography.iiskills.cloud
- [ ] HTTPS accessible: `curl -I https://learn-geography.iiskills.cloud`
- [ ] HTTP redirects to HTTPS: `curl -I http://learn-geography.iiskills.cloud`
- [ ] Certificate valid: `./verify-ssl-certificates.sh -d learn-geography.iiskills.cloud`

#### learn-management.iiskills.cloud
- [ ] HTTPS accessible: `curl -I https://learn-management.iiskills.cloud`
- [ ] HTTP redirects to HTTPS: `curl -I http://learn-management.iiskills.cloud`
- [ ] Certificate valid: `./verify-ssl-certificates.sh -d learn-management.iiskills.cloud`

#### learn-math.iiskills.cloud
- [ ] HTTPS accessible: `curl -I https://learn-math.iiskills.cloud`
- [ ] HTTP redirects to HTTPS: `curl -I http://learn-math.iiskills.cloud`
- [ ] Certificate valid: `./verify-ssl-certificates.sh -d learn-math.iiskills.cloud`

#### learn-physics.iiskills.cloud
- [ ] HTTPS accessible: `curl -I https://learn-physics.iiskills.cloud`
- [ ] HTTP redirects to HTTPS: `curl -I http://learn-physics.iiskills.cloud`
- [ ] Certificate valid: `./verify-ssl-certificates.sh -d learn-physics.iiskills.cloud`

#### learn-pr.iiskills.cloud
- [ ] HTTPS accessible: `curl -I https://learn-pr.iiskills.cloud`
- [ ] HTTP redirects to HTTPS: `curl -I http://learn-pr.iiskills.cloud`
- [ ] Certificate valid: `./verify-ssl-certificates.sh -d learn-pr.iiskills.cloud`

### 8. SSL Labs Testing

Test each subdomain with SSL Labs (should achieve A+ rating):

- [ ] app.iiskills.cloud → https://www.ssllabs.com/ssltest/analyze.html?d=app.iiskills.cloud
- [ ] learn-ai.iiskills.cloud → https://www.ssllabs.com/ssltest/analyze.html?d=learn-ai.iiskills.cloud
- [ ] learn-apt.iiskills.cloud → https://www.ssllabs.com/ssltest/analyze.html?d=learn-apt.iiskills.cloud
- [ ] learn-chemistry.iiskills.cloud → https://www.ssllabs.com/ssltest/analyze.html?d=learn-chemistry.iiskills.cloud
- [ ] learn-developer.iiskills.cloud → https://www.ssllabs.com/ssltest/analyze.html?d=learn-developer.iiskills.cloud
- [ ] learn-geography.iiskills.cloud → https://www.ssllabs.com/ssltest/analyze.html?d=learn-geography.iiskills.cloud
- [ ] learn-management.iiskills.cloud → https://www.ssllabs.com/ssltest/analyze.html?d=learn-management.iiskills.cloud
- [ ] learn-math.iiskills.cloud → https://www.ssllabs.com/ssltest/analyze.html?d=learn-math.iiskills.cloud
- [ ] learn-physics.iiskills.cloud → https://www.ssllabs.com/ssltest/analyze.html?d=learn-physics.iiskills.cloud
- [ ] learn-pr.iiskills.cloud → https://www.ssllabs.com/ssltest/analyze.html?d=learn-pr.iiskills.cloud

**All should show: Grade A or A+**

### 9. Browser Testing

Test each subdomain in multiple browsers (should show green padlock, no warnings):

#### Chrome/Edge
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

#### Firefox
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

#### Safari
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

### 10. Security Tool Testing

Test with security software:

- [ ] Kaspersky - no warnings
- [ ] Avast - no warnings  
- [ ] Norton - no warnings
- [ ] Windows Defender - no warnings
- [ ] macOS/iOS native security - no warnings

## Post-Deployment Configuration

### 11. Automatic Renewal Setup
- [ ] Certbot timer is enabled
  ```bash
  sudo systemctl status certbot.timer
  ```
- [ ] Test automatic renewal
  ```bash
  sudo certbot renew --dry-run
  ```
- [ ] Create post-renewal hook to reload NGINX
  ```bash
  sudo mkdir -p /etc/letsencrypt/renewal-hooks/post/
  sudo tee /etc/letsencrypt/renewal-hooks/post/reload-nginx.sh > /dev/null <<'EOF'
  #!/bin/bash
  systemctl reload nginx
  EOF
  sudo chmod +x /etc/letsencrypt/renewal-hooks/post/reload-nginx.sh
  ```

### 12. Monitoring Setup
- [ ] Daily SSL verification cron job created
  ```bash
  sudo tee /etc/cron.daily/check-ssl > /dev/null <<'EOF'
  #!/bin/bash
  cd /path/to/iiskills-cloud
  ./verify-ssl-certificates.sh --quiet || echo "SSL Issues Detected" | mail -s "SSL Alert" admin@iiskills.cloud
  EOF
  sudo chmod +x /etc/cron.daily/check-ssl
  ```
- [ ] Email notifications configured
- [ ] External monitoring service configured (optional)

### 13. Backup
- [ ] Certificate backup created
  ```bash
  sudo tar -czf /backup/letsencrypt-backup-$(date +%Y%m%d).tar.gz /etc/letsencrypt/
  ```
- [ ] Backup stored securely
- [ ] NGINX config backup created
  ```bash
  sudo tar -czf /backup/nginx-backup-$(date +%Y%m%d).tar.gz /etc/nginx/
  ```

## Documentation

### 14. Documentation Updates
- [ ] SSL_CERTIFICATE_SETUP.md reviewed and up to date
- [ ] SSL_QUICK_REFERENCE.md reviewed and accessible
- [ ] NGINX_SETUP.md includes SSL information
- [ ] Team notified of SSL setup completion
- [ ] Runbook updated with emergency procedures

## Final Verification

### 15. Complete System Check
- [ ] All 10 subdomains accessible via HTTPS
- [ ] No HTTP-only access (all redirect to HTTPS)
- [ ] No certificate warnings in any browser
- [ ] No warnings from security tools
- [ ] SSL Labs shows A+ for all subdomains
- [ ] HSTS headers present on all subdomains
- [ ] OCSP stapling working
- [ ] Automatic renewal tested and working
- [ ] Monitoring alerts configured
- [ ] Team trained on SSL maintenance

## Sign-Off

**Deployment Completed By:** _______________  
**Date:** _______________  
**Verified By:** _______________  
**Date:** _______________  

**Critical Requirement Met:**
- [ ] SSL certificate warnings NEVER appear on ANY subdomain
- [ ] All subdomains achieve A+ SSL Labs rating
- [ ] Verified in multiple browsers with no warnings
- [ ] Tested with security tools (Kaspersky, etc.) - no warnings
- [ ] Automatic renewal configured and tested
- [ ] Monitoring in place
- [ ] Team notified and trained

## Troubleshooting Reference

If any issues are found:

1. **Certificate warnings**: See `SSL_CERTIFICATE_SETUP.md` → Troubleshooting
2. **Renewal issues**: Run `sudo ./renew-ssl-certificates.sh --force`
3. **NGINX errors**: Check `sudo nginx -t` and fix config
4. **Quick fixes**: See `SSL_QUICK_REFERENCE.md`
5. **Emergency**: Immediately run certificate renewal and notify team

---

**REMEMBER**: No SSL warnings should EVER appear. If found during verification, STOP and fix before proceeding.
