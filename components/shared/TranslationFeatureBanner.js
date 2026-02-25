/**
 * Translation Feature Banner Component
 * 
 * Highlights the multi-language translation feature on homepages.
 * Shows supported languages and encourages users to use the language selector.
 * 
 * Usage: <TranslationFeatureBanner />
 */
export default function TranslationFeatureBanner() {
  const supportedLanguages = [
    { code: 'hi', name: 'Hindi', native: 'हिंदी', speakers: '528M' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা', speakers: '97M' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు', speakers: '95M' },
    { code: 'mr', name: 'Marathi', native: 'मराठी', speakers: '83M' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்', speakers: '79M' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', speakers: '56M' },
    { code: 'ur', name: 'Urdu', native: 'اردو', speakers: '51M' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', speakers: '44M' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', speakers: '38M' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം', speakers: '38M' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', speakers: '33M' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া', speakers: '15M' },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-2xl p-6 md:p-8 my-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
            <span className="text-4xl">🌐</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-2">
            Now Available in 12+ Indian Languages!
          </h2>
          <p className="text-lg md:text-xl opacity-90">
            अब भारतीय भाषाओं में उपलब्ध | Learn in Your Native Language
          </p>
        </div>

        {/* Description */}
        <div className="text-center mb-6">
          <p className="text-base md:text-lg opacity-95 max-w-3xl mx-auto">
            We're committed to democratizing education for all Indians. Access all our learning content 
            in your preferred language using the <strong>Language Selector</strong> in the navigation bar above.
          </p>
        </div>

        {/* Supported Languages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          {supportedLanguages.map((lang) => (
            <div 
              key={lang.code}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/20 transition-all transform hover:scale-105"
            >
              <div className="font-bold text-sm">{lang.name}</div>
              <div className="text-lg my-1">{lang.native}</div>
              <div className="text-xs opacity-75">{lang.speakers} speakers</div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
          <p className="text-sm md:text-base">
            <strong>How to use:</strong> Look for the 
            <span className="mx-2 px-3 py-1 bg-white/20 rounded-md inline-block">
              🌐 Language | भाषा
            </span>
            selector in the navigation bar and choose your preferred language. Your selection will be saved automatically.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 text-center">
          <p className="text-xs opacity-75">
            <strong>Note:</strong> Translations are powered by Google Translate. While we strive for accuracy, 
            some technical terms may not translate perfectly. For critical information, please refer to the English version.
          </p>
        </div>
      </div>
    </div>
  );
}
