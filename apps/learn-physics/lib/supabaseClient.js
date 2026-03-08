/**
 * Supabase Client Configuration for Learn Physics
 *
 * This file initializes the Supabase client.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use POSITIVE validation: check if the values look like real credentials.
// This avoids placeholder strings being compiled into the client bundle.
const _hasCredentials =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  supabaseUrl.includes(".supabase.co") &&
  supabaseAnonKey.startsWith("eyJ");

// In production on the server, fail fast if credentials are missing.
if (!_hasCredentials && process.env.NODE_ENV === "production" && typeof window === "undefined") {
  console.error(
    "STARTUP ERROR: Missing or invalid NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Set these in your environment before starting the server."
  );
  process.exit(1);
}

// Create Supabase client — real when credentials are present, no-op stub for CI builds.
export const supabase = _hasCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : {
      auth: {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signOut: async () => ({ error: null }),
        signInWithPassword: async () => ({
          data: { user: null, session: null },
          error: { message: "No database connection" },
        }),
        signInWithOtp: async () => ({ data: null, error: { message: "No database connection" } }),
        signUp: async () => ({
          data: { user: null, session: null },
          error: { message: "No database connection" },
        }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        select: () => ({ data: null, error: { message: "No database connection" } }),
        insert: () => ({ data: null, error: { message: "No database connection" } }),
        update: () => ({ data: null, error: { message: "No database connection" } }),
        delete: () => ({ data: null, error: { message: "No database connection" } }),
      }),
    };

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
