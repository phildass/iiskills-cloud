"use client";

import PaidAppLandingPage from "../../../components/shared/PaidAppLandingPage";

export default function Home() {
  return (
    <PaidAppLandingPage
      appId="learn-management"
      appName="Learn Management"
      headline="Transform Your Leadership Skills 🚀"
      subheadline="Master proven management techniques used by Fortune 500 companies. Build your career with real-world business strategies."
      title="Master Management Principles - iiskills.cloud"
      description="Learn core management concepts, techniques, and best practices to excel in business and organizational leadership."
      features={[
  {
    "emoji": "📊",
    "title": "Business Strategy & Planning",
    "description": "Master strategic thinking, market analysis, and competitive positioning. Learn to create actionable business plans that drive results."
  },
  {
    "emoji": "⚙️",
    "title": "Operations Excellence",
    "description": "Optimize workflows, manage resources efficiently, and implement lean methodologies. Build systems that scale."
  },
  {
    "emoji": "📈",
    "title": "Performance Management",
    "description": "Set KPIs, track metrics, and drive continuous improvement. Learn data-driven decision making for business growth."
  },
  {
    "emoji": "👥",
    "title": "Team Leadership",
    "description": "Build high-performing teams, develop talent, and create a culture of excellence. Master communication and motivation strategies."
  },
  {
    "emoji": "💼",
    "title": "Project Management",
    "description": "Deliver projects on time and budget using Agile, Scrum, and traditional methodologies. Master stakeholder management."
  },
  {
    "emoji": "🎯",
    "title": "Change Management",
    "description": "Lead organizational transformation, manage resistance, and drive innovation. Navigate complexity with confidence."
  }
]}
      heroGradient="from-blue-600 to-purple-600"
      sampleModuleId={1}
      sampleLessonId={1}
    />
  );
}
