"use client";

import { UniversalLandingPage } from "@iiskills/ui/landing";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-physics"
      appName="Unlock the Universe of Physics 🌟"
      headline="Master the Laws of the Universe"
      subheadline="Explore the fundamental forces that govern reality. The Force Path begins here."
      title="iiskills-physics - Master Physics"
      description="Explore the fundamental laws that govern our universe through interactive lessons, real-world applications, and cutting-edge physics concepts. From classical mechanics to quantum theory."
      features={[
  {
    "emoji": "⚛️",
    "title": "Classical Mechanics",
    "description": "Master motion, forces, energy principles, and Newton's laws through interactive simulations and real-world problem solving"
  },
  {
    "emoji": "💡",
    "title": "Electricity & Magnetism",
    "description": "Understand electromagnetic phenomena, circuits, fields, and the forces that power our modern world"
  },
  {
    "emoji": "🌌",
    "title": "Modern Physics",
    "description": "Explore quantum mechanics, relativity, particle physics, and the cutting edge of scientific discovery"
  },
  {
    "emoji": "🔬",
    "title": "Thermodynamics & Energy",
    "description": "Learn heat transfer, energy conservation, entropy, and the laws that govern energy transformation"
  },
  {
    "emoji": "🌊",
    "title": "Waves & Optics",
    "description": "Study wave behavior, light phenomena, interference, diffraction, and electromagnetic radiation"
  },
  {
    "emoji": "🎯",
    "title": "Applied Physics",
    "description": "Bridge theory and practice with engineering applications, experimental design, and problem-solving techniques"
  }
]}
      isFree={true}
      heroGradient="from-blue-500 to-blue-900"
    />
  );
}
