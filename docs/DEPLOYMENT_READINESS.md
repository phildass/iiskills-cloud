# Deployment Readiness Report

## Final PM2 Process Expectations

| PM2 Name              | App directory      | Port |
|-----------------------|--------------------|------|
| iiskills-main         | apps/main          | 3000 |
| iiskills-learn-apt    | apps/learn-apt     | 3002 |
| iiskills-learn-chemistry | apps/learn-chemistry | 3005 |
| iiskills-learn-developer | apps/learn-developer | 3007 |
| iiskills-learn-geography | apps/learn-geography | 3011 |
| iiskills-learn-management | apps/learn-management | 3016 |
| iiskills-learn-math   | apps/learn-math    | 3017 |
| iiskills-learn-physics | apps/learn-physics | 3020 |
| iiskills-learn-pr     | apps/learn-pr      | 3021 |
| iiskills-learn-ai     | apps/learn-ai      | 3024 |

**NOT deployed (by design):**
- `iiskills-web` — apps/web is a placeholder skeleton, never deployed
- `iiskills-admin` — admin is served at `/admin` route inside `iiskills-main` (apps/main)

## VPS Deployment Commands

```bash
# Full deployment (run from /root or wherever deploy-all.sh lives)
./deploy-all.sh

# Verify PM2 process list (expect iiskills-main + iiskills-learn-* only)
pm2 ls

# Verify all expected ports are listening
ss -ltnp | egrep ':3000|:3002|:3005|:3007|:3011|:3016|:3017|:3020|:3021|:3024'

# Verify main app responds
curl -fsS http://localhost:3000
```

## Browser Tests

| URL | Expected result |
|-----|-----------------|
| https://iiskills.cloud/ | Main landing page, Google Translate dropdown visible in header |
| https://iiskills.cloud/admin | Admin panel (served by iiskills-main, no separate process needed) |
| https://app1.learn-ai.iiskills.cloud/ | Learn AI app (port 3024) |

## Google Translate

Google Translate is rendered by `packages/ui/src/common/Header.js` via the `<GoogleTranslate />` component,
which is mounted in both the desktop nav and the mobile menu.
The CSP in `config/security-headers.js` already permits the required origins:

- `script-src`: `www.google.com`, `www.gstatic.com`, `translate.google.com`
- `connect-src`: `translate.googleapis.com`
- `frame-src`: `www.google.com`, `translate.google.com`, `translate.googleapis.com`

No additional changes required. To verify:
1. Open https://iiskills.cloud/ in a browser.
2. The language selector dropdown should appear in the top-right nav.
3. Select any Indian language (e.g. Hindi) and confirm page text changes.
