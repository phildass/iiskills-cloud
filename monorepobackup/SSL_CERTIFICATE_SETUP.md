# SSL/TLS Certificate Setup and Security Guide

## Critical Security Requirements

**⚠️ IMPORTANT**: This guide addresses the critical requirement that SSL certificate warnings must **NEVER** appear on any iiskills.cloud subdomain. All certificates must be:

1. ✅ **Valid and not expired**
2. ✅ **Properly issued for each subdomain** (wildcard or SAN as appropriate)
3. ✅ **Correctly installed** (full certificate chain including intermediate certificates)
4. ✅ **No mismatches** - server name must match certificate CN/SAN
5. ✅ **Not self-signed** - must be from a trusted Certificate Authority
6. ✅ **Using strong TLS protocols** - TLS 1.2+ only, no SSL v2/v3

## Overview

This guide provides comprehensive instructions for managing SSL/TLS certificates for all iiskills.cloud subdomains. We use Let's Encrypt certificates via Certbot for free, automated, and trusted SSL certificates.

## Prerequisites

### Required Software
```bash
# Update package list
sudo apt-get update

# Install Certbot and NGINX plugin
sudo apt-get install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

### DNS Configuration
**CRITICAL**: Before obtaining certificates, ensure all A records point to your server:

```bash
# Test DNS for all subdomains
./verify-subdomain-dns.sh

# Or manually test each subdomain
nslookup app.iiskills.cloud
nslookup learn-ai.iiskills.cloud
nslookup learn-apt.iiskills.cloud
# ... and so on for all subdomains
```

## Quick Start - Initial Certificate Setup

### Recommended: Wildcard Certificate

All NGINX configurations use a single wildcard certificate (`*.iiskills.cloud`) to cover every subdomain. This prevents per-subdomain certificate mismatches and SSL warnings.

**Step 1**: Obtain the wildcard certificate via DNS-01 challenge:

```bash
sudo certbot certonly --manual --preferred-challenges dns-01 \
  -d "*.iiskills.cloud" \
  -d "iiskills.cloud" \
  --email admin@iiskills.cloud \
  --agree-tos \
  --no-eff-email
```

**Step 2**: Follow certbot's prompts to add a `_acme-challenge.iiskills.cloud` DNS TXT record in your DNS provider (e.g., Cloudflare), then press Enter to validate.

The certificate will be stored at:
- `/etc/letsencrypt/live/iiskills.cloud/fullchain.pem`
- `/etc/letsencrypt/live/iiskills.cloud/privkey.pem`
- `/etc/letsencrypt/live/iiskills.cloud/chain.pem`

All NGINX configs in `nginx-configs/` already reference these paths.

### Option 2: Automated Wildcard Renewal (with Cloudflare DNS plugin)

For non-interactive automated renewal:

```bash
# Install Cloudflare DNS plugin
sudo pip install certbot-dns-cloudflare

# Create credentials file (chmod 600 is required)
sudo bash -c 'cat > /etc/letsencrypt/cloudflare.ini << EOF
dns_cloudflare_api_token = YOUR_CLOUDFLARE_API_TOKEN
EOF'
sudo chmod 600 /etc/letsencrypt/cloudflare.ini

# Obtain/renew with DNS plugin
sudo certbot certonly --dns-cloudflare \
  --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini \
  -d "*.iiskills.cloud" \
  -d "iiskills.cloud" \
  --email admin@iiskills.cloud \
  --agree-tos \
  --no-eff-email
```

### Legacy: Per-Subdomain Certificates (Not Recommended)

**Warning**: Per-subdomain certificates require individual certificate files per subdomain. If certificates are missing for any subdomain, NGINX will fail to start for that server block, causing SSL errors. Use the wildcard cert approach above instead.

```bash
# Only use this if wildcard cert is not an option
sudo certbot --nginx -d app.iiskills.cloud --email admin@iiskills.cloud --agree-tos --no-eff-email --redirect
# Repeat for each subdomain
```

## Certificate Management

### Check Certificate Status

```bash
# List all certificates
sudo certbot certificates

# Check expiration dates
sudo certbot certificates | grep -E "Certificate Name|Expiry Date"

# Check specific certificate
sudo certbot certificates -d app.iiskills.cloud
```

### Verify Certificate Installation

Use our comprehensive verification script:

```bash
# Run SSL verification script
./verify-ssl-certificates.sh

