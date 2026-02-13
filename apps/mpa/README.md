# MPA - My Personal Assistant

A state-of-the-art conversational AI assistant with voice, skills, and memory - now fully upgraded with advanced AI capabilities!

![MPA AI Assistant](https://github.com/user-attachments/assets/40ff2b0a-c61e-4777-8015-1b2c5b1e7d9c)

## 🌟 Overview

MPA (My Personal Assistant) is a sophisticated AI-powered personal assistant that combines the power of modern Large Language Models (GPT-4, Claude, Gemini) with voice interaction and real-world task execution. Think Google Assistant, Siri, or Alexa, but accessible from your browser on both desktop and mobile.

## ✨ Key Features

### 🤖 Advanced Conversational Intelligence
- **Powered by Leading LLMs**: Integration with OpenAI GPT-4, Anthropic Claude 3, or Google Gemini
- **Natural Conversations**: Multi-turn conversations with context awareness
- **Smart Function Calling**: Automatically detects and executes tasks from natural language
- **Graceful Fallbacks**: Works with rule-based responses when LLM is unavailable

### 🎙️ Voice Interaction
- **Speech-to-Text**: Click the microphone button to speak your queries
- **Text-to-Speech**: Automatic voice responses in 15+ languages
- **Voice Customization**: Male, female, or neutral voice options
- **Multi-Language Support**: English, Hindi, Tamil, Telugu, and 11+ more languages

![Conversation Example](https://github.com/user-attachments/assets/5f45862d-2480-44e2-ac7f-b837509106fa)

### 🛠️ Real-World Digital Skills
- **Reminders & Notifications**: "Remind me to call John at 3 PM tomorrow"
- **Weather Information**: "What's the weather in Mumbai?"
- **Latest News**: "Show me technology news headlines"
- **WhatsApp Messaging**: "Send a WhatsApp message to +91... saying Hello"
- **Knowledge Search**: "Who is Albert Einstein?"
- **And More**: Calendar integration, translations, music, videos

### 🎨 Personalization & Memory
- **Custom Assistant Name**: Nina, Alex, Jarvis, or keep it MPA
- **Gender Preference**: Choose male, female, or neutral voice
- **Language Options**: 15+ languages including all major Indian languages
- **Conversation History**: Last 20 messages maintained for context
- **Persistent Settings**: Your preferences saved locally

![Settings Panel](https://github.com/user-attachments/assets/1fc53376-44b7-484b-9330-19981db1ac00)

### 🎯 Modern UI/UX
- **Microphone Button**: One-click voice input
- **Visual Indicators**: Listening, speaking, and thinking animations
- **Quick Actions**: Instant access to jokes, quotes, weather, news
- **Responsive Design**: Works perfectly on mobile and desktop
- **Accessibility**: Reduced motion support, keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Yarn package manager

### Installation

```bash
# Navigate to MPA app
cd apps/mpa

# Install dependencies
yarn install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local and add your API keys (see Configuration below)
```

### Configuration

At minimum, add ONE LLM provider API key to `.env.local`:

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

Optional - Add skills API keys for enhanced features:

```env
# Weather (free tier available)
OPENWEATHER_API_KEY=...your-key-here

# News (free tier available)
NEWS_API_KEY=...your-key-here
```

### Running

```bash
# Development mode
yarn dev

# Production build
yarn build
yarn start
```

Visit http://localhost:3014

## 📖 Usage

### First Time Setup
1. Open the app
2. Register your name in the welcome modal
3. Start chatting with MPA!

### Voice Commands
- Click the 🎤 microphone button
- Speak your request
- MPA will transcribe and respond

### Text Interaction
- Type your message in the input field
- Press Enter or click Send
- Use quick action buttons for common tasks

### Settings
- Click the ⚙️ settings button
- Customize assistant name, gender, and language
- Enable/disable voice features
- Toggle auto-speak responses

## 🎯 Example Interactions

**Reminders:**
- "Remind me to call the dentist tomorrow at 10 AM"
- "Set a reminder for my meeting at 3 PM"

**Information:**
- "What's the weather in New York?"
- "Show me the latest technology news"
- "Who invented the telephone?"

**Entertainment:**
- "Tell me a joke"
- "Give me a motivational quote"

**Communication:**
- "Send a WhatsApp message to +1234567890 saying 'Running late'"

## 🔧 Technical Stack

- **Framework**: Next.js 16+ with Turbopack
- **React**: 19+ with Hooks
- **Styling**: Tailwind CSS
- **APIs**: 
  - OpenAI / Anthropic / Google Gemini for LLM
  - Web Speech API for voice
  - OpenWeatherMap for weather
  - NewsAPI for news
  - DuckDuckGo for knowledge search
- **Storage**: Browser localStorage (with optional Supabase cloud sync)
- **State Management**: React Hooks

## 📚 Documentation

- **Setup Guide**: [MPA_AI_SETUP_GUIDE.md](./MPA_AI_SETUP_GUIDE.md) - Complete configuration guide
- **API Documentation**: See setup guide for API integration details
- **Adding Skills**: Instructions in setup guide for creating custom skills

## 🔒 Security & Privacy

- **Local-First**: All data stored locally by default
- **API Keys**: Never committed to version control
- **User Consent**: Recording indicators when voice is active
- **Optional Cloud Sync**: Supabase integration available but not required
- **No Tracking**: No third-party analytics or tracking

## 🌐 Browser Compatibility

- **Voice Recognition**: Chrome, Edge, Safari (not Firefox)
- **Voice Synthesis**: All modern browsers
- **Required**: ES6 support, localStorage
- **Recommended**: HTTPS for microphone access in production

## 🎨 Customization

### Change Assistant Persona
Edit `/pages/api/chat.js` to customize the system prompt and personality.

### Add New Skills
See [MPA_AI_SETUP_GUIDE.md](./MPA_AI_SETUP_GUIDE.md) for detailed instructions on adding custom skills.

### Modify Voice Settings
Edit `/lib/voiceManager.js` to customize voice selection and synthesis.

## 🐛 Troubleshooting

### Voice Recognition Not Working
- Ensure you're using Chrome, Edge, or Safari
- Allow microphone permissions
- Use HTTPS in production

### LLM Not Responding
- Check API key in `.env.local`
- Verify `LLM_PROVIDER` matches your key
- Check API quota/billing
- App falls back to rule-based responses if LLM unavailable

### Skills Not Working
- Optional API keys needed for weather/news
- App gracefully degrades without skills APIs

## 🚀 Deployment

1. Set environment variables in hosting platform (Vercel, Netlify, etc.)
2. Ensure HTTPS is enabled (required for microphone access)
3. Configure CORS for API endpoints
4. Deploy!

## 📈 Future Enhancements

Potential additions (not yet implemented):
- Calendar integration (Google/Microsoft/Apple)
- Email drafting and sending
- Task list management
- Multi-user profiles
- Mobile app version
- Biometric authentication

## 📄 License

Part of the iiskills-cloud monorepo. See the main repository LICENSE for details.

## 🤝 Support

For issues or questions:
- Check browser console for errors
- Review [MPA_AI_SETUP_GUIDE.md](./MPA_AI_SETUP_GUIDE.md)
- Test with minimal configuration
- Contact the development team

## 🎉 Credits

Developed as part of the iiskills-cloud ecosystem by AI Cloud Enterprises.

---

**Ready to get started?** Follow the Quick Start guide above and experience the future of personal AI assistants!

