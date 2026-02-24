# SSL Certificate Management - Quick Reference

## Critical Requirement

**SSL certificate warnings must NEVER appear on any iiskills.cloud subdomain.**

All certificates must be:
- ✅ Valid and not expired
- ✅ Properly issued for the subdomain
- ✅ Correctly installed (full chain)
- ✅ From a trusted CA (Let's Encrypt)
- ✅ No mismatches or errors

## Quick Commands

### Check Certificate Status

```bash
# Check all certificates
sudo certbot certificates

# Verify SSL for all subdomains
./verify-ssl-certificates.sh

# Check specific subdomain
./verify-ssl-certificates.sh -d learn-apt.iiskills.cloud
```

### Obtain Initial Certificates

```bash
# All subdomains at once (RECOMMENDED)
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
  --redirect

# Reload NGINX
sudo systemctl reload nginx
```

### Renew Certificates

```bash
# Test renewal (dry run - safe)
sudo certbot renew --dry-run

# Renew certificates that are due
sudo certbot renew
sudo systemctl reload nginx

# Force renew all certificates
sudo certbot renew --force-renewal
sudo systemctl reload nginx

# Use automated script
sudo ./renew-ssl-certificates.sh
```

### Fix Certificate Issues

```bash
# Certificate expired or has issues
sudo certbot delete --cert-name learn-apt.iiskills.cloud
sudo certbot --nginx -d learn-apt.iiskills.cloud --email admin@iiskills.cloud --agree-tos --redirect
sudo systemctl reload nginx

# Verify fix
./verify-ssl-certificates.sh -d learn-apt.iiskills.cloud
```

### Test SSL Configuration

```bash
# Quick SSL check
curl -vI https://learn-apt.iiskills.cloud 2>&1 | grep -E "SSL|certificate"

# Check certificate expiry
echo | openssl s_client -servername learn-apt.iiskills.cloud -connect learn-apt.iiskills.cloud:443 2>/dev/null | openssl x509 -noout -dates

# Check certificate chain
echo | openssl s_client -servername learn-apt.iiskills.cloud -connect learn-apt.iiskills.cloud:443 -showcerts 2>/dev/null | grep -c "BEGIN CERTIFICATE"
# Should return 2+ (server cert + intermediate)

# Online SSL test (should achieve A+)
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=learn-apt.iiskills.cloud
```

## Common Issues and Solutions

### Issue: Certificate Expired

**Solution:**
```bash
sudo certbot renew --force-renewal
sudo systemctl reload nginx
./verify-ssl-certificates.sh
```

### Issue: Certificate Warning in Browser

**Possible causes:**
1. Certificate expired
2. Incomplete certificate chain (missing intermediate)
3. Certificate doesn't include the subdomain
4. Self-signed certificate

**Solution:**
```bash
# Check what's wrong
./verify-ssl-certificates.sh -d learn-apt.iiskills.cloud

# Reinstall certificate
sudo certbot delete --cert-name learn-apt.iiskills.cloud
sudo certbot --nginx -d learn-apt.iiskills.cloud --email admin@iiskills.cloud --agree-tos --redirect
sudo systemctl reload nginx

# Verify fix
./verify-ssl-certificates.sh -d learn-apt.iiskills.cloud
```

### Issue: Kaspersky or Security Tool Warning

**Solution:**
```bash
# Ensure certificate is from trusted CA
sudo certbot certificates -d learn-apt.iiskills.cloud

# Verify full chain is installed
sudo ls -la /etc/letsencrypt/live/learn-apt.iiskills.cloud/
# Should show: fullchain.pem, chain.pem, cert.pem, privkey.pem

# Check NGINX uses fullchain.pem (not cert.pem)
sudo grep ssl_certificate /etc/nginx/sites-enabled/learn-apt.iiskills.cloud

# Verify SSL configuration
./verify-ssl-certificates.sh -d learn-apt.iiskills.cloud

# Test with SSL Labs (should be A+)
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=learn-apt.iiskills.cloud
```

### Issue: HTTP Not Redirecting to HTTPS

**Solution:**
```bash
# Check NGINX config has redirect
sudo grep "return 301" /etc/nginx/sites-enabled/learn-apt.iiskills.cloud

# Test NGINX config
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx

# Test redirect
curl -I http://learn-apt.iiskills.cloud
# Should return 301 Moved Permanently with Location: https://...
```

### Issue: NGINX Configuration Error After Certbot

**Solution:**
```bash
# Test NGINX config
sudo nginx -t

# If errors, restore backup or fix config
sudo cp nginx-configs/learn-apt.iiskills.cloud /etc/nginx/sites-available/learn-apt.iiskills.cloud

# Re-run Certbot
sudo certbot --nginx -d learn-apt.iiskills.cloud --email admin@iiskills.cloud --agree-tos --redirect

# Test and reload
sudo nginx -t && sudo systemctl reload nginx
```

## Monitoring and Maintenance

### Set Up Automatic Monitoring

```bash
# Create daily SSL check cron job
sudo tee /etc/cron.daily/check-ssl-status > /dev/null <<'EOF'
#!/bin/bash
cd /path/to/iiskills-cloud
./verify-ssl-certificates.sh --quiet || echo "SSL Certificate Issues Detected" | mail -s "ALERT: SSL Issues" admin@iiskills.cloud
EOF

sudo chmod +x /etc/cron.daily/check-ssl-status
```

### Check Automatic Renewal

```bash
# Verify certbot timer is active
sudo systemctl status certbot.timer

# View next renewal time
sudo certbot renew --dry-run

# Enable timer if not active
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Certificate Backup

```bash
# Backup all certificates
sudo tar -czf letsencrypt-backup-$(date +%Y%m%d).tar.gz /etc/letsencrypt/

# Store backup securely
sudo mv letsencrypt-backup-*.tar.gz /path/to/secure/backup/location/
```

## Emergency Procedures

### If Certificate Expires During Weekend/Holiday

```bash
# 1. Immediate renewal
sudo certbot renew --force-renewal

# 2. Reload NGINX
sudo systemctl reload nginx

# 3. Verify all subdomains
./verify-ssl-certificates.sh

# 4. Test in browser
# Open: https://learn-apt.iiskills.cloud
# Should show green padlock, no warnings

# 5. Notify team
echo "SSL certificates renewed successfully" | mail -s "SSL Renewal Complete" admin@iiskills.cloud
```

### If Multiple Certificates Have Issues

```bash
# Use automated renewal script
sudo ./renew-ssl-certificates.sh --force

# Or reinstall all certificates
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
  --force-renewal \
  --email admin@iiskills.cloud \
  --agree-tos \
  --redirect

sudo systemctl reload nginx
./verify-ssl-certificates.sh
```

## Verification Checklist

Before considering SSL setup complete:

- [ ] All 10 subdomains have valid certificates (`sudo certbot certificates`)
- [ ] All certificates tested (`./verify-ssl-certificates.sh`)
- [ ] SSL Labs test shows A+ rating for each subdomain
- [ ] No warnings in Chrome, Firefox, Safari
- [ ] No warnings from Kaspersky or other security tools
- [ ] HTTP redirects to HTTPS (test with `curl -I http://subdomain`)
- [ ] HSTS header present (`curl -I https://subdomain | grep Strict-Transport-Security`)
- [ ] Automatic renewal configured (`sudo systemctl status certbot.timer`)
- [ ] Monitoring in place (cron job or external monitoring)
- [ ] Certificate backup created
- [ ] Team notified of SSL setup completion

## All Subdomains

Ensure certificates are valid for:

1. app.iiskills.cloud
2. learn-ai.iiskills.cloud
3. learn-apt.iiskills.cloud
4. learn-chemistry.iiskills.cloud
5. learn-developer.iiskills.cloud
6. learn-geography.iiskills.cloud
7. learn-management.iiskills.cloud
8. learn-math.iiskills.cloud
9. learn-physics.iiskills.cloud
10. learn-pr.iiskills.cloud

## Additional Resources

- **Detailed Guide**: `SSL_CERTIFICATE_SETUP.md`
- **NGINX Setup**: `NGINX_SETUP.md`
- **Verification Script**: `./verify-ssl-certificates.sh --help`
- **Renewal Script**: `./renew-ssl-certificates.sh --help`
- **SSL Labs Test**: https://www.ssllabs.com/ssltest/
- **Let's Encrypt Docs**: https://letsencrypt.org/docs/
- **Certbot Docs**: https://eff-certbot.readthedocs.io/

## Support Contacts

- **SSL Issues**: See `SSL_CERTIFICATE_SETUP.md` troubleshooting section
- **Emergency**: Immediately run `sudo ./renew-ssl-certificates.sh --force`
- **Questions**: Review documentation in this repository

---

**Remember**: No SSL warnings should EVER appear on any subdomain. If users report certificate warnings, treat as P0 incident and resolve immediately using procedures above.
