/**
 * Utility Functions for Schema-Driven UI
 */

import { Module, ContentType, ModuleFilters } from '../types/module.types';

/**
 * Sort modules by a specific field
 */
export function sortModules<T extends keyof Module>(
  modules: Module[],
  field: T,
  order: 'asc' | 'desc' = 'asc'
): Module[] {
  return [...modules].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Filter modules by content type
 */
export function filterByContentType(
  modules: Module[],
  types: ContentType[]
): Module[] {
  return modules.filter(module => types.includes(module.content_type));
}

/**
 * Filter modules by tags
 */
export function filterByTags(
  modules: Module[],
  tags: string[],
  matchAll = false
): Module[] {
  return modules.filter(module => {
    if (!module.metadata.tags) return false;
    
    if (matchAll) {
      return tags.every(tag => module.metadata.tags?.includes(tag));
    }
    
    return tags.some(tag => module.metadata.tags?.includes(tag));
  });
}

/**
 * Search modules by query string
 */
export function searchModules(
  modules: Module[],
  query: string
): Module[] {
  const lowerQuery = query.toLowerCase();
  
  return modules.filter(module => {
    // Search in title
    if (module.title.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    // Search in tags
    if (module.metadata.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))) {
      return true;
    }
    
    // Search in author
    if (module.metadata.author?.toLowerCase().includes(lowerQuery)) {
      return true;
    }
    
    return false;
  });
}

/**
 * Apply multiple filters to modules
 */
export function applyFilters(
  modules: Module[],
  filters: ModuleFilters
): Module[] {
  let result = modules;
  
  // Filter by content type
  if (filters.content_type && filters.content_type.length > 0) {
    result = filterByContentType(result, filters.content_type);
  }
  
  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    result = filterByTags(result, filters.tags);
  }
  
  // Filter by difficulty
  if (filters.difficulty && filters.difficulty.length > 0) {
    result = result.filter(module =>
      module.metadata.difficulty &&
      filters.difficulty?.includes(module.metadata.difficulty)
    );
  }
  
  // Filter by status
  if (filters.status && filters.status.length > 0) {
    result = result.filter(module => filters.status?.includes(module.status));
  }
  
  // Search query
  if (filters.searchQuery) {
    result = searchModules(result, filters.searchQuery);
  }
  
  return result;
}

/**
 * Group modules by content type
 */
export function groupByContentType(modules: Module[]): Record<ContentType, Module[]> {
  const grouped: Partial<Record<ContentType, Module[]>> = {};
  
  modules.forEach(module => {
    if (!grouped[module.content_type]) {
      grouped[module.content_type] = [];
    }
    grouped[module.content_type]!.push(module);
  });
  
  return grouped as Record<ContentType, Module[]>;
}

/**
 * Get unique tags from modules
 */
export function getUniqueTags(modules: Module[]): string[] {
  const tags = new Set<string>();
  
  modules.forEach(module => {
    module.metadata.tags?.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

/**
 * Calculate estimated completion time for a module
 */
export function getEstimatedTime(module: Module): number {
  if (module.metadata.estimatedDuration) {
    return module.metadata.estimatedDuration;
  }
  
  // Fallback estimation based on content type
  if (module.content_type === 'test') {
    const testContent = module.content as any;
    return testContent.duration || 30;
  }
  
  if (module.content_type === 'lesson') {
    const lessonContent = module.content as any;
    const sectionCount = lessonContent.sections?.length || 1;
    return sectionCount * 10; // 10 minutes per section
  }
  
  return 15; // Default 15 minutes
}

/**
 * Format module metadata for display
 */
export function formatMetadata(module: Module): {
  duration: string;
  difficulty: string;
  updated: string;
} {
  const duration = getEstimatedTime(module);
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  let durationStr = '';
  if (hours > 0) {
    durationStr += `${hours}h `;
  }
  if (minutes > 0) {
    durationStr += `${minutes}m`;
  }
  
  return {
    duration: durationStr.trim() || 'N/A',
    difficulty: module.metadata.difficulty || 'N/A',
    updated: new Date(module.metadata.updatedAt).toLocaleDateString(),
  };
}

/**
 * Validate module data
 */
export function validateModule(module: any): module is Module {
  if (!module || typeof module !== 'object') return false;
  
  // Required fields
  if (!module.id || typeof module.id !== 'string') return false;
  if (!module.title || typeof module.title !== 'string') return false;
  if (!module.content_type || typeof module.content_type !== 'string') return false;
  if (!module.metadata || typeof module.metadata !== 'object') return false;
  if (!module.content || typeof module.content !== 'object') return false;
  
  // Metadata validation
  if (!module.metadata.createdAt || !module.metadata.updatedAt) return false;
  
  return true;
}

/**
 * Create a module excerpt/summary
 */
export function createExcerpt(module: Module, maxLength = 150): string {
  let text = '';
  
  if (module.content_type === 'lesson') {
    const content = module.content as any;
    text = content.description || '';
  } else if (module.content_type === 'test') {
    const content = module.content as any;
    text = content.description || '';
  } else if (module.content_type === 'job_posting') {
    const content = module.content as any;
    text = content.description || '';
  }
  
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
}

/**
 * Calculate module progress (placeholder - needs user data)
 */
export function calculateProgress(
  module: Module,
  completedSections?: string[]
): number {
  if (!completedSections || completedSections.length === 0) return 0;
  
  if (module.content_type === 'lesson') {
    const content = module.content as any;
    const totalSections = content.sections?.length || 1;
    const completed = completedSections.length;
    return Math.min(100, Math.round((completed / totalSections) * 100));
  }
  
  return 0;
}
