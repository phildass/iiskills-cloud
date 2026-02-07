"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-pr"
      appName="Master Public Relations"
      headline="Master the Art of Public Relations ✨"
      subheadline="Build your brand, manage crises, and dominate media coverage. Learn PR strategies from industry experts."
      title="Master Public Relations - iiskills.cloud"
      description="Learn PR strategies, media relations, and communication skills to build and maintain a positive public image."
      features={[
  {
    "emoji": "📢",
    "title": "Media Relations & Pitching",
    "description": "Build powerful relationships with journalists, craft irresistible pitches, and secure top-tier media coverage for your brand."
  },
  {
    "emoji": "✍️",
    "title": "Strategic Communication",
    "description": "Create compelling narratives, press releases, and PR campaigns that capture attention and drive engagement."
  },
  {
    "emoji": "📱",
    "title": "Digital PR & Social Media",
    "description": "Master influencer outreach, social media strategy, and online reputation management. Build viral campaigns."
  },
  {
    "emoji": "🚨",
    "title": "Crisis Management",
    "description": "Handle PR disasters with confidence. Learn rapid response strategies, damage control, and reputation recovery."
  },
  {
    "emoji": "🎤",
    "title": "Public Speaking & Events",
    "description": "Deliver powerful presentations, manage press conferences, and create memorable brand experiences."
  },
  {
    "emoji": "📊",
    "title": "PR Analytics & Measurement",
    "description": "Track media mentions, measure campaign ROI, and demonstrate PR value with data-driven insights."
  }
]}
      isFree={true}
      heroGradient="from-pink-500 to-orange-500"
    />
  );
}
