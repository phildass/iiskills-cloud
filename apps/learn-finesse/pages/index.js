"use client";

import Head from "next/head";
import PremiumHero from "../components/PremiumHero";
import TriLevelEngine from "../components/TriLevelEngine";
import BoardroomSimulation from "../components/BoardroomSimulation";
import InteractiveRoleplays from "../components/InteractiveRoleplays";
import PremiumCertification from "../components/PremiumCertification";
import MonorepoCrossSell from "../components/MonorepoCrossSell";

export default function Home() {
  return (
    <>
      <Head>
        <title>Learn Finesse - Master Executive Presence | iiskills Academy</title>
        <meta
          name="description"
          content="Master the invisible mechanics of social intelligence, executive presence, and high-stakes negotiation. The premium finishing school for ambitious leaders."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="bg-gray-900">
        {/* Premium Hero Section */}
        <PremiumHero />

        {/* Tri-Level Finesse Engine */}
        <TriLevelEngine />

        {/* Boardroom Simulation (Gatekeeper) */}
        <div id="gatekeeper">
          <BoardroomSimulation />
        </div>

        {/* Interactive Roleplays */}
        <InteractiveRoleplays />

        {/* Premium Certification */}
        <PremiumCertification />

        {/* Monorepo Cross-Sell */}
        <MonorepoCrossSell />
      </main>
    </>
  );
}
