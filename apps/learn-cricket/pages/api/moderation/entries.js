import { readAuditLog, getModerationStats } from '../../../lib/moderationUtils';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const adminSetupMode = process.env.NEXT_PUBLIC_ADMIN_SETUP_MODE === 'true';
    
    if (!adminSetupMode) {
      return res.status(403).json({ error: 'Access denied: Admin setup mode not enabled' });
    }

    const [entries, stats] = await Promise.all([
      readAuditLog(),
      getModerationStats()
    ]);

    return res.status(200).json({
      entries,
      stats
    });
  } catch (error) {
    console.error('Error fetching moderation entries:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch moderation data',
      details: error.message 
    });
  }
}
