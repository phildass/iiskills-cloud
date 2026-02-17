# OTP Dispatch Flow Diagram

## Payment to OTP Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         User Makes Payment                               │
│                    (at Razorpay for specific app)                       │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Payment Captured Successfully                         │
│                  Payment Notes Include: app_id="learn-ai"               │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│            Razorpay Sends Webhook to Backend                            │
│               POST /api/payment/webhook                                 │
│       Headers: x-razorpay-signature (for verification)                  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  Webhook Handler Processes                              │
│  1. ✅ Verify webhook signature (HMAC)                                  │
│  2. ✅ Extract app_id from payment notes                                │
│  3. ✅ Extract user email (required)                                    │
│  4. ✅ Extract user phone (optional)                                    │
│  5. ✅ Validate app exists in registry                                  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Store Payment Record                                 │
│           INSERT INTO payments (payment_id, app_id, ...)                │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              Call generateAndDispatchOTP()                              │
│  Parameters:                                                            │
│    - email: user@example.com                                           │
│    - phone: +919876543210                                              │
│    - appId: "learn-ai"                                                 │
│    - appName: "Learn-AI"                                               │
│    - paymentTransactionId: "pay_123456"                                │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    OTP Service Processing                               │
│  1. Generate 6-digit random OTP: "123456"                              │
│  2. Set expiration: NOW + 10 minutes                                   │
│  3. Determine delivery channel: "both" (email + SMS)                   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
        ┌─────────────────────┐   ┌─────────────────────┐
        │  Send via Email      │   │   Send via SMS      │
        │  (SendGrid)          │   │   (Vonage)          │
        │                      │   │                     │
        │  To: user@example.com│   │  To: +91987654321  │
        │  Subject: OTP for    │   │  Body: Your OTP:   │
        │    Learn-AI          │   │    123456          │
        │  Body: HTML template │   │                     │
        └──────────┬───────────┘   └──────────┬──────────┘
                   │                          │
                   └───────────┬──────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Store OTP in Database                                │
│  INSERT INTO otps (                                                     │
│    email: "user@example.com",                                          │
│    phone: "+919876543210",                                             │
│    app_id: "learn-ai",           ← APP-SPECIFIC BINDING               │
│    otp: "123456",                                                      │
│    expires_at: "2026-02-17T05:20:00Z",                                │
│    delivery_channel: "both",                                           │
│    email_sent: true,                                                   │
│    sms_sent: true,                                                     │
│    payment_transaction_id: "pay_123456"                               │
│  )                                                                     │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                Return Success to Razorpay                               │
│  Response: {                                                            │
│    success: true,                                                       │
│    deliveryChannel: "both",                                            │
│    emailSent: true,                                                     │
│    smsSent: true                                                        │
│  }                                                                      │
│  ⚠️ NOTE: OTP value NOT included in response (security)                │
└─────────────────────────────────────────────────────────────────────────┘


## User Verification Flow

┌─────────────────────────────────────────────────────────────────────────┐
│           User Receives OTP via Email and/or SMS                        │
│                    OTP: "123456"                                        │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              User Enters OTP in App UI                                  │
│    Input Fields: email, otp, appId                                     │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│            Frontend Sends Verification Request                          │
│              POST /api/verify-otp                                       │
│              Body: {                                                    │
│                email: "user@example.com",                              │
│                otp: "123456",                                          │
│                appId: "learn-ai"                                       │
│              }                                                          │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  verifyOTP() Processing                                 │
│  1. ✅ Validate email format                                            │
│  2. ✅ Query database for matching OTP                                  │
│     WHERE email = "user@example.com"                                   │
│       AND otp = "123456"                                               │
│       AND app_id = "learn-ai"      ← MUST MATCH                       │
│       AND verified_at IS NULL                                          │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            OTP Found?                    OTP Not Found
                    │                         │
                    ▼                         ▼
        ┌─────────────────────┐   ┌─────────────────────┐
        │  Additional Checks   │   │  Return Error       │
        │  3. ✅ Not expired?   │   │  "Invalid OTP or   │
        │  4. ✅ < 5 attempts?  │   │   not found for    │
        │                      │   │   this app"        │
        └──────────┬───────────┘   └─────────────────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  All Checks Pass     │
        │  Mark as Verified    │
        │  UPDATE otps SET     │
        │    verified_at=NOW() │
        └──────────┬───────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Return Success      │
        │  {                   │
        │    success: true,    │
        │    appId: "learn-ai" │
        │  }                   │
        └──────────┬───────────┘
                   │
                   ▼
        ┌─────────────────────┐
        │  Grant Access to App │
        │  (Frontend handling) │
        └─────────────────────┘


