# Landing Page Wireframe - Learn Govt Jobs Platform

## Overview
The landing page is designed to be vibrant, search-centric, and conversion-focused while building trust through transparency and verified sources. The design prioritizes mobile-first experience with offline capabilities for rural users.

---

## Layout Structure

### 1. Header / Navigation Bar
**Position:** Sticky top
**Components:**
- Logo (iiskills.cloud - Learn Govt Jobs)
- Navigation links:
  - Home
  - Jobs Board
  - Exam Preparation
  - Current Affairs
  - Study Guides
  - About
- User actions (right-aligned):
  - Login/Register button (if not logged in)
  - Profile icon with dropdown (if logged in)
  - Notification bell icon (with badge count)

**Mobile:** Hamburger menu, logo centered, profile icon on right

---

### 2. Hero Section - Power Search Bar
**Design:** Vibrant gradient background (primary to accent), full-width
**Content:**

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│         🔍 Find Government Jobs That Match You          │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │ 🔍  Search by job title, organization, exam... │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
│   [State ▼] [District ▼] [Taluk ▼] [Category ▼]       │
│   [Qualification ▼] [Exam Name ▼]                      │
│                                                         │
│               [ Search Jobs ] [ Advanced ]              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elements:**
- **Main Heading:** "Find Government Jobs That Match You" (H1, large, bold, white)
- **Subheading:** "AI-powered job matching • Real-time updates • Verified sources" (smaller, white with opacity)
- **Search Bar:**
  - Large, prominent input field with search icon
  - Autocomplete with recent searches
  - Placeholder text with examples
- **Filter Dropdowns (Cascading):**
  - State → District → Taluk (geo-spatial cascade)
  - Job Category (Banking, Railway, PSC, etc.)
  - Minimum Qualification (10th, 12th, Graduate, etc.)
  - Exam Name (SSC CGL, UPSC, RRB, etc.)
- **Quick Filter Bubbles:** Below dropdowns
  ```
  [🏛️ Central Govt] [🏢 State PSC] [🚂 Railway] [🏦 Banking] [🎓 Teaching]
  ```
- **Search Button:** Large, contrasting color (green), with loading state

**For Logged-in Users:**
- Additional badge: "Showing {X} jobs matching your profile"
- Personalization indicator

**Mobile Adaptation:**
- Stack filters vertically
- Collapsible advanced filters
- Voice search button

---

### 3. Dynamic Ticker / Statistics Banner
**Position:** Below hero, sticky on scroll
**Design:** Horizontal scrolling ticker with stats

```
┌──────────────────────────────────────────────────────────┐
│ 🔥 1,240 new jobs added today  •  📊 98,450 total active │
│ jobs  •  ⏰ 145 deadlines this week  •  🎯 12,500 users │
│ got their dream job  •  ✅ 99.5% source accuracy        │
└──────────────────────────────────────────────────────────┘
```

**Elements:**
- Auto-scrolling statistics
- Updated in real-time
- Eye-catching icons
- Urgent deadlines highlighted in orange/red

---

### 4. Personalized Dashboard (Logged-in Users Only)
**Position:** Immediately below ticker
**Design:** Card-based layout with match scores

```
┌─────────────────────────────────────────────────────────┐
│  📊 Your Job Match Dashboard                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [92% Match] Software Engineer - Karnataka PSC          │
│  ✓ Location matches  ✓ Qualification matches           │
│  ⚠️ Closes in 5 days                                    │
│  [View Details] [Apply Now]                            │
│                                                         │
│  [85% Match] Junior Analyst - UPSC                     │
│  ✓ Profile matches  ⚠️ Age limit: 2 years left        │
│  ⏰ Closes in 12 days                                   │
│  [View Details] [Apply Now]                            │
│                                                         │
│  [ See All Recommendations ]                            │
└─────────────────────────────────────────────────────────┘
```

**Elements:**
- Top 3-5 job matches sorted by match score
- Match score badge (color-coded)
- Match reasoning summary (expandable)
- Quick actions (View, Apply, Save)
- "See All" button linking to full dashboard

