# Logo & Favicon Integration - Testing Checklist

## Manual Testing Instructions

### For Each App (13 Total):
1. **Start the development server**
   ```bash
   cd apps/[app-name]
   npm run dev
   ```

2. **Check Browser Tab**
   - [ ] Favicon displays in browser tab
   - [ ] Favicon shows iiskills logo with subject label
   - [ ] Page title shows "iiskills-[app-name] - [Description]"

3. **Check Navbar**
   - [ ] iiskills logo displays in navigation bar
   - [ ] Logo is clickable and links to home page
   - [ ] Logo loads without 404 errors

4. **Check Console**
   - [ ] No 404 errors for favicon.svg
   - [ ] No 404 errors for iiskills-logo.png
   - [ ] No console warnings about missing images

### Main Portal Testing
1. **Foundation Apps Section**
   - [ ] Each app tile shows "iiskills-[subject]" as main label
   - [ ] Subject name (Math, Physics, etc.) shown as subtitle
   - [ ] Icon displays correctly
   - [ ] FREE badge displays
   - [ ] Links work correctly

2. **Academy Apps Section**
   - [ ] Each app tile shows "iiskills-[subject]" as main label
   - [ ] Subject name (AI, Developer, etc.) shown as subtitle
   - [ ] Icon displays correctly
   - [ ] Tagline displays below
   - [ ] Links work correctly

## Automated Verification

### File Existence Checks
Run this to verify all files are in place:
```bash
# Check favicon.svg files
for app in learn-ai learn-apt learn-biology learn-chemistry learn-developer learn-finesse learn-geography learn-govt-jobs learn-management learn-math learn-physics learn-pr main; do
  if [ -f "apps/$app/public/favicon.svg" ]; then
    echo "✓ $app has favicon.svg"
  else
    echo "✗ $app missing favicon.svg"
  fi
done

# Check iiskills-logo.png files
for app in learn-ai learn-apt learn-biology learn-chemistry learn-developer learn-finesse learn-geography learn-govt-jobs learn-management learn-math learn-physics learn-pr main; do
  if [ -f "apps/$app/public/images/iiskills-logo.png" ]; then
    echo "✓ $app has iiskills-logo.png"
  else
    echo "✗ $app missing iiskills-logo.png"
  fi
done

# Check _document.js files
for app in learn-ai learn-apt learn-biology learn-chemistry learn-developer learn-finesse learn-geography learn-govt-jobs learn-management learn-math learn-physics learn-pr main; do
  if [ -f "apps/$app/pages/_document.js" ]; then
    echo "✓ $app has _document.js"
  else
    echo "✗ $app missing _document.js"
  fi
done
```

### Content Verification
Run this to verify favicon links in _document.js:
```bash
for app in learn-ai learn-apt learn-biology learn-chemistry learn-developer learn-finesse learn-geography learn-govt-jobs learn-management learn-math learn-physics learn-pr main; do
  if grep -q 'favicon.svg' "apps/$app/pages/_document.js"; then
    echo "✓ $app has favicon link"
  else
    echo "✗ $app missing favicon link"
  fi
done
```

### Title Verification
Run this to verify page titles:
```bash
for app in learn-ai learn-apt learn-biology learn-chemistry learn-developer learn-finesse learn-geography learn-govt-jobs learn-management learn-math learn-physics learn-pr; do
  if grep -q 'title="iiskills-' "apps/$app/pages/index.js"; then
    echo "✓ $app has branded title"
  else
    echo "✗ $app missing branded title"
  fi
done
```

## Expected Results

### Browser Tab Display
Each app should display in browser tabs as:
- **Main Portal**: iiskills logo (blue background)
- **Learn AI**: iiskills logo + "AI" label
- **Learn Aptitude**: iiskills logo + "AP" label
- **Learn Biology**: iiskills logo + "BI" label
- **Learn Chemistry**: iiskills logo + "CH" label
- **Learn Developer**: iiskills logo + "DE" label
- **Learn Finesse**: iiskills logo + "FI" label
- **Learn Geography**: iiskills logo + "GE" label
- **Learn Govt Jobs**: iiskills logo + "GJ" label
- **Learn Management**: iiskills logo + "MA" label
- **Learn Math**: iiskills logo + "MA" label
- **Learn Physics**: iiskills logo + "PH" label
- **Learn PR**: iiskills logo + "PR" label

### Page Titles
All apps should show titles in format:
```
iiskills-[app-name] - [Description]
```

Examples:
- `iiskills-biology - Master Biology Concepts`
- `iiskills-ai - Learn AI - Master Artificial Intelligence`
- `iiskills-math - Master Mathematics`

### Main Portal App Listings
Foundation Section should show:
```
iiskills-math
  Math
```

Academy Section should show:
```
iiskills-ai
  AI
```

## Deployment Checklist

Before deploying to production:
- [ ] All apps build successfully
- [ ] No console errors in development mode
- [ ] Favicon displays correctly in all major browsers (Chrome, Firefox, Safari, Edge)
- [ ] Page titles are SEO-friendly
- [ ] Logo files are optimized (PNG files < 200KB, SVG files < 5KB)
- [ ] All image paths are relative (no absolute URLs)
- [ ] Mobile favicon display tested
- [ ] PWA manifest includes correct icons (if applicable)

## Browser Compatibility

### Favicon Support
- ✅ SVG favicons: Chrome 80+, Firefox 41+, Safari 9+, Edge 79+
- ✅ PNG fallback: All browsers
- ✅ Responsive: Works on desktop and mobile

### Testing Browsers
Test in these minimum browser versions:
- [ ] Chrome 80+
- [ ] Firefox 41+
- [ ] Safari 9+
- [ ] Edge 79+
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Troubleshooting

### Favicon Not Showing
1. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Check browser console for 404 errors
4. Verify file exists in `public/favicon.svg`
5. Check _document.js has correct link tag

### Logo Not Loading in Navbar
1. Check file exists in `public/images/iiskills-logo.png`
2. Verify path in navbar component
3. Check file permissions
4. Look for console errors

### Wrong Title in Browser Tab
1. Check `pages/index.js` title prop
2. Verify Next.js Head component is imported
3. Hard refresh browser
4. Check for title override in _app.js

## Success Metrics
✅ All 13 apps have consistent favicon branding
✅ All app titles use "iiskills-[app-name]" format
✅ Main portal displays branded app names
✅ No 404 errors for favicon or logo files
✅ Visual consistency across the entire platform
