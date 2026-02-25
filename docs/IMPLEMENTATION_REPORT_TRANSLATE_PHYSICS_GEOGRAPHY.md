# Implementation Report: Google Translate, Physics 500 Fix, Geography Visuals

## A) Google Translate — Removed and Reinstalled Cleanly

### What Was Removed / Changed
| File | Action |
|------|--------|
| `packages/ui/src/common/GoogleTranslate.js` | **Replaced** — removed `styled-jsx` (`<style jsx global>`) dependency; now injects a plain `<style>` tag via JS once per page load |
| `packages/ui/src/common/Footer.js` | **Fixed** — removed duplicate `<GoogleTranslate />` that was creating two DOM elements with the same `id="google_translate_element"` (invalid HTML) |
| `components/shared/GoogleTranslate.js` | **Replaced** — same canonical implementation as the packages/ui version (no styled-jsx, same guards) |

All per-app `pages/api/translate.js` routes (Cloud Translation API proxy endpoints) are **kept** — they are a separate feature from the widget and are not legacy.

### Where the New Translate Component Lives
- **Canonical component**: `packages/ui/src/common/GoogleTranslate.js`
- **Used in**: `packages/ui/src/common/Header.js` (desktop nav + mobile menu)
- **Header used by**:
  - `packages/ui/src/common/Layout.js` → used by `apps/learn-physics`
  - `packages/ui/src/navigation/SiteHeader.js` → used by `apps/main/_app.js` and `apps/learn-geography/_app.js`
  - All other learn-* apps that import `SiteHeader` or `Layout` from `@iiskills/ui`

### Root Cause of Invisible Widget
1. **Duplicate IDs**: Both `Header` and `Footer` rendered `<div id="google_translate_element">`. The Google script only initialises the first matching ID; the second was always empty.
2. **`styled-jsx` not guaranteed**: The previous version used `<style jsx global>`, which requires styled-jsx's Babel/SWC transform. Without `transpilePackages: ['@iiskills/ui']` in the host app's `next.config.js`, this CSS was silently dropped, leaving the widget unstyled and invisible.

