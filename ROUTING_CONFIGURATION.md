# Domain Routing Configuration

This document explains the domain routing setup for the iiskills-cloud multi-app architecture.

## Overview

The iiskills-cloud platform consists of multiple Next.js applications served on different subdomains:

- **Main App**: `app.iiskills.cloud` (port 3000)
- **Learning Apps**: `app1.learn-{topic}.iiskills.cloud` (ports 3001-3022)

## Domain Structure

### Production Domains

| App | Subdomain | Full Domain | Port |
|-----|-----------|-------------|------|
| main | (none) | app.iiskills.cloud | 3000 |
| learn-ai | learn-ai | app1.learn-ai.iiskills.cloud | 3001 |
| learn-apt | learn-apt | app1.learn-apt.iiskills.cloud | 3002 |
| learn-chemistry | learn-chemistry | app1.learn-chemistry.iiskills.cloud | 3005 |
| learn-cricket | learn-cricket | app1.learn-cricket.iiskills.cloud | 3009 |
| learn-geography | learn-geography | app1.learn-geography.iiskills.cloud | 3011 |
| learn-govt-jobs | learn-govt-jobs | app1.learn-govt-jobs.iiskills.cloud | 3013 |
| learn-leadership | learn-leadership | app1.learn-leadership.iiskills.cloud | 3015 |
| learn-management | learn-management | app1.learn-management.iiskills.cloud | 3016 |
| learn-math | learn-math | app1.learn-math.iiskills.cloud | 3017 |
| learn-physics | learn-physics | app1.learn-physics.iiskills.cloud | 3020 |
| learn-pr | learn-pr | app1.learn-pr.iiskills.cloud | 3021 |
| learn-winning | learn-winning | app1.learn-winning.iiskills.cloud | 3022 |

### Development Setup

In development, all apps run on `localhost` with their assigned ports:

```
http://localhost:3000  - Main app
http://localhost:3001  - learn-ai
http://localhost:3002  - learn-apt
...
```

## Nginx Configuration

Here's a sample Nginx configuration for routing requests to the appropriate Next.js application:

```nginx
# Main app
server {
    listen 80;
    server_name app.iiskills.cloud;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Learning apps - pattern match for app1.learn-*.iiskills.cloud
server {
    listen 80;
    server_name ~^app1\.learn-(?<app_name>[a-z-]+)\.iiskills\.cloud$;

    location / {
        # Map app names to ports
        set $port 3000;
        
        if ($app_name = "ai") { set $port 3001; }
        if ($app_name = "apt") { set $port 3002; }
        if ($app_name = "chemistry") { set $port 3005; }
        if ($app_name = "cricket") { set $port 3009; }
        if ($app_name = "geography") { set $port 3011; }
        if ($app_name = "govt-jobs") { set $port 3013; }
        if ($app_name = "leadership") { set $port 3015; }
        if ($app_name = "management") { set $port 3016; }
        if ($app_name = "math") { set $port 3017; }
        if ($app_name = "physics") { set $port 3020; }
        if ($app_name = "pr") { set $port 3021; }
        if ($app_name = "winning") { set $port 3022; }

        proxy_pass http://localhost:$port;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# SSL configuration (recommended)
server {
    listen 443 ssl http2;
    server_name app.iiskills.cloud;

    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## Traefik Configuration

Alternative configuration using Traefik (v2+):

```yaml
# docker-compose.yml or traefik.yml
http:
  routers:
    # Main app
    main-router:
      rule: "Host(`app.iiskills.cloud`)"
      service: main-service
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt

    # Learning apps
    learn-ai-router:
      rule: "Host(`app1.learn-ai.iiskills.cloud`)"
      service: learn-ai-service
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt

    learn-apt-router:
      rule: "Host(`app1.learn-apt.iiskills.cloud`)"
      service: learn-apt-service
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt

    # ... (add similar blocks for other learning apps)

  services:
    main-service:
      loadBalancer:
        servers:
          - url: "http://localhost:3000"

    learn-ai-service:
      loadBalancer:
        servers:
          - url: "http://localhost:3001"

    learn-apt-service:
      loadBalancer:
        servers:
          - url: "http://localhost:3002"

    # ... (add similar blocks for other learning apps)
