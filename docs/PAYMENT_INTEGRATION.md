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
iiskills.cloud POST /api/payments/generate-token
Generates signed JWT with user identity, course slug, and returnTo URL
      │
      ▼
User is redirected to https://aienter.in/payments/iiskills?course=...&token=...&returnTo=...
(token verified by aienter — no login prompt shown)
      │
      ▼
User pays via Razorpay on aienter.in
      │
      ▼
aienter.in POSTs server-to-server to https://iiskills.cloud/api/payments/ai-enter/callback
iiskills.cloud verifies HMAC signature, grants entitlement
      │
      ▼
User is redirected to https://<appname>.iiskills.cloud/authorised
      │
      ▼
/authorised redirects to /complete-registration (set password, fill profile, etc.)
```

> **Key principle**: iiskills.cloud does **not** talk to Razorpay directly. It trusts the
> confirmation only after verifying a shared HMAC-SHA256 secret with aienter.in.

---

## SSO Token Flow

### Token Generation: `POST /api/payments/generate-token`

When a logged-in user reaches `/payments/iiskills`, iiskills.cloud generates a short-lived JWT:

| Payload field | Description                                                               |
| ------------- | ------------------------------------------------------------------------- |
| `user_id`     | Supabase user UUID                                                        |
| `email`       | User's email address                                                      |
| `phone`       | User's phone number (from profile)                                        |
| `name`        | User's full name (from profile)                                           |
| `course_slug` | App ID of the course being purchased                                      |
| `return_to`   | Post-payment redirect URL (`https://<appname>.iiskills.cloud/authorised`) |
| `jti`         | Random nonce to prevent replay attacks                                    |

The token is signed with `PAYMENT_TOKEN_SECRET` (HS256) and expires in 10 minutes.

### returnTo URL (per-app)

After a successful payment, aienter.in redirects the user to the `returnTo` URL. This is
derived from the `course` app ID and always points to `https://<appname>.iiskills.cloud/authorised`:

| App ID             | returnTo                                             |
| ------------------ | ---------------------------------------------------- |
| `learn-ai`         | `https://learn-ai.iiskills.cloud/authorised`         |
| `learn-developer`  | `https://learn-developer.iiskills.cloud/authorised`  |
| `learn-management` | `https://learn-management.iiskills.cloud/authorised` |
| `learn-pr`         | `https://learn-pr.iiskills.cloud/authorised`         |

The `/authorised` page on each subdomain app shows a payment success message and
immediately redirects to `/complete-registration` to finalise onboarding.

---

## Callback Endpoint

| Property         | Value                                                        |
| ---------------- | ------------------------------------------------------------ |
| **URL**          | `POST https://iiskills.cloud/api/payments/ai-enter/callback` |
| **Content-Type** | `application/json`                                           |
| **Auth**         | HMAC-SHA256 signature (see below)                            |

---

## Required Environment Variables

Set these on **iiskills.cloud** (apps/main `.env.local` / server environment):

| Variable                    | Description                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| `PAYMENT_TOKEN_SECRET`      | Long random string used to sign/verify payment JWT tokens. Generate with `openssl rand -hex 32`. |
| `ORIGIN_WEBHOOK_SECRET`     | Shared HMAC secret between aienter.in and iiskills.cloud for server-to-server callback.          |
| `NEXT_PUBLIC_SUPABASE_URL`  | Supabase project URL                                                                             |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only, never exposed to browser)                           |

---

## Request Format

### Headers

| Header                 | Required | Description                                                                        |
| ---------------------- | -------- | ---------------------------------------------------------------------------------- |
| `X-AI-ENTER-SIGNATURE` | **Yes**  | HMAC-SHA256 hex digest of the raw request body, keyed with `ORIGIN_WEBHOOK_SECRET` |
| `Content-Type`         | **Yes**  | Must be `application/json`                                                         |

### Body Fields

| Field                 | Type     | Required           | Description                                            |
| --------------------- | -------- | ------------------ | ------------------------------------------------------ |
| `event`               | `string` | **Yes**            | Must be `"payment.success"`                            |
| `razorpay_payment_id` | `string` | **Yes**            | Razorpay payment ID — used as idempotency key          |
| `app_id`              | `string` | **Yes**            | iiskills app identifier, e.g. `"learn-ai"`             |
| `user_token`          | `string` | **Yes (Option A)** | The JWT token issued by `/api/payments/generate-token` |
| `phone`               | `string` | **Yes (legacy)**   | Required if `user_token` is absent                     |
| `email`               | `string` | No                 | Customer email (used in legacy flow)                   |
| `amount`              | `number` | No                 | Payment amount in paise                                |
| `currency`            | `string` | No                 | Defaults to `"INR"`                                    |

---

## Signature Generation (on aienter.in)

Compute the signature over the **raw request body bytes** (not re-serialized JSON):

```javascript
const crypto = require("crypto");

const rawBody = JSON.stringify(payload); // keep as-is; do not re-serialize
const signature = crypto
  .createHmac("sha256", process.env.ORIGIN_WEBHOOK_SECRET)
  .update(Buffer.from(rawBody, "utf8"))
  .digest("hex");
```

Send the signature in the `X-AI-ENTER-SIGNATURE` header.

---

## Response Codes

| Status | Meaning                                                            |
| ------ | ------------------------------------------------------------------ |
| `200`  | Payment confirmed (or already confirmed — idempotent)              |
| `400`  | Missing/invalid required field                                     |
| `401`  | Missing or invalid `X-AI-ENTER-SIGNATURE`, or invalid `user_token` |
| `405`  | Non-POST request                                                   |
| `500`  | Server-side error (Supabase unavailable, etc.)                     |

---

## Idempotency

iiskills.cloud enforces idempotency via a `UNIQUE` constraint on `razorpay_payment_id` in the
payments table. Sending the same `razorpay_payment_id` more than once returns
HTTP 200 without creating duplicate records.

---

## Profile Self-Healing (generate-token)

`POST /api/payments/generate-token` is resilient to a missing `profiles` row:

1. It uses `maybeSingle()` instead of `single()` — a missing row returns `null`, not an error.
2. If no row is found, the API performs an `upsert({ id: user.id })` to create a minimal stub.
3. It then re-fetches the profile and checks completeness as usual.
4. If `first_name` or `phone` are still absent, the normal `422 profile_incomplete` response is
   returned, directing the client to the registration form.

### Required Supabase DB Policies

The profiles table must allow authenticated users to insert / upsert their own row.
If your project uses a `handle_new_user` trigger this is handled automatically; otherwise
ensure the following policies exist:

```sql
-- Allow an authenticated user to insert their own profile row.
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Allow an authenticated user to update their own profile row.
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

---

## Public Asset Accessibility (manifest.json / favicon)

`apps/main/middleware.js` contains an explicit pass-through guard for static / public assets:

```
/manifest.json   /favicon.ico   /robots.txt   /sitemap.xml
/_next/*         /images/*
```

These paths always return `NextResponse.next()` without rate-limiting or auth gating,
ensuring PWA manifests and browser-level assets are never blocked by the Edge middleware.

---

## Security Notes

- The raw body (not re-serialized JSON) **must** be used for HMAC computation on both sides.
- `timingSafeEqual` is used for comparison to prevent timing attacks.
- `ORIGIN_WEBHOOK_SECRET` is a server-side-only env var — never expose it client-side.
- `PAYMENT_TOKEN_SECRET` is used server-side only to sign/verify JWTs.
- iiskills.cloud does **not** require Razorpay credentials.
- The `returnTo` URL in the JWT payload is authoritative; unsigned query params for `returnTo`
  should not be trusted over the verified token payload.
