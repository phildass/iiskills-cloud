/**
 * Super Over Page
 * 
 * 60-second rapid-fire cricket trivia match
 * Features:
 * - 6-ball Super Over format
 * - Bot opponent with configurable difficulty
 * - Run scoring based on correct answers
 * - Real-time scoring
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function SuperOver() {
  const router = useRouter();
  const [matchId, setMatchId] = useState(null);
  const [match, setMatch] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const startMatch = async () => {
    try {
      setLoading(true);
      setError(null);

      // Create match
      const matchResponse = await fetch('/api/match/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerAId: `player_${Date.now()}`,
          mode: 'bot',
          difficulty
        })
      });

      const matchData = await matchResponse.json();
      if (!matchResponse.ok) {
        throw new Error(matchData.message || 'Failed to create match');
      }

      setMatchId(matchData.matchId);
      setMatch(matchData.match);

      // Load questions
      const questionsResponse = await fetch('/api/daily-strike?count=6');
      const questionsData = await questionsResponse.json();
      
      if (!questionsResponse.ok) {
        throw new Error(questionsData.message || 'Failed to load questions');
      }

      setQuestions(questionsData.questions || []);
      setGameStarted(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const submitAnswer = async (answer) => {
    if (!matchId || !match) return;

    const isCorrect = answer === questions[currentQuestion].correctAnswer;
    setSelectedAnswer({ answer, isCorrect });

    try {
      const response = await fetch('/api/match/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchId,
          playerId: match.playerA.id,
          isCorrect
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMatch(data.match);
        
        // Move to next question after delay
        setTimeout(() => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Submit answer error:', err);
    }
  };

  // Start screen
  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-center mb-4">Super Over ⚡</h1>
            <p className="text-center text-gray-600 mb-8">
              Face the Cricket Bot in a 6-ball rapid-fire trivia challenge!
            </p>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Difficulty
              </label>
              <div className="flex gap-4 justify-center">
                {['easy', 'medium', 'hard'].map(level => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-6 py-3 rounded-lg font-semibold capitalize ${
                      difficulty === level
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-800 rounded-lg">
                {error}
              </div>
            )}

            <div className="text-center">
              <button
                onClick={startMatch}
                disabled={loading}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? 'Starting...' : 'Start Super Over'}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Game completed
  if (match && match.status === 'completed') {
    const playerRuns = match.playerA.runs;
    const botRuns = match.playerB.runs;
    const won = playerRuns > botRuns;
    const tied = playerRuns === botRuns;

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-6">
              {won ? '🎉 You Won!' : tied ? '🤝 Match Tied!' : '😔 Bot Wins!'}
            </h1>
            
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">You</div>
                <div className="text-5xl font-bold text-blue-600 mb-2">{playerRuns}</div>
                <div className="text-gray-600">runs</div>
                <div className="text-sm text-gray-500 mt-2">
                  {match.playerA.balls} balls | {match.playerA.wickets} wickets
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">Bot</div>
                <div className="text-5xl font-bold text-red-600 mb-2">{botRuns}</div>
                <div className="text-gray-600">runs</div>
                <div className="text-sm text-gray-500 mt-2">
                  {match.playerB.balls} balls | {match.playerB.wickets} wickets
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setGameStarted(false);
                  setMatchId(null);
                  setMatch(null);
                  setCurrentQuestion(0);
                }}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Play Again
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Playing match
  const currentQ = questions[currentQuestion];
  
  // Fisher-Yates shuffle for proper randomization
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  const allOptions = currentQ
    ? shuffleArray([currentQ.correctAnswer, ...currentQ.distractors])
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Scoreboard */}
        {match && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">You</div>
                <div className="text-3xl font-bold text-blue-600">
                  {match.playerA.runs}/{match.playerA.wickets}
                </div>
                <div className="text-xs text-gray-500">{match.playerA.balls}/6 balls</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">Bot</div>
                <div className="text-3xl font-bold text-red-600">
                  {match.playerB.runs}/{match.playerB.wickets}
                </div>
                <div className="text-xs text-gray-500">{match.playerB.balls}/6 balls</div>
              </div>
            </div>
          </div>
        )}

        {/* Question */}
        {currentQ && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-2">
                Ball {currentQuestion + 1}/6
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {currentQ.question}
              </h2>
            </div>

            <div className="space-y-3">
              {allOptions.map((option, idx) => {
                const isSelected = selectedAnswer?.answer === option;
                const isCorrect = option === currentQ.correctAnswer;
                const showResult = selectedAnswer !== null;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={idx}
                    onClick={() => !selectedAnswer && submitAnswer(option)}
                    disabled={selectedAnswer !== null}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-50'
                        : showWrong
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    } ${selectedAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {showCorrect && <span className="text-green-600 font-bold">✓</span>}
                      {showWrong && <span className="text-red-600 font-bold">✗</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {selectedAnswer && (
              <div className={`mt-4 p-4 rounded-lg ${
                selectedAnswer.isCorrect
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}>
                {selectedAnswer.isCorrect
                  ? '🎉 Correct! Runs scored!'
                  : '❌ Incorrect. Wicket!'}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
