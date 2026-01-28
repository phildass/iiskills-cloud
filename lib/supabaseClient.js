/**
 * Supabase Client Configuration
 *
 * This file initializes and exports the Supabase client for authentication and database operations.
 *
 * Setup Instructions:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Get your project URL and anon key from project settings
 * 3. Create a .env.local file in the root directory with:
 *    NEXT_PUBLIC_SUPABASE_URL=your-project-url
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 *
 * Learn more: https://supabase.com/docs/guides/auth
 */

import { createClient } from "@supabase/supabase-js";
import { getCookieDomain } from "../utils/urlHelper";

// Check if Supabase is suspended for maintenance/content review
const isSupabaseSuspended = process.env.NEXT_PUBLIC_SUPABASE_SUSPENDED === "true";

// Supabase project URL and public anonymous key
// These must be set via environment variables in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validation constants
const PLACEHOLDER_URL_PATTERNS = ["your-project", "xyz", "xyzcompany", "abc123"];
const MIN_ANON_KEY_LENGTH = 20; // Supabase anon keys are typically much longer

// Check for missing or placeholder values
// Placeholders are exact matches or obviously invalid values
const hasPlaceholderUrl =
  !supabaseUrl ||
  supabaseUrl === "your-project-url-here" ||
  supabaseUrl === "https://your-project.supabase.co" ||
  supabaseUrl.match(
    new RegExp(`^https?://(${PLACEHOLDER_URL_PATTERNS.join("|")}).*\\.supabase\\.co$`, "i")
  );

const hasPlaceholderKey =
  !supabaseAnonKey ||
  supabaseAnonKey === "your-anon-key-here" ||
  supabaseAnonKey.startsWith("eyJhbGciOi...") ||
  supabaseAnonKey.length < MIN_ANON_KEY_LENGTH;

// Skip validation if Supabase is suspended
if (!isSupabaseSuspended && (!supabaseUrl || !supabaseAnonKey || hasPlaceholderUrl || hasPlaceholderKey)) {
  const errorMessage = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  SUPABASE CONFIGURATION ERROR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Missing or invalid Supabase environment variables!

Required variables:
  ${!supabaseUrl || hasPlaceholderUrl ? "❌" : "✅"} NEXT_PUBLIC_SUPABASE_URL${hasPlaceholderUrl ? " (contains placeholder value)" : ""}
  ${!supabaseAnonKey || hasPlaceholderKey ? "❌" : "✅"} NEXT_PUBLIC_SUPABASE_ANON_KEY${hasPlaceholderKey ? " (contains placeholder value)" : ""}

To fix this:

1. Verify .env.local exists in the project root:
   ${process.cwd()}/.env.local

2. Update with your actual Supabase credentials:
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

3. Get credentials from: https://supabase.com
   - Create a project (if you haven't)
   - Go to Settings → API
   - Copy Project URL and anon/public key

4. Quick setup: Run the automated script from repo root:
   ./setup-env.sh

5. Restart the development server:
   npm run dev

For more information, see:
  - .env.local.example (example configuration)
  - ENV_SETUP_GUIDE.md (detailed setup guide)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  console.error(errorMessage);

  // Throw error to prevent app from starting with invalid configuration
  throw new Error(
    "Missing or invalid Supabase environment variables. Please configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local with actual values (not placeholders)"
  );
}

// Create a single Supabase client instance for the app
// This client will be reused across the application for all Supabase operations
// Configure cookie options for cross-subdomain authentication
// If Supabase is suspended, create a mock client
export const supabase = isSupabaseSuspended
  ? createMockSupabaseClient()
  : createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Persist session in cookies for cross-subdomain support
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        // Cookie options for cross-subdomain authentication
        cookieOptions: {
          domain: getCookieDomain(),
          // Secure cookies in production
          secure:
            typeof window !== "undefined"
              ? window.location.protocol === "https:"
              : process.env.NODE_ENV === "production",
          sameSite: "lax",
        },
      },
    });

/**
 * Create a mock Supabase client when Supabase is suspended
 * This allows the app to run without a database connection
 */
