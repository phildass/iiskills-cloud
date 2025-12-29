# Deployment Guide - iiskills.cloud Multi-App Setup

This guide explains how to deploy the iiskills.cloud platform with multiple standalone Next.js applications on different subdomains.

## Architecture Overview

```
iiskills.cloud (main app)           - Port 3000
learn-apt.iiskills.cloud            - Port 3001
```

All apps share the same Supabase authentication backend for cross-subdomain single sign-on.

## Prerequisites

- Node.js 16.x or higher
- Nginx or similar reverse proxy
- SSL certificates (Let's Encrypt recommended)
- Supabase account
- VPS or hosting platform (Vercel, Hostinger, etc.)

## Supabase Configuration

### 1. Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Note your project URL and anon key from Project Settings > API
3. Configure authentication settings:
   - Go to Authentication > Settings
   - Set **Cookie Domain** to: `.iiskills.cloud`
   - This enables session sharing across all subdomains

### 2. Environment Variables

Both apps should use the **same Supabase credentials**:

**Main app (.env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://iiskills.cloud
```

**Learn-apt app (learn-apt/.env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://learn-apt.iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
```

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

#### Main App
```bash
cd /path/to/iiskills-cloud
vercel --prod
```

Configure domain: `iiskills.cloud`

#### Learn-Apt App
```bash
cd /path/to/iiskills-cloud/learn-apt
vercel --prod
```

Configure domain: `learn-apt.iiskills.cloud`

**Vercel Environment Variables:**
- Add all environment variables in the Vercel dashboard for each project
- Ensure both projects use the same Supabase credentials

### Option 2: VPS with Nginx and PM2

#### 1. Build Both Apps

```bash
# Main app
cd /path/to/iiskills-cloud
npm install
npm run build

# Learn-apt app
cd /path/to/iiskills-cloud/learn-apt
npm install
npm run build
```

#### 2. Set Up PM2

Install PM2 globally:
```bash
npm install -g pm2
```

Create PM2 ecosystem file (`ecosystem.config.js`):
```javascript
module.exports = {
  apps: [
    {
      name: 'iiskills-main',
      cwd: '/path/to/iiskills-cloud',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      }
    },
    {
      name: 'iiskills-learn-apt',
      cwd: '/path/to/iiskills-cloud/learn-apt',
      script: 'npm',
      args: 'start',
      env: {
        PORT: 3001,
        NODE_ENV: 'production'
      }
    }
  ]
}
```

Start the apps:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 3. Configure Nginx

Create Nginx config for main app (`/etc/nginx/sites-available/iiskills-main`):
```nginx
server {
    listen 80;
    server_name iiskills.cloud www.iiskills.cloud;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name iiskills.cloud www.iiskills.cloud;
    
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

Create Nginx config for learn-apt (`/etc/nginx/sites-available/iiskills-learn-apt`):
```nginx
server {
    listen 80;
    server_name learn-apt.iiskills.cloud;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name learn-apt.iiskills.cloud;
    
    ssl_certificate /etc/letsencrypt/live/learn-apt.iiskills.cloud/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/learn-apt.iiskills.cloud/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3001;
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

Enable the sites:
```bash
sudo ln -s /etc/nginx/sites-available/iiskills-main /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/iiskills-learn-apt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. Set Up SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx

# Get certificate for main domain
sudo certbot --nginx -d iiskills.cloud -d www.iiskills.cloud

# Get certificate for learn-apt subdomain
sudo certbot --nginx -d learn-apt.iiskills.cloud
```

### Option 3: Docker

#### Main App Dockerfile
Create `Dockerfile` in root:
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

#### Learn-Apt Dockerfile
Create `learn-apt/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

#### Docker Compose
Create `docker-compose.yml` in root:
```yaml
version: '3.8'

services:
  iiskills-main:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    restart: unless-stopped

  iiskills-learn-apt:
    build:
      context: ./learn-apt
      dockerfile: Dockerfile
    ports:
      - "3001:3001"
    env_file:
      - ./learn-apt/.env.local
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

## DNS Configuration

Add the following DNS records to your domain:

| Type  | Name      | Value              | TTL  |
|-------|-----------|-------------------|------|
| A     | @         | your-server-ip    | 3600 |
| A     | www       | your-server-ip    | 3600 |
| A     | learn-apt | your-server-ip    | 3600 |

Or for Vercel:
| Type  | Name      | Value                    | TTL  |
|-------|-----------|--------------------------|------|
| CNAME | @         | cname.vercel-dns.com     | 3600 |
| CNAME | www       | cname.vercel-dns.com     | 3600 |
| CNAME | learn-apt | cname.vercel-dns.com     | 3600 |

## Cross-Subdomain Authentication Testing

1. **Login on main app:**
   - Go to https://iiskills.cloud
   - Log in with your credentials
   - You should be logged in

2. **Navigate to learn-apt:**
   - Go to https://learn-apt.iiskills.cloud
   - You should automatically be logged in with the same account

3. **Logout:**
   - Log out from either app
   - You should be logged out from both apps

## Troubleshooting

### Sessions Not Shared

1. Verify both apps use the same Supabase project
2. Check Supabase cookie domain is set to `.iiskills.cloud`
3. Ensure SSL is enabled on both domains
4. Clear browser cookies and try again
5. Check that both apps have the same `NEXT_PUBLIC_COOKIE_DOMAIN` value

### Build Fails

1. Check Node.js version: `node -v` (should be 16.x+)
2. Clear build cache: `rm -rf .next && npm run build`
3. Check for dependency conflicts: `npm ls`

### SSL Certificate Issues

1. Ensure DNS is properly configured
2. Wait for DNS propagation (up to 48 hours)
3. Check Certbot logs: `sudo tail -f /var/log/letsencrypt/letsencrypt.log`

### PM2 Process Crashes

1. Check logs: `pm2 logs`
2. Check process status: `pm2 status`
3. Restart processes: `pm2 restart all`

## Maintenance

### Updating Apps

```bash
# Pull latest code
git pull origin main

# Main app
npm install
npm run build
pm2 restart iiskills-main

# Learn-apt app
cd learn-apt
npm install
npm run build
pm2 restart iiskills-learn-apt
```

### Monitoring

```bash
# View all PM2 processes
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit
```

### Backups

Regular backups should include:
- Application code (Git handles this)
- Environment variables (`.env.local` files)
- Supabase database (automated by Supabase)
- Nginx configurations
- SSL certificates

## Support

For deployment issues:
- Email: info@iiskills.cloud
- Check individual app README files for app-specific issues
