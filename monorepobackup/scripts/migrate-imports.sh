#!/bin/bash

# Script to migrate shared component imports to @iiskills/ui
# Usage: ./scripts/migrate-imports.sh

set -e

echo "🔄 Starting import migration to @iiskills/ui..."
echo ""

# Define the component-to-category mapping
declare -A COMPONENT_CATEGORY
COMPONENT_CATEGORY[UniversalLogin]="authentication"
COMPONENT_CATEGORY[UniversalRegister]="authentication"
COMPONENT_CATEGORY[EnhancedUniversalRegister]="authentication"
COMPONENT_CATEGORY[AuthenticationChecker]="authentication"

COMPONENT_CATEGORY[SharedNavbar]="navigation"
COMPONENT_CATEGORY[SubdomainNavbar]="navigation"
COMPONENT_CATEGORY[AppSwitcher]="navigation"
COMPONENT_CATEGORY[SiteHeader]="navigation"
COMPONENT_CATEGORY[UniversalHeader]="navigation"
COMPONENT_CATEGORY[canonicalNavLinks]="navigation"

COMPONENT_CATEGORY[UniversalLandingPage]="landing"
COMPONENT_CATEGORY[PaidAppLandingPage]="landing"
COMPONENT_CATEGORY[SharedHero]="landing"
COMPONENT_CATEGORY[HeroManager]="landing"
COMPONENT_CATEGORY[SampleLessonShowcase]="landing"
COMPONENT_CATEGORY[imageManifest]="landing"

COMPONENT_CATEGORY[PremiumAccessPrompt]="payment"
COMPONENT_CATEGORY[AIDevBundlePitch]="payment"
COMPONENT_CATEGORY[TierSelection]="payment"

COMPONENT_CATEGORY[StandardizedLesson]="content"
COMPONENT_CATEGORY[CurriculumTable]="content"
COMPONENT_CATEGORY[LevelSelector]="content"
COMPONENT_CATEGORY[DiagnosticQuiz]="content"
COMPONENT_CATEGORY[GatekeeperQuiz]="content"
COMPONENT_CATEGORY[CalibrationGatekeeper]="content"

COMPONENT_CATEGORY[Header]="common"
COMPONENT_CATEGORY[Footer]="common"
COMPONENT_CATEGORY[Layout]="common"
COMPONENT_CATEGORY[GoogleTranslate]="common"
COMPONENT_CATEGORY[Shared404]="common"

COMPONENT_CATEGORY[NewsletterSignup]="newsletter"
COMPONENT_CATEGORY[NewsletterNavLink]="newsletter"

COMPONENT_CATEGORY[TranslationDisclaimer]="translation"
COMPONENT_CATEGORY[TranslationFeatureBanner]="translation"

COMPONENT_CATEGORY[AIAssistant]="ai"
COMPONENT_CATEGORY[AIContentFallback]="ai"

COMPONENT_CATEGORY[InstallApp]="pwa"

# Function to migrate imports in a file
migrate_file() {
  local file=$1
  local temp_file="${file}.tmp"
  
  # Skip if file doesn't exist or is in node_modules
  if [[ ! -f "$file" ]] || [[ "$file" == *"node_modules"* ]] || [[ "$file" == *".next"* ]]; then
    return
  fi
  
  # Check if file has shared component imports
  if ! grep -q "components/shared" "$file"; then
    return
  fi
  
  echo "  📝 Migrating: $file"
  
  # Create a backup
  cp "$file" "${file}.bak"
  
  # Process each component
  for component in "${!COMPONENT_CATEGORY[@]}"; do
    category="${COMPONENT_CATEGORY[$component]}"
    
    # Pattern 1: import Component from "../../../components/shared/Component"
    sed -i "s|import ${component} from ['\"].*components/shared/${component}['\"]|import { ${component} } from \"@iiskills/ui/${category}\"|g" "$file"
    
    # Pattern 2: import { Component } from "../../../components/shared/Component"
    sed -i "s|import { ${component} } from ['\"].*components/shared/${component}['\"]|import { ${component} } from \"@iiskills/ui/${category}\"|g" "$file"
    
    # Special case for default exports that should remain default
    if [[ "$component" == "canonicalNavLinks" ]]; then
      sed -i "s|import { ${component} }|import ${component}|g" "$file"
    fi
  done
  
  # Remove backup if file changed
  if ! diff -q "$file" "${file}.bak" > /dev/null 2>&1; then
    rm "${file}.bak"
  else
    # Restore backup if no changes were made
    mv "${file}.bak" "$file"
  fi
}

# Migrate all apps
for app_dir in apps/*/; do
  app_name=$(basename "$app_dir")
  echo "📦 Migrating $app_name..."
  
  # Find all JS/JSX files in the app
  find "$app_dir" -name "*.js" -o -name "*.jsx" | while read -r file; do
    migrate_file "$file"
  done
  
  echo "  ✅ $app_name complete"
  echo ""
done

echo "✨ Import migration complete!"
echo ""
echo "Next steps:"
echo "1. Test each app: cd apps/[app-name] && yarn build"
echo "2. Fix any import errors"
echo "3. Commit changes: git add . && git commit -m 'Migrate all apps to @iiskills/ui'"
