"use client";

import { useState, useEffect } from "react";

/**
 * AptitudeAnalysis
 *
 * Generates a ~100-word performance summary after an aptitude test.
 * The analysis covers:
 *   - Overall performance level
 *   - Domain/category strengths and weaknesses
 *   - Time efficiency observation
 *   - Actionable improvement suggestions
 *
 * This is a client-side rules-based engine that produces personalised,
 * human-readable analysis without requiring an external AI API.
 *
 * Props:
 *   @param {number} score          - Raw correct answers count
 *   @param {number} total          - Total questions count
 *   @param {number} [timeTaken]    - Seconds taken (optional)
 *   @param {string} [testName]     - Name of the test (e.g. "Numerical Ability")
 *   @param {object} [domainScores] - Map of domainName → percentage (0-100)
 *   @param {string} [className]    - Extra CSS classes for the container
 */
export default function AptitudeAnalysis({
  score,
  total,
  timeTaken,
  testName = "Aptitude",
  domainScores = {},
  className = "",
}) {
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Small delay to simulate "thinking" and improve UX
    const timeout = setTimeout(() => {
      setAnalysis(generateAnalysis({ score, total, timeTaken, testName, domainScores }));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timeout);
  }, [score, total, timeTaken, testName, domainScores]);

  if (loading) {
    return (
      <div
        className={`rounded-2xl bg-gradient-to-br from-violet-900/60 to-indigo-900/60 border border-violet-500/30 p-6 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl animate-pulse">🤖</span>
          <h3 className="text-lg font-bold text-white">Generating your AI analysis…</h3>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-violet-700/40 rounded-full animate-pulse w-full" />
          <div className="h-3 bg-violet-700/40 rounded-full animate-pulse w-5/6" />
          <div className="h-3 bg-violet-700/40 rounded-full animate-pulse w-4/5" />
          <div className="h-3 bg-violet-700/40 rounded-full animate-pulse w-full" />
          <div className="h-3 bg-violet-700/40 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-violet-900/60 to-indigo-900/60 border border-violet-500/30 p-6 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">🤖</span>
        <h3 className="text-lg font-bold text-white">AI Performance Analysis</h3>
        <span className="ml-auto text-xs text-violet-400 bg-violet-900/40 px-2 py-0.5 rounded-full">
          ~100 words
        </span>
      </div>
      <p className="text-violet-100 leading-relaxed text-sm">{analysis}</p>
    </div>
  );
}

// ─── Internal analysis engine ────────────────────────────────────────────────

function generateAnalysis({ score, total, timeTaken, testName, domainScores }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const level = performanceLevel(pct);
  const timeNote = buildTimeNote(timeTaken, total);
  const domainNote = buildDomainNote(domainScores, testName);
  const suggestion = buildSuggestion(pct, domainScores, testName);

  return [
    `Your ${testName} result shows a ${level.label} performance at ${pct}% (${score}/${total} correct).`,
    level.opening,
    domainNote,
    timeNote,
    suggestion,
  ]
    .filter(Boolean)
    .join(" ");
}

function performanceLevel(pct) {
  if (pct >= 85)
    return {
      label: "outstanding",
      opening:
        "You demonstrate strong command across question categories with consistent accuracy.",
    };
  if (pct >= 70)
    return {
      label: "good",
      opening: "You showed solid reasoning skills with only a few areas needing attention.",
    };
  if (pct >= 50)
    return {
      label: "moderate",
      opening: "Your performance is average — there is clear room to push toward the 70%+ range.",
    };
  if (pct >= 30)
    return {
      label: "developing",
      opening:
        "You are in the building phase; targeted practice on weak areas will yield quick gains.",
    };
  return {
    label: "early-stage",
    opening:
      "Don't be discouraged — consistent daily practice for even 20 minutes will significantly improve your scores.",
  };
}

// ─── Time-per-question thresholds (seconds) ──────────────────────────────────
const EXCELLENT_PACE_THRESHOLD = 30; // ≤30s/question = excellent pace
const REASONABLE_PACE_THRESHOLD = 60; // ≤60s/question = reasonable pace
const TARGET_PACE = 45; // target for improvement

function buildTimeNote(timeTaken, total) {
  if (!timeTaken || timeTaken <= 0) return "";
  const perQ = Math.round(timeTaken / total);
  if (perQ <= EXCELLENT_PACE_THRESHOLD)
    return "Your pace was excellent — you answered each question in about " + perQ + " seconds on average.";
  if (perQ <= REASONABLE_PACE_THRESHOLD)
    return (
      "Time management was reasonable at roughly " +
      perQ +
      " seconds per question; aim for under " +
      TARGET_PACE +
      " seconds as you improve."
    );
  return (
    "You spent around " +
    perQ +
    " seconds per question — working on speed will help you complete full tests comfortably within time limits."
  );
}

function buildDomainNote(domainScores, testName) {
  const entries = Object.entries(domainScores);
  if (entries.length === 0) return "";

  const sorted = entries.sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];

  if (entries.length === 1) {
    const [domain, pct] = top;
    if (pct >= 70) return `${domain} is a clear strength — keep sharpening it.`;
    return `${domain} needs more practice; focus on core concepts first.`;
  }

  const strengthText =
    top[1] >= 70
      ? `Your strongest area is ${top[0]} (${top[1]}%)`
      : `Your relatively best area is ${top[0]} (${top[1]}%)`;

  const weakText =
    bottom[1] < 50
      ? `, while ${bottom[0]} (${bottom[1]}%) needs the most attention`
      : `, and ${bottom[0]} (${bottom[1]}%) has room for improvement`;

  return strengthText + weakText + ".";
}

function buildSuggestion(pct, domainScores, testName) {
  const entries = Object.entries(domainScores);
  const weakAreas = entries.filter(([, p]) => p < 50).map(([d]) => d);

  if (weakAreas.length > 0) {
    return `Actionable next step: revisit ${weakAreas.slice(0, 2).join(" and ")} fundamentals, then retake this test to track your progress.`;
  }
  if (pct < 70) {
    return `Actionable next step: practice timed mock tests daily to boost both accuracy and speed toward the 70%+ benchmark.`;
  }
  return `Actionable next step: challenge yourself with harder difficulty levels and aim to maintain this accuracy under tighter time constraints.`;
}
