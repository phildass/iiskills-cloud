# TEMP_SUSPEND_AUTH Feature Flag

## ⚠️ CRITICAL SECURITY WARNING ⚠️

This feature flag provides a **TEMPORARY** authentication bypass for development and debugging purposes ONLY.

### Security Requirements

The TEMP_SUSPEND_AUTH bypass will ONLY activate when **BOTH** of these conditions are met:

1. `process.env.TEMP_SUSPEND_AUTH === 'true'`
2. `process.env.ADMIN_SUSPEND_CONFIRM === 'true'`

This dual-flag requirement ensures accidental activation is prevented.

### Usage

**DO NOT use this in production!** This is for development/testing only.

To enable (in .env.local):
```bash
TEMP_SUSPEND_AUTH=true
ADMIN_SUSPEND_CONFIRM=true
```

### Scope Limitations (MVP)

For the MVP, the auth bypass is limited to:
- Admin pages only (pages under `/admin/*`)
- Does NOT bypass payment/paywall restrictions
- Does NOT grant admin privileges to non-admin users
- Logging is enabled for all bypassed requests

### Implementation

The bypass should be implemented in authentication middleware/guards:

```javascript
// Example: In auth middleware
function checkAuth(req, res, next) {
  // Check if TEMP_SUSPEND_AUTH is enabled (DANGEROUS!)
  if (
    process.env.TEMP_SUSPEND_AUTH === 'true' && 
    process.env.ADMIN_SUSPEND_CONFIRM === 'true'
  ) {
    // Log the bypass
    console.warn('⚠️ AUTH BYPASSED - TEMP_SUSPEND_AUTH is enabled!', {
      path: req.path,
      ip: req.ip,
      timestamp: new Date().toISOString()
    });
    
    // Only allow bypass for admin pages
    if (req.path.startsWith('/admin')) {
      return next(); // Bypass auth
    }
  }
  
  // Normal auth flow
  // ... existing auth logic ...
}
```

### Audit Logging

All bypassed authentication requests should be logged to `logs/auth-bypass.log`:

```json
{
  "timestamp": "2026-02-03T08:00:00.000Z",
  "path": "/admin/dashboard",
  "ip": "127.0.0.1",
  "userAgent": "Mozilla/5.0...",
  "bypassed": true,
  "flags": {
    "TEMP_SUSPEND_AUTH": "true",
    "ADMIN_SUSPEND_CONFIRM": "true"
  }
}
```

### Disabling the Bypass

To disable (required before production deployment):

1. Remove or set to false in .env:
```bash
TEMP_SUSPEND_AUTH=false
ADMIN_SUSPEND_CONFIRM=false
```

2. Restart the application

3. Verify bypass is disabled by:
   - Attempting to access /admin without authentication
   - Checking that auth is enforced
   - Verifying no bypass warnings in logs

### Integration Points

The TEMP_SUSPEND_AUTH flag should be checked in:

1. **Authentication Middleware** (`lib/auth/middleware.js`)
   - Check before requiring login
   - Log all bypass attempts

2. **Protected Route Guards** (e.g., `ProtectedRoute.js`, `AdminProtectedRoute.js`)
   - Check before rendering protected content
   - Limited to admin routes only

3. **API Route Protection** (e.g., `/api/admin/*`)
   - Check before processing admin API requests
   - Log all bypassed API calls

### Testing the Flag

To test that the bypass works correctly:

1. Set both flags to true
2. Access /admin without logging in
3. Verify you can access admin pages
4. Check logs/auth-bypass.log for entries
5. Set flags to false
6. Verify auth is enforced again

### Monitoring

Monitor for unauthorized use in production:

```bash
# Check if flags are enabled (should be false in production)
grep -r "TEMP_SUSPEND_AUTH=true" .env* 
grep -r "ADMIN_SUSPEND_CONFIRM=true" .env*

# Check for bypass log entries
tail -f logs/auth-bypass.log
```

### Before Production Deployment Checklist

- [ ] TEMP_SUSPEND_AUTH is set to false or removed from .env
- [ ] ADMIN_SUSPEND_CONFIRM is set to false or removed from .env
- [ ] No bypass warnings appear in application logs
- [ ] Authentication is properly enforced on admin routes
- [ ] logs/auth-bypass.log is empty or does not exist
- [ ] .env.example does not include these flags as enabled

### Development Best Practices

1. **Never commit enabled flags to version control**
   - Keep them in .env.local only
   - Add to .gitignore

2. **Use sparingly**
   - Only when authentication setup is incomplete
   - Remove as soon as auth is working

3. **Document when used**
   - Note in commit messages if used for testing
   - Track in development logs

4. **Team Communication**
   - Inform team when bypass is enabled
   - Coordinate disabling before any shared deployments

## Phase 2 Enhancements

For Phase 2, consider:
- Time-limited bypass (auto-disable after X hours)
- IP whitelist for bypass (only allow from specific IPs)
- More granular scope control
- Automatic alerts when bypass is enabled
- Integration with monitoring/alerting systems
