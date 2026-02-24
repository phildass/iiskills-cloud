/**
 * Content Filter Tests
 * 
 * Tests for content moderation and banlist filtering
 */

describe('Content Filter', () => {
  let contentBanlist;

  beforeAll(() => {
    // Load banlist
    contentBanlist = {
      bannedKeywords: [
        'political party',
        'religion',
        'religious',
        'defamatory',
        'offensive',
        'hate speech',
        'discrimination',
        'racist',
        'sexist'
      ],
      bannedPhrases: [
        'vote for',
        'support party',
        'religious belief',
        'god said',
        'fake news'
      ],
      controversialTopics: [
        'politics',
        'religion',
        'race',
        'gender discrimination',
        'offensive content'
      ]
    };
  });

  // Helper function matching the one in daily-strike.js
  function isFlagged(text, banlist = contentBanlist) {
    const lowerText = text.toLowerCase();
    
    // Check banned keywords
    for (const keyword of banlist.bannedKeywords || []) {
      if (lowerText.includes(keyword.toLowerCase())) {
        return { flagged: true, reason: `Banned keyword: ${keyword}` };
      }
    }
    
    // Check banned phrases
    for (const phrase of banlist.bannedPhrases || []) {
      if (lowerText.includes(phrase.toLowerCase())) {
        return { flagged: true, reason: `Banned phrase: ${phrase}` };
      }
    }
    
    // Check controversial topics
    for (const topic of banlist.controversialTopics || []) {
      if (lowerText.includes(topic.toLowerCase())) {
        return { flagged: true, reason: `Controversial topic: ${topic}` };
      }
    }
    
    return { flagged: false };
  }

  describe('Banned Keywords Detection', () => {
    test('flags content with political party keyword', () => {
      const result = isFlagged('This political party won the election');
      expect(result.flagged).toBe(true);
      expect(result.reason).toContain('Banned keyword');
    });

    test('flags content with religion keyword', () => {
      const result = isFlagged('The religion teaches us to be kind');
      expect(result.flagged).toBe(true);
    });

    test('flags content with offensive keyword', () => {
      const result = isFlagged('This is offensive content');
      expect(result.flagged).toBe(true);
    });

    test('passes neutral cricket content', () => {
      const result = isFlagged('Virat Kohli scored 87 runs in the match');
      expect(result.flagged).toBe(false);
    });
  });

  describe('Banned Phrases Detection', () => {
    test('flags content with vote for phrase', () => {
      const result = isFlagged('Please vote for this candidate');
      expect(result.flagged).toBe(true);
      expect(result.reason).toContain('Banned phrase');
    });

    test('flags content with fake news phrase', () => {
      const result = isFlagged('This is fake news about cricket');
      expect(result.flagged).toBe(true);
    });

    test('passes content without banned phrases', () => {
      const result = isFlagged('Cricket is a popular sport in India');
      expect(result.flagged).toBe(false);
    });
  });

  describe('Controversial Topics Detection', () => {
    test('flags content about politics', () => {
      const result = isFlagged('Cricket and politics should not mix');
      expect(result.flagged).toBe(true);
      expect(result.reason).toContain('Controversial topic');
    });

    test('flags content about race', () => {
      const result = isFlagged('This is about race and cricket');
      expect(result.flagged).toBe(true);
    });

    test('passes non-controversial cricket content', () => {
      const result = isFlagged('The match was played at MCG in Melbourne');
      expect(result.flagged).toBe(false);
    });
  });

  describe('Case Insensitivity', () => {
    test('flags uppercase banned keywords', () => {
      const result = isFlagged('POLITICAL PARTY news');
      expect(result.flagged).toBe(true);
    });

    test('flags mixed case banned phrases', () => {
      const result = isFlagged('Vote FOR the team');
      expect(result.flagged).toBe(true);
    });

    test('flags lowercase controversial topics', () => {
      const result = isFlagged('cricket politics');
      expect(result.flagged).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    test('handles empty string', () => {
      const result = isFlagged('');
      expect(result.flagged).toBe(false);
    });

    test('handles null banlist gracefully', () => {
      const emptyBanlist = { bannedKeywords: [], bannedPhrases: [], controversialTopics: [] };
      const result = isFlagged('Any content here', emptyBanlist);
      expect(result.flagged).toBe(false);
    });

    test('flags content with politics keyword', () => {
      const result = isFlagged('politics and cricket should not mix');
      expect(result.flagged).toBe(true);
    });
  });

  describe('Cricket-Safe Content', () => {
    const safeCricketContent = [
      'Who won the 2023 Cricket World Cup?',
      'Virat Kohli scored his 50th century',
      'The match was played at MCG',
      'India vs Pakistan on February 7th',
      'The batsman hit a six'
    ];

    safeCricketContent.forEach(content => {
      test(`passes safe content: "${content}"`, () => {
        const result = isFlagged(content);
        expect(result.flagged).toBe(false);
      });
    });
  });

  describe('Flagged Content Examples', () => {
    const flaggedContent = [
      'Support party leaders who play cricket',
      'Religious beliefs about cricket',
      'Fake news about the match',
      'Discussing politics in cricket',
      'Racist comments about players'
    ];

    flaggedContent.forEach(content => {
      test(`flags inappropriate content: "${content}"`, () => {
        const result = isFlagged(content);
        expect(result.flagged).toBe(true);
      });
    });
  });
});
