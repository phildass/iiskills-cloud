/**
 * App Schema API
 * Returns schema information for apps
 */

import { APP_REGISTRY, getAllApps, getAppSchema } from '../../../lib/admin/contentRegistry';

export default async function handler(req, res) {
  // Check if DEBUG_ADMIN is enabled
  const debugAdmin = process.env.DEBUG_ADMIN === 'true' || process.env.NEXT_PUBLIC_DEBUG_ADMIN === 'true';
  
  if (!debugAdmin) {
    // TODO: Add proper authentication check here
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { method, query } = req;

  try {
    if (method === 'GET') {
      const { app_id } = query;

      if (app_id) {
        // Get specific app schema
        const schema = getAppSchema(app_id);
        if (!schema) {
          return res.status(404).json({ error: 'App not found' });
        }
        return res.status(200).json({ schema });
      }

      // Get all apps
      const apps = getAllApps();
      return res.status(200).json({ apps });
    }

    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
