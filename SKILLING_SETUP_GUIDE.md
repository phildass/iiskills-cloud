# Skilling Newsletter - Production Setup Guide

This guide walks you through setting up the AI-powered Skilling newsletter system in production.

## Prerequisites

- iiskills.cloud website deployed and running
- Supabase account with active project
- Node.js v16+ installed
- Access to server/VPS with PM2 (if self-hosting)
- Basic understanding of environment variables

## Step-by-Step Setup

### 1. Database Setup

**a) Run the Migration**

1. Log into your Supabase dashboard at https://supabase.com
2. Select your project
3. Go to **SQL Editor**
4. Click **New Query**
5. Copy the entire contents of `/supabase/migrations/courses_and_newsletter.sql`
6. Paste into the SQL editor
7. Click **Run**
8. Verify you see success messages

**Expected Result:**
- Tables created: `courses`, `newsletter_editions`, `newsletter_queue`
- Triggers added for auto-newsletter generation
- Row Level Security policies enabled

**b) Verify the Tables**

Go to **Table Editor** in Supabase and confirm you see:
- `courses` - 0 rows
- `newsletter_editions` - 0 rows
- `newsletter_queue` - 0 rows
- `newsletter_subscribers` - may have existing subscribers

### 2. OpenAI API Setup

**a) Get API Key**

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click **Create new secret key**
4. Name it: "iiskills-newsletter"
5. Copy the key (starts with `sk-...`)
6. **IMPORTANT:** Save it immediately - you won't see it again!

**b) Set Spending Limits**

1. Go to Settings → Billing
2. Set up billing with credit card
3. Set a spending limit (recommended: $10-20/month)
4. Newsletter generation costs ~$0.01-0.03 per newsletter

### 3. Email Service Setup

Choose either SendGrid OR AWS SES (SendGrid recommended for beginners).

#### Option A: SendGrid (Recommended)

**a) Create Account**
1. Go to https://sendgrid.com
2. Sign up for free account (100 emails/day free)
3. For production, upgrade to Essentials ($19.95/month for 100k emails)

**b) Create API Key**
1. Go to Settings → API Keys
2. Click **Create API Key**
3. Name: "iiskills-newsletter"
4. Select **Full Access** or **Mail Send** permission
5. Copy the API key (starts with `SG.`)

**c) Verify Sender Identity**
1. Go to Settings → Sender Authentication
2. Click **Verify a Single Sender**
3. Enter: `newsletter@iiskills.cloud` (or your domain)
4. Fill in your details
5. Check email and click verification link

**d) Create Unsubscribe Group**
1. Go to Suppressions → Unsubscribe Groups
2. Click **Create New Group**
3. Name: "Skilling Newsletter"
4. Description: "AI-powered course announcements"
5. Copy the Group ID (number)

#### Option B: AWS SES

**a) Create IAM User**
1. Go to AWS Console → IAM
2. Create user: `iiskills-newsletter-sender`
3. Attach policy: `AmazonSESFullAccess`
4. Create access key
5. Save Access Key ID and Secret Access Key

**b) Verify Email**
1. Go to AWS Console → SES
2. Click **Verified Identities**
3. Verify `newsletter@iiskills.cloud`
4. Check email and click verification link

**c) Request Production Access**
1. In SES console, click **Account Dashboard**
2. Click **Request production access**
3. Fill out the form explaining your use case
4. Wait for approval (usually 24-48 hours)

### 4. Environment Variables

**a) Create/Update `.env.local`**

Add these variables to your `.env.local` file in the root directory:

```bash
# Existing variables (keep these)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# NEW: OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key-here

# NEW: Email Configuration
EMAIL_PROVIDER=sendgrid
SENDER_EMAIL=newsletter@iiskills.cloud

# For SendGrid:
SENDGRID_API_KEY=SG.your-sendgrid-key-here
SENDGRID_UNSUBSCRIBE_GROUP_ID=12345

# OR for AWS SES (comment out SendGrid if using this):
# EMAIL_PROVIDER=ses
# AWS_ACCESS_KEY_ID=your-access-key
# AWS_SECRET_ACCESS_KEY=your-secret-key
# AWS_REGION=us-east-1
```

**b) Copy to Production**

If deploying to Vercel:
1. Go to Project Settings → Environment Variables
2. Add each variable individually
3. Mark sensitive ones as "Secret"

If self-hosting with PM2:
1. Copy `.env.local` to server
2. Ensure it's in `.gitignore` (should be by default)
3. Set proper file permissions: `chmod 600 .env.local`

### 5. Install Dependencies

If using SendGrid:
```bash
npm install @sendgrid/mail
```

If using AWS SES:
```bash
npm install aws-sdk
```

### 6. Test the System

**a) Test AI Generation**

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/admin/test-newsletter`
3. Click "Generate Newsletter"
4. Verify you see AI-generated content
5. Check the HTML preview renders correctly

**Troubleshooting:**
- If it fails, check OpenAI API key is correct
- If using fallback, that's OK for testing
- Check browser console for errors

**b) Test Course Creation**

1. Go to `http://localhost:3000/admin/courses-manage`
2. Click "Add New Course"
3. Fill in course details:
   ```
   Title: Test Python Course
   Category: Programming
   Status: draft (for now)
   Short Description: Learn Python basics
   Highlights: (one per line)
     Python fundamentals
     Hands-on projects
     Get certified
   Duration: 4 weeks
   Target Audience: Beginners
   ```
4. Click "Create Course"
5. Verify course appears in list

**c) Test Newsletter Generation (Without Sending)**

