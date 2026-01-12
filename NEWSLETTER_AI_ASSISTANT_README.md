# Newsletter Subscription and AI Assistant System

This document describes the unified newsletter subscription and AI assistant system implemented across all iiskills.cloud domains and subdomains using a monorepo structure.

## 🏗️ Monorepo Structure

The repository has been restructured as a monorepo using **Turborepo** with the following layout:

```
iiskills-cloud/
├── apps/
│   └── main/              # Main iiskills.cloud app
├── packages/
│   └── shared-ui/         # Shared UI components
├── learn-*/               # Learning module apps (15 apps)
├── turbo.json            # Turborepo configuration
└── package.json          # Root workspace configuration
```

### Workspace Configuration

The monorepo uses npm workspaces to manage dependencies across all packages:

- **apps/main**: The primary iiskills.cloud website
- **packages/shared-ui**: Shared UI components (Newsletter, AI Assistant, etc.)
- **learn-\***: 15 learning module applications (learn-ai, learn-math, etc.)

## 📦 Shared UI Package (@iiskills/shared-ui)

Located in `/packages/shared-ui`, this package provides reusable components used across all apps:

### Components

#### 1. NewsletterSignup

A newsletter subscription component with two modes:

**Props:**

- `mode`: 'modal' | 'embedded' (default: 'embedded')
- `onClose`: Callback when modal is closed
- `onSuccess`: Callback when subscription succeeds

**Features:**

- Modal popup mode for initial visits
- Embedded mode for dedicated newsletter page
- Google reCAPTCHA v3 integration
- Email validation
- Success/error messaging
- Privacy and terms links
- Responsive design

**Usage:**

```jsx
import { NewsletterSignup } from '@iiskills/shared-ui'

// Embedded mode (for /newsletter page)
<NewsletterSignup mode="embedded" />

// Modal mode (for popup)
<NewsletterSignup
  mode="modal"
  onClose={() => setShowModal(false)}
  onSuccess={() => console.log('Subscribed!')}
/>
```

#### 2. AIAssistant

A floating chatbot assistant with site-aware context.

**Features:**

- Floating button in bottom-right corner
- Expandable chat window
- Site-aware responses based on subdomain
- Context-specific welcome messages
- Unobtrusive design
- Accessible everywhere

**Usage:**

```jsx
import { AIAssistant } from "@iiskills/shared-ui";

// Add to your _app.js or layout
<AIAssistant />;
```

**Site-Aware Context:**
The AI Assistant automatically detects the current subdomain and provides relevant context:

- learn-ai → "artificial intelligence and machine learning"
- learn-math → "mathematics education"
- learn-jee → "JEE exam preparation"
- etc.

#### 3. NewsletterNavLink

A navigation link component for the newsletter.

**Usage:**

```jsx
import { NewsletterNavLink } from "@iiskills/shared-ui";

<NewsletterNavLink className="hover:text-primary" />;
```

### Utilities

#### useNewsletterPopup Hook

Manages newsletter popup display timing and persistence.

**Parameters:**

- `intervalDays`: Days between popup displays (default: 7)

**Returns:**

- `showPopup`: Boolean indicating if popup should show
- `closePopup(subscribed)`: Function to close popup and save state

**Features:**

- Shows popup on first visit after 3-second delay
- Remembers last display time in localStorage
- Respects interval settings
- Never shows again if user subscribes

**Usage:**

```jsx
import { useNewsletterPopup, NewsletterSignup } from "@iiskills/shared-ui";

function MyApp() {
  const { showPopup, closePopup } = useNewsletterPopup(7); // Show every 7 days

  return (
    <>
      {showPopup && (
        <NewsletterSignup
          mode="modal"
          onClose={() => closePopup(false)}
          onSuccess={() => closePopup(true)}
        />
      )}
    </>
  );
}
```

## 🔗 API Routes

### Newsletter Subscription API

**Endpoint:** `POST /api/newsletter/subscribe`

**Request Body:**

```json
{
  "email": "user@example.com",
  "recaptchaToken": "..."
}
```

**Response (Success):**

```json
{
  "message": "Successfully subscribed!",
  "data": { ... }
}
```

**Response (Already Subscribed):**

```json
{
  "message": "You are already subscribed!",
  "alreadySubscribed": true
}
```

**Features:**

- reCAPTCHA v3 verification
- Duplicate email detection
- Stores in Supabase `newsletter_subscribers` table
- Graceful degradation if database not configured
- Cross-subdomain support

## 📄 Newsletter Page

Every app includes a `/newsletter` page with:

1. **Hero Section**
   - Eye-catching title and description
   - "Subscribe Now" button that scrolls to form

2. **Benefits Section**
   - Learning Resources
   - Career Guidance
   - Exclusive Offers

3. **Newsletter Signup Form**
   - Embedded NewsletterSignup component
   - Scroll-to-form functionality

4. **What to Expect**
   - No spam guarantee
   - Weekly updates promise
   - Easy unsubscribe option

## 🔐 Environment Variables

Add these to your `.env.local` file:

```bash
# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# reCAPTCHA v3 (new)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
```

