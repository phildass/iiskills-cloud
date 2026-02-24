# 🚀 Skilling Newsletter - AI-Powered Newsletter System

## Overview

**Skilling** is an AI-powered newsletter system that automatically generates and sends engaging, Millennial/Gen Z-focused newsletters whenever a new course is published on iiskills.cloud.

## ✨ Key Features

### 1. **Automatic Generation**
- Triggers automatically when a course is published
- AI generates lively, engaging content using OpenAI
- No manual work needed per newsletter

### 2. **AI-Powered Content**
- Uses GPT-4o-mini to transform course data into exciting newsletter content
- Energetic, conversational tone perfect for Millennials and Gen Z
- Includes emojis, fun headings, and engaging copy
- Each newsletter is unique and tailored to the specific course

### 3. **Email Delivery**
- Sends to all active newsletter subscribers
- Supports SendGrid and AWS SES
- Includes unsubscribe functionality
- HTML and plain text versions

### 4. **Public Archive**
- `/newsletter/archive` - Browse all past editions
- Visually appealing card-based layout
- Each newsletter is shareable

### 5. **Admin Dashboard**
- View all newsletters at `/admin/newsletters`
- Preview before sending
- Manually trigger re-sends
- Monitor queue status
- Full course management at `/admin/courses-manage`

## 🎯 How It Works

```
1. Admin creates/publishes a course
   ↓
2. Database trigger adds task to newsletter_queue
   ↓
3. Queue processor generates AI content
   ↓
4. Newsletter edition created in database
   ↓
5. Email sent to all subscribers
   ↓
6. Newsletter appears in public archive
```

## 📋 Setup Instructions

### Step 1: Database Migration

Run the SQL migration in your Supabase dashboard:

```bash
# File: supabase/migrations/courses_and_newsletter.sql
```

This creates:
- `courses` table - Store all courses
- `newsletter_editions` table - Store generated newsletters
- `newsletter_queue` table - Task queue
- Auto-triggers for newsletter generation

### Step 2: Environment Variables

Add to your `.env.local`:

```bash
# AI Generation
OPENAI_API_KEY=sk-...your-key-here

# Email Delivery (choose one)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your-key-here
SENDGRID_UNSUBSCRIBE_GROUP_ID=12345
SENDER_EMAIL=newsletter@iiskills.cloud

# OR for AWS SES:
# EMAIL_PROVIDER=ses
# AWS_ACCESS_KEY_ID=your-key
# AWS_SECRET_ACCESS_KEY=your-secret
# AWS_REGION=us-east-1
```

### Step 3: Get API Keys

**OpenAI:**
1. Go to https://platform.openai.com/api-keys
2. Create new secret key
3. Copy to `OPENAI_API_KEY`

**SendGrid:**
1. Go to https://app.sendgrid.com/settings/api_keys
2. Create API key with "Mail Send" permissions
3. Copy to `SENDGRID_API_KEY`
4. Create unsubscribe group in SendGrid
5. Copy group ID to `SENDGRID_UNSUBSCRIBE_GROUP_ID`

### Step 4: Install Dependencies

```bash
# If using SendGrid
npm install @sendgrid/mail

# If using AWS SES
npm install aws-sdk
```

### Step 5: Set Up Cron Job

For automatic processing, set up a cron job to hit the queue processor:

```bash
# Run every 5 minutes
*/5 * * * * curl -X POST https://iiskills.cloud/api/newsletter/process-queue
```

Or use a service like Vercel Cron or AWS EventBridge.

## 🎨 Newsletter Content Structure

Each AI-generated newsletter includes:

- **Title**: Catchy with emojis (e.g., "Skilling #5: Python Mastery is Here! 🚀")
- **Subject Line**: Compelling email subject
- **Intro**: 2-3 energetic sentences
- **Course Summary**: What makes it awesome
- **Highlights**: Key benefits (bullet points)
- **Fun Fact**: "Did You Know?" or "Pro Tip"
- **CTA**: Exciting call-to-action
- **Emoji Block**: Visual flair

## 📝 Usage

### Adding a Course (Admin)

1. Go to `/admin/courses-manage`
2. Click "Add New Course"
3. Fill in course details:
   - Title, description, highlights
   - Duration, target audience
   - Topics/skills covered
4. Set status to "Published"
5. Newsletter automatically generates and sends!

### Viewing Newsletters

**Public Archive:**
- Visit `/newsletter/archive`
- Browse all past editions
- Click to read full newsletter

