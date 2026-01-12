# Admin Validation Using public.profiles Table

**Last Updated:** January 2026  
**Status:** ✅ Implemented across all apps

## Overview

All iiskills.cloud apps now use the **public.profiles** table for admin validation instead of relying on Supabase `raw_user_meta_data` or other metadata fields. This provides a centralized, secure, and consistent approach to admin access control.

## Why This Change?

### Previous Approach (Deprecated)
- ❌ Admin status stored in `user_metadata.role` or `app_metadata.role`
- ❌ Required manual SQL updates to `auth.users` table
- ❌ Not easily queryable from client applications
- ❌ Inconsistent across different implementations

### New Approach (Current)
- ✅ Admin status stored in `public.profiles.is_admin` column
- ✅ Centralized in a dedicated table with Row Level Security (RLS)
- ✅ Easily queryable from all applications
- ✅ Consistent implementation across all 15 apps
- ✅ Proper database normalization

## Database Schema

### profiles Table Structure

```sql
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name text,
  last_name text,
  full_name text,
  gender text,
  date_of_birth date,
  age integer,
  education text,
  qualification text,
  location text,
  state text,
  district text,
  country text,
  specify_country text,
  is_admin boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Key Features

1. **Automatic Profile Creation**: A trigger automatically creates a profile row when a new user signs up
2. **Row Level Security (RLS)**: Users can only view/update their own profile (except `is_admin` field)
3. **Default Non-Admin**: All new users default to `is_admin = false`
4. **Indexed Admin Lookups**: Fast queries for admin users via indexed column

### Setting Up the Table

Run the SQL script in Supabase SQL Editor:

```bash
# The schema file is located at:
/supabase/profiles_schema.sql
```

Or run it directly in Supabase:
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/profiles_schema.sql`
4. Click **Run**

## Making a User an Admin

### Via Supabase Dashboard

1. Go to **SQL Editor** in Supabase
2. Run this query (replace with actual user email):

```sql
UPDATE public.profiles 
SET is_admin = true 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@example.com');
```

### Verify Admin Users

```sql
SELECT u.email, p.is_admin, p.created_at
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE p.is_admin = true;
```

### Remove Admin Access

```sql
UPDATE public.profiles 
SET is_admin = false 
WHERE id = (SELECT id FROM auth.users WHERE email = 'user@example.com');
```

## Implementation in Code

### Client-Side (JavaScript - Pages Router)

All subdomain apps use the same pattern:

```javascript
// Import the isAdmin function
import { getCurrentUser, isAdmin } from '../lib/supabaseClient'

// In your component
const [user, setUser] = useState(null)
const [userIsAdmin, setUserIsAdmin] = useState(false)

useEffect(() => {
  const checkAuth = async () => {
    const currentUser = await getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      // Check admin status from profiles table
      const hasAdminAccess = await isAdmin(currentUser)
      setUserIsAdmin(hasAdminAccess)
    }
  }
  checkAuth()
}, [])

// Use in JSX
{userIsAdmin && (
  <button>Admin Only Feature</button>
)}
```

### Client-Side (TypeScript - App Router - learn-apt)

```typescript
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { isAdmin, user } = useAuth()
  
  return (
    <>
      {isAdmin && (
        <div>Admin Panel</div>
      )}
    </>
  )
}
```

### Middleware (TypeScript - learn-apt)

```typescript
// Query profiles table for admin status
const { data: profileData, error: profileError } = await supabase
  .from('profiles')
  .select('is_admin')
  .eq('id', user.id)
  .single();

const isAdmin = profileError ? false : (profileData?.is_admin === true);

if (!isAdmin) {
  // Redirect unauthorized users
  return NextResponse.redirect(new URL('/', request.url))
}
```

### isAdmin Function Implementation

All apps now use this async function:

```javascript
/**
 * Check if user has admin role
 * Uses public.profiles table for admin validation
 * 
 * @param {Object} user - User object from Supabase
 * @returns {Promise<boolean>} True if user is admin
 */
export async function isAdmin(user) {
  if (!user) return false
  
  try {
    // Query the public.profiles table for admin status
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
    
    if (error) {
      console.error('Error checking admin status:', error.message)
      return false
    }
    
    return data?.is_admin === true
  } catch (error) {
    console.error('Error in isAdmin:', error)
    return false
  }
}
```

## Updated Files

### Main App
- `/lib/supabaseClient.js` - isAdmin function
- `/components/ProtectedRoute.js` - Admin route protection
- `/components/shared/UniversalLogin.js` - Admin redirect after login
- `/pages/admin/login.js`
- `/pages/admin/index.js`
- `/pages/index.js`

### All 14 Subdomain Apps
Each subdomain app's `lib/supabaseClient.js` has been updated:
- learn-ai
- learn-apt (both Pages and App Router versions)
- learn-chemistry
- learn-data-science
- learn-geography
- learn-govt-jobs
- learn-ias
- learn-jee
- learn-leadership
- learn-management
- learn-math
- learn-neet
- learn-physics
- learn-pr
- learn-winning

