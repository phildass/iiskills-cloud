/**
 * Unified Data Model for Schema-Driven UI
 * 
 * This module defines TypeScript interfaces for a unified data structure
 * that can represent different content types (Lesson, Test, Job Posting)
 * across all apps in the iiskills-cloud platform.
 */

/**
 * Base metadata common to all modules
 */
export interface ModuleMetadata {
  createdAt: string;
  updatedAt: string;
  author?: string;
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration?: number; // in minutes
  version?: string;
}

/**
 * Content type discriminator
 */
export type ContentType = 'lesson' | 'test' | 'job_posting' | 'quiz' | 'article' | 'video';

/**
 * Lesson-specific data structure
 */
export interface LessonContent {
  description: string;
  objectives: string[];
  prerequisites?: string[];
  materials?: Array<{
    type: 'pdf' | 'video' | 'link' | 'document';
    url: string;
    title: string;
  }>;
  sections?: Array<{
    id: string;
    title: string;
    content: string;
    order: number;
  }>;
}

/**
 * Test/Quiz-specific data structure
 */
export interface TestContent {
  description: string;
  testMode: 'short' | 'elaborate' | 'practice';
  duration: number; // in minutes
  totalQuestions: number;
  passingScore?: number;
  instructions?: string[];
  questions?: Array<{
    id: string;
    question: string;
    type: 'multiple_choice' | 'true_false' | 'short_answer';
    options?: string[];
    correctAnswer?: string | number;
    explanation?: string;
    points: number;
  }>;
}

/**
 * Job Posting-specific data structure
 */
export interface JobPostingContent {
  company: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  applicationDeadline?: string;
  applicationUrl?: string;
}

/**
 * Main Module interface - the core of Schema-Driven UI
 * Uses discriminated union for type-safe content handling
 */
export interface Module<T extends ContentType = ContentType> {
  // Common fields
  id: string;
  title: string;
  content_type: T;
  metadata: ModuleMetadata;
  
  // Status and visibility
  status: 'draft' | 'published' | 'archived';
  isPublic: boolean;
  
  // Type-specific content (discriminated union)
  content: T extends 'lesson' 
    ? LessonContent 
    : T extends 'test' 
    ? TestContent 
    : T extends 'job_posting' 
    ? JobPostingContent 
    : Record<string, any>; // Fallback for custom types
  
  // Optional fields for extensibility
  customFields?: Record<string, any>;
}

/**
 * Type guards for runtime type checking
 */
export function isLessonModule(module: Module): module is Module<'lesson'> {
  return module.content_type === 'lesson';
}

export function isTestModule(module: Module): module is Module<'test'> {
  return module.content_type === 'test';
}

export function isJobPostingModule(module: Module): module is Module<'job_posting'> {
  return module.content_type === 'job_posting';
}

/**
 * Module collection with pagination support
 */
export interface ModuleCollection {
  modules: Module[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Module filter options
 */
export interface ModuleFilters {
  content_type?: ContentType[];
  tags?: string[];
  difficulty?: ModuleMetadata['difficulty'][];
  status?: Module['status'][];
  searchQuery?: string;
}
