import { updateLogEntry } from '../../../lib/moderationUtils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const adminSetupMode = process.env.NEXT_PUBLIC_ADMIN_SETUP_MODE === 'true';
    
    if (!adminSetupMode) {
      return res.status(403).json({ error: 'Access denied: Admin setup mode not enabled' });
    }

    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: 'Missing required fields: id and status' });
    }

    const validStatuses = ['flagged', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status',
        message: `Status must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const success = await updateLogEntry(id, status);

    if (!success) {
      return res.status(500).json({ error: 'Failed to update entry' });
    }

    return res.status(200).json({ 
      success: true,
      message: 'Entry updated successfully' 
    });
  } catch (error) {
    console.error('Error updating moderation entry:', error);
    return res.status(500).json({ 
      error: 'Failed to update entry',
      details: error.message 
    });
  }
}
