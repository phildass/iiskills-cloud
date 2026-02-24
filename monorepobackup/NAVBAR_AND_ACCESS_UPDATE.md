# Navigation Bar and User Access Logic Updates

## Overview

This document describes the changes made to the navigation bar and user access logic across all iiskills.cloud domains and subdomains to meet the following requirements:

1. **Consistent Navigation**: Main navigation bar visually matches across all domains
2. **Subdomain-Specific Dropdown**: Each subdomain has a secondary navigation bar with dropdown menu for subdomain-specific sections
3. **Payment/Registration Protection**: Restricted pages show appropriate messages for non-registered/non-paid users
4. **Responsive Design**: All changes are responsive and accessible

## Changes Made

### 1. New Components Created

#### SubdomainNavbar Component
**File**: `/components/shared/SubdomainNavbar.js`

A new navigation component that provides a secondary navigation bar for subdomains with dropdown functionality.

**Features**:
- Displays below the main SharedNavbar
- Dropdown menu with subdomain-specific navigation links
- No logos (to avoid duplication with main navbar)
- Fully responsive with mobile support
- Accessible with proper ARIA attributes

**Usage**:
```javascript
<SubdomainNavbar
  subdomainName="Learn-Apt"
  sections={[
    {
      label: 'Home',
      href: '/',
      description: 'Welcome to Learn-Apt'
    },
    {
      label: 'Start Test',
      href: '/learn',
      description: 'Choose your assessment mode'
    }
  ]}
/>
```

#### PaidUserProtectedRoute Component
**File**: `/components/PaidUserProtectedRoute.js`

A new protection component that wraps pages requiring both authentication AND payment/registration.

**Features**:
- Checks user authentication via Supabase
- Checks payment status via user metadata
- Shows user-friendly access denied message when not paid
- Provides links to login, register, and make payment
- Payment link directs to https://www.aienter.in/payments as required

**Message Displayed**:
> "Only registered and paid users can access this page. Please log in if you are already registered. Or make payment here. This will lead you to our parent organisation AI Cloud Enterprises (aienter.in)."

**Usage**:
```javascript
export default function RestrictedPage() {
  return (
    <PaidUserProtectedRoute>
      <YourPageContent />
    </PaidUserProtectedRoute>
  )
}
```

### 2. Enhanced Supabase Client

**File**: `/lib/supabaseClient.js`

Added new functions to support payment status checking:

#### `checkUserPaymentStatus(user)`
Checks if a user has paid/registered status by:
- Checking `user_metadata.payment_status` or `app_metadata.payment_status`
- Granting automatic access to admin users
- Returns `true` if user has paid, `false` otherwise

**Note**: Currently uses metadata. In production, this should query a payments table.

#### `getUserProfile(user)`
Extended to include payment status information in the returned user profile.

### 3. Updated Subdomain Applications

All subdomain `_app.js` files have been updated to include the SubdomainNavbar:

- `/learn-ai/pages/_app.js`
- `/learn-apt/pages/_app.js`
- `/learn-data-science/pages/_app.js`
- `/learn-leadership/pages/_app.js`
- `/learn-management/pages/_app.js`
- `/learn-math/pages/_app.js`
- `/learn-pr/pages/_app.js`
- `/learn-winning/pages/_app.js`

**Changes**:
1. Import SubdomainNavbar component
2. Define subdomain-specific navigation sections
3. Add SubdomainNavbar below SharedNavbar in render

**Example Structure**:
```javascript
const subdomainSections = [
  {
    label: 'Home',
    href: '/',
    description: 'Welcome to Learn AI'
  },
  {
    label: 'Learning Content',
    href: '/learn',
    description: 'Access AI learning materials'
  },
  // ... more sections
]

return (
  <>
    <SharedNavbar {...props} />
    <SubdomainNavbar
      subdomainName="Learn AI"
      sections={subdomainSections}
    />
    <Component {...pageProps} />
  </>
)
```

### 4. Protected Pages Updated

The following pages have been wrapped with PaidUserProtectedRoute:

**Learn Pages** (requires payment):
- `/learn-ai/pages/learn.js`
- `/learn-apt/pages/learn.js`
- `/learn-data-science/pages/learn.js`
- `/learn-leadership/pages/learn.js`
- `/learn-management/pages/learn.js`
- `/learn-math/pages/learn.js`
- `/learn-pr/pages/learn.js`

**Learn-Apt Additional Pages**:
- `/learn-apt/pages/test.js` - Assessment test page
- `/learn-apt/pages/results.js` - Test results page

**Pattern Used**:
```javascript
// Original function renamed to ContentComponent
function LearnContent() {
  // ... existing code
}

// New default export with protection
export default function Learn() {
  return (
    <PaidUserProtectedRoute>
      <LearnContent />
    </PaidUserProtectedRoute>
  )
}
```

