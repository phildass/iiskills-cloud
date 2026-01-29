/**
 * Unified Content Provider
 * 
 * This module aggregates content from multiple sources (Supabase AND local/mock data)
 * and presents a unified view for the admin dashboard.
 * 
 * Key Features:
 * - Fetches data from both Supabase and local content sources
 * - Merges results with source metadata (_source field)
 * - Gracefully handles errors (empty Supabase, missing local files)
 * - Deduplicates content by ID (Supabase takes precedence)
 * - Provides consistent API for admin operations
 * 
 * Usage:
 *   const provider = await createUnifiedContentProvider();
 *   const courses = await provider.getCourses();
 *   // Returns: [{ ...course, _source: 'supabase' | 'local' }]
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load local content from seeds/content.json
 * @returns {Object} Parsed content or empty structure
 */
function loadLocalContent() {
  try {
    // Try multiple possible paths for the content.json file
    const possiblePaths = [
      path.join(process.cwd(), 'seeds', 'content.json'),
      path.join(process.cwd(), '..', 'seeds', 'content.json'),
      path.join(__dirname, '..', 'seeds', 'content.json'),
    ];

    let contentPath = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        contentPath = testPath;
        break;
      }
    }

    if (!contentPath) {
      console.warn('⚠️ Local content file not found at any expected path');
      return null;
    }

    const fileContent = fs.readFileSync(contentPath, 'utf-8');
    const data = JSON.parse(fileContent);
    console.log('✓ Loaded local content from:', contentPath);
    return data;
  } catch (error) {
    console.error('Error loading local content:', error.message);
    return null;
  }
}

/**
 * Create Supabase client if credentials are available
 * @returns {Object|null} Supabase client or null
 */
function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if Supabase is suspended
  const isSuspended = process.env.NEXT_PUBLIC_SUPABASE_SUSPENDED === 'true';
  if (isSuspended) {
    console.log('ℹ️ Supabase is suspended - skipping Supabase data source');
    return null;
  }

  // Validate credentials
  const hasPlaceholderUrl = !supabaseUrl || 
    supabaseUrl === 'your-project-url-here' ||
    supabaseUrl === 'https://your-project.supabase.co' ||
    supabaseUrl.includes('your-project') ||
    supabaseUrl.includes('xyz');

  const hasPlaceholderKey = !supabaseKey ||
    supabaseKey === 'your-anon-key-here' ||
    supabaseKey.startsWith('eyJhbGciOi...') ||
    supabaseKey.length < 20;

  if (hasPlaceholderUrl || hasPlaceholderKey) {
    console.warn('⚠️ Supabase credentials missing or invalid - skipping Supabase data source');
    return null;
  }

  try {
    const client = createClient(supabaseUrl, supabaseKey);
    console.log('✓ Supabase client created successfully');
    return client;
  } catch (error) {
    console.error('Error creating Supabase client:', error.message);
    return null;
  }
}

/**
 * Fetch data from Supabase table
 * @param {Object} supabase - Supabase client
 * @param {string} table - Table name
 * @param {Object} options - Query options (filters, order, limit, appId)
 * @returns {Array} Data array or empty array on error
 */
