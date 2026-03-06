/**
 * Supabase Client - apps/main
 *
 * Re-exports the shared GoTrueClient singleton from the root lib/supabaseClient.js
 * so that ALL modules in apps/main use exactly ONE Supabase client instance.
 *
 * Having a single client instance is critical for:
 * 1. Correct PKCE code-verifier lookup during OAuth callbacks (the verifier must
 *    be stored and retrieved by the same client / storage-key).
 * 2. Eliminating the "Multiple GoTrueClient instances detected" browser warning.
 * 3. Consistent session state across all pages (sign-in, auth/callback, payments,
 *    dashboard, profile, …).
 *
 * App-specific helpers (signInWithGoogle, sendMagicLink, isAdmin, …) are still
 * defined here but they now operate on the shared supabase instance.
 *
 * See lib/supabaseClient.js for environment variable requirements.
 */

// ---------------------------------------------------------------------------
// Shared singleton — the ONLY GoTrueClient in apps/main.
// @lib resolves to <repo-root>/lib via the webpack/turbopack alias in
// apps/main/next.config.js, pointing at the same module that @iiskills/ui
// authentication components use.
// ---------------------------------------------------------------------------
import {
  supabase as _sharedSupabase,
  getCurrentUser as _sharedGetCurrentUser,
} from "@lib/supabaseClient";

export const supabase = _sharedSupabase;

// ---------------------------------------------------------------------------
// getCurrentUser — re-exported from root lib (handles auth-disabled / mock
// modes) with an additional [main] tag in the override log.
// ---------------------------------------------------------------------------
export async function getCurrentUser() {
  // TEMPORARY AUTH DISABLE - PR: feature/disable-auth-temporary
  // Global feature flag to bypass authentication for debugging/maintenance
  // To enable: Set NEXT_PUBLIC_DISABLE_AUTH=true and rebuild
  try {
    const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "true";
    if (isAuthDisabled) {
      console.log("⚠️ AUTH DISABLED [main]: Returning mock user with full permissions");
      return {
        id: "dev-override-main",
        email: "dev@iiskills.cloud",
        role: "bypass",
        user_metadata: {
          firstName: "Dev",
          lastName: "Override",
          full_name: "Dev Override",
          is_admin: true,
          payment_status: "paid",
        },
        app_metadata: {
          payment_status: "paid",
          is_admin: true,
        },
      };
    }
  } catch (e) {
    // Silently continue if env check fails
  }
  // END TEMPORARY AUTH DISABLE

  return _sharedGetCurrentUser();
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
 * Helper function to send a magic link (passwordless login email)
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
      console.error("[sendMagicLink] Supabase OTP error:", {
        status: error.status,
        name: error.name,
        message: error.message,
        code: error.code,
      });
      return {
        success: false,
        error: error.message,
        errorDetails: { status: error.status, name: error.name, code: error.code },
      };
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
 * API routes use validateAdminRequest / validateAdminRequestAsync from adminAuth.js,
 * which additionally checks the ADMIN_ALLOWLIST_EMAILS env var.
 *
 * @param {Object} user - User object from Supabase
 * @returns {Promise<boolean>} True if user is admin
 */
export async function isAdmin(user) {
  if (!user) return false;

  try {
    // Query the public.profiles table for admin status.
    // Server-side allowlist checks are handled by validateAdminRequestAsync in adminAuth.js.
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
