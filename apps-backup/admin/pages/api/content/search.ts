/**
 * Content Search API Endpoint
 * 
 * This endpoint demonstrates how to search and filter content
 * across all apps using the content SDK.
 */

import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

// Mock types - in production, import from @iiskills/schema and @iiskills/content-sdk
interface UnifiedContent {
  id: string;
  type: string;
  title: string;
  description?: string;
  tags?: string[];
  location?: any;
  deadline?: string;
  url?: string;
  app?: string;
  status?: string;
}

interface ContentManifest {
  app: string;
  version: string;
  contentTypes: string[];
  items: UnifiedContent[];
  lastUpdated: string;
}

// Mock search function
function searchContent(items: UnifiedContent[], filters: any): UnifiedContent[] {
  let results = [...items];

  // Filter by search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    results = results.filter(
      item =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Filter by type
  if (filters.type && filters.type.length > 0) {
    results = results.filter(item => filters.type.includes(item.type));
  }

  // Filter by app
  if (filters.apps && filters.apps.length > 0) {
    results = results.filter(item => item.app && filters.apps.includes(item.app));
  }

  // Filter by location
  if (filters.location) {
    results = results.filter(item => {
      if (!item.location) return false;
      const loc = item.location;
      const filterLoc = filters.location;
      
      if (filterLoc.country && loc.country !== filterLoc.country) return false;
      if (filterLoc.state && loc.state !== filterLoc.state) return false;
      if (filterLoc.district && loc.district !== filterLoc.district) return false;
      
      return true;
    });
  }

  return results;
}

// Mock pagination
function paginateContent(items: UnifiedContent[], page: number = 1, pageSize: number = 20) {
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      query: searchQuery,
      type,
      apps,
      location,
      page = '1',
      pageSize = '20',
    } = req.query;

    // Load manifests
    const rootDir = path.join(process.cwd(), '../..');
    const manifests: ContentManifest[] = [];

    // Try to load manifests from known apps
    const appPaths = [
      'apps/learn-apt/manifest.json',
      'apps/learn-govt-jobs/manifest.json',
      'apps/learn-cricket/manifest.json',
    ];

    for (const appPath of appPaths) {
      const fullPath = path.join(rootDir, appPath);
      try {
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf-8');
          manifests.push(JSON.parse(content));
        }
      } catch (err) {
        console.error(`Error loading manifest from ${appPath}:`, err);
      }
    }

    // Aggregate all content
    const allContent: UnifiedContent[] = manifests.flatMap(manifest => manifest.items);

    // Apply filters
    const filters = {
      searchQuery: searchQuery ? String(searchQuery) : undefined,
      type: type ? String(type).split(',') : undefined,
      apps: apps ? String(apps).split(',') : undefined,
      location: location ? JSON.parse(String(location)) : undefined,
    };

    const filteredContent = searchContent(allContent, filters);

    // Paginate results
    const pageNumber = parseInt(String(page), 10);
    const pageSizeNumber = parseInt(String(pageSize), 10);
    const paginatedResults = paginateContent(filteredContent, pageNumber, pageSizeNumber);

    // Return results
    res.status(200).json({
      success: true,
      data: paginatedResults,
      filters,
      manifestsLoaded: manifests.length,
    });
  } catch (error) {
    console.error('Error in content search:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
