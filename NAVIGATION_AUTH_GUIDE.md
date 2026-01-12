# Navigation and Authentication Guide

This guide explains the navigation structure and authentication flow across all iiskills.cloud applications (main domain and subdomains).

## Table of Contents

1. [Navigation Structure](#navigation-structure)
2. [Authentication Flow](#authentication-flow)
3. [Admin Access](#admin-access)
4. [Cross-Subdomain SSO](#cross-subdomain-sso)
5. [Shared Components](#shared-components)

---

## Navigation Structure

### Main Domain (iiskills.cloud)

The main domain uses a **shared navigation component** that provides consistent branding and user experience across all iiskills applications.

#### Navigation Links

**Public Navigation:**

- **Home** - Main landing page
- **Courses** - Browse available courses
- **Certification** - Certificate information
- **Payments** - External payment link (aienter.in/payments)
- **About** - About iiskills and AI Cloud Enterprises
- **Terms & Conditions** - Legal terms

**Authentication Links:**

- **Sign In** - Login page (shown when not authenticated)
- **Register** - Registration page (shown when not authenticated)
- **User Email** - Display current user email (shown when authenticated)
- **Logout** - Sign out button (shown when authenticated)

#### Important: No Admin Link in Navigation

**The admin link is NOT displayed in the navigation bar**, even for admin users. This is a security best practice:

- ✅ Admin section is accessible only via direct URL: `/admin`
- ✅ Regular users cannot discover admin section through UI
- ✅ Admin users can bookmark the URL or type it directly
- ❌ No visual indicator in navbar reveals admin access

### Learn-Apt Subdomain (learn-apt.iiskills.cloud)

The learn-apt app uses the **same shared navigation component** with learn-apt specific configuration:

#### Navigation Links

**All Main Domain Links** - Same links as main domain for consistency

- Users can navigate to main domain pages from learn-apt
- External links to courses, certification, etc.

**App-Specific:**

- **App Name:** "Learn-Apt" displayed in navbar
- **Home URL:** Points to learn-apt home page

---

## Authentication Flow

### User Registration and Login

Both main domain and learn-apt use **Supabase authentication** with shared session management.

#### Registration Flow

1. User clicks "Register" in navbar (or goes to `/register`)
2. User fills registration form:
   - First Name
   - Last Name
   - Email
   - Password
3. Form submitted to Supabase
4. User account created with metadata
5. Email confirmation sent (if enabled in Supabase)
6. User can log in after email confirmation

#### Login Flow

1. User clicks "Sign In" in navbar (or goes to `/login`)
2. User enters credentials:
   - Email
   - Password
3. Credentials validated against Supabase
4. Session created and stored in localStorage
5. User redirected to dashboard or return URL
6. Navbar updates to show user email and logout button

#### Logout Flow

1. User clicks "Logout" button in navbar
2. Supabase session cleared
3. User redirected to login page or home
4. Navbar updates to show "Sign In" and "Register"

### Protected Routes

Protected routes require authentication to access:

**Main Domain Protected Pages:**

- `/dashboard` - User dashboard
- `/my-certificates` - User certificates
- `/admin/*` - Admin pages (requires admin role)

**Learn-Apt Protected Pages:**

- `/learn` - Learning content
- `/test` - Assessment tests
- `/results` - Test results
- `/admin/*` - Learn-apt admin pages (requires admin role)

**Protection Implementation:**

- `ProtectedRoute` component wraps protected pages
- Checks for valid Supabase session
- Redirects to login if not authenticated
- For admin pages: also checks for admin role in user metadata

---

## Admin Access

### Security Model

**Admin access is role-based and uses Supabase authentication:**

✅ **Secure Approach:**

- Admin role stored in Supabase user metadata (`user_metadata.role = 'admin'`)
- Backend validation of admin status
- No hardcoded passwords
- No client-side bypass possible
- Session managed by Supabase

❌ **Legacy Approach (REMOVED):**

- ~~Hardcoded admin password~~
- ~~localStorage authentication~~
- ~~Client-side role check~~

### Accessing Admin Section

**Main Domain Admin:** `https://iiskills.cloud/admin`
**Learn-Apt Admin:** `https://learn-apt.iiskills.cloud/admin`

#### Access Steps:

1. **Direct URL Access Only**
   - No link in navigation bar
   - Type URL directly: `/admin`
   - Or bookmark the admin URL

2. **Authentication Check**
   - If not logged in → redirected to `/login?redirect=/admin`
   - Log in with your user account
   - After login → redirected back to admin section

3. **Role Verification**
   - System checks user metadata for admin role
   - If not admin → redirected to home with error
   - If admin → access granted to admin dashboard

4. **Admin Navigation**
   - Yellow admin navigation bar appears
   - Access to: Dashboard, Courses, Content, Users, Settings
   - "Main Site" link to return to public site
   - Logout button (uses Supabase signOut)

### Setting Admin Role

Admin role must be set in Supabase:

**Option 1: Supabase Dashboard**

1. Go to Supabase project → Authentication → Users
2. Select user
3. Edit user metadata
4. Add: `{ "role": "admin" }`
5. Save changes

**Option 2: SQL**

```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@example.com';
```

**Option 3: API (for automated setup)**

```javascript
// In a secure server-side function
const { data, error } = await supabase.auth.admin.updateUserById(userId, {
  user_metadata: { role: "admin" },
});
```

---

## Cross-Subdomain SSO

### How It Works

Both main domain and learn-apt share the same authentication session:

**Shared Configuration:**

- Same Supabase project URL
- Same Supabase anon key
- Same storage key: `iiskills-auth-token`
- Cookie domain: `.iiskills.cloud` (note the leading dot)

**User Experience:**

1. **Scenario A: Login on Main Domain**
   - User logs in at `iiskills.cloud/login`
   - Session created in Supabase
   - User navigates to `learn-apt.iiskills.cloud`
   - **Automatically authenticated** on learn-apt
   - No need to log in again

2. **Scenario B: Login on Learn-Apt**
   - User logs in at `learn-apt.iiskills.cloud/login`
   - Session created in Supabase
   - User navigates to `iiskills.cloud`
   - **Automatically authenticated** on main site
   - No need to log in again

3. **Logout from Any Domain**
   - User logs out from either domain
   - Session cleared from Supabase
   - **User logged out on all domains**
   - Must log in again to access protected content

### Technical Implementation

**Main Domain (`/lib/supabaseClient.js`):**

```javascript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    cookieOptions: {
      domain: getCookieDomain(), // Returns '.iiskills.cloud' in production
      secure: true, // HTTPS only
      sameSite: "lax",
    },
  },
});
```

**Learn-Apt (`/learn-apt/lib/supabaseClient.js`):**

```javascript
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    storageKey: "iiskills-auth-token", // Shared storage key
  },
});
```

### Supabase Configuration

**Required Supabase Settings:**

1. **Site URL** (Authentication → Settings)
   - Development: `http://localhost:3000`
   - Production: `https://iiskills.cloud`

2. **Redirect URLs** (Authentication → Settings)
   - `http://localhost:3000/**`
   - `http://localhost:3001/**`
   - `https://iiskills.cloud/**`
   - `https://learn-apt.iiskills.cloud/**`

3. **Cookie Domain** (for production)
   - Set to `.iiskills.cloud` (with leading dot)
   - Enables cross-subdomain sessions

---

## Shared Components

### SharedNavbar Component

Located at: `/components/shared/SharedNavbar.js`

**Purpose:** Provides consistent navigation across all iiskills applications

**Features:**

- Dual logo display (iiskills + AI Cloud Enterprises)
- Configurable app name
- Customizable navigation links
- Authentication state display
- Responsive mobile menu
- Logout functionality

**Usage in Main Domain:**

```javascript
// components/Navbar.js
import SharedNavbar from "./shared/SharedNavbar";

export default function Navbar() {
  const [user, setUser] = useState(null);

  return (
    <SharedNavbar
      user={user}
      onLogout={handleLogout}
      appName="iiskills.cloud"
      homeUrl="/"
      showAuthButtons={true}
      customLinks={[
        { href: "/", label: "Home", className: "hover:text-primary transition" },
        { href: "/courses", label: "Courses", className: "hover:text-primary transition" },
        // ... more links
      ]}
    />
  );
}
```

**Usage in Learn-Apt:**

```javascript
// learn-apt/pages/_app.js
import SharedNavbar from "../components/shared/SharedNavbar";

export default function App({ Component, pageProps }) {
  return (
    <>
      <SharedNavbar
        user={user}
        onLogout={handleLogout}
        appName="Learn-Apt"
        homeUrl="/"
        showAuthButtons={true}
        customLinks={[
          { href: "https://iiskills.cloud", label: "Home" },
          { href: "https://iiskills.cloud/courses", label: "Courses" },
          // ... more links
        ]}
      />
      <Component {...pageProps} />
    </>
  );
}
```

**Props:**

- `user` (object|null) - Current user from Supabase
- `onLogout` (function) - Logout callback
- `appName` (string) - Name displayed in navbar
- `homeUrl` (string) - Home link URL
- `showAuthButtons` (boolean) - Show login/register buttons
- `customLinks` (array) - Navigation links configuration

---

## Best Practices

### For Users

1. **Login once, access everywhere** - Single login works across all domains
2. **Bookmark admin URL** - Save `/admin` URL for quick access
3. **Logout when done** - Use logout button to clear session
4. **Check email for confirmation** - Verify email after registration

### For Developers

1. **Use SharedNavbar** - Always use shared component for consistency
2. **Check admin role properly** - Verify `user_metadata.role` or `app_metadata.role`
3. **Protect all admin routes** - Wrap with `ProtectedRoute` component
4. **Test cross-domain auth** - Verify SSO works across subdomains
5. **No admin UI in navbar** - Keep admin access invisible to regular users
6. **Use direct URLs for admin** - Document admin URL, don't expose in UI

### For Administrators

1. **Set admin roles in Supabase** - Use dashboard or SQL to grant admin access
2. **Document admin access** - Share admin URL with authorized users
3. **Monitor authentication** - Check Supabase logs for security issues
4. **Regular security audits** - Review user roles and permissions
5. **Enable email confirmation** - Require email verification for new users

---

## Troubleshooting

### "Access Denied" when visiting /admin

**Solution:** Check if your user has admin role in Supabase:

```sql
SELECT raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'your@email.com';
```

### Not logged in across subdomains

**Possible causes:**

1. Cookie domain not set to `.iiskills.cloud`
2. Different Supabase projects used
3. Different storage keys
4. Cookies blocked by browser

**Solutions:**

- Verify cookie domain in Supabase settings
- Check `.env.local` has same credentials in both apps
- Clear browser cookies and try again
- Check browser console for errors

### Admin logout doesn't work

**Solution:** AdminNav now uses Supabase logout instead of localStorage. Update AdminNav component:

```javascript
import { signOutUser } from "../lib/supabaseClient";

const handleLogout = async () => {
  const { success } = await signOutUser();
  if (success) {
    router.push("/");
  }
};
```

### Can't find admin link in navbar

**This is intentional!** Admin access is via direct URL only:

- Main domain: `https://iiskills.cloud/admin`
- Learn-apt: `https://learn-apt.iiskills.cloud/admin`

---

## Summary

**Navigation:**

- ✅ All apps use SharedNavbar for consistency
- ✅ Same navigation links across all domains
- ✅ No admin link in navbar (security by obscurity)

**Authentication:**

- ✅ Single sign-on across all subdomains
- ✅ Supabase-based role management
- ✅ Protected routes with proper role checks
- ✅ No hardcoded credentials

**Admin Access:**

- ✅ Direct URL access only (`/admin`)
- ✅ Role-based with Supabase metadata
- ✅ Separate admin navigation when accessed
- ✅ No UI hints for regular users

This architecture provides a secure, consistent, and user-friendly experience across all iiskills.cloud applications.
