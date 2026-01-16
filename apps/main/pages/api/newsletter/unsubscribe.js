import { createClient } from "@supabase/supabase-js";

/**
 * Newsletter Unsubscribe API Route
 *
 * Handles one-click unsubscribe from email newsletters
 * No login required - uses secure token-based authentication
 */

// PostgreSQL error codes
const PG_ERROR_UNDEFINED_FUNCTION = "42883"; // Function does not exist

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { token } = req.body;

    // Validate input
    if (!token || typeof token !== "string") {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid unsubscribe token" 
      });
    }

    // Call the Supabase function to process unsubscribe
    const { data, error } = await supabase.rpc("process_unsubscribe", {
      p_token: token,
    });

    if (error) {
      console.error("Supabase RPC error:", error);
      
      // If function doesn't exist, fall back to manual processing
      if (error.code === PG_ERROR_UNDEFINED_FUNCTION || error.message.includes("does not exist")) {
        return await fallbackUnsubscribe(token, res);
      }
      
      return res.status(500).json({
        success: false,
        error: "Failed to process unsubscribe request",
      });
    }

    // Check if the function returned success
    if (!data || !data.success) {
      return res.status(400).json({
        success: false,
        error: data?.error || "Invalid or expired token",
      });
    }

    return res.status(200).json({
      success: true,
      email: data.email,
      message: "Successfully unsubscribed from The Skilling Newsletter",
    });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    });
  }
}

/**
 * Fallback unsubscribe logic if Supabase function doesn't exist
 */
async function fallbackUnsubscribe(token, res) {
  try {
    // Find the token
    const { data: tokenData, error: tokenError } = await supabase
      .from("newsletter_unsubscribe_tokens")
      .select("*")
      .eq("token", token)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (tokenError || !tokenData) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired unsubscribe token",
      });
    }

    // Mark token as used
    await supabase
      .from("newsletter_unsubscribe_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("id", tokenData.id);

    // Update profile if user_id exists
    if (tokenData.user_id) {
      await supabase
        .from("profiles")
        .update({ subscribed_to_newsletter: false })
        .eq("id", tokenData.user_id);
    }

    // Update newsletter_subscribers table
    await supabase
      .from("newsletter_subscribers")
      .update({ 
        status: "unsubscribed",
        updated_at: new Date().toISOString() 
      })
      .eq("email", tokenData.email);

    return res.status(200).json({
      success: true,
      email: tokenData.email,
      message: "Successfully unsubscribed from The Skilling Newsletter",
    });
  } catch (error) {
    console.error("Fallback unsubscribe error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to process unsubscribe request",
    });
  }
}
