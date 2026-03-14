"use client";

import { TriLevelLandingPage } from "@iiskills/ui/landing";

export default function Home() {
  return (
    <TriLevelLandingPage
      appId="learn-geography"
      appName="Explore Our Interconnected World 🌍"
      headline="Command the Systems of Earth"
      subheadline="Navigate physical and human geography from grids to geopolitics. The Systems Path awaits."
      title="iiskills-geography - Master Geography"
      description="Discover the physical and human dimensions of our planet. Comprehensive lessons covering landforms, climate systems, cultures, and global relationships that shape our interconnected world."
      features={[
        {
          emoji: "🌍",
          title: "World Regions & Nations",
          description:
            "Explore continents, countries, capitals, major cities, and the diverse regions that make up our global community",
        },
        {
          emoji: "🗺️",
          title: "Physical Geography",
          description:
            "Understand landforms, climate patterns, weather systems, ecosystems, and the natural forces shaping Earth",
        },
        {
          emoji: "🏛️",
          title: "Cultural & Human Geography",
          description:
            "Learn about populations, cultures, languages, religions, and the rich tapestry of human civilization",
        },
        {
          emoji: "🌊",
          title: "Environmental & Resources",
          description:
            "Study natural resources, sustainability, environmental challenges, and human-environment interactions",
        },
        {
          emoji: "🏙️",
          title: "Urban & Economic Geography",
          description:
            "Explore urbanization, economic systems, trade networks, and the spatial organization of human activities",
        },
        {
          emoji: "🌐",
          title: "Geopolitics & Global Issues",
          description:
            "Analyze political boundaries, international relations, conflicts, and the forces shaping our modern world",
        },
        {
          emoji: "🏴",
          title: "Learn About Countries",
          description:
            "Explore individual countries — their geography, culture, economy, famous landmarks and fascinating facts",
          link: "/learn-about-countries",
        },
      ]}
      isFree={true}
      heroGradient="from-teal-600 to-primary"
    />
  );
}
