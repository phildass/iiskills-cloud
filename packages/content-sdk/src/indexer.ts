/**
 * Content Indexer
 * Scans app directories and builds content manifests
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  ContentManifest,
  UnifiedContent,
  MetaIndex,
  ContentType
} from '@iiskills/schema';

export interface IndexerOptions {
  /** Root directory of the monorepo */
  rootDir: string;
  
  /** Apps directory relative to root */
  appsDir?: string;
  
  /** Output directory for manifests */
  outputDir?: string;
  
  /** Apps to include (if not specified, scans all) */
  includeApps?: string[];
  
  /** Apps to exclude */
  excludeApps?: string[];
}

export class ContentIndexer {
  private options: Required<IndexerOptions>;
  
  constructor(options: IndexerOptions) {
    this.options = {
      rootDir: options.rootDir,
      appsDir: options.appsDir || 'apps',
      outputDir: options.outputDir || 'packages/content-sdk',
      includeApps: options.includeApps || [],
      excludeApps: options.excludeApps || []
    };
  }
  
  /**
   * Scan all apps and build manifests
   */
  async indexAll(): Promise<MetaIndex> {
    const appsPath = path.join(this.options.rootDir, this.options.appsDir);
    
    if (!fs.existsSync(appsPath)) {
      throw new Error(`Apps directory not found: ${appsPath}`);
    }
    
    const apps = fs.readdirSync(appsPath)
      .filter(dir => {
        const stat = fs.statSync(path.join(appsPath, dir));
        return stat.isDirectory();
      })
      .filter(dir => {
        if (this.options.includeApps.length > 0) {
          return this.options.includeApps.includes(dir);
        }
        return !this.options.excludeApps.includes(dir);
      });
    
    const manifests: ContentManifest[] = [];
    const statistics: Record<ContentType, number> = {
      job: 0,
      lesson: 0,
      test: 0,
      module: 0,
      sports: 0,
      article: 0,
      quiz: 0,
      video: 0,
      other: 0
    };
    
    for (const appId of apps) {
      try {
        const manifest = await this.indexApp(appId);
        manifests.push(manifest);
        
        // Update statistics
        manifest.content.forEach(item => {
          statistics[item.type] = (statistics[item.type] || 0) + 1;
        });
      } catch (error) {
        console.warn(`Failed to index app ${appId}:`, error);
      }
    }
    
    const metaIndex: MetaIndex = {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      apps: manifests.map(m => ({
        appId: m.appId,
        appName: m.appName,
        contentCount: m.content.length,
        manifestPath: `${this.options.outputDir}/manifests/${m.appId}/manifest.json`
      })),
      statistics: {
        totalApps: manifests.length,
        totalContent: manifests.reduce((sum, m) => sum + m.content.length, 0),
        contentByType: statistics
      }
    };
    
    // Save meta-index
    await this.saveMetaIndex(metaIndex);
    
    // Save individual manifests
    for (const manifest of manifests) {
      await this.saveManifest(manifest);
    }
    
    return metaIndex;
  }
  
  /**
   * Index a single app
   */
  async indexApp(appId: string): Promise<ContentManifest> {
    const appPath = path.join(this.options.rootDir, this.options.appsDir, appId);
    
    // Try to read existing manifest first
    const manifestPath = path.join(appPath, 'content-manifest.json');
    if (fs.existsSync(manifestPath)) {
      const data = fs.readFileSync(manifestPath, 'utf-8');
      return JSON.parse(data);
    }
    
    // Otherwise, try to discover content
    const content = await this.discoverContent(appPath, appId);
    
    const manifest: ContentManifest = {
      appId,
      appName: this.getAppName(appId),
      description: this.getAppDescription(appId),
      content,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0'
    };
    
    return manifest;
  }
  
  /**
   * Discover content in an app directory
   */
  private async discoverContent(appPath: string, appId: string): Promise<UnifiedContent[]> {
    const content: UnifiedContent[] = [];
    
    // Try to find content in common locations
    const contentDirs = ['content', 'data', 'lessons', 'tests', 'modules'];
    
    for (const dir of contentDirs) {
      const dirPath = path.join(appPath, dir);
      if (fs.existsSync(dirPath)) {
        const items = await this.scanDirectory(dirPath, appId);
        content.push(...items);
      }
    }
    
    return content;
  }
  