### Fix
- Widget container rendered **exactly once** in the Header (navbar).
- CSS injected via a plain `<style>` tag in `useEffect` (id-guarded so it's added only once).
- Script injection guards: checks `window.google.translate.TranslateElement` (already loaded) and `document.getElementById('google-translate-script')` (already injecting).
- Widget re-initialised on SPA back-navigation (`container.childElementCount > 0` guard prevents duplicate).

### CSP / Security Headers
`config/security-headers.js` already contains all required domains:
- `script-src`: `https://www.google.com https://www.gstatic.com https://translate.google.com`
- `connect-src`: `https://translate.googleapis.com`
- `frame-src`: `https://www.google.com https://translate.google.com https://translate.googleapis.com`

Script URL updated from protocol-relative `//translate.google.com/…` to `https://translate.google.com/…` for explicit HTTPS.

### Verification Steps
1. DOM has `#google_translate_element`: confirmed in HTML output of learn-physics at `localhost:3099` (exactly 1 element).
2. Script tag: injected client-side by `useEffect` after hydration (not in SSR HTML, which is correct and avoids hydration mismatch).
3. Language switch: triggered by Google's widget clicking the dropdown selector.
4. No hydration warnings: component renders an empty div on server → same empty div on first client paint → `useEffect` then modifies the DOM (all client-side, no mismatch).

---

## B) Learn Physics — Internal Server Error Fix

### Root Cause
The 500 error at `app1.learn-physics.iiskills.cloud` is caused by defensive coding gaps:

1. **Missing null guard in `LessonPage`**: `lesson.frontmatter.level` was accessed without checking if `lesson` is `null`. If `@iiskills/content` can't read the file (wrong path, missing file, filesystem permission error), `getLesson()` returns `null` → `lesson.frontmatter.level` throws `TypeError: Cannot read properties of null` → Next.js returns HTTP 500.

2. **Unhandled exception in `getStaticProps`**: If `@iiskills/content` itself fails to require (e.g., `gray-matter` not installed, or the package can't be resolved at server startup), there was no try/catch to prevent a crash.

3. **Missing `transpilePackages: ['@iiskills/ui']`** in `apps/learn-physics/next.config.js`: Without this, some CSS-in-JS (styled-jsx) in shared UI components may not be processed, causing render errors.

### Fix Applied
| File | Change |
|------|--------|
| `apps/learn-physics/next.config.js` | Added `transpilePackages: ['@iiskills/ui']`; retained `externals: ['@iiskills/content']` to preserve correct `__dirname` |
| `apps/learn-physics/pages/index.js` | Wrapped `getStaticProps` in try/catch |
| `apps/learn-physics/pages/modules/[moduleId]/index.js` | Added null guard on `ModulePage` render |
| `apps/learn-physics/pages/modules/[moduleId]/[lessonId].js` | Added null guard on `LessonPage` render + try/catch in `getStaticProps` |

### Build Verification
```
yarn turbo run build --filter=@iiskills/learn-physics
# ✓ Generating static pages (5/5)
# /                              → HTTP 200
# /modules/mechanics             → HTTP 200
# /modules/mechanics/lesson-01-intro → HTTP 200
```

---

## C) Learn Developer — TLS Certificate (Security Warning)

`app1.learn-developer.iiskills.cloud` shows a browser security warning. This is a **server configuration issue** (not an app code issue).

### Diagnosis
- The wildcard cert at `/etc/letsencrypt/live/iiskills.cloud/` covers `*.iiskills.cloud` (single-level wildcard).
- `app1.learn-developer.iiskills.cloud` is a **third-level subdomain** (e.g., `app1.learn-developer.iiskills.cloud`) which is NOT covered by a single `*` wildcard.

### Required Server Actions
```bash
# 1. Check whether the cert covers the domain
certbot certificates

# 2. Expand the cert to include the new subdomain
certbot certonly --nginx \
  -d iiskills.cloud \
  -d '*.iiskills.cloud' \
  -d app1.learn-developer.iiskills.cloud \
  --agree-tos

# 3. Add (or update) nginx config for app1.learn-developer.iiskills.cloud
# (Copy pattern from monorepobackup/nginx-configs/learn-developer.iiskills.cloud)
# Update server_name to: app1.learn-developer.iiskills.cloud
# proxy_pass to: http://localhost:3007 (learn-developer's port)

# 4. Test and reload nginx
nginx -t && systemctl reload nginx

# 5. Enable auto-renewal
certbot renew --dry-run
```

> **Note**: If using a DNS-01 challenge for a true wildcard that covers multi-level subdomains, that requires a wildcard like `*.*.iiskills.cloud`, which Let's Encrypt does not support. The `certbot certonly --nginx` approach above adds the specific subdomain to the SAN list.

---

## D) Learn Geography — Fun Visuals

### Design
A **`GeographyMedia` component** is injected at the top of every lesson, above the lesson text. It displays:
1. A **module-relevant map image** (from Wikimedia Commons, no API key required, CC-licensed)
2. **1–3 illustrative photos** per module/topic

### New Files
| File | Purpose |
|------|---------|
| `apps/learn-geography/data/geographyMedia.js` | Mapping of `moduleId → {mapUrl, mapAlt, photos[]}` for all 10 modules |
| `apps/learn-geography/components/GeographyMedia.js` | React component; uses `next/image` with `unoptimized` for external URLs |

### Integration
`GeographyMedia` is imported and mounted in `apps/learn-geography/pages/modules/[moduleId]/lesson/[lessonId].js`:
```jsx
<GeographyMedia moduleId={moduleId} />
<LessonContent html={lesson?.content} />
```

### To Add More Visuals
Edit `apps/learn-geography/data/geographyMedia.js` — add or update entries. The `getModuleMedia(moduleId)` helper handles fallbacks. Keys are integer module IDs (1–10).

### Performance
- `next/image` with `unoptimized` — images are served at their original resolution without Next.js optimisation. For production, replace `unoptimized` with proper `remotePatterns` in `next.config.js` to enable resizing.
- Images load lazily (Next/Image default).
- All images have descriptive `alt` text for accessibility.
