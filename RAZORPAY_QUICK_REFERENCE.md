# Razorpay Payment Integration - Quick Reference

## Quick Setup (Development)

1. **Install Dependencies**
   ```bash
   cd apps/main
   npm install razorpay
   ```

2. **Set Environment Variables**
   ```bash
   # Add to .env.local
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_test_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
   ```

3. **Test Endpoints**
   ```bash
   # Run unit tests
   node test-payment-utils.js
   
   # Start dev server
   cd apps/main && npm run dev
   
   # Test endpoints (in another terminal)
   node test-payment-integration.js
   ```

## API Endpoints Overview

### POST /api/pay
**Purpose:** Create Razorpay order

**Request:**
```bash
curl -X POST http://localhost:3000/api/pay \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "phone": "9876543210",
    "appId": "learn-ai",
    "appName": "Learn AI",
    "amount": 99900
  }'
```

**Response:** Order ID + key for checkout

---

### POST /api/payment/webhook
**Purpose:** Receive payment notifications

**Configured in:** Razorpay Dashboard → Webhooks

**Events:** `payment.captured`, `payment.failed`

**Actions on Success:**
- ✅ Generate 6-digit OTP
- ✅ Store in database
- ✅ Send email to user

---

### POST /api/verify-otp
**Purpose:** Verify OTP and activate membership

**Request:**
```bash
curl -X POST http://localhost:3000/api/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "appId": "learn-ai",
    "otp": "123456"
  }'
```

**Response:** Membership details (1 year)

## File Structure

```
lib/
├── razorpay.js              # Core utilities
│   ├── getRazorpayClient()
│   ├── verifyWebhookSignature()
│   ├── generateSecureOTP()
│   └── calculateMembershipExpiry()
│
├── mockDatabase.js          # Storage (replace in production)
│   ├── storePayment()
│   ├── getPayment()
│   ├── storeOTP()
│   ├── verifyOTP()
│   ├── storeMembership()
│   └── getMembership()
│
└── membershipEmail.js       # Email service (mock)
    └── sendMembershipEmail()

apps/main/pages/api/
├── pay.js                   # POST /api/pay
├── payment/webhook.js       # POST /api/payment/webhook
└── verify-otp.js            # POST /api/verify-otp
```

## Security Checklist

- ✅ Webhook signature verification (HMAC SHA256)
- ✅ Constant-time comparison
- ✅ Secure OTP generation (crypto.randomInt)
- ✅ Input validation (email, amount, OTP format)
- ✅ Server-side only operations
- ✅ Environment variable protection
- ✅ OTP expiry (30 minutes)
- ✅ Single-use OTP enforcement

## Common Tasks

### Test Payment Flow (Manual)

1. **Create Order:**
   ```bash
   curl -X POST http://localhost:3000/api/pay \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","name":"Test","appId":"learn-ai","appName":"Learn AI","amount":99900}'
   ```
   
2. **Simulate Webhook** (use actual signature in production):
   ```bash
   # Note: Signature verification will fail in test - that's expected
   curl -X POST http://localhost:3000/api/payment/webhook \
     -H "Content-Type: application/json" \
     -H "x-razorpay-signature: test_signature" \
     -d '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_test","order_id":"ORDER_ID_FROM_STEP_1","amount":99900}}}}'
   ```
   
3. **Verify OTP** (get OTP from webhook console output):
   ```bash
   curl -X POST http://localhost:3000/api/verify-otp \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","appId":"learn-ai","otp":"OTP_FROM_WEBHOOK"}'
   ```

### Debug Webhook Issues

**Check signature:**
```javascript
const crypto = require("crypto");
const body = JSON.stringify(webhookPayload);
const secret = "your_webhook_secret";
const signature = crypto
  .createHmac("sha256", secret)
  .update(body)
  .digest("hex");
console.log("Expected signature:", signature);
```

**Test webhook locally:**
```bash
# Use ngrok to expose local server
ngrok http 3000

# Configure ngrok URL in Razorpay dashboard
# https://xxxx.ngrok.io/api/payment/webhook
```

