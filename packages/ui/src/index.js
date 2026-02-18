/**
 * @iiskills/ui - Shared UI Component Library
 * 
 * Central repository for all shared UI components across iiskills.cloud applications.
 * Version: 1.0.0
 * 
 * Usage:
 *   import { Header, Footer, Layout } from '@iiskills/ui';
 *   import { UniversalLogin } from '@iiskills/ui/authentication';
 *   import { SharedNavbar } from '@iiskills/ui/navigation';
 * 
 * Component Categories:
 *   - authentication: Login, Register, Auth checker
 *   - navigation: Navbars, Headers, App switcher
 *   - landing: Landing pages, Hero sections
 *   - payment: Payment prompts, Bundle offers
 *   - content: Lessons, Curriculum, Quizzes
 *   - common: Header, Footer, Layout, 404
 *   - newsletter: Newsletter signup
 *   - translation: Translation features
 *   - ai: AI-powered components
 *   - pwa: PWA features
 */

// Common components (most frequently used)
export { Header, Footer, Layout, GoogleTranslate } from './common';

// Re-export category modules for convenience
// (Apps can also import directly from categories)
export * from './authentication';
export * from './navigation';
export * from './landing';
export * from './payment';
export * from './content';
export * from './newsletter';
export * from './translation';
export * from './ai';
export * from './pwa';

// Global CSS
import './global.css';
