# Legacy Modules Migration - Quick Start Guide

## Overview

All 7 legacy learning modules have been successfully migrated into the main iiskills-cloud repository. This guide provides quick start instructions for developers and maintainers.

## Migrated Modules

| Module | Port | Subdomain | Description |
|--------|------|-----------|-------------|
| learn-apt | 3001 | learn-apt.iiskills.cloud | Aptitude assessment with AI guidance |
| learn-math | 3002 | learn-math.iiskills.cloud | Mathematics fundamentals |
| learn-winning | 3003 | learn-winning.iiskills.cloud | Success strategies |
| learn-data-science | 3004 | learn-data-science.iiskills.cloud | Data science fundamentals |
| learn-management | 3005 | learn-management.iiskills.cloud | Management skills |
| learn-leadership | 3006 | learn-leadership.iiskills.cloud | Leadership development |
| learn-ai | 3007 | learn-ai.iiskills.cloud | AI fundamentals |
| learn-pr | 3008 | learn-pr.iiskills.cloud | Public Relations |

## Quick Start - Development

### 1. Install Dependencies

```bash
# Main app
cd /path/to/iiskills-cloud
npm install

# Each module (example for learn-math)
cd learn-math
npm install
cd ..

# Repeat for all modules or use a loop:
for dir in learn-*/; do
  cd "$dir"
  npm install
  cd ..
done
```

### 2. Environment Setup

Each module needs a `.env.local` file:

```bash
# Copy the example file for each module
cd learn-math
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# Repeat for all modules
```

**Important:** All modules must use the **same Supabase credentials** for cross-subdomain authentication to work.

### 3. Run Development Servers

**Option A: Run Individual Modules**

```bash
# Main app
npm run dev  # Port 3000

# In separate terminals for each module:
cd learn-math && npm run dev     # Port 3002
cd learn-winning && npm run dev  # Port 3003
cd learn-ai && npm run dev       # Port 3007
# etc...
```

**Option B: Run All with PM2**

```bash
pm2 start ecosystem.config.js
pm2 logs  # View logs
```

### 4. Access Modules

- Main App: http://localhost:3000
- Learning Modules Overview: http://localhost:3000/learn-modules
- Individual modules: http://localhost:300X (where X is 1-8)

## Quick Start - Production

### 1. Build All Modules

```bash
# Build script for all modules
npm run build  # Main app

for dir in learn-*/; do
  cd "$dir"
  npm run build
  cd ..
done
```

### 2. Deploy with PM2

```bash
# Start all apps
pm2 start ecosystem.config.js

# Save configuration
pm2 save

# Setup auto-start on system boot
pm2 startup
```

### 3. Configure Nginx

Create nginx configuration for each subdomain. Example:

```nginx
# Learn-Math
server {
    listen 80;
    server_name learn-math.iiskills.cloud;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name learn-math.iiskills.cloud;
    
    ssl_certificate /etc/letsencrypt/live/learn-math.iiskills.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/learn-math.iiskills.cloud/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Repeat for all modules with appropriate ports.

### 4. Setup SSL

```bash
# Get certificates for all subdomains
sudo certbot --nginx -d learn-math.iiskills.cloud
sudo certbot --nginx -d learn-winning.iiskills.cloud
sudo certbot --nginx -d learn-data-science.iiskills.cloud
sudo certbot --nginx -d learn-management.iiskills.cloud
sudo certbot --nginx -d learn-leadership.iiskills.cloud
sudo certbot --nginx -d learn-ai.iiskills.cloud
sudo certbot --nginx -d learn-pr.iiskills.cloud

# Or use wildcard certificate
sudo certbot certonly --manual --preferred-challenges dns \
  -d *.iiskills.cloud -d iiskills.cloud
```

### 5. Configure DNS

Add A records or CNAME records for each subdomain:

```
learn-apt.iiskills.cloud       -> A record to server IP
learn-math.iiskills.cloud      -> A record to server IP
learn-winning.iiskills.cloud   -> A record to server IP
# ... etc for all modules

