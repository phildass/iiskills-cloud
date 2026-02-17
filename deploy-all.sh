#!/bin/bash

set +e  # Don't exit on error—try all builds

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
  main
)

MONOREPO_ROOT="/root/iiskills-cloud"

cd "$MONOREPO_ROOT"
echo "📦 Installing root dependencies..."
yarn install

success_count=0
fail_count=0
failed_apps=()

for app in "${apps[@]}"; do
  APPDIR="apps/$app"
  if [ ! -d "$APPDIR" ]; then
    echo "⚠️  Skipping missing app directory: $APPDIR"
    continue
  fi

  echo "🔨 Building $app..."
  cd "$MONOREPO_ROOT/$APPDIR"
  if yarn build; then
    if [ -d ".next" ]; then
      echo "✅ Build succeeded for $app (Next.js build output: .next/)"
      ((success_count++))
    elif [ -d "build" ] || [ -d "dist" ]; then
      echo "✅ Build succeeded for $app (Build output found)"
      ((success_count++))
    else
      echo "❌ Build did not produce expected output for $app"
      ((fail_count++))
      failed_apps+=("$app")
    fi

    # Echo intended URL for deployed app
    if [ "$app" = "main" ]; then
      echo "🌐 Intended URL: https://app.iiskill.cloud"
    else
      echo "🌐 Intended URL: https://app1.$app.iiskill.cloud"
    fi

  else
    echo "❌ Build failed for $app!"
    ((fail_count++))
    failed_apps+=("$app")
  fi
  cd "$MONOREPO_ROOT"
done

echo "---------------------------"
echo "✅ Built $success_count app(s); ❌ $fail_count failed."
if [ $fail_count -gt 0 ]; then
  echo ""
  echo "Failed apps:"
  for app in "${failed_apps[@]}"; do
    echo " - $app"
  done
fi
echo "---------------------------"

echo "🚀 Restarting all apps with PM2..."
pm2 start ecosystem.config.js

echo "🎉 Auto build and deploy complete!"
