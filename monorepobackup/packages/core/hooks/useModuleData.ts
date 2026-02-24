/**
 * useModuleData Hook
 * 
 * A standardized React hook for fetching module data
 * regardless of the backend source. Provides consistent
 * interface across all apps.
 */

import { useState, useEffect, useCallback } from 'react';
import { Module, ModuleCollection, ModuleFilters, ContentType } from '../types/module.types';

/**
 * Hook options
 */
export interface UseModuleDataOptions {
  // Data source configuration
  endpoint?: string;
  
  // Filters
  filters?: ModuleFilters;
  
  // Pagination
  page?: number;
  pageSize?: number;
  
  // Behavior
  autoFetch?: boolean;
  cacheKey?: string;
  cacheDuration?: number; // in milliseconds
  
  // Callbacks
  onSuccess?: (data: ModuleCollection) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook return type
 */
export interface UseModuleDataResult {
  // Data
  modules: Module[];
  total: number;
  hasMore: boolean;
  
  // State
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  
  // Actions
  refetch: () => Promise<void>;
  fetchMore: () => Promise<void>;
  updateFilters: (filters: Partial<ModuleFilters>) => void;
  clearCache: () => void;
}

/**
 * Simple in-memory cache
 */
const cache = new Map<string, { data: ModuleCollection; timestamp: number }>();

/**
 * Custom hook for fetching module data
 */
export function useModuleData(options: UseModuleDataOptions = {}): UseModuleDataResult {
  const {
    endpoint = '/api/modules',
    filters = {},
    page: initialPage = 1,
    pageSize = 10,
    autoFetch = true,
    cacheKey,
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
    onSuccess,
    onError,
  } = options;

  const [modules, setModules] = useState<Module[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [currentFilters, setCurrentFilters] = useState<ModuleFilters>(filters);
  const [currentPage, setCurrentPage] = useState(initialPage);

  /**
   * Build query string from filters and pagination
   */
  const buildQueryString = useCallback(
    (page: number, filters: ModuleFilters): string => {
      const params = new URLSearchParams();
      
      params.set('page', page.toString());
      params.set('pageSize', pageSize.toString());
      
      if (filters.content_type?.length) {
        params.set('content_type', filters.content_type.join(','));
      }
      if (filters.tags?.length) {
        params.set('tags', filters.tags.join(','));
      }
      if (filters.difficulty?.length) {
        params.set('difficulty', filters.difficulty.join(','));
      }
      if (filters.status?.length) {
        params.set('status', filters.status.join(','));
      }
      if (filters.searchQuery) {
        params.set('q', filters.searchQuery);
      }
      
      return params.toString();
    },
    [pageSize]
  );

  /**
   * Fetch modules from API
   */
  const fetchModules = useCallback(
    async (page: number, filters: ModuleFilters, append = false) => {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      try {
        // Check cache first
        const queryString = buildQueryString(page, filters);
        const key = cacheKey || `${endpoint}?${queryString}`;
        const cached = cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < cacheDuration) {
          const { modules: cachedModules, total, hasMore } = cached.data;
          
          if (append) {
            setModules((prev) => [...prev, ...cachedModules]);
          } else {
            setModules(cachedModules);
          }
          
          setTotal(total);
          setHasMore(hasMore);
          setIsLoading(false);
          
          if (onSuccess) {
            onSuccess(cached.data);
          }
          
          return;
        }

        // Fetch from API
        const response = await fetch(`${endpoint}?${queryString}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: ModuleCollection = await response.json();
        
        // Update cache
        cache.set(key, {
          data,
          timestamp: Date.now(),
        });
        
        // Update state
        if (append) {
          setModules((prev) => [...prev, ...data.modules]);
        } else {
          setModules(data.modules);
        }
        
        setTotal(data.total);
        setHasMore(data.hasMore);
        
        if (onSuccess) {
          onSuccess(data);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch modules');
        setIsError(true);
        setError(error);
        
        if (onError) {
          onError(error);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint, buildQueryString, cacheKey, cacheDuration, onSuccess, onError]
  );

  /**
   * Refetch current page
   */
  const refetch = useCallback(async () => {
    await fetchModules(currentPage, currentFilters, false);
  }, [fetchModules, currentPage, currentFilters]);

  /**
   * Fetch next page (load more)
   */
  const fetchMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchModules(nextPage, currentFilters, true);
  }, [hasMore, isLoading, currentPage, currentFilters, fetchModules]);

  /**
   * Update filters and refetch
   */
  const updateFilters = useCallback(
    (newFilters: Partial<ModuleFilters>) => {
      const updatedFilters = { ...currentFilters, ...newFilters };
      setCurrentFilters(updatedFilters);
      setCurrentPage(1);
      setModules([]); // Clear existing modules
      fetchModules(1, updatedFilters, false);
    },
    [currentFilters, fetchModules]
  );

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    cache.clear();
  }, []);

  /**
   * Auto-fetch on mount
   */
  useEffect(() => {
    if (autoFetch) {
      fetchModules(currentPage, currentFilters, false);
    }
  }, [autoFetch]); // Only run on mount

  return {
    modules,
    total,
    hasMore,
    isLoading,
    isError,
    error,
    refetch,
    fetchMore,
    updateFilters,
    clearCache,
  };
}

/**
 * Hook for fetching a single module by ID
 */
export function useModule(id: string, endpoint = '/api/modules') {
  const [module, setModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchModule = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await fetch(`${endpoint}/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: Module = await response.json();
      setModule(data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch module');
      setIsError(true);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, [id, endpoint]);

  useEffect(() => {
    if (id) {
      fetchModule();
    }
  }, [id, fetchModule]);

  return {
    module,
    isLoading,
    isError,
    error,
    refetch: fetchModule,
  };
}
