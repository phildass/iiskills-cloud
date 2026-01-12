# Admin Subdomain Setup Guide

This guide explains how the admin section of iiskills.cloud works with both main domain routing (`iiskills.cloud/admin`) and subdomain routing (`admin.iiskills.cloud`).

## Architecture Overview

The admin section is designed to work in two modes:

1. **Main Domain Route**: `https://iiskills.cloud/admin`
   - Standard route-based access
   - Works immediately without additional DNS configuration
   - Ideal for development and simple deployments

2. **Subdomain Route**: `https://admin.iiskills.cloud`
   - Professional subdomain access
   - Requires DNS configuration
   - Uses Next.js rewrites to internally route to `/admin` paths
   - Provides better separation and branding

### Key Features

- **Single Codebase**: Both access methods use the same `/pages/admin/*` files
- **Cross-Subdomain Authentication**: Sessions persist across `iiskills.cloud` and `admin.iiskills.cloud`
- **Seamless Navigation**: Users can switch between main site and admin easily
- **Fallback Support**: If subdomain isn't configured, `/admin` route works perfectly

## How It Works

### 1. Next.js Rewrites

The `next.config.js` file contains hostname-based rewrites:

```javascript
async rewrites() {
  return [
    // Rewrite admin subdomain to /admin routes
    {
      source: '/:path*',
      has: [{ type: 'host', value: 'admin.iiskills.cloud' }],
      destination: '/admin/:path*',
    },
    {
      source: '/',
      has: [{ type: 'host', value: 'admin.iiskills.cloud' }],
      destination: '/admin',
    },
  ]
}
```

This means:

- `admin.iiskills.cloud/` → internally routes to `/admin`
- `admin.iiskills.cloud/users` → internally routes to `/admin/users`
- All admin pages and APIs work identically on both routes

### 2. Cross-Subdomain Authentication

The Supabase client is configured with cookie domain settings:

```javascript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    cookieOptions: {
      domain: ".iiskills.cloud", // Note the leading dot
      secure: true,
      sameSite: "lax",
    },
  },
});
```

**Important**: The leading dot (`.iiskills.cloud`) makes cookies available to:

- `iiskills.cloud`
- `admin.iiskills.cloud`
- `learn-apt.iiskills.cloud`
- Any other subdomain

This ensures users stay logged in when navigating between domains.

### 3. URL Helper Utilities

The `utils/urlHelper.js` provides functions to generate correct URLs:

- `getAdminUrl()` - Returns admin URL (subdomain if available, otherwise `/admin`)
- `getMainSiteUrl()` - Returns main site URL
- `getCookieDomain()` - Returns correct cookie domain for environment
- `isOnSubdomain()` - Checks if currently on a specific subdomain

These utilities adapt to the environment:

- **Development (localhost)**: Uses relative paths (`/admin`)
- **Production**: Uses absolute URLs with subdomains

### 4. Navigation Components

**AdminNav** (shown in admin section):

- Displays admin navigation links
- Shows "← Main Site" link to return to main domain
- Logout button

**Navbar** (shown on main site):

- Shows "Admin" button for authenticated admin users
- Links to admin subdomain (or `/admin` route on localhost)

## DNS Configuration

### Required DNS Records

To enable subdomain routing, add these DNS records to your domain:

#### For Vercel Deployment

```
Type: CNAME
Name: admin
Value: cname.vercel-dns.com
TTL: Auto
```

#### For Custom Server / VPS

```
Type: A
Name: admin
Value: <your-server-ip>
TTL: 3600
```

#### For Netlify

```
Type: CNAME
Name: admin
Value: <your-site>.netlify.app
TTL: Auto
```

### DNS Propagation

- DNS changes can take 5 minutes to 48 hours to propagate
- Test with `dig admin.iiskills.cloud` or `nslookup admin.iiskills.cloud`
- Initially, the `/admin` route will work while DNS propagates

## Deployment Instructions

### Environment Variables

Create or update `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Site Configuration
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_SITE_URL=https://iiskills.cloud

# Cookie Domain (for cross-subdomain auth)
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
```

### Vercel Deployment

