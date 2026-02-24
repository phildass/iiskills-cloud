# Subdomain Deployment Configuration Update

## Overview
This document describes the subdomain pattern update for deploying iiskills.cloud applications.

## Migration Summary

### Previous Pattern (Old)
- Main app: `app.iiskills.cloud` ✅
- Learn apps: `app1.learn-<name>.iiskills.cloud`, `app2.learn-<name>.iiskills.cloud`, etc.

### New Pattern (Current)
- Main app: `app.iiskills.cloud` ✅ (unchanged)
- Learn apps: `learn-<name>.iiskills.cloud` (clean subdomain pattern)

## Updated Subdomains

### Active Applications

| App ID | Old Domain | New Domain | Port |
|--------|-----------|------------|------|
| main | `app.iiskills.cloud` | `app.iiskills.cloud` | 3000 |
| learn-ai | `app1.learn-ai.iiskills.cloud` | `learn-ai.iiskills.cloud` | 3024 |
| learn-apt | `app1.learn-apt.iiskills.cloud` | `learn-apt.iiskills.cloud` | 3002 |
| learn-chemistry | `app1.learn-chemistry.iiskills.cloud` | `learn-chemistry.iiskills.cloud` | 3005 |
| learn-developer | `app1.learn-developer.iiskills.cloud` | `learn-developer.iiskills.cloud` | 3007 |
| learn-geography | `app1.learn-geography.iiskills.cloud` | `learn-geography.iiskills.cloud` | 3011 |
| learn-management | `app1.learn-management.iiskills.cloud` | `learn-management.iiskills.cloud` | 3016 |
| learn-math | `app1.learn-math.iiskills.cloud` | `learn-math.iiskills.cloud` | 3017 |
| learn-physics | `app1.learn-physics.iiskills.cloud` | `learn-physics.iiskills.cloud` | 3020 |
| learn-pr | `app1.learn-pr.iiskills.cloud` | `learn-pr.iiskills.cloud` | 3021 |

## DNS Configuration Required

### DNS A Records
Point the following subdomains to your server IP (e.g., 72.60.203.189):

```
app.iiskills.cloud              A     72.60.203.189
learn-ai.iiskills.cloud         A     72.60.203.189
learn-apt.iiskills.cloud        A     72.60.203.189
learn-chemistry.iiskills.cloud  A     72.60.203.189
learn-developer.iiskills.cloud  A     72.60.203.189
learn-geography.iiskills.cloud  A     72.60.203.189
learn-management.iiskills.cloud A     72.60.203.189
learn-math.iiskills.cloud       A     72.60.203.189
learn-physics.iiskills.cloud    A     72.60.203.189
learn-pr.iiskills.cloud         A     72.60.203.189
```

## Nginx Configuration Update

### Nginx Server Blocks
Update your Nginx configuration to use the new subdomain pattern:

```nginx
# Main app
server {
    server_name app.iiskills.cloud;
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Learn AI
server {
    server_name learn-ai.iiskills.cloud;
    location / {
        proxy_pass http://localhost:3024;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Learn APT
server {
    server_name learn-apt.iiskills.cloud;
    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# ... Continue for all other learn-* apps ...
```

## SSL Certificates

### Using Certbot
Generate SSL certificates for all new subdomains:

