/**
 * API Route: Submit Gatekeeper Assessment
 * Handles submissions for tri-level gatekeeper tests
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { moduleId, answers, userId } = req.body;

    // Validate input
    if (!moduleId || !answers) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Mock scoring logic (in production, this would check against correct answers)
    const totalQuestions = Object.keys(answers).length;
    const correctAnswers = Math.floor(totalQuestions * 0.7); // Mock: 70% correct
    const score = (correctAnswers / totalQuestions) * 100;
    const passed = score >= 70;

    // Mock XP and badge awards
    const xpAwarded = passed ? 100 * parseInt(moduleId) : 50;
    const badgeAwarded = passed ? getBadgeForModule(moduleId) : null;

    return res.status(200).json({
      success: true,
      score,
      passed,
      xpAwarded,
      badgeAwarded,
      message: passed 
        ? `Congratulations! You passed Level ${moduleId} with ${score}%`
        : `You scored ${score}%. Keep practicing and try again!`
    });
  } catch (error) {
    console.error('Assessment submission error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function getBadgeForModule(moduleId) {
  const badges = {
    1: { name: 'Cellular Architect', emoji: '🔬', description: 'Mastered Cell Logic' },
    2: { name: 'Systems Coordinator', emoji: '🫀', description: 'Mastered Body Systems' },
    3: { name: 'Genetics Strategist', emoji: '🧬', description: 'Mastered Genetics & Ecology' },
  };
  return badges[moduleId] || null;
}
