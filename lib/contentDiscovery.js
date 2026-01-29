/**
 * Content Discovery System
 * 
 * Auto-discovers and aggregates content from all learn-* apps in the monorepo.
 * This eliminates the need for manual updates when new apps or data sources are added.
 * 
 * Features:
 * - Scans all learn-* directories for data files
 * - Supports multiple file formats (JSON, JS modules)
 * - Caches discovered content for performance
 * - Provides source metadata for each discovered item
 * - Gracefully handles missing or invalid files
 * 
 * Usage:
 *   import { discoverAllContent } from './contentDiscovery';
 *   const content = await discoverAllContent();
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Cache for discovered content to avoid repeated file system scans
 */
let contentCache = null;
let cacheTimestamp = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Common locations where content files might exist
 */
const CONTENT_FILE_PATTERNS = [
  'data/courses.json',
  'data/modules.json',
  'data/lessons.json',
  'data/content.json',
  'data/newsletters.json',
  'seeds/content.json',
  'content/courses.json',
  'content/data.json',
  'public/data/courses.json',
];

/**
 * Find all learn-* app directories
 * @returns {Array<string>} Array of absolute paths to learn-* directories
 */
function findLearnAppDirectories() {
  try {
    // Start from project root
    const projectRoot = path.resolve(process.cwd());
    const appsDir = path.join(projectRoot, 'apps');
    
    if (!fs.existsSync(appsDir)) {
      console.warn('⚠️ Apps directory not found:', appsDir);
      return [];
    }
    
    const entries = fs.readdirSync(appsDir, { withFileTypes: true });
    const learnApps = entries
      .filter(entry => entry.isDirectory() && entry.name.startsWith('learn-'))
      .map(entry => path.join(appsDir, entry.name));
    
    console.log(`📁 Found ${learnApps.length} learn-* app directories`);
    return learnApps;
  } catch (error) {
    console.error('Error finding learn-* directories:', error.message);
    return [];
  }
}

/**
 * Discover content files in a specific directory
 * @param {string} appDir - Path to app directory
 * @returns {Object} Discovered content with metadata
 */
function discoverContentInApp(appDir) {
  const appName = path.basename(appDir);
  const discoveredFiles = [];
  
  for (const pattern of CONTENT_FILE_PATTERNS) {
    const filePath = path.join(appDir, pattern);
    
    if (fs.existsSync(filePath)) {
      try {
        const stats = fs.statSync(filePath);
        discoveredFiles.push({
          path: filePath,
          relativePath: pattern,
          size: stats.size,
          modified: stats.mtime,
        });
      } catch (error) {
        console.warn(`⚠️ Could not stat file ${filePath}:`, error.message);
      }
    }
  }
  
  if (discoveredFiles.length > 0) {
    console.log(`  ✓ ${appName}: Found ${discoveredFiles.length} content file(s)`);
  }
  
  return {
    appName,
    appDir,
    files: discoveredFiles,
  };
}

/**
 * Parse a JSON content file
 * @param {string} filePath - Path to JSON file
 * @returns {Object|null} Parsed content or null on error
 */
function parseContentFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}

/**
 * Normalize content structure to common format
 * @param {Object} content - Raw content from file
 * @param {string} source - Source identifier (e.g., "learn-jee")
 * @returns {Object} Normalized content with courses, modules, lessons, etc.
 */
function normalizeContent(content, source) {
  const normalized = {
    courses: [],
    modules: [],
    lessons: [],
    profiles: [],
    questions: [],
  };
  
  // Handle different content structures
  if (Array.isArray(content)) {
    // If content is an array, assume it's courses
    normalized.courses = content;
  } else if (typeof content === 'object') {
    // Merge structured content
    if (content.courses) normalized.courses = content.courses;
    if (content.modules) normalized.modules = content.modules;
    if (content.lessons) normalized.lessons = content.lessons;
    if (content.profiles) normalized.profiles = content.profiles;
    if (content.questions) normalized.questions = content.questions;
  }
  
  // Add source metadata to all items
  const addSourceMetadata = (items) => {
    return items.map(item => ({
      ...item,
      _discoveredFrom: source,
      _discoveredAt: new Date().toISOString(),
    }));
  };
  
  return {
    courses: addSourceMetadata(normalized.courses),
    modules: addSourceMetadata(normalized.modules),
    lessons: addSourceMetadata(normalized.lessons),
    profiles: addSourceMetadata(normalized.profiles),
    questions: addSourceMetadata(normalized.questions),
  };
}

