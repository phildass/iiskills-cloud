/**
 * Supabase Client Configuration for Learn Math
 *
 * This file initializes the Supabase client.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Guard: do not use placeholder fallbacks — they get bundled into production output.
// In CI/build without credentials, a null-safe stub is returned; all auth calls return empty.
const _hasCredentials = Boolean(supabaseUrl && supabaseAnonKey);
const _createNullClient = () => {
  const chain = () => {
    const q = {
      select: () => q,
      insert: () => q,
      update: () => q,
      delete: () => q,
      upsert: () => q,
      eq: () => q,
      neq: () => q,
      in: () => q,
      order: () => q,
      limit: () => q,
      single: () => Promise.resolve({ data: null, error: { message: "No database connection" } }),
      maybeSingle: () => Promise.resolve({ data: null, error: null }),
      then: (resolve) =>
        resolve ? resolve({ data: [], error: null }) : Promise.resolve({ data: [], error: null }),
    };
    return q;
  };
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: chain,
    rpc: () => Promise.resolve({ data: null, error: null }),
  };
};

// Create Supabase client
export const supabase = _hasCredentials
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : _createNullClient();

/**
 * Helper function to get the currently logged-in user
 */
export async function getCurrentUser() {
  // TEMPORARY AUTH DISABLE - PR: feature/disable-auth-temporary
  // Global feature flag to bypass authentication for debugging/maintenance
  try {
    const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
    if (isAuthDisabled) {
      console.log("⚠️ AUTH DISABLED [learn-math]: Returning mock user");
      return {
        id: "dev-override-math",
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
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3017")
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
