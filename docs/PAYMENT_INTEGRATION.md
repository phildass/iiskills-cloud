# Payment Integration: aienter.in → iiskills.cloud

This document describes the **SSO-based payment flow** between iiskills.cloud paid apps and the central payment portal at aienter.in.

---

## Overview

The full payment flow is:

```
User clicks "Pay Now" on <appname>.iiskills.cloud
      │
      ▼
User is redirected to https://iiskills.cloud/payments/iiskills?course=<appId>
(already authenticated — Supabase session checked here)
      │
      ▼
iiskills.cloud POST /api/payments/create-purchase
Creates a purchases row (status='created') and returns purchaseId
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

| Variable                              | Description                                                                   |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| `AIENTER_CONFIRMATION_SIGNING_SECRET` | Same shared secret as iiskills; used to sign the x-aienter-signature header.  |
| `IISKILLS_CONFIRM_URL`                | `https://iiskills.cloud/api/payments/confirm`                                 |

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

| Property         | Value                                                    |
| ---------------- | -------------------------------------------------------- |
| **URL**          | `POST https://iiskills.cloud/api/payments/confirm`       |
| **Content-Type** | `application/json`                                       |
| **Auth**         | HMAC-SHA256 signature (see below)                        |

#### Request headers

| Header                  | Required | Description                                                                           |
| ----------------------- | -------- | ------------------------------------------------------------------------------------- |
| `x-aienter-signature`   | **Yes**  | HMAC-SHA256 hex digest of the raw request body, keyed with `AIENTER_CONFIRMATION_SIGNING_SECRET` |
| `x-aienter-timestamp`   | No       | Unix timestamp in seconds; rejected if skew > 5 minutes                              |
| `Content-Type`          | **Yes**  | Must be `application/json`                                                            |

#### Request body

| Field                 | Type     | Required | Description                                                |
| --------------------- | -------- | -------- | ---------------------------------------------------------- |
| `purchaseId`          | `string` | **Yes**  | UUID from `/api/payments/create-purchase`                  |
| `appId`               | `string` | **Yes**  | iiskills app identifier, e.g. `"learn-ai"`                 |
| `user_token`          | `string` | **Yes**  | The JWT token from `/api/payments/generate-token`          |
| `razorpayPaymentId`   | `string` | **Yes**  | Razorpay payment ID                                        |
| `amountPaise`         | `number` | **Yes**  | Payment amount in paise                                    |
| `courseSlug`          | `string` | No       | Course slug (falls back to token's course_slug or appId)   |
| `razorpayOrderId`     | `string` | No       | Razorpay order ID                                          |
| `paidAt`              | `string` | No       | ISO timestamp of payment                                   |
| `customerPhone`       | `string` | No       | Payer's phone (informational only — not used for identity) |
| `customerEmail`       | `string` | No       | Payer's email (used for confirmation email if present)     |
| `currency`            | `string` | No       | Defaults to `"INR"`                                        |

#### Response

| Status | Meaning                                                              |
| ------ | -------------------------------------------------------------------- |
| `200`  | Payment confirmed (or already confirmed — idempotent)                |
| `400`  | Missing/invalid required field                                       |
| `401`  | Missing or invalid `x-aienter-signature`, or invalid `user_token`    |
| `403`  | Purchase does not belong to the user identified by `user_token`      |
| `405`  | Non-POST request                                                     |
| `500`  | Server-side error (Supabase unavailable, etc.)                       |

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

| Table          | Operation                                          |
| -------------- | -------------------------------------------------- |
| `purchases`    | INSERT (create-purchase), UPDATE (confirm)         |
| `entitlements` | INSERT with course_slug (not app_id)               |
| `profiles`     | UPDATE is_paid_user=true, paid_at (idempotent)     |

> **Important**: `entitlements.course_slug` is used (not `app_id`). This matches
> the schema column name in `public.entitlements`.

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
- `purchases.metadata.user_id` is verified against the token's `user_id` to prevent
  one user's token being used to mark another user's purchase as paid.

