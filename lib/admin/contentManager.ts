/**
 * ContentManager - Universal service to manage content across all apps
 * Abstracts filesystem vs Supabase logic
 */

import fs from 'fs';
import path from 'path';
import { APP_REGISTRY, AppSchema } from './contentRegistry';

export interface ContentItem {
  id: string;
  appId: string;
  title: string;
  type: string;
  data: Record<string, any>;
  source: 'filesystem' | 'supabase';
}

export class ContentManager {
  private isDevelopment: boolean;
  private projectRoot: string;

  constructor(isDev = process.env.NODE_ENV === 'development') {
    this.isDevelopment = isDev;
    this.projectRoot = process.cwd();
  }

  /**
   * Get content from any app by source_app and content_id
   */
  async getContent(sourceApp: string, contentId: string): Promise<ContentItem | null> {
    const appSchema = APP_REGISTRY[sourceApp];
    if (!appSchema) {
      throw new Error(`Unknown app: ${sourceApp}`);
    }

    const content = await this.loadAppContent(appSchema);
    const item = content.find((c) => c.id === contentId);
    return item || null;
  }

  /**
   * Get all content from a specific app
   */
  async getAllContent(sourceApp: string): Promise<ContentItem[]> {
    const appSchema = APP_REGISTRY[sourceApp];
    if (!appSchema) {
      throw new Error(`Unknown app: ${sourceApp}`);
    }

    return this.loadAppContent(appSchema);
  }

