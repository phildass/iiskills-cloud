import { createClient } from "@supabase/supabase-js";

/**
 * Newsletter Subscription API Route
 *
 * Handles newsletter signups with reCAPTCHA verification
 * and stores emails in Supabase
 */

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// Verify reCAPTCHA token
async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.warn("reCAPTCHA secret key not configured");
    return true; // Allow in development
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();
    return data.success && data.score >= 0.5;
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return false;
  }
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, token } = req.body;

    // Validate input
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (!token) {
      return res.status(400).json({ error: "reCAPTCHA verification required" });
    }

    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(token);
    if (!isHuman) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    // Check if user is authenticated and update their profile
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      // Update user profile to set subscribed_to_newsletter = true
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ subscribed_to_newsletter: true })
        .eq("id", session.user.id);

      if (profileError) {
        console.warn("Failed to update user profile:", profileError);
        // Continue with newsletter subscription even if profile update fails
      }
    }

    // Check if email already exists
    const { data: existing, error: checkError } = await supabase
      .from("newsletter_subscribers")
      .select("email")
      .eq("email", email.toLowerCase())
      .single();

    if (existing) {
      return res.status(200).json({
        message: "You are already subscribed!",
        alreadySubscribed: true,
      });
    }

    // Insert new subscriber
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email: email.toLowerCase(),
          subscribed_at: new Date().toISOString(),
          source: req.headers.host || "unknown",
          status: "active",
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);

      // If table doesn't exist, return success anyway (graceful degradation)
      if (
        error.code === "42P01" ||
        error.message.includes("relation") ||
        error.message.includes("does not exist")
      ) {
        console.warn("Newsletter subscribers table does not exist. Email will not be stored.");
        return res.status(200).json({
          message: "Thank you for subscribing!",
          warning: "Database not configured. Please contact administrator.",
        });
      }

      throw error;
    }

    return res.status(200).json({
      message: "Successfully subscribed!",
      data,
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return res.status(500).json({
      error: "Failed to process subscription. Please try again later.",
    });
  }
}
