import LandingPage from "../../../components/shared/LandingPage";

export default function Home() {
  return (
    <LandingPage
      appName="chemistry"
      appTitle="Learn Chemistry"
      appDescription="Master chemistry concepts from basics to advanced topics with practical applications"
      showRegistration={true}
      isFree={false}
      ctaText="Start Learning"
      features={[
        {
          icon: "⚗️",
          title: "Core Concepts",
          description: "Comprehensive coverage of fundamental chemistry principles and theories.",
        },
        {
          icon: "🔬",
          title: "Practical Applications",
          description: "Real-world applications and experiments to reinforce learning.",
        },
        {
          icon: "📈",
          title: "Progressive Learning",
          description: "Structured curriculum taking you from basic to advanced chemistry.",
        }
      ]}
    />
  );
}
