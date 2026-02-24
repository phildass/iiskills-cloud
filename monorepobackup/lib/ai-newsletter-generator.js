/**
 * AI-Powered Newsletter Generator for "Skilling" Newsletter
 * 
 * Generates engaging, Millennial/Gen Z-focused newsletter content
 * from course data using OpenAI API
 */

/**
 * Generate newsletter content using AI
 * 
 * @param {Object} course - Course data
 * @param {number} editionNumber - Newsletter edition number
 * @returns {Promise<Object>} Generated newsletter content
 */
export async function generateNewsletterContent(course, editionNumber) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    console.warn('OpenAI API key not configured. Using fallback generator.');
    return generateFallbackContent(course, editionNumber);
  }

  try {
    const prompt = buildPrompt(course, editionNumber);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a creative newsletter writer for "Skilling" by iiskills.cloud. 
Your audience is Millennials and Gen Z who love learning and leveling up their skills.
Write in an energetic, conversational, casual tone. Use emojis, fun headings, and exciting language.
Make learning sound fun, social, and career-positive. Never be dull or academic.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const aiContent = data.choices[0].message.content;
    
    // Parse the AI response
    const parsedContent = parseAIResponse(aiContent, course, editionNumber);
    
    return {
      ...parsedContent,
      ai_metadata: {
        model: 'gpt-4o-mini',
        prompt_tokens: data.usage?.prompt_tokens,
        completion_tokens: data.usage?.completion_tokens,
        total_tokens: data.usage?.total_tokens,
        generated_at: new Date().toISOString(),
      }
    };
    
  } catch (error) {
    console.error('AI generation error:', error);
    console.log('Falling back to template-based generation');
    return generateFallbackContent(course, editionNumber);
  }
}

/**
 * Build the AI prompt from course data
 */
function buildPrompt(course, editionNumber) {
  return `Create an engaging newsletter edition for "Skilling" newsletter #${editionNumber}.

NEW COURSE DETAILS:
Title: ${course.title}
Description: ${course.short_description || course.full_description}
${course.highlights?.length ? `Highlights: ${course.highlights.join(', ')}` : ''}
${course.duration ? `Duration: ${course.duration}` : ''}
${course.target_audience ? `For: ${course.target_audience}` : ''}
${course.topics_skills?.length ? `Topics/Skills: ${course.topics_skills.join(', ')}` : ''}

Generate the following sections in this EXACT format:

TITLE: [Catchy newsletter title with emojis - max 60 chars]

SUBJECT: [Email subject line that makes people excited to open - max 50 chars]

INTRO: [2-3 energetic sentences about why this course is awesome and why readers should care. Use "you" and make it personal. Include 2-3 relevant emojis.]

SUMMARY: [3-4 sentences explaining what makes this course special. Focus on benefits, not features. Make it sound exciting and achievable. Use casual, conversational language.]

HIGHLIGHTS:
• [Benefit 1 - why this matters to your career/life] 💪
• [Benefit 2 - what you'll actually learn to DO]
• [Benefit 3 - the transformation you'll experience]

FUN_FACT: [A "Did You Know?" or "Pro Tip" related to the course topic. Make it surprising or useful. 1-2 sentences. Include emoji.]

CTA: [Call-to-action text that's exciting and creates urgency. Use emojis. Max 10 words.]

EMOJI_BLOCK: [A fun, creative emoji combination that represents the course vibe - 5-8 emojis]

Remember:
- Keep it SHORT and punchy
- Use emojis strategically (not too many!)
- Make learning sound exciting, not intimidating
- Focus on what readers will GAIN
- Be conversational like you're texting a friend
- Avoid corporate jargon
- Make them want to click "Enroll NOW!"`;
}

/**
 * Parse AI response into structured content
 */
