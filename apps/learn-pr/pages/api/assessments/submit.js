import { insertData } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { lesson_id, module_id, score, answers } = req.body;

    if (!lesson_id || !module_id || score === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Passing score is 3 out of 5 (≥60%)
    const passed = score >= 3;

    // Save progress to database
    await insertData('lesson_progress', {
      lesson_id,
      module_id,
      score,
      passed,
      answers: JSON.stringify(answers || [])
    });

    return res.status(200).json({
      success: true,
      passed,
      score,
      message: passed 
        ? 'Congratulations! You passed the quiz.' 
        : 'You need at least 3 correct answers to pass. Please review the material and try again.'
    });
  } catch (error) {
    console.error('Assessment submission error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
