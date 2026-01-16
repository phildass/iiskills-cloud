# Skilling Newsletter - Admin Quick Reference

## 🎯 Quick Actions

### Publish a Course (Auto-sends Newsletter)

1. Go to `/admin/courses-manage`
2. Click "Add New Course" or edit existing
3. Fill in course details:
   - **Title**: Clear, engaging name
   - **Description**: Short (2-3 sentences) and full description
   - **Highlights**: 3-5 bullet points of key benefits
   - **Duration**: e.g., "4 weeks", "30 hours"
   - **Target Audience**: Who should take this?
   - **Topics/Skills**: Array of skills covered
4. Set **Status** to "Published"
5. Click "Save"

**✨ That's it!** Newsletter automatically:
- Generates AI content
- Creates beautiful email
- Sends to all subscribers
- Appears in public archive

### Manually Trigger Newsletter

If auto-trigger didn't work:

```bash
curl -X POST https://iiskills.cloud/api/newsletter/process-queue
```

Or visit: `/admin/newsletters` and click "Process Queue"

### Resend a Newsletter

1. Go to `/admin/newsletters`
2. Find the newsletter you want to resend
3. Click "Resend"
4. Confirm

### View All Newsletters

Go to `/admin/newsletters`

You'll see:
- All newsletter editions (drafts, sent, failed)
- Edition numbers
- Sent counts
- Status
- Actions (View, Resend, Delete)

### View Public Archive

Go to `/newsletter/archive`

This is what subscribers see - all sent newsletters.

### Monitor Newsletter Queue

Go to Supabase → SQL Editor:

```sql
-- See pending tasks
SELECT * FROM newsletter_queue 
WHERE status = 'pending' 
ORDER BY created_at DESC;

-- See failed tasks
SELECT * FROM newsletter_queue 
WHERE status = 'failed' 
ORDER BY created_at DESC;

-- See completed tasks (recent)
SELECT * FROM newsletter_queue 
WHERE status = 'completed' 
ORDER BY processed_at DESC 
LIMIT 10;
```

## 📊 Checking Stats

### Subscriber Count

```sql
-- Active subscribers from profiles
SELECT COUNT(*) as subscriber_count 
FROM profiles 
WHERE subscribed_to_newsletter = true;

-- Active subscribers from legacy table
SELECT COUNT(*) as legacy_subscribers 
FROM newsletter_subscribers 
WHERE status = 'active';
```

### Newsletter Performance

```sql
-- Total newsletters sent
SELECT COUNT(*) as total_sent 
FROM newsletter_editions 
WHERE status = 'sent';

-- Total recipients reached
SELECT SUM(sent_count) as total_recipients 
FROM newsletter_editions 
WHERE status = 'sent';

-- Recent newsletters
SELECT 
  edition_number,
  title,
  sent_at,
  sent_count,
  status
FROM newsletter_editions 
ORDER BY sent_at DESC 
LIMIT 10;
```

### Unsubscribe Rate

```sql
-- Count unsubscribes
SELECT COUNT(*) as unsubscribed_count 
FROM profiles 
WHERE subscribed_to_newsletter = false;

-- Unsubscribe rate (rough estimate)
SELECT 
  (SELECT COUNT(*) FROM profiles WHERE subscribed_to_newsletter = false)::float / 
  (SELECT COUNT(*) FROM profiles)::float * 100 
  as unsubscribe_rate_percent;
```

## 🔧 Troubleshooting

### Newsletter Didn't Generate

**Check 1: Did course publish?**
```sql
SELECT * FROM courses 
WHERE slug = 'your-course-slug' 
AND status = 'published';
```

**Check 2: Was task queued?**
```sql
SELECT * FROM newsletter_queue 
WHERE course_id = 'your-course-id' 
AND task_type = 'generate';
```

**Check 3: Any errors?**
```sql
SELECT * FROM newsletter_queue 
WHERE status = 'failed' 
ORDER BY created_at DESC 
LIMIT 5;
```

**Fix:** Retry failed task
```sql
UPDATE newsletter_queue 
SET status = 'pending', attempts = 0, error_message = NULL 
WHERE id = 'failed-task-id';
```

Then trigger processor:
```bash
curl -X POST https://iiskills.cloud/api/newsletter/process-queue
```

### Email Didn't Send

**Check 1: Newsletter exists?**
```sql
SELECT * FROM newsletter_editions 
WHERE status = 'sent' 
ORDER BY created_at DESC 
LIMIT 1;
```

**Check 2: Sending task in queue?**
```sql
SELECT * FROM newsletter_queue 
WHERE task_type = 'send' 
ORDER BY created_at DESC 
LIMIT 5;
```

**Check 3: Any subscribers?**
```sql
SELECT COUNT(*) FROM profiles WHERE subscribed_to_newsletter = true;
```

**Check 4: Email provider errors**
- Check Resend dashboard: https://resend.com/emails
- Check SendGrid dashboard: https://app.sendgrid.com/email_activity
- Look for bounces, blocks, or API errors

### Queue Stuck

**Check queue status:**
```sql
SELECT 
  status,
  COUNT(*) as count,
  MAX(created_at) as latest
FROM newsletter_queue 
GROUP BY status;
```

