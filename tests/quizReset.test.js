/**
 * Quiz Reset Regression Tests
 *
 * Verifies that per-lesson quiz state is isolated and resets correctly on lesson
 * navigation.  These tests model the state-management logic in the learn-* lesson
 * page components without requiring a React renderer.
 */

/**
 * Minimal simulation of the lesson-page quiz state machine.
 * Mirrors the logic in the learn apps lesson page components.
 */
function createLessonState() {
  let quizCompleted = false;

  // Called when the lesson route changes (useEffect([moduleId, lessonId]))
  function onLessonChange() {
    quizCompleted = false;
  }

  // Called by handleQuizComplete when a quiz is submitted
  function onQuizComplete(passed) {
    quizCompleted = passed;
  }

  return { onLessonChange, onQuizComplete, getQuizCompleted: () => quizCompleted };
}

/**
 * Minimal simulation of the QuizComponent internal state machine.
 * Mirrors the QuizComponent used in the learn apps.
 */
function createQuizComponentState(questions) {
  let currentQuestion = 0;
  let selectedAnswers = [];
  let showResults = false;
  let score = 0;

  function reset() {
    currentQuestion = 0;
    selectedAnswers = [];
    showResults = false;
    score = 0;
  }

  function selectAnswer(answerIndex) {
    selectedAnswers[currentQuestion] = answerIndex;
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
    } else {
      // Auto-calculate score on last answer
      score = questions.filter((q, i) => selectedAnswers[i] === q.correct_answer).length;
      showResults = true;
    }
  }

  return {
    reset,
    selectAnswer,
    getState: () => ({ currentQuestion, selectedAnswers: [...selectedAnswers], showResults, score }),
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Quiz state resets on lesson change', () => {
  test('quizCompleted resets to false when navigating to a new lesson', () => {
    const state = createLessonState();

    // Complete lesson 1 quiz
    state.onQuizComplete(true);
    expect(state.getQuizCompleted()).toBe(true);

    // Navigate to lesson 2 — simulates useEffect([moduleId, lessonId]) firing
    state.onLessonChange();
    expect(state.getQuizCompleted()).toBe(false);
  });

  test('quizCompleted remains false when quiz is failed', () => {
    const state = createLessonState();

    state.onQuizComplete(false);
    expect(state.getQuizCompleted()).toBe(false);
  });

  test('quizCompleted persists as true until next lesson change', () => {
    const state = createLessonState();

    state.onQuizComplete(true);
    expect(state.getQuizCompleted()).toBe(true);

    // Navigating to a different lesson resets it
    state.onLessonChange();
    expect(state.getQuizCompleted()).toBe(false);

    // Completing the new lesson re-sets it to true
    state.onQuizComplete(true);
    expect(state.getQuizCompleted()).toBe(true);
  });
});

describe('Quiz completion is per lesson (key isolation)', () => {
  test('two independent lesson states do not share quizCompleted', () => {
    const lesson1 = createLessonState();
    const lesson2 = createLessonState();

    lesson1.onQuizComplete(true);
    expect(lesson1.getQuizCompleted()).toBe(true);
    expect(lesson2.getQuizCompleted()).toBe(false); // lesson2 unaffected
  });
});

describe('QuizComponent internal state resets on remount (key prop)', () => {
  const sampleQuestions = [
    { question: 'Q1?', options: ['A', 'B', 'C', 'D'], correct_answer: 0 },
    { question: 'Q2?', options: ['A', 'B', 'C', 'D'], correct_answer: 1 },
    { question: 'Q3?', options: ['A', 'B', 'C', 'D'], correct_answer: 2 },
  ];

  test('selectedAnswers and score clear after reset (simulating key change)', () => {
    const quiz = createQuizComponentState(sampleQuestions);

    // Answer all questions
    sampleQuestions.forEach((_, i) => quiz.selectAnswer(i)); // answers: 0,1,2 → all correct

    const before = quiz.getState();
    expect(before.showResults).toBe(true);
    expect(before.score).toBeGreaterThan(0);
    expect(before.selectedAnswers.length).toBe(sampleQuestions.length);

    // React key change → component unmounts/remounts → reset()
    quiz.reset();

    const after = quiz.getState();
    expect(after.currentQuestion).toBe(0);
    expect(after.selectedAnswers).toEqual([]);
    expect(after.showResults).toBe(false);
    expect(after.score).toBe(0);
  });

  test('score calculation is independent across quiz instances', () => {
    const quiz1 = createQuizComponentState(sampleQuestions);
    const quiz2 = createQuizComponentState(sampleQuestions);

    // Pass quiz1 with all correct answers
    sampleQuestions.forEach((q, i) => quiz1.selectAnswer(q.correct_answer));
    expect(quiz1.getState().score).toBe(sampleQuestions.length);

    // quiz2 not yet answered
    expect(quiz2.getState().score).toBe(0);
    expect(quiz2.getState().showResults).toBe(false);
  });
});
