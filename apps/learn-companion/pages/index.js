"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-companion"
      appName="Master Life Skills"
      title="Master Life Skills - iiskills.cloud"
      description="Get helpful life advice and master essential life skills with your AI companion. Build better habits, improve productivity, and achieve your goals."
      features={[
        {
          emoji: "💭",
          title: "AI Life Advisor",
          description:
            "Get personalized advice and actionable insights for any life situation",
        },
        {
          emoji: "🎯",
          title: "Goal Achievement",
          description:
            "Learn strategies to set and achieve meaningful personal and professional goals",
        },
        {
          emoji: "🌱",
          title: "Personal Growth",
          description:
            "Develop essential life skills for continuous self-improvement and success",
        },
      ]}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