**For Non-logged Users:**
- Show preview (blurred match scores)
- CTA: "Login to see your personalized matches"
- Trial offer: "Try free for 7 days"

---

### 5. Visual Job Status Heatmap
**Position:** Below dashboard/hero
**Design:** Geographic heat map or state-wise grid

```
┌─────────────────────────────────────────────────────────┐
│  🗺️ Jobs by State                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [Karnataka: 450 jobs 🟢] [Maharashtra: 680 jobs 🟢]   │
│  [Tamil Nadu: 320 jobs 🟡] [Delhi: 890 jobs 🟢]        │
│  [Uttar Pradesh: 240 jobs 🟡] [Gujarat: 180 jobs 🔴]   │
│                                                         │
│  🟢 Many openings  🟡 Moderate  🔴 Few openings         │
└─────────────────────────────────────────────────────────┘
```

**Elements:**
- State cards with job counts
- Color-coded status:
  - 🟢 Green: >200 active jobs
  - 🟡 Yellow: 50-200 active jobs
  - 🔴 Red: <50 active jobs
- Click to filter by state
- Responsive grid (4 cols desktop, 2 cols tablet, 1 col mobile)

---

### 6. Recent Jobs Feed
**Position:** Main content area
**Design:** Card grid with filters on left sidebar (desktop)

```
┌──────┬──────────────────────────────────────────────────┐
│      │ 🔥 Latest Government Jobs                       │
│ Fil- ├──────────────────────────────────────────────────┤
│ ters │                                                  │
│      │ ┌────────────────────────────────────────────┐  │
│ [✓]  │ │ 🟢 NEW Karnataka State Civil Services      │  │
│ Cen- │ │ Karnataka Public Service Commission        │  │
│ tral │ │                                             │  │
│      │ │ 💼 450 Vacancies  📍 Karnataka              │  │
│ [✓]  │ │ 🎓 Graduate  📅 Age: 21-35                  │  │
│ Sta- │ │ ⏰ Apply by: 2026-03-15 (37 days left)      │  │
│ te   │ │                                             │  │
│      │ │ [85% Match] [View] [Save] [Share]           │  │
│ [ ]  │ └────────────────────────────────────────────┘  │
│ PSU  │                                                  │
│      │ ┌────────────────────────────────────────────┐  │
│ ---  │ │ 🟡 Staff Selection Commission - CGL 2026   │  │
│      │ │ Staff Selection Commission                 │  │
│ Cate-│ │                                             │  │
│ gory │ │ 💼 8,000+ Vacancies  📍 All India           │  │
│      │ │ 🎓 Graduate  📅 Age: 18-30                  │  │
│ [✓]  │ │ ⚠️ Apply by: 2026-02-28 (22 days left)     │  │
│ Bank-│ │                                             │  │
│ ing  │ │ [92% Match] [View] [Save] [Share]           │  │
│      │ └────────────────────────────────────────────┘  │
│ [ ]  │                                                  │
│ Rail-│                 [ Load More Jobs ]               │
│ way  │                                                  │
└──────┴──────────────────────────────────────────────────┘
```

**Left Sidebar Filters (Desktop):**
- Job Type (Central/State/PSU/Local)
- Category (Banking, Railway, Defense, etc.)
- State/District/Taluk
- Qualification
- Age Range
- Application Status (Open/Closing Soon/Closed)
- Sort by: Match Score, Deadline, Date Posted, Vacancies

**Job Cards:**
- Status indicator (🟢 New <48hrs, 🟡 <7 days to deadline, 🔴 Closing soon)
- Title (large, bold, clickable)
- Organization
- Key info (Vacancies, Location, Qualification, Age)
- Deadline with countdown
- Match score (if logged in)
- Action buttons (View, Save, Share, Official PDF)
- Trust badge (Verified source, Official .gov.in link)

**Mobile:**
- Filters in collapsible drawer (bottom sheet)
- Floating filter button
- Stack cards vertically

---