### 5. Navigation Bar Structure

#### Main Domain (iiskills.cloud)
- SharedNavbar with full navigation (Home, Courses, Certification, Payments, About, Terms)
- No SubdomainNavbar (main domain doesn't need subdomain-specific navigation)

#### All Subdomains (learn-*.iiskills.cloud)
**Two-tier navigation**:

1. **Top Bar** (SharedNavbar):
   - AI Cloud Enterprises logo
   - iiskills logo
   - Subdomain name (e.g., "Learn-Apt")
   - Links to main domain pages (Home, Courses, Certification, etc.)
   - Authentication buttons (Sign In/Register or User Email/Logout)

2. **Secondary Bar** (SubdomainNavbar):
   - Dropdown menu labeled "[Subdomain Name] Navigation"
   - List of subdomain-specific pages with descriptions
   - No logos (avoids duplication)
   - Shows count of available sections

## User Experience

### Non-Authenticated User Accessing Restricted Page
1. User navigates to `/learn` on any subdomain
2. PaidUserProtectedRoute checks authentication
3. User sees access denied screen with:
   - Lock icon and "Access Restricted" heading
   - Required message about registration/payment
   - "Log In" button (if not authenticated)
   - "Register New Account" button (if not authenticated)
   - "Make Payment" button (links to aienter.in/payments)
   - "Back to Home" link

### Authenticated But Non-Paid User
1. User navigates to `/learn` on any subdomain
2. PaidUserProtectedRoute checks payment status
3. User sees same access denied screen with:
   - Acknowledgment they're logged in (shows email)
   - Note to complete payment to access content
   - "Make Payment" button

### Paid User
1. User navigates to `/learn` on any subdomain
2. PaidUserProtectedRoute verifies authentication and payment
3. User sees the protected content immediately

## Payment Status Configuration

### Setting Payment Status for Users

Payment status is currently stored in Supabase user metadata. To grant a user access:

**Option 1: Supabase Dashboard**
1. Go to Supabase project → Authentication → Users
2. Select the user
3. Edit user metadata
4. Add: `{ "payment_status": "paid" }`
5. Save changes

**Option 2: SQL**
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"payment_status": "paid"}'::jsonb
WHERE email = 'user@example.com';
```

**Production Recommendation**:
In production, payment status should be tracked in a dedicated `payments` table with proper verification from the payment provider.

## Accessibility Features

All components include:
- Proper ARIA labels (`aria-expanded`, `aria-haspopup`)
- Keyboard navigation support
- Screen reader compatible structure
- Focus management for dropdowns
- Mobile-friendly touch targets

## Responsive Design

### Desktop (>768px)
- Full navigation bars with all links visible
- Dropdown menus for subdomain navigation
- Side-by-side layout for buttons

### Mobile (<768px)
- Hamburger menu for main navigation
- Touch-friendly dropdown for subdomain navigation
- Stacked button layout
- Full-width interactive elements

## Files Modified Summary

### New Files
- `/components/shared/SubdomainNavbar.js`
- `/components/PaidUserProtectedRoute.js`

### Modified Files
- `/lib/supabaseClient.js` - Added payment checking functions
- `/components/Navbar.js` - Fixed duplicate imports
- `/pages/admin/login.js` - Fixed syntax errors
- All `/learn-*/pages/_app.js` files - Added SubdomainNavbar
- Multiple `/learn-*/pages/learn.js` files - Added payment protection
- `/learn-apt/pages/test.js` - Added payment protection
- `/learn-apt/pages/results.js` - Added payment protection

## Testing

All changes have been verified to build successfully:
- Main domain build: ✅ Success
- learn-ai subdomain build: ✅ Success
- learn-apt subdomain build: ✅ Success

## Future Enhancements

1. **Payment Integration**: Integrate with actual payment provider API
2. **Payment Database**: Create dedicated payments table in Supabase
3. **Course-Specific Access**: Allow different payment levels for different courses
4. **Trial Periods**: Add support for free trial periods
5. **Analytics**: Track which pages users attempt to access before paying

## Security Considerations

⚠️ **Important**: The current implementation uses client-side checks for payment status. In production:

1. **Server-Side Verification**: Implement server-side API routes to verify payment status
2. **Row Level Security**: Use Supabase RLS policies to restrict data access
3. **Payment Provider Integration**: Verify payment status with payment provider webhook
4. **Audit Logs**: Track payment status changes and access attempts

## Support and Documentation

For questions or issues related to these changes:
- See `NAVIGATION_AUTH_GUIDE.md` for authentication flow
- See `SUPABASE_AUTH_SETUP.md` for Supabase configuration
- Contact development team for payment integration questions

---

**Last Updated**: January 5, 2026
**Version**: 1.0
