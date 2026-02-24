/**
 * Translation Disclaimer Component
 * 
 * Displays a disclaimer about the accuracy of automated translations.
 * Used to inform users that translations are provided by Google Translate
 * and may not be 100% accurate.
 * 
 * Usage: <TranslationDisclaimer />
 */
export default function TranslationDisclaimer() {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded-r-lg">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg 
            className="h-5 w-5 text-blue-400" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            Multi-Language Translation Available
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>
              🌐 This website now supports <strong>12+ Indian languages</strong> including Hindi, Tamil, Telugu, Bengali, and more. 
              Use the language selector in the navigation bar to access content in your preferred language.
            </p>
            <p className="mt-2 text-xs text-blue-600">
              <strong>Disclaimer:</strong> Translations are provided automatically by Google Translate. 
              While we strive for accuracy, some technical terms or cultural nuances may not translate perfectly. 
              For critical information, please refer to the original English version. We assume no responsibility for translation errors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
