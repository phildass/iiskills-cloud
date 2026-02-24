/**
 * JobCard Component - Type Definitions
 * 
 * This file contains TypeScript interfaces for the JobCard component
 * used in the Learn Govt Jobs platform.
 */

/**
 * Breakdown of job vacancies by category
 * Example: { "General": 50, "OBC": 30, "SC": 15, "ST": 5 }
 */
export type JobVacancies = Record<string, number>;

/**
 * Required document for job application
 */
export interface JobDocument {
  type: string;       // e.g., "Photo", "ID Proof", "Education Certificate"
  url?: string;       // Optional download link
  required: boolean;  // Whether the document is mandatory
}

/**
 * Age relaxation for different categories
 * Example: { "OBC": 3, "SC": 5, "ST": 5, "PWD": 10 }
 */
export type AgeRelaxation = Record<string, number>;

/**
 * Fee exemption for different categories
 * Example: { "SC": true, "ST": true, "Female": true }
 */
export type FeeExemptions = Record<string, boolean>;

/**
 * AI-generated match reasoning
 */
export interface MatchReasoning {
  overallScore: number;        // 0-100
  locationScore?: number;      // Component score for location match
  qualificationScore?: number; // Component score for qualification match
  experienceScore?: number;    // Component score for experience match
  eligibilityScore?: number;   // Component score for eligibility (age, category, etc.)
  strengths: string[];         // What matches well
  gaps: string[];              // What doesn't match or needs improvement
  recommendations?: string;    // Personalized advice
}

/**
 * Timeline event for job application process
 */
export interface TimelineEvent {
  label: string;               // e.g., "Application Opens", "Exam Date"
  date: Date | string;
  status: 'completed' | 'current' | 'upcoming' | 'expired';
  icon?: string;               // Optional icon name
}

/**
 * Job status
 */
export type JobStatus = 'active' | 'expired' | 'cancelled' | 'filled';

/**
 * Job type classification
 */
export type JobType = 'Central' | 'State' | 'PSU' | 'Local';

/**
 * Application mode
 */
export type ApplicationMode = 'Online' | 'Offline' | 'Both';

/**
 * Complete Job interface
 */
export interface Job {
  // Basic Information
  id: number;
  title: string;
  organization: string;
  department?: string;
  categoryId?: number;
  categoryName?: string;
  
  // Job Details
  postName?: string;
  totalVacancies?: number;
  vacancies?: JobVacancies;
  
  // Geographic Information
  jobType: JobType;
  stateName?: string;
  districtNames?: string[];
  
  // Eligibility Criteria
  minAge?: number;
  maxAge?: number;
  ageRelaxation?: AgeRelaxation;
  minQualification?: string;
  requiredQualifications?: string[];
  experienceRequired?: boolean;
  minExperienceYears?: number;
  
  // Application Details
  applicationFee?: number;
  feeExemptions?: FeeExemptions;
  applicationMode?: ApplicationMode;
  applicationStartDate?: Date | string;
  applicationEndDate?: Date | string;
  examDate?: Date | string;
  resultDate?: Date | string;
  
  // Documents
  requiredDocuments?: JobDocument[];
  
  // Source Information
  sourceUrl: string;
  sourceDomain?: string;
  pdfUrl?: string;
  notificationNumber?: string;
  
  // AI Processing
  aiProcessed?: boolean;
  aiSummary?: string;
  aiTags?: string[];
  
  // Status
  status: JobStatus;
  scrapedAt?: Date | string;
  lastUpdated?: Date | string;
  
  // User-specific (when authenticated)
  matchScore?: number;
  matchReasoning?: MatchReasoning;
  isSaved?: boolean;
  isApplied?: boolean;
}

/**
 * JobCard Component Props
 */
export interface JobCardProps {
  job: Job;
  
  // Display Options
  showMatchScore?: boolean;      // Show AI match score (for authenticated users)
  showDetailedMatch?: boolean;   // Show expanded match reasoning
  showTimeline?: boolean;        // Show application timeline
  compact?: boolean;             // Compact view for list display
  
  // Callbacks
  onSave?: (jobId: number) => void;
  onApply?: (jobId: number) => void;
  onShare?: (jobId: number) => void;
  onClick?: (jobId: number) => void;
  
  // Authentication
  isAuthenticated?: boolean;
  
  // Customization
  className?: string;
}

/**
 * Match Score Badge Props
 */
export interface MatchScoreBadgeProps {
  score: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

/**
 * Timeline Props
 */
export interface TimelineProps {
  events: TimelineEvent[];
  compact?: boolean;
}

/**
 * Document Checklist Props
 */
export interface DocumentChecklistProps {
  documents: JobDocument[];
  compact?: boolean;
}
