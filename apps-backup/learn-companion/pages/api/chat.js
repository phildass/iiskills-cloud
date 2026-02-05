import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if the message starts with "What should I do" (case-insensitive)
    const normalizedMessage = message.trim().toLowerCase();
    if (!normalizedMessage.startsWith('what should i do')) {
      return res.status(200).json({
        message: "I'm sorry, I only provide advice for questions starting with 'What should I do...'"
      });
    }

    // Validate OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return res.status(500).json({ 
        error: 'API key not configured. Please set OPENAI_API_KEY in your environment.' 
      });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful life advisor. Provide concise, actionable, and empathetic advice."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content;

    return res.status(200).json({ message: aiResponse });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    // Handle specific OpenAI errors
    if (error.status === 401) {
      return res.status(500).json({ 
        error: 'Invalid API key. Please check your OPENAI_API_KEY.' 
      });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.' 
      });
    }

    return res.status(500).json({ 
      error: 'An error occurred while processing your request.' 
    });
  }
}
