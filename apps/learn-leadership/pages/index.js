import LandingPage from "../../../components/shared/LandingPage";

export default function Home() {
  return (
    <LandingPage
      appName="leadership"
      appTitle="Learn Leadership"
      appDescription="Develop essential leadership skills and management capabilities for professional success"
      showRegistration={true}
      isFree={false}
      ctaText="Become a Leader"
      features={[
        {
          icon: "👥",
          title: "Team Management",
          description: "Learn to lead, motivate, and manage teams effectively in any environment.",
        },
        {
          icon: "💡",
          title: "Strategic Thinking",
          description: "Develop strategic vision and decision-making skills for leadership roles.",
        },
        {
          icon: "🚀",
          title: "Personal Development",
          description: "Build confidence, communication skills, and emotional intelligence.",
        }
      ]}
    />
  );
}
