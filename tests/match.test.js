/**
 * Super Over Match Service Tests
 * 
 * Tests for match creation, answer submission, and match state management
 */

import {
  createMatch,
  getMatch,
  submitAnswer,
  MatchState,
  getAllMatches,
  deleteMatch
} from '../lib/match/matchService';

describe('Super Over Match Service', () => {
  // Clear matches before each test
  beforeEach(() => {
    const allMatches = getAllMatches();
    allMatches.forEach(match => deleteMatch(match.id));
  });

  describe('Match Creation', () => {
    test('creates a bot match successfully', () => {
      const match = createMatch({
        playerAId: 'user_123',
        mode: 'bot'
      });

      expect(match).toBeDefined();
      expect(match.id).toMatch(/^match_\d+$/);
      expect(match.playerA.id).toBe('user_123');
      expect(match.playerB.id).toBe('bot');
      expect(match.mode).toBe('bot');
      expect(match.state).toBe(MatchState.WAITING);
      expect(match.winner).toBeNull();
    });

    test('creates an invite match successfully', () => {
      const match = createMatch({
        playerAId: 'user_123',
        playerBId: 'user_456',
        mode: 'invite'
      });

      expect(match).toBeDefined();
      expect(match.playerA.id).toBe('user_123');
      expect(match.playerB.id).toBe('user_456');
      expect(match.mode).toBe('invite');
    });

    test('match has correct initial state', () => {
      const match = createMatch({
        playerAId: 'user_123',
        mode: 'bot'
      });

      expect(match.playerA.runs).toBe(0);
      expect(match.playerA.wickets).toBe(0);
      expect(match.playerA.ballsPlayed).toBe(0);
      expect(match.playerB.runs).toBe(0);
      expect(match.playerB.wickets).toBe(0);
      expect(match.playerB.ballsPlayed).toBe(0);
      expect(match.rounds).toEqual([]);
    });

    test('each match gets a unique ID', () => {
      const match1 = createMatch({ playerAId: 'user_1', mode: 'bot' });
      const match2 = createMatch({ playerAId: 'user_2', mode: 'bot' });
      
      expect(match1.id).not.toBe(match2.id);
    });
  });

  describe('Match Retrieval', () => {
    test('retrieves existing match by ID', () => {
      const created = createMatch({ playerAId: 'user_123', mode: 'bot' });
      const retrieved = getMatch(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved.id).toBe(created.id);
      expect(retrieved.playerA.id).toBe('user_123');
    });

    test('returns null for non-existent match', () => {
      const match = getMatch('nonexistent_id');
      expect(match).toBeNull();
    });
  });

  describe('Answer Submission', () => {
    test('submits correct answer and updates match state', () => {
      const match = createMatch({ playerAId: 'user_123', mode: 'bot' });
      
      const updated = submitAnswer({
        matchId: match.id,
        playerId: 'user_123',
        answer: 'correct answer',
        isCorrect: true
      });

      expect(updated.playerA.ballsPlayed).toBe(1);
      expect(updated.playerA.runs).toBeGreaterThan(0);
      expect(updated.playerA.runs).toBeLessThanOrEqual(6);
      expect(updated.state).toBe(MatchState.IN_PROGRESS);
      expect(updated.rounds).toHaveLength(1);
      expect(updated.rounds[0].isCorrect).toBe(true);
    });

    test('submits incorrect answer and increments wickets', () => {
      const match = createMatch({ playerAId: 'user_123', mode: 'bot' });
      
      const updated = submitAnswer({
        matchId: match.id,
        playerId: 'user_123',
        answer: 'wrong answer',
        isCorrect: false
      });

      expect(updated.playerA.ballsPlayed).toBe(1);
      expect(updated.playerA.wickets).toBe(1);
      expect(updated.playerA.runs).toBe(0);
    });

    test('throws error for non-existent match', () => {
      expect(() => {
        submitAnswer({
          matchId: 'nonexistent',
          playerId: 'user_123',
          answer: 'answer',
          isCorrect: true
        });
      }).toThrow('Match not found');
    });

    test('tracks rounds correctly', () => {
      const match = createMatch({ playerAId: 'user_123', mode: 'bot' });
      
      submitAnswer({
        matchId: match.id,
        playerId: 'user_123',
        answer: 'answer1',
        isCorrect: true
      });

      submitAnswer({
        matchId: match.id,
        playerId: 'user_123',
        answer: 'answer2',
        isCorrect: false
      });

      const updated = getMatch(match.id);
      expect(updated.rounds).toHaveLength(2);
      expect(updated.rounds[0].answer).toBe('answer1');
      expect(updated.rounds[1].answer).toBe('answer2');
    });
  });

  describe('Match Completion', () => {
    test('completes match after 6 balls for both players', () => {
      const match = createMatch({ playerAId: 'user_123', mode: 'bot' });
      
      // Player A plays 6 balls
      for (let i = 0; i < 6; i++) {
        submitAnswer({
          matchId: match.id,
          playerId: 'user_123',
          answer: `answer_${i}`,
          isCorrect: true
        });
      }

      // Player B plays 6 balls
      for (let i = 0; i < 6; i++) {
        submitAnswer({
          matchId: match.id,
          playerId: 'bot',
          answer: `answer_${i}`,
          isCorrect: true
        });
      }

      const final = getMatch(match.id);
      expect(final.state).toBe(MatchState.COMPLETED);
      expect(final.winner).toBeDefined();
      expect(['user_123', 'bot', 'tie']).toContain(final.winner);
    });

    test('winner is player with more runs', () => {
      const match = createMatch({ playerAId: 'user_123', mode: 'bot' });
      
      // Mock to ensure player A gets more runs
      // Player A: 6 correct answers
      for (let i = 0; i < 6; i++) {
        submitAnswer({
          matchId: match.id,
          playerId: 'user_123',
          answer: 'correct',
          isCorrect: true
        });
      }

      // Player B: 6 incorrect answers (0 runs)
      for (let i = 0; i < 6; i++) {
        submitAnswer({
          matchId: match.id,
          playerId: 'bot',
          answer: 'wrong',
          isCorrect: false
        });
      }

      const final = getMatch(match.id);
      expect(final.state).toBe(MatchState.COMPLETED);
      expect(final.playerA.runs).toBeGreaterThan(final.playerB.runs);
      expect(final.winner).toBe('user_123');
    });
  });

  describe('Match Management', () => {
    test('getAllMatches returns all created matches', () => {
      createMatch({ playerAId: 'user_1', mode: 'bot' });
      createMatch({ playerAId: 'user_2', mode: 'bot' });
      createMatch({ playerAId: 'user_3', mode: 'bot' });

      const matches = getAllMatches();
      expect(matches).toHaveLength(3);
    });

    test('deleteMatch removes match successfully', () => {
      const match = createMatch({ playerAId: 'user_123', mode: 'bot' });
      const deleted = deleteMatch(match.id);

      expect(deleted).toBe(true);
      expect(getMatch(match.id)).toBeNull();
    });

    test('deleteMatch returns false for non-existent match', () => {
      const deleted = deleteMatch('nonexistent');
      expect(deleted).toBe(false);
    });
  });
});
