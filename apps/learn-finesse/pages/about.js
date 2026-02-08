import Head from "next/head";

export default function About() {
  return (
    <>
      <Head>
        <title>About - Learn Finesse | iiskills.cloud</title>
        <meta
          name="description"
          content="Learn about Learn Finesse - your digital finishing school for global etiquette and professional polish"
        />
      </Head>
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-primary mb-6 text-center">About Learn Finesse</h1>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <p className="text-lg text-charcoal leading-relaxed mb-4">
            <strong>Learn Finesse</strong> is your digital "global finishing school" for mastering modern, cross-cultural etiquette, soft skills, and professional polish.
          </p>
          <p className="text-lg text-charcoal leading-relaxed">
            Designed for ambitious individuals and global talent, this app delivers an immersive 10-Day Bootcamp across Western, Indian, and Eastern contexts—bridging knowledge with global industry demands.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">🎯 Our Mission</h2>
            <p className="leading-relaxed mb-4">
              To deliver a modular, actionable, and culturally-sensitive digital finishing school—for free.
            </p>
            <p className="leading-relaxed">
              We make sophisticated cross-cultural training accessible to learners, professionals, graduates, and career advancers globally.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-600 to-rose-700 text-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">🌟 What You'll Master</h2>
            <p className="leading-relaxed mb-4">
              Five core modules spanning personal branding, communication artistry, global table etiquette, career acceleration, and modern digital finesse.
            </p>
            <p className="leading-relaxed">
              Each module incorporates Western, Indian, and Eastern perspectives through real-world scenarios and branching logic tests.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-charcoal mb-4">🌍 The Curriculum</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Module 1: The Internal Blueprint</h3>
              <p className="text-gray-700">Personal branding, grooming standards, and digital image management.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Module 2: The Communication Suite</h3>
              <p className="text-gray-700">Verbal artistry, active listening, and emotional intelligence across cultures.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Module 3: The Global Table & Social Grace</h3>
              <p className="text-gray-700">Dining etiquette and networking protocols from Western to Eastern contexts.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Module 4: The Career Accelerator</h3>
              <p className="text-gray-700">STAR/STAR-P interviews, resume optimization, and managing up strategies.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Module 5: The Modern Finesse Factor</h3>
              <p className="text-gray-700">Digital ethics, AI etiquette, and cultural resilience in the modern workplace.</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
