# Skilling Newsletter - Quick Reference

## 🚀 Quick Start

### Publishing a New Course (Triggers Newsletter)

1. Go to: `/admin/courses-manage`
2. Click: **Add New Course**
3. Fill in details (title, description, highlights, etc.)
4. Set status: **Published**
5. Click: **Create Course**
6. ✅ Newsletter auto-generates and sends!

### Manual Queue Processing

1. Go to: `/admin/newsletters`
2. Click: **Process Queue**
3. Wait for tasks to complete
4. Refresh to see results

## 📋 Admin Pages

| Page | URL | Purpose |
|------|-----|---------|
| **Admin Dashboard** | `/admin` | Main admin home |
| **Course Management** | `/admin/courses-manage` | Add/edit/publish courses |
| **Newsletter Dashboard** | `/admin/newsletters` | View newsletters & queue |
| **Test Generator** | `/admin/test-newsletter` | Test AI generation |
| **Newsletter Archive** | `/newsletter/archive` | Public newsletter archive |

## 🎯 Common Tasks

### View All Newsletters
`/admin/newsletters` → See list of all newsletters with status

### Preview a Newsletter
`/admin/newsletters` → Click **Preview** on any newsletter

### Resend a Newsletter
`/admin/newsletters` → Click **Resend** → Confirm

### Test Newsletter Generation
`/admin/test-newsletter` → Click **Generate Newsletter**

### Check Queue Status
`/admin/newsletters` → View **Queue Status** section

## 📧 Email Service Status

### SendGrid
- Dashboard: https://app.sendgrid.com
- Check: Activity → Recent sends
- Limit: 100/day (free), 100k/month (paid)

### AWS SES
- Dashboard: AWS Console → SES → Sending Statistics
- Monitor: Bounce/complaint rates
- Production access required for >200 emails/day

## 🤖 AI Generation

### Powered By: OpenAI GPT-4o-mini
- Cost: ~$0.01-0.03 per newsletter
- Fallback: Template-based if API unavailable
- Customization: Edit prompts in `lib/ai-newsletter-generator.js`

## 📊 Newsletter Stats

Check in newsletter dashboard:
- **Edition Number**: Sequential counter
- **Status**: draft, scheduled, sent, failed
- **Sent Count**: Number of recipients
- **Sent At**: Timestamp of delivery

## ⚙️ Environment Variables

Required for production:

```bash
# AI
OPENAI_API_KEY=sk-...

# Email (choose one)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG....
SENDGRID_UNSUBSCRIBE_GROUP_ID=12345

# OR
EMAIL_PROVIDER=ses
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

## 🔄 Newsletter Lifecycle

```
Course Published
    ↓
Queue: "generate" task created
    ↓
Process Queue (manual or cron)
    ↓
AI generates content
    ↓
Newsletter created (draft)
    ↓
Queue: "send" task created
    ↓
Process Queue again
    ↓
Email sent to subscribers
    ↓
Status: sent
    ↓
Appears in public archive
```

## 🐛 Troubleshooting

### Newsletter Not Generating

1. Check course status is "published"
2. Go to `/admin/newsletters`
3. Look at Queue Status for errors
4. Click **Process Queue** manually

### Email Not Sending

1. Verify env vars are set
2. Check SendGrid/SES dashboard
3. Confirm sender email is verified
4. Check subscriber table has active subscribers

### Queue Stuck

1. Go to `/admin/newsletters`
2. Check queue for "processing" tasks
3. If stuck >1 hour, reset in database
4. Click **Process Queue** again

## 💡 Pro Tips

### For Best Results:

✅ Fill in ALL course fields (highlights, duration, target audience)
✅ Use compelling course descriptions
✅ Add 3-5 highlights per course
✅ Test with draft status first
✅ Preview newsletter before publishing course

### For Better Engagement:

📧 Catchy course titles get better open rates
🎨 Use the test generator to preview first
⏰ Publish courses during weekday mornings
📊 Monitor SendGrid/SES analytics
🔄 A/B test subject lines (future feature)

## 🎨 Customization

### Email Template
File: `lib/ai-newsletter-generator.js` → `generateEmailHTML()`
- Change colors in inline styles
- Modify layout structure
- Add/remove sections

### AI Prompt
File: `lib/ai-newsletter-generator.js` → `buildPrompt()`
- Adjust tone/style instructions
- Change section requirements
- Modify emoji usage

### Fallback Content
File: `lib/ai-newsletter-generator.js` → `generateFallbackContent()`
- Edit default templates
- Customize per category
- Add more variety

## 📞 Support

**Need Help?**
1. Check: [SKILLING_NEWSLETTER_README.md](./SKILLING_NEWSLETTER_README.md)
2. Review: [SKILLING_SETUP_GUIDE.md](./SKILLING_SETUP_GUIDE.md)
3. Email: info@iiskills.cloud

**Report Issues:**
- GitHub Issues (if applicable)
- Direct email to admin team
- Include error messages from queue

## 🔐 Security Notes

- Never commit `.env.local` to git
- Rotate API keys every 90 days
- Monitor API usage for anomalies
- Keep Supabase RLS policies enabled
- Verify unsubscribe links work

## 📈 Analytics

Track in email provider dashboard:
- **Open Rate**: % of emails opened
- **Click Rate**: % who clicked links
- **Bounce Rate**: Invalid emails (remove these)
- **Unsubscribe Rate**: Should be <1%

Good benchmarks:
- Open rate: 15-25%
- Click rate: 2-5%
- Unsubscribe: <0.5%

---

**Last Updated:** January 2026  
**Version:** 1.0  
**System:** Skilling Newsletter by iiskills.cloud
