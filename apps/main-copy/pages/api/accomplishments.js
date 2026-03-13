/**
 * Accomplishments API
 *
 * GET /api/accomplishments
 *
 * Returns an AI-generated analysis of the authenticated user's learning
 * activity across courses, or null if the user has no recorded activity.
 *
 * The analysis is safe, factual, and based only on recorded usage/progress
 * data. No fabricated text is returned for users with no activity.
 *
 * Requires: Authorization: Bearer <supabase_access_token>
 *
 * Response:
 *   200 { analysis: string | null }
 *   401 { error: "Unauthorized" }
 *   405 { error: "Method Not Allowed" }
 *   503 { error: "Database not configured" }
 */

import { createClient } from "@supabase/supabase-js";

const OPENAI_MODEL = "gpt-4o-mini";

function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

/**
 * Build a concise, factual prompt from the user's raw progress data.
 * No personal identifiers are included — only aggregate stats.
 */
function buildPrompt(stats) {
  const lines = [
    `Total lessons started: ${stats.totalStarted}`,
    `Total lessons completed: ${stats.totalCompleted}`,
    `Total lessons passed (quiz): ${stats.totalPassed}`,
    `Courses with activity: ${stats.courseList.join(", ") || "none"}`,
  ];

  for (const [appId, info] of Object.entries(stats.byApp)) {
    lines.push(
      `  • ${appId}: ${info.total} lessons tracked, ${info.passed} passed` +
        (info.lastActive ? `, last active ${info.lastActive.slice(0, 10)}` : "")
    );
  }

  return lines.join("\n");
}

/**
 * Call the OpenAI chat completions API to generate a learning analysis.
 * Returns the text string on success, null on failure.
 */
async function generateAnalysis(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a learning coach for iiskills.cloud. " +
              "Given a learner's activity summary, write a short (3–5 sentence), " +
              "encouraging and factual analysis of their progress. " +
              "Do NOT invent achievements. Do NOT mention names or emails. " +
              "Use only the data provided. If the data shows no meaningful activity, " +
              "write a single brief encouraging sentence to get started.",
          },
          {
            role: "user",
            content:
              "Here is my learning activity summary. Please give me an honest, encouraging analysis:\n\n" +
              prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 300,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return res.status(503).json({ error: "Database not configured" });
  }

  // Authenticate via Bearer token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = userData.user.id;

  // Fetch all progress rows for this user
  const { data: progressRows } = await supabase
    .from("user_lesson_progress")
    .select("app_id, passed, completed_at, last_seen_at, started_at")
    .eq("user_id", userId);

  const rows = progressRows || [];

  // No activity at all → return null (empty state)
  if (rows.length === 0) {
    return res.status(200).json({ analysis: null });
  }

  // Aggregate stats by app
  const byApp = {};
  let totalStarted = 0;
  let totalCompleted = 0;
  let totalPassed = 0;

  for (const row of rows) {
    if (!byApp[row.app_id]) byApp[row.app_id] = { total: 0, passed: 0, lastActive: null };
    byApp[row.app_id].total++;
    totalStarted++;
    if (row.completed_at) totalCompleted++;
    if (row.passed) {
      byApp[row.app_id].passed++;
      totalPassed++;
    }
    const ts = row.last_seen_at || row.completed_at;
    if (
      ts &&
      (!byApp[row.app_id].lastActive || new Date(ts) > new Date(byApp[row.app_id].lastActive))
    ) {
      byApp[row.app_id].lastActive = ts;
    }
  }

  const courseList = Object.keys(byApp);
  const stats = { totalStarted, totalCompleted, totalPassed, courseList, byApp };

  const prompt = buildPrompt(stats);
  const analysis = await generateAnalysis(prompt);

  // If OpenAI is unavailable, return a deterministic text fallback derived
  // solely from the real data — no fabricated content.
  if (!analysis) {
    const parts = [];
    parts.push(
      `You have tracked activity across ${courseList.length} course${courseList.length !== 1 ? "s" : ""}: ${courseList.join(", ")}.`
    );
    parts.push(
      `In total you have started ${totalStarted} lesson${totalStarted !== 1 ? "s" : ""}, ` +
        `completed ${totalCompleted}, and passed ${totalPassed} quiz${totalPassed !== 1 ? "zes" : ""}.`
    );
    return res.status(200).json({ analysis: parts.join(" ") });
  }

  return res.status(200).json({ analysis });
}
