# 🔒 Security Guide - Protecting Your Credentials

## ❌ NEVER Push These Files to GitHub

- `.env.local` - Contains your actual Supabase credentials
- `.env` - Contains any environment variables
- Any file with API keys, passwords, or secrets

## ✅ What's Safe to Push

- `.env.local.example` - Template with placeholder values
- `.gitignore` - List of files to exclude from git
- All other code files

## Current Status: SECURE ✅

Your repository is already configured correctly:

1. **.gitignore includes `.env`**
   - This automatically excludes `.env`, `.env.local`, `.env.production`, etc.
   - Git will never track these files

2. **.env.local.example is safe**
   - Contains placeholder values only
   - Example: `NEXT_PUBLIC_SUPABASE_URL=your-project-url-here`
   - Other developers use this as a template

## How to Use .env Files Correctly

### On Your Development Machine

1. **Create .env.local locally** (DO NOT push this):

   ```bash
   cp .env.local.example .env.local
   ```

2. **Add your real credentials** to `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xyzcompany.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Git automatically ignores it**:
   ```bash
   git status
   # .env.local will NOT appear in the list
   ```

### For Team Members or Deployment

1. **They copy .env.local.example**:

   ```bash
   cp .env.local.example .env.local
   ```

2. **They add their own credentials** (or you share securely via password manager, encrypted email, etc.)

3. **Each person has their own .env.local** that is NEVER pushed to git

## Verification Checklist

- [x] `.env` is in `.gitignore`
- [x] `.env.local` does not exist in git repository
- [x] `.env.local.example` exists with placeholder values
- [x] Your real credentials are only in your local `.env.local`

## What If I Accidentally Pushed Credentials?

If you accidentally pushed `.env.local` or exposed your credentials:

### Immediate Actions

1. **Rotate your Supabase keys immediately**:
   - Go to Supabase Dashboard → Settings → API
   - Click "Reset" on your API keys
   - Update your local `.env.local` with new keys

2. **Remove the file from git history**:

   ```bash
   # Remove from current commit (if just committed)
   git rm --cached .env.local
   git commit --amend -m "Remove accidentally committed credentials"
   git push --force

   # If pushed several commits ago, you need to rewrite history
   # (More complex - contact your team lead)
   ```

3. **Add to .gitignore if not already there**:
   ```bash
   echo ".env.local" >> .gitignore
   git add .gitignore
   git commit -m "Add .env.local to gitignore"
   ```

### Important Note

Even after removing from git, the credentials may be visible in git history. Always rotate/reset the keys when in doubt.

## Current .gitignore Content

```
node_modules/
.next/
.env              ← This protects .env.local
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

## Best Practices

1. ✅ Keep credentials in `.env.local` only
2. ✅ Never hardcode credentials in code
3. ✅ Use environment variables for all secrets
4. ✅ Share `.env.local.example` with placeholders
5. ✅ Share actual credentials via secure channels (password manager, encrypted chat)
6. ✅ Rotate keys if compromised
7. ✅ Use different keys for development and production

## For Production Deployment

When deploying to Vercel, Netlify, or other platforms:

1. **Don't use .env.local**
2. **Add environment variables in the platform's dashboard**:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - etc.

3. **Never commit production credentials to git**

## Quick Reference

| File                 | Push to Git? | Purpose                             |
| -------------------- | ------------ | ----------------------------------- |
| `.env.local`         | ❌ NO        | Your actual credentials (local dev) |
| `.env.local.example` | ✅ YES       | Template for others                 |
| `.env.production`    | ❌ NO        | Production credentials              |
| `.gitignore`         | ✅ YES       | Tells git what to ignore            |
| Code files           | ✅ YES       | Your application code               |

---

**Summary**: Your setup is secure! The `.env.local` file (when you create it) will automatically be ignored by git. Only push `.env.local.example` which has placeholder values.
