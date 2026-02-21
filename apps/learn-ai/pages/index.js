"use client";

import { TriLevelLandingPage } from "@iiskills/ui/landing";

export default function Home() {
  return (
    <TriLevelLandingPage
      appId="learn-ai"
      appName="Learn AI"
      headline="Train the Machine. Master the Intelligence."
      subheadline="Don't Just Use AI—Control It. Master the Logic Behind the Machine."
      title="iiskills-ai - Master Artificial Intelligence"
      description="Master AI from prompts to production. Learn prompt engineering, machine learning, neural networks, and AI monetization. Two apps, one mastery—unlock both Learn AI and Learn Developer with a single enrollment."
      features={[
  {
    "emoji": "💎",
    "title": "Two for One Bundle",
    "description": "Unlock BOTH Learn AI and Learn Developer with a single enrollment—master intelligence and code together"
  },
  {
    "emoji": "🤖",
    "title": "Three-Tier AI Mastery",
    "description": "Progress through Basics (Prompting), Intermediate (ML/Neural Nets), and Advanced (Monetization) with AI-generated content"
  },
  {
    "emoji": "🔗",
    "title": "Cross-App Sync",
    "description": "Your progress unlocks related content in Learn Developer—complete shared modules once, benefit twice"
  },
  {
    "emoji": "🧠",
    "title": "Prompt Engineering Mastery",
    "description": "Learn zero-shot, few-shot, chain-of-thought prompting, and context tuning to speak the language of AI"
  },
  {
    "emoji": "🎯",
    "title": "30% Pass-Gate Unlock",
    "description": "Achieve 30% in any module to auto-unlock related Developer content—seamless integration across both platforms"
  },
  {
    "emoji": "⚙️",
    "title": "Logic & Algorithms Bridge",
    "description": "Master shared modules like Logic & Algorithms, Data Structures, and API Management with dual AI/developer perspectives"
  },
  {
    "emoji": "🏆",
    "title": "Universal Certification",
    "description": "Complete both apps to earn the prestigious Universal Technical Lead certificate—validate your mastery across AI and code"
  },
  {
    "emoji": "👨‍🏫",
    "title": "Mentor Mode Unlock",
    "description": "Reach 30% in both apps to activate Mentor Mode and guide fellow learners through their AI journey"
  },
  {
    "emoji": "💰",
    "title": "AI Monetization Strategies",
    "description": "Learn how to build AI products, consulting services, automation tools, and turn AI skills into multiple income streams"
  }
]}
      heroGradient="from-blue-600 to-primary"
      showAIDevBundle={true}
      sampleModuleId={1}
      sampleLessonId={1}
    />
  );
}
