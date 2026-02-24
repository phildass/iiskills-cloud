/**
 * Unit Tests for Access Control Module
 * 
 * Tests all core access control functions:
 * - isFreeApp()
 * - isBundleApp()
 * - requiresPayment()
 * - userHasAccess()
 * - getBundleInfo()
 * - getAppsToUnlock()
 * - getAccessStatus()
 * - hasAccessViaBundle()
 * - getBundleAccessMessage()
 */

import {
  isFreeApp,
  isBundleApp,
  requiresPayment,
  userHasAccess,
  getBundleInfo,
  getAppsToUnlock,
  getAccessStatus,
  hasAccessViaBundle,
  getBundleAccessMessage,
  APPS,
  APP_TYPE,
  BUNDLES,
} from './accessControl.js';

describe('Access Control - Core Functions', () => {
  
  describe('isFreeApp()', () => {
    test('returns true for free apps', () => {
      expect(isFreeApp('learn-apt')).toBe(true);
      expect(isFreeApp('learn-chemistry')).toBe(true);
      expect(isFreeApp('learn-geography')).toBe(true);
      expect(isFreeApp('learn-math')).toBe(true);
      expect(isFreeApp('learn-physics')).toBe(true);
    });
    
    test('returns false for paid apps', () => {
      expect(isFreeApp('learn-ai')).toBe(false);
      expect(isFreeApp('learn-developer')).toBe(false);
      expect(isFreeApp('learn-management')).toBe(false);
      expect(isFreeApp('learn-pr')).toBe(false);
      expect(isFreeApp('main')).toBe(false);
    });
    
    test('returns false for unknown apps', () => {
      expect(isFreeApp('unknown-app')).toBe(false);
    });
    
    test('handles null/undefined gracefully', () => {
      expect(isFreeApp(null)).toBe(false);
      expect(isFreeApp(undefined)).toBe(false);
      expect(isFreeApp('')).toBe(false);
    });
  });

  describe('isBundleApp()', () => {
    test('returns true for bundled apps', () => {
      expect(isBundleApp('learn-ai')).toBe(true);
      expect(isBundleApp('learn-developer')).toBe(true);
    });
    
    test('returns false for non-bundled apps', () => {
      expect(isBundleApp('learn-management')).toBe(false);
      expect(isBundleApp('learn-pr')).toBe(false);
      expect(isBundleApp('learn-math')).toBe(false);
      expect(isBundleApp('main')).toBe(false);
    });
    
    test('returns false for unknown apps', () => {
      expect(isBundleApp('unknown-app')).toBe(false);
    });
  });

  describe('requiresPayment()', () => {
    test('returns true for paid apps', () => {
      expect(requiresPayment('learn-ai')).toBe(true);
      expect(requiresPayment('learn-developer')).toBe(true);
      expect(requiresPayment('learn-management')).toBe(true);
      expect(requiresPayment('learn-pr')).toBe(true);
      expect(requiresPayment('main')).toBe(true);
    });
    
    test('returns false for free apps', () => {
      expect(requiresPayment('learn-apt')).toBe(false);
      expect(requiresPayment('learn-chemistry')).toBe(false);
      expect(requiresPayment('learn-geography')).toBe(false);
      expect(requiresPayment('learn-math')).toBe(false);
      expect(requiresPayment('learn-physics')).toBe(false);
    });
    
    test('fails closed - returns true for unknown apps', () => {
      expect(requiresPayment('unknown-app')).toBe(true);
    });
  });

  describe('getBundleInfo()', () => {
    test('returns bundle info for bundled apps', () => {
      const bundleAI = getBundleInfo('learn-ai');
      expect(bundleAI).toBeDefined();
      expect(bundleAI.id).toBe('ai-developer-bundle');
      expect(bundleAI.apps).toContain('learn-ai');
      expect(bundleAI.apps).toContain('learn-developer');
      expect(bundleAI.apps).toHaveLength(2);
      
      const bundleDev = getBundleInfo('learn-developer');
      expect(bundleDev).toBeDefined();
      expect(bundleDev.id).toBe('ai-developer-bundle');
      expect(bundleDev).toEqual(bundleAI);
    });
    
    test('returns null for non-bundled apps', () => {
      expect(getBundleInfo('learn-management')).toBeNull();
      expect(getBundleInfo('learn-pr')).toBeNull();
      expect(getBundleInfo('learn-math')).toBeNull();
    });
    
    test('bundle has correct pricing', () => {
      const bundle = getBundleInfo('learn-ai');
      expect(bundle.price).toBeDefined();
      expect(bundle.price.introductory).toBe(11682); // Rs 116.82 in paisa
      expect(bundle.price.regular).toBe(35282); // Rs 352.82 in paisa
    });
    
    test('bundle has required properties', () => {
      const bundle = getBundleInfo('learn-ai');
      expect(bundle).toHaveProperty('id');
      expect(bundle).toHaveProperty('name');
      expect(bundle).toHaveProperty('description');
      expect(bundle).toHaveProperty('apps');
      expect(bundle).toHaveProperty('price');
      expect(bundle).toHaveProperty('features');
      expect(bundle).toHaveProperty('highlight');
    });
  });

  describe('getAppsToUnlock()', () => {
    test('returns all apps in bundle for bundled apps', () => {
      const appsAI = getAppsToUnlock('learn-ai');
      expect(appsAI).toContain('learn-ai');
      expect(appsAI).toContain('learn-developer');
      expect(appsAI).toHaveLength(2);
      
      const appsDev = getAppsToUnlock('learn-developer');
      expect(appsDev).toContain('learn-ai');
      expect(appsDev).toContain('learn-developer');
      expect(appsDev).toHaveLength(2);
    });
    
    test('returns single app for non-bundled apps', () => {
      expect(getAppsToUnlock('learn-management')).toEqual(['learn-management']);
      expect(getAppsToUnlock('learn-pr')).toEqual(['learn-pr']);
      expect(getAppsToUnlock('main')).toEqual(['main']);
    });
    
    test('returns single app for free apps', () => {
      expect(getAppsToUnlock('learn-math')).toEqual(['learn-math']);
    });
  });

  describe('userHasAccess()', () => {
    test('allows access to free apps without user', () => {
      expect(userHasAccess(null, 'learn-math')).toBe(true);
      expect(userHasAccess(null, 'learn-physics')).toBe(true);
      expect(userHasAccess(null, 'learn-chemistry')).toBe(true);
    });
    
    test('denies access to paid apps without user', () => {
      expect(userHasAccess(null, 'learn-ai')).toBe(false);
      expect(userHasAccess(null, 'learn-developer')).toBe(false);
      expect(userHasAccess(null, 'learn-management')).toBe(false);
    });
    
    test('allows access with valid app_access record', () => {
      const user = {
        id: 'user-123',
        app_access: [
          { app_id: 'learn-ai', is_active: true, expires_at: null },
        ],
      };
      expect(userHasAccess(user, 'learn-ai')).toBe(true);
    });
    
    test('denies access without app_access record', () => {
      const user = {
        id: 'user-123',
        app_access: [
          { app_id: 'learn-ai', is_active: true, expires_at: null },
        ],
      };
      expect(userHasAccess(user, 'learn-developer')).toBe(false);
    });
    
    test('denies access with inactive record', () => {
      const user = {
        id: 'user-123',
        app_access: [
          { app_id: 'learn-ai', is_active: false, expires_at: null },
        ],
      };
      expect(userHasAccess(user, 'learn-ai')).toBe(false);
    });
    
    test('denies access with expired record', () => {
      const pastDate = new Date('2020-01-01').toISOString();
      const user = {
        id: 'user-123',
        app_access: [
          { app_id: 'learn-ai', is_active: true, expires_at: pastDate },
        ],
      };
      expect(userHasAccess(user, 'learn-ai')).toBe(false);
    });
    
    test('allows access with future expiration', () => {
      const futureDate = new Date('2030-01-01').toISOString();
      const user = {
        id: 'user-123',
        app_access: [
          { app_id: 'learn-ai', is_active: true, expires_at: futureDate },
        ],
      };
      expect(userHasAccess(user, 'learn-ai')).toBe(true);
    });
    
    test('handles missing app_access array', () => {
      const user = { id: 'user-123' };
      expect(userHasAccess(user, 'learn-ai')).toBe(false);
    });
  });

  describe('getAccessStatus()', () => {
    test('returns all free apps for unauthenticated user', () => {
      const status = getAccessStatus(null);
      expect(status.freeApps).toContain('learn-apt');
      expect(status.freeApps).toContain('learn-chemistry');
      expect(status.freeApps).toContain('learn-geography');
      expect(status.freeApps).toContain('learn-math');
      expect(status.freeApps).toContain('learn-physics');
      expect(status.freeApps).toHaveLength(5);
      expect(status.accessibleApps).toEqual(status.freeApps);
      expect(status.totalAccess).toBe(5);
    });
    
    test('includes paid apps for authenticated user with access', () => {
      const user = {
        id: 'user-123',
        app_access: [
          { app_id: 'learn-ai', is_active: true, expires_at: null, granted_via: 'payment' },
          { app_id: 'learn-developer', is_active: true, expires_at: null, granted_via: 'bundle' },
        ],
      };
      const status = getAccessStatus(user);
      expect(status.accessibleApps).toContain('learn-ai');
      expect(status.accessibleApps).toContain('learn-developer');
      expect(status.totalAccess).toBe(7); // 5 free + 2 paid
    });
    
    test('tracks bundle access correctly', () => {
      const user = {
        id: 'user-123',
        app_access: [
          { app_id: 'learn-ai', is_active: true, expires_at: null, granted_via: 'payment' },
          { app_id: 'learn-developer', is_active: true, expires_at: null, granted_via: 'bundle' },
        ],
      };
      const status = getAccessStatus(user);
      expect(status.bundleAccess).toHaveProperty('ai-developer-bundle');
      const bundle = status.bundleAccess['ai-developer-bundle'];
      expect(bundle.apps).toContain('learn-ai');
      expect(bundle.apps).toContain('learn-developer');
      expect(bundle.purchasedApp).toBe('learn-ai');
      expect(bundle.unlockedApps).toContain('learn-developer');
    });
    
    test('filters expired access', () => {
      const pastDate = new Date('2020-01-01').toISOString();
      const user = {
        id: 'user-123',
        app_access: [
          { app_id: 'learn-ai', is_active: true, expires_at: pastDate },
        ],
      };
      const status = getAccessStatus(user);
      expect(status.accessibleApps).not.toContain('learn-ai');
    });
  });

  describe('hasAccessViaBundle()', () => {
    test('returns true for bundle-granted access', () => {
      const user = {
        id: 'user-123',
        app_access: [
          { app_id: 'learn-developer', is_active: true, granted_via: 'bundle' },
        ],
      };
      expect(hasAccessViaBundle(user, 'learn-developer')).toBe(true);
    });
    
    test('returns false for payment-granted access', () => {
      const user = {
        id: 'user-123',
        app_access: [
          { app_id: 'learn-ai', is_active: true, granted_via: 'payment' },
        ],
      };
      expect(hasAccessViaBundle(user, 'learn-ai')).toBe(false);
    });
    
    test('returns false without access', () => {
      const user = {
        id: 'user-123',
        app_access: [],
      };
      expect(hasAccessViaBundle(user, 'learn-ai')).toBe(false);
    });
  });

  describe('getBundleAccessMessage()', () => {
    test('returns congratulatory message for bundle access', () => {
      const message = getBundleAccessMessage('learn-developer', 'learn-ai');
      expect(message).toContain('Learn-Developer');
      expect(message).toContain('Learn-AI');
      expect(message).toContain('🎉');
    });
    
    test('returns empty string for non-bundled app', () => {
      const message = getBundleAccessMessage('learn-management', 'learn-management');
      expect(message).toBe('');
    });
  });
});