function parseAIResponse(aiText, course, editionNumber) {
  const sections = {};
  
  // Extract sections using regex
  const titleMatch = aiText.match(/TITLE:\s*(.+?)(?=\n|$)/i);
  const subjectMatch = aiText.match(/SUBJECT:\s*(.+?)(?=\n|$)/i);
  const introMatch = aiText.match(/INTRO:\s*(.+?)(?=\n\n|SUMMARY)/is);
  const summaryMatch = aiText.match(/SUMMARY:\s*(.+?)(?=\n\n|HIGHLIGHTS)/is);
  const highlightsMatch = aiText.match(/HIGHLIGHTS:\s*(.+?)(?=\n\n|FUN_FACT)/is);
  const funFactMatch = aiText.match(/FUN_FACT:\s*(.+?)(?=\n\n|CTA)/is);
  const ctaMatch = aiText.match(/CTA:\s*(.+?)(?=\n|$)/is);
  const emojiMatch = aiText.match(/EMOJI_BLOCK:\s*(.+?)(?=\n|$)/is);
  
  sections.title = titleMatch ? titleMatch[1].trim() : `Skilling #${editionNumber}: ${course.title} 🚀`;
  sections.subject_line = subjectMatch ? subjectMatch[1].trim() : `🎯 New Skill Alert: ${course.title}`;
  sections.intro_text = introMatch ? introMatch[1].trim() : `Hey there! 👋 We just dropped something awesome...`;
  sections.course_summary = summaryMatch ? summaryMatch[1].trim() : course.short_description;
  sections.highlights_section = highlightsMatch ? highlightsMatch[1].trim() : formatHighlights(course.highlights);
  sections.fun_fact = funFactMatch ? funFactMatch[1].trim() : `💡 Pro Tip: Start learning today!`;
  sections.cta_text = ctaMatch ? ctaMatch[1].trim() : `🚀 Ready to level up? Tap to enroll!`;
  sections.emoji_block = emojiMatch ? emojiMatch[1].trim() : `🎯 📚 💪 ✨ 🚀`;
  
  return sections;
}

/**
 * Format course highlights into newsletter format
 */
function formatHighlights(highlights) {
  if (!highlights || highlights.length === 0) {
    return '• Amazing content to boost your skills 💪\n• Learn at your own pace\n• Get certified! 🎓';
  }
  
  return highlights.slice(0, 5).map(h => `• ${h}`).join('\n');
}

/**
 * Fallback content generation (when AI is unavailable)
 */
function generateFallbackContent(course, editionNumber) {
  const emojisByCategory = {
    'Data Science': '📊 🤖 💻 📈 🔬',
    'Marketing': '📢 💡 🎯 📱 ✨',
    'Development': '💻 🚀 ⚡ 🎨 🔧',
    'Design': '🎨 ✨ 🖌️ 💡 🌈',
    'Business': '💼 📊 💰 🎯 📈',
    'default': '🎯 📚 💪 ✨ 🚀'
  };
  
  const emoji = emojisByCategory[course.category] || emojisByCategory.default;
  
  return {
    title: `Skilling #${editionNumber}: ${course.title} Just Dropped! 🚀`,
    subject_line: `🎯 You're gonna love this: ${course.title}`,
    intro_text: `Hey there, skill-seeker! 👋 We just launched something you've been waiting for. ${course.title} is here, and it's exactly what you need to level up! 🔥`,
    course_summary: course.short_description || course.full_description || 
      `This course is packed with everything you need to master ${course.title}. Whether you're starting fresh or leveling up, you'll walk away with real skills you can use immediately. No fluff, just results! 💪`,
    highlights_section: formatHighlights(course.highlights),
    fun_fact: `💡 Did you know? People who invest in upskilling are 3x more likely to advance in their careers. That could be you!`,
    cta_text: `🚀 Ready to level up? Let's GO!`,
    emoji_block: emoji,
    ai_metadata: {
      model: 'fallback-template',
      generated_at: new Date().toISOString(),
    }
  };
}

/**
 * Generate HTML email template
 */