/**
 * Discover and aggregate all content from learn-* apps
 * @param {Object} options - Discovery options
 * @returns {Object} Aggregated content from all discovered sources
 */
export async function discoverAllContent(options = {}) {
  const { forceRefresh = false } = options;
  
  // Check cache
  if (!forceRefresh && contentCache && cacheTimestamp) {
    const cacheAge = Date.now() - cacheTimestamp;
    if (cacheAge < CACHE_TTL) {
      console.log(`📦 Using cached discovered content (age: ${Math.round(cacheAge / 1000)}s)`);
      return contentCache;
    }
  }
  
  console.log('🔍 Starting content discovery across all learn-* apps...');
  
  const learnApps = findLearnAppDirectories();
  const allContent = {
    courses: [],
    modules: [],
    lessons: [],
    profiles: [],
    questions: [],
    _metadata: {
      discoveredAt: new Date().toISOString(),
      totalAppsScanned: learnApps.length,
      totalFilesFound: 0,
      sources: [],
    },
  };
  
  for (const appDir of learnApps) {
    const discovered = discoverContentInApp(appDir);
    
    if (discovered.files.length === 0) {
      continue;
    }
    
    // Parse each discovered file
    for (const file of discovered.files) {
      const content = parseContentFile(file.path);
      
      if (!content) {
        continue;
      }
      
      const normalized = normalizeContent(content, discovered.appName);
      
      // Merge into aggregated content
      allContent.courses.push(...normalized.courses);
      allContent.modules.push(...normalized.modules);
      allContent.lessons.push(...normalized.lessons);
      allContent.profiles.push(...normalized.profiles);
      allContent.questions.push(...normalized.questions);
      
      allContent._metadata.totalFilesFound++;
      allContent._metadata.sources.push({
        app: discovered.appName,
        file: file.relativePath,
        size: file.size,
        modified: file.modified,
        itemCounts: {
          courses: normalized.courses.length,
          modules: normalized.modules.length,
          lessons: normalized.lessons.length,
          profiles: normalized.profiles.length,
          questions: normalized.questions.length,
        },
      });
    }
  }
  
  console.log(`✅ Content discovery complete:`);
  console.log(`   - Apps scanned: ${allContent._metadata.totalAppsScanned}`);
  console.log(`   - Files found: ${allContent._metadata.totalFilesFound}`);
  console.log(`   - Courses: ${allContent.courses.length}`);
  console.log(`   - Modules: ${allContent.modules.length}`);
  console.log(`   - Lessons: ${allContent.lessons.length}`);
  console.log(`   - Profiles: ${allContent.profiles.length}`);
  console.log(`   - Questions: ${allContent.questions.length}`);
  
  // Update cache
  contentCache = allContent;
  cacheTimestamp = Date.now();
  
  return allContent;
}

/**
 * Get discovered content for a specific app
 * @param {string} appName - Name of the app (e.g., "learn-jee")
 * @returns {Object} Content from specified app
 */
export async function getAppContent(appName) {
  const allContent = await discoverAllContent();
  
  const filterByApp = (items) => {
    return items.filter(item => item._discoveredFrom === appName);
  };
  
  return {
    courses: filterByApp(allContent.courses),
    modules: filterByApp(allContent.modules),
    lessons: filterByApp(allContent.lessons),
    profiles: filterByApp(allContent.profiles),
    questions: filterByApp(allContent.questions),
  };
}

/**
 * Get list of all apps with discovered content
 * @returns {Array<string>} Array of app names
 */
export async function getAppsWithContent() {
  const allContent = await discoverAllContent();
  return allContent._metadata.sources.map(s => s.app);
}

/**
 * Clear the discovery cache (force next call to re-scan)
 */
export function clearDiscoveryCache() {
  contentCache = null;
  cacheTimestamp = null;
  console.log('🗑️ Discovery cache cleared');
}

/**
 * Get discovery metadata
 * @returns {Object} Metadata about discovered content
 */
export async function getDiscoveryMetadata() {
  const allContent = await discoverAllContent();
  return allContent._metadata;
}
