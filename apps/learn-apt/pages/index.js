import LandingPage from "../../../components/shared/LandingPage";

export default function Home() {
  return (
    <LandingPage
      appName="apt"
      appTitle="Learn Aptitude"
      appDescription="Develop logical reasoning, quantitative aptitude, and analytical skills for competitive exams"
      showRegistration={true}
      isFree={true}
      ctaText="Start Free Course"
      features={[
        {
          icon: "🧮",
          title: "Logical Reasoning",
          description: "Master logical thinking patterns and problem-solving techniques essential for success.",
        },
        {
          icon: "📊",
          title: "Quantitative Aptitude",
          description: "Build strong mathematical and analytical skills for competitive examinations.",
        },
        {
          icon: "🎯",
          title: "Practice Tests",
          description: "Test your knowledge with comprehensive practice sets and mock examinations.",
        }
      ]}
    />
  );
}
