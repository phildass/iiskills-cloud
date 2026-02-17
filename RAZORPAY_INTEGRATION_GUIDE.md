# Razorpay Payment Integration - Implementation Guide

## Overview

This implementation provides a complete Razorpay payment integration system with OTP-based membership activation for the iiskills-cloud platform. The system is designed as backend-only endpoints, ready for future frontend integration.

## Architecture

### Components

```
lib/
  ├── razorpay.js           # Razorpay client and utilities
  ├── mockDatabase.js       # In-memory data storage (replace with real DB)
  └── membershipEmail.js    # Email notification service (mock)

apps/main/pages/api/
  ├── pay.js                # Payment initiation endpoint
  ├── payment/
  │   └── webhook.js        # Razorpay webhook handler
  └── verify-otp.js         # OTP verification endpoint
```

### Data Flow

```
1. User initiates payment
   └─> POST /api/pay
       └─> Creates Razorpay order
           └─> Returns order details

2. User completes payment on Razorpay
   └─> Razorpay sends webhook
       └─> POST /api/payment/webhook (from Razorpay)
           ├─> Validates signature
           ├─> Generates OTP
           ├─> Stores payment & OTP
           └─> Sends email with OTP

3. User enters OTP
   └─> POST /api/verify-otp
       ├─> Validates OTP
       └─> Activates 1-year membership
```

## API Endpoints

### 1. POST /api/pay - Payment Initiation

Creates a Razorpay order for payment processing.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "phone": "9876543210",
  "appId": "learn-ai",
  "appName": "Learn AI",
  "amount": 99900
}
```

**Response (Success):**
```json
{
  "success": true,
  "order": {
    "id": "order_xxx",
    "amount": 99900,
    "currency": "INR",
    "receipt": "receipt_learn-ai_1234567890"
  },
  "key_id": "rzp_test_xxx",
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "phone": "9876543210"
  },
  "app": {
    "id": "learn-ai",
    "name": "Learn AI"
  }
}
```

**Validation:**
- Email format validation
- Required field checks
- Amount validation (positive integer, max ₹1,00,000)
- Sanitization of all inputs

### 2. POST /api/payment/webhook - Payment Webhook

Receives payment notifications from Razorpay.

**Configuration Required:**
- Razorpay Dashboard → Webhooks → Add Endpoint
- URL: `https://yourdomain.com/api/payment/webhook`
- Events: `payment.captured`, `payment.failed`
- Secret: Set in `RAZORPAY_WEBHOOK_SECRET`

**Headers:**
```
x-razorpay-signature: <signature>
```

**Request Body (from Razorpay):**
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_xxx",
        "order_id": "order_xxx",
        "amount": 99900,
        "currency": "INR",
        "status": "captured",
        "method": "card"
      }
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment captured and processed successfully",
  "payment_id": "pay_xxx",
  "order_id": "order_xxx"
}
```

**Security:**
- HMAC SHA256 signature verification (mandatory)
- Constant-time comparison to prevent timing attacks
- Returns 401 for invalid signatures

### 3. POST /api/verify-otp - OTP Verification

Verifies OTP and activates membership.

**Request Body:**
```json
{
  "email": "user@example.com",
  "appId": "learn-ai",
  "otp": "123456"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Membership activated successfully! Welcome aboard!",
  "membership": {
    "email": "user@example.com",
    "app_id": "learn-ai",
    "status": "active",
    "activated_at": "2024-01-01T00:00:00.000Z",
    "expires_at": "2025-01-01T00:00:00.000Z",
    "order_id": "order_xxx"
  }
}
```

**Validation:**
- Email format validation
- OTP format (6-8 alphanumeric characters)
- OTP expiry check (30 minutes)
- Single-use verification

## Environment Variables

Add to `.env.local`:

```bash
# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

**Security Notes:**
- Use Test Mode credentials for development (`rzp_test_*`)
- Use Live Mode credentials for production (`rzp_live_*`)
- Never commit real credentials to git
- Store in environment variables only

## Testing

### Unit Tests

Run utility function tests:
```bash
node test-payment-utils.js
```

Tests covered:
- Razorpay client initialization
- OTP generation (6 and 8 digits)
- Membership expiry calculation
- Webhook signature verification
- Database operations (store, retrieve, verify)
- Email generation

### Integration Tests

Run API endpoint tests:
```bash
# Start the dev server first
cd apps/main && npm run dev

# In another terminal
node test-payment-integration.js
```

Tests covered:
- Payment initiation endpoint
- Input validation
- Security checks
- Error handling
- Webhook processing

## Security Features

### 1. Webhook Signature Verification
```javascript
// HMAC SHA256 signature verification
const expectedSignature = crypto
  .createHmac("sha256", secret)
  .update(body)
  .digest("hex");

// Constant-time comparison
crypto.timingSafeEqual(
  Buffer.from(signature),
  Buffer.from(expectedSignature)
);
```

### 2. Secure OTP Generation
```javascript
// Cryptographically secure random OTP
crypto.randomInt(0, digits.length)
```

### 3. Input Validation
- Email format validation
- Amount range checks
- Required field validation
- Type checking

### 4. Server-Side Only
- API keys never exposed to client
- All sensitive operations on server
- No client-side payment logic

## Production Deployment

### Prerequisites

