# Production Readiness + Auth/Paywall Report

## Overview

This report covers the production deployment, Supabase authentication setup, paywall/entitlement system, and Google Translate configuration for `iiskills.cloud`.

---

## 1. Required Environment Variables (PM2/VPS)

Each app needs a `.env.local` file (or PM2 `env` block) with these variables.

### All Apps (learn-* and apps/main)

| Variable | Description | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL (e.g. `https://xxx.supabase.co`) | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key | Yes |

### apps/main only (server-side)

| Variable | Description | Required |
|---|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (for admin operations) | Yes (for admin/entitlement APIs) |
| `NEXT_PUBLIC_SUPABASE_URL` | Same as above | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same as above | Yes |

### Optional

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_DISABLE_AUTH` | Set to `true` to disable auth (CI/dev builds without credentials) |
| `NEXT_PUBLIC_DISABLE_GOOGLE_TRANSLATE` | Set to `true` to hide the translate widget |
| `PORT` | Override port (set automatically by deploy-all.sh) |

### PM2 Ecosystem Config Example

```json
{
  "name": "iiskills-main",
  "script": "npx",
  "args": "next start -p 3000",
  "cwd": "/root/iiskills-cloud-apps/apps/main",
  "env": {
    "PORT": "3000",
    "NODE_ENV": "production",
    "NEXT_PUBLIC_SUPABASE_URL": "https://xxx.supabase.co",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "eyJ...",
    "SUPABASE_SERVICE_ROLE_KEY": "eyJ..."
  }
}
```

---

## 2. Supabase SQL — Entitlements Table + RLS

Run this migration in your Supabase SQL editor or via `supabase db push`:

**File:** `supabase/migrations/entitlements_table.sql`

Key points:
- Table: `public.entitlements`
- Columns: `id`, `user_id`, `app_id`, `course_id`, `status`, `purchased_at`, `expires_at`, `source`, `payment_reference`, `granted_by`
- RLS: Users can SELECT their own rows; Admins (via `profiles.is_admin`) can manage all rows
- Default validity: 1 year from `purchased_at`

**Bundle support:** Use `app_id = 'ai-developer-bundle'` to grant access to both `learn-ai` AND `learn-developer` simultaneously.

---

## 3. How to Test

### 3.1 Login Flow

1. Navigate to `https://iiskills.cloud/login`
2. Enter email + password for a registered user
3. On success → redirected to `/dashboard`
4. Login/logout buttons appear in all app navbars (shared `Header` component)

### 3.2 Paywall Flow

1. Navigate to `https://learn-ai.iiskills.cloud/modules/1/lesson/1`
2. Read the lesson content
3. Complete the quiz (answer 3+ questions correctly)
4. The **Enrollment Landing Page** appears:
   - Shows AI-Dev bundle "Buy One Get One Free" banner (vivid yellow/amber, until 31 Mar 2026)
   - Shows fee structure from centralized `utils/pricing.js` (₹299 + GST = ₹352.82)
   - Shows "Payment to AI Cloud Enterprises through Razorpay"
   - CTA button: "Enrol Now — Pay Securely" → opens `https://aienter.in/payments/iiskills`

5. For modules 2+ (e.g., `/modules/2/lesson/1`):
   - If not entitled → Enrollment Landing Page shown immediately
   - If entitled → lesson renders normally

### 3.3 Enrol Flow

1. User visits `https://aienter.in/payments/iiskills` and completes payment
2. User notes their **Razorpay Payment ID** (e.g., `pay_XXXXXXXXXX`)
3. User contacts admin (or submits via a form) with their email + payment ID
4. Admin logs into `https://iiskills.cloud/admin/entitlements`
5. Admin searches user by email
6. Admin selects app (`learn-ai` or `ai-developer-bundle` for both) and enters payment reference
7. Admin clicks **Grant 1-Year Access**
8. User's entitlement is active immediately

