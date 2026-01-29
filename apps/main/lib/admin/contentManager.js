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
    try {
      return this.loadFromFileSystem(appSchema);
    } catch (error) {
      console.error(`Error loading from filesystem for ${appSchema.id}:`, error);
      return this.loadFromSupabase(appSchema);
    }
  }

  loadFromFileSystem(appSchema) {
    const filePath = path.join(this.projectRoot, appSchema.dataPath);

    if (appSchema.contentType === 'json') {
      return this.loadJsonContent(appSchema, filePath);
    } else if (appSchema.contentType === 'markdown') {
      return this.loadMarkdownContent(appSchema, filePath);
    } else {
      return this.loadTypescriptContent(appSchema, filePath);
    }
  }

  loadJsonContent(appSchema, filePath) {
    try {
      const stats = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
      
      if (stats && stats.isDirectory()) {
        const files = fs.readdirSync(filePath).filter(f => f.endsWith('.json'));
        const items = [];
        
        for (const file of files) {
          const fullPath = path.join(filePath, file);
          const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
          
          if (Array.isArray(content)) {
            items.push(...content.map((item, idx) => ({
              id: item.id || `${file}-${idx}`,
              appId: appSchema.id,
              title: item.title || item.name || `Item ${idx}`,
              type: appSchema.displayName,
              data: item,
              source: 'filesystem',
            })));
          } else if (typeof content === 'object') {
            items.push(...Object.entries(content).map((entry) => ({
              id: entry[0],
              appId: appSchema.id,
              title: entry[1].title || entry[0],
              type: appSchema.displayName,
              data: entry[1],
              source: 'filesystem',
            })));
          }
        }
        
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
          }));
        } else if (content.items && Array.isArray(content.items)) {
          return content.items.map((item) => ({
            id: item.id || item.slug,
            appId: appSchema.id,
            title: item.title || item.name,
            type: appSchema.displayName,
            data: item,
            source: 'filesystem',
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

  async loadFromSupabase(appSchema) {
    return [];
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