```bash
# Main app (if not already done)
sudo certbot --nginx -d app.iiskills.cloud

# Learn apps
sudo certbot --nginx -d learn-ai.iiskills.cloud
sudo certbot --nginx -d learn-apt.iiskills.cloud
sudo certbot --nginx -d learn-chemistry.iiskills.cloud
sudo certbot --nginx -d learn-developer.iiskills.cloud
sudo certbot --nginx -d learn-geography.iiskills.cloud
sudo certbot --nginx -d learn-management.iiskills.cloud
sudo certbot --nginx -d learn-math.iiskills.cloud
sudo certbot --nginx -d learn-physics.iiskills.cloud
sudo certbot --nginx -d learn-pr.iiskills.cloud

# Or all at once
sudo certbot --nginx -d app.iiskills.cloud \
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

## PM2 Configuration

The `ecosystem.config.js` file remains unchanged as it uses localhost ports which are mapped by Nginx. No PM2 changes are required.

## Code Changes

### Files Updated
1. **lib/appRegistry.js** - Core app configuration (primaryDomain for all apps)
2. **components/shared/UniversalLandingPage.js** - Course links
3. **apps/main/lib/siteConfig.js** - Site configuration URLs
4. **apps/main/pages/index.js** - Main landing page course links
5. **apps/main/components/Footer.js** - Footer learning portal links
6. **apps/learn-apt/pages/test/diagnostic.js** - Cross-app navigation

### Testing App Registry
Verify the app registry is working correctly:

```javascript
const { APPS, getAppByDomain, getAppBySubdomain } = require('./lib/appRegistry.js');

// Test lookups
console.log(getAppByDomain('learn-ai.iiskills.cloud'));  // Should return learn-ai app
console.log(getAppBySubdomain('learn-chemistry'));        // Should return learn-chemistry app
```

## Deployment Steps

1. **Update DNS Records**
   - Add A records for all new subdomains
   - Wait for DNS propagation (can take up to 48 hours, usually much faster)

2. **Update Nginx Configuration**
   - Update server blocks to use new subdomain pattern
   - Test configuration: `sudo nginx -t`
   - Reload Nginx: `sudo systemctl reload nginx`

3. **Generate SSL Certificates**
   - Run certbot commands for new subdomains
   - Verify HTTPS works for all domains

4. **Deploy Code Changes**
   - Pull latest code with subdomain updates
   - Build all apps: `yarn build`
   - Restart PM2: `pm2 restart all`

5. **Verification**
   - Test each subdomain in browser
   - Verify links between apps work correctly
   - Check authentication flows across subdomains
   - Monitor logs for any issues

## Rollback Plan

If issues occur, the old DNS records can be kept temporarily alongside the new ones. The code can be reverted to use the old `app#.learn-` pattern by reverting this PR.

## Environment Variables

Each app's `.env.local` should have `NEXT_PUBLIC_SITE_URL` set to its new domain:

```bash
# Example for learn-ai app
NEXT_PUBLIC_SITE_URL=https://learn-ai.iiskills.cloud

# Example for main app
NEXT_PUBLIC_SITE_URL=https://app.iiskills.cloud
```

## Benefits of New Pattern

1. **Cleaner URLs** - More professional and easier to remember
2. **Better SEO** - Direct subdomains are better for search engines
3. **Simplified DNS** - Fewer numbered subdomains to manage
4. **Consistent Branding** - All apps use `learn-<name>.iiskills.cloud` pattern
5. **Easier Scaling** - Can add new apps without worrying about numbering

## Security Considerations

- All subdomains should use HTTPS
- Supabase authentication works across all `*.iiskills.cloud` subdomains
- Cross-subdomain session sharing is configured correctly in appRegistry.js

## Support & Troubleshooting

### Common Issues

1. **DNS not resolving**
   - Check DNS propagation: `nslookup learn-ai.iiskills.cloud`
   - Wait for DNS propagation

2. **502 Bad Gateway**
   - Check PM2 processes: `pm2 status`
   - Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

3. **SSL certificate issues**
   - Verify certificates: `sudo certbot certificates`
   - Renew if needed: `sudo certbot renew`

4. **Authentication not working**
   - Check Supabase redirect URLs include new domains
   - Verify cookies are set for `.iiskills.cloud`

## Next Steps

After successful deployment:
1. Monitor application logs for any issues
2. Update any external documentation referencing old URLs
3. Set up redirects from old URLs to new ones (optional)
4. Update any bookmarks or saved links
5. Communicate changes to users

## Conclusion

This update simplifies the subdomain structure and provides a cleaner, more professional appearance for the iiskills.cloud platform. All learning apps now have memorable, easy-to-type URLs that follow a consistent pattern.
