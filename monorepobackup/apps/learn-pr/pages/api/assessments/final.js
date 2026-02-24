import { insertData } from '../../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id, answers } = req.body;

    if (!user_id || !answers || answers.length !== 20) {
      return res.status(400).json({ error: 'Invalid submission' });
    }

    // Calculate score (mock correct answers for now)
    const correctAnswers = Array(20).fill(0).map((_, i) => i % 4); // Mock
    let score = 0;
    
    answers.forEach((answer, index) => {
      if (answer === correctAnswers[index]) {
        score++;
      }
    });

    // Passing score is 13 out of 20 (65%)
    const passed = score >= 13;

    // Save exam result
    await insertData('final_exams', {
      user_id,
      score,
      passed,
      answers: JSON.stringify(answers),
      total_questions: 20
    });

    // If passed, trigger certificate generation
    if (passed) {
      // In production, trigger certificate generation
      console.log(`User ${user_id} passed final exam with score ${score}/20`);
    }

    return res.status(200).json({
      success: true,
      passed,
      score,
      total: 20,
      percentage: Math.round((score / 20) * 100),
      message: passed
        ? 'Congratulations! You passed the final exam. Your certificate is being generated.'
        : `You scored ${score}/20. You need at least 13 correct answers to pass. Please try again after reviewing the material.`
    });
  } catch (error) {
    console.error('Final exam error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