**Admin View:**
- Go to `/admin/newsletters`
- See all newsletters (including drafts)
- Preview, resend, or view queue status

### Manual Newsletter Actions

**Process Queue Manually:**
```bash
curl -X POST http://localhost:3000/api/newsletter/process-queue
```

**Resend Newsletter:**
- Go to `/admin/newsletters`
- Click "Resend" on any sent newsletter
- Confirms before sending

## 🎯 AI Prompt Engineering

The system uses a carefully crafted prompt that:

- Specifies the Millennial/Gen Z audience
- Demands energetic, conversational tone
- Requires specific sections (title, intro, highlights, etc.)
- Enforces character limits
- Emphasizes emojis and casual language
- Focuses on benefits over features

**Fallback:** If OpenAI is unavailable, the system uses template-based generation to ensure newsletters always send.

## 📧 Email Template

The HTML email template features:

- **Gradient header** with "Skilling" branding
- **Emoji banner** for visual appeal
- **Responsive design** for mobile
- **Clean typography** for readability
- **Purple/blue color scheme** matching iiskills.cloud
- **Prominent CTA button**
- **Footer** with social links and unsubscribe

## 🔒 Security & Privacy

- **Row Level Security** on all tables
- Public can only see published courses and sent newsletters
- Unsubscribe link in every email
- GDPR-compliant
- No spam - only sends when new course published
- API keys stored securely in environment variables

## 📊 Analytics & Monitoring

Track newsletter performance:
- Sent count per edition
- Queue processing status
- Failed tasks with error messages
- Generation metadata (AI tokens used)

## 🚀 Advanced Features

### Custom AI Prompts

Modify the prompt in `lib/ai-newsletter-generator.js` to:
- Change tone/style
- Add new sections
- Adjust length
- Include specific keywords

### Multiple Languages

The system is designed for future localization:
- Store language preference in newsletter_subscribers
- Generate content in multiple languages
- Use AI translation for existing newsletters

### A/B Testing

Future enhancement:
- Generate multiple versions
- Test different subject lines
- Track open rates
- Optimize based on engagement

## 🐛 Troubleshooting

**Newsletter not generating:**
- Check OpenAI API key is valid
- Verify course status is "published"
- Check newsletter_queue for failed tasks
- Review API logs for errors

**Email not sending:**
- Verify email provider credentials
- Check newsletter_subscribers has active subscribers
- Review email service logs (SendGrid/SES)
- Test with fallback console logging

**Queue not processing:**
- Ensure cron job is running
- Manually trigger: POST to `/api/newsletter/process-queue`
- Check task attempts haven't exceeded max (3)

## 📁 File Structure

```
/lib/
  ai-newsletter-generator.js  # AI content generation
  email-sender.js             # Email delivery service

/pages/api/
  courses.js                  # Course CRUD API
  newsletter/
    process-queue.js          # Queue processor

/pages/
  newsletter/
    archive.js                # Public archive page
    view/[id].js              # Individual newsletter view
  admin/
    courses-manage.js         # Course management
    newsletters.js            # Newsletter admin dashboard

/supabase/migrations/
  courses_and_newsletter.sql  # Database schema
```

## 🎓 Best Practices

1. **Test Before Publishing**: Use status="draft" to test course creation without triggering newsletter
2. **Review AI Content**: Preview generated newsletter before it sends
3. **Monitor Queue**: Regularly check queue for failed tasks
4. **Backup Data**: Regular backups of newsletter_editions table
5. **Rate Limiting**: OpenAI has rate limits - space out course publications
6. **Subscriber Management**: Regularly clean up bounced/invalid emails

## 🔗 Related Documentation

- [Main README](./README.md)
- [Newsletter & AI Assistant](./NEWSLETTER_AI_ASSISTANT_README.md)
- [Supabase Configuration](./SUPABASE_CONFIGURATION.md)
- [Deployment Guide](./DEPLOYMENT.md)

## 💡 Future Enhancements

- [ ] Email analytics (open rates, click rates)
- [ ] Subscriber preferences (frequency, topics)
- [ ] A/B testing for subject lines
- [ ] Multi-language support
- [ ] Newsletter templates editor
- [ ] Scheduled publishing
- [ ] Social media auto-posting
- [ ] AI-powered personalization per subscriber

## 📞 Support

For questions or issues:
- Email: info@iiskills.cloud
- Review this documentation
- Check API logs and error messages

---

**Built with ❤️ for the iiskills.cloud community**

*Last Updated: January 2026*