1. In the courses list, click "Edit" on your test course
2. Change status from "draft" to "published"
3. Click "Update Course"
4. You should see message: "Course published! Newsletter will be generated automatically."
5. Go to `/admin/newsletters`
6. Click "Process Queue"
7. Refresh page - you should see a draft newsletter
8. Click "Preview" to view it

**Troubleshooting:**
- If newsletter doesn't appear, check `/admin/newsletters` queue tab
- Check for failed tasks with error messages
- Verify database migration ran successfully

### 7. Production Deployment

**a) Verify Environment Variables**

Ensure ALL required variables are set in production:
- ✅ OPENAI_API_KEY
- ✅ EMAIL_PROVIDER
- ✅ SENDGRID_API_KEY (or AWS credentials)
- ✅ SENDER_EMAIL
- ✅ SENDGRID_UNSUBSCRIBE_GROUP_ID

**b) Build and Deploy**

For Vercel:
```bash
git push origin main
# Vercel auto-deploys
```

For self-hosting:
```bash
npm run build
pm2 restart ecosystem.config.js
```

**c) Set Up Cron Job for Queue Processing**

The newsletter queue needs to be processed regularly.

**Option 1: Vercel Cron**
Create `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/newsletter/process-queue",
    "schedule": "*/5 * * * *"
  }]
}
```

**Option 2: External Cron Service**
Use a service like cron-job.org:
1. Create account at https://cron-job.org
2. Add job:
   - URL: `https://iiskills.cloud/api/newsletter/process-queue`
   - Schedule: Every 5 minutes
   - Method: POST

**Option 3: Server Cron (if self-hosting)**
```bash
crontab -e
```
Add:
```
*/5 * * * * curl -X POST https://iiskills.cloud/api/newsletter/process-queue
```

### 8. Send Your First Newsletter

**a) Create a Real Course**

1. Go to `/admin/courses-manage`
2. Add a real course with complete details
3. Set status to "published"
4. Newsletter will be queued automatically

**b) Process the Queue**

1. Wait 5 minutes for cron OR
2. Manually trigger at `/admin/newsletters` → "Process Queue"

**c) Verify Sending**

1. Check `/admin/newsletters`
2. Newsletter status should change: draft → sent
3. Check `sent_count` matches your subscriber count
4. Check your own email if you're subscribed

**d) View Public Archive**

1. Go to `https://iiskills.cloud/newsletter/archive`
2. Verify newsletter appears
3. Click to view full newsletter
4. Test sharing buttons

### 9. Monitor & Maintain

**Daily:**
- Check `/admin/newsletters` for failed sends
- Monitor subscriber growth
- Review newsletter open rates (in SendGrid/SES dashboard)

**Weekly:**
- Review queue for stuck tasks
- Check OpenAI API usage and costs
- Clean up old draft newsletters if needed

**Monthly:**
- Review and optimize AI prompts if needed
- Analyze newsletter engagement
- Update email templates if desired

### 10. Troubleshooting Common Issues

**Newsletter not generating:**
```bash
# Check queue
# Go to /admin/newsletters
# Look for tasks with status 'failed'
# Check error_message column

# Common fixes:
# - Verify OPENAI_API_KEY is valid
# - Check OpenAI billing has credits
# - Verify course has all required fields
```

**Emails not sending:**
```bash
# Check SendGrid dashboard → Activity
# Verify sender email is verified
# Check email service credentials
# Test with admin test email first

# For SendGrid:
# - Check API key has Mail Send permission
# - Verify unsubscribe group exists
# - Check you haven't hit daily limit

# For AWS SES:
# - Verify you have production access
# - Check sender email is verified
# - Verify IAM permissions
```

**Queue stuck:**
```bash
# Reset stuck tasks in database:
# Go to Supabase → SQL Editor
UPDATE newsletter_queue 
SET status = 'pending', attempts = 0 
WHERE status = 'processing' 
AND updated_at < NOW() - INTERVAL '1 hour';
```

## Security Checklist

- ✅ `.env.local` is in `.gitignore`
- ✅ API keys are not committed to git
- ✅ Supabase RLS policies are enabled
- ✅ SendGrid/SES credentials are secure
- ✅ Admin pages require authentication
- ✅ Unsubscribe link works correctly
- ✅ Newsletter subscribers table has proper indexes

## Performance Optimization

**For High Volume (1000+ subscribers):**

1. **Batch Sending:**
   Modify `lib/email-sender.js` to send in batches of 1000

2. **Queue Workers:**
   Run multiple instances of queue processor

3. **Caching:**
   Cache generated HTML in Redis or similar

4. **CDN:**
   Serve newsletter archive through CDN

## Cost Estimates

**Monthly costs for 1000 subscribers, 4 newsletters/month:**

- SendGrid Essentials: $19.95/month (100k emails)
- OpenAI API: ~$0.50/month (4 newsletters × $0.12 each)
- Supabase: Free tier (unless high usage)
- **Total: ~$20-25/month**

**For 10,000 subscribers:**
- SendGrid Essentials: $19.95-89.95/month
- OpenAI: ~$0.50/month (same)
- **Total: ~$20-90/month**

## Next Steps

- ✅ System is live and sending newsletters!
- 📊 Set up analytics to track engagement
- 🎨 Customize email template design
- 🌐 Add multi-language support
- 📱 Create mobile app notifications
- 🤖 Implement A/B testing for subject lines

## Support

Need help? Check:
1. [SKILLING_NEWSLETTER_README.md](./SKILLING_NEWSLETTER_README.md) - Full documentation
2. [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues
3. Email: info@iiskills.cloud

---

**Congratulations! Your AI-powered Skilling newsletter system is ready! 🚀**
