# Skilling Newsletter System - Deployment Checklist

Use this checklist to verify the newsletter system is fully operational.

## Pre-Deployment Setup

### 1. API Keys Obtained ☐
- [ ] OpenAI API key obtained from https://platform.openai.com/api-keys
- [ ] Resend API key obtained from https://resend.com/api-keys
- [ ] SendGrid API key obtained (optional fallback)
- [ ] Google reCAPTCHA keys obtained from https://www.google.com/recaptcha/admin

### 2. Environment Configuration ☐
- [ ] `.env.local` created in root directory
- [ ] All API keys added to `.env.local`
- [ ] `.env.local` copied to all 16 app directories
- [ ] Sender email and name configured
- [ ] Email provider set to "resend"
- [ ] Site URL configured

### 3. Database Setup ☐
- [ ] Supabase project accessible
- [ ] Migration: `newsletter_subscribers.sql` run
- [ ] Migration: `courses_and_newsletter.sql` run
- [ ] Migration: `add_newsletter_subscription_to_profiles.sql` run
- [ ] Tables verified: courses, newsletter_editions, newsletter_queue, profiles
- [ ] Triggers verified: queue_newsletter_on_publish, queue_newsletter_on_insert
- [ ] RLS policies enabled on all tables

### 4. Email Provider Setup ☐
- [ ] Domain verified in Resend/SendGrid
- [ ] Sender email verified: newsletter@iiskills.cloud
- [ ] Test email sent successfully
- [ ] Bounce handling configured

## Testing Phase

### 5. Registration Flow ☐
- [ ] Visit `/register` page
- [ ] Newsletter checkbox visible
- [ ] "Yes" option pre-selected
- [ ] Clear policy message displayed: "Only new courses or important updates"
- [ ] Complete registration
- [ ] Verify in Supabase: `profiles.subscribed_to_newsletter` = true
- [ ] Test with "No" option
- [ ] Verify in Supabase: `profiles.subscribed_to_newsletter` = false

### 6. Google OAuth Flow ☐
- [ ] Click "Continue with Google"
- [ ] Complete OAuth registration
- [ ] Verify in Supabase: user created
- [ ] Verify: `subscribed_to_newsletter` = true (default)

### 7. Newsletter Subscription Page ☐
- [ ] Visit `/newsletter`
- [ ] Policy message visible
- [ ] No dev/placeholder text
- [ ] Subscribe form works
- [ ] reCAPTCHA protection active
- [ ] Success message shown
- [ ] Verify in database: email added to newsletter_subscribers

### 8. Course Creation & Publishing ☐
- [ ] Visit `/admin/courses-manage`
- [ ] Click "Add New Course"
- [ ] Fill in all fields:
  - Title: "Test Course for Newsletter"
  - Short description
  - Full description
  - Highlights (3-5 items)
  - Duration
  - Category
  - Target audience
  - Topics/skills
- [ ] Save as "draft" first
- [ ] Change status to "published"
- [ ] Save course
- [ ] Check Supabase: `newsletter_queue` has new "generate" task

### 9. Newsletter Generation ☐
- [ ] Manually trigger queue: `curl -X POST http://localhost:3000/api/newsletter/process-queue`
- [ ] Wait 30-60 seconds
- [ ] Check Supabase: `newsletter_editions` has new entry
- [ ] Verify newsletter content:
  - Title with emojis
  - Subject line
  - Intro text
  - Course summary
  - Highlights
  - Fun fact
  - CTA text
  - Emoji block
- [ ] Check: status = "draft" initially
- [ ] Check: `newsletter_queue` has new "send" task

### 10. Newsletter Sending ☐
- [ ] Trigger queue again: `curl -X POST http://localhost:3000/api/newsletter/process-queue`
- [ ] Wait 1-2 minutes
- [ ] Check email inbox (test subscriber)
- [ ] Verify email received
- [ ] Check email formatting:
  - Header with gradient
  - Emoji banner
  - Course title
  - Content sections
  - CTA button
  - Footer with unsubscribe link
- [ ] Check Supabase: newsletter status = "sent"
- [ ] Check Supabase: sent_count > 0

### 11. Newsletter Archive ☐
- [ ] Visit `/newsletter/archive`
- [ ] Verify newsletter appears in archive
- [ ] Check card layout
- [ ] Click newsletter to view full version
- [ ] Verify redirect to `/newsletter/view/[id]`
- [ ] Check full newsletter display
- [ ] Test share buttons (Twitter, LinkedIn)
- [ ] Test print function

### 12. Unsubscribe Flow ☐
- [ ] Open newsletter email
- [ ] Click "Unsubscribe" link
- [ ] Verify redirect to `/unsubscribe?token=...`
- [ ] Check confirmation message displayed
- [ ] Verify friendly, professional message
- [ ] Check Supabase: `profiles.subscribed_to_newsletter` = false
- [ ] Check Supabase: `newsletter_subscribers.status` = "unsubscribed"
- [ ] Check Supabase: token marked as used
- [ ] Try using same token again - should fail
- [ ] Verify error message clear and helpful

### 13. Admin Dashboard ☐
- [ ] Visit `/admin/newsletters`
- [ ] Verify all newsletters listed
- [ ] Check edition numbers sequential
- [ ] Verify status indicators
- [ ] Verify sent counts
- [ ] Click "View" on newsletter
- [ ] Click "Resend" on newsletter
- [ ] Confirm resend works
- [ ] Check queue status display

## Production Deployment

### 14. CRON Setup ☐
- [ ] CRON job configured to run every 5 minutes
- [ ] Endpoint: `/api/newsletter/process-queue`
- [ ] Method: POST
- [ ] Test CRON triggers successfully
- [ ] Verify queue processing happens automatically
- [ ] Monitor CRON logs for errors

