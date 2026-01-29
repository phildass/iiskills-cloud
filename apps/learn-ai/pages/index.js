import LandingPage from "../../../components/shared/LandingPage";

export default function Home() {
  return (
    <LandingPage
      appName="ai"
      appTitle="Learn AI"
      appDescription="Explore Artificial Intelligence fundamentals, applications, and prepare for the AI-driven future"
      showRegistration={true}
      isFree={false}
      ctaText="Continue Learning"
      features={[
        {
          icon: "📚",
          title: "Comprehensive Content",
          description: "Structured learning modules designed by experts to take you from beginner to advanced.",
        },
        {
          icon: "🎯",
          title: "Practical Skills",
          description: "Hands-on exercises and real-world applications you can use immediately.",
        },
        {
          icon: "🏆",
          title: "Certification",
          description: "Earn recognized certificates to showcase your skills and advance your career.",
        }
      ]}
    />
  );
}
