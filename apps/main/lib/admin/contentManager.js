/**
 * ContentManager - Universal service to manage content across all apps
 * Abstracts filesystem vs Supabase logic
 */

const fs = require('fs');
const path = require('path');
const { APP_REGISTRY } = require('./contentRegistry');

class ContentManager {
  constructor(isDev) {
    this.isDevelopment = isDev !== undefined ? isDev : process.env.NODE_ENV === 'development';
    this.projectRoot = process.cwd();
    
    // If we're in apps/main, go up two levels to the monorepo root
    if (this.projectRoot.endsWith('/apps/main')) {
      this.projectRoot = path.join(this.projectRoot, '..', '..');
    }
  }

  async getContent(sourceApp, contentId) {
    const appSchema = APP_REGISTRY[sourceApp];
    if (!appSchema) {
      throw new Error(`Unknown app: ${sourceApp}`);
    }

    const content = await this.loadAppContent(appSchema);
    const item = content.find((c) => c.id === contentId);
    return item || null;
  }

  async getAllContent(sourceApp) {
    const appSchema = APP_REGISTRY[sourceApp];
    if (!appSchema) {
      throw new Error(`Unknown app: ${sourceApp}`);
    }

    return this.loadAppContent(appSchema);
  }

  async searchAllContent(query) {
    const allApps = Object.values(APP_REGISTRY);
    const results = [];

    for (const app of allApps) {
      try {
        const content = await this.loadAppContent(app);
        const matches = content.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            (item.data.description &&
              item.data.description.toLowerCase().includes(query.toLowerCase()))
        );
        results.push(...matches);
      } catch (error) {
        console.error(`Error searching ${app.id}:`, error);
      }
    }

