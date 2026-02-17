"use client";

import UniversalLandingPage from "../../../components/shared/UniversalLandingPage";

export default function Home() {
  return (
    <UniversalLandingPage
      appId="learn-biology"
      appName="Unlock the Living Blueprint 🧬"
      headline="Decode the Ingredients of Life"
      subheadline="Explore cellular machinery, biological systems, and genetic codes. From organelles to ecosystems—master the logic of life."
      title="iiskills-biology - Master Biology Concepts"
      description="Build comprehensive understanding of biology from cellular structures to complex ecosystems. Interactive lessons, virtual labs, and real-world applications that bring the living world to life."
      features={[
  {
    "emoji": "🔬",
    "title": "Cell Logic & Structure",
    "description": "Master cellular organelles, membranes, and the power plants of life. Think of mitochondria as your cell's energy factory!"
  },
  {
    "emoji": "🧬",
    "title": "DNA & Genetics",
    "description": "Decode genetic information, inheritance patterns, mutations, and the molecular basis of heredity"
  },
  {
    "emoji": "🫀",
    "title": "Body Systems & Physiology",
    "description": "Explore circulatory, respiratory, nervous systems and how organs work together for homeostasis"
  },
  {
    "emoji": "🌿",
    "title": "Ecology & Ecosystems",
    "description": "Understand food webs, energy flow, biodiversity, and the intricate relationships between organisms"
  },
  {
    "emoji": "🦠",
    "title": "Microbiology & Disease",
    "description": "Study bacteria, viruses, immune responses, and how living organisms defend against pathogens"
  },
  {
    "emoji": "🧪",
    "title": "Biochemistry & Metabolism",
    "description": "Master photosynthesis, cellular respiration, enzymes, and the chemical reactions that power life"
  }
]}
      isFree={true}
      heroGradient="from-green-700 to-green-900"
    />
  );
}
