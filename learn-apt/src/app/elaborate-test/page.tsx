"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Brain, ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";

interface Question {
  id: string;
  text: string;
  options: {
    value: string;
    label: string;
  }[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

const modules: Module[] = [
  {
    id: "learning-styles",
    title: "Learning Styles Assessment",
    description: "Comprehensive evaluation of how you prefer to receive and process information.",
    questions: [
      {
        id: "ls1",
        text: "When learning a new software application, I prefer to:",
        options: [
          { value: "visual", label: "Watch video tutorials or demonstrations" },
          { value: "auditory", label: "Listen to explanations or podcasts about it" },
          { value: "kinesthetic", label: "Jump right in and experiment with it" },
          { value: "reading", label: "Read the manual or documentation" },
        ],
      },
      {
        id: "ls2",
        text: "During presentations, I pay most attention when:",
        options: [
          { value: "visual", label: "There are slides with graphics and visuals" },
          { value: "auditory", label: "The speaker is engaging and articulate" },
          { value: "kinesthetic", label: "There are interactive activities included" },
          { value: "reading", label: "There are handouts to follow along" },
        ],
      },
      {
        id: "ls3",
        text: "I study most effectively when:",
        options: [
          { value: "visual", label: "Using mind maps and color-coded notes" },
          { value: "auditory", label: "Recording and listening to lectures" },
          { value: "kinesthetic", label: "Moving around or using flashcards" },
          { value: "reading", label: "Reading and rewriting notes" },
        ],
      },
      {
        id: "ls4",
        text: "When remembering directions, I:",
        options: [
          { value: "visual", label: "Visualize the route in my mind" },
          { value: "auditory", label: "Repeat the directions out loud" },
          { value: "kinesthetic", label: "Remember by driving/walking the route" },
          { value: "reading", label: "Write down the directions" },
        ],
      },
      {
        id: "ls5",
        text: "I express my ideas best through:",
        options: [
          { value: "visual", label: "Drawings, diagrams, or presentations" },
          { value: "auditory", label: "Verbal discussions and explanations" },
          { value: "kinesthetic", label: "Physical demonstrations or models" },
          { value: "reading", label: "Written documents and reports" },
        ],
      },
      {
        id: "ls6",
        text: "When assembling furniture or equipment, I prefer to:",
        options: [
          { value: "visual", label: "Look at diagrams and pictures" },
          { value: "auditory", label: "Have someone explain the steps" },
          { value: "kinesthetic", label: "Figure it out by trial and error" },
          { value: "reading", label: "Read the written instructions carefully" },
        ],
      },
      {
        id: "ls7",
        text: "In a training session, I learn best when:",
        options: [
          { value: "visual", label: "The instructor uses visual aids and demonstrations" },
          { value: "auditory", label: "The instructor lectures and explains verbally" },
          { value: "kinesthetic", label: "I can practice hands-on exercises" },
          { value: "reading", label: "I have comprehensive written materials" },
        ],
      },
      {
        id: "ls8",
        text: "When recalling a past event, I tend to remember:",
        options: [
          { value: "visual", label: "What I saw - images and scenes" },
          { value: "auditory", label: "What was said - conversations and sounds" },
          { value: "kinesthetic", label: "What I did - my actions and feelings" },
          { value: "reading", label: "Details I read or wrote down" },
        ],
      },
      {
        id: "ls9",
        text: "When trying to concentrate, I need:",
        options: [
          { value: "visual", label: "A clean, organized visual environment" },
          { value: "auditory", label: "Quiet or appropriate background sounds" },
          { value: "kinesthetic", label: "Freedom to move or fidget" },
          { value: "reading", label: "Written materials to reference" },
        ],
      },
      {
        id: "ls10",
        text: "When shopping for a product, I make decisions based on:",
        options: [
          { value: "visual", label: "How it looks and visual appeal" },
          { value: "auditory", label: "Reviews and recommendations I've heard" },
          { value: "kinesthetic", label: "How it feels and hands-on testing" },
          { value: "reading", label: "Specifications and written reviews" },
        ],
      },
    ],
  },
    {
    id: "cognitive-patterns",
    title: "Cognitive Patterns",
    description: "Explore how you think, process information, and approach mental challenges.",
    questions: [
      {
        id: "cp1",
        text: "When solving problems, I typically:",
        options: [
          { value: "sequential", label: "Work through steps in logical order" },
          { value: "global", label: "See the big picture first, then details" },
          { value: "analytical", label: "Break down into components" },
          { value: "intuitive", label: "Follow my instincts and hunches" },
        ],
      },
      {
        id: "cp2",
        text: "I process new information best when:",
        options: [
          { value: "concrete", label: "It's presented with real examples" },
          { value: "abstract", label: "I can understand the underlying theory" },
          { value: "practical", label: "I can see its practical application" },
          { value: "conceptual", label: "I understand how it connects to other ideas" },
        ],
      },
      {
        id: "cp3",
        text: "In discussions, I tend to:",
        options: [
          { value: "think-first", label: "Think carefully before speaking" },
          { value: "talk-through", label: "Talk through ideas to understand them" },
          { value: "question", label: "Ask many questions to clarify" },
          { value: "observe", label: "Observe and listen before contributing" },
        ],
      },
      {
        id: "cp4",
        text: "When facing ambiguity, I:",
        options: [
          { value: "structured", label: "Seek structure and clear guidelines" },
          { value: "explore", label: "Enjoy exploring possibilities" },
          { value: "research", label: "Research until I have clarity" },
          { value: "act", label: "Make a decision and adapt as I go" },
        ],
      },
      {
        id: "cp5",
        text: "My thinking style is best described as:",
        options: [
          { value: "linear", label: "Linear and methodical" },
          { value: "holistic", label: "Holistic and integrative" },
          { value: "creative", label: "Creative and divergent" },
          { value: "critical", label: "Critical and evaluative" },
        ],
      },
      {
        id: "cp6",
        text: "When learning something complex, I prefer to:",
        options: [
          { value: "sequential", label: "Learn step-by-step in order" },
          { value: "random", label: "Jump around to what interests me" },
          { value: "structured", label: "Follow a structured curriculum" },
          { value: "discovery", label: "Discover connections on my own" },
        ],
      },
      {
        id: "cp7",
        text: "I make connections between ideas by:",
        options: [
          { value: "categorizing", label: "Categorizing and grouping similar concepts" },
          { value: "analogies", label: "Using analogies and comparisons" },
          { value: "patterns", label: "Recognizing patterns and relationships" },
          { value: "experience", label: "Relating to personal experiences" },
        ],
      },
      {
        id: "cp8",
        text: "When analyzing information, I focus on:",
        options: [
          { value: "details", label: "Specific details and facts" },
          { value: "overview", label: "Overall concepts and themes" },
          { value: "implications", label: "Implications and consequences" },
          { value: "accuracy", label: "Accuracy and precision" },
        ],
      },
      {
        id: "cp9",
        text: "I understand new concepts best when:",
        options: [
          { value: "explained", label: "They are clearly explained with examples" },
          { value: "explored", label: "I can explore them independently" },
          { value: "compared", label: "I can compare them to what I know" },
          { value: "applied", label: "I can apply them immediately" },
        ],
      },
      {
        id: "cp10",
        text: "When making sense of complex data, I prefer to:",
        options: [
          { value: "organize", label: "Organize it into tables or lists" },
          { value: "visualize", label: "Create visual representations" },
          { value: "summarize", label: "Write summaries and key points" },
          { value: "discuss", label: "Discuss and debate the findings" },
        ],
      },
    ],
  },
  // Continue with the next modules from your gist
    {
    id: "problem-solving-deep",
    title: "Problem-Solving Approach",
    description: "Detailed analysis of your strategies for tackling challenges.",
    questions: [
      {
        id: "psd1",
        text: "When I encounter a problem, my first instinct is to:",
        options: [
          { value: "define", label: "Clearly define what the problem is" },
          { value: "research", label: "Research how others have solved it" },
          { value: "brainstorm", label: "Brainstorm possible solutions" },
          { value: "act", label: "Try something and see what happens" },
        ],
      },
      {
        id: "psd2",
        text: "I prefer to work on problems:",
        options: [
          { value: "alone", label: "Alone with focused concentration" },
          { value: "partner", label: "With a partner for discussion" },
          { value: "team", label: "In a team with diverse perspectives" },
          { value: "flexible", label: "Varies depending on the problem" },
        ],
      },
      {
        id: "psd3",
        text: "When stuck on a problem, I usually:",
        options: [
          { value: "persist", label: "Keep working until I solve it" },
          { value: "break", label: "Take a break and return fresh" },
          { value: "switch", label: "Switch to a different approach" },
          { value: "help", label: "Seek help or collaboration" },
        ],
      },
      {
        id: "psd4",
        text: "I evaluate solutions by:",
        options: [
          { value: "logic", label: "Logical analysis of pros and cons" },
          { value: "testing", label: "Testing and experimentation" },
          { value: "feedback", label: "Getting feedback from others" },
          { value: "intuition", label: "Trusting my gut feeling" },
        ],
      },
      {
        id: "psd5",
        text: "After solving a problem, I:",
        options: [
          { value: "document", label: "Document the solution for future reference" },
          { value: "move-on", label: "Move on to the next challenge" },
          { value: "reflect", label: "Reflect on what I learned" },
          { value: "share", label: "Share the solution with others" },
        ],
      },
      {
        id: "psd6",
        text: "I approach unfamiliar problems by:",
        options: [
          { value: "similar", label: "Looking for similar problems I've solved" },
          { value: "breakdown", label: "Breaking them down into smaller parts" },
          { value: "resources", label: "Finding resources and information first" },
          { value: "experiment", label: "Experimenting with different approaches" },
        ],
      },
      {
        id: "psd7",
        text: "When collaborating on problem-solving, I:",
        options: [
          { value: "lead", label: "Naturally take the lead" },
          { value: "contribute", label: "Contribute ideas and suggestions" },
          { value: "analyze", label: "Analyze and critique proposed solutions" },
          { value: "support", label: "Support and help implement others' ideas" },
        ],
      },
      {
        id: "psd8",
        text: "My problem-solving speed is:",
        options: [
          { value: "quick", label: "Quick - I make fast decisions" },
          { value: "deliberate", label: "Deliberate - I take time to think through" },
          { value: "variable", label: "Variable - depends on the problem" },
          { value: "thorough", label: "Thorough - I explore all options" },
        ],
      },
      {
        id: "psd9",
        text: "I verify my solutions by:",
        options: [
          { value: "testing", label: "Testing them thoroughly" },
          { value: "review", label: "Having others review them" },
          { value: "logic", label: "Checking the logic step-by-step" },
          { value: "outcomes", label: "Evaluating the outcomes" },
        ],
      },
      {
        id: "psd10",
        text: "When faced with multiple problems, I:",
        options: [
          { value: "prioritize", label: "Prioritize and tackle them in order" },
          { value: "parallel", label: "Work on multiple problems simultaneously" },
          { value: "urgent", label: "Focus on the most urgent first" },
          { value: "easy", label: "Start with the easiest to build momentum" },
        ],
      },
    ],
  },
  {
    id: "motivation-comprehensive",
    title: "Motivation & Drive",
    description: "Comprehensive assessment of what motivates and sustains your effort.",
    questions: [
      {
        id: "mc1",
        text: "I am most motivated to learn when:",
        options: [
          { value: "interest", label: "The topic genuinely interests me" },
          { value: "necessity", label: "It's necessary for my goals" },
          { value: "challenge", label: "It presents a challenging puzzle" },
          { value: "reward", label: "There's a clear reward or outcome" },
        ],
      },
      // ...continue pasting next for all modules/questions, keeping the object/array structure the same...
            {
        id: "mc2",
        text: "I set goals that are:",
        options: [
          { value: "ambitious", label: "Ambitious and stretching" },
          { value: "achievable", label: "Realistic and achievable" },
          { value: "incremental", label: "Small and incremental" },
          { value: "flexible", label: "Flexible and adjustable" },
        ],
      },
      {
        id: "mc3",
        text: "Feedback motivates me most when it:",
        options: [
          { value: "positive", label: "Recognizes my achievements" },
          { value: "constructive", label: "Helps me improve" },
          { value: "specific", label: "Is specific and actionable" },
          { value: "comparative", label: "Shows how I compare to others" },
        ],
      },
      {
        id: "mc4",
        text: "I maintain long-term motivation through:",
        options: [
          { value: "vision", label: "Keeping my end vision in mind" },
          { value: "milestones", label: "Celebrating small milestones" },
          { value: "habits", label: "Building consistent habits" },
          { value: "variety", label: "Keeping things varied and fresh" },
        ],
      },
      {
        id: "mc5",
        text: "What energizes me most is:",
        options: [
          { value: "mastery", label: "Mastering new skills" },
          { value: "connection", label: "Connecting with others" },
          { value: "autonomy", label: "Having autonomy and control" },
          { value: "purpose", label: "Contributing to something meaningful" },
        ],
      },
      {
        id: "mc6",
        text: "I stay committed to long-term goals by:",
        options: [
          { value: "visualization", label: "Visualizing success" },
          { value: "planning", label: "Detailed planning and tracking" },
          { value: "accountability", label: "Accountability partners or groups" },
          { value: "passion", label: "Passion and personal interest" },
        ],
      },
      {
        id: "mc7",
        text: "When I lose motivation, I recover by:",
        options: [
          { value: "break", label: "Taking a break and returning refreshed" },
          { value: "why", label: "Reconnecting with my 'why'" },
          { value: "support", label: "Seeking support and encouragement" },
          { value: "wins", label: "Reviewing past wins and progress" },
        ],
      },
      {
        id: "mc8",
        text: "I learn best when the content is:",
        options: [
          { value: "engaging", label: "Engaging and entertaining" },
          { value: "relevant", label: "Directly relevant to my goals" },
          { value: "challenging", label: "Appropriately challenging" },
          { value: "practical", label: "Practical and immediately useful" },
        ],
      },
      {
        id: "mc9",
        text: "Rewards that motivate me most are:",
        options: [
          { value: "recognition", label: "Recognition and praise" },
          { value: "achievement", label: "Sense of achievement" },
          { value: "tangible", label: "Tangible rewards or benefits" },
          { value: "growth", label: "Personal growth and development" },
        ],
      },
      {
        id: "mc10",
        text: "My persistence level when facing obstacles is:",
        options: [
          { value: "determined", label: "Very determined - I rarely give up" },
          { value: "strategic", label: "Strategic - I pivot when needed" },
          { value: "goal-dependent", label: "Depends on how important the goal is" },
          { value: "help-seeking", label: "I seek help to overcome obstacles" },
        ],
      },
    ],
  },
  // ------------ continue with further modules (environment-preferences, numerical-data-reasoning, etc.) ------------
    {
    id: "environment-preferences",
    title: "Learning Environment Preferences",
    description: "Identify the conditions that help you learn most effectively.",
    questions: [
      {
        id: "ep1",
        text: "My ideal learning environment is:",
        options: [
          { value: "quiet", label: "Quiet and distraction-free" },
          { value: "background", label: "With background noise or music" },
          { value: "social", label: "With others around for interaction" },
          { value: "varied", label: "Varies depending on my mood" },
        ],
      },
      {
        id: "ep2",
        text: "I learn best at:",
        options: [
          { value: "morning", label: "Early morning when I'm fresh" },
          { value: "afternoon", label: "Afternoon after warming up" },
          { value: "evening", label: "Evening when things quiet down" },
          { value: "night", label: "Late night with no distractions" },
        ],
      },
      {
        id: "ep3",
        text: "For sustained learning, I need:",
        options: [
          { value: "long-blocks", label: "Long uninterrupted blocks of time" },
          { value: "short-bursts", label: "Short focused bursts with breaks" },
          { value: "variety", label: "Variety in activities and topics" },
          { value: "flexibility", label: "Flexibility to follow my interest" },
        ],
      },
      {
        id: "ep4",
        text: "Technology in learning helps me:",
        options: [
          { value: "essential", label: "It's essential for how I learn" },
          { value: "supplement", label: "As a supplement to other methods" },
          { value: "sometimes", label: "Sometimes, but I prefer traditional methods" },
          { value: "minimal", label: "I prefer minimal technology" },
        ],
      },
      {
        id: "ep5",
        text: "I prefer learning resources that are:",
        options: [
          { value: "structured", label: "Highly structured with clear paths" },
          { value: "exploratory", label: "Exploratory with room to wander" },
          { value: "interactive", label: "Interactive with immediate feedback" },
          { value: "comprehensive", label: "Comprehensive and detailed" },
        ],
      },
      {
        id: "ep6",
        text: "My ideal workspace has:",
        options: [
          { value: "minimal", label: "Minimal clutter and distractions" },
          { value: "personal", label: "Personal items and decorations" },
          { value: "tools", label: "All necessary tools and resources nearby" },
          { value: "flexible", label: "Flexibility to change as needed" },
        ],
      },
      {
        id: "ep7",
        text: "For online learning, I prefer:",
        options: [
          { value: "live", label: "Live sessions with real-time interaction" },
          { value: "recorded", label: "Recorded videos I can watch anytime" },
          { value: "self-paced", label: "Self-paced courses with no deadlines" },
          { value: "structured", label: "Structured courses with set schedules" },
        ],
      },
      {
        id: "ep8",
        text: "I concentrate better when:",
        options: [
          { value: "alone", label: "Working alone in isolation" },
          { value: "library", label: "In a quiet public space like a library" },
          { value: "cafe", label: "In a cafe with ambient noise" },
          { value: "home", label: "In my comfortable home environment" },
        ],
      },
      {
        id: "ep9",
        text: "During study sessions, I need breaks:",
        options: [
          { value: "rarely", label: "Rarely - I can focus for long periods" },
          { value: "regular", label: "At regular intervals (e.g., Pomodoro)" },
          { value: "intuitive", label: "When I feel I need them" },
          { value: "frequent", label: "Frequently - short intense sessions work best" },
        ],
      },
      {
        id: "ep10",
        text: "Physical comfort during learning is:",
        options: [
          { value: "critical", label: "Critical - I need the right setup" },
          { value: "important", label: "Important but adaptable" },
          { value: "minimal", label: "Minimally important" },
          { value: "varies", label: "Varies by task and duration" },
        ],
      },
    ],
  },
  // -------- continue: numerical-data-reasoning, etc. --------
    {
    id: "numerical-data-reasoning",
    title: "Numerical & Data Reasoning",
    description: "Comprehensive evaluation of numerical aptitude and data interpretation skills.",
    questions: [
      {
        id: "ndr1",
        text: "A shopkeeper sells an item for ₹1,350 after giving a 10% discount. What was the original price?",
        options: [
          { value: "a", label: "A) ₹1,450" },
          { value: "b", label: "B) ₹1,485" },
          { value: "c", label: "C) ₹1,500" },
          { value: "d", label: "D) ₹1,550" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr2",
        text: "If 5 workers can complete a task in 12 days, how many days will 8 workers take at the same rate?",
        options: [
          { value: "a", label: "A) 6.5 days" },
          { value: "b", label: "B) 7 days" },
          { value: "c", label: "C) 7.5 days" },
          { value: "d", label: "D) 8 days" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr3",
        text: "A tank is 3/4 full. After using 30 liters, it becomes 1/2 full. What is the tank's capacity?",
        options: [
          { value: "a", label: "A) 100 liters" },
          { value: "b", label: "B) 120 liters" },
          { value: "c", label: "C) 140 liters" },
          { value: "d", label: "D) 150 liters" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr4",
        text: "A person invests ₹25,000 at 8% simple interest per annum. What is the interest after 3 years?",
        options: [
          { value: "a", label: "A) ₹5,000" },
          { value: "b", label: "B) ₹5,500" },
          { value: "c", label: "C) ₹6,000" },
          { value: "d", label: "D) ₹6,500" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr5",
        text: "What is the average of the following numbers: 42, 58, 73, 61, 51?",
        options: [
          { value: "a", label: "A) 55" },
          { value: "b", label: "B) 57" },
          { value: "c", label: "C) 59" },
          { value: "d", label: "D) 61" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr6",
        text: "A train travels 240 km in 4 hours. What is its average speed in km/h?",
        options: [
          { value: "a", label: "A) 55 km/h" },
          { value: "b", label: "B) 60 km/h" },
          { value: "c", label: "C) 65 km/h" },
          { value: "d", label: "D) 70 km/h" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr7",
        text: "If the ratio of boys to girls in a class is 3:2 and there are 15 boys, how many girls are there?",
        options: [
          { value: "a", label: "A) 8" },
          { value: "b", label: "B) 10" },
          { value: "c", label: "C) 12" },
          { value: "d", label: "D) 15" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr8",
        text: "A book's price increased from ₹400 to ₹500. What is the percentage increase?",
        options: [
          { value: "a", label: "A) 20%" },
          { value: "b", label: "B) 25%" },
          { value: "c", label: "C) 30%" },
          { value: "d", label: "D) 35%" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr9",
        text: "If 3x + 7 = 22, what is the value of x?",
        options: [
          { value: "a", label: "A) 3" },
          { value: "b", label: "B) 5" },
          { value: "c", label: "C) 7" },
          { value: "d", label: "D) 9" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "ndr10",
        text: "A rectangle has length 12 cm and width 8 cm. What is its area?",
        options: [
          { value: "a", label: "A) 20 sq cm" },
          { value: "b", label: "B) 40 sq cm" },
          { value: "c", label: "C) 96 sq cm" },
          { value: "d", label: "D) 192 sq cm" },
          { value: "e", label: "E) I don't know" },
        ],
      },
    ],
  },
  // -------- continue with the next module(s) --------
  {
    id: "quantitative-aptitude",
    title: "Quantitative Aptitude",
    description: "Evaluate your numerical reasoning and problem-solving abilities with practical examples.",
    questions: [
      {
        id: "qa1",
        text: "A vendor sells mangoes at ₹60 per kg and makes a profit of 20%. What was the cost price per kg?",
        options: [
          { value: "45", label: "₹45" },
          { value: "48", label: "₹48" },
          { value: "50", label: "₹50" },
          { value: "55", label: "₹55" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa2",
        text: "If a laptop costs ₹45,000 after a 10% discount, what was the original price?",
        options: [
          { value: "50000", label: "₹50,000" },
          { value: "49500", label: "₹49,500" },
          { value: "48000", label: "₹48,000" },
          { value: "51000", label: "₹51,000" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa3",
        text: "A person saves ₹1,200 per month. If they want to buy a phone worth ₹18,000, how many months of savings are needed?",
        options: [
          { value: "15", label: "15 months" },
          { value: "12", label: "12 months" },
          { value: "18", label: "18 months" },
          { value: "10", label: "10 months" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa4",
        text: "Three friends share a restaurant bill of ₹2,400 in the ratio 2:3:3. How much does the first person pay?",
        options: [
          { value: "600", label: "₹600" },
          { value: "800", label: "₹800" },
          { value: "900", label: "₹900" },
          { value: "750", label: "₹750" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa5",
        text: "A shopkeeper marks up an item by 25% and then offers a 10% discount. If the cost price is ₹800, what is the selling price?",
        options: [
          { value: "900", label: "₹900" },
          { value: "850", label: "₹850" },
          { value: "920", label: "₹920" },
          { value: "880", label: "₹880" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa6",
        text: "A car depreciates 15% annually. If it costs ₹5,00,000 today, what will be its approximate value after 2 years?",
        options: [
          { value: "361250", label: "₹3,61,250" },
          { value: "425000", label: "₹4,25,000" },
          { value: "400000", label: "₹4,00,000" },
          { value: "375000", label: "₹3,75,000" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa7",
        text: "If the ratio of boys to girls in a class is 3:2 and there are 40 students, how many girls are there?",
        options: [
          { value: "12", label: "12" },
          { value: "14", label: "14" },
          { value: "16", label: "16" },
          { value: "18", label: "18" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa8",
        text: "A sum of ₹10,000 becomes ₹13,310 in 3 years at compound interest. What is the annual rate of interest?",
        options: [
          { value: "8", label: "8%" },
          { value: "10", label: "10%" },
          { value: "12", label: "12%" },
          { value: "15", label: "15%" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa9",
        text: "A pipe can fill a tank in 6 hours. Another pipe can empty it in 8 hours. If both are opened, how long will it take to fill the tank?",
        options: [
          { value: "20", label: "20 hours" },
          { value: "22", label: "22 hours" },
          { value: "24", label: "24 hours" },
          { value: "26", label: "26 hours" },
          { value: "idk", label: "I don't know" },
        ],
      },
      {
        id: "qa10",
        text: "A merchant buys goods worth ₹15,000 and sells them at a loss of 12%. What is the selling price?",
        options: [
          { value: "13200", label: "₹13,200" },
          { value: "13500", label: "₹13,500" },
          { value: "14000", label: "₹14,000" },
          { value: "14200", label: "₹14,200" },
          { value: "idk", label: "I don't know" },
        ],
      },
    ],
  },
  // -------- continue with next modules (abstract-logical-reasoning, etc.) --------
  {
    id: "abstract-logical-reasoning",
    title: "Abstract & Logical Reasoning",
    description: "Advanced pattern recognition, logical deduction, and analytical thinking.",
    questions: [
      {
        id: "alr1",
        text: "Complete the series: 3, 9, 27, 81, ?",
        options: [
          { value: "a", label: "A) 162" },
          { value: "b", label: "B) 216" },
          { value: "c", label: "C) 243" },
          { value: "d", label: "D) 324" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr2",
        text: "If all roses are flowers and some flowers are red, which conclusion is certain?",
        options: [
          { value: "a", label: "A) All roses are red" },
          { value: "b", label: "B) Some roses are red" },
          { value: "c", label: "C) All red things are roses" },
          { value: "d", label: "D) None of these is certain" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr3",
        text: "What comes next in the pattern: Z, Y, X, W, V, ?",
        options: [
          { value: "a", label: "A) T" },
          { value: "b", label: "B) U" },
          { value: "c", label: "C) S" },
          { value: "d", label: "D) R" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr4",
        text: "If CODE is written as FRGH, how is MIND written?",
        options: [
          { value: "a", label: "A) PLQG" },
          { value: "b", label: "B) NLQG" },
          { value: "c", label: "C) OKPI" },
          { value: "d", label: "D) MIND" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr5",
        text: "What is the next number in the sequence: 2, 5, 11, 23, 47, ?",
        options: [
          { value: "a", label: "A) 89" },
          { value: "b", label: "B) 91" },
          { value: "c", label: "C) 93" },
          { value: "d", label: "D) 95" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr6",
        text: "If A > B and B > C, which statement must be true?",
        options: [
          { value: "a", label: "A) A < C" },
          { value: "b", label: "B) A = C" },
          { value: "c", label: "C) A > C" },
          { value: "d", label: "D) Cannot be determined" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr7",
        text: "Complete the pattern: 1, 4, 9, 16, 25, ?",
        options: [
          { value: "a", label: "A) 30" },
          { value: "b", label: "B) 32" },
          { value: "c", label: "C) 35" },
          { value: "d", label: "D) 36" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr8",
        text: "If CAT = 24, DOG = 26, what does BAT equal? (Hint: Sum the position values of letters)",
        options: [
          { value: "a", label: "A) 22" },
          { value: "b", label: "B) 23" },
          { value: "c", label: "C) 24" },
          { value: "d", label: "D) 25" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr9",
        text: "Which number doesn't belong: 2, 3, 6, 7, 8, 14, 15?",
        options: [
          { value: "a", label: "A) 6" },
          { value: "b", label: "B) 7" },
          { value: "c", label: "C) 8" },
          { value: "d", label: "D) 15" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "alr10",
        text: "If all Zips are Zaps and some Zaps are Zops, which is certain?",
        options: [
          { value: "a", label: "A) All Zips are Zops" },
          { value: "b", label: "B) Some Zips are Zops" },
          { value: "c", label: "C) Some Zaps are Zips" },
          { value: "d", label: "D) None is certain" },
          { value: "e", label: "E) I don't know" },
        ],
      },
    ],
  },
  // --------- next module: spatial-visual-reasoning, etc. ---------
  {
    id: "spatial-visual-reasoning",
    title: "Spatial & Visual Reasoning",
    description: "Assess spatial awareness, visual pattern recognition, and mechanical aptitude.",
    questions: [
      {
        id: "svr1",
        text: "A cube is painted red on all faces and then cut into 27 smaller equal cubes. How many cubes have exactly one face painted?",
        options: [
          { value: "a", label: "A) 4" },
          { value: "b", label: "B) 6" },
          { value: "c", label: "C) 8" },
          { value: "d", label: "D) 12" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr2",
        text: "If you fold a square paper in half twice and make one cut, how many holes will appear when unfolded?",
        options: [
          { value: "a", label: "A) 2 holes" },
          { value: "b", label: "B) 4 holes" },
          { value: "c", label: "C) 6 holes" },
          { value: "d", label: "D) 8 holes" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr3",
        text: "Looking at a clock mirror reflection showing 3:40, what is the actual time?",
        options: [
          { value: "a", label: "A) 8:20" },
          { value: "b", label: "B) 8:40" },
          { value: "c", label: "C) 9:20" },
          { value: "d", label: "D) 9:40" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr4",
        text: "A gear with 20 teeth rotates clockwise. A connected gear with 40 teeth will rotate:",
        options: [
          { value: "a", label: "A) Clockwise at half speed" },
          { value: "b", label: "B) Counter-clockwise at half speed" },
          { value: "c", label: "C) Clockwise at double speed" },
          { value: "d", label: "D) Counter-clockwise at double speed" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr5",
        text: "How many faces does a rectangular prism (cuboid) have?",
        options: [
          { value: "a", label: "A) 4" },
          { value: "b", label: "B) 6" },
          { value: "c", label: "C) 8" },
          { value: "d", label: "D) 12" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr6",
        text: "If you rotate the letter 'N' by 90 degrees clockwise, it looks most like:",
        options: [
          { value: "a", label: "A) Z" },
          { value: "b", label: "B) The same N" },
          { value: "c", label: "C) A rotated Z" },
          { value: "d", label: "D) Cannot be determined" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr7",
        text: "How many edges does a cube have?",
        options: [
          { value: "a", label: "A) 6" },
          { value: "b", label: "B) 8" },
          { value: "c", label: "C) 10" },
          { value: "d", label: "D) 12" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr8",
        text: "A square piece of paper is folded in half diagonally. What shape is created?",
        options: [
          { value: "a", label: "A) Rectangle" },
          { value: "b", label: "B) Triangle" },
          { value: "c", label: "C) Pentagon" },
          { value: "d", label: "D) Smaller square" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr9",
        text: "Which 3D shape has no vertices (corners)?",
        options: [
          { value: "a", label: "A) Cube" },
          { value: "b", label: "B) Sphere" },
          { value: "c", label: "C) Pyramid" },
          { value: "d", label: "D) Cylinder" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "svr10",
        text: "If two gears of equal size mesh together and one rotates clockwise, the other rotates:",
        options: [
          { value: "a", label: "A) Clockwise at the same speed" },
          { value: "b", label: "B) Counter-clockwise at the same speed" },
          { value: "c", label: "C) Clockwise at half speed" },
          { value: "d", label: "D) Counter-clockwise at double speed" },
          { value: "e", label: "E) I don't know" },
        ],
      },
    ],
  },
  // -------- next: verbal-reasoning etc. --------
  {
    id: "verbal-reasoning",
    title: "Verbal Reasoning & Comprehension",
    description: "Assess your language skills, vocabulary, and reading comprehension abilities.",
    questions: [
      {
        id: "vr1",
        text: "Choose the word most similar in meaning to 'METICULOUS':",
        options: [
          { value: "a", label: "A) Careless" },
          { value: "b", label: "B) Thorough" },
          { value: "c", label: "C) Quick" },
          { value: "d", label: "D) Lazy" },
        ],
      },
    ],
  },
  {
    id: "verbal-reasoning-2",
    title: "Verbal Reasoning",
    description: "Assess your language comprehension, vocabulary, and verbal logic abilities.",
    questions: [
      {
        id: "vr1",
        text: "Choose the word most similar in meaning to 'BENEVOLENT':",
        options: [
          { value: "a", label: "A) Hostile" },
          { value: "b", label: "B) Kind" },
          { value: "c", label: "C) Indifferent" },
          { value: "d", label: "D) Aggressive" },
          { value: "e", label: "E) I don't know" },
        ],
      },
      {
        id: "vr2",
        text: "Choose the word opposite in meaning to 'EXPAND':",
        options: [
          { value: "a", label: "A) Grow" },
          { value: "b", label: "B) Contract" },
          { value: "c", label: "C) Increase" },
          { value: "d", label: "D) Spread" },
        ],
      },
      {
        id: "vr3",
        text: "Complete the analogy: Book is to Reading as Fork is to:",
        options: [
          { value: "a", label: "A) Drawing" },
          { value: "b", label: "B) Eating" },
          { value: "c", label: "C) Writing" },
          { value: "d", label: "D) Cooking" },
        ],
      },
      {
        id: "vr4",
        text: "Which word does NOT belong with the others?",
        options: [
          { value: "a", label: "A) Rose" },
          { value: "b", label: "B) Tulip" },
          { value: "c", label: "C) Daisy" },
          { value: "d", label: "D) Oak" },
        ],
      },
      {
        id: "vr5",
        text: "The word 'FAST' can mean both quick and firmly fixed. This is an example of:",
        options: [
          { value: "a", label: "A) Synonym" },
          { value: "b", label: "B) Antonym" },
          { value: "c", label: "C) Homonym" },
          { value: "d", label: "D) Metaphor" },
        ],
      },
      {
        id: "vr6",
        text: "Choose the grammatically correct sentence:",
        options: [
          { value: "a", label: "A) Each of the students have a book" },
          { value: "b", label: "B) Each of the students has a book" },
          { value: "c", label: "C) Each of the student has a book" },
          { value: "d", label: "D) Each of the student have a book" },
        ],
      },
      {
        id: "vr7",
        text: "What is the main purpose of a persuasive essay?",
        options: [
          { value: "a", label: "A) To inform" },
          { value: "b", label: "B) To entertain" },
          { value: "c", label: "C) To convince" },
          { value: "d", label: "D) To describe" },
        ],
      },
      {
        id: "vr8",
        text: "In the sentence 'The cat sat on the mat', what is 'on the mat'?",
        options: [
          { value: "a", label: "A) Subject" },
          { value: "b", label: "B) Predicate" },
          { value: "c", label: "C) Prepositional phrase" },
          { value: "d", label: "D) Object" },
        ],
      },
      {
        id: "vr9",
        text: "Which literary device is used: 'The classroom was a zoo'?",
        options: [
          { value: "a", label: "A) Simile" },
          { value: "b", label: "B) Metaphor" },
          { value: "c", label: "C) Personification" },
          { value: "d", label: "D) Hyperbole" },
        ],
      },
      {
        id: "vr10",
        text: "What does the prefix 'pre-' mean?",
        options: [
          { value: "a", label: "A) After" },
          { value: "b", label: "B) Before" },
          { value: "c", label: "C) Against" },
          { value: "d", label: "D) With" },
        ],
      },
    ],
  },
  // -------- next modules! --------
        {
    id: "critical-thinking",
    title: "Critical Thinking",
    description: "Evaluate your ability to analyze arguments, identify assumptions, and draw logical conclusions.",
    questions: [
      {
        id: "ct1",
        text: "When evaluating an argument, I first:",
        options: [
          { value: "a", label: "Identify the main claim" },
          { value: "b", label: "Look for supporting evidence" },
          { value: "c", label: "Consider alternative viewpoints" },
          { value: "d", label: "Check for logical fallacies" },
        ],
      },
      {
        id: "ct2",
        text: "I recognize bias in information by:",
        options: [
          { value: "a", label: "Checking the source's credibility" },
          { value: "b", label: "Looking for emotionally charged language" },
          { value: "c", label: "Comparing multiple sources" },
          { value: "d", label: "Identifying missing information" },
        ],
      },
      {
        id: "ct3",
        text: "When faced with conflicting information, I:",
        options: [
          { value: "a", label: "Research more to find the truth" },
          { value: "b", label: "Evaluate the credibility of each source" },
          { value: "c", label: "Consider that both might be partially correct" },
          { value: "d", label: "Defer to expert opinions" },
        ],
      },
      {
        id: "ct4",
        text: "I question assumptions by:",
        options: [
          { value: "a", label: "Asking 'What if the opposite were true?'" },
          { value: "b", label: "Looking for evidence that supports them" },
          { value: "c", label: "Considering cultural or personal biases" },
          { value: "d", label: "Testing them in real situations" },
        ],
      },
      {
        id: "ct5",
        text: "My approach to analyzing complex issues is to:",
        options: [
          { value: "a", label: "Break them into smaller components" },
          { value: "b", label: "Consider multiple perspectives" },
          { value: "c", label: "Look for patterns and connections" },
          { value: "d", label: "Gather comprehensive data first" },
        ],
      },
      {
        id: "ct6",
        text: "I can tell the difference between fact and opinion by:",
        options: [
          { value: "a", label: "Checking if it can be proven" },
          { value: "b", label: "Identifying subjective language" },
          { value: "c", label: "Looking for citations and sources" },
          { value: "d", label: "Considering the context" },
        ],
      },
      {
        id: "ct7",
        text: "When making important decisions, I:",
        options: [
          { value: "a", label: "List pros and cons systematically" },
          { value: "b", label: "Consider long-term consequences" },
          { value: "c", label: "Seek input from others" },
          { value: "d", label: "Trust my intuition based on experience" },
        ],
      },
      {
        id: "ct8",
        text: "I evaluate the strength of evidence by considering:",
        options: [
          { value: "a", label: "Sample size and methodology" },
          { value: "b", label: "Source credibility and expertise" },
          { value: "c", label: "Consistency with other evidence" },
          { value: "d", label: "Recency and relevance" },
        ],
      },
      {
        id: "ct9",
        text: "When I encounter a logical fallacy, my response is to:",
        options: [
          { value: "a", label: "Point it out and explain why" },
          { value: "b", label: "Question the entire argument" },
          { value: "c", label: "Look for other weaknesses" },
          { value: "d", label: "Reformulate the argument correctly" },
        ],
      },
      {
        id: "ct10",
        text: "I distinguish correlation from causation by:",
        options: [
          { value: "a", label: "Looking for controlled experiments" },
          { value: "b", label: "Considering alternative explanations" },
          { value: "c", label: "Checking temporal sequence" },
          { value: "d", label: "Examining the mechanism of action" },
        ],
      },
    ],
  },
// --------- continue with time-management, communication-preferences, and more! ---------
        {
    id: "time-management",
    title: "Time Management",
    description: "Assess your approach to prioritizing, planning, and balancing your workload.",
    questions: [
      {
        id: "tm1",
        text: "When planning my day, I:",
        options: [
          { value: "a", label: "Make a detailed schedule and stick to it" },
          { value: "b", label: "List a few key priorities" },
          { value: "c", label: "Go with the flow depending on mood" },
          { value: "d", label: "Delegate as much as I can" },
        ],
      },
      {
        id: "tm2",
        text: "I handle urgent vs. important tasks by:",
        options: [
          { value: "a", label: "Always handle the urgent first" },
          { value: "b", label: "Prioritize important even if not urgent" },
          { value: "c", label: "Try to do both together" },
          { value: "d", label: "Let others decide" },
        ],
      },
      {
        id: "tm3",
        text: "If a project deadline moves up unexpectedly, I:",
        options: [
          { value: "a", label: "Reschedule and adapt quickly" },
          { value: "b", label: "Get stressed but work harder" },
          { value: "c", label: "Negotiate for more time or help" },
          { value: "d", label: "Drop less important tasks" },
        ],
      },
      {
        id: "tm4",
        text: "I avoid procrastination by:",
        options: [
          { value: "a", label: "Breaking work into small steps" },
          { value: "b", label: "Starting with easy wins" },
          { value: "c", label: "Setting strict deadlines" },
          { value: "d", label: "Getting accountability from others" },
        ],
      },
      {
        id: "tm5",
        text: "When I feel overwhelmed, I:",
        options: [
          { value: "a", label: "Pause and prioritize" },
          { value: "b", label: "Seek help or delegate" },
          { value: "c", label: "Push through anyway" },
          { value: "d", label: "Take a break and reset" },
        ],
      },
      {
        id: "tm6",
        text: "The best way for me to track progress is:",
        options: [
          { value: "a", label: "Project management tools/apps" },
          { value: "b", label: "Handwritten lists and journals" },
          { value: "c", label: "Daily/weekly review sessions" },
          { value: "d", label: "Verbal check-ins" },
        ],
      },
      {
        id: "tm7",
        text: "Interruptions during work:",
        options: [
          { value: "a", label: "Are planned for, I schedule buffer time" },
          { value: "b", label: "Can be frustrating but manageable" },
          { value: "c", label: "Motivate me to focus harder when needed" },
          { value: "d", label: "Derail me completely" },
        ],
      },
      {
        id: "tm8",
        text: "I am most productive:",
        options: [
          { value: "a", label: "In the early morning" },
          { value: "b", label: "After lunch" },
          { value: "c", label: "Late at night" },
          { value: "d", label: "When working with others" },
        ],
      },
      {
        id: "tm9",
        text: "Long-term planning for me involves:",
        options: [
          { value: "a", label: "Clear vision and milestone mapping" },
          { value: "b", label: "Flexible goals that adapt when needed" },
          { value: "c", label: "Setting yearly/quarterly targets" },
          { value: "d", label: "Minimal planning; I focus on the present" },
        ],
      },
      {
        id: "tm10",
        text: "When tasks pile up, I:",
        options: [
          { value: "a", label: "Ask for help or delegate" },
          { value: "b", label: "Eliminate non-essential tasks" },
          { value: "c", label: "Work longer hours to catch up" },
          { value: "d", label: "Let go and accept imperfection" },
        ],
      },
    ],
  },
  {
    id: "communication-preferences",
    title: "Communication Preferences",
    description: "Assess your approach to exchanging information and interacting with others.",
    questions: [
      {
        id: "cp1_a",
        text: "When I need information, I prefer:",
        options: [
          { value: "a", label: "To receive concise written instructions" },
          { value: "b", label: "To discuss details verbally" },
          { value: "c", label: "Visual diagrams or infographics" },
          { value: "d", label: "To experiment and figure it out" },
        ],
      },
      {
        id: "cp2_a",
        text: "I express my ideas most comfortably:",
        options: [
          { value: "a", label: "In writing (emails, docs, texts)" },
          { value: "b", label: "By speaking to others" },
          { value: "c", label: "By drawing or using visuals" },
          { value: "d", label: "Through action or demonstration" },
        ],
      },
      {
        id: "cp3_a",
        text: "In group discussions, I tend to:",
        options: [
          { value: "a", label: "Lead and moderate conversation" },
          { value: "b", label: "Listen and respond thoughtfully" },
          { value: "c", label: "Bring in humor and lighten the mood" },
          { value: "d", label: "Focus mainly on results" },
        ],
      },
      {
        id: "cp4_a",
        text: "Feedback from others is most useful when:",
        options: [
          { value: "a", label: "It is clear and direct" },
          { value: "b", label: "It's optimistic and encouraging" },
          { value: "c", label: "It's detailed and specific" },
          { value: "d", label: "It's delivered privately" },
        ],
      },
      {
        id: "cp5_a",
        text: "When there's a misunderstanding, I:",
        options: [
          { value: "a", label: "Clarify in writing" },
          { value: "b", label: "Address it directly in conversation" },
          { value: "c", label: "Seek help from a third party" },
          { value: "d", label: "Let it resolve on its own" },
        ],
      },
      {
        id: "cp6_a",
        text: "I remember information best:",
        options: [
          { value: "a", label: "When I write it down" },
          { value: "b", label: "By repeating it out loud" },
          { value: "c", label: "Through visualization" },
          { value: "d", label: "By doing it practically" },
        ],
      },
      {
        id: "cp7_a",
        text: "I find it easiest to communicate:",
        options: [
          { value: "a", label: "With clear structure and bullet points" },
          { value: "b", label: "Through stories and examples" },
          { value: "c", label: "With visuals and diagrams" },
          { value: "d", label: "By acting it out" },
        ],
      },
      {
        id: "cp8_a",
        text: "Meetings are most effective when:",
        options: [
          { value: "a", label: "Kept short and to the point" },
          { value: "b", label: "There's open discussion" },
          { value: "c", label: "Visual aids are used" },
          { value: "d", label: "Outcomes are clear and actionable" },
        ],
      },
      {
        id: "cp9_a",
        text: "When collaborating online, I:",
        options: [
          { value: "a", label: "Prefer chat/text tools" },
          { value: "b", label: "Prefer video calls" },
          { value: "c", label: "Like using visual whiteboards" },
          { value: "d", label: "Like async document collaboration" },
        ],
      },
      {
        id: "cp10_a",
        text: "In stressful communication situations, I:",
        options: [
          { value: "a", label: "Think before responding" },
          { value: "b", label: "Speak my mind directly" },
          { value: "c", label: "Use humor or lightness" },
          { value: "d", label: "Avoid the situation" },
        ],
      },
    ],
  },
  // ----------- continue to stress-resilience, creativity-innovation, etc. -----------
        {
    id: "stress-resilience",
    title: "Stress & Resilience",
    description: "How you deal with setbacks, challenges, and maintain performance under pressure.",
    questions: [
      {
        id: "sr1",
        text: "When deadlines approach, I:",
        options: [
          { value: "a", label: "Stay calm and focused" },
          { value: "b", label: "Feel a sense of urgency" },
          { value: "c", label: "Get anxious but push through" },
          { value: "d", label: "Feel paralyzed and avoid tasks" },
        ],
      },
      {
        id: "sr2",
        text: "Under stress, my first reaction is to:",
        options: [
          { value: "a", label: "Pause and analyze next steps" },
          { value: "b", label: "Seek support from others" },
          { value: "c", label: "Jump into action to solve issues" },
          { value: "d", label: "Withdraw and hope for resolution" },
        ],
      },
      {
        id: "sr3",
        text: "If I experience repeated failure, I:",
        options: [
          { value: "a", label: "Analyze what went wrong and adapt" },
          { value: "b", label: "Feel discouraged but keep trying" },
          { value: "c", label: "Ask for help or feedback" },
          { value: "d", label: "Move on to something else" },
        ],
      },
      {
        id: "sr4",
        text: "I manage stressful situations best by:",
        options: [
          { value: "a", label: "Taking breaks to reset" },
          { value: "b", label: "Prioritizing tasks and focusing" },
          { value: "c", label: "Practicing mindfulness or meditation" },
          { value: "d", label: "Getting support from others" },
        ],
      },
      {
        id: "sr5",
        text: "My attitude to setbacks is:",
        options: [
          { value: "a", label: "Optimistic: I can turn things around" },
          { value: "b", label: "Realistic: I learn and move forward" },
          { value: "c", label: "Cyclic: High and low periods" },
          { value: "d", label: "Pessimistic: I doubt improvement" },
        ],
      },
      {
        id: "sr6",
        text: "When faced with multiple pressures, I:",
        options: [
          { value: "a", label: "Organize and prioritize" },
          { value: "b", label: "Ask for help" },
          { value: "c", label: "Work extra hours to keep up" },
          { value: "d", label: "Let some things slide" },
        ],
      },
      {
        id: "sr7",
        text: "After a stressful event, I recharge by:",
        options: [
          { value: "a", label: "Spending time alone" },
          { value: "b", label: "Connecting with friends/family" },
          { value: "c", label: "Engaging in hobbies or exercise" },
          { value: "d", label: "Reflecting on what happened" },
        ],
      },
      {
        id: "sr8",
        text: "I handle criticism by:",
        options: [
          { value: "a", label: "Considering if it's valid and taking action" },
          { value: "b", label: "Feeling upset, but reflecting on it" },
          { value: "c", label: "Ignoring if it's not constructive" },
          { value: "d", label: "Seeking positive feedback to balance" },
        ],
      },
      {
        id: "sr9",
        text: "When things go wrong, my main focus is to:",
        options: [
          { value: "a", label: "Find a fix" },
          { value: "b", label: "Understand why it happened" },
          { value: "c", label: "Minimize impact on others" },
          { value: "d", label: "Move on quickly" },
        ],
      },
      {
        id: "sr10",
        text: "Resilience means:",
        options: [
          { value: "a", label: "Persisting despite difficulties" },
          { value: "b", label: "Bouncing back quickly" },
          { value: "c", label: "Learning and adapting from adversity" },
          { value: "d", label: "All of the above" },
        ],
      },
    ],
  },
  {
    id: "creativity-innovation",
    title: "Creativity & Innovation",
    description: "How you generate, evaluate, and implement new ideas or solutions.",
    questions: [
      {
        id: "ci1",
        text: "I get new ideas most often when:",
        options: [
          { value: "a", label: "Relaxing, daydreaming, or during breaks" },
          { value: "b", label: "Brainstorming or discussing with others" },
          { value: "c", label: "Working intensely on a problem" },
          { value: "d", label: "Reading or learning new things" },
        ],
      },
      {
        id: "ci2",
        text: "When inspired, I:",
        options: [
          { value: "a", label: "Jot down ideas immediately" },
          { value: "b", label: "Build on them with research" },
          { value: "c", label: "Share them for feedback" },
          { value: "d", label: "Act on them without delay" },
        ],
      },
      {
        id: "ci3",
        text: "My approach to creative blocks is:",
        options: [
          { value: "a", label: "Take a break to reset my mind" },
          { value: "b", label: "Seek outside inspiration" },
          { value: "c", label: "Work through it regardless" },
          { value: "d", label: "Try a totally different approach" },
        ],
      },
      {
        id: "ci4",
        text: "Feedback about creative work is best when:",
        options: [
          { value: "a", label: "Specific and constructive" },
          { value: "b", label: "Supportive and positive" },
          { value: "c", label: "Honest and direct" },
          { value: "d", label: "Collaborative—generates new ideas" },
        ],
      },
      {
        id: "ci5",
        text: "When I have many ideas, I choose which to pursue by:",
        options: [
          { value: "a", label: "Evaluating feasibility and usefulness" },
          { value: "b", label: "Following intuition or interest" },
          { value: "c", label: "Voting or asking others" },
          { value: "d", label: "Testing a few and refining" },
        ],
      },
      {
        id: "ci6",
        text: "Creativity is best nurtured through:",
        options: [
          { value: "a", label: "A playful, unconstrained environment" },
          { value: "b", label: "Deadlines and constraints" },
          { value: "c", label: "Exposure to varied ideas/experiences" },
          { value: "d", label: "Collaboration with diverse teams" },
        ],
      },
      {
        id: "ci7",
        text: "To improve my creative output, I:",
        options: [
          { value: "a", label: "Practice creativity exercises regularly" },
          { value: "b", label: "Consume diverse and unusual content" },
          { value: "c", label: "Change my environment frequently" },
          { value: "d", label: "Challenge assumptions and conventions" },
        ],
      },
      {
        id: "ci8",
        text: "When implementing new ideas, I:",
        options: [
          { value: "a", label: "Experiment and tweak as I go" },
          { value: "b", label: "Plan extensively before acting" },
          { value: "c", label: "Seek feedback while building" },
          { value: "d", label: "Look for quick wins" },
        ],
      },
      {
        id: "ci9",
        text: "Innovation for me means:",
        options: [
          { value: "a", label: "Creating something entirely new" },
          { value: "b", label: "Improving existing solutions" },
          { value: "c", label: "Finding novel applications for old ideas" },
          { value: "d", label: "Disrupting the status quo" },
        ],
      },
    ],
  },
  {
    id: "data-interpretation",
    title: "Data Interpretation",
    description: "Interpret, analyze, and draw conclusions from data representations and charts.",
    questions: [
      {
        id: "di1",
        text: "A pie chart shows company expenses where 'Marketing' is 25%. If total expenses are ₹2,00,000, what is Marketing's share?",
        options: [
          { value: "a", label: "₹25,000" },
          { value: "b", label: "₹40,000" },
          { value: "c", label: "₹50,000" },
          { value: "d", label: "₹60,000" },
          { value: "e", label: "I don't know" },
        ],
      },
      {
        id: "di2",
        text: "A line graph tracks sales for Jan: 120, Feb: 140, Mar: 160. What is the percentage increase from Jan to Mar?",
        options: [
          { value: "a", label: "10%" },
          { value: "b", label: "15%" },
          { value: "c", label: "20%" },
          { value: "d", label: "25%" },
          { value: "e", label: "I don't know" },
        ],
      },
      {
        id: "di3",
        text: "A table lists inventory: TV (15), Fridge (10), AC (8), Oven (12). Which item has the lowest inventory?",
        options: [
          { value: "a", label: "TV" },
          { value: "b", label: "Fridge" },
          { value: "c", label: "AC" },
          { value: "d", label: "Oven" },
          { value: "e", label: "I don't know" },
        ],
      },
      {
        id: "di4",
        text: "A bar graph shows production for Plants A (120), B (100), C (140). What is the total production?",
        options: [
          { value: "a", label: "340" },
          { value: "b", label: "350" },
          { value: "c", label: "360" },
          { value: "d", label: "370" },
          { value: "e", label: "I don't know" },
        ],
      },
      {
        id: "di5",
        text: "A scatter plot shows a strong upward trend. What correlation is indicated?",
        options: [
          { value: "a", label: "Strong negative" },
          { value: "b", label: "No correlation" },
          { value: "c", label: "Strong positive" },
          { value: "d", label: "Weak positive" },
          { value: "e", label: "I don't know" },
        ],
      },
      {
        id: "di6",
        text: "If the median age in a dataset is 35, what does it mean?",
        options: [
          { value: "a", label: "Half the people are older than 35" },
          { value: "b", label: "35 is the average age" },
          { value: "c", label: "All ages are 35" },
          { value: "d", label: "Everyone is younger than 35" },
          { value: "e", label: "I don't know" },
        ],
      },
      {
        id: "di7",
        text: "A histogram is best used for:",
        options: [
          { value: "a", label: "Displaying frequencies of data ranges" },
          { value: "b", label: "Showing cause and effect" },
          { value: "c", label: "Tracking changes over time" },
          { value: "d", label: "Comparing different groups" },
          { value: "e", label: "I don't know" },
        ],
      },
      {
        id: "di8",
        text: "In a pie chart, a sector representing 90 degrees covers what fraction?",
        options: [
          { value: "a", label: "1/2" },
          { value: "b", label: "1/4" },
          { value: "c", label: "1/3" },
          { value: "d", label: "1/6" },
          { value: "e", label: "I don't know" },
        ],
      },
      {
        id: "di9",
        text: "A table shows expenses: Rent (₹15k), Salary (₹25k), Power (₹10k), Misc (₹5k). What is the total?",
        options: [
          { value: "a", label: "₹45,000" },
          { value: "b", label: "₹50,000" },
          { value: "c", label: "₹55,000" },
          { value: "d", label: "₹60,000" },
          { value: "e", label: "I don't know" },
        ],
      },
      {
        id: "di10",
        text: "If a line graph has a steep upward slope, it indicates:",
        options: [
          { value: "a", label: "Rapid decrease" },
          { value: "b", label: "Slow increase" },
          { value: "c", label: "Rapid increase" },
          { value: "d", label: "No change" },
          { value: "e", label: "I don't know" },
        ],
      },
    ],
  },
  {
    id: "decision-making",
    title: "Decision Making",
    description: "Explore how you make choices, weigh risks, and commit to action.",
    questions: [
      {
        id: "dm1",
        text: "When making an important decision, I first:",
        options: [
          { value: "a", label: "Gather all relevant information" },
          { value: "b", label: "List pros and cons" },
          { value: "c", label: "Trust my intuition" },
          { value: "d", label: "Ask others for opinions" },
        ],
      },
      {
        id: "dm2",
        text: "I am most comfortable making decisions when:",
        options: [
          { value: "a", label: "I have all the facts" },
          { value: "b", label: "I have a deadline" },
          { value: "c", label: "I can delegate responsibility" },
          { value: "d", label: "I am free to choose independently" },
        ],
      },
      {
        id: "dm3",
        text: "When faced with a risky choice, I:",
        options: [
          { value: "a", label: "Calculate and minimize risks" },
          { value: "b", label: "Accept some risk for bigger rewards" },
          { value: "c", label: "Avoid risk where possible" },
          { value: "d", label: "Go with my gut" },
        ],
      },
      {
        id: "dm4",
        text: "In group decisions, I:",
        options: [
          { value: "a", label: "Facilitate consensus-building" },
          { value: "b", label: "Advocate for my position" },
          { value: "c", label: "Go along with the majority" },
          { value: "d", label: "Reserve judgment until all views are shared" },
        ],
      },
      {
        id: "dm5",
        text: "If I later regret a decision, I usually:",
        options: [
          { value: "a", label: "Reflect for future improvement" },
          { value: "b", label: "Blame circumstances or others" },
          { value: "c", label: "Move on and don't look back" },
          { value: "d", label: "Try to reverse the decision" },
        ],
      },
      {
        id: "dm6",
        text: "I commit to action by:",
        options: [
          { value: "a", label: "Creating detailed plans" },
          { value: "b", label: "Outlining broad steps" },
          { value: "c", label: "Acting immediately" },
          { value: "d", label: "Waiting until I'm sure" },
        ],
      },
      {
        id: "dm7",
        text: "My decisions are most influenced by:",
        options: [
          { value: "a", label: "Logic and facts" },
          { value: "b", label: "My values and goals" },
          { value: "c", label: "How others will react" },
          { value: "d", label: "Practical constraints" },
        ],
      },
      {
        id: "dm8",
        text: "When facing conflicting priorities, I:",
        options: [
          { value: "a", label: "Prioritize based on impact" },
          { value: "b", label: "Choose what's personally meaningful" },
          { value: "c", label: "Seek input before deciding" },
          { value: "d", label: "Delay the decision if possible" },
        ],
      },
      {
        id: "dm9",
        text: "After making a choice, I:",
        options: [
          { value: "a", label: "Review outcome and learn" },
          { value: "b", label: "Celebrate and move forward" },
          { value: "c", label: "Doubt and second-guess myself" },
          { value: "d", label: "Consult others for validation" },
        ],
      },
      {
        id: "dm10",
        text: "Fast decision-making is most important when:",
        options: [
          { value: "a", label: "In emergencies" },
          { value: "b", label: "Opportunities are fleeting" },
          { value: "c", label: "Risks are low" },
          { value: "d", label: "The outcome isn't critical" },
        ],
      },
    ],
  },
// --------- continue to personal-values, learning-goals, etc. ---------
        {
    id: "personal-values",
    title: "Personal Values",
    description: "Identify the beliefs and principles driving your decisions and actions.",
    questions: [
      {
        id: "pv1",
        text: "Which value is most important in your work/study life?",
        options: [
          { value: "a", label: "Integrity" },
          { value: "b", label: "Achievement" },
          { value: "c", label: "Collaboration" },
          { value: "d", label: "Flexibility" },
        ],
      },
      {
        id: "pv2",
        text: "You feel fulfilled when your efforts:",
        options: [
          { value: "a", label: "Are recognized by others" },
          { value: "b", label: "Make a positive impact" },
          { value: "c", label: "Lead to personal growth" },
          { value: "d", label: "Support your community/team" },
        ],
      },
      {
        id: "pv3",
        text: "Conflict with your values makes you:",
        options: [
          { value: "a", label: "Uncomfortable and likely to speak up" },
          { value: "b", label: "Seek compromise where possible" },
          { value: "c", label: "Reconsider your participation" },
          { value: "d", label: "Stick to your values regardless" },
        ],
      },
      {
        id: "pv4",
        text: "If an assignment challenges your values, you will:",
        options: [
          { value: "a", label: "Discuss concerns with authority" },
          { value: "b", label: "Request a reassignment" },
          { value: "c", label: "Try to adapt" },
          { value: "d", label: "Refuse to participate" },
        ],
      },
      {
        id: "pv5",
        text: "Your decision-making is most influenced by:",
        options: [
          { value: "a", label: "Your core principles" },
          { value: "b", label: "Expected outcomes" },
          { value: "c", label: "How others will be affected" },
          { value: "d", label: "What feels right in the moment" },
        ],
      },
      {
        id: "pv6",
        text: "You define success as:",
        options: [
          { value: "a", label: "Achieving your goals" },
          { value: "b", label: "Living in alignment with your values" },
          { value: "c", label: "Making a difference for others" },
          { value: "d", label: "Balance and satisfaction in life" },
        ],
      },
      {
        id: "pv7",
        text: "When asked to compromise your values, you:",
        options: [
          { value: "a", label: "Set clear boundaries" },
          { value: "b", label: "Weigh pros and cons carefully" },
          { value: "c", label: "Find another solution" },
          { value: "d", label: "Refuse without hesitation" },
        ],
      },
      {
        id: "pv8",
        text: "The people you admire most are:",
        options: [
          { value: "a", label: "Principled and ethical" },
          { value: "b", label: "Successful and driven" },
          { value: "c", label: "Creative and innovative" },
          { value: "d", label: "Supportive and caring" },
        ],
      },
      {
        id: "pv9",
        text: "You judge organizations most on:",
        options: [
          { value: "a", label: "Their transparency and fairness" },
          { value: "b", label: "Their achievements and growth" },
          { value: "c", label: "Their social impact and responsibility" },
          { value: "d", label: "Their adaptability and openness" },
        ],
      },
      {
        id: "pv10",
        text: "The value that guides you most is:",
        options: [
          { value: "a", label: "Honesty" },
          { value: "b", label: "Ambition" },
          { value: "c", label: "Empathy" },
          { value: "d", label: "Flexibility" },
        ],
      },
    ],
  },
  {
    id: "learning-goals",
    title: "Learning Goals",
    description: "Clarify your motivations, objectives, and reasons for pursuing new skills.",
    questions: [
      {
        id: "lg1",
        text: "My primary motivation for learning is:",
        options: [
          { value: "a", label: "Career advancement or degree" },
          { value: "b", label: "Personal fulfillment and curiosity" },
          { value: "c", label: "Practical skills for daily life" },
          { value: "d", label: "Meeting requirements" },
        ],
      },
      {
        id: "lg2",
        text: "I set learning goals that are:",
        options: [
          { value: "a", label: "Specific and measurable" },
          { value: "b", label: "Flexible and evolving" },
          { value: "c", label: "Ambitious and long-term" },
          { value: "d", label: "Short-term and achievable" },
        ],
      },
      {
        id: "lg3",
        text: "I track learning progress by:",
        options: [
          { value: "a", label: "Keeping a journal or log" },
          { value: "b", label: "Regular self-assessment" },
          { value: "c", label: "Testing or applying knowledge" },
          { value: "d", label: "Relying on feedback from others" },
        ],
      },
      {
        id: "lg4",
        text: "If I don't meet a goal, I:",
        options: [
          { value: "a", label: "Adjust my approach and try again" },
          { value: "b", label: "Set a new, more attainable goal" },
          { value: "c", label: "Reflect on reasons and obstacles" },
          { value: "d", label: "Lose motivation" },
        ],
      },
      {
        id: "lg5",
        text: "Successful learning requires:",
        options: [
          { value: "a", label: "Clear objectives and purpose" },
          { value: "b", label: "Consistent effort over time" },
          { value: "c", label: "Effective strategies and resources" },
          { value: "d", label: "Enjoyment and interest" },
        ],
      },
      {
        id: "lg6",
        text: "I demonstrate new learning by:",
        options: [
          { value: "a", label: "Sharing with others or teaching" },
          { value: "b", label: "Applying it to real-life" },
          { value: "c", label: "Documenting personal projects" },
          { value: "d", label: "Earning recognition/certification" },
        ],
      },
      {
        id: "lg7",
        text: "Obstacles to learning are best managed by:",
        options: [
          { value: "a", label: "Seeking guidance or mentorship" },
          { value: "b", label: "Strategic planning and persistence" },
          { value: "c", label: "Adapting my environment" },
          { value: "d", label: "Changing my learning strategy" },
        ],
      },
      {
        id: "lg8",
        text: "I am satisfied with my learning when:",
        options: [
          { value: "a", label: "I can apply knowledge confidently" },
          { value: "b", label: "I receive positive results or grades" },
          { value: "c", label: "I feel more capable and independent" },
          { value: "d", label: "I have enjoyed the process" },
        ],
      },
      {
        id: "lg9",
        text: "When starting a new subject, my first step is to:",
        options: [
          { value: "a", label: "Outline core goals and outcomes" },
          { value: "b", label: "Explore related resources or communities" },
          { value: "c", label: "Skim material to get an overview" },
          { value: "d", label: "Set a timeline and deadlines" },
        ],
      },
      {
        id: "lg10",
        text: "To achieve challenging goals, I rely on:",
        options: [
          { value: "a", label: "Support and accountability" },
          { value: "b", label: "Resilience and self-motivation" },
          { value: "c", label: "Effective study strategies" },
          { value: "d", label: "External incentives" },
        ],
      },
    ],
  },
];

// ---- END MODULES ----

export default function ElaborateTestPage() {
  const router = useRouter();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentModule = modules[currentModuleIndex];
  const currentQuestion = currentModule?.questions[currentQuestionIndex];
  const totalQuestions = modules.reduce((acc, m) => acc + m.questions.length, 0);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = useMemo(
    () => (answeredCount / totalQuestions) * 100,
    [answeredCount, totalQuestions]
  );

  const isFirstQuestion =
    currentModuleIndex === 0 && currentQuestionIndex === 0;
  const isLastQuestion =
    currentModuleIndex === modules.length - 1 &&
    currentQuestionIndex === currentModule?.questions.length - 1;

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < currentModule.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else if (currentModuleIndex < modules.length - 1) {
      setCurrentModuleIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
    }
  }, [currentQuestionIndex, currentModuleIndex, currentModule.questions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex((prev) => prev - 1);
      const prevModule = modules[currentModuleIndex - 1];
      setCurrentQuestionIndex(prevModule.questions.length - 1);
    }
  }, [currentQuestionIndex, currentModuleIndex]);

  const handleSubmit = useCallback(() => {
    setIsAnalyzing(true);

    // Store answers in sessionStorage for the results page
    const resultsData = {
      testType: "elaborate",
      answers,
      modules: modules.map((m) => ({
        id: m.id,
        title: m.title,
        answers: m.questions.map((q) => ({
          questionId: q.id,
          question: q.text,
          answer: answers[q.id] || null,
        })),
      })),
      completedAt: new Date().toISOString(),
    };

    sessionStorage.setItem("learnapt-results", JSON.stringify(resultsData));

    // Also save to localStorage for admin history
    try {
      const historyStr = localStorage.getItem("learnapt-assessment-history");
      const history = historyStr ? JSON.parse(historyStr) : [];
      history.unshift({
        id: `elaborate-${Date.now()}`,
        ...resultsData,
      });
      localStorage.setItem(
        "learnapt-assessment-history",
        JSON.stringify(history.slice(0, 100))
      );
    } catch (e) {
      console.error("Failed to save assessment history:", e);
    }

    setTimeout(() => {
      router.push("/results");
    }, 1500);
  }, [answers, router]);

  const handleSelectAnswer = useCallback(
    (value: string) => {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: value,
      }));

      // Check if this is the last question
      const isLastQuestionNow =
        currentModuleIndex === modules.length - 1 &&
        currentQuestionIndex === currentModule.questions.length - 1;

      if (isLastQuestionNow) {
        // Auto-submit after answering the last question
        setTimeout(() => {
          handleSubmit();
        }, 300);
        return;
      }

      setTimeout(() => {
        if (currentQuestionIndex < currentModule.questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
        } else if (currentModuleIndex < modules.length - 1) {
          setCurrentModuleIndex((prev) => prev + 1);
          setCurrentQuestionIndex(0);
        }
      }, 300);
    },
    [currentQuestion.id, currentQuestionIndex, currentModuleIndex, currentModule.questions.length, handleSubmit]
  );

  const handleRetake = useCallback(() => {
    setCurrentModuleIndex(0);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsAnalyzing(false);
  }, []);

  const currentAnswer = answers[currentQuestion?.id];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                Learnapt
              </span>
            </Link>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Elaborate Test
            </span>
          </div>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {isAnalyzing ? (
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Please wait... Analysing your answers...
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              We are preparing your comprehensive results...
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
                <span>
                  {answeredCount} of {totalQuestions} questions answered
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-600 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded">
                  Module {currentModuleIndex + 1} of {modules.length}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                {currentModule.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {currentModule.description}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg mb-6">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                Question {currentQuestionIndex + 1} of{" "}
                {currentModule.questions.length}
              </p>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
                {currentQuestion.text}
              </h3>
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSelectAnswer(option.value)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      currentAnswer === option.value
                        ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                        : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          currentAnswer === option.value
                            ? "border-purple-600 bg-purple-600"
                            : "border-slate-300 dark:border-slate-500"
                        }`}
                      >
                        {currentAnswer === option.value && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span
                        className={`${
                          currentAnswer === option.value
                            ? "text-purple-900 dark:text-purple-100"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={isFirstQuestion}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  isFirstQuestion
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </button>
              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={answeredCount < totalQuestions}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                    answeredCount < totalQuestions
                      ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  Submit Test
                  <Check className="h-5 w-5" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-colors ${
                    !currentAnswer
                      ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  }`}
                >
                  Next
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
