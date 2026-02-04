"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-developer"
      appName="Master Web & App Development - Your Gateway to Millions"
      title="Web Developer Bootcamp - Your Gateway to Millions | iiskills.cloud"
      description="Transform your future with professional web and app development skills. In today's digital economy, developers are in unprecedented demand - with millions of websites and apps being built daily, this is your pathway to unlimited earning potential and career freedom."
      features={[
  {
    "emoji": "💰",
    "title": "Gateway to Millions",
    "description": "Join the high-demand field where developers earn 6-figure salaries and freelancers charge premium rates for websites and apps"
  },
  {
    "emoji": "🌐",
    "title": "Full-Stack Mastery",
    "description": "Master both frontend and backend development - become the complete developer that companies desperately need"
  },
  {
    "emoji": "⚛️",
    "title": "Modern Technologies",
    "description": "Learn React, Node.js, Express, SQL, NoSQL, and the latest tools that power today's successful web applications"
  },
  {
    "emoji": "🚀",
    "title": "Production-Ready Skills",
    "description": "Master deployment, security, JWT authentication, and CI/CD pipelines - build apps that scale to millions of users"
  },
  {
    "emoji": "📱",
    "title": "Build Real Apps",
    "description": "Create responsive websites and mobile-ready applications that solve real problems and generate real income"
  },
  {
    "emoji": "💼",
    "title": "Career Transformation",
    "description": "Whether starting fresh or pivoting careers, this course gives you the exact skills that top companies hire for"
  },
  {
    "emoji": "🎯",
    "title": "Project-Based Learning",
    "description": "Build a professional portfolio with real-world projects that demonstrate your expertise to employers and clients"
  },
  {
    "emoji": "🏆",
    "title": "Professional Certification",
    "description": "Earn industry-recognized certificates that validate your skills and boost your credibility in the job market"
  },
  {
    "emoji": "⚡",
    "title": "Lifetime Access",
    "description": "One-time investment for lifetime access to all course materials, updates, and new technologies as they emerge"
  }
]}
      isFree={false}
      heroGradient="from-primary to-accent"
    />
  );
}
