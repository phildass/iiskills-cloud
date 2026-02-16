# OTP Code Generation System - Specification

## Overview
Admin section feature for creating system-acceptable OTP (One-Time Password) codes to provide free entry or replacement access to users in case of errors or special circumstances.

## Requirements

### 1. OTP Code Generation
- Generate unique, secure OTP codes
- Codes should be:
  - 8-12 characters long
  - Alphanumeric (letters + numbers)
  - Case-insensitive for user convenience
  - System-verifiable

### 2. OTP Usage Scenarios
- **Free Entry**: Grant free access to paid courses
- **Replacement Access**: Restore access lost due to system errors
- **Promotional Access**: Provide temporary or permanent access for marketing
- **Testing Access**: Allow QA/testing without payment

### 3. Admin Interface Required
Location: `/apps/main/pages/admin/otp-codes.js`

Features:
- Generate new OTP codes with parameters:
  - Purpose (free entry, replacement, promotional, testing)
  - App/Course access (which apps the code unlocks)
  - Validity period (days/permanent)
  - Usage limit (single-use, multi-use, unlimited)
  - Notes/reason for generation
  
- View all generated OTP codes:
  - Code value
  - Creation date
  - Created by (admin username)
  - Purpose
  - Redemption status
  - Apps unlocked
  - Usage count / limit
  
- Revoke/Deactivate codes
- Search/Filter codes by status, purpose, date

### 4. Database Schema

#### Table: `otp_codes`
```sql
CREATE TABLE otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(12) UNIQUE NOT NULL,
  purpose VARCHAR(50) NOT NULL, -- 'free_entry', 'replacement', 'promotional', 'testing'
  apps_unlocked TEXT[] NOT NULL, -- Array of app IDs ['learn-ai', 'learn-developer']
  validity_days INTEGER, -- NULL = permanent
  usage_limit INTEGER, -- NULL = unlimited
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP, -- Calculated from validity_days
  revoked_at TIMESTAMP,
  revoked_by UUID REFERENCES auth.users(id)
);

-- Index for fast code lookup
CREATE INDEX idx_otp_codes_code ON otp_codes(code);
CREATE INDEX idx_otp_codes_active ON otp_codes(is_active) WHERE is_active = true;
```

#### Table: `otp_redemptions`
```sql
CREATE TABLE otp_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  otp_code_id UUID REFERENCES otp_codes(id),
  user_id UUID REFERENCES auth.users(id),
  email VARCHAR(255) NOT NULL,
  redeemed_at TIMESTAMP DEFAULT NOW(),
  ip_address VARCHAR(45)
);

-- Index for user redemption history
CREATE INDEX idx_otp_redemptions_user ON otp_redemptions(user_id);
CREATE INDEX idx_otp_redemptions_code ON otp_redemptions(otp_code_id);
```

### 5. API Endpoints

#### Generate OTP Code
```
POST /api/admin/otp/generate
{
  "purpose": "free_entry",
  "appsUnlocked": ["learn-ai", "learn-developer"],
  "validityDays": 30,
  "usageLimit": 1,
  "notes": "Special access for beta tester"
}
```

#### Validate OTP Code (User-facing)
```
POST /api/otp/validate
{
  "code": "ABC123XYZ",
  "email": "user@example.com"
}
```

#### Redeem OTP Code (User-facing)
```
POST /api/otp/redeem
{
  "code": "ABC123XYZ",
  "userId": "uuid-here"
}
```

#### List OTP Codes (Admin)
```
GET /api/admin/otp/list?status=active&purpose=free_entry
```

#### Revoke OTP Code (Admin)
```
POST /api/admin/otp/revoke
{
  "codeId": "uuid-here",
  "reason": "Code compromised"
}
```

### 6. User Flow

1. **Admin generates OTP code**
   - Admin fills out form in admin panel
   - System generates unique code
   - Code is stored in database
   - Admin receives/displays code to distribute

2. **User receives OTP code**
   - Via email, support ticket, or other communication
   
3. **User redeems code**
   - During registration or in account settings
   - Enters code in "Redeem Code" field
   - System validates code:
     - Is it active?
     - Has it expired?
     - Has usage limit been reached?
   
4. **System grants access**
   - Unlocks specified apps for user
   - Records redemption in database
   - Updates user's app access permissions
   - Sends confirmation email to user

### 7. Security Considerations

- Codes must be securely random (use crypto.randomBytes)
- Rate limiting on redemption attempts (prevent brute force)
- Admin action logging (who created/revoked codes)
- IP tracking for redemptions (detect abuse)
- Email verification required before redemption
- One code per user for single-use codes

### 8. Implementation Priority

**Phase 1 (Immediate):**
- Database schema creation
- Basic code generation API
- Admin UI for generating codes
- Code validation endpoint

**Phase 2 (Next):**
- User redemption interface
- Access grant logic
- Usage tracking and analytics
- Email notifications

**Phase 3 (Future):**
- Bulk code generation
- Export/import codes
- Advanced analytics dashboard
- Automated expiration cleanup

## Related Files to Create/Modify

1. `/apps/main/pages/admin/otp-codes.js` - Admin UI
2. `/apps/main/pages/api/admin/otp/generate.js` - Generate endpoint
3. `/apps/main/pages/api/admin/otp/list.js` - List endpoint
4. `/apps/main/pages/api/admin/otp/revoke.js` - Revoke endpoint
5. `/apps/main/pages/api/otp/validate.js` - User validation
6. `/apps/main/pages/api/otp/redeem.js` - User redemption
7. `/lib/otpManager.js` - OTP business logic
8. `/components/RedeemCodeForm.js` - User-facing component
9. Database migration scripts for Supabase

## Notes

This system provides flexibility for customer support and promotional activities while maintaining security and tracking. Admin can easily grant access without manual database manipulation.
