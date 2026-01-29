/**
 * Content SDK - Core utilities for content discovery and management
 * 
 * This SDK provides utilities for:
 * - Searching and filtering content across apps
 * - Geographic resolution for gov-jobs
 * - Content indexing and manifest management
 * - Cross-app content aggregation
 */

import {
  UnifiedContent,
  ContentFilters,
  ContentCollection,
  ContentManifest,
  MetaIndex,
  Location,
} from '@iiskills/schema';

/**
 * Search content across all apps based on filters
 */
export function searchContent(
  items: UnifiedContent[],
  filters: ContentFilters
): UnifiedContent[] {
  let results = [...items];

  // Filter by content type
  if (filters.type && filters.type.length > 0) {
    results = results.filter((item) => filters.type!.includes(item.type));
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter((item) =>
      item.tags?.some((tag) => filters.tags!.includes(tag))
    );
  }

  // Filter by app
  if (filters.apps && filters.apps.length > 0) {
    results = results.filter((item) => item.app && filters.apps!.includes(item.app));
  }

  // Filter by location (for gov-jobs)
  if (filters.location) {
    results = results.filter((item) => {
      if (!item.location) return false;
      
      const loc = item.location;
      const filterLoc = filters.location!;
      
      if (filterLoc.country && loc.country !== filterLoc.country) return false;
      if (filterLoc.state && loc.state !== filterLoc.state) return false;
      if (filterLoc.district && loc.district !== filterLoc.district) return false;
      
      return true;
    });
  }

  // Filter by status
  if (filters.status && filters.status.length > 0) {
    results = results.filter((item) => item.status && filters.status!.includes(item.status));
  }

  // Filter by deadline presence
  if (filters.hasDeadline !== undefined) {
    results = results.filter((item) => {
      const hasDeadline = !!item.deadline;
      return hasDeadline === filters.hasDeadline;
    });
  }

  // Search query (full-text search in title, description, tags)
  if (filters.searchQuery && filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase();
    results = results.filter((item) => {
      const titleMatch = item.title?.toLowerCase().includes(query);
      const descMatch = item.description?.toLowerCase().includes(query);
      const tagsMatch = item.tags?.some((tag) => tag.toLowerCase().includes(query));
      
      return titleMatch || descMatch || tagsMatch;
    });
  }

  return results;
}

/**
 * Paginate content results
 */
export function paginateContent(
  items: UnifiedContent[],
  page: number = 1,
  pageSize: number = 30
): ContentCollection {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = items.slice(start, end);

  return {
    items: paginatedItems,
    total: items.length,
    page,
    pageSize,
    hasMore: end < items.length,
  };
}

/**
 * Geographic resolver for gov-jobs
 * Resolves location queries to match content
 */
export interface GeographyNode {
  name: string;
  type: 'country' | 'state' | 'district';
  children?: GeographyNode[];
}

export class GeographicResolver {
  private geography: GeographyNode[];

  constructor(geography: GeographyNode[]) {
    this.geography = geography;
  }

  /**
   * Resolve a location query to all matching locations
   * Example: "Bihar" -> returns Bihar state and all its districts
   */
  resolveLocation(query: string): Location[] {
    const results: Location[] = [];
    const lowerQuery = query.toLowerCase();

    for (const country of this.geography) {
      if (country.name.toLowerCase().includes(lowerQuery)) {
        // Matched a country
        results.push({ country: country.name });
      }

      if (country.children) {
        for (const state of country.children) {
          if (state.name.toLowerCase().includes(lowerQuery)) {
            // Matched a state
            results.push({ country: country.name, state: state.name });
          }

          if (state.children) {
            for (const district of state.children) {
              if (district.name.toLowerCase().includes(lowerQuery)) {
                // Matched a district
                results.push({
                  country: country.name,
                  state: state.name,
                  district: district.name,
                });
              }
            }
          }
        }
      }
    }

    return results;
  }

  /**
   * Expand a location to include all sub-locations
   * Example: {country: "India", state: "Bihar"} -> returns all districts in Bihar
   */
  expandLocation(location: Partial<Location>): Location[] {
    const results: Location[] = [];

    for (const country of this.geography) {
      if (location.country && country.name !== location.country) continue;

      if (!location.state) {
        // Return all states in this country
        if (country.children) {
          for (const state of country.children) {
            results.push({ country: country.name, state: state.name });
          }
        }
      } else {
        // Find the specific state
        const state = country.children?.find((s) => s.name === location.state);
        if (state) {
          if (!location.district) {
            // Return all districts in this state
            if (state.children) {
              for (const district of state.children) {
                results.push({
                  country: country.name,
                  state: state.name,
                  district: district.name,
                });
              }
            }
          } else {
            // Return the specific location
            results.push({
              country: country.name,
              state: state.name,
              district: location.district,
            });
          }
        }
      }
    }

    return results;
  }
}

/**
 * Aggregate content from multiple app manifests
 */
export function aggregateContent(manifests: ContentManifest[]): UnifiedContent[] {
  const allContent: UnifiedContent[] = [];

  for (const manifest of manifests) {
    for (const item of manifest.items) {
      // Ensure app is set
      if (!item.app) {
        item.app = manifest.app;
      }
      allContent.push(item);
    }
  }

  return allContent;
}

/**
 * Load and parse meta-index
 */
export async function loadMetaIndex(path: string): Promise<MetaIndex> {
  // In a real implementation, this would load from filesystem or API
  // For now, return a stub
  return {
    version: '1.0.0',
    apps: [],
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Load manifest for a specific app
 */
export async function loadManifest(path: string): Promise<ContentManifest> {
  // In a real implementation, this would load from filesystem or API
  // For now, return a stub
  return {
    app: '',
    version: '1.0.0',
    contentTypes: [],
    items: [],
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Generate content embeddings for semantic search
 * This is a placeholder - in production, use a proper embedding service
 */
export function generateEmbedding(content: UnifiedContent): number[] {
  // Placeholder: returns a simple hash-based embedding
  // In production, use OpenAI embeddings, FAISS, or similar
  const text = `${content.title} ${content.description || ''} ${content.tags?.join(' ') || ''}`;
  const hash = text.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return Array.from({ length: 10 }, (_, i) => (hash * (i + 1)) % 100 / 100);
}

/**
 * Semantic search using embeddings
 * This is a placeholder implementation
 */
export function semanticSearch(
  query: string,
  items: UnifiedContent[],
  limit: number = 10
): UnifiedContent[] {
  // Placeholder: falls back to basic search
  // In production, use vector similarity search
  const queryEmbedding = generateEmbedding({
    id: 'query',
    type: 'other',
    title: query,
  });

  const scored = items.map((item) => {
    const itemEmbedding = generateEmbedding(item);
    // Simple cosine similarity
    const similarity = itemEmbedding.reduce((sum, val, i) => sum + val * queryEmbedding[i], 0);
    return { item, similarity };
  });

  return scored
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((s) => s.item);
}

/**
 * Validate unified content
 */
export function validateContent(content: any): content is UnifiedContent {
  return (
    typeof content === 'object' &&
    content !== null &&
    typeof content.id === 'string' &&
    typeof content.type === 'string' &&
    typeof content.title === 'string'
  );
}

/**
 * Export all utilities
 */
export {
  UnifiedContent,
  ContentFilters,
  ContentCollection,
  ContentManifest,
  MetaIndex,
  Location,
} from '@iiskills/schema';
