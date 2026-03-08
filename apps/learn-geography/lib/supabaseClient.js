/**
 * Supabase Client Configuration for Learn Geography
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
  // TEMPORARY AUTH DISABLE - PR: feature/disable-auth-temporary
  // Global feature flag to bypass authentication for debugging/maintenance
  try {
    const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
    if (isAuthDisabled) {
      console.log("⚠️ AUTH DISABLED [learn-geography]: Returning mock user");
      return {
        id: "dev-override-geography",
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

/**
 * Helper function to sign out the current user
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
 */
export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3011")
  );
}

/**
 * Query wrapper
 */
export async function queryData(table, filters = {}) {

  try {
    let query = supabase.from(table).select("*");

    Object.entries(filters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;
    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Insert wrapper
 */
export async function insertData(table, data) {

  try {
    const { data: result, error } = await supabase.from(table).insert(data).select().single();
    return { data: result, error };
  } catch (error) {
    return { data: null, error };
  }
}