  /**
   * Search content across all apps
   */
  async searchAllContent(query: string): Promise<ContentItem[]> {
    const allApps = Object.values(APP_REGISTRY);
    const results: ContentItem[] = [];

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
   * Save content (write to filesystem in dev, Supabase in prod)
   */
  async saveContent(sourceApp: string, contentId: string, data: Record<string, any>): Promise<ContentItem> {
    const appSchema = APP_REGISTRY[sourceApp];
    if (!appSchema) {
      throw new Error(`Unknown app: ${sourceApp}`);
    }

    if (this.isDevelopment) {
      // In development: write to local files
      return this.saveToFileSystem(appSchema, contentId, data);
    } else {
      // In production: save to Supabase (read-only for files)
      return this.saveToSupabase(appSchema, contentId, data);
    }
  }

  /**
   * Create new content
   */
  async createContent(sourceApp: string, data: Record<string, any>): Promise<ContentItem> {
    const appSchema = APP_REGISTRY[sourceApp];
    if (!appSchema) {
      throw new Error(`Unknown app: ${sourceApp}`);
    }

    const contentId = data.id || this.generateId(sourceApp);
    return this.saveContent(sourceApp, contentId, data);
  }

  /**
   * Delete content
   */
  async deleteContent(sourceApp: string, contentId: string): Promise<boolean> {
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

  /**
   * Load content from app (filesystem or Supabase)
   */
  private async loadAppContent(appSchema: AppSchema): Promise<ContentItem[]> {
    try {
      // Always try filesystem first for now
      return this.loadFromFileSystem(appSchema);
    } catch (error) {
      console.error(`Error loading from filesystem for ${appSchema.id}:`, error);
      // Fallback to Supabase if available
      return this.loadFromSupabase(appSchema);
    }
  }

  /**
   * Load from filesystem
   */
  private loadFromFileSystem(appSchema: AppSchema): ContentItem[] {
    const filePath = path.join(this.projectRoot, appSchema.dataPath);

    if (appSchema.contentType === 'json') {
      return this.loadJsonContent(appSchema, filePath);
    } else if (appSchema.contentType === 'markdown') {
      return this.loadMarkdownContent(appSchema, filePath);
    } else {
      return this.loadTypescriptContent(appSchema, filePath);
    }
  }

  /**
   * Load JSON content
   */
  private loadJsonContent(appSchema: AppSchema, filePath: string): ContentItem[] {
    try {
      // Check if path is a directory or file
      const stats = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
      
      if (stats?.isDirectory()) {
        // Load all JSON files from directory
        const files = fs.readdirSync(filePath).filter(f => f.endsWith('.json'));
        const items: ContentItem[] = [];
        
        for (const file of files) {
          const fullPath = path.join(filePath, file);
          const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
          
          // Handle different JSON structures
          if (Array.isArray(content)) {
            items.push(...content.map((item, idx) => ({
              id: item.id || `${file}-${idx}`,
              appId: appSchema.id,
              title: item.title || item.name || `Item ${idx}`,
              type: appSchema.displayName,
              data: item,
              source: 'filesystem' as const,
            })));
          } else if (typeof content === 'object') {
            // Handle object with keys as IDs (like deadlines.json)
            items.push(...Object.entries(content).map(([key, value]: [string, any]) => ({
              id: key,
              appId: appSchema.id,
              title: value.title || key,
              type: appSchema.displayName,
              data: value,
              source: 'filesystem' as const,
            })));
          }
        }
        
        return items;
      } else if (fs.existsSync(filePath)) {
        // Single file
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        if (Array.isArray(content)) {
          return content.map((item, idx) => ({
            id: item.id || `${appSchema.id}-${idx}`,
            appId: appSchema.id,
            title: item.title || item.name || `Item ${idx}`,
            type: appSchema.displayName,
            data: item,
            source: 'filesystem' as const,
          }));
        } else if (content.items && Array.isArray(content.items)) {
          // Handle manifest format with items array
          return content.items.map((item: any) => ({
            id: item.id || item.slug,
            appId: appSchema.id,
            title: item.title || item.name,
            type: appSchema.displayName,
            data: item,
            source: 'filesystem' as const,
          }));
        }
      }

      return [];
    } catch (error) {
      console.error(`Error loading JSON from ${filePath}:`, error);
      return [];
    }
  }

  /**
   * Load Markdown content
   */
  private loadMarkdownContent(appSchema: AppSchema, filePath: string): ContentItem[] {
    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        // Simple markdown parsing - split by headers
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
            source: 'filesystem' as const,
          };
        });
      }

      return [];
    } catch (error) {
      console.error(`Error loading Markdown from ${filePath}:`, error);
      return [];
    }
  }

  /**
   * Load TypeScript content
   */
  private loadTypescriptContent(appSchema: AppSchema, filePath: string): ContentItem[] {
    // For TypeScript files, we would need to dynamically import them
    // For now, return empty array
    return [];
  }

  /**
   * Load from Supabase
   */
  private async loadFromSupabase(appSchema: AppSchema): Promise<ContentItem[]> {
    // TODO: Implement Supabase loading
    // This would query the appropriate Supabase table based on app type
    return [];
  }

  /**
   * Save to filesystem
   */
  private saveToFileSystem(appSchema: AppSchema, contentId: string, data: Record<string, any>): ContentItem {
    const filePath = path.join(this.projectRoot, appSchema.dataPath);

    if (appSchema.contentType === 'json') {
      // Load existing content
      const existingContent = this.loadJsonContent(appSchema, filePath);
      
      // Find and update or add new
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

      // Write back to file
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

  /**
   * Save to Supabase
   */
  private async saveToSupabase(appSchema: AppSchema, contentId: string, data: Record<string, any>): Promise<ContentItem> {
    // TODO: Implement Supabase saving
    throw new Error('Supabase saving not yet implemented');
  }

  /**
   * Delete from filesystem
   */
  private deleteFromFileSystem(appSchema: AppSchema, contentId: string): boolean {
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

  /**
   * Delete from Supabase
   */
  private async deleteFromSupabase(appSchema: AppSchema, contentId: string): Promise<boolean> {
    // TODO: Implement Supabase deletion
    return false;
  }

  /**
   * Generate unique ID
   */
  private generateId(sourceApp: string): string {
    return `${sourceApp}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const contentManager = new ContentManager();