async function fetchFromSupabase(supabase, table, options = {}) {
  if (!supabase) return [];

  try {
    let query = supabase.from(table).select('*');

    // Apply app filter first (critical for isolation)
    if (options.appId) {
      // Try multiple possible column names for app identification
      // Use OR logic to catch different naming conventions
      query = query.or(`appId.eq.${options.appId},app.eq.${options.appId},subdomain.eq.${options.appId}`);
    }

    // Apply other filters if provided
    if (options.filters) {
      Object.entries(options.filters).forEach(([field, value]) => {
        if (value !== undefined && value !== null && value !== 'all') {
          query = query.eq(field, value);
        }
      });
    }

    // Apply ordering
    if (options.order) {
      query = query.order(options.order.field, { 
        ascending: options.order.ascending !== false 
      });
    }

    // Apply limit
    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching ${table} from Supabase:`, error.message);
      return [];
    }

    // Add source metadata and normalize appId field
    return (data || []).map(item => ({
      ...item,
      _source: 'supabase',
      appId: item.appId || item.app || item.subdomain || 'unknown'
    }));
  } catch (error) {
    console.error(`Exception fetching ${table} from Supabase:`, error.message);
    return [];
  }
}

/**
 * Filter local content based on options
 * @param {Array} data - Local data array
 * @param {Object} options - Query options
 * @returns {Array} Filtered data
 */
function filterLocalData(data, options = {}) {
  if (!data || !Array.isArray(data)) return [];

  let filtered = [...data];

  // Apply app filter first (critical for isolation)
  if (options.appId) {
    filtered = filtered.filter(item => {
      // Check multiple possible app identifier fields
      return item.appId === options.appId || 
             item._discoveredFrom === options.appId ||
             item.app === options.appId;
    });
  }

  // Apply other filters
  if (options.filters) {
    Object.entries(options.filters).forEach(([field, value]) => {
      if (value !== undefined && value !== null && value !== 'all') {
        filtered = filtered.filter(item => item[field] === value);
      }
    });
  }

  // Apply ordering
  if (options.order) {
    const isAscending = options.order.ascending !== false; // Default to true if not specified
    filtered.sort((a, b) => {
      const aVal = a[options.order.field];
      const bVal = b[options.order.field];
      
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return isAscending ? -1 : 1;
      if (bVal == null) return isAscending ? 1 : -1;
      
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return isAscending ? comparison : -comparison;
    });
  }

  // Apply limit
  if (options.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  // Add source metadata
  return filtered.map(item => ({ ...item, _source: 'local' }));
}

/**
 * Merge data from multiple sources, deduplicating by ID
 * Supabase data takes precedence over local data
 * @param {Array} supabaseData - Data from Supabase
 * @param {Array} localData - Data from local content
 * @returns {Array} Merged and deduplicated data
 */
function mergeData(supabaseData, localData) {
  const merged = [...supabaseData];
  const supabaseIds = new Set(supabaseData.map(item => item.id));

  // Add local items that don't exist in Supabase
  localData.forEach(item => {
    if (!supabaseIds.has(item.id)) {
      merged.push(item);
    }
  });

  return merged;
}

/**
 * Create unified content provider
 * @returns {Object} Provider with methods to fetch unified content
 */
export async function createUnifiedContentProvider() {
  const supabase = createSupabaseClient();
  const localContent = loadLocalContent();
  
  // Import and run content discovery
  let discoveredContent = null;
  try {
    const { discoverAllContent } = await import('./contentDiscovery.js');
    discoveredContent = await discoverAllContent();
    console.log(`   ✓ Auto-Discovery: Found ${discoveredContent._metadata.totalFilesFound} file(s) in ${discoveredContent._metadata.sources.length} app(s)`);
  } catch (error) {
    console.warn('⚠️ Content auto-discovery failed:', error.message);
    discoveredContent = null;
  }

  const hasSupabase = supabase !== null;
  const hasLocalContent = localContent !== null;
  const hasDiscoveredContent = discoveredContent !== null && discoveredContent._metadata.totalFilesFound > 0;

  console.log('\n📊 UNIFIED CONTENT PROVIDER INITIALIZED');
  console.log(`   ✓ Supabase: ${hasSupabase ? 'Available' : 'Not available'}`);
  console.log(`   ✓ Local Content: ${hasLocalContent ? 'Available' : 'Not available'}`);
  console.log(`   ✓ Discovered Content: ${hasDiscoveredContent ? `Available (${discoveredContent._metadata.sources.length} sources)` : 'Not available'}`);
  console.log(`   ✓ Mode: ${hasSupabase && (hasLocalContent || hasDiscoveredContent) ? 'MERGED (3 sources)' : hasSupabase ? 'Supabase only' : hasLocalContent || hasDiscoveredContent ? 'Local/Discovered only' : 'NO DATA'}\n`);

  return {
    /**
     * Get all courses from all sources (Supabase + Local + Discovered)
     * @param {Object} options - Query options (can include appId for filtering)
     * @returns {Array} Unified courses array
     */
    async getCourses(options = {}) {
      const supabaseData = await fetchFromSupabase(supabase, 'courses', options);
      const localData = filterLocalData(localContent?.courses, options);
      const discoveredData = filterLocalData(discoveredContent?.courses, options);
      
      // Merge all three sources
      let merged = mergeData(supabaseData, localData);
      merged = mergeData(merged, discoveredData);
      return merged;
    },

    /**
     * Get all modules from all sources
     * @param {Object} options - Query options (can include appId for filtering)
     * @returns {Array} Unified modules array
     */
    async getModules(options = {}) {
      const supabaseData = await fetchFromSupabase(supabase, 'modules', options);
      const localData = filterLocalData(localContent?.modules, options);
      const discoveredData = filterLocalData(discoveredContent?.modules, options);
      
      let merged = mergeData(supabaseData, localData);
      merged = mergeData(merged, discoveredData);
      return merged;
    },

    /**
     * Get all lessons from all sources
     * @param {Object} options - Query options (can include appId for filtering)
     * @returns {Array} Unified lessons array
     */
    async getLessons(options = {}) {
      const supabaseData = await fetchFromSupabase(supabase, 'lessons', options);
      const localData = filterLocalData(localContent?.lessons, options);
      const discoveredData = filterLocalData(discoveredContent?.lessons, options);
      
      let merged = mergeData(supabaseData, localData);
      merged = mergeData(merged, discoveredData);
      return merged;
    },

    /**
     * Get all profiles/users from all sources
     * @param {Object} options - Query options (can include appId for filtering)
     * @returns {Array} Unified profiles array
     */
    async getProfiles(options = {}) {
      const supabaseData = await fetchFromSupabase(supabase, 'profiles', options);
      const localData = filterLocalData(localContent?.profiles, options);
      const discoveredData = filterLocalData(discoveredContent?.profiles, options);
      
      let merged = mergeData(supabaseData, localData);
      merged = mergeData(merged, discoveredData);
      return merged;
    },

    /**
     * Get all questions from all sources
     * @param {Object} options - Query options (can include appId for filtering)
     * @returns {Array} Unified questions array
     */
    async getQuestions(options = {}) {
      const supabaseData = await fetchFromSupabase(supabase, 'questions', options);
      const localData = filterLocalData(localContent?.questions, options);
      const discoveredData = filterLocalData(discoveredContent?.questions, options);
      
      let merged = mergeData(supabaseData, localData);
      merged = mergeData(merged, discoveredData);
      return merged;
    },

    /**
     * Get statistics from all sources
     * @returns {Object} Aggregated statistics
     */
    async getStats() {
      const [courses, profiles, modules, lessons] = await Promise.all([
        this.getCourses(),
        this.getProfiles(),
        this.getModules(),
        this.getLessons(),
      ]);

      // Get per-app breakdown
      const appIds = new Set();
      [...courses, ...modules, ...lessons].forEach(item => {
        const appId = item.appId || item._discoveredFrom || item.app || item.subdomain;
        if (appId && appId !== 'unknown') {
          appIds.add(appId);
        }
      });

      const perAppStats = {};
      Array.from(appIds).forEach(appId => {
        perAppStats[appId] = {
          courses: courses.filter(c => 
            c.appId === appId || c._discoveredFrom === appId || c.app === appId || c.subdomain === appId
          ).length,
          modules: modules.filter(m => 
            m.appId === appId || m._discoveredFrom === appId || m.app === appId || m.subdomain === appId
          ).length,
          lessons: lessons.filter(l => 
            l.appId === appId || l._discoveredFrom === appId || l.app === appId || l.subdomain === appId
          ).length,
        };
      });

      return {
        totalCourses: courses.length,
        totalUsers: profiles.length,
        totalModules: modules.length,
        totalLessons: lessons.length,
        totalApps: appIds.size,
        // Source breakdown
        sources: {
          supabase: {
            courses: courses.filter(c => c._source === 'supabase').length,
            users: profiles.filter(p => p._source === 'supabase').length,
            modules: modules.filter(m => m._source === 'supabase').length,
            lessons: lessons.filter(l => l._source === 'supabase').length,
          },
          local: {
            courses: courses.filter(c => c._source === 'local').length,
            users: profiles.filter(p => p._source === 'local').length,
            modules: modules.filter(m => m._source === 'local').length,
            lessons: lessons.filter(l => l._source === 'local').length,
          },
          discovered: {
            courses: courses.filter(c => c._source === 'discovered' || c._discoveredFrom).length,
            users: profiles.filter(p => p._source === 'discovered' || p._discoveredFrom).length,
            modules: modules.filter(m => m._source === 'discovered' || m._discoveredFrom).length,
            lessons: lessons.filter(l => l._source === 'discovered' || l._discoveredFrom).length,
            sources: discoveredContent?._metadata?.sources || [],
          },
        },
        // Per-app breakdown
        perApp: perAppStats,
      };
    },

    /**
     * Check if data sources are available
     * @returns {Object} Availability status
     */
    getSourceStatus() {
      return {
        supabase: hasSupabase,
        local: hasLocalContent,
        discovered: hasDiscoveredContent,
        discoveredApps: discoveredContent?._metadata?.sources?.map(s => s.app) || [],
        mode: hasSupabase && (hasLocalContent || hasDiscoveredContent) ? 'merged' : 
              hasSupabase ? 'supabase-only' : 
              hasLocalContent || hasDiscoveredContent ? 'local-only' : 'no-data',
      };
    },
    
    /**
     * Get discovery metadata
     * @returns {Object} Information about auto-discovered content
     */
    getDiscoveryMetadata() {
      return discoveredContent?._metadata || null;
    },

    /**
     * Get content for a specific app only
     * @param {string} appId - App identifier (e.g., 'learn-apt', 'learn-ai')
     * @returns {Object} All content types for the specified app
     */
    async getAppContent(appId) {
      const [courses, modules, lessons, profiles, questions] = await Promise.all([
        this.getCourses({ appId }),
        this.getModules({ appId }),
        this.getLessons({ appId }),
        this.getProfiles({ appId }),
        this.getQuestions({ appId }),
      ]);

      return {
        appId,
        courses,
        modules,
        lessons,
        profiles,
        questions,
        stats: {
          totalCourses: courses.length,
          totalModules: modules.length,
          totalLessons: lessons.length,
          totalProfiles: profiles.length,
          totalQuestions: questions.length,
        },
      };
    },

    /**
     * Get list of all apps with content
     * @returns {Array} Array of app identifiers and their content counts
     */
    async getAllApps() {
      const [courses, modules, lessons] = await Promise.all([
        this.getCourses(),
        this.getModules(),
        this.getLessons(),
      ]);

      // Collect all unique app IDs
      const appIds = new Set();
      [...courses, ...modules, ...lessons].forEach(item => {
        const appId = item.appId || item._discoveredFrom || item.app || item.subdomain;
        if (appId && appId !== 'unknown') {
          appIds.add(appId);
        }
      });

      // Get counts for each app
      const apps = Array.from(appIds).map(appId => {
        const appCourses = courses.filter(c => 
          c.appId === appId || c._discoveredFrom === appId || c.app === appId || c.subdomain === appId
        );
        const appModules = modules.filter(m => 
          m.appId === appId || m._discoveredFrom === appId || m.app === appId || m.subdomain === appId
        );
        const appLessons = lessons.filter(l => 
          l.appId === appId || l._discoveredFrom === appId || l.app === appId || l.subdomain === appId
        );

        return {
          appId,
          name: appId.replace('learn-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          coursesCount: appCourses.length,
          modulesCount: appModules.length,
          lessonsCount: appLessons.length,
          totalContent: appCourses.length + appModules.length + appLessons.length,
        };
      }).sort((a, b) => a.appId.localeCompare(b.appId));

      return apps;
    },
  };
}
