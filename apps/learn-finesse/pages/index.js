"use client";

import PaidAppLandingPage from "../../../components/shared/PaidAppLandingPage";

export default function Home() {
  return (
    <PaidAppLandingPage
      appId="learn-finesse"
      appName="Learn Finesse"
      headline="Master Global Etiquette & Professional Polish ✨"
      subheadline="Your digital finishing school for cross-cultural excellence. Master Western, Indian, and Eastern business etiquette in 10 transformative days."
      title="Learn Finesse - Global Finishing School | iiskills.cloud"
      description="Master modern etiquette, soft skills, and professional polish across Western, Indian, and Eastern cultures. Your 10-day bootcamp to global excellence."
      features={[
        {
          "emoji": "🌍",
          "title": "The Internal Blueprint",
          "description": "Personal branding, grooming standards, and digital image management across three global contexts."
        },
        {
          "emoji": "💬",
          "title": "The Communication Suite",
          "description": "Verbal artistry, active listening, and emotional intelligence. Master the nuances of cross-cultural dialogue."
        },
        {
          "emoji": "🍽️",
          "title": "The Global Table & Social Grace",
          "description": "Dining etiquette and networking protocols. From Western table settings to Eastern bow depths to Indian hierarchy."
        },
        {
          "emoji": "🎯",
          "title": "The Career Accelerator",
          "description": "STAR/STAR-P interviews, resume crafting, and managing up. Adapt your approach for New York, Mumbai, or Tokyo."
        },
        {
          "emoji": "✨",
          "title": "The Modern Finesse Factor",
          "description": "Digital ethics, AI etiquette, and cultural resilience. Navigate the modern professional landscape with confidence."
        },
        {
          "emoji": "📊",
          "title": "Interactive Cultural Pivots",
          "description": "Real-world scenarios with branching logic. Learn when to bow, when to shake hands, when to say 'maybe' means 'no'."
        }
      ]}
      heroGradient="from-indigo-500 via-purple-500 to-pink-500"
      sampleModuleId={1}
      sampleLessonId={1}
    />
  );
}
