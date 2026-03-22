"use client";

// ---------------------------------------------------------------------------
// Static generation — pre-render all 30 module final-test pages at build time.
// Without getStaticPaths a dynamic route like /modules/[moduleId]/final-test
// may return a 404 in some Next.js 13+ configurations.  Explicitly generating
// all 30 paths guarantees the pages are always available — including for admins.
// ---------------------------------------------------------------------------

export async function getStaticPaths() {
  const paths = [];
  for (let moduleId = 1; moduleId <= 30; moduleId++) {
    paths.push({ params: { moduleId: String(moduleId) } });
  }
  return { paths, fallback: false };
}

export async function getStaticProps() {
  return { props: {} };
}

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ModuleFinalTestComponent from "../../../components/ModuleFinalTestComponent";
import { getCurrentUser } from "../../../lib/supabaseClient";

const APP_KEY = "learn-pr";
const APP_DISPLAY = "Learn PR";
const NO_BADGES_KEY = "learn-pr-noBadges";

// Per-module final test question bank — 20 real questions per module
const FINAL_TEST_QUESTIONS = {
  1: [
    {
      question: "What is public relations (PR)?",
      options: [
        "Paid advertising in the media",
        "The strategic management of communication between an organisation and its various publics to build mutually beneficial relationships",
        "Social media marketing only",
        "Customer service and complaint handling",
      ],
      correct_answer: 1,
    },
    {
      question: "What distinguishes PR from advertising?",
      options: [
        "PR uses paid media; advertising uses earned media",
        "PR earns media coverage through relationships and compelling stories; advertising pays for placement",
        "PR focuses only on internal communications; advertising is external",
        "There is no meaningful distinction today",
      ],
      correct_answer: 1,
    },
    {
      question: "Who is considered the father of modern public relations?",
      options: ["Edward Bernays", "Philip Kotler", "Marshall McLuhan", "David Ogilvy"],
      correct_answer: 0,
    },
    {
      question: "What is a public in the context of PR?",
      options: [
        "The general population of a country",
        "Any group of people who share a common interest in or relationship with an organisation",
        "Only customers and clients",
        "All media outlets covering the organisation",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the two-way symmetrical model of PR (Grunig)?",
      options: [
        "One-way communication from organisation to public",
        "A communication model aiming for genuine dialogue and mutual adjustment between organisation and publics",
        "PR focused only on gaining positive media coverage",
        "A model where organisations send identical messages to all audiences",
      ],
      correct_answer: 1,
    },
    {
      question: "What is reputation management?",
      options: [
        "Managing the CEO's personal reputation",
        "The practice of shaping and protecting the public perception of an organisation over time",
        "Removing negative reviews from the internet",
        "Managing customer complaints",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the RACE model in PR?",
      options: [
        "A competitive analysis framework",
        "A PR planning model: Research, Action (planning), Communication, and Evaluation",
        "A media relations framework",
        "A reputation assessment tool",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a PR strategy?",
      options: [
        "A plan for placing paid advertisements",
        "A high-level plan defining the goals, target audiences, key messages, and approaches for achieving desired outcomes through PR activities",
        "A list of media contacts",
        "A crisis communications playbook",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the role of ethics in public relations?",
      options: [
        "Ethics is optional for PR professionals",
        "PR professionals have a responsibility to be honest, transparent, and act in the public interest, not just in the interest of clients",
        "Ethics only applies to crisis communications",
        "Ethics is determined solely by the client's preferences",
      ],
      correct_answer: 1,
    },
    {
      question: "What is integrated communications in PR?",
      options: [
        "Using multiple social media platforms",
        "Ensuring all communication channels and messages are coordinated and consistent to deliver a unified brand experience",
        "Integrating PR and advertising budgets",
        "A technical integration of PR software systems",
      ],
      correct_answer: 1,
    },
    {
      question: "What is stakeholder mapping?",
      options: [
        "A geographic map of an organisation's offices",
        "A process of identifying all stakeholders, assessing their influence and interest, and prioritising engagement strategies accordingly",
        "A diagram showing the organisation's hierarchy",
        "A tool for mapping media relationships",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the public affairs function of PR?",
      options: [
        "Organising public events and appearances",
        "Managing relationships with government, regulatory bodies, and policymakers to influence public policy in line with organisational interests",
        "Managing public-facing customer service",
        "Creating publicly available press releases",
      ],
      correct_answer: 1,
    },
    {
      question: "What is employee relations in PR?",
      options: [
        "Managing workplace disputes",
        "Internal PR focused on communicating with employees, building trust, and aligning staff with the organisation's values and goals",
        "HR's function of managing employment contracts",
        "Recruiting and onboarding communications",
      ],
      correct_answer: 1,
    },
    {
      question: "What is investor relations (IR)?",
      options: [
        "Managing relationships with private investors only",
        "A PR specialism managing communication between a publicly listed organisation and its investors, analysts, and the financial community",
        "Financial reporting to shareholders",
        "Managing relationships with funding bodies",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the PESO model in modern PR?",
      options: [
        "A financial model for PR budgeting",
        "A framework categorising media channels as Paid, Earned, Shared, and Owned",
        "A media relations planning tool",
        "An evaluation model for PR campaigns",
      ],
      correct_answer: 1,
    },
    {
      question: "What is message framing in PR?",
      options: [
        "Designing the visual layout of press releases",
        "The way a message is presented to shape how audiences interpret information",
        "Writing headlines for news stories",
        "A technique for structuring speech content",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a PR campaign?",
      options: [
        "A series of paid advertisements",
        "A planned sequence of PR activities designed to achieve specific communication objectives over a defined period",
        "A single press release and media pitch",
        "A social media advertising campaign",
      ],
      correct_answer: 1,
    },
    {
      question: "What is corporate social responsibility (CSR) communications?",
      options: [
        "Reporting on financial performance to shareholders",
        "Communicating an organisation's activities and commitments to environmental, social, and ethical responsibilities to stakeholders",
        "Internal staff newsletters about company events",
        "A type of charity fundraising campaign",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the role of research in PR?",
      options: [
        "Research is only needed for academic PR projects",
        "Research underpins all effective PR — informing strategy, understanding audiences, identifying issues, and measuring outcomes",
        "Research is only needed for crisis PR",
        "Research is used only after a campaign to measure its success",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between tactical and strategic PR?",
      options: [
        "They are the same thing",
        "Strategic PR defines the long-term direction and goals; tactical PR involves the specific activities and tools used to implement the strategy",
        "Tactical PR is more important than strategic PR",
        "Strategic PR is only relevant for large organisations",
      ],
      correct_answer: 1,
    },
  ],
  2: [
    {
      question: "What is media relations?",
      options: [
        "Maintaining good relationships with social media followers",
        "The practice of building and maintaining productive relationships with journalists, editors, and media organisations to secure coverage",
        "Managing paid media advertising placements",
        "Monitoring media coverage using tracking tools",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a press release?",
      options: [
        "A paid news advertisement",
        "An official written announcement distributed to media outlets providing newsworthy information about an organisation",
        "A legal statement issued in a court case",
        "A confidential communication to key journalists",
      ],
      correct_answer: 1,
    },
    {
      question: "What is newsworthiness?",
      options: [
        "Whether a story appears in a newspaper",
        "The qualities that make a story likely to be reported by journalists: timeliness, proximity, significance, human interest, conflict, novelty",
        "A measure of how interesting an article is to readers",
        "Whether an organisation pays for its story to appear in news",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a media pitch?",
      options: [
        "A live TV broadcast",
        "A targeted communication — email, call, or message — proposing a specific story idea to a journalist",
        "A press conference presentation",
        "A media advertising pitch to a client",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the news hook in media relations?",
      options: [
        "A headline that hooks readers",
        "The timely, newsworthy angle that makes a story relevant right now and gives journalists a reason to cover it",
        "A fishing metaphor used in PR training",
        "A teaser used in broadcast media",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an exclusive in media relations?",
      options: [
        "A subscription news service",
        "Offering a story or interview to a single journalist or outlet before anyone else, in exchange for prominent coverage",
        "A story that is only published once",
        "A press release sent to all major outlets simultaneously",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an embargo in PR?",
      options: [
        "A ban on discussing a topic publicly",
        "An agreement with journalists to hold a story until a specified date and time, allowing them to prepare coverage in advance",
        "A legal restriction on media reporting",
        "A delay in the distribution of a press release",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a media briefing?",
      options: [
        "A written press release sent to all outlets",
        "A private meeting where an organisation provides journalists with background information and context, often off the record",
        "A public press conference open to all media",
        "A paid advertorial in a news publication",
      ],
      correct_answer: 1,
    },
    {
      question: "What does 'off the record' mean in media relations?",
      options: [
        "Information that cannot be reported in any form",
        "Information shared with a journalist that they understand should not be directly attributed or published as stated",
        "A legal restriction on media publication",
        "Background information provided in a press kit",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a press office?",
      options: [
        "A physical newspaper office",
        "The team or function within an organisation responsible for managing media relations and handling all media enquiries",
        "A printing and distribution service for press releases",
        "An external PR agency relationship",
      ],
      correct_answer: 1,
    },
    {
      question: "What is media monitoring?",
      options: [
        "Watching television news programmes",
        "Systematically tracking media coverage of an organisation, its competitors, and relevant topics across print, broadcast, and online channels",
        "Monitoring employees' use of social media",
        "Following journalists on social media",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between earned, owned, and paid media?",
      options: [
        "They are all types of advertising",
        "Earned media is coverage obtained through PR; owned media is content the organisation controls (website, blog); paid media is advertising",
        "Earned media costs more than paid media",
        "Paid media is more credible than earned media",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a media kit (press kit)?",
      options: [
        "A physical kit of press release papers",
        "A package of information provided to journalists including company background, key messages, images, biographies, and story ideas",
        "A subscription to a media monitoring service",
        "An advertising rate card for a media outlet",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a feature article in PR?",
      options: [
        "A paid news article",
        "A longer, more in-depth article exploring a topic in depth, offering more space for nuance than a news report — often secured through media relations",
        "A company blog post",
        "An article written by a PR professional for a client's website",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a trade publication?",
      options: [
        "A government-issued trade certificate",
        "A specialist media outlet covering a specific industry or profession, often important for B2B PR",
        "A publication focused on international trade",
        "A consumer magazine",
      ],
      correct_answer: 1,
    },
    {
      question: "What is broadcast media relations?",
      options: [
        "Managing television advertising",
        "Building relationships with TV and radio journalists and producers to secure editorial coverage through interviews, features, and comments",
        "Producing video content for social media",
        "Managing a live event broadcast",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a spokesperson and what makes one effective?",
      options: [
        "The CEO of the organisation",
        "A designated individual who speaks officially on behalf of an organisation — effective when trained, credible, consistent, and able to bridge to key messages",
        "The PR manager who writes all press releases",
        "Any employee authorised to speak to the media",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a journalist's deadline and why does it matter in PR?",
      options: [
        "The date a press release must be sent",
        "The point by which a journalist must file their story — respecting and working with deadlines is fundamental to media relations success",
        "The date an article is published",
        "The length of time a journalist works each day",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a media database used for?",
      options: [
        "Storing media files and images",
        "A directory of journalists, editors, and media outlets with contact information and beat details, used to target pitches effectively",
        "A database of published news articles",
        "A system for monitoring social media sentiment",
      ],
      correct_answer: 1,
    },
    {
      question: "What is thought leadership in PR?",
      options: [
        "Thinking about new PR strategies",
        "Positioning individuals or organisations as expert authorities in their field through publication of insights, commentary, and industry perspectives",
        "A type of media training programme",
        "Internal leadership development communications",
      ],
      correct_answer: 1,
    },
  ],
  3: [
    {
      question: "What is crisis communications?",
      options: [
        "Communicating during a natural disaster only",
        "The strategic management of communication before, during, and after a crisis to protect and restore an organisation's reputation",
        "Handling only social media crises",
        "The communications team working on overtime during a crisis",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a crisis in the context of PR?",
      options: [
        "Any negative news article about a company",
        "An event or situation that threatens significant harm to an organisation's operations, people, finances, or reputation, requiring immediate attention",
        "A disagreement between two employees",
        "A failed product launch",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the first priority in a crisis situation?",
      options: [
        "Issuing a press release immediately",
        "Life safety — ensuring the safety of people affected takes absolute priority over all communications considerations",
        "Contacting the CEO for a statement",
        "Monitoring social media for coverage",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a dark site in crisis communications?",
      options: [
        "A website on the dark web",
        "A pre-built, pre-approved website that can be rapidly activated during a crisis to provide official information and statements to the public",
        "A social media account kept private",
        "An internal communications platform for crisis teams",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the 'golden hour' in crisis communications?",
      options: [
        "The best time of day to issue a press release",
        "The first hour after a crisis breaks — the critical window in which early, accurate communication can shape narrative and reduce reputational damage",
        "The hour before a media briefing",
        "The peak hour for social media engagement",
      ],
      correct_answer: 1,
    },
    {
      question: "What does it mean to 'get ahead of the story' in a crisis?",
      options: [
        "Publishing the news article yourself",
        "Proactively communicating your version of events before media reports, rumours, or speculation can dominate the narrative",
        "Contacting journalists before the crisis happens",
        "Issuing a press release before confirming all the facts",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a crisis communication plan?",
      options: [
        "A plan for publicising a crisis",
        "A pre-prepared document defining responsibilities, protocols, key messages, contact lists, and procedures for managing communications during a crisis",
        "A PR campaign plan for crisis-related topics",
        "A legal plan for managing litigation",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the holding statement in crisis communications?",
      options: [
        "A statement holding back all information",
        "An initial, brief statement acknowledging the situation and committing to providing more information soon — used when full facts are not yet available",
        "A formal legal statement",
        "A statement holding journalists to specific terms",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the Situational Crisis Communication Theory (SCCT) by Coombs?",
      options: [
        "A theory about the best time to communicate in a crisis",
        "A theory matching crisis response strategies to crisis types based on how much responsibility the organisation is seen to bear",
        "A model for managing social media in a crisis",
        "A theory about the speed of crisis escalation",
      ],
      correct_answer: 1,
    },
    {
      question: "What are the three types of crisis response strategies in SCCT?",
      options: [
        "Ignore, respond, compensate",
        "Deny, diminish, and rebuild (ranging from low to high assumption of responsibility)",
        "Silence, minimise, and apologise",
        "React, recover, and refocus",
      ],
      correct_answer: 1,
    },
    {
      question: "What is reputational threat in a crisis?",
      options: [
        "A physical threat to the building",
        "The risk that a crisis will cause stakeholders to view the organisation negatively, undermining trust and support",
        "Competitor activity damaging your brand",
        "A negative campaign by a pressure group",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the role of social media monitoring in crisis management?",
      options: [
        "Posting positive stories during a crisis",
        "Identifying the first signs of a crisis, tracking sentiment and spread, and providing real-time intelligence to inform communications decisions",
        "Blocking negative social media comments",
        "Managing social media advertising during a crisis",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an issues management programme?",
      options: [
        "A system for managing customer complaints",
        "A proactive process of identifying and tracking emerging issues that could escalate into crises, enabling early intervention",
        "A crisis response framework",
        "A PR measurement system",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a crisis management team?",
      options: [
        "The PR team managing the crisis alone",
        "A cross-functional group of senior leaders (legal, operations, communications, HR) who manage the organisation's response to a crisis",
        "A team of external PR consultants",
        "The press office team only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the importance of transparency in a crisis?",
      options: [
        "Transparency means sharing all confidential information",
        "Being open and honest about what is known builds credibility and trust, while deception or evasion typically worsens reputational damage",
        "Transparency only matters for publicly listed companies",
        "Transparency is less important than speed in a crisis",
      ],
      correct_answer: 1,
    },
    {
      question: "What is victim perception in SCCT?",
      options: [
        "How victims feel about the organisation",
        "Whether stakeholders perceive the organisation as a victim of the crisis (e.g. natural disaster) rather than responsible for causing it",
        "How the media portrays crisis victims",
        "The public's level of sympathy for crisis victims",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a post-crisis review?",
      options: [
        "A media audit of crisis coverage",
        "A structured debrief after a crisis to evaluate the effectiveness of the response, identify lessons, and improve future crisis plans",
        "A report submitted to the board about the crisis",
        "A legal review of the organisation's liability",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the role of the CEO in crisis communications?",
      options: [
        "The CEO should remain invisible to avoid scrutiny",
        "Visible leadership from the CEO demonstrates accountability and human empathy, which is critical for maintaining trust during major crises",
        "The CEO should only communicate with investors",
        "The CEO should defer all communications to the PR team",
      ],
      correct_answer: 1,
    },
    {
      question: "What is reputational resilience?",
      options: [
        "The speed of recovery after a crisis",
        "An organisation's capacity to withstand and recover from reputational threats, built on strong trust, relationships, and a track record of integrity",
        "Having no negative media coverage",
        "Preventing all crises through risk management",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the boomerang effect in crisis communications?",
      options: [
        "A positive crisis outcome that builds reputation",
        "When an attempt to suppress or deny a crisis causes it to attract even more attention and damage than if it had been addressed transparently",
        "When a crisis affects a competitor instead",
        "When positive coverage follows a crisis",
      ],
      correct_answer: 1,
    },
  ],
  4: [
    {
      question: "What is digital PR?",
      options: [
        "Using digital tools to design press releases",
        "PR practice that uses online channels, digital media, and data-driven approaches to build brand visibility, earn links, and manage reputation online",
        "Only managing social media accounts",
        "Email marketing for PR campaigns",
      ],
      correct_answer: 1,
    },
    {
      question: "What is social media management in a PR context?",
      options: [
        "Managing social media advertising budgets",
        "Strategically managing an organisation's social media presence to build relationships, share owned content, and engage with publics",
        "Scheduling and posting social media content only",
        "Monitoring competitor social media activity",
      ],
      correct_answer: 1,
    },
    {
      question: "What is influencer relations?",
      options: [
        "Managing relationships with government officials",
        "Identifying and building relationships with individuals who have significant social media audiences and can authentically communicate to target publics",
        "Hiring celebrity brand ambassadors only",
        "A type of paid advertising on social media",
      ],
      correct_answer: 1,
    },
    {
      question: "What is content marketing in the context of PR?",
      options: [
        "Advertising through content platforms",
        "Creating and distributing valuable, relevant content that attracts and engages target audiences, supporting PR objectives and building authority",
        "Writing press releases and media pitches",
        "Managing the organisation's website content",
      ],
      correct_answer: 1,
    },
    {
      question: "What is SEO's relationship to digital PR?",
      options: [
        "They are completely unrelated",
        "Digital PR earns high-quality backlinks through media coverage and partnerships, which improves search engine rankings as a by-product",
        "SEO replaces digital PR",
        "Digital PR involves optimising press releases for search engines only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is online reputation management (ORM)?",
      options: [
        "Removing negative content from the internet",
        "Monitoring and influencing how an organisation or individual is perceived online through content strategy, social media, and engagement",
        "Managing the organisation's website reviews only",
        "Responding to negative social media comments",
      ],
      correct_answer: 1,
    },
    {
      question: "What is social listening?",
      options: [
        "Listening to social media podcasts",
        "Using tools to monitor and analyse online conversations about a brand, industry, or topic to gather insights and identify opportunities or threats",
        "Reading all comments on an organisation's social media posts",
        "Following competitor social media accounts",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a social media crisis?",
      options: [
        "A technical failure of social media platforms",
        "A negative situation unfolding on social media that threatens reputational damage, requiring rapid and carefully managed communications",
        "Any negative comment on social media",
        "A drop in social media followers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is viral content in PR?",
      options: [
        "Malicious content spreading across the internet",
        "Content that spreads rapidly and widely across online platforms, significantly amplifying a message beyond paid reach",
        "Content that is shared only by employees",
        "A type of paid social media content",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a social media policy?",
      options: [
        "A set of guidelines for buying social media advertising",
        "An organisational policy guiding employees on appropriate use of social media, particularly regarding the organisation and its clients",
        "A platform's terms of service",
        "A publishing schedule for social media content",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a brand's tone of voice?",
      options: [
        "The volume at which a brand broadcasts messages",
        "The consistent personality, style, and way of expressing a brand's identity across all communications",
        "The vocal delivery in TV and radio advertising",
        "The formal language used in press releases",
      ],
      correct_answer: 1,
    },
    {
      question: "What are digital media KPIs commonly used in PR?",
      options: [
        "Cost per click and cost per impression",
        "Reach, impressions, engagement rate, share of voice, website traffic, backlinks, and sentiment",
        "Follower count and post frequency only",
        "Advertising revenue and CPM",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a branded hashtag campaign?",
      options: [
        "A paid Twitter advertising campaign",
        "A PR or marketing campaign using a specific hashtag to aggregate user content, build community, and amplify a message organically",
        "A way to trademark a hashtag on social media",
        "A campaign run exclusively on Instagram",
      ],
      correct_answer: 1,
    },
    {
      question: "What is user-generated content (UGC) in PR?",
      options: [
        "Content created by the PR team for users",
        "Content created and shared by users/customers about a brand, which PR can amplify to build authentic advocacy",
        "A type of paid influencer content",
        "Content published on a brand's owned channels",
      ],
      correct_answer: 1,
    },
    {
      question: "What is newsjacking in digital PR?",
      options: [
        "Hacking into a news website",
        "The practice of capitalising on breaking news or trending stories to insert a brand or client into the conversation for earned media coverage",
        "Republishing news articles on a brand's website",
        "Sending press releases during breaking news events",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a podcast as a PR channel?",
      options: [
        "Only an entertainment medium",
        "A long-form audio channel for thought leadership and storytelling, used in PR to reach niche audiences through interviews, features, and branded content",
        "A type of radio advertising",
        "A platform for internal communications only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is audience segmentation in digital PR?",
      options: [
        "Separating digital channels by format",
        "Dividing target audiences into groups based on shared characteristics to tailor communications and channels for maximum relevance and impact",
        "Splitting the PR budget across platforms",
        "A technical term for A/B testing",
      ],
      correct_answer: 1,
    },
    {
      question: "What is link building as a digital PR outcome?",
      options: [
        "Building hyperlinks on a website's navigation",
        "Earning hyperlinks from authoritative websites to a client's site through PR activity, improving domain authority and SEO",
        "Posting links to press releases on social media",
        "Using paid placements to gain website backlinks",
      ],
      correct_answer: 1,
    },
    {
      question: "What is data-driven PR?",
      options: [
        "PR only for data companies",
        "Using data and analytics to inform PR strategy, identify story angles, demonstrate impact, and personalise pitches to journalists",
        "Collecting data from PR campaigns after they run",
        "A PR approach using only quantitative metrics",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the impact of algorithms on digital PR?",
      options: [
        "Algorithms have no impact on PR",
        "Platform and search algorithms determine what content is seen by which audiences, requiring PR professionals to understand how to optimise for organic visibility",
        "Algorithms only affect paid advertising",
        "Algorithms are irrelevant since PR focuses on earned media",
      ],
      correct_answer: 1,
    },
  ],
  5: [
    {
      question: "What is internal communications?",
      options: [
        "Communications between PR agencies",
        "The function responsible for managing the flow of information and communication within an organisation to employees",
        "Only company newsletters and intranets",
        "Communications about internal policy documents",
      ],
      correct_answer: 1,
    },
    {
      question: "Why is internal communications important?",
      options: [
        "It is less important than external PR",
        "Effective internal communications aligns employees with organisational strategy, builds engagement, and enables collaborative performance",
        "It is only important during change programmes",
        "It is the responsibility of HR, not PR",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an employee value proposition (EVP) and its link to communications?",
      options: [
        "The salary and benefits package",
        "The unique benefits of working for an organisation, which communications must authentically articulate to attract and retain talent",
        "A marketing message for customers",
        "The company's financial offering to investors",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a town hall in internal communications?",
      options: [
        "A local government meeting",
        "A large-scale all-staff meeting where senior leaders share organisational updates and invite questions from employees",
        "A team briefing on operational matters",
        "An intranet discussion forum",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between top-down and bottom-up communications?",
      options: [
        "Top-down is better for all organisations",
        "Top-down is communication from leadership to employees; bottom-up is employees sharing feedback, ideas, and insights with leadership",
        "Bottom-up communication is informal only",
        "Top-down is internal; bottom-up is external",
      ],
      correct_answer: 1,
    },
    {
      question: "What is change communications?",
      options: [
        "Communicating that communications policies have changed",
        "Strategic communications that help employees understand, accept, and engage with organisational change",
        "External PR about organisational change",
        "Communications from the change management team only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an intranet?",
      options: [
        "A private version of the internet",
        "An internal, private network used by an organisation to share information, resources, and communications with employees",
        "A type of internal email system",
        "An employee-only social media platform",
      ],
      correct_answer: 1,
    },
    {
      question: "What is leadership communication?",
      options: [
        "Communications training for leaders",
        "The communications activities of an organisation's leaders — sharing vision, values, and direction to inspire, engage, and align employees",
        "External PR involving the CEO",
        "Writing speeches for leadership events",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an internal communications audit?",
      options: [
        "A financial audit of the communications budget",
        "A systematic assessment of the effectiveness of current internal communications channels, content, and processes",
        "An inspection of the company intranet",
        "A legal review of internal documents",
      ],
      correct_answer: 1,
    },
    {
      question: "What is employee advocacy in communications?",
      options: [
        "Advocating for employees in HR disputes",
        "When employees voluntarily promote and speak positively about their organisation on social media and in their networks",
        "A formal employee referral programme",
        "A campaign to recruit employees",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a communications matrix?",
      options: [
        "A complex communications system",
        "A planning tool mapping which messages should be communicated to which audiences through which channels and at what frequency",
        "A matrix structure within a communications team",
        "A tool for managing media contacts",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the role of communications during an organisational restructuring?",
      options: [
        "To minimise all communication during sensitive periods",
        "To provide honest, timely, and clear information to employees, reduce uncertainty, and maintain trust and engagement throughout the process",
        "To only communicate once a decision is final",
        "To communicate only with affected employees",
      ],
      correct_answer: 1,
    },
    {
      question: "What is narrative in organisational communications?",
      options: [
        "A story told in an annual report",
        "The overarching story an organisation tells about itself — its purpose, direction, and values — that provides coherence and meaning for all stakeholders",
        "A type of written communication format",
        "Internal storytelling training for employees",
      ],
      correct_answer: 1,
    },
    {
      question: "What is two-way communication in internal comms?",
      options: [
        "Using two different communication channels simultaneously",
        "Communication that enables genuine dialogue — not just broadcasting messages but actively creating channels for employee feedback and response",
        "Sending the same message via email and intranet",
        "Two separate communications programmes for two audiences",
      ],
      correct_answer: 1,
    },
    {
      question: "What is line manager communications?",
      options: [
        "Communications sent by email only",
        "Using direct managers as a key channel for cascading organisational information to their teams and gathering employee feedback",
        "A type of formal management reporting",
        "Communications software used by line managers",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an editorial calendar in internal communications?",
      options: [
        "A newspaper editorial schedule",
        "A planned schedule of internal communications content, campaigns, and messages aligned to organisational priorities and events",
        "A content calendar for press releases",
        "A calendar managed by the communications director",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the four-level model of internal communication impact?",
      options: [
        "Aware, understand, feel, act — the four stages through which communications move employees from receiving information to taking desired action",
        "Receive, read, agree, share",
        "Inform, engage, align, retain",
        "Listen, understand, decide, implement",
      ],
      correct_answer: 0,
    },
    {
      question: "What is listening in organisations and why does it matter?",
      options: [
        "Employee surveys are sufficient for organisational listening",
        "Actively gathering and responding to employee insights, concerns, and ideas, creating a culture of genuine two-way dialogue that improves engagement and outcomes",
        "Listening is the responsibility of HR not communications",
        "Listening programmes are only needed during a crisis",
      ],
      correct_answer: 1,
    },
    {
      question: "What is segmented internal communications?",
      options: [
        "Fragmenting communications into separate silos",
        "Tailoring internal communications content, format, and channels to the specific needs and contexts of different employee groups",
        "Sending targeted communications to senior management only",
        "Using separate email distribution lists for different teams",
      ],
      correct_answer: 1,
    },
    {
      question: "What is measurement in internal communications?",
      options: [
        "Counting the number of emails sent",
        "Tracking metrics such as engagement rates, comprehension, employee sentiment, and business outcomes to evaluate effectiveness and improve strategy",
        "Measuring the size of the communications team",
        "Reporting communications activity in the annual report",
      ],
      correct_answer: 1,
    },
  ],
  6: [
    {
      question: "What is PR measurement and evaluation?",
      options: [
        "Counting press clippings",
        "The process of assessing the impact and effectiveness of PR activities against defined objectives, using quantitative and qualitative methods",
        "Calculating the advertising value equivalent of coverage",
        "Annual reporting of all PR activities to management",
      ],
      correct_answer: 1,
    },
    {
      question: "What is Barcelona Principles 3.0?",
      options: [
        "European PR regulations from Barcelona",
        "A globally recognised framework of seven principles guiding the measurement and evaluation of PR and communications",
        "A PR agency performance standard",
        "A model for measuring social media impact only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is AVE (Advertising Value Equivalent) and why is it criticised?",
      options: [
        "A valid measure of PR value recommended by AMEC",
        "A discredited metric comparing editorial coverage to the cost of equivalent advertising space — criticised for not measuring communication effectiveness or outcomes",
        "A measure of the total value of PR activity for an organisation",
        "A reliable indicator of media coverage quality",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between outputs, outtakes, and outcomes in PR measurement?",
      options: [
        "They are three names for the same thing",
        "Outputs are PR activities produced (press releases, events); outtakes are what audiences take from them (awareness, attitude); outcomes are changes in behaviour",
        "Outputs measure quality; outtakes measure quantity; outcomes measure impact",
        "Outcomes are always financial metrics",
      ],
      correct_answer: 1,
    },
    {
      question: "What is share of voice?",
      options: [
        "The proportion of a brand's paid media spend",
        "The proportion of media coverage or online conversations a brand occupies compared to its competitors in a defined time period",
        "The loudness of a brand's communication",
        "The number of media outlets covering a brand",
      ],
      correct_answer: 1,
    },
    {
      question: "What is media content analysis?",
      options: [
        "Analysing the format of media content",
        "A systematic research method examining media coverage to assess volume, tone, key messages, spokesperson visibility, and issue prominence",
        "Reading through all press clippings manually",
        "A financial analysis of media spend",
      ],
      correct_answer: 1,
    },
    {
      question: "What is sentiment analysis in PR measurement?",
      options: [
        "Analysing the emotions of PR team members",
        "Assessing the tone (positive, negative, neutral) of media coverage or online conversations about a brand or topic",
        "Measuring how much customers like a brand",
        "An AI technique for writing press releases",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the Integrated Evaluation Framework (IEF)?",
      options: [
        "A financial framework for integrating PR budgets",
        "A structured model from AMEC for planning and evaluating PR with outputs, outtakes, and outcomes at organisational, intermediary, and target audience levels",
        "A model for integrating digital and traditional PR measurement",
        "A social media-specific evaluation tool",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a communication objective and why must it be measurable?",
      options: [
        "A vague aspiration for a PR campaign",
        "A specific, time-bound goal for a PR activity against which effectiveness can be assessed — being measurable enables evidence of impact",
        "The number of press releases to be issued",
        "A strategic goal set by the CEO",
      ],
      correct_answer: 1,
    },
    {
      question: "What is message cut-through?",
      options: [
        "Cutting irrelevant messages from a press release",
        "The extent to which target audiences have received, understood, and retained the key messages of a PR campaign",
        "The number of times a press release was republished",
        "The number of unique media placements secured",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a benchmark in PR measurement?",
      options: [
        "A standard set by a PR agency",
        "A reference point — a baseline or competitor metric — used to compare performance and assess progress over time",
        "The minimum target set for a PR campaign",
        "A financial comparison between PR campaigns",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between reach and impressions?",
      options: [
        "They are the same metric",
        "Reach is the number of unique individuals who see content; impressions is the total number of times content is displayed (including multiple views by the same person)",
        "Impressions measures quality; reach measures quantity",
        "Reach only applies to paid media; impressions to earned media",
      ],
      correct_answer: 1,
    },
    {
      question: "What is digital analytics in PR?",
      options: [
        "Analytical skills required by digital PR professionals",
        "Using web analytics tools (Google Analytics, social platform data) to measure online PR impact including traffic, referrals, and engagement",
        "Analytics dashboards created by IT for the PR team",
        "PR measurement of digital advertising campaigns",
      ],
      correct_answer: 1,
    },
    {
      question: "What is tone of coverage?",
      options: [
        "The writing style of a journalist",
        "Whether media coverage of an organisation is positive, negative, or neutral in its portrayal",
        "The volume level of broadcast coverage",
        "The frequency of coverage in different time periods",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a PR ROI?",
      options: [
        "The return on investment of individual press releases",
        "The relationship between the value created by PR activities (change in awareness, behaviour, or business outcomes) and the cost of those activities",
        "Always impossible to measure accurately",
        "The same as an AVE calculation",
      ],
      correct_answer: 1,
    },
    {
      question: "What are vanity metrics in PR?",
      options: [
        "Metrics about a brand's visual identity",
        "Metrics that look impressive (follower counts, total impressions) but don't necessarily indicate real business impact or communication effectiveness",
        "Financial metrics tracked by the PR team",
        "Metrics used only by inexperienced PR practitioners",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a balanced measurement framework?",
      options: [
        "An equal split between quantitative and qualitative metrics",
        "A measurement approach combining multiple metrics across outputs, outtakes, and outcomes to provide a holistic picture of PR effectiveness",
        "Measuring equal amounts of traditional and digital PR",
        "A framework with an equal number of KPIs for each PR activity",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the role of pre-campaign research in PR evaluation?",
      options: [
        "Research is only needed after a campaign",
        "Establishing baseline measurements (awareness, attitude, behaviour) before a campaign to enable meaningful comparison after and assessment of change",
        "Writing the campaign brief",
        "Conducting competitor analysis before a campaign",
      ],
      correct_answer: 1,
    },
    {
      question: "What is quality of coverage?",
      options: [
        "Coverage in high-quality print publications only",
        "An assessment of media coverage based on factors such as prominence, tone, message inclusion, spokesperson presence, and audience relevance",
        "The number of words in a media article",
        "Coverage that uses direct quotes from the press release",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a dashboard in PR measurement?",
      options: [
        "The performance metrics of a PR agency",
        "A visual display of key PR metrics and KPIs providing a real-time overview of communication performance",
        "The control panel of a media monitoring tool",
        "A financial management tool for PR budgets",
      ],
      correct_answer: 1,
    },
  ],
  7: [
    {
      question: "What is copywriting in PR?",
      options: [
        "Registering a copyright for PR materials",
        "The craft of writing clear, compelling, and purposeful copy for PR materials including press releases, speeches, blogs, and social media content",
        "Writing advertising slogans only",
        "Editing other people's writing for PR purposes",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the inverted pyramid structure in press release writing?",
      options: [
        "A structure placing the least important information at the top",
        "A journalistic structure putting the most newsworthy information first, followed by important details, and background information last",
        "A pyramid template for PR reports",
        "A visual diagram used in press kits",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of the first paragraph of a press release?",
      options: [
        "To introduce the organisation's background",
        "To answer the who, what, when, where, and why of the story — giving a journalist everything they need to decide if it is worth covering",
        "To include all supporting quotes and statistics",
        "To list all media contacts and boilerplate information",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a boilerplate in a press release?",
      options: [
        "A legal disclaimer required by law",
        "A standard paragraph at the end of a press release providing a brief description of the organisation for journalists who are unfamiliar with it",
        "A template for standard press releases",
        "The headline of a press release",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a quote in a press release and what makes it effective?",
      options: [
        "A direct copy of a news story",
        "A statement attributed to a spokesperson that adds human voice, opinion, or insight — effective quotes are specific, authentic, and not just a rephrasing of facts",
        "Any statistic cited in the release",
        "A testimonial from a customer or partner",
      ],
      correct_answer: 1,
    },
    {
      question: "What is plain language in communications?",
      options: [
        "Using basic vocabulary only",
        "Writing in clear, direct, and accessible language that the intended audience can understand easily without unnecessary jargon",
        "Writing only short sentences",
        "Avoiding technical content in communications",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of a headline in a press release or PR content?",
      options: [
        "To be clever and creative above all",
        "To immediately communicate the most important and newsworthy point, compelling the journalist to read further",
        "To include the client's name and date",
        "To summarise all the key messages of the release",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a speech in PR and what are its key components?",
      options: [
        "An unscripted improvised presentation",
        "Prepared remarks delivered by a spokesperson or leader — effective speeches have a clear structure, strong opening, key messages, supporting stories, and a memorable close",
        "Any verbal communication by a PR professional",
        "A media briefing document",
      ],
      correct_answer: 1,
    },
    {
      question: "What is storytelling in PR?",
      options: [
        "Writing fictional stories about clients",
        "Using narrative structure — character, conflict, resolution — to make communications more engaging, memorable, and persuasive",
        "A type of content marketing",
        "Telling brand origin stories only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the role of data and statistics in PR writing?",
      options: [
        "Data makes all communications more complex",
        "Data provides credibility and evidence for claims, making stories more compelling and relevant — but must be accurate and from credible sources",
        "Statistics should always be avoided in PR content",
        "Data is only useful in internal reports",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an op-ed in PR?",
      options: [
        "An advertising feature",
        "An authored opinion article (opposite the editorial page) where an expert or leader shares a viewpoint on a relevant issue, a key tool for thought leadership",
        "An official company press release",
        "An editorial published by a media outlet",
      ],
      correct_answer: 1,
    },
    {
      question: "What is tone in PR writing?",
      options: [
        "The technical quality of an audio broadcast",
        "The attitude or personality conveyed through writing style — tone must match the audience, channel, and context of the communication",
        "The formal register required for all PR writing",
        "The length and structure of a written piece",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of an executive biography in PR?",
      options: [
        "A legal record of an executive's career",
        "A written profile of a senior leader used in press releases, speaker notes, and media materials to establish credibility and context",
        "An internal HR document",
        "A social media profile for LinkedIn",
      ],
      correct_answer: 1,
    },
    {
      question: "What is active voice and why is it preferred in PR writing?",
      options: [
        "Active voice uses passive verb forms",
        "In active voice, the subject performs the action — preferred in PR writing because it is more direct, engaging, and clear than passive voice",
        "Passive voice is preferred in all PR writing",
        "Active voice is only used in informal communications",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a key message in PR?",
      options: [
        "The subject line of a press release",
        "A core, memorable statement that encapsulates the most important point an organisation wants audiences to retain from a communication",
        "A bullet point list of facts",
        "A quote from a media article",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between features writing and news writing?",
      options: [
        "They are the same style of writing",
        "News writing is concise and fact-based following the inverted pyramid; features writing is longer, more narrative, exploring depth and context",
        "Feature writing is always for an organisation's owned media only",
        "News writing uses quotes; features do not",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an embargo notice on a press release?",
      options: [
        "A legal ban on publishing the information",
        "A statement on a press release instructing journalists not to publish the information before a specified date and time",
        "An internal note to the PR team about timing",
        "A confidentiality requirement from the client",
      ],
      correct_answer: 1,
    },
    {
      question: "What is audience-centric writing?",
      options: [
        "Writing that focuses on the writer's expertise",
        "Writing that puts the audience's needs, interests, and context at the centre, crafting content that is relevant and valuable to them specifically",
        "Writing that avoids technical language",
        "Writing that includes audience research data",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the role of subheadings in longer PR content?",
      options: [
        "To make the document look longer",
        "To guide readers through the content, improve scannability, and help busy journalists or stakeholders find the most relevant sections quickly",
        "Subheadings are only used in academic writing",
        "To highlight the most important quotes in the document",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a call to action (CTA) in PR content?",
      options: [
        "A request for journalists to cover the story",
        "A clear instruction telling the audience what to do next — visit a website, sign up, contact an organisation — guiding them toward a desired behaviour",
        "A demand for a response from a stakeholder",
        "A headline technique for press releases",
      ],
      correct_answer: 1,
    },
  ],
  8: [
    {
      question: "What is media training?",
      options: [
        "Training to become a journalist",
        "Coaching designed to prepare spokespeople to communicate effectively and confidently with journalists in interviews and press conferences",
        "A media studies qualification",
        "Training for the PR team on how to write press releases",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the purpose of bridging in a media interview?",
      options: [
        "To bridge two separate interview questions",
        "A technique for transitioning from a difficult or off-message question back to a key message — e.g. 'That's an important point, but what I'd really like to emphasise is...'",
        "A way to bridge the gap between PR and journalism",
        "Connecting two media appearances together",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the A-B-C technique in message delivery?",
      options: [
        "Always Be Confident",
        "Acknowledge the question, Bridge to your message, and Communicate your key message",
        "Accuracy, Balance, and Clarity in interviews",
        "Answer, Breathe, Continue — a technique for managing nerves",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a blocking technique in media training?",
      options: [
        "Blocking journalists from asking questions",
        "A communication technique for respectfully declining to be drawn into unproductive territory — redirecting without being evasive",
        "Refusing to answer any questions on a sensitive topic",
        "A technique for blocking negative media stories",
      ],
      correct_answer: 1,
    },
    {
      question: "What is key message development?",
      options: [
        "Writing the key messages section of a press release",
        "The process of crafting clear, concise, and memorable messages that encapsulate what an organisation most wants target audiences to understand and remember",
        "Developing internal messaging for employees",
        "Creating social media key messages only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between a live and pre-recorded broadcast interview?",
      options: [
        "There is no meaningful difference",
        "A live interview has no editorial safety net — errors and off-message moments are broadcast immediately; pre-recorded allows editing",
        "Pre-recorded interviews are more credible than live",
        "Live interviews are only for TV; pre-recorded for radio",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a press conference?",
      options: [
        "A private meeting with a single journalist",
        "A formal event where an organisation addresses multiple journalists simultaneously to announce news and answer questions",
        "An annual media industry conference",
        "A conference call with international media",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the preparation a spokesperson should do before a media interview?",
      options: [
        "Memorise the company website",
        "Research the journalist and outlet, clarify the key messages, anticipate difficult questions, and practise bridging techniques",
        "Read all previous media coverage of the organisation",
        "Prepare a full written script to read verbatim",
      ],
      correct_answer: 1,
    },
    {
      question: "What is 'off the record' vs. 'on background' in media interactions?",
      options: [
        "They mean the same thing",
        "Off the record means information cannot be used at all; on background means it can inform reporting but not be attributed directly to the source",
        "Off the record means information can be paraphrased; on background means it can be quoted directly",
        "Neither term has a consistent meaning in practice",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a hostile interview?",
      options: [
        "An interview conducted by an unfriendly journalist",
        "An interview where the journalist challenges the spokesperson with difficult, confrontational, or probing questions — requiring calmness, preparation, and message discipline",
        "An interview that has been legally challenged",
        "An interview that results in negative coverage",
      ],
      correct_answer: 1,
    },
    {
      question: "What body language considerations are important in broadcast media training?",
      options: [
        "Body language is irrelevant in radio interviews",
        "Eye contact, posture, facial expression, and managing nervous gestures significantly affect how audiences perceive a spokesperson's credibility and confidence",
        "Using energetic gestures always improves credibility",
        "Only dressing appropriately matters in TV interviews",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the 'three key messages' principle?",
      options: [
        "Preparing exactly three messages for every interview",
        "The guideline that an interview preparation should focus on no more than three core messages, as humans retain limited information and more leads to dilution",
        "A rule requiring three quotes in every press release",
        "A model for planning three-question media pitches",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between proactive and reactive media engagement?",
      options: [
        "Proactive is better than reactive in all cases",
        "Proactive media engagement initiates contact to generate coverage; reactive media engagement responds to journalists' enquiries about breaking news or issues",
        "Reactive means waiting for journalists to call; proactive means ignoring media enquiries",
        "Proactive engagement is only for positive stories",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a doorstep interview?",
      options: [
        "An interview held at the organisation's front door",
        "An unplanned interview by journalists who approach a spokesperson without prior arrangement, typically during a controversy — requiring cool-headed response",
        "A friendly interview conducted outside a building",
        "An interview arranged at the last minute",
      ],
      correct_answer: 1,
    },
    {
      question: "Why should spokespeople avoid saying 'no comment' in media interviews?",
      options: [
        "It is legally prohibited in most countries",
        "It creates the impression of guilt or evasion, inviting speculation and greater scrutiny — better to acknowledge what can be said and explain why some information cannot be shared",
        "It is against journalism ethics",
        "Because it rarely appears in coverage",
      ],
      correct_answer: 1,
    },
    {
      question: "What is message discipline in media training?",
      options: [
        "Following the exact script provided by the PR team",
        "Consistently communicating the same core messages regardless of how questions are framed or how many times they are asked",
        "Avoiding any deviation from pre-approved talking points",
        "Only answering questions that are on-message",
      ],
      correct_answer: 1,
    },
    {
      question: "What is an under-embargo briefing used for?",
      options: [
        "A briefing held in secret",
        "Providing journalists with advance information under embargo so they can prepare informed coverage ready to publish on a specified date",
        "Briefing the media after a crisis",
        "Sharing confidential information with key journalists only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is interview simulation in media training?",
      options: [
        "Using AI to simulate media interviews",
        "Practising responding to interview questions in a realistic, filmed environment to build skills and identify areas for improvement",
        "A theoretical exercise using past interview transcripts",
        "Preparing for an interview by reviewing past footage of the spokesperson",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the role of the PR team on the day of a major interview?",
      options: [
        "To do the interview instead of the spokesperson",
        "To brief the spokesperson, monitor the interview, manage logistics, prepare for follow-up questions, and coordinate post-interview responses and sharing",
        "To write the spokesperson's answers in advance",
        "To cancel the interview if any risks are identified",
      ],
      correct_answer: 1,
    },
    {
      question: "What is message mapping?",
      options: [
        "Creating a geographic map of media targets",
        "A structured process of developing key messages with supporting proof points and examples for specific audiences, ensuring consistent and credible communication",
        "A visual map of all an organisation's communications channels",
        "Mapping messages to different PR campaign phases",
      ],
      correct_answer: 1,
    },
  ],
  9: [
    {
      question: "What is corporate communications?",
      options: [
        "Communications in the IT department",
        "The management of all communications activities — internal and external — that build and protect an organisation's reputation and relationships",
        "PR exclusively for corporations vs. non-profits",
        "Communications between corporate departments",
      ],
      correct_answer: 1,
    },
    {
      question: "What is brand communications?",
      options: [
        "Advertising and marketing for products only",
        "All communications activities that shape how target audiences perceive and feel about a brand, encompassing PR, marketing, and content",
        "The visual identity and logo design of a brand",
        "A type of commercial advertising",
      ],
      correct_answer: 1,
    },
    {
      question: "What is corporate identity?",
      options: [
        "The legal registration of a company name",
        "The visual and verbal expression of an organisation's character — including logo, colours, tone of voice, and the way it presents itself consistently",
        "The CEO's personal brand",
        "The company's corporate governance policies",
      ],
      correct_answer: 1,
    },
    {
      question: "What is brand reputation?",
      options: [
        "How a brand is rated on review sites",
        "The overall perception that key stakeholders hold about a brand, shaped by their experiences, media coverage, word of mouth, and communications",
        "The brand's financial valuation",
        "How many awards a brand has won",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between brand image and brand identity?",
      options: [
        "They are the same thing",
        "Brand identity is what an organisation intentionally projects; brand image is how it is actually perceived by audiences — which may differ",
        "Brand image is visual; brand identity is verbal",
        "Brand identity is external; brand image is internal",
      ],
      correct_answer: 1,
    },
    {
      question: "What is purpose-led communications?",
      options: [
        "Defining the purpose of each press release",
        "Communications that articulate and demonstrate a brand's deeper purpose — beyond profit — and its role in society, increasingly central to reputation",
        "A communications strategy focused on business objectives",
        "Communications for non-profit organisations only",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a brand crisis?",
      options: [
        "A financial crisis for the brand",
        "A significant event or revelation that severely damages how key stakeholders perceive a brand, threatening its reputation and business",
        "Any negative news story about a brand",
        "A failed rebranding exercise",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the role of transparency in corporate communications?",
      options: [
        "Sharing all internal information with the public",
        "Being open, honest, and accountable in communications builds stakeholder trust, while concealment typically leads to greater reputational harm",
        "Transparency is only required by law",
        "Transparency means avoiding all confidential information in communications",
      ],
      correct_answer: 1,
    },
    {
      question: "What is ESG communications?",
      options: [
        "Electronic, Social, and Governance communications",
        "Communicating an organisation's approach to Environmental, Social, and Governance issues — increasingly critical to investor, media, and public scrutiny",
        "A type of financial reporting",
        "Emissions standards for global communications",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a brand narrative?",
      options: [
        "A case study about a brand",
        "The overarching story a brand tells about itself — its history, purpose, values, and vision — that creates emotional connection and differentiation",
        "A list of brand messaging guidelines",
        "The brand's advertising copy",
      ],
      correct_answer: 1,
    },
    {
      question: "What is corporate storytelling?",
      options: [
        "The history section of a corporate website",
        "Using narrative techniques to make corporate communications more human, engaging, and memorable — bringing purpose, strategy, and values to life",
        "Writing case studies and testimonials",
        "A type of content marketing for B2B brands",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between reputation and brand?",
      options: [
        "They are identical in corporate communications",
        "Brand is how an organisation presents itself; reputation is how others actually perceive it — reputation is earned, brand is projected",
        "Reputation is external; brand is internal",
        "Brand is more important than reputation for large companies",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the role of the communications function in corporate governance?",
      options: [
        "Communications has no role in governance",
        "Communications ensures transparency, stakeholder accountability, and clear reporting on governance matters, supporting trust with investors, regulators, and the public",
        "Communications manages investor relations only",
        "Communications manages the board of directors' calendar",
      ],
      correct_answer: 1,
    },
    {
      question: "What is brand architecture?",
      options: [
        "The design of a brand's visual identity system",
        "A strategic framework defining how an organisation's brands relate to and are distinguished from one another — e.g. branded house, house of brands",
        "The technical architecture of a brand's website",
        "The structure of a brand's communications team",
      ],
      correct_answer: 1,
    },
    {
      question: "What is issues monitoring in corporate communications?",
      options: [
        "Monitoring employee performance issues",
        "Systematically tracking emerging policy, social, competitive, and reputational issues that could affect the organisation's operating environment",
        "A type of crisis management activity",
        "Monitoring the organisation's financial issues",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the stakeholder theory relevance to corporate communications?",
      options: [
        "Only shareholders matter in corporate communications",
        "Corporations have obligations to all stakeholder groups (employees, customers, communities, investors) and communications must address all of their legitimate interests",
        "Stakeholder theory only applies to non-profits",
        "Stakeholder communications is a government relations function",
      ],
      correct_answer: 1,
    },
    {
      question: "What is authenticity in brand communications?",
      options: [
        "Using only truthful statistics in communications",
        "Ensuring communications reflect genuine values and behaviour — audiences are increasingly adept at identifying inconsistency between what a brand says and does",
        "Avoiding exaggeration in advertising only",
        "Using candid photographs rather than stock images",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a corporate social responsibility (CSR) report?",
      options: [
        "A legal requirement for all companies",
        "An annual document disclosing an organisation's social, environmental, and governance activities and performance — a key transparency and trust-building tool",
        "A charity fundraising campaign report",
        "An internal HR wellbeing report",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the relationship between PR and marketing communications?",
      options: [
        "They are identical functions",
        "PR focuses on earned media, reputation, and stakeholder relationships; marketing communications focuses on driving commercial outcomes — the two increasingly converge",
        "Marketing is more important than PR in all organisations",
        "PR and marketing work in completely separate silos",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the concept of corporate character?",
      options: [
        "The personality of the CEO",
        "The distinctive values, culture, and principles that make an organisation who it is — expressed through its decisions, behaviours, and communications",
        "The brand's visual style",
        "The organisation's corporate governance framework",
      ],
      correct_answer: 1,
    },
  ],
  10: [
    {
      question: "What are the main ethical principles guiding PR practice?",
      options: [
        "Client confidentiality and commercial success",
        "Honesty, transparency, fairness, respect, and responsibility to the public interest — enshrined in codes such as those of the CIPR and PRCA",
        "Following client instructions regardless of ethics",
        "Achieving results at any cost",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the CIPR (Chartered Institute of Public Relations)?",
      options: [
        "A global PR industry certification body based in the USA",
        "The UK's professional body for PR practitioners, setting ethical standards, providing qualifications, and representing the profession",
        "A government body regulating PR",
        "An EU PR trade association",
      ],
      correct_answer: 1,
    },
    {
      question: "What is astroturfing in PR ethics?",
      options: [
        "Using artificial grass at PR events",
        "The deceptive practice of making a sponsored or coordinated campaign appear to be a spontaneous grassroots movement",
        "Using artificial intelligence for PR writing",
        "Creating fake grass-roots communities on social media",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the difference between lobbying and public affairs?",
      options: [
        "They are identical activities",
        "Lobbying is the direct attempt to influence legislation or regulation; public affairs encompasses a broader range of activities building relationships with policymakers and monitoring policy",
        "Public affairs is lobbying conducted only by public companies",
        "Lobbying is legal; public affairs is not always legal",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the PR industry's responsibility to society?",
      options: [
        "PR practitioners have no responsibility beyond serving clients",
        "PR practitioners have a responsibility to serve not only clients but also the public interest, ensuring that communications are truthful and do not deceive or harm society",
        "PR's only responsibility is to protect client reputation",
        "Responsibility to society is voluntary for PR agencies",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the issue of 'spin' in PR and why is it problematic?",
      options: [
        "Spin is a legitimate and effective PR technique",
        "Spin refers to manipulative or misleading PR that prioritises favourable presentation over truth — it erodes public trust and the credibility of the profession",
        "Spin is the same as good media relations",
        "Spin is only a problem in political PR",
      ],
      correct_answer: 1,
    },
    {
      question: "What is a conflict of interest in PR practice?",
      options: [
        "When a client and agency disagree",
        "When a PR practitioner has competing interests that could compromise their objectivity or loyalty to a client — which must be declared and managed",
        "Competition between two PR agencies for the same client",
        "A PR practitioner working for two different industries",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the future of PR in the context of AI?",
      options: [
        "AI will replace all PR professionals",
        "AI will automate routine tasks (monitoring, reporting, drafting), requiring PR professionals to focus on strategic thinking, relationship building, and ethical judgment",
        "AI has no significant impact on PR",
        "AI will only impact digital PR",
      ],
      correct_answer: 1,
    },
    {
      question: "What is fake news and its impact on PR practice?",
      options: [
        "A recent invention with no historical precedent",
        "Deliberately false or misleading information spread as news, challenging PR professionals to protect reputation in an environment of diminished trust in information",
        "Only a problem in political communications",
        "Fake news only affects media relations",
      ],
      correct_answer: 1,
    },
    {
      question: "What is diversity and inclusion in PR?",
      options: [
        "Hiring diverse staff in PR agencies",
        "A commitment to ensuring PR communications represent diverse communities authentically and that the profession itself reflects the diversity of society",
        "A legal requirement for PR content",
        "A type of CSR communications activity",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the global PR industry's approach to regulation?",
      options: [
        "PR is tightly regulated by government worldwide",
        "PR is largely self-regulated through professional bodies (CIPR, PRCA, PRSA) with codes of conduct — though lobbying and advertising adjacent to PR face more formal regulation",
        "All PR activity requires government approval",
        "PR is unregulated in most countries",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the role of PR in a democratic society?",
      options: [
        "PR undermines democracy by manipulating public opinion",
        "PR contributes to democracy by enabling organisations to participate in public debate, providing information, and helping citizens make informed decisions — when practiced ethically",
        "PR has no role in democratic processes",
        "PR is only beneficial in commercial contexts",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the growth of purpose-driven PR?",
      options: [
        "PR campaigns for non-profit organisations only",
        "An increasing expectation that organisations stand for something beyond profit and that communications reflect genuine purpose and values — driven by changing stakeholder expectations",
        "A passing trend in PR communications",
        "Communications that focus only on financial purpose",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the impact of social media influencers on traditional PR?",
      options: [
        "Influencers have replaced traditional PR entirely",
        "Influencers provide new channels for reach and authenticity, requiring PR to develop influencer relations as a strategic discipline alongside traditional media relations",
        "Influencers are not relevant to PR strategy",
        "Influencer relations is purely a marketing function",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the trend toward data-driven PR?",
      options: [
        "Using only quantitative data in PR measurement",
        "The shift toward using audience insights, behavioural data, and analytics to inform PR strategy, personalise pitches, and demonstrate measurable business impact",
        "Using data only to satisfy client reporting requirements",
        "A trend affecting only large PR agencies",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the concept of 'earned trust' in PR?",
      options: [
        "Trust earned by paying media outlets",
        "The idea that an organisation's trustworthiness is demonstrated through consistent behaviour and transparency over time — not simply claimed through communications",
        "Trust earned through years of PR investment",
        "A trust metric measured by media coverage volume",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the professionalisation of PR?",
      options: [
        "All PR practitioners must have a university degree",
        "The ongoing development of PR as a recognised profession with formal qualifications, ethical codes, and evidence-based practice rather than purely an intuitive craft",
        "A process for registering as a PR practitioner",
        "The formal accreditation of PR agencies by government bodies",
      ],
      correct_answer: 1,
    },
    {
      question: "What is sustainability communications in PR?",
      options: [
        "Communications about sustainable materials only",
        "Communicating an organisation's environmental and sustainability commitments, actions, and progress in a credible, transparent, and evidence-based way",
        "A type of CSR report design",
        "Communications only relevant for energy and manufacturing companies",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the challenge of measuring PR impact in the digital age?",
      options: [
        "Digital makes measurement impossible",
        "While digital provides abundant data, the challenge is attributing business outcomes to PR specifically, choosing meaningful metrics over vanity metrics, and linking to organisational value",
        "Digital has made PR measurement much simpler",
        "Measurement in digital PR is standardised across all platforms",
      ],
      correct_answer: 1,
    },
    {
      question: "What is the 'licence to operate' concept in PR?",
      options: [
        "A legal permit required by PR agencies",
        "The implicit social permission an organisation needs from its stakeholders and society to conduct its activities — maintained through ethical behaviour and effective communications",
        "A formal agreement between an organisation and its regulator",
        "Permission granted by the government to PR professionals",
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
