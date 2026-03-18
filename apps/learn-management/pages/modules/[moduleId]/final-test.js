"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ModuleFinalTestComponent from "../../../components/ModuleFinalTestComponent";
import { getCurrentUser } from "../../../lib/supabaseClient";

const APP_KEY = "learn-management";
const APP_DISPLAY = "Learn Management";
const NO_BADGES_KEY = "learn-management-noBadges";

// Per-module final test question bank — 20 real questions per module
const FINAL_TEST_QUESTIONS = {
  1: [
    {
      question:
        "Who is credited with identifying the four functions of management: planning, organising, leading, and controlling?",
      options: ["Peter Drucker", "Henri Fayol", "Frederick Taylor", "Max Weber"],
      correct_answer: 1,
    },
    {
      question: "What is scientific management?",
      options: [
        "Managing scientific research teams",
        "Frederick Taylor's approach using systematic observation and measurement to maximise worker efficiency",
        "Using AI and data to manage employees",
        "A branch of operations research",
      ],
      correct_answer: 1,
    },
    {
      question: "What is McGregor's Theory X assumption about workers?",
      options: [
        "Workers are self-motivated and enjoy responsibility",
        "Workers are inherently lazy, must be controlled, and avoid responsibility",
        "Workers are best motivated by participation",
        "Workers are motivated primarily by self-actualisation",
      ],
      correct_answer: 1,
    },
    {
      question: "What is McGregor's Theory Y assumption about workers?",
      options: [
        "Workers are lazy and require close supervision",
        "Workers are self-motivated, seek responsibility, and are capable of self-direction",
        "Workers only respond to financial incentives",
        "Workers dislike change and avoid innovation",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Mintzberg's contribution to management theory?",
      options: [
        "Developing the Balanced Scorecard",
        "Identifying ten managerial roles grouped into interpersonal, informational, and decisional categories",
        "Creating the BCG Growth-Share Matrix",
        "Developing Theory Z management",
      ],
      correct_answer: 1,
    },
    {
      question: "What is management by objectives (MBO)?",
      options: [
        "Managing by strict rules and procedures",
        "A process where manager and employee jointly set objectives and review progress against them",
        "A financial management technique",
        "An approach based on autocratic decision-making",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the planning function of management?",
      options: [
        "Assigning tasks to employees",
        "Setting objectives and determining the best course of action to achieve them",
        "Monitoring performance against goals",
        "Building and maintaining team morale",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the organising function of management?",
      options: [
        "Setting strategic goals",
        "Arranging resources and tasks to achieve organisational objectives — defining roles, responsibilities, and reporting structures",
        "Inspiring and directing employees",
        "Evaluating performance outcomes",
      ],
      correct_answer: 1,
    },
    {
      question: "What is bureaucratic management?",
      options: [
        "Management focused on informal relationships",
        "Max Weber's model of rational, rule-based management with clear hierarchy, defined roles, and formal procedures",
        "Managing purely through financial incentives",
        "A flat organisational structure with few rules",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the controlling function of management?",
      options: [
        "Dominating employees through authority",
        "Monitoring performance, comparing it to standards, and taking corrective action when needed",
        "Setting the organisational vision",
        "Recruiting new talent",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an organisational hierarchy?",
      options: [
        "A ranking of products by revenue",
        "The formal structure of authority and accountability levels within an organisation",
        "A chart of staff salaries",
        "The competitive ranking of an organisation in its market",
      ],
      correct_answer: 1,
    },
    {
      question: "What is span of control in management?",
      options: [
        "The geographic territory a manager oversees",
        "The number of subordinates a manager directly supervises",
        "The range of products a manager is responsible for",
        "The number of departments in an organisation",
      ],
      correct_answer: 1,
    },
    {
      question: "What is delegation in management?",
      options: [
        "Refusing to make decisions without consultation",
        "The transfer of authority and responsibility for specific tasks from a manager to a subordinate",
        "Micromanaging employees",
        "Outsourcing tasks to external contractors",
      ],
      correct_answer: 1,
    },
    {
      question: "What is centralisation vs. decentralisation in management?",
      options: [
        "Centralisation increases employee autonomy; decentralisation reduces it",
        "Centralisation concentrates decision-making at the top; decentralisation distributes it to lower levels",
        "They refer to geographic office locations",
        "Centralisation is better for all organisations",
      ],
      correct_answer: 1,
    },
    {
      question: "What is systems thinking in management?",
      options: [
        "Using IT systems to manage operations",
        "Viewing an organisation as an interconnected whole where each part affects others",
        "Applying scientific methods to management",
        "Managing through financial systems and KPIs only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a SWOT analysis?",
      options: [
        "A financial ratio analysis",
        "A strategic framework examining Strengths, Weaknesses, Opportunities, and Threats",
        "A project management tool",
        "A human resources assessment technique",
      ],
      correct_answer: 1,
    },
    {
      question: "What is contingency management theory?",
      options: [
        "Managing based on worst-case scenarios",
        "The theory that there is no single best way to manage; the optimal approach depends on the situation",
        "A technique for managing business continuity",
        "A theory based exclusively on financial contingencies",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the Hawthorne Effect?",
      options: [
        "Workers perform better with financial rewards",
        "Workers' productivity increases when they know they are being observed, highlighting the importance of social factors",
        "Scientific methods always improve output",
        "Workers perform worse in highly structured environments",
      ],
      correct_answer: 1,
    },
    {
      question: "What is total quality management (TQM)?",
      options: [
        "A financial management approach",
        "A management philosophy focused on continuous improvement of quality in all organisational processes and products",
        "A supply chain management system",
        "A customer service protocol",
      ],
      correct_answer: 1,
    },
    {
      question: "What does a manager's 'informational role' involve according to Mintzberg?",
      options: [
        "Making key resource allocation decisions",
        "Monitoring the environment, disseminating information to staff, and acting as a spokesperson for the organisation",
        "Directing and inspiring people",
        "Coordinating with other departments",
      ],
      correct_answer: 1,
    },
  ],
  2: [
    {
      question: "What is the difference between management and leadership?",
      options: [
        "They are identical",
        "Management focuses on maintaining systems and processes; leadership focuses on inspiring change and vision",
        "Leaders manage people; managers lead projects",
        "Leadership is more important than management in all contexts",
      ],
      correct_answer: 1,
    },
    {
      question: "What is transformational leadership?",
      options: [
        "A leadership style based on strict discipline",
        "A style where the leader inspires followers with a vision and motivates them to achieve beyond expectations",
        "A style based on transactional rewards and punishments",
        "A style focused on administrative efficiency",
      ],
      correct_answer: 1,
    },
    {
      question: "What is transactional leadership?",
      options: [
        "Leadership focused on inspiring vision",
        "Leadership based on exchange relationships — rewards for compliance and penalties for failure to meet standards",
        "Leadership that transforms the organisation's culture",
        "Leadership without formal authority",
      ],
      correct_answer: 1,
    },
    {
      question: "What is servant leadership?",
      options: [
        "A leader who follows team members' instructions",
        "A leadership philosophy where the leader's primary goal is to serve and empower their team",
        "A hierarchical leadership model",
        "Leadership by the most junior team member",
      ],
      correct_answer: 1,
    },
    {
      question: "What is emotional intelligence (EI) in leadership?",
      options: [
        "Intelligence measured by IQ tests",
        "The ability to recognise, understand, and manage one's own emotions and those of others — critical for effective leadership",
        "Being emotionally detached and objective",
        "Emotional stability under all conditions",
      ],
      correct_answer: 1,
    },
    {
      question: "What are the five components of emotional intelligence according to Goleman?",
      options: [
        "Planning, organising, staffing, directing, controlling",
        "Self-awareness, self-regulation, motivation, empathy, and social skills",
        "Vision, mission, strategy, execution, review",
        "Cognitive, emotional, social, physical, and moral intelligence",
      ],
      correct_answer: 1,
    },
    {
      question: "What is situational leadership?",
      options: [
        "Leadership that changes with the political situation",
        "A model where leaders adapt their style (directing, coaching, supporting, delegating) to the readiness of followers",
        "Leading teams in difficult circumstances",
        "Leadership based on the situation of the economy",
      ],
      correct_answer: 1,
    },
    {
      question: "What is authentic leadership?",
      options: [
        "Leadership based on traditional authority",
        "Leadership characterised by self-awareness, transparency, integrity, and alignment between values and actions",
        "Leadership that relies on formal credentials",
        "Leadership focused on achieving results only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the leadership style in Blake and Mouton's 'Team Management' position?",
      options: [
        "High concern for production; low concern for people",
        "Low concern for both production and people",
        "High concern for both production AND people — the optimal style",
        "Moderate concern for both",
      ],
      correct_answer: 2,
    },
    {
      question: "What is visionary leadership?",
      options: [
        "A leader who focuses on short-term targets",
        "A leader who creates a compelling long-term vision and motivates others to pursue it",
        "A leader who relies exclusively on data",
        "A leader who avoids risk",
      ],
      correct_answer: 1,
    },
    {
      question: "What is psychological safety in a leadership context?",
      options: [
        "Protecting employees from physical harm",
        "Creating an environment where team members feel safe to take risks, share ideas, and make mistakes without fear of punishment",
        "Ensuring employees have mental health support only",
        "A legal requirement for workplace wellbeing",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between a formal and informal leader?",
      options: [
        "Formal leaders are more effective",
        "A formal leader holds an official position of authority; an informal leader influences others based on respect or expertise without formal authority",
        "Informal leaders are elected by the team",
        "Formal leaders focus on people; informal leaders focus on tasks",
      ],
      correct_answer: 1,
    },
    {
      question: "What is leadership succession planning?",
      options: [
        "Deciding who succeeds first in competitions",
        "Identifying and developing future leaders to fill key positions when current leaders leave",
        "Planning for leadership roles in new markets",
        "A legal process for transferring company ownership",
      ],
      correct_answer: 1,
    },
    {
      question: "What is charismatic leadership?",
      options: [
        "Leadership by committee",
        "Leadership where the leader's exceptional personality and communication skills inspire strong devotion and followership",
        "Leadership based on technical expertise",
        "Leadership focused exclusively on financial results",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a 360-degree feedback process for leaders?",
      options: [
        "Reviewing all financial metrics",
        "A performance review process where a leader receives feedback from their manager, peers, and subordinates",
        "A training programme covering all leadership topics",
        "A full-year performance review",
      ],
      correct_answer: 1,
    },
    {
      question: "What is distributed (shared) leadership?",
      options: [
        "Leadership responsibility distributed evenly across all employees",
        "Spreading leadership across multiple individuals rather than concentrating it in one person",
        "Leadership based on geographic distribution of teams",
        "Each person leading in their specialised area without coordination",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the 'leadership pipeline' concept?",
      options: [
        "A series of decisions a leader makes",
        "The idea that leadership requirements change as people advance from individual contributors to team managers to enterprise leaders",
        "A succession of tasks in a project",
        "A pipeline of candidates for leadership positions",
      ],
      correct_answer: 1,
    },
    {
      question:
        "What is the primary distinction between autocratic and democratic leadership styles?",
      options: [
        "Autocratic leaders are more successful",
        "Autocratic leaders make decisions alone with little input; democratic leaders involve the team in decision-making",
        "Democratic leaders are only effective in large organisations",
        "Autocratic leadership is always ineffective",
      ],
      correct_answer: 1,
    },
    {
      question: "What is coaching as a leadership behaviour?",
      options: [
        "A sport-specific leadership model",
        "A leadership approach focused on asking questions and facilitating reflection to help individuals develop their own capabilities",
        "Giving employees direct instructions",
        "A training programme delivered by an external coach",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the Leader-Member Exchange (LMX) theory?",
      options: [
        "A transactional model of pay and performance",
        "A theory that leaders develop different quality relationships with different subordinates — high-quality 'in-group' and lower-quality 'out-group'",
        "A theory about how leaders exchange information with their managers",
        "A model for cross-functional leadership",
      ],
      correct_answer: 1,
    },
  ],
  3: [
    {
      question: "What is strategic planning?",
      options: [
        "Day-to-day operational scheduling",
        "The process of defining an organisation's long-term direction, setting goals, and allocating resources to achieve them",
        "Financial budgeting for the next quarter",
        "Writing job descriptions for new roles",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a mission statement?",
      options: [
        "A description of the company's financial targets",
        "A statement describing the organisation's purpose — why it exists and what it aims to achieve",
        "The CEO's annual message to shareholders",
        "A list of organisational values",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a vision statement?",
      options: [
        "A technical description of the company's products",
        "A forward-looking statement describing the desired future state the organisation aims to create",
        "The same as a mission statement",
        "An audit of current organisational performance",
      ],
      correct_answer: 1,
    },
    {
      question: "What are SMART goals?",
      options: [
        "Goals that are Simple, Manageable, Achievable, Realistic, and Timed",
        "Goals that are Specific, Measurable, Achievable, Relevant, and Time-bound",
        "Goals set using AI tools",
        "Goals that are Strategic, Motivating, Agreed, Resourced, and Tracked",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Porter's Five Forces model?",
      options: [
        "A model for analysing internal organisational capabilities",
        "A framework analysing competitive intensity: threat of new entrants, supplier power, buyer power, substitute threats, and rivalry",
        "A financial performance measurement tool",
        "A model for managing a five-person team",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the Ansoff Matrix?",
      options: [
        "A financial analysis matrix",
        "A strategic growth framework with four options: market penetration, market development, product development, and diversification",
        "A risk management framework",
        "A project management scheduling tool",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the BCG Growth-Share Matrix?",
      options: [
        "A performance management tool for employees",
        "A portfolio analysis tool classifying business units as Stars, Cash Cows, Question Marks, and Dogs based on market growth and share",
        "A financial ratio analysis",
        "A project classification framework",
      ],
      correct_answer: 1,
    },
    {
      question: "What is competitive advantage?",
      options: [
        "Being larger than competitors",
        "An attribute that allows an organisation to outperform its competitors — through cost leadership, differentiation, or focus",
        "Having more employees than the competition",
        "Being first to market in all cases",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Porter's generic strategies framework?",
      options: [
        "A model for managing suppliers",
        "Three strategies for competitive advantage: cost leadership, differentiation, and focus (cost focus or differentiation focus)",
        "A pricing strategy model",
        "A corporate governance framework",
      ],
      correct_answer: 1,
    },
    {
      question: "What is environmental scanning (PESTLE analysis)?",
      options: [
        "An analysis of physical office environments",
        "A framework examining Political, Economic, Social, Technological, Legal, and Environmental factors affecting the organisation",
        "An audit of manufacturing processes",
        "A financial market analysis technique",
      ],
      correct_answer: 1,
    },
    {
      question: "What is corporate strategy vs. business unit strategy?",
      options: [
        "They are the same",
        "Corporate strategy defines the overall direction of the organisation; business unit strategy defines how each division competes in its market",
        "Corporate strategy focuses on people; business strategy focuses on finance",
        "Corporate strategy is short-term; business strategy is long-term",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a balanced scorecard?",
      options: [
        "An HR performance review tool",
        "A strategic management framework measuring performance across financial, customer, internal process, and learning & growth perspectives",
        "A financial accounting document",
        "A balanced budget report",
      ],
      correct_answer: 1,
    },
    {
      question: "What is benchmarking?",
      options: [
        "Setting minimum performance standards for employees",
        "Comparing an organisation's processes and performance metrics with best practices from other organisations",
        "A quality testing technique for products",
        "A technique for setting financial forecasts",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a strategic alliance?",
      options: [
        "A merger between two companies",
        "A cooperative agreement between two or more organisations to pursue shared objectives while remaining independent",
        "A hostile takeover",
        "An agreement with a supplier for exclusive supply",
      ],
      correct_answer: 1,
    },
    {
      question: "What is blue ocean strategy?",
      options: [
        "A strategy for companies in the maritime industry",
        "A strategy focused on creating uncontested market space and new demand rather than competing in existing markets",
        "A cost-reduction strategy",
        "A strategy for expanding to international markets",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a core competency?",
      options: [
        "A basic skill required for any job",
        "A unique combination of skills, knowledge, and processes that provides a sustainable competitive advantage and is difficult for competitors to replicate",
        "The most important product in a company's portfolio",
        "The technical skills of key employees",
      ],
      correct_answer: 1,
    },
    {
      question: "What is scenario planning?",
      options: [
        "Planning the sequence of tasks in a project",
        "A strategic planning technique that develops multiple plausible future scenarios to test the robustness of strategy under different conditions",
        "Scheduling scenarios for staff training",
        "A financial forecasting method",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a strategic objective?",
      options: [
        "A day-to-day operational target",
        "A specific, measurable goal derived from the organisation's strategy that guides major decisions and resource allocation",
        "A customer satisfaction metric",
        "An individual employee's performance goal",
      ],
      correct_answer: 1,
    },
    {
      question: "What is vertical integration?",
      options: [
        "Integration of staff at different hierarchy levels",
        "A strategy where a company expands into activities at different stages of its supply chain (upstream suppliers or downstream distributors)",
        "Merging with a direct competitor",
        "Expanding into unrelated industries",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a strategic gap analysis?",
      options: [
        "Identifying talent gaps in the workforce",
        "Comparing where the organisation is now with where it wants to be, and identifying what is needed to close the gap",
        "Analysing gaps in the product portfolio",
        "A financial variance analysis",
      ],
      correct_answer: 1,
    },
  ],
  4: [
    {
      question: "What is organisational behaviour (OB)?",
      options: [
        "The study of how organisations are structured",
        "The study of how individuals, groups, and structures affect behaviour within organisations",
        "The legal behaviour required of organisations",
        "The study of customer behaviour",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Maslow's Hierarchy of Needs?",
      options: [
        "A theory of management styles",
        "A motivational theory proposing five levels of needs: physiological, safety, social, esteem, and self-actualisation",
        "A model of team development stages",
        "A theory of personality types",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Herzberg's Two-Factor Theory?",
      options: [
        "A model of leadership styles",
        "A motivational theory distinguishing hygiene factors (which prevent dissatisfaction) from motivators (which drive satisfaction and performance)",
        "A theory about decision-making processes",
        "A model of group dynamics",
      ],
      correct_answer: 1,
    },
    {
      question: "What is expectancy theory (Vroom)?",
      options: [
        "A theory that workers expect fair pay",
        "A motivational theory proposing that effort depends on expectancy (effort will lead to performance), instrumentality (performance leads to outcomes), and valence (value of outcomes)",
        "A theory about manager expectations",
        "A model of goal-setting effectiveness",
      ],
      correct_answer: 1,
    },
    {
      question: "What is groupthink?",
      options: [
        "The process of group brainstorming",
        "A phenomenon where the desire for group harmony overrides critical evaluation, leading to poor decision-making",
        "The collective intelligence of a team",
        "The process of reaching consensus on a decision",
      ],
      correct_answer: 1,
    },
    {
      question: "What is organisational culture?",
      options: [
        "The cultural diversity of employees",
        "The shared values, beliefs, norms, and practices that shape how people behave within an organisation",
        "The formal policies and procedures manual",
        "The external reputation of the organisation",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the Big Five personality model in OB?",
      options: [
        "Five key management behaviours",
        "A personality framework of five traits: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism (OCEAN)",
        "Five types of organisational culture",
        "Five stages of employee motivation",
      ],
      correct_answer: 1,
    },
    {
      question: "What is cognitive dissonance in organisational settings?",
      options: [
        "A type of workplace conflict",
        "The psychological discomfort experienced when a person holds contradictory beliefs or when behaviour contradicts their values",
        "The gap between employee expectations and reality",
        "A type of communication barrier",
      ],
      correct_answer: 1,
    },
    {
      question: "What is equity theory (Adams)?",
      options: [
        "A theory about fair wages only",
        "A motivational theory proposing that employees compare their input-to-output ratio with others and seek to restore balance if they perceive inequity",
        "A legal framework for workplace equality",
        "A theory about organisational justice in performance reviews",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between formal and informal organisations?",
      options: [
        "Formal organisations are larger",
        "Formal organisation is the official structure of authority and roles; informal organisation is the network of social relationships that develop spontaneously",
        "Informal organisations are unethical",
        "They are identical in all respects",
      ],
      correct_answer: 1,
    },
    {
      question: "What is job enrichment?",
      options: [
        "Increasing employee pay",
        "Redesigning a job to provide more meaningful work, greater responsibility, and opportunities for achievement and growth",
        "Adding more tasks to a job without increasing challenge",
        "Expanding the scope of a job by adding more of the same tasks",
      ],
      correct_answer: 1,
    },
    {
      question: "What is organisational conflict?",
      options: [
        "Any disagreement between employees",
        "A process where one party perceives that its interests are opposed or negatively affected by another party, arising from incompatible goals or scarce resources",
        "Conflict only between management and unions",
        "Any form of workplace competition",
      ],
      correct_answer: 1,
    },
    {
      question: "What is social loafing?",
      options: [
        "Employees spending time on social media at work",
        "The tendency for individuals to exert less effort when working in a group than when working alone",
        "Working slowly in a relaxed team environment",
        "Delegating too much work to others",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a psychological contract?",
      options: [
        "A legal employment contract",
        "The unwritten set of mutual expectations and obligations between an employee and employer",
        "A formal performance agreement",
        "A confidentiality agreement",
      ],
      correct_answer: 1,
    },
    {
      question: "What is attribution theory?",
      options: [
        "How employees attribute praise to others",
        "The process by which individuals explain the causes of behaviour — attributing them to internal (dispositional) or external (situational) factors",
        "How managers assign tasks to teams",
        "How employees attribute value to rewards",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the Hawthorne effect as applied to OB?",
      options: [
        "Workers prefer working in the dark",
        "Workers change their behaviour when they know they are being observed, highlighting the importance of social attention",
        "Productivity is determined by physical working conditions only",
        "Workers are most productive at night",
      ],
      correct_answer: 1,
    },
    {
      question: "What is job satisfaction?",
      options: [
        "The level of an employee's pay",
        "The degree to which an individual feels positively about their job, derived from factors including work itself, relationships, pay, and growth",
        "The number of tasks in a job description",
        "How well an employee performs their job",
      ],
      correct_answer: 1,
    },
    {
      question: "What is organisational commitment?",
      options: [
        "The organisation's commitment to its mission",
        "The degree to which an employee identifies with and is dedicated to the organisation, and is unlikely to leave",
        "The level of investment in employee training",
        "A formal pledge signed by employees",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a self-fulfilling prophecy in management?",
      options: [
        "Predicting financial performance accurately",
        "When a manager's expectations about an employee influence that employee's behaviour such that the expectations come true",
        "Setting overly ambitious goals",
        "The tendency for managers to predict outcomes based on data",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the locus of control personality trait in OB?",
      options: [
        "Where an employee reports to in the hierarchy",
        "The degree to which individuals believe they control their own outcomes (internal) vs. believe outcomes are controlled by outside forces (external)",
        "The geographic location of an employee's office",
        "How much control a manager has over their team",
      ],
      correct_answer: 1,
    },
  ],
  5: [
    {
      question: "What are the stages of Tuckman's model of team development?",
      options: [
        "Plan, Do, Check, Act",
        "Forming, Storming, Norming, Performing (and later Adjourning)",
        "Inception, Elaboration, Construction, Transition",
        "Orientation, Conflict, Cohesion, Performance",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a high-performing team?",
      options: [
        "A team that meets all deadlines",
        "A team characterised by clear goals, trust, open communication, diverse skills, and a culture of accountability that consistently achieves superior results",
        "A team with the highest individual performers",
        "A team that has worked together for the longest time",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Belbin's team roles model?",
      options: [
        "A model of leadership styles",
        "A framework identifying nine complementary team roles (e.g. Plant, Monitor Evaluator, Coordinator, Implementer) needed for an effective team",
        "A model for assessing individual performance",
        "A framework for managing virtual teams",
      ],
      correct_answer: 1,
    },
    {
      question: "What is intrinsic motivation?",
      options: [
        "Motivation from external rewards like salary",
        "Motivation that comes from within — driven by interest, enjoyment, or the satisfaction of the work itself",
        "Motivation based on competition with others",
        "Motivation from recognition by managers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is extrinsic motivation?",
      options: [
        "Motivation from personal satisfaction",
        "Motivation driven by external rewards such as pay, bonuses, recognition, or promotion",
        "Motivation based on the meaning of work",
        "Motivation from mastering new skills",
      ],
      correct_answer: 1,
    },
    {
      question: "What is self-determination theory (SDT) in motivation?",
      options: [
        "A theory that employees determine their own pay",
        "A theory proposing that motivation is driven by three innate psychological needs: autonomy, competence, and relatedness",
        "A framework for setting personal goals",
        "A theory about intrinsic vs. extrinsic factors in personality",
      ],
      correct_answer: 1,
    },
    {
      question: "What is team cohesion?",
      options: [
        "The physical proximity of team members",
        "The degree to which team members are attracted to the team and motivated to remain part of it, working collaboratively toward shared goals",
        "The number of team members with the same skills",
        "Agreement on all decisions without conflict",
      ],
      correct_answer: 1,
    },
    {
      question: "What is diversity in teams?",
      options: [
        "Having team members from the same background",
        "The range of differences among team members in terms of skills, experience, perspectives, background, culture, and demographics",
        "Having exactly equal numbers of each group",
        "A legal requirement for hiring",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a cross-functional team?",
      options: [
        "A team with conflicting goals",
        "A team composed of members from different departments or functional areas working toward a common goal",
        "A team that works across multiple geographic locations",
        "A team that manages cross-departmental disputes",
      ],
      correct_answer: 1,
    },
    {
      question: "What is psychological safety in teams?",
      options: [
        "Physical safety procedures in the workplace",
        "A shared belief that the team is safe for interpersonal risk-taking — speaking up, asking questions, and admitting mistakes without fear of punishment",
        "A confidentiality agreement among team members",
        "The absence of workplace stress",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between a group and a team?",
      options: [
        "A group is smaller than a team",
        "A group is a collection of individuals who may share a location; a team has shared goals, interdependence, and collective accountability",
        "Teams are informal; groups are formal",
        "There is no meaningful difference",
      ],
      correct_answer: 1,
    },
    {
      question: "What is delegation and why is it important in team management?",
      options: [
        "Distributing blame for failures",
        "Assigning responsibility and authority to team members, freeing managers for higher-level tasks and developing employees' capabilities",
        "Reducing headcount in a department",
        "Creating detailed task lists for employees",
      ],
      correct_answer: 1,
    },
    {
      question: "What is conflict resolution in team management?",
      options: [
        "Eliminating all disagreement from a team",
        "The process of addressing and resolving interpersonal or task-related disagreements constructively to restore team effectiveness",
        "Terminating employees who create conflict",
        "Avoiding difficult conversations with team members",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a team charter?",
      options: [
        "A legal document forming the team",
        "A document establishing the team's purpose, goals, norms, roles, and decision-making processes to align members from the start",
        "The team's formal reporting structure",
        "A performance review template",
      ],
      correct_answer: 1,
    },
    {
      question: "What is empowerment in team management?",
      options: [
        "Giving team members more physical resources",
        "Giving team members the authority, resources, and confidence to make decisions and take ownership of their work",
        "Micromanaging to ensure quality",
        "Assigning stretch targets to all team members",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the free-rider problem in teams?",
      options: [
        "Free transportation for team members",
        "When certain team members contribute less than others, relying on fellow members to carry the workload",
        "Allowing employees to choose their tasks freely",
        "A problem with team communication tools",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a virtual team?",
      options: [
        "A simulated team used for training exercises",
        "A team whose members are geographically dispersed and collaborate primarily through digital communication technologies",
        "A team with no formal structure",
        "A temporary project team",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of team retrospectives (also known as post-mortems)?",
      options: [
        "Criticising poor performers after a project",
        "A structured reflection session where the team reviews what went well, what could be improved, and how to work better in the future",
        "Recording final project outcomes for clients",
        "A legal review of project decisions",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a recognition and rewards programme in team motivation?",
      options: [
        "A legal requirement for team bonuses",
        "A formalised system for acknowledging and rewarding team and individual contributions to maintain motivation and reinforce desired behaviours",
        "A peer-to-peer salary review process",
        "An awards ceremony for external achievements",
      ],
      correct_answer: 1,
    },
    {
      question: "What is constructive feedback in team management?",
      options: [
        "Only positive feedback",
        "Specific, behaviour-focused, actionable feedback aimed at helping individuals improve performance without demoralising them",
        "Feedback delivered only in formal reviews",
        "Critical feedback that points out faults without suggestions",
      ],
      correct_answer: 1,
    },
  ],
  6: [
    {
      question: "What is financial management?",
      options: [
        "Managing the accounting department",
        "The planning, organising, directing, and controlling of an organisation's financial resources to achieve its objectives",
        "Preparing tax returns for a business",
        "Managing staff salaries",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a budget?",
      options: [
        "A list of monthly expenses",
        "A financial plan that estimates revenues and expenditures for a defined period, used to guide resource allocation and control spending",
        "A historical financial statement",
        "The organisation's bank account balance",
      ],
      correct_answer: 1,
    },
    {
      question: "What is net present value (NPV)?",
      options: [
        "The total revenue minus total costs",
        "The present value of all future cash flows from an investment minus the initial investment — if positive, the investment adds value",
        "The current market value of an asset",
        "The sum of all cash flows from a project",
      ],
      correct_answer: 1,
    },
    {
      question: "What is return on investment (ROI)?",
      options: [
        "The dividend paid to investors",
        "A measure of profitability: (Net Profit / Cost of Investment) × 100%",
        "The total return generated by the stock market",
        "The interest rate on a business loan",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the break-even point?",
      options: [
        "When profit equals the budget forecast",
        "The level of sales at which total revenue equals total costs — no profit or loss",
        "The point where variable costs equal fixed costs",
        "The minimum sales target set by management",
      ],
      correct_answer: 1,
    },
    {
      question: "What is cash flow?",
      options: [
        "The profit reported on the income statement",
        "The movement of money into and out of a business — positive cash flow means more cash is coming in than going out",
        "The amount of cash held in the bank",
        "The total revenue of the organisation",
      ],
      correct_answer: 1,
    },
    {
      question: "What is variance analysis in financial management?",
      options: [
        "Analysing risk in investment portfolios",
        "Comparing actual financial performance with the budget to identify and investigate differences",
        "Measuring statistical variability in financial data",
        "Analysing changes in market prices",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between fixed and variable costs?",
      options: [
        "Fixed costs change with output; variable costs do not",
        "Fixed costs remain constant regardless of output level; variable costs change in proportion to output",
        "Variable costs are paid monthly; fixed costs are paid annually",
        "Fixed costs apply to manufacturing; variable costs to services",
      ],
      correct_answer: 1,
    },
    {
      question: "What is working capital?",
      options: [
        "The capital invested in machinery and equipment",
        "Current assets minus current liabilities — the funds available for day-to-day operations",
        "The total equity of the business",
        "The bank loan used to fund operations",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the current ratio?",
      options: [
        "The ratio of profit to revenue",
        "Current assets divided by current liabilities — a measure of short-term liquidity",
        "The ratio of debt to equity",
        "The most recent profit margin of the business",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the debt-to-equity ratio?",
      options: [
        "Total profits divided by total equity",
        "Total liabilities divided by shareholders' equity — a measure of financial leverage",
        "Total debt divided by total revenue",
        "Short-term debt divided by long-term debt",
      ],
      correct_answer: 1,
    },
    {
      question: "What is financial leverage?",
      options: [
        "The ability to borrow money at a low interest rate",
        "The use of borrowed capital (debt) to amplify potential returns — but also increasing financial risk",
        "The bargaining power of the organisation with lenders",
        "The ratio of revenue to expenses",
      ],
      correct_answer: 1,
    },
    {
      question: "What is capital budgeting?",
      options: [
        "Allocating the annual budget across departments",
        "The process of evaluating and selecting long-term investment projects in fixed assets or projects",
        "Managing the working capital of a business",
        "Setting the salary budget for the year",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the payback period?",
      options: [
        "The time required to repay a bank loan",
        "The time required for an investment's cash inflows to recover its initial cost",
        "The duration of a financial planning cycle",
        "The period between budget submission and approval",
      ],
      correct_answer: 1,
    },
    {
      question: "What is profit margin?",
      options: [
        "The total profit of the business",
        "(Net Profit / Revenue) × 100% — the percentage of revenue that remains as profit after costs",
        "The target profit set in the annual budget",
        "The difference between gross and net profit",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a financial statement?",
      options: [
        "A personal financial plan",
        "A formal record of the financial activities of a business, including the income statement, balance sheet, and cash flow statement",
        "A bank statement",
        "A budget forecast",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between revenue and profit?",
      options: [
        "They are the same thing",
        "Revenue is total income from sales; profit is revenue minus all costs (expenses)",
        "Profit is always larger than revenue",
        "Revenue is what a company earns after tax; profit is before tax",
      ],
      correct_answer: 1,
    },
    {
      question: "What is internal rate of return (IRR)?",
      options: [
        "The interest rate charged on internal loans",
        "The discount rate at which the NPV of an investment equals zero — used to compare investment attractiveness",
        "The return on equity of the business",
        "The rate of return required by shareholders",
      ],
      correct_answer: 1,
    },
    {
      question: "What is zero-based budgeting?",
      options: [
        "Setting all budgets to zero after each year",
        "A budgeting approach where every expense must be justified from scratch each period, rather than incrementally adjusting the prior year's budget",
        "A budget with no allocation for variable costs",
        "A technique for reducing overhead costs to zero",
      ],
      correct_answer: 1,
    },
    {
      question: "What is depreciation in financial management?",
      options: [
        "A decrease in market share",
        "The systematic allocation of the cost of a tangible asset over its useful life — reflecting the consumption of the asset's value",
        "A reduction in employee salaries",
        "The reduction in the value of currency over time",
      ],
      correct_answer: 1,
    },
  ],
  7: [
    {
      question: "What is operations management?",
      options: [
        "Managing financial operations of a business",
        "The design, management, and improvement of processes that transform inputs into goods and services for customers",
        "Managing the operations team's headcount",
        "The administration of legal and compliance operations",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Lean management?",
      options: [
        "Managing with fewer employees",
        "A philosophy focused on maximising customer value while minimising waste — removing activities that do not add value",
        "A cost-cutting approach targeting marketing budgets",
        "Managing a lean balance sheet",
      ],
      correct_answer: 1,
    },
    {
      question: "What are the seven types of waste (Muda) in Lean thinking?",
      options: [
        "People, processes, products, places, procedures, planning, and performance",
        "Transport, Inventory, Motion, Waiting, Over-production, Over-processing, and Defects (TIMWOOD)",
        "Cost, time, quality, safety, morale, environment, and communication",
        "Supply, demand, capacity, quality, labour, materials, and capital",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Six Sigma?",
      options: [
        "A lean manufacturing framework",
        "A data-driven methodology for reducing defects and variation in processes, aiming for no more than 3.4 defects per million opportunities",
        "A quality standard for software development",
        "A management approach combining five management disciplines",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the DMAIC framework used for?",
      options: [
        "A project management framework: Define, Measure, Analyse, Improve, Control — used in Six Sigma process improvement",
        "A financial planning framework",
        "A recruitment process framework",
        "A marketing strategy model",
      ],
      correct_answer: 0,
    },
    {
      question: "What is just-in-time (JIT) inventory management?",
      options: [
        "Ordering inventory just before it runs out",
        "A strategy of receiving goods only as they are needed in the production process to minimise inventory holding costs",
        "Delivering products to customers just in time for a deadline",
        "Managing time-sensitive perishable products",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a supply chain?",
      options: [
        "A chain of command in procurement",
        "The network of organisations, activities, resources, and technologies involved in creating and delivering a product from raw materials to end customer",
        "The internal delivery process within a single factory",
        "A set of contracts with key suppliers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Kaizen?",
      options: [
        "A Japanese management hierarchy",
        "A Japanese philosophy of continuous improvement involving all employees making small, incremental improvements to processes",
        "A lean method for eliminating entire processes",
        "A quality certification standard",
      ],
      correct_answer: 1,
    },
    {
      question: "What is capacity planning?",
      options: [
        "Planning the physical office space",
        "Determining the production capacity needed to meet changing demand for products and services",
        "Planning the number of employees required in each team",
        "A financial planning technique for capital expenditure",
      ],
      correct_answer: 1,
    },
    {
      question: "What is quality management?",
      options: [
        "Managing the quality assurance department",
        "The process of overseeing all activities necessary to ensure that products and services meet the required standard of quality consistently",
        "Writing quality procedures and manuals",
        "Inspecting finished products only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is process mapping?",
      options: [
        "Drawing a floor plan of a factory",
        "Creating a visual representation of the steps in a business process to analyse flow, identify bottlenecks, and improve efficiency",
        "A geographic mapping of supplier locations",
        "A tool for mapping employee career progression",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the Theory of Constraints (TOC)?",
      options: [
        "A theory about organisational hierarchy",
        "A management philosophy identifying that a system's performance is limited by its weakest link (bottleneck), and that improving the constraint improves the whole system",
        "A theory about the constraints on managerial decision-making",
        "A framework for managing supply chain constraints",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an SLA (Service Level Agreement)?",
      options: [
        "A salary agreement with a service employee",
        "A formal contract defining the expected level of service between a service provider and customer, including metrics and responsibilities",
        "A safety and labour agreement",
        "A software licensing agreement",
      ],
      correct_answer: 1,
    },
    {
      question: "What is throughput in operations management?",
      options: [
        "The number of employees working on a process",
        "The rate at which a system produces its end product or delivers its service",
        "The total cost of running a process",
        "The number of process steps",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Total Productive Maintenance (TPM)?",
      options: [
        "A maintenance schedule for IT systems",
        "An operations management approach aimed at maximising equipment effectiveness through proactive maintenance and operator involvement",
        "A programme for maintaining employee wellbeing",
        "A system for tracking product quality defects",
      ],
      correct_answer: 1,
    },
    {
      question: "What is demand forecasting?",
      options: [
        "Predicting future customer demand for products or services to inform planning, production, and inventory decisions",
        "Setting sales targets for the year",
        "Measuring current demand against supply",
        "Creating customer demand through marketing",
      ],
      correct_answer: 0,
    },
    {
      question: "What is an ERP (Enterprise Resource Planning) system?",
      options: [
        "A system for employee performance reviews",
        "Integrated software used to manage and automate core business processes across finance, HR, supply chain, and operations",
        "A project management software tool",
        "An email and communication platform",
      ],
      correct_answer: 1,
    },
    {
      question: "What is outsourcing in operations?",
      options: [
        "Training employees to perform new tasks",
        "Contracting external organisations to perform activities that were previously done internally",
        "Moving production facilities to a new location",
        "Automating manual processes",
      ],
      correct_answer: 1,
    },
    {
      question: "What is agile operations?",
      options: [
        "Employing physically agile workers",
        "The ability of an organisation to quickly and cost-effectively respond to changes in customer demand or market conditions",
        "A project management methodology for software teams only",
        "Operations with minimal fixed costs",
      ],
      correct_answer: 1,
    },
    {
      question: "What is overall equipment effectiveness (OEE)?",
      options: [
        "A measure of employee performance",
        "A metric measuring how effectively manufacturing equipment is utilised, considering availability, performance, and quality rates",
        "The total cost of maintaining equipment",
        "A measure of production floor size utilisation",
      ],
      correct_answer: 1,
    },
  ],
  8: [
    {
      question: "What is change management?",
      options: [
        "Changing the management team",
        "A structured approach for transitioning individuals, teams, and organisations from a current state to a desired future state",
        "Managing the change of financial systems",
        "The process of updating company policies",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Kotter's 8-step change model?",
      options: [
        "A model for planning financial change",
        "A change leadership model: Create urgency, Build a coalition, Form a vision, Communicate, Empower action, Create quick wins, Consolidate gains, Anchor change",
        "A model for organisational restructuring only",
        "A model developed by the Harvard Business Review",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Lewin's Change Model?",
      options: [
        "A financial restructuring model",
        "A three-phase model of change: Unfreeze (prepare for change), Change (transition), Refreeze (embed new state)",
        "A model for managing resistance to technology",
        "A personality model applied to change",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the ADKAR change model?",
      options: [
        "An HR competency framework",
        "A change management model focusing on five elements: Awareness, Desire, Knowledge, Ability, and Reinforcement",
        "A project management model for change programmes",
        "A model for assessing digital transformation readiness",
      ],
      correct_answer: 1,
    },
    {
      question: "What is resistance to change?",
      options: [
        "Refusal to accept management directives",
        "The pushback from individuals or groups who perceive change as threatening their interests, security, or comfort",
        "A legal right of employees",
        "An inevitable failure of change programmes",
      ],
      correct_answer: 1,
    },
    {
      question: "What are common causes of resistance to change?",
      options: [
        "Only financial impacts",
        "Fear of the unknown, loss of control, distrust of management, lack of clear communication, and perceived threat to job security or status",
        "Only poor communication",
        "Resistance only occurs in large organisations",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a change champion?",
      options: [
        "The CEO of an organisation",
        "An influential individual within the organisation who actively supports, promotes, and models the change — helping to win over others",
        "A specialist hired to manage change programmes",
        "A financial sponsor of the change initiative",
      ],
      correct_answer: 1,
    },
    {
      question: "What is stakeholder management in change management?",
      options: [
        "Managing key shareholders' investments",
        "Identifying, analysing, and engaging with all individuals and groups affected by or influencing a change initiative",
        "Managing the board of directors during a merger",
        "A project management task for resource allocation",
      ],
      correct_answer: 1,
    },
    {
      question: "What is organisational readiness for change?",
      options: [
        "Having a change management budget",
        "The degree to which an organisation and its members are prepared and willing to undertake change",
        "The number of employees who support change",
        "Having an approved change management plan",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a burning platform in change management?",
      options: [
        "An unethical method of forcing change",
        "A metaphor for creating urgency around change by making the cost of inaction clear — the status quo is unsustainable",
        "A situation where change must occur due to a fire safety issue",
        "A change initiative that is too risky",
      ],
      correct_answer: 1,
    },
    {
      question: "What is digital transformation?",
      options: [
        "Digitising paper documents only",
        "The integration of digital technology into all areas of a business, fundamentally changing how it operates and delivers value to customers",
        "Upgrading IT infrastructure",
        "Training employees to use computers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a change impact assessment?",
      options: [
        "Measuring the cost of a change programme",
        "An analysis of how a proposed change will affect different parts of the organisation, including processes, people, and technology",
        "A legal review of regulatory compliance",
        "An assessment of employee attitudes toward change",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an organisational development (OD) intervention?",
      options: [
        "A programme for reducing the organisation's headcount",
        "A planned activity designed to improve the effectiveness of an organisation by addressing its culture, processes, or structure",
        "An emergency procedure for financial crises",
        "A performance improvement plan for underperforming employees",
      ],
      correct_answer: 1,
    },
    {
      question: "What is culture change?",
      options: [
        "Changing the company logo and branding",
        "Shifting the values, behaviours, and beliefs that characterise an organisation — one of the most challenging forms of organisational change",
        "Hiring staff from more diverse backgrounds",
        "Updating the company values statement",
      ],
      correct_answer: 1,
    },
    {
      question: "What is incremental change?",
      options: [
        "Change that happens by accident",
        "Small, gradual improvements to existing processes or systems without fundamentally altering the organisation's direction",
        "The first step in a major transformation programme",
        "Any change that takes more than one year",
      ],
      correct_answer: 1,
    },
    {
      question: "What is transformational change?",
      options: [
        "A change of leadership at the top",
        "A fundamental, large-scale change that alters the organisation's culture, strategy, structure, or systems in significant ways",
        "Implementing a new IT system",
        "Any change led by senior management",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a communication plan in a change programme?",
      options: [
        "A marketing communications plan",
        "A structured plan identifying what messages to communicate, to which stakeholders, at what time, and through which channels during a change initiative",
        "An employee newsletter schedule",
        "A plan for communicating with external media",
      ],
      correct_answer: 1,
    },
    {
      question: "What is benefits realisation in change management?",
      options: [
        "Updating the employee benefits package",
        "The process of ensuring that the intended benefits of a change initiative are actually achieved and tracked after implementation",
        "Calculating the return on investment of a training programme",
        "Managing the payroll system after a merger",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the McKinsey 7-S framework used for?",
      options: [
        "A financial performance framework",
        "A framework for analysing an organisation's internal elements (Strategy, Structure, Systems, Shared Values, Staff, Style, Skills) and their alignment",
        "A market analysis tool",
        "A model for managing seven key stakeholders",
      ],
      correct_answer: 1,
    },
    {
      question: "What is sustainability of change?",
      options: [
        "Environmental sustainability in change projects",
        "Ensuring that the new behaviours, processes, and outcomes introduced by a change initiative are embedded and maintained over time, without reverting to old ways",
        "Long-term financial planning for change",
        "Maintaining the change management team after a project",
      ],
      correct_answer: 1,
    },
  ],
  9: [
    {
      question: "What is human resource management (HRM)?",
      options: [
        "The management of financial resources",
        "The strategic approach to managing an organisation's most valuable asset — its people — to achieve organisational goals",
        "The management of HR software systems",
        "The administration of employee contracts only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is talent management?",
      options: [
        "Managing creative talent agencies",
        "A strategic approach to attracting, identifying, developing, engaging, retaining, and deploying individuals who are considered particularly valuable to an organisation",
        "The management of the HR talent database",
        "Recruiting the most qualified candidates",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the recruitment process?",
      options: [
        "Advertising a job vacancy only",
        "The entire process of attracting, screening, selecting, and onboarding new employees to fill vacancies",
        "Conducting job interviews",
        "Writing job descriptions for open positions",
      ],
      correct_answer: 1,
    },
    {
      question: "What is employer branding?",
      options: [
        "The company's logo and visual identity",
        "The reputation and perception of an organisation as an employer — the image projected to attract and retain talent",
        "Marketing the company's products to customers",
        "The company's social media presence",
      ],
      correct_answer: 1,
    },
    {
      question: "What is onboarding?",
      options: [
        "The process of leaving a company",
        "The process of integrating new employees into the organisation, helping them understand their role, culture, and colleagues",
        "Orientation training for experienced employees only",
        "The initial job offer and negotiation stage",
      ],
      correct_answer: 1,
    },
    {
      question: "What is performance management?",
      options: [
        "Managing the performance of company shares",
        "The continuous process of setting objectives, monitoring performance, providing feedback, and developing employees to achieve goals",
        "An annual appraisal meeting with employees",
        "A disciplinary process for poor performance",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a 360-degree performance review?",
      options: [
        "A review covering all 360 days of the year",
        "A performance assessment process where feedback is gathered from an employee's manager, peers, subordinates, and sometimes customers",
        "A full financial review of an employee's department",
        "An assessment tool used only for senior managers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is succession planning in HR?",
      options: [
        "Planning for business succession after a founder retires",
        "Identifying and developing internal talent to fill key leadership and critical roles when they become vacant",
        "A legal process for passing assets to the next generation",
        "Planning the next hire for each team",
      ],
      correct_answer: 1,
    },
    {
      question: "What is employee engagement?",
      options: [
        "The process of hiring new employees",
        "The emotional commitment employees have to their work and their organisation, reflected in discretionary effort and advocacy",
        "A satisfaction survey process",
        "The employment contract terms",
      ],
      correct_answer: 1,
    },
    {
      question: "What is job analysis?",
      options: [
        "Analysing the profitability of different job roles",
        "The systematic process of collecting information about the duties, responsibilities, skills, and context of a job",
        "Reviewing whether a job role should be outsourced",
        "A process for comparing salaries across industries",
      ],
      correct_answer: 1,
    },
    {
      question: "What is workforce planning?",
      options: [
        "Planning office space for employees",
        "Analysing and forecasting the talent required to execute the organisational strategy, and planning how to bridge gaps in capability or headcount",
        "Drawing up the annual HR budget",
        "Managing the shift patterns of workers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is learning and development (L&D)?",
      options: [
        "Reading and arithmetic training only",
        "The function within HR responsible for improving employees' knowledge, skills, and capabilities through training and development programmes",
        "Managing university partnerships for graduate recruitment",
        "Supporting employees to complete professional qualifications",
      ],
      correct_answer: 1,
    },
    {
      question: "What is diversity and inclusion in HR?",
      options: [
        "Having an equal number of men and women in the workforce",
        "Creating an environment that values and leverages the differences among people and ensures all employees can contribute fully and feel they belong",
        "Meeting legal anti-discrimination requirements only",
        "Celebrating different cultural events in the workplace",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an employee value proposition (EVP)?",
      options: [
        "The salary and benefits offered to employees",
        "The unique set of benefits and reasons an employee receives and experiences in return for the skills, capability, and experience they bring to an organisation",
        "A legal contract term",
        "The company's mission statement",
      ],
      correct_answer: 1,
    },
    {
      question: "What is HR analytics?",
      options: [
        "HR staff tracking their own performance",
        "The application of data analysis and statistical methods to human resources data to improve decision-making about people",
        "A type of HR software system",
        "Annual HR compliance reporting",
      ],
      correct_answer: 1,
    },
    {
      question: "What is organisational design?",
      options: [
        "The interior design of the office",
        "The deliberate process of shaping an organisation's structure, processes, and roles to achieve its strategy and goals effectively",
        "Designing company uniforms and branding",
        "Creating the organisational chart",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an employee assistance programme (EAP)?",
      options: [
        "A programme for assisting employees with technical issues",
        "A confidential work-based service providing counselling, advice, and support to employees experiencing personal or work-related difficulties",
        "An assistance programme for new hires",
        "A performance coaching programme",
      ],
      correct_answer: 1,
    },
    {
      question: "What is competency-based interviewing?",
      options: [
        "An interview focused on technical knowledge only",
        "An interview technique that uses structured questions about past behaviour to assess whether a candidate demonstrates the required competencies",
        "An interview assessing academic qualifications",
        "An unstructured conversational interview",
      ],
      correct_answer: 1,
    },
    {
      question: "What is talent pipeline?",
      options: [
        "A recruitment agency database",
        "A pool of pre-identified internal and external candidates who could fill critical roles, developed through ongoing talent management activities",
        "A sequence of recruitment stages",
        "A list of all past employees",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the psychological contract in HR?",
      options: [
        "A mental health support agreement",
        "The unwritten, informal set of mutual expectations between employer and employee — beyond the formal contract — about obligations, rights, and fairness",
        "A confidentiality agreement",
        "A contract reviewed by a psychologist",
      ],
      correct_answer: 1,
    },
  ],
  10: [
    {
      question: "What is project management?",
      options: [
        "Managing day-to-day operations",
        "The application of knowledge, skills, tools, and techniques to deliver a unique outcome within defined constraints of scope, time, and budget",
        "Managing ongoing organisational processes",
        "The management of project teams only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the PMBOK Guide?",
      options: [
        "A project management software tool",
        "A globally recognised guide from the Project Management Institute (PMI) setting out best practices and standards for project management",
        "A project reporting framework",
        "A book on agile development methods",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the triple constraint in project management?",
      options: [
        "Time, quality, and satisfaction",
        "The interdependent constraints of scope, time (schedule), and cost (budget) — changing one affects the others",
        "People, process, and technology",
        "Planning, execution, and control",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a project charter?",
      options: [
        "The project manager's contract",
        "A formal document authorising the existence of a project, defining its objectives, scope, stakeholders, and the authority of the project manager",
        "The project schedule",
        "A detailed project budget",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a Work Breakdown Structure (WBS)?",
      options: [
        "An organisational chart for the project team",
        "A hierarchical decomposition of the total scope of work into smaller, manageable deliverables and work packages",
        "A Gantt chart of project activities",
        "A list of project risks",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a Gantt chart?",
      options: [
        "A financial chart showing project costs over time",
        "A bar chart illustrating a project schedule, showing tasks, their durations, and dependencies over time",
        "A chart of team roles and responsibilities",
        "A risk management matrix",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the critical path method (CPM)?",
      options: [
        "A method for finding the most critical team member",
        "A technique for identifying the longest sequence of dependent tasks in a project (the critical path) that determines the minimum project duration",
        "A risk analysis method",
        "A quality management framework",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Agile project management?",
      options: [
        "A method for managing fast-moving markets",
        "An iterative approach to project management that delivers value incrementally through short sprints, with continuous feedback and adaptation",
        "A method for managing remote teams",
        "Any project completed quickly",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Scrum?",
      options: [
        "A type of software programming language",
        "An agile framework for managing complex work through iterative Sprints, with defined roles (Product Owner, Scrum Master, Development Team) and ceremonies",
        "A meeting format for project status updates",
        "A method for managing large-scale programmes",
      ],
      correct_answer: 1,
    },
    {
      question: "What is earned value management (EVM)?",
      options: [
        "A method for valuing project outcomes",
        "A project performance measurement technique integrating scope, schedule, and cost data to assess progress and forecast project outcomes",
        "A technique for earning stakeholder buy-in",
        "A method for calculating project team salaries",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a project risk?",
      options: [
        "A cost overrun in a project",
        "An uncertain event or condition that, if it occurs, has a positive or negative effect on one or more project objectives",
        "Any problem encountered during a project",
        "The probability that a project will fail",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a risk register?",
      options: [
        "A list of all project failures",
        "A document recording identified project risks, their likelihood and impact, and the planned responses to manage them",
        "A legal register of project contracts",
        "A tracking list of project issues",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between a risk and an issue in project management?",
      options: [
        "They are the same thing",
        "A risk is an uncertain future event; an issue is a risk that has already materialised and requires immediate action",
        "An issue is more serious than a risk",
        "A risk is managed by the project manager; an issue by the team",
      ],
      correct_answer: 1,
    },
    {
      question: "What is scope creep?",
      options: [
        "A slow increase in project costs",
        "The uncontrolled expansion of project scope without corresponding adjustment to time, budget, or resources — a common cause of project failure",
        "The tendency for projects to shrink over time",
        "A technique for expanding project requirements",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a project milestone?",
      options: [
        "A unit of project cost",
        "A significant event or achievement in a project used to mark progress and confirm delivery of a key outcome",
        "A weekly progress report",
        "The final project deliverable",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of a project retrospective (lessons learned)?",
      options: [
        "Critiquing the project manager's performance",
        "Reviewing what went well and what could be improved to capture lessons that can enhance future projects",
        "A client review of the project outcomes",
        "A financial audit of the project",
      ],
      correct_answer: 1,
    },
    {
      question: "What is PRINCE2?",
      options: [
        "A software development methodology",
        "A structured project management method widely used in the UK and internationally, based on defined processes, roles, and management by stages",
        "A project management tool for creative projects",
        "An agile approach to project delivery",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a project sponsor?",
      options: [
        "A company that funds the project externally",
        "The senior executive who provides strategic direction, secures resources, and has ultimate accountability for the project's success",
        "The lead project manager",
        "An external consultant overseeing the project",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a change control process in project management?",
      options: [
        "The process for managing team changes",
        "A formal procedure for evaluating, approving, and documenting changes to the project scope, schedule, or budget",
        "A method for updating project documentation",
        "A financial approval process",
      ],
      correct_answer: 1,
    },
    {
      question: "What is project closure?",
      options: [
        "Cancelling a failing project",
        "The final phase where the project is formally completed, deliverables handed over, contracts closed, lessons captured, and the team disbanded",
        "Reducing the project team at the end of a phase",
        "The final project budget review",
      ],
      correct_answer: 1,
    },
  ],
};

function generateFinalTestQuestions(moduleId) {
  const id = parseInt(moduleId, 10);
  if (!FINAL_TEST_QUESTIONS[id]) {
    console.warn(`No final test questions found for module ${moduleId}, falling back to module 1`);
  }
  return FINAL_TEST_QUESTIONS[id] || FINAL_TEST_QUESTIONS[1];
}

export default function ModuleFinalTestPage() {
  const router = useRouter();
  const { moduleId } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passed, setPassed] = useState(false);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [noBadges, setNoBadges] = useState(false);

  // Load noBadges flag from localStorage on mount
  useEffect(() => {
    try {
      setNoBadges(localStorage.getItem(NO_BADGES_KEY) === "true");
    } catch {
      // localStorage unavailable (SSR or private mode)
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const handleComplete = async (testPassed, score) => {
    setPassed(testPassed);
    if (user) {
      try {
        await fetch("/api/module-final-submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ moduleId, appKey: APP_KEY, score, userId: user.id }),
        });
      } catch (err) {
        console.error("Error saving final test result:", err);
      }
    }
  };

  const goToNextModule = () => {
    const nextModuleId = parseInt(moduleId) + 1;
    if (nextModuleId <= 10) {
      router.push(`/modules/${nextModuleId}/lesson/1`);
    } else {
      router.push("/curriculum");
    }
  };

  const confirmSkip = () => {
    try {
      localStorage.setItem(NO_BADGES_KEY, "true");
    } catch {
      // localStorage unavailable
    }
    setNoBadges(true);
    setShowSkipDialog(false);
    goToNextModule();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          Module {moduleId} Final Test – {APP_DISPLAY}
        </title>
      </Head>
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Skip-mode banner */}
          {noBadges && (
            <div
              role="alert"
              className="mb-6 rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3 text-yellow-800 text-sm"
            >
              ⚠️ <strong>You&apos;re in Skip mode.</strong> You can continue without quizzes, but
              you won&apos;t earn badges or a certificate for this course.
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={() => router.push(`/modules/${moduleId}/lesson/1`)}
              className="text-purple-600 hover:text-purple-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Module
            </button>
          </div>

          <div className="card mb-8">
            <h1 className="text-3xl font-bold mb-2">Module {moduleId} – Final Test</h1>
            <p className="text-gray-600">
              Complete all 20 questions. You need to score 14/20 or higher to pass and unlock the
              next level.
            </p>
          </div>

          <ModuleFinalTestComponent
            questions={generateFinalTestQuestions(moduleId)}
            moduleId={moduleId}
            appKey={APP_KEY}
            onComplete={handleComplete}
          />

          {/* Skip quiz button — shown below test when not yet passed */}
          {!passed && !noBadges && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowSkipDialog(true)}
                className="text-sm text-gray-500 underline hover:text-gray-700"
              >
                Skip quiz and continue
              </button>
            </div>
          )}

          {/* Skip mode: Continue without taking the test */}
          {noBadges && !passed && (
            <div className="card bg-yellow-50 border-2 border-yellow-400 mt-6">
              <p className="text-gray-700 mb-4">Continue to the next module.</p>
              <button onClick={goToNextModule} className="btn-primary">
                Continue to Next Module
              </button>
            </div>
          )}

          {passed && (
            <div className="card bg-green-50 border-2 border-green-500 mt-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                🎉 Module Complete – Next Level Unlocked!
              </h3>
              <button onClick={() => router.push("/curriculum")} className="btn-primary">
                Continue to Curriculum
              </button>
            </div>
          )}

          {/* Skip confirmation dialog */}
          {showSkipDialog && (
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="skip-dialog-title"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
              <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4 p-6">
                <h2 id="skip-dialog-title" className="text-xl font-semibold mb-3">
                  Skip quizzes?
                </h2>
                <p className="text-gray-700 mb-6">
                  You can continue to the next module, but you won&apos;t earn badges or a
                  certificate for this course. <strong>This cannot be undone.</strong>
                </p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setShowSkipDialog(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button onClick={confirmSkip} className="btn-primary">
                    Skip
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
