"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-management"
      appName="Master Management Principles"
      title="Master Management Principles - iiskills.cloud"
      description="Learn core management concepts, techniques, and best practices to excel in business and organizational leadership."
      features={[
  {
    "emoji": "📊",
    "title": "Business Strategy",
    "description": "Understand strategic planning and execution"
  },
  {
    "emoji": "⚙️",
    "title": "Operations",
    "description": "Master process optimization and resource management"
  },
  {
    "emoji": "📈",
    "title": "Performance",
    "description": "Learn metrics, KPIs, and performance improvement"
  }
]}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
