# PWA Install App Button Implementation

## Overview

All landing pages across the iiskills.cloud platform now include an "Install App" button that enables Progressive Web App (PWA) installation. Users can install any subdomain/application to their device home screen for a native app-like experience.

## Implementation Summary

### Components Added

1. **InstallApp Component (JavaScript)**
   - Location: `/components/shared/InstallApp.js`
   - Used by: Main app and all Pages Router learning modules
   - Features:
     - Listens for browser's `beforeinstallprompt` event
     - Shows install button only when PWA is installable
     - Automatically hides after installation
     - Handles user acceptance/dismissal of install prompt

2. **InstallApp Component (TypeScript)**
   - Location: `/learn-apt/src/lib/InstallApp.tsx`
   - Used by: learn-apt (App Router with TypeScript)
   - Same features as JavaScript version with TypeScript types

### PWA Manifest Files

Created `manifest.json` for all 16 applications:

- Main app: `/public/manifest.json`
- 15 learning modules: `/learn-*/public/manifest.json`

Each manifest includes:

- App name and short name
- Description
- Start URL
- Display mode (standalone)
- Theme color (#2563eb - blue)
- Icons (192x192 and 512x512 SVG)
- Orientation (portrait-primary)
- Categories (education, learning, skills)

### PWA Meta Tags

Created `_document.js` files for all Pages Router apps to include:

- Manifest link reference
- Theme color meta tag
- Mobile web app capabilities
- Apple mobile web app tags
- Apple touch icon references

### App Icons

Created SVG placeholder icons for all apps:

- 192x192 pixel icon
- 512x512 pixel icon
- Blue background with "iiskills" text
- Stored in `/public/images/` and `/learn-*/public/images/`

## Applications Updated

### Main Application

- ✅ iiskills.cloud (Pages Router)

### Learning Modules

1. ✅ learn-apt (App Router - TypeScript)
2. ✅ learn-jee (Pages Router)
3. ✅ learn-neet (Pages Router)
4. ✅ learn-math (Pages Router)
5. ✅ learn-ai (Pages Router)
6. ✅ learn-chemistry (Pages Router)
7. ✅ learn-physics (Pages Router)
8. ✅ learn-data-science (Pages Router)
9. ✅ learn-management (Pages Router)
10. ✅ learn-leadership (Pages Router)
11. ✅ learn-winning (Pages Router)
12. ✅ learn-pr (Pages Router)
13. ✅ learn-geography (Pages Router)
14. ✅ learn-ias (Pages Router)
15. ✅ learn-govt-jobs (Pages Router)

## How It Works

### User Experience

1. **Visit Landing Page**: User visits any iiskills.cloud landing page on a PWA-capable browser (Chrome, Edge, Safari, etc.)

2. **Install Button Appears**: If the app is installable and not already installed, the green "Install App" button appears alongside other CTA buttons

3. **Click to Install**: User clicks the "Install App" button

4. **Browser Prompt**: Browser shows native installation prompt asking for confirmation

5. **Installation**: Upon acceptance, the app is installed to the device

6. **Launch**: User can launch the app from:
   - Device home screen
   - App drawer (Android)
   - Start menu (Windows)
   - Applications folder (macOS)
   - Dock (macOS)

### Technical Flow

```javascript
// 1. Browser detects installability
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  setDeferredPrompt(e);
  setShowButton(true);
});

// 2. User clicks Install App button
const handleInstallClick = async () => {
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  // Handle outcome
};

// 3. Installation complete
window.addEventListener("appinstalled", () => {
  setIsInstalled(true);
  setShowButton(false);
});
```

## Browser Support

The Install App button works on:

- ✅ Chrome (Desktop & Mobile)
- ✅ Edge (Desktop & Mobile)
- ✅ Samsung Internet
- ✅ Opera
- ⚠️ Safari (iOS/macOS - limited support, shows different UI)
- ❌ Firefox (does not support `beforeinstallprompt`)

## Button Styling

The Install App button features:

- Green background (`bg-green-600`)
- White text
- Download icon (arrow down to tray)
- Hover effect (`hover:bg-green-700`)
- Shadow for depth
- Responsive sizing
- Flexbox layout with icon and text

## Customization

### Changing App Name

Each app has a custom name displayed in the install prompt:

```jsx
<InstallApp appName="Learn JEE" />
<InstallApp appName="Learn NEET" />
<InstallApp appName="iiskills.cloud" />
```

### Updating Icons

Replace the SVG placeholders with custom PNG/SVG icons:

1. Create icons at 192x192 and 512x512 resolutions
2. Place in `/public/images/` (or `/learn-*/public/images/`)
3. Name them `icon-192x192.png` and `icon-512x512.png`
4. Update manifest.json to reference .png instead of .svg

```json
{
  "icons": [
    {
      "src": "/images/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/images/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Customizing Theme Color

Update the theme color in:

1. `manifest.json`: `"theme_color": "#2563eb"`
2. `pages/_document.js`: `<meta name="theme-color" content="#2563eb" />`

## Testing

### Local Testing

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open in Chrome/Edge

3. Open DevTools → Application → Manifest
   - Verify manifest loads correctly
   - Check for any errors

4. Open DevTools → Application → Service Workers
   - Check installability status

5. Test the install flow:
   - Click "Install App" button
   - Accept the prompt
   - Verify app appears on home screen

### Production Testing

PWA installation works best in production (HTTPS required):

1. Deploy to production server
2. Access via HTTPS
3. Test installation on various devices:
   - Desktop (Windows, macOS, Linux)
   - Mobile (Android, iOS)
   - Different browsers

## Troubleshooting

### Install Button Not Showing

**Possible causes:**

1. Browser doesn't support PWA installation
2. App already installed
3. Not served over HTTPS
4. Manifest has errors
5. Missing service worker (optional but recommended)

**Solutions:**

- Test in Chrome/Edge
- Clear browser data and reinstall
- Ensure HTTPS in production
- Validate manifest in DevTools
- Consider adding a service worker for offline support

### Manifest Not Loading

**Check:**

1. File exists at `/public/manifest.json`
2. `_document.js` includes `<link rel="manifest" href="/manifest.json" />`
3. No JSON syntax errors in manifest
4. Correct MIME type served (application/manifest+json)

### Icons Not Displaying

**Check:**

1. Icon files exist at specified paths
2. File names match manifest references
3. Icon sizes are correct (192x192, 512x512)
4. Image format is supported (PNG, SVG)

## Future Enhancements

### Service Worker

Add service worker for:

- Offline functionality
- Background sync
- Push notifications
- Caching strategies

### Enhanced Icons

Create custom branded icons for each module:

- Module-specific colors
- Module-specific logos
- Maskable icons support
- Different sizes (96, 144, 192, 384, 512)

### Installation Analytics

Track installation events:

```javascript
window.addEventListener("appinstalled", () => {
  // Send analytics event
  gtag("event", "app_installed", {
    app_name: "Learn JEE",
  });
});
```

### Prompt Timing

Optimize when to show install prompt:

- After user engagement (scroll, time on site)
- After completing an action
- Custom trigger instead of automatic display

## Security Considerations

1. **HTTPS Required**: PWA installation requires HTTPS in production
2. **Content Security Policy**: Ensure CSP allows manifest loading
3. **Icon Sources**: Use trusted sources for icon files
4. **Manifest Validation**: Regularly validate manifest against PWA standards

## Compliance with Standards

This implementation follows:

- ✅ [W3C Web App Manifest](https://www.w3.org/TR/appmanifest/)
- ✅ [PWA Best Practices](https://web.dev/progressive-web-apps/)
- ✅ [Chrome Install Criteria](https://web.dev/install-criteria/)
- ✅ Accessibility standards (ARIA labels, semantic HTML)

## Documentation Files

Related documentation:

- `ONBOARDING.md` - User onboarding guide
- `AUTHENTICATION_ARCHITECTURE.md` - Auth system overview
- `README.md` - Project overview
- `DEPLOYMENT.md` - Deployment instructions

## Support

For issues or questions:

- **Email**: info@iiskills.cloud
- **GitHub Issues**: Submit bug reports or feature requests

---

**Last Updated**: January 2026  
**Author**: iiskills.cloud Development Team  
**Version**: 1.0.0
