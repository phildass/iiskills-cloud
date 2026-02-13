/**
 * MPA Chat API - LLM Integration Endpoint
 * Handles conversation with OpenAI GPT-4 (or compatible LLM)
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, userId, settings = {} } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.GEMINI_API_KEY;
    const llmProvider = process.env.LLM_PROVIDER || 'openai'; // openai, anthropic, gemini

    if (!apiKey) {
      console.error('No LLM API key configured');
      // Fallback to rule-based response for demo purposes
      return res.status(200).json({
        message: generateFallbackResponse(messages[messages.length - 1]?.content),
        toolCalls: []
      });
    }

    // Build system prompt with persona
    const assistantName = settings.userName || 'MPA';
    const gender = settings.gender || 'neutral';
    const language = settings.language || 'en';

    const systemPrompt = buildSystemPrompt(assistantName, gender, language);

    // Call LLM based on provider
    let response;
    if (llmProvider === 'openai') {
      response = await callOpenAI(apiKey, systemPrompt, messages);
    } else if (llmProvider === 'anthropic') {
      response = await callAnthropic(apiKey, systemPrompt, messages);
    } else if (llmProvider === 'gemini') {
      response = await callGemini(apiKey, systemPrompt, messages);
    } else {
      return res.status(500).json({ error: 'Invalid LLM provider' });
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ 
      error: 'Failed to process chat request',
      message: 'I apologize, but I encountered an error. Please try again.'
    });
  }
}

function buildSystemPrompt(assistantName, gender, language) {
  const genderTone = gender === 'male' ? 'masculine' : gender === 'female' ? 'feminine' : 'neutral';
  
  return `You are ${assistantName}, a highly efficient and sophisticated personal digital butler. Your personality is:
- Concise and witty, responding in 2-3 sentences maximum
- Professional yet personable, like a high-end butler or executive assistant
- Proactive and helpful, anticipating needs
- Respectful and polite with a ${genderTone} tone
- Knowledgeable but not condescending

Communication guidelines:
- Keep responses brief and actionable
- Use ${language} language code for responses when applicable
- Offer motivational quotes for fitness/wellness requests
- Decline obscene or inappropriate requests politely

You have access to tools/skills for:
- Setting reminders and managing tasks
- Checking weather and news
- Calendar management
- Sending messages
- General knowledge queries
- Translations
- Entertainment (music, videos)

Always maintain the persona of a sophisticated digital butler serving the user.`;
}

async function callOpenAI(apiKey, systemPrompt, messages) {
  const functions = getAvailableFunctions();
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(m => ({ role: m.role, content: m.content }))
      ],
      functions: functions,
      function_call: 'auto',
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  const choice = data.choices[0];

  return {
    message: choice.message.content,
    toolCalls: choice.message.function_call ? [choice.message.function_call] : []
  };
}

async function callAnthropic(apiKey, systemPrompt, messages) {
  // Placeholder for Claude/Anthropic integration
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
      max_tokens: 500,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }))
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    message: data.content[0].text,
    toolCalls: []
  };
}

async function callGemini(apiKey, systemPrompt, messages) {
  // Placeholder for Google Gemini integration
  const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        ...messages.map(m => ({ 
          role: m.role === 'user' ? 'user' : 'model', 
          parts: [{ text: m.content }] 
        }))
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    message: data.candidates[0].content.parts[0].text,
    toolCalls: []
  };
}

function generateFallbackResponse(userMessage) {
  const lower = (userMessage || '').toLowerCase();
  
  if (lower.includes('joke')) {
    const jokes = [
      "Why did the AI go to therapy? It had too many deep learning issues.",
      "I'd tell you a UDP joke, but you might not get it.",
      "Why do programmers prefer dark mode? Because light attracts bugs."
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }
  
  if (lower.includes('quote')) {
    const quotes = [
      "\"The obstacle is the way.\" – Marcus Aurelius",
      "\"Discipline equals freedom.\" – Jocko Willink",
      "\"Excellence is not an act, but a habit.\" – Aristotle"
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }
  
  const responses = [
    "I'm here to assist. How may I help you?",
    "At your service. What can I do for you?",
    "How may I be of assistance today?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

function getAvailableFunctions() {
  return [
    {
      name: 'set_reminder',
      description: 'Set a reminder for a specific date and time',
      parameters: {
        type: 'object',
        properties: {
          task: {
            type: 'string',
            description: 'The task or message to be reminded about'
          },
          datetime: {
            type: 'string',
            description: 'ISO 8601 datetime string for when the reminder should trigger'
          }
        },
        required: ['task', 'datetime']
      }
    },
    {
      name: 'get_weather',
      description: 'Get current weather information for a location',
      parameters: {
        type: 'object',
        properties: {
          location: {
            type: 'string',
            description: 'City name or location'
          }
        },
        required: ['location']
      }
    },
    {
      name: 'get_news',
      description: 'Get latest news headlines',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'News category (e.g., technology, sports, business)',
            enum: ['technology', 'sports', 'business', 'health', 'general']
          }
        },
        required: []
      }
    },
    {
      name: 'send_message',
      description: 'Send a WhatsApp or text message',
      parameters: {
        type: 'object',
        properties: {
          recipient: {
            type: 'string',
            description: 'Recipient name or phone number'
          },
          message: {
            type: 'string',
            description: 'Message content'
          },
          phone: {
            type: 'string',
            description: 'Phone number with country code'
          }
        },
        required: ['recipient', 'message']
      }
    },
    {
      name: 'search_knowledge',
      description: 'Search for information or answer questions',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query or question'
          }
        },
        required: ['query']
      }
    }
  ];
}
