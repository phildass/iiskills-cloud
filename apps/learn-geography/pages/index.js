import LandingPage from "../../../components/shared/LandingPage";

export default function Home() {
  return (
    <LandingPage
      appName="geography"
      appTitle="Learn Geography"
      appDescription="Explore world geography, physical features, cultures, and global interconnections"
      showRegistration={true}
      isFree={false}
      ctaText="Explore Geography"
      features={[
        {
          icon: "🌍",
          title: "World Geography",
          description: "Study continents, countries, and their unique geographical characteristics.",
        },
        {
          icon: "🗺️",
          title: "Physical Geography",
          description: "Understand landforms, climate patterns, and natural phenomena.",
        },
        {
          icon: "🏛️",
          title: "Cultural Geography",
          description: "Learn about diverse cultures, civilizations, and human geography.",
        }
      ]}
    />
  );
}
