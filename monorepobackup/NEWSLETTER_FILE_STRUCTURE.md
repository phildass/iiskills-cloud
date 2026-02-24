# Newsletter File Structure - Visual Reference

**Generated:** 2026-01-17  
**Purpose:** Visual reference for newsletter file locations

---

## 📁 Root Directory Structure

```
iiskills-cloud/
│
├── 📄 Documentation (Newsletter-Related)
│   ├── NEWSLETTER_SUMMARY.md ✅ (Quick deployment guide)
│   ├── NEWSLETTER_IMPLEMENTATION_GUIDE.md ✅ (Detailed setup)
│   ├── NEWSLETTER_RELEASE_NOTES.md ✅ (Release notes)
│   ├── SKILLING_NEWSLETTER_README.md ✅ (AI system guide)
│   ├── NEWSLETTER_AI_ASSISTANT_README.md ✅ (AI integration)
│   ├── NEWSLETTER_POPUP_FIX_SUMMARY.md ✅ (Popup fixes)
│   ├── NEWSLETTER_POPUP_TOAST_FIX_SUMMARY.md ✅ (Toast fixes)
│   ├── IMPLEMENTATION_NEWSLETTER_AI.md ✅ (AI implementation)
│   ├── PR_SUMMARY_NEWSLETTER_AI.md ✅ (PR summary)
│   ├── NEWSLETTER_DESIGN_VERIFICATION_REPORT.md ✅ (Full verification)
│   └── NEWSLETTER_VERIFICATION_SUMMARY.md ✅ (Quick summary)
│
├── 🧩 Components
│   └── shared/
│       ├── NewsletterSignup.js ✅ (Main subscription component)
│       ├── NewsletterNavLink.js ✅ (Navigation link)
│       └── UniversalRegister.js ✅ (Registration with newsletter opt-in)
│
├── 📄 Pages
│   ├── newsletter.js ✅ (Main newsletter page)
│   ├── unsubscribe.js ✅ (Root unsubscribe page)
│   │
│   ├── newsletter/
│   │   ├── archive.js ✅ (Newsletter archive)
│   │   ├── unsubscribe.js ✅ (Newsletter unsubscribe)
│   │   └── view/
│   │       └── [id].js ✅ (Individual newsletter view)
│   │
│   ├── admin/
│   │   ├── newsletters.js ✅ (Newsletter dashboard)
│   │   ├── courses-manage.js ✅ (Course management)
│   │   └── test-newsletter.js ✅ (Newsletter testing)
│   │
│   └── api/
│       ├── courses.js ✅ (Course API)
│       └── newsletter/
│           ├── subscribe.js ✅ (Subscribe API)
│           ├── unsubscribe.js ✅ (Unsubscribe API)
│           ├── generate-token.js ✅ (Token generation API)
│           └── process-queue.js ✅ (Queue processor API)
│
├── 🔧 Utilities & Libraries
│   ├── utils/
│   │   └── useNewsletterPopup.js ✅ (Popup timing hook)
│   │
│   └── lib/
│       ├── ai-newsletter-generator.js ✅ (AI content generation)
│       └── email-sender.js ✅ (Email delivery)
│
├── 🗄️ Database
│   └── supabase/
│       ├── profiles_schema.sql ✅ (Profiles with newsletter field)
│       └── migrations/
│           ├── add_newsletter_subscription_to_profiles.sql ✅
│           └── courses_and_newsletter.sql ✅ (if exists)
│
└── 🧪 Testing
    └── test-resend-auth.js ✅ (Email auth testing)
```

---

## 📱 Replicated App Structure

Each of the following apps contains a copy of the newsletter components:

```
apps/main/ ✅
learn-ai/ ✅
learn-apt/ ✅
learn-chemistry/ ✅
learn-data-science/ ✅
learn-geography/ ✅
learn-govt-jobs/ ✅
learn-ias/ ✅
learn-jee/ ✅
learn-leadership/ ✅
learn-management/ ✅
learn-math/ ✅
learn-neet/ ✅
learn-physics/ ✅
learn-pr/ ✅
learn-winning/ ✅
```

**Total Apps:** 16

### Files in Each App

```
{app-name}/
├── components/shared/
│   ├── NewsletterSignup.js ✅
│   ├── NewsletterNavLink.js ✅
│   └── UniversalRegister.js ✅
│
├── pages/
│   ├── newsletter.js ✅
│   ├── unsubscribe.js ✅
│   ├── _app.js ✅ (includes newsletter popup integration)
│   └── api/newsletter/
│       ├── subscribe.js ✅
│       ├── unsubscribe.js ✅
│       └── generate-token.js ✅
│
└── utils/
    └── useNewsletterPopup.js ✅
```

---

## 🌐 URL Structure

### Public URLs

```
https://iiskills.cloud/newsletter                    # Main newsletter page
https://iiskills.cloud/newsletter/archive            # Newsletter archive
https://iiskills.cloud/newsletter/view/{id}          # Individual newsletter
https://iiskills.cloud/unsubscribe?token={token}     # Unsubscribe page
```

### Admin URLs

```
https://iiskills.cloud/admin/newsletters             # Newsletter dashboard
https://iiskills.cloud/admin/courses-manage          # Course management
https://iiskills.cloud/admin/test-newsletter         # Newsletter testing
```

### API Endpoints

