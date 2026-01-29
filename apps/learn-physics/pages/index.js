import LandingPage from "../../../components/shared/LandingPage";

export default function Home() {
  return (
    <LandingPage
      appName="physics"
      appTitle="Learn Physics"
      appDescription="Understand the fundamental laws of nature and physical phenomena"
      showRegistration={true}
      isFree={false}
      ctaText="Explore Physics"
      features={[
        {
          icon: "⚛️",
          title: "Core Physics",
          description: "Master fundamental physics principles from mechanics to modern physics.",
        },
        {
          icon: "🔭",
          title: "Practical Understanding",
          description: "Connect theory with real-world applications and experiments.",
        },
        {
          icon: "📊",
          title: "Problem Solving",
          description: "Develop analytical skills through comprehensive problem-solving practice.",
        }
      ]}
    />
  );
}