### 3.4 Entitlement Grant via API

Admin can also call the API directly:

```sql
INSERT INTO public.entitlements (user_id, app_id, status, source, payment_reference, expires_at)
VALUES (
  '<user_uuid>',
  'learn-ai',  -- or 'ai-developer-bundle' for both AI+Developer
  'active',
  'admin',
  'pay_XXXXXXXXXX',
  NOW() + INTERVAL '1 year'
);
```

---

## 4. Deployment Verification

### 4.1 Ports + PM2

After running `./deploy-all.sh`:

```bash
pm2 ls
# Should show:
# iiskills-main       online  ← port 3000
# iiskills-learn-apt  online  ← port 3002
# iiskills-learn-chemistry online ← port 3005
# ... etc
```

### 4.2 Curl Health Checks

```bash
curl -fsS http://localhost:3000/api/health     # main app
curl -fsS http://localhost:3002               # learn-apt
curl -fsS http://localhost:3005               # learn-chemistry
curl -fsS http://localhost:3007               # learn-developer
curl -fsS http://localhost:3011               # learn-geography
curl -fsS http://localhost:3016               # learn-management
curl -fsS http://localhost:3017               # learn-math
curl -fsS http://localhost:3020               # learn-physics
curl -fsS http://localhost:3021               # learn-pr
curl -fsS http://localhost:3024               # learn-ai
```

### 4.3 Admin Access

- `https://iiskills.cloud/admin` — Admin dashboard
- `https://iiskills.cloud/admin/entitlements` — Grant/revoke entitlements
- `https://iiskills.cloud/admin/access-control` — App access overview

---

## 5. Pricing

All prices are sourced from `utils/pricing.js` (centralized, single source of truth):

| Period | Base Price | GST (18%) | Total |
|---|---|---|---|
| Introductory (until 14 Feb 2026) | ₹99 | ₹17.82 | ₹116.82 |
| Regular (from 15 Feb 2026) | ₹299 | ₹53.82 | ₹352.82 |

**AI + Developer Bundle:** Buy one, get one free — valid until **31 March 2026**.

---

## 6. Google Translate

Google Translate widget is embedded in the shared `Footer` component (`packages/ui/src/common/Footer.js`). It appears in all apps automatically.

CSP headers allow:
- `script-src`: `https://www.google.com https://www.gstatic.com https://translate.google.com`
- `connect-src`: `https://translate.googleapis.com`
- `frame-src`: `https://www.google.com https://translate.google.com https://translate.googleapis.com`

To disable translate in a specific app, set `NEXT_PUBLIC_DISABLE_GOOGLE_TRANSLATE=true`.

---

## 7. Paid Apps Summary

| App | Paid | AI-Dev Bundle |
|---|---|---|
| learn-ai | ✅ | ✅ (paired with learn-developer) |
| learn-developer | ✅ | ✅ (paired with learn-ai) |
| learn-management | ✅ | ❌ |
| learn-pr | ✅ | ❌ |
| learn-apt | Free (registration required) | ❌ |
| learn-chemistry | Free (registration required) | ❌ |
| learn-geography | Free (registration required) | ❌ |
| learn-math | Free (registration required) | ❌ |
| learn-physics | Free (registration required) | ❌ |

---

## 8. Troubleshooting

### App not responding on port

```bash
pm2 logs iiskills-main --lines 50
pm2 restart iiskills-main
```

### Supabase auth not working

1. Verify env vars are set: `pm2 env iiskills-main`
2. Check Supabase dashboard → Authentication → Users
3. Ensure Site URL is set to `https://iiskills.cloud` in Supabase dashboard

### Entitlement check failing

1. Verify `entitlements_table.sql` migration has been run
2. Check `SUPABASE_SERVICE_ROLE_KEY` is set in apps/main env
3. Test: `curl -H "Authorization: Bearer <user_token>" https://iiskills.cloud/api/entitlement?appId=learn-ai`
