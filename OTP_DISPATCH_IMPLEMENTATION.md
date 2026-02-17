# App-Specific OTP Dispatch After Payment

## Overview

This implementation provides a secure, app/course-specific OTP (One-Time Password) system that dispatches OTPs to users after they complete payment for a specific app or course. The system ensures that OTPs are bound to the specific app/course for which payment was made and cannot be reused across different apps.

## Key Features

✅ **App/Course-Specific OTP Binding**: Each OTP is uniquely tied to a specific app or course and cannot be used for other apps  
✅ **Multi-Channel Delivery**: OTPs are sent via SMS (Twilio) and/or Email (SendGrid)  
✅ **Secure Storage**: OTPs stored with expiration, verification tracking, and rate limiting  
✅ **Payment Integration**: Automatic OTP dispatch after successful payment via Razorpay webhook  
✅ **Verification Endpoint**: Strict validation of OTP, expiration, and app context  
✅ **Admin Management**: Admins can generate OTPs manually for any course/app  
✅ **Security First**: OTP values never returned in API responses

## Architecture

### Database Schema

#### OTPs Table (`public.otps`)
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key to auth.users)
- email (TEXT, required)
- phone (TEXT, optional, E.164 format)
- app_id (TEXT, required) -- The app/course this OTP is for
- otp (TEXT, required) -- The 6-digit OTP code
- expires_at (TIMESTAMPTZ, required) -- 10 minutes from creation
- delivery_channel (TEXT, required) -- 'sms', 'email', or 'both'
- email_sent (BOOLEAN)
- sms_sent (BOOLEAN)
- verified_at (TIMESTAMPTZ, nullable) -- NULL until verified
- verification_attempts (INTEGER, default 0)
- reason (TEXT) -- 'payment_verification', 'admin_generated', etc.
- payment_transaction_id (TEXT, optional)
- admin_generated (BOOLEAN, default false)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

#### Payments Table (`public.payments`)
```sql
- id (UUID, primary key)
- payment_id (TEXT, unique) -- Razorpay payment ID
- payment_gateway (TEXT) -- 'razorpay', 'aienter', 'manual'
- app_id (TEXT, required) -- The app/course purchased
- user_id (UUID, foreign key)
- user_email (TEXT)
- user_phone (TEXT)
- amount (DECIMAL)
- currency (TEXT, default 'INR')
- status (TEXT) -- 'captured', 'failed', 'refunded', 'pending'
- payment_notes (JSONB)
- created_at (TIMESTAMPTZ)
```

### Core Components

#### 1. OTP Service (`/lib/otpService.js`)
Centralized service for all OTP operations:
- `generateAndDispatchOTP()` - Generate and send OTP
- `verifyOTP()` - Verify OTP with app context validation
- `hasValidOTP()` - Check if valid OTP exists
- `getOTPStats()` - Get OTP statistics

#### 2. Payment Webhook (`/apps/main/pages/api/payment/webhook.js`)
Handles payment notifications from Razorpay:
- Verifies webhook signature
- Extracts app/course identifier from payment notes
- Extracts user contact info
- Dispatches app-specific OTP
- Stores payment record

#### 3. OTP Verification Endpoint (`/apps/main/pages/api/verify-otp.js`)
Verifies OTP submissions:
- Validates OTP is correct
- Checks expiration (10-minute window)
- Ensures app context matches
- Prevents cross-app OTP reuse
- Tracks verification attempts (max 5)

#### 4. Admin OTP Generation (`/apps/main/pages/api/admin/generate-otp.js`)
Allows admins to manually generate OTPs:
- Generate OTPs for any app/course
- Specify custom reason
- Track as admin-generated

## Payment Flow

```
User Completes Payment at aienter.in/Razorpay
           ↓
Razorpay sends webhook to /api/payment/webhook
           ↓
Webhook extracts:
  - payment_id
  - app_id (from payment notes)
  - user email and phone
           ↓
Payment record stored in database
           ↓
OTP Service generates 6-digit OTP
           ↓
OTP stored in database with:
  - app_id binding
  - expiration (10 minutes)
  - delivery channel
           ↓
OTP dispatched via:
  - Email (if email provided)
  - SMS (if phone provided)
           ↓
User receives OTP for specific app
           ↓
User submits OTP + app_id for verification
           ↓
Verification checks:
  - OTP matches
  - Not expired
  - app_id matches
  - Not already verified
           ↓
Access granted to specific app only
```

