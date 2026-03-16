import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Footer from "../../components/Footer";
import { ALL_COUNTRIES } from "../../data/countriesData";

const CONTINENTS = ["All", "Africa", "Asia", "Europe", "North America", "South America", "Oceania"];

export default function LearnAboutCountriesIndex() {
  const [search, setSearch] = useState("");
  const [activeContinent, setActiveContinent] = useState("All");

  const filtered = ALL_COUNTRIES.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesContinent = activeContinent === "All" || c.continent === activeContinent;
    return matchesSearch && matchesContinent;
  });

  return (
    <>
      <Head>
        <title>Learn About Countries — iiskills Geography</title>
        <meta
          name="description"
          content="Explore countries around the world: overview, interesting facts, key data and landmarks for each nation."
        />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Hero */}
        <section className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white py-16 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="text-6xl mb-4">🌍</div>
            <h1 className="text-4xl font-bold mb-4">Learn About Countries</h1>
            <p className="text-xl text-teal-100 mb-8">
              Explore the world one country at a time — discover geography, culture, economy, famous
              landmarks and fascinating facts about every nation.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 text-lg">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search countries…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-300"
              />
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Continent filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {CONTINENTS.map((continent) => (
              <button
                key={continent}
                onClick={() => setActiveContinent(continent)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeContinent === continent
                    ? "bg-teal-600 text-white shadow"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-teal-50 hover:border-teal-300"
                }`}
              >
                {continent}
              </button>
            ))}
          </div>

          {/* Results count */}
          <p className="text-gray-500 text-sm mb-6 text-center">
            Showing {filtered.length} of {ALL_COUNTRIES.length} countries
          </p>

          {/* Country grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">🗺️</div>
              <p className="text-lg">No countries match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtered.map((country) => (
                <Link
                  key={country.code}
                  href={`/learn-about-countries/${country.code}`}
                  className="bg-white rounded-2xl shadow hover:shadow-md border border-gray-100 hover:border-teal-200 p-5 flex flex-col items-center text-center transition-all group"
                >
                  {/* Flag */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://flagcdn.com/w80/${country.code}.png`}
                    alt={`Flag of ${country.name}`}
                    loading="lazy"
                    width={80}
                    className="rounded mb-3 shadow-sm"
                    style={{ width: 80, height: "auto", maxHeight: 56, objectFit: "contain" }}
                  />
                  <span className="text-3xl mb-1">{country.emoji}</span>
                  <h2 className="text-base font-semibold text-gray-800 group-hover:text-teal-700 leading-snug">
                    {country.name}
                  </h2>
                  <span className="mt-1 text-xs text-gray-400">{country.continent}</span>
                  <span className="mt-3 text-xs text-teal-600 font-medium group-hover:underline">
                    Learn more →
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Intro blurb */}
          <div className="mt-16 bg-teal-50 border border-teal-100 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-xl font-semibold text-teal-800 mb-2">Why learn about countries?</h3>
            <p className="text-teal-700 text-sm leading-relaxed">
              Understanding other countries — their geography, culture, economy and history — builds
              global awareness, empathy and critical thinking. Whether you are preparing for exams,
              planning travel or simply curious about the world, this section is your passport to
              knowledge.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
