"use client";

import { UniversalLandingPage } from "@iiskills/ui/landing";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-math"
      appName="Master the Language of Mathematics 📐"
      headline="Unlock the Language of Logic"
      subheadline="Master mathematics from foundational arithmetic to advanced calculus. The Architect's Path awaits."
      title="iiskills-math - Master Mathematics"
      description="Build unshakeable mathematical foundations from basic arithmetic to advanced calculus. Step-by-step lessons, practice problems, and real-world applications that make math intuitive and engaging."
      features={[
  {
    "emoji": "🔢",
    "title": "Core Algebra & Geometry",
    "description": "Master essential algebra, geometric principles, and trigonometry with visual learning tools and interactive exercises"
  },
  {
    "emoji": "📐",
    "title": "Problem Solving Mastery",
    "description": "Develop analytical thinking, logical reasoning, and strategic problem-solving techniques applicable beyond mathematics"
  },
  {
    "emoji": "∞",
    "title": "Calculus & Analysis",
    "description": "Explore limits, derivatives, integrals, and the foundations of mathematical analysis and change"
  },
  {
    "emoji": "📊",
    "title": "Statistics & Probability",
    "description": "Learn data analysis, statistical inference, probability theory, and data-driven decision making"
  },
  {
    "emoji": "🎲",
    "title": "Discrete Mathematics",
    "description": "Study logic, set theory, combinatorics, and the mathematical foundations of computer science"
  },
  {
    "emoji": "🧮",
    "title": "Applied Mathematics",
    "description": "Connect mathematical concepts to real-world scenarios in engineering, finance, science, and technology"
  }
]}
      isFree={true}
      heroGradient="from-red-700 to-black"
    />
  );
}
