"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-ai"
      appName="Master Artificial Intelligence"
      title="Master Artificial Intelligence - iiskills.cloud"
      description="Transform your career with comprehensive AI training. Learn AI fundamentals to advanced techniques and discover multiple earning opportunities."
      features={[
        {
                "emoji": "🤖",
                "title": "AI Fundamentals",
                "description": "Master the core concepts and technologies powering artificial intelligence"
        },
        {
                "emoji": "🧠",
                "title": "Machine Learning",
                "description": "Build and deploy machine learning models that solve real-world problems"
        },
        {
                "emoji": "💼",
                "title": "Career Growth",
                "description": "Open doors to high-paying AI careers and consulting opportunities"
        }
]}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
