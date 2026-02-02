"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-pr"
      appName="Master Public Relations"
      title="Master Public Relations - iiskills.cloud"
      description="Learn PR strategies, media relations, and communication skills to build and maintain a positive public image."
      features={[
  {
    "emoji": "📢",
    "title": "Media Relations",
    "description": "Build relationships with press and media outlets"
  },
  {
    "emoji": "✍️",
    "title": "Content Strategy",
    "description": "Create compelling PR campaigns and messages"
  },
  {
    "emoji": "📱",
    "title": "Digital PR",
    "description": "Master social media and online reputation management"
  }
]}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
