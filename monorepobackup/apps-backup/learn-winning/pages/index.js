"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-winning"
      appName="Master Winning Mindset"
      title="Master Winning Mindset - iiskills.cloud"
      description="Build mental toughness, positive habits, and success strategies to achieve your personal and professional goals."
      features={[
        {
          emoji: "🎯",
          title: "Goal Setting",
          description: "Learn to set and achieve ambitious goals",
        },
        {
          emoji: "💪",
          title: "Mental Toughness",
          description: "Build resilience and overcome challenges",
        },
        {
          emoji: "🏆",
          title: "Success Habits",
          description: "Develop daily practices of high achievers",
        },
      ]}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