function createMockSupabaseClient() {
  console.warn(
    "⚠️ SUPABASE SUSPENDED MODE: Running without database connection. All auth operations will return mock data."
  );

  // Helper to create a chainable query mock that returns empty results
  const createQueryChain = () => {
    const chain = {
      select: () => chain,
      insert: () => chain,
      update: () => chain,
      upsert: () => chain,
      delete: () => chain,
      eq: () => chain,
      neq: () => chain,
      gt: () => chain,
      gte: () => chain,
      lt: () => chain,
      lte: () => chain,
      like: () => chain,
      ilike: () => chain,
      is: () => chain,
      in: () => chain,
      contains: () => chain,
      containedBy: () => chain,
      range: () => chain,
      match: () => chain,
      not: () => chain,
      or: () => chain,
      filter: () => chain,
      order: () => chain,
      limit: () => chain,
      range: () => chain,
      single: async () => ({
        data: null,
        error: { message: "Supabase is currently suspended" },
      }),
      maybeSingle: async () => ({
        data: null,
        error: null,
      }),
      then: async (resolve) => {
        const result = {
          data: null,
          error: { message: "Supabase is currently suspended" },
        };
        return resolve ? resolve(result) : result;
      },
    };
    return chain;
  };

  return {
    auth: {
      getSession: async () => ({
        data: { session: null },
        error: null,
      }),
      getUser: async () => ({
        data: { user: null },
        error: null,
      }),
      signOut: async () => ({ error: null }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: { message: "Supabase is currently suspended" },
      }),
      signInWithOtp: async () => ({
        data: null,
        error: { message: "Supabase is currently suspended" },
      }),
      signInWithOAuth: async () => ({
        data: null,
        error: { message: "Supabase is currently suspended" },
      }),
      signUp: async () => ({
        data: { user: null, session: null },
        error: { message: "Supabase is currently suspended" },
      }),
      resetPasswordForEmail: async () => ({
        data: null,
        error: { message: "Supabase is currently suspended" },
      }),
      updateUser: async () => ({
        data: { user: null },
        error: { message: "Supabase is currently suspended" },
      }),
      onAuthStateChange: () => ({
        data: { subscription: { unsubscribe: () => {} } },
      }),
    },
    from: () => createQueryChain(),
    rpc: async () => ({
      data: null,
      error: { message: "Supabase is currently suspended" },
    }),
    storage: {
      from: () => ({
        upload: async () => ({
          data: null,
          error: { message: "Supabase is currently suspended" },
        }),
        download: async () => ({
          data: null,
          error: { message: "Supabase is currently suspended" },
        }),
        list: async () => ({
          data: [],
          error: null,
        }),
        remove: async () => ({
          data: null,
          error: { message: "Supabase is currently suspended" },
        }),
        createSignedUrl: async () => ({
          data: null,
          error: { message: "Supabase is currently suspended" },
        }),
        getPublicUrl: () => ({
          data: { publicUrl: "" },
        }),
      }),
    },
  };
}

/**
 * Helper function to get the currently logged-in user
 *
 * @returns {Promise<Object|null>} User object if authenticated, null otherwise
 *
 * Example usage:
 * const user = await getCurrentUser()
 * if (user) {
 *   console.log('Logged in as:', user.email)
 * }
 */
export async function getCurrentUser() {
  // If Supabase is suspended, return null (no user)
  if (isSupabaseSuspended) {
    return null;
  }

  try {
    // Get the current session from Supabase
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error.message);
      return null;
    }

    // Return the user object from the session (or null if no session)
    return session?.user || null;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}

/**
 * Helper function to sign out the current user
 *
 * @returns {Promise<Object>} Object with success status and optional error
 *
 * Example usage:
 * const { success, error } = await signOutUser()
 * if (success) {
 *   router.push('/login')
 * }
 */
