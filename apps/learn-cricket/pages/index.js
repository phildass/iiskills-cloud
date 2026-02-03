"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-cricket"
      appName="Cricket University"
      title="Cricket University - Everything you want to know. Live on your phone! Free!"
      description="Everything you want to know. Live on your phone! Free! Explore cricket's rich history, master techniques, test your knowledge, and join a global community of cricket enthusiasts."
      metaDescription="Cricket University - Your ultimate free cricket knowledge portal. Learn batting & bowling techniques, game strategies, cricket history, live updates, trivia, stats, and more. Everything cricket, anytime, anywhere!"
      features={[
  {
    "emoji": "🏏",
    "title": "Master the Game",
    "description": "Learn batting techniques, bowling styles, fielding strategies, and game tactics from basics to advanced levels"
  },
  {
    "emoji": "📚",
    "title": "Rich Cricket History",
    "description": "Explore legendary players, historic matches, World Cup moments, and cricket's evolution across eras"
  },
  {
    "emoji": "🎯",
    "title": "Interactive Quizzes",
    "description": "Test your cricket knowledge with fun quizzes, trivia challenges, and competitive games"
  },
  {
    "emoji": "📊",
    "title": "Stats & Records",
    "description": "Dive into comprehensive statistics, player records, team rankings, and match analyses"
  },
  {
    "emoji": "🌍",
    "title": "Global Coverage",
    "description": "Follow international cricket, domestic leagues, tournaments, and live updates from around the world"
  },
  {
    "emoji": "💯",
    "title": "100% Free Access",
    "description": "All content, features, and updates completely free - just register to save your progress and personalize your experience"
  }
]}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