**Reset stuck "processing" tasks:**
```sql
UPDATE newsletter_queue 
SET status = 'pending', attempts = 0 
WHERE status = 'processing' 
AND updated_at < NOW() - INTERVAL '10 minutes';
```

## 📧 Email Provider Management

### Resend (Primary)

**Dashboard**: https://resend.com/

**Check email status:**
- Go to Emails tab
- Filter by date
- See delivered/bounced/failed

**Common issues:**
- Domain not verified → Go to Domains and verify
- API key invalid → Regenerate in API Keys tab
- Rate limit hit → Check usage in Analytics

### SendGrid (Fallback)

**Dashboard**: https://app.sendgrid.com/

**Check email activity:**
- Email Activity → Search by email/date
- See delivery status, opens, clicks

**Common issues:**
- Authentication failed → Check sender authentication
- Bounces → Clean up email list
- Spam reports → Review content/frequency

## 🎨 Customizing Newsletters

### Change Newsletter Content

Edit: `lib/ai-newsletter-generator.js`

**AI Prompt** (line ~84):
```javascript
function buildPrompt(course, editionNumber) {
  return `Create an engaging newsletter edition for "Skilling" newsletter #${editionNumber}.
  
  // Modify this prompt to change AI tone/style
  `;
}
```

**HTML Template** (line ~199):
```javascript
export function generateEmailHTML(content, course) {
  return `<!DOCTYPE html>
  <html lang="en">
  // Modify HTML/CSS here
  `;
}
```

### Change Email Styling

Colors, fonts, layout - all in `generateEmailHTML()` function.

Current colors:
- Primary: `#667eea` (purple)
- Secondary: `#764ba2` (darker purple)
- Accent: `#F6AD55` (orange)

### Change Sender Name/Email

Update in `.env.local`:
```bash
SENDER_EMAIL=newsletter@iiskills.cloud
SENDER_NAME=Skilling by iiskills.cloud
```

## 📋 Regular Maintenance Tasks

### Daily

- [ ] Check for failed queue tasks (if any)
- [ ] Monitor email deliverability (>95% is good)

### Weekly

- [ ] Review subscriber growth
- [ ] Check for email bounces
- [ ] Clean up undeliverable emails if needed

### Monthly

- [ ] Review newsletter content quality
- [ ] Update AI prompts if needed
- [ ] Check OpenAI API costs
- [ ] Review email provider costs

### Quarterly

- [ ] Archive old newsletters (if needed)
- [ ] Update email templates/designs
- [ ] Review automation performance
- [ ] Plan content improvements

## 🆘 Emergency Procedures

### Stop All Newsletters

If you need to halt all newsletter sending:

```sql
-- Cancel all pending tasks
UPDATE newsletter_queue 
SET status = 'failed', error_message = 'Manually cancelled by admin' 
WHERE status IN ('pending', 'processing');
```

### Delete a Newsletter

```sql
-- Mark as deleted (safer than actual delete)
UPDATE newsletter_editions 
SET status = 'draft' 
WHERE id = 'newsletter-id';

-- Or actually delete (use with caution)
DELETE FROM newsletter_editions WHERE id = 'newsletter-id';
```

### Undo Course Publish

```sql
-- Revert course to draft
UPDATE courses 
SET status = 'draft', published_at = NULL 
WHERE id = 'course-id';

-- Cancel related newsletter tasks
UPDATE newsletter_queue 
SET status = 'failed', error_message = 'Course unpublished' 
WHERE course_id = 'course-id' 
AND status IN ('pending', 'processing');
```

## 💡 Pro Tips

### Before Publishing

1. **Preview course details** - Make sure all fields are filled
2. **Check highlights** - These become newsletter bullets
3. **Review description** - AI uses this for content
4. **Set correct audience** - Helps AI target content

### For Better Newsletters

1. **Write engaging highlights** - Focus on benefits, not features
2. **Include course outcomes** - What will students achieve?
3. **Add duration** - Sets expectations
4. **Target specific audience** - Be clear who it's for

### Timing

- **Best time to publish**: Tuesday-Thursday, 10am-2pm
- **Avoid**: Monday mornings, Friday afternoons
- **Queue processor runs every 5 min** - Newsletter sends within minutes

### Testing

Before sending to all subscribers:

1. Publish course as "draft" first
2. Manually create newsletter edition
3. Send test email to yourself
4. Check formatting, links, unsubscribe
5. Then publish course to trigger auto-send

## 📞 Support Contacts

### Technical Issues

- **OpenAI errors**: Check API status at https://status.openai.com/
- **Resend errors**: Support at https://resend.com/support
- **SendGrid errors**: https://support.sendgrid.com/
- **Supabase errors**: https://supabase.com/dashboard/support

### Internal Support

- **Primary Contact**: info@iiskills.cloud
- **Development Team**: [Internal contact]
- **Database Admin**: [Internal contact]

---

## 🎓 Training Resources

### For New Admins

1. Read: `SKILLING_NEWSLETTER_README.md`
2. Read: `SKILLING_DEPLOYMENT_GUIDE.md`
3. Practice: Create test course in staging
4. Watch: Newsletter auto-generate
5. Test: Send to test email

### Video Tutorials

[To be created - placeholder for Loom/video links]

---

**Last Updated**: January 2026  
**Version**: 1.0  
**Quick Help**: Type `/admin/help` or email info@iiskills.cloud
