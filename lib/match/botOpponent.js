/**
 * Bot Opponent for Super Over Matches
 * 
 * Implements a deterministic bot that answers questions at configured speed and accuracy.
 * For MVP: simple deterministic bot
 * For Phase 2: multiple difficulty levels, ML-based bots
 */

/**
 * Bot configuration
 */
const BOT_CONFIG = {
  // Answer speed in milliseconds
  answerSpeed: 2000, // 2 seconds
  
  // Base accuracy (0-1, where 1 is 100% accurate)
  baseAccuracy: 0.7, // 70% correct by default
  
  // Difficulty levels
  difficulties: {
    easy: { accuracy: 0.5, speed: 3000 },
    medium: { accuracy: 0.7, speed: 2000 },
    hard: { accuracy: 0.9, speed: 1000 }
  }
};

/**
 * Generate bot answer for a question
 * @param {Object} question - Question object
 * @param {string} difficulty - Difficulty level ('easy', 'medium', 'hard')
 * @returns {Object} Bot answer with timing
 */
export function generateBotAnswer(question, difficulty = 'medium') {
  const config = BOT_CONFIG.difficulties[difficulty] || BOT_CONFIG.difficulties.medium;
  
  // Determine if bot answers correctly based on accuracy
  const isCorrect = Math.random() < config.accuracy;
  
  // Select answer
  let selectedAnswer;
  if (isCorrect) {
    // Select the correct answer
    selectedAnswer = question.correctAnswer;
  } else {
    // Select a random incorrect answer
    const incorrectAnswers = question.options.filter(opt => opt !== question.correctAnswer);
    selectedAnswer = incorrectAnswers[Math.floor(Math.random() * incorrectAnswers.length)];
  }

  return {
    answer: selectedAnswer,
    isCorrect,
    answerTime: config.speed,
    timestamp: new Date().toISOString()
  };
}

/**
 * Simulate bot playing a ball in the match
 * @param {Object} match - Current match state
 * @param {Object} question - Current question
 * @param {string} difficulty - Bot difficulty
 * @returns {Promise<Object>} Bot answer after configured delay
 */
export async function playBotTurn(match, question, difficulty = 'medium') {
  const config = BOT_CONFIG.difficulties[difficulty] || BOT_CONFIG.difficulties.medium;
  
  // Simulate thinking time
  await new Promise(resolve => setTimeout(resolve, config.speed));
  
  return generateBotAnswer(question, difficulty);
}

/**
 * Get bot configuration
 * @param {string} difficulty - Difficulty level
 * @returns {Object} Bot configuration
 */
export function getBotConfig(difficulty = 'medium') {
  return BOT_CONFIG.difficulties[difficulty] || BOT_CONFIG.difficulties.medium;
}

/**
 * Validate difficulty level
 * @param {string} difficulty - Difficulty level
 * @returns {boolean} True if valid
 */
export function isValidDifficulty(difficulty) {
  return Object.keys(BOT_CONFIG.difficulties).includes(difficulty);
}
