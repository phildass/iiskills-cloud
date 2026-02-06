// Comprehensive Question Bank with Cognitive Domain Tags
// Each question tagged by domain and career connection

export const COGNITIVE_DOMAINS = {
  NUMERICAL: 'Numerical Ability',
  LOGICAL: 'Logical Reasoning',
  VERBAL: 'Verbal Ability',
  SPATIAL: 'Spatial/Abstract',
  DATA_INTERPRETATION: 'Data Interpretation'
};

export const DIFFICULTY_LEVELS = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EXPERT: 4
};

// Question Bank with domain tags, difficulty, and career connections
export const QUESTION_BANK = {
  // ========== NUMERICAL ABILITY ==========
  numerical: [
    {
      id: 'num_001',
      domain: COGNITIVE_DOMAINS.NUMERICAL,
      difficulty: DIFFICULTY_LEVELS.EASY,
      question: "If 5x + 3 = 18, what is the value of x?",
      options: ["2", "3", "4", "5"],
      correctAnswer: 1,
      explanation: "5x + 3 = 18 → 5x = 15 → x = 3",
      careerConnection: ["Banking", "Finance", "Engineering", "Data Science"],
      skillTag: "Basic Algebra"
    },
    {
      id: 'num_002',
      domain: COGNITIVE_DOMAINS.NUMERICAL,
      difficulty: DIFFICULTY_LEVELS.EASY,
      question: "What is 15% of 200?",
      options: ["25", "30", "35", "40"],
      correctAnswer: 1,
      explanation: "15% of 200 = (15/100) × 200 = 30",
      careerConnection: ["Banking", "Finance", "Sales", "Business Analysis"],
      skillTag: "Percentages"
    },
    {
      id: 'num_003',
      domain: COGNITIVE_DOMAINS.NUMERICAL,
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      question: "A train travels 120 km in 2 hours. What is its average speed?",
      options: ["50 km/h", "60 km/h", "70 km/h", "80 km/h"],
      correctAnswer: 1,
      explanation: "Average speed = Total distance / Total time = 120 / 2 = 60 km/h",
      careerConnection: ["Engineering", "Operations", "Logistics"],
      skillTag: "Speed, Distance, Time"
    },
    {
      id: 'num_004',
      domain: COGNITIVE_DOMAINS.NUMERICAL,
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      question: "If the ratio of boys to girls in a class is 3:2 and there are 15 boys, how many girls are there?",
      options: ["8", "10", "12", "15"],
      correctAnswer: 1,
      explanation: "Boys:Girls = 3:2. If boys = 15, then 3x = 15 → x = 5. Girls = 2x = 2(5) = 10",
      careerConnection: ["Data Analysis", "Statistics", "Research"],
      skillTag: "Ratios and Proportions"
    },
    {
      id: 'num_005',
      domain: COGNITIVE_DOMAINS.NUMERICAL,
      difficulty: DIFFICULTY_LEVELS.HARD,
      question: "A shopkeeper marks an item 40% above cost price and then gives a 20% discount. What is his profit percentage?",
      options: ["8%", "10%", "12%", "15%"],
      correctAnswer: 2,
      explanation: "Let CP = 100. Marked price = 140. After 20% discount = 140 × 0.8 = 112. Profit = 12%",
      careerConnection: ["Finance", "Business", "Retail Management"],
      skillTag: "Profit and Loss"
    },
    {
      id: 'num_006',
      domain: COGNITIVE_DOMAINS.NUMERICAL,
      difficulty: DIFFICULTY_LEVELS.HARD,
      question: "The compound interest on Rs. 10,000 at 10% per annum for 2 years is:",
      options: ["Rs. 2000", "Rs. 2100", "Rs. 2200", "Rs. 2500"],
      correctAnswer: 1,
      explanation: "CI = P(1+r/100)^n - P = 10000(1.1)^2 - 10000 = 12100 - 10000 = Rs. 2100",
      careerConnection: ["Banking", "Investment", "Financial Planning"],
      skillTag: "Compound Interest"
    },
    {
      id: 'num_007',
      domain: COGNITIVE_DOMAINS.NUMERICAL,
      difficulty: DIFFICULTY_LEVELS.EXPERT,
      question: "Two pipes A and B can fill a tank in 12 and 16 hours respectively. If both pipes are opened together, how long will it take to fill the tank?",
      options: ["6.5 hours", "6.75 hours", "6.85 hours", "7 hours"],
      correctAnswer: 2,
      explanation: "A's rate = 1/12, B's rate = 1/16. Combined = 1/12 + 1/16 = 7/48. Time = 48/7 ≈ 6.85 hours",
      careerConnection: ["Engineering", "Operations Research", "Civil Engineering"],
      skillTag: "Time and Work"
    },
    {
      id: 'num_008',
      domain: COGNITIVE_DOMAINS.NUMERICAL,
      difficulty: DIFFICULTY_LEVELS.EXPERT,
      question: "A mixture contains milk and water in the ratio 5:3. If 16 liters of water is added, the ratio becomes 5:7. What was the original quantity of mixture?",
      options: ["24 liters", "32 liters", "40 liters", "48 liters"],
      correctAnswer: 1,
      explanation: "Let original milk = 5x, water = 3x. After adding: 5x/(3x+16) = 5/7 → 35x = 15x + 80 → x = 4. Original = 8x = 32 liters",
      careerConnection: ["Chemical Engineering", "Food Processing", "Quality Control"],
      skillTag: "Mixtures and Alligation"
    }
  ],

  // ========== LOGICAL REASONING ==========
  logical: [
    {
      id: 'log_001',
      domain: COGNITIVE_DOMAINS.LOGICAL,
      difficulty: DIFFICULTY_LEVELS.EASY,
      question: "Which number should come next in the series: 2, 6, 12, 20, ?",
      options: ["28", "30", "32", "34"],
      correctAnswer: 1,
      explanation: "Pattern: Add 4, then 6, then 8, then 10. Next is 20 + 10 = 30",
      careerConnection: ["Programming", "Data Analysis", "Research"],
      skillTag: "Pattern Recognition"
    },
    {
      id: 'log_002',
      domain: COGNITIVE_DOMAINS.LOGICAL,
      difficulty: DIFFICULTY_LEVELS.EASY,
      question: "If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies.",
      options: ["True", "False", "Cannot be determined"],
      correctAnswer: 0,
      explanation: "This is a valid syllogism. If A⊆B and B⊆C, then A⊆C",
      careerConnection: ["Law", "Philosophy", "Logic Programming"],
      skillTag: "Syllogisms"
    },
    {
      id: 'log_003',
      domain: COGNITIVE_DOMAINS.LOGICAL,
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      question: "If CODING is written as DPEJOH, how is BINARY written?",
      options: ["CJOBSZ", "CJOBSA", "AJMZSQ", "BKMZSQ"],
      correctAnswer: 0,
      explanation: "Each letter is shifted by +1 position. B→C, I→J, N→O, A→B, R→S, Y→Z",
      careerConnection: ["Cryptography", "Cybersecurity", "Software Development"],
      skillTag: "Coding-Decoding"
    },
    {
      id: 'log_004',
      domain: COGNITIVE_DOMAINS.LOGICAL,
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      question: "In a certain code, 'FINGER' is coded as 'EHMFDS'. What is the code for 'MOTHER'?",
      options: ["LNSGDQ", "NPUIFS", "LNUIFS", "LPUIFS"],
      correctAnswer: 0,
      explanation: "Each letter is shifted backward by 1 position. M→L, O→N, T→S, H→G, E→D, R→Q",
      careerConnection: ["Intelligence", "Code Breaking", "Pattern Analysis"],
      skillTag: "Advanced Coding"
    },
    {
      id: 'log_005',
      domain: COGNITIVE_DOMAINS.LOGICAL,
      difficulty: DIFFICULTY_LEVELS.HARD,
      question: "If in a code language, '253' means 'books are old', '546' means 'man is old', and '378' means 'buy good books', what is the code for 'are'?",
      options: ["2", "3", "5", "Cannot be determined"],
      correctAnswer: 0,
      explanation: "Comparing statements: 'old' is common in 1 and 2, so '5'. 'books' is common in 1 and 3, so '3'. Therefore 'are' is '2'",
      careerConnection: ["Intelligence Analysis", "Linguistics", "Cryptanalysis"],
      skillTag: "Logical Deduction"
    },
    {
      id: 'log_006',
      domain: COGNITIVE_DOMAINS.LOGICAL,
      difficulty: DIFFICULTY_LEVELS.HARD,
      question: "In a row of students, John is 7th from the left and 12th from the right. How many students are there in the row?",
      options: ["17", "18", "19", "20"],
      correctAnswer: 1,
      explanation: "Total students = Position from left + Position from right - 1 = 7 + 12 - 1 = 18",
      careerConnection: ["Problem Solving", "Analytics", "Operations"],
      skillTag: "Seating Arrangement"
    },
    {
      id: 'log_007',
      domain: COGNITIVE_DOMAINS.LOGICAL,
      difficulty: DIFFICULTY_LEVELS.EXPERT,
      question: "Find the missing number: 8, 27, 64, 125, ?",
      options: ["196", "216", "225", "256"],
      correctAnswer: 1,
      explanation: "These are cubes: 2³=8, 3³=27, 4³=64, 5³=125, 6³=216",
      careerConnection: ["Mathematics", "Engineering", "Quantitative Analysis"],
      skillTag: "Number Series"
    },
    {
      id: 'log_008',
      domain: COGNITIVE_DOMAINS.LOGICAL,
      difficulty: DIFFICULTY_LEVELS.EXPERT,
      question: "A clock shows 3:00. What is the angle between the hour and minute hands?",
      options: ["75°", "90°", "105°", "120°"],
      correctAnswer: 1,
      explanation: "At 3:00, minute hand at 12 (0°) and hour hand at 3 (90°). Angle = 90°",
      careerConnection: ["Engineering", "Geometry", "Technical Roles"],
      skillTag: "Clock Problems"
    }
  ],

  // ========== VERBAL ABILITY ==========
  verbal: [
    {
      id: 'ver_001',
      domain: COGNITIVE_DOMAINS.VERBAL,
      difficulty: DIFFICULTY_LEVELS.EASY,
      question: "Choose the word that is most similar to 'Meticulous':",
      options: ["Careless", "Careful", "Quick", "Slow"],
      correctAnswer: 1,
      explanation: "Meticulous means showing great attention to detail, which is similar to careful",
      careerConnection: ["Writing", "Editing", "Quality Assurance"],
      skillTag: "Synonyms"
    },
    {
      id: 'ver_002',
      domain: COGNITIVE_DOMAINS.VERBAL,
      difficulty: DIFFICULTY_LEVELS.EASY,
      question: "Complete the analogy: Book is to Reading as Fork is to ___",
      options: ["Drawing", "Writing", "Eating", "Cooking"],
      correctAnswer: 2,
      explanation: "A book is used for reading, similarly a fork is used for eating",
      careerConnection: ["Analytical Thinking", "Problem Solving"],
      skillTag: "Analogies"
    },
    {
      id: 'ver_003',
      domain: COGNITIVE_DOMAINS.VERBAL,
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      question: "Choose the word that is opposite to 'Abundant':",
      options: ["Scarce", "Plentiful", "Numerous", "Many"],
      correctAnswer: 0,
      explanation: "Abundant means existing in large quantities; scarce means insufficient or lacking",
      careerConnection: ["Communication", "Language Skills"],
      skillTag: "Antonyms"
    },
    {
      id: 'ver_004',
      domain: COGNITIVE_DOMAINS.VERBAL,
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      question: "Identify the grammatically correct sentence:",
      options: [
        "Neither of the students have completed the assignment",
        "Neither of the students has completed the assignment",
        "Neither of the student have completed the assignment",
        "Neither of the student has completed the assignments"
      ],
      correctAnswer: 1,
      explanation: "'Neither' is singular and takes a singular verb 'has', not 'have'",
      careerConnection: ["Writing", "Communication", "Professional Roles"],
      skillTag: "Grammar"
    },
    {
      id: 'ver_005',
      domain: COGNITIVE_DOMAINS.VERBAL,
      difficulty: DIFFICULTY_LEVELS.HARD,
      question: "Choose the most appropriate word to fill the blank: The committee's decision was _____ by all members.",
      options: ["unanimous", "ambiguous", "contentious", "disputed"],
      correctAnswer: 0,
      explanation: "Unanimous means agreed upon by everyone, which fits the context best",
      careerConnection: ["Business Communication", "Management"],
      skillTag: "Vocabulary"
    },
    {
      id: 'ver_006',
      domain: COGNITIVE_DOMAINS.VERBAL,
      difficulty: DIFFICULTY_LEVELS.HARD,
      question: "Select the sentence with correct punctuation:",
      options: [
        "The CEO said, that the company would expand",
        "The CEO said that, the company would expand",
        "The CEO said that the company would expand",
        "The CEO, said that the company would expand"
      ],
      correctAnswer: 2,
      explanation: "No comma is needed after 'said' when followed by 'that'",
      careerConnection: ["Professional Writing", "Business Communication"],
      skillTag: "Punctuation"
    },
    {
      id: 'ver_007',
      domain: COGNITIVE_DOMAINS.VERBAL,
      difficulty: DIFFICULTY_LEVELS.EXPERT,
      question: "Identify the correct use of idiom: 'She decided to _____ when things got difficult.'",
      options: [
        "throw in the towel",
        "throw the towel in",
        "throw in a towel",
        "throw the towel"
      ],
      correctAnswer: 0,
      explanation: "'Throw in the towel' is the correct idiom meaning to give up or quit",
      careerConnection: ["Communication", "Language Proficiency"],
      skillTag: "Idioms and Phrases"
    },
    {
      id: 'ver_008',
      domain: COGNITIVE_DOMAINS.VERBAL,
      difficulty: DIFFICULTY_LEVELS.EXPERT,
      question: "Choose the sentence with the correct use of subjunctive mood:",
      options: [
        "If I was rich, I would travel the world",
        "If I were rich, I would travel the world",
        "If I am rich, I would travel the world",
        "If I will be rich, I would travel the world"
      ],
      correctAnswer: 1,
      explanation: "Subjunctive mood uses 'were' for hypothetical situations, not 'was'",
      careerConnection: ["Advanced Writing", "Academic Writing"],
      skillTag: "Advanced Grammar"
    }
  ],

  // ========== SPATIAL/ABSTRACT ==========
  spatial: [
    {
      id: 'spa_001',
      domain: COGNITIVE_DOMAINS.SPATIAL,
      difficulty: DIFFICULTY_LEVELS.EASY,
      question: "Which shape comes next in the pattern: Circle, Square, Triangle, Circle, Square, ?",
      options: ["Circle", "Triangle", "Rectangle", "Pentagon"],
      correctAnswer: 1,
      explanation: "The pattern repeats: Circle, Square, Triangle. So next is Triangle",
      careerConnection: ["Design", "Architecture", "UI/UX"],
      skillTag: "Pattern Recognition"
    },
    {
      id: 'spa_002',
      domain: COGNITIVE_DOMAINS.SPATIAL,
      difficulty: DIFFICULTY_LEVELS.EASY,
      question: "How many faces does a cube have?",
      options: ["4", "6", "8", "12"],
      correctAnswer: 1,
      explanation: "A cube is a 3D shape with 6 square faces",
      careerConnection: ["Engineering", "Architecture", "3D Modeling"],
      skillTag: "3D Geometry"
    },
    {
      id: 'spa_003',
      domain: COGNITIVE_DOMAINS.SPATIAL,
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      question: "If a cube is painted on all faces and then cut into 27 smaller cubes of equal size, how many small cubes will have paint on exactly two faces?",
      options: ["8", "12", "18", "20"],
      correctAnswer: 1,
      explanation: "The cubes on the edges (but not corners) have exactly 2 painted faces. There are 12 such edges",
      careerConnection: ["Spatial Reasoning", "Engineering", "Problem Solving"],
      skillTag: "Cube Problems"
    },
    {
      id: 'spa_004',
      domain: COGNITIVE_DOMAINS.SPATIAL,
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      question: "Which of the following figures represents a net of a cube?",
      options: [
        "Six squares in a straight line",
        "Six squares in a T-shape with 4 in a row",
        "Five squares in a row with one attached",
        "Six squares arranged randomly"
      ],
      correctAnswer: 1,
      explanation: "A valid cube net must be able to fold into a cube. The T-shape with 4 squares in a row works",
      careerConnection: ["Architecture", "Design", "Manufacturing"],
      skillTag: "Net Diagrams"
    },
    {
      id: 'spa_005',
      domain: COGNITIVE_DOMAINS.SPATIAL,
      difficulty: DIFFICULTY_LEVELS.HARD,
      question: "A rectangular paper is folded along its diagonal. What shape does the overlapping region form?",
      options: ["Triangle", "Rectangle", "Trapezoid", "Pentagon"],
      correctAnswer: 0,
      explanation: "When a rectangle is folded along its diagonal, the overlapping region forms a triangle",
      careerConnection: ["Origami Design", "Packaging", "Material Science"],
      skillTag: "Paper Folding"
    },
    {
      id: 'spa_006',
      domain: COGNITIVE_DOMAINS.SPATIAL,
      difficulty: DIFFICULTY_LEVELS.HARD,
      question: "If you look at a clock in a mirror when it shows 3:15, what time will the mirror image show?",
      options: ["8:45", "8:15", "9:45", "3:15"],
      correctAnswer: 0,
      explanation: "Mirror image of clock: 12 - 3:15 = 8:45 (vertical axis reflection)",
      careerConnection: ["Optics", "Physics", "Spatial Intelligence"],
      skillTag: "Mirror Images"
    },
    {
      id: 'spa_007',
      domain: COGNITIVE_DOMAINS.SPATIAL,
      difficulty: DIFFICULTY_LEVELS.EXPERT,
      question: "A cube is rotated 90° clockwise around its vertical axis. Which face that was originally on top is now facing you?",
      options: ["Front", "Back", "Left", "Right"],
      correctAnswer: 2,
      explanation: "After 90° clockwise rotation around vertical axis, the left face comes to the front",
      careerConnection: ["3D Animation", "CAD Design", "Robotics"],
      skillTag: "3D Rotation"
    },
    {
      id: 'spa_008',
      domain: COGNITIVE_DOMAINS.SPATIAL,
      difficulty: DIFFICULTY_LEVELS.EXPERT,
      question: "How many vertices does a dodecahedron have?",
      options: ["12", "20", "30", "60"],
      correctAnswer: 1,
      explanation: "A dodecahedron (12 pentagonal faces) has 20 vertices (using Euler's formula: V-E+F=2)",
      careerConnection: ["Mathematics", "3D Geometry", "Computer Graphics"],
      skillTag: "Advanced 3D Geometry"
    }
  ],

  // ========== DATA INTERPRETATION ==========
  dataInterpretation: [
    {
      id: 'data_001',
      domain: COGNITIVE_DOMAINS.DATA_INTERPRETATION,
      difficulty: DIFFICULTY_LEVELS.EASY,
      question: "A bar chart shows sales: Jan-100, Feb-150, Mar-200. What is the percentage increase from Jan to Mar?",
      options: ["50%", "75%", "100%", "200%"],
      correctAnswer: 2,
      explanation: "Increase = (200-100)/100 × 100% = 100%",
      careerConnection: ["Data Analysis", "Business Intelligence", "Marketing"],
      skillTag: "Chart Reading"
    },
    {
      id: 'data_002',
      domain: COGNITIVE_DOMAINS.DATA_INTERPRETATION,
      difficulty: DIFFICULTY_LEVELS.EASY,
      question: "In a class of 40 students, 60% are boys. How many girls are there?",
      options: ["12", "16", "20", "24"],
      correctAnswer: 1,
      explanation: "Boys = 60% of 40 = 24. Girls = 40 - 24 = 16",
      careerConnection: ["Statistics", "Demographics", "Research"],
      skillTag: "Percentage Calculation"
    },
    {
      id: 'data_003',
      domain: COGNITIVE_DOMAINS.DATA_INTERPRETATION,
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      question: "A pie chart shows market share: Company A-40%, B-25%, C-20%, D-?%. What is D's share?",
      options: ["10%", "15%", "20%", "25%"],
      correctAnswer: 1,
      explanation: "Total must be 100%. D = 100 - (40+25+20) = 15%",
      careerConnection: ["Market Research", "Business Analysis"],
      skillTag: "Pie Chart Analysis"
    },
    {
      id: 'data_004',
      domain: COGNITIVE_DOMAINS.DATA_INTERPRETATION,
      difficulty: DIFFICULTY_LEVELS.MEDIUM,
      question: "Given data: Q1-80, Q2-90, Q3-85, Q4-95. What is the average?",
      options: ["85", "87.5", "90", "92.5"],
      correctAnswer: 1,
      explanation: "Average = (80+90+85+95)/4 = 350/4 = 87.5",
      careerConnection: ["Data Science", "Analytics", "Finance"],
      skillTag: "Average Calculation"
    },
    {
      id: 'data_005',
      domain: COGNITIVE_DOMAINS.DATA_INTERPRETATION,
      difficulty: DIFFICULTY_LEVELS.HARD,
      question: "A table shows: Product A sold 200 units at $50, Product B sold 150 units at $70. What's the average revenue per unit?",
      options: ["$58.57", "$60.00", "$62.50", "$65.00"],
      correctAnswer: 0,
      explanation: "Total revenue = (200×50)+(150×70) = 10000+10500 = 20500. Total units = 350. Avg = 20500/350 = $58.57",
      careerConnection: ["Finance", "Business Analytics", "Sales"],
      skillTag: "Weighted Average"
    },
    {
      id: 'data_006',
      domain: COGNITIVE_DOMAINS.DATA_INTERPRETATION,
      difficulty: DIFFICULTY_LEVELS.HARD,
      question: "A line graph shows temperature: 8am-20°C, 12pm-28°C, 4pm-24°C. What's the average rate of temperature change from 8am to 12pm per hour?",
      options: ["1°C/hr", "2°C/hr", "3°C/hr", "4°C/hr"],
      correctAnswer: 1,
      explanation: "Change = 28-20 = 8°C over 4 hours. Rate = 8/4 = 2°C per hour",
      careerConnection: ["Meteorology", "Data Science", "Trend Analysis"],
      skillTag: "Rate of Change"
    },
    {
      id: 'data_007',
      domain: COGNITIVE_DOMAINS.DATA_INTERPRETATION,
      difficulty: DIFFICULTY_LEVELS.EXPERT,
      question: "Given standard deviation = 5 and mean = 50 in a normal distribution, what percentage of data falls between 45 and 55?",
      options: ["34%", "68%", "95%", "99.7%"],
      correctAnswer: 1,
      explanation: "45 to 55 is within ±1 standard deviation from mean. In normal distribution, this contains ~68% of data",
      careerConnection: ["Statistics", "Data Science", "Quality Control"],
      skillTag: "Statistical Analysis"
    },
    {
      id: 'data_008',
      domain: COGNITIVE_DOMAINS.DATA_INTERPRETATION,
      difficulty: DIFFICULTY_LEVELS.EXPERT,
      question: "A scatter plot shows correlation coefficient r = -0.85. What does this indicate?",
      options: [
        "Strong positive correlation",
        "Strong negative correlation",
        "Weak positive correlation",
        "No correlation"
      ],
      correctAnswer: 1,
      explanation: "r = -0.85 indicates a strong negative correlation (close to -1)",
      careerConnection: ["Data Science", "Research", "Predictive Analytics"],
      skillTag: "Correlation Analysis"
    }
  ]
};