describe('Access Control - Configuration', () => {
  
  describe('APPS constant', () => {
    test('contains all 10 active apps', () => {
      const appIds = Object.keys(APPS);
      expect(appIds).toHaveLength(10);
      expect(appIds).toContain('main');
      expect(appIds).toContain('learn-ai');
      expect(appIds).toContain('learn-developer');
      expect(appIds).toContain('learn-management');
      expect(appIds).toContain('learn-pr');
      expect(appIds).toContain('learn-apt');
      expect(appIds).toContain('learn-chemistry');
      expect(appIds).toContain('learn-geography');
      expect(appIds).toContain('learn-math');
      expect(appIds).toContain('learn-physics');
    });
    
    test('each app has required properties', () => {
      Object.values(APPS).forEach(app => {
        expect(app).toHaveProperty('id');
        expect(app).toHaveProperty('name');
        expect(app).toHaveProperty('type');
        expect(app).toHaveProperty('bundleId');
        expect(app).toHaveProperty('price');
      });
    });
    
    test('has exactly 5 free apps', () => {
      const freeApps = Object.values(APPS).filter(app => app.type === APP_TYPE.FREE);
      expect(freeApps).toHaveLength(5);
    });
    
    test('has exactly 5 paid apps', () => {
      const paidApps = Object.values(APPS).filter(app => app.type === APP_TYPE.PAID);
      expect(paidApps).toHaveLength(5);
    });
  });

  describe('BUNDLES constant', () => {
    test('contains AI-Developer bundle', () => {
      expect(BUNDLES).toHaveProperty('ai-developer-bundle');
      const bundle = BUNDLES['ai-developer-bundle'];
      expect(bundle.apps).toEqual(['learn-ai', 'learn-developer']);
    });
    
    test('bundle has correct pricing structure', () => {
      const bundle = BUNDLES['ai-developer-bundle'];
      expect(bundle.price).toHaveProperty('introductory');
      expect(bundle.price).toHaveProperty('regular');
      expect(typeof bundle.price.introductory).toBe('number');
      expect(typeof bundle.price.regular).toBe('number');
    });
    
    test('bundle has marketing properties', () => {
      const bundle = BUNDLES['ai-developer-bundle'];
      expect(bundle).toHaveProperty('name');
      expect(bundle).toHaveProperty('description');
      expect(bundle).toHaveProperty('features');
      expect(bundle).toHaveProperty('highlight');
      expect(Array.isArray(bundle.features)).toBe(true);
    });
  });

  describe('App Configuration Consistency', () => {
    test('bundled apps reference correct bundle ID', () => {
      expect(APPS['learn-ai'].bundleId).toBe('ai-developer-bundle');
      expect(APPS['learn-developer'].bundleId).toBe('ai-developer-bundle');
    });
    
    test('non-bundled apps have null bundleId', () => {
      expect(APPS['learn-management'].bundleId).toBeNull();
      expect(APPS['learn-pr'].bundleId).toBeNull();
      expect(APPS['main'].bundleId).toBeNull();
    });
    
    test('bundled apps have null individual price', () => {
      expect(APPS['learn-ai'].price).toBeNull();
      expect(APPS['learn-developer'].price).toBeNull();
    });
    
    test('free apps are not bundled', () => {
      const freeApps = Object.values(APPS).filter(app => app.type === APP_TYPE.FREE);
      freeApps.forEach(app => {
        expect(app.bundleId).toBeNull();
        expect(app.price).toBeNull();
      });
    });
  });
});

