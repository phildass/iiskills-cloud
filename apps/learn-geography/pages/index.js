"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-geography"
      appName="Explore World Geography"
      title="Explore World Geography - iiskills.cloud"
      description="Discover the world through comprehensive geography lessons covering physical features, cultures, and global relationships."
      features={[
        {
                "emoji": "🌍",
                "title": "World Regions",
                "description": "Explore continents, countries, and major cities"
        },
        {
                "emoji": "🗺️",
                "title": "Physical Geography",
                "description": "Understand landforms, climate, and natural phenomena"
        },
        {
                "emoji": "🏛️",
                "title": "Cultural Geography",
                "description": "Learn about populations, cultures, and civilizations"
        }
]}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