```
POST https://iiskills.cloud/api/newsletter/subscribe       # Subscribe
POST https://iiskills.cloud/api/newsletter/unsubscribe     # Unsubscribe
POST https://iiskills.cloud/api/newsletter/generate-token  # Generate token
POST https://iiskills.cloud/api/newsletter/process-queue   # Process queue
POST https://iiskills.cloud/api/courses                    # Course CRUD
```

### Subdomain URLs

Each learn-* app has the same structure:

```
https://learn-ai.iiskills.cloud/newsletter
https://learn-math.iiskills.cloud/newsletter
https://learn-physics.iiskills.cloud/newsletter
... (15 total)
```

---

## 📊 File Count Summary

| Category | Count |
|----------|-------|
| Root Newsletter Components | 3 |
| Root Newsletter Pages | 5 |
| Root Newsletter APIs | 5 |
| Root Newsletter Utils/Libs | 3 |
| Root Newsletter Database | 3 |
| Root Newsletter Test | 1 |
| Root Newsletter Docs | 13 |
| **Root Code Total** | **20** |
| **Root Total (with docs)** | **33** |
| | |
| Components per App | 2-3 |
| Pages per App | 2-3 |
| APIs per App | 3 |
| Utils per App | 0-1 |
| **Files per App** | **9** (average) |
| | |
| Total Apps | 16 |
| **App Files Total** | **144** |
| | |
| **Grand Total** | **177 files** |

---

## 🎯 Key Files for Quick Access

### Most Important Files

1. **Main Newsletter Page**
   ```
   /pages/newsletter.js
   ```

2. **Newsletter Signup Component**
   ```
   /components/shared/NewsletterSignup.js
   ```

3. **Subscribe API**
   ```
   /pages/api/newsletter/subscribe.js
   ```

4. **Implementation Guide**
   ```
   /NEWSLETTER_IMPLEMENTATION_GUIDE.md
   ```

5. **Verification Report**
   ```
   /NEWSLETTER_DESIGN_VERIFICATION_REPORT.md
   ```

---

## 🔍 Quick Search Commands

Find all newsletter files:
```bash
find . -name "*newsletter*" -o -name "*Newsletter*"
```

Find newsletter JavaScript files:
```bash
find . -name "*newsletter*.js" -o -name "*Newsletter*.js"
```

Count total newsletter-related files:
```bash
find . -name "*newsletter*" -o -name "*Newsletter*" | wc -l
```

Search newsletter content in code:
```bash
grep -r "newsletter\|Newsletter" --include="*.js" --include="*.jsx"
```

---

## 📋 Verification Checklist

Use this to verify files exist:

```bash
# Root components
[ -f components/shared/NewsletterSignup.js ] && echo "✅ NewsletterSignup.js"
[ -f components/shared/NewsletterNavLink.js ] && echo "✅ NewsletterNavLink.js"
[ -f components/shared/UniversalRegister.js ] && echo "✅ UniversalRegister.js"

# Root pages
[ -f pages/newsletter.js ] && echo "✅ newsletter.js"
[ -f pages/unsubscribe.js ] && echo "✅ unsubscribe.js"
[ -f pages/newsletter/archive.js ] && echo "✅ archive.js"

# APIs
[ -f pages/api/newsletter/subscribe.js ] && echo "✅ subscribe API"
[ -f pages/api/newsletter/unsubscribe.js ] && echo "✅ unsubscribe API"
[ -f pages/api/newsletter/generate-token.js ] && echo "✅ token API"

# Utils
[ -f utils/useNewsletterPopup.js ] && echo "✅ useNewsletterPopup"
[ -f lib/ai-newsletter-generator.js ] && echo "✅ AI generator"
[ -f lib/email-sender.js ] && echo "✅ email sender"

# Documentation
[ -f NEWSLETTER_SUMMARY.md ] && echo "✅ Summary"
[ -f NEWSLETTER_IMPLEMENTATION_GUIDE.md ] && echo "✅ Implementation Guide"
[ -f NEWSLETTER_DESIGN_VERIFICATION_REPORT.md ] && echo "✅ Verification Report"
```

---

## 🎨 Component Relationship Diagram

```
┌─────────────────────────────────────────┐
│         User Visits Site                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    _app.js (useNewsletterPopup)         │
│    Displays popup after 3 seconds       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    NewsletterSignup Component           │
│    (Modal Mode)                         │
└──────────────┬──────────────────────────┘
               │
               ├──► User enters email
               │
               ▼
┌─────────────────────────────────────────┐
│    /api/newsletter/subscribe            │
│    Validates, saves to DB               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    Supabase Database                    │
│    - profiles (subscribed_to_newsletter)│
│    - newsletter_subscribers             │
└─────────────────────────────────────────┘


Alternative Flow:
┌─────────────────────────────────────────┐
│    User Navigates to /newsletter        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    pages/newsletter.js                  │
│    Shows newsletter page                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    NewsletterSignup Component           │
│    (Embedded Mode)                      │
└─────────────────────────────────────────┘
```

---

## 📞 Quick Reference

**For Full Details:** See [NEWSLETTER_DESIGN_VERIFICATION_REPORT.md](./NEWSLETTER_DESIGN_VERIFICATION_REPORT.md)  
**For Quick Summary:** See [NEWSLETTER_VERIFICATION_SUMMARY.md](./NEWSLETTER_VERIFICATION_SUMMARY.md)  
**For Implementation:** See [NEWSLETTER_IMPLEMENTATION_GUIDE.md](./NEWSLETTER_IMPLEMENTATION_GUIDE.md)

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-17  
**Status:** ✅ Complete
