"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-cricket"
      appName="Master Cricket Skills"
      title="Master Cricket Skills - iiskills.cloud"
      description="Learn cricket techniques, rules, and strategies from basics to advanced gameplay. Perfect for players and enthusiasts."
      features={[
        {
                "emoji": "🏏",
                "title": "Batting Techniques",
                "description": "Master strokes, stance, and shot selection"
        },
        {
                "emoji": "⚡",
                "title": "Bowling Skills",
                "description": "Learn different bowling styles and variations"
        },
        {
                "emoji": "🎯",
                "title": "Game Strategy",
                "description": "Understand match tactics and field placements"
        }
]}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
