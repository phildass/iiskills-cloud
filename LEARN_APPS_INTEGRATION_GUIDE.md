# Integration Guide for Learn-\* Apps

This guide explains how to add the Newsletter and AI Assistant features to any learn-\* app that hasn't been updated yet.

## Apps Already Updated

✅ learn-ai
✅ learn-math

## Steps to Update Remaining Apps

For each learn-\* app (learn-apt, learn-chemistry, learn-data-science, etc.), follow these steps:

### 1. Update `pages/_app.js`

Add the following imports at the top of the file (after existing imports):

```javascript
import AIAssistant from "../components/shared/AIAssistant";
import NewsletterSignup from "../components/shared/NewsletterSignup";
import { useNewsletterPopup } from "../utils/useNewsletterPopup";
```

Add the newsletter popup hook inside the component (after `const router = useRouter()`):

```javascript
const { showPopup, closePopup } = useNewsletterPopup(7); // Show every 7 days
```

Add the Newsletter link to the `customLinks` array (after the Certification link):

```javascript
{ href: '/newsletter', label: '📧 Newsletter', className: 'hover:text-primary transition' },
```

Add the AI Assistant and Newsletter popup components before the closing tag (usually `</>` or `</ErrorBoundary>`):

```javascript
{
  /* AI Assistant - always visible */
}
<AIAssistant />;

{
  /* Newsletter Popup - shows based on timing */
}
{
  showPopup && (
    <NewsletterSignup
      mode="modal"
      onClose={() => closePopup(false)}
      onSuccess={() => closePopup(true)}
    />
  );
}
```

### 2. Verify Files Exist

Make sure these files exist in the learn-\* app directory:

- `components/shared/AIAssistant.js` ✓ (already copied)
- `components/shared/NewsletterSignup.js` ✓ (already copied)
- `utils/useNewsletterPopup.js` ✓ (already copied)
- `pages/newsletter.js` ✓ (already copied)
- `pages/api/newsletter/subscribe.js` ✓ (already copied)

All files have been pre-copied to all learn-\* directories.

### 3. Test the Integration

After updating, test the following:

1. **AI Assistant**
   - Look for the floating chat button in the bottom-right corner
   - Click it to open the chat window
   - Send a test message
   - Verify it shows site-aware context (e.g., "artificial intelligence" for learn-ai)

2. **Newsletter Popup**
   - Visit the app for the first time (or clear localStorage)
   - Wait 3 seconds - popup should appear
   - Close the popup
   - Reload the page - popup should NOT appear (stored in localStorage)
   - Clear localStorage and wait 7 days (or modify the code to test) - popup appears again

3. **Newsletter Page**
   - Click the "📧 Newsletter" link in navigation
   - Verify the newsletter page loads at `/newsletter`
   - Test the subscription form (requires reCAPTCHA keys in .env.local)

4. **API Route**
   - Test newsletter submission
   - Check browser console for any errors
   - Verify Supabase database receives the email (if configured)

## Example: Complete \_app.js Structure

Here's the complete structure your \_app.js should follow:

```javascript
import "../styles/globals.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import SharedNavbar from "../../components/shared/SharedNavbar";
import SubdomainNavbar from "../../components/shared/SubdomainNavbar";
import AuthenticationChecker from "../../components/shared/AuthenticationChecker";
import Footer from "../components/Footer";
import AIAssistant from "../components/shared/AIAssistant";
import NewsletterSignup from "../components/shared/NewsletterSignup";
import { supabase, getCurrentUser, signOutUser } from "../lib/supabaseClient";
import { useNewsletterPopup } from "../utils/useNewsletterPopup";

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const { showPopup, closePopup } = useNewsletterPopup(7);

  // ... existing useEffect and handleLogout functions ...

  return (
    <>
      <AuthenticationChecker />
      <SharedNavbar
        user={user}
        onLogout={handleLogout}
        appName="Learn [YourApp]"
        homeUrl="/"
        showAuthButtons={true}
        customLinks={[
          {
            href: "https://iiskills.cloud",
            label: "Home",
            className: "hover:text-primary transition",
          },
          {
            href: "https://iiskills.cloud/courses",
            label: "Courses",
            className: "hover:text-primary transition",
          },
          {
            href: "https://iiskills.cloud/certification",
            label: "Certification",
            className: "hover:text-primary transition",
          },
          {
            href: "/newsletter",
            label: "📧 Newsletter",
            className: "hover:text-primary transition",
          },
          {
            href: "https://www.aienter.in/payments",
            label: "Payments",
            className:
              "bg-accent text-white px-4 py-2 rounded hover:bg-purple-600 transition font-bold",
            target: "_blank",
            rel: "noopener noreferrer",
          },
          {
            href: "https://iiskills.cloud/about",
            label: "About",
            className: "hover:text-primary transition",
          },
          {
            href: "https://iiskills.cloud/terms",
            label: "Terms & Conditions",
            className: "hover:text-primary transition",
          },
        ]}
      />
      <SubdomainNavbar subdomainName="Learn [YourApp]" sections={subdomainSections} />
      <Component {...pageProps} />
      <Footer />

      {/* AI Assistant - always visible */}
      <AIAssistant />

      {/* Newsletter Popup - shows based on timing */}
      {showPopup && (
        <NewsletterSignup
          mode="modal"
          onClose={() => closePopup(false)}
          onSuccess={() => closePopup(true)}
        />
      )}
    </>
  );
}
```

## Troubleshooting

### AI Assistant not appearing

- Check browser console for errors
- Verify AIAssistant.js exists in components/shared/
- Check for z-index conflicts

### Newsletter popup not showing

- Clear localStorage: `localStorage.removeItem('iiskills_newsletter_popup')`
- Check browser console for errors
- Verify useNewsletterPopup.js exists in utils/

### Newsletter submission failing

- Verify reCAPTCHA keys are set in .env.local
- Check Supabase credentials
- Run the SQL migration to create newsletter_subscribers table
- Check browser console and network tab for errors

## Bulk Update Script

If you prefer to update all apps at once, you can use a find-replace approach or manual updates. Since each app may have slight variations in structure, manual updates are recommended for precision.

## Verification Checklist

After updating an app, verify:

- [ ] AI Assistant floating button visible
- [ ] Newsletter link in navigation
- [ ] Newsletter popup appears (on first visit after 3 seconds)
- [ ] Newsletter popup respects timing (doesn't show again immediately)
- [ ] Newsletter page loads at /newsletter
- [ ] Newsletter form submits successfully
- [ ] No console errors
- [ ] Site-aware AI responses work

## Support

For questions or issues:

- Review NEWSLETTER_AI_ASSISTANT_README.md
- Check the reference implementations in learn-ai and learn-math
- Contact: info@iiskills.cloud
