"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, Check, ChevronRight } from "lucide-react";

interface Category {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const availableCategories: Category[] = [
  {
    id: "education",
    title: "Education",
    description: "Assess your educational aptitude and learning capacity",
    icon: "📚",
  },
  {
    id: "talents-skills",
    title: "Talents & Skills",
    description: "Evaluate your natural talents and developed skills",
    icon: "⭐",
  },
  {
    id: "interests",
    title: "Interests",
    description: "Explore your areas of interest and passion",
    icon: "❤️",
  },
  {
    id: "cognitive-abilities",
    title: "Cognitive Abilities",
    description: "Test your cognitive and mental processing abilities",
    icon: "🧠",
  },
  {
    id: "career-goals",
    title: "Career Goals",
    description: "Align your aptitudes with potential career paths",
    icon: "🎯",
  },
];

export default function SelectCategoriesPage() {
  const router = useRouter();
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const handleContinue = () => {
    if (selectedCategories.size > 0) {
      // Store selected categories in sessionStorage
      sessionStorage.setItem("selected-categories", JSON.stringify(Array.from(selectedCategories)));
      // Navigate to brief test
      router.push("/brief-test");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">Learnapt</span>
            </Link>
            <span className="text-sm text-slate-500 dark:text-slate-400">Select Categories</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Introduction */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your Aptitude Areas
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Select the categories you&apos;d like to be assessed on. You can choose one or more areas to customize your test experience.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {availableCategories.map((category) => {
            const isSelected = selectedCategories.has(category.id);
            return (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
                    : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 shadow-md"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isSelected ? "text-blue-900 dark:text-blue-100" : "text-slate-900 dark:text-white"
                }`}>
                  {category.title}
                </h3>
                <p className={`text-sm ${
                  isSelected ? "text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-400"
                }`}>
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selection Summary */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                {selectedCategories.size === 0
                  ? "No categories selected"
                  : `${selectedCategories.size} ${selectedCategories.size === 1 ? "category" : "categories"} selected`}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {selectedCategories.size === 0
                  ? "Select at least one category to continue"
                  : "Ready to start your personalized aptitude test"}
              </p>
            </div>
            <button
              onClick={handleContinue}
              disabled={selectedCategories.size === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedCategories.size === 0
                  ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
              }`}
            >
              Continue
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Your selected categories will help us tailor the assessment to your needs. 
            You can modify your selection at any time by returning to this page.
          </p>
        </div>
      </main>
    </div>
  );
}
