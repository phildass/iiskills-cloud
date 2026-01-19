#!/bin/bash
set -e

echo "=== Running server-side deployment script ==="

# Ensure we're in the correct directory
echo "Current dir: $(pwd)"

# Install/update dependencies (uncomment if you use npm/yarn)
if [ -f package.json ]; then
    echo "-- Found package.json; running npm install --"
    npm install
fi

# Build project (uncomment for Next.js/React/TypeScript etc)
if [ -f package.json ]; then
    if grep -q '"build"' package.json; then
        echo "-- package.json has a build script; running npm run build --"
        npm run build
    fi
fi

# Restart your process manager (uncomment and configure for PM2/systemd)
# Example for PM2: pm2 restart all
# Example for systemd: systemctl restart your-app.service

echo "=== Deployment script completed successfully! ==="