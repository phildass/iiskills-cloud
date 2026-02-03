/**
 * SharedHero Component Tests
 * 
 * Tests for hero image mapping using manifest system
 */

import { getHeroImageForApp } from '../components/shared/SharedHero';

describe('SharedHero - Hero Image Mapping with Manifest', () => {
  describe('Manifest-based mappings', () => {
    test('returns config object for apps', () => {
      const result = getHeroImageForApp('learn-cricket');
      expect(result).toBeDefined();
      expect(result).toHaveProperty('src');
    });

    test('learn-companion returns null (no hero)', () => {
      const result = getHeroImageForApp('learn-companion');
      expect(result).toBeNull();
    });

    test('config includes remote URL flag', () => {
      const result = getHeroImageForApp('main');
      expect(result).toHaveProperty('isRemote');
      expect(typeof result.isRemote).toBe('boolean');
    });

    test('config includes credit info when available', () => {
      const result = getHeroImageForApp('learn-cricket');
      // Credit may be null or an object
      expect(result).toHaveProperty('credit');
    });
  });

  describe('Fallback behavior', () => {
    test('unknown apps get fallback image', () => {
      const result = getHeroImageForApp('learn-unknown-app');
      expect(result).toBeDefined();
      expect(result.src).toBeDefined();
    });

    test('null appName returns default', () => {
      const result = getHeroImageForApp(null);
      expect(result).toBeDefined();
      expect(result.src).toBeDefined();
    });

    test('undefined appName returns default', () => {
      const result = getHeroImageForApp(undefined);
      expect(result).toBeDefined();
      expect(result.src).toBeDefined();
    });

    test('empty string appName returns default', () => {
      const result = getHeroImageForApp('');
      expect(result).toBeDefined();
      expect(result.src).toBeDefined();
    });
  });

  describe('Deterministic behavior', () => {
    test('same app name returns same config consistently', () => {
      const result1 = getHeroImageForApp('learn-cricket');
      const result2 = getHeroImageForApp('learn-cricket');
      const result3 = getHeroImageForApp('learn-cricket');
      
      expect(result1.src).toBe(result2.src);
      expect(result2.src).toBe(result3.src);
    });

    test('different app names may have different images', () => {
      const apps = ['learn-physics', 'learn-chemistry', 'learn-math'];
      const results = apps.map(app => getHeroImageForApp(app));
      
      // All results should have valid src
      results.forEach(result => {
        expect(result).toBeDefined();
        expect(result.src).toBeDefined();
      });
    });
  });

  describe('Image source validation', () => {
    test('image sources are valid strings', () => {
      const apps = [
        'main', 
        'learn-apt', 
        'learn-management', 
        'learn-cricket',
        'learn-ai',
        'learn-physics',
        'learn-math'
      ];

      apps.forEach(app => {
        const result = getHeroImageForApp(app);
        if (result !== null) {
          expect(typeof result.src).toBe('string');
          expect(result.src.length).toBeGreaterThan(0);
        }
      });
    });

    test('remote URLs are valid HTTP(S) URLs', () => {
      const result = getHeroImageForApp('learn-cricket');
      if (result && result.isRemote && result.src) {
        expect(result.src).toMatch(/^https?:\/\//);
      }
    });

    test('local paths start with /', () => {
      const result = getHeroImageForApp('main');
      if (result && !result.isRemote && result.src) {
        expect(result.src).toMatch(/^\//);
      }
    });
  });

  describe('Credit attribution', () => {
    test('credit object has required fields when present', () => {
      const result = getHeroImageForApp('learn-cricket');
      if (result && result.credit) {
        expect(result.credit).toHaveProperty('sourceName');
        expect(result.credit).toHaveProperty('sourceUrl');
      }
    });
  });
});
