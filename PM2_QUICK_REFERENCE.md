# PM2 Auto-Detection Quick Reference

## Quick Commands

```bash
# Regenerate PM2 configuration
npm run generate-pm2-config

# Validate configuration
npm run validate-pm2-config

# Test configuration
npm run test-pm2-config

# Start all apps
pm2 start ecosystem.config.js

# View status
pm2 list

# View logs
pm2 logs

# Stop all apps
pm2 stop all

# Restart all apps
pm2 restart all
```

## Fresh Clone Setup

```bash
# 1. Clone repository
git clone https://github.com/phildass/iiskills-cloud.git
cd iiskills-cloud

# 2. Install dependencies
npm install
for dir in learn-*/; do (cd "$dir" && npm install); done

# 3. Build all apps
npm run build
for dir in learn-*/; do (cd "$dir" && npm run build); done

# 4. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Windows (PowerShell) Setup

```powershell
# 1. Clone repository
git clone https://github.com/phildass/iiskills-cloud.git
cd iiskills-cloud

# 2. Install dependencies
npm install
Get-ChildItem -Directory -Filter "learn-*" | ForEach-Object {
  Push-Location $_.FullName
  npm install
  Pop-Location
}

# 3. Build all apps
npm run build
Get-ChildItem -Directory -Filter "learn-*" | ForEach-Object {
  Push-Location $_.FullName
  npm run build
  Pop-Location
}

# 4. Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Port Assignments

| App                | Port |
| ------------------ | ---- |
| Main               | 3000 |
| Learn-Apt          | 3001 |
| Learn-Math         | 3002 |
| Learn-Winning      | 3003 |
| Learn-Data-Science | 3004 |
| Learn-Management   | 3005 |
| Learn-Leadership   | 3006 |
| Learn-AI           | 3007 |
| Learn-PR           | 3008 |
| Learn-Chemistry    | 3009 |
| Learn-Geography    | 3010 |
| Learn-JEE          | 3011 |
| Learn-NEET         | 3012 |
| Learn-Physics      | 3013 |
| Learn-Govt-Jobs    | 3014 |
| Learn-IAS          | 3015 |

## Documentation

- **[PM2_AUTO_DETECTION.md](PM2_AUTO_DETECTION.md)** - Complete guide
- **[PM2_ENTRY_POINTS.md](PM2_ENTRY_POINTS.md)** - Detected entry points
- **[PM2_DEPLOYMENT.md](PM2_DEPLOYMENT.md)** - Deployment guide
- **[PM2_AUTO_DETECTION_SUMMARY.md](PM2_AUTO_DETECTION_SUMMARY.md)** - Implementation summary

## Troubleshooting

**Configuration not working?**

```bash
npm run test-pm2-config
```

**Need to update after adding apps?**

```bash
npm run generate-pm2-config
npm run test-pm2-config
pm2 reload all
```

**Port conflicts?**

- Check `PM2_ENTRY_POINTS.md` for assignments
- Regenerate: `npm run generate-pm2-config`

## Support

For issues:

1. Run `npm run test-pm2-config` to diagnose
2. Check documentation in `PM2_AUTO_DETECTION.md`
3. Review `PM2_ENTRY_POINTS.md` for current state
4. See `PM2_DEPLOYMENT.md` for deployment help
