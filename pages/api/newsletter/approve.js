import { createClient } from '@supabase/supabase-js';

/**
 * Newsletter Approval API
 * 
 * Allows admin to approve newsletters before sending
 * Only approved newsletters can be sent to subscribers
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { newsletterId, action } = req.body;

  if (!newsletterId || !action) {
    return res.status(400).json({ error: 'Newsletter ID and action are required' });
  }

  if (!['approve', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action. Use "approve" or "reject"' });
  }

  try {
    // Use service role key for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Fetch the newsletter
    const { data: newsletter, error: fetchError } = await supabase
      .from('newsletter_editions')
      .select('*')
      .eq('id', newsletterId)
      .single();

    if (fetchError || !newsletter) {
      return res.status(404).json({ error: 'Newsletter not found' });
    }

    // Check if newsletter is in draft status
    if (newsletter.status !== 'draft') {
      return res.status(400).json({ 
        error: `Newsletter is already ${newsletter.status}. Only draft newsletters can be approved or rejected.` 
      });
    }

    // Update newsletter status
    const newStatus = action === 'approve' ? 'approved' : 'rejected';
    
    const { error: updateError } = await supabase
      .from('newsletter_editions')
      .update({ 
        status: newStatus,
        approved_at: action === 'approve' ? new Date().toISOString() : null,
        approved_by: 'admin' // In a real system, this would be the logged-in admin user ID
      })
      .eq('id', newsletterId);

    if (updateError) {
      throw updateError;
    }

    // If approved, queue it for sending
    if (action === 'approve') {
      const { error: queueError } = await supabase
        .from('newsletter_queue')
        .insert([{
          newsletter_id: newsletterId,
          task_type: 'send',
          status: 'pending'
        }]);

      if (queueError) {
        console.error('Failed to queue newsletter for sending:', queueError);
        // Don't fail the approval, just log it
      }
    }

    res.status(200).json({
      success: true,
      message: `Newsletter ${action === 'approve' ? 'approved and queued for sending' : 'rejected'}`,
      status: newStatus
    });

  } catch (error) {
    console.error('Approval error:', error);
    res.status(500).json({ error: 'Failed to process approval' });
  }
}
