#!/usr/bin/env node
/**
 * scripts/seed_data.js
 *
 * - Generates 10 Modules x 10 Lessons (100 lessons) with 5-question quizzes per lesson using an LLM.
 * - Writes JSON output to data/learn-ai-seed.json
 * - Optionally uploads to Supabase if SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided.
 *
 * Usage:
 *  OPENAI_API_KEY=sk-... node scripts/seed_data.js
 *  # optional upload:
 *  OPENAI_API_KEY=sk-... SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=service_key node scripts/seed_data.js --upload
 *
 * WARNING: Do NOT commit any real keys. Add them to your local .env only.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const OpenAI = require("openai");

// optional supabase insert
const useSupabase = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
let supabaseClient = null;
if (useSupabase) {
  const { createClient } = require("@supabase/supabase-js");
  supabaseClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
}

if (!process.env.OPENAI_API_KEY) {
  console.error("ERROR: OPENAI_API_KEY is required to run this script.");
  process.exit(1);
}

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OUT_DIR = path.resolve(__dirname, "..", "data");
const OUT_FILE = path.join(OUT_DIR, "learn-ai-seed.json");
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// Core module titles (can be adjusted)
const MODULE_TITLES = [
  "Introduction to AI & Data Literacy",
  "Python Essentials for AI",
  "Data Preprocessing & Feature Engineering",
  "Supervised Learning: Regression & Classification",
  "Unsupervised Learning & Clustering",
  "Introduction to Neural Networks",
  "Model Evaluation & Deployment",
  "Freelance AI Services & Monetization",
  "AI Product & Tool Creation (Prompt Engineering)",
  "Career Pathways, Portfolio & Interview Prep"
];

const MODEL = "gpt-4o-mini"; // adjust if unavailable; can be changed to a suitable model
const LESSONS_PER_MODULE = 10;
const LESSON_WORD_LIMIT = 400;

// The LLM prompt template (exact string used below)
const LLM_PROMPT_TEMPLATE = `
You are an expert AI educator creating concise lesson content and short quizzes for an online course aimed at learners in India who want to build practical AI skills and monetize them.

Requirements (must follow exactly):
- Output must be valid JSON only (no explanatory text), encoding an object: { "moduleId": <int>, "moduleTitle": "<string>", "lessons": [ ... ] }
- Each module contains exactly ${LESSONS_PER_MODULE} lessons.
- Each lesson object: { "lessonId": <int>, "title": "<string>", "content": "<string>", "quiz": { "questions": [ { "q": "<string>", "options": ["A","B","C","D"], "answerIndex": <0-3> } ... ] } }
- Lesson content constraints:
  - Max 5 paragraphs.
  - Max ${LESSON_WORD_LIMIT} words total.
  - Use simple, clear language, with India-relevant examples where applicable.
- Quiz constraints:
  - Exactly 5 multiple-choice questions.
  - 4 options each.
  - One correct option; encode correct option as answerIndex.
  - Include at least one question that checks conceptual understanding and one that checks applied knowledge.
- Provide varied lesson titles that map to the module topic.
- Ensure JSON uses plain ASCII characters where possible and escape quotes properly.

Produce the JSON ONLY. Do not include any commentary.
`;

// helper: sleep
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// build tasks
async function generateLesson(moduleIndex, moduleTitle, lessonIndex) {
  const system = `You are a concise course content generator. Follow the JSON schema exactly.`;
  const userPrompt = `
${LLM_PROMPT_TEMPLATE}

Now generate lesson ${lessonIndex} for module ${moduleIndex}: "${moduleTitle}".
Make the lesson title short (<=10 words). Ensure the lesson's content teaches one focused concept.
`;
  try {
    const resp = await client.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 1200
    });
    // API returns text in resp. adapt to whichever shape the OpenAI SDK returns
    const text = resp.choices?.[0]?.message?.content ?? resp.choices?.[0]?.text ?? "";
    // parse JSON out of text
    const json = JSON.parse(text);
    return json;
  } catch (err) {
    console.error("LLM error:", err.message || err);
    throw err;
  }
}

async function generateAll() {
  const output = { generatedAt: new Date().toISOString(), modules: [] };

  for (let i = 0; i < MODULE_TITLES.length; i++) {
    const moduleId = i + 1;
    const moduleTitle = MODULE_TITLES[i];
    console.log(`Generating module ${moduleId}: ${moduleTitle}`);
    const moduleObj = { moduleId, moduleTitle, lessons: [] };

    for (let j = 0; j < LESSONS_PER_MODULE; j++) {
      const lessonId = j + 1;
      console.log(`  -> Generating lesson ${lessonId} (module ${moduleId})`);
      // call LLM for lesson JSON (we expect lesson JSON only for this lesson)
      // The LLM prompt will instruct JSON schema for a single lesson object as defined above.
      // For robustness, wrap in retry loop
      let attempt = 0;
      const maxAttempts = 3;
      while (attempt < maxAttempts) {
        try {
          const lessonJsonWrapper = await generateLesson(moduleId, moduleTitle, lessonId);
          // The generator returns a module-shaped JSON; extract the lesson for this index if needed
          // Normalize: if returned object has lessons array, take first or appropriate
          let lessonObj = null;
          if (Array.isArray(lessonJsonWrapper.lessons) && lessonJsonWrapper.lessons.length > 0) {
            lessonObj = lessonJsonWrapper.lessons[0];
          } else if (lessonJsonWrapper.lesson) {
            lessonObj = lessonJsonWrapper.lesson;
          } else {
            // if the generator returned the full module, find lesson by lessonId
            if (lessonJsonWrapper.moduleId === moduleId && Array.isArray(lessonJsonWrapper.lessons)) {
              lessonObj = lessonJsonWrapper.lessons.find(l => l.lessonId === lessonId) || lessonJsonWrapper.lessons[0];
            } else {
              // fallback: attempt to use the wrapper itself as a lesson
              lessonObj = lessonJsonWrapper;
            }
          }

          // Validate shape minimally
          if (!lessonObj || !lessonObj.title || !lessonObj.content || !lessonObj.quiz) {
            throw new Error("LLM did not produce expected lesson shape. Retrying...");
          }

          // enforce constraints (truncate if necessary)
          // ensure content <= LESSON_WORD_LIMIT words (naive)
          const words = lessonObj.content.split(/\s+/).filter(Boolean);
          if (words.length > LESSON_WORD_LIMIT) {
            lessonObj.content = words.slice(0, LESSON_WORD_LIMIT).join(" ") + " …";
          }

          moduleObj.lessons.push({
            lessonId,
            title: lessonObj.title,
            content: lessonObj.content,
            quiz: lessonObj.quiz
          });

          // small pause to respect rate limits
          await sleep(800);
          break; // exit retry loop
        } catch (err) {
          attempt++;
          console.warn(`Attempt ${attempt} failed for module ${moduleId} lesson ${lessonId}:`, err.message || err);
          if (attempt >= maxAttempts) {
            console.error("Max attempts reached. Aborting.");
            throw err;
          }
          await sleep(2000 * attempt);
        }
      }
    } // lessons loop

    output.modules.push(moduleObj);
    // small pause between modules
    await sleep(1200);
  } // modules loop

  // Final exam generation: request a 20-question exam as metadata
  output.finalExam = {
    totalQuestions: 20,
    passThreshold: 13,
    questions: []
  };

  // generate final exam as one LLM call
  try {
    const examPrompt = `
Create a 20-question multiple-choice final exam covering the entire course. JSON only:
{ "questions": [ { "id":1, "q":"...", "options":["...","...","...","..."], "answerIndex": 1 } , ... ] }
Each question should be concise and test understanding across modules.
`;
    const examResp = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: examPrompt }],
      temperature: 0.2,
      max_tokens: 2000
    });
    const examText = examResp.choices?.[0]?.message?.content ?? examResp.choices?.[0]?.text ?? "";
    const examJson = JSON.parse(examText);
    output.finalExam.questions = examJson.questions.slice(0, 20);
  } catch (err) {
    console.warn("Could not generate final exam automatically:", err.message || err);
    // leave finalExam.questions empty for manual creation
  }

  // Write to file
  fs.writeFileSync(OUT_FILE, JSON.stringify(output, null, 2));
  console.log("Wrote seed data to", OUT_FILE);

  // Optionally upload to Supabase (tables must exist): modules, lessons, quizzes, final_exam
  if (useSupabase) {
    console.log("Attempting to upload to Supabase...");
    // This is a naive uploader - adapt to your DB schema
    for (const mod of output.modules) {
      const { data: modRes, error: modErr } = await supabaseClient
        .from("modules")
        .upsert({ id: mod.moduleId, title: mod.moduleTitle })
        .select();
      if (modErr) console.error("Supabase modules upsert error", modErr);
      for (const lesson of mod.lessons) {
        const { error: lErr } = await supabaseClient.from("lessons").upsert({
          module_id: mod.moduleId,
          lesson_id: lesson.lessonId,
          title: lesson.title,
          content: lesson.content
        });
        if (lErr) console.error("Supabase lesson upsert error", lErr);
        // upsert quiz questions as JSON field
        const { error: qErr } = await supabaseClient.from("quizzes").upsert({
          module_id: mod.moduleId,
          lesson_id: lesson.lessonId,
          questions: lesson.quiz.questions
        });
        if (qErr) console.error("Supabase quiz upsert error", qErr);
      }
    }
    console.log("Supabase upload complete (check errors above).");
  }

  return output;
}

(async () => {
  try {
    const result = await generateAll();
    console.log("Generation completed.");
    // also print summary
    console.log(`Modules generated: ${result.modules.length}`);
  } catch (err) {
    console.error("Generation failed:", err);
    process.exit(1);
  }
})();
