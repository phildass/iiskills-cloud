"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-chemistry"
      appName="Discover the Magic of Chemistry 🧪"
      headline="Decode the Ingredients of Reality"
      subheadline="Explore the atomic world from basic elements to complex reactions. The Elemental Path unveils."
      title="iiskills-chemistry - Master Chemistry Concepts"
      description="Build a comprehensive understanding of chemistry from atomic structure to complex reactions. Interactive lessons, virtual labs, and real-world applications that bring the molecular world to life."
      features={[
  {
    "emoji": "⚗️",
    "title": "Chemical Reactions & Kinetics",
    "description": "Understand reaction mechanisms, rates, equilibrium, and the dynamic processes that drive chemical transformations"
  },
  {
    "emoji": "🔬",
    "title": "Laboratory Techniques",
    "description": "Learn proper experimental methods, safety protocols, analytical techniques, and hands-on laboratory skills"
  },
  {
    "emoji": "📊",
    "title": "Periodic Table Mastery",
    "description": "Master element properties, periodic trends, electron configurations, and the organization of matter"
  },
  {
    "emoji": "⚛️",
    "title": "Atomic & Molecular Structure",
    "description": "Explore atomic theory, bonding, molecular geometry, and the fundamental building blocks of matter"
  },
  {
    "emoji": "🌡️",
    "title": "Thermochemistry & Energetics",
    "description": "Study energy changes, enthalpy, entropy, thermodynamic laws, and the energy landscape of reactions"
  },
  {
    "emoji": "💧",
    "title": "Organic & Biochemistry",
    "description": "Discover carbon compounds, functional groups, biomolecules, and the chemistry of living systems"
  }
]}
      isFree={true}
      heroGradient="from-purple-600 to-gray-800"
    />
  );
}
