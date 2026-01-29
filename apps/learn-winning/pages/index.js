import LandingPage from "../../../components/shared/LandingPage";

export default function Home() {
  return (
    <LandingPage
      appName="winning"
      appTitle="Learn Winning"
      appDescription="Develop winning mindset, strategies, and skills for personal and professional success"
      showRegistration={true}
      isFree={false}
      ctaText="Start Winning"
      features={[
        {
          icon: "🏆",
          title: "Success Mindset",
          description: "Develop the mental frameworks and attitudes that drive achievement.",
        },
        {
          icon: "💪",
          title: "Goal Achievement",
          description: "Learn proven strategies for setting and achieving ambitious goals.",
        },
        {
          icon: "🎯",
          title: "Personal Excellence",
          description: "Build habits and skills that lead to consistent high performance.",
        }
      ]}
    />
  );
}