# Or use wildcard:
*.iiskills.cloud               -> A record to server IP
```

## Cross-Subdomain Authentication

All modules share authentication via Supabase. To enable:

### In Supabase Dashboard:

1. Go to Authentication > Settings
2. Set **Cookie Domain** to: `.iiskills.cloud`
3. This enables session sharing across all subdomains

### In Environment Variables:

All modules should have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud  # Production only
```

## Monitoring

### PM2 Commands

```bash
pm2 list                    # List all processes
pm2 logs                    # View logs for all processes
pm2 logs iiskills-learn-math # View logs for specific module
pm2 monit                   # Real-time monitoring
pm2 restart all             # Restart all processes
pm2 stop all                # Stop all processes
pm2 delete all              # Delete all processes
```

### Log Locations

Logs are stored in `/logs` directory:
- `main-error.log` - Main app errors
- `learn-math-error.log` - Learn-Math module errors
- etc...

## Troubleshooting

### Module Won't Start

1. Check if port is available: `lsof -i :3002`
2. Check dependencies: `npm install`
3. Check environment variables in `.env.local`
4. Check logs: `pm2 logs iiskills-learn-math`

### Authentication Not Working

1. Verify all modules use same Supabase credentials
2. Check cookie domain is set to `.iiskills.cloud` in Supabase
3. Verify `NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud` in production
4. Clear browser cookies and try again

### Build Failures

1. Clear build cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check Node.js version: `node --version` (should be 16.x or higher)

## File Structure

Each module follows this structure:

```
learn-{module}/
├── components/
│   ├── Footer.js
│   └── shared/              # Shared components (from parent)
├── lib/
│   └── supabaseClient.js    # Auth client
├── pages/
│   ├── _app.js              # App wrapper
│   ├── index.js             # Landing page
│   ├── login.js             # Login page
│   ├── register.js          # Registration page
│   └── learn.js             # Protected content
├── public/images/           # Module assets
├── styles/
│   └── globals.css          # Global styles
├── .env.local.example       # Environment template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

## Development Workflow

### Adding New Content

1. Edit the module's `pages/learn.js` file
2. Add learning content components
3. Test locally: `npm run dev`
4. Build and verify: `npm run build`
5. Commit changes and deploy

### Updating Shared Components

Shared components are in `/components/shared/`. Changes affect all modules:

1. Edit `/components/shared/SharedNavbar.js`
2. Test in main app and at least one module
3. Verify all modules still work
4. Deploy all affected modules

### Adding a New Module

1. Copy structure from existing module (e.g., learn-math)
2. Update `package.json` with new name and port
3. Update README.md with module details
4. Add to `ecosystem.config.js`
5. Create nginx configuration
6. Update DEPLOYMENT.md
7. Add to `/pages/learn-modules.js`

## Performance Tips

1. **Enable caching** in Nginx for static assets
2. **Use PM2 cluster mode** for high-traffic modules
3. **Implement CDN** for image and asset delivery
4. **Enable Gzip/Brotli** compression in Nginx
5. **Monitor memory usage** with `pm2 monit`

## Security Checklist

- [ ] All `.env.local` files excluded from git
- [ ] Supabase RLS policies configured
- [ ] HTTPS enabled on all subdomains
- [ ] CORS properly configured
- [ ] Rate limiting implemented (if needed)
- [ ] Security headers configured in Nginx
- [ ] Regular dependency updates
- [ ] CodeQL security scans passing

## Support

- **Documentation:** See README.md, DEPLOYMENT.md, MODULE_MIGRATION_SUMMARY.md
- **Issues:** Report via GitHub Issues
- **Contact:** info@iiskills.cloud

## Next Steps

After deployment, consider:

1. **Add actual learning content** to each module
2. **Implement progress tracking** with database tables
3. **Add quiz/assessment systems**
4. **Develop certificate generation** per module
5. **Create admin dashboards** for content management
6. **Implement analytics** to track user engagement
7. **Add payment integration** for premium content
8. **Develop mobile apps** using the same backend

---

**Last Updated:** 2026-01-05  
**Maintainer:** AI Cloud Enterprises - Indian Institute of Professional Skills Development