1. **Configure Domain**:
   - Go to Project Settings → Domains
   - Add `iiskills.cloud` as primary domain
   - Add `admin.iiskills.cloud` as additional domain
   - Vercel automatically handles SSL certificates

2. **Environment Variables**:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Apply to Production, Preview, and Development

3. **Deploy**:

   ```bash
   git push origin main
   ```

   Vercel auto-deploys on push

4. **Verify**:
   - Visit `https://iiskills.cloud/admin` (should work)
   - Visit `https://admin.iiskills.cloud` (should work after DNS propagates)
   - Both should show identical admin interface

### Netlify Deployment

1. **Configure Domain**:
   - Go to Site Settings → Domain Management
   - Add custom domain `iiskills.cloud`
   - Add subdomain `admin.iiskills.cloud`

2. **Build Settings**:

   ```
   Build command: npm run build
   Publish directory: .next
   ```

3. **Environment Variables**:
   - Go to Site Settings → Environment Variables
   - Add all variables from `.env.local`

4. **Deploy**:

   ```bash
   git push origin main
   ```

5. **Configure Redirects** (optional):
   Create `netlify.toml`:
   ```toml
   [[redirects]]
     from = "https://admin.iiskills.cloud/*"
     to = "https://iiskills.cloud/admin/:splat"
     status = 200
     force = false
   ```

### Custom Server / VPS Deployment

1. **Install Dependencies**:

   ```bash
   npm install
   npm run build
   ```

2. **Configure Nginx**:

   ```nginx
   # Main domain
   server {
       listen 443 ssl http2;
       server_name iiskills.cloud;

       ssl_certificate /etc/letsencrypt/live/iiskills.cloud/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/iiskills.cloud/privkey.pem;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }

   # Admin subdomain
   server {
       listen 443 ssl http2;
       server_name admin.iiskills.cloud;

       ssl_certificate /etc/letsencrypt/live/iiskills.cloud/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/iiskills.cloud/privkey.pem;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Setup SSL with Let's Encrypt**:

   ```bash
   sudo certbot --nginx -d iiskills.cloud -d admin.iiskills.cloud
   ```

4. **Start Application**:
   ```bash
   npm run start
   # Or use PM2 for process management
   pm2 start npm --name "iiskills" -- start
   ```

### Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t iiskills-cloud .
docker run -p 3000:3000 --env-file .env.local iiskills-cloud
```

## Testing

### Local Development Testing

1. **Test main route**:

   ```
   http://localhost:3000/admin
   ```

2. **Test subdomain locally** (requires hosts file modification):

   Edit `/etc/hosts` (Linux/Mac) or `C:\Windows\System32\drivers\etc\hosts` (Windows):

   ```
   127.0.0.1 admin.localhost
   ```

   Then visit:

   ```
   http://admin.localhost:3000
   ```

### Production Testing Checklist

- [ ] Visit `https://iiskills.cloud/admin` - should load admin dashboard
- [ ] Visit `https://admin.iiskills.cloud` - should load admin dashboard
- [ ] Login at `https://iiskills.cloud/admin/login`
- [ ] Navigate to `https://iiskills.cloud` - should still be logged in
- [ ] Navigate to `https://admin.iiskills.cloud` - should still be logged in
- [ ] Click "Main Site" link in AdminNav - should go to main site
- [ ] Click "Admin" button in main Navbar - should go to admin
- [ ] All admin pages should work on both routes:
  - [ ] `/admin/courses` and `admin.iiskills.cloud/courses`
  - [ ] `/admin/users` and `admin.iiskills.cloud/users`
  - [ ] `/admin/content` and `admin.iiskills.cloud/content`
  - [ ] `/admin/settings` and `admin.iiskills.cloud/settings`

## Troubleshooting

### Issue: Subdomain doesn't work

**Possible causes**:

1. DNS not configured correctly
2. DNS not propagated yet
3. SSL certificate doesn't include subdomain

**Solutions**:

- Check DNS with `dig admin.iiskills.cloud`
- Wait for DNS propagation (up to 48 hours)
- Ensure SSL certificate includes both `iiskills.cloud` and `*.iiskills.cloud`
- Verify Vercel/Netlify domain configuration