// Quick-Fire Module - Mixed domains for 5-minute dash
export const QUICK_FIRE_QUESTIONS = [
  QUESTION_BANK.numerical[0], // Easy arithmetic
  QUESTION_BANK.logical[0],   // Easy pattern
  QUESTION_BANK.verbal[0],    // Easy synonym
  QUESTION_BANK.spatial[0],   // Easy shape pattern
  QUESTION_BANK.dataInterpretation[0], // Easy chart
  QUESTION_BANK.numerical[2], // Medium speed problem
  QUESTION_BANK.logical[2],   // Medium coding
  QUESTION_BANK.verbal[2],    // Medium antonym
  QUESTION_BANK.spatial[2],   // Medium cube
  QUESTION_BANK.dataInterpretation[2], // Medium pie chart
  QUESTION_BANK.numerical[4], // Hard profit/loss
  QUESTION_BANK.logical[4],   // Hard deduction
  QUESTION_BANK.verbal[4],    // Hard vocabulary
  QUESTION_BANK.spatial[4],   // Hard folding
  QUESTION_BANK.dataInterpretation[4] // Hard weighted avg
];

// Brain Facts for insight pop-ups
export const BRAIN_FACTS = [
  "🧠 Your brain processes visual information 60,000x faster than text!",
  "⚡ You just activated the same neural pathways used by top consultants at McKinsey!",
  "🎯 Studies show aptitude tests predict job performance 5x better than interviews!",
  "💡 The prefrontal cortex you just used is the same area Einstein excelled in!",
  "🚀 You're solving problems 40% faster than the average bank exam aspirant!",
  "🌟 Spatial reasoning like this is shared by 90% of top architects!",
  "📊 Data interpretation skills you just used are valued at $120K+ in tech!",
  "🏆 Logical reasoning like yours correlates with 85% success rate in coding interviews!",
  "💎 Verbal ability at this level places you in top 15% for management roles!",
  "🔥 Numerical agility you demonstrated is a core trait of CFOs and finance leaders!"
];

