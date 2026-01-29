import LandingPage from "../../../components/shared/LandingPage";

export default function Home() {
  return (
    <LandingPage
      appName="cricket"
      appTitle="Cricket Know-All"
      appDescription="Your free cricket knowledge and games portal—quizzes, stats, history, events, and more!"
      showRegistration={true}
      isFree={true}
      ctaText="Explore Knowledge Portal"
      features={[
        {
          icon: "🏏",
          title: "Cricket Knowledge",
          description:
            "Explore cricket rules, techniques, and fundamentals—from basics to advanced concepts, all in one free portal.",
        },
        {
          icon: "📊",
          title: "Games & Quizzes",
          description:
            "Test your knowledge with interactive quizzes, match strategies, and tactical challenges.",
        },
        {
          icon: "🏆",
          title: "Stats & History",
          description:
            "Dive into cricket's rich history, legendary players, memorable matches, and fascinating records.",
        },
      ]}
    />
  );
}
