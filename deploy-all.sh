# ... (your earlier script as above up to cleaning or yarn install)

echo "==> [2/10] Installing dependencies"
yarn install --immutable

# List of all app directories to build IN ORDER (main first, then each learning app)
APPS=(
  "main"
  "learn-apt"
  "learn-chemistry"
  "learn-developer"
  "learn-geography"
  "learn-management"
  "learn-math"
  "learn-physics"
  "learn-pr"
  "learn-ai"
)

echo "==> [3/10] Building apps one at a time (serial build)"
for APP in "${APPS[@]}"; do
  echo "------ BUILD: apps/$APP ------"
  (cd "apps/$APP" && yarn build)
  echo "------ DONE:  apps/$APP ------"
done

echo "==> [4/10] Build completed for all apps, proceeding to PM2 restart"

# You may have: (edit as needed)
pm2 stop iiskills-main iiskills-learn-apt iiskills-learn-chemistry iiskills-learn-developer iiskills-learn-geography iiskills-learn-management iiskills-learn-math iiskills-learn-physics iiskills-learn-pr iiskills-learn-ai
pm2 delete iiskills-main-copy || true
pm2 start ecosystem.config.js
pm2 save

echo "==> [5/10] Deployment complete."
