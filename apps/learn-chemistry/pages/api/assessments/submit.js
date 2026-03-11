import { insertData } from "../../../lib/supabaseClient";
import { createClient } from "@supabase/supabase-js";

const APP_ID = "learn-chemistry";

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { lesson_id, module_id, score, answers, access_token } = req.body;

    if (!lesson_id || !module_id || score === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Passing score is 3 out of 5 (>=60%)
    const passed = score >= 3;

    // Save progress to database (existing behavior)
    await insertData("lesson_progress", {
      lesson_id,
      module_id,
      score,
      passed,
      answers: JSON.stringify(answers || []),
    });

    // Track progress in universal user_lesson_progress + user_badges tables
    // Requires access_token (passed from lesson page) or Authorization header
    const token =
      access_token ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.substring(7)
        : null);

    if (token) {
      const sb = getServiceClient();
      if (sb) {
        const { data: userData } = await sb.auth.getUser(token);
        const userId = userData?.user?.id;
        if (userId) {
          const now = new Date().toISOString();
          // Upsert lesson progress
          await sb.from("user_lesson_progress").upsert(
            {
              user_id: userId,
              app_id: APP_ID,
              module_id: String(module_id),
              lesson_id: String(lesson_id),
              last_score: score,
              passed,
              completed_at: passed ? now : undefined,
              last_seen_at: now,
              updated_at: now,
            },
            { onConflict: "user_id,app_id,module_id,lesson_id" }
          );
          // Award badge if passed (idempotent via unique constraint)
          if (passed) {
            await sb.from("user_badges").upsert(
              {
                user_id: userId,
                app_id: APP_ID,
                module_id: String(module_id),
                lesson_id: String(lesson_id),
                badge_type: "lesson",
                score,
                earned_at: now,
                updated_at: now,
              },
              { onConflict: "user_id,app_id,module_id,lesson_id" }
            );
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      passed,
      score,
      message: passed
        ? "Congratulations! You passed the quiz."
        : "You need at least 3 correct answers to pass. Please review the material and try again.",
    });
  } catch (error) {
    console.error("Assessment submission error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
