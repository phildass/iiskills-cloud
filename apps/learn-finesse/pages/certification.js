import Head from "next/head";

export default function Certification() {
  return (
    <>
      <Head>
        <title>Skill Badges - Learn Finesse | iiskills.cloud</title>
        <meta name="description" content="Earn skill badges and track your cross-cultural confidence" />
      </Head>
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text finesse-gradient mb-4">
            Skill Badges & Confidence Scores
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Track your progress with visual badges and confidence scores. No formal certification—
            just real skills and cultural versatility.
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-pink-50 rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Complete Lessons</h3>
              <p className="text-gray-600">
                Work through the 10-day bootcamp at your own pace
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">✅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Pass Scenarios</h3>
              <p className="text-gray-600">
                Navigate branching logic tests with cultural awareness
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Earn Badges</h3>
              <p className="text-gray-600">
                Collect skill badges and build your confidence score
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Skill Badges</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-indigo-200 rounded-lg p-6 hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">🌍</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Personal Brand Master</h3>
                  <p className="text-sm text-gray-600">Complete Module 1: Internal Blueprint</p>
                </div>
              </div>
              <div className="bg-indigo-50 rounded p-3 text-sm text-gray-700">
                Master personal branding, grooming, and digital presence across cultures
              </div>
            </div>

            <div className="border-2 border-pink-200 rounded-lg p-6 hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">💬</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Communication Artist</h3>
                  <p className="text-sm text-gray-600">Complete Module 2: Communication Suite</p>
                </div>
              </div>
              <div className="bg-pink-50 rounded p-3 text-sm text-gray-700">
                Excel in verbal artistry, active listening, and cross-cultural dialogue
              </div>
            </div>

            <div className="border-2 border-purple-200 rounded-lg p-6 hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">🍽️</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Global Table Expert</h3>
                  <p className="text-sm text-gray-600">Complete Module 3: Global Table</p>
                </div>
              </div>
              <div className="bg-purple-50 rounded p-3 text-sm text-gray-700">
                Navigate dining etiquette and networking from West to East
              </div>
            </div>

            <div className="border-2 border-blue-200 rounded-lg p-6 hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">🎯</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Career Accelerator</h3>
                  <p className="text-sm text-gray-600">Complete Module 4: Career Module</p>
                </div>
              </div>
              <div className="bg-blue-50 rounded p-3 text-sm text-gray-700">
                Master STAR-P interviews and cultural workplace navigation
              </div>
            </div>

            <div className="border-2 border-green-200 rounded-lg p-6 hover:shadow-lg transition-all">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">✨</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Digital Finesse Pro</h3>
                  <p className="text-sm text-gray-600">Complete Module 5: Modern Finesse</p>
                </div>
              </div>
              <div className="bg-green-50 rounded p-3 text-sm text-gray-700">
                Excel in digital ethics, AI etiquette, and modern professionalism
              </div>
            </div>

            <div className="border-2 border-gold rounded-lg p-6 hover:shadow-lg transition-all bg-gradient-to-br from-yellow-50 to-amber-50">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">👑</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Global Finesse Master</h3>
                  <p className="text-sm text-gray-600">Complete all 10 days + Final Synthesis</p>
                </div>
              </div>
              <div className="bg-amber-100 rounded p-3 text-sm text-gray-700 font-semibold">
                Ultimate badge: Social versatility across all cultural contexts
              </div>
            </div>
          </div>
        </div>

        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-gray-600 mb-6">
            Begin the 10-day bootcamp and start earning your skill badges today.
          </p>
          <button className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold py-3 px-8 rounded-full hover:shadow-xl transform hover:-translate-y-1 transition-all">
            Start Day 1
          </button>
        </div>
      </main>
    </>
  );
}
