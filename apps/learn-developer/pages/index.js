"use client";

import { PaidAppLandingPage } from "@iiskills/ui/landing";

export default function Home() {
  return (
    <PaidAppLandingPage
      appId="learn-developer"
      appName="Learn Developer"
      headline="Code the Future. Train the Machine."
      subheadline="Stop Guessing. Start Building. The Path to Senior Engineer."
      title="iiskills-developer - Master Software Development"
      description="Master the complete developer stack from fundamentals to production. Learn web development, backend systems, APIs, and integrate seamlessly with AI. Two apps, one mastery—unlock both Learn Developer and Learn AI with a single enrollment."
      features={[
  {
    "emoji": "💎",
    "title": "Two for One Bundle",
    "description": "Unlock BOTH Learn Developer and Learn AI with a single enrollment—master code and intelligence together"
  },
  {
    "emoji": "⚡",
    "title": "Three-Tier Mastery Path",
    "description": "Progress through Basics, Intermediate, and Advanced levels with AI-generated lessons, exercises, and deep-dive explanations"
  },
  {
    "emoji": "🔗",
    "title": "Cross-App Sync",
    "description": "Your progress unlocks related content in Learn AI—complete shared modules once, benefit twice"
  },
  {
    "emoji": "🌐",
    "title": "Full-Stack Development",
    "description": "Master HTML, CSS, JavaScript, React, Node.js, databases, APIs, deployment, and production-ready architectures"
  },
  {
    "emoji": "🎯",
    "title": "30% Pass-Gate Unlock",
    "description": "Achieve 30% in any module to auto-unlock related AI content—seamless integration across both platforms"
  },
  {
    "emoji": "🧠",
    "title": "Logic & Algorithms Bridge",
    "description": "Master shared modules like Logic & Algorithms, Data Structures, and API Management with dual developer/AI perspectives"
  },
  {
    "emoji": "🏆",
    "title": "Universal Certification",
    "description": "Complete both apps to earn the prestigious Universal Technical Lead certificate—validate your mastery across code and AI"
  },
  {
    "emoji": "👨‍🏫",
    "title": "Mentor Mode Unlock",
    "description": "Reach 30% in both apps to activate Mentor Mode and help fellow learners on their journey"
  },
  {
    "emoji": "💻",
    "title": "Production-Ready Skills",
    "description": "Build real applications with JWT auth, CI/CD pipelines, security best practices, and scalable architectures"
  }
]}
      heroGradient="from-cyan-500 via-blue-600 to-cyan-400"
      showAIDevBundle={true}
      sampleModuleId={1}
      sampleLessonId={1}
    />
  );
}