# This will check:
# - Certificate validity and expiration
# - Full certificate chain installation
# - TLS protocol versions
# - Cipher suite strength
# - Common SSL issues
```

### Manual Certificate Verification

```bash
# Check certificate details with OpenSSL
echo | openssl s_client -servername app.iiskills.cloud -connect app.iiskills.cloud:443 2>/dev/null | openssl x509 -noout -text

# Check certificate chain
echo | openssl s_client -servername app.iiskills.cloud -connect app.iiskills.cloud:443 -showcerts 2>/dev/null

# Quick expiration check
echo | openssl s_client -servername app.iiskills.cloud -connect app.iiskills.cloud:443 2>/dev/null | openssl x509 -noout -dates
```

## Certificate Renewal

### Automatic Renewal (Recommended)

Certbot automatically sets up a systemd timer for renewal:

```bash
# Check if automatic renewal is enabled
sudo systemctl status certbot.timer

# Test automatic renewal (dry run)
sudo certbot renew --dry-run

# View renewal configuration
sudo cat /etc/systemd/system/timers.target.wants/certbot.timer
```

### Manual Renewal

```bash
# Renew all certificates that are due for renewal (within 30 days of expiry)
sudo certbot renew

# Force renewal (even if not due)
sudo certbot renew --force-renewal

# Renew specific certificate
sudo certbot renew --cert-name app.iiskills.cloud

# Renew and reload NGINX
sudo certbot renew --deploy-hook "systemctl reload nginx"
```

### Post-Renewal Script

Automatically reload NGINX after successful renewal:

```bash
# Create renewal hook
sudo mkdir -p /etc/letsencrypt/renewal-hooks/post/
sudo tee /etc/letsencrypt/renewal-hooks/post/reload-nginx.sh > /dev/null <<'EOF'
#!/bin/bash
systemctl reload nginx
EOF

# Make executable
sudo chmod +x /etc/letsencrypt/renewal-hooks/post/reload-nginx.sh
```

## Testing and Validation

### Online SSL Testing Tools

After setup, test each subdomain with these trusted tools:

1. **SSL Labs** (Most comprehensive): https://www.ssllabs.com/ssltest/
   - Should achieve A+ rating
   - Tests certificate validity, chain, protocols, ciphers

2. **SSL Shopper**: https://www.sslshopper.com/ssl-checker.html
   - Quick certificate validation
   - Checks expiration, chain, common issues

3. **DigiCert SSL Check**: https://www.digicert.com/help/
   - Instant certificate verification
   - Tests certificate installation

4. **Security Headers**: https://securityheaders.com/
   - Validates HSTS and other security headers

### Command Line Testing

```bash
# Test all subdomains
./verify-ssl-certificates.sh

# Quick SSL check with curl
curl -vI https://app.iiskills.cloud 2>&1 | grep -E "SSL|TLS|certificate"

# Check SSL certificate with nmap
nmap --script ssl-cert -p 443 app.iiskills.cloud

# Check SSL protocols supported
nmap --script ssl-enum-ciphers -p 443 app.iiskills.cloud
```

### Browser Testing

Test each subdomain in multiple browsers:
- ✅ Chrome/Edge - Should show green padlock
- ✅ Firefox - Should show green padlock  
- ✅ Safari - Should show green padlock
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**No warnings should appear in ANY browser or security tool (Kaspersky, Avast, etc.)**

## Troubleshooting Common Issues

### Issue 1: Certificate Warning - "Untrustworthy" or "Invalid Certificate"

**Symptoms**: 
- Browser shows warning page
- Security software (Kaspersky, etc.) blocks site
- Certificate errors in browser console

**Causes**:
1. Certificate expired
2. Incomplete certificate chain
3. Wrong certificate installed
4. Self-signed certificate
5. Certificate doesn't include subdomain

**Solutions**:

```bash
# 1. Check certificate expiration
sudo certbot certificates
# If expired: sudo certbot renew --force-renewal

# 2. Verify certificate chain is complete
echo | openssl s_client -servername learn-apt.iiskills.cloud -connect learn-apt.iiskills.cloud:443 -showcerts 2>/dev/null | grep -c "BEGIN CERTIFICATE"
# Should show 2+ (server cert + intermediate(s))

# 3. Check certificate includes correct subdomain
sudo certbot certificates -d learn-apt.iiskills.cloud

# 4. Verify NGINX is using correct certificate files
sudo grep -r "ssl_certificate" /etc/nginx/sites-enabled/

# 5. Test certificate chain with SSL Labs
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=learn-apt.iiskills.cloud