```

## DNS Configuration

Ensure your DNS records are configured to point to your server:

```
# A records
app.iiskills.cloud           A    <your-server-ip>
*.learn-ai.iiskills.cloud    A    <your-server-ip>
*.learn-apt.iiskills.cloud   A    <your-server-ip>
# ... (add similar records for other learning apps)
```

Or use wildcard DNS:

```
*.iiskills.cloud             A    <your-server-ip>
```

## Testing Routing

### Test in Development

```bash
# Start all apps
yarn dev

# Access via browser
# Main: http://localhost:3000
# learn-ai: http://localhost:3001
# learn-apt: http://localhost:3002
```

### Test in Production

```bash
# Test main app
curl -I https://app.iiskills.cloud

# Test learning apps
curl -I https://app1.learn-ai.iiskills.cloud
curl -I https://app1.learn-cricket.iiskills.cloud
```

## Environment Variables

Each app detects its domain automatically using the `lib/appRegistry.js` module:

```javascript
import { getCurrentApp } from '../../lib/appRegistry';

const app = getCurrentApp();
console.log(app.id);              // 'learn-ai'
console.log(app.primaryDomain);   // 'app1.learn-ai.iiskills.cloud'
```

You can also set `NEXT_PUBLIC_APP_ID` environment variable to override:

```bash
# .env.local
NEXT_PUBLIC_APP_ID=learn-ai
```

## Troubleshooting

### Issue: 404 Not Found

**Cause**: Nginx/Traefik not routing to correct port

**Solution**:
1. Check that the app is running: `pm2 status`
2. Verify port assignment in `package.json`
3. Check Nginx/Traefik configuration
4. Restart proxy: `sudo systemctl restart nginx` or `docker-compose restart traefik`

### Issue: CORS Errors

**Cause**: Missing CORS headers for cross-app requests

**Solution**: Add CORS headers in `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*.iiskills.cloud' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
        ],
      },
    ];
  },
};
```

### Issue: Supabase Auth Redirect Fails

**Cause**: Callback URL not configured in Supabase

**Solution**:
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add all app domains to "Redirect URLs":
   - `https://app.iiskills.cloud/**`
   - `https://app1.learn-ai.iiskills.cloud/**`
   - `https://app1.learn-apt.iiskills.cloud/**`
   - etc.

## Adding a New App

When adding a new learning app:

1. **Assign a port** in `PORT_ASSIGNMENTS.md`
2. **Configure DNS** for `app1.learn-{topic}.iiskills.cloud`
3. **Update Nginx/Traefik** configuration with new routing rule
4. **Update Supabase** callback URLs
5. **Run registry generator**: `node scripts/generate-app-registry.js`
6. **Test routing** in both development and production

## Security Considerations

1. **Always use HTTPS** in production
2. **Enable rate limiting** at the proxy level
3. **Configure firewall** to only allow proxy access to app ports
4. **Use strong SSL/TLS** configuration (TLS 1.2+)
5. **Implement DDoS protection** at the proxy or CDN level

## Performance Optimization

1. **Enable caching** for static assets in Nginx/Traefik
2. **Use CDN** for image and asset delivery
3. **Enable compression** (gzip/brotli) at proxy level
4. **Configure connection pooling** for database connections
5. **Use PM2 cluster mode** for load balancing across CPU cores

---

For more information, see:
- [PORT_ASSIGNMENTS.md](PORT_ASSIGNMENTS.md) - Complete port mapping
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - Production deployment steps
- [PM2_DEPLOYMENT.md](PM2_DEPLOYMENT.md) - PM2 process management