export function generateEmailHTML(content, course) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #2D3748;
      max-width: 600px;
      margin: 0 auto;
      background-color: #F7FAFC;
    }
    .container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      margin: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 800;
    }
    .brand {
      font-size: 14px;
      opacity: 0.9;
      margin-top: 5px;
    }
    .emoji-banner {
      font-size: 32px;
      margin: 15px 0;
      letter-spacing: 5px;
    }
    .content {
      padding: 30px 20px;
    }
    .intro {
      font-size: 18px;
      font-weight: 500;
      color: #4A5568;
      margin-bottom: 20px;
    }
    .course-title {
      font-size: 24px;
      font-weight: 700;
      color: #2D3748;
      margin: 20px 0;
    }
    .summary {
      font-size: 16px;
      color: #4A5568;
      margin-bottom: 25px;
    }
    .highlights {
      background: #F7FAFC;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 25px 0;
      border-radius: 6px;
    }
    .highlights h3 {
      margin-top: 0;
      color: #2D3748;
      font-size: 18px;
    }
    .highlights ul {
      list-style: none;
      padding: 0;
      margin: 10px 0 0 0;
    }
    .highlights li {
      padding: 8px 0;
      font-size: 15px;
      color: #4A5568;
    }
    .fun-fact {
      background: linear-gradient(135deg, #FFF5E6 0%, #FFE8CC 100%);
      border-radius: 8px;
      padding: 15px 20px;
      margin: 25px 0;
      border-left: 4px solid #F6AD55;
    }
    .fun-fact-title {
      font-weight: 700;
      color: #C05621;
      margin-bottom: 8px;
    }
    .cta-container {
      text-align: center;
      margin: 35px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 18px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    .footer {
      background: #2D3748;
      color: #A0AEC0;
      padding: 30px 20px;
      text-align: center;
      font-size: 14px;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    .social-links {
      margin: 15px 0;
    }
    .social-links a {
      margin: 0 10px;
      color: #667eea;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Skilling</h1>
      <div class="brand">by iiskills.cloud</div>
      <div class="emoji-banner">${content.emoji_block}</div>
    </div>
    
    <div class="content">
      <div class="intro">${content.intro_text}</div>
      
      <div class="course-title">${course.title}</div>
      
      <div class="summary">${content.course_summary}</div>
      
      <div class="highlights">
        <h3>✨ What's Inside:</h3>
        <ul>
          ${content.highlights_section.split('\n').map(h => h.trim() ? `<li>${h}</li>` : '').join('')}
        </ul>
      </div>
      
      ${course.duration ? `<p><strong>⏱️ Duration:</strong> ${course.duration}</p>` : ''}
      ${course.target_audience ? `<p><strong>👥 Perfect for:</strong> ${course.target_audience}</p>` : ''}
      
      <div class="fun-fact">
        <div class="fun-fact-title">💡 Did You Know?</div>
        <div>${content.fun_fact}</div>
      </div>
      
      <div class="cta-container">
        <a href="https://iiskills.cloud/courses/${course.slug}" class="cta-button">
          ${content.cta_text}
        </a>
      </div>
    </div>
    
    <div class="footer">
      <p>You're receiving this because you subscribed to Skilling by iiskills.cloud</p>
      <p>
        <a href="https://iiskills.cloud/newsletter/archive">📰 View All Newsletters</a> | 
        <a href="{{unsubscribe_url}}">Unsubscribe</a>
      </p>
      <div class="social-links">
        <a href="#">Twitter</a> • 
        <a href="#">LinkedIn</a> • 
        <a href="#">Instagram</a>
      </div>
      <p style="margin-top: 20px; font-size: 12px;">
        © ${new Date().getFullYear()} iiskills.cloud - Indian Institute of Professional Skills Development
      </p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate web view HTML (for archive)
 */
export function generateWebHTML(content, course, editionNumber) {
  // Similar to email HTML but optimized for web viewing
  return generateEmailHTML(content, course);
}