# 6. Reinstall certificate if needed
sudo certbot delete --cert-name learn-apt.iiskills.cloud
sudo certbot --nginx -d learn-apt.iiskills.cloud --email admin@iiskills.cloud --agree-tos --redirect
sudo systemctl reload nginx
```

### Issue 2: Certificate Mismatch

**Symptoms**: "Certificate name doesn't match"

**Solution**:
```bash
# Verify server_name in NGINX matches certificate
sudo grep server_name /etc/nginx/sites-enabled/learn-apt.iiskills.cloud

# Verify certificate SANs
echo | openssl s_client -servername learn-apt.iiskills.cloud -connect learn-apt.iiskills.cloud:443 2>/dev/null | openssl x509 -noout -text | grep DNS

# If mismatch, obtain new certificate with correct domain
sudo certbot --nginx -d learn-apt.iiskills.cloud --force-renewal
```

### Issue 3: Missing Intermediate Certificate

**Symptoms**: "Unable to verify certificate chain"

**Solution**:
```bash
# Verify fullchain.pem is being used (not just cert.pem)
sudo grep ssl_certificate /etc/nginx/sites-enabled/learn-apt.iiskills.cloud
# Should use: /etc/letsencrypt/live/DOMAIN/fullchain.pem

# If using cert.pem instead of fullchain.pem, update NGINX config
sudo sed -i 's/cert.pem/fullchain.pem/g' /etc/nginx/sites-enabled/learn-apt.iiskills.cloud
sudo nginx -t && sudo systemctl reload nginx
```

### Issue 4: Self-Signed Certificate

**Symptoms**: "This certificate is self-signed"

**Solution**:
```bash
# Remove self-signed certificate
sudo rm -rf /etc/letsencrypt/live/learn-apt.iiskills.cloud/
sudo rm -rf /etc/letsencrypt/archive/learn-apt.iiskills.cloud/
sudo rm -f /etc/letsencrypt/renewal/learn-apt.iiskills.cloud.conf

# Obtain proper Let's Encrypt certificate
sudo certbot --nginx -d learn-apt.iiskills.cloud --email admin@iiskills.cloud --agree-tos --redirect
```

### Issue 5: Certificate Not Installed

**Symptoms**: NGINX serves default/wrong certificate

**Solution**:
```bash
# Verify NGINX config includes SSL certificate paths
sudo cat /etc/nginx/sites-enabled/learn-apt.iiskills.cloud | grep ssl_certificate

# Verify certificate files exist
sudo ls -la /etc/letsencrypt/live/learn-apt.iiskills.cloud/

# If missing, obtain certificate
sudo certbot --nginx -d learn-apt.iiskills.cloud --email admin@iiskills.cloud --agree-tos --redirect

# Test and reload
sudo nginx -t && sudo systemctl reload nginx
```

### Issue 6: Weak SSL/TLS Configuration

**Symptoms**: Security tools report weak ciphers or old protocols

**Solution**:
```bash
# Update to Mozilla Modern SSL configuration
# Our NGINX configs already include this via:
# include /etc/letsencrypt/options-ssl-nginx.conf;

# Verify strong configuration
sudo cat /etc/letsencrypt/options-ssl-nginx.conf

# Test SSL configuration
curl -I https://learn-apt.iiskills.cloud 2>&1 | grep "SSL\|TLS"
```

## Security Best Practices

### 1. Enable HSTS (HTTP Strict Transport Security)

Already configured in our NGINX files, but verify:

```bash
# Check HSTS header
curl -I https://app.iiskills.cloud | grep -i strict-transport-security

# Add if missing (edit NGINX config)
# add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### 2. Enable OCSP Stapling

Improves performance and privacy:

```bash
# Add to each NGINX server block's SSL section
# ssl_stapling on;
# ssl_stapling_verify on;
# ssl_trusted_certificate /etc/letsencrypt/live/DOMAIN/chain.pem;
```

### 3. Regular Monitoring

```bash
# Set up monitoring cron job
sudo tee /etc/cron.daily/check-ssl-expiry > /dev/null <<'EOF'
#!/bin/bash
# Check all certificates expiring in next 30 days
/usr/bin/certbot certificates | grep -B1 "VALID: [0-2][0-9] days" | mail -s "SSL Certificates Expiring Soon" admin@iiskills.cloud
EOF

sudo chmod +x /etc/cron.daily/check-ssl-expiry
```

### 4. Certificate Pinning (Advanced)

For extra security on critical subdomains:

