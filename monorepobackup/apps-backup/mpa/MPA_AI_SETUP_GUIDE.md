# MPA AI Assistant - Setup & Configuration Guide

## Overview

MPA (My Personal Assistant) has been upgraded to a state-of-the-art conversational AI assistant with:
- **Advanced Conversational Intelligence** - Powered by OpenAI GPT-4, Anthropic Claude, or Google Gemini
- **Voice Interaction** - Speech-to-text input and text-to-speech output
- **Real-World Skills** - Reminders, weather, news, messaging, knowledge search
- **Personalization** - Customizable persona, voice, and persistent memory
- **Modern UI/UX** - Responsive design with accessibility features

## Quick Start

### 1. Install Dependencies

```bash
cd apps/mpa
yarn install
```

### 2. Configure Environment Variables

Copy the example environment file and configure your API keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add at minimum ONE LLM provider API key:

```env
# For OpenAI (recommended)
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...your-key-here
OPENAI_MODEL=gpt-4

# OR for Anthropic Claude
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...your-key-here

# OR for Google Gemini
LLM_PROVIDER=gemini
GEMINI_API_KEY=...your-key-here
```

### 3. Add Optional Skills API Keys

For enhanced functionality, add these optional API keys to `.env.local`:

```env
# Weather (free tier: 60 calls/min)
OPENWEATHER_API_KEY=...your-key-here

# News (free tier: 100 requests/day)
NEWS_API_KEY=...your-key-here
```

### 4. Run the Application

```bash
yarn dev
```

The app will be available at http://localhost:3014

## Features

### 🎙️ Voice Interaction

**Speech-to-Text (Voice Input)**
- Click the microphone button to start voice input
- Speak your query naturally
- The app will transcribe and process your request
- Works in Chrome, Edge, and Safari

**Text-to-Speech (Voice Output)**
- Responses are automatically read aloud (can be toggled)
- Voice selection based on language and gender preference
- Adjustable in Settings

**Voice Settings**
- Enable/disable voice features
- Auto-speak responses toggle
- Language-specific voice selection

### 🤖 Conversational AI

**LLM Integration**
- Multi-turn conversations with context
- Natural language understanding
- Function calling for executing tasks
- Graceful fallback to rule-based responses

**Supported LLM Providers**
1. **OpenAI** (GPT-4, GPT-3.5)
   - Best for general conversation
   - Excellent function calling
   - Sign up: https://platform.openai.com

2. **Anthropic** (Claude 3)
   - Great for detailed responses
   - Strong reasoning capabilities
   - Sign up: https://console.anthropic.com

3. **Google Gemini**
   - Good for multi-language support
   - Free tier available
   - Sign up: https://makersuite.google.com

### 🛠️ Digital Skills

**Available Skills:**

1. **Reminders**
   - "Remind me to call John at 3 PM"
   - "Set a reminder for tomorrow at 9 AM"
   - Browser notifications when due

2. **Weather**
   - "What's the weather in Mumbai?"
   - "Weather forecast for tomorrow"
   - Real-time data from OpenWeatherMap

3. **News**
   - "Latest technology news"
   - "Show me sports headlines"
   - Top 5 headlines from News API

4. **Messages**
   - "Send a WhatsApp message to +91... saying Hello"
   - Generates WhatsApp deep links

5. **Knowledge Search**
   - "Who is Albert Einstein?"
   - "What is machine learning?"
   - DuckDuckGo instant answers

### 🎨 Personalization

**Customizable Settings:**
- Assistant name (e.g., Nina, Alex, MPA)
- Gender preference (male, female, neutral)
- Language (15+ languages supported)
- Voice settings
- Auto-speak toggle

**Persistent Memory:**
- Conversation history (last 20 messages)
- User preferences saved locally
- Optional cloud sync via Supabase

## API Integration

### Chat API Endpoint

`POST /api/chat`

```json
{
  "messages": [
    {"role": "user", "content": "What's the weather?"},
    {"role": "assistant", "content": "In which city?"},
    {"role": "user", "content": "Mumbai"}
  ],
  "userId": "user123",
  "settings": {
    "userName": "MPA",
    "gender": "neutral",
    "language": "en"
  }
}
```

Response:
```json
{
  "message": "Let me check the weather in Mumbai for you.",
  "toolCalls": [
    {
      "name": "get_weather",
      "arguments": "{\"location\": \"Mumbai\"}"
    }
  ]
}
```

### Skills API Endpoint

`POST /api/skills`

```json
{
  "skill": "get_weather",
  "parameters": {
    "location": "Mumbai"
  }
}
```

Response:
```json
{
  "success": true,
  "action": "DISPLAY_WEATHER",
  "data": {
    "location": "Mumbai",
    "temperature": 28,
    "description": "partly cloudy",
    "message": "Weather in Mumbai: 28°C, partly cloudy"
  }
}
```

## Adding New Skills

### Step 1: Define the Function

Edit `/pages/api/chat.js` and add to `getAvailableFunctions()`:

```javascript
{
  name: 'your_skill_name',
  description: 'What this skill does',
  parameters: {
    type: 'object',
    properties: {
      param1: {
        type: 'string',
        description: 'Parameter description'
      }
    },
    required: ['param1']
  }
}
```

### Step 2: Implement the Skill

Edit `/pages/api/skills.js` and add a case in the switch statement:

```javascript
case 'your_skill_name':
  result = await yourSkillHandler(parameters);
  break;
```

### Step 3: Create the Handler

