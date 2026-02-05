# Learn Companion - Your AI Life Advisor

Learn Companion is a free AI-powered life advisor that helps you make better decisions and take action on your goals.

## Features

- 🤖 AI-powered life advice using OpenAI GPT-4o
- 💬 Clean chat interface similar to ChatGPT/Gemini
- 🎯 Focused on actionable advice
- 🔒 Secure API key handling (backend only)
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Responsive design

## How It Works

The AI companion only responds to questions that begin with "What should I do...". This ensures focused, actionable advice.

Example questions:
- "What should I do to improve my productivity?"
- "What should I do to stay motivated while studying?"
- "What should I do to build better habits?"

## Setup

### 1. Install Dependencies

From the project root:
```bash
cd apps/learn-companion
yarn install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the `apps/learn-companion` directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-openai-api-key-here
```

### 3. Get an OpenAI API Key

1. Go to [OpenAI's platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and paste it into your `.env.local` file

**Important:** Never commit your `.env.local` file or expose your API key publicly!

### 4. Run the Development Server

```bash
yarn dev
```

The app will be available at `http://localhost:3023`

### 5. Production Build

```bash
yarn build
yarn start
```

## Tech Stack

- **Frontend:** React 19, Next.js 16, Tailwind CSS
- **Backend:** Next.js API Routes (Node.js)
- **AI:** OpenAI GPT-4o API
- **Styling:** Tailwind CSS

## Project Structure

```
learn-companion/
├── pages/
│   ├── api/
│   │   └── chat.js          # API endpoint for OpenAI integration
│   ├── _app.js              # Next.js app wrapper
│   ├── _document.js         # HTML document structure
│   └── index.js             # Main chat interface
├── styles/
│   └── globals.css          # Global styles
├── .env.local.example       # Example environment variables
├── package.json             # Dependencies and scripts
├── next.config.js           # Next.js configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## How the AI Gatekeeping Works

The app includes a simple validation check in `/pages/api/chat.js`:

```javascript
const normalizedMessage = message.trim().toLowerCase();
if (!normalizedMessage.startsWith('what should i do')) {
  return res.status(200).json({
    message: "I'm sorry, I only provide advice for questions starting with 'What should I do...'"
  });
}
```

This check is:
- **Case-insensitive:** "what should i do" and "What should I do" both work
- **Server-side:** The validation happens in the backend before calling OpenAI
- **Secure:** Your API key is never exposed to the frontend

## Security Best Practices

✅ **DO:**
- Keep your `.env.local` file private
- Use environment variables for API keys
- Handle API requests on the server-side

❌ **DON'T:**
- Commit `.env.local` to version control
- Expose API keys in frontend code
- Share your OpenAI API key publicly

## Customization

### Change the AI Model

Edit `/pages/api/chat.js` and modify the model:

```javascript
model: "gpt-3.5-turbo",  // or "gpt-4", "gpt-4o-mini", etc.
```

### Modify the System Prompt

Edit the system message in `/pages/api/chat.js`:

```javascript
{
  role: "system",
  content: "Your custom system prompt here"
}
```

### Adjust Response Length

Modify `max_tokens` in `/pages/api/chat.js`:

```javascript
max_tokens: 500,  // Increase or decrease as needed
```

## Troubleshooting

### "API key not configured" error
- Make sure you've created a `.env.local` file
- Verify your OpenAI API key is correct
- Restart the development server after changing `.env.local`

### "Invalid API key" error
- Check that your OpenAI API key is valid
- Ensure there are no extra spaces in the `.env.local` file
- Verify your OpenAI account has API access enabled

### Messages not appearing
- Check the browser console for errors
- Verify the API endpoint is accessible at `/api/chat`
- Check Network tab in browser DevTools

## License

Part of the iiskills-cloud monorepo.
