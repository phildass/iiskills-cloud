/**
 * Health Check & Content Discovery Endpoint
 * 
 * This endpoint provides:
 * 1. System health status
 * 2. Complete content inventory from all active learn-* apps
 * 3. Source attribution (app and backend) for each content item
 * 4. Content counts and statistics
 * 
 * Access: Publicly accessible (no authentication required)
 * Usage: GET /api/healthz
 */

import { ContentManager } from '../../lib/admin/contentManager';
import { APP_REGISTRY, getAllApps } from '../../lib/admin/contentRegistry';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const contentManager = new ContentManager();
    const allApps = getAllApps();
    
    // Discover content from all apps
    const contentInventory = [];
    const stats = {
      totalApps: allApps.length,
      totalContent: 0,
      contentByApp: {},
      contentByBackend: {
        filesystem: 0,
        supabase: 0,
      },
      errors: [],
    };

    // Scan each app for content
    for (const app of allApps) {
      try {
        const content = await contentManager.getAllContent(app.id);
        
        stats.contentByApp[app.id] = {
          name: app.displayName,
          icon: app.icon,
          count: content.length,
          contentType: app.contentType,
          dataPath: app.dataPath,
        };

        stats.totalContent += content.length;

        // Count by backend
        content.forEach(item => {
          const backend = item.sourceBackend || item.source || 'unknown';
          if (backend === 'filesystem') {
            stats.contentByBackend.filesystem++;
          } else if (backend === 'supabase') {
            stats.contentByBackend.supabase++;
          }
        });

        // Add to inventory (with sample data)
        contentInventory.push({
          appId: app.id,
          appName: app.displayName,
          icon: app.icon,
          contentType: app.contentType,
          dataPath: app.dataPath,
          itemCount: content.length,
          sampleItems: content.slice(0, 3).map(item => ({
            id: item.id,
            title: item.title,
            type: item.type,
            sourceApp: item.sourceApp || item.appId,
            sourceBackend: item.sourceBackend || item.source,
          })),
        });
      } catch (error) {
        stats.errors.push({
          app: app.id,
          error: error.message,
        });
      }
    }

    // System health status
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      mode: 'PUBLIC_ACCESS',
      authentication: 'DISABLED',
      paywall: 'DISABLED',
      features: {
        universalContentAggregation: true,
        publicAccess: true,
        multiAppSupport: true,
        sourceAttribution: true,
      },
    };

    return res.status(200).json({
      health,
      stats,
      contentInventory,
      apps: allApps.map(app => ({
        id: app.id,
        name: app.displayName,
        icon: app.icon,
        contentType: app.contentType,
      })),
    });
  } catch (error) {
    console.error('Health check error:', error);
    return res.status(500).json({
      health: {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      },
    });
  }
}
