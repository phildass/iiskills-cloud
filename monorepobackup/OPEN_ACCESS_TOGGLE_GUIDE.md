# Open Access Quick Toggle Guide

**Purpose:** One-click guide to enable/disable open access mode across the entire monorepo  
**Last Updated:** February 7, 2026

---

## 🚀 Enable Open Access Mode (All Apps)

### Quick Steps:

1. **Set Environment Variable:**
   ```bash
   # Add to .env.local in the root directory
   echo "NEXT_PUBLIC_DISABLE_AUTH=true" >> .env.local
   ```

2. **Rebuild All Apps:**
   ```bash
   ./deploy-all.sh
   ```

3. **Restart (if using PM2):**
   ```bash
   pm2 restart all
   ```

4. **Verify:**
   - Visit any app landing page (e.g., http://localhost:3016 for Learn Management)
   - Navigate to a protected route (e.g., `/modules/1/lesson`)
   - Should see content immediately without login prompt
   - Check browser console for: `⚠️ AUTH DISABLED: PaidUserProtectedRoute bypassed`

---

## 🔒 Disable Open Access Mode (Restore Authentication)

### Quick Steps:

1. **Update Environment Variable:**
   ```bash
   # Edit .env.local - change to:
   NEXT_PUBLIC_DISABLE_AUTH=false
   ```

2. **Rebuild All Apps:**
   ```bash
   ./deploy-all.sh
   ```

3. **Restart (if using PM2):**
   ```bash
   pm2 restart all
   ```

4. **Verify:**
   - Visit a protected route
   - Should see login/registration prompt
   - Guest mode button should still be available
   - No "AUTH DISABLED" warnings in console

---

## 🌟 Guest Mode (Per-Session Access)

**When:** You want users to browse without full open access

**How:**
- Users click "Continue as Guest" button on protected pages
- Adds `?guest=true` to URL
- Grants read-only access for that session only
- Works even when `NEXT_PUBLIC_DISABLE_AUTH=false`

**Enable for all apps:** No setup needed - guest mode is always available

---

## 📱 All Apps Affected

When toggling open access, these apps are affected:

| App | Port | URL (localhost) |
|-----|------|-----------------|
| Main Portal | 3000 | http://localhost:3000 |
| Learn Developer | 3010 | http://localhost:3010 |
| Learn AI | 3011 | http://localhost:3011 |
| Learn Govt Jobs | 3012 | http://localhost:3012 |
| Learn Management | 3016 | http://localhost:3016 |
| Learn PR | 3017 | http://localhost:3017 |
| Learn Physics | 3013 | http://localhost:3013 |
| Learn Chemistry | 3014 | http://localhost:3014 |
| Learn Math | 3015 | http://localhost:3015 |
| Learn Geography | 3018 | http://localhost:3018 |
| Learn APT | 3019 | http://localhost:3019 |

---

## ⚡ One-Liner Commands

### Enable Open Access + Deploy All Apps:
```bash
echo "NEXT_PUBLIC_DISABLE_AUTH=true" > .env.local && ./deploy-all.sh && pm2 restart all
```

### Disable Open Access + Deploy All Apps:
```bash
echo "NEXT_PUBLIC_DISABLE_AUTH=false" > .env.local && ./deploy-all.sh && pm2 restart all
```

### Check Current Status:
```bash
grep NEXT_PUBLIC_DISABLE_AUTH .env.local
```

---

## 🔍 Troubleshooting

### Open Access Not Working?

1. **Check environment variable:**
   ```bash
   cat .env.local | grep DISABLE_AUTH
   ```
   Should show: `NEXT_PUBLIC_DISABLE_AUTH=true`

2. **Verify apps were rebuilt:**
   ```bash
   ls -la apps/learn-management/.next/BUILD_ID
   ```
   Check if timestamp is recent

3. **Check browser console:**
   - Should see: `⚠️ AUTH DISABLED: PaidUserProtectedRoute bypassed`
   - If not, clear cache and hard reload (Ctrl+Shift+R)

4. **Restart apps:**
   ```bash
   pm2 restart all
   pm2 logs --lines 50
   ```

### Still Seeing Login Prompts?

- Clear browser cache and cookies
- Try incognito/private browsing mode
- Check if `.env.local` is in the root directory (not in app subdirectories)
- Ensure no `.env.production` is overriding settings

---

## ⚠️ Production Warning

**CRITICAL:** Never enable open access in production!

```bash
# ❌ NEVER do this in production
NEXT_PUBLIC_DISABLE_AUTH=true

# ✅ ALWAYS use in production
NEXT_PUBLIC_DISABLE_AUTH=false
```

**Safeguards:**
- Add alerts when `NEXT_PUBLIC_DISABLE_AUTH=true` in production
- Use environment-specific config files
- Add pre-deployment checks
- Monitor logs for "AUTH DISABLED" messages

---

## 📊 Status Indicators

### When Open Access is ENABLED:
- ✅ No login/registration prompts
- ✅ Console: `⚠️ AUTH DISABLED: PaidUserProtectedRoute bypassed`
- ✅ Mock user: `dev@iiskills.cloud`
- ✅ All content immediately accessible

### When Open Access is DISABLED:
- ❌ Login/registration prompts appear
- ❌ No "AUTH DISABLED" in console
- ✅ Guest mode button still available
- ✅ Normal authentication flow

---

## 🎯 Use Cases

### When to ENABLE Open Access:
- 🧪 Testing new features
- 📊 Demos and presentations
- 🎨 UI/UX development
- 📸 Taking screenshots/videos
- 👥 Stakeholder previews
- 🚀 Pre-launch testing

### When to DISABLE Open Access:
- 🏭 Production deployment
- 🔒 Security audits
- 💳 Payment testing
- 👤 User authentication testing
- 📈 Analytics accuracy
- 🎫 Access control validation

---

## 📝 Quick Reference Table

| Action | Command | Expected Result |
|--------|---------|-----------------|
| Enable | `NEXT_PUBLIC_DISABLE_AUTH=true` | All content accessible |
| Disable | `NEXT_PUBLIC_DISABLE_AUTH=false` | Normal auth required |
| Check Status | `grep DISABLE_AUTH .env.local` | Shows current setting |
| Rebuild | `./deploy-all.sh` | Applies new settings |
| Restart | `pm2 restart all` | Reloads all apps |
| Test | Visit protected route | Verify expected behavior |

---

## 🔗 Related Documentation

- `OPEN_ACCESS_IMPLEMENTATION_COMPLETE.md` - Full implementation report
- `TEMPORARY_OPEN_ACCESS.md` - Detailed technical documentation
- `QUICK_REFERENCE_OPEN_ACCESS.md` - Additional quick reference
- `PUBLIC_ACCESS_QUICK_REFERENCE.md` - Public access guide

---

**Remember:** This is a powerful feature for testing and development. Use responsibly and always restore authentication before production deployment! 🚀