## API Endpoints

### 1. Payment Webhook (Razorpay → Backend)

**Endpoint**: `POST /api/payment/webhook`  
**Purpose**: Receive payment notifications and dispatch OTPs  
**Authentication**: Webhook signature verification  

**Request Body** (from Razorpay):
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_123456789",
        "amount": 49900,
        "currency": "INR",
        "email": "user@example.com",
        "contact": "+919876543210",
        "notes": {
          "app_id": "learn-ai"
        }
      }
    }
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Payment processed and OTP sent",
  "appId": "learn-ai",
  "deliveryChannel": "both",
  "emailSent": true,
  "smsSent": true
}
```

**Required Payment Notes**:
- Payment must include `notes.app_id` or `notes.course_id` to identify the app/course

### 2. OTP Verification

**Endpoint**: `POST /api/verify-otp`  
**Purpose**: Verify user-submitted OTP for specific app  
**Authentication**: None (public endpoint)  

**Request Body**:
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "appId": "learn-ai"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "appId": "learn-ai",
  "email": "user@example.com"
}
```

**Error Response** (400):
```json
{
  "success": false,
  "error": "Invalid OTP or OTP not found for this app"
}
```

**Possible Errors**:
- "Email, OTP, and appId are required"
- "Invalid email format"
- "Invalid OTP or OTP not found for this app"
- "OTP has expired"
- "Too many verification attempts. Please request a new OTP."

### 3. Admin OTP Generation

**Endpoint**: `POST /api/admin/generate-otp`  
**Purpose**: Manually generate OTP for any app/course  
**Authentication**: Admin only (TODO: Add admin auth middleware)  

**Request Body**:
```json
{
  "email": "user@example.com",
  "phone": "+919876543210",
  "course": "learn-ai",
  "reason": "error_compensation",
  "adminGenerated": true
}
```

**Response**:
```json
{
  "message": "OTP generated successfully",
  "emailSent": true,
  "smsSent": true,
  "deliveryChannel": "both",
  "expiresAt": "2026-02-17T05:20:00.000Z",
  "course": "learn-ai",
  "appName": "Learn-AI"
}
```

## Environment Variables

### Required for SMS (Twilio)
```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Required for Email (SendGrid)
```bash
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=info@iiskills.cloud
```

### Required for Database
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_service_role_key
```

### Required for Payment Webhook
```bash
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

### Optional
```bash
NODE_ENV=production  # 'development' shows detailed errors
```

## Security Considerations

### 🔒 Implemented Security Measures

1. **OTP Never Returned in API**: OTP values are NEVER returned in API responses, only sent via email/SMS
2. **App-Specific Binding**: OTPs are bound to specific apps and cannot be used for other apps
3. **Webhook Signature Verification**: Payment webhooks verified using HMAC signature
4. **Expiration**: OTPs expire after 10 minutes
5. **Rate Limiting**: Max 5 verification attempts per OTP
6. **E.164 Phone Format**: Phone numbers validated and normalized
7. **Row Level Security**: Database policies restrict access to user's own OTPs
8. **HTTPS Only**: All API endpoints should be accessed over HTTPS in production

### ⚠️ Important Notes

- Store `RAZORPAY_WEBHOOK_SECRET` securely - it's used to verify webhook authenticity
- Never log or expose OTP values in production
- Use environment-specific keys (dev vs prod)
- Monitor failed OTP deliveries for abuse detection
- Implement admin authentication before deploying admin endpoints

## Database Migrations

Run these migrations in order:

1. **Payments Table**: `supabase/migrations/add_payments_table.sql`
2. **OTPs Table**: `supabase/migrations/add_app_specific_otps.sql`

```bash
# Apply migrations (if using Supabase CLI)
supabase db push

