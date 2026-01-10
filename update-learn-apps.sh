#!/bin/bash

# Script to update all learn-* apps with Newsletter and AI Assistant integration

LEARN_DIRS="learn-apt learn-chemistry learn-data-science learn-geography learn-govt-jobs learn-ias learn-jee learn-leadership learn-management learn-math learn-neet learn-physics learn-pr learn-winning"

for dir in $LEARN_DIRS; do
  echo "Updating $dir..."
  
  # Check if _app.js exists
  if [ -f "$dir/pages/_app.js" ]; then
    # Create backup
    cp "$dir/pages/_app.js" "$dir/pages/_app.js.bak"
    
    # Add imports if not already present
    if ! grep -q "AIAssistant" "$dir/pages/_app.js"; then
      # Add the imports after the existing imports
      sed -i '/import.*Footer.*from.*components\/Footer/a\
import AIAssistant from '\''../components/shared/AIAssistant'\''\
import NewsletterSignup from '\''../components/shared/NewsletterSignup'\''\
import { useNewsletterPopup } from '\''../utils/useNewsletterPopup'\''
' "$dir/pages/_app.js"
      
      # Add the hook in the component
      sed -i '/const router = useRouter()/a\  const { showPopup, closePopup } = useNewsletterPopup(7) // Show every 7 days' "$dir/pages/_app.js"
      
      # Add Newsletter link to customLinks array (after Certification)
      sed -i "s|{ href: 'https://iiskills.cloud/certification', label: 'Certification', className: 'hover:text-primary transition' },|{ href: 'https://iiskills.cloud/certification', label: 'Certification', className: 'hover:text-primary transition' },\n          { href: '/newsletter', label: '📧 Newsletter', className: 'hover:text-primary transition' },|" "$dir/pages/_app.js"
      
      # Add AI Assistant and Newsletter popup before the closing ErrorBoundary tag
      sed -i 's|</ErrorBoundary>|      \n      {/* AI Assistant - always visible */}\n      <AIAssistant />\n      \n      {/* Newsletter Popup - shows based on timing */}\n      {showPopup \&\& (\n        <NewsletterSignup \n          mode="modal"\n          onClose={() => closePopup(false)}\n          onSuccess={() => closePopup(true)}\n        />\n      )}\n    </ErrorBoundary>|' "$dir/pages/_app.js"
      
      echo "✓ Updated $dir"
    else
      echo "✓ $dir already updated"
    fi
  else
    echo "✗ $dir/_app.js not found"
  fi
done

echo "Done!"
