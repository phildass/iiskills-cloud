# NGINX Reverse Proxy Setup Guide

## Overview

This guide provides complete instructions for setting up NGINX as a reverse proxy for all iiskills.cloud Next.js applications. Each app runs on its own port behind PM2 and is served through NGINX with SSL/TLS encryption.

## Architecture

```
Internet → NGINX (80/443) → PM2 → Next.js Apps (local ports)
```

### Subdomain-to-Port Mapping

| Subdomain | Port | App |
|-----------|------|-----|
| app.iiskills.cloud | 3000 | Main Application |
| learn-ai.iiskills.cloud | 3024 | Learn-AI |
| learn-apt.iiskills.cloud | 3002 | Learn-Apt |
| learn-chemistry.iiskills.cloud | 3005 | Learn-Chemistry |
| learn-developer.iiskills.cloud | 3007 | Learn-Developer |
| learn-geography.iiskills.cloud | 3011 | Learn-Geography |
| learn-management.iiskills.cloud | 3016 | Learn-Management |
| learn-math.iiskills.cloud | 3017 | Learn-Math |
| learn-physics.iiskills.cloud | 3020 | Learn-Physics |
| learn-pr.iiskills.cloud | 3021 | Learn-PR |

## Prerequisites

1. **Server with Ubuntu/Debian Linux**
2. **NGINX installed** (script will install if missing)
3. **PM2 installed globally**: `npm install -g pm2`
4. **All apps built**: `yarn build` (from repo root)
5. **Apps running under PM2**: `pm2 start ecosystem.config.js`
6. **DNS A records** configured for all subdomains pointing to your server IP
7. **Ports 80 and 443** open in firewall

## Quick Start

### 1. Start All Apps with PM2

```bash
# Build all apps
cd /path/to/iiskills-cloud
yarn install
yarn build

# Start with PM2
pm2 start ecosystem.config.js

# Verify all apps are running
pm2 list

# Save PM2 configuration
pm2 save
pm2 startup  # Follow instructions to auto-start on reboot
```

### 2. Deploy NGINX Configurations

```bash
# Run the setup script as root
sudo ./setup-nginx.sh
```

This script will:
- ✓ Check NGINX installation (install if needed)
- ✓ Verify PM2 processes are running
- ✓ Validate all ports are listening
- ✓ Copy NGINX configs to `/etc/nginx/sites-available/`
- ✓ Enable sites in `/etc/nginx/sites-enabled/`
- ✓ Test NGINX configuration
- ✓ Reload NGINX
- ✓ Provide SSL setup instructions

### 3. Obtain SSL Certificates

**CRITICAL**: SSL certificate warnings must NEVER appear. All certificates must be valid, properly issued, and correctly installed.

```bash
# Install Certbot if not already installed
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificates for all subdomains at once (RECOMMENDED)
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

Certbot will:
- Obtain Let's Encrypt SSL certificates (trusted by all browsers)
- Automatically configure NGINX for HTTPS with full certificate chain
- Set up automatic renewal (certificates renew every 60 days)
- Enable HTTPS redirects

### 4. Verify Setup

```bash
# Run the comprehensive verification script
./verify-nginx.sh

