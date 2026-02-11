# MPA - My Personal Assistant

A highly efficient, witty, and supportive AI personal assistant with a personality of a high-end digital butler, now integrated into the iiskills-cloud monorepo.

![MPA App Screenshot](https://github.com/user-attachments/assets/8de34512-f6ec-484c-80a0-9d6c96882994)

## Overview

MPA (My Personal Assistant) is a standalone app within the iiskills-cloud monorepo that provides personal assistant features including reminders, translations, WhatsApp messaging, and more.

## Features

### Core Capabilities
- **User Recognition**: MPA recognizes and responds only to the registered user, ensuring privacy and exclusivity
- **Gender Choice**: Select Male, Female, or Neutral assistant voice preference
- **Name Customization**: Assign any name to your assistant (e.g., Nina, Alex, or keep MPA)
- **Multi-Language Support**: All Indian languages plus foreign languages
- **Translation**: Translate text between languages with oral pronunciation support
- **Reminder Extraction**: Set reminders with natural language (e.g., "Remind me to call the dentist tomorrow at 10 AM")
- **Daily Content**: Get clever jokes or deeply philosophical quotes
- **WhatsApp Integration**: Draft messages and generate WhatsApp deep links
- **Phone Calls**: Make calls with speaker mode (e.g., "Call mom")
- **Entertainment**: Play songs and videos from public domain sources
- **Proactive Suggestions**: Automatic motivational quotes for gym/fitness reminders
- **Browser Notifications**: Get notified when reminders are due
- **Obscenity Filter**: Automatically refuses inappropriate content requests
- **Concise & Witty**: Responses limited to 3 sentences with butler-like personality

## Setup

### Prerequisites
- Node.js 18+ 
- Yarn (package manager used by the monorepo)

### Installation

From the monorepo root:

```bash
# Install dependencies
yarn install

# Navigate to the mpa app
cd apps/mpa
```

### Environment Variables

Create a `.env.local` file in `apps/mpa/` if needed for any app-specific configuration.

## Development

### Running Locally

From the monorepo root:

```bash
# Run all apps (including mpa)
yarn dev

# Or run just the mpa app
cd apps/mpa
yarn dev
```

The app will be available at `http://localhost:3014`

### Building

```bash
# From the mpa directory
yarn build

# Start production server
yarn start
```

## Usage

### First Time Setup

When you first open the app, you'll be prompted to register your name:

1. Enter your name in the setup dialog
2. Click "Register"
3. MPA will now respond only to you

Your registration is saved in browser localStorage, so you won't need to register again on the same device.

### Settings

Click the ⚙️ button to:
- Change assistant name (e.g., "Nina", "Alex")
- Select gender preference (Male, Female, Neutral)
- Choose preferred language

### Example Interactions

**Reminders:**
- "Remind me to call the dentist tomorrow at 10 AM"
- "Remind me to workout today at 6 PM"
- "Remind me to submit the report on Monday at 2 PM"

**Getting Content:**
- "Tell me a joke"
- "Give me a quote"

**Translation:**
- "Translate 'Hello' to Tamil"
- "Translate 'Thank you' to Hindi orally"

**Phone Calls:**
- "Call mom"
- "Call John"

**Entertainment:**
- "Play song 'Amazing Grace'"
- "Play video 'Nature Documentary'"

**WhatsApp Messages:**
- "Message John at +1234567890 saying 'Hey, are we still on for lunch?'"
- "Text Sarah at +44123456789 saying 'Meeting at 3 PM'"

## Integration with Monorepo

### Shared Infrastructure

MPA integrates with the following shared monorepo infrastructure:

1. **Authentication** - Uses Supabase authentication system (via shared components)
2. **Supabase Database** - Shares the same Supabase instance for data storage
3. **Registration/Sign-in** - Uses shared registration and sign-in components
4. **Logs** - Uses shared logging infrastructure
5. **Legends** - Uses shared legend/documentation components

### What MPA Does NOT Use

MPA is a standalone app and does **NOT** inherit:
- Learn=* universal features (courses, lessons, curriculum)
- Cross-app components not specifically listed above
- Universal landing page templates
- Course management features

## Technical Details

### File Structure

```
apps/mpa/
├── components/
│   └── MPAChat.js          # Main chat component
├── lib/
│   └── mpa.js              # Core MPA logic class
├── pages/
│   ├── _app.js             # App wrapper
│   ├── index.js            # Main page
│   └── api/                # API routes (if needed)
├── public/                 # Static assets
├── styles/
│   └── globals.css         # Global styles
├── .env.local.example      # Environment variables template
├── .eslintrc.json          # ESLint configuration
├── .gitignore              # Git ignore rules
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── README.md               # This file
└── tailwind.config.js      # Tailwind CSS configuration
```

### Technology Stack

- **Framework**: Next.js 16+
- **React**: 19+
- **Styling**: Tailwind CSS
- **Authentication**: Supabase (shared)
- **State Management**: React Hooks
- **Storage**: Browser localStorage

### Action Codes

The app uses hidden bracketed codes that are parsed but not shown to users:

- `[SET_REMINDER: ISO_DATE_TIME]` - Triggers browser notification
- `[WHATSAPP_LINK: phone|message]` - Generates WhatsApp deep link
- `[TRANSLATE: language|text|oral?]` - Triggers translation
- `[CALL: phone|contact]` - Initiates phone call with speaker mode
- `[PLAY_VIDEO: video_name]` - Plays video from public domain
- `[PLAY_SONG: song_name]` - Plays song from public domain

## Deployment

### Local Deployment

The app can be deployed locally as part of the monorepo:

```bash
# Build the app
yarn build

# Start with PM2 (if configured)
pm2 start ecosystem.config.js --only mpa
```

### Production Deployment

Follow the monorepo deployment guide. The mpa app will be deployed alongside other apps in the ecosystem.

## Security Note

- User registration uses browser localStorage - suitable for personal use
- No backend authentication required for basic features
- Supabase integration provides secure data storage when needed
- Obscenity filter prevents inappropriate content requests

## Browser Compatibility

- Modern browsers with ES6 support
- Notification API support for reminders
- Local storage for persistence

## Customization

You can customize MPA by editing:

- **Settings UI**: Click the ⚙️ button to change name, gender, and language
- **Jokes**: Modify the `jokes` array in `lib/mpa.js`
- **Quotes**: Modify the `quotes` array in `lib/mpa.js`
- **Motivational Keywords**: Modify the `motivationalKeywords` array in `lib/mpa.js`
- **Obscenity Filter**: Modify the `obsceneKeywords` array in `lib/mpa.js`

## User Recognition & Privacy

MPA includes a user recognition feature that ensures your privacy and exclusivity:

- **Registration**: On first launch, you register your name with MPA
- **Authentication**: MPA stores your username in browser localStorage
- **Privacy**: If anyone else tries to use MPA, they'll receive the message: "Sorry, I am only available for [Your Name]."
- **Reset**: To reset the user registration, clear browser localStorage or use developer console

## Future Enhancements

- Voice input/output with speaker identification
- Biometric authentication (fingerprint/face unlock)
- Multi-user profiles support
- Calendar integration
- Email drafting
- Task list management
- Mobile app version
- AI model integration (OpenAI, Claude, etc.)

## License

Part of the iiskills-cloud monorepo. See the main repository LICENSE for details.

## Support

For issues or questions, please refer to the main iiskills-cloud repository documentation or contact the development team.