### 15. Monitoring Setup ☐
- [ ] Error logging enabled
- [ ] Email delivery monitoring set up
- [ ] Bounce rate tracking configured
- [ ] Unsubscribe rate tracking configured
- [ ] OpenAI API usage monitoring
- [ ] Queue processing alerts configured

### 16. Final Verification ☐
- [ ] Create real course
- [ ] Publish course
- [ ] Wait for CRON to process
- [ ] Verify newsletter sent automatically
- [ ] Check email deliverability (>95%)
- [ ] Check subscriber count accurate
- [ ] Check archive updated
- [ ] Review email content quality
- [ ] Test all links in email work

## Documentation Review

### 17. Admin Training ☐
- [ ] Admin has read `SKILLING_DEPLOYMENT_GUIDE.md`
- [ ] Admin has read `SKILLING_ADMIN_GUIDE.md`
- [ ] Admin knows how to publish courses
- [ ] Admin knows how to view newsletters
- [ ] Admin knows how to resend newsletters
- [ ] Admin knows how to monitor queue
- [ ] Admin knows how to handle errors
- [ ] Admin knows where to find logs

## Security & Compliance

### 18. Security Checks ☐
- [ ] All API keys in environment variables only
- [ ] No API keys in code
- [ ] No API keys committed to git
- [ ] `.env.local` in `.gitignore`
- [ ] Supabase RLS policies active
- [ ] reCAPTCHA v3 working
- [ ] Unsubscribe tokens secure (32-byte random)
- [ ] Tokens expire after 90 days
- [ ] Tokens single-use only

### 19. Compliance Checks ☐
- [ ] Unsubscribe link in every email
- [ ] List-Unsubscribe headers present
- [ ] Privacy policy linked
- [ ] Terms of service linked
- [ ] Clear frequency promise ("only important updates")
- [ ] One-click unsubscribe works
- [ ] No spam keywords in subject lines
- [ ] Sender domain verified

## Performance Testing

### 20. Load Testing ☐
- [ ] Test with 10 subscribers
- [ ] Test with 100 subscribers
- [ ] Test with 1000+ subscribers (if applicable)
- [ ] Verify batch sending works
- [ ] Verify no rate limit errors
- [ ] Check email delivery speed
- [ ] Monitor server resources

### 21. Error Handling ☐
- [ ] Test with invalid course data
- [ ] Test with OpenAI API down (fallback works)
- [ ] Test with Resend API down (SendGrid fallback works)
- [ ] Test with invalid email addresses
- [ ] Test with expired unsubscribe token
- [ ] Test with already-used token
- [ ] Verify graceful error messages
- [ ] Verify retry logic (up to 3 attempts)

## Post-Deployment

### 22. Monitoring (First Week) ☐
- [ ] Day 1: Check queue processing
- [ ] Day 1: Verify emails delivered
- [ ] Day 1: Monitor bounce rate (<5%)
- [ ] Day 1: Check unsubscribe rate (<2%)
- [ ] Day 3: Review OpenAI costs
- [ ] Day 3: Review email provider costs
- [ ] Day 7: Check subscriber growth
- [ ] Day 7: Review newsletter quality
- [ ] Day 7: Read any error logs

### 23. Ongoing Maintenance ☐
- [ ] Weekly: Check failed queue tasks
- [ ] Weekly: Monitor email deliverability
- [ ] Weekly: Review subscriber count
- [ ] Monthly: Review AI content quality
- [ ] Monthly: Check API costs
- [ ] Monthly: Clean up old tokens (automated)
- [ ] Quarterly: Update email templates
- [ ] Quarterly: Refine AI prompts

## Success Metrics

### 24. Key Metrics to Track ☐
- [ ] **Subscriber Growth**: New sign-ups per week
- [ ] **Email Deliverability**: Target >95%
- [ ] **Open Rate**: Target >20%
- [ ] **Click Rate**: Target >5%
- [ ] **Unsubscribe Rate**: Keep <2%
- [ ] **Course Enrollments**: Track newsletter referrals
- [ ] **Queue Processing**: 100% completion rate
- [ ] **AI Generation Success**: 100% (fallback if needed)

## Sign-Off

### 25. Final Approval ☐
- [ ] All checklist items completed
- [ ] Test newsletter sent and received
- [ ] Admin trained and comfortable
- [ ] Documentation reviewed
- [ ] Monitoring in place
- [ ] System ready for production

**Deployment Date**: ___________________

**Signed Off By**: ___________________

**Role**: ___________________

---

## Emergency Contacts

**Technical Issues**:
- Check `SKILLING_DEPLOYMENT_GUIDE.md` - Troubleshooting section
- Check `SKILLING_ADMIN_GUIDE.md` - Emergency Procedures

**Support**:
- Email: info@iiskills.cloud
- Supabase Logs: Check dashboard
- Email Provider Logs: Check Resend/SendGrid dashboard

**Quick Commands**:
```bash
# Manual queue processing
curl -X POST https://iiskills.cloud/api/newsletter/process-queue

# Check queue status (Supabase SQL)
SELECT * FROM newsletter_queue WHERE status = 'pending' ORDER BY created_at DESC LIMIT 10;

# Check recent newsletters (Supabase SQL)
SELECT * FROM newsletter_editions ORDER BY created_at DESC LIMIT 10;

# Check subscriber count (Supabase SQL)
SELECT COUNT(*) FROM profiles WHERE subscribed_to_newsletter = true;
```

---

**Status**: ☐ NOT STARTED | ☐ IN PROGRESS | ☐ COMPLETE  
**Date Completed**: ___________________
