/**
 * Supabase Client Configuration for Learn Physics
 *
 * This file initializes the Supabase client.
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

