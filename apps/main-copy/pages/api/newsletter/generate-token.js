import { createClient } from "@supabase/supabase-js";

/**
 * Newsletter Token Generation API Route
 *
 * Generates secure unsubscribe tokens for newsletter emails
 * This should be called when sending newsletter emails
 */

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId, email } = req.body;

    // Validate input
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Call the Supabase function to generate token
    const { data, error } = await supabase.rpc("generate_unsubscribe_token", {
      p_user_id: userId || null,
      p_email: email.toLowerCase(),
    });

    if (error) {
      console.error("Token generation error:", error);

      // If function doesn't exist, fall back to manual generation
      if (error.code === "42883" || error.message.includes("does not exist")) {
        return await fallbackGenerateToken(userId, email, res);
      }

      throw error;
    }

    // Return the token
    return res.status(200).json({
      success: true,
      token: data,
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://iiskills.cloud"}/unsubscribe?token=${data}`,
    });
  } catch (error) {
    console.error("Token generation error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate unsubscribe token",
    });
  }
}

/**
 * Fallback token generation if Supabase function doesn't exist
 */
async function fallbackGenerateToken(userId, email, res) {
  try {
    // Generate cryptographically secure random token
    const crypto = require("crypto");
    const token = crypto.randomBytes(32).toString("base64");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90); // 90 days expiration

    // Insert token into database
    const { data, error } = await supabase
      .from("newsletter_unsubscribe_tokens")
      .insert([
        {
          user_id: userId || null,
          email: email.toLowerCase(),
          token: token,
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select("token")
      .single();

    if (error) {
      console.error("Fallback token insert error:", error);
      throw error;
    }

    return res.status(200).json({
      success: true,
      token: data.token,
      unsubscribeUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://iiskills.cloud"}/unsubscribe?token=${data.token}`,
    });
  } catch (error) {
    console.error("Fallback token generation error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to generate unsubscribe token",
    });
  }
}