    return results;
  }

  /**
   * Get all content from all apps (aggregated from all sources)
   */
  async getAllContentFromAllApps() {
    const allApps = Object.values(APP_REGISTRY);
    const allContent = [];
    const seenIds = new Map(); // For deduplication

    // First, load seed data if it exists
    try {
      const seedPath = path.join(this.projectRoot, 'seeds', 'content.json');
      if (fs.existsSync(seedPath)) {
        const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));
        
        // Add courses from seed data
        if (seedData.courses && Array.isArray(seedData.courses)) {
          seedData.courses.forEach(course => {
            const item = {
              id: course.id || course.slug,
              appId: course.subdomain || 'seed-data',
              title: course.title,
              type: 'Course',
              data: course,
              source: 'filesystem',
              sourceApp: course.subdomain || 'seed-data',
              sourceBackend: 'filesystem',
            };
            this._addWithDeduplication(allContent, seenIds, item);
          });
        }
        
        // Add modules from seed data
        if (seedData.modules && Array.isArray(seedData.modules)) {
          seedData.modules.forEach(module => {
            const item = {
              id: module.id || module.slug,
              appId: module.subdomain || 'seed-data',
              title: module.title,
              type: 'Module',
              data: module,
              source: 'filesystem',
              sourceApp: module.subdomain || 'seed-data',
              sourceBackend: 'filesystem',
            };
            this._addWithDeduplication(allContent, seenIds, item);
          });
        }
        
        // Add lessons from seed data
        if (seedData.lessons && Array.isArray(seedData.lessons)) {
          seedData.lessons.forEach(lesson => {
            const item = {
              id: lesson.id,
              appId: lesson.subdomain || 'seed-data',
              title: lesson.title,
              type: 'Lesson',
              data: lesson,
              source: 'filesystem',
              sourceApp: lesson.subdomain || 'seed-data',
              sourceBackend: 'filesystem',
            };
            this._addWithDeduplication(allContent, seenIds, item);
          });
        }
      }
    } catch (error) {
      console.error('Error loading seed data:', error);
    }

    // Then load from each app
    for (const app of allApps) {
      try {
        const content = await this.loadAppContent(app);
        content.forEach(item => {
          this._addWithDeduplication(allContent, seenIds, item);
        });
      } catch (error) {
        console.error(`Error loading content from ${app.id}:`, error);
      }
    }

    return allContent;
  }

  /**
   * Add item with deduplication - if item with same ID and app exists,
   * merge sources instead of duplicating
   */
  _addWithDeduplication(allContent, seenIds, item) {
    const key = `${item.appId || item.sourceApp}-${item.id}`;
    
    if (seenIds.has(key)) {
      // Item already exists, merge source information
      const existingItem = seenIds.get(key);
      if (!existingItem.sources) {
        existingItem.sources = [existingItem.sourceBackend];
      }
      if (!existingItem.sources.includes(item.sourceBackend)) {
        existingItem.sources.push(item.sourceBackend);
      }
    } else {
      // New item, add it
      allContent.push(item);
      seenIds.set(key, item);
    }
  }

  /**
   * Infer content type from item data and metadata
   */
  _inferContentType(item, fileName, appSchema) {
    // If type is explicitly set and recognized, use it
    if (item.type) {
      const normalizedType = item.type.toLowerCase();
      if (normalizedType === 'course' || normalizedType === 'module' || normalizedType === 'lesson') {
        return item.type.charAt(0).toUpperCase() + normalizedType.slice(1);
      }
    }
    
    // Infer from data structure
    if (item.lesson_id || item.lessonId || item.module_id || item.moduleId) {
      return 'Lesson';
    }
    
    if (item.course_id || item.courseId || item.modules || (item.lessons && Array.isArray(item.lessons))) {
      return 'Module';
    }
    
    if (item.slug || item.subdomain || (item.category && item.duration)) {
      return 'Course';
    }
    
    // Infer from file name
    if (fileName) {
      const lowerFileName = fileName.toLowerCase();
      if (lowerFileName.includes('lesson')) return 'Lesson';
      if (lowerFileName.includes('module')) return 'Module';
      if (lowerFileName.includes('course') || lowerFileName.includes('curriculum')) return 'Course';
    }
    
    // Default to treating as course-level content for learning apps
    if (appSchema && appSchema.id.startsWith('learn-')) {
      return 'Course';
    }
    
    // Otherwise use the app display name
    return appSchema ? appSchema.displayName : 'Content';
  }

  /**
   * Get all courses (type=Course) from all apps and Supabase
   */
  async getAllCourses() {
    const allContent = await this.getAllContentFromAllApps();
    
    // Filter for courses - check various indicators
    return allContent.filter((item) => {
      // Normalize type for comparison
      const itemType = (item.type || '').toLowerCase();
      
      // Check if type explicitly says Course
      if (itemType === 'course') return true;
      
      // Exclude items that are clearly modules or lessons
      if (itemType === 'module' || itemType === 'lesson') return false;
      if (item.data.course_id || item.data.courseId) return false; // This is a module/lesson
      if (item.data.module_id || item.data.moduleId) return false; // This is a lesson
      
      // Check for course-like properties
      const hasCourseProps = (
        item.data.slug || 
        (item.data.category && (item.data.duration || item.data.full_description)) ||
        item.data.subdomain ||
        item.data.modules || // Has sub-modules
        // If it's from a learn-* app and doesn't have parent references, treat as course
        (item.sourceApp && item.sourceApp.startsWith('learn-') && !item.data.course_id && !item.data.module_id)
      );
      
      return hasCourseProps;
    });
  }

  /**
   * Get all modules from all apps
   */
  async getAllModules() {
    const allContent = await this.getAllContentFromAllApps();
    return allContent.filter((item) => {
      const itemType = (item.type || '').toLowerCase();
      return (
        itemType === 'module' || 
        item.data.module_id ||
        item.data.moduleId ||
        item.data.course_id || // Module belongs to a course
        item.data.courseId
      );
    });
  }

  /**
   * Get all lessons from all apps
   */
  async getAllLessons() {
    const allContent = await this.getAllContentFromAllApps();
    return allContent.filter((item) => {
      const itemType = (item.type || '').toLowerCase();
      return (
        itemType === 'lesson' ||
        item.data.lesson_id ||
        item.data.lessonId ||
        (item.data.module_id && !item.data.modules) || // Belongs to module but has no sub-modules
        (item.data.moduleId && !item.data.modules)
      );
    });
  }

  async saveContent(sourceApp, contentId, data) {
    const appSchema = APP_REGISTRY[sourceApp];
    if (!appSchema) {
      throw new Error(`Unknown app: ${sourceApp}`);
    }

    if (this.isDevelopment) {
      return this.saveToFileSystem(appSchema, contentId, data);
    } else {
      return this.saveToSupabase(appSchema, contentId, data);
    }
  }

  async createContent(sourceApp, data) {
    const appSchema = APP_REGISTRY[sourceApp];
    if (!appSchema) {
      throw new Error(`Unknown app: ${sourceApp}`);
    }

    const contentId = data.id || this.generateId(sourceApp);
    return this.saveContent(sourceApp, contentId, data);
  }

  async deleteContent(sourceApp, contentId) {
    const appSchema = APP_REGISTRY[sourceApp];
    if (!appSchema) {
      throw new Error(`Unknown app: ${sourceApp}`);
    }

    if (this.isDevelopment) {
      return this.deleteFromFileSystem(appSchema, contentId);
    } else {
      return this.deleteFromSupabase(appSchema, contentId);
    }
  }

  async loadAppContent(appSchema) {
    // AGGREGATION MODE: Load from BOTH filesystem AND Supabase
    const filesystemContent = [];
    const supabaseContent = [];
    
    try {
      const fsContent = await this.loadFromFileSystem(appSchema);
      filesystemContent.push(...fsContent);
    } catch (error) {
      console.error(`Error loading from filesystem for ${appSchema.id}:`, error);
    }
    
    try {
      const sbContent = await this.loadFromSupabase(appSchema);
      supabaseContent.push(...sbContent);
    } catch (error) {
      console.error(`Error loading from Supabase for ${appSchema.id}:`, error);
    }
    
    // Merge both sources
    return [...filesystemContent, ...supabaseContent];
  }

  async loadFromFileSystem(appSchema) {
    const items = [];
    const filePath = path.join(this.projectRoot, appSchema.dataPath);

    // Load from the primary data path
    if (appSchema.contentType === 'json') {
      items.push(...this.loadJsonContent(appSchema, filePath));
    } else if (appSchema.contentType === 'markdown') {
      items.push(...this.loadMarkdownContent(appSchema, filePath));
    } else {
      items.push(...this.loadTypescriptContent(appSchema, filePath));
    }
    
    // Also scan for additional content directories (data/, content/)
    const appDir = path.join(this.projectRoot, 'apps', appSchema.id);
    const additionalDirs = ['data', 'content'];
    
    for (const dirName of additionalDirs) {
      const dirPath = path.join(appDir, dirName);
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        try {
          const scannedItems = this.scanContentDirectory(appSchema, dirPath);
          items.push(...scannedItems);
        } catch (error) {
          console.error(`Error scanning ${dirPath}:`, error);
        }
      }
    }
    
    return items;
  }

  loadJsonContent(appSchema, filePath) {
    try {
      const stats = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
      
      if (stats && stats.isDirectory()) {
        // Recursively scan directory for JSON files
        const items = [];
        const scanDirectory = (dir) => {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          
          for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            
            if (entry.isDirectory()) {
              // Recursively scan subdirectories
              scanDirectory(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.json')) {
              try {
                const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
                const fileName = entry.name.replace('.json', '');
                
                if (Array.isArray(content)) {
                  items.push(...content.map((item, idx) => ({
                    id: item.id || `${fileName}-${idx}`,
                    appId: appSchema.id,
                    title: item.title || item.name || `Item ${idx}`,
                    type: appSchema.displayName,
                    data: item,
                    source: 'filesystem',
                    sourceApp: appSchema.id,
                    sourceBackend: 'filesystem',
                  })));
                } else if (typeof content === 'object' && content !== null) {
                  if (content.items && Array.isArray(content.items)) {
                    // Handle manifest.json style with items array
                    items.push(...content.items.map((item) => ({
                      id: item.id || item.slug,
                      appId: appSchema.id,
                      title: item.title || item.name,
                      type: appSchema.displayName,
                      data: item,
                      source: 'filesystem',
                      sourceApp: appSchema.id,
                      sourceBackend: 'filesystem',
                    })));
                  } else {
                    // Handle object with key-value pairs
                    items.push(...Object.entries(content).map((entry) => ({
                      id: entry[0],
                      appId: appSchema.id,
                      title: entry[1].title || entry[0],
                      type: appSchema.displayName,
                      data: entry[1],
                      source: 'filesystem',
                      sourceApp: appSchema.id,
                      sourceBackend: 'filesystem',
                    })));
                  }
                }
              } catch (err) {
                console.error(`Error reading ${fullPath}:`, err);
              }
            }
          }
        };
        
        scanDirectory(filePath);
        return items;
      } else if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        if (Array.isArray(content)) {
          return content.map((item, idx) => ({
            id: item.id || `${appSchema.id}-${idx}`,
            appId: appSchema.id,
            title: item.title || item.name || `Item ${idx}`,
            type: appSchema.displayName,
            data: item,
            source: 'filesystem',
            sourceApp: appSchema.id,
            sourceBackend: 'filesystem',
          }));
        } else if (content.items && Array.isArray(content.items)) {
          return content.items.map((item) => ({
            id: item.id || item.slug,
            appId: appSchema.id,
            title: item.title || item.name,
            type: appSchema.displayName,
            data: item,
            source: 'filesystem',
            sourceApp: appSchema.id,
            sourceBackend: 'filesystem',
          }));
        }
      }

      return [];
    } catch (error) {
      console.error(`Error loading JSON from ${filePath}:`, error);
      return [];
    }
  }

  loadMarkdownContent(appSchema, filePath) {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const sections = content.split(/^##\s+/m).filter(s => s.trim());
        
        return sections.map((section, idx) => {
          const lines = section.split('\n');
          const title = lines[0].trim();
          const body = lines.slice(1).join('\n').trim();
          
          return {
            id: `${appSchema.id}-${idx}`,
            appId: appSchema.id,
            title,
            type: appSchema.displayName,
            data: {
              content: body,
              markdown: section,
            },
            source: 'filesystem',
            sourceApp: appSchema.id,
            sourceBackend: 'filesystem',
          };
        });
      }

      return [];
    } catch (error) {
      console.error(`Error loading Markdown from ${filePath}:`, error);
      return [];
    }
  }

  loadTypescriptContent(appSchema, filePath) {
    return [];
  }

  /**
   * Scan a content directory for JSON, JS, MD, YAML files
   * Used to discover additional content in data/ and content/ directories
   */
  scanContentDirectory(appSchema, dirPath) {
    const items = [];
    
    const scanRecursive = (dir) => {
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          
          if (entry.isDirectory()) {
            // Recursively scan subdirectories
            scanRecursive(fullPath);
          } else if (entry.isFile()) {
            try {
              if (entry.name.endsWith('.json')) {
                // Parse JSON files
                const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
                items.push(...this.parseContentData(appSchema, content, entry.name, fullPath));
              } else if (entry.name.endsWith('.js') || entry.name.endsWith('.ts')) {
                // Handle JS/TS files with exported data
                try {
                  const fileContent = fs.readFileSync(fullPath, 'utf-8');
                  
                  // For TypeScript files, try to extract exported const data
                  if (entry.name.endsWith('.ts')) {
                    // Match: export const variableName = { ... };
                    const tsMatches = fileContent.matchAll(/export\s+const\s+(\w+)\s*[:=]\s*(\{[\s\S]*?\n\};?)/g);
                    
                    for (const match of tsMatches) {
                      const varName = match[1];
                      const objectStr = match[2];
                      
                      try {
                        // Remove type annotations and convert to valid JSON
                        let jsonStr = objectStr
                          // Remove trailing semicolon
                          .replace(/;$/, '')
                          // Remove type annotations like: key: Type = value
                          .replace(/:\s*[A-Z]\w+(\[\])?\s*=/g, ':')
                          // Remove interface references
                          .replace(/as\s+\w+/g, '')
                          // Handle nested objects and arrays more carefully
                          .trim();
                        
                        // Try to evaluate as JS object (safer than eval)
                        const evalFunc = new Function('return ' + jsonStr);
                        const data = evalFunc();
                        
                        if (data && typeof data === 'object') {
                          items.push(...this.parseContentData(appSchema, data, `${entry.name}-${varName}`, fullPath));
                        }
                      } catch (parseError) {
                        console.log(`Could not parse TypeScript export ${varName} from ${fullPath}: ${parseError.message}`);
                      }
                    }
                  } else {
                    // JavaScript files
                    // Extract the main data object from exports
                    // Look for: export const variableName = { ... }
                    const match = fileContent.match(/export\s+const\s+(\w+)\s*=\s*(\{[\s\S]*?\n\};)/);
                    
                    if (match) {
                      try {
                        // Extract just the object part
                        const objectStr = match[2];
                        // Use Function to safely evaluate the object
                        // This is safer than eval as it doesn't have access to local scope
                        const evalFunc = new Function('return ' + objectStr);
                        const data = evalFunc();
                        
                        if (data && typeof data === 'object') {
                          items.push(...this.parseContentData(appSchema, data, entry.name, fullPath));
                        }
                      } catch (parseError) {
                        console.log(`Could not parse data from ${fullPath}: ${parseError.message}`);
                      }
                    }
                  }
                } catch (fileError) {
                  console.error(`Error reading ${fullPath}:`, fileError.message);
                }
              } else if (entry.name.endsWith('.md')) {
                // Skip documentation files (README, CONTENT, etc.)
                const skipFiles = ['README', 'CONTENT', 'CHANGELOG', 'LICENSE', 'CONTRIBUTING'];
                const shouldSkip = skipFiles.some(skip => 
                  entry.name.toUpperCase().startsWith(skip)
                );
                
                if (!shouldSkip) {
                  // Parse markdown files
                  const content = fs.readFileSync(fullPath, 'utf-8');
                  const sections = content.split(/^##\s+/m).filter(s => s.trim());
                  
                  sections.forEach((section, idx) => {
                    const lines = section.split('\n');
                    const title = lines[0].trim();
                    const body = lines.slice(1).join('\n').trim();
                    
                    if (title && body) {
                      items.push({
                        id: `${appSchema.id}-md-${entry.name}-${idx}`,
                        appId: appSchema.id,
                        title,
                        type: appSchema.displayName,
                        data: { content: body, markdown: section, file: entry.name },
                        source: 'filesystem',
                        sourceApp: appSchema.id,
                        sourceBackend: 'filesystem',
                      });
                    }
                  });
                }
              }
            } catch (fileError) {
              console.error(`Error processing ${fullPath}:`, fileError.message);
            }
          }
        }
      } catch (dirError) {
        console.error(`Error scanning directory ${dir}:`, dirError);
      }
    };
    
    scanRecursive(dirPath);
    
    return items;
  }

  /**
   * Parse content data from various formats into unified structure
   */
  parseContentData(appSchema, data, fileName, filePath) {
    const items = [];
    
    try {
      if (Array.isArray(data)) {
        // Direct array of items
        items.push(...data.map((item, idx) => ({
          id: item.id || `${appSchema.id}-${fileName}-${idx}`,
          appId: appSchema.id,
          title: item.title || item.name || `Item ${idx}`,
          type: this._inferContentType(item, fileName, appSchema),
          data: item,
          source: 'filesystem',
          sourceApp: appSchema.id,
          sourceBackend: 'filesystem',
        })));
      } else if (typeof data === 'object' && data !== null) {
        // Handle special structures
        if (data.items && Array.isArray(data.items)) {
          // Manifest-style with items array
          items.push(...data.items.map((item) => ({
            id: item.id || item.slug,
            appId: appSchema.id,
            title: item.title || item.name,
            type: this._inferContentType(item, fileName, appSchema),
            data: item,
            source: 'filesystem',
            sourceApp: appSchema.id,
            sourceBackend: 'filesystem',
          })));
        } else if (data.levels && Array.isArray(data.levels)) {
          // Physics curriculum structure
          data.levels.forEach((level) => {
            if (level.modules && Array.isArray(level.modules)) {
              level.modules.forEach((module) => {
                items.push({
                  id: module.id || `${appSchema.id}-module-${module.name}`,
                  appId: appSchema.id,
                  title: module.name || module.title,
                  type: 'Module',
                  data: {
                    ...module,
                    level: level.name,
                    levelId: level.id,
                  },
                  source: 'filesystem',
                  sourceApp: appSchema.id,
                  sourceBackend: 'filesystem',
                });
                
                // Also add lessons within modules
                if (module.lessons && Array.isArray(module.lessons)) {
                  module.lessons.forEach((lesson) => {
                    items.push({
                      id: lesson.id || `${module.id}-${lesson.title}`,
                      appId: appSchema.id,
                      title: lesson.title,
                      type: 'Lesson',
                      data: {
                        ...lesson,
                        moduleId: module.id,
                        moduleName: module.name,
                        level: level.name,
                      },
                      source: 'filesystem',
                      sourceApp: appSchema.id,
                      sourceBackend: 'filesystem',
                    });
                  });
                }
              });
            }
          });
        } else if (data.courses && Array.isArray(data.courses)) {
          // Seed data structure
          items.push(...data.courses.map((course) => ({
            id: course.id || course.slug,
            appId: appSchema.id,
            title: course.title,
            type: 'Course',
            data: course,
            source: 'filesystem',
            sourceApp: appSchema.id,
            sourceBackend: 'filesystem',
          })));
          
          if (data.modules) {
            items.push(...data.modules.map((module) => ({
              id: module.id || module.slug,
              appId: appSchema.id,
              title: module.title,
              type: 'Module',
              data: module,
              source: 'filesystem',
              sourceApp: appSchema.id,
              sourceBackend: 'filesystem',
            })));
          }
          
          if (data.lessons) {
            items.push(...data.lessons.map((lesson) => ({
              id: lesson.id,
              appId: appSchema.id,
              title: lesson.title,
              type: 'Lesson',
              data: lesson,
              source: 'filesystem',
              sourceApp: appSchema.id,
              sourceBackend: 'filesystem',
            })));
          }
        } else {
          // Generic object with key-value pairs
          const keys = Object.keys(data);
          // Only process if it looks like content data
          if (keys.length > 0 && keys.length < 100) {
            Object.entries(data).forEach(([key, value]) => {
              if (typeof value === 'object' && value !== null) {
                items.push({
                  id: key,
                  appId: appSchema.id,
                  title: value.title || value.name || key,
                  type: this._inferContentType(value, fileName, appSchema),
                  data: value,
                  source: 'filesystem',
                  sourceApp: appSchema.id,
                  sourceBackend: 'filesystem',
                });
              }
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error parsing content from ${fileName}:`, error);
    }
    
    return items;
  }

  async loadFromSupabase(appSchema) {
    try {
      // Import supabase client - use dynamic import to avoid issues
      const { createClient } = require('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
      
      // Skip if Supabase not configured
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
        return [];
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Fetch courses from Supabase for this app (matching by subdomain)
      const { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .eq('subdomain', appSchema.id);
      
      if (error) {
        console.error(`Supabase error for ${appSchema.id}:`, error);
        return [];
      }
      
      // Transform courses to unified format
      return (courses || []).map((course) => ({
        id: course.id || course.slug,
        appId: appSchema.id,
        title: course.title,
        type: 'Course',
        data: course,
        source: 'supabase',
        sourceApp: appSchema.id,
        sourceBackend: 'supabase',
      }));
    } catch (error) {
      console.error(`Error loading from Supabase for ${appSchema.id}:`, error);
      return [];
    }
  }

  saveToFileSystem(appSchema, contentId, data) {
    const filePath = path.join(this.projectRoot, appSchema.dataPath);

    if (appSchema.contentType === 'json') {
      const existingContent = this.loadJsonContent(appSchema, filePath);
      
      const index = existingContent.findIndex(item => item.id === contentId);
      if (index >= 0) {
        existingContent[index].data = data;
      } else {
        existingContent.push({
          id: contentId,
          appId: appSchema.id,
          title: data.title,
          type: appSchema.displayName,
          data,
          source: 'filesystem',
        });
      }

      const contentToSave = existingContent.map(item => item.data);
      fs.writeFileSync(filePath, JSON.stringify(contentToSave, null, 2));

      return {
        id: contentId,
        appId: appSchema.id,
        title: data.title,
        type: appSchema.displayName,
        data,
        source: 'filesystem',
      };
    }

    throw new Error(`Saving ${appSchema.contentType} not yet implemented`);
  }

  async saveToSupabase(appSchema, contentId, data) {
    throw new Error('Supabase saving not yet implemented');
  }

  deleteFromFileSystem(appSchema, contentId) {
    const filePath = path.join(this.projectRoot, appSchema.dataPath);

    if (appSchema.contentType === 'json') {
      const existingContent = this.loadJsonContent(appSchema, filePath);
      const filtered = existingContent.filter(item => item.id !== contentId);
      
      const contentToSave = filtered.map(item => item.data);
      fs.writeFileSync(filePath, JSON.stringify(contentToSave, null, 2));
      
      return true;
    }

    return false;
  }

  async deleteFromSupabase(appSchema, contentId) {
    return false;
  }

  generateId(sourceApp) {
    return `${sourceApp}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = { ContentManager };
