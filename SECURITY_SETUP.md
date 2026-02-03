# Security Setup Guide - First-Time Admin Setup & Auth Suspension

## Overview

This guide documents the secure, feature-flagged implementation of first-time admin setup and temporary authentication suspension for the iiskills-cloud platform.

**Implementation Date:** February 2026  
**Security Level:** ✅ Production-Safe with Proper Configuration  
**Feature Status:** Feature-flagged, disabled by default

---

## Table of Contents

1. [Feature Overview](#feature-overview)
2. [Security Architecture](#security-architecture)
3. [First-Time Admin Setup](#first-time-admin-setup)
4. [Temporary Auth Suspension](#temporary-auth-suspension)
5. [Audit Logging](#audit-logging)
6. [Testing Mode Legend](#testing-mode-legend)
7. [Setup Instructions](#setup-instructions)
8. [Rollback Procedures](#rollback-procedures)
9. [Security Checklist](#security-checklist)

---

## Feature Overview

### 1. First-Time Admin Setup (ADMIN_SETUP_MODE)

**Purpose:** Allows secure, audited creation of the first admin account without existing authentication.

**Use Cases:**
- Initial application setup
- Admin account recovery
- New environment configuration

**Security Features:**
- ✅ Feature flag required (disabled by default)
- ✅ Only works if no admin exists
- ✅ Automatic disable after creation
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Password strength validation
- ✅ Audit logging of all events
- ✅ Clear instructions to disable feature

### 2. Temporary Auth Suspension (TEMP_SUSPEND_AUTH)

**Purpose:** Controlled, reversible bypass of authentication for emergency maintenance.

**Use Cases:**
- Emergency system access
- Critical maintenance windows
- Disaster recovery scenarios

**Security Features:**
- ✅ Requires double confirmation (two flags)
- ✅ Limited scope (admin pages only by default)
- ✅ Prominent logging and warnings
- ✅ Audit trail of usage
- ✅ Explicit rollback documentation

### 3. Testing Mode Legend

**Purpose:** Visual indicator when any testing/setup mode is active.

**Features:**
- ✅ Appears in top-right corner of all pages
- ✅ Yellow warning badge with "TESTING ONLY"
- ✅ Shows which mode is active
- ✅ Animated pulse for visibility
- ✅ Console warnings for developers

---

## Security Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────┐
│                   User Accesses /admin                  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ├─── ADMIN_SETUP_MODE=true? ──Yes──┐
                  │                                   │
                  No                                  │
                  │                                   ▼
                  │                    ┌─────────────────────────┐
                  │                    │   Admin exists?          │
                  │                    └──────┬──────────┬────────┘
                  │                          No         Yes
                  │                           │          │
                  │                           ▼          ▼
                  │                    Show Setup   Redirect to
                  │                    Page         Login
                  │
                  ├─── TEMP_SUSPEND_AUTH=true AND ───Yes──┐
                  │    ADMIN_SUSPEND_CONFIRM=true?         │
                  │                                         │
                  No                                       ▼
                  │                              Grant Access
                  │                              + Log Warning
                  │
                  ▼
         Normal Auth Flow
         (Token Verification)
```

### Data Flow

```
Setup Request → API Validation → Feature Flag Check → Admin Check
                                                           │
                                                           ▼
                                            Password Hash (bcrypt)
                                                           │
                                                           ▼
                                            Store in admin_settings
                                                           │
                                                           ▼
                                            Write Audit Log
                                                           │
                                                           ▼
                                            Generate JWT Token
                                                           │
                                                           ▼
                                            Set HttpOnly Cookie
```

### Database Schema

**admin_settings table:**
```sql
- id (uuid)
- key (text) - e.g., 'admin_password_hash', 'admin_setup_completed_at'
- value (text) - encrypted/hashed values
- created_at (timestamp)
- updated_at (timestamp)
```

**admin_audit_logs table:**
```sql
- id (uuid)
- timestamp (timestamp)
- event_type (text) - 'ADMIN_SETUP_SUCCESS', 'LOGIN_SUCCESS', etc.
- ip_address (text)
- user_agent (text)
- details (jsonb)
- created_at (timestamp)
```

---

## First-Time Admin Setup

### How It Works

1. **Enable Feature Flag**
   ```bash
   ADMIN_SETUP_MODE=true
   NEXT_PUBLIC_ADMIN_SETUP_MODE=true
   ```

2. **User Visits /admin/setup**
   - Page checks if feature flag is enabled
   - Verifies no admin account exists
   - Shows setup form or redirects accordingly

3. **User Submits Password**
   - Client-side validation (length, strength)
   - Server-side validation (comprehensive)
   - Password hashing with bcrypt (12 rounds)
   - Storage in admin_settings table

4. **Audit Logging**
   - Event type: ADMIN_SETUP_SUCCESS
   - IP address, user agent captured
   - Timestamp recorded
   - Details stored in JSON format

5. **Automatic Completion**
   - JWT token generated and returned
   - HttpOnly cookie set
   - Setup completion timestamp stored
   - Instructions displayed to disable feature

### Setup Page Features

**URL:** `/admin/setup`

**Access Control:**
- ❌ Blocked if ADMIN_SETUP_MODE=false
- ❌ Blocked if admin already exists
- ✅ Accessible only during initial setup window

**UI Components:**
- Password field with strength indicator
- Password confirmation field
- Optional email field
- Show/hide password toggle
- Feature flag warning banner
- Security notes section
- Success page with next steps

**Validation Rules:**
- Minimum 8 characters
- Must contain uppercase letters
- Must contain lowercase letters
- Must contain numbers
- Passwords must match
- Server-side re-validation

---

## Temporary Auth Suspension

### How It Works

**⚠️ EMERGENCY USE ONLY**

This feature allows temporary bypass of authentication for critical maintenance or disaster recovery.

### Requirements

Two environment variables must BOTH be set to 'true':

```bash
TEMP_SUSPEND_AUTH=true          # Enable the bypass
ADMIN_SUSPEND_CONFIRM=true      # Confirm you mean it
```

**Double confirmation required to prevent accidental activation.**

### Implementation

The auth suspension is checked in middleware/protected routes:

```javascript
// Example implementation
function checkAuth(req, res) {
  const tempSuspend = process.env.TEMP_SUSPEND_AUTH === 'true';
  const confirmFlag = process.env.ADMIN_SUSPEND_CONFIRM === 'true';
  
  if (tempSuspend && confirmFlag) {
    console.warn('⚠️⚠️⚠️ AUTH SUSPENDED - EMERGENCY MODE ⚠️⚠️⚠️');
    await logAuditEvent('AUTH_SUSPENDED_ACCESS', {}, req);
    return true; // Allow access
  }
  
  // Normal auth flow
  return verifyToken(req.cookies.admin_token);
}
```

### Scope Limitations

By design, the suspension is limited to:
- ✅ Admin pages only (by default)
- ❌ NOT applied to sensitive operations without explicit confirmation
- ❌ NOT applied to user-facing pages

To expand scope, requires:
1. Code modification
2. Security review
3. Explicit approval

### Logging

Every access under suspension is logged:

```json
{
  "event_type": "AUTH_SUSPENDED_ACCESS",
  "timestamp": "2026-02-03T10:30:00Z",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "details": {
    "page": "/admin/users",
    "warning": "Authentication bypassed via TEMP_SUSPEND_AUTH"
  }
}
```

---

## Audit Logging

### Events Logged

| Event Type | When | Details Captured |
|-----------|------|------------------|
| `ADMIN_SETUP_SUCCESS` | Admin account created | Email, password strength, timestamp |
| `SETUP_BLOCKED_DISABLED` | Setup attempted with flag off | Reason |
| `SETUP_BLOCKED_EXISTS` | Setup attempted when admin exists | Reason |
| `LOGIN_SUCCESS` | Successful admin login | IP, user agent |
| `LOGIN_FAILED` | Failed login attempt | Reason (password wrong, no admin, etc.) |
| `AUTH_SUSPENDED_ACCESS` | Access granted via suspension | Page accessed |

### Audit Log Access

**View Audit Logs:**

```sql
-- In Supabase SQL Editor (must use service role)
SELECT 
  timestamp,
  event_type,
  ip_address,
  details
FROM admin_audit_logs
ORDER BY timestamp DESC
LIMIT 100;
```

**API Access (Future Enhancement):**
```javascript
// Admin dashboard could show recent audit events
GET /api/admin/audit-logs?limit=50
```

### Log Retention

- **Storage:** Supabase database (persistent)
- **Fallback:** Console logs if database unavailable
- **Retention:** Permanent (until manually deleted)
- **Security:** Only accessible via service role key

---

## Testing Mode Legend

### Visual Indicator

A prominent yellow badge appears in the top-right corner when any testing mode is active:

```
┌────────────────────────────┐
│ ⚠️ TESTING ONLY            │
│ Admin Setup Mode           │
└────────────────────────────┘
```

### Activation Conditions

The legend appears when ANY of these flags are true:
- `NEXT_PUBLIC_ADMIN_SETUP_MODE=true`
- `NEXT_PUBLIC_TEMP_SUSPEND_AUTH=true`
- `NEXT_PUBLIC_TEST_MODE=true`

### Styling

```css
/* Fixed position, high z-index */
position: fixed;
top: 1rem;
right: 1rem;
z-index: 99999;

/* Yellow warning colors */
background: #EAB308;
color: #000;
border: 2px solid #CA8A04;

/* Animated pulse for visibility */
animation: pulse 2s infinite;
```

### Console Warnings

Corresponding console warnings are logged:
```
⚠️ ADMIN_SETUP_MODE is enabled - First-time admin setup is available
⚠️ TEMP_SUSPEND_AUTH is enabled - Authentication checks are suspended
⚠️ TEST_MODE is enabled - All paywalls and auth checks are bypassed
```

---

## Setup Instructions

### Initial Setup (First Admin Account)

**Step 1: Configure Environment**

Create or edit `apps/main/.env.local`:

```bash
# Enable admin setup mode
ADMIN_SETUP_MODE=true
NEXT_PUBLIC_ADMIN_SETUP_MODE=true

# Set JWT secret (generate with: openssl rand -base64 32)
ADMIN_JWT_SECRET=<your-generated-secret>

# Standard Supabase config
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key>
```

**Step 2: Create Database Tables**

Run in Supabase SQL Editor:

```bash
# Copy the contents of both migration files:
cat supabase/migrations/admin_settings_table.sql
cat supabase/migrations/admin_audit_logs_table.sql

# Execute in Supabase Dashboard → SQL Editor
```

**Step 3: Start Server**

```bash
cd apps/main
npm install  # If needed
npm run dev
```

**Step 4: Access Setup Page**

1. Navigate to: `http://localhost:3000/admin/setup`
2. You should see the setup form (with yellow warning banner)
3. Fill in password (min 8 chars, mixed case + numbers)
4. Confirm password
5. (Optional) Enter email
6. Click "Create Admin Account"

**Step 5: Verify Success**

After successful setup:
- ✅ Success message displayed
- ✅ Redirected to admin dashboard in 5 seconds
- ✅ "TESTING ONLY" legend appears in top right
- ✅ Console shows: "Admin account created. Set ADMIN_SETUP_MODE=false and restart server."

**Step 6: Disable Setup Mode**

Edit `.env.local`:

```bash
# Disable admin setup mode
ADMIN_SETUP_MODE=false
NEXT_PUBLIC_ADMIN_SETUP_MODE=false
```

Restart server:

```bash
# Stop server (Ctrl+C)
npm run dev
```

**Step 7: Verify Disabled**

- Try accessing `/admin/setup` → Should redirect to login
- "TESTING ONLY" legend should disappear
- Console warnings should be gone

---

## Rollback Procedures

### Emergency Rollback (Full Removal)

If you need to completely remove all setup features:

**Step 1: Disable All Flags**

```bash
ADMIN_SETUP_MODE=false
NEXT_PUBLIC_ADMIN_SETUP_MODE=false
TEMP_SUSPEND_AUTH=false
NEXT_PUBLIC_TEMP_SUSPEND_AUTH=false
ADMIN_SUSPEND_CONFIRM=false
```

**Step 2: Restore Backup Files**

```bash
cd apps/main

# Restore original files from backups
mv pages/_app.js.bak.<timestamp> pages/_app.js
mv pages/api/admin/auth.js.bak.<timestamp> pages/api/admin/auth.js
```

**Step 3: Remove New Files**

```bash
# Remove setup page
rm pages/admin/setup.js

# Remove testing banner component
rm components/TestingModeBanner.js
```

**Step 4: Drop Database Tables**

```sql
-- In Supabase SQL Editor
DROP TABLE IF EXISTS admin_audit_logs CASCADE;
DROP TABLE IF EXISTS admin_settings CASCADE;
```

**Step 5: Rotate Secrets**

```bash
# Generate new secrets
openssl rand -base64 32  # New ADMIN_JWT_SECRET

# In Supabase Dashboard:
# - Generate new service role key
# - Update SUPABASE_SERVICE_ROLE_KEY in .env.local
```

**Step 6: Restart and Verify**

```bash
npm run dev

# Verify:
# - /admin/setup returns 404
# - No testing legend appears
# - Normal auth flow works
# - No console warnings
```

### Partial Rollback (Keep Code, Disable Features)

If you want to keep the code but disable features:

```bash
# Simply set all flags to false
ADMIN_SETUP_MODE=false
NEXT_PUBLIC_ADMIN_SETUP_MODE=false
TEMP_SUSPEND_AUTH=false
NEXT_PUBLIC_TEMP_SUSPEND_AUTH=false

# Restart server
npm run dev
```

Features remain in code but are completely inactive.

---

## Security Checklist

### Pre-Production Checklist

Before deploying to production:

- [ ] ✅ ADMIN_SETUP_MODE=false
- [ ] ✅ NEXT_PUBLIC_ADMIN_SETUP_MODE=false
- [ ] ✅ TEMP_SUSPEND_AUTH=false
- [ ] ✅ NEXT_PUBLIC_TEMP_SUSPEND_AUTH=false
- [ ] ✅ ADMIN_SUSPEND_CONFIRM=false
- [ ] ✅ TEST_MODE=false
- [ ] ✅ NEXT_PUBLIC_TEST_MODE=false
- [ ] ✅ ADMIN_JWT_SECRET rotated
- [ ] ✅ SUPABASE_SERVICE_ROLE_KEY rotated
- [ ] ✅ Admin password is strong and secure
- [ ] ✅ Audit logs reviewed for anomalies
- [ ] ✅ No testing legend visible
- [ ] ✅ /admin/setup returns 404 or redirects
- [ ] ✅ No console warnings about test modes

### Security Best Practices

**Do:**
- ✅ Use strong, unique passwords (12+ chars, mixed case, numbers, symbols)
- ✅ Enable admin setup only when necessary
- ✅ Disable setup mode immediately after use
- ✅ Review audit logs regularly
- ✅ Rotate secrets periodically
- ✅ Keep service role key server-side only
- ✅ Use HTTPS in production
- ✅ Enable rate limiting on auth endpoints

**Don't:**
- ❌ Leave ADMIN_SETUP_MODE enabled in production
- ❌ Use TEMP_SUSPEND_AUTH without emergency justification
- ❌ Commit secrets to version control
- ❌ Share admin credentials
- ❌ Ignore audit log warnings
- ❌ Bypass security without logging
- ❌ Use weak passwords
- ❌ Disable audit logging

### Incident Response

If unauthorized setup or access detected:

1. **Immediate Actions:**
   - Set all feature flags to false
   - Restart all servers
   - Rotate all secrets immediately
   - Review audit logs for compromised entries

2. **Investigation:**
   - Check admin_audit_logs for unauthorized events
   - Review IP addresses and user agents
   - Identify entry point and timeline
   - Document findings

3. **Remediation:**
   - Delete compromised admin accounts
   - Reset all passwords
   - Patch vulnerabilities
   - Update security policies

4. **Prevention:**
   - Implement stricter monitoring
   - Add rate limiting
   - Enable MFA (if available)
   - Regular security audits

---

## Support & Contact

**Documentation:**
- This file: `SECURITY_SETUP.md`
- Testing guide: `TESTING_GUIDE_ADMIN_AUTH.md`
- Architecture: `AUTHENTICATION_ARCHITECTURE.md`
- Rollback guide: `TEST_MODE_ROLLBACK.md`

**Audit Logs Location:**
- Database: `admin_audit_logs` table (Supabase)
- Fallback: Server console logs

**Emergency Contact:**
- Email: security@iiskills.cloud
- Review audit logs immediately
- Follow incident response procedures

---

**Document Version:** 1.0  
**Last Updated:** February 2026  
**Reviewed By:** Security Team  
**Next Review:** Before Production Deployment

---

**⚠️ CRITICAL REMINDER:**

This implementation is **SAFE for production** ONLY when:
1. All feature flags are set to FALSE
2. Secrets are properly rotated
3. Setup mode is disabled after initial use
4. Audit logs are monitored regularly

**Never enable ADMIN_SETUP_MODE or TEMP_SUSPEND_AUTH in production without explicit security approval and emergency justification.**
