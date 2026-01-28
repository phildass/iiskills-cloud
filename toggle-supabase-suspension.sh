#!/bin/bash

# Script to toggle Supabase suspension across all apps
# Usage: ./toggle-supabase-suspension.sh [enable|disable]

set -e

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 [enable|disable]"
    echo ""
    echo "Examples:"
    echo "  $0 enable   # Enable suspension mode (disable Supabase)"
    echo "  $0 disable  # Disable suspension mode (restore Supabase)"
    exit 1
fi

ACTION=$1

if [ "$ACTION" != "enable" ] && [ "$ACTION" != "disable" ]; then
    echo "Error: Action must be 'enable' or 'disable'"
    exit 1
fi

# Determine the value to set
if [ "$ACTION" == "enable" ]; then
    VALUE="true"
    STATUS="ENABLED"
    MESSAGE="Supabase connections are now SUSPENDED"
else
    VALUE="false"
    STATUS="DISABLED"
    MESSAGE="Supabase connections are now RESTORED"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Supabase Suspension Toggle"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Action: $ACTION"
echo "Setting NEXT_PUBLIC_SUPABASE_SUSPENDED=$VALUE"
echo ""

# List of directories with .env.local files
DIRS=(
  "."
  "apps/main"
  "learn-ai"
  "learn-chemistry"
  "learn-cricket"
  "learn-data-science"
  "learn-geography"
  "learn-govt-jobs"
  "learn-ias"
  "learn-jee"
  "learn-leadership"
  "learn-management"
  "learn-math"
  "learn-neet"
  "learn-physics"
  "learn-pr"
  "learn-winning"
)

# Function to update or add env variable
update_env_file() {
    local file=$1
    local value=$2
    
    if [ ! -f "$file" ]; then
        echo "  Creating new .env.local file..."
        echo "NEXT_PUBLIC_SUPABASE_SUSPENDED=$value" > "$file"
        echo "  ✅ Created: $file"
        return
    fi
    
    if grep -q "^NEXT_PUBLIC_SUPABASE_SUSPENDED=" "$file"; then
        # Update existing line
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/^NEXT_PUBLIC_SUPABASE_SUSPENDED=.*/NEXT_PUBLIC_SUPABASE_SUSPENDED=$value/" "$file"
        else
            # Linux
            sed -i "s/^NEXT_PUBLIC_SUPABASE_SUSPENDED=.*/NEXT_PUBLIC_SUPABASE_SUSPENDED=$value/" "$file"
        fi
        echo "  ✅ Updated: $file"
    else
        # Add new line
        echo "" >> "$file"
        echo "# Supabase Suspension Mode" >> "$file"
        echo "NEXT_PUBLIC_SUPABASE_SUSPENDED=$value" >> "$file"
        echo "  ✅ Added to: $file"
    fi
}

echo "Updating .env.local files..."
echo ""

for dir in "${DIRS[@]}"; do
    ENV_FILE="$dir/.env.local"
    
    # Check if directory exists
    if [ ! -d "$dir" ]; then
        echo "  ⚠️  Directory not found: $dir"
        continue
    fi
    
    update_env_file "$ENV_FILE" "$VALUE"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ $STATUS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "$MESSAGE"
echo ""

if [ "$ACTION" == "enable" ]; then
    echo "What this means:"
    echo "  • All apps will run without Supabase database connections"
    echo "  • Authentication and user login will be disabled"
    echo "  • Content will be visible without requiring login"
    echo "  • No data will be read from or written to Supabase"
    echo ""
    echo "This is useful for:"
    echo "  • Reviewing and correcting content"
    echo "  • Testing UI without database dependencies"
    echo "  • Temporary maintenance periods"
    echo ""
    echo "⚠️  Remember to restart your apps for changes to take effect:"
    echo "    pm2 restart all"
    echo ""
    echo "To restore Supabase connections later, run:"
    echo "    ./toggle-supabase-suspension.sh disable"
else
    echo "What this means:"
    echo "  • All apps will connect to Supabase normally"
    echo "  • Authentication and login will work as expected"
    echo "  • User data will be read from and written to the database"
    echo ""
    echo "⚠️  Remember to restart your apps for changes to take effect:"
    echo "    pm2 restart all"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
