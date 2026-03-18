# Payment Integration: aienter.in → iiskills.cloud

This document describes the **SSO-based payment flow** between iiskills.cloud paid apps and the central payment portal at aienter.in.

---

## Overview

The full payment flow is:

```
User clicks "Pay Now" on <appname>.iiskills.cloud
      │
      ▼
User is redirected to https://iiskills.cloud/start-payment?course=<appId>
(Entry Gateway — ALWAYS the first stop for every payment attempt)
      │
      ▼
User is asked: "Are you a Registered User?"
  ┌── YES ────────────────────────────────────────────────────────────────────┐
  │   Session check (Supabase):                                               │
  │   • Active session → proceed to /payments/iiskills                        │
  │   • No session     → redirect to /sign-in?next=/payments/iiskills         │
  └───────────────────────────────────────────────────────────────────────────┘
  ┌── NO ─────────────────────────────────────────────────────────────────────┐
  │   Redirect to /register?next=/start-payment?course=<appId>               │
  │   After registration, user returns to /start-payment and chooses YES.    │
  └───────────────────────────────────────────────────────────────────────────┘
      │
      ▼
User is redirected to https://iiskills.cloud/payments/iiskills?course=<appId>
(already authenticated — Supabase session checked here)
      │
      ▼
iiskills.cloud POST /api/payments/create-purchase
Creates a purchases row (status='created') and returns a FRESH purchaseId
(a new purchaseId is created on every attempt — old links cannot be reused)
      │
      ▼
iiskills.cloud POST /api/payments/generate-token
Generates signed JWT with user identity, course slug, and returnTo URL
      │
      ▼
User is redirected to https://aienter.in/payments/iiskills?course=...&purchaseId=...&token=...&returnTo=...
(token verified by aienter — no login prompt shown)
      │
      ▼
User pays via Razorpay on aienter.in
      │
      ▼
aienter.in POSTs server-to-server to https://iiskills.cloud/api/payments/confirm
iiskills.cloud verifies HMAC signature + user_token, updates purchases row,
grants entitlement, marks profile as paid
      │
      ▼
User is redirected to https://<appname>.iiskills.cloud/authorised
(redirect_url returned in confirm response, or returnTo from token)
```

> **Key principle**: iiskills.cloud does **not** talk to Razorpay directly. It trusts the
> confirmation only after verifying a shared HMAC-SHA256 secret with aienter.in.

> **Entry gateway**: Every "Pay Now" button on any app **must** link to
> `/start-payment?course=<appId>`, never directly to `/payments/iiskills`.
> This ensures the "Registered / New user" choice is always enforced and a
> fresh `purchaseId` is generated for every attempt.

> **Deprecated**: `/api/payments/ai-enter/callback` now returns HTTP 410 Gone.
> All callbacks **must** use `/api/payments/confirm`.

---

## Required Environment Variables

Set these on **iiskills.cloud** (apps/main `.env.local` / server environment):

| Variable                              | Description                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `PAYMENT_TOKEN_SECRET`                | Long random string used to sign/verify payment JWT tokens. Generate with `openssl rand -hex 32`. |
| `AIENTER_CONFIRMATION_SIGNING_SECRET` | Shared HMAC secret between aienter.in and iiskills.cloud for server-to-server callback.          |
| `NEXT_PUBLIC_SUPABASE_URL`            | Supabase project URL                                                                             |
| `SUPABASE_SERVICE_ROLE_KEY`           | Supabase service role key (server-side only, never exposed to browser)                           |

Set these on **aienter.in**:

| Variable                              | Description                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| `AIENTER_CONFIRMATION_SIGNING_SECRET` | Same shared secret as iiskills; used to sign the x-aienter-signature header. |
| `IISKILLS_CONFIRM_URL`                | `https://iiskills.cloud/api/payments/confirm`                                |

---

## Entry Gateway: `/start-payment`

**Route**: `GET /start-payment?course=<appId>`

All "Pay Now" buttons (in `EnrollmentLandingPage`, `PremiumAccessPrompt`,
`TriLevelLandingPage`, and onboarding pages) link to this route.

The page always presents an explicit choice:

| Choice                         | Action                                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Yes, I'm a Registered User** | Checks Supabase session. If active → `/payments/iiskills`. If none → `/sign-in?next=/payments/iiskills`.                 |
| **No, I'm New Here**           | Redirects to `/register?next=/start-payment?course=<appId>`. After registration the user returns here and chooses "Yes". |

**Why this matters**: Razorpay / PhonePe may remember device/phone/app from
earlier sessions and appear to skip steps. Routing every payment attempt
through `/start-payment` ensures:

1. The user always makes an **explicit** "Registered vs New" decision.
2. `/payments/iiskills` always creates a **fresh `purchaseId`** — old payment
   links cannot be reused.
3. Even authenticated users are one click away from using a different account.

---

## API Endpoints

### `POST /api/payments/create-purchase`

Creates a `purchases` row **before** the user is redirected to aienter.in.

**Authentication**: Supabase session (Bearer token in Authorization header)

**Request body**:

```json
{
  "courseSlug": "learn-ai",
  "amountPaise": 49900,
  "currency": "INR"
}
```

**Response**:

```json
{ "purchaseId": "<uuid>" }
```

The `purchaseId` must be included in the redirect to aienter.in and in the
server-to-server callback payload.

---

### `POST /api/payments/generate-token`

Generates a short-lived JWT carrying the user's identity.

**Authentication**: Supabase session (Bearer token)

**Request body**:

```json
{ "courseSlug": "learn-ai" }
```

**JWT payload fields**:

| Field         | Description                                                               |
| ------------- | ------------------------------------------------------------------------- |
| `user_id`     | Supabase user UUID                                                        |
| `email`       | User's email address                                                      |
| `phone`       | User's phone number (from profile)                                        |
| `name`        | User's full name (from profile)                                           |
| `course_slug` | App ID of the course being purchased                                      |
| `return_to`   | Post-payment redirect URL (`https://<appname>.iiskills.cloud/authorised`) |
| `jti`         | Random nonce to prevent replay attacks                                    |

Token is signed with `PAYMENT_TOKEN_SECRET` (HS256), expires in 10 minutes.

---

### `POST /api/payments/confirm` ← **Canonical callback endpoint**

Receives the server-to-server POST from aienter.in after a successful payment.

| Property         | Value                                              |
| ---------------- | -------------------------------------------------- |
| **URL**          | `POST https://iiskills.cloud/api/payments/confirm` |
| **Content-Type** | `application/json`                                 |
| **Auth**         | HMAC-SHA256 signature (see below)                  |

#### Request headers

| Header                | Required | Description                                                                                      |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------ |
| `x-aienter-signature` | **Yes**  | HMAC-SHA256 hex digest of the raw request body, keyed with `AIENTER_CONFIRMATION_SIGNING_SECRET` |
| `x-aienter-timestamp` | No       | Unix timestamp in seconds; rejected if skew > 5 minutes                                          |
| `Content-Type`        | **Yes**  | Must be `application/json`                                                                       |

#### Request body

