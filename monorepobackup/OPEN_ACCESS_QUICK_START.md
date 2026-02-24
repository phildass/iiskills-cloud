# Quick Start: OPEN_ACCESS Mode

Enable complete open access across the entire iiskills-cloud monorepo with a single environment variable.

## 🚀 Enable Open Access

```bash
# Using the automated script (recommended)
./scripts/enable-open-access.sh
./deploy-all.sh
```

**OR manually:**

```bash
# Add to .env.local
OPEN_ACCESS=true

# Rebuild all apps
./deploy-all.sh
```

## 🔒 Disable Open Access

```bash
# Using the automated script (recommended)
./scripts/restore-authentication.sh
./deploy-all.sh
```

**OR manually:**

```bash
# Update .env.local
OPEN_ACCESS=false

# Rebuild all apps
./deploy-all.sh
```

## ✅ Verify

### Open Access is Active
- Navigate to any protected route
- Console shows: `⚠️ OPEN ACCESS MODE: All authentication bypassed - granting full access`
- Content loads without login prompt

### Authentication is Restored
- Navigate to a protected route
- Login/register screen appears
- Console does NOT show "OPEN ACCESS MODE" message

## 📚 Documentation

- **Primary Guide:** [OPEN_ACCESS_MODE.md](OPEN_ACCESS_MODE.md)
- **Implementation Details:** [OPEN_ACCESS_IMPLEMENTATION_SUMMARY.md](OPEN_ACCESS_IMPLEMENTATION_SUMMARY.md)
- **Legacy Docs:** [TEMPORARY_OPEN_ACCESS.md](TEMPORARY_OPEN_ACCESS.md) (deprecated)

## 🧪 Testing

Run the integration test suite:

```bash
node test-open-access-mode.js
```

Expected output: `✅ Passed: 24, ❌ Failed: 0`

## ⚠️ Important

- **Never** enable in production without explicit approval
- **Only** for testing, demos, and previews
- **Always** restore authentication before production deployment

## 💡 What Gets Bypassed

When `OPEN_ACCESS=true`:
- ✅ Authentication checks
- ✅ Login prompts
- ✅ Signup/registration screens
- ✅ Email verification
- ✅ Payment/paywall restrictions
- ✅ Admin access controls
- ✅ User session requirements

## 🎯 Affected Apps

All 11 apps support open access:
- Main Portal
- Learn AI, APT, Chemistry, Developer, Geography
- Learn Government Jobs, Management, Math, Physics, PR

---

**Need help?** See [OPEN_ACCESS_MODE.md](OPEN_ACCESS_MODE.md) for comprehensive documentation.
