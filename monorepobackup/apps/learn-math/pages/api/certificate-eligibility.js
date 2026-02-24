import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, appKey, isEligible, skippedToLevel } = req.body;

    if (!userId || !appKey || isEligible === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!supabase) {
      // Supabase suspended or unavailable – silently succeed
      return res.status(200).json({ success: true });
    }

    // Upsert certificate eligibility record
    const { error } = await supabase
      .from('certificate_eligibility')
      .upsert(
        { user_id: userId, app_key: appKey, is_eligible: isEligible, skipped_to_level: skippedToLevel || null, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,app_key' }
      );

    if (error) {
      console.error('Certificate eligibility upsert error:', error);
      return res.status(500).json({ error: 'Failed to save eligibility' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Certificate eligibility handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
