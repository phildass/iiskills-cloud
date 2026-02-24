# Skilling Newsletter System - Complete Deployment Guide

## 📋 Overview

This guide walks you through deploying the fully automated "Skilling" newsletter system for iiskills.cloud. The system automatically generates and sends AI-powered, engaging newsletters whenever a new course is published.

## ✨ Key Features

- **Fully Automated**: Triggers automatically when courses are published
- **AI-Powered Content**: Uses OpenAI to generate engaging, Gen Z/Millennial-focused content
- **Resend Integration**: Primary email provider (with SendGrid fallback)
- **Supabase Integration**: User subscription management in profiles table
- **One-Click Unsubscribe**: Token-based unsubscribe without login required
- **Public Archive**: Browse all sent newsletters at `/newsletter/archive`
- **Admin Dashboard**: Manage courses, preview and send newsletters

## 🚀 Quick Start Checklist

- [ ] Set up Supabase database schema
- [ ] Get API keys (OpenAI, Resend/SendGrid, reCAPTCHA)
- [ ] Configure environment variables
- [ ] Install dependencies
- [ ] Run database migrations
- [ ] Test newsletter generation
- [ ] Set up CRON job for queue processing

## 📦 Prerequisites

1. **Supabase Account**: For database and authentication
2. **OpenAI Account**: For AI content generation
3. **Resend Account** (recommended) or **SendGrid Account**: For email delivery
4. **Google reCAPTCHA**: For newsletter signup protection
5. **Node.js 18+**: For running the application

## 🔧 Step-by-Step Setup

### Step 1: Database Setup

#### 1.1 Run Supabase Migrations

Go to your Supabase Dashboard → SQL Editor and run these migrations in order:

**Migration 1: Newsletter Subscribers Table**
```bash
File: supabase/migrations/newsletter_subscribers.sql
```

**Migration 2: Courses and Newsletter System**
```bash
File: supabase/migrations/courses_and_newsletter.sql
```

**Migration 3: Newsletter Subscription in Profiles**
```bash
File: supabase/migrations/add_newsletter_subscription_to_profiles.sql
```

#### 1.2 Verify Tables Created

Check that these tables exist:
- `profiles` (with `subscribed_to_newsletter` column)
- `courses`
- `newsletter_editions`
- `newsletter_queue`
- `newsletter_subscribers`
- `newsletter_unsubscribe_tokens`

#### 1.3 Verify Triggers

The following triggers should be created:
- `queue_newsletter_on_publish` - Queues newsletter when course status changes to 'published'
- `queue_newsletter_on_insert` - Queues newsletter when course is created with 'published' status

### Step 2: Get API Keys

#### 2.1 OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Name it "iiskills-newsletter"
4. Copy the key (starts with `sk-`)
5. Save it for `.env.local`

**Cost Estimate**: ~$0.002 per newsletter (using gpt-4o-mini)

#### 2.2 Resend API Key (Recommended)

1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name it "iiskills-newsletter"
4. Select permissions: "Sending access"
5. Copy the key (starts with `re_`)
6. Verify your sender domain: newsletter@iiskills.cloud

**Why Resend?**
- Simple, modern API
- Easy setup
- Great deliverability
- Developer-friendly

#### 2.3 SendGrid API Key (Fallback)

If you prefer SendGrid or want a fallback:

1. Go to https://app.sendgrid.com/settings/api_keys
2. Create API key with "Mail Send" permissions
3. Create an unsubscribe group and note the ID
4. Verify sender email

#### 2.4 Google reCAPTCHA Keys

1. Go to https://www.google.com/recaptcha/admin/create
2. Choose reCAPTCHA v3
3. Add domains: `iiskills.cloud`, `localhost`
4. Copy Site Key and Secret Key

### Step 3: Environment Configuration

#### 3.1 Root .env.local

Create/update `.env.local` in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://iiskills.cloud
NEXT_PUBLIC_MAIN_DOMAIN=iiskills.cloud
NEXT_PUBLIC_COOKIE_DOMAIN=.iiskills.cloud

# reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-key

# Email Service Configuration (Resend - Primary)
EMAIL_PROVIDER=resend
RESEND_API_KEY=re_your-resend-key

# Email Service Configuration (SendGrid - Fallback)
SENDGRID_API_KEY=SG.your-sendgrid-key
SENDGRID_UNSUBSCRIBE_GROUP_ID=12345

# Sender Configuration
SENDER_EMAIL=newsletter@iiskills.cloud
SENDER_NAME=Skilling by iiskills.cloud
```

#### 3.2 Apps .env.local

Copy the same configuration to each app's `.env.local`:
- `apps/main/.env.local`
- `learn-ai/.env.local`
- `learn-apt/.env.local`
- ... (all learn-* directories)

**Tip**: Use the provided `setup-env.sh` script to copy env files to all apps.

### Step 4: Install Dependencies

```bash
# Root directory
npm install

# Or if using Yarn
yarn install
```

This will install:
- `resend` - Email delivery
- `openai` - AI content generation
- Plus existing dependencies

### Step 5: Verify Setup

#### 5.1 Test Database Connection

```bash
# From root directory
npm run dev

# Visit http://localhost:3000
# Check browser console for Supabase connection
```

#### 5.2 Test Newsletter Signup

1. Go to http://localhost:3000/newsletter
2. Enter an email
3. Submit the form
4. Check Supabase → Table Editor → `newsletter_subscribers`
5. Verify the email was added with status 'active'

#### 5.3 Test Registration with Newsletter

1. Go to http://localhost:3000/register
2. Fill out the registration form
3. Keep "Yes, sign me up for updates!" selected (default)
4. Complete registration
5. Check Supabase → Table Editor → `profiles`
6. Verify `subscribed_to_newsletter` is `true`

### Step 6: Create Test Course

#### 6.1 Create a Test Course (Manual SQL)

Go to Supabase → SQL Editor and run:

```sql
INSERT INTO courses (
  title,
  slug,
  short_description,
  full_description,
  highlights,
  duration,
  category,
  target_audience,
  topics_skills,
  status
) VALUES (
  'Introduction to AI and Machine Learning',
  'intro-ai-ml',
  'Learn the fundamentals of AI and Machine Learning in this beginner-friendly course',
  'This comprehensive course covers the basics of artificial intelligence and machine learning, including neural networks, deep learning, and practical applications.',
  ARRAY['Understand AI fundamentals', 'Build ML models', 'Deploy AI solutions'],
  '6 weeks',
  'Data Science',
  'Beginners interested in AI/ML',
  ARRAY['Python', 'Machine Learning', 'Neural Networks', 'TensorFlow'],
  'draft'
);
```

#### 6.2 Publish the Course

Option 1: Update via SQL
```sql
UPDATE courses 
SET status = 'published' 
WHERE slug = 'intro-ai-ml';
```

Option 2: Use Admin Dashboard
1. Go to http://localhost:3000/admin/courses-manage
2. Find your course
3. Change status to "Published"
4. Save

#### 6.3 Verify Newsletter Queue

Check that a task was created:

```sql
SELECT * FROM newsletter_queue 
WHERE task_type = 'generate' 
AND status = 'pending' 
ORDER BY created_at DESC 
LIMIT 5;
```

You should see a new row with your course_id.

### Step 7: Process Newsletter Queue

#### 7.1 Manual Processing (Testing)

```bash
# Trigger queue processor
curl -X POST http://localhost:3000/api/newsletter/process-queue
```

This will:
1. Generate AI content for the newsletter
2. Create HTML email and web templates
3. Save newsletter edition to database
4. Queue sending task
5. Send emails to all subscribers

#### 7.2 Check Results

```sql
-- Check newsletter edition created
SELECT * FROM newsletter_editions 
ORDER BY created_at DESC 
LIMIT 1;

