/**
 * Unified Content Schema for iiskills-cloud
 * 
 * This module defines the core data structures for cross-app content discovery
 * and retrieval in the iiskills-cloud educational platform.
 */

/**
 * Content type discriminator
 */
export type ContentType = 'job' | 'lesson' | 'test' | 'module' | 'sports' | 'article' | 'quiz' | 'video' | 'other';

/**
 * Geographic location information for content
 */
export interface Location {
  country?: string;
  state?: string;
  district?: string;
}

/**
 * Unified Content Interface
 * All content across apps should conform to this structure
 */
export interface UnifiedContent {
  /** Unique identifier */
  id: string;
  
  /** Content type discriminator */
  type: ContentType;
  
  /** Human-readable title */
  title: string;
  
  /** Optional description */
  description?: string;
  
  /** Tags for categorization and search */
  tags?: string[];
  
  /** Additional metadata */
  metadata?: Record<string, any>;
  
  /** Geographic location (primarily for jobs) */
  location?: Location;
  
  /** Deadline for time-sensitive content (e.g., job applications) */
  deadline?: string;
  
  /** URL to detailed content */
  url?: string;
  
  /** App identifier (e.g., 'learn-apt', 'learn-govt-jobs') */
  appId?: string;
  
  /** Creation timestamp */
  createdAt?: string;
  
  /** Last update timestamp */
  updatedAt?: string;
}

/**
 * Job-specific content extension
 */
export interface Job extends UnifiedContent {
  type: 'job';
  company?: string;
  employmentType?: 'full-time' | 'part-time' | 'contract' | 'internship' | 'temporary';
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  eligibility?: {
    education?: string[];
    experience?: string;
    age?: {
      min?: number;
      max?: number;
    };
    other?: string[];
  };
  applicationUrl?: string;
  deadline: string;
  location: Location;
}

/**
 * Lesson-specific content extension
 */
export interface Lesson extends UnifiedContent {
  type: 'lesson';
  objectives?: string[];
  prerequisites?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: number; // in minutes
  materials?: Array<{
    type: 'pdf' | 'video' | 'link' | 'document';
    url: string;
    title: string;
  }>;
}

/**
 * Test-specific content extension
 */
export interface Test extends UnifiedContent {
  type: 'test';
  testMode?: 'short' | 'elaborate' | 'practice';
  duration?: number; // in minutes
  totalQuestions?: number;
  passingScore?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Module-specific content extension (collection of lessons/tests)
 */
export interface Module extends UnifiedContent {
  type: 'module';
  lessons?: string[]; // Array of lesson IDs
  tests?: string[]; // Array of test IDs
  prerequisites?: string[];
  estimatedDuration?: number; // in hours
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * Type guard for Job content
 */
export function isJob(content: UnifiedContent): content is Job {
  return content.type === 'job';
}

/**
 * Type guard for Lesson content
 */
export function isLesson(content: UnifiedContent): content is Lesson {
  return content.type === 'lesson';
}

/**
 * Type guard for Test content
 */
export function isTest(content: UnifiedContent): content is Test {
  return content.type === 'test';
}

/**
 * Type guard for Module content
 */
export function isModule(content: UnifiedContent): content is Module {
  return content.type === 'module';
}

/**
 * Collection of unified content with pagination
 */
export interface ContentCollection {
  items: UnifiedContent[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Search/filter options for content queries
 */
export interface ContentFilters {
  /** Filter by content type */
  types?: ContentType[];
  
  /** Filter by tags */
  tags?: string[];
  
  /** Filter by app ID */
  appIds?: string[];
  
  /** Geographic filters */
  location?: Partial<Location>;
  
  /** Search query (for semantic or keyword search) */
  query?: string;
  
  /** Difficulty filter */
  difficulty?: ('beginner' | 'intermediate' | 'advanced')[];
  
  /** Date range filter */
  dateRange?: {
    from?: string;
    to?: string;
  };
}

/**
 * Content manifest structure for each app
 */
export interface ContentManifest {
  /** App identifier */
  appId: string;
  
  /** App display name */
  appName: string;
  
  /** App description */
  description?: string;
  
  /** Content items in this app */
  content: UnifiedContent[];
  
  /** Last update timestamp */
  lastUpdated: string;
  
  /** Version of the manifest */
  version: string;
}

/**
 * Meta-index structure for cross-app content discovery
 */
export interface MetaIndex {
  /** Version of the meta-index */
  version: string;
  
  /** Last update timestamp */
  lastUpdated: string;
  
  /** All registered apps */
  apps: Array<{
    appId: string;
    appName: string;
    contentCount: number;
    manifestPath: string;
  }>;
  
  /** Aggregate statistics */
  statistics: {
    totalApps: number;
    totalContent: number;
    contentByType: Record<ContentType, number>;
  };
}
