#!/bin/bash

set -e

# List all your Next.js apps here. Add/remove as needed.
apps=(
  learn-ai
  learn-management
  learn-pr
  learn-math
  learn-physics
  learn-chemistry
  learn-geography
  learn-govt-jobs
  learn-apt
  learn-developer
  Main
)

MONOREPO_ROOT="/mnt/c/users/pdake/cloud/iiskills-cloud"

cd "$MONOREPO_ROOT"
echo "📦 Installing root dependencies..."
yarn install

success_count=0
fail_count=0

for app in "${apps[@]}"; do
  APPDIR="apps/$app"
  if [ ! -d "$APPDIR" ]; then
    echo "⚠️  Skipping missing app directory: $APPDIR"
    continue
  fi

  echo "🔨 Building $app..."
  cd "$MONOREPO_ROOT/$APPDIR"
  if yarn build; then
    if [ -f ".next/standalone/server.js" ]; then
      echo "✅ Build succeeded for $app"
      ((success_count++))
    else
      echo "❌ Build did not produce standalone output for $app"
      ((fail_count++))
      cd "$MONOREPO_ROOT"
      exit 1
    fi
  else
    echo "❌ Build failed for $app!"
    ((fail_count++))
    cd "$MONOREPO_ROOT"
    exit 1
  fi
  cd "$MONOREPO_ROOT"
done

echo "---------------------------"
echo "✅ Built $success_count app(s); ❌ $fail_count failed."
echo "---------------------------"

echo "🚀 Restarting all apps with PM2..."
pm2 start ecosystem.config.js

echo "🎉 Auto build and deploy complete!"