### View Stored Data (Development)

```javascript
// In apps/main or use node REPL
const { getAllRecords } = require("../../lib/mockDatabase");
console.log(JSON.stringify(getAllRecords(), null, 2));
```

## Test Cards (Razorpay Test Mode)

| Card Number | CVV | Expiry | Result |
|-------------|-----|--------|--------|
| 4111 1111 1111 1111 | Any | Future | Success |
| 5555 5555 5555 4444 | Any | Future | Success |
| 4000 0000 0000 0002 | Any | Future | Declined |

## Production Checklist

### Before Going Live:

- [ ] Switch to Razorpay Live Mode credentials
- [ ] Update `RAZORPAY_KEY_ID` to `rzp_live_*`
- [ ] Update `RAZORPAY_KEY_SECRET` 
- [ ] Update `RAZORPAY_WEBHOOK_SECRET`
- [ ] Configure webhook URL in production
- [ ] Replace mockDatabase with real database
- [ ] Replace mock email with real email service
- [ ] Add rate limiting
- [ ] Add logging and monitoring
- [ ] Test full payment flow end-to-end
- [ ] Set up alerts for payment failures
- [ ] Configure refund handling
- [ ] Add payment reconciliation

### Database Migration:

```sql
-- See RAZORPAY_INTEGRATION_GUIDE.md for full schema
CREATE TABLE payments (...);
CREATE TABLE otps (...);
CREATE TABLE memberships (...);
```

### Email Service Setup:

```javascript
// Replace in lib/membershipEmail.js
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendMembershipEmail(params) {
  const result = await sgMail.send({
    from: "iiskills <noreply@iiskills.cloud>",
    to: params.email,
    subject: `Membership Activated - ${params.appName}`,
    html: generateMembershipEmailHTML(params),
  });
  return result;
}
```

## Error Codes Reference

### /api/pay Errors

| Code | Error | Solution |
|------|-------|----------|
| 400 | Missing required fields | Check request body |
| 400 | Invalid email format | Validate email |
| 400 | Invalid amount | Amount must be positive integer |
| 500 | Razorpay error | Check credentials, logs |

### /api/payment/webhook Errors

| Code | Error | Solution |
|------|-------|----------|
| 400 | Signature missing | Check header |
| 401 | Invalid signature | Verify webhook secret |
| 500 | Processing failed | Check logs |

### /api/verify-otp Errors

| Code | Error | Solution |
|------|-------|----------|
| 400 | Missing fields | Check request body |
| 400 | Invalid email | Validate format |
| 400 | Invalid OTP format | 6-8 alphanumeric |
| 400 | OTP not found | User must complete payment first |
| 400 | OTP expired | Generate new payment |
| 400 | OTP already used | Can only use once |

## Support Resources

- **Razorpay Dashboard:** https://dashboard.razorpay.com
- **Test Cards:** https://razorpay.com/docs/payments/payments/test-card-details/
- **Webhook Events:** https://razorpay.com/docs/webhooks/
- **API Reference:** https://razorpay.com/docs/api/

## Quick Tips

💡 **Tip 1:** Use Razorpay Dashboard → Events Log to debug webhooks

💡 **Tip 2:** Test mode payments use `rzp_test_*` credentials

💡 **Tip 3:** OTP expires in 30 minutes - adjust in `lib/mockDatabase.js`

💡 **Tip 4:** Check email service provider (SendGrid) for delivery logs

💡 **Tip 5:** Use ngrok for local webhook testing

## Next Steps

1. ✅ Test all endpoints locally
2. ✅ Review security implementation
3. 📝 Build frontend payment UI
4. 📝 Replace mock database
5. 📝 Replace mock email service
6. 📝 Add monitoring and logging
7. 📝 Deploy to production
8. 📝 Test with real payments

---

**Need Help?** See `RAZORPAY_INTEGRATION_GUIDE.md` for detailed documentation.
