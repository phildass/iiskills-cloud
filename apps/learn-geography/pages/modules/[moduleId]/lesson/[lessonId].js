import path from "path";
import fs from "fs";
import { createLoader } from "@iiskills/content-loader";
import { moduleTopics } from "../../../../lib/curriculumGenerator";

// ---------------------------------------------------------------------------
// Static generation: pre-render all 10×10 lesson pages at build time.
// Content is loaded from the filesystem (content/learn-geography/lessons/)
// with a fallback to inline-generated content so every page always renders.
// ---------------------------------------------------------------------------

export async function getStaticPaths() {
  const paths = [];
  for (let moduleId = 1; moduleId <= 30; moduleId++) {
    for (let lessonId = 1; lessonId <= 10; lessonId++) {
      paths.push({
        params: { moduleId: String(moduleId), lessonId: String(lessonId) },
      });
    }
  }
  return { paths, fallback: false };
}

// Quiz banks keyed by `${moduleId}_${lessonId}`. Ensures distinct questions per lesson.
const QUIZ_BANKS = {
  "1_1": [
    {
      question: "What are the two fundamental questions that geography asks?",
      options: [
        "'When?' and 'How?'",
        "'Where?' and 'Why there?'",
        "'Who?' and 'What?'",
        "'How many?' and 'How far?'",
      ],
      correct_answer: 1,
    },
    {
      question: "Which of the following best describes physical geography?",
      options: [
        "The study of human settlement patterns",
        "The study of economic trade routes",
        "The study of Earth's natural systems such as landforms, climate, and ecosystems",
        "The study of political boundaries",
      ],
      correct_answer: 2,
    },
    {
      question: "What is the equator?",
      options: [
        "The line separating the northern and southern hemispheres at 0° latitude",
        "The line at 45° north latitude",
        "The boundary between continents",
        "The prime meridian",
      ],
      correct_answer: 0,
    },
    {
      question: "What is the difference between weather and climate?",
      options: [
        "They are the same thing",
        "Weather refers to short-term atmospheric conditions; climate refers to long-term patterns",
        "Climate is measured daily; weather is measured annually",
        "Weather only occurs in cold regions",
      ],
      correct_answer: 1,
    },
    {
      question: "What is GIS?",
      options: [
        "A type of rock formation",
        "A global trade agreement",
        "Geographic Information Systems — software for capturing and analysing spatial data",
        "A method of measuring rainfall",
      ],
      correct_answer: 2,
    },
  ],
  "1_2": [
    {
      question: "What process is responsible for the formation of the Himalayas?",
      options: [
        "Erosion by glaciers",
        "Collision of the Indian and Eurasian tectonic plates",
        "Volcanic eruption along a rift zone",
        "Deposition of river sediment",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a tectonic plate?",
      options: [
        "A type of rock formation",
        "A large segment of Earth's lithosphere that moves over geological time",
        "A mountain range",
        "An ocean current pattern",
      ],
      correct_answer: 1,
    },
    {
      question: "What are fluvial processes related to?",
      options: ["Volcanic activity", "Wind erosion", "Rivers and water flow", "Glacier movement"],
      correct_answer: 2,
    },
    {
      question: "Why are river deltas among the world's most densely populated regions?",
      options: [
        "They have abundant mineral resources",
        "They have cool climates suitable for farming",
        "Sediment deposition creates highly fertile agricultural land",
        "They are far from earthquake zones",
      ],
      correct_answer: 2,
    },
    {
      question: "What external forces shape Earth's surface?",
      options: [
        "Only tectonic forces",
        "Only volcanic forces",
        "Weathering, erosion and deposition by water, wind, and ice",
        "Gravitational pull of the moon",
      ],
      correct_answer: 2,
    },
  ],
  "1_3": [
    {
      question: "What does the Köppen Climate Classification system divide the world into?",
      options: [
        "3 climate zones",
        "5 major climate zones with multiple subtypes",
        "7 continental zones",
        "10 temperature bands",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the Intertropical Convergence Zone (ITCZ)?",
      options: [
        "A cold ocean current near the poles",
        "A high-pressure belt in temperate regions",
        "A zone near the equator where rising warm air produces the world's highest rainfall",
        "The boundary between the Atlantic and Pacific Oceans",
      ],
      correct_answer: 2,
    },
    {
      question: "How does the Gulf Stream affect Western Europe's climate?",
      options: [
        "It makes Western Europe drier than comparable latitudes",
        "It moderates the climate, making it warmer than comparable latitudes in North America",
        "It causes frequent hurricanes along the European coast",
        "It has no significant effect",
      ],
      correct_answer: 1,
    },
    {
      question: "What is ENSO?",
      options: [
        "A type of soil found in tropical regions",
        "El Niño-Southern Oscillation — Pacific circulation patterns that cause global weather disruption",
        "A mountain weather measurement system",
        "An international climate agreement",
      ],
      correct_answer: 1,
    },
    {
      question: "What primarily drives global atmospheric circulation?",
      options: [
        "Earth's magnetic field",
        "Differential solar heating between the equator and the poles",
        "Ocean tides",
        "Volcanic activity",
      ],
      correct_answer: 1,
    },
  ],
  "1_4": [
    {
      question: "What percentage of the world's population currently lives in cities?",
      options: ["More than 30%", "More than 56%", "More than 75%", "More than 90%"],
      correct_answer: 1,
    },
    {
      question: "What is urbanisation?",
      options: [
        "The process of converting farmland to forest",
        "The movement of populations from rural to urban areas",
        "Building highways between cities",
        "The study of city architecture",
      ],
      correct_answer: 1,
    },
    {
      question: "How many people globally are estimated to live in informal settlements?",
      options: ["About 100 million", "About 500 million", "About one billion", "About 2 billion"],
      correct_answer: 2,
    },
    {
      question: "What is the urban heat island effect?",
      options: [
        "Increased rainfall in coastal cities",
        "Urban areas being significantly warmer than surrounding rural areas due to human activities",
        "The cooling effect of parks in cities",
        "Heat generated by underground transport systems",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the projected share of the global population living in cities by 2050?",
      options: ["About 50%", "About 60%", "About 68%", "About 85%"],
      correct_answer: 2,
    },
  ],
};

// Generic fallback quiz questions rotated by lessonId for variety.
const FALLBACK_QUIZ = [
  {
    question: "What is the largest continent by area?",
    options: ["Africa", "North America", "Asia", "Europe"],
    correct_answer: 2,
  },
  {
    question: "What is the difference between weather and climate?",
    options: [
      "They are the same thing",
      "Weather refers to short-term atmospheric conditions; climate refers to long-term patterns",
      "Climate is measured daily; weather is measured annually",
      "Weather only occurs in cold regions",
    ],
    correct_answer: 1,
  },
  {
    question: "What is a tectonic plate?",
    options: [
      "A type of rock formation",
      "A large segment of Earth's lithosphere that moves over geological time",
      "A mountain range",
      "An ocean current pattern",
    ],
    correct_answer: 1,
  },
  {
    question: "What is the equator?",
    options: [
      "The line separating the northern and southern hemispheres at 0° latitude",
      "The line at 45° north latitude",
      "The boundary between continents",
      "The prime meridian",
    ],
    correct_answer: 0,
  },
  {
    question: "What is urbanization?",
    options: [
      "The process of converting farmland to forest",
      "The movement of populations from rural to urban areas",
      "Building highways between cities",
      "The study of city architecture",
    ],
    correct_answer: 1,
  },
];

function getQuizForLesson(moduleId, lessonId) {
  const key = `${moduleId}_${lessonId}`;
  if (QUIZ_BANKS[key]) return QUIZ_BANKS[key];
  // Rotate the fallback set slightly per lesson so repeated visits feel different
  const offset = (parseInt(lessonId, 10) - 1) % FALLBACK_QUIZ.length;
  return [...FALLBACK_QUIZ.slice(offset), ...FALLBACK_QUIZ.slice(0, offset)];
}

function buildFallbackLesson(moduleId, lessonId) {
  const module = moduleTopics.find((m) => m.id === Number(moduleId));
  const moduleName = module ? module.title : `Module ${moduleId}`;
  return {
    moduleId: Number(moduleId),
    lessonId: Number(lessonId),
    title: `${moduleName} — Lesson ${lessonId}`,
    isFree: Number(lessonId) === 1,
    content: `
      <h2>Module ${moduleId}, Lesson ${lessonId}: ${moduleName}</h2>
      <h3>Introduction</h3>
      <p>Geography is the study of places and the relationships between people and their environments. This lesson covers core topics in <strong>${moduleName}</strong>.</p>
      <h3>Key Concepts</h3>
      <p>Work through the key concepts for <strong>${moduleName} — Lesson ${lessonId}</strong> carefully and attempt the quiz before moving on.</p>
      <h3>Summary</h3>
      <p>You have completed the overview for ${moduleName}, Lesson ${lessonId}. Continue to the next lesson to build on these foundations.</p>
    `,
    quiz: getQuizForLesson(moduleId, lessonId),
  };
}

export async function getStaticProps({ params 

// ---------------------------------------------------------------------------
// Page component — receives pre-rendered lesson data as props.
// Auth check still runs client-side but does NOT block content display.
// ---------------------------------------------------------------------------

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import QuizComponent from "../../../../components/QuizComponent";
import { getCurrentUser } from "../../../../lib/supabaseClient";
import { LessonContent, FallbackImage } from "@iiskills/ui/content";
import { getLessonMedia } from "../../../../data/geographyMedia";

const NO_BADGES_KEY = "learn-geography-noBadges";

/**
 * Renders a lesson media image inline within the lesson body.
 */
function InlineMediaFigure({ photo }) {
  if (!photo) return null;
  return (
    <figure
      style={{
        margin: "1.75rem 0",
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid #c8e6c9",
        background: "#f1f8f1",
      }}
    >
      <FallbackImage
        src={photo.url}
        alt={photo.alt}
        loading="lazy"
        style={{ width: "100%", height: "auto", display: "block", borderRadius: "10px 10px 0 0" }}
      />
      {photo.caption && (
        <figcaption
          style={{
            padding: "0.5rem 0.75rem",
            fontSize: "0.8125rem",
            color: "#4a6741",
            fontStyle: "italic",
          }}
        >
          📷 {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Splits lesson HTML at major section boundaries (<h3>) and inserts
 * lesson-specific images between sections so they appear inline within
 * the body copy rather than as a top panel.
 */
function LessonContentWithInlineMedia({ html, moduleId, lessonId }) {
  if (!html) return null;

  const media = getLessonMedia(moduleId, lessonId);
  const photos = media?.photos || [];

  // Split at <h3> section headings to get major content blocks
  const parts = html.split(/(?=<h3)/);

  return (
    <>
      {parts.map((part, i) => (
        <div key={i}>
          <LessonContent html={part} />
          {photos[i] && <InlineMediaFigure photo={photos[i]} />}
        </div>
      ))}
      {/* Map image (always shown) */}
      {media?.mapUrl && (
        <figure
          style={{
            margin: "1.75rem 0",
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid #c8e6c9",
            background: "#f1f8f1",
          }}
        >
          <FallbackImage
            src={media.mapUrl}
            alt={media.mapAlt}
            loading="lazy"
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              borderRadius: "10px 10px 0 0",
            }}
          />
          <figcaption
            style={{
              padding: "0.5rem 0.75rem",
              fontSize: "0.8125rem",
              color: "#4a6741",
              fontStyle: "italic",
            }}
          >
            🗺️ {media.mapAlt}
          </figcaption>
        </figure>
      )}
    </>
  );
}

export default function LessonPage({ lesson, moduleId, lessonId }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [noBadges, setNoBadges] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  // Load noBadges flag from localStorage on mount
  useEffect(() => {
    try {
      setNoBadges(localStorage.getItem(NO_BADGES_KEY) === "true");
    } catch {
      // localStorage unavailable (SSR or private mode)
    }
  }, []);

  // Reset quiz completion whenever the lesson changes (prevents SPA state bleed
  // when Next.js reuses the same page component without full unmount)
  useEffect(() => {
    setQuizCompleted(false);
  }, [moduleId, lessonId]);

  // Auth check runs in background; never blocks page render.
  useEffect(() => {
    getCurrentUser().then((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const handleQuizComplete = async (passed, score) => {
    setQuizCompleted(passed);

    if (passed) {
      try {
        // Get access token for server-side progress tracking (best-effort)
        let access_token;
        try {
          const { supabase } = await import("../../../../lib/supabaseClient");
          const {
            data: { session },
          } = await supabase.auth.getSession();
          access_token = session?.access_token;
        } catch {
          // Session unavailable — proceed without token
        }
        await fetch("/api/assessments/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            app_id: "learn-geography",
            lesson_id: lessonId,
            module_id: moduleId,
            score: score,
            ...(access_token && { access_token }),
          }),
        });
      } catch (error) {
        console.error("Error saving progress:", error);
      }
    }
  };

  const goToNextLesson = () => {
    const nextLessonId = parseInt(lessonId) + 1;
    if (nextLessonId <= 10) {
      router.push(`/modules/${moduleId}/lesson/${nextLessonId}`);
    } else {
      const nextModuleId = parseInt(moduleId) + 1;
      if (nextModuleId <= 30) {
        router.push(`/modules/${moduleId}/final-test`);
      } else {
        router.push("/curriculum");
      }
    }
  };

  const confirmSkip = () => {
    try {
      localStorage.setItem(NO_BADGES_KEY, "true");
    } catch {
      // localStorage unavailable
    }
    setNoBadges(true);
    setShowSkipDialog(false);
    goToNextLesson();
  };

  return (
    <>
      <Head>
        <title>{lesson.title} - Learn Geography</title>
        <meta
          name="description"
          content={`Learn Geography - Module ${moduleId}, Lesson ${lessonId}`}
        />
      </Head>

      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Skip-mode banner */}
          {noBadges && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3 text-yellow-800 text-sm"
            >
              ⚠️ <strong>You&apos;re in Skip mode.</strong> You can continue without quizzes, but
              you won&apos;t earn badges for this course.
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={() => router.push("/curriculum")}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Curriculum
            </button>
          </div>

          <div className="card mb-8">
            <div className="mb-6">
              <span className="text-sm text-gray-500">Module {moduleId}</span>
              <h1 className="text-3xl font-bold mt-2">{lesson.title}</h1>
            </div>

            {/* Render lesson body with images interspersed between sections */}
            <LessonContentWithInlineMedia
              html={lesson.content}
              moduleId={moduleId}
              lessonId={lessonId}
            />
          </div>

          {lesson.quiz && !quizCompleted && (
            <>
              <QuizComponent
                key={`${moduleId}-${lessonId}`}
                questions={lesson.quiz}
                onComplete={handleQuizComplete}
              />

              {/* Skip quiz button — shown below quiz */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowSkipDialog(true)}
                  className="text-sm text-gray-500 underline hover:text-gray-700"
                >
                  Skip quiz and continue
                </button>
              </div>
            </>
          )}

          {(quizCompleted || noBadges) && (
            <div
              className={`card border-2 ${quizCompleted && !noBadges ? "bg-green-50 border-green-500" : "bg-yellow-50 border-yellow-400"}`}
            >
              {quizCompleted && !noBadges ? (
                <>
                  <h3 className="text-xl font-semibold text-green-800 mb-4">🎉 Quiz Passed!</h3>
                  <p className="text-gray-700 mb-4">
                    Congratulations! You&apos;ve successfully completed this lesson.
                  </p>
                </>
              ) : (
                <p className="text-gray-700 mb-4">Continue to the next lesson.</p>
              )}
              <button onClick={goToNextLesson} className="btn-primary">
                Continue to Next Lesson
              </button>
            </div>
          )}

          {/* Skip confirmation dialog */}
          {showSkipDialog && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="skip-dialog-title"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
                <h2 id="skip-dialog-title" className="text-xl font-semibold mb-3">
                  Skip quizzes?
                </h2>
                <p className="text-gray-700 mb-6">
                  You can continue to the next lesson, but you won&apos;t earn badges for this
                  course. <strong>This cannot be undone.</strong>
                </p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowSkipDialog(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button onClick={confirmSkip} className="btn-primary">
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