1. **Razorpay Account**
   - Create account at https://razorpay.com
   - Complete KYC verification
   - Switch to Live Mode

2. **Environment Setup**
   - Set production credentials in environment variables
   - Configure webhook URL in Razorpay dashboard
   - Test webhook delivery

3. **Email Service**
   - Replace mock email service with:
     - SendGrid (recommended)
     - AWS SES
   - Configure API credentials
   - Test email delivery

4. **Database**
   - Replace mockDatabase.js with real database:
     - Supabase (recommended for this project)
     - PostgreSQL
     - MongoDB
   - Create tables/collections:
     - payments
     - otps
     - memberships

### Migration Steps

#### Step 1: Replace Mock Database

Create Supabase tables:

```sql
-- Payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id TEXT UNIQUE NOT NULL,
  payment_id TEXT,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  app_id TEXT NOT NULL,
  app_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT NOT NULL,
  receipt TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  captured_at TIMESTAMP,
  failed_at TIMESTAMP,
  notes JSONB
);

-- OTPs table
CREATE TABLE otps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  app_id TEXT NOT NULL,
  otp TEXT NOT NULL,
  order_id TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  UNIQUE(email, app_id)
);

-- Memberships table
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  app_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  activated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  UNIQUE(email, app_id)
);

-- Indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_email ON payments(email);
CREATE INDEX idx_otps_email_app ON otps(email, app_id);
CREATE INDEX idx_memberships_email_app ON memberships(email, app_id);
```

Update `lib/mockDatabase.js` to use Supabase client:

```javascript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function storePayment(paymentData) {
  const { data, error } = await supabase
    .from("payments")
    .insert([paymentData])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

// Update other functions similarly...
```

#### Step 2: Replace Mock Email Service

Update `lib/membershipEmail.js`:

```javascript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendMembershipEmail(params) {
  const htmlContent = generateMembershipEmailHTML(params);
  
  const result = await sgMail.send({
    to: params.email,
    from: {
      email: process.env.SENDER_EMAIL || 'info@iiskills.cloud',
      name: process.env.SENDER_NAME || 'iiskills'
    },
    subject: `Membership Activated - Welcome to ${params.appName}`,
    html: htmlContent,
  });
  
  return {
    success: true,
    provider: "sendgrid",
    email: params.email,
    message_id: result[0]?.messageId || 'sent',
    timestamp: new Date().toISOString(),
  };
}
```

#### Step 3: Add Rate Limiting

Protect endpoints from abuse:

```javascript
// Install: npm install express-rate-limit
import rateLimit from "express-rate-limit";

export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "Too many payment requests, please try again later",
});

// Use in API routes
export default async function handler(req, res) {
  await paymentLimiter(req, res);
  // ... rest of handler
}
```

#### Step 4: Add Logging & Monitoring

```javascript
// Install: npm install winston
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "payment.log" }),
  ],
});

// Log payment events
logger.info("Payment initiated", {
  order_id: order.id,
  email: email,
  app_id: appId,
  amount: amount,
});
```

## Frontend Integration

### Example: Payment Flow

```javascript
// 1. Initiate payment
async function initiatePayment() {
  const response = await fetch("/api/pay", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "user@example.com",
      name: "John Doe",
      phone: "9876543210",
      appId: "learn-ai",
      appName: "Learn AI",
      amount: 99900,
    }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    openRazorpayCheckout(data);
  }
}

// 2. Open Razorpay checkout
function openRazorpayCheckout(paymentData) {
  const options = {
    key: paymentData.key_id,
    amount: paymentData.order.amount,
    currency: paymentData.order.currency,
    order_id: paymentData.order.id,
    name: paymentData.app.name,
    description: "1 Year Membership",
    prefill: {
      email: paymentData.user.email,
      contact: paymentData.user.phone,
      name: paymentData.user.name,
    },
    handler: function(response) {
      // Payment successful - webhook will handle OTP
      showOTPDialog(paymentData.user.email, paymentData.app.id);
    },
  };
  
  const rzp = new Razorpay(options);
  rzp.open();
}

// 3. Verify OTP
async function verifyOTP(email, appId, otp) {
  const response = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, appId, otp }),
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Membership activated!
    showSuccessMessage(data.membership);
  }
}
```

## Troubleshooting

### Webhook Not Receiving Events

1. Check Razorpay Dashboard → Webhooks → Events Log
2. Verify webhook URL is correct and accessible
3. Check server logs for incoming requests
4. Test webhook locally using ngrok or similar

### Signature Verification Failing

1. Verify `RAZORPAY_WEBHOOK_SECRET` is correct
2. Check that raw body is being used (not parsed JSON)
3. Verify signature header name: `x-razorpay-signature`

### OTP Not Sent

1. Check email service logs
2. Verify email configuration
3. Check spam folder
4. Verify email service is not in sandbox mode

### Payment Initiation Failing

1. Check Razorpay credentials
2. Verify test/live mode matches credentials
3. Check amount is within limits
4. Review server error logs

## Support & Resources

- **Razorpay Documentation**: https://razorpay.com/docs/
- **Razorpay Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/
- **Webhook Events**: https://razorpay.com/docs/webhooks/
- **Integration Guide**: https://razorpay.com/docs/payments/payment-gateway/web-integration/

## License

This implementation is part of the iiskills-cloud project.
