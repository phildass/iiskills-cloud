/**
 * Testing Mode Banner Component
 * 
 * Displays a prominent "TESTING ONLY" legend in the top right corner of all pages
 * when ADMIN_SETUP_MODE or TEMP_SUSPEND_AUTH feature flags are enabled.
 * 
 * This banner serves as a visual reminder that the application is in a special
 * testing/setup mode and should not be used in production.
 */

import { useEffect, useState } from 'react';

export default function TestingModeBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [authSuspended, setSuspended] = useState(false);
  const [testMode, setTestMode] = useState(false);

  useEffect(() => {
    // Check for various testing/setup modes
    const adminSetupMode = process.env.NEXT_PUBLIC_ADMIN_SETUP_MODE === 'true';
    const tempSuspendAuth = process.env.NEXT_PUBLIC_TEMP_SUSPEND_AUTH === 'true';
    const generalTestMode = process.env.NEXT_PUBLIC_TEST_MODE === 'true';

    setSetupMode(adminSetupMode);
    setSuspended(tempSuspendAuth);
    setTestMode(generalTestMode);
    
    // Show banner if any testing mode is active
    setShowBanner(adminSetupMode || tempSuspendAuth || generalTestMode);

    // Console warnings for developers
    if (adminSetupMode) {
      console.warn('⚠️ ADMIN_SETUP_MODE is enabled - First-time admin setup is available');
    }
    if (tempSuspendAuth) {
      console.warn('⚠️ TEMP_SUSPEND_AUTH is enabled - Authentication checks are suspended');
    }
    if (generalTestMode) {
      console.warn('⚠️ TEST_MODE is enabled - All paywalls and auth checks are bypassed');
    }
  }, []);

  if (!showBanner) {
    return null;
  }

  return (
    <div 
      className="fixed top-4 right-4 z-[9999] pointer-events-auto"
      style={{ zIndex: 99999 }} // Ensure it's above everything
    >
      <div className="bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg shadow-2xl border-2 border-yellow-600 animate-pulse">
        <div className="flex items-center gap-2">
          <svg 
            className="w-5 h-5" 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="text-sm">TESTING ONLY</span>
        </div>
        {setupMode && (
          <div className="text-xs mt-1 opacity-90">
            Admin Setup Mode
          </div>
        )}
        {authSuspended && (
          <div className="text-xs mt-1 opacity-90">
            Auth Suspended
          </div>
        )}
        {testMode && !setupMode && !authSuspended && (
          <div className="text-xs mt-1 opacity-90">
            Test Mode Active
          </div>
        )}
      </div>
    </div>
  );
}
