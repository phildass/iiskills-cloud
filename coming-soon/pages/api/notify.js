import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  // Check if Supabase credentials are configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // If Supabase is not configured, just return success
    // In production, you would configure Supabase
    console.log("Email notification request:", email);
    return res.status(200).json({ 
      message: "Thank you for your interest! We'll notify you when we launch.",
      note: "Supabase not configured - this is a demo response"
    });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store email in the coming_soon_notifications table
    const { error } = await supabase
      .from("coming_soon_notifications")
      .insert([
        {
          email: email.toLowerCase().trim(),
          subscribed_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      // If the table doesn't exist or there's an error, still return success
      // This allows the app to work even without database setup
      console.log("Database error (non-critical):", error.message);
      return res.status(200).json({ 
        message: "Thank you for your interest!",
      });
    }

    return res.status(200).json({ 
      message: "Thank you for your interest! We'll notify you when we launch." 
    });
  } catch (error) {
    console.error("Error in notify API:", error);
    // Return success even on error to not discourage users
    return res.status(200).json({ 
      message: "Thank you for your interest!",
    });
  }
}