```bash
# Generate certificate pin
echo | openssl s_client -servername app.iiskills.cloud -connect app.iiskills.cloud:443 2>/dev/null | openssl x509 -pubkey -noout | openssl pkey -pubin -outform der | openssl dgst -sha256 -binary | base64
```

### 5. CAA DNS Records

Restrict which CAs can issue certificates for your domain:

```dns
; Add to DNS records
iiskills.cloud. CAA 0 issue "letsencrypt.org"
iiskills.cloud. CAA 0 issuewild "letsencrypt.org"
iiskills.cloud. CAA 0 iodef "mailto:security@iiskills.cloud"
```

## Automated Monitoring Script

Use our automated script to check all certificates:

```bash
# Run verification (checks expiry, chain, protocols)
./verify-ssl-certificates.sh

# Set up daily monitoring
sudo tee /etc/cron.daily/verify-ssl > /dev/null <<'EOF'
#!/bin/bash
cd /path/to/iiskills-cloud
./verify-ssl-certificates.sh --quiet || mail -s "SSL Certificate Issues Detected" admin@iiskills.cloud
EOF

sudo chmod +x /etc/cron.daily/verify-ssl
```

## Emergency Response Procedures

### If Certificate Expires

```bash
# 1. Immediate renewal
sudo certbot renew --force-renewal

# 2. Reload NGINX
sudo systemctl reload nginx

# 3. Verify fix
curl -I https://learn-apt.iiskills.cloud

# 4. Test in browser
# Visit: https://learn-apt.iiskills.cloud
```

### If Certificate Warning Appears

```bash
# 1. Identify the issue
./verify-ssl-certificates.sh -d learn-apt.iiskills.cloud

# 2. Test with SSL Labs
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=learn-apt.iiskills.cloud

# 3. Check certificate details
sudo certbot certificates -d learn-apt.iiskills.cloud

# 4. Renew/reinstall if needed
sudo certbot delete --cert-name learn-apt.iiskills.cloud
sudo certbot --nginx -d learn-apt.iiskills.cloud --email admin@iiskills.cloud --agree-tos --redirect

# 5. Reload NGINX
sudo nginx -t && sudo systemctl reload nginx

# 6. Verify in multiple browsers
```

## Certificate Backup

```bash
# Backup all Let's Encrypt certificates
sudo tar -czf letsencrypt-backup-$(date +%Y%m%d).tar.gz /etc/letsencrypt/

# Restore from backup
sudo tar -xzf letsencrypt-backup-YYYYMMDD.tar.gz -C /

# Reload NGINX after restore
sudo systemctl reload nginx
```

## All Subdomains List

Ensure certificates are obtained for ALL these subdomains:

1. app.iiskills.cloud (port 3000)
2. learn-ai.iiskills.cloud (port 3024)
3. learn-apt.iiskills.cloud (port 3002)
4. learn-chemistry.iiskills.cloud (port 3005)
5. learn-developer.iiskills.cloud (port 3007)
6. learn-geography.iiskills.cloud (port 3011)
7. learn-management.iiskills.cloud (port 3016)
8. learn-math.iiskills.cloud (port 3017)
9. learn-physics.iiskills.cloud (port 3020)
10. learn-pr.iiskills.cloud (port 3021)

## Support Resources

- Let's Encrypt Documentation: https://letsencrypt.org/docs/
- Certbot Documentation: https://eff-certbot.readthedocs.io/
- SSL Labs Test: https://www.ssllabs.com/ssltest/
- Mozilla SSL Config Generator: https://ssl-config.mozilla.org/

## Compliance Checklist

Before considering SSL setup complete, verify:

- [ ] All 10 subdomains have valid certificates
- [ ] Certificates tested with SSL Labs (A+ rating)
- [ ] No warnings in Chrome, Firefox, Safari
- [ ] No warnings from Kaspersky or other security tools
- [ ] Automatic renewal is configured and tested
- [ ] Certificate monitoring is in place
- [ ] Full certificate chain is installed
- [ ] Only TLS 1.2+ protocols enabled
- [ ] Strong cipher suites configured
- [ ] HSTS headers are present
- [ ] All HTTP traffic redirects to HTTPS
- [ ] Emergency procedures documented
- [ ] Certificate backup created

## Quick Reference

```bash
# Check all certificates
sudo certbot certificates

# Renew all certificates
sudo certbot renew

# Verify SSL configuration
./verify-ssl-certificates.sh

# Test specific subdomain
curl -vI https://learn-apt.iiskills.cloud 2>&1 | grep -E "SSL|certificate"

# Reload NGINX after changes
sudo nginx -t && sudo systemctl reload nginx
```