### Pages Using Admin Checks
- `learn-chemistry/pages/learn.js` - Admin panel toggle
- `learn-neet/pages/admin/*.js` - All admin pages
- `learn-physics/pages/admin.js` - Admin dashboard
- `learn-apt/pages/admin/index.js` - Admin sign-in

## Migration Guide

### For Existing Admins

If you have existing admin users with `user_metadata.role = 'admin'`, you need to migrate them:

```sql
-- Update profiles table for all existing admin users
UPDATE public.profiles 
SET is_admin = true 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE raw_user_meta_data->>'role' = 'admin'
  OR raw_app_meta_data->>'role' = 'admin'
);

-- Verify migration
SELECT u.email, p.is_admin 
FROM auth.users u
JOIN public.profiles p ON u.id = p.id
WHERE p.is_admin = true;
```

### Cleanup Old Metadata (Optional)

After confirming the migration works:

```sql
-- Clean up old metadata (optional, not required)
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data - 'role'
WHERE raw_user_meta_data->>'role' = 'admin';
```

## Security Considerations

### Row Level Security (RLS)

The profiles table has RLS enabled with these policies:

1. **SELECT**: Users can view their own profile
2. **UPDATE**: Users can update their own profile
3. **INSERT**: Users can insert their own profile on signup

**Important**: Regular users CANNOT update their own `is_admin` field because:
- The field has `DEFAULT false NOT NULL` constraint
- Only database admins can directly update this field via SQL
- Client-side updates to `is_admin` will be ignored by RLS policies

### Server-Side Validation

⚠️ **Critical**: The `isAdmin()` function is for **CLIENT-SIDE UI DISPLAY ONLY**.

For actual access control, you MUST implement server-side validation:

#### API Routes (Example)
```javascript
// pages/api/admin/some-action.js
import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // Service role key for server
  )
  
  const { data: { user } } = await supabase.auth.getUser(req.headers.authorization)
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  // Check admin status from profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  if (!profile?.is_admin) {
    return res.status(403).json({ error: 'Forbidden - Admin access required' })
  }
  
  // Proceed with admin action
  // ...
}
```

## Testing Admin Access

### Test Scenario 1: Make User Admin
1. Create a new user account
2. Login to Supabase dashboard
3. Run SQL to make user admin
4. Logout and login again
5. ✅ Admin features should now be visible

### Test Scenario 2: Remove Admin Access
1. Login as an admin user
2. Run SQL to remove admin status
3. Refresh the page
4. ✅ Admin features should be hidden

### Test Scenario 3: New User Registration
1. Register a new account
2. ✅ User should NOT have admin access by default
3. Check profiles table
4. ✅ `is_admin` should be `false`

## Troubleshooting

### Admin Status Not Updating

**Problem**: Changed admin status in database but UI still shows old status.

**Solution**:
1. Logout and login again to refresh the session
2. Clear browser localStorage/cookies
3. Check browser console for errors
4. Verify the SQL query actually updated the profile

### isAdmin() Always Returns False

**Problem**: `isAdmin()` function always returns false even for admin users.

**Solution**:
1. Check if profiles table exists
2. Verify RLS policies allow reading `is_admin` field
3. Check browser console for Supabase errors
4. Ensure user object has valid `id` field
5. Run SQL to verify admin status in database

### Profile Not Created for New User

**Problem**: New users don't have a profile row.

**Solution**:
1. Verify the trigger `on_auth_user_created` exists
2. Check the function `handle_new_user()` exists
3. Manually create profile if needed:
```sql
INSERT INTO public.profiles (id, is_admin)
VALUES ('user-uuid-here', false);
```

## Benefits of This Approach

### 1. Centralized Management
- Single source of truth for admin status
- Easy to query and update
- Consistent across all applications

### 2. Better Security
- Row Level Security (RLS) prevents unauthorized changes
- Separated from auth metadata
- Easier to audit admin users

### 3. Scalability
- Can easily add more fields to profiles table
- Better performance with indexed queries
- Supports future features (roles, permissions, etc.)

### 4. Developer Experience
- Consistent API across all apps
- Clear separation of concerns
- Easy to test and validate

## Future Enhancements

### Planned Features

1. **Role-Based Access Control (RBAC)**
   - Add `role` enum field (admin, moderator, user)
   - Implement granular permissions

2. **Admin Audit Log**
   - Track admin actions
   - Monitor admin access

3. **Team Management**
   - Multiple admin users
   - Admin invitations

4. **Permission Groups**
   - Custom permission sets
   - Role hierarchies

## Summary

✅ **All apps now use `public.profiles.is_admin` for admin validation**  
✅ **Removed all references to `raw_user_meta_data` for admin checks**  
✅ **Centralized, secure, and consistent implementation**  
✅ **Easy to manage and audit admin users**

For questions or issues, refer to:
- [AUTHENTICATION_ARCHITECTURE.md](AUTHENTICATION_ARCHITECTURE.md)
- [SUPABASE_AUTH_SETUP.md](SUPABASE_AUTH_SETUP.md)
- [UNIVERSAL_AUTH_IMPLEMENTATION.md](UNIVERSAL_AUTH_IMPLEMENTATION.md)

---

**Maintained by:** iiskills.cloud Development Team  
**Last Updated:** January 2026
