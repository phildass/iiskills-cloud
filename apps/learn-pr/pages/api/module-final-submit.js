import { supabase } from '../../lib/supabaseClient';

const PASS_THRESHOLD = 14;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { moduleId, appKey, score, userId } = req.body;

    if (!moduleId || !appKey || score === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const passed = score >= PASS_THRESHOLD;

    if (supabase && userId) {
      const { error } = await supabase.from('module_final_attempts').insert({
        user_id: userId,
        app_key: appKey,
        module_id: String(moduleId),
        score,
      });
      if (error) {
        console.error('module_final_attempts insert error:', error);
      }
    }

    return res.status(200).json({
      success: true,
      passed,
      score,
      message: passed
        ? 'Congratulations! You passed the module final test and unlocked the next level.'
        : `You need at least ${PASS_THRESHOLD}/20 to pass. Please review the module and try again.`,
    });
  } catch (error) {
    console.error('Module final submit error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
