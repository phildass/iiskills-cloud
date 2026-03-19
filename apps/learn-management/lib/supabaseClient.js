/**
 * Supabase Client Configuration for Learn Management
 *
 * This file initializes the Supabase client with cross-subdomain session support.
 * In the browser, createBrowserClient from @supabase/ssr is used so that the auth
 * cookie set on .iiskills.cloud is readable from all *.iiskills.cloud subdomains.
 */

import { createClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";
import { getCookieDomain } from "@utils/urlHelper";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use POSITIVE validation: check if the values look like real credentials.
// This avoids placeholder strings being compiled into the client bundle.
const _hasCredentials =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  supabaseUrl.includes(".supabase.co") &&
  (supabaseAnonKey.startsWith("eyJ") || supabaseAnonKey.startsWith("sb_"));

// In production on the server, fail fast if credentials are missing.
if (!_hasCredentials && process.env.NODE_ENV === "production" && typeof window === "undefined") {
  console.error(
    "STARTUP ERROR: Missing or invalid NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Set these in your environment before starting the server."
  );
  process.exit(1);
}

// Create Supabase client — real when credentials are present, no-op stub for CI builds.

// Guard: do not use placeholder fallbacks — they get bundled into production output.

const _createNullClient = () => {
  const chain = () => {
    const q = {
      select: () => q,
      insert: () => q,
      update: () => q,
      delete: () => q,
      upsert: () => q,
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
// - Browser: use createBrowserClient with cookie domain for cross-subdomain session sharing
// - Server: use plain createClient without persistent session (for API routes)

export const supabase = _hasCredentials
  ? typeof window !== "undefined"
    ? createBrowserClient(supabaseUrl, supabaseAnonKey, {
        cookieOptions: {
          domain: getCookieDomain(),
          secure: window.location.protocol === "https:",
          sameSite: "lax",
          path: "/",
        },
      })
    : createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
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
      console.log("⚠️ AUTH DISABLED [learn-management]: Returning mock user");
      return {
        id: "dev-override-management",
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
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3016")
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
