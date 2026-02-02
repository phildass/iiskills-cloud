/**
 * Supabase Client Configuration for Learn AI
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
  if (isSuspended) {
    // Return mock user in SUSPENDED mode
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

/**
 * Helper function to sign out the current user
 */
export async function signOutUser() {
  if (isSuspended) {
    memoryStore.users = [];
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
 * Helper function to get the site URL
 */
export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3009")
  );
}

/**
 * Query wrapper that handles SUSPENDED mode
 */
export async function queryData(table, filters = {}) {
  if (isSuspended) {
    return { data: memoryStore[table] || [], error: null };
  }

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
 * Insert wrapper that handles SUSPENDED mode
 */
export async function insertData(table, data) {
  if (isSuspended) {
    const record = { id: Date.now(), ...data, created_at: new Date().toISOString() };
    memoryStore[table] = memoryStore[table] || [];
    memoryStore[table].push(record);
    return { data: record, error: null };
  }

  try {
    const { data: result, error } = await supabase.from(table).insert(data).select().single();
    return { data: result, error };
  } catch (error) {
    return { data: null, error };
  }
}

export { isSuspended, memoryStore };
