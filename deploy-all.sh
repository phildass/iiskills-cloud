#!/bin/bash

set -e

echo "==> Loading credentials from /etc/iiskills.env"
source /etc/iiskills.env

echo "==> Stop existing IISkills PM2 processes only (do NOT delete all PM2 processes on the host)"
pm2 stop all || true

echo "==> Pull latest changes from remote"
cd /root/iiskills-cloud-apps
git pull origin main

echo "==> Install dependencies"
yarn install

echo "==> Build (monorepo)"
yarn build

echo "==> Restart PM2 processes"
pm2 start ecosystem.config.js

echo "==> Deployment completed!"