# Or manually execute SQL files in Supabase dashboard
```

## Testing

### Test OTP Generation (Manual)
```bash
curl -X POST http://localhost:3000/api/admin/generate-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "phone": "+911234567890",
    "course": "learn-ai",
    "reason": "testing"
  }'
```

### Test OTP Verification
```bash
curl -X POST http://localhost:3000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otp": "123456",
    "appId": "learn-ai"
  }'
```

### Test Payment Webhook (Simulate)
```bash
# Create test payment with app context
curl -X POST http://localhost:3000/api/payment/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "payment.captured",
    "payload": {
      "payment": {
        "entity": {
          "id": "pay_test123",
          "amount": 49900,
          "currency": "INR",
          "email": "test@example.com",
          "contact": "+911234567890",
          "notes": {
            "app_id": "learn-ai"
          }
        }
      }
    }
  }'
```

## Error Handling

### Payment Webhook Errors

| Error | HTTP Code | Description |
|-------|-----------|-------------|
| Invalid signature | 401 | Webhook signature verification failed |
| Missing app_id | 400 | Payment notes don't include app/course identifier |
| Unknown app | 400 | app_id doesn't match any registered app |
| Missing contact info | 400 | No email or phone provided |
| OTP dispatch failed | 500 | Payment captured but OTP delivery failed |

### OTP Verification Errors

| Error | HTTP Code | Description |
|-------|-----------|-------------|
| Missing fields | 400 | email, otp, or appId not provided |
| Invalid email | 400 | Email format invalid |
| Invalid OTP | 400 | OTP not found or doesn't match app |
| Expired OTP | 400 | OTP validity window (10 min) exceeded |
| Too many attempts | 400 | 5 verification attempts exceeded |

## Paid Apps

OTPs are generated for these paid apps:

- `learn-ai` - Learn-AI
- `learn-developer` - Learn-Developer
- `learn-management` - Learn-Management
- `learn-pr` - Learn-PR
- `main` - iiskills.cloud (main app)
- `mpa` - My Personal Assistant

Free apps (learn-apt, learn-chemistry, learn-geography, learn-math, learn-physics, learn-biology) do not require payment or OTP.

## Usage Example

### Frontend Integration

```javascript
// After payment completion, user receives OTP via email/SMS
// User enters OTP in verification form

async function verifyOTP(email, otp, appId) {
  const response = await fetch('/api/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, appId })
  });
  
  const result = await response.json();
  
  if (result.success) {
    // OTP verified! Grant access to app
    console.log('Access granted to:', result.appId);
    // Redirect to app or enable features
  } else {
    // Show error message
    console.error('Verification failed:', result.error);
  }
}
```

### Razorpay Integration

```javascript
// When creating Razorpay order, include app_id in notes
const options = {
  amount: 49900, // Amount in paise (499 INR)
  currency: 'INR',
  receipt: `receipt_${Date.now()}`,
  notes: {
    app_id: 'learn-ai', // IMPORTANT: Include app identifier
    user_email: 'user@example.com',
    user_phone: '+919876543210'
  }
};

const order = await razorpay.orders.create(options);
```

## Maintenance

### Cleanup Expired OTPs

A helper function is provided to clean up old OTPs:

```sql
-- Run periodically (e.g., daily cron job)
SELECT cleanup_expired_otps();
```

This deletes expired, unverified OTPs older than 24 hours to keep the database clean.

## Future Enhancements

- [ ] Add Vonage/Nexmo SMS support (currently Twilio only)
- [ ] Implement admin authentication middleware
- [ ] Add OTP resend functionality with rate limiting
- [ ] Add webhook retry mechanism for failed OTP deliveries
- [ ] Add monitoring/alerting for OTP delivery failures
- [ ] Add support for multiple languages in OTP messages
- [ ] Add OTP delivery status tracking (delivered, failed, pending)
- [ ] Add user dashboard to view OTP history

## Support

For issues or questions:
1. Check error messages in API responses
2. Verify environment variables are set correctly
3. Check Twilio/SendGrid dashboards for delivery status
4. Review server logs for detailed error information

## License

MIT - Part of iiskills.cloud platform
