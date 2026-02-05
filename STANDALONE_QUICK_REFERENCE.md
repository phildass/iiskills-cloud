# Standalone Deployment - Quick Reference

## One-Command Deployment

```bash
# Build and deploy all apps
./deploy-standalone.sh
```

## Essential PM2 Commands

```bash
# View all apps
pm2 status

# View logs
pm2 logs

# Monitor real-time
pm2 monit

# Stop all
pm2 stop all

# Restart all
pm2 restart all

# Start specific app
pm2 start ecosystem.config.js --only iiskills-learn-ai

# View logs for specific app
pm2 logs iiskills-learn-ai
```

## App Ports Quick Reference

| App | Port | URL |
|-----|------|-----|
| main | 3000 | http://localhost:3000 |
| learn-apt | 3002 | http://localhost:3002 |
| learn-chemistry | 3005 | http://localhost:3005 |
| learn-developer | 3007 | http://localhost:3007 |
| learn-cricket | 3009 | http://localhost:3009 |
| learn-geography | 3011 | http://localhost:3011 |
| learn-govt-jobs | 3013 | http://localhost:3013 |
| learn-leadership | 3015 | http://localhost:3015 |
| learn-management | 3016 | http://localhost:3016 |
| learn-math | 3017 | http://localhost:3017 |
| learn-physics | 3020 | http://localhost:3020 |
| learn-pr | 3021 | http://localhost:3021 |
| learn-winning | 3022 | http://localhost:3022 |
| learn-companion | 3023 | http://localhost:3023 |
| learn-ai | 3024 | http://localhost:3024 |

## Manual Build Process

```bash
# 1. Enable Corepack
corepack enable

# 2. Install dependencies
yarn install

# 3. Build all apps
yarn build

# 4. Setup standalone (run from repo root)
for app in apps/*; do
  name=$(basename "$app")
  standalone="$app/.next/standalone/apps/$name"
  [ -d "$standalone" ] && {
    cp "$app/.env.local" "$standalone/.env.local"
    cp -r "$app/public" "$standalone/public"
    cp -r "$app/.next/static" "$standalone/.next/static"
  }
done

# 5. Start with PM2
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save
```

## Update Single App

```bash
# Example: Update learn-ai

# 1. Stop app
pm2 stop iiskills-learn-ai

# 2. Build
cd apps/learn-ai
yarn build

# 3. Setup standalone
cp .env.local .next/standalone/apps/learn-ai/
cp -r public .next/standalone/apps/learn-ai/
cp -r .next/static .next/standalone/apps/learn-ai/.next/

# 4. Restart
cd ../..
pm2 restart iiskills-learn-ai
```

## Troubleshooting

```bash
# Check logs
pm2 logs iiskills-learn-ai --lines 50

# Check error logs only
pm2 logs --err

# Restart all apps
pm2 restart all

# Delete and restart
pm2 delete all
pm2 start ecosystem.config.js
```

## Production Setup

```bash
# Enable PM2 startup on boot
pm2 startup systemd

# Save process list
pm2 save

# Check startup status
systemctl status pm2-$USER
```

## Testing Apps

```bash
# Test all apps
for port in 3000 3002 3005 3007 3009 3011 3013 3015 3016 3017 3020 3021 3022 3023 3024; do
  echo "Testing port $port: $(curl -s -o /dev/null -w '%{http_code}' http://localhost:$port)"
done
```

## Documentation

- **STANDALONE_BUILD_SUMMARY.md** - Complete build summary
- **DEPLOYMENT_STANDALONE.md** - Full deployment guide
- **deploy-standalone.sh** - Automated deployment script

## Support

View PM2 process details:
```bash
pm2 describe iiskills-learn-ai
```

View system information:
```bash
pm2 info
```

Reset PM2:
```bash
pm2 kill
pm2 resurrect
```
