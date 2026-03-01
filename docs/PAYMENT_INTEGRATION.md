# Payment Integration: aienter.in → iiskills.cloud

This document describes how **aienter.in** notifies **iiskills.cloud** of successful Razorpay payments.

---

## Overview

The full payment flow is:

```
Customer pays at https://aienter.in/payments/iiskills
      │
      ▼
Razorpay fires a webhook → aienter.in verifies Razorpay signature
      │
      ▼
aienter.in POSTs to https://iiskills.cloud/api/payments/confirm
      │
      ▼
iiskills.cloud verifies HMAC signature, stores confirmation, sends OTP
      │
      ▼
Customer visits /otp-gateway, enters OTP, becomes PAID Learner
```

> **Key principle**: iiskills.cloud does **not** talk to Razorpay directly. It trusts the
> confirmation only after verifying a shared HMAC-SHA256 secret with aienter.in.

---

## Endpoint

| Property | Value |
|----------|-------|
| **URL** | `POST https://iiskills.cloud/api/payments/confirm` |
| **Content-Type** | `application/json` |
| **Auth** | HMAC-SHA256 signature (see below) |

---

## Required Environment Variables

Set these on **iiskills.cloud** (apps/main `.env.local` / server environment):

| Variable | Description |
|----------|-------------|
| `AIENTER_CONFIRMATION_SIGNING_SECRET` | Shared HMAC secret between aienter.in and iiskills.cloud. Generate with `openssl rand -hex 32`. **Must match** the corresponding secret on aienter.in. |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only, never exposed to browser) |

---

## Request Format

### Headers

| Header | Required | Description |
|--------|----------|-------------|
| `x-aienter-signature` | **Yes** | HMAC-SHA256 hex digest of the raw request body, keyed with `AIENTER_CONFIRMATION_SIGNING_SECRET` |
| `x-aienter-timestamp` | Recommended | Unix timestamp in seconds. Requests older than 5 minutes are rejected to prevent replay attacks. |
| `Content-Type` | **Yes** | Must be `application/json` |

### Body Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `purchaseId` | `string` (UUID) | **Yes** | Purchase ID from the aienter.in `purchases` table |
| `appId` | `string` | **Yes** | iiskills app identifier, e.g. `"learn-ai"` |
| `courseSlug` | `string` | No | Course slug (optional if `appId` already maps to a course) |
| `amountPaise` | `number` | **Yes** | Payment amount in paise (e.g. `49900` for ₹499) |
| `currency` | `string` | No | Defaults to `"INR"` |
| `customerPhone` | `string` | **Yes** | Customer's phone number (E.164 or bare 10-digit Indian number) |
| `razorpayOrderId` | `string` | No | Razorpay order ID |
| `razorpayPaymentId` | `string` | **Yes** | Razorpay payment ID — used as idempotency key |
| `paidAt` | `string` (ISO 8601) | No | Timestamp when the payment was captured by Razorpay |

---

## Signature Generation (on aienter.in)

Compute the signature over the **raw request body bytes** (not re-serialized JSON):

```javascript
const crypto = require('crypto');

const rawBody = JSON.stringify(payload); // keep as-is; do not re-serialize
const signature = crypto
  .createHmac('sha256', process.env.AIENTER_CONFIRMATION_SIGNING_SECRET)
  .update(Buffer.from(rawBody, 'utf8'))
  .digest('hex');
```

Send the signature in the `x-aienter-signature` header and the current unix timestamp in `x-aienter-timestamp`.

---

## Example cURL Request

```bash
#!/usr/bin/env bash
SECRET="your-shared-secret-here"
PAYLOAD='{"purchaseId":"d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a","appId":"learn-ai","amountPaise":49900,"currency":"INR","customerPhone":"+919876543210","razorpayOrderId":"order_abc123","razorpayPaymentId":"pay_xyz456","paidAt":"2026-03-01T12:00:00.000Z"}'
TS=$(date +%s)

SIG=$(echo -n "$PAYLOAD" | openssl dgst -sha256 -hmac "$SECRET" -hex | awk '{print $2}')

curl -X POST https://iiskills.cloud/api/payments/confirm \
  -H "Content-Type: application/json" \
  -H "x-aienter-signature: $SIG" \
  -H "x-aienter-timestamp: $TS" \
  -d "$PAYLOAD"
```

Expected response (HTTP 200):

```json
{
  "success": true,
  "confirmationId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "message": "confirmed"
}
```

---

## Response Codes

| Status | Meaning |
|--------|---------|
| `200` | Payment confirmed (or already confirmed — idempotent) |
| `400` | Missing/invalid required field |
| `401` | Missing or invalid `x-aienter-signature`, or timestamp out of range |
| `405` | Non-POST request |
| `500` | Server-side error (Supabase unavailable, OTP dispatch failure, etc.) |

---

## Idempotency

iiskills.cloud enforces idempotency via a `UNIQUE` constraint on `razorpay_payment_id` in the
`payment_confirmations` table. Sending the same `razorpayPaymentId` more than once returns
HTTP 200 without creating duplicate records or sending duplicate OTPs.

---

## Database Schema

The confirmation is stored in the `payment_confirmations` table. Run the migration:

```
supabase/migrations/payment_confirmations_table.sql
```

---

## Security Notes

- The raw body (not re-serialized JSON) **must** be used for HMAC computation on both sides.
- `timingSafeEqual` is used for comparison to prevent timing attacks.
- `AIENTER_CONFIRMATION_SIGNING_SECRET` is a server-side-only env var — never expose it client-side.
- iiskills.cloud does **not** require Razorpay credentials.
