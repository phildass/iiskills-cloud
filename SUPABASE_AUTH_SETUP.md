# Supabase Authentication Setup Guide

This guide explains how to set up and use Supabase authentication in the iiskills.cloud Next.js application.

## Table of Contents
1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [File Structure](#file-structure)
4. [Usage Examples](#usage-examples)
5. [Testing](#testing)
6. [Troubleshooting](#troubleshooting)

## Overview

The application now uses Supabase for secure authentication, replacing the previous localStorage mock implementation. Key features include:

- **Magic Link (Passwordless) Authentication**: Send secure sign-in links via email - no password needed
- **Google OAuth**: One-click sign-in with Google accounts
- **Email/Password Authentication**: Traditional secure sign-up and sign-in (fallback option)
- **Email Confirmation**: Users receive a confirmation email upon registration
- **Session Management**: Automatic session persistence across subdomains
- **Protected Routes**: Components to restrict access to authenticated users only
- **Admin Role-Based Access**: Secure admin dashboard access with role verification
- **Logout Functionality**: Users can sign out from any page
- **User State in Navbar**: Shows logged-in user's email and logout button

## Setup Instructions

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - Project name: `iiskills-cloud` (or your preferred name)
   - Database password: Choose a strong password
   - Region: Select closest to your users
5. Wait for project to be created (takes ~2 minutes)

### Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (⚙️) in the sidebar
2. Go to **API** settings
3. You'll find two important values:
   - **Project URL**: Something like `https://xyzcompany.supabase.co`
   - **anon/public key**: A long string starting with `eyJ...`

### Step 3: Configure Environment Variables

1. In your project root, create a `.env.local` file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important**: Never commit `.env.local` to git (it's already in `.gitignore`)

### Step 4: Configure Supabase Auth Settings

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

   **Email Settings:**
   - Enable "Confirm email"
   - Enable "Email OTP" for magic link authentication
   - Disable "Secure email change" (optional, for easier testing)
   
   **Site URL:**
   - Development: `http://localhost:3000`
   - Production: `https://iiskills.cloud`
   
   **Redirect URLs:** Add these allowed redirect URLs:
   - `http://localhost:3000/**`
   - `http://localhost:3001/**` (for learn-apt)
   - `https://iiskills.cloud/**`
   - `https://learn-apt.iiskills.cloud/**`

3. **Enable Google OAuth Provider:**
   - Go to **Authentication** → **Providers**
   - Find "Google" and enable it
   - Add your Google OAuth credentials:
     - Go to [Google Cloud Console](https://console.cloud.google.com/)
     - Create a new project or use existing
     - Enable Google+ API
     - Create OAuth 2.0 credentials
     - Add authorized redirect URIs from Supabase (shown in provider settings)
     - Copy Client ID and Client Secret to Supabase
   
4. Customize email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize "Confirm signup" email
   - Customize "Magic Link" email for better branding

### Step 4a: Configure Admin Roles

To enable admin access, you need to set the admin role in user metadata:

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Find the user you want to make an admin
3. Click on the user to edit
4. In the "User Metadata" or "App Metadata" section, add:
   ```json
   {
     "role": "admin"
   }
   ```
5. Save the changes

Now that user can access admin pages across all apps.

### Step 5: Optional - Create Profiles Table

If you want to store additional user profile data in a database table (recommended for production):

1. Go to **Table Editor** in Supabase
2. Create a new table called `profiles`:
   ```sql
   create table profiles (
     id uuid references auth.users on delete cascade primary key,
     first_name text,
     last_name text,
     gender text,
     date_of_birth date,
     education text,
     location text,
     state text,
     district text,
     country text,
     specify_country text,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null,
     updated_at timestamp with time zone default timezone('utc'::text, now()) not null
   );
   
   -- Set up Row Level Security (RLS)
   alter table profiles enable row level security;
   
   -- Users can view their own profile
   create policy "Users can view own profile" 
     on profiles for select 
     using (auth.uid() = id);
   
   -- Users can update their own profile
   create policy "Users can update own profile" 
     on profiles for update 
     using (auth.uid() = id);
   
   -- Enable automatic profile creation on signup
   create function public.handle_new_user() 
   returns trigger as $$
   begin
     insert into public.profiles (id)
     values (new.id);
     return new;
   end;
   $$ language plpgsql security definer;
   
   create trigger on_auth_user_created
     after insert on auth.users
     for each row execute procedure public.handle_new_user();
   ```

3. Update `pages/register.js` to insert into the profiles table (code is already prepared but commented out)

## File Structure

```
iiskills-cloud/
├── lib/
│   └── supabaseClient.js          # Supabase client initialization and helper functions
├── components/
│   ├── Navbar.js                  # Updated to show auth state and logout
│   ├── UserProtectedRoute.js      # Component to protect routes
│   └── ProtectedRoute.js          # Existing admin route protection
├── pages/
│   ├── login.js                   # Login page with Supabase auth
│   ├── register.js                # Registration page with Supabase auth
│   └── dashboard.js               # Example protected page
├── .env.local.example             # Environment variables template
└── SUPABASE_AUTH_SETUP.md         # This file
```

## Usage Examples

### 1. User Registration

Users can register at `/register`:
- Fill in the registration form
- Submit the form
- Receive a confirmation email
- Click the link in the email to confirm
- Sign in at `/login`

### 2. User Login - Multiple Options

Users have three ways to log in at `/login`:

**Option A: Magic Link (Recommended)**
- Click "Use magic link instead" if not already selected
- Enter email address
- Click "Send Me a Sign-In Link"
- Check email for secure sign-in link
- Click the link to sign in automatically
- No password needed!

**Option B: Google OAuth**
- Click "Continue with Google" button
- Sign in with your Google account
- Automatically redirected after authentication

**Option C: Email & Password**
- Click "Use password instead" if magic link is selected
- Enter email and password
- Click "Sign In with Password"
- Redirected to homepage (or to the page they were trying to access)

### 3. Admin Login

Admin users can access `/admin/login` with any of the three methods:
- Magic link, Google OAuth, or password
- Must have admin role in Supabase user metadata
- After authentication, role is verified on backend
- Only users with admin role can access admin dashboard

### 4. Forgot Password?

Users who forgot their password can:
- Use the Magic Link option to sign in without a password
- Or use Google OAuth if they signed up with Google
- No password reset needed for magic link users!

### 5. Logout

Users can logout from any page:
- The Navbar shows the user's email when logged in
- Click the "Logout" button
- Redirected to `/login`

### 6. Protecting a Page

To make a page require authentication:

```javascript
import UserProtectedRoute from '../components/UserProtectedRoute'

export default function MyProtectedPage() {
  return (
    <UserProtectedRoute>
      <div>
        This content is only visible to authenticated users
      </div>
    </UserProtectedRoute>
  )
}
```

Example: See `pages/dashboard.js`

### 7. Getting Current User in a Component

```javascript
import { useState, useEffect } from 'react'
import { getCurrentUser } from '../lib/supabaseClient'

export default function MyComponent() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    const currentUser = await getCurrentUser()
    setUser(currentUser)
  }

  return (
    <div>
      {user ? (
        <p>Logged in as: {user.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  )
}
```

### 8. Manual Login with Magic Link (in custom component)

```javascript
import { sendMagicLink } from '../lib/supabaseClient'

const handleMagicLinkLogin = async () => {
  const { success, error } = await sendMagicLink(email)
  if (error) {
    console.error('Failed to send magic link:', error)
  } else {
    console.log('Magic link sent! Check your email.')
  }
}
```

### 9. Manual Login with Google OAuth (in custom component)

```javascript
import { signInWithGoogle } from '../lib/supabaseClient'

const handleGoogleLogin = async () => {
  const { success, error } = await signInWithGoogle()
  if (error) {
    console.error('Google login failed:', error)
  }
  // OAuth will redirect automatically on success
}
```

### 10. Manual Login with Password (in custom component)

```javascript
import { signInWithEmail } from '../lib/supabaseClient'

const handleLogin = async () => {
  const { user, error } = await signInWithEmail(email, password)
  if (error) {
    console.error('Login failed:', error)
  } else {
    console.log('Logged in:', user.email)
  }
}
```

### 11. Check Admin Role (in custom component)

```javascript
import { getCurrentUser, isAdmin } from '../lib/supabaseClient'

const checkAdminAccess = async () => {
  const user = await getCurrentUser()
  if (user && isAdmin(user)) {
    console.log('User has admin access')
  } else {
    console.log('User does not have admin access')
  }
}
```

### 12. Manual Logout (in custom component)

```javascript
import { signOutUser } from '../lib/supabaseClient'

const handleLogout = async () => {
  const { success, error } = await signOutUser()
  if (success) {
    router.push('/login')
  }
}
```

## Testing

### Local Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test registration flow:
   - Go to `http://localhost:3000/register`
   - Fill in the form and submit
   - Check your email for confirmation link
   - Click the confirmation link
   - Try logging in at `http://localhost:3000/login`

3. Test protected routes:
   - Go to `http://localhost:3000/dashboard` without logging in
   - Should redirect to `/login`
   - Log in and try again
   - Should show the dashboard

4. Test logout:
   - While logged in, click "Logout" in navbar
   - Should redirect to `/login`
   - Try accessing `/dashboard` again
   - Should redirect to `/login`

### Email Confirmation in Development

During development, you have two options:

**Option 1: Check email in Supabase dashboard**
- Go to **Authentication** → **Users** in Supabase dashboard
- Find the new user
- Click to view details
- See the confirmation email content

**Option 2: Disable email confirmation temporarily**
- Go to **Authentication** → **Settings**
- Under "Email Settings", disable "Confirm email"
- Users can log in immediately after registration
- **Remember to re-enable for production!**

## Troubleshooting

### "Invalid API key" error
- Check that your `.env.local` file exists and has the correct values
- Restart your development server after creating/updating `.env.local`
- Verify the API key starts with `eyJ` and is not truncated

### "Invalid login credentials" error
- For new users: Check if email is confirmed
- Go to Supabase dashboard → Authentication → Users
- If "Confirmed" column shows "No", resend confirmation email or manually confirm

### Email confirmation not received
- Check spam folder
- Check Supabase dashboard → Authentication → Users to see if user was created
- Check Supabase dashboard → Authentication → Settings → Email provider is configured
- For testing, you can manually confirm users in the dashboard

### Session not persisting
- Clear browser localStorage and cookies
- Check browser console for errors
- Verify Supabase URL and key are correct

### "Already registered" error even though user doesn't exist
- User might exist but not be confirmed
- Check Supabase dashboard → Authentication → Users
- Delete the unconfirmed user and try again

### Protected route not redirecting
- Check browser console for errors
- Verify `UserProtectedRoute` is wrapping the entire page content
- Make sure Supabase client is properly initialized

## Security Best Practices

1. **Never commit `.env.local`** - It's in `.gitignore`, keep it that way
2. **Use Row Level Security (RLS)** in Supabase for database tables
3. **Validate user input** on both client and server side
4. **Use HTTPS in production** - Supabase requires HTTPS for production
5. **Rotate keys if compromised** - Can be done in Supabase dashboard
6. **Enable email confirmation** in production
7. **Set up proper redirect URLs** in Supabase settings

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase documentation
3. Check browser console for error messages
4. Contact: info@iiskills.cloud
