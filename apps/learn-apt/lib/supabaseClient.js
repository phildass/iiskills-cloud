/**
 * Supabase Client Configuration for Learn Apt
 *
 * This file initializes the Supabase client with cross-subdomain session support.
 * The session cookie is configured to work across *.iiskills.cloud subdomains,
 * allowing seamless authentication between apps.
 *
 * Setup Instructions:
 * 1. Use the same Supabase project as the main iiskills.cloud app
 * 2. Create a .env.local file with the same credentials:
 *    NEXT_PUBLIC_SUPABASE_URL=your-project-url
 *    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Helper function to get the currently logged-in user
 *
 * @returns {Promise<Object|null>} User object if authenticated, null otherwise
 */
export async function getCurrentUser() {
  // TEMPORARY AUTH DISABLE - PR: feature/disable-auth-temporary
  // Global feature flag to bypass authentication for debugging/maintenance
  try {
    const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
    if (isAuthDisabled) {
      console.log("⚠️ AUTH DISABLED [learn-apt]: Returning mock user");
      return {
        id: 'dev-override-apt',
        email: 'dev@iiskills.cloud',
        role: 'bypass',
        user_metadata: {
          full_name: 'Dev Override',
          is_admin: true,
          payment_status: 'paid'
        }
      };
    }
  } catch (e) {
    // Continue if env check fails
  }
  // END TEMPORARY AUTH DISABLE

  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("Error getting session:", error.message);
      return null;
    }

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
 */
export async function signOutUser() {
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
 * Helper function to get the site URL
 *
 * @returns {string} Site URL for OAuth redirects
 */
export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3002")
  );
}