// Domain-specific superpower reveals
export const DOMAIN_SUPERPOWERS = {
  [COGNITIVE_DOMAINS.NUMERICAL]: {
    poor: { title: "💰 Building Blocks", message: "You're developing Financial Literacy. Practice more to unlock Pro Banker potential!" },
    average: { title: "📊 Number Cruncher", message: "Solid Financial Literacy! You're ready for data-driven roles in business and analytics." },
    good: { title: "💎 Financial Wizard", message: "Strong Financial Literacy! Top 25% - perfect for banking, finance, and strategic planning." },
    excellent: { title: "🏆 Pro Banker", message: "Outstanding Financial Literacy! Top 5% - you have what it takes for senior finance roles and investment banking." }
  },
  [COGNITIVE_DOMAINS.LOGICAL]: {
    poor: { title: "🔍 Pattern Seeker", message: "You're building Systematic Thinking. Keep practicing to sharpen your logical edge!" },
    average: { title: "⚙️ Logic Engine", message: "Good Systematic Thinking! You can tackle structured problems in tech and operations." },
    good: { title: "🧩 Strategic Mind", message: "Strong Systematic Thinking! Top 25% - excellent for consulting, programming, and problem-solving roles." },
    excellent: { title: "🎯 Strategic Genius", message: "Exceptional Systematic Thinking! Top 5% - you're wired for consulting, strategy, and complex problem-solving." }
  },
  [COGNITIVE_DOMAINS.VERBAL]: {
    poor: { title: "📝 Word Builder", message: "You're developing Communication Authority. Practice to unlock persuasion and influence skills!" },
    average: { title: "💬 Clear Communicator", message: "Solid Communication Authority! You can express ideas clearly in professional settings." },
    good: { title: "🎤 Persuasion Master", message: "Strong Communication Authority! Top 25% - ideal for marketing, sales, and leadership roles." },
    excellent: { title: "🏅 Communication Authority", message: "Outstanding Verbal Ability! Top 5% - you have the persuasion power for executive and leadership positions." }
  },
  [COGNITIVE_DOMAINS.SPATIAL]: {
    poor: { title: "🎨 Visual Explorer", message: "You're building Design Intuition. Practice spatial problems to unlock creative potential!" },
    average: { title: "🖌️ Visual Thinker", message: "Good Design Intuition! You can work with visual and spatial concepts in design and engineering." },
    good: { title: "🏗️ Spatial Architect", message: "Strong Design Intuition! Top 25% - perfect for architecture, UI/UX, and creative design roles." },
    excellent: { title: "🌟 Design Visionary", message: "Exceptional Design Intuition! Top 5% - you're built for architecture, 3D design, and creative innovation." }
  },
  [COGNITIVE_DOMAINS.DATA_INTERPRETATION]: {
    poor: { title: "📈 Data Learner", message: "You're building Strategic Insight. Practice interpreting data to unlock analytical power!" },
    average: { title: "📊 Data Reader", message: "Good Strategic Insight! You can analyze basic data patterns and trends." },
    good: { title: "🔬 Analytics Pro", message: "Strong Strategic Insight! Top 25% - ready for business intelligence and data analyst roles." },
    excellent: { title: "💡 Strategic Insight", message: "Outstanding Data Interpretation! Top 5% - you're equipped for data science, analytics, and strategic decision-making." }
  }
};

// Helper function to get questions by domain and difficulty
export function getQuestionsByDomain(domain, difficulty = null) {
  const domainKey = Object.keys(QUESTION_BANK).find(key => 
    QUESTION_BANK[key][0]?.domain === domain
  );
  
  if (!domainKey) return [];
  
  const questions = QUESTION_BANK[domainKey];
  
  if (difficulty === null) return questions;
  
  return questions.filter(q => q.difficulty === difficulty);
}

// Helper function to calculate domain scores
export function calculateDomainScore(answers, domain) {
  const domainQuestions = Object.values(QUESTION_BANK)
    .flat()
    .filter(q => q.domain === domain);
    
  let correct = 0;
  let total = 0;
  
  domainQuestions.forEach(q => {
    if (answers[q.id] !== undefined) {
      total++;
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    }
  });
  
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

// Helper function to get superpower based on score
export function getSuperpowerForScore(domain, score) {
  const domainPowers = DOMAIN_SUPERPOWERS[domain];
  if (!domainPowers) return null;
  
  if (score < 40) return domainPowers.poor;
  if (score < 60) return domainPowers.average;
  if (score < 80) return domainPowers.good;
  return domainPowers.excellent;
}
