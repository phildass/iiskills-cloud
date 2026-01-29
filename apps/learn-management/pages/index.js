import LandingPage from "../../../components/shared/LandingPage";

export default function Home() {
  return (
    <LandingPage
      appName="management"
      appTitle="Learn Management"
      appDescription="Master business management principles and practices for career advancement"
      showRegistration={true}
      isFree={false}
      ctaText="Master Management"
      features={[
        {
          icon: "💼",
          title: "Business Fundamentals",
          description: "Core management principles and business administration concepts.",
        },
        {
          icon: "📊",
          title: "Operations Management",
          description: "Learn to optimize processes, resources, and organizational efficiency.",
        },
        {
          icon: "🎯",
          title: "Strategic Management",
          description: "Develop skills in planning, organizing, and executing business strategies.",
        }
      ]}
    />
  );
}
