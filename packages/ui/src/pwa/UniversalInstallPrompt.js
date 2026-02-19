"use client";

import { useState, useEffect } from "react";

// Note: When using this component, ensure APPS config is imported from @iiskills/access-control
// or passed as a prop if the consuming app doesn't have access to that package

/**
 * UniversalInstallPrompt Component
 * 
 * Universal PWA install prompt that works across all iiskills apps.
 * Features:
 * - Detects current app context
 * - Shows install button when PWA is installable
 * - Handles cross-app download recommendations
 * - Supports Mother App promotion from mini-apps
 * - Provides app-specific messaging
 * 
 * @param {string} currentAppId - ID of the current app (e.g., 'main', 'learn-ai')
 * @param {string} currentAppName - Display name of current app (fallback if APPS not available)
 * @param {boolean} showMotherAppPromo - Show "Download Mother App" option in mini-apps
 * @param {string} variant - Display variant: 'button' | 'banner' | 'card'
 * @param {string} size - Button size: 'sm' | 'md' | 'lg'
 */
export default function UniversalInstallPrompt({ 
  currentAppId = "main",
  currentAppName = "iiskills.cloud",
  showMotherAppPromo = true,
  variant = "button",
  size = "md"
}) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  const isMotherApp = currentAppId === "main";

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check if app is already installed
    if (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // iOS doesn't support beforeinstallprompt, so we show manual instructions
    if (iOS) {
      // On iOS, always show the install option (unless already installed)
      setShowInstallButton(true);
      return;
    }

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      // Show iOS instructions
      setShowIOSInstructions(true);
      return;
    }

    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Clear the deferredPrompt for reuse
    setDeferredPrompt(null);

    if (outcome === "accepted") {
      setShowInstallButton(false);
      setIsInstalled(true);
    }
  };

  const handleMotherAppClick = () => {
    // Navigate to main app
    if (typeof window !== "undefined") {
      window.location.href = "https://iiskills.cloud";
    }
  };

  // Don't show anything if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show install button if not installable and not iOS
  if (!showInstallButton && !isIOS) {
    return null;
  }

  // Size classes
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  // iOS Instructions Modal
  if (showIOSInstructions) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-gray-900">Install {currentAppName}</h3>
            <button 
              onClick={() => setShowIOSInstructions(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4 text-gray-700">
            <p className="font-semibold">To install this app on your iPhone/iPad:</p>
            <ol className="list-decimal list-inside space-y-3 ml-2">
              <li>
                Tap the <strong>Share</strong> button 
                <svg className="inline w-5 h-5 mx-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z"/>
                </svg>
                at the bottom of Safari
              </li>
              <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
              <li>Tap <strong>"Add"</strong> in the top right corner</li>
            </ol>
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              💡 After installation, you can launch {currentAppName} directly from your home screen!
            </p>
          </div>
          
          <button
            onClick={() => setShowIOSInstructions(false)}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Got it!
          </button>
        </div>
      </div>
    );
  }

  // Button variant
  if (variant === "button") {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={handleInstallClick}
          className={`inline-flex items-center justify-center gap-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-lg ${sizeClasses[size]}`}
          aria-label={`Install ${currentAppName} app`}
        >
          <svg
            className={iconSizeClasses[size]}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {isIOS ? "Add to Home Screen" : `Install ${currentAppName}`}
        </button>

        {/* Show Mother App promotion in mini-apps */}
        {!isMotherApp && showMotherAppPromo && (
          <button
            onClick={handleMotherAppClick}
            className={`inline-flex items-center justify-center gap-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg ${sizeClasses[size]}`}
            aria-label="Download Mother App"
          >
            <svg
              className={iconSizeClasses[size]}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Get Full App Suite
          </button>
        )}
      </div>
    );
  }

  // Banner variant
  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <div>
              <h3 className="font-bold text-lg">Install {currentAppName}</h3>
              <p className="text-sm opacity-90">
                {isIOS ? "Add to your home screen for quick access" : "Get the app experience with offline access"}
              </p>
            </div>
          </div>
          <button
            onClick={handleInstallClick}
            className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50 transition flex-shrink-0"
          >
            {isIOS ? "Show Instructions" : "Install Now"}
          </button>
        </div>

        {!isMotherApp && showMotherAppPromo && (
          <div className="mt-3 pt-3 border-t border-green-500 border-opacity-30">
            <button
              onClick={handleMotherAppClick}
              className="text-sm underline hover:text-green-100 transition"
            >
              🏠 Or get the complete iiskills.cloud Mother App with all courses
            </button>
          </div>
        )}
      </div>
    );
  }

  // Card variant
  if (variant === "card") {
    return (
      <div className="bg-white border-2 border-green-600 rounded-lg p-6 shadow-lg">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Install {currentAppName}
            </h3>
            <p className="text-gray-600">
              {isIOS 
                ? "Add to your home screen for instant access anytime, anywhere"
                : "Install the app for a better experience with offline access and faster performance"
              }
            </p>
          </div>

          <button
            onClick={handleInstallClick}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-lg"
          >
            {isIOS ? "Show Install Instructions" : "Install App"}
          </button>

          {!isMotherApp && showMotherAppPromo && (
            <div className="pt-4 border-t">
              <button
                onClick={handleMotherAppClick}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
              >
                🏠 Get the complete Mother App with all courses →
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}
