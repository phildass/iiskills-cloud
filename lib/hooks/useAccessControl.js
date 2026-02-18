/**
 * Universal Access Control Hook
 * 
 * This hook provides consistent access control across all apps, respecting:
 * - Free vs Paid app types
 * - Bundle logic (learn-ai + learn-developer)
 * - Payment verification
 * - OTP bypass for development
 * 
 * Now powered by @iiskills/access-control package.
 * 
 * Usage in any lesson/curriculum page:
 * 
 * ```javascript
 * import { useAccessControl } from '@/lib/hooks/useAccessControl';
 * 
 * function LessonPage() {
 *   const { hasAccess, loading, user, error } = useAccessControl('learn-ai');
 *   
 *   if (loading) return <LoadingSpinner />;
 *   if (!hasAccess) return <AccessDenied />;
 *   
 *   return <Lesson />;
 * }
 * ```
 */

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser } from '../supabaseClient';
import { APPS } from '../appRegistry';
import { isFreeApp } from '../../packages/access-control';

/**
 * Check if current environment allows open access (for development)
 */
function isOpenAccessEnabled() {
  return process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';
}

/**
 * Universal access control hook
 * 
 * @param {string} appId - App identifier (e.g., 'learn-ai')
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireAuth - Whether to require authentication (default: based on app type)
 * @param {boolean} options.redirectIfNoAccess - Whether to redirect if no access (default: true)
 * @param {string} options.redirectTo - Where to redirect if no access (default: '/payment')
 * @returns {Object} { hasAccess, loading, user, error, appInfo }
 */
export function useAccessControl(appId, options = {}) {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [appInfo, setAppInfo] = useState(null);

  const {
    requireAuth = null, // null = auto-determine based on app type
    redirectIfNoAccess = true,
    redirectTo = '/payment',
  } = options;

  useEffect(() => {
    checkAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  const checkAccess = useCallback(async () => {
    try {
      // Get app configuration
      const app = APPS[appId];
      if (!app) {
        setError(`App ${appId} not found in registry`);
        setLoading(false);
        return;
      }
      
      setAppInfo(app);

      // Check 1: Open access mode (development bypass)
      if (isOpenAccessEnabled()) {
        console.log(`🔓 Open access enabled for ${appId}`);
        setHasAccess(true);
        setLoading(false);
        return;
      }

      // Check 2: FREE apps always have access
      if (isFreeApp(appId)) {
        console.log(`✅ ${appId} is a FREE app - access granted`);
        setHasAccess(true);
        setLoading(false);
        return;
      }

      // Check 3: PAID apps require authentication
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (!currentUser) {
        console.log(`❌ ${appId} is PAID - authentication required`);
        setHasAccess(false);
        setLoading(false);
        
        if (redirectIfNoAccess) {
          router.push('/register');
        }
        return;
      }

      // Check 4: Verify payment/access for paid apps
      try {
        const response = await fetch(`/api/users/check-access?appId=${appId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.hasAccess) {
            console.log(`✅ User has access to ${appId}`);
            if (data.bundledApps && data.bundledApps.length > 0) {
              console.log(`🎉 Bundle access: ${data.bundledApps.join(', ')}`);
            }
            setHasAccess(true);
          } else {
            console.log(`❌ User does NOT have access to ${appId}`);
            setHasAccess(false);
            
            if (redirectIfNoAccess) {
              router.push(redirectTo);
            }
          }
        } else {
          // If API fails, DENY access for security (paid apps should not fail open)
          console.error(`❌ Access check API failed for ${appId} - denying access for security`);
          setHasAccess(false);
          
          if (redirectIfNoAccess) {
            router.push(redirectTo);
          }
        }
      } catch (apiError) {
        console.error('Access check API error:', apiError);
        // If API fails, DENY access for security (paid apps should not fail open)
        console.error(`❌ Access check threw error for ${appId} - denying access for security`);
        setHasAccess(false);
        
        if (redirectIfNoAccess) {
          router.push(redirectTo);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Access control error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [appId, redirectIfNoAccess, redirectTo, router]);

  return {
    hasAccess,
    loading,
    user,
    error,
    appInfo,
    isFree: appInfo?.isFree || false,
    isPaid: appInfo ? !appInfo.isFree : false,
  };
}

/**
 * Simple wrapper component for access-controlled pages
 * 
 * Usage:
 * ```javascript
 * import { AccessControlled } from '@/lib/hooks/useAccessControl';
 * 
 * function MyPage() {
 *   return (
 *     <AccessControlled appId="learn-ai">
 *       <YourContent />
 *     </AccessControlled>
 *   );
 * }
 * ```
 */
export function AccessControlled({ appId, children, loadingComponent, noAccessComponent }) {
  const { hasAccess, loading, error } = useAccessControl(appId);

  if (loading) {
    return loadingComponent || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking access...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-bold mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return noAccessComponent || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-bold mb-4">Access Denied</p>
          <p className="text-gray-600 mb-4">You don't have access to this content.</p>
          <a
            href="/payment"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Get Access
          </a>
        </div>
      </div>
    );
  }

  return children;
}