-- Check sending task created
SELECT * FROM newsletter_queue 
WHERE task_type = 'send' 
ORDER BY created_at DESC 
LIMIT 1;
```

#### 7.3 View in Browser

- Archive: http://localhost:3000/newsletter/archive
- Admin: http://localhost:3000/admin/newsletters

### Step 8: Set Up Automated Queue Processing

For production, you need to automatically process the queue.

#### Option A: Vercel Cron (Recommended for Vercel deployment)

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/newsletter/process-queue",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

This runs every 5 minutes.

#### Option B: External CRON service

Use a service like:
- **cron-job.org** (free)
- **EasyCron** (free tier available)
- **AWS EventBridge** (if using AWS)

Set up a job to hit:
```
POST https://iiskills.cloud/api/newsletter/process-queue
```

Run every 5-10 minutes.

#### Option C: Server CRON (if self-hosting)

Add to crontab:

```bash
# Edit crontab
crontab -e

# Add this line (runs every 5 minutes)
*/5 * * * * curl -X POST https://iiskills.cloud/api/newsletter/process-queue
```

### Step 9: Test Email Delivery

#### 9.1 Send Test Newsletter

1. Go to http://localhost:3000/admin/newsletters
2. Find a newsletter edition
3. Click "Resend" or use the test email function

#### 9.2 Check Email

- Check inbox for test email
- Verify formatting and styling
- Test unsubscribe link
- Check that images/emojis render correctly

#### 9.3 Test Unsubscribe Flow

1. Click unsubscribe link in email
2. Verify you're redirected to unsubscribe page
3. Check that confirmation message appears
4. Verify in database that:
   - `profiles.subscribed_to_newsletter` = `false`
   - `newsletter_subscribers.status` = 'unsubscribed'
   - Token is marked as used

## 📊 Admin Operations

### View All Newsletters

http://localhost:3000/admin/newsletters

### Manage Courses

http://localhost:3000/admin/courses-manage

### Monitor Queue

```sql
-- See all pending tasks
SELECT * FROM newsletter_queue 
WHERE status = 'pending' 
ORDER BY created_at;

-- See failed tasks
SELECT * FROM newsletter_queue 
WHERE status = 'failed' 
ORDER BY created_at DESC;

-- Retry a failed task
UPDATE newsletter_queue 
SET status = 'pending', attempts = 0 
WHERE id = 'task-id-here';
```

### Manual Newsletter Trigger

```bash
# Generate newsletter for specific course
curl -X POST http://localhost:3000/api/newsletter/process-queue
```

### View Subscriber Count

```sql
-- Count active subscribers
SELECT COUNT(*) FROM profiles 
WHERE subscribed_to_newsletter = true;

-- Count legacy subscribers
SELECT COUNT(*) FROM newsletter_subscribers 
WHERE status = 'active';
```

## 🔍 Troubleshooting

### Newsletter Not Generating

**Check 1: Queue created?**
```sql
SELECT * FROM newsletter_queue WHERE course_id = 'your-course-id';
```

**Check 2: OpenAI API key valid?**
- Verify key in `.env.local`
- Check OpenAI dashboard for API usage/errors
- Check server logs for OpenAI errors

**Check 3: Queue processor running?**
```bash
curl -X POST http://localhost:3000/api/newsletter/process-queue
```

### Emails Not Sending

**Check 1: Resend/SendGrid API key valid?**
- Verify key in `.env.local`
- Check provider dashboard for errors

**Check 2: Sender email verified?**
- Resend: Check verified domains
- SendGrid: Check sender authentication

**Check 3: Subscribers exist?**
```sql
SELECT COUNT(*) FROM profiles WHERE subscribed_to_newsletter = true;
```

**Check 4: Check logs**
- Look for email provider errors in server logs
- Check Resend/SendGrid dashboards for bounce/delivery issues

### Unsubscribe Not Working

**Check 1: Token valid?**
```sql
SELECT * FROM newsletter_unsubscribe_tokens 
WHERE token = 'your-token' 
AND expires_at > NOW() 
AND used_at IS NULL;
```

**Check 2: API endpoint working?**
```bash
curl -X POST http://localhost:3000/api/newsletter/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{"token":"your-token"}'
```

## 🎨 Customization

### Modify Newsletter Template

Edit: `lib/ai-newsletter-generator.js`

The `generateEmailHTML()` function contains the HTML template.

### Modify AI Prompt

Edit: `lib/ai-newsletter-generator.js`

The `buildPrompt()` function contains the AI instructions.

### Change Email Provider

Update `.env.local`:
```bash
# Use SendGrid instead
EMAIL_PROVIDER=sendgrid

