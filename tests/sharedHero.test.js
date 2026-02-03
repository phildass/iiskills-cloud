/**
 * SharedHero Component Tests
 * 
 * Tests for deterministic hero image mapping
 */

import { getHeroImageForApp } from '../components/shared/SharedHero';

describe('SharedHero - Hero Image Mapping', () => {
  describe('Specific app mappings', () => {
    test('main app returns main-hero.jpg', () => {
      const result = getHeroImageForApp('main');
      expect(result).toBe('main-hero.jpg');
    });

    test('learn-apt returns little-girl.jpg', () => {
      const result = getHeroImageForApp('learn-apt');
      expect(result).toBe('little-girl.jpg');
    });

    test('learn-management returns girl-hero.jpg', () => {
      const result = getHeroImageForApp('learn-management');
      expect(result).toBe('girl-hero.jpg');
    });

    test('learn-cricket returns cricket1.jpg (deterministic)', () => {
      const result = getHeroImageForApp('learn-cricket');
      expect(result).toBe('cricket1.jpg');
    });

    test('learn-companion returns null (no hero)', () => {
      const result = getHeroImageForApp('learn-companion');
      expect(result).toBeNull();
    });
  });

  describe('Shared pool mappings', () => {
    test('learn-ai returns image from shared pool', () => {
      const result = getHeroImageForApp('learn-ai');
      expect(result).toMatch(/^hero[123]\.jpg$/);
    });

    test('learn-physics returns image from shared pool', () => {
      const result = getHeroImageForApp('learn-physics');
      expect(result).toMatch(/^hero[123]\.jpg$/);
    });

    test('learn-math returns image from shared pool', () => {
      const result = getHeroImageForApp('learn-math');
      expect(result).toMatch(/^hero[123]\.jpg$/);
    });

    test('unknown app returns image from shared pool', () => {
      const result = getHeroImageForApp('learn-unknown');
      expect(result).toMatch(/^hero[123]\.jpg$/);
    });
  });

  describe('Deterministic behavior', () => {
    test('same app name returns same image consistently', () => {
      const result1 = getHeroImageForApp('learn-ai');
      const result2 = getHeroImageForApp('learn-ai');
      const result3 = getHeroImageForApp('learn-ai');
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });

    test('different app names may return different images', () => {
      // While not guaranteed, different apps should potentially get different images
      // We just ensure the function is stable for each app
      const apps = ['learn-physics', 'learn-chemistry', 'learn-geography'];
      const results = apps.map(app => getHeroImageForApp(app));
      
      // All results should be valid hero images
      results.forEach(result => {
        expect(result).toMatch(/^hero[123]\.jpg$/);
      });
    });
  });

  describe('Edge cases', () => {
    test('null appName returns default hero', () => {
      const result = getHeroImageForApp(null);
      expect(result).toMatch(/^hero[123]\.jpg$/);
    });

    test('undefined appName returns default hero', () => {
      const result = getHeroImageForApp(undefined);
      expect(result).toMatch(/^hero[123]\.jpg$/);
    });

    test('empty string appName returns default hero', () => {
      const result = getHeroImageForApp('');
      expect(result).toMatch(/^hero[123]\.jpg$/);
    });
  });

  describe('All expected images are valid filenames', () => {
    test('all returned images are valid .jpg files', () => {
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
          expect(result).toMatch(/^[\w-]+\.jpg$/);
        }
      });
    });
  });
});
