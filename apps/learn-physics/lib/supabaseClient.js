/**
 * Supabase Client Configuration for Learn Physics
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
