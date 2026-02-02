"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-leadership"
      appName="Develop Leadership Skills"
      title="Develop Leadership Skills - iiskills.cloud"
      description="Build essential leadership capabilities to inspire teams, drive change, and achieve organizational success."
      features={[
        {
                "emoji": "👥",
                "title": "Team Management",
                "description": "Learn to build and lead high-performing teams"
        },
        {
                "emoji": "💡",
                "title": "Strategic Thinking",
                "description": "Develop vision and strategic planning skills"
        },
        {
                "emoji": "🗣️",
                "title": "Communication",
                "description": "Master effective communication and influence"
        }
]}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