# Or AWS SES
EMAIL_PROVIDER=ses
```

### Add Newsletter Categories

Extend database schema to support:
- Course categories
- Topic-based newsletters
- User preferences for specific topics

## 📈 Performance & Scaling

### Current Limits

- **OpenAI**: ~10,000 requests/min (gpt-4o-mini)
- **Resend**: 100 emails/second on free tier
- **Queue**: Processes 5 tasks per run

### Optimization Tips

1. **Batch email sending**: Already implemented (100 per batch)
2. **Cache AI responses**: Store in `newsletter_editions` for reuse
3. **Queue processing**: Increase frequency if needed
4. **Rate limiting**: Built into email providers

### Scaling for Large Subscriber Lists

For 10,000+ subscribers:

1. Increase batch size in queue processor
2. Use dedicated email service (e.g., AWS SES with SQS)
3. Implement email queue with retry logic
4. Monitor bounce rates and remove invalid emails

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use environment variables** for all secrets
3. **Enable Supabase RLS** - Already configured
4. **Validate all inputs** - reCAPTCHA on signup
5. **Secure unsubscribe tokens** - 32-byte random, 90-day expiry
6. **Monitor API usage** - Set up alerts for unusual activity

## 📝 Maintenance

### Weekly Tasks

- [ ] Check newsletter_queue for failed tasks
- [ ] Review bounced/unsubscribed emails
- [ ] Monitor OpenAI API usage and costs
- [ ] Check email deliverability rates

### Monthly Tasks

- [ ] Review and clean up old tokens
- [ ] Archive old newsletter editions if needed
- [ ] Update AI prompts based on feedback
- [ ] Review subscriber engagement metrics

### Quarterly Tasks

- [ ] Audit email provider costs
- [ ] Review and update email templates
- [ ] Update AI model if new versions available
- [ ] Security audit of unsubscribe flow

## 🆘 Support

### Common Issues

See the Troubleshooting section above.

### Need Help?

1. Check existing documentation files:
   - `SKILLING_NEWSLETTER_README.md`
   - `NEWSLETTER_IMPLEMENTATION_GUIDE.md`
   - `ENV_SETUP_GUIDE.md`

2. Check server logs for detailed error messages

3. Contact: info@iiskills.cloud

## ✅ Deployment Checklist

Before going live:

- [ ] All environment variables set in production
- [ ] Database migrations run successfully
- [ ] OpenAI API key verified and funded
- [ ] Email provider (Resend/SendGrid) configured and verified
- [ ] Sender domain verified
- [ ] Test newsletter sent successfully
- [ ] Unsubscribe flow tested
- [ ] CRON job configured for queue processing
- [ ] reCAPTCHA configured
- [ ] SSL/HTTPS enabled
- [ ] Error monitoring set up (Sentry, LogRocket, etc.)

## 🎉 You're Done!

Your Skilling newsletter system is now fully automated!

**What happens next:**

1. Admin publishes a course → Newsletter auto-queued
2. Queue processor runs → AI generates content
3. Newsletter created → Email sent to subscribers
4. Archive updated → Public can browse past editions

Welcome to the future of automated course marketing! 🚀

---

**Last Updated**: January 2026
**Version**: 1.0
**Maintained by**: iiskills.cloud team
