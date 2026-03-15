import Head from "next/head";
import Link from "next/link";
import Footer from "../../components/Footer";
import { ALL_COUNTRIES, COUNTRY_DETAILS } from "../../data/countriesData";

// ---------------------------------------------------------------------------
// Static generation: pre-render one page per country at build time.
// ---------------------------------------------------------------------------

export function getStaticPaths() {
  const paths = ALL_COUNTRIES.map((c) => ({
    params: { "country-code": c.code },
  }));
  return { paths, fallback: false };
}

export function getStaticProps({ params }) {
  const code = params["country-code"];
  const meta = ALL_COUNTRIES.find((c) => c.code === code) || null;
  const details = COUNTRY_DETAILS[code] || null;
  if (!meta) return { notFound: true };
  return { props: { meta, details } };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHeading({ emoji, title }) {
  return (
    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mt-10 mb-4 border-b border-gray-100 pb-2">
      <span>{emoji}</span>
      {title}
    </h2>
  );
}

function KeyFactsTable({ facts }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-sm">
        <tbody>
          {facts.map((fact, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="px-4 py-2.5 font-semibold text-gray-600 w-44 whitespace-nowrap">
                {fact.label}
              </td>
              <td className="px-4 py-2.5 text-gray-800">{fact.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InterestingFacts({ facts }) {
  return (
    <ul className="space-y-3">
      {facts.map((fact, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-teal-500 mt-0.5 text-lg">✦</span>
          <p className="text-gray-700 leading-relaxed text-sm">{fact}</p>
        </li>
      ))}
    </ul>
  );
}

function LandmarksList({ landmarks }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {landmarks.map((lm, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
          <p className="font-semibold text-gray-800 text-sm">📍 {lm.name}</p>
          <p className="text-gray-500 text-xs mt-0.5">{lm.location}</p>
        </div>
      ))}
    </div>
  );
}

// Fallback for countries without detailed content yet
function FallbackContent({ meta }) {
  return (
    <div className="bg-teal-50 border border-teal-100 rounded-2xl p-8 text-center mt-8">
      <div className="text-5xl mb-4">🏗️</div>
      <h3 className="text-lg font-semibold text-teal-800 mb-2">Content Coming Soon</h3>
      <p className="text-teal-700 text-sm">
        Detailed educational content for <strong>{meta.name}</strong> is being prepared. Check back
        soon!
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function CountryDetailPage({ meta, details }) {
  if (!details) {
    return (
      <>
        <Head>
          <title>{meta.name} — Learn About Countries | iiskills Geography</title>
        </Head>
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-3xl mx-auto px-4 py-16">
            <Link
              href="/learn-about-countries"
              className="text-teal-600 hover:underline text-sm font-medium"
            >
              ← Back to all countries
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">
              {meta.emoji} {meta.name}
            </h1>
            <FallbackContent meta={meta} />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { sections } = details;

  return (
    <>
      <Head>
        <title>{details.name} — Learn About Countries | iiskills Geography</title>
        <meta
          name="description"
          content={`Learn about ${details.name}: geography, culture, economy, key facts and famous landmarks.`}
        />
      </Head>

      <main className="min-h-screen bg-gray-50">
        {/* Hero banner */}
        <section className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white py-12 px-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-8">
            {/* Flag */}
            <div className="flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={details.flagUrl}
                alt={details.flagAlt}
                loading="eager"
                width={180}
                height={120}
                className="rounded-lg shadow-lg border-2 border-white/30"
              />
            </div>

            <div>
              <Link
                href="/learn-about-countries"
                className="text-teal-200 hover:text-white text-sm font-medium mb-2 inline-block"
              >
                ← All Countries
              </Link>
              <h1 className="text-4xl font-bold">
                {details.emoji} {details.name}
              </h1>
              <p className="text-teal-100 mt-1 text-lg">{details.continent}</p>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 py-10">
          {/* Overview */}
          <SectionHeading emoji="🌐" title="Overview" />
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
            {details.overview}
          </p>

          {/* Key Facts Table */}
          <SectionHeading emoji="📊" title="Key Facts at a Glance" />
          <KeyFactsTable facts={details.keyFacts} />

          {/* Interesting Facts */}
          <SectionHeading emoji="💡" title="Interesting Facts" />
          <InterestingFacts facts={details.interestingFacts} />

          {/* Geography section */}
          {sections?.geography && (
            <>
              <SectionHeading emoji="🗺️" title="Geography" />
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                {sections.geography}
              </p>
            </>
          )}

          {/* Map embed */}
          <div className="mt-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <iframe
              title={details.mapAlt}
              src={details.mapEmbedUrl}
              width="100%"
              height="350"
              style={{ border: 0, display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts allow-same-origin"
            />
            <p className="text-xs text-gray-400 px-3 py-1.5 bg-gray-50">
              🗺️ {details.mapAlt} — © OpenStreetMap contributors
            </p>
          </div>

          {/* Culture */}
          {sections?.culture && (
            <>
              <SectionHeading emoji="🎭" title="Culture & People" />
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                {sections.culture}
              </p>
            </>
          )}

          {/* Economy */}
          {sections?.economy && (
            <>
              <SectionHeading emoji="💰" title="Economy" />
              <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
                {sections.economy}
              </p>
            </>
          )}

          {/* Landmarks */}
          {sections?.landmarks?.length > 0 && (
            <>
              <SectionHeading emoji="🏛️" title="Famous Landmarks & Places" />
              <LandmarksList landmarks={sections.landmarks} />
            </>
          )}

          {/* Image / attribution note */}
          <p className="mt-8 text-xs text-gray-400 border-t border-gray-100 pt-4">
            {details.imageCredit}
          </p>

          {/* Navigation */}
          <div className="mt-12 flex flex-wrap justify-between gap-4">
            <Link
              href="/learn-about-countries"
              className="inline-flex items-center gap-2 bg-white border border-teal-200 text-teal-700 px-5 py-2.5 rounded-xl font-medium hover:bg-teal-50 transition-colors text-sm"
            >
              ← Back to all countries
            </Link>
            <Link
              href="/curriculum"
              className="inline-flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-teal-700 transition-colors text-sm"
            >
              Explore Geography Curriculum →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
