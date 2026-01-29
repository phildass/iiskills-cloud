/**
 * Universal Content Resolver API
 * Fetch content from any app by source_app and content_id
 */

import { ContentManager } from '../../../../lib/admin/contentManager';

export default async function handler(req, res) {
  // Check if DEBUG_ADMIN is enabled
  const debugAdmin = process.env.DEBUG_ADMIN === 'true' || process.env.NEXT_PUBLIC_DEBUG_ADMIN === 'true';
  
  if (!debugAdmin) {
    // TODO: Add proper authentication check here
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { method, query, body } = req;
  const contentManager = new ContentManager();

  try {
    switch (method) {
      case 'GET': {
        const { source_app, content_id, search } = query;

        if (search) {
          // Global search
          const results = await contentManager.searchAllContent(search);
          return res.status(200).json({ results });
        }

        if (source_app && content_id) {
          // Get specific content
          const content = await contentManager.getContent(source_app, content_id);
          if (!content) {
            return res.status(404).json({ error: 'Content not found' });
          }
          return res.status(200).json({ content });
        }

        if (source_app) {
          // Get all content from app
          const contents = await contentManager.getAllContent(source_app);
          return res.status(200).json({ contents });
        }

        return res.status(400).json({ error: 'Missing required parameters' });
      }

      case 'POST': {
        const { source_app, data } = body;
        if (!source_app || !data) {
          return res.status(400).json({ error: 'Missing source_app or data' });
        }

        const content = await contentManager.createContent(source_app, data);
        return res.status(201).json({ content });
      }

      case 'PUT': {
        const { source_app, content_id, data } = body;
        if (!source_app || !content_id || !data) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        const content = await contentManager.saveContent(source_app, content_id, data);
        return res.status(200).json({ content });
      }

      case 'DELETE': {
        const { source_app, content_id } = query;
        if (!source_app || !content_id) {
          return res.status(400).json({ error: 'Missing source_app or content_id' });
        }

        const success = await contentManager.deleteContent(source_app, content_id);
        return res.status(200).json({ success });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