  /**
   * Scan a directory for content files
   */
  private async scanDirectory(dirPath: string, appId: string): Promise<UnifiedContent[]> {
    const content: UnifiedContent[] = [];
    
    try {
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          const subContent = await this.scanDirectory(filePath, appId);
          content.push(...subContent);
        } else if (file.endsWith('.json') || file.endsWith('.md')) {
          const item = await this.parseContentFile(filePath, appId);
          if (item) {
            content.push(item);
          }
        }
      }
    } catch (error) {
      console.warn(`Error scanning directory ${dirPath}:`, error);
    }
    
    return content;
  }
  
  /**
   * Parse a content file into UnifiedContent
   */
  private async parseContentFile(filePath: string, appId: string): Promise<UnifiedContent | null> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const fileName = path.basename(filePath, path.extname(filePath));
      
      if (filePath.endsWith('.json')) {
        const data = JSON.parse(content);
        
        // Try to infer content type
        const type = this.inferContentType(data, appId);
        
        return {
          id: data.id || fileName,
          type,
          title: data.title || fileName,
          description: data.description,
          tags: data.tags,
          metadata: data,
          appId,
          url: filePath
        };
      } else if (filePath.endsWith('.md')) {
        // Parse markdown metadata
        const lines = content.split('\n');
        const title = lines[0]?.replace(/^#\s*/, '') || fileName;
        
        return {
          id: fileName,
          type: this.inferContentTypeFromPath(filePath, appId),
          title,
          description: lines.slice(1, 3).join(' ').trim(),
          appId,
          url: filePath
        };
      }
    } catch (error) {
      console.warn(`Error parsing file ${filePath}:`, error);
    }
    
    return null;
  }
  
  /**
   * Infer content type from data
   */
  private inferContentType(data: any, appId: string): ContentType {
    if (appId.includes('govt-jobs') || data.company || data.employmentType) {
      return 'job';
    }
    if (data.questions || data.testMode) {
      return 'test';
    }
    if (data.objectives || data.sections) {
      return 'lesson';
    }
    if (data.lessons || data.tests) {
      return 'module';
    }
    if (appId.includes('cricket') || appId.includes('sports')) {
      return 'sports';
    }
    
    return 'other';
  }
  
  /**
   * Infer content type from file path
   */
  private inferContentTypeFromPath(filePath: string, appId: string): ContentType {
    const lowerPath = filePath.toLowerCase();
    
    if (lowerPath.includes('test') || lowerPath.includes('quiz')) {
      return 'test';
    }
    if (lowerPath.includes('lesson')) {
      return 'lesson';
    }
    if (lowerPath.includes('module')) {
      return 'module';
    }
    if (appId.includes('govt-jobs')) {
      return 'job';
    }
    if (appId.includes('cricket') || appId.includes('sports')) {
      return 'sports';
    }
    
    return 'article';
  }
  
  /**
   * Get human-readable app name
   */
  private getAppName(appId: string): string {
    const nameMap: Record<string, string> = {
      'learn-apt': 'Aptitude Tests',
      'learn-jee': 'JEE Preparation',
      'learn-neet': 'NEET Preparation',
      'learn-ias': 'IAS Preparation',
      'learn-govt-jobs': 'Government Jobs',
      'learn-geography': 'Geography',
      'learn-math': 'Mathematics',
      'learn-physics': 'Physics',
      'learn-chemistry': 'Chemistry'
    };
    
    return nameMap[appId] || appId.replace('learn-', '').replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  /**
   * Get app description
   */
  private getAppDescription(appId: string): string {
    const descMap: Record<string, string> = {
      'learn-apt': 'Aptitude test content for various competitive exams',
      'learn-jee': 'JEE exam preparation content and practice tests',
      'learn-neet': 'NEET exam preparation content and practice tests',
      'learn-ias': 'IAS exam preparation content and study material',
      'learn-govt-jobs': 'Government job opportunities and eligibility information',
      'learn-geography': 'Geography lessons and general education',
      'learn-math': 'Mathematics lessons and practice problems'
    };
    
    return descMap[appId] || `Educational content for ${this.getAppName(appId)}`;
  }
  
  /**
   * Save meta-index to file
   */
  private async saveMetaIndex(metaIndex: MetaIndex): Promise<void> {
    const outputPath = path.join(
      this.options.rootDir,
      this.options.outputDir,
      'meta-index.json'
    );
    
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(metaIndex, null, 2));
  }
  
  /**
   * Save manifest to file
   */
  private async saveManifest(manifest: ContentManifest): Promise<void> {
    const outputPath = path.join(
      this.options.rootDir,
      this.options.outputDir,
      'manifests',
      manifest.appId,
      'manifest.json'
    );
    
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  }
}
