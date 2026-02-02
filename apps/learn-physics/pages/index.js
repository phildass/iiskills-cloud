"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-physics"
      appName="Understand Physics Principles"
      title="Understand Physics Principles - iiskills.cloud"
      description="Explore the fundamental laws of nature through interactive physics lessons covering mechanics, energy, and modern physics."
      features={[
        {
                "emoji": "⚛️",
                "title": "Classical Mechanics",
                "description": "Master motion, forces, and energy principles"
        },
        {
                "emoji": "💡",
                "title": "Electricity & Magnetism",
                "description": "Understand electromagnetic phenomena"
        },
        {
                "emoji": "🌌",
                "title": "Modern Physics",
                "description": "Explore quantum mechanics and relativity"
        }
]}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