| Field               | Type     | Required | Description                                                |
| ------------------- | -------- | -------- | ---------------------------------------------------------- |
| `purchaseId`        | `string` | **Yes**  | UUID from `/api/payments/create-purchase`                  |
| `appId`             | `string` | **Yes**  | iiskills app identifier, e.g. `"learn-ai"`                 |
| `user_token`        | `string` | **Yes**  | The JWT token from `/api/payments/generate-token`          |
| `razorpayPaymentId` | `string` | **Yes**  | Razorpay payment ID                                        |
| `amountPaise`       | `number` | **Yes**  | Payment amount in paise                                    |
| `courseSlug`        | `string` | No       | Course slug (falls back to token's course_slug or appId)   |
| `razorpayOrderId`   | `string` | No       | Razorpay order ID                                          |
| `paidAt`            | `string` | No       | ISO timestamp of payment                                   |
| `customerPhone`     | `string` | No       | Payer's phone (informational only — not used for identity) |
| `customerEmail`     | `string` | No       | Payer's email (used for confirmation email if present)     |
| `currency`          | `string` | No       | Defaults to `"INR"`                                        |

#### Response

| Status | Meaning                                                           |
| ------ | ----------------------------------------------------------------- |
| `200`  | Payment confirmed (or already confirmed — idempotent)             |
| `400`  | Missing/invalid required field                                    |
| `401`  | Missing or invalid `x-aienter-signature`, or invalid `user_token` |
| `403`  | Purchase does not belong to the user identified by `user_token`   |
| `405`  | Non-POST request                                                  |
| `500`  | Server-side error (Supabase unavailable, etc.)                    |

Success response body:

```json
{
  "success": true,
  "purchaseId": "<uuid>",
  "message": "confirmed",
  "user_id": "<user-uuid>",
  "course_slug": "learn-ai",
  "redirect_url": "https://learn-ai.iiskills.cloud/authorised"
}
```

---

### `POST /api/payments/ai-enter/callback` — **DEPRECATED (410 Gone)**

This endpoint has been superseded by `/api/payments/confirm`. It now returns
HTTP **410 Gone** with a pointer to the correct endpoint.

Update aienter.in to call `/api/payments/confirm` instead.

---

## Signature Generation (on aienter.in)

Compute the signature over the **raw request body bytes** (not re-serialized JSON):

```javascript
const crypto = require("crypto");

const rawBody = JSON.stringify(payload); // keep as-is; do not re-serialize
const signature = crypto
  .createHmac("sha256", process.env.AIENTER_CONFIRMATION_SIGNING_SECRET)
  .update(Buffer.from(rawBody, "utf8"))
  .digest("hex");
```

Send in the `x-aienter-signature` header (lowercase).

---

## Idempotency

The confirm endpoint enforces idempotency by checking `purchases.iiskills_ack_at`:

1. If `purchases.iiskills_ack_at IS NOT NULL` AND `razorpay_payment_id` matches → return 200
2. Otherwise, update the purchase row and grant the entitlement

Entitlement inserts are also idempotent via the `(user_id, course_slug)` unique constraint.

---

## DB Tables Used

| Table          | Operation                                      |
| -------------- | ---------------------------------------------- |
| `purchases`    | INSERT (create-purchase), UPDATE (confirm)     |
| `entitlements` | INSERT with course_slug (not app_id)           |
| `profiles`     | UPDATE is_paid_user=true, paid_at (idempotent) |

> **Important**: `entitlements.course_slug` is used (not `app_id`). This matches
> the schema column name in `public.entitlements`.

---

## Migrations Required

Apply these migrations in order for a fresh or existing database:

| File                                                          | Description                                                                                                            |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `supabase/migrations/2026-03-09_purchases_table.sql`          | Creates `public.purchases` table with `user_id` FK, unique partial index on `razorpay_payment_id`                      |
| `supabase/migrations/2026-03-09_entitlements_add_columns.sql` | Adds `course_slug`, `purchase_id` columns to `public.entitlements`; adds unique constraint on `(user_id, course_slug)` |

---

## returnTo URL (per-app)

After a successful payment, aienter.in uses `redirect_url` from the confirm response
(derived from the token's `return_to` field):

| App ID             | returnTo                                             |
| ------------------ | ---------------------------------------------------- |
| `learn-ai`         | `https://learn-ai.iiskills.cloud/authorised`         |
| `learn-developer`  | `https://learn-developer.iiskills.cloud/authorised`  |
| `learn-management` | `https://learn-management.iiskills.cloud/authorised` |
| `learn-pr`         | `https://learn-pr.iiskills.cloud/authorised`         |

---

## Security Notes

- The raw body (not re-serialized JSON) **must** be used for HMAC computation on both sides.
- `timingSafeEqual` is used for comparison to prevent timing attacks.
- `AIENTER_CONFIRMATION_SIGNING_SECRET` is server-side only — never expose client-side.
- `PAYMENT_TOKEN_SECRET` is server-side only — used to sign/verify JWTs.
- `user_token` is **required** for all confirm calls. Legacy calls without a token return 400.
- Do **not** rely on payer phone matching registered phone to grant access.
  Identity is established via `user_token` (signed by iiskills.cloud).
- `purchases.user_id` (column) is the primary ownership check; `metadata.user_id` is the
  fallback. If neither is present the confirm endpoint returns **403** and refuses to grant
  the entitlement. `create-purchase.js` always writes both.

---

## Ownership Validation in /api/payments/confirm

```
purchases.user_id  (dedicated FK column — preferred)
  └─ set by create-purchase.js from authenticated Supabase user
  └─ selected by confirm.js alongside metadata

purchases.metadata.user_id  (JSONB fallback — always written by create-purchase)
  └─ used when user_id column is null (legacy rows)

Reject (403) if neither is present.
```

---

## Paid User Access Rule

> **Rule**: Any user with an active, non-expired entitlement for a course **must never** be
> shown a paywall or payment prompt for any lesson in that course.

After a successful payment the confirm endpoint:

1. Inserts a row in `public.entitlements` with `status='active'` and `app_id = course_slug = <courseAppId>`.
2. Sets `profiles.is_paid_user = true`.

The `GET /api/entitlement?appId=<appId>` endpoint enforces this rule:

- Checks `entitlements` by **both** `app_id` and `course_slug` (covering Razorpay + admin grant paths).
- Checks `user_app_access` as a secondary fallback (covers bundle + dbAccessManager grants).
- Admin users always receive `entitled: true` regardless of entitlement rows.
- Free-access mode (`FREE_ACCESS=true`) returns `entitled: true` for all requests.

All paid learn apps (`learn-ai`, `learn-developer`, `learn-management`, `learn-pr`) consume this
endpoint via the `useEntitlement` hook in `packages/shared-utils/lib/hooks/useEntitlement.js`.
The paywall (`EnrollmentLandingPage`) is only shown when `entitled === false` is explicitly
returned — `null` (check skipped for free lessons) never triggers the paywall.

---

## New Deployment Checklist

Before going live, verify every item:

| # | Check                                                             | How to verify                                                              |
|---|-------------------------------------------------------------------|----------------------------------------------------------------------------|
| 1 | `NEXT_PUBLIC_SUPABASE_URL` is set and points to the Supabase project  | `echo $NEXT_PUBLIC_SUPABASE_URL` on the server                             |
| 2 | `SUPABASE_SERVICE_ROLE_KEY` is set (server-side only)             | `echo $SUPABASE_SERVICE_ROLE_KEY` on the server                            |
| 3 | `PAYMENT_TOKEN_SECRET` is a long random string                    | `openssl rand -hex 32` to generate; check `/etc/iiskills.env`              |
| 4 | `AIENTER_CONFIRMATION_SIGNING_SECRET` matches value on aienter.in | Must be identical on both sides; rotate both atomically if changed         |
| 5 | `IISKILLS_CONFIRM_URL` on aienter.in = `https://iiskills.cloud/api/payments/confirm` | Check aienter.in env config  |
| 6 | Payment flow: new user can register, pay, and immediately access lessons | End-to-end smoke test                                                 |
| 7 | Paid user sees NO paywall on lesson 2, 3, … of an entitled course | Log in as paid user and navigate to non-free lessons                       |
| 8 | `/api/payments/create-purchase` returns `{ purchaseId }`, not a 500 | Check server logs after clicking "Pay Now"                               |
| 9 | `POST /api/payments/confirm` returns `200 success`               | Check aienter.in callback logs after test payment                          |

---

## Troubleshooting

### "Server misconfiguration" on create-purchase

If `/api/payments/create-purchase` returns HTTP 500 with `"Server misconfiguration"`, the
most likely cause is a missing Supabase environment variable. Verify:

- `NEXT_PUBLIC_SUPABASE_URL` is set and is a valid Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY` is set and is the **service role** key (not the anon key).

Both values live in `/etc/iiskills.env` (loaded via `apps/main/next.config.js`).

---

### "Paid but no entitlement"

Work through this checklist in order:

1. **Check confirm was called** — look for `POST /api/payments/confirm` in server logs.
   If missing, aienter.in did not call back or the URL is wrong (`IISKILLS_CONFIRM_URL`).

2. **Check signature** — look for `[payments/confirm] Signature mismatch` in logs.
   - Ensure `AIENTER_CONFIRMATION_SIGNING_SECRET` is the **same value** on both sides.
   - Confirm aienter.in signs the **raw** JSON bytes (not re-serialized).

3. **Check user_token** — if the token is expired (>10 min) you'll see
   `[payments/confirm] user_token verification failed`.
   Fix: ensure aienter.in completes and calls back within the 10-minute token window.

4. **Check ownership** — look for `user_id mismatch` or `ownership unverifiable` in logs.
   - Run `SELECT * FROM purchases WHERE id = '<purchaseId>'` to inspect the row.
   - Ensure `user_id` and `metadata->>'user_id'` are set and match the JWT `user_id`.

5. **Check entitlement insert** — look for `Failed to insert entitlement` in logs.
   - Run `SELECT * FROM entitlements WHERE user_id = '<userId>'` to check for the row.
   - If a `23505` duplicate error is logged it means the entitlement already exists.

6. **Check profiles update** — verify `profiles.is_paid_user = true` for the user.
   The entitlement must exist first; `is_paid_user` is set idempotently after insert.

### "Signature mismatch"

- Verify `AIENTER_CONFIRMATION_SIGNING_SECRET` is identical on aienter.in and iiskills.cloud.
- Verify the signature is computed over the **raw request body bytes**, not re-serialized JSON.
- The signature header must be lowercase: `x-aienter-signature`.
- The value must be a hex string (64 characters for SHA-256).
- Check for stale/rotated secrets — rotate both simultaneously and deploy atomically.

### "Purchase already confirmed (idempotent)"

This is expected behaviour. If the same `purchaseId` + `razorpayPaymentId` arrives again,
the confirm endpoint returns `200` immediately without re-granting the entitlement.
The user's access is already granted from the first call.