### 7. Preparation Sidebar (Sticky on Desktop)
**Position:** Right sidebar (desktop only)
**Design:** Sticky card with daily content

```
┌─────────────────────────────┐
│ 📚 Today's Study Material   │
├─────────────────────────────┤
│                             │
│ 📰 Current Affairs          │
│ • PIB Highlights (Feb 6)    │
│ • Economic Survey 2026      │
│ • New Government Schemes    │
│                             │
│ 📖 Study Guides             │
│ • SSC CGL Syllabus          │
│ • UPSC Preparation Roadmap  │
│ • Interview Tips            │
│                             │
│ 🎯 Exam Calendar            │
│ • Feb 15: RRB NTPC Exam     │
│ • Mar 10: SSC CGL Tier 1    │
│ • Apr 5: Bank PO Prelims    │
│                             │
│ [ View All Resources ]      │
└─────────────────────────────┘
```

**Content:**
- Daily current affairs (3 top stories)
- Recommended study guides
- Upcoming exam dates
- Link to full resources page

**Mobile:**
- Show at bottom of feed
- Collapsible sections

---

### 8. Trust & Anti-Scam Section
**Position:** Mid-page, between job listings
**Design:** Highlighted card with badges

```
┌─────────────────────────────────────────────────────────┐
│         ✅ How We Keep You Safe from Job Scams          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ✓ 100% Official Sources (.gov.in/.nic.in verified)    │
│  ✓ AI-verified notifications with source links         │
│  ✓ No payment required for job applications            │
│  ✓ Direct links to official PDFs                       │
│  ✓ Scam alert system with user reports                 │
│                                                         │
│  ⚠️ IMPORTANT: Government jobs NEVER require payment   │
│     for application, except official application fees  │
│     paid directly on government portals.                │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Elements:**
- Trust indicators with checkmarks
- Bold warning about scams
- Link to "How to Identify Job Scams" guide
- Report scam button

---

### 9. Subscription / Paywall CTA
**Position:** After ~10 job cards for free users
**Design:** Modal overlay or inline card

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  🎁 Unlock Full Access - Limited Time Offer!           │
│                                                         │
│  ✓ Unlimited job searches and alerts                   │
│  ✓ AI-powered match scores for every job               │
│  ✓ Personalized document checklist                     │
│  ✓ WhatsApp job notifications                          │
│  ✓ Priority support                                    │
│                                                         │
│     ₹99/year  (that's less than ₹9/month!)             │
│                                                         │
│  [ Start Free Trial ] [ Subscribe Now ]                │
│                                                         │
│  ⏰ Offer ends in: 23:45:12                             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**For Free Users:**
- Show after viewing 10 jobs
- "Try Free for 7 days" option
- Countdown timer for urgency
- UPI payment option highlighted

**Business Logic:**
- Free users can search and view jobs
- Match scores blurred/limited
- Advanced filters locked
- Job alerts limited to 1 per week

---

### 10. Footer
**Position:** Bottom of page
**Design:** Multi-column layout

```
┌─────────────────────────────────────────────────────────┐
│  Learn Govt Jobs                                        │
│                                                         │
│  About            Quick Links         Resources         │
│  • Our Mission    • All Jobs          • Current Affairs │
│  • How It Works   • By State          • Study Guides    │
│  • Privacy Policy • By Category       • Exam Calendar   │
│  • Terms of Use   • Exam Prep         • Blog            │
│                   • Success Stories                     │
│                                                         │
│  ⚠️ DISCLAIMER: This is a private job aggregator and    │
│     NOT affiliated with any government organization.    │
│     Always verify details from official sources before  │
│     applying. We do not charge for applications.        │
│                                                         │
│  📞 Contact: support@iiskills.cloud                     │
│  📱 Follow us: [Twitter] [Facebook] [WhatsApp]          │
│                                                         │
│  © 2026 iiskills.cloud. All rights reserved.           │
└─────────────────────────────────────────────────────────┘
```

**Elements:**
- Prominent disclaimer (bold, highlighted)
- Contact information
- Social media links
- Important links (Privacy, Terms, About)
- WhatsApp sharing button

---

## Color Coding System

### Job Status Colors
- **🟢 Green (New):** Job posted in last 48 hours
- **🟡 Yellow (Closing Soon):** Deadline within 7 days
- **🔴 Red (Urgent):** Deadline within 3 days or exam approaching
- **⚫ Gray (Closed):** Application closed or result declared

### Match Score Colors
- **🟢 Green (>75%):** Excellent match
- **🟡 Yellow (50-75%):** Good match
- **🟠 Orange (<50%):** Partial match

### Priority Badges
- **⚡ HOT:** High demand jobs
- **🔥 TRENDING:** Many users saving/applying
- **⭐ FEATURED:** Editor's pick or sponsored

---

## Mobile-Specific Features

### Bottom Navigation (Thumb-Friendly)
```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                   [ Content Area ]                      │
│                                                         │
├─────────┬──────────┬──────────┬──────────┬─────────────┤
│   🏠    │    🔍    │    🔖    │    📚    │     👤      │
│  Home   │  Search  │  Saved   │  Study   │  Profile    │
└─────────┴──────────┴──────────┴──────────┴─────────────┘
```

**Icons:**
- 🏠 Home (Feed)
- 🔍 Search
- 🔖 Saved Jobs (with badge count)
- 📚 Study/Preparation
- 👤 Profile/Settings

### Offline "Star Job" Feature
- Star/save jobs for offline viewing
- Download official PDF for offline access
- Sync when back online
- Visual indicator for offline-available jobs

### WhatsApp Share
**Share Format:**
```
*{Job Title}*