### Issue: Not logged in on subdomain

**Possible causes**:

1. Cookie domain not set correctly
2. Different protocol (http vs https)
3. Browser blocking third-party cookies

**Solutions**:

- Check `NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud` in environment
- Ensure both domains use HTTPS
- Test in different browser
- Check browser console for cookie errors

### Issue: Admin link doesn't appear

**Possible causes**:

1. Not logged in as admin
2. localStorage not set

**Solutions**:

- Login via `/admin/login` first
- Check `localStorage.getItem('adminAuth')` in browser console
- Verify admin password is correct

### Issue: Rewrites not working

**Possible causes**:

1. `next.config.js` not loaded
2. Build cache issue
3. Environment not recognizing hostname

**Solutions**:

```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
npm run start
```

## Security Considerations

1. **Admin Authentication**:
   - Currently uses localStorage for backward compatibility with existing system
   - **IMPORTANT**: This is not secure for production use as localStorage can be manipulated
   - **Recommended for Production**: Implement proper server-side authentication:
     - Add admin role/flag to user records in Supabase
     - Use Supabase Row Level Security (RLS) policies
     - Verify admin status on server-side API calls
     - Consider using JWT tokens with admin claims
   - The ProtectedRoute component already uses localStorage - maintain consistency
   - For production, upgrade both systems simultaneously

2. **Cookie Security**:
   - Cookies are marked `secure` in production (HTTPS only)
   - `sameSite: 'lax'` prevents CSRF attacks
   - Cookie domain limited to `.iiskills.cloud`

3. **HTTPS Required**: Subdomain authentication requires HTTPS in production

4. **Admin Password**: Change the default admin password in production for security

5. **Environment Variables**: Never commit `.env.local` to version control

## Migration Guide

### From `/admin` only to Subdomain Support

No migration needed! The implementation is backward compatible:

1. Deploy the updated code
2. `/admin` routes continue working immediately
3. Configure DNS for subdomain (optional)
4. Both routes work simultaneously

### Disabling Subdomain (Rollback)

If you need to disable subdomain routing:

1. Remove DNS records for `admin.iiskills.cloud`
2. Remove rewrite rules from `next.config.js`
3. Update navigation to use `/admin` routes only
4. The main `/admin` route continues working

## Advanced Configuration

### Custom Admin Subdomain

To use a different subdomain (e.g., `dashboard.iiskills.cloud`):

1. Update `next.config.js`:

   ```javascript
   has: [{ type: "host", value: "dashboard.iiskills.cloud" }];
   ```

2. Update `utils/urlHelper.js` in `getAdminUrl()`:

   ```javascript
   return `${protocol}//dashboard.${mainDomain}${portSuffix}${path}`;
   ```

3. Update DNS records for `dashboard` subdomain

### Multiple Admin Subdomains

Support multiple admin subdomains:

```javascript
async rewrites() {
  return [
    // Primary admin subdomain
    { source: '/:path*', has: [{ type: 'host', value: 'admin.iiskills.cloud' }], destination: '/admin/:path*' },
    // Alternative admin subdomain
    { source: '/:path*', has: [{ type: 'host', value: 'dashboard.iiskills.cloud' }], destination: '/admin/:path*' },
  ]
}
```

## Best Practices

1. **Always test on localhost first** before deploying
2. **Use environment variables** for configuration
3. **Set proper cookie domain** for production
4. **Enable HTTPS** for production deployments
5. **Monitor DNS propagation** after configuration
6. **Keep admin credentials secure**
7. **Document any custom configurations** for your team

## Support

For issues or questions:

- Check troubleshooting section above
- Review Next.js rewrites documentation
- Check Vercel/Netlify domain documentation
- Verify DNS configuration with your provider

## Summary

This setup provides:
✅ Dual access to admin (main route + subdomain)
✅ Cross-subdomain authentication
✅ Seamless navigation between domains
✅ Zero downtime migration
✅ Backward compatibility
✅ Professional subdomain structure

The admin section works immediately with `/admin` route and scales to subdomain when DNS is configured.