export async function signOutUser() {
  // If Supabase is suspended, return success (no-op)
  if (isSupabaseSuspended) {
    return { success: true };
  }

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error signing out:", error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Error in signOutUser:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper function to sign in with email and password
 *
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Object with user data or error
 *
 * Example usage:
 * const { user, error } = await signInWithEmail(email, password)
 * if (user) {
 *   console.log('Signed in successfully')
 * }
 */
export async function signInWithEmail(email, password) {
  // If Supabase is suspended, return error
  if (isSupabaseSuspended) {
    return {
      user: null,
      error: "Authentication is temporarily suspended. Please try again later.",
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, session: data.session, error: null };
  } catch (error) {
    console.error("Error in signInWithEmail:", error);
    return { user: null, error: error.message };
  }
}

/**
 * Helper function to send a magic link (passwordless sign-in email)
 *
 * @param {string} email - User's email address
 * @param {string} redirectTo - Optional custom redirect URL (defaults to current page)
 * @returns {Promise<Object>} Object with success status or error
 *
 * Example usage:
 * const { success, error } = await sendMagicLink(email)
 * if (success) {
 *   console.log('Magic link sent! Check your email.')
 * }
 */
export async function sendMagicLink(email, redirectTo = null) {
  // If Supabase is suspended, return error
  if (isSupabaseSuspended) {
    return {
      success: false,
      error: "Authentication is temporarily suspended. Please try again later.",
    };
  }

  try {
    // Dynamic domain detection: Use provided redirect, fall back to current page, then env var
    // This ensures users stay on the same domain after auth (important for multi-domain setups)
    const redirectUrl =
      redirectTo ||
      (typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}`
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error in sendMagicLink:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper function to sign in with Google OAuth
 *
 * @param {string} redirectTo - Optional custom redirect URL (defaults to current page)
 * @returns {Promise<Object>} Object with success status or error
 *
 * Example usage:
 * const { success, error } = await signInWithGoogle()
 */
export async function signInWithGoogle(redirectTo = null) {
  // If Supabase is suspended, return error
  if (isSupabaseSuspended) {
    return {
      success: false,
      error: "Authentication is temporarily suspended. Please try again later.",
    };
  }

  try {
    // Dynamic domain detection: Use provided redirect, fall back to current page, then env var
    // This ensures users stay on the same domain after auth (important for multi-domain setups)
    const redirectUrl =
      redirectTo ||
      (typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}`
        : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error in signInWithGoogle:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper function to check if user has admin role
 *
 * Uses the public.profiles table to validate admin status.
 * This is the centralized approach for admin validation across all apps.
 *
 * ⚠️ IMPORTANT: This is for CLIENT-SIDE UI DISPLAY ONLY
 * Server-side verification is required for actual access control.
 * This function should only be used to show/hide UI elements.
 *
 * In production, implement server-side admin verification:
 * - API routes should verify admin role from profiles table
 * - Protected pages should validate on server before rendering
 * - Database queries should use Row Level Security (RLS)
 *
 * @param {Object} user - User object from Supabase
 * @returns {Promise<boolean>} True if user is admin
 *
 * Example usage:
 * const user = await getCurrentUser()
 * const hasAdminAccess = await isAdmin(user)
 * if (hasAdminAccess) {
 *   // Show admin UI
 * }
 */
export async function isAdmin(user) {
  if (!user) return false;

  // If Supabase is suspended, return false (no admin access)
  if (isSupabaseSuspended) {
    return false;
  }

  // Hardcoded admin emails - always grant admin access
  const adminEmails = ["pda.indian@gmail.com", "pda.indian@gvmail.com"];
  if (adminEmails.includes(user.email)) {
    return true;
  }

  try {
    // Query the public.profiles table for admin status
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error checking admin status:", error.message);
      return false;
    }

    return data?.is_admin === true;
  } catch (error) {
    console.error("Error in isAdmin:", error);
    return false;
  }
}

/**
 * Helper function to check if user has paid/registered status
 *
 * ⚠️ IMPORTANT: This is for CLIENT-SIDE UI DISPLAY ONLY
 * Server-side verification is required for actual access control.
 *
 * In production, implement proper payment verification:
 * - Check against payment database/table in Supabase
 * - Verify payment status with payment provider
 * - Use Row Level Security (RLS) policies
 *
 * @param {Object} user - User object from Supabase
 * @returns {Promise<boolean>} True if user has paid/registered
 *
 * Example usage:
 * const hasPaid = await checkUserPaymentStatus(user)
 * if (hasPaid) {
 *   // Grant access to paid content
 * }
 */
export async function checkUserPaymentStatus(user) {
  if (!user) return false;

  // If Supabase is suspended, return false (no paid access)
  if (isSupabaseSuspended) {
    return false;
  }

  try {
    // Check user metadata for payment status
    // This can be set when payment is processed
    if (
      user.user_metadata?.payment_status === "paid" ||
      user.app_metadata?.payment_status === "paid"
    ) {
      return true;
    }

    // Admins automatically have access
    const hasAdminAccess = await isAdmin(user);
    if (hasAdminAccess) {
      return true;
    }

    // TODO: In production, query Supabase database for payment records
    // Example:
    // const { data, error } = await supabase
    //   .from('payments')
    //   .select('*')
    //   .eq('user_id', user.id)
    //   .eq('status', 'completed')
    //   .single()
    //
    // if (data) return true

    // For now, return false - user must have paid status in metadata
    return false;
  } catch (error) {
    console.error("Error checking payment status:", error);
    return false;
  }
}

/**
 * Helper function to get user profile information
 *
 * @param {Object} user - User object from Supabase
 * @returns {Object} User profile with name, email, etc.
 */
export function getUserProfile(user) {
  if (!user) return null;

  return {
    email: user.email,
    firstName: user.user_metadata?.firstName || user.user_metadata?.first_name || "",
    lastName: user.user_metadata?.lastName || user.user_metadata?.last_name || "",
    fullName:
      `${user.user_metadata?.firstName || user.user_metadata?.first_name || ""} ${user.user_metadata?.lastName || user.user_metadata?.last_name || ""}`.trim() ||
      user.email,
    paymentStatus:
      user.user_metadata?.payment_status || user.app_metadata?.payment_status || "unpaid",
  };
}
