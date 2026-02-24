/**
 * Conversation Manager - Handles chat history and LLM integration
 */

export class ConversationManager {
  constructor() {
    this.messages = [];
    this.maxContextMessages = 20; // Keep last 20 messages for context
    this.userId = null;
    this.settings = {
      userName: 'MPA',
      gender: 'neutral',
      language: 'en',
      voiceEnabled: true
    };
  }

  // Initialize with user ID and settings
  init(userId, settings = {}) {
    this.userId = userId;
    this.settings = { ...this.settings, ...settings };
    this.loadHistory();
  }

  // Load conversation history from localStorage
  loadHistory() {
    if (typeof window === 'undefined') return;
    
    try {
      const stored = localStorage.getItem(`mpa_chat_history_${this.userId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.messages = parsed.slice(-this.maxContextMessages);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }

  // Save conversation history to localStorage
  saveHistory() {
    if (typeof window === 'undefined') return;
    
    try {
      const toSave = this.messages.slice(-this.maxContextMessages);
      localStorage.setItem(`mpa_chat_history_${this.userId}`, JSON.stringify(toSave));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }

  // Add a message to conversation
  addMessage(role, content) {
    const message = {
      role, // 'user' or 'assistant'
      content,
      timestamp: new Date().toISOString()
    };
    
    this.messages.push(message);
    
    // Keep only recent messages for context
    if (this.messages.length > this.maxContextMessages) {
      this.messages = this.messages.slice(-this.maxContextMessages);
    }
    
    this.saveHistory();
    return message;
  }

  // Get messages for API (without timestamps)
  getMessagesForAPI() {
    return this.messages.map(m => ({
      role: m.role,
      content: m.content
    }));
  }

  // Send message to LLM and get response
  async sendMessage(userMessage) {
    // Add user message
    this.addMessage('user', userMessage);

    try {
      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: this.getMessagesForAPI(),
          userId: this.userId,
          settings: this.settings
        })
      });

      if (!response.ok) {
        throw new Error('Chat API request failed');
      }

      const data = await response.json();
      
      // Add assistant response
      if (data.message) {
        this.addMessage('assistant', data.message);
      }

      // Process any tool calls
      let skillResults = [];
      if (data.toolCalls && data.toolCalls.length > 0) {
        skillResults = await this.executeSkills(data.toolCalls);
      }

      return {
        message: data.message || 'I apologize, I didn\'t understand that.',
        skillResults
      };

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Fallback to basic response
      const fallbackResponse = this.getFallbackResponse(userMessage);
      this.addMessage('assistant', fallbackResponse);
      
      return {
        message: fallbackResponse,
        skillResults: []
      };
    }
  }

  // Execute skills/tools from LLM function calls
  async executeSkills(toolCalls) {
    const results = [];

    for (const toolCall of toolCalls) {
      try {
        const skill = toolCall.name;
        const parameters = typeof toolCall.arguments === 'string' 
          ? JSON.parse(toolCall.arguments) 
          : toolCall.arguments;

        const response = await fetch('/api/skills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            skill,
            parameters
          })
        });

        if (!response.ok) {
          throw new Error('Skills API request failed');
        }

        const data = await response.json();
        results.push(data);

      } catch (error) {
        console.error('Error executing skill:', error);
        results.push({
          success: false,
          message: 'Failed to execute that action.'
        });
      }
    }

    return results;
  }

  // Fallback response when API fails
  getFallbackResponse(userMessage) {
    const lower = userMessage.toLowerCase();
    
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
        "\"The obstacle is the way.\" – Marcus Aurelius. Master resistance, become unstoppable.",
        "\"Discipline equals freedom.\" – Jocko Willink. Structure creates possibility.",
        "\"Excellence is not an act, but a habit.\" – Aristotle"
      ];
      return quotes[Math.floor(Math.random() * quotes.length)];
    }
    
    if (lower.includes('weather')) {
      return "I'd love to check the weather for you. Could you specify the location?";
    }
    
    if (lower.includes('reminder') || lower.includes('remind')) {
      return "I can set a reminder for you. What would you like to be reminded about and when?";
    }
    
    const responses = [
      "I'm here to assist. How may I help you?",
      "At your service. What can I do for you today?",
      "How may I be of assistance?",
      "I'm listening. What do you need?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Clear conversation history
  clearHistory() {
    this.messages = [];
    this.saveHistory();
  }

  // Update settings
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    
    // Save settings
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mpaUserName', this.settings.userName);
        localStorage.setItem('mpaGender', this.settings.gender);
        localStorage.setItem('mpaLanguage', this.settings.language);
        localStorage.setItem('mpaVoiceEnabled', this.settings.voiceEnabled ? 'true' : 'false');
      } catch (error) {
        console.error('Error saving settings:', error);
      }
    }
  }

  // Get conversation summary for display
  getSummary() {
    return {
      messageCount: this.messages.length,
      firstMessage: this.messages[0]?.timestamp,
      lastMessage: this.messages[this.messages.length - 1]?.timestamp
    };
  }
}

export default ConversationManager;
