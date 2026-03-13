#!/usr/bin/env bash
set -euo pipefail

cd /root/iiskills-cloud-apps/apps/main

# DO NOT "source" .env.local (it's not guaranteed to be bash-compatible).
# Next.js will load .env.local automatically when started from this directory.

# Ensure build exists
if [ ! -f .next/BUILD_ID ]; then
  npm run build
fi

exec npm run start
