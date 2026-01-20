# Deployment Guide - iiskills.cloud Multi-App Setup

This guide explains how to deploy the iiskills.cloud platform with multiple standalone Next.js applications on different subdomains.

## Architecture Overview

```
iiskills.cloud (main app)              - Port 3000
learn-ai.iiskills.cloud                - Port 3001
learn-apt.iiskills.cloud               - Port 3002
learn-chemistry.iiskills.cloud         - Port 3003
learn-data-science.iiskills.cloud      - Port 3004
learn-geography.iiskills.cloud         - Port 3005
learn-govt-jobs.iiskills.cloud         - Port 3006
learn-ias.iiskills.cloud               - Port 3007
learn-jee.iiskills.cloud               - Port 3008
learn-leadership.iiskills.cloud        - Port 3009
learn-management.iiskills.cloud        - Port 3010
learn-math.iiskills.cloud              - Port 3011
learn-neet.iiskills.cloud              - Port 3012
learn-physics.iiskills.cloud           - Port 3013
learn-pr.iiskills.cloud                - Port 3014
learn-winning.iiskills.cloud           - Port 3015
learn-cricket.iiskills.cloud           - Port 3016
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

All apps should use the **same Supabase credentials**:

**Main app (.env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://iiskills.cloud
```

**All learning modules (learn-*/. env.local):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://learn-{module}.iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud
```

Replace `{module}` with: ai, apt, chemistry, cricket, data-science, geography, govt-jobs, ias, jee, leadership, management, math, neet, physics, pr, or winning

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

#### Main App
```bash
cd /path/to/iiskills-cloud
vercel --prod
```

Configure domain: `iiskills.cloud`

#### Learning Modules (Repeat for each module)

For each module (ai, apt, chemistry, cricket, data-science, geography, govt-jobs, ias, jee, leadership, management, math, neet, physics, pr, winning):
```bash
cd /path/to/iiskills-cloud/learn-{module}
vercel --prod
```

Configure domain for each:
- `learn-ai.iiskills.cloud`
- `learn-apt.iiskills.cloud`
- `learn-chemistry.iiskills.cloud`
- `learn-cricket.iiskills.cloud`
- `learn-data-science.iiskills.cloud`
- `learn-geography.iiskills.cloud`
- `learn-govt-jobs.iiskills.cloud`
- `learn-ias.iiskills.cloud`
- `learn-jee.iiskills.cloud`
- `learn-leadership.iiskills.cloud`
- `learn-management.iiskills.cloud`
- `learn-math.iiskills.cloud`
- `learn-neet.iiskills.cloud`
- `learn-physics.iiskills.cloud`
- `learn-pr.iiskills.cloud`
- `learn-winning.iiskills.cloud`

**Vercel Environment Variables:**
- Add all environment variables in the Vercel dashboard for each project
- Ensure all projects use the same Supabase credentials
- Set appropriate `NEXT_PUBLIC_SITE_URL` for each subdomain

### Option 2: VPS with Nginx and PM2

#### 1. Build All Apps

```bash
# Main app
cd /path/to/iiskills-cloud
npm install
npm run build

# All learning modules
cd /path/to/iiskills-cloud/learn-apt
npm install && npm run build

cd /path/to/iiskills-cloud/learn-math
npm install && npm run build

cd /path/to/iiskills-cloud/learn-winning
npm install && npm run build

cd /path/to/iiskills-cloud/learn-data-science
npm install && npm run build

cd /path/to/iiskills-cloud/learn-management
npm install && npm run build

cd /path/to/iiskills-cloud/learn-leadership
npm install && npm run build

cd /path/to/iiskills-cloud/learn-ai
npm install && npm run build

cd /path/to/iiskills-cloud/learn-pr
npm install && npm run build

cd /path/to/iiskills-cloud/learn-geography
npm install && npm run build
```

#### 2. Set Up PM2

Install PM2 globally:
```bash
npm install -g pm2
```

The repository includes a complete PM2 ecosystem file (`ecosystem.config.js`) with all 16 learning modules configured.

Start all apps:
```bash
cd /path/to/iiskills-cloud
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

This will start:
- iiskills-main (port 3000)
- iiskills-learn-ai (port 3001)
- iiskills-learn-apt (port 3002)
- iiskills-learn-chemistry (port 3003)
- iiskills-learn-data-science (port 3004)
- iiskills-learn-geography (port 3005)
- iiskills-learn-govt-jobs (port 3006)
- iiskills-learn-ias (port 3007)
- iiskills-learn-jee (port 3008)
- iiskills-learn-leadership (port 3009)
- iiskills-learn-management (port 3010)
- iiskills-learn-math (port 3011)
- iiskills-learn-neet (port 3012)
- iiskills-learn-physics (port 3013)
- iiskills-learn-pr (port 3014)
- iiskills-learn-winning (port 3015)
- iiskills-learn-cricket (port 3016)

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

Create Nginx config for all learning modules. You can create individual files or a single file with multiple server blocks:

**Option A: Single file** (`/etc/nginx/sites-available/iiskills-learning-modules`):
```nginx
# Learn-Apt
server {
    listen 80;
    server_name learn-apt.iiskills.cloud;
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

# Learn-Math (port 3002)
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Repeat for other modules (learn-winning:3003, learn-data-science:3004, 
# learn-management:3005, learn-leadership:3006, learn-ai:3007, learn-pr:3008, learn-geography:3009)
# Following the same pattern as above
```

**Note:** Repeat the server block pattern for all remaining modules, changing:
- `server_name` to the appropriate subdomain
- `proxy_pass` to the appropriate port
- SSL certificate paths to match the subdomain

Enable the sites:
```bash
sudo ln -s /etc/nginx/sites-available/iiskills-main /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/iiskills-learning-modules /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 4. Set Up SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx

# Get certificate for main domain
sudo certbot --nginx -d iiskills.cloud -d www.iiskills.cloud

Get certificates for all learning module subdomains
sudo certbot --nginx -d learn-ai.iiskills.cloud
sudo certbot --nginx -d learn-apt.iiskills.cloud
sudo certbot --nginx -d learn-chemistry.iiskills.cloud
sudo certbot --nginx -d learn-cricket.iiskills.cloud
sudo certbot --nginx -d learn-data-science.iiskills.cloud
sudo certbot --nginx -d learn-geography.iiskills.cloud
sudo certbot --nginx -d learn-govt-jobs.iiskills.cloud
sudo certbot --nginx -d learn-ias.iiskills.cloud
sudo certbot --nginx -d learn-jee.iiskills.cloud
sudo certbot --nginx -d learn-leadership.iiskills.cloud
sudo certbot --nginx -d learn-management.iiskills.cloud
sudo certbot --nginx -d learn-math.iiskills.cloud
sudo certbot --nginx -d learn-neet.iiskills.cloud
sudo certbot --nginx -d learn-physics.iiskills.cloud
sudo certbot --nginx -d learn-pr.iiskills.cloud
sudo certbot --nginx -d learn-winning.iiskills.cloud

# Or get all certificates at once with a wildcard (requires DNS challenge):
sudo certbot certonly --manual --preferred-challenges dns \
  -d *.iiskills.cloud -d iiskills.cloud
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
