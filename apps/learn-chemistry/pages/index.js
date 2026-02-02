"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-chemistry"
      appName="Master Chemistry Concepts"
      title="Master Chemistry Concepts - iiskills.cloud"
      description="Build a strong foundation in chemistry with interactive lessons covering all key topics from basic concepts to advanced principles."
      features={[
  {
    "emoji": "⚗️",
    "title": "Chemical Reactions",
    "description": "Understand reaction mechanisms and chemical processes"
  },
  {
    "emoji": "🔬",
    "title": "Lab Techniques",
    "description": "Learn proper laboratory procedures and safety protocols"
  },
  {
    "emoji": "📊",
    "title": "Periodic Table",
    "description": "Master element properties and periodic trends"
  }
]}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
