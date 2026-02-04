"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-developer"
      appName="Web Developer Bootcamp"
      title="Web Developer Bootcamp - Become a Proficient Web Developer | iiskills.cloud"
      description="Master web development from HTML to deployment. Learn React, Node.js, databases, and DevOps. Build apps that can make you reap big!"
      features={[
  {
    "emoji": "🌐",
    "title": "Full-Stack Mastery",
    "description": "Learn frontend and backend development from scratch"
  },
  {
    "emoji": "⚛️",
    "title": "Modern Technologies",
    "description": "React, Node.js, Express, SQL, NoSQL, and more"
  },
  {
    "emoji": "🚀",
    "title": "Deploy with Confidence",
    "description": "Master deployment, JWT security, and CI/CD pipelines"
  },
  {
    "emoji": "🎯",
    "title": "Rapid-Fire Testing",
    "description": "Test your knowledge with instant feedback quizzes"
  },
  {
    "emoji": "🏆",
    "title": "Earn Certificates",
    "description": "Get certified on completion or honors for excellence"
  },
  {
    "emoji": "💻",
    "title": "Clean Code Labs",
    "description": "Learn with practical, industry-standard code examples"
  }
]}
      isFree={false}
      heroGradient="from-primary to-accent"
    />
  );
}
