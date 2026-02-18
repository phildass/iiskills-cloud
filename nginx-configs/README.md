# NGINX Configuration Files

This directory contains NGINX reverse proxy configurations for all iiskills.cloud subdomains.

## Files

Each file corresponds to a subdomain and contains:
- HTTP server block (port 80) - redirects to HTTPS
- HTTPS server block (port 443) - reverse proxy to localhost
- SSL certificate paths (managed by Certbot)
- Security headers
- Proxy configuration for Next.js

## Subdomain to Port Mapping

| Config File | Subdomain | Backend Port | PM2 App Name |
|-------------|-----------|--------------|--------------|
| `app.iiskills.cloud` | app.iiskills.cloud | 3000 | iiskills-main |
| `learn-ai.iiskills.cloud` | learn-ai.iiskills.cloud | 3024 | iiskills-learn-ai |
| `learn-apt.iiskills.cloud` | learn-apt.iiskills.cloud | 3002 | iiskills-learn-apt |
| `learn-chemistry.iiskills.cloud` | learn-chemistry.iiskills.cloud | 3005 | iiskills-learn-chemistry |
| `learn-developer.iiskills.cloud` | learn-developer.iiskills.cloud | 3007 | iiskills-learn-developer |
| `learn-geography.iiskills.cloud` | learn-geography.iiskills.cloud | 3011 | iiskills-learn-geography |
| `learn-management.iiskills.cloud` | learn-management.iiskills.cloud | 3016 | iiskills-learn-management |
| `learn-math.iiskills.cloud` | learn-math.iiskills.cloud | 3017 | iiskills-learn-math |
| `learn-physics.iiskills.cloud` | learn-physics.iiskills.cloud | 3020 | iiskills-learn-physics |
| `learn-pr.iiskills.cloud` | learn-pr.iiskills.cloud | 3021 | iiskills-learn-pr |

## Deployment

Use the automated setup script from the repository root:

```bash
sudo ./setup-nginx.sh
```

Or manually deploy individual configs:

```bash
# Copy to sites-available
sudo cp learn-ai.iiskills.cloud /etc/nginx/sites-available/

# Create symlink in sites-enabled
sudo ln -s /etc/nginx/sites-available/learn-ai.iiskills.cloud /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload NGINX
sudo systemctl reload nginx
```

## SSL Certificates

**CRITICAL**: SSL certificate warnings must NEVER appear on any subdomain. All certificates must be valid, properly issued, and correctly installed.

### Quick Setup

Obtain SSL certificates for all subdomains at once:

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
  --redirect
```

Or obtain certificate for a single subdomain:

```bash
sudo certbot --nginx -d learn-ai.iiskills.cloud --email admin@iiskills.cloud --agree-tos --redirect
```

### SSL/TLS Security Features

All NGINX configurations include enhanced SSL/TLS security:

- ✅ **HSTS (HTTP Strict Transport Security)** - Forces HTTPS for 1 year
- ✅ **OCSP Stapling** - Improves SSL handshake performance and privacy
- ✅ **Strong TLS protocols** - TLS 1.2+ only (via Let's Encrypt config)
- ✅ **Full certificate chain** - Uses fullchain.pem (server + intermediate certs)
- ✅ **Secure ciphers** - Modern cipher suites only
- ✅ **Security headers** - X-Frame-Options, X-Content-Type-Options, X-XSS-Protection

### Verification and Monitoring

Verify all SSL certificates are properly configured:

```bash
# Run comprehensive SSL verification
./verify-ssl-certificates.sh

# Check specific subdomain
./verify-ssl-certificates.sh -d learn-apt.iiskills.cloud

# Test with SSL Labs (should achieve A+ rating)
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=learn-apt.iiskills.cloud
```

### Automatic Renewal

Certbot automatically sets up certificate renewal. Verify it's working:

```bash
# Test renewal (dry run)
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer

# Manual renewal if needed
sudo certbot renew
sudo systemctl reload nginx
```

### Troubleshooting

For SSL/TLS issues, consult the comprehensive guide:

```bash
# See SSL_CERTIFICATE_SETUP.md for:
# - Certificate expiration issues
# - Certificate chain problems
# - Self-signed certificate removal
# - HTTPS not working
# - Security warnings from Kaspersky, etc.
```

## Configuration Format

Each configuration follows this structure:

```nginx
# HTTP server - redirect to HTTPS
server {
    listen 80;
    server_name subdomain.iiskills.cloud;
    return 301 https://$server_name$request_uri;
}

# HTTPS server - reverse proxy
server {
    listen 443 ssl http2;
    server_name subdomain.iiskills.cloud;
    
    # SSL certificates (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/subdomain.iiskills.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/subdomain.iiskills.cloud/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Logging
    access_log /var/log/nginx/subdomain.iiskills.cloud.access.log;
    error_log /var/log/nginx/subdomain.iiskills.cloud.error.log;
    
    # Reverse proxy to Next.js
    location / {
        proxy_pass http://localhost:PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

## Modifying Configurations

When making changes to these files:

1. Edit the file in this directory
2. Test the syntax: `sudo nginx -t`
3. If valid, copy to `/etc/nginx/sites-available/`
4. Reload NGINX: `sudo systemctl reload nginx`
5. Commit changes to git: `git add nginx-configs/ && git commit`

## See Also

- `../NGINX_SETUP.md` - Complete setup guide
- `../setup-nginx.sh` - Automated deployment script
- `../verify-nginx.sh` - Verification script
- `../ecosystem.config.js` - PM2 configuration with port assignments