```javascript
async function yourSkillHandler(params) {
  const { param1 } = params;
  
  // Your implementation here
  
  return {
    success: true,
    action: 'YOUR_ACTION_TYPE',
    data: {
      message: 'Result message',
      // other data
    }
  };
}
```

### Step 4: Handle the Action

Edit `/components/MPAChat.js` in `handleSkillAction()`:

```javascript
case 'YOUR_ACTION_TYPE':
  setMessages(prev => [...prev, { 
    text: data.message,
    isAction: true
  }]);
  break;
```

## Customizing the AI Persona

Edit the system prompt in `/pages/api/chat.js`:

```javascript
function buildSystemPrompt(assistantName, gender, language) {
  return `You are ${assistantName}, a [your custom persona description].
  
Your personality:
- [trait 1]
- [trait 2]
- [trait 3]

Communication style:
- [style guideline 1]
- [style guideline 2]

Your capabilities:
- [capability 1]
- [capability 2]
`;
}
```

## Voice Configuration

### Supported Languages

The app supports 15+ languages with native voice synthesis:
- English (US, UK)
- Hindi (हिंदी)
- Tamil (தமிழ்)
- Telugu (తెలుగు)
- Kannada (ಕನ್ನಡ)
- Malayalam (മലയാളം)
- Marathi (मराठी)
- Bengali (বাংলা)
- Gujarati (ગુજરાતી)
- Punjabi (ਪੰਜਾਬੀ)
- Spanish, French, German, Japanese, Chinese

### Voice Selection

The app automatically selects the best available voice based on:
1. Selected language
2. Gender preference
3. Browser-available voices

You can customize voice selection in `/lib/voiceManager.js`.

## Security & Privacy

### Data Storage

**Local Storage (Default):**
- User registration
- Conversation history (last 20 messages)
- Settings and preferences
- No data leaves the device

**Cloud Storage (Optional - via Supabase):**
- Enable in settings
- End-to-end encrypted
- User consent required
- Can be disabled anytime

### API Keys

**Never commit API keys to version control!**

- Store all keys in `.env.local`
- File is in `.gitignore`
- Rotate keys periodically
- Use environment-specific keys

### Privacy Features

- Recording indicator when listening
- Speaking indicator when voice is active
- Clear data controls
- No third-party tracking
- Consent-based features

## Accessibility

### Features

- ✅ Keyboard navigation
- ✅ Screen reader compatible
- ✅ Reduced motion support
- ✅ High contrast mode
- ✅ Text alternatives for voice
- ✅ ARIA labels

### Usage

- Tab through interface elements
- Enter to send messages
- Escape to close modals
- Voice optional (text always available)

## Testing

### Manual Testing Checklist

- [ ] User registration works
- [ ] Text chat responds correctly
- [ ] Voice input captures speech
- [ ] Voice output speaks responses
- [ ] Reminders trigger notifications
- [ ] Weather skill returns data
- [ ] News skill displays headlines
- [ ] Message skill creates WhatsApp links
- [ ] Settings persist after reload
- [ ] Mobile responsive design works

### Testing Without API Keys

The app gracefully degrades:
- LLM: Falls back to rule-based responses
- Weather: Returns unavailable message
- News: Returns unavailable message
- Voice: Works offline (browser built-in)

## Troubleshooting

### Voice Recognition Not Working

**Problem:** Microphone button doesn't work

**Solutions:**
1. Use Chrome, Edge, or Safari (Firefox not supported)
2. Allow microphone permissions
3. Use HTTPS (required for mic access)
4. Check browser compatibility

### LLM Not Responding

**Problem:** Getting fallback responses

**Solutions:**
1. Check API key is set correctly
2. Verify LLM_PROVIDER matches your key
3. Check API quota/billing
4. View browser console for errors

### Skills Not Working

**Problem:** Weather/News returns "unavailable"

**Solutions:**
1. Add optional API keys to `.env.local`
2. Check API quotas
3. Verify API endpoint is reachable
4. Skills work without keys (graceful degradation)

## Deployment

### Production Checklist

- [ ] All API keys set in production environment
- [ ] HTTPS enabled (required for voice)
- [ ] CORS configured for API endpoints
- [ ] Rate limiting enabled
- [ ] Error tracking configured
- [ ] Analytics (optional)
- [ ] Performance monitoring

### Environment Variables

Set these in your hosting platform (Vercel, Netlify, etc.):
- `OPENAI_API_KEY` (or other LLM provider)
- `OPENWEATHER_API_KEY` (optional)
- `NEWS_API_KEY` (optional)
- `NEXT_PUBLIC_SUPABASE_URL` (if using)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (if using)

## Performance Optimization

### Recommendations

1. **Rate Limiting**
   - Implement per-user rate limits
   - Cache common responses
   - Use cheaper models for simple queries

2. **Context Management**
   - Keep last 20 messages max
   - Summarize older conversations
   - Clear context when needed

3. **Voice Optimization**
   - Use compressed audio formats
   - Implement voice activity detection
   - Cache common phrases

## Support & Resources

### Documentation
- Web Speech API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
- OpenAI Function Calling: https://platform.openai.com/docs/guides/function-calling

### Example Projects
- Leon AI: https://github.com/leon-ai/leon
- Jarvis: https://github.com/sukeesh/Jarvis

### Getting Help
- Check browser console for errors
- Review API documentation
- Test with minimal configuration
- Use fallback mode for debugging

## License

Part of the iiskills-cloud monorepo. See main LICENSE for details.
