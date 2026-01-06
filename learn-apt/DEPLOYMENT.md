# Deployment Guide for learn-apt.iiskills.cloud

This guide provides detailed instructions for deploying the Learn Apt application to the exclusive subdomain `learn-apt.iiskills.cloud`.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
  - [Option 1: Vercel (Recommended)](#option-1-vercel-recommended)
  - [Option 2: Self-Hosted Server](#option-2-self-hosted-server)
- [DNS Configuration](#dns-configuration)
- [Environment Configuration](#environment-configuration)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- Git installed and configured
- Access to DNS settings for `iiskills.cloud` domain

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides seamless deployment with automatic CI/CD integration.

#### Quick Deploy

1. **One-Click Deploy**

   Click the button below to deploy directly to Vercel:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/phildass/learn-apt)

2. **Configure the subdomain**

   After deployment completes:
   - Navigate to your Vercel project dashboard
   - Go to **Settings** → **Domains**
   - Click **Add Domain**
   - Enter `learn-apt.iiskills.cloud`
   - Follow the DNS configuration instructions provided by Vercel

#### Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project directory
cd learn-apt

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

After deployment, configure the custom domain:

```bash
# Add custom domain
vercel domains add learn-apt.iiskills.cloud
```

### Option 2: Self-Hosted Server

Deploy on your own infrastructure with full control.

#### Step 1: Prepare the Server

Ensure your server meets the following requirements:
- Ubuntu 20.04+ or similar Linux distribution
- Node.js 18.x or later installed
- Nginx or Apache web server (for reverse proxy)
- SSL certificate capability (Let's Encrypt recommended)

#### Step 2: Clone and Build

```bash
# Clone the repository
git clone https://github.com/phildass/learn-apt.git
cd learn-apt

# Install dependencies
npm install

# Build the production version
npm run build
```

#### Step 3: Configure Process Manager (PM2)

Using PM2 for process management ensures the application restarts on crashes and server reboots.

```bash
# Install PM2 globally
npm install -g pm2

# Start the application using ecosystem config
pm2 start ecosystem.config.js

# Save the PM2 process list
pm2 save

# Configure PM2 to start on system boot
pm2 startup
# Follow the instructions provided by the command above
```

#### Step 4: Configure Nginx Reverse Proxy

Create an Nginx configuration file:

```bash
sudo nano /etc/nginx/sites-available/learn-apt.iiskills.cloud
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name learn-apt.iiskills.cloud;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name learn-apt.iiskills.cloud;

    # SSL Configuration (will be auto-configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/learn-apt.iiskills.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/learn-apt.iiskills.cloud/privkey.pem;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;

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

    # Next.js static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Public assets
    location /uploads {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=86400";
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/learn-apt.iiskills.cloud /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### Step 5: Configure SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain and install SSL certificate
sudo certbot --nginx -d learn-apt.iiskills.cloud

# Test automatic renewal
sudo certbot renew --dry-run
```

#### Step 6: Configure Firewall

```bash
# Allow Nginx through firewall
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

## DNS Configuration

Configure your DNS settings to point the subdomain to your server:

### For Vercel Deployment

Add the following DNS records in your DNS provider (where your `iiskills.cloud` domain is hosted):

1. **CNAME Record**
   - Type: `CNAME`
   - Name: `learn-apt`
   - Value: `cname.vercel-dns.com` (or the value provided by Vercel)
   - TTL: `3600` (or default)

### For Self-Hosted Deployment

Add the following DNS records:

1. **A Record** (for IPv4)
   - Type: `A`
   - Name: `learn-apt`
   - Value: Your server's IPv4 address
   - TTL: `3600` (or default)

2. **AAAA Record** (for IPv6, if available)
   - Type: `AAAA`
   - Name: `learn-apt`
   - Value: Your server's IPv6 address
   - TTL: `3600` (or default)

### DNS Propagation

DNS changes can take up to 48 hours to propagate globally, but typically complete within a few hours. You can check propagation status using:

```bash
dig learn-apt.iiskills.cloud
# or
nslookup learn-apt.iiskills.cloud
```

## Environment Configuration

### Environment Variables

The application does not require environment variables for basic operation. However, you may optionally configure:

1. **Port Configuration** (Self-hosted only)
   
   Create a `.env.local` file in the project root:
   
   ```env
   PORT=3000
   NODE_ENV=production
   ```

2. **Authentication** (if admin features are enabled)

   If you've enabled authentication features, configure:
   
   ```env
   NEXTAUTH_URL=https://learn-apt.iiskills.cloud
   NEXTAUTH_SECRET=your-secret-key-here
   ADMIN_PASSWORD=your-admin-password
   ```

   Generate a secure `NEXTAUTH_SECRET`:
   
   ```bash
   openssl rand -base64 32
   ```

### Production Checklist

Before going live, ensure:

- [ ] DNS records are configured and propagated
- [ ] SSL certificate is installed and valid
- [ ] Application builds successfully
- [ ] All tests pass
- [ ] PM2 is configured to restart on failure (self-hosted)
- [ ] Firewall rules are properly configured
- [ ] Backup strategy is in place
- [ ] Monitoring is set up (optional but recommended)

## Post-Deployment Verification

After deployment, verify the following:

1. **Application Accessibility**
   ```bash
   curl -I https://learn-apt.iiskills.cloud
   ```
   Expected: HTTP 200 OK response

2. **SSL Certificate**
   ```bash
   openssl s_client -connect learn-apt.iiskills.cloud:443 -servername learn-apt.iiskills.cloud
   ```
   Verify certificate is valid and matches the domain

3. **Application Functionality**
   - Visit `https://learn-apt.iiskills.cloud`
   - Test Brief Test flow: `/brief-test`
   - Test Elaborate Test flow: `/elaborate-test`
   - Verify results page: `/results`
   - Check admin panel (if applicable): `/admin`

4. **Performance**
   - Check page load times
   - Verify static assets are being cached
   - Test on different devices and browsers

## Troubleshooting

### Common Issues and Solutions

#### Issue: "502 Bad Gateway" Error

**Cause**: Application is not running or Nginx cannot connect to it.

**Solution**:
```bash
# Check if application is running
pm2 status

# If not running, restart
pm2 restart learn-apt

# Check application logs
pm2 logs learn-apt
```

#### Issue: DNS Not Resolving

**Cause**: DNS changes haven't propagated or are misconfigured.

**Solution**:
```bash
# Clear local DNS cache
sudo systemd-resolve --flush-caches

# Check DNS propagation
dig learn-apt.iiskills.cloud

# Verify DNS records are correct
nslookup learn-apt.iiskills.cloud
```

#### Issue: SSL Certificate Error

**Cause**: Certificate not properly installed or expired.

**Solution**:
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates

# Force renewal if needed
sudo certbot renew --force-renewal
```

#### Issue: Application Build Fails

**Cause**: Missing dependencies or Node version mismatch.

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Verify Node version
node --version  # Should be 18.x or later

# Try building again
npm run build
```

#### Issue: Port Already in Use

**Cause**: Port 3000 is occupied by another process.

**Solution**:
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Or change port in .env.local
echo "PORT=3001" >> .env.local
```

### Getting Help

If you encounter issues not covered here:

1. Check application logs:
   ```bash
   # For PM2
   pm2 logs learn-apt
   
   # For Nginx
   sudo tail -f /var/log/nginx/error.log
   ```

2. Review the [Next.js documentation](https://nextjs.org/docs)

3. Contact the repository maintainer

## Monitoring and Maintenance

### Recommended Monitoring Tools

- **Application Monitoring**: PM2 or Vercel Analytics
- **Server Monitoring**: htop, netdata, or Prometheus
- **Uptime Monitoring**: UptimeRobot or Pingdom
- **Error Tracking**: Sentry (optional)

### Regular Maintenance Tasks

- **Weekly**: Review application logs for errors
- **Monthly**: Update dependencies (`npm update`)
- **Quarterly**: Review and update SSL certificates (automatic with Let's Encrypt)
- **As Needed**: Deploy updates and security patches

---

**Last Updated**: December 2025
**Version**: 1.0.0
**Maintainer**: phildass
