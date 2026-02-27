/**
 * Supabase Client Configuration for Learn Physics
 *
 * This file initializes the Supabase client with support for SUSPENDED mode.
 * When SUSPENDED mode is active, it provides an in-memory fallback to allow
 * the app to function without a database connection.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
const isSuspended = process.env.NEXT_PUBLIC_SUPABASE_SUSPENDED === "true";

// In-memory store for SUSPENDED mode
const memoryStore = {
  users: [],
  modules: [],
  lessons: [],
  progress: [],
  certificates: [],
};

// Create Supabase client
export const supabase = !isSuspended
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

/**
 * Helper function to get the currently logged-in user
 */
export async function getCurrentUser() {
  // TEMPORARY AUTH DISABLE - global feature flag to bypass authentication
  try {
    const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
    if (isAuthDisabled) {
      console.log("⚠️ AUTH DISABLED [learn-physics]: Returning mock user");
      return {
        id: "dev-override-physics",
        email: "dev@iiskills.cloud",
        role: "bypass",
        user_metadata: {
          full_name: "Dev Override",
          is_admin: true,
          payment_status: "paid",
        },
      };
    }
  } catch (e) {
    // Continue if env check fails
  }
  // END TEMPORARY AUTH DISABLE

  if (isSuspended) {
    return memoryStore.users[0] || null;
  }

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

export { isSuspended, memoryStore };
