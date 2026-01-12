# Quick Setup Checklist

Follow this checklist to get the Newsletter and AI Assistant system working.

## Prerequisites

- [ ] Supabase account with project created
- [ ] Google account for reCAPTCHA

## Step 1: Environment Variables (5 minutes)

### 1.1 Get Supabase Credentials (if not already configured)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy `Project URL` and `anon public` key

### 1.2 Get reCAPTCHA Keys (NEW)

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
2. Click **"Create"** or select existing site
3. For new site:
   - Label: "iiskills Newsletter"
   - reCAPTCHA type: **reCAPTCHA v3**
   - Domains: Add these (one per line):
     ```
     iiskills.cloud
     localhost
     ```
   - Accept Terms and Submit
4. Copy **Site Key** and **Secret Key**

### 1.3 Update .env.local Files

Update `.env.local` in the following locations:

#### Root Directory

```bash
cd /home/runner/work/iiskills-cloud/iiskills-cloud
cp .env.local.example .env.local
nano .env.local  # or use your preferred editor
```

Add these values:

```bash
# Existing Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NEW: reCAPTCHA credentials
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

#### Each learn-\* Directory (15 apps)

You can use this script to copy:

```bash
for dir in learn-*/; do
  cp .env.local "$dir/.env.local"
  echo "Copied to $dir"
done
```

Or manually update each:

- learn-ai/.env.local
- learn-apt/.env.local
- learn-chemistry/.env.local
- learn-data-science/.env.local
- learn-geography/.env.local
- learn-govt-jobs/.env.local
- learn-ias/.env.local
- learn-jee/.env.local
- learn-leadership/.env.local
- learn-management/.env.local
- learn-math/.env.local
- learn-neet/.env.local
- learn-physics/.env.local
- learn-pr/.env.local
- learn-winning/.env.local

- [ ] Root .env.local updated
- [ ] All learn-\* .env.local files updated

## Step 2: Database Setup (2 minutes)

### 2.1 Run SQL Migration

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Open `supabase/migrations/newsletter_subscribers.sql`
6. Copy entire contents
7. Paste into SQL Editor
8. Click **Run**
9. You should see success messages

Expected output:

```
NOTICE:  Newsletter subscribers table created successfully!
NOTICE:  You can now start collecting newsletter subscriptions.
```

### 2.2 Verify Table Creation

1. Go to **Table Editor** in Supabase
2. You should see `newsletter_subscribers` table
3. Columns should include:
   - id (uuid)
   - email (text)
   - subscribed_at (timestamptz)
   - source (text)
   - status (text)
   - created_at (timestamptz)
   - updated_at (timestamptz)

- [ ] SQL migration executed
- [ ] Table visible in Supabase
- [ ] Columns verified

## Step 3: Integrate Remaining Apps (Optional, ~5 min per app)

The following apps have components but need \_app.js integration:

- learn-apt, learn-chemistry, learn-data-science, learn-geography
- learn-govt-jobs, learn-ias, learn-jee, learn-leadership
- learn-management, learn-neet, learn-physics, learn-pr, learn-winning

Follow: `LEARN_APPS_INTEGRATION_GUIDE.md`

- [ ] learn-apt integrated
- [ ] learn-chemistry integrated
- [ ] learn-data-science integrated
- [ ] learn-geography integrated
- [ ] learn-govt-jobs integrated
- [ ] learn-ias integrated
- [ ] learn-jee integrated
- [ ] learn-leadership integrated
- [ ] learn-management integrated
- [ ] learn-neet integrated
- [ ] learn-physics integrated
- [ ] learn-pr integrated
- [ ] learn-winning integrated

## Step 4: Test (5 minutes)

### 4.1 Start Development Server

```bash
# For main app
npm run dev

# Or for specific learn app
cd learn-ai
npm run dev
```

### 4.2 Test Newsletter Popup

1. Open browser to `http://localhost:3000`
2. Wait 3 seconds
3. Newsletter popup should appear
4. Close popup
5. Clear localStorage: Browser DevTools → Application → Local Storage → Clear
6. Refresh page
7. Popup should appear again after 3 seconds

- [ ] Newsletter popup appears
- [ ] Popup can be closed
- [ ] Popup respects localStorage

### 4.3 Test Newsletter Page

1. Click "📧 Newsletter" in navigation
2. Page should load at `/newsletter`
3. Form should be visible
4. Enter test email: `test@example.com`
5. Click "Subscribe Now"
6. Should see success or reCAPTCHA verification

- [ ] Newsletter page loads
- [ ] Newsletter link works in navigation
- [ ] Form visible and functional

### 4.4 Test AI Assistant

1. Look for chat icon (💬) in bottom-right corner
2. Click to open chat
3. Chat window should slide up
4. Type: "Hello"
5. Press Enter or click send
6. Should receive a response mentioning current site

- [ ] AI Assistant icon visible
- [ ] Chat window opens
- [ ] Can send messages
- [ ] Receives responses
- [ ] Site-aware context works

### 4.5 Test Form Submission

1. Go to `/newsletter`
2. Enter valid email
3. Submit form
4. Check browser console (F12 → Console)
5. Should see no errors
6. Check Supabase Table Editor
7. Email should appear in `newsletter_subscribers` table

- [ ] Form submits without errors
- [ ] Email appears in database
- [ ] Success message displayed

## Step 5: Verify Cross-App Consistency

Test on multiple apps to ensure consistency:

### Main App

```bash
npm run dev
# Visit http://localhost:3000
```

- [ ] Newsletter popup works
- [ ] AI Assistant works
- [ ] Newsletter page works

### Learn-AI

```bash
cd learn-ai
npm run dev
# Visit http://localhost:3007
```

- [ ] Newsletter popup works
- [ ] AI Assistant works (mentions "artificial intelligence")
- [ ] Newsletter page works

### Learn-Math

```bash
cd learn-math
npm run dev
# Visit http://localhost:3002
```

- [ ] Newsletter popup works
- [ ] AI Assistant works (mentions "mathematics")
- [ ] Newsletter page works

## Troubleshooting

### Newsletter popup not showing

- Clear localStorage and refresh
- Check browser console for errors
- Verify useNewsletterPopup hook is imported in \_app.js

### Form submission fails

- Check reCAPTCHA keys in .env.local
- Verify Supabase credentials
- Check browser console and Network tab
- Run SQL migration if not done

### AI Assistant not visible

- Check z-index conflicts
- Verify component is imported in \_app.js
- Check browser console for errors

### Database errors

- Verify SQL migration was run
- Check Supabase project status
- Verify RLS policies are active

## Complete! 🎉

All features should now be working. For more details, see:

- `NEWSLETTER_AI_ASSISTANT_README.md` - Full documentation
- `LEARN_APPS_INTEGRATION_GUIDE.md` - Integration guide
- `IMPLEMENTATION_NEWSLETTER_AI.md` - Implementation summary

## Support

Questions? Contact: info@iiskills.cloud