{Organization}

📍 {Location}
💼 {Vacancies} Vacancies
📅 Apply by: {Deadline}

🔗 {Official Link}

Shared via Learn Govt Jobs
```

**Share Button:**
- Pre-filled WhatsApp message
- One-click sharing
- Track shares for trending jobs

---

## Accessibility & Localization

### Language Switcher
- English (default)
- Hindi
- Regional languages (Tamil, Telugu, Kannada, etc.)
- RTL support for Urdu

### WCAG Compliance
- High contrast mode toggle
- Screen reader support
- Keyboard navigation
- Font size adjustment (+/-)
- Focus indicators

---

## Performance Optimization

### Above-the-Fold Priority
1. Hero search bar (instant load)
2. Quick filters (immediate interaction)
3. First 3 job cards (progressive loading)
4. Rest loads on scroll

### Lazy Loading
- Images load on scroll
- Job cards render in batches (10 at a time)
- Infinite scroll with "Load More" fallback

### Caching Strategy
- Search results cached for 1 hour
- Static content (filters, categories) cached for 24 hours
- User preferences cached locally
- Service worker for offline support

---

## Analytics & Tracking

### Key Metrics
- Search terms and filters used
- Job card click-through rate
- Match score correlation with applications
- Conversion rate (free to paid)
- Time to first job save
- WhatsApp share count

### A/B Testing
- Hero CTA variations
- Filter layout (sidebar vs top)
- Match score display format
- Subscription pricing/messaging

---

## Implementation Priority

### Phase 1: MVP (Core Experience)
1. ✅ Hero search bar with basic filters
2. ✅ Job listing with pagination
3. ✅ Basic job card with essential info
4. ✅ Mobile responsive layout

### Phase 2: Enhanced UX
1. ⏳ Match score integration
2. ⏳ Personalized dashboard
3. ⏳ Advanced filters (cascading geo)
4. ⏳ Subscription paywall

### Phase 3: Trust & Engagement
1. ⏳ Trust badges and disclaimers
2. ⏳ WhatsApp integration
3. ⏳ Offline support
4. ⏳ Study/preparation sidebar

### Phase 4: Optimization
1. ⏳ Performance tuning
2. ⏳ Multilingual support
3. ⏳ Advanced analytics
4. ⏳ AI-powered recommendations

---

**Document Version:** 1.0  
**Last Updated:** 2026-02-06  
**Status:** Design Specification