describe('Access Control - Edge Cases', () => {
  
  test('handles user with empty app_access array', () => {
    const user = { id: 'user-123', app_access: [] };
    expect(userHasAccess(user, 'learn-ai')).toBe(false);
    const status = getAccessStatus(user);
    expect(status.totalAccess).toBe(5); // Only free apps
  });
  
  test('handles malformed user object', () => {
    expect(userHasAccess({}, 'learn-ai')).toBe(false);
    expect(userHasAccess({ id: null }, 'learn-ai')).toBe(false);
  });
  
  test('handles case sensitivity', () => {
    // App IDs should be lowercase
    expect(isFreeApp('Learn-Math')).toBe(false);
    expect(isFreeApp('LEARN-MATH')).toBe(false);
  });
  
  test('consistent behavior across related functions', () => {
    // If an app is free, it should not require payment
    const freeAppIds = ['learn-apt', 'learn-chemistry', 'learn-geography', 'learn-math', 'learn-physics'];
    freeAppIds.forEach(appId => {
      expect(isFreeApp(appId)).toBe(true);
      expect(requiresPayment(appId)).toBe(false);
    });
  });
  
  test('bundle consistency', () => {
    // Both bundle apps should return same bundle info
    const bundleAI = getBundleInfo('learn-ai');
    const bundleDev = getBundleInfo('learn-developer');
    expect(bundleAI).toEqual(bundleDev);
    
    // Both should unlock same apps
    const appsAI = getAppsToUnlock('learn-ai');
    const appsDev = getAppsToUnlock('learn-developer');
    expect(appsAI).toEqual(appsDev);
  });
});