### Getting reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/create)
2. Choose **reCAPTCHA v3**
3. Add your domains:
   - `iiskills.cloud`
   - `*.iiskills.cloud` (for all subdomains)
   - `localhost` (for development)
4. Copy the **Site Key** → `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
5. Copy the **Secret Key** → `RECAPTCHA_SECRET_KEY`

## 🗄️ Database Setup

Create a `newsletter_subscribers` table in Supabase:

```sql
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserts (anyone can subscribe)
CREATE POLICY "Allow public inserts" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- Policy to allow reads (for checking duplicates)
CREATE POLICY "Allow public reads" ON newsletter_subscribers
  FOR SELECT USING (true);
```

## 🚀 Implementation in Apps

### Adding to Existing Apps

1. **Install dependencies:**

```bash
npm install  # At root level (installs all workspaces)
```

2. **Import and use in \_app.js:**

```jsx
import { AIAssistant, NewsletterSignup, useNewsletterPopup } from "@iiskills/shared-ui";

function MyApp({ Component, pageProps }) {
  const { showPopup, closePopup } = useNewsletterPopup(7);

  return (
    <>
      <Component {...pageProps} />

      {/* AI Assistant - always visible */}
      <AIAssistant />

      {/* Newsletter Popup - shows based on timing */}
      {showPopup && (
        <NewsletterSignup
          mode="modal"
          onClose={() => closePopup(false)}
          onSuccess={() => closePopup(true)}
        />
      )}
    </>
  );
}
```

3. **Add Newsletter link to navigation:**

```jsx
import { NewsletterNavLink } from "@iiskills/shared-ui";

// In your navbar component
<NewsletterNavLink className="hover:text-primary transition" />;
```

### Main App Integration

The main app (`apps/main`) serves as the reference implementation with all features integrated.

## 🎨 Styling

All components use Tailwind CSS with a shared configuration in `/packages/shared-ui/tailwind.config.js`.

**Color Palette:**

- `primary`: #0052CC (iiskills blue)
- `accent`: #C77DDB (purple)
- `neutral`: #F8F9FA (light gray)

**Animations:**

- `animate-slide-up`: Modal entrance animation
- `animate-fade-in`: Overlay fade-in
- `animate-bounce`: Loading indicators

## 📱 Responsive Design

All components are fully responsive:

- Mobile: Stack layout, full-width forms
- Tablet: Adaptive grid layouts
- Desktop: Multi-column layouts, fixed chat position

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels on buttons
- Keyboard navigation support
- Focus states on interactive elements
- Screen reader friendly

## 🧪 Testing

To test the newsletter functionality:

1. Start the development server:

```bash
npm run dev
```

2. Visit `http://localhost:3000/newsletter`
3. Fill out the form and submit
4. Check browser console for API response
5. Verify email in Supabase dashboard

To test the AI Assistant:

1. Look for the floating chat icon in bottom-right
2. Click to open chat window
3. Send a test message
4. Verify site-aware context in response

## 🔄 Cross-Subdomain Consistency

All features work identically on:

- Main domain: `iiskills.cloud`
- All subdomains: `learn-ai.iiskills.cloud`, `learn-math.iiskills.cloud`, etc.

The shared-ui package ensures:

- ✅ Consistent styling
- ✅ Same functionality
- ✅ Unified user experience
- ✅ Single source of truth

## 📝 Development Workflow

### Working on Shared Components

1. Navigate to shared-ui package:

```bash
cd packages/shared-ui
```

2. Make changes to components
3. Changes are immediately available to all apps (via workspace links)
4. Test in multiple apps to ensure compatibility

### Adding New Shared Components

1. Create component in `/packages/shared-ui/components/`
2. Export from `/packages/shared-ui/index.js`
3. Use in any app via import from `@iiskills/shared-ui`

### Building for Production

```bash
# Build all apps
npm run build

# Or build specific app
cd apps/main && npm run build
```

## 🐛 Troubleshooting

### "Module not found: @iiskills/shared-ui"

**Solution:** Run `npm install` at the root level to link workspaces.

### reCAPTCHA not loading

**Solution:**

1. Check `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set
2. Verify domain is added in reCAPTCHA admin console
3. Check browser console for errors

### Newsletter submissions not saving

**Solution:**

1. Verify Supabase credentials are correct
2. Check `newsletter_subscribers` table exists
3. Review API logs for errors
4. System gracefully degrades if DB not configured

### AI Assistant not appearing

**Solution:**

1. Ensure `<AIAssistant />` is included in \_app.js
2. Check for z-index conflicts with other elements
3. Verify component is imported correctly

## 📚 Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [Google reCAPTCHA v3](https://developers.google.com/recaptcha/docs/v3)
- [Supabase Documentation](https://supabase.com/docs)

## 🤝 Contributing

When adding new features to the shared-ui package:

1. Ensure components are framework-agnostic where possible
2. Document all props and usage examples
3. Test across multiple apps before committing
4. Update this README with new features
5. Follow existing code style and patterns

## 📞 Support

For questions or issues with the newsletter or AI assistant system:

- Check this documentation first
- Review the example implementation in `apps/main`
- Contact: info@iiskills.cloud

---

**Last Updated:** January 2026