## App Isolation Enforcement

┌─────────────────────────────────────────────────────────────────────────┐
│                  Scenario: Cross-App Attack Attempt                     │
└─────────────────────────────────────────────────────────────────────────┘

User pays for "learn-ai" and receives OTP: "123456"
OTP stored with app_id = "learn-ai"

┌─────────────────────────────────────────────────────────────────────────┐
│  Attacker tries to use same OTP for "learn-pr"                         │
│                                                                         │
│  POST /api/verify-otp                                                  │
│  {                                                                     │
│    email: "user@example.com",                                         │
│    otp: "123456",                                                     │
│    appId: "learn-pr"      ← Different app!                           │
│  }                                                                     │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Database Query                                     │
│  SELECT * FROM otps                                                    │
│  WHERE email = "user@example.com"                                     │
│    AND otp = "123456"                                                 │
│    AND app_id = "learn-pr"     ← NO MATCH!                           │
│    AND verified_at IS NULL                                            │
│                                                                        │
│  Result: 0 rows returned                                              │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    ❌ ATTACK BLOCKED                                     │
│                                                                         │
│  Response: {                                                           │
│    success: false,                                                     │
│    error: "Invalid OTP or OTP not found for this app"                 │
│  }                                                                     │
│                                                                         │
│  ✅ OTP for "learn-ai" cannot be used for "learn-pr"                   │
│  ✅ User must pay for each app separately                              │
│  ✅ Each payment generates app-specific OTP                            │
└─────────────────────────────────────────────────────────────────────────┘


## Security Layers

┌─────────────────────────────────────────────────────────────────────────┐
│                      Multi-Layer Security                               │
│                                                                         │
│  Layer 1: Webhook Verification                                         │
│    ✅ HMAC signature validation                                         │
│    ✅ Prevents unauthorized payment notifications                       │
│                                                                         │
│  Layer 2: App-Specific Binding                                         │
│    ✅ OTP tied to app_id in database                                   │
│    ✅ Query must match exact app_id                                    │
│    ✅ Cross-app attacks automatically fail                             │
│                                                                         │
│  Layer 3: Time-Based Expiration                                        │
│    ✅ 10-minute validity window                                        │
│    ✅ Expired OTPs automatically rejected                              │
│                                                                         │
│  Layer 4: Rate Limiting                                                │
│    ✅ Maximum 5 verification attempts                                  │
│    ✅ Prevents brute force attacks                                     │
│                                                                         │
│  Layer 5: One-Time Use                                                 │
│    ✅ OTP marked as verified after use                                 │
│    ✅ Cannot be reused even within validity period                     │
│                                                                         │
│  Layer 6: No OTP Leakage                                               │
│    ✅ OTP never returned in API responses                              │
│    ✅ Only sent via email/SMS                                          │
│    ✅ Not logged in production                                         │
│                                                                         │
│  Layer 7: Database Security                                            │
│    ✅ Row Level Security policies                                      │
│    ✅ Users can only see their own OTPs                                │
└─────────────────────────────────────────────────────────────────────────┘
```

## Key Takeaways

1. **App Isolation is Enforced at Database Level**: The `app_id` field in the WHERE clause ensures OTPs are app-specific

2. **Payment Notes are Critical**: Every payment must include `app_id` in notes for proper OTP binding

3. **Email is Required**: While phone is optional, email is mandatory for OTP generation

4. **Multi-Channel Delivery**: OTPs sent via both email and SMS when both available

5. **Security by Design**: Multiple layers prevent common attacks (replay, cross-app, brute force)

6. **Zero OTP Leakage**: OTP values never exposed in API responses, only delivered via secure channels