# Verify SSL certificates specifically
./verify-ssl-certificates.sh
```

This will test:
- ✓ All localhost ports are responding
- ✓ HTTP redirects to HTTPS (301/302)
- ✓ HTTPS serves content (200 OK)
- ✓ SSL certificates are valid and not expired
- ✓ Certificate chains are complete
- ✓ TLS protocols and ciphers are secure
- ✓ HSTS headers are present
- ✓ No 502 Bad Gateway errors

**Additional Verification**:
- Test each subdomain with [SSL Labs](https://www.ssllabs.com/ssltest/) - should achieve **A+ rating**
- Verify in multiple browsers (Chrome, Firefox, Safari) - should show **green padlock**
- Ensure no warnings from security tools (Kaspersky, Avast, etc.)

## Manual Setup (Alternative)

If you prefer manual setup or need to troubleshoot:

### 1. Copy Individual Configs

```bash
# Copy a single subdomain config
sudo cp nginx-configs/app.iiskills.cloud /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/app.iiskills.cloud /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx
```

### 2. Manual SSL Setup

```bash
# For a single subdomain
sudo certbot --nginx -d app.iiskills.cloud
```

## Configuration Files

All NGINX configurations are stored in `nginx-configs/` directory:

```
nginx-configs/
├── app.iiskills.cloud
├── learn-ai.iiskills.cloud
├── learn-apt.iiskills.cloud
├── learn-chemistry.iiskills.cloud
├── learn-developer.iiskills.cloud
├── learn-geography.iiskills.cloud
├── learn-management.iiskills.cloud
├── learn-math.iiskills.cloud
├── learn-physics.iiskills.cloud
└── learn-pr.iiskills.cloud
```

### Configuration Structure

Each config file includes:
- HTTP server block (port 80) → redirects to HTTPS
- HTTPS server block (port 443) → reverse proxy to localhost:PORT
- SSL certificate paths (managed by Certbot)
- Security headers
- Proxy headers for Next.js
- Access and error logging

## Troubleshooting

### 502 Bad Gateway

**Symptom**: NGINX returns 502 error

**Causes and Solutions**:

1. **App not running**
   ```bash
   pm2 list  # Check if app is online
   pm2 restart iiskills-main  # Restart specific app
   pm2 restart all  # Restart all apps
   ```

2. **Port mismatch**
   ```bash
   # Check what's listening on the port
   sudo lsof -i :3000
   
   # Verify NGINX config has correct port
   sudo cat /etc/nginx/sites-available/app.iiskills.cloud | grep proxy_pass
   ```

3. **Firewall blocking localhost**
   ```bash
   # Test direct connection
   curl http://localhost:3000
   ```

### SSL Certificate Issues

**Symptom**: HTTPS not working or certificate warnings

**Causes and Solutions**:

1. **Certificate expired**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew expired certificates
   sudo certbot renew --force-renewal
   sudo systemctl reload nginx
   ```

2. **Certificate not found or incomplete chain**
   ```bash
   # Verify certificate files exist
   sudo ls -la /etc/letsencrypt/live/app.iiskills.cloud/
   
   # Should show: cert.pem, chain.pem, fullchain.pem, privkey.pem
   
   # If missing, re-obtain certificate
   sudo certbot --nginx -d app.iiskills.cloud --email admin@iiskills.cloud --agree-tos --redirect
   ```

3. **Wrong certificate or domain mismatch**
   ```bash
   # Check certificate details
   echo | openssl s_client -servername learn-apt.iiskills.cloud -connect learn-apt.iiskills.cloud:443 2>/dev/null | openssl x509 -noout -text | grep DNS
   
   # If domain not in SAN, reinstall certificate
   sudo certbot delete --cert-name learn-apt.iiskills.cloud
   sudo certbot --nginx -d learn-apt.iiskills.cloud --email admin@iiskills.cloud --agree-tos --redirect
   ```

4. **Security tool warnings (Kaspersky, etc.)**
   ```bash
   # Run comprehensive SSL verification
   ./verify-ssl-certificates.sh -d learn-apt.iiskills.cloud
   
   # Test with SSL Labs
   # Visit: https://www.ssllabs.com/ssltest/analyze.html?d=learn-apt.iiskills.cloud
   
   # Should achieve A+ rating. If not, check:
   # - Certificate is from trusted CA (Let's Encrypt)
   # - Full certificate chain is installed
   # - TLS 1.2+ is enabled
   # - HSTS header is present
   ```

5. **Self-signed certificate warning**
   ```bash
   # Remove any self-signed certificates
   sudo rm -rf /etc/letsencrypt/live/learn-apt.iiskills.cloud/
   
   # Obtain proper Let's Encrypt certificate
   sudo certbot --nginx -d learn-apt.iiskills.cloud --email admin@iiskills.cloud --agree-tos --redirect
   ```

**For detailed SSL troubleshooting, see `SSL_CERTIFICATE_SETUP.md`**

### DNS Issues

**Symptom**: Cannot connect to subdomain

**Solutions**:

1. **Check DNS propagation**
   ```bash
   # Test DNS resolution
   nslookup app.iiskills.cloud
   dig app.iiskills.cloud
   ```

2. **Verify A records point to server IP**
   ```bash
   # Get your server's public IP
   curl ifconfig.me
   
   # Compare with DNS
   nslookup app.iiskills.cloud
   ```

### NGINX Configuration Errors

**Symptom**: NGINX fails to reload

**Solutions**:

1. **Test configuration**
   ```bash
   sudo nginx -t
   ```

2. **Check syntax errors**
   ```bash
   # View recent error logs
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Restore default config**
   ```bash
   sudo cp nginx-configs/app.iiskills.cloud /etc/nginx/sites-available/app.iiskills.cloud
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## Monitoring and Maintenance

### View Logs

```bash
# All NGINX access logs
sudo tail -f /var/log/nginx/*.access.log

# Specific app logs
sudo tail -f /var/log/nginx/app.iiskills.cloud.access.log

# Error logs
sudo tail -f /var/log/nginx/*.error.log

# PM2 logs
pm2 logs
pm2 logs iiskills-main
```

### Check Status

```bash
# NGINX status
sudo systemctl status nginx

# PM2 status
pm2 list
pm2 monit

# Port listeners
sudo lsof -i :80
sudo lsof -i :443
sudo lsof -i :3000-3025
```

### Certificate Renewal

Certbot sets up automatic renewal, but you can test it:

```bash
# Dry run (test without actually renewing)
sudo certbot renew --dry-run

# Force renewal if needed
sudo certbot renew --force-renewal
sudo systemctl reload nginx
```

### PM2 Management

```bash
# Restart all apps
pm2 restart all

# Restart specific app
pm2 restart iiskills-main

# Stop all apps
pm2 stop all

# View detailed info
pm2 show iiskills-main

# Clear logs
pm2 flush
```

## Adding a New Subdomain

To add a new app subdomain:

1. **Add port mapping** in `lib/appRegistry.js` and `ecosystem.config.js`

2. **Create NGINX config**:
   ```bash
   # Copy template
   cp nginx-configs/learn-ai.iiskills.cloud nginx-configs/new-subdomain.iiskills.cloud
   
   # Edit: change server_name and proxy_pass port
   nano nginx-configs/new-subdomain.iiskills.cloud
   ```

3. **Deploy config**:
   ```bash
   sudo cp nginx-configs/new-subdomain.iiskills.cloud /etc/nginx/sites-available/
   sudo ln -s /etc/nginx/sites-available/new-subdomain.iiskills.cloud /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Obtain SSL certificate**:
   ```bash
   sudo certbot --nginx -d new-subdomain.iiskills.cloud
   ```

5. **Test**:
   ```bash
   curl -I https://new-subdomain.iiskills.cloud
   ```

## Security Best Practices

1. **Keep SSL certificates up to date** (Certbot does this automatically)
2. **Monitor NGINX logs** for suspicious activity
3. **Keep NGINX updated**: `sudo apt-get update && sudo apt-get upgrade nginx`
4. **Use strong SSL configuration** (Certbot provides this)
5. **Set up fail2ban** to protect against brute force attacks
6. **Regular backups** of NGINX configs: `tar -czf nginx-backup.tar.gz /etc/nginx/sites-available/`

## Scripts Reference

- **`setup-nginx.sh`**: Automated NGINX deployment script
- **`verify-nginx.sh`**: Comprehensive verification of all subdomains
- **`ecosystem.config.js`**: PM2 configuration for all apps
- **`lib/appRegistry.js`**: Centralized app and port registry

## Support

For issues or questions:
1. Check logs: `/var/log/nginx/` and `pm2 logs`
2. Run verification: `./verify-nginx.sh`
3. Review this documentation
4. Check PM2 status: `pm2 list` and `pm2 monit`

## Version Control

All NGINX configurations are tracked in Git:
- Commit changes: `git add nginx-configs/ && git commit -m "Update NGINX configs"`
- Push to remote: `git push origin main`
- This ensures configurations are backed up and versioned
