"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-math"
      appName="Master Mathematics"
      title="Master Mathematics - iiskills.cloud"
      description="Build strong mathematical foundations from arithmetic to advanced calculus with step-by-step lessons and practice."
      features={[
        {
                "emoji": "🔢",
                "title": "Core Concepts",
                "description": "Master algebra, geometry, and trigonometry"
        },
        {
                "emoji": "📐",
                "title": "Problem Solving",
                "description": "Develop analytical and logical thinking skills"
        },
        {
                "emoji": "∞",
                "title": "Advanced Math",
                "description": "Explore calculus, statistics, and more"
        }
]}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
