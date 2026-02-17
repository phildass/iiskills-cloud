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

After deploying configs, obtain SSL certificates with Certbot:

```bash
sudo certbot --nginx -d learn-ai.iiskills.cloud
```

Or for all subdomains at once:

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
