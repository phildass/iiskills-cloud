/**
 * Unified Content Schema for iiskills-cloud Monorepo
 * 
 * This module provides a unified interface for all content types across apps:
 * - Jobs (apps/gov-jobs)
 * - Lessons (apps/exam-prep, apps/general-education)
 * - Tests (apps/aptitude)
 * - Sports content (apps/cricket)
 * - Modules (various apps)
 */

/**
 * Geographic location for content (primarily for gov-jobs)
 */
export interface Location {
  country?: string;
  state?: string;
  district?: string;
}

/**
 * Core content types across all apps
 */
export type ContentType = 'job' | 'lesson' | 'test' | 'module' | 'sports' | 'article' | 'quiz' | 'other';

/**
 * Unified Content Interface - The single source of truth for all content
 * This interface normalizes data from all apps into a consistent structure
 */
export interface UnifiedContent {
  // Core identification
  id: string;
  type: ContentType;
  
  // Content details
  title: string;
  description?: string;
  
  // Metadata for search and filtering
  tags?: string[];
  metadata?: Record<string, any>;
  
  // Geographic data (for gov-jobs)
  location?: Location;
  
  // Time-sensitive data (for jobs, exams, etc.)
  deadline?: string;
  
  // URL to detailed content
  url?: string;
  
  // Source app identifier
  app?: string;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  
  // Status
  status?: 'draft' | 'published' | 'archived';
  
  // Additional app-specific data
  customFields?: Record<string, any>;
}

/**
 * Job-specific interface (extends UnifiedContent)
 */
export interface Job extends UnifiedContent {
  type: 'job';
  company?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  requirements?: string[];
  applicationUrl?: string;
  eligibility?: Record<string, any>;
}

/**
 * Lesson-specific interface (extends UnifiedContent)
 */
export interface Lesson extends UnifiedContent {
  type: 'lesson';
  subject?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // in minutes
  objectives?: string[];
  prerequisites?: string[];
  materials?: Array<{
    type: 'pdf' | 'video' | 'link' | 'document';
    url: string;
    title: string;
  }>;
}

/**
 * Test-specific interface (extends UnifiedContent)
 */
export interface Test extends UnifiedContent {
  type: 'test';
  subject?: string;
  duration?: number; // in minutes
  totalQuestions?: number;
  passingScore?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Module-specific interface (extends UnifiedContent)
 */
export interface Module extends UnifiedContent {
  type: 'module';
  subject?: string;
  lessons?: string[]; // Array of lesson IDs
  tests?: string[]; // Array of test IDs
  order?: number;
}

/**
 * Type guards for runtime type checking
 */
export function isJob(content: UnifiedContent): content is Job {
  return content.type === 'job';
}

export function isLesson(content: UnifiedContent): content is Lesson {
  return content.type === 'lesson';
}

export function isTest(content: UnifiedContent): content is Test {
  return content.type === 'test';
}

export function isModule(content: UnifiedContent): content is Module {
  return content.type === 'module';
}

/**
 * Content collection with pagination
 */
export interface ContentCollection {
  items: UnifiedContent[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Search and filter options
 */
export interface ContentFilters {
  type?: ContentType[];
  tags?: string[];
  apps?: string[];
  location?: Partial<Location>;
  searchQuery?: string;
  status?: UnifiedContent['status'][];
  hasDeadline?: boolean;
}

/**
 * Content manifest for each app
 */
export interface ContentManifest {
  app: string;
  version: string;
  contentTypes: ContentType[];
  items: UnifiedContent[];
  lastUpdated: string;
}

/**
 * Meta-index for centralized content discovery
 */
export interface MetaIndex {
  version: string;
  apps: Array<{
    name: string;
    path: string;
    manifestPath: string;
    contentTypes: ContentType[];
  }>;
  lastUpdated: string;
}
