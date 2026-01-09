#!/bin/bash

# Environment Setup Script for iiskills-cloud Monorepo
# This script helps you configure .env.local files across all modules

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 iiskills-cloud Environment Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "This script will help you configure environment variables for all apps."
echo "You need Supabase credentials to continue."
echo ""
echo "If you don't have a Supabase project yet:"
echo "  1. Visit https://supabase.com"
echo "  2. Create a new project"
echo "  3. Go to Settings → API"
echo "  4. Copy your Project URL and anon/public key"
echo ""

# Check if .env.local already exists
if [ -f ".env.local" ]; then
  echo "⚠️  .env.local already exists in the root directory."
  echo ""
  read -p "Do you want to overwrite it? (y/N): " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Using existing .env.local for configuration..."
  else
    rm .env.local
    cp .env.local.example .env.local
    echo "✅ Created new .env.local from template"
  fi
else
  cp .env.local.example .env.local
  echo "✅ Created .env.local from template"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📝 Enter Your Supabase Credentials"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Prompt for Supabase URL
read -p "Enter your Supabase Project URL (e.g., https://xyz.supabase.co): " SUPABASE_URL
if [ -z "$SUPABASE_URL" ]; then
  echo "❌ Error: Supabase URL cannot be empty"
  exit 1
fi

# Prompt for Supabase Anon Key
read -p "Enter your Supabase anon/public key: " SUPABASE_ANON_KEY
if [ -z "$SUPABASE_ANON_KEY" ]; then
  echo "❌ Error: Supabase anon key cannot be empty"
  exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚙️  Configuring Environment Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Update root .env.local
sed -i.bak "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL|" .env.local
sed -i.bak "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY|" .env.local
rm .env.local.bak
echo "✅ Updated root .env.local"

# Configure all learning modules
MODULE_COUNT=0
for dir in learn-*/; do
  if [ -d "$dir" ]; then
    # Copy .env.local.example if it exists, or create from root
    if [ -f "$dir/.env.local.example" ]; then
      cp "$dir/.env.local.example" "$dir/.env.local"
    else
      cp .env.local "$dir/.env.local"
    fi
    
    # Update with Supabase credentials
    sed -i.bak "s|NEXT_PUBLIC_SUPABASE_URL=.*|NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL|" "$dir/.env.local"
    sed -i.bak "s|NEXT_PUBLIC_SUPABASE_ANON_KEY=.*|NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY|" "$dir/.env.local"
    rm "$dir/.env.local.bak"
    
    echo "✅ Updated $dir.env.local"
    MODULE_COUNT=$((MODULE_COUNT + 1))
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Setup Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Configured environment for:"
echo "  • 1 main app"
echo "  • $MODULE_COUNT learning modules"
echo ""
echo "All apps are now configured with the same Supabase credentials."
echo ""
echo "Next steps:"
echo "  1. Install dependencies:"
echo "     npm install"
echo ""
echo "  2. Start the development server:"
echo "     npm run dev"
echo ""
echo "  3. Visit http://localhost:3000"
echo ""
echo "For more information, see:"
echo "  • ENV_SETUP_GUIDE.md - Detailed environment setup"
echo "  • QUICK_START.md - Quick start guide"
echo "  • QUICK_START_MODULES.md - Module-specific setup"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
