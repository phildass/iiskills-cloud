import Head from "next/head";

export default function Newsletter() {
  return (
    <>
      <Head>
        <title>Newsletter - Learn Finesse | iiskills.cloud</title>
        <meta name="description" content="Subscribe to Learn Finesse newsletter for global etiquette tips" />
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text finesse-gradient mb-4">
            Finesse Weekly
          </h1>
          <p className="text-xl text-gray-700">
            Weekly insights on cross-cultural etiquette and professional polish
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Stay Polished, Stay Global
            </h2>
            <p className="text-gray-600 mb-6">
              Get weekly tips on navigating cross-cultural business scenarios, latest etiquette
              trends, and real-world case studies from our global community.
            </p>

            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                Subscribe to Finesse Weekly
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4 text-center">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-2">🌍 Global Scenarios</h3>
            <p className="text-sm text-gray-700">
              Real-world etiquette challenges from our community worldwide
            </p>
          </div>
          <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
            <h3 className="text-lg font-bold text-orange-800 mb-2">💡 Expert Tips</h3>
            <p className="text-sm text-gray-700">
              Actionable advice from cross-cultural communication professionals
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
            <h3 className="text-lg font-bold text-purple-800 mb-2">🎯 Quick Wins</h3>
            <p className="text-sm text-gray-700">
              Small changes that make big impressions in any culture
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
