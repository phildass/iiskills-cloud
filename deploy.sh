#!/bin/bash
set -e

echo "===== Pulling latest code from Git ====="
git pull

echo "===== Installing dependencies ====="
yarn install

echo "===== Building all apps ====="
yarn workspaces foreach -A run build

echo "===== Starting/restarting all apps via PM2 ====="
pm2 start ecosystem.config.js --update-env

echo "===== Saving PM2 process list for restart on reboot ====="
pm2 save

echo "===== Deployment complete! ====="
