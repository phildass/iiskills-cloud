"use client";

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

const BIOLOGY_CURRICULUM = {
  appName: "Learn Biology",
  appId: "learn-biology",
  description: "Master biology from cellular structures to complex ecosystems",
  modules: [
    {
      id: 1,
      title: "Cell Logic & Structure",
      tier: "Basic",
      description: "Master cellular organelles, membranes, and the power plants of life",
      lessons: [
        {
          id: 1,
          title: "Introduction to Cells",
          description: "Discover the building blocks of life - prokaryotic and eukaryotic cells",
          isFree: true,
        },
        {
          id: 2,
          title: "Cellular Organelles",
          description: "Explore mitochondria (power plants), nucleus (control center), and more",
        },
        {
          id: 3,
          title: "Cell Membrane & Transport",
          description: "Learn about selective permeability, diffusion, and active transport",
        },
      ],
      gatekeeper: {
        title: "Level 1: Cell Mastery Test",
        description: "Prove your understanding of cellular structures and functions",
      },
    },
    {
      id: 2,
      title: "Body Systems & Physiology",
      tier: "Intermediate",
      description: "Explore how organs work together for homeostasis",
      lessons: [
        {
          id: 1,
          title: "Circulatory System",
          description: "Heart, blood vessels, and the transport of nutrients and oxygen",
        },
        {
          id: 2,
          title: "Respiratory System",
          description: "Gas exchange, breathing mechanisms, and oxygen delivery",
        },
        {
          id: 3,
          title: "Nervous System",
          description: "Neurons, synapses, brain, and information processing",
        },
        {
          id: 4,
          title: "Digestive System",
          description: "Nutrient breakdown, absorption, and metabolism",
        },
      ],
      gatekeeper: {
        title: "Level 2: Systems Integration Test",
        description: "Demonstrate your knowledge of how body systems work together",
      },
    },
    {
      id: 3,
      title: "Genetics & Ecology",
      tier: "Advanced",
      description: "Decode genetic information and understand ecosystems",
      lessons: [
        {
          id: 1,
          title: "DNA & Genetic Code",
          description: "Double helix structure, base pairs, and genetic information storage",
        },
        {
          id: 2,
          title: "Inheritance & Heredity",
          description: "Mendel's laws, Punnett squares, and genetic traits",
        },
        {
          id: 3,
          title: "Evolution & Natural Selection",
          description: "Darwin's theory, adaptation, and species diversification",
        },
        {
          id: 4,
          title: "Ecosystems & Energy Flow",
          description: "Food webs, trophic levels, and ecological relationships",
        },
      ],
      gatekeeper: {
        title: "Level 3: Advanced Biology Test",
        description: "Master genetics, evolution, and ecological principles",
      },
    },
  ],
};

export default function Curriculum() {
  const [expandedModule, setExpandedModule] = useState(null);

  const getTierColor = (tier) => {
    switch (tier) {
      case "Basic":
        return "bg-green-100 text-green-800 border-green-300";
      case "Intermediate":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Advanced":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <>
      <Head>
        <title>Biology Curriculum - Learn Biology | iiskills</title>
        <meta
          name="description"
          content="Explore the complete Learn Biology curriculum with tri-level progression from cells to ecosystems"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              🧬 {BIOLOGY_CURRICULUM.appName} Curriculum
            </h1>
            <p className="text-xl text-gray-700">
              {BIOLOGY_CURRICULUM.description}
            </p>
            <div className="mt-6 inline-flex items-center px-4 py-2 bg-green-100 border-2 border-green-400 rounded-lg">
              <span className="text-2xl mr-2">🟢</span>
              <span className="font-semibold text-green-800">
                Free Forever | Foundation Suite
              </span>
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-6">
            {BIOLOGY_CURRICULUM.modules.map((module) => (
              <div
                key={module.id}
                className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden"
              >
                {/* Module Header */}
                <div
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() =>
                    setExpandedModule(
                      expandedModule === module.id ? null : module.id
                    )
                  }
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-green-600">
                          Module {module.id}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold border-2 ${getTierColor(
                            module.tier
                          )}`}
                        >
                          {module.tier}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {module.title}
                      </h2>
                      <p className="text-gray-600">{module.description}</p>
                    </div>
                    <div className="text-3xl text-gray-400">
                      {expandedModule === module.id ? "−" : "+"}
                    </div>
                  </div>
                </div>

                {/* Module Content */}
                {expandedModule === module.id && (
                  <div className="px-6 pb-6 border-t-2 border-gray-100">
                    {/* Lessons */}
                    <div className="space-y-3 mt-4">
                      {module.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                            {lesson.id}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">
                                {lesson.title}
                              </h3>
                              {lesson.isFree && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                  FREE SAMPLE
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {lesson.description}
                            </p>
                          </div>
                          <Link
                            href={`/modules/${module.id}/lesson/${lesson.id}`}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                          >
                            Start
                          </Link>
                        </div>
                      ))}
                    </div>

                    {/* Gatekeeper */}
                    <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-300 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">🚪</span>
                        <div className="flex-1">
                          <h3 className="font-bold text-amber-900">
                            {module.gatekeeper.title}
                          </h3>
                          <p className="text-sm text-amber-800">
                            {module.gatekeeper.description}
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold">
                          Take Test
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
