"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-govt-jobs"
      appName="Prepare for Government Jobs"
      title="Prepare for Government Jobs - iiskills.cloud"
      description="Comprehensive preparation for government job exams with practice tests, study materials, and expert guidance."
      features={[
        {
                "emoji": "📚",
                "title": "Exam Preparation",
                "description": "Structured content aligned with major govt exams"
        },
        {
                "emoji": "✍️",
                "title": "Practice Tests",
                "description": "Take mock tests and assess your readiness"
        },
        {
                "emoji": "🎓",
                "title": "Career Guidance",
                "description": "Navigate different govt job opportunities"
        }
]}
      isFree={true}
      heroGradient="from-primary to-accent"
    />
  );
}
